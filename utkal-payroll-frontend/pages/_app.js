import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "react-daterange-picker/dist/css/react-calendar.css";
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import '../styles/demo/SalaryComponent.scss';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import { store } from '../redux/helpers';
import setupInterceptors from '../redux/services/setupInterceptors';


function MyApp({ Component, pageProps }) {
    if (typeof window === 'undefined') {
        return <></>;
    } else {
        if (Component.getLayout) {
            return <LayoutProvider>{Component.getLayout(<Component {...pageProps} />)}</LayoutProvider>;
        } else {
            return (
                    <Provider store={store}>
                        <LayoutProvider>
                            <Layout>
                                <Component {...pageProps} />
                                <ToastContainer theme="colored" />
                            </Layout>
                        </LayoutProvider>
                    </Provider>
            );
        }
    }
}

setupInterceptors(store);
export default MyApp;