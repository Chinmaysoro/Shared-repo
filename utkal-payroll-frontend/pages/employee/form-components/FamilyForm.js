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
import AddFamily from './AddFamily';
const FamilyForm = ({ onSubmit, initialValues, empId, setActiveTab }) => {
    const dispatch = useDispatch();
    const userData = getUser();
    const [visible, setVisible] = useState(false);
    const [familyValues, setfamilyValues] = useState(initialValues);
    const [bulkUploadModal, setbulkUploadModal] = useState(false);
    const [familyList, setfamilyList] = useState([]);
    const [title, setTitle] = useState('');
    const [employeeList, setEmployeeList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [offset, setOffset] = useState(0);
    useEffect(() => {
        fetchAllFamily();
    }, []);
    const handleSubmit = (values) => {
        // Handle form submission here
        console.log(values);
    };
    const openModal = (type, val, data) => {
        setVisible(val);
        setTitle(type);
        setfamilyValues(data);
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
    const fetchAllFamily = async () => {
        if (empId) {
            setLoader(true);
            UserService.find({
                query: { _id: empId },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then(async (res) => {
                    const familyDetails = res?.data[0]?.familyDetails || [];
                    const reversedFamilyDetails = familyDetails.slice().reverse();
                    const formattedFamilyDetails = reversedFamilyDetails.map((item) => ({
                        ...item,
                        dob: formatDateForInput(item.dob)
                    }));
                    setfamilyList(formattedFamilyDetails);
                    setVisible(false);
                    setLoader(false);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };
    const deleteFamily = async (family) => {
        if (userData?.user?.companyId) {
            setLoader(true);
            const response = await UserService.find({
                query: { _id: empId },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            });

            // Assuming the response contains educationalDetails
            const familyDetails = response?.data[0]?.familyDetails || [];
            const updatedFamilyDetails = familyDetails.filter((detail) => detail._id !== family?._id);
            UserService.patch(
                empId,
                {
                    familyDetails: updatedFamilyDetails
                },
                {
                    headers: {
                        Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                    }
                }
            )
                .then((res) => {
                    setLoader(false);
                    toast.success('Family Information removed successfully.');
                    setVisible();
                    fetchAllFamily();
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
                <h5>Family Informations</h5>
                <div class="button-container" style={{ marginTop: '-11px' }}>
                    <button className="btn btn-primary" onClick={() => openModal('Add Family Information', true, null)}>
                        Add Family Information
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
                body={<AddFamily setVisible={() => setVisible(false)} familyValues={familyValues} fetchAllFamily={fetchAllFamily} onSubmit={onSubmit} empId={empId} />}
            ></SimpleModal>

            <div className="education-detail mt-3">
                {familyList && familyList?.length > 0 ? (
                    familyList?.map((family, index) => (
                        <div className="education-card position-relative mb-2">
                            <div className="row">
                                <div className="col-md-12">
                                    <h5 className="mb-2">
                                        <i className="pi pi-user mr-2" style={{ color: '#9BA6BC' }}></i> {family?.name}
                                    </h5>
                                    <p className="mb-2">
                                        <i className="pi pi-share-alt mr-2" style={{ color: '#9BA6BC' }}></i>Relation : <span style={{ color: '#9BA6BC' }}>{family?.relation}</span>
                                    </p>
                                    <p className="mb-2">
                                        <i className="pi pi-calendar mr-2" style={{ color: '#9BA6BC' }}></i>DOB : {formatDateForInputDisplay(family?.dob)}
                                    </p>
                                    <p className="mb-2">
                                        <i className="pi pi-box mr-2" style={{ color: '#9BA6BC' }}></i> Blood Group: {family?.bloodGroup}
                                    </p>
                                    <p className="mb-2">
                                        <i className="pi pi-sort-amount-up mr-2" style={{ color: '#9BA6BC' }}></i> Age: {family?.age}
                                    </p>
                                    <div className="mt-3 education-action">
                                        <button className="btn-outline-delete" onClick={() => deleteFamily(family)}>
                                            {' '}
                                            <i className="pi pi-trash" style={{ marginRight: '6px' }}></i>Delete
                                        </button>
                                        <button className="btn-outline-edit" onClick={() => openModal('Update Family Information', true, family)}>
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
                        No family information found!!!
                    </div>
                )}
            </div>
        </div>
    );
};

export default FamilyForm;
