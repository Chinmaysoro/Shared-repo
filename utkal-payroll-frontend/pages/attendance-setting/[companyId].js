import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { toast, toastSettings } from 'react-toastify';
import moment from 'moment';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { uploadPayslipSchema } from '../../redux/helpers/validations';
import { getYearList, getMonthList } from '../../redux/helpers/dateHelper';
import { PayslipService, UploadService, CompanyService, UserService, CompanyShiftsService, PayGroupService, PayComponentsService } from '../../redux/services/feathers/rest.app';
import SimpleModal from '../components/Modal';
import AddCompanyShift from './AddCompanyShift';
import { getUser } from '../../redux/helpers/user';

const UpdateCompanyShift = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [companyShiftValues, setCompanyShiftValues] = useState({});
    const [componentValues, setComponentValues] = useState({});
    const [parentPayGroupId, setParentPayGroupId] = useState('');
    const [yearList, setYearList] = useState([]);
    const [monthList, setMonthList] = useState([]);
    const [documentLoader, setDocumentLoader] = useState(false);
    const [documentList, setDocumentList] = useState([]);
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [paygroupDetail, setPayGroupDetail] = useState([]);
    const [companyId, setParentCompanyId] = useState("");
    const [companyShifts, setCompanyShift] = useState([]);
    const [totalCompanyShifts, setTotalCompanyShifts] = useState(0);
    const [componentList, setComponentList] = useState([]);
    const [totalComponent, setTotalComponent] = useState(0);
    const [loader, setLoader] = useState(false);
    const openModal = (type, val, dept) => {
        if (dept != null) {
            const formattedDept = { ...dept }; // Create a new object to avoid modifying the original object
            formattedDept.startTime = formatTime1(dept?.startTime);
            formattedDept.endTime = formatTime1(dept?.endTime);
            formattedDept.breakStartTime = formatTime1(dept?.breakStartTime);
            formattedDept.breakEndTime = formatTime1(dept?.breakEndTime);
            setVisible(val);
            setTitle(type);
            setCompanyShiftValues(formattedDept);
        } else {
            setVisible(val);
            setTitle(type);
            setCompanyShiftValues(dept);
        }

    };
    const fetchCompanyShifts = (companyId) => {
        if (userData?.user?.companyId) {
            CompanyShiftsService.find({
                query: {
                    companyId: companyId,
                    $sort: { createdAt: -1 }
                },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setCompanyShift(res?.data);
                    setTotalCompanyShifts(res?.total);
                })
                .catch((error) => {
                    toast.error(error, toastSettings);
                });
        }
    };

    const fetchData = () => {
        const location = window?.location?.pathname;
        const locationarr = location?.split('/');
        setParentCompanyId(locationarr[2]);
        fetchCompanyShifts(locationarr[2]);
    };
    const formatTime = (inputDateString) => {
        // Create a Date object from the input date string
        const date = new Date(inputDateString);
        // Get hours and minutes from the Date object
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const amOrPm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour time format
        const formattedMinutes = minutes.toString().padStart(2, "0"); // Ensure two-digit minutes
        return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
    }
    const formatTime1 = (dateString) => {
        const date = new Date(dateString);

        // Get the hours and minutes from the Date object
        const hours = date.getHours();
        const minutes = date.getMinutes();

        // Format the time as "HH:mm" (24-hour format)
        const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
        return formattedTime;
    }
    useEffect(() => {
        fetchData();
    }, []);

    const deleteCompanyShift = (values) => {
        // console.log(values, '::::::::::values');
        setLoader(true);
        CompanyShiftsService.remove(values?._id, {
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                toast.success('Company shift deleted successfully.');
                fetchData();
            })
            .catch((error) => {
                setLoader(false);
                toast.error(error?.message);
            });
    };

    return (
        <div className="container card">
            <div className="row justify-content-center mb-3">
                <div className="col-auto float-left w-100">
                    <h4>Company Shifts</h4>
                </div>
                <div className="col-auto float-right ml-auto mt-4" style={{ right: '7px' }}>
                    <button type="button" className="btn btn-primary" onClick={() => openModal('Add Company Shift', true, null)}>
                        <i className="pi pi-plus"></i> Add Company Shift
                    </button>
                </div>
            </div>
            <SimpleModal
                title={title}
                visible={visible}
                setVisible={() => setVisible(false)}
                body={<AddCompanyShift setVisible={() => setVisible(false)} companyShiftValues={companyShiftValues} fetchAllCompanyShifts={() => fetchCompanyShifts(companyId)} companyId={companyId} />}
            ></SimpleModal>

            <div className="row staff-grid-row">
                {companyShifts && companyShifts?.length > 0 ? (
                    companyShifts?.map((shift, index) => (
                        <div className='col-md-3'>
                            <div className='card c-shift-card p-0' key={`key-${index}`}>
                                <div className='c-shift-header cardView p-3'>
                                    <span className="emp_status_active">
                                        <img src={`${contextPath}/layout/images/active.svg`} alt="user Preview" /> Active
                                    </span>
                                    <div className="card-options" style={{ top: "6px" }}>
                                        <button className="options-button" key={`key-${index}`}>
                                            <span className="dot-menu">
                                                <i className="pi pi-ellipsis-v"></i>
                                            </span>
                                        </button>
                                        <div className="options-menu" key={`key-${index}`}>
                                            <button onClick={() => openModal('Update Company Shift', true, shift)}>  <i className="pi pi-pencil" style={{ marginRight: "4px" }}></i> Edit</button>
                                            <button onClick={() => deleteCompanyShift(shift)}> <i className="pi pi-trash" style={{ marginRight: "6px" }}></i>Delete</button>
                                        </div>
                                    </div>

                                </div>
                                <div className='c-shift-body text-white'>
                                    <div className='c-shift-inner pt-6 pb-5'>
                                        <h5 className='text-white mb-2'>{`${shift?.name}`}</h5>
                                        <small>{formatTime(shift?.startTime)} to {formatTime(shift?.endTime)}</small>
                                    </div>
                                </div>
                                <div className="clock-card">
                                    <img src={`${contextPath}/layout/images/clock.svg`} alt="user Preview" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="alert alert-success text-center w-100" role="alert">
                        No shift found!!!
                    </div>
                )}
                <div className="col-md-12 col-sm-12">
                    {totalCompanyShifts > 10 ? (
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
    );
};

export default UpdateCompanyShift;
