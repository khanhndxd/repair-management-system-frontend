"use client";
import { convertToVND, isContainValueInArrayOfObject } from "@/services/helper/helper";
import styles from "@/styles/main.module.scss";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function MultipleTaskSelect(props) {
  const { register, errors, setValue, name, data, watch, reduxDataStore, addToReduxStore, removeFromReduxStore } = props;
  const repairOrder = useSelector((state) => state.repairOrder);
  const dispatch = useDispatch();
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const handleCheckboxChange = (data, dataId, isChecked) => {
    if (isChecked === false) {
      dispatch(removeFromReduxStore({ id: dataId }));
    } else {
      dispatch(addToReduxStore({ object: data }));
    }
    setValue(`selected${name}.${dataId}`, isChecked);
  };

  const handleRemoveSelectedItem = (dataId) => {
    dispatch(removeFromReduxStore({ id: dataId }));
    setValue(`selected${name}.${dataId}`, false);
  };

  return (
    <div className={styles["multiple-select"]}>
      <div className={styles["multiple-select__header"]}>
        {reduxDataStore.length === 0 ? (
          <p>
            <i>{repairOrder.isWarranted === true ? "Vui lòng chọn áp dụng bảo hành để chọn công việc" : "--Chọn--"}</i>
          </p>
        ) : (
          <>
            {reduxDataStore.map((item) => {
              return (
                <span key={item.id} className={styles["multiple-select__header__selected-item"]}>
                  {item.name}
                  &nbsp;
                  <span>
                    <strong onClick={() => handleRemoveSelectedItem(item.id)}>X</strong>
                  </span>
                </span>
              );
            })}
          </>
        )}
        {repairOrder.isWarranted === true ? null : (
          <span className={styles["multiple-select__header__arrow"]} onClick={() => setIsOpenDropdown((prev) => !prev)}>
            &#10094;
          </span>
        )}
      </div>
      {isOpenDropdown === true && repairOrder.isWarranted === false ? (
        <div className={styles["multiple-select__dropdown"]}>
          {data.map((item) => {
            return (
              <div key={item.id} className={styles["multiple-select__dropdown__option"]}>
                <input
                  type="checkbox"
                  id={`${item.id}`}
                  name={`${item.name}`}
                  value={item.id}
                  checked={isContainValueInArrayOfObject(reduxDataStore, "id", item.id)}
                  //   {...register(`selected${name}.${item.id}`)}
                  onChange={(e) => handleCheckboxChange(item, item.id, e.target.checked)}
                />
                <label htmlFor={`${item.name}`}>
                  {item.name} ({convertToVND(item.price)})
                </label>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
