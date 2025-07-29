import { Fragment, useState } from "react";
import Header from "../layout/Header/Header";
import { Outlet, useLocation } from "react-router-dom";
import SideBar from "../layout/SideBar/SideBar";
import { Plus } from "lucide-react";
import styles from "./RootLayout.module.css";

export default function RootLayout() {
  const location = useLocation();
  const [currentFormType, setCurrentFormType] = useState("payment_order");

  const handleFormTypeChange = (formType) => {
    setCurrentFormType(formType);
  };

  const entriesCustomActions = (
    <div className={styles.buttonContainer}>
      <div className={styles.buttonLabel}>Adaugă</div>
      <div className={styles.tooltipContainer}>
        <button
          onClick={() => {
            const addButton = document.querySelector(
              '[aria-label="Add Entry"]'
            );
            if (addButton) addButton.click();
          }}
          className={`${styles.button} ${styles.buttonAdd}`}
          aria-label="Add Entry Sidebar"
        >
          <Plus className={styles.icon} />
        </button>
        <div className={styles.tooltip}>
          <div className={styles.tooltipContent}>Adaugă o nouă intrare</div>
        </div>
      </div>
    </div>
  );

  const isFormPage = location.pathname === "/form";
  const isEntriesPage = location.pathname === "/entries";

  return (
    <Fragment>
      <Header />
      {(isFormPage || isEntriesPage) && (
        <SideBar
          currentFormType={currentFormType}
          onFormTypeChange={handleFormTypeChange}
          showFormTypes={isFormPage}
          showZoomControls={isFormPage}
          showFormActions={isFormPage}
          customActions={isEntriesPage ? entriesCustomActions : null}
        />
      )}
      <Outlet
        context={{ currentFormType, onFormTypeChange: handleFormTypeChange }}
      />
    </Fragment>
  );
}
