// import getConfig from 'next/config';
import React, { useContext, useEffect } from 'react';
import AppMenuitem from './AppMenuitem';
// import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { getUser } from '../redux/helpers/user';

// import Link from 'next/link';

const AppMenu = () => {

    // const { layoutConfig } = useContext(LayoutContext);
    const userData = getUser();
    // const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const model = [
        {
            items: [
                {
                    label: 'Menu',
                    icon: 'pi pi-fw pi-users',
                    items: [
                        {
                            label: 'Dashboard',
                            icon: 'pi pi-fw pi-home',
                            to: '/admin'
                        },
                        {
                            label: 'Employee',
                            icon: 'pi pi-fw pi-users',
                            to: '/employee'
                        },
                        {
                            label: 'Attendance',
                            icon: 'pi pi-fw pi-id-card',
                            to: '/attendance'
                        },
                        {
                            label: 'Attendance Status',
                            icon: 'pi pi-fw pi-money-bill',
                            to: '/attendance-status'
                        },
                        {
                            label: 'Shift Status',
                            icon: 'pi pi-fw pi-money-bill',
                            to: '/shift-status'
                        },
                        {
                            label: 'Leave',
                            icon: 'pi pi-fw pi-user-minus',
                            to: '/leave'
                        },
                        {
                            label: 'Reimbursement',
                            icon: 'pi pi-fw pi-dollar',
                            to: '/reimbursement'
                        },
                        {
                            label: 'Resignation',
                            icon: 'pi pi-fw pi-file-excel',
                            to: '/resignation'
                        },
                        {
                            label: 'Salary Request',
                            icon: 'pi pi-fw pi-dollar',
                            to: '/salary-request'
                        },
                        {
                            label: 'Payslip',
                            icon: 'pi pi-fw pi-wallet',
                            to: '/payroll'
                        },
                        {
                            label: 'Payroll Detail',
                            icon: 'pi pi-fw pi-dollar',
                            to: '/payroll-detail'
                        },
                        {
                            label: 'Holidays',
                            icon: 'pi pi-fw pi-calendar-times',
                            to: '/holidays'
                        },
                        {
                            label: 'Reports',
                            icon: 'pi pi-fw pi-chart-line',
                            to: '/reports'
                        },
                        {
                            label: 'Announcement',
                            icon: 'pi pi-fw pi-volume-off',
                            to: '/announcement'
                        },
                        {
                            label: 'Admin Settings',
                            icon: 'pi pi-fw pi-cog',
                            to: '/admin-settings'
                        },
                        // userData?.user?.role === 2
                        //     ? ''
                        //     : {
                        //           label: 'Call Details',
                        //           icon: 'pi pi-fw pi-book',
                        //           to: '/call-history'
                        //       }
                    ]
                }
            ]
        },
        {
            items: [
                {
                    label: 'Administration',
                    icon: 'pi pi-fw pi-cog',
                    items: [
                        {
                            label: 'Company',
                            icon: 'pi pi-fw pi-building',
                            to: '/company'
                        },
                        {
                            label: 'Department',
                            icon: 'pi pi-fw pi-sitemap',
                            to: '/department'
                        },
                        {
                            label: 'Designation',
                            icon: 'pi pi-fw pi-user',
                            to: '/designation'
                        },
                        {
                            label: 'Grade',
                            icon: 'pi pi-fw pi-box',
                            to: '/grade'
                        },
                        {
                            label: 'Attendance',
                            icon: 'pi pi-fw pi-check-circle',
                            to: '/attendance-setting'
                        },
                        // {
                        //     label: 'Leave Balance',
                        //     icon: 'pi pi-fw pi-history',
                        //     to: '/leave-balance'
                        // },
                        {
                            label: 'Leave Type',
                            icon: 'pi pi-fw pi-chart-pie',
                            to: '/leave-type'
                        },
                        {
                            label: 'Leave Policy',
                            icon: 'pi pi-fw pi-id-card',
                            to: '/leave-policy'
                        },
                        {
                            label: 'Leave Detail',
                            icon: 'pi pi-fw pi-calendar-minus',
                            to: '/leave-detail'
                        },
                        {
                            label: 'Shift Applicability',
                            icon: 'pi pi-fw pi-history',
                            to: '/shift-applicability'
                        },
                        {
                            label: 'Payroll',
                            icon: 'pi pi-fw pi-dollar',
                            to: '/salary'
                        },
                        {
                            label: 'Document Type',
                            icon: 'pi pi-fw pi-book',
                            to: '/document-type'
                        },
                        {
                            label: 'Reimbursement',
                            icon: 'pi pi-fw pi-dollar',
                            to: '/reimbursement-setting'
                        },
                        {
                            label: 'Resignation',
                            icon: 'pi pi-fw pi-file-excel',
                            to: '/resignation-setting'
                        },
                        {
                            label: 'Salary Component',
                            icon: 'pi pi-fw pi-dollar',
                            to: '/salary-component'
                        },
                        {
                            label: 'Pay Group',
                            icon: 'pi pi-fw pi-wallet',
                            to: '/pay-group'
                        }
                        // {
                        //     label: 'Leave',
                        //     icon: 'pi pi-fw pi-building',
                        //     to: '/leave-setting'
                        // }
                    ]
                }
            ]
        }
    ];

    const superAdminModel = [
        {
            items: [
                {
                    label: 'Menu',
                    icon: 'pi pi-fw pi-users',
                    items: [
                        {
                            label: 'Dashboard',
                            icon: 'pi pi-fw pi-home',
                            to: '/super-admin'
                        },
                        {
                            label: 'Company',
                            icon: 'pi pi-fw pi-building',
                            to: '/company-admin'
                        },
                        {
                            label: 'Leads',
                            icon: 'pi pi-fw pi-database',
                            to: '/leads'
                        }
                    ]
                }
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {userData?.user?.role === 65535
                    ? superAdminModel.map((item, i) => {
                          return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                      })
                    : model.map((item, i) => {
                          return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                      })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
