import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import moment from 'moment';
import TokenService from '../../redux/services/token.service';
import { ShiftPolicyDetailSchema } from '../../redux/helpers/validations';
import { LeaveBalanceService, PayGroupService, LeaveTypeService, LeavePolicyService, CompanyShiftsService, ShiftPolicyService } from '../../redux/services/feathers/rest.app';
import { convertTimeToUTC, convertUTCToLocalTime, convertUTCTo24HourTime } from '../../redux/helpers/dateHelper';
import { getUser, decodedID } from '../../redux/helpers/user';
const AddLeavePolicyDetail = (props) => {
    const userData = getUser();
    const router = useRouter();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const policy_Id = decodedID(router?.query?.policyId);
    const [payGroupLoader, setPayGroupLoader] = useState(false);
    const [componentValues, setcomponentValues] = useState({
        companyShiftId: '',
        rotationFrequency: '',
        rotationStartDay: ''
    });
    const [paygroupList, setPaygroupList] = useState([]);
    const [allLeaveTypeList, setAllLeaveTypeList] = useState([]);
    const addUpdate = async (values) => {
        const data = {};
        data['companyShiftId'] = values?.companyShiftId;
        data['rotationFrequency'] = values?.rotationFrequency;
        data['rotationStartDay'] = values?.rotationStartDay;
        if (values?._id) {
            data['_id'] = values?._id;
        }
        Object.keys(data).forEach((key) => data[key] === '' && delete data[key]);
        Object.keys(data).forEach((key) => data[key] === null && delete data[key]);
        Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);

        if (props?.componentValues !== null) {

            console.log(111)
        } else {
            const existingLeaveDetails = [];
            const addformdata = data;
            const policyName = "";
            Object.assign(addformdata, { companyId: userData?.user?.companyId });
            const queryData = {
                _id: props?.policyId
            };

            const leavePloicyName = await LeavePolicyService.find({
                query: queryData,
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            });

            policyName = leavePloicyName?.data[0]?.policyName || "";

            const queryData2 = {
                policyName: policyName
            };
            const leaveRecord = await ShiftPolicyService.find({
                query: queryData2,
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
            existingLeaveDetails = leaveRecord?.data[0]?.companyShiftId || [];

            existingLeaveDetails.push(data.companyShiftId);
            const uniqueCompanyShiftIds = Array.from(new Set(existingLeaveDetails));
            setLoader(true);
            if (leaveRecord?.data[0]) {
                // Update existing record
                ShiftPolicyService.patch(leaveRecord.data[0]._id, {
                    policyName: policyName,
                    companyId: userData?.user?.companyId,
                    companyShiftId: uniqueCompanyShiftIds,
                    rotationFrequency: data.rotationFrequency,
                    rotationStartDay: data.rotationStartDay
                }, {
                    headers: {
                        Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                    }
                })  .then((res) => {
                    setLoader(false);
                    toast.success('Shift policy updated successfully.');
                    props?.setVisible();
                    props?.fetchAllLeavePolicy();
                }) .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
            } else {
                // Create new record
                ShiftPolicyService.create({
                    policyName: policyName,
                    companyId: userData?.user?.companyId,
                    companyShiftId: uniqueCompanyShiftIds,
                    rotationFrequency: data.rotationFrequency,
                    rotationStartDay: data.rotationStartDay
                }, {
                    headers: {
                        Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                    }
                })  .then((res) => {
                    setLoader(false);
                    toast.success('Shift policy added successfully.');
                    props?.setVisible();
                    props?.fetchAllLeavePolicy();
                }) .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
            }


        }
    };

const handleChange = (e) => {
    const { name, value } = e.target;
    setcomponentValues({ ...componentValues, [name]: value });
};

const fetchData = async () => {
    await fetchAllShifts();
};

const fetchAllShifts = async (value) => {
    await CompanyShiftsService.find({
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
    fetchData();
    if (props?.componentValues !== null) {
        const data = {
            companyShiftId: props?.componentValues?.companyShiftId,
            rotationFrequency: props?.componentValues?.rotationFrequency,
            rotationStartDay: props?.componentValues?.rotationStartDay,
            _id: props?.componentValues?._id
        };
        setcomponentValues({ ...componentValues, ...data });
    }
}, []);

return (
    <Formik
        enableReinitialize
        initialValues={componentValues}
        validationSchema={ShiftPolicyDetailSchema}
        onSubmit={(values) => {
            console.log(11111111111);
            addUpdate(values);
        }}
    >
        {({ values, errors, touched }) => (
            <Form>
                <div className="">
                    <div className="">
                        <div className="mb-2 ml_label">
                            <label htmlFor="policyLeaveType" className="form-label">
                                Shift *
                            </label>
                            <Field name="companyShiftId" id="companyShiftId" as="select" className="form-control pt-2" onChange={handleChange}>
                                <option value="">-Select-</option>
                                {allLeaveTypeList &&
                                    allLeaveTypeList.length > 0 &&
                                    allLeaveTypeList.map((leave, index) => (
                                        <option key={`key-${index}`} value={leave._id}>
                                            {leave?.name}
                                        </option>
                                    ))}
                            </Field>
                            <ErrorMessage name="companyShiftId" component="small" className="error" />
                        </div>
                        <div className="row">
                            <div className='col-md-6'>
                                <div className="mb-2 ml_label">
                                    <label htmlFor="rotationFrequency" className="form-label">
                                        Rotation Frequency*
                                    </label>
                                    <Field type="number" name="rotationFrequency" id="rotationFrequency" className="form-control pt-2" onKeyUp={handleChange} />
                                    <ErrorMessage name="rotationFrequency" component="small" className="error" />
                                </div>

                            </div>
                            <div className='col-md-6'>
                                <div className="mb-2 ml_label">
                                    <label htmlFor="rotationStartDay" className="form-label">
                                        Rotation Start Day*
                                    </label>
                                    <Field type="date" name="rotationStartDay" id="rotationStartDay" className="form-control pt-2" onKeyUp={handleChange} />
                                    <ErrorMessage name="rotationStartDay" component="small" className="error" />
                                </div>
                            </div>
                        </div>







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

export default AddLeavePolicyDetail;
