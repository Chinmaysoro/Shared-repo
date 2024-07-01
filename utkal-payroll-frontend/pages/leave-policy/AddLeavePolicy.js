import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import TokenService from '../../redux/services/token.service';
import { leavePolicySchema } from '../../redux/helpers/validations';
import { LeaveBalanceService, PayGroupService, LeaveTypeService, LeavePolicyService } from '../../redux/services/feathers/rest.app';
import { convertTimeToUTC, convertUTCToLocalTime, convertUTCTo24HourTime } from '../../redux/helpers/dateHelper';
import { getUser } from '../../redux/helpers/user';

const AddLeavePolicy = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [payGroupLoader, setPayGroupLoader] = useState(false);
    const [componentValues, setcomponentValues] = useState({
        policyName: ''
    });
    const [paygroupList, setPaygroupList] = useState([]);
    const [allLeaveTypeList, setAllLeaveTypeList] = useState([]);

    const addUpdate = (values) => {
        const data = {};
        data['policyName'] = values?.policyName;

        Object.keys(data).forEach((key) => data[key] === '' && delete data[key]);
        Object.keys(data).forEach((key) => data[key] === null && delete data[key]);
        Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);

        if (props?.componentValues !== null) {
            setLoader(true);
            LeavePolicyService.patch(
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
                    toast.success('Leave policy updated successfully.');
                    props?.setVisible();
                    props?.fetchAllLeavePolicy();
                })
                .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
        } else {
            const addformdata = data;
            Object.assign(addformdata, { companyId: userData?.user?.companyId });

          //  console.log(addformdata,'::::::::::::::::::addformdata')
            setLoader(true);
            LeavePolicyService.create(
                { ...addformdata },
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
                    props?.fetchAllLeavePolicy();
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
        fetchData();
        if (props?.componentValues !== null) {
            const data = {
                policyName: props?.componentValues?.policyName,
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
                                    Policy Name*
                                </label>
                                <Field type="text" name="policyName" id="policyName" className="form-control pt-2" onKeyUp={handleChange} />
                                <ErrorMessage name="policyName" component="small" className="error" />
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

export default AddLeavePolicy;
