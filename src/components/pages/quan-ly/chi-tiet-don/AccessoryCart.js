"use client";
import { addQuantity, removeAccessory, removeQuantity } from "@/store/features/accessoryCartSlice";
import styles from "@/styles/main.module.scss";
import { useDispatch, useSelector } from "react-redux";

export default function AccessoryCart() {
  const accessoryCart = useSelector((state) => state.accessoryCart);
  const dispatch = useDispatch();

  const handleRemoveAccessory = (id) => {
    dispatch(removeAccessory({ id: id }));
  };

  const handleRemoveQuantity = (id, currentQuantity) => {
    if (currentQuantity === 1) {
      handleRemoveAccessory(id);
      return;
    }
    dispatch(removeQuantity({ id: id }));
  };

  const handleAddQuantity = (id) => {
    dispatch(addQuantity({ id: id }));
  };

  return (
    <div className={styles["accessory-cart"]}>
      <div className={styles["accessory-cart__item"]}>
        <span className={styles["accessory-cart__item__header"]}>Mã</span>
        <span className={styles["accessory-cart__item__header"]}>Tên sản phẩm</span>
        <span className={styles["accessory-cart__item__header"]}>Đơn vị</span>
        <span className={styles["accessory-cart__item__header"]}>Số lượng</span>
        <span className={styles["accessory-cart__item__header"]}>Thao tác</span>
      </div>
      {accessoryCart.accessories.map((item) => {
        return (
          <div key={item.id} className={styles["accessory-cart__item"]}>
            <span className={styles["accessory-cart__item__content"]}>{item.id}</span>
            <span className={styles["accessory-cart__item__content"]}>{item.name}</span>
            <span className={styles["accessory-cart__item__content"]}>{item.unit}</span>
            <span className={styles["accessory-cart__item__content--quantity"]}>
              <span onClick={() => handleRemoveQuantity(item.id, item.quantity)}>-</span>
              {item.quantity}
              <span onClick={() => handleAddQuantity(item.id)}>+</span>
            </span>
            <span
              onClick={() => handleRemoveAccessory(item.id)}
              className={styles["accessory-cart__item__content--action"]}
            >
              Xóa
            </span>
          </div>
        );
      })}
    </div>
  );
}
