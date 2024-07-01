import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import SimpleModal from '../components/Modal';
import AddDesignation from './AddDesignation';
import { toast } from 'react-toastify';
import { DesignationService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
import { getUser } from '../../redux/helpers/user';

const CompanyScreen = () => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [visible, setVisible] = useState(false);
    const [designationValues, setDesignationValues] = useState({});
    const [title, setTitle] = useState('');
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [designationList, setDesignationList] = useState([]);
    const [totalDesignation, setTotalDesignation] = useState(0);

    const openModal = (type, val, data) => {
        setVisible(val);
        setTitle(type);
        setDesignationValues(data);
    };

    const fetchAllDesignation = async () => {
        if (userData?.user?.companyId) {
            setLoader(true);
            DesignationService.find({
                query: { companyId: userData?.user?.companyId, $skip: offset, $limit: perPage, $sort: { createdAt: -1 } },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setLoader(false);
                    setDesignationList(res.data);
                    setPageCount(Math.ceil(res.total / perPage));
                    setTotalDesignation(res.total);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    const deleteCompany = (values) => {
        setLoader(true);
        DesignationService.remove(values?._id, {
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                toast.success('Designation deleted successfully.');
                fetchAllDesignation();
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
        fetchAllDesignation();
    }, [offset]);

    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Designation</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Employee</a>
                                </li>
                                <li className="breadcrumb-item active">Designation</li>
                            </ul>
                        </div>
                        <div className="col-auto float-right ml-auto">
                            <button type="button" className="btn btn-primary" onClick={() => openModal('Add Designation', true, null)}>
                                <i className="pi pi-plus"></i> Add Designation
                            </button>
                        </div>
                    </div>
                </div>
                <SimpleModal
                    title={title}
                    visible={visible}
                    setVisible={() => setVisible(false)}
                    body={<AddDesignation setVisible={() => setVisible(false)} designationValues={designationValues} fetchAllDesignation={fetchAllDesignation} />}
                ></SimpleModal>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        <table className="table table-bordered table-hover">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Designation Name</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {designationList && designationList?.length > 0 ? (
                                    designationList?.map((company, index) => (
                                        <tr key={`key-${index}`}>
                                            <th scope="row">{company?.name}</th>
                                            <td>
                                                <button className="btn btn-primary" type="button" onClick={() => openModal('Update Designation', true, company)}>
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
                                                No designation found!!!
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {totalDesignation > 10 ? (
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
