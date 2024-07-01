import React, { useState, useEffect } from 'react';
import { getUser } from '../../redux/helpers/user';
import { Formik, Field, Form } from 'formik';
import { toast } from 'react-toastify';
import { getYearList, fetchMonthList } from '../../redux/helpers/dateHelper';
import { UserService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';

const UserWiseReport = (props) => {
    const userData = getUser();
    const [formData, setFormData] = useState({
        employeename: '',
        month: '',
        year: ''
    });
    const [visibleUsersDropdown, setVisibleUsersDropdown] = useState(false);
    const [exportToPDFLoader, setExportToPDFLoader] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [allUsers, setAllUsers] = useState([]);
    const [yearList, setYearList] = useState([]);
    const [monthList, setMonthList] = useState([]);
    const [userValues, setUserValues] = useState({});

    const getAllUser = async (value, type) => {
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
                    },
                    {
                        empId: {
                            $regex: `.*${value}.*`,
                            $options: 'i'
                        }
                    }
                ],
                $skip: 0,
                $limit: 100,
                role: 1,
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
                setVisibleUsersDropdown(false);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'employeename') {
            getAllUser(value, '');
        }
        if (name === 'month') {
            setSelectedMonth(value);
        }
        if (name === 'year') {
            setSelectedYear(value);
        }
    };

    const setFormValues = (type, data) => {
        if (type === 'employeename') {
            setUserValues(data);
            setVisibleUsersDropdown(false);
        }
    };

    const exportToPDF = async (data) => {
        if (data?.employeename === '') {
            toast.error('Please select user');
        } else if (data?.month === '') {
            toast.error('Please select month');
        } else if (data?.year === '') {
            toast.error('Please select year');
        } else {
            setExportToPDFLoader(true);
            // const url = `${process.env.baseURL}/v1/download-attendance?downloadIndividualReport=true&companyId=${userData?.user?.companyId}&userId=${userValues?._id}&month=${data?.month}&year=${data?.year}`;
            // console.log(url);
            // const tempLink = document.createElement('a');
            // tempLink.href = url;
            // tempLink.click();
            // setExportToPDFLoader(false);
            const url = `http://localhost:3030/v1/download-attendance?downloadIndividualReport=true&companyId=${userData?.user?.companyId}&userId=${userValues?._id}&month=${data?.month}&year=${data?.year}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                },
            });
            if (!response.ok) {
                toast.error(`Failed to download: ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();

            // Create a Blob from the array buffer
            const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            // Create a link element to trigger the download
            const tempLink = document.createElement('a');
            tempLink.href = URL.createObjectURL(blob);
            tempLink.setAttribute('download', 'user-report.xlsx'); // Set desired file name

            // Trigger the download
            tempLink.click();
            setExportToPDFLoader(false);
        }
    };

    useEffect(() => {
        const years = getYearList();
        const months = fetchMonthList();
        setYearList(years);
        setMonthList(months);
    }, []);

    return (
        <Formik enableReinitialize initialValues={formData}>
            {({ values, errors, touched, setFieldTouched, setFieldValue }) => (
                <Form autoComplete="off">
                    <div className="form-group">
                        <label htmlFor="employeename" className="form-label">
                            Select User
                        </label>
                        <Field type="text" placeholder="Enter user name" className="form-control" name="employeename" id="employeename" onKeyUp={handleChange} />

                        {visibleUsersDropdown && allUsers.length > 0 ? (
                            <ul className="t_ul" style={{ width: '95%' }}>
                                {allUsers.map((user, index) => {
                                    return (
                                        <li
                                            key={`key-${index}`}
                                            onClick={() => {
                                                setFormValues('employeename', user);
                                                setFieldTouched('employeename', true);
                                                setFieldValue('employeename', `${user?.firstName} ${user?.lastName}`);
                                            }}
                                        >
                                            {`${user?.empId ? user?.empId : ''} ${user?.firstName} ${user?.lastName}`}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : null}
                    </div>
                    <div className="form-group">
                        <label htmlFor="month" className="form-label">
                            Select Month
                        </label>
                        <Field name="month" id="month" as="select" className="form-control pt-2">
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
                    <div className="form-group">
                        <label htmlFor="year" className="form-label">
                            Select Year
                        </label>
                        <Field name="year" id="year" as="select" className="form-control pt-2">
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
                    <div className="button-group" role="group" style={{ marginTop: '23px' }}>
                        <button className="btn btn-primary" type="button" title="Generate Report" onClick={() => exportToPDF(values)}>
                            {exportToPDFLoader ? (
                                <>
                                    Generate Report <i className="pi pi-spin pi-spinner" style={{ fontSize: '1rem' }}></i>
                                </>
                            ) : (
                                'Generate Report'
                            )}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default UserWiseReport;
