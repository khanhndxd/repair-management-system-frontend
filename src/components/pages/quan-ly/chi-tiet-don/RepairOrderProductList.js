"use client";
import styles from "@/styles/main.module.scss";
import { useTable } from "react-table";
import { useMemo } from "react";

export default function RepairOrderProductList(props) {
  const { repairProduct, repairTasks, repairCustomerProducts } = props;

  const data = useMemo(() => {
    const processedData = preprocessingProductListData(repairProduct, repairTasks, repairCustomerProducts);
    return processedData;
  }, []);

  const columns = useMemo(() => {
    return [
      { Header: "Số Serial/Mã công việc", accessor: "id" },
      { Header: "Tên sản phẩm/Công việc", accessor: "name" },
      { Header: "Mô tả", accessor: "description" },
    ];
  }, []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <div className={styles["dashboard__orderdetail__content__box__product"]}>
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

const preprocessingProductListData = (product, tasks, customerProducts) => {
  let result = [];
  for (let i = 0; i < product.length; i++) {
    result.push({
      id: product[i].purchasedProduct.productSerial,
      name: product[i].purchasedProduct.productName,
      description: product[i].description,
    });
  }
  for (let i = 0; i < tasks.length; i++) {
    result.push({ id: tasks[i].task.id, name: tasks[i].task.name, description: tasks[i].description });
  }
  for (let i = 0; i < customerProducts.length; i++) {
    result.push({
      id: "SPM" + customerProducts[i].customerProduct.id,
      name: customerProducts[i].customerProduct.name,
      description: customerProducts[i].description,
    });
  }

  return result;
};
