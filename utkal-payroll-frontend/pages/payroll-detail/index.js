import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { Formik, Field, Form } from 'formik';
import { getUser, getRandomColor, getMonth } from '../../redux/helpers/user';
import TokenService from '../../redux/services/token.service';
import { SalaryStatusService, PayslipService } from '../../redux/services/feathers/rest.app';
import { getYearList, fetchMonthList, getCurrentMonth, getCurrentYear } from '../../redux/helpers/dateHelper';

const ProcessSalary = () => {
    const userData = getUser();
    const router = useRouter();
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [loader, setLoader] = useState(false);
    const [payslipList, setPayslipList] = useState([]);
    const [userIds, setuserIds] = useState([]);
    const [totalPayslips, setTotalPayslips] = useState('');
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [yearList, setYearList] = useState([]);
    const [monthList, setMonthList] = useState([]);
    const [formData, setFormData] = useState({ month: '', year: '', salaryStatus: '' });
    const [reportFormData, setReportFormData] = useState({ month: '', year: '', salaryStatus: '' });
    const [exportToPDFLoader, setExportToPDFLoader] = useState(false);
    const [downloadReportLoader, setDownloadReportLoader] = useState(false);
    const [loaderIndex, setLoaderIndex] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const fetchPayslipByStatus = async () => {
        const queryData = {
            $skip: offset,
            $limit: perPage,
            companyId: userData?.user?.companyId,
            salaryStatus: formData?.salaryStatus,
            month: parseInt(formData?.month),
            year: formData?.year,
            $populate: [
                {
                    path: 'userId', // The keyName, you want to populate
                    model: 'users', // The Mongoose model name
                    populate: {
                        path: 'departmentId', // The keyName, you want to populate
                        model: 'department' // The Mongoose model name
                    }
                }
            ]
        };
        setReportFormData({ month: formData?.month, year: formData?.year, salaryStatus: formData?.salaryStatus });
        if (userData?.user?.companyId) {
            setIsLoading(true);
            await PayslipService.find({
                query: queryData,
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setIsLoading(false);
                    setFormData({ month: '', year: '', salaryStatus: '' });
                    if (res?.data?.length > 0) {
                        setPayslipList(res?.data);
                        setPageCount(Math.ceil(res.total / perPage));
                        setTotalPayslips(res?.total);
                    }
                    if (res?.data?.length === 0) {
                        setPayslipList([]);
                    }
                })
                .catch((error) => {
                    setIsLoading(false);
                });
        }
    };

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setOffset(selectedPage * perPage);
    };

    const downloadReport = async () => {
        setDownloadReportLoader(true);
        const url = `http://localhost:3030/v1/salary-report?companyId=${userData?.user?.companyId}&month=${parseInt(reportFormData?.month)}&year=${reportFormData?.year}&type=${reportFormData?.salaryStatus === 'released' ? 2 : 1}`;
        //console.log(url, ':::::::::::download url');
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
        tempLink.setAttribute('download', `report.xlsx`); // Set desired file name

        // Trigger the download
        tempLink.click();

        setDownloadReportLoader(false);
    };

    const downloadPayslip = async (emp, index) => {
        setExportToPDFLoader(true);
        setLoaderIndex(index);
        const url = `http://localhost:3030/v1/download-payslip?companyId=${userData?.user?.companyId}&month=${parseInt(reportFormData?.month)}&year=${reportFormData?.year}&userId=${emp?.userId?._id}`;
        //console.log(url, ':::::::::::download url');
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
        tempLink.setAttribute('download', `${emp?.userId?.firstName}-payslip.pdf`); // Set desired file name

        // Trigger the download
        tempLink.click();

        setExportToPDFLoader(false);
        setLoaderIndex(0);
    };

    useEffect(() => {
        const years = getYearList();
        const months = fetchMonthList();
        setYearList(years);
        setMonthList(months);
        fetchPayslipByStatus();
    }, [offset]);

    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">
                                {' '}
                                <i className="pi pi-arrow-left cursor-pointer" style={{ fontSize: '1rem' }} onClick={() => router.back()}></i>&nbsp;Payroll Detail
                            </h3>
                        </div>
                        {/* <div className="col-auto float-right ml-auto">
                            <button type="button" className="btn btn-primary" onClick={confirmProcessSalary}>
                                Process Salary
                            </button>
                        </div> */}
                        <div className="col-md-12 col-sm-12">
                            <Formik
                                enableReinitialize
                                initialValues={formData}
                                onSubmit={(values, event) => {
                                    fetchPayslipByStatus(values);
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
                                            <div className="col-2">
                                                <div className="form-group">
                                                    <label htmlFor="salaryStatus" className="form-label">
                                                        Salary Status
                                                    </label>
                                                    <Field name="salaryStatus" id="salaryStatus" as="select" className="form-control pt-2" onChange={handleChange}>
                                                        <option value="">-Select-</option>
                                                        {[
                                                            { name: 'processing', value: 'unprocessed' },
                                                            { name: 'processed', value: 'processed' },
                                                            { name: 'released', value: 'released' },
                                                            { name: 'published', value: 'published' },
                                                            { name: 'hold', value: 'hold' }
                                                        ]?.map((data, index) => (
                                                            <option key={data?.value} value={data?.value}>
                                                                {data?.name}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                </div>
                                            </div>
                                            <div className="col-3">
                                                <div className="button-group" role="group" style={{ marginTop: '23px' }}>
                                                    <button className="btn btn-primary" type="submit" title="Submit">
                                                        Submit
                                                    </button>
                                                </div>
                                            </div>
                                            {(reportFormData?.salaryStatus === 'released' || reportFormData?.salaryStatus === 'processed') && payslipList?.length > 0 ? (
                                                <div className="col-3">
                                                    <div className="button-group" role="group" style={{ marginTop: '23px' }}>
                                                        <button className="btn btn-success" type="button" onClick={downloadReport}>
                                                            {downloadReportLoader ? (
                                                                <>
                                                                    Download Report <i className="pi pi-spin pi-spinner" style={{ fontSize: '1rem' }}></i>
                                                                </>
                                                            ) : (
                                                                'Download Report'
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                    <hr />
                </div>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        <table className="table table-bordered mt-2">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">EMP ID</th>
                                    <th scope="col">Payble Days</th>
                                    {payslipList && payslipList?.length > 0 && payslipList[0]?.salaryStatus === 'published' ? <th scope="col">Action</th> : null}
                                </tr>
                            </thead>
                            <tbody>
                                {payslipList && payslipList?.length > 0 ? (
                                    payslipList?.map((emp, index) => (
                                        <tr key={`key-${index}`}>
                                            <td>
                                                <div className="d-inline-flex">
                                                    <div className="employee-avatar">
                                                        {emp?.userId?.avatar ? (
                                                            <img src={`https://dd7tft2brxkdw.cloudfront.net/${emp?.userId?.avatar}`} alt="user Preview" className="preview-image" />
                                                        ) : (
                                                            <img src={`${contextPath}/layout/images/default-user.jpg`} alt="user Preview" className="preview-image" />
                                                        )}
                                                    </div>
                                                    <div className="mt-1 ml-2">
                                                        {emp?.userId?.firstName ? emp?.userId?.firstName : null}&nbsp;{emp?.userId?.middleName ? emp?.userId?.middleName : null}&nbsp;
                                                        {emp?.userId?.lastName ? emp?.userId?.lastName : null}
                                                        <span className="badge badge-light" style={{ backgroundColor: getRandomColor() }}>
                                                            {emp?.userId?.departmentId?.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{emp?.userId?.empId || 'N/A'}</td>
                                            <td>{emp?.paybleDays || 'N/A'}</td>
                                            {payslipList && payslipList?.length > 0 && payslipList[0]?.salaryStatus === 'published' ? (
                                                <td>
                                                    <button type="button" className="btn btn-primary" onClick={() => downloadPayslip(emp, index + 1)}>
                                                        {exportToPDFLoader && loaderIndex === index + 1 ? (
                                                            <>
                                                                Download Payslip <i className="pi pi-spin pi-spinner" style={{ fontSize: '1rem' }}></i>
                                                            </>
                                                        ) : (
                                                            'Download Payslip'
                                                        )}
                                                    </button>
                                                </td>
                                            ) : null}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="alert alert-success text-center" role="alert">
                                                No employee found!!!
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {totalPayslips > 10 ? (
                            <ReactPaginate
                                previousLabel={'<'}
                                nextLabel={'>'}
                                breakLabel={'...'}
                                breakClassName={'break-me'}
                                pageCount={pageCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageClick}
                                containerClassName={'pagination'}
                                activeClassName={'active'}
                            />
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProcessSalary;
