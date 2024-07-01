import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import SimpleModal from '../components/Modal';
import AddLeaveBalance from './AddLeavePolicy';
import { LeavePolicyService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
import { getUser, encodedID } from '../../redux/helpers/user';

const LeavePolicyScreen = () => {
    const userData = getUser();
    const [loader, setLoader] = useState(false);
    const [visible, setVisible] = useState(false);
    const [componentValues, setComponentValues] = useState({});
    const [title, setTitle] = useState('');
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [leavePolicyList, setLeavePolicyList] = useState([]);
    const [totalLeavePolicy, setTotalLeavePolicy] = useState(0);

    const openModal = (type, val, data) => {
        setVisible(val);
        setTitle(type);
        setComponentValues(data);
    };

    const fetchAllLeavePolicy = async () => {
        if (userData?.user?.companyId) {
            setLoader(true);
            LeavePolicyService.find({
                query: {
                    companyId: userData?.user?.companyId,
                    $skip: offset,
                    $limit: perPage,
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

    const deleteLeaveBalance = (values) => {
        setLoader(true);
        LeavePolicyService.remove(values?._id, {
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                toast.success('Leave policy deleted successfully.');
                fetchAllLeavePolicy();
            })
            .catch((error) => {
                setLoader(false);
                toast.error(error?.message);
            });
    };

    useEffect(() => {
        fetchAllLeavePolicy();
    }, []);

    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Leave Policy</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Administration</a>
                                </li>
                                {/* <li className="breadcrumb-item active">Leave Policy</li> */}
                            </ul>
                        </div>
                        <div className="col-auto float-right ml-auto">
                            <button type="button" className="btn btn-primary" onClick={() => openModal('Add Leave Policy', true, null)}>
                                <i className="pi pi-plus"></i> Leave Policy
                            </button>
                        </div>
                    </div>
                </div>
                <SimpleModal
                    title={title}
                    visible={visible}
                    setVisible={() => setVisible(false)}
                    body={<AddLeaveBalance setVisible={() => setVisible(false)} componentValues={componentValues} fetchAllLeavePolicy={fetchAllLeavePolicy} />}
                ></SimpleModal>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Policy Name</th>
                                    {/* <th scope="col">Leave Type</th>
                                    <th scope="col">Leave to Credit</th>
                                    <th scope="col">Crediting Frequency</th>
                                    <th scope="col">Encashment Allowed</th>
                                    <th scope="col">Clubbing</th> */}
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leavePolicyList && leavePolicyList?.length > 0 ? (
                                    leavePolicyList?.map((data, index) => (
                                        <tr key={`key-${index}`}>
                                            <th scope="row">

                                            <Link href={`/leave-policy/[policyId]`} as={`/leave-policy/${encodedID(data?._id)}`}>

                                                {data?.policyName || 'N/A'}
                                                </Link>

                                                </th>
                                            {/* <td>{data?.leave_type || 'N/A'}</td>
                                            <td>{data?.numberLeaveCredited || 'N/A'}</td>
                                            <td>
                                                {data?.creditFrequency === 1
                                                    ? 'Monthly'
                                                    : null || data?.creditFrequency === 3
                                                    ? 'Quarterly'
                                                    : null || data?.creditFrequency === 6
                                                    ? 'Half Yearly'
                                                    : null || data?.creditFrequency === 12
                                                    ? 'Yearly'
                                                    : null || (!data?.creditFrequency && 'N/A')}
                                            </td>
                                            <td>{data?.encashmentAllowed === true ? 'Yes' : 'No'}</td>
                                            <td>{data?.clubbing === true ? 'Yes' : 'No'}</td> */}
                                            <td>
                                                <button className="btn btn-primary" type="button" onClick={() => openModal('Update Leave Balance', true, data)}>
                                                    <i className="pi pi-pencil"></i>
                                                </button>
                                                &nbsp;
                                                <button className="btn btn-warning" type="button" onClick={() => deleteLeaveBalance(data)}>
                                                    <i className="pi pi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7}>
                                            <div className="alert alert-success text-center" role="alert">
                                                No leave policy found!!!
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeavePolicyScreen;
