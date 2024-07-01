import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import moment from 'moment';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { uploadPayslipSchema } from '../../redux/helpers/validations';
import { getYearList, getMonthList } from '../../redux/helpers/dateHelper';
import { PayslipService, UserSalaryService } from '../../redux/services/feathers/rest.app';
import SimpleModal from '../components/Modal';
import AddPayroll from './AddPayroll';
import { getUser } from '../../redux/helpers/user';
import { Dropdown } from 'primereact/dropdown';
import AssignPaygroup from './AssignPaygroup';

const UpdatePayroll = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [payrollValues, setPayrollValues] = useState({});
    const [userId, setUserId] = useState('');
    const [loader, setLoader] = useState(false);
    const [yearList, setYearList] = useState([]);
    const [monthList, setMonthList] = useState([]);
    const [documentLoader, setDocumentLoader] = useState(false);
    const [documentList, setDocumentList] = useState([]);
    const [visible, setVisible] = useState(false);
    const [assignGroupVisible, setAssignGroupVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [dropdownItem, setDropdownItem] = useState({ name: 'Payslip List', code: 'Payslip List' });
    const dropdownItems = [
        { name: 'Payslip List', code: 'Payslip List' },
        { name: 'User Salary List', code: 'User Salary List' }
    ];
    const [userSalaryList, setUserSalaryList] = useState([]);

    const openModal = (type, val, dept) => {
        setVisible(val);
        setTitle(type);
        setPayrollValues(dept);
    };

    const openAssignGroupModal = (type, val, dept) => {
        setAssignGroupVisible(val);
        setTitle(type);
        setPayrollValues(dept);
    };

    const fetchDocumentList = async (userid) => {
        if (userData?.user?.companyId) {
            const data = {
                userId: userid,
                companyId: userData?.user?.companyId,
                $populate: ['createdBy', 'userId']
            };
            setDocumentLoader(true);
            await PayslipService.find({
                query: data,
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setDocumentLoader(false);
                    setDocumentList(res.data);
                })
                .catch((error) => {
                    setDocumentLoader(false);
                });
        }
    };

    const fetchUserSalary = async (userid) => {
        if (userData?.user?.companyId) {
            setLoader(true);
            UserSalaryService.find({
                query: { companyId: userData?.user?.companyId, userId: userid, $sort: { createdAt: -1 } },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setLoader(false);
                    setUserSalaryList(res.data);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    const fetchData = async () => {
        const years = await getYearList();
        const months = await getMonthList();
        setYearList(years);
        setMonthList(months);
        const location = window?.location?.pathname;
        const locationarr = location?.split('/');
        setUserId(locationarr[2]);
        fetchDocumentList(locationarr[2]);
        fetchUserSalary(locationarr[2]);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const deleteDocument = (data) => {
        setIsLoading(true);
        PayslipService.remove(data?._id, {
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setIsLoading(false);
                toast.success('Payroll deleted successfully.');
                fetchDocumentList(userId);
            })
            .catch((error) => {
                setIsLoading(false);
                toast.error(error?.message);
            });
    };

    const deleteUserSalary = (data) => {
        setIsLoading(true);
        UserSalaryService.remove(data?._id, {
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setIsLoading(false);
                toast.success('User salary deleted successfully.');
                fetchUserSalary(userId);
            })
            .catch((error) => {
                setIsLoading(false);
                toast.error(error?.message);
            });
    };

    return (
        <div className="container card">
            <div className="row justify-content-center mb-3">
                <div className="col-auto float-right ml-auto mt-3">
                    <Dropdown className="mr-2" id="filter" value={dropdownItem} onChange={(e) => setDropdownItem(e.value)} options={dropdownItems} optionLabel="name" placeholder="Select One"></Dropdown>
                    <button type="button" className="btn btn-primary mr-2" onClick={() => openAssignGroupModal('Assign Paygroup', true, null)}>
                        <i className="pi pi-plus"></i> Assign Paygroup
                    </button>
                    <button type="button" className="btn btn-primary" onClick={() => openModal('Add Payroll', true, null)}>
                        <i className="pi pi-plus"></i> Add Salary Slip
                    </button>
                </div>
            </div>
            <SimpleModal
                title={title}
                visible={assignGroupVisible}
                setVisible={() => setAssignGroupVisible(false)}
                body={<AssignPaygroup setVisible={() => setAssignGroupVisible(false)} payrollValues={payrollValues} fetchUserSalary={() => fetchUserSalary(userId)} />}
            ></SimpleModal>

            <SimpleModal title={title} visible={visible} setVisible={() => setVisible(false)} body={<AddPayroll setVisible={() => setVisible(false)} payrollValues={payrollValues} fetchDocumentList={() => fetchDocumentList(userId)} />}></SimpleModal>
            <div className="row">
                <div className="col-md-12 col-sm-12 p-0 mt-3">
                    {dropdownItem?.name === 'Payslip List' ? (
                        <table className="table table-bordered table-hover">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Year</th>
                                    <th scope="col">Month</th>
                                    <th scope="col">Document</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documentList && documentList?.length > 0 ? (
                                    documentList?.map((data, index) => (
                                        <tr key={`key-${index}`}>
                                            <th scope="row">{`${data?.userId?.firstName} ${data?.userId?.lastName}` || 'N/A'}</th>
                                            <td>{data?.year || 'N/A'}</td>
                                            <td>{data?.month || 'N/A'}</td>
                                            <td>
                                                {data?.document || 'N/A'}
                                                {data?.document ? (
                                                    <a title="Download" style={{ float: 'right' }} className="btn btn-primary" href={`https://dd7tft2brxkdw.cloudfront.net/${data?.document}`} target="_blank" download>
                                                        <i className="pi pi-download"></i>
                                                    </a>
                                                ) : null}
                                            </td>
                                            <td>
                                                <button className="btn btn-primary" type="button" onClick={() => openModal('Update Payslip', true, data)}>
                                                    <i className="pi pi-pencil"></i>
                                                </button>
                                                &nbsp;
                                                <button title="Delete" className="btn btn-warning" type="button" onClick={() => deleteDocument(data)}>
                                                    <i className="pi pi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="alert alert-success text-center" role="alert">
                                                No document found!!!
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <table className="table table-bordered table-hover">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Paygroup</th>
                                    <th scope="col">Anual CTC</th>
                                    <th scope="col">Monthly CTC</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userSalaryList && userSalaryList?.length > 0 ? (
                                    userSalaryList?.map((data, index) => (
                                        <tr key={`key-${index}`}>
                                            <th scope="row">{data?.payGroupId || 'N/A'}</th>
                                            <td>{data?.annualCTC || 'N/A'}</td>
                                            <td>{data?.monthlyCTC || 'N/A'}</td>
                                            <td>
                                                <button className="btn btn-primary" type="button" onClick={() => openModal('Update User Salary', true, data)}>
                                                    <i className="pi pi-pencil"></i>
                                                </button>
                                                &nbsp;
                                                <button title="Delete" className="btn btn-warning" type="button" onClick={() => deleteUserSalary(data)}>
                                                    <i className="pi pi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="alert alert-success text-center" role="alert">
                                                No user salary found!!!
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdatePayroll;
