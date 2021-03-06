import React, { memo, useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { playMode } from "../../api/config";
import { findIndex, getSongUrl, isEmptyObject, shuffle } from "../../api/utils";
import Toast from "../../baseUI/Toast";
import MinPlayer from "./MinPlayer";
import NormalPlayer from "./NormalPlayer";

import {
  changePlayingState,
  changeShowPlayList,
  changeCurrentIndex,
  changeCurrentSong,
  changePlayList,
  changePlayMode,
  changeFullScreen,
} from "./store/actionCreators";

const Player = (props) => {
  const currentSongs = {
    al: {
      picUrl:
        "https://p1.music.126.net/JL_id1CFwNJpzgrXwemh4Q==/109951164172892390.jpg",
    },
    name: "木偶人",
    ar: [{ name: "薛之谦" }],
  };
  // const playList = [
  //   {
  //     ftype: 0,
  //     djId: 0,
  //     a: null,
  //     cd: "01",
  //     crbt: null,
  //     no: 1,
  //     st: 0,
  //     rt: "",
  //     cf: "",
  //     alia: ["手游《梦幻花园》苏州园林版推广曲"],
  //     rtUrls: [],
  //     fee: 0,
  //     s_id: 0,
  //     copyright: 0,
  //     h: {
  //       br: 320000,
  //       fid: 0,
  //       size: 9400365,
  //       vd: -45814,
  //     },
  //     mv: 0,
  //     al: {
  //       id: 84991301,
  //       name: "拾梦纪",
  //       picUrl:
  //         "http://p1.music.126.net/M19SOoRMkcHmJvmGflXjXQ==/109951164627180052.jpg",
  //       tns: [],
  //       pic_str: "109951164627180052",
  //       pic: 109951164627180050,
  //     },
  //     name: "拾梦纪",
  //     l: {
  //       br: 128000,
  //       fid: 0,
  //       size: 3760173,
  //       vd: -41672,
  //     },
  //     rtype: 0,
  //     m: {
  //       br: 192000,
  //       fid: 0,
  //       size: 5640237,
  //       vd: -43277,
  //     },
  //     cp: 1416668,
  //     mark: 0,
  //     rtUrl: null,
  //     mst: 9,
  //     dt: 234947,
  //     ar: [
  //       {
  //         id: 12084589,
  //         name: "妖扬",
  //         tns: [],
  //         alias: [],
  //       },
  //       {
  //         id: 12578371,
  //         name: "金天",
  //         tns: [],
  //         alias: [],
  //       },
  //     ],
  //     pop: 5,
  //     pst: 0,
  //     t: 0,
  //     v: 3,
  //     id: 1416767593,
  //     publishTime: 0,
  //     rurl: null,
  //   },
  // ];
  const {
    fullScreen,
    playing,
    currentSong,
    showPlayList,
    mode,
    currentIndex,
    playList,
    sequencePlayList,
  } = useSelector((state) => ({
    fullScreen: state.getIn(["player", "fullScreen"]),
    playing: state.getIn(["player", "playing"]),
    currentSong: state.getIn(["player", "currentSong"]).toJS(),
    showPlayList: state.getIn(["player", "fullScreen"]),
    mode: state.getIn(["player", "mode"]),
    currentIndex: state.getIn(["player", "currentIndex"]),
    playList: state.getIn(["player", "currentIndex"]).toJS(),
    sequencePlayList: state.getIn(["player", "currentIndex"]).toJS(),
  }));

  //记录当前的歌曲，以便于下次重渲染时比对是否是一首歌
  const [preSong, setPreSong] = useState({});

  useEffect(() => {
    if (
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      playList[currentIndex].id === preSong.id
    )
      return;
    let current = playList[currentIndex];
    changeCurrentDispatch(current);
    setPreSong(current);
    audioRef.current.src = getSongUrl(current.id);
    setTimeout(() => {
      audioRef.current.play();
    });
    togglePlayingDispatch(true);
    setCurrentTime(0);
    setDuration((current.dt / 1000) | 0); // 时长
  }, [playList, currentIndex]);

  // useEffect(() => {
  //   playing ? audioRef.current.play() : audioRef.current.pause();
  // }, [playing]);

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  const [modeText, setModeText] = useState("");

  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;

  const audioRef = useRef();

  const toastRef = useRef();

  const dispatch = useDispatch();

  const togglePlayingDispatch = (data) => {
    dispatch(changePlayingState(data));
  };

  const toggleFullScreenDispatch = (data) => {
    dispatch(changeFullScreen(data));
  };

  const togglePlayListDispatch = (data) => {
    dispatch(changeShowPlayList(data));
  };

  const changeCurrentIndexDispatch = (data) => {
    dispatch(changeCurrentIndex(data));
  };

  const changeCurrentDispatch = (data) => {
    dispatch(changeCurrentSong(data));
  };

  const changeModeDispatch = (data) => {
    dispatch(changePlayMode(data));
  };

  const changePlayListDispatch = (data) => {
    dispatch(changePlayList(data));
  };

  const clickPlaying = (e, state) => {
    e.stopPropagation();
    togglePlayingDispatch(state);
  };

  const updateTime = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  const onProgressChange = (curPercent) => {
    const newTime = curPercent * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    if (!playing) {
      togglePlayingDispatch(true);
    }
  };

  const handleLoop = () => {
    audioRef.current.currentTime = 0;
    changePlayingState(true);
    audioRef.current.play();
  };

  const handlePrev = () => {
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex - 1;
    if (index < 0) index = playList.length - 1;
    if (!playing) togglePlayingDispatch(true);
    changeCurrentDispatch(index);
  };

  const handleNext = () => {
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex + 1;
    if (index === playList.length) index = 0;
    if (!playing) togglePlayingDispatch(false);
    changeCurrentIndexDispatch(index);
  };

  const changeMode = () => {
    let newMode = (mode + 1) % 3;
    if (newMode === 0) {
      //顺序模式
      changePlayListDispatch(sequencePlayList);
      let index = findIndex(currentSong, sequencePlayList);
      changeCurrentIndexDispatch(index);
      setModeText("顺序循环");
    } else if (newMode === 1) {
      //单曲循环
      changePlayListDispatch(sequencePlayList);
      setModeText("单曲循环");
    } else if (newMode === 2) {
      //随机播放
      let newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong, newList);
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
      setModeText("随机播放");
    }
    changeModeDispatch(newMode);
    toastRef.current.show();
  };

  const handleEnd = () => {
    if (mode === playMode.loop) {
      handleLoop();
    } else {
      handleNext();
    }
  };
  return (
    <div>
      {isEmptyObject(currentSong) ? null : (
        <MinPlayer
          song={currentSong}
          fullScreen={fullScreen}
          playing={playing}
          percent={percent} //进度
          toggleFullScreen={toggleFullScreenDispatch}
          clickPlaying={clickPlaying}
        ></MinPlayer>
      )}
      {isEmptyObject(currentSong) ? null : (
        <NormalPlayer
          song={currentSong}
          playing={playing}
          mode={mode}
          percent={percent} //进度
          fullScreen={fullScreen}
          duration={duration} //总时长
          currentTime={currentTime} //播放时间
          toggleFullScreen={toggleFullScreenDispatch}
          clickPlaying={clickPlaying}
          onProgressChange={onProgressChange}
          handlePrev={handlePrev}
          handleNext={handleNext}
          changeMode={changeMode}
        ></NormalPlayer>
      )}

      <audio ref={audioRef} onTimeUpdate={updateTime}></audio>
      <Toast text={modeText} ref={toastRef} onEnded={handleEnd}></Toast>
    </div>
  );
};

export default memo(Player);
