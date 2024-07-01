import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { companyShiftSchema } from '../../redux/helpers/validations';
import { SalaryComponentService, PayComponentsService, CompanyShiftsService } from '../../redux/services/feathers/rest.app';
import { componentSchema } from '../../redux/helpers/validations';
import { getUser } from '../../redux/helpers/user';
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];
const AddCompanyShift = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [companyShiftList, setCompanyShiftList] = useState([]);
    const [componentValues, setComponentValues] = useState({
        name: '',
        companyId: '',
        startTime: '',
        endTime: '',
        breakStartTime: '',
        breakEndTime: '',
        minimumHalfDayHR: '',
        minimumFullDayHR: '',
        checkInAllowanceTime:'',
        graceTime:''
    });
    const [selectedDays, setSelectedDays] = useState([
        { weeklyOffDay: '', dayType: '' } // Example initial data
    ]); // Initial selected day

    const addDay = () => {
        setSelectedDays([...selectedDays, { weeklyOffDay: '', dayType: '' }]);
    };

    const removeDay = (index) => {
        const updatedDays = [...selectedDays];
        updatedDays.splice(index, 1);
        setSelectedDays(updatedDays);
    };
    const handleDayChange = (index, field, value) => {
        const updatedDays = [...selectedDays];
        updatedDays[index][field] = value;
        setSelectedDays(updatedDays);
    };
    const fetchCompanyShifts = () => {
        const queryData = {
            $sort: { createdAt: -1 },
            companyId: userData?.user?.companyId
        };
        CompanyShiftsService.find({
            query: queryData,
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            },
            query: {
                companyId: userData?.user?.companyId
            }
        })
            .then((res) => {
                setCompanyShiftList(res?.data);
            })
            .catch((error) => {
                toast.error(error, toastSettings);
            });
    };
    const getDateWithTime = (time) => {
        const currentDate = new Date();

        // Extract the year, month, and day from the current date
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // Note: Months are 0-indexed (January is 0, February is 1, etc.)
        const day = currentDate.getDate();

        // Create a new Date object with the extracted date and the time "22:46"
        const timeString = time;
        const [hours, minutes] = timeString.split(':');
        const newDate = new Date(year, month, day, hours, minutes);
        return newDate;
    };

    const addUpdateComponent = (values) => {
        const data = {
            companyId: userData?.user?.companyId,
            name: values?.name,
            startTime: getDateWithTime(values?.startTime),
            endTime: getDateWithTime(values?.endTime),
            breakStartTime: getDateWithTime(values?.breakStartTime),
            breakEndTime:  getDateWithTime(values?.breakEndTime),
            minimumHalfDayHR: values?.minimumHalfDayHR,
            minimumFullDayHR: values?.minimumFullDayHR,
            graceTime: values?.graceTime,
            checkInAllowanceTime: values?.checkInAllowanceTime,
            weeklyOff :selectedDays
        };
        if (userData?.user?.companyId) {
            if (props?.companyShiftValues !== null) {
                setLoader(true);
                CompanyShiftsService.patch(
                    values?._id,
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
                        setLoader(false);
                        toast.success('Component updated successfully.');
                        props?.setVisible();
                        props?.fetchAllCompanyShifts();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            } else {
                const comapanyShiftData = data;
                // Object.assign(comapanyShiftData, { companyId: userData?.user?.companyId });
                setLoader(true);
                CompanyShiftsService.create(
                    { ...comapanyShiftData },
                    {
                        headers: {
                            Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                        }
                    }
                )
                    .then((res) => {
                        setLoader(false);
                        toast.success('Component created successfully.');
                        props?.setVisible();
                        props?.fetchAllCompanyShifts();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            }
        }
    };

    useEffect(() => {
        fetchCompanyShifts();
        if (props?.companyShiftValues !== null) {
            const updatedComponentValues = {
                ...props.companyShiftValues,
                companyId: props.companyShiftValues.companyId
            };
            setComponentValues(updatedComponentValues);
            if(props?.companyShiftValues?.weeklyOff){
            setSelectedDays(props?.companyShiftValues?.weeklyOff)
            }
        }
    }, []);

    return (
        <Formik enableReinitialize initialValues={componentValues} validationSchema={companyShiftSchema} onSubmit={addUpdateComponent}>
            {({ values, errors, touched }) => (
                <Form>
                    <div>
                        <div className="row">
                            <div className="col-md-12">
                                <label htmlFor="name" className="form-label w-100">
                                Shift Name*
                                    <Field type="text" name="name" id="name" className="form-control" />
                                    <ErrorMessage name="name" component="div" className="error" />
                                </label>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="startTime" className="form-label w-100">
                                    Start Time*
                                    <Field type="time" name="startTime" id="startTime" className="form-control" />
                                    <ErrorMessage name="startTime" component="div" className="error" />
                                </label>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="endTime" className="form-label w-100">
                                    End Time*
                                    <Field type="time" name="endTime" id="endTime" className="form-control" />
                                    <ErrorMessage name="endTime" component="div" className="error" />
                                </label>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="breakStartTime" className="form-label w-100">
                                    Break Start Time*
                                    <Field type="time" name="breakStartTime" id="breakStartTime" className="form-control" />
                                    <ErrorMessage name="breakStartTime" component="div" className="error" />
                                </label>
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="breakEndTime" className="form-label w-100">
                                    Break End Time*
                                    <Field type="time" name="breakEndTime" id="breakEndTime" className="form-control" />
                                    <ErrorMessage name="breakEndTime" component="div" className="error" />
                                </label>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="minimumHalfDayHR" className="form-label w-100">
                                    Minimum Half Day Hour(min.)*
                                    <Field type="number" min="1" name="minimumHalfDayHR" id="minimumHalfDayHR" className="form-control" />
                                    <ErrorMessage name="minimumHalfDayHR" component="div" className="error" />
                                </label>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="minimumFullDayHR" className="form-label w-100">
                                    Minimum Full Day Hour(min.)*
                                    <Field type="number" min="1" name="minimumFullDayHR" id="minimumFullDayHR" className="form-control" />
                                    <ErrorMessage name="minimumFullDayHR" component="div" className="error" />
                                </label>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="checkInAllowanceTime" className="form-label w-100">
                                    Check-In Allowance(min.)
                                    <Field type="number" min="1" name="checkInAllowanceTime" id="checkInAllowanceTime" className="form-control" />
                                </label>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="graceTime" className="form-label w-100">
                                Grace Time for Late Arrival(min.)
                                    <Field type="number" min="1" name="graceTime" id="graceTime" className="form-control" />
                                </label>
                            </div>
                            <div className="col-md-12 mt-2">
                                <h6 className="text-primary">Weekly Off Configuration</h6>
                            </div>
                            {selectedDays.map((day, index) => (
                                <div key={index} className="row col-md-12">
                                    <div className="col-md-5">
                                        <label htmlFor={`breakEndTime-${index}`} className="form-label w-100">
                                            Day
                                            <Field as="select" name={`day-${index}`} id={`day-${index}`} className="form-control" value={day.weeklyOffDay} onChange={(e) => handleDayChange(index, 'weeklyOffDay', e.target.value)}>
                                                <option value="" disabled>
                                                    Select
                                                </option>{' '}
                                                {days.map((optionDay) => (
                                                    <option key={optionDay} value={optionDay} disabled={selectedDays.some((selectedDay) => selectedDay.weeklyOffDay === optionDay)}>
                                                        {optionDay}
                                                    </option>
                                                ))}
                                            </Field>
                                        </label>
                                    </div>
                                    <div className="col-md-5">
                                        <label htmlFor={`dayType-${index}`} className="form-label w-100">
                                            Day Type
                                            <Field as="select" name={`dayType-${index}`} id={`dayType-${index}`} className="form-control" onChange={(e) => handleDayChange(index, 'dayType', e.target.value)} value={day.dayType}>
                                                <option value="" disabled>
                                                    Select
                                                </option>
                                                <option value="halfDay">Half Day</option>
                                                <option value="fullDay">Full Day</option>
                                                {/* Add more custom options here */}
                                            </Field>
                                        </label>
                                    </div>
                                    <div className="col-md-2">
                                        {index > 0 ? (
                                            <div>
                                                <button type="button" className="btn btn-primary btn-sm mt-4 more-btn" onClick={() => removeDay(index)}>
                                                    <i class=" pi pi-fw pi pi-fw pi-trash"></i>
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <button type="button" className="btn btn-primary btn-sm mt-4 more-btn" onClick={addDay}>
                                                    <i class=" pi pi-fw pi pi-fw pi-plus"></i>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <button className="btn btn-primary" type="submit">
                                Submit
                            </button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default AddCompanyShift;
