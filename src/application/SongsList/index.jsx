import React from "react";
import { useDispatch } from "react-redux";

import {
  changePlayList,
  changeCurrentIndex,
  changeSequecePlayList,
  changePlayingState
} from "./../../application/Player/store/actionCreators";

import { SongList, SongItem } from "./style";
import { getName } from "../../api/utils";

const SongsList = React.forwardRef((props, refs) => {
  const { collectCount, showCollect, songs } = props;

  // 接受触发动画的函数
  const { musicAnimation } = props;

  const dispatch = useDispatch();

  const totalCount = songs.length;

  const selectItem = (e, index) => {
    dispatch(changePlayList(songs));
    dispatch(changeCurrentIndex(index));
    dispatch(changeSequecePlayList(songs));
    musicAnimation(e.nativeEvent.clientX, e.nativeEvent.clientY);
  };

  let songList = (list) => {
    let res = [];
    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      res.push(
        <li key={`${item.id}${i}`} onClick={(e) => selectItem(e, i)}>
          <span className="index">{i + 1}</span>
          <div className="info">
            <span>{item.name}</span>
            <span>
              {item.ar ? getName(item.ar) : getName(item.artists)} -{" "}
              {item.al ? item.al.name : item.album.name}
            </span>
          </div>
        </li>
      );
    }
    return res;
  };

  const collect = (count) => {
    return (
      <div className="add_list">
        <i className="iconfont">&#xe62d;</i>
        <span>收藏({Math.floor(count / 1000) / 10}万)</span>
      </div>
      // <div className="isCollected">
      //   <span>已收藏({Math.floor(count/1000)/10}万)</span>
      // </div>
    );
  };
  return (
    <SongList ref={refs} showBackground={props.showBackground}>
      <div className="first_line">
        <div className="play_all" onClick={(e) => selectItem(e, 0)}>
          <i className="iconfont">&#xe6e3;</i>
          <span>
            播放全部 <span className="sum">(共{totalCount}首)</span>
          </span>
        </div>
        {showCollect ? collect(collectCount) : null}
      </div>
      <SongItem>{songList(songs)}</SongItem>
    </SongList>
  );
});

export default React.memo(SongsList);
