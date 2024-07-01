import React, { useState, useEffect } from 'react';
import { getUser } from '../../redux/helpers/user';
import { Formik, Field, Form } from 'formik';
import { toast } from 'react-toastify';
import { getYearList, fetchMonthList } from '../../redux/helpers/dateHelper';
import TokenService from '../../redux/services/token.service';
const CompanyWiseReport = (props) => {
    const userData = getUser();
    const [formData, setFormData] = useState({
        month: '',
        year: ''
    });
    const [exportToPDFLoader, setExportToPDFLoader] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [yearList, setYearList] = useState([]);
    const [monthList, setMonthList] = useState([]);
    const [userValues, setUserValues] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'month') {
            setSelectedMonth(value);
        }
        if (name === 'year') {
            setSelectedYear(value);
        }
    };

    // const exportToPDF = async (data) => {
    //     if (data?.month === '') {
    //         toast.error('Please select month');
    //     } else if (data?.year === '') {
    //         toast.error('Please select year');
    //     } else {
    //         setExportToPDFLoader(true);
    //         const url = `${process.env.baseURL}/v1/download-attendance?downloadIndividualReport=true&companyId=${userData?.user?.companyId}&month=${data?.month}&year=${data?.year}`;
    //         console.log(url);
    //         const tempLink = document.createElement('a');
    //         tempLink.href = url;
    //         tempLink.click();
    //         setExportToPDFLoader(false);
    //     }
    // };
    const exportToPDF = async (data) => {
        if (data?.month === '') {
            toast.error('Please select month');
        } else if (data?.year === '') {
            toast.error('Please select year');
        } else {
            setExportToPDFLoader(true);
            const url = `http://localhost:3030/v1/download-attendance?downloadIndividualReport=true&companyId=${userData?.user?.companyId}&month=${data?.month}&year=${data?.year}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to download: ${response.statusText}`);
            }

            const arrayBuffer = await response.arrayBuffer();

            // Create a Blob from the array buffer
            const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            // Create a link element to trigger the download
            const tempLink = document.createElement('a');
            tempLink.href = URL.createObjectURL(blob);
            tempLink.setAttribute('download', 'company-report.xlsx'); // Set desired file name

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

export default CompanyWiseReport;
