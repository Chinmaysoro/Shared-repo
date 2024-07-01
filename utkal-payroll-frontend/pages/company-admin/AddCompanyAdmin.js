import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { addCompanyAdminSchema } from '../../redux/helpers/validations';
import { UserService } from '../../redux/services/feathers/rest.app';

const AddChildCompany = (props) => {
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        cnfpassword: '',
        gender: 'Male',
        companyId: props?.parentCompanyId,
        role: 32767
    });

    const addUpdateCompany = (values) => {
        const data = {
            firstName: values?.firstName,
            lastName: values?.lastName,
            phone: values?.phone,
            email: values?.email,
            password: values?.password,
            gender: values?.gender,
            companyId: props?.parentCompanyId,
            role: 32767
        };
        if (props?.companyValues !== null) {
            setLoader(true);
            UserService.patch(
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
                    toast.success('Company Admin updated successfully.');
                    props?.setVisible();
                    props?.fetchAllCompany(props?.parentCompanyId);
                    props?.fetchCompanyAdmins(props?.parentCompanyId);
                })
                .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
        } else {
            setLoader(true);
            UserService.create(
                { ...data },
                {
                    headers: {
                        Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                    }
                }
            )
                .then((res) => {
                    setLoader(false);
                    toast.success('Company Admin created successfully.');
                    props?.setVisible();
                    props?.fetchAllCompany();
                    props?.fetchCompanyAdmins(props?.parentCompanyId);
                })
                .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
        }
    };

    useEffect(() => {
        if (props?.companyValues !== null) {
            setFormData({ ...formData, ...props?.companyValues });
        }
    }, []);

    return (
        <Formik
            enableReinitialize
            initialValues={formData}
            validationSchema={addCompanyAdminSchema}
            onSubmit={(values, event) => {
                addUpdateCompany(values);
            }}
        >
            {({ values, errors, touched }) => (
                <Form>
                    <div className="">
                        <div className="">
                            <div className="form-group mb-3">
                                <label className="form-label">
                                    First Name <sup className="mandatory">*</sup>
                                </label>
                                <Field name="firstName" type="text" placeholder="Enter first name" className="form-control" />
                                {errors.firstName && touched.firstName ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.firstName}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">
                                    Last Name <sup className="mandatory">*</sup>
                                </label>
                                <Field name="lastName" type="text" placeholder="Enter last name" className="form-control" />
                                {errors.lastName && touched.lastName ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.lastName}</small>
                                    </p>
                                ) : null}
                            </div>
                            {/* <div className="form-group mb-3">
                                <label className="form-label">
                                    User Name <sup className="mandatory">*</sup>
                                </label>
                                <Field name="username" type="text" placeholder="Enter last name" className="form-control" />
                                {errors.username && touched.username ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.username}</small>
                                    </p>
                                ) : null}
                            </div> */}
                            <div className="form-group mb-3">
                                <label className="form-label">
                                    Phone <sup className="mandatory">*</sup>
                                </label>
                                <Field name="phone" type="number" placeholder="Enter mobile number" className="form-control" min={0} />
                                {errors.phone && touched.phone ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.phone}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">
                                    email <sup className="mandatory">*</sup>
                                </label>
                                <Field name="email" type="email" placeholder="Enter email" className="form-control" />
                                {errors.email && touched.email ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.email}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">
                                    Gender <sup className="mandatory">*</sup>
                                </label>
                                <Field name="gender" as="select" className="form-control pt-2">
                                    {[
                                        { label: 'Male', value: 'Male' },
                                        { label: 'Female', value: 'Female' },
                                        { label: 'Others', value: 'Others' }
                                    ].map(({ label, value }) => (
                                        <option key={value} value={label}>
                                            {label}
                                        </option>
                                    ))}
                                </Field>
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">
                                    Password <sup className="mandatory">*</sup>
                                </label>
                                <Field name="password" type="password" placeholder="Enter password" className="form-control" />
                                {errors.password && touched.password ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.password}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">
                                    Confirm Password <sup className="mandatory">*</sup>
                                </label>
                                <Field name="cnfpassword" type="password" placeholder="Confirm password" className="form-control" />
                                {errors.cnfpassword && touched.cnfpassword ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.cnfpassword}</small>
                                    </p>
                                ) : null}
                            </div>
                        </div>
                        <div>
                            <button className="btn btn-primary" type="submit">
                                Submit
                            </button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default AddChildCompany;
