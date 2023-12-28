"use client";
import styles from "@/styles/main.module.scss";
import { useTable } from "react-table";
import { useMemo } from "react";

export default function RepairAccessoryList(props) {
  const { repairAccessories } = props;

  const data = useMemo(() => {
    let processedData = repairAccessories.map((item) => {
      return {
        id: item.accessory.id,
        name: item.accessory.name,
        unit: item.accessory.unit,
        quantity: item.quantity,
      };
    });
    return processedData;
  }, [repairAccessories]);

  const columns = useMemo(() => {
    return [
      { Header: "Mã", accessor: "id" },
      { Header: "Tên", accessor: "name" },
      { Header: "Đơn vị", accessor: "unit" },
      { Header: "Số lượng", accessor: "quantity" },
    ];
  }, [repairAccessories]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
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
  );
}
