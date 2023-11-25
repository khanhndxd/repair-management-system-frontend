"use client";
import styles from "@/styles/main.module.scss";
import { useTable } from "react-table";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "@/store/features/notificationSlice";
import { showDialog } from "@/store/features/dialogSlice";
import { removeTasksProducts } from "@/store/features/repairOrderSlice";

export default function RepairList() {
  const repairOrder = useSelector((state) => state.repairOrder);
  const dispatch = useDispatch();

  const data = useMemo(() => {
    return preprocessingRepairListData(
      repairOrder.products,
      repairOrder.tasks,
      repairOrder.newRepairProducts
    );
  }, [repairOrder.products, repairOrder.tasks, repairOrder.newRepairProducts]);

  const columns = useMemo(() => {
    return [
      { Header: "Số Serial/Mã công việc", accessor: "id" },
      { Header: "Tên sản phẩm/Công việc", accessor: "name" },
      { Header: "Mô tả", accessor: "description" },
    ];
  }, [repairOrder.products, repairOrder.tasks, repairOrder.newRepairProducts]);

  // Cac functions de chinh sua du lieu tren bang
  const handleDelete = (item) => {
    dispatch(removeTasksProducts(item));
  };

  const handleUpdateDescription = (id) => {
    let item;
    for (let i = 0; i < repairOrder.tasksProducts.length; i++) {
      if (repairOrder.tasksProducts[i].id == id) {
        item = repairOrder.tasksProducts[i];
        break;
      }
    }
    dispatch(showDialog({ title: `Cập nhật mô tả ${item.name}`, content: "update-description", info: { object: item } }));
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
                <button
                  onClick={() => handleDelete(row.values)}
                  className={styles["no-effect-button"]}
                  style={{ fontWeight: "bold", textDecoration: "underline", fontSize: "16px" }}
                  type="button"
                >
                  Xóa
                </button>
                &nbsp; | &nbsp;
                <button
                  onClick={() => handleUpdateDescription(row.values.id)}
                  className={styles["no-effect-button"]}
                  style={{ fontWeight: "bold", textDecoration: "underline", fontSize: "16px" }}
                  type="button"
                >
                  Sửa mô tả
                </button>
              </>
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
      return;
    }
    dispatch(
      showDialog({
        title: `Chọn sản phẩm đã mua của khách hàng ${repairOrder.customer?.name}`,
        content: "add-purchased-product",
      })
    );
  };

  const handleAddCustomerProduct = () => {
    if (repairOrder.customer === null) {
      dispatch(showNotification({ message: "Chưa chọn khách hàng", type: "error" }));
      return;
    }
    dispatch(showDialog({ title: "Chọn sản phẩm của khách hàng", content: "add-customer-product" }));
  }

  const handleAddNewRepairProduct = () => {
    if (repairOrder.customer === null) {
      dispatch(showNotification({ message: "Chưa chọn khách hàng", type: "error" }));
      return;
    }
    dispatch(showDialog({ title: "Thêm sản phẩm mới", content: "add-new-product" }));
  };

  return (
    <>
      <div className={styles["dashboard__neworder__content__product__actions"]}>
        <button type="button" onClick={handleAddPurchasedProduct} className={styles["button-outline"]}>
          Chọn sản phẩm đã mua
        </button>
        <button type="button" onClick={handleAddCustomerProduct} className={styles["button-outline"]}>
          Chọn sản phẩm của khách hàng
        </button>
        <button onClick={handleAddNewRepairProduct} type="button" className={styles["button-outline"]}>
          Tạo mới sản phẩm
        </button>
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

const preprocessingRepairListData = (products, tasks, newProducts) => {
  let result = [];
  for (let i = 0; i < products.length; i++) {
    result.push({
      id: products[i].serial,
      name: products[i].name,
      serial: products[i].serial,
      description: products[i]?.description,
    });
  }
  for (let i = 0; i < tasks.length; i++) {
    result.push({ id: tasks[i].id, name: tasks[i].name, description: tasks[i]?.description });
  }
  for (let i = 0; i < newProducts.length; i++) {
    result.push({
      id: newProducts[i].id,
      name: newProducts[i].name,
      description: newProducts[i]?.description,
    });
  }

  return result;
};
