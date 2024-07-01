import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { toast, toastSettings } from 'react-toastify';
import moment from 'moment';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { uploadPayslipSchema } from '../../redux/helpers/validations';
import { getYearList, getMonthList } from '../../redux/helpers/dateHelper';
import { PayslipService, UploadService, CompanyService, UserService, SalaryComponentService, PayGroupService, PayComponentsService } from '../../redux/services/feathers/rest.app';
import SimpleModal from '../components/Modal';
import FormulaComponentModal from '../components/FormulaComponentModal';
import AddComponent from './AddSalaryComponent';
import FormulaComponent from './formula-component';
import AddPayGroupComponent from './AddPayGroupComponent';
import { getUser } from '../../redux/helpers/user';

const UpdatePayGroup = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [companyValues, setCompanyValues] = useState({});
    const [componentValues, setComponentValues] = useState({});
    const [parentPayGroupId, setParentPayGroupId] = useState('');
    const [yearList, setYearList] = useState([]);
    const [monthList, setMonthList] = useState([]);
    const [documentLoader, setDocumentLoader] = useState(false);
    const [documentList, setDocumentList] = useState([]);
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [paygroupDetail, setPayGroupDetail] = useState([]);
    const [totalPayGroup, setTotalPayGroup] = useState(0);
    const [salaryComponentList, setSalaryComponentList] = useState([]);
    const [totalSalaryComponent, setTotalSalaryComponent] = useState(0);
    const [componentList, setComponentList] = useState([]);
    const [totalComponent, setTotalComponent] = useState(0);
    const [loader, setLoader] = useState(false);
    const [formulaModalVisible, setFormulaModalVisible] = useState(false);
    const [formulaTitle, setFormulaTitle] = useState('');
    const [formulaValues, setFormulaValues] = useState({});
    const openModal = (type, val, dept) => {
        setVisible(val);
        setTitle(type);
        setCompanyValues(dept);
    };

    const openFormulaModal = (type, val, data) => {
        setFormulaModalVisible(val);
        setFormulaTitle(type);
        setFormulaValues(data);
    };

    const fetchPayGroupDetails = (payGroupId) => {
        if (userData?.user?.companyId) {
            PayGroupService.find({
                query: {
                    _id: payGroupId,
                    companyId: userData?.user?.companyId,
                    $populate: [
                        {
                            path: 'components',
                            model: 'salaryComponent', // The name of the Mongoose model for pastExperience
                            populate: {
                                path: 'component',
                                model: 'salaryComponent' // The name of the Mongoose model for designation
                            }
                        }
                    ]
                },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setPayGroupDetail(res?.data);
                    setTotalPayGroup(res?.total);
                })
                .catch((error) => {
                    toast.error(error, toastSettings);
                });
        }
    };

    const fetchSalaryComponent = (payGroupId) => {
        if (userData?.user?.companyId) {
            PayComponentsService.find({
                query: {
                    payGroupId: payGroupId,
                    $sort: { createdAt: -1 },
                    companyId: userData?.user?.companyId,
                    $populate: ['salaryComponentId']
                },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setSalaryComponentList(res?.data);
                    setTotalSalaryComponent(res?.total);
                })
                .catch((error) => {
                    toast.error(error, toastSettings);
                });
        }
    };

    const fetchData = () => {
        const years = getYearList();
        const months = getMonthList();
        setYearList(years);
        setMonthList(months);
        const location = window?.location?.pathname;
        const locationarr = location?.split('/');
        //  setParentCompanyId(locationarr[2]);
        setParentPayGroupId(locationarr[2]);
        fetchSalaryComponent(locationarr[2]);
        fetchPayGroupDetails(locationarr[2]);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const deleteSalaryComponent = (values) => {
        setLoader(true);
        PayComponentsService.remove(values?._id, {
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                toast.success('Pay Component deleted successfully.');
                fetchData();
            })
            .catch((error) => {
                setLoader(false);
                toast.error(error?.message);
            });
    };

    return (
        <div className="container card">
            <div className="page-header">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <h3 className="page-title">Pay Group Component</h3>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">
                                <a href="#">Administration</a>
                            </li>
                            <li className="breadcrumb-item active">Pay Group Component</li>
                        </ul>
                    </div>
                    <div className="col-auto float-right ml-auto">
                        <button type="button" className="btn btn-primary" onClick={() => openFormulaModal('Add Formula', true, null)}>
                            <i className="pi pi-plus"></i>Add Formula
                        </button>
                        {/* <button type="button" className="btn btn-primary" onClick={() => openModal('Pay Component', true, null)}>
                        <i className="pi pi-plus"></i> Add Pay Component
                    </button> */}
                    </div>
                </div>
            </div>
            <div className="row staff-grid-row">
                <div className="col-md-12 col-sm-12">
                    <table className="table table-bordered table-hover">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">Pay Group</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paygroupDetail && paygroupDetail?.length > 0 ? (
                                paygroupDetail?.map((paygroup, index) => (
                                    <tr key={`key-${index}`}>
                                        <th scope="row">{paygroup?.name || 'N/A'}</th>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="alert alert-success text-center" role="alert">
                                            No pay group found!!!
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {totalPayGroup > 10 ? (
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
            <hr />
            <div className="row justify-content-center">
                <div className="col-md-12">
                    <h4>Order Components</h4>
                </div>
            </div>
            <div className="row staff-grid-row">
                <div className="col-md-12 col-sm-12">
                    <table className="table table-bordered table-hover">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">Sl.</th>
                                <th scope="col">Components</th>
                                <th scope="col">Type</th>
                                <th scope="col">Status</th>
                                <th scope="col">Tax Exempt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paygroupDetail && paygroupDetail?.length > 0 && paygroupDetail[0]?.components?.length > 0 ? (
                                paygroupDetail[0]?.components?.map((data, index) => (
                                    <tr key={`key-${index}`}>
                                        <th>{index + 1}</th>
                                        <th scope="row">{`${data?.component?.name}`}</th>
                                        <td>{data?.component?.type || 'N/A'}</td>
                                        <td>{data?.component?.status || 'N/A'}</td>
                                        <td>{data?.component?.taxExempt ? 'True' : 'False'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="alert alert-success text-center" role="alert">
                                            No component found!!!
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* <SimpleModal
                title={title}
                visible={visible}
                setVisible={() => setVisible(false)}
                body={<AddComponent setVisible={() => setVisible(false)} componentValues={companyValues} fetchAllComponent={() => fetchSalaryComponent(parentPayGroupId)} parentPayGroupId={parentPayGroupId} />}
            ></SimpleModal> */}

            <FormulaComponentModal
                title={formulaTitle}
                visible={formulaModalVisible}
                setVisible={() => setFormulaModalVisible(false)}
                body={<FormulaComponent setVisible={() => setFormulaModalVisible(false)} componentValues={formulaValues} fetchAllComponent={() => fetchPayGroupDetails(parentPayGroupId)} parentPayGroupId={parentPayGroupId} />}
            ></FormulaComponentModal>

            {/* <div className="row justify-content-center">
                <div className="col-md-12">
                    <div className="alert alert-primary" role="alert">
                        <b>Pay Component</b>
                    </div>
                </div>
            </div>
            <div className="row staff-grid-row">
                <div className="col-md-12 col-sm-12">
                    <table className="table table-bordered table-hover">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">Pay Component</th>
                                <th scope="col">Type</th>
                                <th scope="col">Value</th>
                                <th scope="col">Tax Exempt</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salaryComponentList && salaryComponentList?.length > 0 ? (
                                salaryComponentList?.map((component, index) => (
                                    <tr key={`key-${index}`}>
                                        <th scope="row">{`${component?.salaryComponentId?.name}`}</th>
                                        <td>{component?.payComponentsType || 'N/A'}</td>
                                        <td>{component?.percentage ? component?.percentage + '%' : component?.fixedAmount ? component?.fixedAmount : '-'}</td>
                                        <td>{component?.salaryComponentId?.taxExempt ? 'True' : 'False'}</td>
                                        <td>
                                            <button className="btn btn-primary" type="button" onClick={() => openModal('Update Pay Component', true, component)}>
                                                <i className="pi pi-pencil"></i>
                                            </button>
                                            &nbsp;
                                            <button className="btn btn-warning" type="button" onClick={() => deleteSalaryComponent(component)}>
                                                <i className="pi pi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="alert alert-success text-center" role="alert">
                                            No component found!!!
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {totalSalaryComponent > 10 ? (
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
            </div> */}
        </div>
    );
};

export default UpdatePayGroup;
