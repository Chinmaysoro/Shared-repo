import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import SimpleModal from '../components/Modal';
import AddSubDepartment from './AddSubDepartment';
import { DepartmentService, UserService } from '../../redux/services/feathers/rest.app';
import { getUser } from '../../redux/helpers/user';
import TokenService from '../../redux/services/token.service';

const SubDepartmentComponent = () => {
    const userData = getUser();
    const [loader, setLoader] = useState(false);
    const [visible, setVisible] = useState(false);
    const [subDepartmentValues, setSubDepartmentValues] = useState({});
    const [title, setTitle] = useState('');
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [subDepartmentList, setSubDepartmentList] = useState([]);
    const [totalSubDepartment, setTotalSubDepartment] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [parentDepartmentId, setParentDepartmentId] = useState('');
    const [viewType, setViewType] = useState('list'); // Initial view type is 'list'
    const handleViewToggle = (e) => {
        setViewType(viewType === 'list' ? 'card' : 'list');
    };

    const openModal = (type, val, data) => {
        setVisible(val);
        setTitle(type);
        setSubDepartmentValues(data);
    };

    const fetchAllSubDepartment = async (deptId) => {
        if (userData?.user?.companyId) {
            setLoader(true);
            DepartmentService.find({
                query: { companyId: userData?.user?.companyId, parentId: deptId, $skip: offset, $limit: perPage, $sort: { createdAt: -1 }, childDepartment: true },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then(async (res) => {
                    setSubDepartmentList(res.data);
                    setPageCount(Math.ceil(res.total / perPage));
                    setTotalSubDepartment(res.total);
                    // Wait for all employee count promises to resolve
                    await Promise.all(employeeCountsPromises);
                    setLoader(false);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    const deleteSubDepartment = (values) => {
        setLoader(true);
        DepartmentService.remove(values?._id, {
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                toast.success('Sub-department deleted successfully.');
                fetchAllSubDepartment(parentDepartmentId);
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

    const fetchData = () => {
        const location = window?.location?.pathname;
        const locationarr = location?.split('/');
        setParentDepartmentId(locationarr[2]);
        fetchAllSubDepartment(locationarr[2]);
    };

    useEffect(() => {
        fetchData();
    }, [offset]);
    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Sub Department</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Employee</a>
                                </li>
                                <li className="breadcrumb-item active">Sub Department</li>
                            </ul>
                        </div>

                        <div className="col-auto float-right ml-auto">
                            <button type="button" className="btn btn-primary" onClick={() => openModal('Add Sub Department', true, null)}>
                                <i className="pi pi-plus"></i> Add Sub Department
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
                <SimpleModal
                    title={title}
                    visible={visible}
                    setVisible={() => setVisible(false)}
                    body={<AddSubDepartment setVisible={() => setVisible(false)} subDepartmentValues={subDepartmentValues} fetchAllSubDepartment={() => fetchAllSubDepartment(parentDepartmentId)} parentDepartmentId={parentDepartmentId} />}
                ></SimpleModal>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        {viewType === 'list' ? (
                            <table className="table table-bordered">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Sub Department Name</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subDepartmentList && subDepartmentList?.length > 0 ? (
                                        subDepartmentList?.map((department, index) => (
                                            <tr key={`key-${index}`}>
                                                <td>{department?.name}</td>
                                                <td>
                                                    <button className="btn btn-primary" type="button" onClick={() => openModal('Update Sub Department', true, department)}>
                                                        <i className="pi pi-pencil"></i>
                                                    </button>
                                                    &nbsp;
                                                    <button className="btn btn-warning" type="button" onClick={() => deleteSubDepartment(department)}>
                                                        <i className="pi pi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6}>
                                                <div className="alert alert-success text-center" role="alert">
                                                    No sub department found!!!
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <div className="row cardView mt-3">
                                {subDepartmentList && subDepartmentList?.length > 0 ? (
                                    subDepartmentList?.map((department, index) => (
                                        <div className="col-md-3 mb-3">
                                            <div className="card dash-widget pb-2 pt-3" key={`key-${index}`}>
                                                <div className="card-header">
                                                    <p>{department?.name}</p>
                                                </div>
                                                <div className="mt-3">
                                                    <button className="btn-outline-delete" onClick={() => deleteSubDepartment(department)}>
                                                        {' '}
                                                        <i className="pi pi-trash" style={{ marginRight: '6px' }}></i>Delete
                                                    </button>
                                                    <button className="btn-outline-edit" onClick={() => openModal('Update Sub Department', true, department)}>
                                                        {' '}
                                                        <i className="pi pi-pencil" style={{ marginRight: '4px' }}></i> Edit
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="alert alert-success text-center" role="alert">
                                        No sub department found!!!
                                    </div>
                                )}
                            </div>
                        )}

                        {totalSubDepartment > 10 ? (
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

export default SubDepartmentComponent;
