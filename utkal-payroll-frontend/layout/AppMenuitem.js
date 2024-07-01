import { useRouter } from 'next/router';
import Link from 'next/link';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import React, { useEffect, useContext, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { MenuContext } from './context/menucontext';

const AppMenuitem = (props) => {
    const { activeMenu, setActiveMenu } = useContext(MenuContext);
    const router = useRouter();
    const item = props.item;
    const key = props.parentKey ? props.parentKey + '-' + props.index : String(props.index);
    const isActiveRoute = item.to && router.pathname === item.to;
    const active = activeMenu === key || activeMenu.startsWith(key + '-');
    // {console.log(localStorage.getItem("settings_menu"),'::::::::::::::settings_menu in menu list')}
    useEffect(() => {
        if (item.to && router.pathname === item.to) {
            setActiveMenu(key);
        }

        const onRouteChange = (url) => {
            if (item.to && item.to === url) {
                setActiveMenu(key);
            }
        };

        router.events.on('routeChangeComplete', onRouteChange);

        return () => {
            router.events.off('routeChangeComplete', onRouteChange);
        };
    }, []);

    const itemClick = (event) => {
        //avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return;
        }

        //execute command
        if (item.command) {
            item.command({ originalEvent: event, item: item });
        }

        // toggle active state
        if (item.items)
            setActiveMenu(active ? props.parentKey : key);
        else
            setActiveMenu(key);
    };

    const subMenu = item.items && item.visible !== false && (

        <CSSTransition timeout={{ enter: 1000, exit: 450 }} classNames="layout-submenu" in={props.root ? true : active} key={item.label}>
            <ul>
                {item.items.map((child, i) => {
                    return <AppMenuitem item={child} index={i} className={child.badgeClass} parentKey={key} key={child.label} />;
                })}
            </ul>
        </CSSTransition>
    );
    const clearMenu = () => {
        localStorage.setItem("settings_menu", false);
    }
    return (
        <ul >
            {localStorage.getItem("settings_menu") === "true" && item && item.items[0].label === 'Administration' && (
                <li>
                    <Link href="/admin">
                        <a onClick={clearMenu}>
                            <i className="layout-menuitem-icon pi pi-fw pi-arrow-left"></i> Back to home
                        </a>
                    </Link>
                </li>
            )}
            {item.items.map((menu, index) => (
                    <span key={index} className={(localStorage.getItem("settings_menu") === "true" && menu.label === 'Menu') || (localStorage.getItem("settings_menu") === "false" && menu.label === 'Administration') ? 'd-none' : ''}>

                    {localStorage.getItem("settings_menu") === "true" && menu.label === 'Menu' ? <p> <i className='layout-menuitem-icon pi pi-fw pi-arrow-left'></i> Back to home</p> : ''}

                    <p className={menu.label == 'Administration' ? 'sidebarLabel' : "tpl"}><span className="layout-menuitem-text">{menu.label}</span></p>
                    {menu?.items?.map((subMenu, i) => (
                        <li className="active-menuitem" key={i}>
                            <span role="presentation" className="p-ink"></span>
                            <Link href={subMenu.to}>
                                <a key={i} className={`p-ripple ${router.pathname === subMenu.to ? 'active' : ''}`} tabIndex="0">
                                    <i className={`layout-menuitem-icon pi pi-fw ${subMenu.icon}`}></i>
                                    <span className="layout-menuitem-text">{subMenu.label}</span>
                                </a>
                            </Link>
                        </li>
                    ))}
                </span>
            ))}
        </ul>
    );
};

export default AppMenuitem;
