"use client";
import styles from "@/styles/main.module.scss";
import { useTable } from "react-table";
import { useMemo } from "react";

export default function RepairOrderProductList(props) {
  const { repairProduct, task } = props;

  const data = useMemo(() => {
    const processedData = preprocessingProductListData(repairProduct, task);
    return processedData;
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

  // const tableHooks = (hooks) => {
  //   hooks.visibleColumns.push((columns) => {
  //     return [
  //       ...columns,
  //       {
  //         id: "update",
  //         Header: "Thao tác",
  //         Cell: ({ row }) => {
  //           return (
  //             <button onClick={() => handleDelete(row.values.id)} className={styles["no-effect-button"]}>
  //               Xóa
  //             </button>
  //           );
  //         },
  //       },
  //     ];
  //   });
  // };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
    },
  );

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

const preprocessingProductListData = (product, task) => {
  let result = product.map((item) => {
    return {
      id: item.purchasedProduct.productSerial,
      name: item.purchasedProduct.productName,
      description: item.description,
    };
  });
  result.push({ id: task.id, name: task.name, description: "" });

  return result;
};
