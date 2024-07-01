import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { useRouter } from 'next/router';
import { toast, toastSettings } from 'react-toastify';
import moment from 'moment';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { uploadPayslipSchema } from '../../redux/helpers/validations';
import { getYearList, getMonthList } from '../../redux/helpers/dateHelper';
import { PayslipService, UploadService, CompanyService, UserService } from '../../redux/services/feathers/rest.app';
import SimpleModal from '../components/Modal';
import AddCompanyAdmin from './AddCompanyAdmin';

const UpdatePayroll = (props) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [companyValues, setCompanyValues] = useState({});
    const [parentCompanyId, setParentCompanyId] = useState('');
    const [yearList, setYearList] = useState([]);
    const [monthList, setMonthList] = useState([]);
    const [documentLoader, setDocumentLoader] = useState(false);
    const [documentList, setDocumentList] = useState([]);
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [companyDetail, setCompanyDetail] = useState([]);
    const [totalCompany, setTotalCompany] = useState(0);
    const [companyAdminList, setCompanyAdminList] = useState([]);
    const [totalCompanyAdmin, setTotalCompanyAdmin] = useState(0);

    const openModal = (type, val, dept) => {
        setVisible(val);
        setTitle(type);
        setCompanyValues(dept);
    };

    const fetchCompanyDetails = (companyId) => {
        CompanyService.find({
            query: {
                _id: companyId
            },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setCompanyDetail(res?.data);
                setTotalCompany(res?.total);
            })
            .catch((error) => {
                toast.error(error, toastSettings);
            });
    };

    const fetchCompanyAdmin = (companyId) => {
        UserService.find({
            query: {
                companyId: companyId,
                role: 32767
            },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setCompanyAdminList(res?.data);
                setTotalCompanyAdmin(res?.total);
            })
            .catch((error) => {
                toast.error(error, toastSettings);
            });
    };

    const fetchData = () => {
        const years = getYearList();
        const months = getMonthList();
        setYearList(years);
        setMonthList(months);
        const location = window?.location?.pathname;
        const locationarr = location?.split('/');
        setParentCompanyId(locationarr[2]);
        fetchCompanyAdmin(locationarr[2]);
        fetchCompanyDetails(locationarr[2]);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const deleteCompany = (values) => {
        setLoader(true);
        CompanyService.remove(values?._id, {
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                toast.success('Company deleted successfully.');
                fetchAllCompany();
            })
            .catch((error) => {
                setLoader(false);
                toast.error(error?.message);
            });
    };

    return (
        <div className="container card">
            <div className="row justify-content-center mb-3">
                <div className="col-auto float-left">
                    <h4>Company</h4>
                </div>
               
            </div>
            <div className="row staff-grid-row">
                <div className="col-md-12 col-sm-12">
                    <table className="table table-bordered table-hover">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">Company Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone</th>
                                <th scope="col">Website</th>
                                <th scope="col">About</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companyDetail && companyDetail?.length > 0 ? (
                                companyDetail?.map((company, index) => (
                                    <tr key={`key-${index}`}>
                                        <th scope="row">{company?.name || 'N/A'}</th>
                                        <td>{company?.email || 'N/A'}</td>
                                        <td>{company?.phone || 'N/A'}</td>
                                        <td>{company?.website || 'N/A'}</td>
                                        <td>{company?.about || 'N/A'}</td>
                                        {/* <td>
                                            <button className="btn btn-primary" type="button" onClick={() => openModal('Update Company', true, company)}>
                                                <i className="pi pi-pencil"></i>
                                            </button>
                                            &nbsp;
                                            <button className="btn btn-warning" type="button" onClick={() => deleteCompany(company)}>
                                                <i className="pi pi-trash"></i>
                                            </button>
                                        </td> */}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="alert alert-success text-center" role="alert">
                                            No company found!!!
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {/* {totalCompany > 10 ? (
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
                    ) : null} */}
                </div>
            </div>
            <SimpleModal
                title={title}
                visible={visible}
                setVisible={() => setVisible(false)}
                body={<AddCompanyAdmin setVisible={() => setVisible(false)} companyValues={companyValues} fetchAllCompany={() => fetchCompanyDetails(parentCompanyId)} parentCompanyId={parentCompanyId} fetchCompanyAdmins={fetchCompanyAdmin}/>}
            ></SimpleModal>
            <div className="row justify-content-center">
                <div className="col-md-12">
                    <div className="alert alert-primary" role="alert">
                        <b>Company Admins</b>
                        <div className="col-auto float-right ml-auto pt-1" style={{right: "-20px"}}>
                    <button type="button" className="btn btn-primary mt-2" onClick={() => openModal('Add Company Admin', true, null)}>
                        <i className="pi pi-plus"></i> Company Admin
                    </button>
                </div>
                    </div>
                </div>
            </div>
            <div className="row staff-grid-row">
                <div className="col-md-12 col-sm-12">
                    <table className="table table-bordered table-hover">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Phone</th>
                                <th scope="col">Email</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companyAdminList && companyAdminList?.length > 0 ? (
                                companyAdminList?.map((user, index) => (
                                    <tr key={`key-${index}`}>
                                        <th scope="row">{`${user?.firstName} ${user?.lastName}`}</th>
                                        <td>{user?.phone || 'N/A'}</td>
                                        <td>{user?.email || 'N/A'}</td>
                                        <td>
                                            <button className="btn btn-primary" type="button" onClick={() => openModal('Update Company Admin', true, user)}>
                                                <i className="pi pi-pencil"></i>
                                            </button>
                                            &nbsp;
                                            <button className="btn btn-warning" type="button" onClick={() => deleteCompany(user)}>
                                                <i className="pi pi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="alert alert-success text-center" role="alert">
                                            No Company Admin found!!!
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {/* {totalCompanyAdmin > 10 ? (
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
                    ) : null} */}
                </div>
            </div>
        </div>
    );
};

export default UpdatePayroll;
