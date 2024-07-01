import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';

import { DepartmentService, UserService } from '../../redux/services/feathers/rest.app';
import { getUser } from '../../redux/helpers/user';

const AdminSettings = () => {
    const userData = getUser();
    const [loader, setLoader] = useState(false);
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [offset, setOffset] = useState(0);
    useEffect(() => {
        localStorage.setItem('settings_menu', true);
        const specificDiv = document.getElementById('fff');
    }, []);
    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Settings</h3>
                        </div>
                    </div>
                </div>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        <p>You can configure your company settings here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
