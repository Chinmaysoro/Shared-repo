import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import moment from 'moment';
import { toast } from 'react-toastify';
import SimpleModal from '../components/Modal';
import AddResignation from './AddResignation';
import { ResignationService, UploadService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
import { getUser } from '../../redux/helpers/user';

const ResignationScreen = () => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [visible, setVisible] = useState(false);
    const [resignationValues, setResignationValues] = useState({});
    const [title, setTitle] = useState('');
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [resignationList, setResignationList] = useState([]);
    const [totalResignation, setTotalResignation] = useState(0);
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
        setResignationValues(dept);
    };

    const fetchAll = async () => {
        if (userData?.user?.companyId) {
            setLoader(true);
            ResignationService.find({
                query: { companyId: userData?.user?.companyId, $skip: offset, $limit: perPage, $sort: { createdAt: -1 }, $populate: ['createdBy', 'resignationType'] },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setLoader(false);
                    setResignationList(res.data);
                    setPageCount(Math.ceil(res.total / perPage));
                    setTotalResignation(res.total);
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
        ResignationService.patch(
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
                toast.success('Resignation updated successfully.');
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
                            <h3 className="page-title">Resignation</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Employee</a>
                                </li>
                                <li className="breadcrumb-item active">Resignation</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <SimpleModal title={title} visible={visible} setVisible={() => setVisible(false)} body={<AddResignation setVisible={() => setVisible(false)} resignationValues={resignationValues} fetchAll={fetchAll} />}></SimpleModal>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Reason of Resignation</th>
                                    <th scope="col">Resign Date</th>
                                    <th scope="col">Last Working Date</th>
                                    {/* <th scope="col">Detail</th> */}
                                    <th scope="col">Status</th>
                                    <th scope="col">Approve/Reject</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resignationList && resignationList?.length > 0 ? (
                                    resignationList?.map((company, index) => (
                                        <tr key={`key-${index}`}>
                                            <th scope="row">{`${company?.createdBy?.firstName} ${company?.createdBy?.lastName}` || 'N/A'}</th>
                                            <td>{company?.resignationType?.name || 'N/A'} </td>
                                            <td>{company?.resignDate ? moment(company?.resignDate).format('DD-MM-YYYY') : 'N/A'}</td>
                                            <td>{company?.lastWorkingDate ? moment(company?.lastWorkingDate).format('DD-MM-YYYY') : 'N/A'}</td>
                                            {/* <td>{company?.cause || 'N/A'}</td> */}
                                            <td>
                                                {company.approvalStatus == 'pending' && <span style={dotWarning}></span>}
                                                {company.approvalStatus == 'approved' && <span style={dotSuccess}></span>}
                                                {company.approvalStatus == 'rejected' && <span style={dotErrror}></span>}
                                                {company?.approvalStatus || 'N/A'}
                                            </td>
                                            <td>
                                                <button className="btn btn-primary" type="button" onClick={() => openModal('Approve Resignation', true, company)}>
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
                                                No resignation found!!!
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {totalResignation > 10 ? (
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

export default ResignationScreen;
