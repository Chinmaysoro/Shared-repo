import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import TokenService from '../../redux/services/token.service';
import { leavePolicySchema } from '../../redux/helpers/validations';
import { LeaveBalanceService, PayGroupService, LeaveTypeService, ShiftPolicyService } from '../../redux/services/feathers/rest.app';
import { convertTimeToUTC, convertUTCToLocalTime, convertUTCTo24HourTime } from '../../redux/helpers/dateHelper';
import { getUser } from '../../redux/helpers/user';

const AddLeavePolicy = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [payGroupLoader, setPayGroupLoader] = useState(false);
    const [componentValues, setcomponentValues] = useState({
        policyName: ''
        // policyLeaveType: '',
        // numberLeaveCredited: '',
        // creditFrequency: '',
        // maxLeaveCarryForward: '',
        // leave_type: '',
        // encashmentAllowed: '',
        // roundOffLeave: '',
        // enableLeaveReqFromDoj: '',
        // elligibleDays: '',
        // canLeaveOnWeekOff: '',
        // canLeaveOnHoliday: '',
        // documentProof: '',
        // leaveIsMoreThanDays: '',
        // clubbing: '',
        // leaveType: ''
    });
    const [paygroupList, setPaygroupList] = useState([]);
    const [allLeaveTypeList, setAllLeaveTypeList] = useState([]);

    const addUpdate = (values) => {
        const data = {};
        data['policyName'] = values?.policyName;
        // data['policyLeaveType'] = values?.policyLeaveType;
        // data['numberLeaveCredited'] = values?.numberLeaveCredited;
        // data['creditFrequency'] = values?.creditFrequency;
        // data['maxLeaveCarryForward'] = values?.maxLeaveCarryForward;
        // data['leave_type'] = values?.leave_type;
        // data['encashmentAllowed'] = values?.encashmentAllowed === 'Yes' ? true : false;
        // data['roundOffLeave'] = values?.roundOffLeave === 'Yes' ? true : false;
        // data['enableLeaveReqFromDoj'] = values?.enableLeaveReqFromDoj === 'Yes' ? true : false;
        // data['elligibleDays'] = values?.elligibleDays;
        // data['canLeaveOnWeekOff'] = values?.canLeaveOnWeekOff === 'Yes' ? true : false;
        // data['canLeaveOnHoliday'] = values?.canLeaveOnHoliday === 'Yes' ? true : false;
        // data['documentProof'] = values?.documentProof === 'Yes' ? true : false;
        // data['leaveIsMoreThanDays'] = values?.leaveIsMoreThanDays;
        // data['clubbing'] = values?.clubbing === 'Yes' ? true : false;
        // data['leaveType'] = values?.leaveType;

        Object.keys(data).forEach((key) => data[key] === '' && delete data[key]);
        Object.keys(data).forEach((key) => data[key] === null && delete data[key]);
        Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);

        if (props?.componentValues !== null) {
            setLoader(true);
            ShiftPolicyService.patch(
                componentValues?._id,
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
                    toast.success('Shift applicability updated successfully.');
                    props?.setVisible();
                    props?.fetchAllShiftPolicy();
                })
                .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
        } else {
            const addformdata = data;
            Object.assign(addformdata, { companyId: userData?.user?.companyId });
            setLoader(true);
            ShiftPolicyService.create(
                { ...addformdata },
                {
                    headers: {
                        Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                    }
                }
            )
                .then((res) => {
                    setLoader(false);
                    toast.success('Shift applicability created successfully.');
                    props?.setVisible();
                    props?.fetchAllShiftPolicy();
                })
                .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setcomponentValues({ ...componentValues, [name]: value });
    };

    const fetchData = async () => {
        await fetchAllLeaveType();
    };

    const fetchAllLeaveType = async (value) => {
        await LeaveTypeService.find({
            query: {
                $skip: 0,
                $limit: 100,
                $sort: { createdAt: -1 },
                companyId: userData?.user?.companyId
            },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setAllLeaveTypeList(res?.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        // fetchData();
        if (props?.componentValues !== null) {
            const data = {
                policyName: props?.componentValues?.policyName,
                // policyLeaveType: props?.componentValues?.policyLeaveType,
                // numberLeaveCredited: props?.componentValues?.numberLeaveCredited,
                // creditFrequency: props?.componentValues?.creditFrequency,
                // maxLeaveCarryForward: props?.componentValues?.maxLeaveCarryForward,
                // leave_type: props?.componentValues?.leave_type,
                // encashmentAllowed: props?.componentValues?.encashmentAllowed === true ? 'Yes' : 'No',
                // roundOffLeave: props?.componentValues?.roundOffLeave === true ? 'Yes' : 'No',
                // enableLeaveReqFromDoj: props?.componentValues?.enableLeaveReqFromDoj === true ? 'Yes' : 'No',
                // elligibleDays: props?.componentValues?.elligibleDays,
                // canLeaveOnWeekOff: props?.componentValues?.canLeaveOnWeekOff === true ? 'Yes' : 'No',
                // canLeaveOnHoliday: props?.componentValues?.canLeaveOnHoliday === true ? 'Yes' : 'No',
                // documentProof: props?.componentValues?.documentProof === true ? 'Yes' : 'No',
                // leaveIsMoreThanDays: props?.componentValues?.leaveIsMoreThanDays,
                // clubbing: props?.componentValues?.clubbing === true ? 'Yes' : 'No',
                // leaveType: props?.componentValues?.leaveType?._id,
                _id: props?.componentValues?._id
            };
            setcomponentValues({ ...componentValues, ...data });
        }
    }, []);

    return (
        <Formik
            enableReinitialize
            initialValues={componentValues}
            validationSchema={leavePolicySchema}
            onSubmit={(values) => {
                addUpdate(values);
            }}
        >
            {({ values, errors, touched }) => (
                <Form>
                    <div className="">
                        <div className="">
                            <div className="mb-2 ml_label">
                                <label htmlFor="policyName" className="form-label">
                                    Shift Name*
                                </label>
                                <Field type="text" name="policyName" id="policyName" className="form-control pt-2" onKeyUp={handleChange} />
                                <ErrorMessage name="policyName" component="small" className="error" />
                            </div>
                            {/* <div className="mb-2 ml_label"> */}
                            {/* <label htmlFor="policyLeaveType" className="form-label">
                                    Leave Policy Type*
                                </label> */}
                            {/* <Field name="policyLeaveType" id="policyLeaveType" as="select" className="form-control pt-2" onChange={handleChange}>
                                    <option value="">-Select-</option>
                                    {allLeaveTypeList &&
                                        allLeaveTypeList.length > 0 &&
                                        allLeaveTypeList.map((leave, index) => (
                                            <option key={`key-${index}`} value={leave._id}>
                                                {leave?.name}
                                            </option>
                                        ))}
                                </Field> */}
                            {/* <ErrorMessage name="policyLeaveType" component="small" className="error" /> */}
                            {/* </div> */}
                            {/* <div className="mb-2 ml_label">
                                <label htmlFor="numberLeaveCredited" className="form-label">
                                    No. of Leave to Credit*
                                </label>
                                <Field type="number" name="numberLeaveCredited" id="numberLeaveCredited" className="form-control pt-2" onKeyUp={handleChange} />
                                <ErrorMessage name="numberLeaveCredited" component="small" className="error" />
                            </div> */}
                            {/* <div className="mb-2 ml_label">
                                <label htmlFor="creditFrequency" className="form-label">
                                    Crediting Frequency*
                                </label>
                                <Field name="creditFrequency" id="creditFrequency" as="select" className="form-control pt-2" onChange={handleChange}>
                                    <option value="">-Select-</option>
                                    {[
                                        { label: 'Monthly', value: 1 },
                                        { label: 'Quarterly', value: 3 },
                                        { label: 'Half Yearly', value: 6 },
                                        { label: 'Yearly', value: 12 }
                                    ].map((data, index) => (
                                        <option key={`key-${data.value}`} value={data.value}>
                                            {data.label}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="creditFrequency" component="small" className="error" />
                            </div> */}
                            {/* <div className="mb-2 ml_label">
                                <label htmlFor="maxLeaveCarryForward" className="form-label">
                                    Max Leaves Carry Forward*
                                </label>
                                <Field type="number" name="maxLeaveCarryForward" id="maxLeaveCarryForward" className="form-control pt-2" onKeyUp={handleChange} />
                                <ErrorMessage name="maxLeaveCarryForward" component="small" className="error" />
                            </div> */}
                            {/* <div className="mb-2 ml_label">
                                <label htmlFor="leave_type" className="form-label">
                                    Leave Type*
                                </label>
                                <Field name="leave_type" id="leave_type" as="select" className="form-control pt-2" onChange={handleChange}>
                                    <option value="">-Select-</option>
                                    {[
                                        { name: 'Paid', value: 'paid' },
                                        { name: 'Unpaid', value: 'unpaid' }
                                    ].map((leave, index) => (
                                        <option key={`key-${index}`} value={leave.value}>
                                            {leave?.name}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage name="leave_type" component="small" className="error" />
                            </div> */}
                            {/* <div className="mb-2 ml_label">
                                <label className="form-label">Encashment Allowed*</label>
                                <div className="d-flex">
                                    <div className="d-flex">
                                        {['Yes', 'No'].map((data, index) => (
                                            <div className="d-flex mr-4">
                                                <label htmlFor="encashmentAllowed" className="radio-label w-100">
                                                    <Field id="encashmentAllowed" name="encashmentAllowed" type="radio" value={data} className="ga" onChange={handleChange} />
                                                    {data}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <ErrorMessage name="encashmentAllowed" component="small" className="error" />
                                </div>
                            </div> */}
                            {/* <div className="mb-2 ml_label">
                                <label htmlFor="roundOffLeave" className="form-label">
                                    Round Off Leaves*
                                </label>
                                <div className="d-flex">
                                    <div className="d-flex">
                                        {['Yes', 'No'].map((data, index) => (
                                            <div className="d-flex mr-4">
                                                <Field id="roundOffLeave" name="roundOffLeave" type="radio" value={data} className="ga" onChange={handleChange} />
                                                <label htmlFor="roundOffLeave" className="radio-label w-100">
                                                    {data}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <ErrorMessage name="roundOffLeave" component="small" className="error" />
                                </div>
                            </div> */}
                            {/* <div className="mb-2 ml_label">
                                <label htmlFor="enableLeaveReqFromDoj" className="form-label">
                                    Enable Leave Request from Date of Joining*
                                </label>
                                <div className="d-flex">
                                    <div className="d-flex">
                                        {['Yes', 'No'].map((data, index) => (
                                            <div className="d-flex mr-4">
                                                <Field id="enableLeaveReqFromDoj" name="enableLeaveReqFromDoj" type="radio" value={data} className="ga" onChange={handleChange} />
                                                <label htmlFor="enableLeaveReqFromDoj" className="radio-label w-100">
                                                    {data}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <ErrorMessage name="enableLeaveReqFromDoj" component="small" className="error" />
                                </div>
                            </div> */}
                            {/* {componentValues?.enableLeaveReqFromDoj === 'No' && (
                                <div className="mb-2 ml_label">
                                    <label htmlFor="elligibleDays" className="form-label">
                                        If No, Employee Eligibility (in days)
                                    </label>
                                    <Field type="number" name="elligibleDays" id="elligibleDays" className="form-control pt-2" onKeyUp={handleChange} />
                                    <ErrorMessage name="elligibleDays" component="small" className="error" />
                                </div>
                            )} */}
                            {/* <div className="mb-2 ml_label">
                                <label htmlFor="canLeaveOnWeekOff" className="form-label">
                                    Can Apply to Leave on Week Off*
                                </label>
                                <div className="d-flex">
                                    <div className="d-flex">
                                        {['Yes', 'No'].map((data, index) => (
                                            <div className="d-flex mr-4">
                                                <Field id="canLeaveOnWeekOff" name="canLeaveOnWeekOff" type="radio" value={data} className="ga" onChange={handleChange} />
                                                <label htmlFor="canLeaveOnWeekOff" className="radio-label w-100">
                                                    {data}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <ErrorMessage name="canLeaveOnWeekOff" component="small" className="error" />
                                </div>
                            </div> */}
                            {/* <div className="mb-2 ml_label">
                                <label htmlFor="canLeaveOnHoliday" className="form-label">
                                    Can Apply to Leave on Holiday*
                                </label>
                                <div className="d-flex">
                                    <div className="d-flex">
                                        {['Yes', 'No'].map((data, index) => (
                                            <div className="d-flex mr-4">
                                                <Field id="canLeaveOnHoliday" name="canLeaveOnHoliday" type="radio" value={data} className="ga" onChange={handleChange} />
                                                <label htmlFor="canLeaveOnHoliday" className="radio-label w-100">
                                                    {data}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <ErrorMessage name="canLeaveOnHoliday" component="small" className="error" />
                                </div>
                            </div> */}
                            {/* <div className="mb-2 ml_label">
                                <label htmlFor="documentProof" className="form-label">
                                    Document Proof Required?
                                </label>
                                <div className="d-flex">
                                    <div className="d-flex">
                                        {['Yes', 'No'].map((data, index) => (
                                            <div className="d-flex mr-4">
                                                <Field id="documentProof" name="documentProof" type="radio" value={data} className="ga" onChange={handleChange} />
                                                <label htmlFor="documentProof" className="radio-label w-100">
                                                    {data}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <ErrorMessage name="documentProof" component="small" className="error" />
                                </div>
                            </div> */}
                            {/* {componentValues?.documentProof === 'Yes' && (
                                <div className="mb-2 ml_label">
                                    <label htmlFor="leaveIsMoreThanDays" className="form-label">
                                        If Yes Leave is more than how many days?
                                    </label>
                                    <Field type="number" name="leaveIsMoreThanDays" id="leaveIsMoreThanDays" className="form-control pt-2" onKeyUp={handleChange} />
                                    <ErrorMessage name="leaveIsMoreThanDays" component="small" className="error" />
                                </div>
                            )} */}
                            {/* <div className="mb-2 ml_label">
                                <label htmlFor="clubbing" className="form-label">
                                    Clubbing*
                                </label>
                                <div className="d-flex">
                                    <div className="d-flex">
                                        {['Yes', 'No'].map((data, index) => (
                                            <div className="d-flex mr-4">
                                                <Field id="clubbing" name="clubbing" type="radio" value={data} className="ga" onChange={handleChange} />
                                                <label htmlFor="clubbing" className="radio-label w-100">
                                                    {data}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div> */}
                            {/* {componentValues?.clubbing === 'Yes' && (
                                <div className="mb-2 ml_label">
                                    <label htmlFor="leaveType" className="form-label">
                                        Which type of leave you want to clubbing?
                                    </label>
                                    <Field name="leaveType" id="leaveType" as="select" className="form-control pt-2" onChange={handleChange}>
                                        <option value="">-Select-</option>
                                        {allLeaveTypeList &&
                                            allLeaveTypeList.length > 0 &&
                                            allLeaveTypeList.map((leave, index) => (
                                                <option key={`key-${index}`} value={leave._id}>
                                                    {leave?.name}
                                                </option>
                                            ))}
                                    </Field>
                                    <ErrorMessage name="leaveType" component="small" className="error" />
                                </div>
                            )} */}
                        </div>
                        <div>
                            <button className="btn btn-primary" type="submit" disabled={loader}>
                                Submit
                            </button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default AddLeavePolicy;
