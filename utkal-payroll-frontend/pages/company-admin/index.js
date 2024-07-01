import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import SimpleModal from '../components/Modal';
import AddCompany from './AddCompany';
import { toast } from 'react-toastify';
import { CompanyService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
import { getUser } from '../../redux/helpers/user';

const CompanyScreen = () => {
    const userData = getUser();
    const [loader, setLoader] = useState(false);
    const [visible, setVisible] = useState(false);
    const [companyValues, setCompanyValues] = useState({});
    const [title, setTitle] = useState('');
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [companyList, setCompanyList] = useState([]);
    const [totalCompany, setTotalCompany] = useState(0);
    const [pageCount, setPageCount] = useState(0);

    const openModal = (type, val, data) => {
        setVisible(val);
        setTitle(type);
        setCompanyValues(data);
    };

    const fetchAllCompany = async () => {
        setLoader(true);
        CompanyService.find({
            query: { $skip: offset, $limit: perPage, $sort: { createdAt: -1 } },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                setCompanyList(res.data);
                setPageCount(Math.ceil(res.total / perPage));
                setTotalCompany(res.total);
            })
            .catch((error) => {
                setLoader(false);
            });
    };

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

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setOffset(selectedPage * perPage);
    };

    useEffect(() => {
        fetchAllCompany();
    }, [offset]);

    const navigateToUpdateProfile = () => {};

    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Company</h3>
                            <ul className="breadcrumb">
                                {userData?.user?.role === 65535 ? (
                                    <li className="breadcrumb-item">
                                        <a href="#">Super Admin</a>
                                    </li>
                                ) : (
                                    <li className="breadcrumb-item">
                                        <a href="#">Employee</a>
                                    </li>
                                )}
                                <li className="breadcrumb-item active">Company</li>
                            </ul>
                        </div>
                        <div className="col-auto float-right ml-auto">
                            <button type="button" className="btn btn-primary" onClick={() => openModal('Add Company', true, null)}>
                                <i className="pi pi-plus"></i> Add Company
                            </button>
                        </div>
                    </div>
                </div>
                <SimpleModal title={title} visible={visible} setVisible={() => setVisible(false)} body={<AddCompany setVisible={() => setVisible(false)} companyValues={companyValues} fetchAllCompany={fetchAllCompany} />}></SimpleModal>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        <table className="table table-bordered">
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
                                {companyList && companyList?.length > 0 ? (
                                    companyList?.map((company, index) => (
                                        <tr key={`key-${index}`}>
                                            <th scope="row">
                                                <Link href={`/company-admin/[companyId]`} as={`/company-admin/${company?._id}`}>
                                                    {company?.name}
                                                </Link>
                                            </th>
                                            <td>{company?.email}</td>
                                            <td>{company?.phone}</td>
                                            <td>{company?.website}</td>
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
            </div>
        </div>
    );
};

export default CompanyScreen;
