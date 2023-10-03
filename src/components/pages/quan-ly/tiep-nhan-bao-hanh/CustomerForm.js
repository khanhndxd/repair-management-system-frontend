import { useState } from "react";
import { Controller } from "react-hook-form";
import styles from "@/styles/main.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { addCustomer } from "@/store/features/customerSlice";

const customers = [
  { name: "Khách hàng 1", phone: "0123456789" },
  { name: "Khách hàng 2", phone: "0987654321" },
  { name: "Khách hàng 3", phone: "0987654321" },
  { name: "Khách hàng 4", phone: "0987654321" },
  { name: "Khách hàng 5", phone: "0987654321" },
  { name: "Khách hàng 6", phone: "0987654321" },
  { name: "Khách hàng 7", phone: "0987654321" },
  { name: "Khách hàng 8", phone: "0987654321" },
  { name: "Khách hàng 9", phone: "0987654321" },
  { name: "Khách hàng 10", phone: "0987654321" },
];

function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default function CustomerForm({ control }) {
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.customer);
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const lowerCaseValue = removeAccents(value.toLowerCase());
    const newSuggestions = customers.filter(
      (customer) =>
        removeAccents(customer.name.toLowerCase()).includes(lowerCaseValue) ||
        removeAccents(customer.phone.toLowerCase()).includes(lowerCaseValue)
    );
    setSuggestions(newSuggestions);
  };

  return (
    <div className={styles["dashboard__neworder__content__info__box__customer"]}>
      <Controller
        control={control}
        name="customer"
        defaultValue={""}
        render={({ field }) => (
          <div className={styles["customer__control"]}>
            <label htmlFor="customer">
              <i>Tìm kiếm khách hàng</i>
            </label>
            <input
              {...field}
              placeholder={"Nhập tên hoặc số điện thoại"}
              value={inputValue}
              autoComplete="off"
              onChange={(e) => {
                field.onChange(e);
                handleInputChange(e);
              }}
            />
            {suggestions.length !== 0 ? (
              <div className={styles["suggestions"]}>
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.name}
                    onClick={() => {
                      field.onChange(suggestion);
                      setInputValue(suggestion.name);
                      dispatch(addCustomer({ ...suggestion }));
                      setSuggestions([]);
                    }}
                  >
                    <span>
                      {suggestion.name} | {suggestion.phone}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}
      />
      <div className={styles["dashboard__neworder__content__info__box__customer__detail"]}>
        <div className={styles["dashboard__neworder__content__info__box__customer__detail__control"]}>
          <p>Tên khách hàng</p>
          <h5>{customer?.name}</h5>
        </div>
        <div className={styles["dashboard__neworder__content__info__box__customer__detail__control"]}>
          <p>Số điện thoại</p>
          <h5>{customer?.phone}</h5>
        </div>
        <div className={styles["dashboard__neworder__content__info__box__customer__detail__control"]}>
          <p>Địa chỉ</p>
          <h5>{customer?.address}</h5>
        </div>
        <div className={styles["dashboard__neworder__content__info__box__customer__detail__control"]}>
          <p>Email</p>
          <h5>{customer?.email}</h5>
        </div>
      </div>
    </div>
  );
}