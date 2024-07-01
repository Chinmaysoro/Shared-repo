import React from 'react';
import Link from 'next/link';

const Compensation = () => {
    return (
        <div className="page-wrapper">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Employee</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link href="/admin">Dashboard</Link>
                                </li>
                                <li className="breadcrumb-item active">Employee Compensation</li>
                            </ul>
                        </div>
                        <div className="col-auto float-right ml-auto"></div>
                    </div>
                </div>

                {/* <!-- /Page Body --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        <div className="card">
                            <form>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h4 className="ml-2">Annual CTC *</h4>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="input-group mb-3">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="basic-addon1">
                                                    &#x20B9;
                                                </span>
                                            </div>
                                            <input type="text" className="form-control" placeholder="0" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <table className="table" border={0}>
                                            <thead>
                                                <tr>
                                                    <th scope="col">SALARY COMPONENTS</th>
                                                    <th scope="col">CALCULATION TYPE</th>
                                                    <th scope="col">MONTHLY AMOUNT</th>
                                                    <th scope="col">ANNUAL AMOUNT</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                <tr>
                                                    <th colSpan={4}>
                                                        <h4>Earnings</h4>
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <th>Basic</th>
                                                    <td>
                                                        <div className="input-group mb-3">
                                                            <input type="text" className="form-control" placeholder="50" />
                                                            <div className="input-group-prepend">
                                                                <span className="input-group-text" id="basic-addon1">
                                                                    % of CTC
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <input type="text" className="form-control" placeholder="0" readOnly />
                                                    </td>
                                                    <td>
                                                        <input type="text" className="form-control" placeholder="0" readOnly />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>House Rent Allowance</th>
                                                    <td>
                                                        <div className="input-group mb-3">
                                                            <input type="text" className="form-control" placeholder="50" />
                                                            <div className="input-group-prepend">
                                                                <span className="input-group-text" id="basic-addon1">
                                                                    % of Basic
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <input type="text" className="form-control" placeholder="0" readOnly />
                                                    </td>
                                                    <td>
                                                        <input type="text" className="form-control" placeholder="0" readOnly />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Conveyance Allowance</th>
                                                    <td>
                                                        <label>Fixed amount</label>
                                                    </td>
                                                    <td>
                                                        <input type="text" className="form-control" placeholder="0" />
                                                    </td>
                                                    <td>
                                                        <input type="text" className="form-control" placeholder="0" readOnly />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>
                                                        Fixed Allowance
                                                        <p class="text-muted text-sm">Monthly CTC - Sum of all other components</p>
                                                    </th>
                                                    <td>
                                                        <label>Fixed amount</label>
                                                    </td>
                                                    <td>
                                                        <input type="text" className="form-control" placeholder="0" />
                                                    </td>
                                                    <td>
                                                        <input type="text" className="form-control" placeholder="0" readOnly />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th colSpan={2}>
                                                        <h5>Cost to Company</h5>
                                                    </th>
                                                    <td>
                                                        <h4 className="text-right">&#x20B9; 4332</h4>
                                                    </td>
                                                    <td>
                                                        <h4 className="text-right">&#x20B9; 50000</h4>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <button type="button" class="btn btn-primary mr-2">
                                                            Save
                                                        </button>
                                                        <button type="button" class="btn btn-warning">
                                                            Cancel
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Compensation;
