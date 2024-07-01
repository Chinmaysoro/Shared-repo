import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { departmentSchema } from '../../redux/helpers/validations';
import { DepartmentService } from '../../redux/services/feathers/rest.app';

const AddCompany = (props) => {
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [companyValues, setCompanyValues] = useState({
        name: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompanyValues({ ...companyValues, [name]: value });
    };

    const addUpdateCompany = (values) => {
        if (props?.companyValues !== null) {
            const data = {
                name: values?.name,
            };
            setLoader(true);
            DepartmentService.patch(
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
                    toast.success('Department updated successfully.');
                    props?.setVisible();
                    props?.fetchAllCompany();
                })
                .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
        } else {
            setLoader(true);
            DepartmentService.create(
                { ...values },
                {
                    headers: {
                        Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                    }
                }
            )
                .then((res) => {
                    setLoader(false);
                    toast.success('Department created successfully.');
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
        <Formik enableReinitialize initialValues={companyValues} validationSchema={departmentSchema} onSubmit={addUpdateCompany}>
            {({ errors, touched }) => (
                <Form>
                    <div className="">
                        <div className="">
                            <div className="mb-2 ml_label">
                                <label htmlFor="name" className="form-label">
                                    Leave name*
                                </label>
                                <Field type="text" className="form-control pt-2" name="name" id="name" onKeyUp={handleChange} />
                                {errors.name && touched.name ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.name}</small>
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

export default AddCompany;
