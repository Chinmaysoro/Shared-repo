import 'react-daterange-picker/dist/css/react-calendar.css';
import React, { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import originalMoment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(originalMoment);
import { toast } from 'react-toastify';
import { UserService, AttendanceMusterService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
import { daysInMonth, getYearList, fetchMonthList } from '../../redux/helpers/dateHelper';
import { getUser } from '../../redux/helpers/user';

const AttendanceScreen = () => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [attendanceList, setAttendanceList] = useState([]);
    const [totalAttendance, setTotalAttendance] = useState(0);
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [formData, setFormData] = useState({
        employeename: '',
        month: '',
        year: ''
    });
    const [title, setTitle] = useState('');
    const [visible, setVisible] = useState(false);
    const [attendanceValues, setAttendanceValues] = useState(false);
    const [visibleUsersDropdown, setVisibleUsersDropdown] = useState(false);
    const [visibleExportUsersDropdown, setVisibleExportUsersDropdown] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [userValues, setUserValues] = useState({});
    const [rangeValues, setRangeValues] = useState({});
    const [isRangePickerOpen, setIsRangePickerOpen] = useState(false);
    const [exportToPDFLoader, setExportToPDFLoader] = useState(false);
    const [bulkUploadModal, setbulkUploadModal] = useState(false);
    const [attendanceMusterList, setAttendanceMusterList] = useState([]);
    const [totalAttendanceMuster, setTotalAttendanceMuster] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [yearList, setYearList] = useState([]);
    const [monthList, setMonthList] = useState([]);

    const fetchAllAttendanceMuster = async (values) => {
        const queryData = {
            // $skip: offset,
            // $limit: perPage,
            $sort: { createdAt: -1 },
            companyId: userData?.user?.companyId,
            month: values?.month ? values?.month : selectedMonth,
            year: values?.year ? values?.year : selectedYear,
            $populate: [
                {
                    path: 'user',
                    model: 'user', // The name of the Mongoose model for pastExperience
                    populate: {
                        path: 'departmentId',
                        model: 'departmentId' // The name of the Mongoose model for designation
                    }
                }
            ]
        };
        if (values?.employeename) {
            queryData['userId'] = userValues?._id;
        }

        if (userData?.user?.companyId) {
            setLoader(true);
            await AttendanceMusterService.find({
                query: queryData,
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setLoader(false);
                    setAttendanceMusterList(res);
                    // setPageCount(Math.ceil(res?.total / perPage));
                    // setTotalAttendanceMuster(res?.total);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    const openModal = (type, val, data) => {
        setVisible(val);
        setTitle(type);
        setAttendanceValues(data);
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
                if (type === 'pdf-export') {
                    setVisibleExportUsersDropdown(true);
                } else {
                    setVisibleUsersDropdown(true);
                }
                setAllUsers(res.data);
            })
            .catch((error) => {
                setDisable(false);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'employeename') {
            getAllUser(value, '');
        }
        if (name === 'month') {
            setSelectedMonth(value);
        }
        if (name === 'year') {
            setSelectedYear(value);
        }
    };

    const setFormValues = (type, data) => {
        if (type === 'employeename') {
            setUserValues(data);
            setVisibleUsersDropdown(false);
        }
    };

    const filterEmployeeList = (val) => {
        setSelectedMonth(val?.month);
        setSelectedYear(val?.year);
        fetchAllAttendanceMuster(val);
    };

    const clearFilter = () => {
        setFormData({ employeename: '', month: '', year: '' });
        fetchAllAttendanceMuster('');
    };

    useEffect(() => {
        const years = getYearList();
        const months = fetchMonthList();
        setYearList(years);
        setMonthList(months);
        if (formData?.month) {
            fetchAllAttendance(formData);
        } else {
            fetchAllAttendanceMuster('');
        }
    }, [offset, formData]);

    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Attendance Status</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link href="/employee">Employee</Link>
                                </li>
                                <li className="breadcrumb-item active">Attendance Status</li>
                            </ul>
                        </div>
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
                                            <div className="col-2">
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
                                            <div className="col-2">
                                                <div className="form-group">
                                                    <label htmlFor="month" className="form-label">
                                                        Month
                                                    </label>
                                                    <Field name="month" id="month" as="select" className="form-control pt-2">
                                                        <option value="">-Select-</option>
                                                        {monthList && monthList?.length > 0
                                                            ? monthList?.map((data, index) => (
                                                                  <option key={data.value} value={data.value}>
                                                                      {data.label}
                                                                  </option>
                                                              ))
                                                            : null}
                                                    </Field>
                                                    {errors.monthname && touched.monthname ? (
                                                        <p className="text-danger text-monospace mt-2">
                                                            <small>{errors.monthname}</small>
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-2">
                                                <div className="form-group">
                                                    <label htmlFor="year" className="form-label">
                                                        Year
                                                    </label>
                                                    <Field name="year" id="year" as="select" className="form-control pt-2">
                                                        <option value="">-Select-</option>
                                                        {yearList && yearList?.length > 0
                                                            ? yearList?.map((data, index) => (
                                                                  <option key={data} value={data}>
                                                                      {data}
                                                                  </option>
                                                              ))
                                                            : null}
                                                    </Field>
                                                    {errors.yearname && touched.yearname ? (
                                                        <p className="text-danger text-monospace mt-2">
                                                            <small>{errors.yearname}</small>
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="col-6">
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
                    </div>
                </div>
                <div className="row staff-grid-row ">
                    <div className="col-md-12 col-sm-12 scrollbale">
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Emp. ID</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Department</th>
                                    {new Array(daysInMonth(selectedMonth, selectedYear))[0].map((data, index) => {
                                        return <th>{index + 1}</th>;
                                    })}
                                    {/* <th scope="col">Total Working Days</th>
                                    <th scope="col">Total Applicable Days</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceMusterList && attendanceMusterList?.length > 0 ? (
                                    attendanceMusterList?.map((attendance, index) => (
                                        <tr key={`key${index}`}>
                                            <th>{attendance?.user?.empId || 'N/A'}</th>
                                            <td>
                                                {attendance?.user?.firstName ? attendance?.user?.firstName : null}&nbsp;{attendance?.user?.middleName ? attendance?.user?.middleName : null}&nbsp;
                                                {attendance?.user?.lastName ? attendance?.user?.lastName : null}
                                            </td>
                                            <td>{attendance?.user?.departmentId?.name || 'N/A'}</td>
                                            {Object.values(attendance?.report).map((report, index) => (
                                                <th key={index}>
                                                    <span
                                                        className={
                                                            report?.status === 'WO'
                                                                ? 'a-weekoff'
                                                                : null || report?.status === 'A'
                                                                ? 'text-danger'
                                                                : null || report?.status === 'PH'
                                                                ? 'text-danger'
                                                                : null || report?.status === 'P'
                                                                ? 'a-present'
                                                                : null || report?.status === 'HD'
                                                                ? 'a-present'
                                                                : null || report?.status === 'WO'
                                                                ? 'text-warning'
                                                                : null || report?.status === 'L'
                                                                ? 'text-danger'
                                                                : null
                                                        }
                                                    >
                                                        {report?.status}
                                                    </span>
                                                </th>
                                            ))}
                                            {/* <span className="a-present">P</span>
                                            <span className="a-weekoff">WO</span>
                                            <span className="a-holiday">HD</span> */}
                                            {/* <td>120</td>
                                            <td>122</td> */}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8}>
                                            <div className="alert alert-success text-center" role="alert">
                                                Attendance not found!!!
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

export default AttendanceScreen;
