
import * as actionTypes from './constants';
import { fromJS } from 'immutable';// 这里用到 fromJS 把 JS 数据结构转化成 immutable 数据结构

const defaultState = fromJS({
    singerList: [],
    enterLoading: true, // 控制经常loading
    pullUpLoading: false, // 控制上拉加载动画
    pullDownLoading: false, // 控制下拉加载动画
    pageCount: 0, // 分页 当前页
});

export default (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.CHANGE_SINGER_LIST:
            return state.set('singerList', action.data);
        case actionTypes.CHANGE_ENTER_LOADING:
            return state.set('enterLoading', action.data);
        case actionTypes.CHANGE_PULLUP_LOADING:
            return state.set('pullUpLoading', action.data);
        case actionTypes.CHANGE_PULLDOWN_LOADING:
            return state.set('pullDownLoading', action.data);
        case actionTypes.CHANGE_PAGE_COUNT:
            return state.set('pageCount', action.data);
        default:
            return state;
    }
}