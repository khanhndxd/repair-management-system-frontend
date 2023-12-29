"use client";
// import "regenerator-runtime/runtime";
import styles from "@/styles/main.module.scss";
import { useTable, useGlobalFilter, useSortBy, useFilters, usePagination } from "react-table";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Loading from "@/app/loading";
import { useDeleteRepairOrderMutation, useGetAllRepairOrdersQuery } from "@/services/api/repairOrder/repairOrderApi";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "@/store/features/loadingAsyncSlice";
import { showNotification } from "@/store/features/notificationSlice";
import { getStatusLabelByValue, roles, statuses } from "@/services/helper/helper";
import TrashIcon from "@/styles/icons/trash-2.svg";
import SearchIcon from "@/styles/icons/search.svg";
import Image from "next/image";
import DeleteConfirm from "@/components/common/DeleteConfirm";

export default function RepairOrderTable() {
  const { data, isLoading, isFetching, isError } = useGetAllRepairOrdersQuery();
  const [deleteRepairOrder, { loading: deleteLoading }] = useDeleteRepairOrderMutation();
  const [deletedId, setDeletedId] = useState(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const search = useSearchParams();
  const router = useRouter();

  const tableData = useMemo(() => {
    if (isLoading === false && isFetching === false) {
      let newData = preprocessingRepairOrderData(data);
      if (!newData) return [];
      return newData;
    }
    return [];
  }, [search.get("status"), isLoading, isFetching]);

  const columns = useMemo(() => {
    return [
      { Header: "Mã phiếu", accessor: "id", Filter: ColumnFilter },
      { Header: "Khách hàng", accessor: "customer", Filter: ColumnFilter },
      {
        Header: "Trạng thái",
        accessor: "status",
        Cell: ({ value }) => {
          const label = getStatusLabelByValue(+value);
          return (
            <div
              style={{
                width: "100%",
                height: "100%",
                padding: "8px 0px",
                fontWeight: "bold",
                backgroundColor: "#3D7EC5",
              }}
            >
              {label}
            </div>
          );
        },
        Filter: StatusFilter,
      },
      { Header: "Người tạo", accessor: "created_by", Filter: ColumnFilter },
      { Header: "Người tiếp nhận", accessor: "received_by", Filter: ColumnFilter },
      { Header: "Ngày tạo", accessor: "created_at", Filter: ColumnFilter },
      { Header: "Ngày trả hàng", accessor: "receive_at", Filter: ColumnFilter },
    ];
  }, [search.get("status"), isLoading, isFetching]);

  // Cac functions de chinh sua du lieu tren bang
  const handleDelete = async (id) => {
    dispatch(showLoading({ content: "Đang xóa đơn bảo hành sửa chữa" }));
    try {
      let result = await deleteRepairOrder({ id: +id }).unwrap();
      dispatch(showNotification({ message: result.data, type: "success" }));
    } catch (err) {
      dispatch(showNotification({ message: err.data.message, type: "error" }));
    }
    dispatch(hideLoading());
  };
  const handleDetail = (id) => {
    router.push(`/quan-ly/chi-tiet-don/${id}`);
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
                <button
                  onClick={() => handleDetail(row.values.id)}
                  className={styles["no-effect-button--hover-on"]}
                  style={{ fontWeight: "bold" }}
                >
                  <Image priority src={SearchIcon} width={20} height={20} alt="detail" />
                </button>
                {auth.role === roles.admin ? (
                  <>
                    &nbsp;|&nbsp;
                    <button
                      onClick={() => {
                        setDeletedId(row.values.id);
                        setOpenDeleteConfirm(true);
                      }}
                      className={styles["no-effect-button--hover-on"]}
                      style={{ fontWeight: "bold" }}
                    >
                      <Image priority src={TrashIcon} width={20} height={20} alt="delete" />
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
    preGlobalFilteredRows,
    setGlobalFilter,
    prepareRow,
  } = useTable(
    {
      columns,
      data: tableData,
      initialState: {
        filters: [
          {
            id: "status",
            value: search.get("status") || "",
          },
        ],
      },
    },
    useFilters,
    useGlobalFilter,
    tableHooks,
    useSortBy,
    usePagination
  );

  if (isError) return <div>An error has occurred!</div>;

  if (isLoading || isFetching) return <Loading />;

  return (
    <>
      <div className={styles["dashboard__orders__content__table-container"]}>
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
          title={`Xác nhân xóa`}
          content={`Xóa đơn bảo hành có mã '${deletedId}'?`}
          handleDelete={handleDelete}
          handleOpen={setOpenDeleteConfirm}
        />
      )}
    </>
  );
}

const GlobalFilter = (props) => {
  const { preGlobalFilteredRows, globalFilter, setGlobalFilter } = props;
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);

  const handleInputChange = (value) => {
    setGlobalFilter(value || undefined);
  };
  return (
    <input
      className={styles["dashboard__orders__content__table-container__search"]}
      type="text"
      value={globalFilter || ""}
      onChange={(e) => {
        setValue(e.target.value);
        handleInputChange(e.target.value);
      }}
      placeholder={"Nhập thông tin tìm kiếm..."}
    />
  );
};

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

const StatusFilter = ({ column }) => {
  const { filterValue, setFilter } = column;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <select
      value={filterValue}
      onChange={(e) => {
        router.replace(`${pathname}?status=${e.target.value}`);
      }}
    >
      <option value="">Tất cả</option>
      {statuses.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
};

const preprocessingRepairOrderData = (data) => {
  let result = data?.data?.map((item) => {
    return {
      id: item.id,
      customer: item.customer.name,
      status: item.status.id,
      created_by: item.createdBy.userName,
      received_by: item.receivedBy.userName,
      created_at: new Date(item.createdAt).toLocaleDateString(),
      receive_at: new Date(item.receiveAt).toLocaleDateString(),
    };
  });
  return result;
};
