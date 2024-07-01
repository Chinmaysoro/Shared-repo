import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { payGroupComponentSchema } from '../../redux/helpers/validations';
import { SalaryComponentService, PayComponentsService } from '../../redux/services/feathers/rest.app';
import { componentSchema } from '../../redux/helpers/validations';
import { getUser } from '../../redux/helpers/user';

const AddSalaryComponent = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [salaryComponentList, setSalaryComponentList] = useState([]);
    const [componentValues, setComponentValues] = useState({
        salaryComponentId: '',
        payComponentsType: '',
        fixedAmount: '',
        percentage: '',
        payGroupId: ''
    });

    const fetchSalaryComponent = () => {
        const queryData = {
            $sort: { createdAt: -1 },
            companyId: userData?.user?.companyId
        };
        SalaryComponentService.find({
            query: queryData,
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }, query: {
                companyId: userData?.user?.companyId
            }
        })
            .then((res) => {
                setSalaryComponentList(res?.data);
            })
            .catch((error) => {
                toast.error(error, toastSettings);
            });
    };

    const addUpdateComponent = async (values) => {
        const data = {
            salaryComponentId: values?.salaryComponentId,
            payComponentsType: values?.payComponentsType,
            fixedAmount: values?.fixedAmount,
            percentage: values?.percentage,
            payGroupId: props?.parentPayGroupId
        };
        // console.log(data, '::::::::::::::::::data');
        if (userData?.user?.companyId) {
            if (props?.componentValues !== null) {
                setLoader(true);
                PayComponentsService.patch(
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
                    .then(async(res) => {
                        setLoader(false);
                        toast.success('Component updated successfully.');
                        await props?.setVisible();
                        await props?.fetchAllComponent();
                        props?.fetchUserSalary() && await props?.fetchUserSalary();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            } else {
                const salaryComponentdata = data;
                Object.assign(salaryComponentdata, { companyId: userData?.user?.companyId });
                setLoader(true);
                PayComponentsService.create(
                    { ...salaryComponentdata },
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
                        props?.fetchAllComponent();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            }
        }
    };

    useEffect(() => {
        fetchSalaryComponent();
        if (props?.componentValues !== null) {
            const updatedComponentValues = {
                ...props.componentValues,
                salaryComponentId: props.componentValues.salaryComponentId._id
            };
            setComponentValues(updatedComponentValues);
        }
        
    }, []);

    return (
        <Formik enableReinitialize initialValues={componentValues} validationSchema={payGroupComponentSchema} onSubmit={addUpdateComponent}>
            {({ values, errors, touched }) => (
                <Form>
                    <div>
                        <div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="type" className="form-label">
                                    Salary Component*
                                </label>
                                <Field name="salaryComponentId" as="select" className="form-control pt-2">
                                    <option value="">-Select-</option>
                                    {salaryComponentList && salaryComponentList?.length > 0
                                        ? salaryComponentList?.map((component, index) => (
                                              <option key={index} value={component?._id}>
                                                  {component?.name}
                                              </option>
                                          ))
                                        : null}
                                </Field>
                                {errors.salaryComponentId && touched.salaryComponentId ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.salaryComponentId}</small>
                                    </p>
                                ) : null}
                            </div>

                            <div className="mb-2 ml_label">
                                <label htmlFor="payComponentsType" className="form-label">
                                    Salary Type*
                                </label>
                                <Field name="payComponentsType" as="select" className="form-control pt-2">
                                    <option value="">-Select-</option>
                                    {[
                                        { label: 'Fix Amount', value: 'fixAmount' },
                                        { label: 'Percentage', value: 'percentage' }
                                    ].map(({ label, value }) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </Field>
                                {errors.payComponentsType && touched.payComponentsType ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.payComponentsType}</small>
                                    </p>
                                ) : null}
                            </div>

                            {values.payComponentsType === 'fixAmount' && (
                                <div className="mb-2 ml_label">
                                    <label htmlFor="fixedAmount" className="form-label">
                                        Fixed Amount
                                    </label>
                                    <Field type="number" className="form-control pt-2" name="fixedAmount" id="fixedAmount" />
                                    {errors.fixedAmount && touched.fixedAmount ? (
                                        <p className="text-danger text-monospace mt-2">
                                            <small>{errors.fixedAmount}</small>
                                        </p>
                                    ) : null}
                                </div>
                            )}

                            {values.payComponentsType === 'percentage' && (
                                <div className="mb-2 ml_label">
                                    <label htmlFor="percentage" className="form-label">
                                        Percentage Value
                                    </label>
                                    <Field type="number" className="form-control pt-2" name="percentage" id="percentage" />
                                    {errors.percentage && touched.percentage ? (
                                        <p className="text-danger text-monospace mt-2">
                                            <small>{errors.percentage}</small>
                                        </p>
                                    ) : null}
                                </div>
                            )}
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

export default AddSalaryComponent;
