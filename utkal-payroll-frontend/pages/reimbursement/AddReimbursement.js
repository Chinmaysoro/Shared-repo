import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { addReimbursementSchema } from '../../redux/helpers/validations';
import { ReimbursementService, ReimbursementTypeService, UploadService } from '../../redux/services/feathers/rest.app';
import { getUser } from '../../redux/helpers/user';

const AddReimbursement = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [companyValues, setCompanyValues] = useState({});
    const [visibleUsersDropdown, setVisibleUsersDropdown] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [managerName, setManagerName] = useState('');
    const [userValues, setUserValues] = useState(null);
    const [userId, setUserId] = useState('');
    const [reimbursementTypeList, setReimbursementTypeList] = useState([]);
    const [totalReimbursementType, setTotalReimbursementType] = useState(0);
    const [offerLetterValues, setOfferLetterValues] = useState({});
    const [extensionError, setExtensionError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setManagerName(value);
        if (name === 'createdBy') {
            getAllUser(value);
        }
    };

    const fetchReimbursementType = () => {
        if (userData?.user?.companyId) {
            setIsLoading(true);
            ReimbursementTypeService.find({
                query: { companyId: userData?.user?.companyId, $sort: { createdAt: -1 } },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setIsLoading(false);
                    setReimbursementTypeList(res.data);
                    setTotalReimbursementType(res.total);
                })
                .catch((error) => {
                    setIsLoading(false);
                });
        }
    };

    const getAllUser = async (value) => {
        if (userData?.user?.companyId) {
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
                    $sort: { createdAt: -1 },
                    companyId: userData?.user?.companyId
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
                    console.log(error);
                });
        }
    };

    const addUpdate = (values) => {
        if (props?.companyValues !== null) {
            const data = {
                reimbursementType: values?.reimbursementType
            };
            data['approvalStatus'] = 'approved';
            if (values?.cause) {
                data['cause'] = values?.cause;
            }
            if (values?.document !== '' || values?.document !== undefined) {
                data['document'] = offerLetterValues.offerLink;
            }
            if (values?.amount) {
                data['amount'] = values?.amount;
            }
            setIsLoading(true);
            ReimbursementService.patch(
                userId,
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
                    toast.success('Reimbursement updated successfully.');
                    props?.setVisible();
                    props?.fetchAll();
                })
                .catch((error) => {
                    setIsLoading(false);
                    toast.error(error.message);
                });
        }
    };

    const setFormValues = (type, data) => {
        if (type === 'createdBy') {
            setUserValues(data);
            setVisibleUsersDropdown(false);
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

    useEffect(() => {
        fetchReimbursementType();
        if (props?.companyValues !== null) {
            const data = {
                reimbursementType: props?.companyValues?.reimbursementType?._id ? props?.companyValues?.reimbursementType?._id : null,
                cause: props?.companyValues?.cause ? props?.companyValues?.cause : '',
                amount: props?.companyValues?.amount ? props?.companyValues?.amount : 0
            };
            setUserId(props?.companyValues?._id);
            setCompanyValues({ ...companyValues, ...data });
        }
    }, []);

    return (
        <Formik
            enableReinitialize
            initialValues={companyValues}
            validationSchema={addReimbursementSchema}
            onSubmit={(values, event) => {
                addUpdate(values);
            }}
        >
            {({ values, errors, touched, setFieldTouched, setFieldValue }) => (
                <Form>
                    <div className="">
                        <div className="">
                            {/* <div className="mb-2 ml_label">
                                <label className="form-label">Employee name*</label>
                                <div className="form-group">
                                    <Field type="text" placeholder="Enter employee name" className="form-control" name="createdBy" id="createdBy" onKeyUp={handleChange} />
                                    {visibleUsersDropdown && allUsers.length > 0 ? (
                                        <ul className="t_ul" style={{ width: '95%' }}>
                                            {allUsers.map((user, index) => {
                                                return (
                                                    <li
                                                        key={`key-${index}`}
                                                        onClick={() => {
                                                            setFormValues('createdBy', user);
                                                            setFieldTouched('createdBy', true);
                                                            setFieldValue('createdBy', `${user?.firstName} ${user?.lastName}`);
                                                        }}
                                                    >
                                                        {`${user?.firstName} ${user?.lastName}`}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : null}
                                </div>
                            </div> */}
                            <div className="mb-2 ml_label">
                                <label htmlFor="reimbursementType" className="form-label">
                                    Reimbursement Type*
                                </label>
                                <Field name="reimbursementType" id="reimbursementType" as="select" className="form-control pt-2">
                                    <option value="">-Select-</option>
                                    {reimbursementTypeList && reimbursementTypeList.length > 0
                                        ? reimbursementTypeList?.map((data, index) => (
                                              <option key={data?._id} value={data?._id}>
                                                  {data?.name}
                                              </option>
                                          ))
                                        : null}
                                </Field>
                                {errors.reimbursementType && touched.reimbursementType ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.reimbursementType}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="amount" className="form-label">
                                    Amount*
                                </label>
                                <Field type="number" className="form-control pt-2" name="amount" id="amount" min={0} />
                                {errors.amount && touched.amount ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.amount}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="cause" className="form-label">
                                    Detail
                                </label>
                                <Field type="text" className="form-control pt-2" name="cause" id="cause" />
                            </div>

                            <div className="mb-2 ml_label">
                                <label htmlFor="type" className="form-label">
                                    Document {isLoading ? <i className="pi pi-spin pi-spinner" style={{ fontSize: '1rem' }}></i> : null}
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
                                Approve
                            </button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default AddReimbursement;
