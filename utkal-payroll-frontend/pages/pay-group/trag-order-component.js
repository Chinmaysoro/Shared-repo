import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { companyActions } from '../../redux/actions/company.actions';
import TokenService from '../../redux/services/token.service';
import { payGroupComponentSchema } from '../../redux/helpers/validations';
import { SalaryComponentService, PayComponentsService } from '../../redux/services/feathers/rest.app';
import { componentSchema } from '../../redux/helpers/validations';
import { getUser } from '../../redux/helpers/user';
import getConfig from 'next/config';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TragOrderComponent = (props) => {
    const userData = getUser();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [salaryComponentList, setSalaryComponentList] = useState([]);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const [items, setItems] = useState([
        { id: 'item-1', content: 'Basic' },
        { id: 'item-2', content: 'HRA' },
        { id: 'item-3', content: 'Other Component' },
        { id: 'item-4', content: 'Other Component' },
        { id: 'item-5', content: 'Other Component' },
        { id: 'item-6', content: 'Other Component' }
    ]);
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const newItems = [...items];
        const [movedItem] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, movedItem);

        setItems(newItems);
    };

    const handleSelectedComponent = (e, data) => {};

    return (
        <div>
            {/* <div className="row">
                <div className="col-md-12">
                    <h4 className="seacrh-order-title">Search component (Drag to change order)</h4>
                </div>
            </div> */}

            {/* <div className="row pt-2 mt-1">
                <div className="col-md-7">
                    <input type="text" className="form-control d-search" placeholder="Search..." />
                    <div className="t-search-icon">
                        <img src={`${contextPath}/layout/images/fi_search.svg`} alt="search-icon" />
                    </div>
                </div>
            </div> */}

            <div className="row mt-3 pt-2">
                <div className="col-md-12">
                    <div className="formula-card">
                        <h4 className="formula-title pb-2 mb-0">Components (Drag to change order)</h4>
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="droppable">
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                        {items.map((item, index) => (
                                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                                {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="trag-item">
                                                        <input type="checkbox" className="mr-2 d-checkbox" onChange={(e) => handleSelectedComponent(e, item)} />
                                                        <span>{item.content}</span>
                                                        <img src={`${contextPath}/layout/images/drag_indicator.svg`} alt="search-icon" className="float-right" />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TragOrderComponent;
