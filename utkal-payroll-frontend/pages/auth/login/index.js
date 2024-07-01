import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { useContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Password } from 'primereact/password';
import AppConfig from '../../../layout/AppConfig';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { userActions } from '../../../redux/actions/user.actions';
import { AuthenticationService } from '../../../redux/services/feathers/rest.app';
import TokenService from '../../../redux/services/token.service';
import { toast } from 'react-toastify';
import Link from 'next/link';


const LoginPage = () => {
    const dispatch = useDispatch();
    const userDetail = useSelector((state) => state?.user);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [checked, setChecked] = useState(false);
    const [forgotPasswordStatus, setForgotPasswordStatus] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const router = useRouter();
    // console.log(userDetail?.user?.role,"::::::::userDetail?.user?.role")
    // userDetail?.user?.role === 1 ? router.push("/") :  router.push("/employee");
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const loginUser = async (user) => {
        if(!user.email || !user.password){
            // toast.error("No User");
            return;
        }

        await AuthenticationService.create(user)
            .then((res) => {
                if (res?.user?.role === 65535) {
                    toast.success('Successfully Authenticated!');
                    TokenService.setUser(res);
                    router.push('/super-admin');
                } else {
                    toast.success('Successfully Authenticated!');
                    TokenService.setUser(res);
                    router.push('/employee');
                    localStorage.setItem("settings_menu",false);
                }
            })
            .catch((error) => {
                // toast.error('Invalid login!');
                // console.log('::Error', error);
                if(error.message =="Network Error"){
                    alert("Please check your internet or Database connectivity");
                }else
                alert(error.message);

            });
    };

    const [emailError, setemailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const authenticate =async () => {
        var data = {
            ...formData,
            strategy: 'local',
            source: 'web'
        };
      
        if(!formData.email){
            // alert("Please Enter Registered Email");
            setemailError("*Please Enter Registered Email")
            // return;
        }
        if(!formData.password){
            // alert("Please Enter Password");
            setPasswordError("*Password should not be blank");
            // return;
        }
        if (forgotPasswordStatus) {
            dispatch(userActions.forgotPassword(formData.email));
        } else {
            // dispatch(userActions.login(data));
            await loginUser(data);
        }
    };

    const forgotPassword = () => {
        setForgotPasswordStatus(!forgotPasswordStatus);
    };

    return (
        <div className="login-section">
            <div className="row m-0">
                <div className="col-md-6 p-0 m-0">
                    <div className="login-left-bg">
                        <img src={`${contextPath}/layout/images/loginlogo.png`} alt="Image" className="mb-3 img-responsive top-logo" />
                        <div className="login-banner">
                            <img src={`${contextPath}/layout/images/login-banner.png`} alt="Image" className="img-responsive w-100" />
                        </div>
                    </div>
                </div>
                <div className="col-md-6 p-0 m-0">
                    <div className="login-card">
                        <h2 className="pb-0 mb-2">Welcome to Smart Link!</h2>
                        <h5 className="pt-0 mt-0 pb-4">Please enter login details</h5>
                        <form className="login-form">
                            <label htmlFor="email1" className="block text-900 login-label mb-2 mt-3">
                                Email
                            </label>
                            <InputText name="email" value={formData.email} onChange={handleChange} inputid="email1" type="email" placeholder="Registered Email *" className="w-full md:w-30rem mb-1" style={{ padding: '1rem' }} feedback={false} />

                            {!formData.email?<span className='text-danger'>{emailError}</span>:""}

                            <label htmlFor="password1" className="block text-900 login-label mb-2 mt-5">
                                Password
                            </label>
                            <Password name="password" inputid="password1" placeholder="Password *" value={formData.password} onChange={handleChange} feedback={false} className="w-full mb-1" inputClassName="w-full p-3 md:w-30rem" toggleMask />
                            
                            {!formData.password?<span className='text-danger'>{passwordError}</span>:""}

                            <div className="flex align-items-center justify-content-end mb-5 gap-5"></div>
                            <button type="button" className="btn btn-primary w-100" onClick={authenticate}>
                                Sign In
                            </button>
                            <p className="mt-5 text-center">
                                Don't have an account? <Link href="/register">Sign up</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        // <div className={`${containerClassName}`}>
        //     <div className="flex flex-column align-items-center justify-content-center">
        //         <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
        //             <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
        //                 <div className="text-center mb-5">
        //                     <img src={`${contextPath}/layout/images/Utkal_Logo_Icon.svg`} alt="Image" height="50" className="mb-3" />
        //                     <div className="text-900 text-3xl font-medium mb-3">
        //                         Welcome to <span style={{ color: '#007bff' }}>Utkal</span> smart!
        //                     </div>
        //                     <span className="text-600 font-medium">Sign in to continue</span>
        //                 </div>

        //                 <div>
        //                     <form>
        //                         <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
        //                             Email
        //                         </label>
        //                         <InputText name="email" value={formData.email} onChange={handleChange} inputid="email1" type="email" placeholder="Email *" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

        //                         <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
        //                             Password
        //                         </label>
        //                         <Password name="password" inputid="password1" value={formData.password} onChange={handleChange} placeholder="Password *" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>

        //                         <div className="flex align-items-center justify-content-end mb-5 gap-5">
        //                             {/* <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }} onClick={forgotPassword}>
        //                             Forgot password?
        //                         </a> */}
        //                         </div>
        //                         <button type="button" className="btn btn-primary w-100 p-3" onClick={authenticate}>
        //                             Sign In
        //                         </button>
        //                     </form>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};
export default LoginPage;
