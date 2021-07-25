import React, { memo, useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import Header from "../../baseUI/Header";
import Loading from "../../baseUI/Loading";
import MusicNote from "../../baseUI/Music-note";
import Scroll from "../../baseUI/Scroll";
import { HEADER_HEIGHT } from "../Album";
import SongsList from "../SongsList";
import { getSingerInfo } from "./store/actionCreators";

import {
  Container,
  ImgWrapper,
  CollectButton,
  SongListWrapper,
  BgLayer,
} from "./style";

const Singer = (props) => {
  // eslint-disable-next-line no-unused-vars
  const [showStatus, setShowStatus] = useState(true);

  //   const artist = {
  //     picUrl:
  //       "https://p2.music.126.net/W__FCWFiyq0JdPtuLJoZVQ==/109951163765026271.jpg",
  //     name: "薛之谦",
  //     hotSongs: [
  //       {
  //         name: "我好像在哪见过你",
  //         ar: [{ name: "薛之谦" }],
  //         al: {
  //           name: "薛之谦专辑",
  //         },
  //       },
  //       {
  //         name: "我好像在哪见过你",
  //         ar: [{ name: "薛之谦" }],
  //         al: {
  //           name: "薛之谦专辑",
  //         },
  //       },
  //       // 省略 20 条
  //     ],
  //   };

  const collectButton = useRef();
  const imageWrapper = useRef();
  const songScrollWrapper = useRef();
  const songScroll = useRef();
  const header = useRef();
  const layer = useRef();

  // 图片初始高度
  const initialHeight = useRef(0);

  const musicNoteRef = useRef();

  // 往上偏移的尺寸，露出圆角
  const OFFSET = 5;

  useEffect(() => {
    let h = imageWrapper.current.offsetHeight;
    songScrollWrapper.current.style.top = `${h - OFFSET}px`;
    initialHeight.current = h;
    // 把遮罩先放在下面，以裹住歌曲列表
    layer.current.style.top = `${h - OFFSET}px`;
    songScroll.current.refresh();
    //eslint-disable-next-line
  }, []);

  const { artist, songs, loading } = useSelector((state) => ({
    artist: state.getIn(["singerInfo", "artist"]).toJS(),
    songs: state.getIn(["singerInfo", "songsOfArtist"]).toJS(),
    loading: state.getIn(["singerInfo", "loading"]),
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    const id = props.match.params.id;
    dispatch(getSingerInfo(id));
  }, [dispatch, props.match.params.id]);

  const setShowStatusFalse = useCallback(() => {
    setShowStatus(false);
  }, []);

  const handleScroll = useCallback((pos) => {
    let height = initialHeight.current;
    const newY = pos.y;
    const imageDOM = imageWrapper.current;
    const buttonDOM = collectButton.current;
    const headerDOM = header.current;
    const layerDOM = layer.current;
    const minScrollY = -(height - OFFSET + HEADER_HEIGHT);
    const percent = Math.abs(newY / height);
    if (newY > 0) {
      imageDOM.style["transform"] = `scale(${1 + percent})`;
      buttonDOM.style["transform"] = `translate3d(0,${newY}px, 0)`;
      layerDOM.style.top = `${height - OFFSET + newY}px`;
    } else if (newY >= minScrollY) {
      layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`;
      layerDOM.style.zIndex = 1;
      imageDOM.style.paddingTop = "75%";
      imageDOM.style.height = 0;
      imageDOM.style.zIndex = -1;
      buttonDOM.style["transform"] = `translate3d (0, ${newY}px, 0)`;
      buttonDOM.style["opacity"] = `${1 - percent * 2}`;
    } else if (newY < minScrollY) {
      // 往上滑动，但是超过 Header 部分
      layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`;
      layerDOM.style.zIndex = 1;
      // 防止溢出的歌单内容遮住 Header
      headerDOM.style.zIndex = 100;
      // 此时图片高度与 Header 一致
      imageDOM.style.height = `${HEADER_HEIGHT}px`;
      imageDOM.style.paddingTop = 0;
      imageDOM.style.zIndex = 99;
    }
  }, []);

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y });
  };
  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={() => props.history.goBack()}
    >
      <Container>
        <Header
          title={artist.name}
          ref={header}
          handleClick={setShowStatusFalse}
        ></Header>
        <ImgWrapper ref={imageWrapper} bgUrl={artist.picUrl}>
          <div className="filter"></div>
        </ImgWrapper>
        <CollectButton ref={collectButton}>
          <i className="iconfont">&#xe62d;</i>
          <span className="text"> 收藏 </span>
        </CollectButton>
        <BgLayer ref={layer}></BgLayer>
        <SongListWrapper ref={songScrollWrapper}>
          <Scroll ref={songScroll} onScroll={handleScroll}>
            <SongsList
              songs={songs}
              showCollect={false}
              musicAnimation={musicAnimation}
            ></SongsList>
          </Scroll>
        </SongListWrapper>

        {loading ? <Loading></Loading> : null}
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  );
};

export default memo(Singer);
