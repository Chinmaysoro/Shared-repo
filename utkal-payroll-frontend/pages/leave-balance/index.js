import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import SimpleModal from '../components/Modal';
import AddLeaveBalance from './AddLeaveBalance';
import { LeaveBalanceService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
import { convertUTCToLocalTime } from '../../redux/helpers/dateHelper';
import { getUser } from '../../redux/helpers/user';

const LeaveBalance = () => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [visible, setVisible] = useState(false);
    const [componentValues, setComponentValues] = useState({});
    const [title, setTitle] = useState('');
    const [page, setPage] = useState(1);
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [leaveBalanceList, setLeaveBalanceList] = useState([]);
    const [totalLeaveBalance, setTotalLeaveBalance] = useState(0);

    const openModal = (type, val, dept) => {
        setVisible(val);
        setTitle(type);
        setComponentValues(dept);
    };

    const fetchAllLeaveBalance = async () => {
        if (userData?.user?.companyId) {
            setLoader(true);
            LeaveBalanceService.find({
                query: {
                    companyId: userData?.user?.companyId,
                    $skip: offset,
                    $limit: perPage,
                    $sort: { createdAt: -1 },
                    $populate: ['payGroupId', 'leaveType']
                },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setLoader(false);
                    setLeaveBalanceList(res?.data);
                    setTotalLeaveBalance(res?.total);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    const deleteLeaveBalance = (values) => {
        setLoader(true);
        LeaveBalanceService.remove(values?._id, {
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                toast.success('Leave balance deleted successfully.');
                fetchAllLeaveBalance();
            })
            .catch((error) => {
                setLoader(false);
                toast.error(error?.message);
            });
    };

    useEffect(() => {
        fetchAllLeaveBalance();
    }, []);

    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Leave Balance</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Administration</a>
                                </li>
                                <li className="breadcrumb-item active">Leave Balance</li>
                            </ul>
                        </div>
                        <div className="col-auto float-right ml-auto">
                            <button type="button" className="btn btn-primary" onClick={() => openModal('Add Leave Balance', true, null)}>
                                <i className="pi pi-plus"></i> Add Leave Balance
                            </button>
                        </div>
                    </div>
                </div>
                <SimpleModal
                    title={title}
                    visible={visible}
                    setVisible={() => setVisible(false)}
                    body={<AddLeaveBalance setVisible={() => setVisible(false)} componentValues={componentValues} fetchAllLeaveBalance={fetchAllLeaveBalance} />}
                ></SimpleModal>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Leave Type</th>
                                    <th scope="col">Paygroup</th>
                                    <th scope="col">Balance</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaveBalanceList && leaveBalanceList?.length > 0 ? (
                                    leaveBalanceList?.map((data, index) => (
                                        <tr key={`key-${index}`}>
                                            <th scope="row">{data?.leaveType?.name || 'N/A'}</th>
                                            <td>{data?.payGroupId?.name || 'N/A'}</td>
                                            <td>{data?.balance || 'N/A'}</td>
                                            <td>
                                                <button className="btn btn-primary" type="button" onClick={() => openModal('Update Leave Balance', true, data)}>
                                                    <i className="pi pi-pencil"></i>
                                                </button>
                                                &nbsp;
                                                <button className="btn btn-warning" type="button" onClick={() => deleteLeaveBalance(data)}>
                                                    <i className="pi pi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="alert alert-success text-center" role="alert">
                                                No leave balance found!!!
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveBalance;
