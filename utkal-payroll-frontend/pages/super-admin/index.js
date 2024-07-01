import React from 'react';

const AdminDashboard = () => {
    const cards = [
        { name: 'Companies', total: '17' },
        { name: 'Employees', total: '1125' },
        { name: 'Leave', total: '43' },
        { name: 'Reimbursement', total: '29' },
        { name: 'Attendance', total: '342' },
        { name: 'Salary Request', total: '17' }
    ];
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
                {cards.map((item, i) => {
                    return (
                        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3 mt-3" key={item?.name}>
                            <div className="card dash-widget">
                                <div className="card-body p-1">
                                    <span className="dash-widget-icon">
                                        <i className="fa fa-cubes"></i>
                                    </span>
                                    <div className="dash-widget-info">
                                        <p> {item?.name}</p>
                                        <h3 className="m-0">{item?.total}</h3>
                                        <button className="p-link layout-topbar-button d-card-icon-box">
                                            {' '}
                                            <i className="pi pi-users"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminDashboard;
