import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { employeeLeaveSchema } from '../../redux/helpers/validations';
import { LeaveService, UserService, LeaveTypeService } from '../../redux/services/feathers/rest.app';
import { getUser } from '../../redux/helpers/user';

const CreateLeave = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [leaveValues, setLeaveValues] = useState({});
    const [visibleUsersDropdown, setVisibleUsersDropdown] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [managerName, setManagerName] = useState('');
    const [userValues, setUserValues] = useState(null);
    const [leaveId, setLeaveId] = useState('');
    const [allLeaveTypeList, setAllLeaveTypeList] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setManagerName(value);
        if (name === 'createdBy') {
            getAllUser(value);
        }
    };

    const getAllUser = async (value) => {
        if (userData?.user?.companyId) {
            await UserService.find({
                query: {
                    $or: [
                        {
                            firstName: {
                                $regex: `.*${value}.*`,
                                $options: 'i'
                            }
                        },
                        {
                            lastName: {
                                $regex: `.*${value}.*`,
                                $options: 'i'
                            }
                        },
                        {
                            email: {
                                $regex: `.*${value}.*`,
                                $options: 'i'
                            }
                        },
                        {
                            phone: {
                                $regex: `.*${value}.*`,
                                $options: 'i'
                            }
                        }
                    ],
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
                    setVisibleUsersDropdown(true);
                    setAllUsers(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const addUpdateLeave = (values) => {
        if (props?.leaveValues !== null) {
            const data = {
                ...values
            };
            data['approvalStatus'] = 'approved';
            setLoader(true);
            LeaveService.patch(
                leaveId,
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
                    toast.success('Leave updated successfully.');
                    props?.setVisible();
                    props?.fetchAllLeaves();
                })
                .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
        }
        // else {
        //     const data = { ...values };
        //     if (userValues !== null) {
        //         data["createdBy"] = userValues?._id;
        //     }
        //     delete data['name'];
        //     setLoader(true);
        //     LeaveService.create(
        //         { ...data },
        //         {
        //             headers: {
        //                 Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
        //             }
        //         }
        //     )
        //         .then((res) => {
        //             setLoader(false);
        //             toast.success('Leave created successfully.');
        //             props?.setVisible();
        //             props?.fetchAllLeaves();
        //         })
        //         .catch((error) => {
        //             setLoader(false);
        //             toast.error(error.message);
        //         });
        // }
    };

    const setFormValues = (type, data) => {
        if (type === 'createdBy') {
            setUserValues(data);
            setVisibleUsersDropdown(false);
        }
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
        fetchAllLeaveType();
        // console.log(props?.leaveValues,":::::::::props?.leaveValues")
        if (props?.leaveValues !== null) {
            const data = {
                startDate: props?.leaveValues?.startDate ? moment(props?.leaveValues?.startDate).format('YYYY-MM-DD') : null,
                endDate: props?.leaveValues?.endDate ? moment(props?.leaveValues?.endDate).format('YYYY-MM-DD') : null,
                reason: props?.leaveValues?.reason,
                leaveType: props?.leaveValues?.leaveType,
                leaveDay: props?.leaveValues?.leaveDay
            };
            setLeaveId(props?.leaveValues?._id);
            setLeaveValues({ ...leaveValues, ...data });
        }
    }, []);

    return (
        <Formik
            enableReinitialize
            initialValues={leaveValues}
            validationSchema={employeeLeaveSchema}
            onSubmit={(values, event) => {
                addUpdateLeave(values);
            }}
        >
            {({ values, errors, touched, setFieldTouched, setFieldValue }) => (
                <Form>
                    <div className="">
                        <div className="">
                            {/* <div className="mb-2 ml_label">
                                <label className="form-label">Employee name*</label>
                                <div className="form-group">
                                    <Field type="text" placeholder="Enter employee name" className="form-control" name="createdBy" id="createdBy" onKeyUp={handleChange} />
                                    {visibleUsersDropdown && allUsers.length > 0 ? (
                                        <ul className="t_ul" style={{ width: '95%' }}>
                                            {allUsers.map((user, index) => {
                                                return (
                                                    <li
                                                        key={`key-${index}`}
                                                        onClick={() => {
                                                            setFormValues('createdBy', user);
                                                            setFieldTouched('createdBy', true);
                                                            setFieldValue('createdBy', `${user?.firstName} ${user?.lastName}`);
                                                        }}
                                                    >
                                                        {`${user?.firstName} ${user?.lastName}`}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : null}
                                </div>
                            </div> */}
                            <div className="mb-2 ml_label">
                                <label htmlFor="startDate" className="form-label">
                                    From Date*
                                </label>
                                <Field type="date" className="form-control pt-2" name="startDate" id="startDate" />
                                {errors.startDate && touched.startDate ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.startDate}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="endDate" className="form-label">
                                    To Date*
                                </label>
                                <Field type="date" className="form-control pt-2" name="endDate" id="endDate" />
                                {errors.endDate && touched.endDate ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.endDate}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="reason" className="form-label">
                                    Reason
                                </label>
                                <Field type="text" className="form-control pt-2" name="reason" id="reason" />
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="leaveDay" className="form-label">
                                    Leave Day*
                                </label>
                                <Field name="leaveDay" id="leaveDay" as="select" className="form-control pt-2">
                                    <option value="">-Select-</option>
                                    {[
                                        { label: 'Half Day', value: 'halfDay' },
                                        { label: 'Full Day', value: 'fullDay' }
                                    ].map(({ label, value }) => (
                                        <option key={value} value={value} selected={value == leaveValues?.leaveDay ? true : false}>
                                            {label}
                                        </option>
                                    ))}
                                </Field>
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="leaveType" className="form-label">
                                    Leave Type*
                                </label>
                                <Field name="leaveType" id="leaveType" as="select" className="form-control pt-2">
                                    <option value="">-Select-</option>
                                    {allLeaveTypeList &&
                                        allLeaveTypeList.length > 0 &&
                                        allLeaveTypeList.map((leave, index) => (
                                            <option key={`key-${index}`} value={leave._id}>
                                                {leave?.name}
                                            </option>
                                        ))}
                                </Field>
                            </div>
                        </div>
                        <div>
                            <button className="btn btn-primary" type="submit">
                                Approve
                            </button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default CreateLeave;
