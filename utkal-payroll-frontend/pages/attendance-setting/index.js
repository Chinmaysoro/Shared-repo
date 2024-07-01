import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import SimpleModal from '../components/Modal';
import AddAttendance from './AddAttendance';
import { CompanyService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
import { convertUTCToLocalTime } from '../../redux/helpers/dateHelper';
import { getUser } from '../../redux/helpers/user';

const CompanyScreen = () => {
    const userData = getUser();
    const dispatch = useDispatch();
    const router = useRouter();
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
        if (userData?.user?.companyId) {
            setLoader(true);
            CompanyService.find({
                query: { _id: userData?.user?.companyId, $skip: offset, $limit: perPage, $sort: { createdAt: -1 } },
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
        }
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
                toast.success('Attendance deleted successfully.');
                fetchAllCompany();
            })
            .catch((error) => {
                setLoader(false);
                toast.error(error?.message);
            });
    };

    const navigaetToShiftRatation = () => {
        router.push('/attendance-setting/shift-rotation-policy');
    };

    useEffect(() => {
        fetchAllCompany();
    }, []);

    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Attendance</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Administration</a>
                                </li>
                                <li className="breadcrumb-item active">Attendance</li>
                            </ul>
                        </div>
                        <div className="col-auto float-right ml-auto">
                            <button type="button" className="btn btn-primary" onClick={() => navigaetToShiftRatation()}>
                                Shift Rotation Policies
                            </button>
                        </div>
                    </div>
                </div>
                {/* <SimpleModal title={title} visible={visible} setVisible={() => setVisible(false)} body={<AddAttendance setVisible={() => setVisible(false)} companyValues={companyValues} fetchAllCompany={fetchAllCompany} />}></SimpleModal> */}
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Company Name</th>
                                    <th scope="col">Start Time</th>
                                    <th scope="col">End Time</th>
                                    <th scope="col">Full Day</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {companyList && companyList?.length > 0 ? (
                                    companyList?.map((company, index) => (
                                        <tr key={`key-${index}`}>
                                            <th scope="row">
                                                <Link href={`/attendance-setting/[companyId]`} as={`/attendance-setting/${company?._id}`}>
                                                    {company?.name || 'N?A'}
                                                </Link>
                                            </th>
                                            <td>{company?.dayStart ? convertUTCToLocalTime(company?.dayStart) : 'N/A'}</td>
                                            <td>{company?.dayEnd ? convertUTCToLocalTime(company?.dayEnd) : 'N/A'}</td>
                                            <td>{company?.fullDay || 'N/A'}</td>
                                            <td>
                                                <button className="btn btn-primary" type="button" onClick={() => openModal('Attendance Setting', true, company)}>
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
                                                No company setting found!!!
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

export default CompanyScreen;
