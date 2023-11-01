"use client";
import styles from "@/styles/main.module.scss";
import { useTable } from "react-table";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "@/store/features/notificationSlice";

export default function RepairList() {
  const repairOrder = useSelector((state) => state.repairOrder);
  const dispatch = useDispatch();

  const data = useMemo(() => {
    return [];
  }, []);

  const columns = useMemo(() => {
    return [
      { Header: "Số Serial/Mã công việc", accessor: "id" },
      { Header: "Tên sản phẩm/Công việc", accessor: "name" },
      { Header: "Mô tả", accessor: "description" },
    ];
  }, []);

  // Cac functions de chinh sua du lieu tren bang
  const handleDelete = (id) => {
    alert("delete " + id);
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
              <button onClick={() => handleDelete(row.values.id)} className={styles["button"]}>
                Xóa
              </button>
            );
          },
        },
      ];
    });
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
    },
    tableHooks
  );

  const handleAddPurchasedProduct = () => {
    if (repairOrder.customer === null) {
      dispatch(showNotification({ message: "Chưa chọn khách hàng", type: "error" }));
    }
  };

  return (
    <>
      <div className={styles["dashboard__neworder__content__product__actions"]}>
        <button type="button" onClick={handleAddPurchasedProduct} className={styles["button-outline"]}>
          Chọn sản phẩm đã mua
        </button>
        <button type="button" className={styles["button-outline"]}>Tạo mới sản phẩm</button>
      </div>
      <div className={styles["dashboard__neworder__content__product__table-container"]}>
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
            {rows.map((row) => {
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
      </div>
    </>
  );
}
