"use client";
// import "regenerator-runtime/runtime";
import styles from "@/styles/main.module.scss";
import { useTable, useGlobalFilter, useSortBy, useFilters, usePagination } from "react-table";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Loading from "@/app/loading";
import { useGetAllRepairOrdersQuery } from "@/services/api/repairOrder/repairOrderApi";
import { useGetAllStatusesQuery } from "@/services/api/status/statusApi";

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

export default function RepairOrderTable() {
  const { data, isLoading, isFetching, isError } = useGetAllRepairOrdersQuery();
  const search = useSearchParams();
  const router = useRouter();

  const tableData = useMemo(() => {
    if (isLoading === false) {
      return data.data;
    }
    return [];
  }, [search.get("status"), isLoading]);

  const columns = useMemo(() => {
    return [
      { Header: "Mã phiếu", accessor: "id", Filter: ColumnFilter },
      { Header: "Khách hàng", accessor: "customer", Filter: ColumnFilter },
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
                fontWeight: "bold",
              }}
            >
              {statuses[value].content}
            </div>
          );
        },
        Filter: StatusFilter,
      },
      { Header: "Người tạo", accessor: "created_by", Filter: ColumnFilter },
      { Header: "Người tiếp nhận", accessor: "repaired_by", Filter: ColumnFilter },
      { Header: "Ngày tạo", accessor: "created_at", Filter: ColumnFilter },
      { Header: "Ngày trả hàng", accessor: "receive_at", Filter: ColumnFilter },
    ];
  }, [search.get("status"), isLoading]);

  // Cac functions de chinh sua du lieu tren bang
  const handleDelete = (id) => {
    alert("delete " + id);
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
              <>
                <button onClick={() => handleDetail(row.values.id)} className={styles["button"]}>
                  Xem chi tiết
                </button>
                |
                <button onClick={() => handleDelete(row.values.id)} className={styles["button"]}>
                  Xóa
                </button>
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

  if (isLoading) return <Loading />;

  return (
    <div className={styles["dashboard__orders__content__table-container"]}>
      {/* <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        setGlobalFilter={setGlobalFilter}
        globalFilter={state.globalFilter}
      /> */}
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
  const { data, isLoading, isFetching, isError } = useGetAllStatusesQuery();
  const router = useRouter();
  const pathname = usePathname();

  if (isError) return <div>An error has occurred!</div>;

  if (isLoading) return <Loading />;

  return (
    <select
      value={filterValue}
      onChange={(e) => {
        router.replace(`${pathname}?status=${e.target.value}`);
      }}
    >
      <option value="">Tất cả</option>
      {data?.data.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </select>
  );
};
