import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { financialProfileSchema } from '../../../redux/helpers/validations';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { userActions } from '../../../redux/actions/user.actions';
import { getUser } from '../../../redux/helpers/user';
import { UserSalaryService } from '../../../redux/services/feathers/rest.app';
import TokenService from '../../../redux/services/token.service';

const CompensationUpdateForm = ({ setVisible, componentValues, getUserSalary, fetchAllComponent, empId, userSalaryRes }) => {
    const dispatch = useDispatch();
    const userData = getUser();
    const [initialValues, setInitialValues] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const updateUserSalary = (values, type) => {
        const data = { ...userSalaryRes };
        if (Object.keys(data?.monthlySalaryBreakDown).length > 0) {
            Object.entries(data?.monthlySalaryBreakDown).map(([key, val]) => {
                if (key === values?.name) {
                    data.monthlySalaryBreakDown[key] = parseInt(values?.monthlyCTC);
                }
            });
            Object.entries(data?.annualSalaryBreakDown).map(([key, val]) => {
                if (key === values?.name) {
                    data.annualSalaryBreakDown[key] = parseInt(values?.annualCTC);
                }
            });
        }
        const requestQuery = {
            userId: empId,
            annualCTC: data?.annualCTC,
            monthlyCTC: data?.monthlyCTC,
            payGroupId: data?.payGroupId,
            annualSalaryBreakDown: data?.annualSalaryBreakDown,
            monthlySalaryBreakDown: data?.monthlySalaryBreakDown,
            _id: data?._id
        };
        if (data?._id) {
            setIsLoading(true);
            UserSalaryService.patch(
                requestQuery?._id,
                {
                    ...requestQuery
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
                    setVisible();
                    getUserSalary(requestQuery);
                })
                .catch((error) => {
                    setIsLoading(false);
                    toast.error(error.message);
                });
        }
    };

    useEffect(() => {
        if (componentValues !== null) {
            const data = {
                name: componentValues?.salaryComponentId?.name,
                monthlyCTC: componentValues?.monthlyAmount,
                annualCTC: componentValues?.annualAmount
            };
            setInitialValues({ ...initialValues, ...data });
        }
    }, []);
    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                // validationSchema={compensationUpdateSchema}
                onSubmit={(values, event) => {
                    updateUserSalary(values, 'compensation');
                }}
            >
                <Form className="form-card">
                    <div className="row">
                        <div className="col-md-4">
                            <label className="form-label w-100">
                                Component
                                <Field type="text" name="name" className="form-control" disabled />
                            </label>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label w-100">
                                Monthly
                                <Field name="monthlyCTC" id="monthlyCTC" className="form-control pt-2" />
                                <ErrorMessage name="monthlyCTC" component="div" className="error" />
                            </label>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label w-100">
                                Anually
                                <Field name="annualCTC" id="annualCTC" className="form-control pt-2" />
                                <ErrorMessage name="annualCTC" component="div" className="error" />
                            </label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <button type="submit" className="btn btn-primary mt-3">
                                Submit
                            </button>
                        </div>
                    </div>
                </Form>
            </Formik>
        </div>
    );
};

export default CompensationUpdateForm;
