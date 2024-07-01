import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { getUser, getRandomColor, getMonth } from '../../../redux/helpers/user';
import TokenService from '../../../redux/services/token.service';
import { SalaryStatusService, PayslipService } from '../../../redux/services/feathers/rest.app';

const ReleaseSalary = () => {
    const userData = getUser();
    const router = useRouter();
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [loader, setLoader] = useState(false);
    const [payslipList, setPayslipList] = useState([]);
    const [userIds, setuserIds] = useState([]);
    const [totalPayslips, setTotalPayslips] = useState(1);
    const [releaseSalaryModal, setReleaseSalaryModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [holdSalaryModal, setHoldSalaryModal] = useState(false);
    const [unprocessSalaryModal, setUnprocessSalaryModal] = useState(false);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(0);
    const [pageLoad, setPageLoad] = useState(true);

    const confirmationDialogFooter = (
        <>
            <button type="button" className="btn btn-warning" onClick={() => setReleaseSalaryModal(!releaseSalaryModal)}>
                Cancel{' '}
            </button>
            <button type="button" onClick={() => releaseSalary()} className="btn btn-primary">
                Proceed
            </button>
        </>
    );

    const confirmationHoldDialogFooter = (
        <>
            <button type="button" className="btn btn-warning" onClick={() => setHoldSalaryModal(!holdSalaryModal)}>
                Cancel{' '}
            </button>
            <button type="button" onClick={() => holdSalary()} className="btn btn-primary">
                Proceed
            </button>
        </>
    );

    const confirmationUnprocessDialogFooter = (
        <>
            <button type="button" className="btn btn-warning" onClick={() => setUnprocessSalaryModal(!unprocessSalaryModal)}>
                Cancel{' '}
            </button>
            <button type="button" onClick={() => unProcessSalary()} className="btn btn-primary">
                Proceed
            </button>
        </>
    );

    const fetchPayslipByStatus = async () => {
        if (page >= totalPayslips) {
            setPageLoad(false);
        } else {
            if (pageLoad === true) {
                const queryData = {
                    $skip: page,
                    $limit: limit,
                    companyId: userData?.user?.companyId,
                    salaryStatus: 'processed',
                    month: parseInt(router?.query?.month),
                    year: router?.query?.year,
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

                setLoader(true);
                await PayslipService.find({
                    query: queryData,
                    headers: {
                        Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                    }
                })
                    .then((res) => {
                        setLoader(false);
                        setTotalPayslips(res.total);
                        setPayslipList((prev) => [...prev, ...res.data]);
                        setPageCount(Math.ceil(res.total / limit));
                    })
                    .catch((error) => {
                        setLoader(false);
                    });
            }
        }
    };

    const handleChange = (e, empid) => {
        if (e.target.checked) {
            setuserIds([...userIds, empid]);
        } else {
            const filterList = userIds.filter((item) => item !== empid);
            setuserIds(filterList);
        }
    };

    const handlePaymentMethod = (e, value) => {
        setPaymentMethod(value);
    };

    const confirmReleaseSalary = () => {
        if (paymentMethod === '') {
            toast.error('Please select payment method!');
        } else if (userIds?.length === 0) {
            toast.error('Please select user!');
        } else {
            setReleaseSalaryModal(!releaseSalaryModal);
        }
    };

    const confirmHoldSalary = () => {
        if (userIds?.length === 0) {
            toast.error('Please select user!');
        } else {
            setHoldSalaryModal(!holdSalaryModal);
        }
    };
    const confirmUnprocessSalary = () => {
        if (userIds?.length === 0) {
            toast.error('Please select user!');
        } else {
            setUnprocessSalaryModal(!unprocessSalaryModal);
        }
    };

    const releaseSalary = () => {
        const data = {
            companyId: userData?.user?.companyId,
            month: parseInt(router?.query?.month),
            year: router?.query?.year,
            userIds: userIds,
            action: 2, // ['processing', 'released', 'hold', 'unprocess']
            paymentMethod: paymentMethod
        };
        //console.log(data,":::::::::release data")
        setLoader(true);
        SalaryStatusService.create(
            { ...data },
            {
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            }
        )
            .then((res) => {
                setLoader(false);
                setReleaseSalaryModal(!releaseSalaryModal);
                toast.success('Salary released successfully.');
                setTimeout(() => {
                    router.push('/salary');
                }, 1000);
            })
            .catch((error) => {
                setLoader(false);
                toast.error(error.message);
            });
    };

    const holdSalary = () => {
        const data = {
            companyId: userData?.user?.companyId,
            month: parseInt(router?.query?.month),
            year: router?.query?.year,
            userIds: userIds,
            action: 3 // ['processing', 'released', 'hold', 'unprocess']
        };
        //console.log(data,":::::::::hold data")
        setLoader(true);
        SalaryStatusService.create(
            { ...data },
            {
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            }
        )
            .then((res) => {
                setLoader(false);
                setReleaseSalaryModal(!releaseSalaryModal);
                toast.success('Salary hold successfully.');
                setTimeout(() => {
                    router.push('/salary');
                }, 1000);
            })
            .catch((error) => {
                setLoader(false);
                toast.error(error.message);
            });
    };

    const unProcessSalary = () => {
        const data = {
            companyId: userData?.user?.companyId,
            month: parseInt(router?.query?.month),
            year: router?.query?.year,
            userIds: userIds,
            action: 4 // ['processing', 'released', 'hold', 'unprocess']
        };
        // console.log(data,":::::::::unprocess data")
        setLoader(true);
        SalaryStatusService.create(
            { ...data },
            {
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            }
        )
            .then((res) => {
                setLoader(false);
                setReleaseSalaryModal(!releaseSalaryModal);
                toast.success('Salary unprocessed successfully.');
                setTimeout(() => {
                    router.push('/salary');
                }, 1000);
            })
            .catch((error) => {
                setLoader(false);
                toast.error(error.message);
            });
    };

    const handleInfinityScroll = async () => {
        try {
            if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
                setPage((prev) => prev + 10);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        window?.addEventListener('scroll', handleInfinityScroll);
        return () => window?.removeEventListener('scroll', handleInfinityScroll);
    }, []);

    useEffect(() => {
        fetchPayslipByStatus();
    }, [page]);

    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">
                                {' '}
                                <i className="pi pi-arrow-left cursor-pointer" style={{ fontSize: '1rem' }} onClick={() => router.back()}></i>&nbsp;Release Salary
                            </h3>
                        </div>
                        <div className="col-auto float-right ml-auto">
                            <button type="button" className="btn btn-info" onClick={confirmUnprocessSalary}>
                                Unprocess Salary
                            </button>
                            &nbsp;
                            <button type="button" className="btn btn-warning" onClick={confirmHoldSalary}>
                                Hold Salary
                            </button>
                            &nbsp;
                            <button type="button" className="btn btn-primary" onClick={confirmReleaseSalary}>
                                Release Salary
                            </button>
                        </div>
                        <div className="col-md-12 d-flex">
                            {['Cash', 'Cheque', 'UPI/Internet Banking'].map((data) => {
                                return (
                                    <div key={data} className="mr-5">
                                        <input type="checkbox" name="paymentMethod" className="form-check-input" onChange={(e) => handlePaymentMethod(e, data)} />
                                        &nbsp;{data}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        {/* <div className="col-md-6">Search</div> */}
                        <div className="col-md-6 ml-auto">
                            Selected : {userIds?.length}/{totalPayslips}
                        </div>
                    </div>
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
                                </tr>
                            </thead>
                            <tbody>
                                {payslipList && payslipList?.length > 0 ? (
                                    payslipList?.map((emp, index) => (
                                        <tr key={`key-${index}`}>
                                            <td>
                                                <div className="d-inline-flex">
                                                    <input type="checkbox" onChange={(e) => handleChange(e, emp?.userId?._id)} /> &nbsp;&nbsp;
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
                    </div>
                </div>
            </div>
            <Dialog header="Confirmation" visible={releaseSalaryModal} onHide={() => setReleaseSalaryModal(!releaseSalaryModal)} style={{ width: '350px' }} modal footer={confirmationDialogFooter}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem', color: '#e0a800' }} />
                    <span>Do you want to release the salary?</span>
                </div>
            </Dialog>

            <Dialog header="Confirmation" visible={holdSalaryModal} onHide={() => setHoldSalaryModal(!holdSalaryModal)} style={{ width: '350px' }} modal footer={confirmationHoldDialogFooter}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem', color: '#e0a800' }} />
                    <span>Do you want to hold the salary?</span>
                </div>
            </Dialog>

            <Dialog header="Confirmation" visible={unprocessSalaryModal} onHide={() => setUnprocessSalaryModal(!unprocessSalaryModal)} style={{ width: '350px' }} modal footer={confirmationUnprocessDialogFooter}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem', color: '#e0a800' }} />
                    <span>Do you want to unprocess the salary?</span>
                </div>
            </Dialog>
        </div>
    );
};

export default ReleaseSalary;
