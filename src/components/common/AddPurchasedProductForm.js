"use client";
import Loading from "@/app/loading";
import { useGetPurchaseOrderByCustomerIdQuery } from "@/services/api/purchaseOrder/purchaseOrderApi";
import { hideDialog } from "@/store/features/dialogSlice";
import { showNotification } from "@/store/features/notificationSlice";
import { addProduct } from "@/store/features/repairOrderSlice";
import styles from "@/styles/main.module.scss";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export default function AddPurchasedProductForm() {
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const dispatch = useDispatch();
  const dialog = useSelector((state) => state.dialog);
  const repairOrder = useSelector((state) => state.repairOrder);
  const { currentData, isLoading, isFetching, isError, error } = useGetPurchaseOrderByCustomerIdQuery(repairOrder.customer.id);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});

  const onSubmit = (data) => {
    dispatch(addProduct({ object: data["purchased-product"] }));
    dispatch(showNotification({ message: "Chọn sản phẩm thành công", type: "success" }));
    dispatch(hideDialog());
  };

  const handleCloseForm = () => {
    dispatch(hideDialog());
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const lowerCaseValue = removeAccents(value.toLowerCase());
    let newSuggestions = [];
    for (let i = 0; i < currentData.data.length; i++) {
      for (let j = 0; j < currentData.data[i].purchaseProducts.length; j++) {
        if (
          removeAccents(currentData.data[i].purchaseProducts[j].productSerial.toLowerCase()).includes(lowerCaseValue) ||
          currentData.data[i].id.toString().includes(lowerCaseValue)
        ) {
          newSuggestions.push(currentData.data[i].purchaseProducts[j]);
        }
      }
    }
    setSuggestions(newSuggestions);
  };

  if (isError) {
    if (error.status === 404) {
      return (
        <div>
          Khách hàng chưa mua sản phẩm nào, hãy tạo mới sản phẩm! &nbsp;
          <button onClick={handleCloseForm} className={styles["no-effect-button"]} style={{ color: "blue" }}>
            <h3>Quay lại</h3>
          </button>
        </div>
      );
    }
    return <div>Có lỗi xảy ra!</div>;
  }

  if (isLoading || isFetching) return <Loading />;

  return (
    <form
      className={dialog.show === true ? styles["dialog__content__box"] : styles["dialog__content__box--hidden"]}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <Controller
        control={control}
        name="purchased-product"
        defaultValue={""}
        rules={{ required: true }}
        render={({ field }) => (
          <div className={styles["customer__control"]}>
            <label htmlFor="customer">
              <i>Tìm kiếm sản phẩm đã mua</i>
            </label>
            <input
              {...field}
              placeholder={"Nhập số serial hoặc mã hóa đơn"}
              value={inputValue}
              autoComplete="off"
              onChange={(e) => {
                field.onChange(e);
                handleInputChange(e);
              }}
            />
            {suggestions.length !== 0 ? (
              <div className={styles["suggestions"]}>
                {suggestions.map((suggestion) => {
                  return (
                    <div
                      key={suggestion.id}
                      onClick={() => {
                        field.onChange(suggestion);
                        setInputValue(`${suggestion.productName} | ${suggestion.productSerial}`);
                        setSuggestions([]);
                      }}
                    >
                      <span>
                        {suggestion.productName} | Serial: {suggestion.productSerial} |{" "}
                        <span
                          style={{
                            color: suggestion.isWarrantyExpired === true ? "#ff9966" : "#5dac51",
                          }}
                        >
                          {suggestion.isWarrantyExpired === true
                            ? "Hết hạn hoặc không có bảo hành"
                            : `Còn hạn bảo hành (${suggestion.daysLeftInWarranty} ngày)`}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        )}
      />
      {errors["purchased-product"] && <span style={{ color: "#cc3300", fontStyle: "italic", fontSize: "14px" }}>Chưa chọn sản phẩm</span>}
      <div className={styles["dialog__content__box__actions"]}>
        <button onClick={handleCloseForm} className={styles["button"]}>
          Hủy
        </button>
        <button style={{ marginLeft: "auto" }} type="submit" className={styles["button"]}>
          Thêm sản phẩm
        </button>
      </div>
    </form>
  );
}

function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
