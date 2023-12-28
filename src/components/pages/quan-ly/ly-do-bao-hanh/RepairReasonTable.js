"use client";
import Loading from "@/app/loading";
import { roles } from "@/services/helper/helper";
import { showDialog } from "@/store/features/dialogSlice";
import { hideLoading } from "@/store/features/loadingAsyncSlice";
import { showNotification } from "@/store/features/notificationSlice";
import styles from "@/styles/main.module.scss";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFilters, usePagination, useSortBy, useTable } from "react-table";
import DeleteIcon from "@/styles/icons/trash-2.svg";
import LockIcon from "@/styles/icons/lock.svg";
import DeleteConfirm from "@/components/common/DeleteConfirm";
import { useDeleteRepairReasonMutation, useGetAllRepairReasonQuery } from "@/services/api/repairReason/repairReasonApi";
import EditIcon from "@/styles/icons/edit.svg";

export default function RepairReasonTable() {
  const { data, isLoading, isFetching, isError } = useGetAllRepairReasonQuery();
  const [deleteRepairReason, { loading }] = useDeleteRepairReasonMutation();
  const [deletedId, setDeletedId] = useState(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const tableData = useMemo(() => {
    if (isLoading === false && isFetching === false) {
      let newData = data.data.map((item) => {
        return { id: item.id, name: item.reason };
      });
      if (!newData) return [];
      return newData;
    }
    return [];
  }, [isLoading, isFetching]);

  const columns = useMemo(() => {
    return [
      { Header: "Mã", accessor: "id", Filter: ColumnFilter },
      { Header: "Lý do", accessor: "name", Filter: ColumnFilter },
    ];
  }, [isLoading, isFetching]);

  const handleUpdateRepairReason = (data) => {
    dispatch(
      showDialog({
        title: `Cập nhật lý do bảo hành ${data.values.name} (mã ${data.values.id})`,
        content: "update-repair-reason",
        info: { id: data.values.id, reason: data.values.name },
      })
    );
  };
  const handleDeleteRepairReason = async (id) => {
    try {
      await deleteRepairReason({ Id: id }).unwrap();

      dispatch(hideLoading());
      dispatch(showNotification({ message: "Xóa lý do bảo hành thành công", type: "success" }));
      setOpenDeleteConfirm(false);
    } catch (err) {
      dispatch(showNotification({ message: err.data.message, type: "error" }));
      dispatch(hideLoading());
    }
  };

  const tableHooks = (hooks) => {
    hooks.visibleColumns.push((columns) => {
      return [
        ...columns,
        {
          id: "update",
          Header: "Thao tác",
          Cell: ({ row }) => {
            return (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                {auth.role === roles.admin ? (
                  <>
                    <button
                      onClick={() => {
                        handleUpdateRepairReason(row);
                      }}
                      className={styles["no-effect-button--hover-on"]}
                      style={{ fontWeight: "bold" }}
                    >
                      <Image priority src={EditIcon} width={20} height={20} alt="edit" />
                    </button>
                    &nbsp;|&nbsp;
                    <button
                      onClick={() => {
                        setDeletedId(row.values.id);
                        setOpenDeleteConfirm(true);
                      }}
                      className={styles["no-effect-button--hover-on"]}
                      style={{ fontWeight: "bold" }}
                    >
                      <Image priority src={DeleteIcon} width={20} height={20} alt="delete" />
                    </button>
                  </>
                ) : null}
              </div>
            );
          },
        },
      ];
    });
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    state,
    prepareRow,
  } = useTable(
    {
      columns,
      data: tableData,
    },
    useFilters,
    tableHooks,
    useSortBy,
    usePagination
  );

  if (isError) return <div>Có lỗi xảy ra</div>;
  if (isLoading || isFetching) return <Loading />;

  return (
    <>
      <div className={styles["dashboard__repair-reason__table-container"]}>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => {
              const { key, ...otherProps } = headerGroup.getHeaderGroupProps();
              return (
                <tr key={key} {...otherProps}>
                  {headerGroup.headers.map((column) => {
                    const { key, ...otherProps } = column.getHeaderProps();
                    return (
                      <th key={key} {...otherProps}>
                        {column.render("Header")}
                        <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : "🔼") : ""}</span>
                        <div>{column.canFilter ? column.render("Filter") : null}</div>
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          <tbody>
            {page.map((row) => {
              prepareRow(row);
              const { key, ...otherProps } = row.getRowProps();
              return (
                <tr key={key} {...otherProps}>
                  {row.cells.map((cell) => {
                    const { key, ...otherProps } = cell.getCellProps();
                    return (
                      <td key={key} {...otherProps}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className={styles["dashboard__orders__content__table-container__actions"]}>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            Về đầu trang
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Trước
          </button>
          <span>
            Trang{" "}
            <strong>
              {state.pageIndex + 1} trên {pageOptions.length}
            </strong>
          </span>{" "}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            Tiếp
          </button>
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            Đến trang cuối
          </button>
          <span>|</span>
          <select value={state.pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
            {[10, 20, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Hiển thị {pageSize} hàng
              </option>
            ))}
          </select>
        </div>
      </div>
      {openDeleteConfirm && (
        <DeleteConfirm
          id={deletedId}
          title={`Xác nhận xóa`}
          content={`Xóa lý do bảo hành có mã '${deletedId}'?`}
          handleDelete={handleDeleteRepairReason}
          handleOpen={setOpenDeleteConfirm}
        />
      )}
    </>
  );
}

const ColumnFilter = ({ column }) => {
  const { filterValue, setFilter } = column;
  return (
    <span>
      <input
        value={filterValue || ""}
        onChange={(e) => {
          e.stopPropagation();
          setFilter(e.target.value);
        }}
      />
    </span>
  );
};
