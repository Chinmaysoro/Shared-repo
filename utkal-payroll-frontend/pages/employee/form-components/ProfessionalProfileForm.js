import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { proffessionalProfileSchema } from '../../../redux/helpers/validations';
import { getUser } from '../../../redux/helpers/user';
import { UserService, DepartmentService, DesignationService, GradeService, CompanyService } from '../../../redux/services/feathers/rest.app';
import TokenService from '../../../redux/services/token.service';

const ProfessionalProfileForm = ({ onSubmit, initialValues, setManagerId, type, createdEmployeeResponse }) => {
    const userData = getUser();
    const [formValues, setIntialValues] = useState(initialValues);
    const [managerName, setManagerName] = useState('');
    const [loader, setLoader] = useState(false);
    const [allDepartmentList, setallDepartmentList] = useState([]);
    const [allDesignationList, setallDesignationList] = useState([]);
    const [allGradeList, setallGradeList] = useState([]);
    const [allSubDepartmentList, setallSubDepartmentList] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [visibleUsersDropdown, setVisibleUsersDropdown] = useState(false);
    const [userValues, setUserValues] = useState(null);
    const [allLocationList, setAllLocationList] = useState([]);
    const [allDivisionList, setAllDivisionList] = useState([]);
    const [companyName, setCompanyName] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Assuming 'dob' is the name of the date fieldName of Organization
        // Handle other input fields here
        setIntialValues((prevData) => ({
            ...prevData,
            [name]: value
        }));
        // console.log(formValues,'::::::::::::::::formValues')
    };
    const handleSubmit = (values) => {
        // Handle form submission here
        console.log(values);
    };
    const handleUserSelection = (selectedUserId) => {
        setManagerId(selectedUserId);
    };
    const fetchAllDepartments = async (value) => {
        await DepartmentService.find({
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
                setallDepartmentList(res.data);
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
    const fetchAllLocationGradeByCompany = () => {
        setLoader(true);
        CompanyService.find({
            query: { _id: userData?.user?.companyId, $sort: { createdAt: -1 } },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                if (res?.data[0]?.location?.length > 0) {
                    setAllLocationList(res?.data[0]?.location);
                }
                if (res?.data[0]?.division?.length > 0) {
                    setAllDivisionList(res?.data[0]?.division);
                }
            })
            .catch((error) => {
                setLoader(false);
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
    const getSubDepartment = async (value) => {
        await DepartmentService.find({
            query: {
                $skip: 0,
                $limit: 100,
                $sort: { createdAt: -1 },
                companyId: userData?.user?.companyId,
                parentId: value,
                childDepartment: true
            },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setallSubDepartmentList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    // const handleInputChange = (e) => {
    //     const { name, value, type } = e.target;
    //     const newValue = type === 'file' ? e.target.files[0] : value;

    //     setFormData((prevData) => ({
    //         ...prevData,
    //         [name]: newValue
    //     }));
    // };
    const setFormValues = (type, data) => {
        if (type === 'manager') {
            setUserValues(data);
            setVisibleUsersDropdown(false);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setManagerName(value);
        if (name === 'manager') {
            getAllUser(value);
        }
    };
    const getAllUser = async (value) => {
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
                    }
                ],
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
                setVisibleUsersDropdown(true);
                setAllUsers(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const fetchAll = async () => {
        await fetchAllDepartments();
        await fetchAllDesignations();
        await fetchAllGrade();
        await fetchAllLocationGradeByCompany();
        await fetchCompany();
    };
    const fetchCompany = async () => {
        if (userData?.user?.companyId) {
            setLoader(true);
            await CompanyService.find({
                query: { _id: userData?.user?.companyId },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setLoader(false);
                    setCompanyName(res?.data[0].name);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);
    return (
        <div>
            <div className="emp_header">
                <h5>Professional Detail</h5>
                {/* <div class="button-container">
                            <button className="btn btn-light">Previous</button>
                            <button className="btn btn-primary">Save & Next</button>
                        </div> */}
            </div>
            <Formik
                initialValues={formValues}
                validationSchema={proffessionalProfileSchema}
                onSubmit={(values, event) => {
                    onSubmit(values, 'proffessional');
                }}
            >
                {({ values, errors, touched, setFieldTouched, setFieldValue }) => (
                    <Form className="form-card">
                        <div className="row">
                            <div className="col-md-4">
                                <label className="form-label w-100">
                                    Company
                                    <Field type="text" className="form-control" value={companyName} readonly style={{ backgroundColor: '#e9e9e9', 'pointer-events': 'none' }} />
                                    {/* <ErrorMessage name="doj" component="div" className="error" /> */}
                                </label>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label w-100">
                                    Designation*
                                    <Field as="select" name="designationId" className="form-control">
                                        <option value="" label="Select a designation" />
                                        {allDesignationList.map((designation, index) => (
                                            <option key={`key-${index}`} value={designation._id}>
                                                {designation.name}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="designationId" component="div" className="error" />
                                </label>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label w-100">
                                    Department*
                                    <Field
                                        as="select"
                                        name="departmentId"
                                        className="form-control"
                                        value={formValues.departmentId}
                                        onInput={(e) => {
                                            handleInputChange(e);
                                            // Call the getSubDepartment function here with the selected value
                                            getSubDepartment(e.target.value);
                                        }}
                                    >
                                        <option value="" label="Select a department" />
                                        {allDepartmentList.map((department, index) => (
                                            <option key={`key-${index}`} value={department._id}>
                                                {department.name}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="departmentId" component="div" className="error" />
                                </label>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label w-100">
                                    Sub-department
                                    <Field as="select" name="subDepartmentId" className="form-control">
                                        <option value="" label="Select sub-department" />
                                        {allSubDepartmentList.map((subDept, index) => (
                                            <option key={`key-${index}`} value={subDept._id}>
                                                {subDept.name}
                                            </option>
                                        ))}
                                    </Field>
                                </label>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label w-100">
                                    Location
                                    <Field as="select" name="location" className="form-control">
                                        <option value="" label="Select location" />
                                        {allLocationList &&
                                            allLocationList?.length > 0 &&
                                            allLocationList.map((location, index) => (
                                                <option key={`key-${index}`} value={location}>
                                                    {location}
                                                </option>
                                            ))}
                                    </Field>
                                </label>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label w-100">
                                    Division
                                    <Field as="select" name="division" className="form-control">
                                        <option value="" label="Select division" />
                                        {allDivisionList &&
                                            allDivisionList?.length > 0 &&
                                            allDivisionList.map((division, index) => (
                                                <option key={`key-${index}`} value={division}>
                                                    {division}
                                                </option>
                                            ))}
                                    </Field>
                                </label>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label w-100">
                                    Grade
                                    <Field as="select" name="gradeId" className="form-control">
                                        <option value="" label="Select a grade" />
                                        {allGradeList.map((grade, index) => (
                                            <option key={`key-${index}`} value={grade._id}>
                                                {grade.name}
                                            </option>
                                        ))}
                                    </Field>
                                </label>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label w-100">
                                    Reporting Manager's Name
                                    <Field type="text" placeholder="Enter manager name" className="form-control" name="manager" id="manager" onKeyUp={handleChange} value={values.manager} />
                                    <i className="pi pi-fw pi-search search-mnger"></i>
                                    {visibleUsersDropdown && allUsers.length > 0 ? (
                                        <ul className="t_ul" style={{ width: '95%' }}>
                                            {allUsers.map((user, index) => {
                                                return (
                                                    <li
                                                        key={`key-${index}`}
                                                        onClick={() => {
                                                            handleUserSelection(user._id);
                                                            setFormValues('manager', user);
                                                            setFieldTouched('manager', true);
                                                            setFieldValue('manager', `${user?.firstName} ${user?.lastName}`);
                                                        }}
                                                    >
                                                        {`${user?.firstName} ${user?.lastName}`}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : null}
                                </label>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label w-100">
                                    Employment Type
                                    <Field as="select" name="employmentStatus" className="form-control">
                                        <option value="">Select</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="contract">Contract</option>
                                        <option value="probation">Probation</option>
                                    </Field>
                                    {/* <ErrorMessage name="employmentStatus" component="div" className="error" /> */}
                                </label>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label w-100">
                                    Date of Hire
                                    <Field type="date" name="doj" className="form-control" />
                                    {/* <ErrorMessage name="doj" component="div" className="error" /> */}
                                </label>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label w-100">
                                    Work Email ID
                                    <Field type="email" name="workMail" className="form-control" />
                                </label>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label w-100">
                                    CUG No
                                    <Field type="text" name="cugNo" className="form-control" />
                                </label>
                            </div>
                            {type === 'update' && (
                                <div className="col-md-4">
                                    <label className="form-label w-100">
                                        Emp ID
                                        <Field type="text" name="empId" className="form-control" />
                                    </label>
                                </div>
                            )}
                            <div className="col-md-4">
                                <label className="form-label w-100">
                                    Biometric id
                                    <Field type="text" name="biometricId" className="form-control" />
                                </label>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label w-100">
                                    PAN No
                                    <Field type="text" name="pan" className="form-control" />
                                </label>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label w-100">
                                    Aadhaar No
                                    <Field type="number" min="0" name="aadhar" className="form-control" />
                                </label>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label w-100">
                                    UAN No
                                    <Field type="text" name="uan" className="form-control" />
                                </label>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label w-100">
                                    ESIC No
                                    <Field type="text" name="esicNo" className="form-control" />
                                </label>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label w-100">
                                    Voter ID
                                    <Field type="text" name="voter" className="form-control" />
                                </label>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label w-100">
                                    Driving license
                                    <Field type="text" min="0" name="drivingLicence" className="form-control" />
                                </label>
                            </div>

                            {/* <div className="col-md-4">
                            <label className="form-label w-100">
                                Request Approver Name*
                                <Field type="text" name="requestApprover" className="form-control" />
                                <ErrorMessage name="requestApprover" component="div" className="error" />
                            </label>
                        </div> */}
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <button type="submit" className="btn btn-primary mt-3">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ProfessionalProfileForm;
