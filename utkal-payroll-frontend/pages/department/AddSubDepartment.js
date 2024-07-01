import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
import TokenService from '../../redux/services/token.service';
import { departmentSchema } from '../../redux/helpers/validations';
import { DepartmentService } from '../../redux/services/feathers/rest.app';
import { getUser } from '../../redux/helpers/user';

const AddSubDepartmentComponent = (props) => {
    const userData = getUser();
    const [loader, setLoader] = useState(false);
    const [subDepartmentValues, setSubDepartmentValues] = useState({
        name: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubDepartmentValues({ ...subDepartmentValues, [name]: value });
    };

    const addUpdateSubDepartment = (values) => {
        if (userData?.user?.companyId) {
            if (props?.subDepartmentValues !== null) {
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
                        toast.success('Sub-department updated successfully.');
                        props?.setVisible();
                        props?.fetchAllSubDepartment();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            } else {
                const data = values;
                Object.assign(data, { companyId: userData?.user?.companyId, parentId: props?.parentDepartmentId, hasChild: true });
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
                        toast.success('Sub-department created successfully.');
                        props?.setVisible();
                        props?.fetchAllSubDepartment();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            }
        }
    };

    useEffect(() => {
        if (props?.subDepartmentValues !== null) {
            setSubDepartmentValues({ ...subDepartmentValues, ...props?.subDepartmentValues });
        }
    }, []);

    return (
        <Formik enableReinitialize initialValues={subDepartmentValues} validationSchema={departmentSchema} onSubmit={addUpdateSubDepartment}>
            {({ errors, touched }) => (
                <Form>
                    <div className="">
                        <div className="">
                            <div className="mb-2 ml_label">
                                <label htmlFor="name" className="form-label">
                                    Sub Department name*
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

export default AddSubDepartmentComponent;
