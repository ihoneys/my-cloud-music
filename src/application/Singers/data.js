import React, { createContext, useReducer } from 'react'
import { fromJS } from 'immutable';

export const CategoryDataContext = createContext({});

export const CHANGE_CATEGORY_TYPE = 'singers/CHANGE_CATEGORY_TYPE';
export const CHANGE_CATEGORY_AREA = 'singers/CHANGE_CATEGORY_AREA';
export const CHANGE_ALPHA = 'singers/CHANGE_ALPHA';

const reducer = (state, action) => {
    switch (action.type) {
        case CHANGE_CATEGORY_TYPE:
            return state.set('category_type', action.data);
        case CHANGE_CATEGORY_AREA:
            return state.set('category_area', action.data);
        case CHANGE_ALPHA:
            return state.set('alpha', action.data);
        default:
            return state
    }
}

export const Data = (props) => {
    const [data, dispatch] = useReducer(reducer, fromJS({
        type: '',
        area: '',
        alpha: '',
    }))
    return (
        <CategoryDataContext.Provider value={{ data, dispatch }}>
            {props.children}
        </CategoryDataContext.Provider>
    )
}

