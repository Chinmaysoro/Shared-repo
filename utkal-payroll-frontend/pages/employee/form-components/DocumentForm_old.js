import React, { useState, useEffect } from 'react';
import getConfig from 'next/config';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { documentSchema } from '../../../redux/helpers/validations';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../../redux/helpers/user';
import { UserService } from '../../../redux/services/feathers/rest.app';
import TokenService from '../../../redux/services/token.service';

const DocumentForm = ({ onSubmit, handleFileInput, initialValues, empId }) => {
    const dispatch = useDispatch();
    const userData = getUser();
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [visible, setVisible] = useState(false);
    const [loader, setLoader] = useState(false);
    const [panPreview, setPanPreview] = useState(null);
    const [aadharPreview, setAadharPreview] = useState(null);
    const [voterPreview, setVoterPreview] = useState(null);
    const [drivingLicencePreview, setDrivingLicencePreview] = useState(null);
    const [userDetails, setUserDetails] = useState({});
    const [otherPreview, setOtherPreview] = useState(null);

    const handlePanUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPanPreview(URL.createObjectURL(file));
        }
    };

    const handleAadharUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAadharPreview(URL.createObjectURL(file));
        }
    };

    const handleVoterUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVoterPreview(URL.createObjectURL(file));
        }
    };

    const handledrivingLicenceUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDrivingLicencePreview(URL.createObjectURL(file));
        }
    };
    // const handleOtherUpload = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         setOtherPreview(URL.createObjectURL(file));
    //     }
    // };

    const fetchUserDetails = async () => {
        if (empId) {
            setLoader(true);
            UserService.find({
                query: { _id: empId },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setUserDetails(res?.data[0]);
                    setVisible(false);
                    setLoader(false);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    const handleSubmit = (values) => {
        // Handle form submission here
        console.log(values);
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const newValue = type === 'file' ? e.target.files[0] : value;

        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue
        }));
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    return (
        <div>
            <div className="emp_header">
                <h5>Documents</h5>
                {/* <div class="button-container">
                    <button className="btn btn-light">Previous</button>
                    <button className="btn btn-primary">Save & Next</button>
                </div> */}
            </div>
            <Formik
                initialValues={initialValues}
                validationSchema={documentSchema}
                onSubmit={(values, event) => {
                    onSubmit(values, 'document');
                }}
            >
                <Form className="form-card">
                    <div className="row">
                        <div className="col-md-4">
                            <label className="form-label w-100">
                                PAN No*
                                <Field type="text" name="pan" className="form-control" />
                                <ErrorMessage name="pan" component="div" className="error" />
                            </label>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label w-100">
                                Aadhar No*
                                <Field type="text" name="aadhar" className="form-control" />
                                <ErrorMessage name="aadhar" component="div" className="error" />
                            </label>
                        </div>
                        {/* <div className="col-md-3">
                            <label className="form-label w-100">
                                PF No
                                <Field type="text" name="pfNumber" className="form-control" />
                            </label>
                        </div> */}
                        <div className="col-md-4">
                            <label className="form-label w-100">
                                UAN No
                                <Field type="text" name="uan" className="form-control" />
                                <ErrorMessage name="uan" component="div" className="error" />
                            </label>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label w-100">
                                ESIC No
                                <Field type="text" name="esicNo" className="form-control" />
                            </label>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label w-100">
                                Voter ID
                                <Field type="text" name="voter" className="form-control" />
                            </label>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label w-100">
                                Driving Licence
                                <Field type="text" name="drivingLicence" className="form-control" />
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <label className="form-label w-100">
                                PAN Upload
                                <input
                                    type="file"
                                    name="panFile"
                                    className="form-control"
                                    onChange={(event) => {
                                        handlePanUpload(event);
                                        handleFileInput(event, 'panFile');
                                    }}
                                />
                            </label>
                            <div className="img-prev-box">
                                {panPreview ? (
                                    <img src={panPreview} alt="PAN Preview" className="preview-image" />
                                ) : initialValues?.panFile || userDetails?.panFile ? (
                                    <img src={`https://dd7tft2brxkdw.cloudfront.net/${userDetails?.panFile ? userDetails?.panFile : initialValues?.panFile}`} alt="user Preview" className="preview-image" />
                                ) : (
                                    <img src={`${contextPath}/layout/images/no-image.jpg`} className="w-100"></img>
                                )}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label w-100">
                                Aadhar Upload
                                <input
                                    type="file"
                                    name="aadharFile"
                                    className="form-control"
                                    onChange={(event) => {
                                        handleAadharUpload(event);
                                        handleFileInput(event, 'aadharFile');
                                    }}
                                />
                            </label>
                            <div className="img-prev-box">
                                {aadharPreview ? (
                                    <img src={aadharPreview} alt="PAN Preview" className="preview-image" />
                                ) : initialValues?.aadharFile || userDetails?.aadharFile ? (
                                    <img src={`https://dd7tft2brxkdw.cloudfront.net/${userDetails?.aadharFile ? userDetails?.aadharFile : initialValues?.aadharFile}`} alt="user Preview" className="preview-image" />
                                ) : (
                                    <img src={`${contextPath}/layout/images/no-image.jpg`} className="w-100"></img>
                                )}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label w-100">
                                Voter ID Upload
                                <input
                                    type="file"
                                    name="voterFile"
                                    className="form-control"
                                    onChange={(event) => {
                                        handleVoterUpload(event);
                                        handleFileInput(event, 'voterFile');
                                    }}
                                />
                            </label>
                            <div className="img-prev-box">
                                {voterPreview ? (
                                    <img src={voterPreview} alt="Voter Preview" className="preview-image" />
                                ) : initialValues?.voterFile || userDetails?.voterFile ? (
                                    <img src={`https://dd7tft2brxkdw.cloudfront.net/${initialValues?.voterFile ? initialValues?.voterFile : userDetails?.voterFile}`} alt="Voter ID Preview" className="preview-image" />
                                ) : (
                                    <img src={`${contextPath}/layout/images/no-image.jpg`} className="w-100"></img>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-md-4">
                            <label className="form-label w-100">
                                Driving Licence Upload
                                <input
                                    type="file"
                                    name="drivingLicenceFile"
                                    className="form-control"
                                    onChange={(event) => {
                                        handledrivingLicenceUpload(event);
                                        handleFileInput(event, 'drivingLicenceFile');
                                    }}
                                />
                            </label>
                            <div className="img-prev-box">
                                {drivingLicencePreview ? (
                                    <img src={drivingLicencePreview} alt="Driving Licence Preview" className="preview-image" />
                                ) : initialValues?.drivingLicenceFile || userDetails?.drivingLicenceFile ? (
                                    <img
                                        src={`https://dd7tft2brxkdw.cloudfront.net/${initialValues?.drivingLicenceFile ? initialValues?.drivingLicenceFile : userDetails?.drivingLicenceFile}`}
                                        alt="Driving Licence Preview"
                                        className="preview-image"
                                    />
                                ) : (
                                    <img src={`${contextPath}/layout/images/no-image.jpg`} className="w-100"></img>
                                )}
                            </div>
                        </div>
                        {/* <div className="col-md-4">
                            <label className="form-label w-100">
                                Other Document Upload
                                <Field type="file" name="otherDocumentUpload" className="form-control" onChange={handleOtherUpload} />
                            </label>
                            <div className='img-prev-box'>
                                {otherPreview ? <img src={otherPreview} alt="PAN Preview" className="preview-image" /> : <img src={`${contextPath}/layout/images/no-image.jpg`} className='w-100'></img>}
                            </div>
                        </div> */}
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

export default DocumentForm;
