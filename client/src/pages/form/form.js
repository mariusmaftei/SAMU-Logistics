import { useState } from "react";
import SideBar from "../../components/UI/SideBar/SideBar";
import ProposalForm from "../../components/Form/proposal-form";
import BudgetCommitmentForm from "../../components/Form/budget-commitment-form";
import PaymentOrderForm from "../../components/Form/payment-order-form";
import styles from "../form/form.module.css";

export default function Form() {
  const [currentFormType, setCurrentFormType] = useState("payment_order");
  const [formData, setFormData] = useState({
    expenseNature: "",
    billDate: "",
    amountDue: "",
    beneficiaryName: "",
    accountNumber: "",
    bankNumber: "",
    address: "",
    treasury: "",
    treasuryNumber: "",
    roCode: "",
    amount: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleReset = () => {
    setFormData({
      dateIssued: "",
    });
  };

  const handleFormTypeChange = (formType) => {
    setCurrentFormType(formType);
  };

  const handleDateKeyDown = (e) => {
    // Allow: backspace, delete, tab, escape, enter, numbers
    if (
      [46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39) ||
      // Allow numbers
      (e.keyCode >= 48 && e.keyCode <= 57) ||
      (e.keyCode >= 96 && e.keyCode <= 105)
    ) {
      return;
    }
    e.preventDefault();
  };

  const renderForm = () => {
    switch (currentFormType) {
      case "proposal":
        return (
          <ProposalForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleDateKeyDown={handleDateKeyDown}
          />
        );
      case "budget_commitment":
        return (
          <BudgetCommitmentForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleDateKeyDown={handleDateKeyDown}
          />
        );
      default:
        return (
          <PaymentOrderForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleDateKeyDown={handleDateKeyDown}
          />
        );
    }
  };

  return (
    <div className={styles.container}>
      <SideBar
        onReset={handleReset}
        currentFormType={currentFormType}
        onFormTypeChange={handleFormTypeChange}
      />
      <main className={styles.main}>{renderForm()}</main>
    </div>
  );
}
