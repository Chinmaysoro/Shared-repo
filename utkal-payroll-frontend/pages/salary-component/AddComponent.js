import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { componentSchema } from '../../redux/helpers/validations';
import { SalaryComponentService } from '../../redux/services/feathers/rest.app';
import { getUser } from '../../redux/helpers/user';

const ResignationTypeScreen = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [componentValues, setComponentValues] = useState({});

    const addUpdateComponent = (values) => {
        const data = {
            name: values?.name,
            type: values?.type,
            natureOfPayment: values?.natureOfPayment,
            taxExempt: values?.taxExempt ? true : false,
            status: values?.status ? 'enabled' : 'disabled'
        };
        if (userData?.user?.companyId) {
            if (props?.componentValues !== null) {
                setLoader(true);
                SalaryComponentService.patch(
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
                        props?.fetchAll();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            } else {
                const salaryData = data;
                Object.assign(salaryData, { companyId: userData?.user?.companyId });
                setLoader(true);
                SalaryComponentService.create(
                    { ...salaryData },
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
                        props?.fetchAll();
                    })
                    .catch((error) => {
                        setLoader(false);
                        toast.error(error.message);
                    });
            }
        }
    };

    useEffect(() => {
        if (props?.componentValues !== null) {
            setComponentValues({ ...componentValues, ...props?.componentValues });
        }
    }, []);

    return (
        <Formik enableReinitialize initialValues={componentValues} validationSchema={componentSchema} onSubmit={addUpdateComponent}>
            {({ errors, touched }) => (
                <Form>
                    <div>
                        <div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="name" className="form-label">
                                    Component name*
                                </label>
                                <Field type="text" className="form-control pt-2" name="name" id="name" />
                                {errors.name && touched.name ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.name}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="type" className="form-label">
                                    Type of Component*
                                </label>
                                <Field name="type" as="select" className="form-control pt-2">
                                    <option value="">-Select-</option>
                                    {[
                                        { label: 'Credit', value: 'addition' },
                                        { label: 'Debit', value: 'deduction' },
                                        { label: 'Variable Pay', value: 'variable' },
                                        { label: 'Others', value: 'others' }
                                    ].map(({ label, value }) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </Field>
                                {errors.type && touched.type ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.type}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="natureOfPayment" className="form-label">
                                    Nature of Payment*
                                </label>
                                <Field name="natureOfPayment" as="select" className="form-control pt-2">
                                    <option value="">-Select-</option>
                                    {[
                                        { label: 'Fixed', value: 'fixed' },
                                        { label: 'Variable', value: 'variable' }
                                    ].map(({ label, value }) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </Field>
                                {errors.natureOfPayment && touched.natureOfPayment ? (
                                    <p className="text-danger text-monospace mt-2">
                                        <small>{errors.natureOfPayment}</small>
                                    </p>
                                ) : null}
                            </div>
                            <div className="switch_section">
                                <div className="mb-2 ml_label">
                                    <div className="form-check">
                                        <Field name="taxExempt" id="taxExempt" className="form-check-input" type="checkbox" />
                                        <label className="form-check-label" htmlFor="taxExempt">
                                            Tax Exempt
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-2 ml_label">
                                    <div className="form-check statusCheckBox2">
                                        <Field name="status" id="status" className="form-check-input" type="checkbox" />
                                        <label className="form-check-label" htmlFor="status">
                                            Enable/Disable
                                        </label>
                                    </div>
                                </div>
                            </div>
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

export default ResignationTypeScreen;
