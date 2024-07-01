import React, { useState, useEffect } from 'react';
import { getUser } from '../../redux/helpers/user';
import { Formik, Field, Form } from 'formik';
import { toast } from 'react-toastify';

const DailyWiseReport = (props) => {
    const userData = getUser();
    const [formData, setFormData] = useState({ date: '' });
    const [exportToPDFLoader, setExportToPDFLoader] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const exportToPDF = async (data) => {
        if (data?.date === '') {
            toast.error('Please select date');
        } else {
            setExportToPDFLoader(true);
            const url = `http://localhost:3030/v1/download-attendance?downloadDateWiseReport=true&companyId=${userData?.user?.companyId}&date=${data?.date}`;

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
            tempLink.setAttribute('download', 'daily-report.xlsx'); // Set desired file name

            // Trigger the download
            tempLink.click();

            setExportToPDFLoader(false);
        }
    };

    return (
        <Formik enableReinitialize initialValues={formData}>
            {({ values }) => (
                <Form autoComplete="off">
                    <div className="form-group">
                        <label htmlFor="endDate" className="form-label">
                            Select Date
                        </label>
                        <Field type="date" placeholder="Select Date" className="form-control" name="date" id="date" onKeyUp={handleChange} />
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

export default DailyWiseReport;
