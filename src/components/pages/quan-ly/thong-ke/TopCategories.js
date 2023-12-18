"use client";
// import "regenerator-runtime/runtime";
import styles from "@/styles/main.module.scss";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import { useMemo } from "react";
import Loading from "@/app/loading";
import { useGetRepairCategoryStatsQuery } from "@/services/api/repairOrder/repairOrderApi";

export default function TopCategories() {
  const { data, isLoading, isFetching, isError } = useGetRepairCategoryStatsQuery();

  const tableData = useMemo(() => {
    if (isLoading === false && isFetching === false) {
      let newData = data.data.map((item) => {
        const total = item.repairTypeStats[0].repairCount + item.repairTypeStats[1].repairCount + item.repairTypeStats[2].repairCount;
        return {
          id: item.categoryId,
          name: item.categoryName,
          type1: item.repairTypeStats[0].repairCount,
          type2: item.repairTypeStats[1].repairCount,
          type3: item.repairTypeStats[2].repairCount,
          total: total,
        };
      });
      if (!newData) return [];
      return newData;
    }
    return [];
  }, [isLoading, isFetching]);

  const columns = useMemo(() => {
    return [
      { Header: "Mã", accessor: "id", Filter: ColumnFilter },
      { Header: "Nhóm", accessor: "name", Filter: ColumnFilter },
      {
        Header: "Bảo hành",
        accessor: "type1",
        Cell: ({ value }) => {
          return `${value} đơn`;
        },
        Filter: <></>,
      },
      {
        Header: "Sửa chữa",
        accessor: "type2",
        Cell: ({ value }) => {
          return `${value} đơn`;
        },
        Filter: <></>,
      },
      {
        Header: "Đổi mới",
        accessor: "type3",
        Cell: ({ value }) => {
          return `${value} đơn`;
        },
        Filter: <></>,
      },
      {
        Header: "Tổng",
        accessor: "total",
        Cell: ({ value }) => {
          return `${value} đơn`;
        },
        Filter: <></>,
      },
    ];
  }, [isLoading, isFetching]);

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
    useSortBy,
    usePagination
  );

  if (isError) return <div>Có lỗi xảy ra</div>;

  if (isLoading || isFetching) return <Loading />;

  return (
    <div className={styles["table"]} style={{ width: "100%" }}>
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
      <div className={styles["table__actions"]}>
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
