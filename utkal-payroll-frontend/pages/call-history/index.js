import 'react-daterange-picker/dist/css/react-calendar.css';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import DateRangePicker from 'react-daterange-picker';
import ReactPaginate from 'react-paginate';
import originalMoment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(originalMoment);
import { toast } from 'react-toastify';
import { userActions } from '../../redux/actions/user.actions';
import { secondsToMinute, convertUTCToITC24HourTime } from '../../redux/helpers/dateHelper';
import { UserService, CallHistoryService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';

const CompanyScreen = () => {
    const dispatch = useDispatch();
    // const callHistoryList = useSelector((state) => state?.user?.all_users?.data);
    const [page, setPage] = useState(1);
    const [isRangePickerOpen, setIsRangePickerOpen] = useState(false);
    const [rangeValues, setRangeValues] = useState({});
    const [formData, setFormData] = useState({
        employeename: '',
        phoneNumber: ''
    });
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [loader, setLoader] = useState(false);
    const [callHistoryList, setCallHistoryList] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [totalCallHistory, setTotalCallHistory] = useState(0);
    const [visibleUsersDropdown, setVisibleUsersDropdown] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [userValues, setUserValues] = useState({});
    const [filterFormData, setFilterFormData] = useState({});

    const getCallHistory = async (val) => {
        setLoader(true);
        const queryData = {
            $skip: offset,
            $limit: perPage,
            $sort: { dateTime: -1 },
            $populate: ['createdBy']
        };
        const data = {};
        const filterQueryData = {};
        const datetime = {
            $gte: new Date(rangeValues.startDate).getTime(),
            $lte: new Date(moment(rangeValues.endDate).add(1, 'days')).getTime()
        };
        if (rangeValues.startDate) {
            data['dateTime'] = datetime;
        }
        if (userValues?._id) {
            data['createdBy'] = userValues?._id;
        }
        if (val !== '') {
            filterQueryData = {
                $skip: offset,
                $limit: perPage,
                $sort: { dateTime: -1 },
                $populate: ['createdBy'],
                ...data
            };
        }
        
        await CallHistoryService.find({
            query: val == '' ? queryData : filterQueryData,
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                setCallHistoryList(res.data);
                setPageCount(Math.ceil(res.total / perPage));
                setTotalCallHistory(res.total);
            })
            .catch((error) => {
                setLoader(false);
            });
    };

    const getAllUser = async (value) => {
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
                $sort: { createdAt: -1 }
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

    const fetchCallHistory = async () => {
        getCallHistory(Object.keys(filterFormData).length === 0 ? '' : filterFormData);
    };
    const selectRange = (value) => {
        setRangeValues({ ...rangeValues, startDate: value.start['_i'], endDate: value.end['_i'] });
        setIsRangePickerOpen(false);
    };

    const openRangePicker = () => {
        setIsRangePickerOpen(!isRangePickerOpen);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'employeename') {
            getAllUser(value);
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

    const filterCallHistory = (values) => {
        setOffset(0);
        setFilterFormData(values);
        getCallHistory(values);
    };

    useEffect(() => {
        fetchCallHistory();
    }, [offset]);

    return (
        <div className="page-wrapper">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-3">
                            <h3 className="page-title">Call History</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Employee</a>
                                </li>
                                <li className="breadcrumb-item active">Call Details</li>
                            </ul>
                        </div>
                        <div className="col-md-9">
                            <div className="d-flex justify-content-end">
                                <div className="d-inline-block report_filter_form">
                                    <Formik
                                        enableReinitialize
                                        initialValues={rangeValues}
                                        onSubmit={(values, event) => {
                                            filterCallHistory(values);
                                        }}
                                    >
                                        {({ values, errors, touched, setFieldTouched, setFieldValue }) => (
                                            <Form autoComplete="off">
                                                <div className="form_sec d-inline-block">
                                                    <div className="row justify-content-end mr-2 mt-4">
                                                        <div className="col-6">
                                                            <div className="form-group">
                                                                <div className="calnder_report_filter_sec w-100">
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
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-5">
                                                            <div className="form-group">
                                                                <Field type="text" placeholder="Enter user name/phone" className="form-control" name="employeename" id="employeename" onKeyUp={handleChange} />

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
                                                        <div className="col-1">
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
                        <table className="table table-bordered table-hover">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Created By</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Duration</th>
                                    <th scope="col">Phone Number</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Date & Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {callHistoryList && callHistoryList?.length > 0 ? (
                                    callHistoryList?.map((user, index) => (
                                        <tr key={`key-${index}`}>
                                            <th scope="row">{`${user?.createdBy?.firstName} ${user?.createdBy?.lastName}` || 'N/A'}</th>
                                            <td>{user?.name || 'N/A'}</td>
                                            <td>{user?.duration ? secondsToMinute(user?.duration) : "N/A"}</td>
                                            <td>{user?.phoneNumber || "N/A"}</td>
                                            <td>{user?.type || "N/A"}</td>
                                            <td>{user?.dateTime ? moment(user?.dateTime).utc().format('MMMM Do YYYY, h:mm:ss a') : "N/A"}</td>
                                            {/* {moment(user?.dateTime, 'ddd DD-MMM-YYYY, hh:mm A').format('hh:mm A')} */}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7}>
                                            <div className="alert alert-success text-center" role="alert">
                                                Call history not found!!!
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {totalCallHistory > 10 ? (
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

export default CompanyScreen;
