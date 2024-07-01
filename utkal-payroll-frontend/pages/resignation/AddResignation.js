import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { addResignationSchema } from '../../redux/helpers/validations';
import { ResignationService, ResignationTypeService } from '../../redux/services/feathers/rest.app';
import { getUser } from '../../redux/helpers/user';

const AddReimbursement = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [resignationValues, setResignationValues] = useState({});
    const [visibleUsersDropdown, setVisibleUsersDropdown] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [managerName, setManagerName] = useState('');
    const [userValues, setUserValues] = useState(null);
    const [userId, setUserId] = useState('');
    const [resignationTypeList, setResignationTypeList] = useState([]);
    const [totalResignationType, setTotalResignationType] = useState(0);
    const [offerLetterValues, setOfferLetterValues] = useState({});
    const [extensionError, setExtensionError] = useState('');

    const fetchResignationType = () => {
        if (userData?.user?.companyId) {
            setIsLoading(true);
            ResignationTypeService.find({
                query: { companyId: userData?.user?.companyId, $sort: { createdAt: -1 } },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setIsLoading(false);
                    setResignationTypeList(res.data);
                    setTotalResignationType(res.total);
                })
                .catch((error) => {
                    setIsLoading(false);
                });
        }
    };

    const addUpdate = (values) => {
        if (props?.resignationValues !== null) {
            const data = {
                resignationType: values?.resignationType,
                resignDate: values?.resignDate,
                lastWorkingDate: values?.lastWorkingDate
            };
            data['approvalStatus'] = 'approved';
            if (values?.cause || values?.cause !== '') {
                data['cause'] = values?.cause;
            }
            setIsLoading(true);
            ResignationService.patch(
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
                    toast.success('Resignation updated successfully.');
                    props?.setVisible();
                    props?.fetchAll();
                })
                .catch((error) => {
                    setIsLoading(false);
                    toast.error(error.message);
                });
        }
    };

    useEffect(() => {
        fetchResignationType();
        // console.log(props?.resignationValues, '::::::::::::;props?.resignationValues');
        if (props?.resignationValues !== null) {
            const data = {
                resignationType: props?.resignationValues?.resignationType?._id ? props?.resignationValues?.resignationType?._id : null,
                cause: props?.resignationValues?.cause ? props?.resignationValues?.cause : '',
                resignDate: props?.resignationValues?.resignDate ? moment(props?.resignationValues?.resignDate).format('YYYY-MM-DD') : null,
                lastWorkingDate: props?.resignationValues?.lastWorkingDate ? moment(props?.resignationValues?.lastWorkingDate).format('YYYY-MM-DD') : null
            };
            setUserId(props?.resignationValues?._id);
            setResignationValues({ ...resignationValues, ...data });
        }
    }, []);

    return (
        <Formik
            enableReinitialize
            initialValues={resignationValues}
            validationSchema={addResignationSchema}
            onSubmit={(values, event) => {
                addUpdate(values);
            }}
        >
            {({ values, errors, touched, setFieldTouched, setFieldValue }) => (
                <Form>
                    <div className="">
                        <div className="">
                            <div className="mb-2 ml_label">
                                <label htmlFor="resignationType" className="form-label">
                                    Reason of Resignation*
                                </label>
                                <Field name="resignationType" id="resignationType" as="select" className="form-control pt-2">
                                    <option value="">-Select-</option>
                                    {resignationTypeList && resignationTypeList.length > 0
                                        ? resignationTypeList?.map((data, index) => (
                                              <option key={data?._id} value={data?._id}>
                                                  {data?.name}
                                              </option>
                                          ))
                                        : null}
                                </Field>
                                {errors.resignationType && touched.resignationType ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.resignationType}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="resignDate" className="form-label">
                                    Resign Date*
                                </label>
                                <Field type="date" className="form-control pt-2" name="resignDate" id="resignDate" />
                                {errors.resignDate && touched.resignDate ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.resignDate}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="lastWorkingDate" className="form-label">
                                    LastWorking Date*
                                </label>
                                <Field type="date" className="form-control pt-2" name="lastWorkingDate" id="lastWorkingDate" />
                                {errors.lastWorkingDate && touched.lastWorkingDate ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.lastWorkingDate}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="cause" className="form-label">
                                    Detail
                                </label>
                                <Field type="text" className="form-control pt-2" name="cause" id="cause" />
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
