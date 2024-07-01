import React, { useEffect, useState } from 'react';
import { UserService, AttendanceService, LeaveService, ReimbursementService, ResignationService, AdvanceSalaryService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
import { getUser } from '../../redux/helpers/user';

const AdminDashboard = () => {
    const userData = getUser();
    const [total, setTotal] = useState([]);
    const [loader, setLoader] = useState(false);

    const fetchAll = () => {
        const data = {
            headers: { Authorization: `Bearer ${TokenService.getLocalAccessToken()}` }
        };
        if (userData?.user?.companyId) {
            const company_id = {
                query: {
                    companyId: userData?.user?.companyId
                }
            };
            setLoader(true);
            try {
                Promise.allSettled([
                    UserService.find({
                        query: {
                            status: 'active',
                            companyId: userData?.user?.companyId
                        },
                        ...data
                    }),
                    AttendanceService.find({ ...data, ...company_id }),
                    LeaveService.find({ ...data, ...company_id }),
                    ReimbursementService.find({ ...data, ...company_id }),
                    ResignationService.find({ ...data, ...company_id }),
                    AdvanceSalaryService.find({ ...data, ...company_id })
                ])
                    .then((result) => {
                        setLoader(false);
                        const successResponse = [];
                        const title = ['Employees', 'Attendance', 'Leave', 'Reimbursement', 'Resignation', 'Salary Request'];
                        result.map((res, index) => {
                            if (res?.status === 'fulfilled') {
                                title.map((data, i) => {
                                    if (index === i) {
                                        successResponse.push({ title: data, total: res?.value?.total });
                                    }
                                });
                            } else {
                                successResponse.push({ title: data, total: 0 });
                            }
                        });
                        setTotal(successResponse);
                    })
                    .catch((error) => {
                        setLoader(false);
                        setTotal([]);
                    });
            } catch (error) {
                setLoader(false);
            }
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);
    return (
        <div className="content container-fluid">
            {/* <!-- Page Header --> */}
            <div className="page-header">
                <div className="row">
                    <div className="col-sm-12">
                        <h3 className="page-title">
                            Welcome to <span style={{ color: '#007bff' }}>Smart Link!</span>
                        </h3>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item active">Dashboard</li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* <!-- /Page Header --> */}

            <div className="row">
                {loader ? (
                    <div className="spinner-wrapper text-center w-100 mt-5">
                        <div ClassName="spinner-border text-primary" role="status">
                            <span ClassName="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : total?.length > 0 ? (
                    total?.map((data, index) => {
                        return (
                            <div key={data?.title} className="col-md-6 col-sm-6 col-lg-6 col-xl-3 mb-4">
                                <div className="card dash-widget">
                                    <div className="card-body p-0">
                                        <span className="dash-widget-icon">
                                            <i className="fa fa-cubes"></i>
                                        </span>
                                        <div className="dash-widget-info">
                                            <p> {data?.title}</p>
                                            <h3 className="m-0">{data?.total}</h3>
                                            <button className="p-link layout-topbar-button d-card-icon-box">
                                                {' '}
                                                <i className="pi pi-users"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="alert alert-success text-center" role="alert">
                        No data found!!!
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
