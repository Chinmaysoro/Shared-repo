import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import TokenService from '../../redux/services/token.service';
import { leaveBalanceSchema } from '../../redux/helpers/validations';
import { LeaveBalanceService, PayGroupService, LeaveTypeService } from '../../redux/services/feathers/rest.app';
import { convertTimeToUTC, convertUTCToLocalTime, convertUTCTo24HourTime } from '../../redux/helpers/dateHelper';
import { getUser } from '../../redux/helpers/user';

const AddLeaveBalance = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [payGroupLoader, setPayGroupLoader] = useState(false);
    const [componentValues, setcomponentValues] = useState({});
    const [paygroupList, setPaygroupList] = useState([]);
    const [allLeaveTypeList, setAllLeaveTypeList] = useState([]);

    const addUpdate = (values) => {
        if (props?.componentValues !== null) {
            setLoader(true);
            LeaveBalanceService.patch(
                values?._id,
                {
                    ...values
                },
                {
                    headers: {
                        Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                    }
                }
            )
                .then((res) => {
                    setLoader(false);
                    toast.success('Leave balance updated successfully.');
                    props?.setVisible();
                    props?.fetchAllLeaveBalance();
                })
                .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
        } else {
            const data = values;
            Object.assign(data, { companyId: userData?.user?.companyId });
            setLoader(true);
            LeaveBalanceService.create(
                { ...data },
                {
                    headers: {
                        Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                    }
                }
            )
                .then((res) => {
                    setLoader(false);
                    toast.success('Leave balance created successfully.');
                    props?.setVisible();
                    props?.fetchAllLeaveBalance();
                })
                .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
        }
    };

    const fetchPaygroup = async () => {
        if (userData?.user?.companyId) {
            setPayGroupLoader(true);
            PayGroupService.find({
                query: { companyId: userData?.user?.companyId, $sort: { createdAt: -1 } },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setPayGroupLoader(false);
                    setPaygroupList(res.data);
                })
                .catch((error) => {
                    setPayGroupLoader(false);
                });
        }
    };

    const fetchData = async () => {
        await fetchPaygroup();
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
        fetchData();
        if (props?.componentValues !== null) {
            const data = {
                payGroupId: props?.componentValues?.payGroupId?._id,
                leaveType: props?.componentValues?.leaveType?._id,
                balance: props?.componentValues?.balance,
                _id: props?.componentValues?._id
            };
            setcomponentValues({ ...componentValues, ...data });
        }
    }, []);

    return (
        <Formik
            enableReinitialize
            initialValues={componentValues}
            validationSchema={leaveBalanceSchema}
            onSubmit={(values) => {
                addUpdate(values);
            }}
        >
            {({ values, errors, touched }) => (
                <Form>
                    <div className="">
                        <div className="">
                            <div className="mb-2 ml_label">
                                <label htmlFor="payGroupId" className="form-label">
                                    Select Paygroup
                                </label>
                                <Field name="payGroupId" id="payGroupId" as="select" className="form-control pt-2">
                                    <option value="">-Select-</option>
                                    {paygroupList && paygroupList?.length > 0
                                        ? paygroupList?.map((data, index) => (
                                              <option key={data._id} value={data?._id}>
                                                  {data?.name}
                                              </option>
                                          ))
                                        : null}
                                </Field>
                                {errors.payGroupId && touched.payGroupId ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.payGroupId}</small>
                                    </p>
                                ) : null}
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
                                {errors.leaveType && touched.leaveType ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.leaveType}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="balance" className="form-label">
                                    Balance*
                                </label>
                                <Field type="number" name="balance" id="balance" className="form-control pt-2" />
                                {errors.balance && touched.balance ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.balance}</small>
                                    </p>
                                ) : null}
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

export default AddLeaveBalance;
