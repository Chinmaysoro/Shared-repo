import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getUser, decodedID } from '../../redux/helpers/user';
import { experienceSchema } from '../../redux/helpers/validations';
import { CompanyService, DepartmentService, DesignationService, GradeService, LeavePolicyService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
const PolicyApplicability = (props) => {
    const dispatch = useDispatch();
    const userData = getUser();
    const router = useRouter();
    const policy_Id = decodedID(router?.query?.policyId);
    const [loader, setLoader] = useState(false);
    const [educationalDetails, setEducationalDetails] = useState([]);
    const [allDesignationList, setallDesignationList] = useState([]);
    const [allDivisionList, setAllDivisionList] = useState([]);
    const [familyValues, setfamilyValues] = useState({
        name: '',
        relation: '',
        dob: '',
        age: '',
        bloodGroup: ''
    });
    const [selectedOption, setSelectedOption] = useState(null);
    const [companyDetail, setCompanyDetail] = useState([]);
    const [totalCompany, setTotalCompany] = useState(0);
    const [departmentList, setDepartmentList] = useState([]);
    const [totalDepartment, setTotalDepartment] = useState(0);
    const [allGradeList, setallGradeList] = useState([]);
    const [selectedDivision, setSelectedDivision] = useState([]);
    const [selectedEntityIds, setSelectedEntityIds] = useState([]);
    const [leavePoliciesList, setLeavePoliciesList] = useState([]);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        setSelectedEntityIds([]);
    };

    const fetchCompany = () => {
        CompanyService.find({
            query: {
                _id: userData?.user?.companyId
            },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setCompanyDetail(res?.data);
                setTotalCompany(res?.total);
                if (res?.data[0]?.division?.length > 0) {
                    setAllDivisionList(res?.data[0]?.division);
                }
            })
            .catch((error) => {
                toast.error(error, toastSettings);
            });
    };

    const fetchAllGrade = async (value) => {
        await GradeService.find({
            query: {
                $skip: 0,
                $limit: 100,
                $sort: { createdAt: -1 },
                companyId: userData?.user?.companyId
            },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setallGradeList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const fetchAllDesignations = async (value) => {
        await DesignationService.find({
            query: {
                $skip: 0,
                $limit: 100,
                $sort: { createdAt: -1 },
                companyId: userData?.user?.companyId
            },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setallDesignationList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const fetchAllDepartments = () => {
        DepartmentService.find({
            query: { companyId: userData?.user?.companyId, $skip: 0, $limit: 100, $sort: { createdAt: -1 } },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then(async (res) => {
                setDepartmentList(res.data);
                setTotalDepartment(res.total);
            })
            .catch((error) => {
                setLoader(false);
            });
    };

    const handleDivision = (e, val) => {
        if (e.target.checked) {
            setSelectedDivision([...selectedDivision, val]);
        } else {
            const filterList = selectedDivision.filter((item) => item !== val);
            setSelectedDivision(filterList);
        }
    };

    const submitClubbingDivision = () => {
        if (selectedDivision?.length > 0) {
            const data = {
                entityType: selectedOption,
                entityId: selectedDivision
            };
            setLoader(true);
            LeavePolicyService.patch(
                policy_Id,
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
                    toast.success(`${selectedOption} wise clubbed successfully.`);
                })
                .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
        } else {
            toast.error('Please select division');
        }
    };

    const handleEntities = (e, val) => {
        if (e.target.checked) {
            setSelectedEntityIds([...selectedEntityIds, val?._id]);
        } else {
            const filterEntity = selectedEntityIds.filter((item) => item?._id !== val?._id);
            setSelectedEntityIds(filterEntity);
        }
    };

    const submitClubbing = () => {
        if (selectedEntityIds?.length > 0) {
            const uniqueEntityIds = [...new Set(selectedEntityIds)];
            const data = {
                entityType: selectedOption,
                entityId: uniqueEntityIds
            };
            setLoader(true);
            LeavePolicyService.patch(
                policy_Id,
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
                    toast.success(`${selectedOption} wise clubbed successfully.`);
                    fetchLeavePolicyById();
                })
                .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
        } else {
            toast.error(`Please select ${selectedOption}`);
        }
    };

    // const fetchAllGetRequest = () => {
    //     const data = {
    //         headers: { Authorization: `Bearer ${TokenService.getLocalAccessToken()}` }
    //     };
    //     if (userData?.user?.companyId) {
    //         const company_id = {
    //             query: {
    //                 companyId: userData?.user?.companyId
    //             }
    //         };
    //         setLoader(true);
    //         try {
    //             Promise.allSettled([
    //                 UserService.find({
    //                     query: {
    //                         status: 'active',
    //                         companyId: userData?.user?.companyId
    //                     },
    //                     ...data
    //                 }),
    //                 AttendanceService.find({ ...data, ...company_id }),
    //                 LeaveService.find({ ...data, ...company_id }),
    //                 ReimbursementService.find({ ...data, ...company_id }),
    //                 ResignationService.find({ ...data, ...company_id }),
    //                 AdvanceSalaryService.find({ ...data, ...company_id })
    //             ])
    //                 .then((result) => {
    //                     setLoader(false);
    //                     console.log(result,"::::::::::all promise success result")
    //                 })
    //                 .catch((error) => {
    //                     setLoader(false);
    //                     setTotal([]);
    //                 });
    //         } catch (error) {
    //             setLoader(false);
    //         }
    //     }
    // };

    const fetchLeavePolicyById = async () => {
        LeavePolicyService.find({
            query: { companyId: userData?.user?.companyId, _id: policy_Id, $populate: ['entityId'] },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then(async (res) => {
                setLeavePoliciesList(res?.data);
                if (res?.data?.length > 0) {
                    setSelectedOption(res?.data[0]?.entityType);
                }
            })
            .catch((error) => {
                console.warn(error);
            });
    };

    const fetchAll = async () => {
        fetchCompany();
        fetchAllDepartments();
        fetchAllGrade();
        fetchAllDesignations();
        fetchLeavePolicyById();
    };

    useEffect(() => {
        fetchAll();
    }, []);

    return (
        <div>
            <div className="row w-100">
                <div className="col-md-3">
                    <div className="policy-app-attribute">
                        <p className="pl-3 pt-3">Select any one</p>
                        <ul>
                            <li>
                                <label>
                                    <input type="radio" name="a_type" value="company" onChange={handleOptionChange} className="mr-1" /> Company
                                </label>
                            </li>
                            {/* <li>
                                <label>
                                    <input type="radio" name="a_type" value="division" onChange={handleOptionChange} className="mr-1" /> Division
                                </label>
                            </li> */}
                            <li>
                                <label>
                                    <input type="radio" name="a_type" value="designation" onChange={handleOptionChange} className="mr-1" /> Designation
                                </label>
                            </li>
                            <li>
                                <label>
                                    <input type="radio" name="a_type" value="grade" onChange={handleOptionChange} className="mr-1" /> Grade
                                </label>
                            </li>
                            <li>
                                <label>
                                    <input type="radio" name="a_type" value="department" onChange={handleOptionChange} className="mr-1" /> Department
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="plocy-desc-sec">
                        {selectedOption && (
                            <div>
                                {selectedOption === 'company' && (
                                    <>
                                        <h4>{selectedOption}</h4>
                                        <input type="text" className="form-control" value={companyDetail[0]?.name} readonly style={{ backgroundColor: '#e9e9e9', 'pointer-events': 'none' }} />
                                    </>
                                )}
                                {selectedOption === 'division' && (
                                    <>
                                        <h4>{selectedOption}</h4>
                                        <form>
                                            <div className="row">
                                                {allDivisionList &&
                                                    allDivisionList.length > 0 &&
                                                    allDivisionList.map((data) => {
                                                        return (
                                                            <div className="col-md-6">
                                                                <input type="checkbox" className="form-check-input" onChange={(e) => handleDivision(e, data)} value={data} />
                                                                &nbsp;{data}
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12 pl-0">
                                                    <button type="button" className="btn btn-primary mt-5" onClick={submitClubbingDivision}>
                                                        Submit
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </>
                                )}

                                {selectedOption === 'designation' && (
                                    <>
                                        <h4>{selectedOption}</h4>
                                        <form>
                                            <div className="row">
                                                {allDesignationList &&
                                                    allDesignationList.length > 0 &&
                                                    allDesignationList.map((data) => {
                                                        return (
                                                            <div className="col-md-6">
                                                                <label for={data?._id}>
                                                                    <input type="checkbox" className="form-check-input" onChange={(e) => handleEntities(e, data)} value={data?._id} />
                                                                    &nbsp;{data?.name}
                                                                </label>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12 pl-0">
                                                    <button type="button" className="btn btn-primary mt-5" onClick={submitClubbing}>
                                                        Submit
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </>
                                )}

                                {selectedOption === 'grade' && (
                                    <>
                                        <h4>{selectedOption}</h4>
                                        <form>
                                            <div className="row">
                                                {allGradeList &&
                                                    allGradeList.length > 0 &&
                                                    allGradeList.map((data) => {
                                                        return (
                                                            <div className="col-md-6">
                                                                <label for={data?._id}>
                                                                    <input type="checkbox" className="form-check-input" onChange={(e) => handleEntities(e, data)} value={data?._id} />
                                                                    &nbsp;{data?.name}
                                                                </label>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12 pl-0">
                                                    <button type="button" className="btn btn-primary mt-5" onClick={submitClubbing}>
                                                        Submit
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </>
                                )}

                                {selectedOption === 'department' && (
                                    <>
                                        <h4>{selectedOption}</h4>
                                        <form>
                                            <div className="row">
                                                {departmentList &&
                                                    departmentList.length > 0 &&
                                                    departmentList.map((data) => {
                                                        return (
                                                            <div className="col-md-6">
                                                                <label for={data?._id}>
                                                                    <input type="checkbox" className="form-check-input" onChange={(e) => handleEntities(e, data)} value={data?._id} />
                                                                    &nbsp;{data?.name}
                                                                </label>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12 pl-0">
                                                    <button type="button" className="btn btn-primary mt-5" onClick={submitClubbing}>
                                                        Submit
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <hr />
                    <div className="mt-5">
                        <h4>Clubbing by {selectedOption}</h4>
                        {leavePoliciesList[0]?.entityId?.length > 0 ? (
                            leavePoliciesList[0]?.entityId?.map((data, index) => {
                                return (
                                    <div class="alert alert-primary" role="alert">
                                        {data?.name}
                                    </div>
                                );
                            })
                        ) : (
                            <div class="alert alert-primary" role="alert">
                                No clubbing entry found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PolicyApplicability;
