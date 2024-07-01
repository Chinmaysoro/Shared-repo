import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast, toastSettings } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import TokenService from '../../redux/services/token.service';
import { getYearList, getMonthList } from '../../redux/helpers/dateHelper';
import { CompanyService } from '../../redux/services/feathers/rest.app';
import SimpleModal from '../components/Modal';
import AddChildCompany from './AddChildCompany';
import { decodedID } from '../../redux/helpers/user';

const UpdatePayroll = (props) => {
    const router = useRouter();
    const [companyValues, setCompanyValues] = useState({});
    const [parentCompanyId, setParentCompanyId] = useState('');
    const [yearList, setYearList] = useState([]);
    const [monthList, setMonthList] = useState([]);
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [companyDetail, setCompanyDetail] = useState([]);
    const [totalCompany, setTotalCompany] = useState(0);
    const [childCompanyList, setChildCompanyList] = useState([]);
    const [totalChildCompany, setTotalChildCompany] = useState(0);
    const company_id = decodedID(router?.query?.companyId);

    const openModal = (type, val, dept) => {
        setVisible(val);
        setTitle(type);
        setCompanyValues(dept);
    };

    const fetchAllCompany = (companyId) => {
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

    const fetchChildCompanyList = (companyId) => {
        CompanyService.find({
            query: {
                childCompany: true,
                parentId: companyId
            },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setChildCompanyList(res?.data);
                setTotalChildCompany(res?.total);
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
        setParentCompanyId(company_id);
        fetchChildCompanyList(company_id);
        fetchAllCompany(company_id);
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
            <div className="row staff-grid-row">
                <div className="col-md-12 col-sm-12">
                    <h4>Parent Company</h4>
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
                    {totalCompany > 10 ? (
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
            <div className="row justify-content-center mb-3">
                <div className="col-md-12 float-left mt-4">
                    <h4>Child Company</h4>
                    <div className="col-auto float-right ml-auto">
                        <button type="button" className="btn btn-primary" onClick={() => openModal('Add Child Company', true, null)}>
                            <i className="pi pi-plus"></i> Company
                        </button>
                    </div>
                </div>
            </div>
            <SimpleModal
                title={title}
                visible={visible}
                setVisible={() => setVisible(false)}
                body={
                    <AddChildCompany
                        setVisible={() => setVisible(false)}
                        companyValues={companyValues}
                        fetchAllCompany={() => fetchAllCompany(parentCompanyId)}
                        parentCompanyId={parentCompanyId}
                        fetchChildCompanyList={() => fetchChildCompanyList(parentCompanyId)}
                    />
                }
            ></SimpleModal>
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
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {childCompanyList && childCompanyList?.length > 0 ? (
                                childCompanyList?.map((company, index) => (
                                    <tr key={`key-${index}`}>
                                        <th scope="row">{company?.name || 'N/A'}</th>
                                        <td>{company?.email || 'N/A'}</td>
                                        <td>{company?.phone || 'N/A'}</td>
                                        <td>{company?.website || 'N/A'}</td>
                                        <td>{company?.about || 'N/A'}</td>
                                        <td>
                                            <button className="btn btn-primary" type="button" onClick={() => openModal('Update Company', true, company)}>
                                                <i className="pi pi-pencil"></i>
                                            </button>
                                            &nbsp;
                                            <button className="btn btn-warning" type="button" onClick={() => deleteCompany(company)}>
                                                <i className="pi pi-trash"></i>
                                            </button>
                                        </td>
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
                    {totalChildCompany > 10 ? (
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
    );
};

export default UpdatePayroll;
