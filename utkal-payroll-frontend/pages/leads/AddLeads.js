import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { UpdateLeadsSchema } from '../../redux/helpers/validations';
import { LeadsService } from '../../redux/services/feathers/rest.app';

const AddChildCompany = (props) => {
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        status: 'active',
        companyName: ''
    });

    const addUpdateCompany = (values) => {
        const data = {
            firstName: values?.firstName,
            lastName: values?.lastName,
            phone: values?.phone,
            email: values?.email,
            status: values?.status,
            companyName: values?.companyName
        };
        if (props?.leadsValues !== null) {
            setLoader(true);
            LeadsService.patch(
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
                    props?.fetchAllCompany();
                })
                .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
        }
        // else {
        //     setLoader(true);
        //     LeadsService.create(
        //         { ...data },
        //         {
        //             headers: {
        //                 Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
        //             }
        //         }
        //     )
        //         .then((res) => {
        //             setLoader(false);
        //             toast.success('Company Admin created successfully.');
        //             props?.setVisible();
        //             props?.fetchAllCompany();
        //         })
        //         .catch((error) => {
        //             setLoader(false);
        //             toast.error(error.message);
        //         });
        // }
    };

    useEffect(() => {
        if (props?.leadsValues !== null) {
            setFormData({ ...formData, ...props?.leadsValues });
        }
    }, []);

    return (
        <Formik
            enableReinitialize
            initialValues={formData}
            validationSchema={UpdateLeadsSchema}
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

                            <div className="form-group mb-3">
                                <label className="form-label">
                                    Phone <sup className="mandatory">*</sup>
                                </label>
                                <Field name="phone" type="number" placeholder="Enter phone number" className="form-control" min={0} />
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
                                    Company Name <sup className="mandatory">*</sup>
                                </label>
                                <Field name="companyName" type="text" placeholder="Enter company name" className="form-control" />
                                {errors.companyName && touched.companyName ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.companyName}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="form-group mb-3">
                                <label className="form-label">
                                    Status <sup className="mandatory">*</sup>
                                </label>
                                <Field name="status" as="select" className="form-control pt-2">
                                    {[
                                        { label: 'Active', value: 'active' },
                                        { label: 'Converted', value: 'converted' }
                                    ].map(({ label, value }) => (
                                        <option key={value} value={label}>
                                            {label}
                                        </option>
                                    ))}
                                </Field>
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
