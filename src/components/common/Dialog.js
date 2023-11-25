"use client";
import styles from "@/styles/main.module.scss";
import { useSelector } from "react-redux";
import NewCustomerForm from "./NewCustomerForm";
import UpdateCustomerForm from "./UpdateCustomerForm.";
import AddPurchasedProductForm from "./AddPurchasedProductForm";
import AddAccessoryForm from "./AddAccessoryForm";
import UpdateDescriptionForm from "./UpdateDescriptionForm";
import AddNewProductForm from "./AddNewProductForm";
import AddCustomerProductForm from "./AddCustomerProductForm";

const content = {
  "add-customer": <NewCustomerForm />,
  "update-customer": <UpdateCustomerForm />,
  "add-purchased-product": <AddPurchasedProductForm />,
  "add-accessory": <AddAccessoryForm />,
  "update-description": <UpdateDescriptionForm />,
  "add-new-product": <AddNewProductForm />,
  "add-customer-product": <AddCustomerProductForm />
};

export default function Dialog(props) {
  const dialog = useSelector((state) => state.dialog);

  return (
    <div className={dialog.show === true ? styles["dialog"] : styles["dialog--hidden"]}>
      <div className={styles["dialog__content"]}>
        <h1>{dialog.title}</h1>
        {content[dialog.content]}
      </div>
    </div>
  );
}
