import 'react-daterange-picker/dist/css/react-calendar.css';
import React, { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { Formik, Field, Form } from 'formik';
import originalMoment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(originalMoment);
import { toast } from 'react-toastify';
import { AttendanceService, UserService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
import { convertUTCToLocalTime } from '../../redux/helpers/dateHelper';
import SimpleModal from '../components/Modal';
import UpdateAttendance from './UpdateAttendance';
import { getUser } from '../../redux/helpers/user';
import AttendanceBulkUpload from './AttendanceBulkUpload';

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
        startDate: '',
        endDate: ''
    });
    const [title, setTitle] = useState('');
    const [visible, setVisible] = useState(false);
    const [attendanceValues, setAttendanceValues] = useState(false);
    const [exportFormData, setExportFormData] = useState({});
    const [visibleUsersDropdown, setVisibleUsersDropdown] = useState(false);
    const [visibleExportUsersDropdown, setVisibleExportUsersDropdown] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [userValues, setUserValues] = useState({});
    const [rangeValues, setRangeValues] = useState({});
    const [isRangePickerOpen, setIsRangePickerOpen] = useState(false);
    const [exportToPDFLoader, setExportToPDFLoader] = useState(false);
    const [bulkUploadModal, setbulkUploadModal] = useState(false);
    const [disabled, setDisable] = useState(false);

    const fetchAllAttendance = async (values) => {
        const queryData = {
            $skip: offset,
            $limit: perPage,
            $sort: { createdAt: -1 },
            $populate: ['createdBy'],
            companyId: userData?.user?.companyId
        };
        if (formData?.employeename) {
            queryData['createdBy'] = userValues?._id;
        }
        if (formData?.startDate || values?.startDate) {
            queryData['attendanceDate'] = {
                $gte: values?.startDate ? new Date(values?.startDate).getTime() : null,
                $lte: values?.endDate ? new Date(values?.endDate).getTime() : values?.startDate ? new Date().getTime() : null
            };
        }
        if (userData?.user?.companyId) {
            setLoader(true);
            await AttendanceService.find({
                query: queryData,
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setLoader(false);
                    setAttendanceList(res.data);
                    setPageCount(Math.ceil(res.total / perPage));
                    setTotalAttendance(res.total);
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

    const openBulkUploadModal = (type, val) => {
        setbulkUploadModal(val);
        setTitle(type);
    };

    const filterEmployeeList = (val) => {
        fetchAllAttendance(val);
    };

    // const selectRange = (value) => {
    //     setRangeValues({ ...rangeValues, startDate: value.start['_i'], endDate: value.end['_i'] });
    //     setIsRangePickerOpen(false);
    // };

    // const openRangePicker = () => {
    //     setIsRangePickerOpen(!isRangePickerOpen);
    // };

    const exportToPDF = async (data) => {
        setExportToPDFLoader(true);
        const val = {};
        if (data !== '') {
            val['createdBy'] = userValues?._id;
        }
        if (val?.createdBy) {
            const url = rangeValues?.startDate
                ? `http://localhost:3030/v1/download-attendance?createdBy=${val?.createdBy}&attendanceDate[$gt]=${new Date(rangeValues?.startDate).getTime()}&attendanceDate[$lte]=${new Date(rangeValues?.endDate).getTime()}`
                : `http://localhost:3030/v1/download-attendance?createdBy=${val?.createdBy}`;
            //console.log(url);
            const tempLink = document.createElement('a');
            tempLink.href = url;
            tempLink.click();
            setExportToPDFLoader(false);
        } else {
            setExportToPDFLoader(false);
            toast.error('Please select any user');
        }
    };

    const clearFilter = () => {
        setFormData({ employeename: '', startDate: '', endDate: '' });
    };

    useEffect(() => {
        if (formData?.startDate) {
            fetchAllAttendance(formData);
        } else {
            fetchAllAttendance('');
        }
    }, [offset, formData]);

    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Attendance</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link href="/employee">Employee</Link>
                                </li>
                                <li className="breadcrumb-item active">Attendance</li>
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
                                                        Username
                                                    </label>
                                                    <Field type="text" placeholder="Enter Username" className="form-control" name="employeename" id="employeename" onKeyUp={handleChange} />

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
                                                    <label htmlFor="startDate" className="form-label">
                                                        Start Date
                                                    </label>
                                                    <Field type="date" placeholder="Start Date" className="form-control" name="startDate" id="startDate" onKeyUp={handleChange} />
                                                    {/* <div className="calnder_report_filter_sec w-100">
                                                        <input
                                                            type="text"
                                                            className="form-control report_date_range"
                                                            name="daterange"
                                                            placeholder={
                                                                new Intl.DateTimeFormat('en-IN', {
                                                                    month: 'short',
                                                                    day: '2-digit',
                                                                    year: 'numeric'
                                                                })
                                                                    .format(rangeValues?.startDate)
                                                                    .split('-')
                                                                    .join(' ') +
                                                                ' to ' +
                                                                new Intl.DateTimeFormat('en-IN', {
                                                                    month: 'short',
                                                                    day: '2-digit',
                                                                    year: 'numeric'
                                                                })
                                                                    .format(rangeValues?.endDate)
                                                                    .split('-')
                                                                    .join(' ')
                                                            }
                                                            style={{}}
                                                            onClick={openRangePicker}
                                                            onKeyDown={(e) => {
                                                                e.preventDefault();
                                                            }}
                                                        />
                                                        {isRangePickerOpen ? <DateRangePicker onSelect={selectRange} singleDateRange={true} /> : null}
                                                    </div> */}
                                                </div>
                                            </div>
                                            <div className="col-2">
                                                <div className="form-group">
                                                    <label htmlFor="endDate" className="form-label">
                                                        End Date
                                                    </label>
                                                    <Field type="date" placeholder="Start Date" className="form-control" name="endDate" id="endDate" onKeyUp={handleChange} />
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="button-group" role="group" style={{ marginTop: '23px' }}>
                                                    <button className="btn btn-primary" type="submit" title="Filter">
                                                        <i className="pi pi-filter"></i>
                                                        {/* <i className="pi pi-search"></i> */}
                                                    </button>
                                                    <button className="btn btn-warning" type="button" onClick={() => clearFilter()} title="Clear filter">
                                                        <i className="pi pi-filter-slash"></i>
                                                    </button>
                                                    {/* <button className="btn btn-primary" type="button" title="Export to pdf" onClick={() => exportToPDF(values)}>
                                                        {exportToPDFLoader ? <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i> : <i className="pi pi-file-pdf"></i>}
                                                    </button> */}
                                                    <button type="button" className="btn btn-light btn-upload" onClick={() => openBulkUploadModal('Attendance Bulk Upload', true)}>
                                                        <i className="pi pi-upload"></i> Bulk Upload
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
                <SimpleModal
                    title={title}
                    visible={visible}
                    setVisible={() => setVisible(false)}
                    body={<UpdateAttendance setVisible={() => setVisible(false)} attendanceValues={attendanceValues} fetchAll={() => fetchAllAttendance('')} />}
                ></SimpleModal>
                <SimpleModal
                    title={title}
                    visible={bulkUploadModal}
                    setVisible={() => openBulkUploadModal(false)}
                    body={<AttendanceBulkUpload setVisible={() => setbulkUploadModal(false)} fetchAllAttendance={() => fetchAllAttendance('')} />}
                ></SimpleModal>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Check In</th>
                                    <th scope="col">Check Out</th>
                                    <th scope="col">Attendance Status</th>
                                    <th scope="col">Checkout By</th>
                                    <th scope="col">Checkin Status</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceList && attendanceList?.length > 0 ? (
                                    attendanceList?.map((attendance, index) => (
                                        <tr key={`key-${index}`}>
                                            <th scope="row">
                                                {attendance?.createdBy?.firstName ? attendance?.createdBy?.firstName : null}&nbsp;{attendance?.createdBy?.middleName ? attendance?.createdBy?.middleName : null}&nbsp;
                                                {attendance?.createdBy?.lastName ? attendance?.createdBy?.lastName : null}
                                            </th>
                                            <th>{attendance?.attendanceDate ? moment(attendance?.attendanceDate).format('DD-MM-YYYY') : 'N/A'}</th>
                                            <td>{attendance?.startTime ? convertUTCToLocalTime(attendance?.startTime) : 'N/A'}</td>
                                            <td>{attendance?.endTime ? convertUTCToLocalTime(attendance?.endTime) : 'N/A'}</td>
                                            <td>{attendance?.attendanceStatus || 'N/A'}</td>
                                            <td>{attendance?.checkOutBy || 'N/A'}</td>
                                            <td>{attendance?.checkinStatus || 'N/A'}</td>
                                            {/* //// comment
                                            <td>{secondsToMinute(dateToSeconds(attendance?.startTime, attendance?.endTime))}</td>
                                            //// comment */}
                                            <td>
                                                <button className="btn btn-primary" type="button" onClick={() => openModal('Update Attendance', true, attendance)}>
                                                    <i className="pi pi-pencil"></i>
                                                </button>
                                            </td>
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
                        {totalAttendance > 10 ? (
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

export default AttendanceScreen;
