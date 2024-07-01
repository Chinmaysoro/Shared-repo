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
import AddExperience from './AddExperience';
const ExperienceForm = ({ onSubmit, initialValues, empId, setActiveTab }) => {
    const dispatch = useDispatch();
    const userData = getUser();
    const [visible, setVisible] = useState(false);
    const [experienceValues, setExperienceValues] = useState(initialValues);
    const [bulkUploadModal, setbulkUploadModal] = useState(false);
    const [experienceList, setExperienceList] = useState([]);
    const [title, setTitle] = useState('');
    const [employeeList, setEmployeeList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [offset, setOffset] = useState(0);
    useEffect(() => {
        fetchAllExperience();
    }, []);
    const handleSubmit = (values) => {
        // Handle form submission here
        console.log(values);
    };
    const openModal = (type, val, data) => {
        setVisible(val);
        setTitle(type);
        setExperienceValues(data);
    };
    function formatDateForInput(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    function formatDateForInputDisplay(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    }
    const fetchAllExperience = async () => {
        if (empId) {
            setLoader(true);
            UserService.find({
                query: {
                    _id: empId,
                    // $populate: [
                    //     {
                    //         path: 'pastExperience',
                    //         model: 'pastExperience', // The name of the Mongoose model for pastExperience
                    //         populate: {
                    //             path: 'designation',
                    //             model: 'designation' // The name of the Mongoose model for designation
                    //         }
                    //     }
                    // ]
                },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then(async (res) => {
                    const experienceDetails = res?.data[0]?.pastExperience || [];
                    const reversedExperienceDetails = experienceDetails.slice().reverse();
                    const formattedExperienceDetails = reversedExperienceDetails.map((item) => ({
                        _id: item?._id,
                        orgName: item?.orgName,
                        annualCTC: item?.annualCTC,
                        // designation: item?.designation?.name,
                        designation: item?.designation,
                        startDate: formatDateForInput(item.startDate),
                        endDate: formatDateForInput(item.endDate)
                    }));
                    setExperienceList(formattedExperienceDetails);
                    setVisible(false);
                    setLoader(false);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };
    const deleteExperience = async (experience) => {
        if (userData?.user?.companyId) {
            setLoader(true);
            const response = await UserService.find({
                query: { _id: empId },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            });

            // Assuming the response contains educationalDetails
            const experienceDetails = response?.data[0]?.pastExperience || [];
            const updatedExperienceDetails = experienceDetails.filter((detail) => detail._id !== experience?._id);
            UserService.patch(
                empId,
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
                    toast.success('Experience removed successfully.');
                    setVisible();
                    fetchAllExperience();
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
                <h5>Experience Details</h5>
                <div class="button-container" style={{ marginTop: '-11px' }}>
                    <button className="btn btn-primary" onClick={() => openModal('Add Experience', true, null)}>
                        Add Experience
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
                body={<AddExperience setVisible={() => setVisible(false)} experienceValues={experienceValues} fetchAllExperience={fetchAllExperience} onSubmit={onSubmit} empId={empId} />}
            ></SimpleModal>

            <div className="education-detail mt-3">
                {experienceList && experienceList?.length > 0 ? (
                    experienceList?.map((experience, index) => (
                        <div className="education-card position-relative mb-2">
                            <div className="row">
                                <div className="col-md-12">
                                    <h5 className="mb-2">
                                        <i className="pi pi-building mr-2" style={{ color: '#9BA6BC' }}></i> {experience?.orgName}
                                    </h5>
                                    <p className="mb-2">
                                        <i className="pi pi-calendar mr-2" style={{ color: '#9BA6BC' }}></i>Working duration :{' '}
                                        <span>
                                            {formatDateForInputDisplay(experience?.startDate)} - {formatDateForInputDisplay(experience?.endDate)}
                                        </span>
                                    </p>
                                    <p className="mb-2">
                                        <i className="pi pi-sitemap mr-2" style={{ color: '#9BA6BC' }}></i> {experience?.designation}
                                    </p>
                                    <p>
                                        <i className="pi pi-check-square mr-2" style={{ color: '#9BA6BC' }}></i> Annual CTC: {experience?.annualCTC}
                                    </p>
                                    <div className="mt-3 education-action">
                                        <button className="btn-outline-delete" onClick={() => deleteExperience(experience)}>
                                            {' '}
                                            <i className="pi pi-trash" style={{ marginRight: '6px' }}></i>Delete
                                        </button>
                                        <button className="btn-outline-edit" onClick={() => openModal('Update Experience', true, experience)}>
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
                        No experience found!!!
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExperienceForm;
