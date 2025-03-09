import React, { Fragment } from "react";
import Header from "../Header/Header";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <Fragment>
      <Header />
      <Outlet />
    </Fragment>
  );
}
