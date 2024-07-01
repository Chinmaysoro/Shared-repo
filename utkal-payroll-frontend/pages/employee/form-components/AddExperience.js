import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { DesignationService, UserService } from '../../../redux/services/feathers/rest.app';
import { getUser } from '../../../redux/helpers/user';
import { experienceSchema } from '../../../redux/helpers/validations';
import TokenService from '../../../redux/services/token.service';
const AddExperience = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [educationalDetails, setEducationalDetails] = useState([]);
    const [allDesignationList, setallDesignationList] = useState([]);
    const [experienceValues, setExperienceValues] = useState({
        orgName: '',
        startDate: '',
        endDate: '',
        designation: '',
        annualCTC: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExperienceValues({ ...experienceValues, [name]: value });
    };
    const fetchAllDesignations = async (value) => {
        await DesignationService.find({
            query: {
                $skip: 0,
                $limit: 100,
                $sort: { createdAt: -1 },
                companyId: userData?.user?.companyId
            },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setallDesignationList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
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
            const educationalDetails = response?.data[0]?.experienceDetails || [];

            // Update the state with the retrieved educational details
            setEducationalDetails(educationalDetails);

            setLoader(false);
        } catch (error) {
            console.error('Error fetching educational details:', error);
            setLoader(false);
        }
    };

    const updateExperience = async (values) => {
        if (userData?.user?.companyId) {
            if (props?.experienceValues !== null) {
                setLoader(true);
                const response = await UserService.find({
                    query: { _id: props.empId },
                    headers: {
                        Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                    }
                });

                // Assuming the response contains educationalDetails
                const experienceDetails = response?.data[0]?.pastExperience || [];
                const updatedExperienceDetails = experienceDetails.map((detail) => {
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
                        pastExperience: updatedExperienceDetails
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                        }
                    }
                )
                    .then((res) => {
                        setLoader(false);
                        toast.success('Experience updated successfully.');
                        props?.setVisible();
                        setTimeout(() => {
                            props?.fetchAllExperience();
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
        if (props?.experienceValues !== null) {
            setExperienceValues({ ...experienceValues, ...props?.experienceValues });
        }
        // fetchAllDesignations();
    }, []);

    return (
        <Formik
            enableReinitialize
            validationSchema={experienceSchema}
            initialValues={experienceValues}
            onSubmit={async (values, event) => {
                if (values?._id && values?._id !== '') {
                    updateExperience(values);
                    setTimeout(() => {
                        props?.fetchAllExperience();
                    }, 1000);
                } else {
                    await props.onSubmit(values, 'experience');
                    setTimeout(() => {
                        props?.fetchAllExperience();
                    }, 1000);
                }
            }}
        >
            {({ formik, errors, touched, value }) => (
                <Form>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="mb-2 ml_label">
                                <label htmlFor="orgName" className="form-label">
                                    Name of Organization
                                </label>
                                <Field type="text" name="orgName" id="orgName" className="form-control" />{' '}
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="mb-2 ml_label">
                                <label htmlFor="university" className="form-label mb-0" style={{ color: '#b8b8b8' }}>
                                    Working duration
                                </label>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <label htmlFor="startDate" className="form-label">
                                        Start Date
                                    </label>
                                    <Field type="date" name="startDate" className="form-control" />
                                    <ErrorMessage name="startDate" id="startDate" component="div" className="error" />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="endDate" className="form-label">
                                        End Date
                                    </label>
                                    <Field type="date" name="endDate" id="endDate" className="form-control" />
                                    <ErrorMessage name="endDate" component="div" className="error" />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mt-3">
                            <div className="mb-2 ml_label">
                                <label htmlFor="designation" className="form-label">
                                    Designation
                                </label>
                                <Field type="text" name="designation" id="designation" className="form-control" />
                                {/* <Field as="select" name="designation" id="designation" className="form-control">
                                        <option value="" label="Select a designation" />
                                        {allDesignationList.map((designation, index) => (
                                            <option key={`key-${index}`} value={designation._id}>
                                                {designation.name}
                                            </option>
                                        ))}
                                    </Field> */}
                            </div>
                        </div>
                        <div className="col-md-6 mt-3">
                            <div className="mb-2 ml_label">
                                <label htmlFor="annualCTC" className="form-label">
                                    Annual CTC
                                </label>
                                <Field type="number" min="1" name="annualCTC" id="annualCTC" className="form-control" />
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

export default AddExperience;
