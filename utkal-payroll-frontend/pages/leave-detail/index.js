import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { Formik, Field, Form } from 'formik';
import { LeaveTypeService, UserService,LeaveBalanceService } from '../../redux/services/feathers/rest.app';
import { getUser } from '../../redux/helpers/user';
import TokenService from '../../redux/services/token.service';

const LeaveDetails = () => {
    const userData = getUser();
    const [loader, setLoader] = useState(false);
    const [leaveTypeValues, setLeaveTypeValues] = useState({});
    const [title, setTitle] = useState('');
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [leaveTypeList, setLeaveTypeList] = useState([]);
    const [totalLeaveType, setTotalLeaveType] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [employeeCount, setEmployeeCounts] = useState(0);
    const [totalEmployee, setTotalEmployee] = useState(0);
    const [allUsers, setAllUsers] = useState([]);
    const [leaveBalanceList, setLeaveBalanceList] = useState([]);
    const [disabled, setDisable] = useState(false);

    const [visibleUsersDropdown, setVisibleUsersDropdown] = useState(false);
    const [formData, setFormData] = useState({ employeename: '' });
    const [userValues, setUserValues] = useState({});
    const clearFilter = () => {
        setFormData({ employeename: '' });
        setUserValues({});
        setLeaveBalanceList([]);
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
                    setLoader(false);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };
    const setFormValues = (type, data) => {
        if (type === 'employeename') {
            setUserValues(data);
            setVisibleUsersDropdown(false);
        }
    };
    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setOffset(selectedPage * perPage);
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
            });
    };
    useEffect(() => {
        fetchAllLeaveType();
    }, [offset]);
    const filterLeaveDetails = (val) => {
       fetchAllLeaveBalance(userValues._id);
    };

    const fetchAllLeaveBalance = async (user_id) => {
            setLoader(true);
            LeaveBalanceService.find({
                query: {
                    userId: user_id,
                    $skip: offset,
                    $limit: perPage,
                    $sort: { createdAt: -1 },
                    $populate: ['leaveBalence.leaveType']
                },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    console.log(res?.data,':::::::::::::::res?.data')
                     setLoader(false);
                     if(res?.data){
                        setLeaveBalanceList(res?.data);
                     }

                    // setTotalLeaveBalance(res?.total);
                })
                .catch((error) => {
                    setLoader(false);
                });

    };
    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Leave Details</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Employee</a>
                                </li>
                                <li className="breadcrumb-item active">Leave Details</li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                <div className="col-md-12">
                            <Formik
                                enableReinitialize
                                initialValues={formData}
                                onSubmit={(values, event) => {

                                    console.log(values,':::::::::::::values')
                                    filterLeaveDetails(values);
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
                                                </div>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    <div className="col-md-12 col-sm-12">
                        <table className="table table-bordered table-hover">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Code</th>
                                    <th scope="col">Leave Type</th>
                                    <th scope="col">O/B</th>
                                    <th scope="col">Granted</th>
                                    <th scope="col">Availed</th>
                                    <th scope="col">Applied</th>
                                    <th scope="col">Encashed</th>
                                    <th scope="col">Lapsed</th>
                                    <th scope="col">Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                            {leaveBalanceList && leaveBalanceList?.length > 0 ? (
                                leaveBalanceList[0]?.leaveBalence?.map((data, index) => (
                                    <tr key={`key-${index}`}>
                                        <th>{data?.leaveType?.shortName}</th>
                                        <td>{data?.leaveType?.name}</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>0</td>
                                        <td>{data?.balance}</td>
                                    </tr>
                                ))) : (
                                    <tr>
                                        <td colSpan={10}>
                                            <div className="alert alert-success text-center" role="alert">
                                                No record found!!!
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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

export default LeaveDetails;
