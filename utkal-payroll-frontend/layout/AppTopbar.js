import getConfig from 'next/config';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import Router, { useRouter } from 'next/router';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { LayoutContext } from './context/layoutcontext';
import { userActions } from '../redux/actions/user.actions';
import { getUser } from '../redux/helpers/user';

const AppTopbar = forwardRef((props, ref) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const router = useRouter();
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const [userEmail, setUserEmail] = useState("");
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const menu = useRef(null);
    const toast = useRef(null);
    const items = [{
        label: 'Change Password',
        icon: 'pi pi-key',
        command: () => { router.push("/change-password") }
    }, {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => logout()
    }];

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const logout = () => {
        dispatch(userActions.logout());
        window.localStorage.clear();
        router.push('/');
    };

    return (
        <div className="layout-topbar">
            {/* <Link href="/"> */}
                <a className="layout-topbar-logo" href='javascript:void(0)'>
                    <>
                        <img src={`${contextPath}/layout/images/loginlogo.png`}  height={'92px'} widt={'true'} alt="logo" />
                        {/* <span style={{color:"#fff"}}>Smart Link</span> */}
                    </>
                </a>
            {/* </Link> */}

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <img src={`${contextPath}/layout/images/menuFold.svg`} />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>
            {/* <div className='topbar-search-box'>
                <input type="text" className='form-control' placeholder='Search here...' />
                <i className="pi pi-search"></i>
            </div> */}

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>

                <button type="button" className="p-link mr-3"><img src={`${contextPath}/layout/images/fi_help-circle.svg`} /></button>
                <button type="button" className="p-link mr-4"><img src={`${contextPath}/layout/images/notification.svg`} /></button>

                <Menu model={items} popup ref={menu} id="popup_menu" />
                <span className='rightbar-profile-info'>{userData?.user?.firstName ? userData?.user?.firstName : null} {userData?.user?.lastName ? userData?.user?.lastName : null}</span>
                <span className='active-profile-badge'></span>
                <button type="button" className="p-link layout-topbar-button" label="Show" icon="pi pi-bars" onClick={(event) => menu.current.toggle(event)} aria-controls="popup_menu" aria-haspopup>

                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </button>
                {/* <Button label="Show" icon="pi pi-bars" onClick={(event) => menu.current.toggle(event)} aria-controls="popup_menu" aria-haspopup /> */}
                {/* <button type="button" className="p-link layout-topbar-button" onClick={logout}>
                    <i className="pi pi-sign-out"></i>
                    <span>Logout</span>
                </button> */}
                {/* <Link href="/documentation">
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-cog"></i>
                        <span>Settings</span>
                    </button>
                </Link> */}
            </div>
        </div>
    );
});

export default AppTopbar;
