import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from "moment";
import TokenService from '../../redux/services/token.service';
import { holidaySchema } from '../../redux/helpers/validations';
import { HolidayListService } from '../../redux/services/feathers/rest.app';
import { getUser } from '../../redux/helpers/user';

const AddDesignation = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [holidayValues, setHolidayValues] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHolidayValues({ ...holidayValues, [name]: value });
    };

    const addUpdateHoliday = (values) => {
        if (userData?.user?.companyId) {
            if (props?.holidayValues !== null) {
                const data = {
                    attendanceDate: new Date(values?.attendanceDate),
                    note: values?.note
                };
                setLoader(true);
                HolidayListService.patch(
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
                        toast.success('Occasion updated successfully.');
                        props?.setVisible();
                        props?.fetchAllHolidays();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            } else {
                const data = values;
                Object.assign(data, { companyId: userData?.user?.companyId });
                setLoader(true);
                HolidayListService.create(
                    { ...data },
                    {
                        headers: {
                            Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                        }
                    }
                )
                    .then((res) => {
                        setLoader(false);
                        toast.success('Occasion created successfully.');
                        props?.setVisible();
                        props?.fetchAllHolidays();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            }
        }
    };

    useEffect(() => {
        if (props?.holidayValues !== null) {
            const data = {
                _id: props?.holidayValues?._id
            };
            if (props?.holidayValues?.attendanceDate) {
                data['attendanceDate'] = moment(props?.holidayValues?.attendanceDate).format("YYYY-MM-DD");
            }
            if (props?.holidayValues?.note) {
                data['note'] = props?.holidayValues?.note;
            }
            setHolidayValues({ ...holidayValues, ...data });
        }
    }, []);

    return (
        <Formik enableReinitialize initialValues={holidayValues} validationSchema={holidaySchema} onSubmit={addUpdateHoliday}>
            {({ errors, touched }) => (
                <Form>
                    <div className="">
                        <div className="">
                            <div className="mb-2 ml_label">
                                <label htmlFor="note" className="form-label">
                                    Occasion type*
                                </label>
                                <Field type="text" className="form-control pt-2" name="note" onKeyUp={handleChange} />
                                {errors.note && touched.note ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.note}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="attendanceDate" className="form-label">
                                    Date*
                                </label>
                                <Field type="date" className="form-control pt-2" name="attendanceDate" id="attendanceDate" onKeyUp={handleChange} />
                                {errors.attendanceDate && touched.attendanceDate ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.attendanceDate}</small>
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

export default AddDesignation;
