import React from 'react';
import Login from './auth/login';

const MainScreen = () => {

    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <Login />
            </div>
        </div>
    );
};

export default MainScreen;
