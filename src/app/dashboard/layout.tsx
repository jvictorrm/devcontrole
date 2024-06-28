import { ReactNode } from "react";
import DashboardHeader from "./components/header";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <DashboardHeader />
      {children}
    </>
  );
};

export default DashboardLayout;
