import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { leaveTypeSchema } from '../../redux/helpers/validations';
import { LeaveTypeService } from '../../redux/services/feathers/rest.app';
import { getUser } from '../../redux/helpers/user';

const AddDepartmentComponent = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [leaveTypeValues, setleaveTypeValues] = useState({
        name: '',
        isEncashmentAllowed: false,
        isHalfDayAllowed: false,
        maxCarryForward: '',
        noOfLeavesCredited: ''
    });
    const creditFrequency = ['Monthly', 'Quarterly', 'Half Yearly', 'Yearly', 'None'];
    const handleChange = (e) => {
        const { name, value } = e.target;
        setleaveTypeValues({ ...leaveTypeValues, [name]: value });
    };

    const addUpdateDepartment = (values) => {
        //console.log(values,"::::::::::values")
        if (userData?.user?.companyId) {
            if (props?.leaveTypeValues !== null) {
                const data = {
                    name: values?.name,
                    shortName: values?.shortName
                    // isEncashmentAllowed: values?.isEncashmentAllowed ? values?.isEncashmentAllowed : false,
                    // isHalfDayAllowed: values?.isHalfDayAllowed ? values?.isHalfDayAllowed : false,
                    // maxCarryForward: values?.maxCarryForward,
                    // noOfLeavesCredited: values?.noOfLeavesCredited
                };
                setLoader(true);
                LeaveTypeService.patch(
                    values?._id,
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
                        toast.success('Leave type updated successfully.');
                        props?.setVisible();
                        props?.fetchAllLeaveType();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            } else {
                const data = values;
                Object.assign(data, { companyId: userData?.user?.companyId });
                setLoader(true);
                LeaveTypeService.create(
                    { ...data },
                    {
                        headers: {
                            Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                        }
                    }
                )
                    .then((res) => {
                        setLoader(false);
                        toast.success('Leave type created successfully.');
                        props?.setVisible();
                        props?.fetchAllLeaveType();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            }
        }
    };

    useEffect(() => {
        if (props?.leaveTypeValues !== null) {
            setleaveTypeValues({ ...leaveTypeValues, ...props?.leaveTypeValues });
        }
    }, []);

    return (
        <Formik enableReinitialize initialValues={leaveTypeValues} validationSchema={leaveTypeSchema} onSubmit={addUpdateDepartment}>
            {({ errors, touched }) => (
                <Form>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="mb-2 ml_label">
                                <label htmlFor="name" className="form-label">
                                    Leave Type*
                                </label>
                                <Field type="text" className="form-control pt-2" name="name" id="name" onKeyUp={handleChange} />
                                {errors.name && touched.name ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.name}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="shortName" className="form-label">
                                    Short Name*
                                </label>
                                <Field type="text" className="form-control pt-2" name="shortName" id="shortName" onKeyUp={handleChange} />
                                {errors.shortName && touched.shortName ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.shortName}</small>
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        {/* <div className="col-md-4">
                                <label htmlFor="maxCarryForward" className="form-label w-100">
                                Maximum Carry-Forward
                                    <Field type="number" min="1"  name="maxCarryForward" id="maxCarryForward" className="form-control pt-2" />
                                </label>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="noOfLeavesCredited" className="form-label w-100">
                                No Of leaves to be credited 
                                    <Field type="number" min="1" name="noOfLeavesCredited" id="noOfLeavesCredited" className="form-control pt-2"  />
                                </label>
                            </div> 
                            <div className="col-md-4">
                                        <label htmlFor='creditFrequency' className="form-label w-100">
                                        Credit Frequency
                                            <Field as="select" name='creditFrequency' id="creditFrequency" className="form-control">
                                                <option value="" disabled>
                                                    Select
                                                </option>{' '}
                                                {creditFrequency.map((optionDay) => (
                                                    <option key={optionDay} value={optionDay}>
                                                        {optionDay}
                                                    </option>
                                                ))}
                                            </Field>
                                        </label>
                                    </div>
                            <div className="col-md-4">
                                <label htmlFor="isEncashmentAllowed" className="form-label w-100">
                                Is Encashment Allowed
                                    <Field type="checkbox"  name="isEncashmentAllowed" id="isEncashmentAllowed" className="ml-3 mt-2" />
                                </label>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="isHalfDayAllowed" className="form-label w-100">
                                Allow Half-Day Leave
                                    <Field type="checkbox" name="isHalfDayAllowed" id="isHalfDayAllowed" className="ml-3 mt-2" />
                                </label>
                            </div>
                            <div className="col-md-4"></div> */}
                        <div>
                            <button className="btn btn-primary ml-3" type="submit">
                                Submit
                            </button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default AddDepartmentComponent;
