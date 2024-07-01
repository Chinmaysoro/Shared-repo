import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { uploadPayslipSchema } from '../../redux/helpers/validations';
import { PayslipService, UploadService } from '../../redux/services/feathers/rest.app';
import { getYearList, getMonthList } from '../../redux/helpers/dateHelper';
import { getUser } from '../../redux/helpers/user';

const AddPayroll = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [payrollValues, setPayrollValues] = useState({});
    const [yearList, setYearList] = useState([]);
    const [monthList, setMonthList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState('');
    const [documentId, setDocumentId] = useState('');
    const [extensionError, setExtensionError] = useState('');
    const [offerLetterValues, setOfferLetterValues] = useState({});

    const addUpdate = (values) => {
        if (userData?.user?.companyId) {
            if (props?.payrollValues !== null) {
                const data = {
                    userId: userId,
                    year: values?.yearname,
                    month: values?.monthname
                };
                if (values?.document !== '' || values?.document !== undefined) {
                    data['document'] = offerLetterValues.offerLink;
                }
                setIsLoading(true);
                PayslipService.patch(
                    documentId,
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
                        setIsLoading(false);
                        toast.success('Payroll updated successfully.');
                        props?.setVisible();
                        props?.fetchDocumentList(userId);
                    })
                    .catch((error) => {
                        setIsLoading(false);
                        toast.error(error.message);
                    });
            } else {
                const data = {
                    userId: userId,
                    year: values?.yearname,
                    month: values?.monthname
                };
                if (values?.document !== '' || values?.document !== undefined) {
                    data['document'] = offerLetterValues.offerLink;
                }
                const payRollData = data;
                Object.assign(payRollData, { companyId: userData?.user?.companyId });
                setIsLoading(true);
                PayslipService.create(
                    {
                        ...payRollData
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                        }
                    }
                )
                    .then((res) => {
                        setIsLoading(false);
                        toast.success('Payroll created successfully.');
                        props?.setVisible();
                        props?.fetchDocumentList(userId);
                    })
                    .catch((error) => {
                        setIsLoading(false);
                        toast.error(error.message);
                    });
            }
        }
    };

    const handleFileInput = (e) => {
        setExtensionError('');
        const file = e.target.files[0];
        const fileName = file.name.replace(/ /g, '_');
        const fileExtension = fileName.split('.').pop();
        if (fileExtension === 'pdf' || fileExtension === 'PDF' || fileExtension === 'jpg' || fileExtension === 'JPG' || fileExtension === 'jpeg' || fileExtension === 'JPEG' || fileExtension === 'png' || fileExtension === 'PNG') {
            let formData = new FormData();
            formData.append('uri', file);
            setIsLoading(true);
            UploadService.create(formData, {
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`,
                    'content-type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setIsLoading(false);
                    setOfferLetterValues({
                        ...offerLetterValues,
                        ['offerLink']: res.originalName
                    });
                })
                .catch((error) => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
            setExtensionError('Currently only pdf, jpg and png file are allowed.');
        }
    };

    const fetchData = async () => {
        const years = getYearList();
        const months = getMonthList();
        setYearList(years);
        setMonthList(months);
        const location = window?.location?.pathname;
        const locationarr = location?.split('/');
        setUserId(locationarr[2]);
    };

    useEffect(() => {
        fetchData();
        if (props?.payrollValues !== null) {
            const values = {
                yearname: props?.payrollValues?.year,
                monthname: props?.payrollValues?.month
            };
            setPayrollValues({ ...payrollValues, ...values });
            setDocumentId(props?.payrollValues?._id);
        }
    }, []);

    return (
        <Formik
            enableReinitialize
            initialValues={payrollValues}
            validationSchema={uploadPayslipSchema}
            onSubmit={(values, event) => {
                addUpdate(values, event);
            }}
        >
            {({ values, errors, touched }) => (
                <Form>
                    <div className="">
                        <div className="">
                            <div className="mb-2 ml_label">
                                <label htmlFor="yearname" className="form-label">
                                    Year*
                                </label>
                                <Field name="yearname" id="yearname" as="select" className="form-control pt-2">
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
                            <div className="mb-2 ml_label">
                                <label htmlFor="monthname" className="form-label">
                                    Month*
                                </label>
                                <Field name="monthname" id="monthname" as="select" className="form-control pt-2">
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
                            <div className="mb-2 ml_label">
                                <label htmlFor="type" className="form-label">
                                    Document* {isLoading ? <i className="pi pi-spin pi-spinner" style={{ fontSize: '1rem' }}></i> : null}
                                </label>
                                <Field type="file" className="form-control " name="document" id="document" onChange={handleFileInput} accept="image/*,.pdf" />
                                {extensionError ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{extensionError}</small>
                                    </p>
                                ) : null}
                                <Field type="text" name="offerLink" id="offerLink" style={{ display: 'none' }} accept="image/*,.pdf" />
                            </div>
                        </div>
                        <div>
                            <button className="btn btn-primary" type="submit" disabled={isLoading}>
                                Upload
                            </button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default AddPayroll;
