import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import SimpleModal from '../components/Modal';
import UpdateComponent from './Create_Update';
import { LeaveTypeService, UserService } from '../../redux/services/feathers/rest.app';
import { getUser } from '../../redux/helpers/user';
import TokenService from '../../redux/services/token.service';

const CreateUpdate = () => {
    const userData = getUser();
    const [loader, setLoader] = useState(false);
    const [visible, setVisible] = useState(false);
    const [leaveTypeValues, setLeaveTypeValues] = useState({});
    const [title, setTitle] = useState('');
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [leaveTypeList, setLeaveTypeList] = useState([]);
    const [totalLeaveType, setTotalLeaveType] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [employeeCount, setEmployeeCounts] = useState(0);
    const [viewType, setViewType] = useState('card'); // Initial view type is 'list'
    const handleViewToggle = (e) => {
        setViewType(viewType === 'list' ? 'card' : 'list');
    };

    const openModal = (type, val, data) => {
        setVisible(val);
        setTitle(type);
        setLeaveTypeValues(data);
    };

    const fetchAllLeaveType = async () => {
        if (userData?.user?.companyId) {
            setLoader(true);
            LeaveTypeService.find({
                query: { companyId: userData?.user?.companyId, $skip: offset, $limit: perPage, $sort: { createdAt: -1 } },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then(async (res) => {
                    setLeaveTypeList(res.data);
                    setPageCount(Math.ceil(res.total / perPage));
                    setTotalLeaveType(res.total);
                    // const response = res.data;
                    // // Fetch employee counts for each leave type
                    // const employeeCountsPromises = response.map((data) => {
                    //     return getEmpCount(data._id);
                    // });
                    // // Wait for all employee count promises to resolve
                    // await Promise.all(employeeCountsPromises);
                    setLoader(false);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    const deleteLeaveType = (values) => {
        setLoader(true);
        LeaveTypeService.remove(values?._id, {
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                toast.success('Leave type deleted successfully.');
                fetchAllLeaveType();
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
    // const getEmpCount = async (deptId) => {
    //     try {
    //         const queryData = {
    //             companyId: userData?.user?.companyId,
    //             departmentId: deptId,
    //             role: 1,
    //         };

    //         const res = await UserService.find({
    //             query: queryData,
    //             headers: {
    //                 Authorization: `Bearer ${TokenService.getLocalAccessToken()}`,
    //             },
    //         });

    //         setEmployeeCounts((prevCounts) => ({
    //             ...prevCounts,
    //             [deptId]: res?.data?.length,
    //         }));
    //     } catch (error) {
    //         // Handle the error
    //     }
    // };
    useEffect(() => {
        fetchAllLeaveType();
    }, [offset]);
    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Leave Type</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Employee</a>
                                </li>
                                <li className="breadcrumb-item active">Leave Type</li>
                            </ul>
                        </div>

                        <div className="col-auto float-right ml-auto">
                            <button type="button" className="btn btn-primary" onClick={() => openModal('Add Leave Type', true, null)}>
                                <i className="pi pi-plus"></i> Add Leave Type
                            </button>
                            <div className="view-toggle">
                                <label>
                                    <button title="list view" onClick={handleViewToggle} className={viewType === 'list' ? 'btn btn-light filter-toggle-btn t-active' : 'btn btn-light filter-toggle-btn'}>
                                        <i className="pi pi-list"></i>
                                    </button>{' '}
                                </label>
                                <label>
                                    <button title="card view" onClick={handleViewToggle} className={viewType === 'card' ? 'btn btn-light filter-toggle-btn t-active' : 'btn btn-light filter-toggle-btn'}>
                                        <i className="pi pi-th-large"></i>
                                    </button>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <SimpleModal title={title} visible={visible} setVisible={() => setVisible(false)} body={<UpdateComponent setVisible={() => setVisible(false)} leaveTypeValues={leaveTypeValues} fetchAllLeaveType={fetchAllLeaveType} />}></SimpleModal>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        {viewType === 'list' ? (
                            <table className="table table-bordered">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Leave Type</th>
                                        <th scope="col">Short Name</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaveTypeList && leaveTypeList?.length > 0 ? (
                                        leaveTypeList?.map((data, index) => (
                                            <tr key={`key-${index}`}>
                                                <td>{data?.name}</td>
                                                <td>{data?.shortName || 'N/A'}</td>
                                                <td>
                                                    <button className="btn btn-primary" type="button" onClick={() => openModal('Update Leave Type', true, data)}>
                                                        <i className="pi pi-pencil"></i>
                                                    </button>
                                                    &nbsp;
                                                    <button className="btn btn-warning" type="button" onClick={() => deleteLeaveType(data)}>
                                                        <i className="pi pi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6}>
                                                <div className="alert alert-success text-center" role="alert">
                                                    No leave type found!!!
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <div className="row cardView mt-3">
                                {leaveTypeList && leaveTypeList?.length > 0 ? (
                                    leaveTypeList?.map((data, index) => (
                                        <div className="col-md-3 mb-3">
                                            <div className="card dash-widget pb-2 pt-3" key={`key-${index}`}>
                                                <div className="card-header">
                                                    <p>
                                                        {data?.name} 
                                                        <small className='text-muted'>&nbsp;{data?.shortName}</small>
                                                    </p>
                                                </div>
                                                {/* {loader ? (
                                                    'Loading...'
                                                ) : (
                                                    <div className="emp-count mt-1">
                                                        {employeeCount[data?._id] !== undefined ? (
                                                            `${employeeCount[data?._id]} Employees`
                                                        ) : (
                                                            'Count Loading...' // You can replace this with a loading indicator or placeholder
                                                        )}
                                                    </div>
                                                )} */}
                                                <div className="mt-3">
                                                    <button className="btn-outline-delete" onClick={() => deleteLeaveType(data)}>
                                                        {' '}
                                                        <i className="pi pi-trash" style={{ marginRight: '6px' }}></i>Delete
                                                    </button>
                                                    <button className="btn-outline-edit" onClick={() => openModal('Update Leave Type', true, data)}>
                                                        {' '}
                                                        <i className="pi pi-pencil" style={{ marginRight: '4px' }}></i> Edit
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="alert alert-success text-center" role="alert">
                                        No leave type found!!!
                                    </div>
                                )}
                            </div>
                        )}

                        {totalLeaveType > 10 ? (
                            <ReactPaginate
                                previousLabel={'<'}
                                nextLabel={'>'}
                                breakLabel={'...'}
                                breakClassName={'break-me'}
                                pageCount={pageCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageClick}
                                containerClassName={'pagination'}
                                activeClassName={'active'}
                            />
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateUpdate;
