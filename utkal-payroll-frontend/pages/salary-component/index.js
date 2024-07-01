import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import SimpleModal from '../components/Modal';
import AddComponent from './AddComponent';
import { toast } from 'react-toastify';
import { SalaryComponentService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
import { getUser } from '../../redux/helpers/user';

const SalaryComponent = () => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [visible, setVisible] = useState(false);
    const [componentValues, setComponentValues] = useState({});
    const [title, setTitle] = useState('');
    const [offset, setOffset] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [perPage] = useState(10);
    const [componentList, setComponentList] = useState([]);
    const [totalComponent, setTotalComponent] = useState(0);

    const openModal = (type, val, dept) => {
        setVisible(val);
        setTitle(type);
        setComponentValues(dept);
    };

    const fetchAll = async () => {
        if (userData?.user?.companyId) {
            setLoader(true);
            SalaryComponentService.find({
                query: { companyId: userData?.user?.companyId, $skip: offset, $limit: perPage, $sort: { createdAt: -1 } },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setLoader(false);
                    setComponentList(res.data);
                    setPageCount(Math.ceil(res.total / perPage));
                    setTotalComponent(res?.total);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    const deleteComponent = (values) => {
        setLoader(true);
        SalaryComponentService.remove(values?._id, {
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                toast.success('Component deleted successfully.');
                fetchAll();
            })
            .catch((error) => {
                setLoader(false);
                toast.error(error?.message);
            });
    };

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setOffset(selectedPage * perPage);
    };

    useEffect(() => {
        fetchAll();
    }, [offset]);

    const navigateToUpdateProfile = () => {};

    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Salary Component</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Administration</a>
                                </li>
                                <li className="breadcrumb-item active">Salary Component</li>
                            </ul>
                        </div>
                        <div className="col-auto float-right ml-auto">
                            <button type="button" className="btn btn-primary" onClick={() => openModal('Create Component', true, null)}>
                                <i className="pi pi-plus"></i> Component
                            </button>
                        </div>
                    </div>
                </div>
                <SimpleModal title={title} visible={visible} setVisible={() => setVisible(false)} body={<AddComponent setVisible={() => setVisible(false)} componentValues={componentValues} fetchAll={fetchAll} />}></SimpleModal>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Component Name</th>
                                    <th scope="col">Type of Component</th>
                                    <th scope="col">Tax Exempt</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {componentList && componentList?.length > 0 ? (
                                    componentList?.map((company, index) => (
                                        <tr key={`key-${index}`}>
                                            <th scope="row">{company?.name || 'N/A'}</th>
                                            <td>{company?.type || 'N/A'}</td>
                                            <td>{company?.taxExempt === true ? 'True' : 'False'}</td>
                                            <td>{company?.status === 'enabled' ? 'Enabled' : 'Disabled'}</td>
                                            <td>
                                                <button className="btn btn-primary" type="button" onClick={() => openModal('Update Component', true, company)}>
                                                    <i className="pi pi-pencil"></i>
                                                </button>
                                                &nbsp;
                                                <button className="btn btn-warning" type="button" onClick={() => deleteComponent(company)}>
                                                    <i className="pi pi-trash"></i>
                                                </button>
                                            </td>
                                            <td></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="alert alert-success text-center" role="alert">
                                                No component found!!!
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {totalComponent > 10 ? (
                            <ReactPaginate
                                previousLabel={'<'}
                                nextLabel={'>'}
                                breakLabel={'...'}
                                breakClassName={'break-me'}
                                pageCount={pageCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageClick}
                                containerClassName={'pagination'}
                                activeClassName={'active'}
                            />
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalaryComponent;
