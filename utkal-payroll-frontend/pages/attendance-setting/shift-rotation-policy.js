import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getUser } from '../../redux/helpers/user';
import ShiftRotationPolicy from './AddShiftRotationPolicies';
import SimpleModal from '../components/ShiftPolicyModal';
import TokenService from '../../redux/services/token.service';
import { ShiftPolicyService } from '../../redux/services/feathers/rest.app';

const ShiftRatationPolicy = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [pageCount, setPageCount] = useState(0);
    const [offset, setOffset] = useState(0);
    const [formValues, setFormValues] = useState({});
    const [shiftRatationPolicyList, setShiftRatationPolicyList] = useState([]);
    const [totalShiftRatationPolicy, setTotalShiftRatationPolicy] = useState([]);

    const openModal = (type, val, data) => {
        setVisible(val);
        setTitle(type);
        setFormValues(data);
    };

    const fetchAllShiftRatationPolicy = async () => {
        if (userData?.user?.companyId) {
            setLoader(!loader);
            ShiftPolicyService.find({
                query: { companyId: userData?.user?.companyId, $sort: { createdAt: -1 }, $populate: ['companyShiftId'] },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then(async (res) => {
                    const shifts = [...res?.data];
                    const newShift = [];
                    shifts?.map((item, index) => {
                        newShift = item?.companyShiftId?.map((data) => {
                            return Array?.from({ length: item?.rotationFrequency }, () => data);
                        });
                    });
                    // console.log(shifts, ':::::::shift rotation policy ;ist', newShift);
                    setShiftRatationPolicyList(res?.data);
                    setPageCount(Math.ceil(res.total / perPage));
                    setTotalShiftRatationPolicy(res.total);
                    setLoader(!loader);
                })
                .catch((error) => {
                    setLoader(!loader);
                });
        }
    };

    const deleteShiftRatationPolicy = (values) => {
        setLoader(true);
        ShiftPolicyService.remove(values?._id, {
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                toast.success('Shift rotation policy deleted successfully.');
                fetchAllShiftRatationPolicy();
            })
            .catch((error) => {
                setLoader(false);
                toast.error(error?.message);
            });
    };

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setOffset(selectedPage * perPage);
    };

    useEffect(() => {
        fetchAllShiftRatationPolicy();
    }, [offset]);

    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Shift Rotation Policy</h3>
                        </div>
                        <div className="col-auto float-right ml-auto">
                            <button type="button" className="btn btn-primary" onClick={() => openModal('Add Shift Rotation Policy', true, null)}>
                                <i className="pi pi-plus"></i> Add Shift Rotation Policy
                            </button>
                        </div>
                    </div>
                </div>
                <SimpleModal
                    title={title}
                    visible={visible}
                    setVisible={() => setVisible(false)}
                    body={<ShiftRotationPolicy setVisible={() => setVisible(false)} formValues={formValues} fetchAllShiftRatationPolicy={fetchAllShiftRatationPolicy} />}
                ></SimpleModal>
                {/* <!-- /Page Header --> */}

                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Sl no.</th>
                                    <th scope="col">Policy Name</th>
                                    {/* <th scope="col">Shift Rotations</th> */}
                                    <th scope="col">Frequency</th>
                                    <th scope="col">Start Day</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shiftRatationPolicyList && shiftRatationPolicyList?.length > 0 ? (
                                    shiftRatationPolicyList.map((data, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{data?.policyName}</td>
                                                <td>{data?.rotationFrequency}</td>
                                                <td>{data?.rotationStartDay}</td>
                                                {/* <td>
                                                    <ul className="shift-item">
                                                        <li className="gen-shift">GEN</li>
                                                        <li className="gen-shift">GEN</li>
                                                        <li className="m-shift">M</li>
                                                        <li className="ns-shift">NS</li>
                                                        <li className="gen-shift">GEN</li>
                                                        <li className="gen-shift">GEN</li>
                                                        <li className="gen-shift">GEN</li>
                                                        <li className="m-shift">M</li>
                                                        <li className="ns-shift">NS</li>
                                                        <li className="gs-shift">GS1</li>
                                                    </ul>
                                                </td> */}
                                                <td>
                                                    <button title="Update" className="btn btn-primary" type="button">
                                                        <i className="pi pi-pencil" onClick={() => openModal('Update Shift Rotation Policy', true, data)}></i>
                                                    </button>
                                                    <button title="active" type="button" className="btn btn-warning" onClick={() => deleteShiftRatationPolicy(data)}>
                                                        <i className="pi pi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={4}>
                                            <div className="alert alert-success text-center" role="alert">
                                                No shift policy found!!!
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

export default ShiftRatationPolicy;
