//src/application/Album/index.js
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getAlbumList, changeEnterLoading } from "./store/actionCreators";

import { CSSTransition } from "react-transition-group";

import Header from "../../baseUI/Header";
import Scroll from "../../baseUI/Scroll";
import Loading from "../../baseUI/Loading";

import { Container } from "./style";
import style from "../../assets/global-style";

import { Menu, TopDesc, SongList, SongItem } from "./style";
import { getName, getCount, isEmptyObject } from "../../api/utils";

export const HEADER_HEIGHT = 45;

function Album(props) {
  const [showStatus, setShowStatus] = useState(true);
  const headerEl = useRef();

  const { currentAlbum, enterLoading } = useSelector((state) => ({
    currentAlbum: state.getIn(["album", "currentAlbum"]).toJS(),
    enterLoading: state.getIn(["album", "enterLoading"]),
  }));

  const dispatch = useDispatch();

  const id = props.match.params.id;

  useEffect(() => {
    dispatch(changeEnterLoading(true));
    dispatch(getAlbumList(id));
  }, [dispatch, id]);

  const handleBack = useCallback(() => {
    setShowStatus(false);
  }, []);

  const handleScroll = useCallback((pos) => {
    let minScrollY = -HEADER_HEIGHT;
    let percent = Math.abs(pos.y / minScrollY);
    let headerDom = headerEl.current;
    if (pos.y < minScrollY) {
      headerDom.style.backgroundColor = style["theme-color"];
      headerDom.style.opacity = Math.min(1, (percent - 1) / 2);
    } else {
      headerDom.style.backgroundColor = "";
      headerDom.style.opacity = 1;
    }
  }, []);

  const renderTopDesc = () => {
    return (
      <TopDesc background={currentAlbum.coverImgUrl}>
        <div className="background">
          <div className="filter"></div>
        </div>
        <div className="img_wrapper">
          <div className="decorate"></div>
          <img src={currentAlbum.coverImgUrl} alt="" />
          <div className="play_count">
            <i className="iconfont play">&#xe885;</i>
            <span className="count">
              {Math.floor(currentAlbum.subscribedCount / 1000) / 10} 万{" "}
            </span>
          </div>
        </div>
        <div className="desc_wrapper">
          <div className="title">{currentAlbum.name}</div>
          <div className="person">
            <div className="avatar">
              <img src={currentAlbum.creator.avatarUrl} alt="" />
            </div>
            <div className="name">{currentAlbum.creator.nickname}</div>
          </div>
        </div>
      </TopDesc>
    );
  };

  const renderMenu = () => {
    return (
      <Menu>
        <div>
          <i className="iconfont">&#xe6ad;</i>
          评论
        </div>
        <div>
          <i className="iconfont">&#xe86f;</i>
          点赞
        </div>
        <div>
          <i className="iconfont">&#xe62d;</i>
          收藏
        </div>
        <div>
          <i className="iconfont">&#xe606;</i>
          更多
        </div>
      </Menu>
    );
  };

  const renderSongList = () => {
    return (
      <>
        <SongList>
          <div className="first_line">
            <div className="play_all">
              <i className="iconfont">&#xe6e3;</i>
              <span>
                {" "}
                播放全部{" "}
                <span className="sum">
                  (共 {currentAlbum.tracks.length} 首)
                </span>
              </span>
            </div>
            <div className="add_list">
              <i className="iconfont">&#xe62d;</i>
              <span> 收藏 ({getCount(currentAlbum.subscribedCount)})</span>
            </div>
          </div>
        </SongList>
        <SongItem>
          {currentAlbum.tracks.map((item, index) => {
            return (
              <li key={index}>
                <span className="index">{index + 1}</span>
                <div className="info">
                  <span>{item.name}</span>
                  <span>
                    {getName(item.ar)} - {item.al.name}
                  </span>
                </div>
              </li>
            );
          })}
        </SongItem>
      </>
    );
  };

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}
    >
      <Container>
        <Header ref={headerEl} title={"返回"} handleClick={handleBack}></Header>
        {!isEmptyObject(currentAlbum) ? (
          <Scroll bounceTop={false} onScroll={handleScroll}>
            <div>
              {renderTopDesc()}
              {renderMenu()}
              {renderSongList()}
            </div>
          </Scroll>
        ) : null}
        {enterLoading ? <Loading></Loading> : null}
      </Container>
    </CSSTransition>
  );
}

export default Album;
