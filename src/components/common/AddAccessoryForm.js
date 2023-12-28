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
import { useAddRepairLogMutation } from "@/services/api/repairLog/repairLogApi";
import { useUpdateTotalPriceMutation } from "@/services/api/repairOrder/repairOrderApi";
import { useGetWarrantyPolicyTasksByPolicyIdQuery } from "@/services/api/warrantyPolicyTask/warrantyPolicyTaskApi";

function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default function AddAccessoryForm() {
  const { data, isLoading, isFetching, isError } = useGetAllAccessoryQuery();
  const dialog = useSelector((state) => state.dialog);
  const {
    data: policyTasks,
    isLoading: ptLoading,
    isfetching: ptFetching,
    isError: ptError,
  } = useGetWarrantyPolicyTasksByPolicyIdQuery(
    dialog.info.repairProducts[0]?.purchasedProduct?.category?.warrantyPolicy?.id
      ? dialog.info.repairProducts[0]?.purchasedProduct?.category?.warrantyPolicy?.id
      : -1
  );
  const [addRepairAccessory, { isLoading: repairAccessoryLoading }] = useAddRepairAccessoryMutation();
  const [addRepairLog, { loading }] = useAddRepairLogMutation();
  const [updateTotalPrice, { loading: totalPriceLoading }] = useUpdateTotalPriceMutation();
  const params = useParams();
  const accessory = useSelector((state) => state.accessoryCart);
  const auth = useSelector((state) => state.auth);
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
    dispatch(showLoading({ content: "Đang cập nhật linh kiện..." }));
    try {
      let taskCheck = false;
      let totalPrice = 0;
      let accessoryTotalPrice = 0;

      for (let i = 0; i < accessory.accessories.length; i++) {
        accessoryTotalPrice += accessory.accessories[i].price * accessory.accessories[i].quantity;
      }

      let repairAccessoryPayload = {};
      let totalPricePayload = {};

      if (accessory.accessories.length === 0) {
        totalPricePayload = { Id: +params.id, TotalPrice: totalPrice };
        repairAccessoryPayload = [{ repairOrderId: +params.id, accessoryId: -1 }];
      } else {
        if (dialog.info.repairType.name.localeCompare("Bảo hành", "vi", { sensitivity: "base" }) !== 0) {
          for (let i = 0; i < dialog.info.repairTasks.length; i++) {
            totalPrice += dialog.info.repairTasks[i].task.price;
          }
          totalPrice += accessoryTotalPrice;
        } else {
          for (let i = 0; i < policyTasks.data.length; i++) {
            if (policyTasks.data[i].task.name.localeCompare("Đổi mới", "vi", { sensitivity: "base" }) === 0) {
              taskCheck = true;
            }
          }
          if (taskCheck === false) {
            totalPrice += accessoryTotalPrice;
          }
        }
        totalPricePayload = { Id: +params.id, TotalPrice: totalPrice };
        repairAccessoryPayload = prepareRepairAccessoryData(params.id, accessory.accessories);
      }

      // if (dialog.info.repairType.name.localeCompare("Bảo hành", "vi", { sensitivity: "base" }) !== 0) {
      //   await updateTotalPrice(totalPricePayload, { id: params.id });
      // } else {
      //   if (taskCheck === false) {
      //     totalPricePayload = { Id: +params.id, TotalPrice: totalPrice };
      //   }
      // }
      await updateTotalPrice(totalPricePayload, { id: params.id });

      await addRepairAccessory(repairAccessoryPayload, { id: params.id });

      // let logPayload = {
      //   RepairOrderId: +params.id,
      //   CreatedById: auth.userId,
      //   CreatedAt: new Date(),
      //   Info: "Cập nhật linh kiện",
      // };

      // await addRepairLog(logPayload, { id: params.id });
    } catch (err) {
      console.log(err);
    }
    dispatch(hideLoading());
    dispatch(showNotification({ message: "Cập nhật linh kiện thành công", type: "success" }));
    dispatch(hideDialog());
  };

  const handleCloseForm = () => {
    dispatch(hideDialog());
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    const lowerCaseValue = removeAccents(value.toLowerCase());
    const newSuggestions = data?.data.filter((accessory) => removeAccents(accessory.name.toLowerCase()).includes(lowerCaseValue));
    setSuggestions(newSuggestions);
  };

  if (isError || ptError) return <div>Có lỗi xảy ra!</div>;

  if (isLoading || isFetching || ptLoading || ptFetching) return <Loading />;

  return (
    <form
      className={dialog.show === true ? styles["dialog__content__box"] : styles["dialog__content__box--hidden"]}
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
      {errors.accessory && <span style={{ color: "#cc3300", fontStyle: "italic", fontSize: "14px" }}>Chưa chọn linh kiện nào</span>}
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
