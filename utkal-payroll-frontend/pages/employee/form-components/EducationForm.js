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
import SimpleModal from '../../components/Modal';
import AddEducation from './AddEducation';
const EducationForm = ({ onSubmit, initialValues, empId, setActiveTab }) => {
    const dispatch = useDispatch();
    const userData = getUser();
    const [visible, setVisible] = useState(false);
    const [educationValues, setEducationValues] = useState(initialValues);
    const [bulkUploadModal, setbulkUploadModal] = useState(false);
    const [educationList, setEducationList] = useState([]);
    const [title, setTitle] = useState('');
    const [employeeList, setEmployeeList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [offset, setOffset] = useState(0);
    useEffect(() => {
        fetchAllEducation();
    }, []);
    const handleSubmit = (values) => {
        // Handle form submission here
        console.log(values);
    };
    const openModal = (type, val, data) => {
        setVisible(val);
        setTitle(type);
        setEducationValues(data);
    };
    const fetchAllEducation = async () => {
        if (empId) {
            setLoader(true);
            UserService.find({
                query: { _id: empId },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then(async (res) => {
                    const educationalDetails = res?.data[0]?.educationalDetails || [];
                    const reversedEducationalDetails = educationalDetails.slice().reverse();

                    setEducationList(reversedEducationalDetails);
                    setVisible(false);
                    setLoader(false);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };
    const deleteEducation = async (education) => {
        if (userData?.user?.companyId) {
            setLoader(true);
            const response = await UserService.find({
                query: { _id: empId },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            });

            // Assuming the response contains educationalDetails
            const educationalDetails = response?.data[0]?.educationalDetails || [];
            const updatedEducationalDetails = educationalDetails.filter((detail) => detail._id !== education?._id);
            UserService.patch(
                empId,
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
                    toast.success('Education removed successfully.');
                    setVisible();
                    fetchAllEducation();
                })
                .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
        }
    };
    return (
        <div>
            <div className="emp_header">
                <h5>Education Details</h5>
                <div class="button-container" style={{ marginTop: '-11px' }}>
                    <button className="btn btn-primary" onClick={() => openModal('Add Education', true, null)}>
                        Add Education
                    </button>
                    {/* <button className="btn btn-light" onClick={() => setActiveTab('financial')}>
                        Next
                    </button> */}
                    <div></div>
                </div>
            </div>

            <SimpleModal
                title={title}
                visible={visible}
                setVisible={() => setVisible(false)}
                body={<AddEducation setVisible={() => setVisible(false)} educationValues={educationValues} fetchAllEducation={fetchAllEducation} onSubmit={onSubmit} empId={empId} />}
            ></SimpleModal>

            <div className="education-detail mt-3">
                {educationList && educationList?.length > 0 ? (
                    educationList?.map((education, index) => (
                        <div className="education-card position-relative mb-2">
                            <div className="row">
                                <div className="col-md-12">
                                    <h5 className="mb-2">{education?.degree}</h5>
                                    <p className="mb-2">{education?.university}</p>
                                    <p className="mb-2">{education?.board}</p>
                                    <p className="text-light-dark">Year of passing: {education?.yearOfPassing}</p>
                                    <div className="mt-3 education-action">
                                        <button className="btn-outline-delete" onClick={() => deleteEducation(education)}>
                                            {' '}
                                            <i className="pi pi-trash" style={{ marginRight: '6px' }}></i>Delete
                                        </button>
                                        <button className="btn-outline-edit" onClick={() => openModal('Update Education', true, education)}>
                                            {' '}
                                            <i className="pi pi-pencil" style={{ marginRight: '4px' }}></i> Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : loader ? (
                    <div className="alert alert-info text-center" role="alert">
                        <i className="pi pi-spin pi-spinner" style={{ fontSize: '1rem' }}></i>
                    </div>
                ) : (
                    <div className="alert alert-success text-center" role="alert">
                        No education found!!!
                    </div>
                )}
            </div>
        </div>
    );
};

export default EducationForm;
