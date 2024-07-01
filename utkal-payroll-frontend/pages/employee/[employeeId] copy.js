import React, { useState, Fragment, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
// import { userActions } from '../../redux/actions/user.actions';
import { toast } from 'react-toastify';
import TokenService from '../../redux/services/token.service';
import { employeeUpdateSchema } from '../../redux/helpers/validations';
import { UserService, DepartmentService, DesignationService, CompanyService } from '../../redux/services/feathers/rest.app';

const AddEmployee = (props) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [visibleUsersDropdown, setVisibleUsersDropdown] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [userValues, setUserValues] = useState(null);
    const [departmentValues, setDepartmentValues] = useState(null);
    const [designationValues, setDesignationValues] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [companyValues, setCompanyValues] = useState(null);
    const [managerName, setManagerName] = useState('');
    const [formData, setFormData] = useState({});
    const [visibleDepartmentDropdown, setvisibleDepartmentDropdown] = useState(false);
    const [allDepartmentList, setallDepartmentList] = useState([]);
    const [visibleDesignationDropdown, setvisibleDesignationDropdown] = useState(false);
    const [allDesignationList, setallDesignationList] = useState([]);
    const [visibleCompanyDropdown, setVisibleCompanyDropdown] = useState(false);
    const [allCompanyList, setAllCompanyList] = useState([]);

    const getUserProfile = () => {
        const id = router?.query?.employeeId;
        UserService.find({
            query: {
                _id: id,
                $populate: ['designationId', 'departmentId', 'companyId', 'manager']
            },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                if (res) {
                    setUserInfo(res?.data[0]);
                    const data = {...res?.data[0]};
                    if(res?.data[0]?.manager){
                        data["manager"] = `${res?.data[0]?.manager?.firstName} ${res?.data[0]?.manager?.lastName}`;
                    }
                    if(res?.data[0]?.companyId){
                        data["companyId"] = `${res?.data[0]?.companyId?.name}`;
                    }
                    if(res?.data[0]?.departmentId){
                        data["departmentId"] = `${res?.data[0]?.departmentId?.name}`;
                    }
                    if(res?.data[0]?.designationId){
                       data["designationId"] = `${res?.data[0]?.designationId?.name}`;
                    }
                    setFormData(data);
                }
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    const updateEmployee = (values) => {
        const data = { ...values };
        const userId = values?._id;
        if (userValues !== null || userInfo?.manager) {
            data['manager'] = userInfo?.manager?._id ? userInfo?.manager?._id : userValues?._id;
        }
        if (companyValues !== null || userInfo?.companyId) {
            data['companyId'] = userInfo?.companyId?._id ? userInfo?.companyId?._id : companyValues?._id;
        }
        if (departmentValues !== null || userInfo?.departmentId) {
            data['departmentId'] = userInfo?.departmentId?._id ? userInfo?.departmentId?._id : departmentValues?._id;
        }
        if (designationValues !== null || userInfo?.designationId) {
            data['designationId'] = userInfo?.designationId?._id ? userInfo?.designationId?._id : designationValues?._id;
        }
        delete data['__v'];
        delete data['_id'];
        delete data['deleted'];
        UserService.patch(
            userId,
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
                toast.success('User details updated successfully.');
                getUserProfile();
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setManagerName(value);
        if (name === 'manager') {
            fetchAllUsers(value);
        }
        if (name === 'departmentId') {
            fetchAllDepartments(value);
        }
        if (name === 'designationId') {
            fetchAllDesignations(value);
        }
        if (name === 'companyId') {
            fetchAllCompanies(value);
        }
    };

    const fetchAllUsers = async (value) => {
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
                $sort: { createdAt: -1 }
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
    const fetchAllDepartments = async (value) => {
        await DepartmentService.find({
            query: {
                $skip: 0,
                $limit: 100,
                $sort: { createdAt: -1 }
            },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setvisibleDepartmentDropdown(true);
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
                $sort: { createdAt: -1 }
            },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setvisibleDesignationDropdown(true);
                setallDesignationList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const fetchAllCompanies = async (value) => {
        await CompanyService.find({
            query: {
                $skip: 0,
                $limit: 100,
                $sort: { createdAt: -1 }
            },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setVisibleCompanyDropdown(true);
                setAllCompanyList(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const setFormValues = (type, data) => {
        if (type === 'manager') {
            setUserValues(data);
            setVisibleUsersDropdown(false);
        }
        if (type === 'departmentId') {
            setDepartmentValues(data);
            setvisibleDepartmentDropdown(false);
        }
        if (type === 'designationId') {
            setDesignationValues(data);
            setvisibleDesignationDropdown(false);
        }
        if (type === 'companyId') {
            setCompanyValues(data);
            setVisibleCompanyDropdown(false);
        }
    };

    const fetchAll = async () => {
        await getUserProfile();
    };

    useEffect(() => {
        fetchAll();
    }, []);

    return (
        <Fragment>
            <div className="card p-4">
                <Formik
                    enableReinitialize
                    initialValues={formData}
                    validationSchema={employeeUpdateSchema}
                    onSubmit={(values, event) => {
                        updateEmployee(values);
                    }}
                >
                    {({ values, errors, touched, setFieldTouched, setFieldValue }) => (
                        <Form autoComplete="off">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className="form-label">
                                                First Name <sup className="mandatory">*</sup>
                                            </label>
                                            <Field name="firstName" type="text" placeholder="Enter first name" className="form-control" />
                                            {errors.firstName && touched.firstName ? (
                                                <p className="text-danger text-monospace mt-2">
                                                    <small>{errors.firstName}</small>
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className="form-label">
                                                Last Name <sup className="mandatory">*</sup>
                                            </label>
                                            <Field name="lastName" type="text" placeholder="Enter last name" className="form-control" />
                                            {errors.lastName && touched.lastName ? (
                                                <p className="text-danger text-monospace mt-2">
                                                    <small>{errors.lastName}</small>
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className="form-label">
                                                Phone <sup className="mandatory">*</sup>
                                            </label>
                                            <Field name="phone" type="number" placeholder="Enter mobile number" className="form-control" min={0}/>
                                            {errors.phone && touched.phone ? (
                                                <p className="text-danger text-monospace mt-2">
                                                    <small>{errors.phone}</small>
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className="form-label">
                                                email <sup className="mandatory">*</sup>
                                            </label>
                                            <Field name="email" type="email" placeholder="Enter email" className="form-control" />
                                            {errors.email && touched.email ? (
                                                <p className="text-danger text-monospace mt-2">
                                                    <small>{errors.email}</small>
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className="form-label">
                                                Emp ID <sup className="mandatory">*</sup>
                                            </label>
                                            <Field name="userUniqueId" type="text" placeholder="Enter emp id" className="form-control" />
                                            {errors.userUniqueId && touched.userUniqueId ? (
                                                <p className="text-danger text-monospace mt-2">
                                                    <small>{errors.userUniqueId}</small>
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className="form-label">
                                                Gender <sup className="mandatory">*</sup>
                                            </label>
                                            <Field name="gender" as="select" className="form-control pt-2">
                                                {[
                                                    { label: 'Male', value: 'Male' },
                                                    { label: 'Female', value: 'Female' },
                                                    { label: 'Others', value: 'Others' }
                                                ].map(({ label, value }) => (
                                                    <option key={value} value={label}>
                                                        {label}
                                                    </option>
                                                ))}
                                            </Field>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className="form-label">Beneficiary Name</label>
                                            <Field name="beneficiaryName" type="text" placeholder="Beneficiary Name" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className="form-label">Account Number</label>
                                            <Field name="accountNumber" type="text" placeholder="Account Number" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className="form-label">IFSC</label>
                                            <Field name="ifsc" type="text" placeholder="IFSC" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className="form-label">PAN</label>
                                            <Field name="pan" type="text" placeholder="PAN" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className="form-label">Annual Salary</label>
                                            <Field name="annualSalary" type="text" placeholder="Annual Salary" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className="form-label">Location</label>
                                            <Field name="location" type="text" placeholder="Location" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className="form-label">Emergency Phone</label>
                                            <Field name="emergencyPhoneNum" type="text" placeholder="Emergency Phone" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className="form-label">Relative Name</label>
                                            <Field name="relativeName" type="text" placeholder="Relative Name" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className="form-label">Relation</label>
                                            <Field name="relation" type="text" placeholder="Relation" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-1">
                                        <div className="form-group mb-3">
                                            <label className="form-label">PF</label>
                                            <Field name="PF" type="checkbox" placeholder="PF" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-1">
                                        <div className="form-group mb-3">
                                            <label className="form-label">ESIC</label>
                                            <Field name="ESIC" type="checkbox" placeholder="ESIC" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group mb-3">
                                            <label className="form-label">Date of joining</label>
                                            <Field name="doj" type="date" placeholder="Date of joining" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className="form-label">Manager</label>
                                            <div className="form-group">
                                                <Field type="text" placeholder="Enter manager name" className="form-control" name="manager" id="manager" onKeyUp={handleChange} />
                                                {visibleUsersDropdown && allUsers.length > 0 ? (
                                                    <ul className="t_ul" style={{ width: '95%' }}>
                                                        {allUsers.map((user, index) => {
                                                            return (
                                                                <li
                                                                    key={`key-${index}`}
                                                                    onClick={() => {
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
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className="form-label">Company</label>
                                            <div className="form-group">
                                                <Field type="text" placeholder="Enter company name" className="form-control" name="companyId" id="companyId" onKeyUp={handleChange}/>
                                                {visibleCompanyDropdown && allCompanyList.length > 0 ? (
                                                    <ul className="t_ul" style={{ width: '95%' }}>
                                                        {allCompanyList.map((company, index) => {
                                                            return (
                                                                <li
                                                                    key={`key-${index}`}
                                                                    onClick={() => {
                                                                        company;
                                                                        setFormValues('companyId', company);
                                                                        setFieldTouched('companyId', true);
                                                                        setFieldValue('companyId', `${company?.name}`);
                                                                    }}
                                                                >
                                                                    {`${company?.name} `}
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className="form-label">Department</label>
                                            <div className="form-group">
                                                <Field type="text" placeholder="Enter department name" className="form-control" name="departmentId" id="departmentId" onKeyUp={handleChange}/>
                                                {visibleDepartmentDropdown && allDepartmentList.length > 0 ? (
                                                    <ul className="t_ul" style={{ width: '95%' }}>
                                                        {allDepartmentList.map((department, index) => {
                                                            return (
                                                                <li
                                                                    key={`key-${index}`}
                                                                    onClick={() => {
                                                                        setFormValues('departmentId', department);
                                                                        setFieldTouched('departmentId', true);
                                                                        setFieldValue('departmentId', `${department?.name}`);
                                                                    }}
                                                                >
                                                                    {`${department?.name}`}
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label className="form-label">Designation</label>
                                            <div className="form-group">
                                                <Field type="text" placeholder="Enter designation name" className="form-control" name="designationId" id="designationId" onKeyUp={handleChange} />
                                                {visibleDesignationDropdown && allDesignationList.length > 0 ? (
                                                    <ul className="t_ul" style={{ width: '95%' }}>
                                                        {allDesignationList.map((designation, index) => {
                                                            return (
                                                                <li
                                                                    key={`key-${index}`}
                                                                    onClick={() => {
                                                                        setFormValues('designationId', designation);
                                                                        setFieldTouched('designationId', true);
                                                                        setFieldValue('designationId', `${designation?.name}`);
                                                                    }}
                                                                >
                                                                    {`${designation?.name}`}
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <button type="submit" className="btn btn-primary">
                                        Update
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Fragment>
    );
};

export default AddEmployee;
