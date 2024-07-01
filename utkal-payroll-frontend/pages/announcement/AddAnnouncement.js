import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { announcementSchema } from '../../redux/helpers/validations';
import { AnnouncementService } from '../../redux/services/feathers/rest.app';
import { getUser } from '../../redux/helpers/user';

const AddAnnouncement = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [announcementValues, setannouncementValues] = useState({
        announcementDate: '',
        note: '',
      
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setannouncementValues({ ...announcementValues, [name]: value });
    };

    const addUpdateAnnouncement111 = (values) => {
        if (userData?.user?.companyId) {
            if (props?.announcementValues !== null) {
                const data = {
                    note: values?.note,
                    announcementDate: values?.announcementDate
                };
                setLoader(true);
                AnnouncementService.patch(
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
                        toast.success('Announcement updated successfully.');
                        props?.setVisible();
                        props?.fetchAllAnnouncement();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            } else {
                const data = values;
                Object.assign(data, {companyId: userData?.user?.companyId});
                setLoader(true);
                AnnouncementService.create(
                    { ...data },
                    {
                        headers: {
                            Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                        }
                    }
                )
                    .then((res) => {
                        setLoader(false);
                        toast.success('Announcement created successfully.');
                        props?.setVisible();
                        props?.fetchAllAnnouncement();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            }
        }
    };

    useEffect(() => {
        if (props?.fetchAllAnnouncement !== null) {
            setannouncementValues({ ...announcementValues, ...props?.announcementValues });
        }
    }, []);

    return (
        <Formik enableReinitialize initialValues={announcementValues} validationSchema={announcementSchema} onSubmit={addUpdateAnnouncement111}>
            {({ errors, touched }) => (
                <Form>
                    <div className="">
                        <div className="">
                        <div className="mb-2 ml_label">
                                <label htmlFor="announcementDate" className="form-label">
                                Date*
                                </label>
                                <Field type="date" className="form-control pt-2" name="announcementDate" id="announcementDate"/>
                                <ErrorMessage name="announcementDate" component="div" className="error" />
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="note" className="form-label">
                                Announcement Note*
                                </label>
                                <Field type="text" className="form-control pt-2" name="note" id="note" />
                                <ErrorMessage name="note" component="div" className="error" />
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

export default AddAnnouncement;
