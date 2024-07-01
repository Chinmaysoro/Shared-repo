import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import SimpleModal from '../components/Modal';
import AddLeave from './AddLeave';
import { toast } from 'react-toastify';
import { DepartmentService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';

const Reimbursement = () => {
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [visible, setVisible] = useState(false);
    const [companyValues, setCompanyValues] = useState({});
    const [title, setTitle] = useState('');
    const [page, setPage] = useState(1);
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [companyList, setCompanyList] = useState([]);
    const [totalCompany, setTotalCompany] = useState(0);

    const openModal = (type, val, dept) => {
        setVisible(val);
        setTitle(type);
        setCompanyValues(dept);
    };

    const fetchAllCompany = async () => {
        setLoader(true);
        DepartmentService.find({
            query: { $skip: offset, $limit: perPage, $sort: { createdAt: -1 } },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                setCompanyList(res.data);
                setTotalCompany(res.total);
            })
            .catch((error) => {
                setLoader(false);
            });
    };

    const deleteCompany = (values) => {
        setLoader(true);
        DepartmentService.remove(values?._id, {
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                toast.success('Department deleted successfully.');
                fetchAllCompany();
            })
            .catch((error) => {
                setLoader(false);
                toast.error(error?.message);
            });
    };

    useEffect(() => {
        fetchAllCompany();
    }, []);

    const navigateToUpdateProfile = () => {};

    return (
        <div className="page-wrapper">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Leave</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Administration</a>
                                </li>
                                <li className="breadcrumb-item active">Leave</li>
                            </ul>
                        </div>
                        <div className="col-auto float-right ml-auto">
                            <button type="button" className="btn btn-primary" onClick={() => openModal('Add Leave Type', true, null)}>
                                <i className="pi pi-plus"></i> Add Leave
                            </button>
                        </div>
                    </div>
                </div>
                <SimpleModal title={title} visible={visible} setVisible={() => setVisible(false)} body={<AddLeave setVisible={() => setVisible(false)} companyValues={companyValues} fetchAllCompany={fetchAllCompany} />}></SimpleModal>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        <table className="table table-bordered table-hover">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Leave Type</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    {name:"Casual leave"},
                                    {name:"Sick leave"},
                                    {name:"Planned leave"}
                                ]?.map((company, index) => (
                                        <tr key={`key-${index}`}>
                                            <th scope="row">{company?.name}</th>
                                            <td>
                                                <button className="btn btn-primary" type="button" onClick={() => openModal('Update Leave', true, company)}>
                                                    <i className="pi pi-pencil"></i>
                                                </button>
                                                &nbsp;
                                                <button className="btn btn-warning" type="button" onClick={() => deleteCompany(company)}>
                                                    <i className="pi pi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                {/* ) : (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="alert alert-success text-center" role="alert">
                                                No department found!!!
                                            </div>
                                        </td>
                                    </tr>
                                )} */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reimbursement;
