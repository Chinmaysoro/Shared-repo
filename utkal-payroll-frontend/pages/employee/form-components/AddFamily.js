import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { DesignationService, UserService } from '../../../redux/services/feathers/rest.app';
import { getUser } from '../../../redux/helpers/user';
import { experienceSchema } from '../../../redux/helpers/validations';
import TokenService from '../../../redux/services/token.service';
const AddFamily = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [educationalDetails, setEducationalDetails] = useState([]);
    const [allDesignationList, setallDesignationList] = useState([]);
    const [familyValues, setfamilyValues] = useState({
        name: '',
        relation: '',
        dob: '',
        age: '',
        bloodGroup: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setfamilyValues({ ...familyValues, [name]: value });
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

    const updateFamily = async (values) => {
        if (userData?.user?.companyId) {
            if (props?.familyValues !== null) {
                setLoader(true);
                const response = await UserService.find({
                    query: { _id: props.empId },
                    headers: {
                        Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                    }
                });

                // Assuming the response contains educationalDetails
                const familyDetails = response?.data[0]?.familyDetails || [];
                const updatedFamilyDetailsDetails = familyDetails.map((detail) => {
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
                        familyDetails: updatedFamilyDetailsDetails
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                        }
                    }
                )
                    .then((res) => {
                        setLoader(false);
                        toast.success('Family Information updated successfully.');
                        props?.setVisible();
                        setTimeout(() => {
                            props?.fetchAllFamily();
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
        if (props?.familyValues !== null) {
            setfamilyValues({ ...familyValues, ...props?.familyValues });
        }
    }, []);

    return (
        <Formik
            enableReinitialize
            initialValues={familyValues}
            onSubmit={async (values, event) => {
                if (values?._id && values?._id !== '') {
                    updateFamily(values);
                    setTimeout(() => {
                        props?.fetchAllFamily();
                    }, 1000);
                } else {
                    await props.onSubmit(values, 'family');
                    setTimeout(() => {
                        props?.fetchAllFamily();
                    }, 1000);
                }
            }}
        >
            {({ formik, errors, touched, value }) => (
                <Form>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="mb-2 ml_label">
                                <label htmlFor="name" className="form-label">
                                    Name
                                </label>
                                <Field type="text" name="name" id="name" className="form-control" />{' '}
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="mb-2 ml_label">
                                <label htmlFor="relation" className="form-label">
                                    Relation
                                </label>
                                <Field as="select" name="relation" className="form-control">
                                    <option value="">Select</option>
                                    <option value="Father">Father</option>
                                    <option value="Mother">Mother</option>
                                    <option value="Son">Son</option>
                                    <option value="Daughter">Daughter</option>
                                    <option value="Spouse">Spouse</option>
                                </Field>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-4">
                                    <label htmlFor="dob" className="form-label">
                                        DOB
                                    </label>
                                    <Field type="date" name="dob" className="form-control" />
                                    <ErrorMessage name="dob" id="dob" component="div" className="error" />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="age" className="form-label">
                                        Age
                                    </label>
                                    <Field type="number" name="age" id="age" className="form-control" />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="bloodGroup" className="form-label">
                                        Blood Group
                                    </label>
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
                                </div>
                            </div>
                        </div>

                        <div className="col-md-12 mt-3">
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

export default AddFamily;
