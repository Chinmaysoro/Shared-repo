import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEventListener, useUnmountEffect } from 'primereact/hooks';
import { classNames, DomHandler } from 'primereact/utils';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppFooter from './AppFooter';
import AppSidebar from './AppSidebar';
import AppTopbar from './AppTopbar';
import AppConfig from './AppConfig';
import { LayoutContext } from './context/layoutcontext';
import PrimeReact from 'primereact/api';
import { getUser } from '../redux/helpers/user';
import TokenService from '../redux/services/token.service';
import LoginPage from '../pages/auth/login';
import RegisterPage from '../pages/register';

const Layout = (props) => {
    const { layoutConfig, layoutState, setLayoutState } = useContext(LayoutContext);
    const isAuthenticated = useSelector((state) => state?.user?.accessToken);
    const [userInfo, setUserInfo] = useState({});
    const topbarRef = useRef(null);
    const sidebarRef = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const router = useRouter();
    const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] = useEventListener({
        type: 'click',
        listener: (event) => {
            const isOutsideClicked = !(sidebarRef.current.isSameNode(event.target) || sidebarRef.current.contains(event.target) || topbarRef.current.menubutton.isSameNode(event.target) || topbarRef.current.menubutton.contains(event.target));

            if (isOutsideClicked) {
                hideMenu();
            }
        }
    });

    // useEffect(() => {
    //     if (TokenService.getLocalAccessToken()) {
    //         if (isAuthenticated) {
    //             router.push('/employee');
    //         } else {
    //             router.push('/');
    //         }
    //     }
    // }, [isAuthenticated]);

    const getUserInfo = () => {
        let userInfo = getUser();
        setUserInfo(userInfo);
    };

    const [bindProfileMenuOutsideClickListener, unbindProfileMenuOutsideClickListener] = useEventListener({
        type: 'click',
        listener: (event) => {
            const isOutsideClicked = !(
                topbarRef.current.topbarmenu.isSameNode(event.target) ||
                topbarRef.current.topbarmenu.contains(event.target) ||
                topbarRef.current.topbarmenubutton.isSameNode(event.target) ||
                topbarRef.current.topbarmenubutton.contains(event.target)
            );

            if (isOutsideClicked) {
                hideProfileMenu();
            }
        }
    });

    const hideMenu = () => {
        setLayoutState((prevLayoutState) => ({ ...prevLayoutState, overlayMenuActive: false, staticMenuMobileActive: false, menuHoverActive: false }));
        unbindMenuOutsideClickListener();
        unblockBodyScroll();
    };

    const hideProfileMenu = () => {
        setLayoutState((prevLayoutState) => ({ ...prevLayoutState, profileSidebarVisible: false }));
        unbindProfileMenuOutsideClickListener();
    };

    const blockBodyScroll = () => {
        DomHandler.addClass('blocked-scroll');
    };

    const unblockBodyScroll = () => {
        DomHandler.removeClass('blocked-scroll');
    };

    useEffect(() => {
        if (layoutState.overlayMenuActive || layoutState.staticMenuMobileActive) {
            bindMenuOutsideClickListener();
        }

        layoutState.staticMenuMobileActive && blockBodyScroll();
    }, [layoutState.overlayMenuActive, layoutState.staticMenuMobileActive]);

    useEffect(() => {
        if (layoutState.profileSidebarVisible) {
            bindProfileMenuOutsideClickListener();
        }
    }, [layoutState.profileSidebarVisible]);

    useEffect(() => {
        router.events.on('routeChangeComplete', () => {
            hideMenu();
            hideProfileMenu();
        });
        getUserInfo();
    }, []);

    PrimeReact.ripple = true;

    useUnmountEffect(() => {
        unbindMenuOutsideClickListener();
        unbindProfileMenuOutsideClickListener();
    });

    const containerClass = classNames('layout-wrapper', {
        'layout-theme-light': layoutConfig.colorScheme === 'light',
        'layout-theme-dark': layoutConfig.colorScheme === 'dark',
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive,
        'p-input-filled': layoutConfig.inputStyle === 'filled',
        'p-ripple-disabled': !layoutConfig.ripple
    });

    return (
        <React.Fragment>
            <Head>
                <title>Smart Link | Streamline Your HR Management with Our Advanced Application</title>
                <meta charSet="UTF-8" />
                <meta
                    name="description"
                    content="Smart Link is a user-friendly HR management application that streamlines your human resource processes, from employee onboarding to benefits administration and time tracking. Automate your HR tasks, save time, and improve efficiency with our advanced tools and features."
                />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <meta property="og:type" content="website"></meta>
                <meta property="og:title" content="Smart Link"></meta>
                <link rel="icon" href={`${contextPath}/layout/images/Utkal_Logo_Icon.svg`} type="image/x-icon"></link>
                <link rel="preconnect" href="https://fonts.googleapis.com"></link>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
                <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet"></link>
            </Head>
            {router.pathname === '/' ? (
                <>
                    <div className="layout-main">
                        <LoginPage />
                    </div>
                    {/* <AppFooter /> */}
                </>
            ) : router.pathname === '/register' ? (
                <div className="layout-main">
                    <RegisterPage />
                </div>
            ) : (
                <div className={containerClass}>
                      <AppTopbar ref={topbarRef} />
                    <div ref={sidebarRef}  id="fff" className={localStorage.getItem("settings_menu") === "true" ? 'layout-sidebar menu-hide' : 'layout-sidebar'}>
                     <AppSidebar />
                    </div>
                    <div className="layout-main-container">
                        <div className="layout-main">{props.children}</div>
                        <AppFooter />
                    </div>
                    <AppConfig />
                    <div className="layout-mask"></div>
                </div>
            )}
        </React.Fragment>
    );
};

export default Layout;
