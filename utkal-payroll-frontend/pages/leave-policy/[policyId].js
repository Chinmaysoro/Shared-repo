import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getUser, decodedID } from '../../redux/helpers/user';
import { LeavePolicyService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
import AddLeavePolicy from './AddLeavePolicy';
import Applicability from './PolicyApplicability';
import PolicyDetail from './PolicyDetail';
const EditPolicy = () => {
    const userData = getUser();
    const [visible, setVisible] = useState(false);
    const [loader, setLoader] = useState(false);
    const [offset, setOffset] = useState(0);
    const [policyId, setPolicyId] = useState('');
    const [policyInfo, setPolicyInfo] = useState(null);
    const [componentValues, setComponentValues] = useState({});
    const [leavePolicyList, setLeavePolicyList] = useState([]);
    const [totalLeavePolicy, setTotalLeavePolicy] = useState(0);
    const router = useRouter();
    const policy_Id = decodedID(router?.query?.policyId);

    const getLeavePolicy = async (policyId) => {
        if (userData?.user?.companyId) {
            setLoader(true);
            LeavePolicyService.find({
                query: {
                    _id: policyId,
                    $populate: ['payGroupId', 'leaveType']
                },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    if (res) {
                        console.log(res?.data[0],'::::::::::::::::::::::res?.data[0]')
                        setPolicyInfo(res?.data[0]);
                        setComponentValues(res?.data[0]);
                        setPolicyId(res?.data[0]?._id);
                    }
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };
    useEffect(() => {
        getLeavePolicy(policy_Id);
        setTimeout(() => {
            setLoader(false);
        }, 1000);
    }, []);
    const fetchAllLeavePolicy = async () => {
        if (userData?.user?.companyId) {
            setLoader(true);
            LeavePolicyService.find({
                query: {
                    companyId: userData?.user?.companyId,
                    $skip: offset,
                    $sort: { createdAt: -1 },
                    $populate: ['payGroupId', 'leaveType']
                },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setLoader(false);
                    setLeavePolicyList(res?.data);
                    setTotalLeavePolicy(res?.total);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    const [activeTab, setActiveTab] = useState('policy'); // Set the default active tab

    const renderForm = () => {
        switch (activeTab) {
            case 'applicability':
                return <Applicability />;
            default:
                // <AddLeavePolicy setVisible={() => setVisible(false)} componentValues={componentValues} fetchAllLeavePolicy={fetchAllLeavePolicy} />;
                return <PolicyDetail/>;
        }
    };

    return (
        <div className="row">
            <div className="col-md-3 pr-0">
                <ul className="emp_sidebar_menu">
                    <li className={activeTab === 'policy' ? 'active' : ''}>
                        <div className="radio">
                            <input id="radio-policy" name="radio" type="radio" checked={activeTab === 'policy'} onChange={() => setActiveTab('policy')} />
                            <label htmlFor="radio-policy" className="radio-label w-100">
                                <span className="emp-sidebar-label"> Leave Policy </span>
                            </label>
                        </div>
                    </li>
                    <li className={policyId ? (activeTab === 'applicability' ? 'active' : '') : ''}>
                        <div className="radio">
                            <input
                                id="radio-applicability"
                                name="radio"
                                type="radio"
                                checked={activeTab === 'applicability'}
                                onChange={() => {
                                    setActiveTab('applicability');
                                }}
                                disabled={!policyId}
                            />
                            <label htmlFor="radio-applicability" className="radio-label w-100">
                                <span className="emp-sidebar-label">Applicability</span>
                            </label>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="col-md-9 pl-0">
                <div className="employee-form-section">
                    {!loader && renderForm()}
                    {loader && (
                        <div className="edit-profile-loader">
                            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditPolicy;
