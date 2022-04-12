import React from "react";
import { Outlet } from "react-router";
import BasicPage from "../components/utils/BasicPage";

const SimplePageLayout = () => {
  return (
    <BasicPage>
      <Outlet />
    </BasicPage>
  );
};

export default SimplePageLayout