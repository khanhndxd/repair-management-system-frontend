"use client";
// import "regenerator-runtime/runtime";
import styles from "@/styles/main.module.scss";
import { useTable, useGlobalFilter, useSortBy, useFilters, usePagination } from "react-table";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGetAllCustomersQuery } from "@/services/api/customer/customerApi";
import Loading from "@/app/loading";

export default function CustomerTable() {
  const { data, isLoading, isFetching, isError } = useGetAllCustomersQuery();

  const router = useRouter();
  const tableData = useMemo(() => {
    if(isLoading === false) {
      return data.data
    }
    return [];
  }, [isLoading, isFetching]);

  const columns = useMemo(() => {
    return [
      { Header: "Mã khách hàng", accessor: "id", Filter: ColumnFilter },
      { Header: "Tên khách hàng", accessor: "name", Filter: ColumnFilter },
      { Header: "Địa chỉ", accessor: "address", Filter: ColumnFilter },
      { Header: "Số điện thoại", accessor: "phone", Filter: ColumnFilter },
      { Header: "Email", accessor: "email", Filter: ColumnFilter },
    ];
  }, [isLoading, isFetching]);

  // Cac functions de chinh sua du lieu tren bang
  const handleDetail = (id) => {
    router.push(`/quan-ly/khach-hang/${id}`);
  };
  const tableHooks = (hooks) => {
    hooks.visibleColumns.push((columns) => {
      return [
        ...columns,
        {
          id: "action",
          Header: "Thao tác",
          Cell: ({ row }) => {
            return (
              <button onClick={() => handleDetail(row.values.id)} className={styles["no-effect-button"]}>
                Xem chi tiết
              </button>
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
    useGlobalFilter,
    tableHooks,
    useSortBy,
    usePagination
  );

  if (isError) return <div>Có lỗi xảy ra!</div>;

  if (isLoading) return <Loading />;

  return (
    <div className={styles["dashboard__customers__content__table-container"]}>
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
        <tbody {...getTableBodyProps()}>
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
