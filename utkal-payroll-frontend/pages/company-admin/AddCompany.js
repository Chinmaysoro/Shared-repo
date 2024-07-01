import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { companySchema } from '../../redux/helpers/validations';
import { CompanyService } from '../../redux/services/feathers/rest.app';

const AddCompany = (props) => {
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [companyValues, setCompanyValues] = useState({
        name: '',
        email: '',
        website: '',
        phone: '',
        about: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompanyValues({ ...companyValues, [name]: value });
    };

    const addUpdateCompany = (values) => {
        if (props?.companyValues !== null) {
            const data = {
                name: values?.name,
                email: values?.email,
                website: values?.website,
                phone: values?.phone,
                about: values?.about
            };
            setLoader(true);
            CompanyService.patch(
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
                    toast.success('Company updated successfully.');
                    props?.setVisible();
                    props?.fetchAllCompany();
                })
                .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
        } else {
            setLoader(true);
            CompanyService.create(
                { ...values },
                {
                    headers: {
                        Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                    }
                }
            )
                .then((res) => {
                    setLoader(false);
                    toast.success('Company created successfully.');
                    props?.setVisible();
                    props?.fetchAllCompany();
                })
                .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
        }
    };

    useEffect(() => {
        if (props?.companyValues !== null) {
            setCompanyValues({ ...companyValues, ...props?.companyValues });
        }
    }, []);

    return (
        <Formik enableReinitialize initialValues={companyValues} validationSchema={companySchema} onSubmit={addUpdateCompany}>
            {({ errors, touched }) => (
                <Form>
                    <div className="">
                        <div className="">
                            <div className="mb-2 ml_label">
                                <label htmlFor="name" className="form-label">
                                    Company name*
                                </label>
                                <Field type="text" className="form-control pt-2" name="name" id="name" onKeyUp={handleChange} />
                                {errors.name && touched.name ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.name}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="email" className="form-label">
                                    Company email*
                                </label>
                                <Field type="email" className="form-control pt-2" name="email" id="email" onKeyUp={handleChange} />
                                {errors.name && touched.name ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.email}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="website" className="form-label">
                                    Company website*
                                </label>
                                <Field type="text" className="form-control pt-2" name="website" id="website" onKeyUp={handleChange} />
                                {errors.name && touched.name ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.website}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="phone" className="form-label">
                                    Company phone*
                                </label>
                                <Field type="number" className="form-control pt-2" name="phone" id="phone" onKeyUp={handleChange} min={0}/>
                                {errors.name && touched.name ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.phone}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="about" className="form-label">
                                    About company
                                </label>
                                <Field type="text" className="form-control pt-2" name="about" id="about" onKeyUp={handleChange} />
                                {errors.name && touched.name ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.about}</small>
                                    </p>
                                ) : null}
                            </div>
                        </div>
                        <div>
                            <button className="btn btn-success" type="submit">
                                Submit
                            </button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default AddCompany;
