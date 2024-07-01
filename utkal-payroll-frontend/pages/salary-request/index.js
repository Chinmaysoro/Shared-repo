import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import SimpleModal from '../components/Modal';
import AddSalaryRequest from './AddSalaryRequest';
import { toast } from 'react-toastify';
import moment from 'moment';
import { AdvanceSalaryService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
import { getUser } from '../../redux/helpers/user';

const SalaryRequest = () => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [visible, setVisible] = useState(false);
    const [companyValues, setCompanyValues] = useState({});
    const [title, setTitle] = useState('');
    const [page, setPage] = useState(1);
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [salaryRequestList, setSalaryRequestList] = useState([]);
    const [totalSalaryRequest, setTotalSalaryRequest] = useState(0);
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
        setCompanyValues(dept);
    };

    const fetchAll = async () => {
        if (userData?.user?.companyId) {
            setLoader(true);
            AdvanceSalaryService.find({
                query: { companyId: userData?.user?.companyId, $skip: offset, $limit: perPage, $sort: { createdAt: -1 }, $populate: ['createdBy'] },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setLoader(false);
                    setSalaryRequestList(res.data);
                    setPageCount(Math.ceil(res.total / perPage));
                    setTotalSalaryRequest(res.total);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setOffset(selectedPage * perPage);
    };

    useEffect(() => {
        fetchAll();
    }, [offset]);

    const updateStatus = (type, values) => {
        const data = {
            approvalStatus: type
        };
        setLoader(true);
        AdvanceSalaryService.patch(
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
                toast.success('Salary request updated successfully.');
                fetchAll();
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
                            <h3 className="page-title">Salary Request</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Employee</a>
                                </li>
                                <li className="breadcrumb-item active">Salary Request</li>
                            </ul>
                        </div>
                        {/* <div className="col-auto float-right ml-auto">
                            <button type="button" className="btn btn-primary" onClick={() => openModal('Add Salary Request', true, null)}>
                                <i className="pi pi-plus"></i> Add Leave
                            </button>
                        </div> */}
                    </div>
                </div>
                <SimpleModal title={title} visible={visible} setVisible={() => setVisible(false)} body={<AddSalaryRequest setVisible={() => setVisible(false)} companyValues={companyValues} fetchAll={fetchAll} />}></SimpleModal>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col">EMI</th>
                                    <th scope="col">Reason</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Approve/Reject</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salaryRequestList && salaryRequestList.length > 0 ? (
                                    salaryRequestList?.map((company, index) => (
                                        <tr key={`key-${index}`}>
                                            <th scope="row">{`${company?.createdBy?.firstName} ${company?.createdBy?.lastName}` || 'N/A'}</th>
                                            <td scope="row">{company?.amount || 'N/A'}</td>
                                            <td scope="row">{company?.emi || 'N/A'}</td>
                                            <td scope="row">{company?.reason || 'N/A'}</td>
                                            <td scope="row">
                                                {company.approvalStatus == 'pending' && <span style={dotWarning}></span>}
                                                {company.approvalStatus == 'approved' && <span style={dotSuccess}></span>}
                                                {company.approvalStatus == 'rejected' && <span style={dotErrror}></span>}
                                                {company?.approvalStatus || 'N/A'}
                                            </td>
                                            <td>
                                                <button title="Approve" className="btn btn-primary" type="button" onClick={() => openModal('Approve Salary Request', true, company)}>
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
                                        <td colSpan={6}>
                                            <div className="alert alert-success text-center" role="alert">
                                                No salary request found!!!
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {totalSalaryRequest > 10 ? (
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

export default SalaryRequest;
