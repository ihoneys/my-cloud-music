//actionCreators.js
import * as actionTypes from './constants';
import { fromJS } from 'immutable';// 将 JS 对象转换成 immutable 对象
import { getAlbumDetailRequest } from '../../../api/request';

export const changeCurrentAlbum = (data) => ({
    type: actionTypes.CHANGE_CURRENT_ALBUM,
    data: fromJS(data)
});

export const changeEnterLoading = (data) => ({
    type: actionTypes.CHANGE_ENTER_LOADING,
    data: data
});

export const getAlbumList = (id) => {
    return (dispatch) => {
        getAlbumDetailRequest(id).then(res => {
            const data = res.playlist;
            dispatch(changeCurrentAlbum(data));
            dispatch(changeEnterLoading(true));
        }).catch(() => {
            console.log("轮播图数据传输错误");
        })
    }
};
