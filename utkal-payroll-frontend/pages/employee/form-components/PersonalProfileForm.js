import React, { useState, useEffect } from 'react';
import getConfig from 'next/config';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { personalProfileSchema } from '../../../redux/helpers/validations';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { userActions } from '../../../redux/actions/user.actions';
import { getUser } from '../../../redux/helpers/user';
import { UserService, UploadService } from '../../../redux/services/feathers/rest.app';
import TokenService from '../../../redux/services/token.service';

const PersonalProfileForm = ({ onSubmit, handleFileInput, initialValues }) => {
    const dispatch = useDispatch();
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const userData = getUser();
    const [visible, setVisible] = useState(false);
    const [bulkUploadModal, setbulkUploadModal] = useState(false);
    const [title, setTitle] = useState('');
    const [employeeList, setEmployeeList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [offset, setOffset] = useState(0);
    const [profilePreview, setProfilePreview] = useState(null);
    const [addressesAreSame, setAddressesAreSame] = useState(false);
    const [formValues, setFormValues] = useState(initialValues);
    const toggleAddresses = () => {
        setAddressesAreSame(!addressesAreSame);
        if (addressesAreSame == false) {
            formValues.address = formValues.permanentAddress;
            const addressInput = document.getElementById('addressInput');
      if (addressInput) {
        addressInput.focus();
      }
            console.log(formValues,':::::::::::::formValues')
            setFormValues({ ...formValues, address: formValues.permanentAddress });
        } else {
            setFormValues({ ...formValues, address: '' });
        }
    };
    const handleProfileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePreview(URL.createObjectURL(file));
        }
    };

    // useEffect(() => {
    //     setTimeout(()=>{
    //         console.log(initialValues,':::::::::::profileFields')
    //     },1000)

    // }, []);
    const handleDateChange = (event) => {
        const inputDate = event.target.value; // Get the raw date string (YYYY-MM-DD)
        const parts = inputDate.split('-'); // Split the string into parts
        if (parts.length === 3) {
            // Check if the format is correct (YYYY-MM-DD)
            const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
            setSelectedDate(formattedDate);
        } else {
            setSelectedDate('');
        }
    };
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const newValue = type === 'file' ? e.target.files[0] : value;
        // Assuming 'dob' is the name of the date field
        // Handle other input fields here
        setFormValues((prevData) => ({
            ...prevData,
            [name]: newValue
        }));
        // console.log(formValues,'::::::::::::::::formValues')
    };
    return (
        <div>
            <div className="emp_header">
                <h5>Personal Detail</h5>
            </div>
            <Formik
                initialValues={formValues}
                validationSchema={personalProfileSchema}
                onSubmit={(values, event) => {
                    values.address = formValues.address;
                    values.permanentAddress = formValues.permanentAddress;
                    onSubmit(values);
                }}
            >
                {({ values, errors, touched, setFieldValue }) => (
                    <Form className="form-card">
                        <div className="row">
                            <div className="col-md-8">
                                <div className="row">
                                    <div className="col-md-6">
                                        <label htmlFor="abbreviation" className="form-label w-100">
                                            Title*
                                            <Field as="select" name="abbreviation" id="abbreviation" className="form-control">
                                                <option value="">Select</option>
                                                <option value="Mr">Mr</option>
                                                <option value="Mrs">Mrs</option>
                                                <option value="Miss">Miss</option>
                                                <option value="Ms">Ms</option>
                                            </Field>
                                            <ErrorMessage name="abbreviation" component="div" className="error" />
                                        </label>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="firstName" className="form-label w-100">
                                            First Name*
                                            <Field type="text" name="firstName" id="firstName" className="form-control" />
                                            <ErrorMessage name="firstName" component="div" className="error" />
                                        </label>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="middleName" className="form-label w-100">
                                            Middle Name
                                            <Field type="text" name="middleName" id="middleName" className="form-control" />
                                        </label>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="lastName" className="form-label w-100">
                                            Last Name*
                                            <Field type="text" name="lastName" id="lastName" className="form-control" />
                                            <ErrorMessage name="lastName" component="div" className="error" />
                                        </label>
                                    </div>
                                    <div className="col-md-6 mt-2">
                                        <label htmlFor="lastName" className="form-label w-100">
                                            Email
                                            <Field type="email" name="email" id="email" className="form-control" />
                                            {/* <ErrorMessage name="email" component="div" className="error" /> */}
                                        </label>
                                    </div>
                                    <div className="col-md-6 mt-2">
                                        <label className="form-label w-100">
                                            Date of Birth
                                            <Field type="date" name="dob" className="form-control" />
                                            {/* <ErrorMessage name="dob" component="div" className="error" /> */}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label w-100">
                                    <div className="profile-image-box">
                                        {profilePreview ? (
                                            <img src={profilePreview} alt="user Preview" className="preview-image" />
                                        ) : initialValues?.avatar ? (
                                            <img src={`https://dd7tft2brxkdw.cloudfront.net/${initialValues?.avatar}`} alt="user Preview" className="preview-image" />
                                        ) : (
                                            <img src={`${contextPath}/layout/images/upload-profile-preview.png`} className="w-100 p-3"></img>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        name="avatar"
                                        id="avatar"
                                        onChange={(event) => {
                                            handleProfileUpload(event);
                                            handleFileInput(event, 'profile');
                                        }}
                                        accept="image/*"
                                        className="form-control profile-img-label"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-4">
                                <label className="form-label w-100">
                                    Marital Status*
                                    <Field as="select" name="maritalStatus" className="form-control">
                                        <option value="">Select</option>
                                        <option value="Married">Married</option>
                                        <option value="Single">Single</option>
                                        <option value="Widow">Widow</option>
                                        <option value="Divorce">Divorce</option>
                                    </Field>
                                    <ErrorMessage name="maritalStatus" component="div" className="error" />
                                </label>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label w-100">
                                    Blood Group
                                    <Field as="select" name="bloodGroup" className="form-control">
                                        <option value="">Select</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </Field>
                                    {/* <ErrorMessage name="bloodGroup" component="div" className="error" /> */}
                                </label>
                            </div>

                            <div className="col-md-4 mt-2">
                                <label className="form-label w-100">
                                    Nationality*
                                    <Field type="text" name="nationality" className="form-control" />
                                    <ErrorMessage name="nationality" component="div" className="error" />
                                </label>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label w-100">
                                    Phone Number*
                                    <Field type="tel" name="phone" className="form-control" />
                                    <ErrorMessage name="phone" component="div" className="error" />
                                </label>
                            </div>
                            <div className="col-md-4 mt-2">
                                <label className="form-label w-100">
                                    Emergency Phone Number
                                    <Field type="tel" name="emergencyPhoneNum" className="form-control" />
                                    {/* <ErrorMessage name="emergencyPhoneNum" component="div" className="error" /> */}
                                </label>
                            </div>
                            <div className="col-md-4 mt-2">
                                <label className="form-label w-100">
                                    Alternative Contact No
                                    <Field type="tel" name="alternativePhoneNum" className="form-control" />
                                </label>
                            </div>
                            <div className="col-md-4 mt-2">
                                <label className="form-label w-100">
                                    Religion*
                                    <Field type="text" name="religion" className="form-control" />
                                    <ErrorMessage name="religion" component="div" className="error" />
                                </label>
                            </div>

                            {/* <div className="col-md-4 mt-2">
                                <label className="form-label w-100">
                                    Emergency Contact No
                                    <Field type="tel" name="emergencyContact" className="form-control" />
                                </label>
                            </div> */}
                            <div className="col-md-6 mt-2">
                                <label>Gender*</label>
                                <div className="d-flex">
                                    <div className="d-flex mr-3">
                                        <Field id="gender-3" name="gender" type="radio" value="Male" className="ga" />
                                        <label htmlFor="gender-3" className="radio-label w-100">
                                            Male
                                        </label>
                                    </div>
                                    <div className="d-flex mr-3">
                                        <Field id="gender-2" name="gender" type="radio" value="Female" className="ga" />
                                        <label htmlFor="gender-2" className="radio-label w-100">
                                            Female
                                        </label>
                                    </div>
                                    <div className="d-flex mr-3">
                                        <Field id="gender-4" name="gender" type="radio" value="Others" className="ga" />
                                        <label htmlFor="gender-4" className="radio-label w-100">
                                            Other
                                        </label>
                                    </div>
                                </div>
                                <ErrorMessage name="gender" component="div" className="error" />
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-md-6">
                                <label className="form-label w-100">
                                    Permanent address*
                                    <Field
                                        as="textarea" // Call handleAddressChange on input change
                                        name="permanentAddress"
                                        className="form-control"
                                        rows="3"
                                        value={formValues.permanentAddress}
                                        onInput={handleInputChange}
                                    />
                                    <ErrorMessage name="permanentAddress" component="div" className="error" />
                                </label>
                                <label style={{ color: '#282a73' }}>
                                    <input type="checkbox" checked={addressesAreSame} onChange={toggleAddresses} name="toggleAdddr" /> Is present and permanent address are the same?
                                </label>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label w-100">
                                    Present Address*
                                    <Field as="textarea" name="address" className="form-control" rows="3" value={formValues.address} onInput={handleInputChange} />
                                    {/* {formValues.address} */}
                                    <ErrorMessage name="address" component="div" className="error" />
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
                )}
            </Formik>
        </div>
    );
};

export default PersonalProfileForm;
