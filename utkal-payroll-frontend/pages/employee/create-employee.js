import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import SimpleModal from '../components/Modal';
import AddEmployee from './AddEmployee';
import { useRouter } from 'next/router';
import BulkUploadEmployee from './BulkUpload';
import { userActions } from '../../redux/actions/user.actions';
import { getUser } from '../../redux/helpers/user';
import { UserService, UploadService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
import ProfessionalProfileForm from './form-components/ProfessionalProfileForm'; // Import your form components
import PersonalProfileForm from './form-components/PersonalProfileForm';
import FinancialDetailsForm from './form-components/FinancialDetailsForm';
import DocumentForm from './form-components/DocumentForm';
import CredentialForm from './form-components/CredentialForm';
import CompensationForm from './form-components/CompensationForm';
import EducationForm from './form-components/EducationForm';
import ExperienceForm from './form-components/ExperienceForm';
import FamilyForm from './form-components/FamilyForm';
const CreateEmployee = () => {
    const dispatch = useDispatch();
    const userData = getUser();
    const [visible, setVisible] = useState(false);
    const [nextButton, setNextButton] = useState(false);

    const [bulkUploadModal, setbulkUploadModal] = useState(false);
    const [title, setTitle] = useState('');
    const [employeeList, setEmployeeList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [extensionError, setExtensionError] = useState('');
    const [empId, setEmpId] = useState('');
    const [profilePicValues, setProfilePicValues] = useState({});
    const [panValues, setPanValues] = useState({});
    const [adharValues, setAadharValues] = useState({});
    const [voterValues, setVoterValues] = useState({});
    const [drivingLicenceValues, setDrivingLicenceValues] = useState({});
    const [formPersonalValues, setPersonalFormValues] = useState(null);
    const [managerId, setManagerId] = useState('');
    const [activeTabStatus, setActiveTabStatus] = useState('');
    const [proffessionalStatus, setProffessionalStatus] = useState('');
    const [educationStatus, setEducationStatus] = useState('');
    const [experienceStatus, setExperienceStatus] = useState('');
    const [familyStatus, setFamilyStatus] = useState('');
    const [financialStatus, setFinancialStatus] = useState('');
    const [documentStatus, setDocumentStatus] = useState('');
    const [credentialStatus, setCredentialStatus] = useState('');
    const [compensationStatus, setCompensationStatus] = useState('');
    const [createdEmployeeResponse, setCreatedEmployeeResponse] = useState({});
    const router = useRouter();
    const [formData, setFormData] = useState({
        personal: {
            firstName: '',
            middleName: '',
            lastName: '',
            gender: '',
            maritalStatus: '',
            email: '',
            phone: '',
            address: '',
            dob: '',
            bloodGroup: '',
            avatar: '',
            abbreviation: '',
            nationality: '',
            religion: '',
            emergencyPhoneNum: '',
            alternativePhoneNum: '',
            permanentAddress: ''
        },
        professional: {
            departmentId: '',
            designationId: '',
            gradeId: '',
            manager: '',
            doj: '',
            workMail: '',
            cugNo: '',
            empId: '',
            biometricId: '',
            employmentStatus: '',
            location: '',
            division: '',
            pan: '',
            aadhar: '',
            uan: '',
            esicNo: '',
            voter: '',
            drivingLicence: ''
        },
        financial: {
            bankName: '',
            ifsc: '',
            branch: '',
            accountNumber: ''
        },
        compensation: {
            payGroupId: '',
            monthlyCTC: '',
            annualCTC: ''
        },
        document: {
            pan: '',
            aadhar: '',
            uan: '',
            panFile: null,
            aadharFile: null,
            esicNo: '',
            voter: '',
            voterFile: null,
            drivingLicence: '',
            drivingLicenceFile: null
        },
        credential: {
            password: ''
        },
        education: {
            degree: '',
            university: '',
            board: '',
            yearOfPassing: '',
            percentage: '',
            grade: ''
        },
        experience: {
            orgName: '',
            startDate: '',
            endDate: '',
            designation: '',
            annualCTC: ''
        },
        family: {
            name: '',
            relation: '',
            dob: '',
            age: '',
            bloodGroup: ''
        }
        // ... other form data ...
    });
    useEffect(() => {});
    const setManagerRowId = (value) => {
        setFormData(value);
    };
    const [activeTab, setActiveTab] = useState('personal'); // Set the default active tab
    const handlePersonalProfileSubmit = (values) => {
        setFormData((prevData) => ({
            ...prevData,
            personal: values
        }));
        let data = {
            ...values
        };
        data['companyId'] = userData?.user?.companyId;
        if (values?.avatar !== '' || values?.avatar !== undefined) {
            data['avatar'] = profilePicValues.profilePic;
        }
        data['role'] = 1;
        setLoader(true);
        UserService.create(data, {
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                toast.success('Employee added successfully.');
                setActiveTab('professional');
                setActiveTabStatus('personal');
                setCreatedEmployeeResponse(res);
                setEmpId(res?._id);
            })
            .catch((error) => {
                setLoader(false);
                toast.error(error.message);
            });
    };
    const handleEmpFormSubmit = async (values, type) => {
        // Save professional data to formData
        let data = {
            ...values
        };
        const updatedEducationalDetails = [values];
        if (type == 'proffessional') {
            data['manager'] = managerId;
            if (data['manager'] === '') {
                const { manager, ...newData } = data;
                data = newData;
            }
            if (data['empId'] === '') {
                const { empId, ...newData } = data;
                data = newData;
            }
            setFormData((prevData) => ({
                ...prevData,
                professional: values
            }));
        } else if (type == 'financial') {
            setFormData((prevData) => ({
                ...prevData,
                financial: values
            }));
        } else if (type == 'education') {
            setFormData((prevData) => ({
                ...prevData,
                education: values
            }));
        } else if (type == 'family') {
            setFormData((prevData) => ({
                ...prevData,
                familyDetails: values
            }));
        } else if (type == 'credential') {
            setFormData((prevData) => ({
                ...prevData,
                credential: values
            }));
        } else if (type == 'document') {
            //console.log(values,":::::::::::values doci=ume 11111")
            setFormData((prevData) => ({
                ...prevData,
                document: values
            }));
            if (values?.panFile !== '' || values?.panFile !== undefined) {
                data['panFile'] = panValues.panFile;
            }
            if (values?.aadharFile !== '' || values?.aadharFile !== undefined) {
                data['aadharFile'] = adharValues.aadharFile;
            }
            if (values?.voterFile !== '' || values?.voterFile !== undefined) {
                data['voterFile'] = voterValues.voterFile;
            }
            if (values?.drivingLicenceFile !== '' || values?.drivingLicenceFile !== undefined) {
                data['drivingLicenceFile'] = drivingLicenceValues.drivingLicenceFile;
            }
        }

        if (empId !== '') {
            const existingEducationDetails = [];
            const existingPastExperienceDetails = [];
            const existingFamilyDetails = [];
            if (type == 'education' || type == 'experience' || type == 'family') {
                const queryData = {
                    _id: empId
                };

                try {
                    const userRecord = await UserService.find({
                        query: queryData,
                        headers: {
                            Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                        }
                    });
                    existingEducationDetails = userRecord?.data[0]?.educationalDetails || [];
                    existingPastExperienceDetails = userRecord?.data[0]?.pastExperience || [];
                    existingFamilyDetails = userRecord?.data[0]?.familyDetails || [];
                } catch (error) {}
                existingEducationDetails.push(values);
                existingPastExperienceDetails.push(values);
                existingFamilyDetails.push(values);
            }
            const apiRequest =
                type === 'education'
                    ? {
                          educationalDetails: existingEducationDetails
                      }
                    : type === 'experience'
                    ? {
                          pastExperience: existingPastExperienceDetails
                      }
                    : type === 'family'
                    ? {
                          familyDetails: existingFamilyDetails
                      }
                    : {
                          ...data
                      };
            UserService.patch(empId, apiRequest, {
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setLoader(false);
                    if (type == 'proffessional') {
                        toast.success('Professional  details updated successfully.');
                        setActiveTab('education');
                        setProffessionalStatus('proffessional');
                    } else if (type == 'education') {
                        setFormData((prevData) => ({
                            ...prevData,
                            education: {
                                degree: '',
                                university: '',
                                board: '',
                                yearOfPassing: '',
                                percentage: '',
                                grade: ''
                            }
                        }));
                        toast.success('Education details updated successfully.');
                        setActiveTab('education');
                        setEducationStatus('education');
                    } else if (type == 'experience') {
                        setFormData((prevData) => ({
                            ...prevData,
                            experience: {
                                orgName: '',
                                startDate: '',
                                endDate: '',
                                designation: '',
                                annualCTC: ''
                            }
                        }));
                        toast.success('Experience details updated successfully.');
                        setActiveTab('experience');
                        setExperienceStatus('experience');
                    } else if (type == 'family') {
                        setFormData((prevData) => ({
                            ...prevData,
                            family: {
                                name: '',
                                relation: '',
                                dob: '',
                                age: '',
                                bloodGroup: ''
                            }
                        }));
                        toast.success('Family Information updated successfully.');
                        setActiveTab('family');
                        setFamilyStatus('family');
                    } else if (type == 'financial') {
                        toast.success('Financial details updated successfully.');
                        setActiveTab('document');
                        setFinancialStatus('financial');
                    } else if (type == 'document') {
                        toast.success('Document details updated successfully.');
                        setActiveTab('document');
                        setDocumentStatus('document');
                    } else if (type == 'credential') {
                        toast.success('Credential updated successfully.');
                        setCredentialStatus('credential');
                        router.push('/employee');
                    }
                })
                .catch((error) => {
                    setLoader(false);
                    toast.error(error.message);
                });
        }
        // Switch to next tab or perform other actions
    };

    const handleFileInput = (e, type) => {
        setExtensionError('');
        const file = e.target.files[0];
        const fileName = file.name.replace(/ /g, '_');
        const fileExtension = fileName.split('.').pop();
        if (fileExtension === 'jpg' || fileExtension === 'JPG' || fileExtension === 'jpeg' || fileExtension === 'JPEG' || fileExtension === 'png' || fileExtension === 'PNG') {
            let formData = new FormData();
            formData.append('uri', file);
            setIsLoading(true);
            UploadService.create(formData, {
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`,
                    'content-type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setIsLoading(false);
                    if (type == 'profile') {
                        setProfilePicValues({
                            ...profilePicValues,
                            ['profilePic']: res.originalName
                        });
                    } else if (type == 'panFile') {
                        setPanValues({
                            ...panValues,
                            ['panFile']: res.originalName
                        });
                    } else if (type == 'aadharFile') {
                        setAadharValues({
                            ...adharValues,
                            ['aadharFile']: res.originalName
                        });
                    } else if (type == 'voterFile') {
                        setVoterValues({
                            ...voterValues,
                            ['voterFile']: res.originalName
                        });
                    } else if (type == 'drivingLicenceFile') {
                        setDrivingLicenceValues({
                            ...drivingLicenceValues,
                            ['drivingLicenceFile']: res.originalName
                        });
                    }
                })
                .catch((error) => {
                    setIsLoading(false);
                    console.log(error);
                });
        } else {
            setIsLoading(false);
            setExtensionError('Currently only jpg and png file are allowed.');
        }
    };

    const renderForm = () => {
        switch (activeTab) {
            case 'professional':
                return <ProfessionalProfileForm onSubmit={handleEmpFormSubmit} initialValues={formData.professional} setManagerId={setManagerId} type="create" createdEmployeeResponse={createdEmployeeResponse} />;
            case 'financial':
                return <FinancialDetailsForm onSubmit={handleEmpFormSubmit} initialValues={formData.financial} />;
            case 'education':
                return <EducationForm onSubmit={handleEmpFormSubmit} initialValues={formData.education} empId={empId} setActiveTab={setActiveTab} />;
            case 'experience':
                return <ExperienceForm onSubmit={handleEmpFormSubmit} initialValues={formData.experience} empId={empId} />;
            case 'family':
                return <FamilyForm onSubmit={handleEmpFormSubmit} initialValues={formData.family} empId={empId} />;
            case 'compensation':
                return <CompensationForm onSubmit={handleEmpFormSubmit} initialValues={formData.compensation} empId={empId} />;
            case 'document':
                return <DocumentForm onSubmit={handleEmpFormSubmit} handleFileInput={handleFileInput} initialValues={formData.document} empId={empId} />;
            case 'credential':
                return <CredentialForm onSubmit={handleEmpFormSubmit} handleFileInput={handleFileInput} initialValues={formData.credential} userEmail={formData.personal.email} empId={formData.professional.empId} />;
            default:
                return <PersonalProfileForm onSubmit={handlePersonalProfileSubmit} handleFileInput={handleFileInput} initialValues={formData.personal} />;
        }
    };

    return (
        <div className="row">
            <div className="col-md-3 pr-0">
                <ul className="emp_sidebar_menu">
                    <li className={activeTab === 'personal' ? 'active' : ''}>
                        <div className="radio">
                            <input id="radio-personal" name="radio" type="radio" checked={activeTab === 'personal'} onChange={() => setActiveTab('personal')} />
                            <label htmlFor="radio-personal" className="radio-label w-100">
                                {activeTabStatus === 'personal' && empId && <i className="pi pi-fw pi-check active_icon"></i>}

                                <span className="emp-sidebar-label"> Personal Profile </span>
                            </label>
                        </div>
                    </li>
                    <li className={empId ? (activeTab === 'professional' ? 'active' : '') : 'disabled'}>
                        <div className="radio">
                            <input
                                id="radio-professional"
                                name="radio"
                                type="radio"
                                checked={activeTab === 'professional'}
                                onChange={() => {
                                    if (empId) {
                                        setActiveTab('professional');
                                    }
                                }}
                                disabled={!empId}
                            />
                            <label htmlFor="radio-professional" className="radio-label w-100">
                                {proffessionalStatus === 'proffessional' && empId && <i className="pi pi-fw pi-check active_icon"></i>}
                                <span className="emp-sidebar-label"> Professional Profile </span>
                            </label>
                        </div>
                    </li>
                    <li className={empId ? (activeTab === 'education' ? 'active' : '') : 'disabled'}>
                        <div className="radio">
                            <input
                                id="radio-education"
                                name="radio"
                                type="radio"
                                checked={activeTab === 'education'}
                                onChange={() => {
                                    if (empId) {
                                        setActiveTab('education');
                                    }
                                }}
                                disabled={!empId}
                            />
                            <label htmlFor="radio-education" className="radio-label w-100">
                                {educationStatus === 'education' && empId && <i className="pi pi-fw pi-check active_icon"></i>}
                                <span className="emp-sidebar-label">Education Profile</span>
                            </label>
                        </div>
                    </li>
                    <li className={empId ? (activeTab === 'experience' ? 'active' : '') : 'disabled'}>
                        <div className="radio">
                            <input
                                id="radio-experience"
                                name="radio"
                                type="radio"
                                checked={activeTab === 'experience'}
                                onChange={() => {
                                    if (empId) {
                                        setActiveTab('experience');
                                    }
                                }}
                                disabled={!empId}
                            />
                            <label htmlFor="radio-experience" className="radio-label w-100">
                                {experienceStatus === 'experience' && empId && <i className="pi pi-fw pi-check active_icon"></i>}
                                <span className="emp-sidebar-label">Experience Profile</span>
                            </label>
                        </div>
                    </li>
                    <li className={empId ? (activeTab === 'family' ? 'active' : '') : 'disabled'}>
                        <div className="radio">
                            <input
                                id="radio-family"
                                name="radio"
                                type="radio"
                                checked={activeTab === 'family'}
                                onChange={() => {
                                    if (empId) {
                                        setActiveTab('family');
                                    }
                                }}
                                disabled={!empId}
                            />
                            <label htmlFor="radio-family" className="radio-label w-100">
                                {familyStatus === 'family' && empId && <i className="pi pi-fw pi-check active_icon"></i>}
                                <span className="emp-sidebar-label">Family Information</span>
                            </label>
                        </div>
                    </li>
                    <li className={empId ? (activeTab === 'financial' ? 'active' : '') : 'disabled'}>
                        <div className="radio">
                            <input
                                id="radio-financial"
                                name="radio"
                                type="radio"
                                checked={activeTab === 'financial'}
                                onChange={() => {
                                    if (empId) {
                                        setActiveTab('financial');
                                    }
                                }}
                                disabled={!empId}
                            />
                            <label htmlFor="radio-financial" className="radio-label w-100">
                                {financialStatus === 'financial' && empId && <i className="pi pi-fw pi-check active_icon"></i>}
                                <span className="emp-sidebar-label"> Financial Details </span>
                            </label>
                        </div>
                    </li>
                    <li className={empId ? (activeTab === 'document' ? 'active' : '') : 'disabled'}>
                        <div className="radio">
                            <input
                                id="radio-document"
                                name="radio"
                                type="radio"
                                checked={activeTab === 'document'}
                                onChange={() => {
                                    if (empId) {
                                        setActiveTab('document');
                                    }
                                }}
                                disabled={!empId}
                            />
                            <label htmlFor="radio-document" className="radio-label w-100">
                                {documentStatus === 'document' && empId && <i className="pi pi-fw pi-check active_icon"></i>}
                                <span className="emp-sidebar-label"> Document Details </span>
                            </label>
                        </div>
                    </li>
                    <li className={empId ? (activeTab === 'compensation' ? 'active' : '') : 'disabled'}>
                        <div className="radio">
                            <input
                                id="radio-compensation"
                                name="radio"
                                type="radio"
                                checked={activeTab === 'compensation'}
                                onChange={() => {
                                    if (empId) {
                                        setActiveTab('compensation');
                                    }
                                }}
                                disabled={!empId}
                            />
                            <label htmlFor="radio-compensation" className="radio-label w-100">
                                {compensationStatus === 'compensation' && empId && <i className="pi pi-fw pi-check active_icon"></i>}
                                <span className="emp-sidebar-label"> Compensation </span>
                            </label>
                        </div>
                    </li>
                    <li className={empId ? (activeTab === 'credential' ? 'active' : '') : 'disabled'}>
                        <div className="radio">
                            <input
                                id="radio-credential"
                                name="radio"
                                type="radio"
                                checked={activeTab === 'credential'}
                                onChange={() => {
                                    if (empId) {
                                        setActiveTab('credential');
                                    }
                                }}
                                disabled={!empId}
                            />
                            <label htmlFor="radio-credential" className="radio-label w-100">
                                {credentialStatus === 'credential' && empId && <i className="pi pi-fw pi-check active_icon"></i>}
                                <span className="emp-sidebar-label"> Credential </span>
                            </label>
                        </div>
                    </li>

                    {/* Other list items */}
                </ul>
            </div>
            <div className="col-md-9 pl-0">
                <div className="employee-form-section">{renderForm()}</div>
                {/* <div className="employee-form-section">


                    <div className="form-card">
                        <div className='row col-md-3 mb-4 mt-2'>
                        <button className="btn btn-primary">Download pdf <i class="layout-menuitem-icon pi pi-upload ml-2"></i></button>
                        </div>
                        <div className="row">
                            <div className="col-md-3">
                            <label>Employee detail <span className='text-danger'>*</span></label>
                            <button className="btn btn-light d-block import-btn">Import <i class="layout-menuitem-icon pi pi-upload ml-2"></i></button>
                            </div>
                            <div className="col-md-4 pl-0">
                                <label>First Name<span className='text-danger'>*</span></label>
                                <input type='text' className='form-control' placeholder='Enter first name'/>
                            </div>
                            <div className="col-md-4 pr-0">
                            <label>Last Name<span className='text-danger'>*</span></label>
                                <input type='text' className='form-control' placeholder='Enter last name'/>
                            </div>


                        </div>
                        <div className='row mt-4'>
                        <div className="col-md-6">
                            <label>Email ID<span className='text-danger'>*</span></label>
                            <input type='email' className='form-control' placeholder='Enter email'/>
                            </div>
                            <div className="col-md-6">
                            <label>Gender<span className='text-danger'>*</span></label>
                           <div className='d-flex'>
                           <div class="d-flex mr-3">
                            <input id="gender-3" name="gender" type="radio" className='ga' />
                            <label for="gender-3" class="radio-label w-100">
                               Male
                            </label>
                        </div>
                        <div class="d-flex mr-3">
                            <input id="gender-2" name="gender" type="radio" className='ga' />
                            <label for="gender-2" class="radio-label w-100">
                              Female
                            </label>
                        </div>
                        <div class="d-flex mr-3">
                            <input id="gender-4" name="gender" type="radio" className='ga' />
                            <label for="gender-4" class="radio-label w-100">
                              Prefer not to stay
                            </label>
                        </div>
                           </div>
                            </div>
                        </div>
                        <div className='row mt-4'>
                        <div className="col-md-6">
                            <label>Blood Group<span className='text-danger'>*</span></label>
                           <select className='form-control'>
                            <option>A+</option>
                            <option>B+</option>
                           </select>
                            </div>
                            <div className="col-md-3">
                            <label>Test File upload<span className='text-danger'>*</span></label>
                            <button className="btn btn-light d-block import-btn">Upload <i class="layout-menuitem-icon pi pi-upload ml-2"></i></button>
                            </div>
                        </div>
                        <div className='row mt-4'>
                        <div className="col-md-6">
                            <label>Phone Number<span className='text-danger'>*</span></label>
                            <input type='number' className='form-control' placeholder='Enter phone number'/>
                            </div>
                            <div className="col-md-6">
                            <label>Location<span className='text-danger'>*</span></label>
                            <input type='number' className='form-control' placeholder='Enter location'/>
                            </div>
                        </div>
                        <div className='row mt-4'>
                        <div className="col-md-6">
                            <label>Permanent Address<span className='text-danger'>*</span></label>
                            <input type='text' className='form-control error-border' placeholder='Enter address'/>
                            <span className='text-danger'>Error message</span>
                            </div>
                            <div className="col-md-6">
                            <label>Current Address<span className='text-danger'>*</span></label>
                            <input type='text' className='form-control' placeholder='Enter address'/>
                            </div>
                        </div>
                         <div className='row mt-4'>
                        <div className="col-md-6">
                            <label>Create password<span className='text-danger'>*</span></label>
                            <input type='password' className='form-control' placeholder='***********'/>
                            </div>
                            <div className="col-md-6">
                            <label>Confirm Password<span className='text-danger'>*</span></label>
                            <input type='password' className='form-control' placeholder='*********'/>
                            </div>
                        </div>
                        <div className='row mt-4'>
                            <div className='d-flex p-4'>
                                <label><input type="checkbox" className='mr-1'/> <span>By checking this box you accept our privacy policy</span></label>
                            </div>
                            </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default CreateEmployee;
