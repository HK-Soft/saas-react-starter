// bayaan-portal/src/router/RootLayout
import React from "react";
import {Outlet} from "react-router-dom";
import {GlobalLoadingBar} from "@/components/GlobalLoadingBar";

const RootLayout: React.FC = () => {
    return <>
        {/* Global loading indicators */}
        <GlobalLoadingBar/>
        <Outlet/>
    </>;
};

export default RootLayout;