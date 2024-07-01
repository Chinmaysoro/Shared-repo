import React, { useState, useEffect } from 'react';
import getConfig from 'next/config';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { Formik, Field, Form } from 'formik';
import { toast } from 'react-toastify';
import SimpleModal from '../components/Modal';
import AddEmployee from './AddEmployee';
import BulkUploadEmployee from './BulkUpload';
import { userActions } from '../../redux/actions/user.actions';
import { getUser, encodedID } from '../../redux/helpers/user';
import { UserService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';

const EmployeeDashboard = () => {
    const dispatch = useDispatch();
    const userData = getUser();
    const [visible, setVisible] = useState(false);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [bulkUploadModal, setbulkUploadModal] = useState(false);
    const [title, setTitle] = useState('');
    const [employeeList, setEmployeeList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [totalEmployee, setTotalEmployee] = useState(0);
    const [allUsers, setAllUsers] = useState([]);
    const [disabled, setDisable] = useState(false);
    const [visibleUsersDropdown, setVisibleUsersDropdown] = useState(false);
    const [formData, setFormData] = useState({ employeename: '' });
    const [userValues, setUserValues] = useState({});

    const openModal = (type, val) => {
        setVisible(val);
        setTitle(type);
    };

    const clearFilter = () => {
        setFormData({ employeename: '' });
        setUserValues({});
    };

    const openBulkUploadModal = (type, val) => {
        setbulkUploadModal(val);
        setTitle(type);
    };
    const capitalizeFirstLetter = (inputString) => {
        return inputString.charAt(0).toUpperCase() + inputString.slice(1);
    };
    const fetchAllEmployee = async (val) => {
        if (userData?.user?.companyId) {
            setLoader(true);
            const queryData = {
                $skip: offset,
                $limit: perPage,
                $sort: { firstName: 1 },
                companyId: userData?.user?.companyId,
                $populate: ['departmentId'],
                role: 1
            };
            if (val) {
                queryData['_id'] = userValues?._id;
            }
            await UserService.find({
                query: queryData,
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setLoader(false);
                    setEmployeeList(res.data);
                    setPageCount(Math.ceil(res.total / perPage));
                    setTotalEmployee(res.total);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    const filterEmployeeList = (val) => {
        fetchAllEmployee(val);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'employeename') {
            getAllUser(value, '');
        }
    };

    const getAllUser = async (value, type) => {
        await UserService.find({
            query: {
                $or: [
                    {
                        firstName: {
                            $regex: `.*${value}.*`,
                            $options: 'i'
                        }
                    },
                    {
                        lastName: {
                            $regex: `.*${value}.*`,
                            $options: 'i'
                        }
                    },
                    {
                        email: {
                            $regex: `.*${value}.*`,
                            $options: 'i'
                        }
                    },
                    {
                        phone: {
                            $regex: `.*${value}.*`,
                            $options: 'i'
                        }
                    },
                    {
                        empId: {
                            $regex: `.*${value}.*`,
                            $options: 'i'
                        }
                    }
                ],
                $skip: 0,
                $limit: 100,
                $sort: { createdAt: -1 },
                companyId: userData?.user?.companyId
            },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setVisibleUsersDropdown(true);
                setAllUsers(res.data);
            })
            .catch((error) => {
                setDisable(false);
                console.log(error);
            });
    };

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setOffset(selectedPage * perPage);
    };

    const setFormValues = (type, data) => {
        if (type === 'employeename') {
            setUserValues(data);
            setVisibleUsersDropdown(false);
        }
    };

    useEffect(() => {
        if (formData?.employeename) {
            fetchAllEmployee(formData);
        } else {
            fetchAllEmployee('');
        }
    }, [offset, formData]);

    const disableEmployee = (id, status) => {
        setLoader(true);
        let data = {};
        data['status'] = status == 'disabled' ? 'active' : 'disabled';
        UserService.patch(
            id,
            {
                ...data
            },
            {
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            }
        )
            .then((res) => {
                // console.log("Status:-", res);
                setLoader(false);
                if(res.status == 'active'){
                    toast.success(`Employee ${res.firstName} ${res.middleName} ${res.lastName} is now ${res.status}`);
                }else{
                    toast.error(`Employee ${res.firstName} ${res.middleName} ${res.lastName} is now ${res.status}`); 
                }
                fetchAllEmployee();
            })
            .catch((error) => {
                setLoader(false);
                toast.error(error?.message);
            });
    };
    const getRandomColor = () => {
        const colors = ['#FFF1BF', '#FFDCBC', '#CFEEFF', '#FFBFDA', '#F5DBFF', '#C7F0D3'];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };
    const randomBackgroundColor = getRandomColor();
    const badgeStyle = {
        backgroundColor: randomBackgroundColor,
        padding: '5px 10px', // Add padding or other styles as needed
        borderRadius: '4px' // Optional: Add rounded corners
    };
    const navigateToUpdateProfile = () => {};

    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Employees</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Dashboard</a>
                                </li>
                                <li className="breadcrumb-item active">Employee</li>
                            </ul>
                        </div>
                    </div>
                    <div className="row d-flex">
                        <div className="col-md-12">
                            <Formik
                                enableReinitialize
                                initialValues={formData}
                                onSubmit={(values, event) => {
                                    filterEmployeeList(values);
                                }}
                            >
                                {({ values, errors, touched, setFieldTouched, setFieldValue }) => (
                                    <Form autoComplete="off">
                                        <div className="row">
                                            <div className="col-3">
                                                <div className="form-group">
                                                    <label htmlFor="employeename" className="form-label">
                                                        User name
                                                    </label>
                                                    <Field type="text" placeholder="Enter user name" className="form-control" name="employeename" id="employeename" onKeyUp={handleChange} />

                                                    {visibleUsersDropdown && allUsers.length > 0 ? (
                                                        <ul className="t_ul" style={{ width: '95%' }}>
                                                            {allUsers.map((user, index) => {
                                                                return (
                                                                    <li
                                                                        key={`key-${index}`}
                                                                        onClick={() => {
                                                                            setFormValues('employeename', user);
                                                                            setFieldTouched('employeename', true);
                                                                            setFieldValue('employeename', `${user?.firstName} ${user?.lastName}`);
                                                                        }}
                                                                    >
                                                                        {`${user?.empId ? user?.empId : ''} ${user?.firstName} ${user?.lastName}`}
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-9">
                                                <div className="button-group" role="group" style={{ marginTop: '23px' }}>
                                                    <button className="btn btn-primary" type="submit" title="Filter">
                                                        <i className="pi pi-filter"></i>
                                                    </button>
                                                    <button className="btn btn-warning" type="button" onClick={() => clearFilter()} title="Clear filter">
                                                        <i className="pi pi-filter-slash"></i>
                                                    </button>
                                                    <button type="button" className="btn btn-light btn-upload" onClick={() => openBulkUploadModal('Bulk Upload', true)}>
                                                        <i className="pi pi-upload"></i> Bulk Upload
                                                    </button>
                                                    <Link href={'/employee/create-employee'}>
                                                        <div className="btn btn-primary" style={{ cursor: 'pointer' }}>
                                                            <i className="pi pi-user-plus"></i> Add Employee
                                                        </div>
                                                    </Link>
                                                    {/* {userData?.user?.role === 2 ? (
                                                        ''
                                                    ) : (
                                                        <button type="button" className="btn btn-primary" onClick={() => openModal('Add HR', true)}>
                                                            <i className="pi pi-user-plus"></i> Add HR
                                                        </button>
                                                    )} */}
                                                </div>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
                <SimpleModal title={title} visible={visible} setVisible={() => setVisible(false)} body={<AddEmployee setVisible={() => setVisible(false)} title={title} getAllEmployee={fetchAllEmployee} />}></SimpleModal>
                <SimpleModal title={title} visible={bulkUploadModal} setVisible={() => openBulkUploadModal(false)} body={<BulkUploadEmployee setVisible={() => setbulkUploadModal(false)} fetchAllEmployee={fetchAllEmployee} />}></SimpleModal>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        <table className="table table-bordered mt-2">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">EMP ID</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Mobile</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeeList && employeeList?.length > 0 ? (
                                    employeeList?.map((emp, index) => (
                                        <tr key={`key-${index}`}>
                                            <td>
                                                <div className="d-inline-flex">
                                                    <div className="employee-avatar">
                                                        {emp?.avatar ? (
                                                            <img src={`https://dd7tft2brxkdw.cloudfront.net/${emp?.avatar}`} alt="user Preview" className="preview-image" />
                                                        ) : (
                                                            <img src={`${contextPath}/layout/images/default-user.jpg`} alt="user Preview" className="preview-image" />
                                                        )}
                                                    </div>
                                                    <div className="mt-1 ml-2">
                                                        {emp?.firstName ? emp?.firstName : null}&nbsp;{emp?.middleName ? emp?.middleName : null}&nbsp;
                                                        {emp?.lastName ? emp?.lastName : null}
                                                        <span className="badge badge-light" style={{ backgroundColor: getRandomColor() }}>
                                                            {emp?.departmentId?.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{emp?.empId || 'N/A'}</td>
                                            <td>{emp?.email || 'N/A'}</td>
                                            <td>{emp?.phone || 'N/A'}</td>
                                            <td>
                                                <div className="d-inline-flex">
                                                    {emp?.status && emp?.status == 'disabled' ? (
                                                        <span className="emp_status_deactive">
                                                            <img src={`${contextPath}/layout/images/diabled.svg`} alt="user Preview" />
                                                            {capitalizeFirstLetter(emp?.status)}
                                                        </span>
                                                    ) : (
                                                        <span className="emp_status_active">
                                                            <img src={`${contextPath}/layout/images/active.svg`} alt="user Preview" />
                                                            {capitalizeFirstLetter(emp?.status)}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex">
                                                    <Link href={`/employee/[employeeId]`} as={`/employee/${encodedID(emp?._id)}`}>
                                                        <button title="Update" className="btn btn-primary" type="button">
                                                            <i className="pi pi-pencil"></i>
                                                        </button>
                                                    </Link>
                                                    &nbsp;
                                                    <button
                                                        title={emp?.status == 'disabled' ? 'disable' : 'active'}
                                                        className={emp?.status == 'active' ? 'btn btn-warning no-bg' : 'btn btn-warning'}
                                                        onClick={() => disableEmployee(emp?._id, emp?.status)}
                                                    >
                                                        <i className="pi pi-ban"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="alert alert-success text-center" role="alert">
                                                No employee found!!!
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {totalEmployee > 10 ? (
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

export default EmployeeDashboard;
