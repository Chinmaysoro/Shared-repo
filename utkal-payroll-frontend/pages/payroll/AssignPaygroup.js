import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { userSalarySchema } from '../../redux/helpers/validations';
import { UserSalaryService, PayGroupService } from '../../redux/services/feathers/rest.app';
import { getYearList, getMonthList } from '../../redux/helpers/dateHelper';
import { getUser } from '../../redux/helpers/user';

const AssignPaygroup = (props) => {
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
    const [paygroupList, setPaygroupList] = useState([]);

    const addUpdate = (values) => {
        if (userData?.user?.companyId) {
            if (props?.payrollValues !== null) {
                const data = {
                    userId: userId,
                    annualCTC: values?.annualCTC,
                    monthlyCTC: values?.monthlyCTC,
                    payGroupId: values?.payGroupId
                };
                setIsLoading(true);
                UserSalaryService.patch(
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
                        props?.fetchUserSalary(userId);
                    })
                    .catch((error) => {
                        setIsLoading(false);
                        toast.error(error.message);
                    });
            } else {
                const data = {
                    userId: userId,
                    annualCTC: values?.annualCTC,
                    monthlyCTC: values?.monthlyCTC,
                    payGroupId: values?.payGroupId
                };
                const payRollData = data;
                Object.assign(payRollData, { companyId: userData?.user?.companyId });
                setIsLoading(true);
                UserSalaryService.create(
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
                        props?.fetchUserSalary(userId);
                    })
                    .catch((error) => {
                        setIsLoading(false);
                        toast.error(error.message);
                    });
            }
        }
    };

    const fetchPaygroup = async () => {
        if (userData?.user?.companyId) {
            setLoader(true);
            PayGroupService.find({
                query: { companyId: userData?.user?.companyId, $sort: { createdAt: -1 } },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setLoader(false);
                    setPaygroupList(res.data);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };
   

    const fetchData = async () => {
        const years = await getYearList();
        const months = await getMonthList();
        setYearList(years);
        setMonthList(months);
        const location = window?.location?.pathname;
        const locationarr = location?.split('/');
        setUserId(locationarr[2]);
        fetchPaygroup();
    };

    useEffect(() => {
        fetchData();
        if (props?.payrollValues !== null) {
            const values = {
                annualCTC: props?.payrollValues?.annualCTC,
                monthlyCTC: props?.payrollValues?.monthlyCTC,
                payGroupId: props?.payrollValues?.payGroupId
            };
            setPayrollValues({ ...payrollValues, ...values });
            setDocumentId(props?.payrollValues?._id);
        }
    }, []);

    return (
        <Formik
            enableReinitialize
            initialValues={payrollValues}
            validationSchema={userSalarySchema}
            onSubmit={(values, event) => {
                addUpdate(values, event);
            }}
        >
            {({ values, errors, touched }) => (
                <Form>
                    <div className="">
                        <div className="">
                            <div className="mb-2 ml_label">
                                <label htmlFor="payGroupId" className="form-label">
                                    Select Paygroup
                                </label>
                                <Field name="payGroupId" id="payGroupId" as="select" className="form-control pt-2">
                                    <option value="">-Select-</option>
                                    {paygroupList && paygroupList?.length > 0
                                        ? paygroupList?.map((data, index) => (
                                              <option key={data._id} value={data?._id}>
                                                  {data?.name}
                                              </option>
                                          ))
                                        : null}
                                </Field>
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="annualCTC" className="form-label">
                                    Anual CTC*
                                </label>
                                <Field name="annualCTC" id="annualCTC" className="form-control pt-2" />
                            </div>
                            <div className="mb-2 ml_label">
                                <label htmlFor="monthlyCTC" className="form-label">
                                    Monthly CTC*
                                </label>
                                <Field name="monthlyCTC" id="monthlyCTC" className="form-control pt-2" />
                            </div>
                        </div>
                        <div>
                            <button className="btn btn-primary" type="submit" disabled={isLoading}>
                                Submit
                            </button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default AssignPaygroup;
