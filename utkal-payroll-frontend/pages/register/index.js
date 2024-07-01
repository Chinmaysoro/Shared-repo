import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { useContext, useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Password } from 'primereact/password';
import AppConfig from '../../layout/AppConfig';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { userActions } from '../../redux/actions/user.actions';
import { AuthenticationService, LeadsService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
import { toast } from 'react-toastify';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        companyName: '',
        noOfEmployee: '',
        location: ''
    });
    const [checked, setChecked] = useState(false);
    const [isRegister, setRegister] = useState(false);
    const [forgotPasswordStatus, setForgotPasswordStatus] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const router = useRouter();

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const registerUser = () => {
        //console.log(formData, ':::::::::::::formData');

        // DepartmentService.create(
        //     { ...values },
        //     {
        //         headers: {
        //             Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
        //         }
        //     }
        // )
        //     .then((res) => {
        //         setLoader(false);
        //         toast.success('Department created successfully.');
        //         props?.setVisible();
        //         props?.fetchAllDepartment();
        //     })
        //     .catch((error) => {
        //         setLoader(false);
        //         toast.error(error.message);
        //     });
        LeadsService.create(formData)
            .then((res) => {
                if (res) {
                    setRegister(true);
                }
                // console.log(res,'::::::::::::::res');
                toast.success('Successfully Created');
            })
            .catch((e) => {
                // Show login page (potentially with `e.message`)
                toast.error(e.message);
            });
    };

    return (
        <div className="login-section" style={{ height: 'auto' }}>
            <div className="row m-0">
                <div className="col-md-6 p-0 m-0">
                    <div className="login-left-bg">
                        <img src={`${contextPath}/layout/images/loginlogo.png`} alt="Image" className="mb-3 img-responsive top-logo" />
                        <div className="login-banner">
                            <img src={`${contextPath}/layout/images/register-banner.png`} alt="Image" className="img-responsive w-100" />
                        </div>
                    </div>
                </div>
                <div className="col-md-6 p-0 m-0">
                    <div className="login-card" style={{ height: 'auto', paddingBottom: '5%', paddingTop: '3%' }}>
                        {isRegister ? (
                            <div className='text-center' style={{ height: '100vh', paddingTop: '10%' }}>
                                <img src={`${contextPath}/layout/images/success.png`} alt="Image" className="img-responsive" />

                                <h3>Thank you for registering for our payroll app!</h3>
                                <h5>We appreciate your interest in our product. Our team will review your registration and get back to you within 48 hours.</h5>

                                <h5>
                                    In the meantime, please feel free to explore our website and learn more about our app.
                                    You can also reach me at +91 9692200364
                                    or info@utkalsmart.com if you have any questions.
                                </h5>

                            </div>
                        ) : (
                            <div>
                                <h2 class="pb-0 mb-2">Welcome to Smart Link!</h2>
                                <h5 class="pt-0 mt-0 pb-4">Please enter your details</h5>
                                <form class="login-form">
                                    <label htmlFor="firstName" className="block text-900 login-label mb-2">
                                        FirstName
                                    </label>
                                    <InputText name="firstName" value={formData.full_name} onChange={handleChange} inputid="firstName" type="text" placeholder="FullName *" className="w-full md:w-30rem mb-3" style={{ padding: '1rem' }} />
                                    <label htmlFor="lastName" className="block text-900 login-label mb-2">
                                        LastName
                                    </label>
                                    <InputText name="lastName" value={formData.full_name} onChange={handleChange} inputid="lastName" type="text" placeholder="LastName *" className="w-full md:w-30rem mb-3" style={{ padding: '1rem' }} />
                                    <label htmlFor="companyName" className="block text-900 login-label mb-2">
                                        Organization Name
                                    </label>
                                    <InputText name="companyName" value={formData.companyName} onChange={handleChange} inputid="companyName" type="text" placeholder="Organization Name *" className="w-full md:w-30rem mb-3" style={{ padding: '1rem' }} />
                                    <label htmlFor="compaemailny_email" className="block text-900 login-label mb-2">
                                        Company Email
                                    </label>
                                    <InputText name="email" value={formData.email} onChange={handleChange} inputid="email" type="email" placeholder="Company Email *" className="w-full md:w-30rem mb-3" style={{ padding: '1rem' }} />
                                    <label htmlFor="phone" className="block text-900 login-label mb-2">
                                        Mobile No
                                    </label>
                                    <InputText name="phone" value={formData.phone} onChange={handleChange} inputid="phone" type="number" placeholder="Mobile *" className="w-full md:w-30rem mb-3" style={{ padding: '1rem' }} />
                                    <label htmlFor="noOfEmployee" className="block text-900 login-label mb-2">
                                        No of Emolpyees
                                    </label>
                                    <InputText name="noOfEmployee" value={formData.noOfEmployee} onChange={handleChange} inputid="noOfEmployee" type="number" placeholder="No of employee *" className="w-full md:w-30rem mb-3" style={{ padding: '1rem' }} />

                                    <label htmlFor="location" className="block text-900 login-label mb-2">
                                        Location
                                    </label>
                                    <InputText name="location" value={formData.location} onChange={handleChange} inputid="location" type="text" placeholder="Location *" className="w-full md:w-30rem mb-1" style={{ padding: '1rem' }} />

                                    <div className="flex align-items-center justify-content-end mb-5 gap-5"></div>
                                    <button type="button" className="btn btn-primary w-100" onClick={registerUser}>
                                        Register Now
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

RegisterPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default RegisterPage;
