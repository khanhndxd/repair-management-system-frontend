"use client";
// import "regenerator-runtime/runtime";
import styles from "@/styles/main.module.scss";
import { useTable, useGlobalFilter, useSortBy, useFilters, usePagination } from "react-table";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const statuses = {
  1: { content: "Chờ xử lý", color: "#3D7EC5" },
  2: { content: "Đã tiếp nhận", color: "#3D7EC5" },
  3: { content: "Đang sửa chữa", color: "#3D7EC5" },
  4: { content: "Đã chuyển sản phẩm về hãng", color: "#3D7EC5" },
  5: { content: "Đã nhận sản phẩm từ hãng", color: "#3D7EC5" },
  6: { content: "Đã sửa xong", color: "#3D7EC5" },
  7: { content: "Đã hủy", color: "#3D7EC5" },
  8: { content: "Đã hoàn thành", color: "#3D7EC5" },
  9: { content: "Đã trả hàng", color: "#3D7EC5" },
};

export default function CustomerOrderTable(props) {
  const { repairOrders } = props;
  const router = useRouter();
  const search = useSearchParams();

  const data = useMemo(() => {
    return repairOrders;
  }, [search.get("status")]);

  const columns = useMemo(() => {
    return [
      { Header: "Mã phiếu", accessor: "id", Filter: ColumnFilter },
      {
        Header: "Trạng thái",
        accessor: "status",
        Cell: ({ value }) => {
          return (
            <div
              style={{
                width: "100%",
                height: "100%",
                padding: "8px 0px",
                backgroundColor: statuses[value].color,
                fontWeight: "bold",
              }}
            >
              {statuses[value].content}
            </div>
          );
        },
        Filter: StatusFilter,
      },
      { Header: "Người tạo", accessor: "createdBy", Filter: ColumnFilter },
      { Header: "Người tiếp nhận", accessor: "repairedBy", Filter: ColumnFilter },
      { Header: "Ngày tạo", accessor: "createdAt", Filter: ColumnFilter },
      { Header: "Ngày trả hàng", accessor: "receiveAt", Filter: ColumnFilter },
    ];
  }, [search.get("status")]);

  // Cac functions de chinh sua du lieu tren bang
  const handleDetail = (id) => {
    router.push(`/quan-ly/chi-tiet-don/${id}`);
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
              <div
                style={{
                  padding: "5px"
                }}
              >
                <button onClick={() => handleDetail(row.values.id)} className={styles["no-effect-button"]}>
                  Xem chi tiết
                </button>
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
      data,
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

  return (
    <>
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
      {Object.entries(statuses).map(([value, label]) => (
        <option key={value} value={value}>
          {label.content}
        </option>
      ))}
    </select>
  );
};
