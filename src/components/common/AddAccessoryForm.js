"use client";
import Loading from "@/app/loading";
import { useGetAllAccessoryQuery } from "@/services/api/accessory/accessoryApi";
import { hideDialog } from "@/store/features/dialogSlice";
import { showNotification } from "@/store/features/notificationSlice";
import styles from "@/styles/main.module.scss";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import AccessoryCart from "../pages/quan-ly/chi-tiet-don/AccessoryCart";
import { addAccessory } from "@/store/features/accessoryCartSlice";
import { useParams } from "next/navigation";
import { useAddRepairAccessoryMutation } from "@/services/api/repairAccessory/repairAccessoryApi";
import { hideLoading, showLoading } from "@/store/features/loadingAsyncSlice";

function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default function AddAccessoryForm() {
  const { data, isLoading, isFetching, isError } = useGetAllAccessoryQuery();
  const [addRepairAccessory, { isLoading: repairAccessoryLoading }] = useAddRepairAccessoryMutation();
  const params = useParams();
  const dialog = useSelector((state) => state.dialog);
  const accessory = useSelector((state) => state.accessoryCart);
  const dispatch = useDispatch();
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({});

  const onSubmit = async (data) => {
    if (accessory.accessories.length === 0) {
      dispatch(showNotification({ message: "Không có linh kiện nào để thêm hay chỉnh sửa", type: "error" }));
      return false;
    }
    dispatch(showLoading({ content: "Đang thêm linh kiện..." }));
    const processedData = prepareRepairAccessoryData(params.id, accessory.accessories);
    await addRepairAccessory(processedData);
    dispatch(hideLoading());
    dispatch(showNotification({ message: "Thêm linh kiện thành công", type: "success" }));
    dispatch(hideDialog());
  };

  const handleCloseForm = () => {
    dispatch(hideDialog());
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const lowerCaseValue = removeAccents(value.toLowerCase());
    const newSuggestions = data?.data.filter((accessory) =>
      removeAccents(accessory.name.toLowerCase()).includes(lowerCaseValue)
    );
    setSuggestions(newSuggestions);
  };

  if (isError) return <div>Có lỗi xảy ra!</div>;

  if (isLoading) return <Loading />;

  return (
    <form
      className={
        dialog.show === true ? styles["dialog__content__box"] : styles["dialog__content__box--hidden"]
      }
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <Controller
        control={control}
        name="accessory"
        defaultValue={""}
        render={({ field }) => (
          <div className={styles["customer__control"]}>
            <label htmlFor="accessory">
              <i>Tìm kiếm linh kiện</i>
            </label>
            <input
              {...field}
              placeholder={"Nhập tên linh kiện"}
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
                  let chosen = isChosen(suggestion.id, accessory.accessories);
                  return (
                    <div
                      key={suggestion.id}
                      onClick={() => {
                        if (chosen === false) {
                          field.onChange(suggestion);
                          setInputValue(suggestion.name);
                          dispatch(addAccessory({ info: suggestion, quantity: 1 }));
                          setSuggestions([]);
                        }
                      }}
                      style={{ color: chosen === true ? "#ff9966" : "#000000" }}
                    >
                      <span>
                        {suggestion.name} {chosen === true ? "(Đã chọn)" : null}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        )}
      />
      {errors.accessory && (
        <span style={{ color: "#cc3300", fontStyle: "italic", fontSize: "14px" }}>
          Chưa chọn linh kiện nào
        </span>
      )}
      <AccessoryCart />
      <div className={styles["dialog__content__box__actions"]}>
        <button onClick={handleCloseForm} className={styles["button"]}>
          Hủy
        </button>
        <button style={{ marginLeft: "auto" }} type="submit" className={styles["button"]}>
          Xác nhận
        </button>
      </div>
    </form>
  );
}

const isChosen = (id, data) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === id) {
      return true;
    }
  }
  return false;
};

const prepareRepairAccessoryData = (repairOrderId, accessories) => {
  let result = accessories.map((item) => {
    return { repairOrderId: +repairOrderId, accessoryId: item.id, quantity: item.quantity };
  });
  return result;
};
