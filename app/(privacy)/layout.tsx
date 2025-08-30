import Footer from "@/components/common/Footer";
import NavBar from "@/components/common/navbar/NavBar";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
}

export default layout;
