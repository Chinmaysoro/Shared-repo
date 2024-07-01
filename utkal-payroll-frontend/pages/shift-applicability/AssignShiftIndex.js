import 'react-daterange-picker/dist/css/react-calendar.css';
import React, { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { Formik, Field, Form, FormikHelpers, ErrorMessage } from 'formik';
import originalMoment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(originalMoment);
import SimpleModal from '../components/Modal';
import { toast } from 'react-toastify';
import { UserService, CompanyService, AttendanceMusterService, DepartmentService, DesignationService, GradeService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
import { daysInMonth, getYearList, fetchMonthList } from '../../redux/helpers/dateHelper';
import { getUser } from '../../redux/helpers/user';
import getConfig from 'next/config';
import AssignManualShift from './AssignManualShift';
import { userService } from '../../redux/services';

const AssignShiftIndex = () => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [attendanceList, setAttendanceList] = useState([]);
    const [totalAttendance, setTotalAttendance] = useState(0);
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
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
    const [allDepartmentList, setallDepartmentList] = useState([]);
    const [allDesignationList, setallDesignationList] = useState([]);
    const [allGradeList, setallGradeList] = useState([]);
    const [allSubDepartmentList, setallSubDepartmentList] = useState([]);
    const [allLocationList, setAllLocationList] = useState([]);
    const [allDivisionList, setAllDivisionList] = useState([]);
    const [selectedCount, setSelectedCount] = useState(0);
    const [selectedRows, setSelectedRows] = useState([]);

    const openModal = (type, val, data) => {
        setVisible(val);
        setTitle(type);
        setAttendanceValues(data);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Assuming 'dob' is the name of the date fieldName of Organization
        // Handle other input fields here
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        // console.log(formValues,'::::::::::::::::formValues')
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
    };

    const clearFilter = () => {
        setFormData({ employeename: '', month: '', year: '' });
    };
    const fetchAllDepartments = async (value) => {
        await DepartmentService.find({
            query: {
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
                setallDepartmentList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const fetchAllDesignations = async (value) => {
        await DesignationService.find({
            query: {
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
                setallDesignationList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const fetchAllGrade = async (value) => {
        await GradeService.find({
            query: {
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
                setallGradeList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const getSubDepartment = async (value) => {
        await DepartmentService.find({
            query: {
                $skip: 0,
                $limit: 100,
                $sort: { createdAt: -1 },
                companyId: userData?.user?.companyId,
                parentId: value,
                childDepartment: true
            },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setallSubDepartmentList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const fetchAllLocationGradeByCompany = async () => {
        setLoader(true);
        CompanyService.find({
            query: { _id: userData?.user?.companyId, $sort: { createdAt: -1 } },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                if (res?.data[0]?.location?.length > 0) {
                    setAllLocationList(res?.data[0]?.location);
                }
                if (res?.data[0]?.division?.length > 0) {
                    setAllDivisionList(res?.data[0]?.division);
                }
            })
            .catch((error) => {
                setLoader(false);
            });
    };
    const fetchAll = async () => {
        await fetchAllDepartments();
        await fetchAllDesignations();
        await fetchAllGrade();
        await fetchAllLocationGradeByCompany();
    };
    useEffect(() => {
        fetchAll();
    }, []);
    // Need to add employee data...
    const staticEmployees = [
        { id: 1, name: 'Abhishek Mohapatra', idNumber: 'SAP-4646', email: 'abhisek@gmail.com', phone: '7895689586' },
        { id: 2, name: 'John Doe', idNumber: 'SAP-1234', email: 'john.doe@example.com', phone: '1234567890' },
        { id: 3, name: 'Jane Smith', idNumber: 'SAP-5678', email: 'jane.smith@example.com', phone: '0987654321' }
    ];
    // const dynamicEmployees = async()=>{
    //     const userS= await userService.find(
    //         {
    //             query: user,
    //             headers: {
    //                 Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
    //             }
    //         }
    //     )
    //     console.log(userS);
    // };

    const handleCheckboxChange = (event, id) => {
        const isChecked = event.target.checked;
        let updatedSelectedRows = [...selectedRows];
        if (isChecked) {
            updatedSelectedRows.push(id);
        } else {
            updatedSelectedRows = updatedSelectedRows.filter(rowId => rowId !== id);
        }
        setSelectedRows(updatedSelectedRows);
        setSelectedCount(updatedSelectedRows.length);
    };
    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Assign Shift</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link href="/employee">Employee</Link>
                                </li>
                                <li className="breadcrumb-item active">Assign Shift</li>
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
                                            <div className="col-md-3">
                                                <label className="form-label w-100">
                                                    Designation*
                                                    <Field as="select" name="designationId" className="form-control">
                                                        <option value="" label="Select a designation" />
                                                        {allDesignationList.map((designation, index) => (
                                                            <option key={`key-${index}`} value={designation._id}>
                                                                {designation.name}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                    <ErrorMessage name="designationId" component="div" className="error" />
                                                </label>
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label w-100">
                                                    Department*
                                                    <Field
                                                        as="select"
                                                        name="departmentId"
                                                        className="form-control"
                                                        onInput={(e) => {
                                                            handleInputChange(e);
                                                            // Call the getSubDepartment function here with the selected value
                                                            getSubDepartment(e.target.value);
                                                        }}
                                                    >
                                                        <option value="" label="Select a department" />
                                                        {allDepartmentList.map((department, index) => (
                                                            <option key={`key-${index}`} value={department._id}>
                                                                {department.name}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                    <ErrorMessage name="departmentId" component="div" className="error" />
                                                </label>
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label w-100">
                                                    Sub-department
                                                    <Field as="select" name="subDepartmentId" className="form-control">
                                                        <option value="" label="Select sub-department" />
                                                        {allSubDepartmentList.map((subDept, index) => (
                                                            <option key={`key-${index}`} value={subDept._id}>
                                                                {subDept.name}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                </label>
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label w-100">
                                                    Grade
                                                    <Field as="select" name="gradeId" className="form-control">
                                                        <option value="" label="Select a grade" />
                                                        {allGradeList.map((grade, index) => (
                                                            <option key={`key-${index}`} value={grade._id}>
                                                                {grade.name}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                </label>
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label w-100">
                                                    Location
                                                    <Field as="select" name="location" className="form-control">
                                                        <option value="" label="Select location" />
                                                        {allLocationList &&
                                                            allLocationList?.length > 0 &&
                                                            allLocationList.map((location, index) => (
                                                                <option key={`key-${index}`} value={location}>
                                                                    {location}
                                                                </option>
                                                            ))}
                                                    </Field>
                                                </label>
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label w-100">
                                                    Division
                                                    <Field as="select" name="division" className="form-control">
                                                        <option value="" label="Select division" />
                                                        {allDivisionList &&
                                                            allDivisionList?.length > 0 &&
                                                            allDivisionList.map((division, index) => (
                                                                <option key={`key-${index}`} value={division}>
                                                                    {division}
                                                                </option>
                                                            ))}
                                                    </Field>
                                                </label>
                                            </div>

                                            <div className="col-3">
                                                <div className="button-group" role="group" style={{ marginTop: '10px' }}>
                                                    <button className="btn btn-primary" type="submit" title="Filter">
                                                        <i className="pi pi-search"></i> <span style={{ marginLeft: '10px' }}>Search</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-3">
                                                {selectedCount > 0 && (
                                                    <div>
                                                        <div className="button-group" role="group" style={{ marginTop: '10px' }}>
                                                            <button className="btn btn-warning" type="button" title="GO TO FORM" onClick={() => openModal(selectedCount + ' employee(s) selected', true, null)}>
                                                                <i className="pi pi-check-square"></i><span style={{ marginLeft: '10px' }}>GO TO FORM</span>
                                                            </button>
                                                        </div>
                                                        <p style={{ marginLeft: '10px' }}>{`${selectedCount} ${selectedCount === 1 ? 'employee' : 'employees'} selected`}</p>
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
                <SimpleModal title={title} visible={visible} setVisible={() => setVisible(false)} body={<AssignManualShift setVisible={() => setVisible(false)} />}></SimpleModal>

                <div className="row staff-grid-row ">
                    <div className="col-md-12 col-sm-12 scrollbale">
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Slno.</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">EMP ID</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Mobile</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staticEmployees.map(employee => (
                                    <tr key={employee.id}>
                                        <td>
                                            <label className='w-100'>
                                                <input
                                                    style={{ marginRight: '10px' }}
                                                    type="checkbox"
                                                    onChange={e => handleCheckboxChange(e, employee.id)}
                                                    checked={selectedRows.includes(employee.id)}
                                                />
                                                {employee.id}
                                            </label>
                                        </td>
                                        <td>{employee.name}</td>
                                        <td>{employee.idNumber}</td>
                                        <td>{employee.email}</td>
                                        <td>{employee.phone}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignShiftIndex;
