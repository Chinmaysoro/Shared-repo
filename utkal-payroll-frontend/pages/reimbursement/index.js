import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import SimpleModal from '../components/Modal';
import AddReimbursement from './AddReimbursement';
import { toast } from 'react-toastify';
import { ReimbursementService, UploadService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
import { getUser } from '../../redux/helpers/user';

const Reimbursement = () => {
    const dispatch = useDispatch();
    const userData = getUser();
    const [loader, setLoader] = useState(false);
    const [visible, setVisible] = useState(false);
    const [companyValues, setCompanyValues] = useState({});
    const [title, setTitle] = useState('');
    const [page, setPage] = useState(1);
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [companyList, setCompanyList] = useState([]);
    const [totalReimbursement, setTotalReimbursement] = useState(0);
    const [fileUrl, setFileUrl] = useState('');
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
            ReimbursementService.find({
                query: { companyId: userData?.user?.companyId, $skip: offset, $limit: perPage, $sort: { createdAt: -1 }, $populate: ['createdBy', 'reimbursementType'] },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setLoader(false);
                    setCompanyList(res.data);
                    setPageCount(Math.ceil(res.total / perPage));
                    setTotalReimbursement(res.total);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    const updateStatus = (type, values) => {
        const data = {
            approvalStatus: type
        };
        setLoader(true);
        ReimbursementService.patch(
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
                toast.success('Reimbursement updated successfully.');
                fetchAll();
            })
            .catch((error) => {
                setLoader(false);
                toast.error(error.message);
            });
    };

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setOffset(selectedPage * perPage);
    };

    useEffect(() => {
        fetchAll();
    }, [offset]);

    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Reimbursement</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Employee</a>
                                </li>
                                <li className="breadcrumb-item active">Reimbursement</li>
                            </ul>
                        </div>
                        {/* <div className="col-auto float-right ml-auto">
                            <button type="button" className="btn btn-primary" onClick={() => openModal('Create Reimbursement', true, null)}>
                                <i className="pi pi-plus"></i> Reimbursement
                            </button>
                        </div> */}
                    </div>
                </div>
                <SimpleModal title={title} visible={visible} setVisible={() => setVisible(false)} body={<AddReimbursement setVisible={() => setVisible(false)} companyValues={companyValues} fetchAll={fetchAll} />}></SimpleModal>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Reimbursement Type</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col">Detail</th>
                                    <th scope="col">Document</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Approve/Reject</th>
                                </tr>
                            </thead>
                            <tbody>
                                {companyList && companyList?.length > 0 ? (
                                    companyList?.map((company, index) => (
                                        <tr key={`key-${index}`}>
                                            <th scope="row">{`${company?.createdBy?.firstName} ${company?.createdBy?.lastName}` || 'N/A'}</th>
                                            <td>{company?.reimbursementType?.name || 'N/A'} </td>
                                            <td>{company?.amount || 'N/A'}</td>
                                            <td>{company?.cause || 'N/A'}</td>
                                            <td>
                                                {company?.document || 'N/A'}
                                                {company?.document ? (
                                                    <a title="Download" style={{ float: 'right' }} className="btn btn-primary btn-sm" href={`https://dd7tft2brxkdw.cloudfront.net/${company?.document}`} target="_blank" download>
                                                        <i className="pi pi-download"></i>
                                                    </a>
                                                ) : null}
                                            </td>
                                            <td>
                                                {company.approvalStatus == 'pending' && <span style={dotWarning}></span>}
                                                {company.approvalStatus == 'approved' && <span style={dotSuccess}></span>}
                                                {company.approvalStatus == 'rejected' && <span style={dotErrror}></span>}
                                                {company?.approvalStatus || 'N/A'}
                                            </td>
                                            <td>
                                                <button className="btn btn-primary" type="button" onClick={() => openModal('Approve Reimbursement', true, company)}>
                                                    <i className="pi pi-check"></i>
                                                </button>
                                                &nbsp;
                                                <button className="btn btn-warning" type="button" onClick={() => updateStatus('rejected', company)}>
                                                    <i className="pi pi-times"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7}>
                                            <div className="alert alert-success text-center" role="alert">
                                                No reimbursement found!!!
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {totalReimbursement > 10 ? (
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

export default Reimbursement;
