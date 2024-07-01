import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { designationSchema } from '../../redux/helpers/validations';
import { DesignationService } from '../../redux/services/feathers/rest.app';
import { getUser } from '../../redux/helpers/user';

const AddDesignation = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [designationValues, setDesignationValues] = useState({
        name: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDesignationValues({ ...designationValues, [name]: value });
    };

    const addUpdateDesignation = (values) => {
        if (userData?.user?.companyId) {
            if (props?.designationValues !== null) {
                const data = {
                    name: values?.name
                };
                setLoader(true);
                DesignationService.patch(
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
                        toast.success('Designation updated successfully.');
                        props?.setVisible();
                        props?.fetchAllDesignation();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            } else {
                const data = values;
                Object.assign(data, {companyId: userData?.user?.companyId});
                setLoader(true);
                DesignationService.create(
                    { ...data },
                    {
                        headers: {
                            Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                        }
                    }
                )
                    .then((res) => {
                        setLoader(false);
                        toast.success('Designation created successfully.');
                        props?.setVisible();
                        props?.fetchAllDesignation();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            }
        }
    };

    useEffect(() => {
        if (props?.designationValues !== null) {
            setDesignationValues({ ...designationValues, ...props?.designationValues });
        }
    }, []);

    return (
        <Formik enableReinitialize initialValues={designationValues} validationSchema={designationSchema} onSubmit={addUpdateDesignation}>
            {({ errors, touched }) => (
                <Form>
                    <div className="">
                        <div className="">
                            <div className="mb-2 ml_label">
                                <label htmlFor="name" className="form-label">
                                    Designation name*
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

export default AddDesignation;
