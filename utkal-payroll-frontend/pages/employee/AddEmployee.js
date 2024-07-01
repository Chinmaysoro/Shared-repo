import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { userActions } from '../../redux/actions/user.actions';
import { employeeSchema } from '../../redux/helpers/validations';
import TokenService from '../../redux/services/token.service';
import { UserService, DepartmentService, DesignationService, CompanyService } from '../../redux/services/feathers/rest.app';
import { getUser } from '../../redux/helpers/user';

const AddEmployee = (props) => {
    const dispatch = useDispatch();
    const userData = getUser();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        password: '',
        userUniqueId: '',
        gender: 'Male',
        beneficiaryName: '',
        accountNumber: '',
        ifsc: '',
        pan: '',
        annualSalary: '',
        location: '',
        emergencyPhoneNum: '',
        relativeName: '',
        relation: '',
        PF: false,
        ESIC: false,
        doj: '',
        // manager: '',
        role: 1
    });
    const [openAdditionalDetail, setopenAdditionalDetail] = useState(false);
    const [managerName, setManagerName] = useState('');
    const [visibleUsersDropdown, setVisibleUsersDropdown] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [userValues, setUserValues] = useState(null);
    const [loader, setLoader] = useState(false);
    const [departmentValues, setDepartmentValues] = useState(null);
    const [visibleDepartmentDropdown, setvisibleDepartmentDropdown] = useState(false);
    const [designationValues, setDesignationValues] = useState(null);
    const [visibleDesignationDropdown, setvisibleDesignationDropdown] = useState(false);
    const [companyValues, setCompanyValues] = useState(null);
    const [visibleCompanyDropdown, setVisibleCompanyDropdown] = useState(false);
    const [allDepartmentList, setallDepartmentList] = useState([]);
    const [allDesignationList, setallDesignationList] = useState([]);
    const [allCompanyList, setAllCompanyList] = useState([]);

    const handleAditionalDetails = () => {
        setopenAdditionalDetail(!openAdditionalDetail);
    };

    const addEmployee = (values) => {
        let data = {
            ...values
        };
        if (userValues !== null) {
            data['manager'] = userValues?._id;
        }
        if (departmentValues !== null) {
            data['departmentId'] = departmentValues?._id;
        }
        if (designationValues !== null) {
            data['designationId'] = designationValues?._id;
        }
        if (props?.title == 'Add HR') {
            data['role'] = 2;
        }
        data['companyId'] = companyValues?._id ? companyValues?._id : userData?.user?.companyId;
        setLoader(true);
        UserService.create(data, {
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                toast.success('***Employee added successfully.');
                props?.setVisible();
                props?.getAllEmployee();
            })
            .catch((error) => {
                setLoader(false);
                toast.error(error.message);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setManagerName(value);
        if (name === 'manager') {
            getAllUser(value);
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

    return (
        <Formik
            enableReinitialize
            initialValues={formData}
            validationSchema={employeeSchema}
            onSubmit={(values, event) => {
                addEmployee(values);
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
                                    <Field name="phone" type="number" placeholder="Enter mobile number" className="form-control" min={0} />
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
                                        Password <sup className="mandatory">*</sup>
                                    </label>
                                    <Field name="password" type="password" placeholder="Enter password" className="form-control" />
                                    {errors.password && touched.password ? (
                                        <p className="text-danger text-monospace mt-2">
                                            <small>{errors.password}</small>
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group mb-3">
                                    <label className="form-label">
                                        Confirm Password <sup className="mandatory">*</sup>
                                    </label>
                                    <Field name="cnfpassword" type="password" placeholder="Confirm password" className="form-control" />
                                    {errors.cnfpassword && touched.cnfpassword ? (
                                        <p className="text-danger text-monospace mt-2">
                                            <small>{errors.cnfpassword}</small>
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
                            {props?.title !== 'Add HR' ? (
                                <div className="col-md-12">
                                    <button type="button" className="btn btn-primary" onClick={() => handleAditionalDetails()}>
                                        Additional Details
                                    </button>
                                </div>
                            ) : null}
                            {openAdditionalDetail ? (
                                <>
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
                                                <Field type="text" placeholder="Enter company name" className="form-control" name="companyId" id="companyId" onKeyUp={handleChange} />
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
                                                <Field type="text" placeholder="Enter department name" className="form-control" name="departmentId" id="departmentId" onKeyUp={handleChange} />
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
                                </>
                            ) : null}
                        </div>
                        <div className="d-flex justify-content-end">
                            <button type="button" className="btn btn-warning" onClick={props.setVisible}>
                                Cancel
                            </button>
                            &nbsp;
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default AddEmployee;
