import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import { userActions } from '../../redux/actions/user.actions';
import { getUser } from '../../redux/helpers/user';
import { UserService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';

const PayrollPage = () => {
    const dispatch = useDispatch();
    const userData = getUser();
    const [visibleUsersDropdown, setVisibleUsersDropdown] = useState(false);
    const [bulkUploadModal, setbulkUploadModal] = useState(false);
    const [title, setTitle] = useState('');
    const [employeeList, setEmployeeList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [totalEmployee, setTotalEmployee] = useState(0);
    const [formData, setFormData] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const [userValues, setUserValues] = useState({});

    const fetchAllEmployee = async (data) => {
        if (userData?.user?.companyId) {
            setLoader(true);
            const queryData = {
                $skip: offset,
                $limit: perPage,
                $sort: { createdAt: -1 },
                companyId: userData?.user?.companyId,
                role: 1
            };
            const filterQueryData = {
                ...queryData
            };
            if (data !== null) {
                filterQueryData['_id'] = userValues?._id;
            }

            await UserService.find({
                query: data !== null ? filterQueryData : queryData,
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

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setOffset(selectedPage * perPage);
    };

    useEffect(() => {
        fetchAllEmployee(null);
    }, [offset]);

    // const deleteEmployee = (id) => {
    //     setLoader(true);
    //     UserService.remove(id, {
    //         headers: {
    //             Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
    //         }
    //     })
    //         .then((res) => {
    //             setLoader(false);
    //             toast.success('User deleted successfully.');
    //             fetchAllEmployee(null);
    //         })
    //         .catch((error) => {
    //             setLoader(false);
    //             toast.error(error?.message);
    //         });
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'employeename') {
            getAllUser(value);
        }
    };

    const getAllUser = async (value) => {
        if (userData?.user?.companyId) {
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
                });
        }
    };

    const filterEmployeeList = (val) => {
        if (val?.employeename !== '') {
            fetchAllEmployee(val);
        } else {
            fetchAllEmployee(null);
        }
    };

    const setFormValues = (type, data) => {
        if (type === 'employeename') {
            setUserValues(data);
            setVisibleUsersDropdown(false);
        }
    };

    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-3">
                            <h3 className="page-title">Payslip</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Employee</a>
                                </li>
                                <li className="breadcrumb-item active">Payslip</li>
                            </ul>
                        </div>
                        <div className="col-md-9">
                            <div className="d-flex justify-content-end">
                                <div className="d-inline-block report_filter_form">
                                    <Formik
                                        enableReinitialize
                                        initialValues={formData}
                                        onSubmit={(values, event) => {
                                            filterEmployeeList(values);
                                        }}
                                    >
                                        {({ values, errors, touched, setFieldTouched, setFieldValue }) => (
                                            <Form autoComplete="off">
                                                <div className="form_sec d-inline-block">
                                                    <div className="row">
                                                        <div className="col-md-7">
                                                            <div className="form-group">
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
                                                                                    {`${user?.firstName} ${user?.lastName}`}
                                                                                </li>
                                                                            );
                                                                        })}
                                                                    </ul>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <div className="form-group">
                                                                <button className="btn btn-primary" type="submit">
                                                                    Filter
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">User Name</th>
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
                                            <th scope="row">{`${emp?.firstName} ${emp?.lastName}`}</th>
                                            <td>{emp?.username}</td>
                                            <td>{emp?.email}</td>
                                            <td>{emp?.phone}</td>
                                            <td>{emp?.status}</td>
                                            <td>
                                                <Link href={`/payroll/[employeeId]`} as={`/payroll/${emp?._id}`}>
                                                    <button className="btn btn-primary" type="button">
                                                        <i className="pi pi-arrow-right"></i>
                                                    </button>
                                                </Link>
                                                {/* &nbsp;
                                                <button className="btn btn-warning" onClick={() => deleteEmployee(emp?._id)}>
                                                    <i className="pi pi-trash"></i>
                                                </button> */}
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

export default PayrollPage;
