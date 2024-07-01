import getConfig from 'next/config';
import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    return (
        <div className="layout-footer">
            <img src={`${contextPath}/layout/images/Utkal_Logo_Icon.svg`} alt="Logo" height="20" className="mr-2" />
            <span className="font-medium ml-2"><span style={{color:"#007bff"}}>Smart Link</span></span>
        </div>
    );
};

export default AppFooter;
