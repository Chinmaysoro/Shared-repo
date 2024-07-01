import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { departmentSchema } from '../../redux/helpers/validations';
import { ResignationTypeService } from '../../redux/services/feathers/rest.app';
import { getUser } from '../../redux/helpers/user';

const ResignationTypeScreen = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [resignationValues, setResignationValues] = useState({
        name: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setResignationValues({ ...resignationValues, [name]: value });
    };

    const addUpdateResignation = (values) => {
        if (userData?.user?.companyId) {
            if (props?.resignationValues !== null) {
                const data = {
                    name: values?.name
                };
                setLoader(true);
                ResignationTypeService.patch(
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
                        toast.success('Resignation updated successfully.');
                        props?.setVisible();
                        props?.fetchAll();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            } else {
                const data = values;
                Object.assign(data, {companyId: userData?.user?.companyId});
                setLoader(true);
                ResignationTypeService.create(
                    { ...data },
                    {
                        headers: {
                            Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                        }
                    }
                )
                    .then((res) => {
                        setLoader(false);
                        toast.success('Resignation created successfully.');
                        props?.setVisible();
                        props?.fetchAll();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            }
        }
    };

    useEffect(() => {
        if (props?.resignationValues !== null) {
            setResignationValues({ ...resignationValues, ...props?.resignationValues });
        }
    }, []);

    return (
        <Formik enableReinitialize initialValues={resignationValues} validationSchema={departmentSchema} onSubmit={addUpdateResignation}>
            {({ errors, touched }) => (
                <Form>
                    <div className="">
                        <div className="">
                            <div className="mb-2 ml_label">
                                <label htmlFor="name" className="form-label">
                                    Resignation name*
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

export default ResignationTypeScreen;
