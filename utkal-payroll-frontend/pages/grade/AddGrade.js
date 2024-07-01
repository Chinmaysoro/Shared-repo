import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import TokenService from '../../redux/services/token.service';
import { gradeSchema } from '../../redux/helpers/validations';
import { GradeService } from '../../redux/services/feathers/rest.app';
import { getUser } from '../../redux/helpers/user';

const AddUpdateGrade = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [gradeValues, setGradeValues] = useState({
        name: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGradeValues({ ...gradeValues, [name]: value });
    };

    const addUpdateGrade = (values) => {
        if (userData?.user?.companyId) {
            if (props?.gradeValues !== null) {
                const data = {
                    name: values?.name
                };
                setLoader(true);
                GradeService.patch(
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
                        toast.success('Grade updated successfully.');
                        props?.setVisible();
                        props?.fetchAllGrade();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            } else {
                const data = values;
                Object.assign(data, {companyId: userData?.user?.companyId});
                setLoader(true);
                GradeService.create(
                    { ...data },
                    {
                        headers: {
                            Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                        }
                    }
                )
                    .then((res) => {
                        setLoader(false);
                        toast.success('Grade created successfully.');
                        props?.setVisible();
                        props?.fetchAllGrade();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            }
        }
    };

    useEffect(() => {
        if (props?.gradeValues !== null) {
            setGradeValues({ ...gradeValues, ...props?.gradeValues });
        }
    }, []);

    return (
        <Formik enableReinitialize initialValues={gradeValues} validationSchema={gradeSchema} onSubmit={addUpdateGrade}>
            {({ errors, touched }) => (
                <Form>
                    <div className="">
                        <div className="">
                            <div className="mb-2 ml_label">
                                <label htmlFor="name" className="form-label">
                                    Grade name*
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

export default AddUpdateGrade;
