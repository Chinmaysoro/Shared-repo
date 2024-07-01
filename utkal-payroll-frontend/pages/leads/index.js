import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import SimpleModal from '../components/Modal';
import AddLeads from './AddLeads';
import { LeadsService } from '../../redux/services/feathers/rest.app';
import TokenService from '../../redux/services/token.service';

const LeadsComponent = () => {
    const [loader, setLoader] = useState(false);
    const [visible, setVisible] = useState(false);
    const [leadsValues, setLeadsValues] = useState({});
    const [title, setTitle] = useState('');
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [leadsList, setLeadsList] = useState([]);
    const [totalLeads, setTotalLeads] = useState(0);
    const [pageCount, setPageCount] = useState(0);

    const openModal = (type, val, data) => {
        setVisible(val);
        setTitle(type);
        setLeadsValues(data);
    };

    const fetchAllLead = async () => {
        setLoader(true);
        LeadsService.find({
            query: { $skip: offset, $limit: perPage, $sort: { createdAt: -1 } },
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                setLeadsList(res.data);
                setPageCount(Math.ceil(res.total / perPage));
                setTotalLeads(res.total);
            })
            .catch((error) => {
                setLoader(false);
            });
    };

    const deleteLeads = (values) => {
        setLoader(true);
        LeadsService.remove(values?._id, {
            headers: {
                Authorization: `Bearer ${TokenService.getLocalAccessToken()}`
            }
        })
            .then((res) => {
                setLoader(false);
                toast.success('Lead deleted successfully.');
                fetchAllLead();
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
        fetchAllLead();
    }, [offset]);

    const navigateToUpdateProfile = () => {};

    return (
        <div className="page-wrapper card p-3">
            <div className="content container-fluid">
                {/* <!-- Page Header --> */}
                <div className="page-header">
                    <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Leads</h3>
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <a href="#">Super Admin</a>
                                </li>
                                <li className="breadcrumb-item active">Leads</li>
                            </ul>
                        </div>
                        {/* <div className="col-auto float-right ml-auto">
                            <button type="button" className="btn btn-primary" onClick={() => openModal('Create Lead', true, null)}>
                                <i className="pi pi-plus"></i> Add Leads
                            </button>
                        </div> */}
                    </div>
                </div>
                <SimpleModal title={title} visible={visible} setVisible={() => setVisible(false)} body={<AddLeads setVisible={() => setVisible(false)} leadsValues={leadsValues} fetchAllLead={fetchAllLead} />}></SimpleModal>
                {/* <!-- /Page Header --> */}
                <div className="row staff-grid-row">
                    <div className="col-md-12 col-sm-12">
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Lead Name</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Company Name</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leadsList && leadsList?.length > 0 ? (
                                    leadsList?.map((leads, index) => (
                                        <tr key={`key-${index}`}>
                                            <th scope="row">{`${leads?.firstName} ${leads?.lastName}`}</th>
                                            <td>{leads?.phone ?? "N/A"}</td>
                                            <td>{leads?.email ?? "N/A"}</td>
                                            <td>{leads?.companyName ?? "N/A"}</td>
                                            <td>{leads?.status ?? "N/A"}</td>
                                            <td>
                                                <button className="btn btn-primary" type="button" onClick={() => openModal('Update Lead', true, leads)}>
                                                    <i className="pi pi-pencil"></i>
                                                </button>
                                                &nbsp;
                                                <button className="btn btn-warning" type="button" onClick={() => deleteLeads(leads)}>
                                                    <i className="pi pi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="alert alert-success text-center" role="alert">
                                                No Lead found!!!
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {totalLeads > 10 ? (
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

export default LeadsComponent;
