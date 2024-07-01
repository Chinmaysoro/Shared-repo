import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Formik, Field, Form } from 'formik';
import { toast } from 'react-toastify';
import { getUser } from '../../redux/helpers/user';
import TokenService from '../../redux/services/token.service';
import { SalaryStatusService, UpdateWorkingDaysService, AttendanceService, UserService } from '../../redux/services/feathers/rest.app';
import { getYearList, fetchMonthList, getCurrentMonth, getCurrentYear } from '../../redux/helpers/dateHelper';

const SalaryScreen = () => {
    
    const userData = getUser();
    const router = useRouter();
    const [yearList, setYearList] = useState([]);
    const [monthList, setMonthList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [formData, setFormData] = useState({ month: '', year: '' });
    const [salaryStatusList, setSalaryStatusList] = useState([]);
    const [salaryStatus, setSalaryStatus] = useState('');
    const [workingDayLoader, setWorkingDayLoader] = useState(false);

    console.log(userData);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const groupedByCreatedBy=(data) => data.reduce((acc, item) => {
        const { createdBy } = item;
    
        if (!acc[createdBy]) {
            acc[createdBy] = [];
        }
    
        acc[createdBy].push(item);
        return acc;
    }, {});

    const fetchSalaryStatus = async (values) => {


        const startDate = new Date(parseInt(values?.year), parseInt(values?.month)-1, 1);
        const endDate = new Date( parseInt(values?.year), parseInt(values?.month),1);
        const queryData = {
            companyId: userData?.user?.companyId,
            attendanceDate: {$gte: startDate, $lt: endDate},
            // month: parseInt(values?.month),
            // year: parseInt(values?.year)
        };
        console.log(queryData);

        if (userData?.user?.companyId) {
            setLoader(true);
            await AttendanceService.find({
                query: queryData,
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then(async (res) => {
                    console.log("The respo:-",res);
                    const users = []
                  const groupedData =   groupedByCreatedBy(res.data)
                    
                  console.log("Group Data:-", groupedData);
                  for (let x in groupedData){
                    console.log("The data:-",x);
                    // fetch user data
                  const userResp =   await UserService.get(x);
                   console.log(userResp);
                    users.push(userResp);

                  }
                //   console.log("user ==>",user)
                    // group all data according to the  emloyee
                    // EmpID, Name, Days




                    setLoader(false);
                    if (res?.data?.length > 0) {
                        // setSalaryStatus(res?.data[0]?.salaryStatus);
                        setSalaryStatusList(res?.data);
                        toast.success('Salary data fetched');
                        setSalaryStatus('processing');
                    }
                    if (res?.data?.length === 0) {
                        console.log("The 2nd respo:-", res);
                        toast.error('No data found!');
                        setSalaryStatus('processing');
                    }
                })
                .catch((error) => {
                    setLoader(false);
                    console.log("Salary", error);
                });
        }
    };

    const updateWorkingDaysByCompany = () => {
        const data = {
            companyId: userData?.user?.companyId,
            month: parseInt(formData?.month),
            year: formData?.year
        };
        if (formData?.month === '') {
            toast.error('Please select month!');
        } else if (formData?.year === '') {
            toast.error('Please select year!');
        } else {
            setWorkingDayLoader(true);
            UpdateWorkingDaysService.create(
                { ...data },
                {
                    headers: {
                        Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                    }
                }
            )
                .then((res) => {
                    setWorkingDayLoader(false);
                    toast.success(res?.message);
                })
                .catch((error) => {
                    setWorkingDayLoader(false);
                    toast.error(error.message);
                });
        }
    };

    useEffect(() => {
        const years = getYearList();
        const months = fetchMonthList();
        setYearList(years);
        setMonthList(months);
        // setFormData({ month: getCurrentMonth(), year: getCurrentYear() });
    }, []);

    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Salary</h3>
                        </div>
                    </div>
                </div>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        <Formik
                            enableReinitialize
                            initialValues={formData}
                            onSubmit={(values, event) => {
                                fetchSalaryStatus(values);
                            }}
                        >
                            {({ values, errors, touched, setFieldTouched, setFieldValue }) => (
                                <Form autoComplete="off">
                                    <div className="row">
                                        <div className="col-2">
                                            <div className="form-group">
                                                <label htmlFor="month" className="form-label">
                                                    Month
                                                </label>
                                                <Field name="month" id="month" as="select" className="form-control pt-2" onChange={handleChange}>
                                                    <option value="">-Select-</option>
                                                    {monthList && monthList?.length > 0
                                                        ? monthList?.map((data, index) => (
                                                              <option key={data.value} value={data.value}>
                                                                  {data.label}
                                                              </option>
                                                          ))
                                                        : null}
                                                </Field>
                                            </div>
                                        </div>
                                        <div className="col-2">
                                            <div className="form-group">
                                                <label htmlFor="year" className="form-label">
                                                    Year
                                                </label>
                                                <Field name="year" id="year" as="select" className="form-control pt-2" onChange={handleChange}>
                                                    <option value="">-Select-</option>
                                                    {yearList && yearList?.length > 0
                                                        ? yearList?.map((data, index) => (
                                                              <option key={data} value={data}>
                                                                  {data}
                                                              </option>
                                                          ))
                                                        : null}
                                                </Field>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="button-group" role="group" style={{ marginTop: '23px' }}>
                                                <button className="btn btn-primary" type="submit" title="Submit">
                                                    Submit
                                                </button>
                                                <button className="btn btn-warning" type="button" title="Update Working Days" onClick={() => updateWorkingDaysByCompany()}>
                                                    {workingDayLoader ? (
                                                        <>
                                                            Update Working Days By Company <i className="pi pi-spin pi-spinner" style={{ fontSize: '1rem' }}></i>
                                                        </>
                                                    ) : (
                                                        'Update Working Days By Company'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                    <div className="col-md-12 col-sm-12 mb-4">
                        <div className="card bg-light">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <b>1. Process Salary</b>
                                    <p>Select employee and process their salaries</p>
                                </div>
                                {salaryStatus === 'processing' || salaryStatus === 'released' || salaryStatus === 'processed' || salaryStatus === 'published' ? (
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() =>
                                            router.push({
                                                pathname: '/salary/process-salary',
                                                query: { salaryStatus: salaryStatus, month: formData?.month, year: formData?.year }
                                            })
                                        }
                                    >
                                        Process Salary
                                    </button>
                                ) : (
                                    <button type="button" className="btn btn-primary" disabled style={{ cursor: 'default' }}>
                                        Process Salary
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12 col-sm-12 mb-4">
                        <div className="card bg-light">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <b>2. Release Salary</b>
                                    <p>Select employee and release the amount</p>
                                </div>
                                {salaryStatus === 'released' || salaryStatus === 'processed' || salaryStatus === 'published' ? (
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() =>
                                            router.push({
                                                pathname: '/salary/release-salary',
                                                query: { status: salaryStatus, month: formData?.month, year: formData?.year }
                                            })
                                        }
                                    >
                                        Release Salary
                                    </button>
                                ) : (
                                    <button type="button" className="btn btn-primary" disabled style={{ cursor: 'default' }}>
                                        Release Salary
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12 col-sm-12">
                        <div className="card bg-light">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <b>3. Publish Salary</b>
                                    <p>You can select and publish the paylips</p>
                                </div>
                                {salaryStatus === 'published' || salaryStatus === 'released' ? (
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() =>
                                            router.push({
                                                pathname: '/salary/publish-salary',
                                                query: { status: salaryStatus, month: formData?.month, year: formData?.year }
                                            })
                                        }
                                    >
                                        Publish Salary
                                    </button>
                                ) : (
                                    <button type="button" className="btn btn-primary" disabled style={{ cursor: 'default' }}>
                                        Publish Salary
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalaryScreen;
