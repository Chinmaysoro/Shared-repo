import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { credentialSchema } from '../../../redux/helpers/validations';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { userActions } from '../../../redux/actions/user.actions';
import { getUser } from '../../../redux/helpers/user';
import { UserService } from '../../../redux/services/feathers/rest.app';
import TokenService from '../../../redux/services/token.service';

const CredentialForm = ({ onSubmit, initialValues, userEmail, empId }) => {
    const dispatch = useDispatch();
    const userData = getUser();
    const [visible, setVisible] = useState(false);
    const [bulkUploadModal, setbulkUploadModal] = useState(false);
    const [title, setTitle] = useState('');
    const [employeeList, setEmployeeList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [offset, setOffset] = useState(0);
    useEffect(() => {});
    const handleSubmit = (values) => {
        // Handle form submission here
        console.log(values);
    };

    //   const handleInputChange = (e) => {
    //     const { name, value, type } = e.target;
    //     const newValue = type === 'file' ? e.target.files[0] : value;

    //     setFormData((prevData) => ({
    //       ...prevData,
    //       [name]: newValue,
    //     }));
    //   };
    return (
        <div>
            <div className="emp_header">
                <h5>Credential</h5>
                <b className="text-success">(Note: You can login with registered Email and Empid)</b>
                {/* <div class="button-container">
                    <button className="btn btn-light">Previous</button>
                    <button className="btn btn-primary">Save & Next</button>
                </div> */}
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={credentialSchema}
                onSubmit={(values, event) => {
                    onSubmit(values, 'credential');
                }}
            >
                <Form className="form-card">
                    <div className="row">
                        <div className="col-md-4">
                            <label className="form-label w-100">
                                Email*
                                <Field type="email" name="password" className="form-control" readonly value={userEmail} disabled />
                            </label>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label w-100">
                                Emp ID*
                                <Field type="text" name="empId" className="form-control" readonly value={empId} disabled />
                            </label>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label w-100">
                                Password*
                                <Field type="password" name="password" className="form-control" />
                                <ErrorMessage name="password" component="div" className="error" />
                            </label>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label w-100">
                                Confirm Password*
                                <Field type="password" name="confirmPassword" className="form-control" />
                                <ErrorMessage name="confirmPassword" component="div" className="error" />
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <button type="submit" className="btn btn-primary mt-3">
                                Submit
                            </button>
                        </div>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};

export default CredentialForm;
