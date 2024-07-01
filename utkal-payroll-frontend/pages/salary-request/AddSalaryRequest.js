import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import moment from 'moment';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { advanceSalarySchema } from '../../redux/helpers/validations';
import { AdvanceSalaryService, UserService } from '../../redux/services/feathers/rest.app';
import { getUser } from '../../redux/helpers/user';

const AddCompany = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({});
    const [visibleUsersDropdown, setVisibleUsersDropdown] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [managerName, setManagerName] = useState('');
    const [userValues, setUserValues] = useState(null);
    const [userId, setUserId] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setManagerName(value);
        if (name === 'createdBy') {
            getAllUser(value);
        }
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
    };

    const addUpdate = (values) => {
        if (props?.companyValues !== null) {
            const data = {
                ...values
            };
            data['approvalStatus'] = 'approved';
            setIsLoading(true);
            AdvanceSalaryService.patch(
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
                    toast.success('Salary request updated successfully.');
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

    useEffect(() => {
        if (props?.companyValues !== null) {
            const data = {
                amount: props?.companyValues?.amount ? props?.companyValues?.amount : 0,
                emi: props?.companyValues?.emi ? props?.companyValues?.emi : 0,
                reason: props?.companyValues?.reason
            };
            setUserId(props?.companyValues?._id);
            setFormData({ ...formData, ...data });
        }
    }, []);

    return (
        <Formik
            enableReinitialize
            initialValues={formData}
            validationSchema={advanceSalarySchema}
            onSubmit={(values, event) => {
                addUpdate(values);
            }}
        >
            {({ values, errors, touched, setFieldTouched, setFieldValue }) => (
                <Form>
                    <div className="">
                        <div className="">
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
                                <label htmlFor="emi" className="form-label">
                                    EMI*
                                </label>
                                <Field type="number" className="form-control pt-2" name="emi" id="emi" min={0} />
                                {errors.emi && touched.emi ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.emi}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="reason" className="form-label">
                                    Reason
                                </label>
                                <Field type="text" className="form-control pt-2" name="reason" id="reason" />
                            </div>
                        </div>
                        <div>
                            <button className="btn btn-primary" type="submit">
                                Approve
                            </button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default AddCompany;
