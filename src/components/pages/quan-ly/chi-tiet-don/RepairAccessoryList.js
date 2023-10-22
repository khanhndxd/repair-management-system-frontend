"use client";
import styles from "@/styles/main.module.scss";
import { useTable } from "react-table";
import { useMemo } from "react";

export default function RepairAccessoryList() {
    const data = useMemo(() => {
        return [
          {
            id: 1,
            name: "test 1",
            unit: "Cái",
            quantity: 1
          },
        ];
      }, []);
    
      const columns = useMemo(() => {
        return [
          { Header: "Mã", accessor: "id" },
          { Header: "Tên", accessor: "name" },
          { Header: "Đơn vị", accessor: "unit" },
          { Header: "Số lượng", accessor: "quantity" },
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