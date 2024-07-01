import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { updateAttendanceSchema } from '../../redux/helpers/validations';
import { AttendanceService } from '../../redux/services/feathers/rest.app';
import { convertUTCTo24HourTime, convertTimeToUTC } from '../../redux/helpers/dateHelper';

const UpdateAttendance = (props) => {
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [attendanceValues, setAttendanceValues] = useState({});

    const updateAttandance = (values) => {
        if (props?.attendanceValues !== null) {
            const data = {
                attendanceDate: new Date(values?.attendanceDate),
                startTime: convertTimeToUTC(values?.startTime),
                endTime: convertTimeToUTC(values?.endTime),
                attendanceStatus: values?.attendanceStatus
            };
            setLoader(true);
            AttendanceService.patch(
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
                    toast.success('Attendance updated successfully.');
                    props?.setVisible();
                    props?.fetchAll();
                })
                .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
        }
    };

    useEffect(() => {
        if (props?.attendanceValues !== null) {
            const data = {
                _id: props?.attendanceValues?._id
            };
            if (props?.attendanceValues?.attendanceDate) {
                data['attendanceDate'] = moment(props?.attendanceValues?.attendanceDate).format('YYYY-MM-DD');
            }
            if (props?.attendanceValues?.startTime) {
                data['startTime'] = convertUTCTo24HourTime(props?.attendanceValues?.startTime);
            }
            if (props?.attendanceValues?.endTime) {
                data['endTime'] = convertUTCTo24HourTime(props?.attendanceValues?.endTime);
            }
            if (props?.attendanceValues?.attendanceStatus) {
                data['attendanceStatus'] = props?.attendanceValues?.attendanceStatus;
            }
            setAttendanceValues({ ...attendanceValues, ...data });
        }
    }, []);

    return (
        <Formik enableReinitialize initialValues={attendanceValues} validationSchema={updateAttendanceSchema} onSubmit={updateAttandance}>
            {({ errors, touched }) => (
                <Form>
                    <div className="">
                        <div className="">
                            <div className="mb-2 ml_label">
                                <label htmlFor="attendanceDate" className="form-label">
                                    Date*
                                </label>
                                {props?.attendanceValues !== null ? (
                                    <>
                                        <Field name="attendanceDate" type="date" placeholder="Start Date" className="form-control" disabled />
                                    </>
                                ) : (
                                    <>
                                        <Field name="attendanceDate" type="date" placeholder="Start Date" className="form-control" />
                                        {errors.attendanceDate && touched.attendanceDate ? (
                                            <p className="text-danger text-monospace mt-2">
                                                <small>{errors.attendanceDate}</small>
                                            </p>
                                        ) : null}
                                    </>
                                )}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="startTime" className="form-label">
                                    Check In*
                                </label>
                                <Field name="startTime" type="time" placeholder="Start Date" className="form-control" />
                                {errors.startTime && touched.startTime ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.startTime}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="endTime" className="form-label">
                                    Check Out*
                                </label>
                                <Field name="endTime" type="time" placeholder="End Date" className="form-control" />
                                {errors.endTime && touched.endTime ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.endTime}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="attendanceStatus" className="form-label">
                                    Attendance Status*
                                </label>
                                <Field name="attendanceStatus" as="select" className="form-control pt-2">
                                    <option value="">-Select-</option>
                                    {[
                                        { label: 'Half Day', value: 'halfDay' },
                                        { label: 'Full Day', value: 'fullDay' },
                                        { label: 'Absent', value: 'absent' },
                                        { label: 'Active', value: 'active' },
                                        { label: 'Unapproved', value: 'unapproved' }
                                    ].map(({ label, value }) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </Field>
                                {errors.attendanceStatus && touched.attendanceStatus ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.attendanceStatus}</small>
                                    </p>
                                ) : null}
                            </div>
                        </div>
                        <div>
                            <button className="btn btn-success" type="submit">
                                Submit
                            </button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default UpdateAttendance;
