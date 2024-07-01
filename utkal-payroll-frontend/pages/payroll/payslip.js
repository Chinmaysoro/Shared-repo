import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import getConfig from 'next/config';
import { DepartmentService, UserService } from '../../redux/services/feathers/rest.app';
import { getUser } from '../../redux/helpers/user';
import TokenService from '../../redux/services/token.service';

const PayslipComponent = () => {
    const userData = getUser();
    const [loader, setLoader] = useState(false);
    const [visible, setVisible] = useState(false);
    const [departmentValues, setDepartmentValues] = useState({});
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    return (
        <div className="page-wrapper card p-3 b-payslip">
            <div className="content container-fluid">
                <div className="row staff-grid-row">
                    <div className="col-md-6 text-left">
                        <img src={`${contextPath}/layout/images/login-logo.png`} height={'92px'} widt={'true'} alt="logo" />
                    </div>
                    <div className="col-md-6 text-right">
                    <h5 className='mb-2'><strong>EduNewron Services Private Limited</strong></h5>
                        <p className='mb-0'>Plot 346/2725, Sishu Vihar, Patia, Bhubaneswar,</p>
                        <p>Odisha- 751024</p>
                    </div>
                </div>

                <div className="w-100 text-center">
                    <div className="s-header text-center">
                        <p>PAYSLIP FOR SEPTEMBER 2023</p>
                    </div>
                    <div className="s-content">
                        <div class="row mr-0 ml-0  text-left">
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-md-6 b-right p-0">
                                        <div class="bg-light-grey p-1 b-bottom-1">
                                            <b>Name</b>
                                        </div>
                                    </div>
                                    <div class="col-md-6 b-right p-1 b-bottom-1">Abinash Routray</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-md-6 b-right p-0">
                                        <div class="bg-light-grey p-1 b-bottom-1">
                                            <b>PAN</b>
                                        </div>
                                    </div>
                                    <div class="col-md-6 p-0">
                                        <div class="b-bottom-1 p-1">DWPPR1488K</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mr-0 ml-0  text-left">
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-md-6 b-right p-0">
                                        <div class="bg-light-grey p-1 b-bottom-1">
                                            <b>Employee Code</b>
                                        </div>
                                    </div>
                                    <div class="col-md-6 b-right p-1 b-bottom-1">Abinash Routray</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-md-6 b-right p-0">
                                        <div class="bg-light-grey p-1 b-bottom-1">
                                            <b>Sex</b>
                                        </div>
                                    </div>
                                    <div class="col-md-6 p-0">
                                        <div class="b-bottom-1 p-1">DWPPR1488K</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mr-0 ml-0  text-left">
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-md-6 b-right p-0">
                                        <div class="bg-light-grey p-1 b-bottom-1">
                                            <b>Designation</b>
                                        </div>
                                    </div>
                                    <div class="col-md-6 b-right p-1 b-bottom-1">Abinash Routray</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-md-6 b-right p-0">
                                        <div class="bg-light-grey p-1 b-bottom-1">
                                            <b>Account Number</b>
                                        </div>
                                    </div>
                                    <div class="col-md-6 p-0">
                                        <div class="b-bottom-1 p-1">DWPPR1488K</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mr-0 ml-0  text-left">
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-md-6 b-right p-0">
                                        <div class="bg-light-grey p-1 b-bottom-1">
                                            <b>Location</b>
                                        </div>
                                    </div>
                                    <div class="col-md-6 b-right p-1 b-bottom-1">Abinash Routray</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-md-6 b-right p-0">
                                        <div class="bg-light-grey p-1 b-bottom-1">
                                            <b>PF Account Number</b>
                                        </div>
                                    </div>
                                    <div class="col-md-6 p-0">
                                        <div class="b-bottom-1 p-1">DWPPR1488K</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mr-0 ml-0  text-left">
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-md-6 b-right p-0">
                                        <div class="bg-light-grey p-1 b-bottom-1">
                                            <b>Joining Date</b>
                                        </div>
                                    </div>
                                    <div class="col-md-6 b-right p-1 b-bottom-1">Abinash Routray</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-md-6 b-right p-0">
                                        <div class="bg-light-grey p-1 b-bottom-1">
                                            <b>PF UAN</b>
                                        </div>
                                    </div>
                                    <div class="col-md-6 p-0">
                                        <div class="b-bottom-1 p-1">DWPPR1488K</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mr-0 ml-0  text-left">
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-md-6 b-right p-0">
                                        <div class="bg-light-grey p-1 b-bottom-1">
                                            <b>Leaving Date</b>
                                        </div>
                                    </div>
                                    <div class="col-md-6 b-right p-1 b-bottom-1">Abinash Routray</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-md-6 b-right p-0">
                                        <div class="bg-light-grey p-1 b-bottom-1">
                                            <b>ESI Number</b>
                                        </div>
                                    </div>
                                    <div class="col-md-6 p-0">
                                        <div class="b-bottom-1 p-1">DWPPR1488K</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mr-0 ml-0  text-left">
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-md-6 b-right p-0">
                                        <div class="bg-light-grey p-1 b-bottom-1">
                                            <b>Tax Regime</b>
                                        </div>
                                    </div>
                                    <div class="col-md-6 b-right p-1 b-bottom-1">Abinash Routray</div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-md-6 b-right p-0">
                                        <div class="bg-light-grey p-1 b-bottom-1">
                                            <b>Cost to Company (CTC)</b>
                                        </div>
                                    </div>
                                    <div class="col-md-6 p-0">
                                        <div class="b-bottom-1 p-1">DWPPR1488K</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-3 mb-3">
                        <div className="col-md-4">
                            <div className="s-header text-center">
                                <p>PAY DAYS:</p>
                            </div>
                            <div className="s-content b-bottom-1">
                                <div class="row mr-0 ml-0  text-center">
                                    <div class="col-md-12">30.00</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="s-header text-center">
                                <p>EARNINGS (INR)</p>
                            </div>
                            <div className="s-content b-bottom-1 b-bottom-none">
                        <div class="row mr-0 ml-0 text-left">
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <td scope="col" className='bg-light-grey'><b>COMPONENTS</b></td>
                                    <td scope="col" className='bg-light-grey'><b>TOTAL</b></td>
             
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='bg-light-grey'><b>Basic</b></td>
                                    <td>3211</td>
                                </tr>
                                <tr>
                                    <td  className='bg-light-grey'><b>DA</b></td>
                                    <td>3211</td>
                                </tr>
                                <tr>
                                    <td  className='bg-light-grey'><b>HRA</b></td>
                                    <td>3211</td>
                                </tr>
                                <tr>
                                    <td  className='bg-light-grey'><b>Special Allowance</b></td>
                                    <td>3211</td>
                                </tr>
                                <tr>
                                    <td  className='bg-light-grey'><b>TOTAL EARNINGS</b></td>
                                    <td>3211</td>
                                </tr>
                                </tbody>
                            </table>
                        </div></div>
                        </div>
                        <div className="col-md-6">
                            <div className="s-header text-center">
                                <p>DEDUCTIONS (INR)</p>
                            </div>
                            <div className="s-content b-bottom-1 b-bottom-none">
                        <div class="row mr-0 ml-0 text-left">
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <td scope="col" className='bg-light-grey'><b>COMPONENTS</b></td>
                                    <td scope="col" className='bg-light-grey'><b>TOTAL</b></td>
             
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='bg-light-grey'><b>EWF EMI Deductions </b></td>
                                    <td>3211</td>
                                </tr>
                                <tr>
                                    <td  className='bg-light-grey'><b>PF</b></td>
                                    <td>3211</td>
                                </tr>
                                <tr>
                                    <td  className='bg-light-grey'><b>ESI</b></td>
                                    <td>3211</td>
                                </tr>
                                <tr>
                                    <td  className='bg-light-grey'><b>PT</b></td>
                                    <td>3211</td>
                                </tr>
                                <tr>
                                    <td  className='bg-light-grey'><b>TOTAL DEDUCTIONS </b></td>
                                    <td>3211</td>
                                </tr>
                                </tbody>
                            </table>
                        </div></div>
                        </div>
                    </div>
                    <div className="row mt-6">
                        <div className="col-md-12">
                            <div className="s-content b-bottom-1 b-bottom-none">
                        <div class="row mr-0 ml-0 text-left">
                        <table className="table table-bordered">

                            <tbody>
                                <tr>
                                    <td className='bg-light-grey w-34'><b>NET PAY (INR) </b></td>
                                    <td>12757.00</td>
                                </tr>
                                <tr>
                                    <td  className='bg-light-grey w-34'><b>NET PAY IN WORDS </b></td>
                                    <td>Twelve Thousand Seven Hundred Fifty Seven Only</td>
                                </tr>

                                </tbody>
                            </table>
                        </div></div>
                        </div>
                      
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PayslipComponent;
