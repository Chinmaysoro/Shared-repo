import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { DesignationService, UserService } from '../../../redux/services/feathers/rest.app';
import { getUser } from '../../../redux/helpers/user';
import TokenService from '../../../redux/services/token.service';
const AddEducation = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [educationalDetails, setEducationalDetails] = useState([]);
    const [educationValues, setEducationValues] = useState({
        degree: '',
        university: '',
        board: '',
        yearOfPassing: '',
        percentage: '',
        grade: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEducationValues({ ...educationValues, [name]: value });
    };
    const getAllEducationData = async () => {
        setLoader(true);
        try {
            const response = await UserService.find({
                query: { _id: props.empId },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            });

            // Assuming the response contains educationalDetails
            const educationalDetails = response?.data[0]?.educationalDetails || [];

            // Update the state with the retrieved educational details
            setEducationalDetails(educationalDetails);

            setLoader(false);
        } catch (error) {
            console.error('Error fetching educational details:', error);
            setLoader(false);
        }
    };

    const updateEducation = async (values) => {
        if (userData?.user?.companyId) {
            if (props?.educationValues !== null) {
                setLoader(true);
                const response = await UserService.find({
                    query: { _id: props.empId },
                    headers: {
                        Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                    }
                });

                // Assuming the response contains educationalDetails
                const educationalDetails = response?.data[0]?.educationalDetails || [];
                const updatedEducationalDetails = educationalDetails.map((detail) => {
                    if (detail._id === values._id) {
                        return {
                            ...detail,
                            ...values
                        };
                    }
                    return detail;
                });
                UserService.patch(
                    props.empId,
                    {
                        educationalDetails: updatedEducationalDetails
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                        }
                    }
                )
                    .then((res) => {
                        setLoader(false);
                        toast.success('Education updated successfully.');
                        props?.setVisible();
                        setTimeout(() => {
                            props?.fetchAllEducation();
                        }, 1000);
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            }
        }
    };
    useEffect(() => {
        if (props?.educationValues !== null) {
            setEducationValues({ ...educationValues, ...props?.educationValues });
        }
    }, []);

    return (
        <Formik
            enableReinitialize
            initialValues={educationValues}
            onSubmit={async (values, event) => {
                // console.log(values, ':::::::::values');
                if (values?._id && values?._id !== '') {
                    updateEducation(values);
                    setTimeout(() => {
                        props?.fetchAllEducation();
                    }, 1000);
                } else {
                    await props.onSubmit(values, 'education');
                    setTimeout(() => {
                        props?.fetchAllEducation();
                    }, 1000);
                }
            }}
        >
            {({ formik, errors, touched }) => (
                <Form>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="mb-2 ml_label">
                                <label htmlFor="degree" className="form-label">
                                    Degree
                                </label>
                                <Field type="text" name="degree" id="degree" className="form-control" />{' '}
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="mb-2 ml_label">
                                <label htmlFor="university" className="form-label">
                                    University
                                </label>
                                <Field type="text" name="university" id="university" className="form-control" />{' '}
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="mb-2 ml_label">
                                <label htmlFor="board" className="form-label">
                                    Board
                                </label>
                                <Field type="text" name="board" id="board" className="form-control" />{' '}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="mb-2 ml_label">
                                <label htmlFor="yearOfPassing" className="form-label">
                                    Year of passing
                                </label>
                                <Field type="number" min="1" name="yearOfPassing" id="yearOfPassing" className="form-control" />{' '}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="mb-2 ml_label">
                                <label htmlFor="percentage" className="form-label">
                                    Percentage of mark(%)
                                </label>
                                <Field type="number" min="1" name="percentage" id="percentage" className="form-control" />{' '}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="mb-2 ml_label">
                                <label htmlFor="grade" className="form-label">
                                    Grade/ Division
                                </label>
                                <Field type="text" name="grade" id="grade" className="form-control" />{' '}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <button className="btn btn-primary ml-0" type="submit">
                                Submit
                            </button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default AddEducation;
