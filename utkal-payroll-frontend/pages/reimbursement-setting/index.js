import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import SimpleModal from '../components/Modal';
import AddReimbursement from './AddReimbursement';
import { toast } from 'react-toastify';
import { ReimbursementTypeService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';
import { getUser } from '../../redux/helpers/user';

const Reimbursement = () => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [visible, setVisible] = useState(false);
    const [updatedValues, setUpdatedValues] = useState({});
    const [title, setTitle] = useState('');
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);
    const [offset, setOffset] = useState(0);
    const [listingData, setListingData] = useState([]);
    const [totalReimbursement, setTotalReimbursement] = useState(0);

    const openModal = (type, val, data) => {
        setVisible(val);
        setTitle(type);
        setUpdatedValues(data);
    };

    const fetchAll = async () => {
        if (userData?.user?.companyId) {
            setLoader(true);
            ReimbursementTypeService.find({
                query: { companyId: userData?.user?.companyId, $skip: offset, $limit: perPage, $sort: { createdAt: -1 } },
                headers: {
                    Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
                }
            })
                .then((res) => {
                    setLoader(false);
                    setListingData(res.data);
                    setPageCount(Math.ceil(res.total / perPage));
                    setTotalReimbursement(res.total);
                })
                .catch((error) => {
                    setLoader(false);
                });
        }
    };

    const deleteData = (values) => {
        setLoader(true);
        ReimbursementTypeService.remove(values?._id, {
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                toast.success('Reimbursement deleted successfully.');
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

    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <h3 className="page-title">Reimbursement</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Administration</a>
                                </li>
                                <li className="breadcrumb-item active">Reimbursement</li>
                            </ul>
                        </div>
                        <div className="col-auto float-right ml-auto">
                            <button type="button" className="btn btn-primary" onClick={() => openModal('Create Reimbursement', true, null)}>
                                <i className="pi pi-plus"></i> Reimbursement
                            </button>
                        </div>
                    </div>
                </div>
                <SimpleModal title={title} visible={visible} setVisible={() => setVisible(false)} body={<AddReimbursement setVisible={() => setVisible(false)} updatedValues={updatedValues} fetchAll={fetchAll} />}></SimpleModal>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Reimbursement Type</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listingData && listingData?.length > 0 ? (
                                    listingData?.map((data, index) => (
                                        <tr key={`key-${index}`}>
                                            <th scope="row">{data?.name}</th>
                                            <td>
                                                <button className="btn btn-primary" type="button" onClick={() => openModal('Update Reimbursement', true, data)}>
                                                    <i className="pi pi-pencil"></i>
                                                </button>
                                                &nbsp;
                                                <button className="btn btn-warning" type="button" onClick={() => deleteData(data)}>
                                                    <i className="pi pi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="alert alert-success text-center" role="alert">
                                                No reimbursement found!!!
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {totalReimbursement > 10 ? (
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

export default Reimbursement;
