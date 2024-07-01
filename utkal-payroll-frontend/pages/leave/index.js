import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import SimpleModal from '../components/Modal';
import AddLeave from './AddLeave';
import { LeaveService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
import { getUser } from '../../redux/helpers/user';

const LeaveComponent = () => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [visible, setVisible] = useState(false);
    const [leaveValues, setLeaveValues] = useState({});
    const [title, setTitle] = useState('');
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [leaveList, setLeaveList] = useState([]);
    const [totalLeaves, setTotalLeaves] = useState(0);
    const dotSuccess = {
        display: 'inline-block',
        borderRadius: '50%',
        width: '50%',
        backgroundColor: '#449D44',
        height: '10px',
        width: '10px',
        margin: '0 2px'
    };
    const dotWarning = {
        display: 'inline-block',
        borderRadius: '50%',
        width: '50%',
        backgroundColor: '#F0AD4E',
        height: '10px',
        width: '10px',
        margin: '0 2px'
    };
    const dotErrror = {
        display: 'inline-block',
        borderRadius: '50%',
        width: '50%',
        backgroundColor: '#D9534F',
        height: '10px',
        width: '10px',
        margin: '0 2px'
    };

    const openModal = (type, val, dept) => {
        setVisible(val);
        setTitle(type);
        setLeaveValues(dept);
    };

    const fetchAllLeaves = async () => {
        if (userData?.user?.companyId) {
            setLoader(true);
            LeaveService.find({
                query: { companyId: userData?.user?.companyId, $skip: offset, $limit: perPage, $sort: { createdAt: -1 }, $populate: ['createdBy', 'leaveType'] },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setLoader(false);
                    setLeaveList(res.data);
                    setPageCount(Math.ceil(res.total / perPage));
                    setTotalLeaves(res.total);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    // const deleteCompany = (values) => {
    //     setLoader(true);
    //     LeaveService.remove(values?._id, {
    //         headers: {
    //             Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
    //         }
    //     })
    //         .then((res) => {
    //             setLoader(false);
    //             toast.success('Leave deleted successfully.');
    //             fetchAllLeaves();
    //         })
    //         .catch((error) => {
    //             setLoader(false);
    //             toast.error(error?.message);
    //         });
    // };

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setOffset(selectedPage * perPage);
    };

    useEffect(() => {
        fetchAllLeaves();
    }, [offset]);

    const updateStatus = (type, values) => {
        const data = {
            approvalStatus: type
        };
        setLoader(true);
        LeaveService.patch(
            values?._id,
            {
                ...data
            },
            {
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            }
        )
            .then((res) => {
                setLoader(false);
                toast.success('Status updated successfully.');
                fetchAllLeaves();
            })
            .catch((error) => {
                setLoader(false);
                toast.error(error.message);
            });
    };

    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Leave</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link href="/employee">Employee</Link>
                                </li>
                                <li className="breadcrumb-item active">Leave</li>
                            </ul>
                        </div>
                        {/* <div className="col-auto float-right ml-auto">
                            <button type="button" className="btn btn-primary" onClick={() => openModal('Add Leave', true, null)}>
                                <i className="pi pi-plus"></i> Add Leave
                            </button>
                        </div> */}
                    </div>
                </div>
                <SimpleModal title={title} visible={visible} setVisible={() => setVisible(false)} body={<AddLeave setVisible={() => setVisible(false)} leaveValues={leaveValues} fetchAllLeaves={fetchAllLeaves} />}></SimpleModal>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">From</th>
                                    <th scope="col">To</th>
                                    <th scope="col">Reason</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Leave Day</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Approve/Reject</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaveList && leaveList.length > 0 ? (
                                    leaveList?.map((company, index) => (
                                        <tr key={`key-${index}`}>
                                            <th scope="row">{`${company?.createdBy?.firstName} ${company?.createdBy?.lastName}` || 'N/A'}</th>
                                            <td scope="row">{company?.startDate ? moment(company?.startDate).format('DD-MM-YYYY') : 'N/A'}</td>
                                            <td scope="row">{company?.endDate ? moment(company?.endDate).format('DD-MM-YYYY') : 'N/A'}</td>
                                            <td scope="row">{company?.reason || 'N/A'}</td>
                                            <td scope="row">
                                                {company.approvalStatus == 'pending' && <span style={dotWarning}></span>}
                                                {company.approvalStatus == 'approved' && <span style={dotSuccess}></span>}
                                                {company.approvalStatus == 'rejected' && <span style={dotErrror}></span>}
                                                {company?.approvalStatus || 'N/A'}
                                            </td>
                                            <td scope="row">{company?.leaveDay || 'N/A'}</td>
                                            <td scope="row">{company?.leaveType?.name || 'N/A'}</td>
                                            <td>
                                                <button title="Approve" className="btn btn-primary" type="button" onClick={() => openModal('Approve Leave', true, company)}>
                                                    <i className="pi pi-check"></i>
                                                </button>
                                                &nbsp;
                                                <button title="Reject" className="btn btn-warning" type="button" onClick={() => updateStatus('rejected', company)}>
                                                    <i className="pi pi-times"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8}>
                                            <div className="alert alert-success text-center" role="alert">
                                                No leave found!!!
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {totalLeaves > 10 ? (
                            <ReactPaginate
                                previousLabel={'<'}
                                nextLabel={'>'}
                                breakLabel={'...'}
                                breakClassName={'break-me'}
                                pageCount={pageCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageClick}
                                containerClassName={'pagination'}
                                activeClassName={'active'}
                            />
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveComponent;
