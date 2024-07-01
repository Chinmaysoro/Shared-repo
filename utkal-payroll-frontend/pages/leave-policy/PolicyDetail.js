import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { financialProfileSchema } from '../../redux/helpers/validations';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { userActions } from '../../redux/actions/user.actions';
import { getUser, decodedID } from '../../redux/helpers/user';
import { UserService, LeavePolicyService, LeaveTypeService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
import SimpleModal from '../components/Modal';
import AddLeavePolicy from './AddLeavePolicy';
import AddLeavePolicyDetail from './AddLeavePolicyDetail';

const PolicyDetail = (props) => {
    const dispatch = useDispatch();
    const userData = getUser();
    const [visible, setVisible] = useState(false);
    const [familyValues, setfamilyValues] = useState();
    const [bulkUploadModal, setbulkUploadModal] = useState(false);
    const [familyList, setfamilyList] = useState([]);
    const [title, setTitle] = useState('');
    const [employeeList, setEmployeeList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [offset, setOffset] = useState(0);
    const [leavePolicyList, setLeavePolicyList] = useState([]);
    const router = useRouter();
    const policy_Id = decodedID(router?.query?.policyId);
    const [componentValues, setcomponentValues] = useState({
        policyName: '',
        policyLeaveType: '',
        numberLeaveCredited: '',
        creditFrequency: '',
        maxLeaveCarryForward: '',
        leave_type: '',
        encashmentAllowed: '',
        roundOffLeave: '',
        enableLeaveReqFromDoj: '',
        elligibleDays: '',
        canLeaveOnWeekOff: '',
        canLeaveOnHoliday: '',
        documentProof: '',
        leaveIsMoreThanDays: '',
        clubbing: '',
        leaveType: ''
    });
    useEffect(() => {
        fetchAllLeavePolicy();
    }, []);
    const handleSubmit = (values) => {
        // Handle form submission here
        console.log(values);
    };
    const openModal = (type, val, data) => {
        setVisible(val);
        setTitle(type);
        setcomponentValues(data);
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
    const fetchAllLeavePolicy = async () => {
        if (userData?.user?.companyId) {
            setLoader(true);
            LeavePolicyService.find({
                query: {
                    _id: policy_Id,
                    $populate:['policyLeaveType']
                },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then(async (res) => {
                    setLoader(false);
                    const leaveDetails = res?.data[0]?.leaveDetails || [];
                    const leaveDetailsWithTypeNames = await Promise.all(leaveDetails.map(async detail => {
                        const policyLeaveTypeId = detail?.policyLeaveType;
                        const policyLeaveTypeData = await fetchPolicyLeaveType(policyLeaveTypeId);
                        return {
                            ...detail,
                            type_name: policyLeaveTypeData?.name
                        };
                    }));
                    setLeavePolicyList(leaveDetailsWithTypeNames);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };
    const fetchPolicyLeaveType = async (policyLeaveTypeId) => {
        return LeaveTypeService.find({
            query: {
                _id: policyLeaveTypeId
            },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
        .then((res) => res?.data[0])
        .catch((error) => null);
    };
    const deleteFamily = async (leave) => {
        if (userData?.user?.companyId) {
            setLoader(true);
            const response = await LeavePolicyService.find({
                query: { _id: policy_Id },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            });

            // Assuming the response contains educationalDetails
            const leaveDetails = response?.data[0]?.leaveDetails || [];
            const updatedLeaveDetails = leaveDetails.filter((detail) => detail._id !== leave?._id);
            LeavePolicyService.patch(
                policy_Id,
                {
                    leaveDetails: updatedLeaveDetails
                },
                {
                    headers: {
                        Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                    }
                }
            )
                .then((res) => {
                    setLoader(false);
                    toast.success('Leave info removed successfully.');
                    setVisible();
                    fetchAllLeavePolicy();
                })
                .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
        }
    };
    const getCreditFrequencyLabel = (value) => {
        switch (value) {
            case 1:
                return 'Monthly';
            case 3:
                return 'Quarterly';
            case 6:
                return 'Half Yearly';
            case 12:
                return 'Yearly';
            default:
                return '';
        }
    };
    return (
        <div>
            <div className="emp_header">
                <h5>Leave Policy Informations</h5>
                <div class="button-container" style={{ marginTop: '-11px' }}>
                    <button className="btn btn-primary" onClick={() => openModal('Add Leave Info', true, null)}>
                        Add Leave Info
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
                body={<AddLeavePolicyDetail setVisible={() => setVisible(false)} componentValues={componentValues} policyId={policy_Id} fetchAllLeavePolicy={fetchAllLeavePolicy} />}
            ></SimpleModal>

            <div className="education-detail mt-3">
                {leavePolicyList && leavePolicyList?.length > 0 ? (
                    leavePolicyList?.map((leavePolicy, index) => (
                        <div className="education-card position-relative mb-2">
                            <div className="row">
                                <div className="col-md-6">
                                    <h4 className="mb-2">
                                        <strong>{leavePolicy?.type_name}</strong>
                                    </h4>
                                    <p className="mb-2">
                                        No. of Leave to Credit: <strong>{leavePolicy?.numberLeaveCredited}</strong>
                                    </p>
                                    <p className="mb-2">
                                        Crediting Frequency: <strong>{getCreditFrequencyLabel(leavePolicy?.creditFrequency)}</strong>
                                    </p>
                                    <p className="mb-2">
                                        Max Leaves Carry Forward: <strong>{leavePolicy?.maxLeaveCarryForward}</strong>
                                    </p>
                                    <p className="mb-2">
                                        Leave Type: <strong> <span className={leavePolicy?.leave_type=='paid' ? 'badge badge-success' : "badge badge-danger"}>{leavePolicy?.leave_type}</span></strong>
                                    </p>
                                    <p className="mb-2">
                                        Encashment Allowed: <strong>{leavePolicy?.encashmentAllowed == true ? "Yes" : "No"}</strong>
                                    </p>

                                </div>
                                <div className='col-md-6'>
                                <div className="mt-3 education-action">
                                        <button className="btn-outline-delete" onClick={() => deleteFamily(leavePolicy)}>
                                            {' '}
                                            <i className="pi pi-trash" style={{ marginRight: '6px' }}></i>Delete
                                        </button>
                                        <button className="btn-outline-edit" onClick={() => openModal('Update Leave Information', true, leavePolicy)}>
                                            {' '}
                                            <i className="pi pi-pencil" style={{ marginRight: '4px' }}></i> Edit
                                        </button>
                                    </div>
                                    <p className="mb-2">
                                        Round Off Leaves: <strong>{leavePolicy?.roundOffLeave == true ? "Yes" : "No"}</strong>
                                    </p>
                                    <p className="mb-2">
                                        Enable Leave Request from Date of Joining: <strong>{leavePolicy?.enableLeaveReqFromDoj == true ? "Yes" : "No"}</strong>
                                    </p>
                                    <p className="mb-2">
                                     Can Apply to Leave on Week Off <strong>{leavePolicy?.canLeaveOnWeekOff == true ? "Yes" : "No"}</strong>
                                    </p>
                                    <p className="mb-2">
                                    Can Apply to Leave on Holiday: <strong>{leavePolicy?.canLeaveOnHoliday == true ? "Yes" : "No"}</strong>
                                    </p>

                                    <p className="mb-2">
                                        Document Proof Required: <strong>{leavePolicy?.documentProof == true ? "Yes" : "No"}</strong>
                                    </p>
                                    <p className="mb-2">
                                        Clubbing: <strong>{leavePolicy?.clubbing == true ? "Yes" : "No"}</strong>
                                    </p>
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
                        No leave information found!!!
                    </div>
                )}
            </div>
        </div>
    );
};

export default PolicyDetail;
