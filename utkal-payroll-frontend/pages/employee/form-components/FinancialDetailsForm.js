import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { financialProfileSchema } from '../../../redux/helpers/validations';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { userActions } from '../../../redux/actions/user.actions';
import { getUser } from '../../../redux/helpers/user';
import { UserService } from '../../../redux/services/feathers/rest.app';
import TokenService from '../../../redux/services/token.service';

const FinancialDetailsForm = ({ onSubmit, initialValues}) => {
    const dispatch = useDispatch();
    const userData = getUser();
    const [visible, setVisible] = useState(false);
    const [bulkUploadModal, setbulkUploadModal] = useState(false);
    const [title, setTitle] = useState('');
    const [employeeList, setEmployeeList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [offset, setOffset] = useState(0);
    useEffect(() => { });
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
                <h5>Financial Detail</h5>
                {/* <div class="button-container">
                    <button className="btn btn-light">Previous</button>
                    <button className="btn btn-primary">Save & Next</button>
                </div> */}
            </div>
            <Formik
                initialValues={initialValues}
                // validationSchema={financialProfileSchema}
                onSubmit={(values, event) => {
                    onSubmit(values,'financial');
                }}
            >
                <Form className='form-card'>
                    <div className="row">
                        <div className="col-md-4">
                            <label className="form-label w-100">
                                Bank Name
                                <Field type="text" name="bankName" className="form-control" />
                            </label>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label w-100">
                                Branch Name
                                <Field type="text" name="branch" className="form-control" />
                            </label>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label w-100">
                                IFSC Code
                                <Field type="text" name="ifsc" className="form-control" />
                            </label>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label w-100">
                                Bank Account No
                                <Field type="text" name="accountNumber" className="form-control" />
                            </label>
                        </div>
                    </div>

                    {/* <div className="row">
                        <div className="col-md-8">
                            <label className="form-label w-100">
                                Branch Name*
                                <Field type="text" name="branchName" className="form-control" />
                                <ErrorMessage name="branchName" component="div" className="error" />
                            </label>
                        </div>
                    </div> */}

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

export default FinancialDetailsForm;
