import React, { memo, useEffect, useRef } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { renderRoutes } from "react-router-config";
import routes from "../../routes";
import * as actionTypes from "./store/actionCreators";

import Slider from "../../components/Slider";
import RecommendList from "../../components/List";
import Scroll from "../../baseUI/Scroll";
import { Content } from "./style";
import { forceCheck } from "react-lazyload";

const Recommend = (props) => {
  // console.log(props);
  //mock 数据
  // const bannerList = [1, 2, 3, 4].map((item) => {
  //   return { imageUrl: "https://img01.yzcdn.cn/vant/cat.jpeg" };
  // });

  // const recommendList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => {
  //   return {
  //     id: 1,
  //     picUrl: "https://p1.music.126.net/fhmefjUfMD-8qtj3JKeHbA==/18999560928537533.jpg",
  //     playCount: 17171122,
  //     name: "朴树、许巍、李健、郑钧、老狼、赵雷",
  //   };
  // });
  const scrollRef = useRef();

  const { bannerList, recommendList } = useSelector(
    (state) => ({
      bannerList: state.getIn(["recommend", "bannerList"]),
      recommendList: state.getIn(["recommend", "recommendList"]),
    }),
    shallowEqual
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!bannerList.length) {
      dispatch(actionTypes.getBannerList());
    }
    if (!recommendList.length) {
      dispatch(actionTypes.getRecommendList());
    }
    setTimeout(() => {
      scrollRef.current.refresh();
    }, 50);
  }, [dispatch]);

  return (
    <Content>
      <Scroll className="list" ref={scrollRef} onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerList}></Slider>
          <RecommendList recommendList={recommendList}></RecommendList>
        </div>
      </Scroll>
      {renderRoutes(props.route.routes)}
    </Content>
  );
};

export default memo(Recommend);
