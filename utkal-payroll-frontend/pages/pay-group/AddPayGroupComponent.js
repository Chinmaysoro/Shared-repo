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

const AddPayGroupComponent = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [salaryComponentList, setSalaryComponentList] = useState([]);

    return (
        <Formik>
            {({ values, errors, touched }) => (
                <Form>
                    <div>
                        <div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="type" className="form-label">
                                    Component Name*
                                </label>
                                <Field name="payComponentsType" className="form-control pt-2" />
                            </div>

                            <div className="mb-2 ml_label mt-3">
                                <label htmlFor="payComponentsType" className="form-label">
                                    Component Type*
                                </label>
                                <Field name="payComponentsType" className="form-control pt-2" />

                            </div>
                            <div className="mb-2 ml_label mt-3">
                                <label htmlFor="payComponentsType" className="form-label">
                                    Pay Type*
                                </label>
                                <div className='mt-3'>
                                    <label className='mr-3'>  <Field name="pay_type" type="radio" /> Addition</label>
                                    <label>  <Field name="pay_type" type="radio" /> Deduction</label>
                                </div>
                            </div>
                            <div className="mb-2 ml_label mt-3">
                                <label htmlFor="payComponentsType" className="form-label">
                                   Grading System*
                                </label>
                                <div className='mt-2 g-system'>
                                   <ul>
                                    <li className='mb-1'>  <label>  <Field  type="checkbox" checked/> Set this component as part of ctc</label></li>
                                    <li className='mb-1'>  <label>  <Field  type="checkbox" /> Set this component as part of gross</label></li>
                                    <li className='mb-1'>  <label>  <Field  type="checkbox" /> Want to pay this component in salary</label></li>

                                   </ul>
                                </div>
                            </div>
                            <div className="mb-2 ml_label mt-3">
                                <label htmlFor="payComponentsType" className="form-label">
                                    Nature of payment*
                                </label>
                                <div className='mt-3'>
                                    <label className='mr-3'>  <Field name="pay_type" type="radio" /> Fixed</label>
                                    <label>  <Field name="pay_type" type="radio" /> Variable</label>
                                </div>


                            </div>
                        </div>
                        <div className="mt-4 text-right">
                        <button className="btn btn-light-primary" type="button">
                                Cancel
                            </button>
                            <button className="btn btn-primary t-tranform" type="submit">
                                Save & Done
                            </button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default AddPayGroupComponent;
