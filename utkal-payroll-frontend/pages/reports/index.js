import React, { useState, useEffect } from 'react';
import SimpleModal from '../components/Modal';
import { getUser } from '../../redux/helpers/user';
import TokenService from '../../redux/services/token.service';
import UserWise from './userWise';
import DailyWise from './dailyWise';
import CompanyWise from './companyWise';

const ReportComponent = () => {
    const userData = getUser();
    const [title, setTitle] = useState('');
    const [dailyReportVisible, setDailyReportVisible] = useState(false);
    const [userReportVisible, setUserReportVisible] = useState(false);
    const [companyReportVisible, setCompanyReportVisible] = useState(false);

    const openModal = (type, status) => {
        console.log(type, status)
        if (type === 'Daily wise report') {
            setDailyReportVisible(!dailyReportVisible);
        }
        if (type === 'User wise report') {
            setUserReportVisible(!userReportVisible);
        }
        if (type === 'Company wise report') {
            setCompanyReportVisible(!companyReportVisible);
        }
        setTitle(type);
    };

    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Reports Gallery</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Employee</a>
                                </li>
                                <li className="breadcrumb-item active">Reports</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-6 mb-3">
                        <div className="card" style={{ padding: 0 }}>
                            <div className="card-header"><i className="pi pi-file-o"></i> Attendance</div>
                            <div className="card-body">
                                <p>
                                    <a style={{cursor:"pointer",color:"blue"}} onClick={() => openModal('Daily wise report', true)}>Daily wise report</a>
                                </p>
                                <p>
                                    <a style={{cursor:"pointer",color:"blue"}} onClick={() => openModal('User wise report', true)}>User wise report</a>
                                </p>
                                <p>
                                    <a style={{cursor:"pointer",color:"blue"}} onClick={() => openModal('Company wise report', true)}>Company wise report</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <SimpleModal title={title} visible={dailyReportVisible} setVisible={() => setDailyReportVisible(false)} body={<DailyWise title={title} dailyReportVisible={dailyReportVisible} />}></SimpleModal>

                <SimpleModal title={title} visible={userReportVisible} setVisible={() => setUserReportVisible(false)} body={<UserWise title={title} userReportVisible={userReportVisible} />}></SimpleModal>

                <SimpleModal title={title} visible={companyReportVisible} setVisible={() => setCompanyReportVisible(false)} body={<CompanyWise title={title} companyReportVisible={companyReportVisible} />}></SimpleModal>
            </div>
        </div>
    );
};

export default ReportComponent;
