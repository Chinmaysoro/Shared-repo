import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import SimpleModal from '../components/Modal';
import AddDepartment from './AddDepartment';
import { DepartmentService, UserService } from '../../redux/services/feathers/rest.app';
import { getUser } from '../../redux/helpers/user';
import TokenService from '../../redux/services/token.service';

const DepartmentComponent = () => {
    const userData = getUser();
    const [loader, setLoader] = useState(false);
    const [visible, setVisible] = useState(false);
    const [departmentValues, setDepartmentValues] = useState({});
    const [title, setTitle] = useState('');
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [departmentList, setDepartmentList] = useState([]);
    const [totalDepartment, setTotalDepartment] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [employeeCount, setEmployeeCounts] = useState(0);
    const [viewType, setViewType] = useState('card'); // Initial view type is 'list'
    const handleViewToggle = (e) => {
        setViewType(viewType === 'list' ? 'card' : 'list');
    };

    const openModal = (type, val, data) => {
        setVisible(val);
        setTitle(type);
        setDepartmentValues(data);
    };

    const fetchAllDepartment = async () => {
        if (userData?.user?.companyId) {
            setLoader(true);
            DepartmentService.find({
                query: { companyId: userData?.user?.companyId, $skip: offset, $limit: perPage, $sort: { createdAt: -1 } },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then(async (res) => {
                    setDepartmentList(res.data);
                    setPageCount(Math.ceil(res.total / perPage));
                    setTotalDepartment(res.total);
                    const departments = res.data;
                    // Fetch employee counts for each department
                    const employeeCountsPromises = departments.map((department) => {
                        return getEmpCount(department._id);
                    });
                    // Wait for all employee count promises to resolve
                    await Promise.all(employeeCountsPromises);
                    setLoader(false);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    const deleteDepartment = (values) => {
        setLoader(true);
        DepartmentService.remove(values?._id, {
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                toast.success('Department deleted successfully.');
                fetchAllDepartment();
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
    const getEmpCount = async (deptId) => {
        try {
            const queryData = {
                companyId: userData?.user?.companyId,
                departmentId: deptId,
                role: 1
            };

            const res = await UserService.find({
                query: queryData,
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            });

            setEmployeeCounts((prevCounts) => ({
                ...prevCounts,
                [deptId]: res?.data?.length
            }));
        } catch (error) {
            // Handle the error
        }
    };
    useEffect(() => {
        fetchAllDepartment();
    }, [offset]);
    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Department</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Employee</a>
                                </li>
                                <li className="breadcrumb-item active">Department</li>
                            </ul>
                        </div>

                        <div className="col-auto float-right ml-auto">
                            <button type="button" className="btn btn-primary" onClick={() => openModal('Add Department', true, null)}>
                                <i className="pi pi-plus"></i> Add Department
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
                <SimpleModal title={title} visible={visible} setVisible={() => setVisible(false)} body={<AddDepartment setVisible={() => setVisible(false)} departmentValues={departmentValues} fetchAllDepartment={fetchAllDepartment} />}></SimpleModal>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        {viewType === 'list' ? (
                            <table className="table table-bordered">
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Department Name</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {departmentList && departmentList?.length > 0 ? (
                                        departmentList?.map((department, index) => (
                                            <tr key={`key-${index}`}>
                                                <td>
                                                    <Link href={`/department/[departmentId]`} as={`/department/${department?._id}`}>
                                                        {department?.name}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <button className="btn btn-primary" type="button" onClick={() => openModal('Update Department', true, department)}>
                                                        <i className="pi pi-pencil"></i>
                                                    </button>
                                                    &nbsp;
                                                    <button className="btn btn-warning" type="button" onClick={() => deleteDepartment(department)}>
                                                        <i className="pi pi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6}>
                                                <div className="alert alert-success text-center" role="alert">
                                                    No department found!!!
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <div className="row cardView mt-3">
                                {departmentList && departmentList?.length > 0 ? (
                                    departmentList?.map((department, index) => (
                                        <div className="col-md-3 mb-3">
                                            <div className="card dash-widget pb-2 pt-3" key={`key-${index}`}>
                                                <div className="card-header">
                                                    <p>
                                                        <Link href={`/department/[departmentId]`} as={`/department/${department?._id}`}>
                                                            {department?.name}
                                                        </Link>
                                                    </p>
                                                </div>
                                                {loader ? (
                                                    'Loading...'
                                                ) : (
                                                    <div className="emp-count mt-1">
                                                        {
                                                            employeeCount[department?._id] !== undefined ? `${employeeCount[department?._id]} Employees` : 'Count Loading...' // You can replace this with a loading indicator or placeholder
                                                        }
                                                    </div>
                                                )}
                                                <div className="mt-3">
                                                    <button className="btn-outline-delete" onClick={() => deleteDepartment(department)}>
                                                        {' '}
                                                        <i className="pi pi-trash" style={{ marginRight: '6px' }}></i>Delete
                                                    </button>
                                                    <button className="btn-outline-edit" onClick={() => openModal('Update Department', true, department)}>
                                                        {' '}
                                                        <i className="pi pi-pencil" style={{ marginRight: '4px' }}></i> Edit
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="alert alert-success text-center" role="alert">
                                        No department found!!!
                                    </div>
                                )}
                            </div>
                        )}

                        {totalDepartment > 10 ? (
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

export default DepartmentComponent;
