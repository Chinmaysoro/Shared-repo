import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { Formik, Form, Field } from 'formik';
import { toast } from 'react-toastify';
import { changePasswordSchema } from '../../redux/helpers/validations';
import { ChangePasswordService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
import { userActions } from '../../redux/actions/user.actions';

const ChangePasswordScreen = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loader, setLoader] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleChangePassword = (value) => {
        const data = { ...value };
        const userInfo = TokenService?.getUser()
        data["userId"] = userInfo?.user?._id;

        setLoader(true);
        ChangePasswordService.create(
            { ...data },
            {
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            }
        )
            .then((res) => {
                dispatch(userActions.logout());
                window.localStorage.clear();
                router.push('/');
            })
            .catch((error) => {
                setLoader(false);
                toast.error(error.message);
            });
    };

    return (
        <div className="page-wrapper">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Change Password</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Employee</a>
                                </li>
                                <li className="breadcrumb-item active">Change Password</li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row justify-content-center">
                    <div className="col-md-6 col-sm-12">
                        <div className="card p-4">
                            <Formik enableReinitialize initialValues={formData} validationSchema={changePasswordSchema} onSubmit={(values, event) => handleChangePassword(values)}>
                                {({ values, errors, touched }) => (
                                    <Form>
                                        <div className="">
                                            <div className="">
                                                <div className="mb-4 ml_label">
                                                    <label htmlFor="oldPassword" className="form-label">
                                                        Old Password*
                                                    </label>
                                                    <Field type="password" className="form-control pt-2" name="oldPassword" id="oldPassword" onKeyUp={handleChange} />
                                                    {errors.oldPassword && touched.oldPassword ? (
                                                        <p className="text-danger text-monospace mt-2">
                                                            <small>{errors.oldPassword}</small>
                                                        </p>
                                                    ) : null}
                                                </div>
                                                <div className="mb-4 ml_label">
                                                    <label htmlFor="newPassword" className="form-label">
                                                        New Password*
                                                    </label>
                                                    <Field type="password" className="form-control pt-2" name="newPassword" id="newPassword" onKeyUp={handleChange} />
                                                    {errors.newPassword && touched.newPassword ? (
                                                        <p className="text-danger text-monospace mt-2">
                                                            <small>{errors.newPassword}</small>
                                                        </p>
                                                    ) : null}
                                                </div>
                                                <div className="mb-4 ml_label">
                                                    <label htmlFor="confirmPassword" className="form-label">
                                                        Confirm Password*
                                                    </label>
                                                    <Field type="password" className="form-control pt-2" name="confirmPassword" id="confirmPassword" onKeyUp={handleChange} />
                                                    {errors.confirmPassword && touched.confirmPassword ? (
                                                        <p className="text-danger text-monospace mt-2">
                                                            <small>{errors.confirmPassword}</small>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordScreen;
