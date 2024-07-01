import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { financialProfileSchema } from '../../redux/helpers/validations';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import originalMoment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(originalMoment);
import { userActions } from '../../redux/actions/user.actions';
import { getUser, decodedID } from '../../redux/helpers/user';
import { UserService, LeavePolicyService, ShiftPolicyService, CompanyShiftsService } from '../../redux/services/feathers/rest.app';
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
        const policyName = "";
        if (userData?.user?.companyId) {
            setLoader(true);
            const queryData = {
                _id: policy_Id
            };
            const leavePloicyName = await LeavePolicyService.find({
                query: queryData,
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            });
            policyName = leavePloicyName?.data[0]?.policyName || "";
            await ShiftPolicyService.find({
                query: {
                    policyName: policyName,
                    companyId: userData?.user?.companyId
                },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setLoader(false);
                    const shiftPolicies = res?.data;
                    const convertedShiftPolicies = shiftPolicies.flatMap(policy => policy.companyShiftId.map(async companyShiftId => {
                        const leaveRecord = await CompanyShiftsService.find({
                            query: {
                                _id: companyShiftId
                            },
                            headers: {
                                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                            }
                        });
                        const shift_name = leaveRecord?.data[0]?.name || "";
                        return {
                            ...policy,
                            companyShiftId: companyShiftId,
                            shift_name: shift_name
                        };
                    }));

                    (async () => {
                        const result = await Promise.all(convertedShiftPolicies);
                        setLeavePolicyList(result);
                    })();

                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    const deleteShitPolicy = async (leave) => {
        // if (userData?.user?.companyId) {
        //     setLoader(true);
        //     const response = await LeavePolicyService.find({
        //         query: { _id: policy_Id },
        //         headers: {
        //             Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
        //         }
        //     });

        //     // Assuming the response contains educationalDetails
        //     const leaveDetails = response?.data[0]?.leaveDetails || [];
        //     const updatedLeaveDetails = leaveDetails.filter((detail) => detail._id !== leave?._id);
        //     LeavePolicyService.patch(
        //         policy_Id,
        //         {
        //             leaveDetails: updatedLeaveDetails
        //         },
        //         {
        //             headers: {
        //                 Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
        //             }
        //         }
        //     )
        //         .then((res) => {
        //             setLoader(false);
        //             toast.success('Leave info removed successfully.');
        //             setVisible();
        //             fetchAllLeavePolicy();
        //         })
        //         .catch((error) => {
        //             setLoader(false);
        //             toast.error(error.message);
        //         });
        // }
    };
    return (
        <div>
            <div className="emp_header">
                <h5>Shift Policy Informations</h5>
                <div class="button-container" style={{ marginTop: '-11px' }}>
                    <button className="btn btn-primary" onClick={() => openModal('Add Shift Info', true, null)}>
                        Add Shift Info
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
                                        <strong>{leavePolicy?.shift_name} Shift</strong>
                                    </h4>
                                    <p className="mb-2">
                                        Rotation Frequency: <strong>{leavePolicy?.rotationFrequency}</strong>
                                    </p>
                                    <p className="mb-2">
                                        Rotation Start Day: <strong>{leavePolicy?.rotationStartDay ? moment(leavePolicy?.rotationStartDay).format('DD-MM-YYYY') : 'N/A'}</strong>
                                    </p>
                                </div>
                                <div className='col-md-6'>
                                    <div className="mt-3 education-action">
                                        {/* <button className="btn-outline-delete" onClick={() => deleteShitPolicy(leavePolicy)}>
                                            {' '}
                                            <i className="pi pi-trash" style={{ marginRight: '6px' }}></i>Delete
                                        </button> */}
                                        <button className="btn-outline-edit" onClick={() => openModal('Update Shift Policy Information', true, leavePolicy)}>
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
                        No shift information found!!!
                    </div>
                )}
            </div>
        </div>
    );
};

export default PolicyDetail;
