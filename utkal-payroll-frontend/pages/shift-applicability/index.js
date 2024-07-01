import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import SimpleModal from '../components/Modal';
import AddShiftApplicability from './AddShiftApplicability';
import { ShiftPolicyService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
import { getUser, encodedID } from '../../redux/helpers/user';

const ShiftApplicabilityScreen = () => {
    const userData = getUser();
    const [loader, setLoader] = useState(false);
    const [visible, setVisible] = useState(false);
    const [componentValues, setComponentValues] = useState({});
    const [title, setTitle] = useState('');
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(100);
    const [shiftPolicyList, setShiftPolicyList] = useState([]);
    const [totalShiftPolicy, setTotalShiftPolicy] = useState(0);

    const openModal = (type, val, data) => {
        setVisible(val);
        setTitle(type);
        setComponentValues(data);
    };

    const fetchAllShiftPolicy = async () => {
        if (userData?.user?.companyId) {
            setLoader(true);
            ShiftPolicyService.find({
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
                    setShiftPolicyList(res?.data);
                    setTotalShiftPolicy(res?.total);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    const deleteShiftPolicy = (values) => {
        setLoader(true);
        ShiftPolicyService.remove(values?._id, {
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                toast.success('Leave policy deleted successfully.');
                fetchAllShiftPolicy();
            })
            .catch((error) => {
                setLoader(false);
                toast.error(error?.message);
            });
    };

    useEffect(() => {
        fetchAllShiftPolicy();
    }, []);

    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Shift Applicability</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Administration</a>
                                </li>
                                {/* <li className="breadcrumb-item active">Leave Policy</li> */}
                            </ul>
                        </div>
                        <div className="col-auto float-right ml-auto">
                            <button type="button" className="btn btn-primary" onClick={() => openModal('Add Shift Applicability', true, null)}>
                                <i className="pi pi-plus"></i> Shift Applicability
                            </button>
                        </div>
                    </div>
                </div>
                <SimpleModal
                    title={title}
                    visible={visible}
                    setVisible={() => setVisible(false)}
                    body={<AddShiftApplicability setVisible={() => setVisible(false)} componentValues={componentValues} fetchAllShiftPolicy={fetchAllShiftPolicy} />}
                ></SimpleModal>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Shift Name</th>
                                    {/* <th scope="col">Leave Type</th>
                                    <th scope="col">Leave to Credit</th>
                                    <th scope="col">Crediting Frequency</th>
                                    <th scope="col">Encashment Allowed</th>
                                    <th scope="col">Clubbing</th> */}
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shiftPolicyList && shiftPolicyList?.length > 0 ? (
                                    shiftPolicyList?.map((data, index) => (
                                        <tr key={`key-${index}`}>
                                            <th scope="row">
                                                <Link href={`/shift-applicability/[policyId]`} as={`/shift-applicability/${encodedID(data?._id)}`}>
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
                                                <button className="btn btn-primary" type="button" onClick={() => openModal('Update Shift Applicability', true, data)}>
                                                    <i className="pi pi-pencil"></i>
                                                </button>
                                                &nbsp;
                                                <button className="btn btn-warning" type="button" onClick={() => deleteShiftPolicy(data)}>
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

export default ShiftApplicabilityScreen;
