"use client";
import Loading from "@/app/loading";
import { useDeleteUserMutation, useGetAllUserQuery } from "@/services/api/user/userApi";
import { roles } from "@/services/helper/helper";
import { showDialog } from "@/store/features/dialogSlice";
import { hideLoading } from "@/store/features/loadingAsyncSlice";
import { showNotification } from "@/store/features/notificationSlice";
import styles from "@/styles/main.module.scss";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFilters, usePagination, useSortBy, useTable } from "react-table";

export default function AccountTable() {
  const { data, isLoading, isFetching, isError } = useGetAllUserQuery();
  const [deleteUser, { loading }] = useDeleteUserMutation();
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const tableData = useMemo(() => {
    if (isLoading === false && isFetching === false) {
      let newData = data.data.map((item) => {
        return { id: item.id, name: item.userName, email: item.email, phone: item.phoneNumber, role: item.roles[0] };
      });
      if (!newData) return [];
      return newData;
    }
    return [];
  }, [isLoading, isFetching]);

  const columns = useMemo(() => {
    return [
      { Header: "Mã", accessor: "id", Filter: ColumnFilter },
      { Header: "Tên", accessor: "name", Filter: ColumnFilter },
      { Header: "Email", accessor: "email", Filter: ColumnFilter },
      { Header: "Số điện thoại", accessor: "phone", Filter: ColumnFilter },
      {
        Header: "Vai trò",
        accessor: "role",
        Cell: ({ value }) => {
          if (value === "Creator") {
            return <span>Nhân viên tạo phiếu</span>;
          } else if (value === "Receiver") {
            return <span>Nhân viên tiếp nhận</span>;
          } else if (value === "Technician") {
            return <span>Kỹ thuật viên</span>;
          } else if (value === "Admin") {
            return <span>Quản lý</span>;
          } else {
            return <span></span>;
          }
        },
        Filter: ColumnFilter,
      },
    ];
  }, [isLoading, isFetching]);

  const handleChangeRole = (data) => {
    dispatch(
      showDialog({
        title: `Thay đổi vai trò của người dùng ${data.values.name} (mã ${data.values.id})`,
        content: "change-role",
        info: { ...data.values },
      })
    );
  };
  const handleUpdateUser = (data) => {
    dispatch(
      showDialog({
        title: `Chỉnh sửa thông tin của người dùng ${data.values.name} (mã ${data.values.id})`,
        content: "update-user",
        info: { ...data.values },
      })
    );
  };
  const handleChangePassword = (data) => {
    dispatch(
      showDialog({
        title: `Thay đổi mật khẩu cho người dùng ${data.values.name} (mã ${data.values.id})`,
        content: "change-password",
        info: { id: data.values.id },
      })
    );
  };
  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id).unwrap();

      dispatch(hideLoading());
      dispatch(showNotification({ message: "Xóa người dùng thành công", type: "success" }));
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
              <>
                {auth.role === roles.admin ? (
                  <>
                    <button
                      onClick={() => {
                        handleChangeRole(row);
                      }}
                      className={styles["no-effect-button"]}
                      style={{ fontWeight: "bold" }}
                    >
                      Vai trò
                    </button>
                    &nbsp;|&nbsp;
                    <button
                      onClick={() => {
                        handleUpdateUser(row);
                      }}
                      className={styles["no-effect-button"]}
                      style={{ fontWeight: "bold" }}
                    >
                      Thông tin
                    </button>
                    &nbsp;|&nbsp;
                    <button
                      onClick={() => {
                        handleChangePassword(row);
                      }}
                      className={styles["no-effect-button"]}
                      style={{ fontWeight: "bold" }}
                    >
                      Mật khẩu
                    </button>
                    &nbsp;|&nbsp;
                    <button
                      onClick={() => {
                        handleDeleteUser(row.values.id);
                      }}
                      className={styles["no-effect-button"]}
                      style={{ fontWeight: "bold" }}
                    >
                      Xóa
                    </button>
                  </>
                ) : null}
              </>
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
    <div className={styles["dashboard__account__table-container"]}>
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
