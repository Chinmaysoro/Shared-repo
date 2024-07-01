import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { departmentSchema } from '../../redux/helpers/validations';
import { DepartmentService } from '../../redux/services/feathers/rest.app';
import { getUser } from '../../redux/helpers/user';

const AddDepartmentComponent = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [departmentValues, setDepartmentValues] = useState({
        name: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDepartmentValues({ ...departmentValues, [name]: value });
    };

    const addUpdateDepartment = (values) => {
        if (userData?.user?.companyId) {
            if (props?.departmentValues !== null) {
                const data = {
                    name: values?.name
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
                        props?.fetchAllDepartment();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            } else {
                const data = values;
                Object.assign(data, {companyId: userData?.user?.companyId});
                setLoader(true);
                DepartmentService.create(
                    { ...data },
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
                        props?.fetchAllDepartment();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            }
        }
    };

    useEffect(() => {
        if (props?.departmentValues !== null) {
            setDepartmentValues({ ...departmentValues, ...props?.departmentValues });
        }
    }, []);

    return (
        <Formik enableReinitialize initialValues={departmentValues} validationSchema={departmentSchema} onSubmit={addUpdateDepartment}>
            {({ errors, touched }) => (
                <Form>
                    <div className="">
                        <div className="">
                            <div className="mb-2 ml_label">
                                <label htmlFor="name" className="form-label">
                                    Department name*
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

export default AddDepartmentComponent;
