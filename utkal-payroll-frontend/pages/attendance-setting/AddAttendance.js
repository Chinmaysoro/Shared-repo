import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { companyAttendanceSchema } from '../../redux/helpers/validations';
import { CompanyService } from '../../redux/services/feathers/rest.app';
import { convertTimeToUTC, convertUTCToLocalTime, convertUTCTo24HourTime } from '../../redux/helpers/dateHelper';
import { getUser } from '../../redux/helpers/user';

const AddAttendance = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [companyValues, setCompanyValues] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompanyValues({ ...companyValues, [name]: value });
    };

    const addUpdateCompany = (values) => {
        if (props?.companyValues !== null) {
            const data = {};
            if (values?.dayStart) {
                data['dayStart'] = convertTimeToUTC(values?.dayStart);
            }
            if (values?.dayEnd) {
                data['dayEnd'] = convertTimeToUTC(values?.dayEnd);
            }
            if (values?.fullDay) {
                data['fullDay'] = values?.fullDay;
            }
            setLoader(true);
            CompanyService.patch(
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
                    props?.fetchAllCompany();
                })
                .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
        } else {
            toast.error('Please select company.');
        }
    };

    useEffect(() => {
        if (props?.companyValues !== null) {
            const data = {
                name: props?.companyValues?.name,
                _id: props?.companyValues?._id
            };
            
            if(props?.companyValues?.dayStart){
                data["dayStart"] = convertUTCTo24HourTime(props?.companyValues?.dayStart);
            }
            if(props?.companyValues?.dayEnd){
                data["dayEnd"] = convertUTCTo24HourTime(props?.companyValues?.dayEnd);
            }
            if (props?.companyValues?.fullDay) {
                data['fullDay'] = props?.companyValues?.fullDay;
            }
            setCompanyValues({ ...companyValues, ...data });
        }
    }, []);

    return (
        <Formik enableReinitialize initialValues={companyValues} validationSchema={companyAttendanceSchema} onSubmit={addUpdateCompany}>
            {({ errors, touched }) => (
                <Form>
                    <div className="">
                        <div className="">
                            <div className="mb-2 ml_label">
                                <label htmlFor="name" className="form-label">
                                    Company name*
                                </label>
                                <Field type="text" className="form-control pt-2" name="name" id="name" onKeyUp={handleChange} />
                                {errors.name && touched.name ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.name}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="dayStart" className="form-label">
                                    Start Time
                                </label>
                                <Field name="dayStart" type="time" placeholder="Start Date" className="form-control" />
                                {errors.dayStart && touched.dayStart ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.dayStart}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="dayEnd" className="form-label">
                                    End Time
                                </label>
                                <Field name="dayEnd" type="time" placeholder="End Date" className="form-control" />
                                {errors.dayEnd && touched.dayEnd ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.dayEnd}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="fullDay" className="form-label">
                                    Full Day
                                </label>
                                <Field name="fullDay" type="number" placeholder="Full Day ( Number of hours Ex : 8 )" className="form-control" min={0}/>
                                {errors.fullDay && touched.fullDay ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.fullDay}</small>
                                    </p>
                                ) : null}
                            </div>
                        </div>
                        <div>
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

export default AddAttendance;
