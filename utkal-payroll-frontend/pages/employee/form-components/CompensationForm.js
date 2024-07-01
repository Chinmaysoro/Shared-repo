import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast, toastSettings } from 'react-toastify';
import { userSalarySchema } from '../../../redux/helpers/validations';
import TokenService from '../../../redux/services/token.service';
import { UserSalaryService, PayGroupService, PayComponentsService } from '../../../redux/services/feathers/rest.app';
import { getUser } from '../../../redux/helpers/user';
import CompensationUpdateForm from './CompensationUpdateForm';
import SimpleModal from '../../components/Modal';

const CompensationForm = ({ onSubmit, initialValues, empId }) => {
    const userData = getUser();
    const [payrollValues, setPayrollValues] = useState({ payGroupId: '', annualCTC: '', monthlyCTC: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [paygroupList, setPaygroupList] = useState([]);
    const [userId, setUserId] = useState('');
    const [loader, setLoader] = useState(false);
    const [salaryBreakdown, setSalaryBreakdown] = useState({});
    const [userSalaryRes, setUserSalaryRes] = useState([]);
    const [monthlySalary, setMonthlySalary] = useState([]);
    const [anuallSalary, setAnuallSalary] = useState([]);
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [componentValues, setComponentValues] = useState({});
    const [compensationData, setCompensationData] = useState({});
    const [salaryComponentList, setSalaryComponentList] = useState([]);
    const [totalSalaryComponent, setTotalSalaryComponent] = useState(0);
    const [requestQuery, setRequestQuery] = useState({});
    const [payGroupsById, setPayGroupsById] = useState([]);

    const fetchPaygroup = async () => {
        if (userData?.user?.companyId) {
            setLoader(true);
            PayGroupService.find({
                query: { companyId: userData?.user?.companyId, $sort: { createdAt: -1 } },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setLoader(false);
                    setPaygroupList(res.data);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    const fetchUserSalary = async (values) => {
        const data = {
            userId: userId,
            annualCTC: parseInt(values?.annualCTC),
            // monthlyCTC: values?.monthlyCTC,
            payGroupId: payGroupsById?.length > 0 ? payGroupsById[0]?._id : values?.payGroupId,
            companyId: userData?.user?.companyId
        };
        setCompensationData(values);
        const payRollData = data;
        Object.assign(payRollData, { companyId: userData?.user?.companyId });
        setIsLoading(true);
        await UserSalaryService.create(
            {
                ...payRollData
            },
            {
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            }
        )
            .then((res) => {
                setIsLoading(false);
                setPayrollValues({ payGroupId: res?.payGroupId, annualCTC: res?.annualCTC, monthlyCTC: res?.monthlyCtc });
                setSalaryBreakdown(res);
            })
            .catch((error) => {
                setIsLoading(false);
                toast.error(error.message);
            });
    };

    const updateUserSalary = (compensation, breakdown) => {
        toast.success('User salary updated successfully');
    };

    const getUserSalary = (query) => {
        setRequestQuery(query);
        setLoader(true);
        UserSalaryService.find({
            query: { userId: empId, $sort: { createdAt: -1 } },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                setSalaryBreakdown(res?.data[0]);
                fetchPayGroupById(res?.data[0]?.payGroupId);
                setPayrollValues({ payGroupId: res?.data[0]?.payGroupId, annualCTC: res?.data[0]?.annualCTC, monthlyCTC: res?.data[0]?.monthlyCtc });
            })
            .catch((error) => {
                setLoader(false);
            });
    };

    const fetchData = async () => {
        setUserId(empId);
        await fetchPaygroup();
        getUserSalary(requestQuery);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchSalaryComponent = (payGroupId, monthSal, anualSal) => {
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
                    const monthlyAmount = { ...monthSal };
                    const annualAmount = { ...anualSal };
                    const data = res?.data;
                    if (Object.keys(monthlyAmount).length > 0) {
                        Object.entries(monthlyAmount).map(([key, val]) => {
                            data.map((each, index) => {
                                if (each?.salaryComponentId?.name === key) {
                                    data[index]['monthlyAmount'] = val;
                                }
                            });
                        });
                        Object.entries(annualAmount).map(([key, val]) => {
                            data.map((each, index) => {
                                if (each?.salaryComponentId?.name === key) {
                                    data[index]['annualAmount'] = val;
                                }
                            });
                        });
                    }
                    setSalaryComponentList(data);
                    setTotalSalaryComponent(res?.total);
                })
                .catch((error) => {
                    toast.error(error, toastSettings);
                });
        }
    };

    const fetchPayGroupById = (payGroupId) => {
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
                setLoader(false);
                setPayGroupsById(res?.data);
            })
            .catch((error) => {
                setLoader(false);
            });
    };

    const replaceIdsWithNames = (data, type) => {
        if (type === 'formula') {
            return payGroupsById[0]?.components?.reduce((updatedFormula, component) => {
                const idRegex = new RegExp(`\\b${component.component._id}\\b`, 'g');
                return updatedFormula.replace(idRegex, component.component.name);
            }, data);
        }
        if (type === 'fixed') {
            return '-';
        }
    };

    const openModal = (type, val, data) => {
        setVisible(val);
        setTitle(type);
        setComponentValues(data);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPayrollValues({ ...payrollValues, [name]: value });
        fetchPayGroupById(value);
    };

    return (
        <div>
            <div className="emp_header">
                <h6>Compensation</h6>
            </div>
            <Formik
                enableReinitialize
                initialValues={payrollValues}
                validationSchema={userSalarySchema}
                onSubmit={(values, event) => {
                    fetchUserSalary(values, event);
                }}
            >
                <Form className="form-card">
                    <div className="row">
                        <div className="col-md-4">
                            <label className="form-label w-100">
                                Select Paygroup*
                                <Field name="payGroupId" id="payGroupId" as="select" className="form-control pt-2" onChange={handleChange}>
                                    <option value="">-Select-</option>
                                    {paygroupList && paygroupList?.length > 0
                                        ? paygroupList?.map((data, index) => (
                                              <option key={data._id} value={data?._id}>
                                                  {data?.name}
                                              </option>
                                          ))
                                        : null}
                                </Field>
                                <ErrorMessage name="payGroupId" component="div" className="error" />
                            </label>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label w-100">
                                Annual CTC*
                                <Field name="annualCTC" id="annualCTC" className="form-control pt-2" onChange={handleChange} />
                                <ErrorMessage name="annualCTC" component="div" className="error" />
                            </label>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label w-100">
                                Monthly CTC
                                <Field type="text" name="monthlyCTC" id="monthlyCTC" className="form-control pt-2" disabled />
                                <ErrorMessage name="monthlyCTC" component="div" className="error" />
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <button type="submit" className="btn btn-primary mt-3">
                                View Salary Breakdown
                            </button>
                        </div>
                    </div>
                </Form>
            </Formik>
            {salaryBreakdown && salaryBreakdown?.salaryStructure?.length > 0 ? (
                <div className="row">
                    <div className="col-md-12">
                        <table className="table table-bordered table-hover">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Component</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Value Type</th>
                                    <th scope="col">Formula/Value</th>
                                    <th scope="col">Monthly</th>
                                    <th scope="col">Annually</th>
                                    {/* <th scope="col">Action</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {salaryBreakdown && salaryBreakdown?.salaryStructure?.length > 0 ? (
                                    salaryBreakdown?.salaryStructure?.map((component, index) => (
                                        <tr key={`key-${index}`}>
                                            <th scope="row">{component.name}</th>
                                            <td>
                                                <span className={component?.type === 'deduction' ? 'text-danger' : 'text-success'}>{component?.type || 'N/A'}</span>
                                            </td>
                                            <td>{component?.valueType || 'N/A'}</td>
                                            <td>{component?.valueType === 'fixed' ? component?.value : replaceIdsWithNames(component?.formula, component?.valueType)}</td>
                                            <td>{component?.monthlyValue ? `${component?.monthlyValue.toFixed(2)}` : 'N/A'}</td>
                                            <td>&#8377; {component?.value ? component?.value.toFixed(2) : 'N/A'}</td>
                                            {/* <td>
                                                <button className="btn btn-primary" type="button" onClick={() => openModal('Update Pay Component', true, component)}>
                                                    <i className="pi pi-pencil"></i>
                                                </button>
                                            </td> */}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7}>
                                            <div className="alert alert-success text-center" role="alert">
                                                No component found!!!
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                <tr>
                                    <td colSpan={7}>
                                        <button style={{ float: 'right' }} className="btn btn-primary" type="button" onClick={() => updateUserSalary(compensationData, salaryBreakdown)}>
                                            Submit
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <SimpleModal
                            title={title}
                            visible={visible}
                            setVisible={() => setVisible(false)}
                            body={
                                <CompensationUpdateForm
                                    setVisible={() => setVisible(false)}
                                    componentValues={componentValues}
                                    getUserSalary={() => getUserSalary(requestQuery)}
                                    fetchAllComponent={() => fetchSalaryComponent(compensationData?.payGroupId, monthlySalary, anuallSalary)}
                                    empId={userId}
                                    userSalaryRes={userSalaryRes}
                                />
                            }
                        ></SimpleModal>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default CompensationForm;
