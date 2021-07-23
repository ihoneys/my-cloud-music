import React, { memo, useEffect, useState, useRef } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import Horizen from "../../baseUI/horizen-item";
import { categoryTypes, alphaTypes } from "../../api/local-data";
import { NavContanier, List, ListItem, ListContainer } from "./style";

import { getSingerList, getHotSingerList, changeEnterLoading, changePageCount, refreshMoreSingerList, changePullUpLoading, changePullDownLoading, refreshMoreHotSingerList } from "./store/actionCreators";

import Scroll from "../../baseUI/Scroll";
import LazyLoad, { forceCheck } from "react-lazyload";
import musicCover from "../../assets/music.png";
import Loading from "../../baseUI/Loading";

console.log(require("../../assets/music.png"));
const RenderSingerList = (props) => {
  const { singerList } = props;
  return (
    <List>
      {singerList.map((item, index) => (
        <ListItem key={item.accountId + "" + index}>
          <div className="img_wrapper">
            <LazyLoad placeholder={<img width="100%" height="100%" src={musicCover} alt="music" />}>
              <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music" />
            </LazyLoad>
          </div>
          <span className="name">{item.name}</span>
        </ListItem>
      ))}
    </List>
  );
};

export default memo(function Singers() {
  let [category, setCategory] = useState(categoryTypes[0].key);
  let [categoryItem, setCategoryItem] = useState(categoryTypes[0]);
  let [alpha, setAlpha] = useState(alphaTypes[0].key);

  const handleUpdateCategory = (item) => {
    const { key, type, area } = item;
    setCategoryItem(item);
    setCategory(key);
    updateDispatch(type, area, alpha);
  };

  const handleUpdateAlpha = ({ key }) => {
    const { type, area } = categoryItem;
    setAlpha(key);
    updateDispatch(type, area, key);
  };

  const updateDispatch = (type, area, alpha) => {
    dispatch(changePageCount(0));
    dispatch(changeEnterLoading(true));
    dispatch(getSingerList(type, area, alpha));
  };

  const pullUpRefreshDispatch = (type, area, alpha, hot, count) => {
    dispatch(changePullUpLoading(true));
    dispatch(changePageCount(count + 1));
    if (hot) {
      dispatch(refreshMoreHotSingerList());
    } else {
      dispatch(refreshMoreSingerList(type, area, alpha));
    }
  };

  const pullDownRefreshDispatch = (type, area, alpha) => {
    dispatch(changePullDownLoading(true));
    dispatch(changePageCount(0)); //属于重新获取数据
    if (!type && !area && !alpha) {
      dispatch(getHotSingerList());
    } else {
      dispatch(getSingerList(type, area, alpha));
    }
  };

  const { singerList, enterLoading, pullUpLoading, pullDownLoading, pageCount } = useSelector(
    (state) => ({
      singerList: state.getIn(["singers", "singerList"]),
      enterLoading: state.getIn(["singers", "enterLoading"]),
      pullUpLoading: state.getIn(["singers", "pullUpLoading"]),
      pullDownLoading: state.getIn(["singers", "pullDownLoading"]),
      pageCount: state.getIn(["singers", "pageCount"]),
    }),
    shallowEqual
  );

  const scrollRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!singerList.length) {
      dispatch(getHotSingerList());
    }
  }, []);

  // if (!enterLoading) {
  //   scrollRef.current.refresh();
  // }

  const handlePullUp = () => {
    const { type, area } = categoryItem;
    pullUpRefreshDispatch(type, area, alpha, category === "", pageCount);
  };

  const handlePullDown = () => {
    const { type, area } = categoryItem;
    pullDownRefreshDispatch(type, area, alpha);
  };

  console.log(singerList, "singerList");

  return (
    <div>
      <NavContanier>
        <Horizen list={categoryTypes} title={"分类（默认热门）："} handleClick={handleUpdateCategory} oldVal={category} />
        <Horizen list={alphaTypes} title={"首字母:"} handleClick={(val) => handleUpdateAlpha(val)} oldVal={alpha}></Horizen>
      </NavContanier>
      <ListContainer>
        <Scroll onScroll={forceCheck} ref={scrollRef} pullUp={handlePullUp} pullDown={handlePullDown} pullUpLoading={pullUpLoading} pullDownLoading={pullDownLoading}>
          <RenderSingerList singerList={singerList} />
        </Scroll>
      </ListContainer>
      <Loading show={enterLoading}></Loading>
    </div>
  );
});
