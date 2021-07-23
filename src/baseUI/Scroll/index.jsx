import { forwardRef, useState, useEffect, useImperativeHandle, useRef, useMemo } from "react";

import { ScrollContanier, PullUpLoading, PullDownLoading } from "./style";

import { debounce } from "../../api/utils";

import PropTypes from "prop-types";
import BScroll from "better-scroll";

import Loading from "../Loading/index";
import LoadingV2 from "../Loading-v2";

const Scroll = forwardRef((props, ref) => {
  const [bScroll, setBScroll] = useState();

  const scrollContaninerRef = useRef();

  const { direction, click, refresh, pullUpLoading, pullDownLoading, bounceTop, bounceBottom } = props;

  const { pullUp, pullDown, onScroll } = props;

  let pullUpDebounce = useMemo(() => {
    return debounce(pullUp, 300);
  }, [pullUp]);

  let pullDownDebounce = useMemo(() => {
    return debounce(pullDown, 300);
  });

  useEffect(() => {
    const scroll = new BScroll(scrollContaninerRef.current, {
      scrollX: direction === "horizental",
      scrollY: direction === "vertical",
      probeType: 3,
      click: click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom,
      },
    });
    setBScroll(scroll);
    return () => {
      setBScroll(null);
    };
  }, []);

  useEffect(() => {
    if (!bScroll || !onScroll) return;
    bScroll.on("scroll", (scroll) => {
      onScroll(scroll);
    });

    return () => {
      bScroll.off("scroll");
    };
  }, [onScroll, bScroll]);

  // 滑动到底部
  useEffect(() => {
    if (!bScroll || !pullUp) return;

    const handlePullUp = () => {
      // 判断是否滑动到了底部
      if (bScroll.y <= bScroll.maxScrollY + 100) {
        pullUpDebounce();
      }
    };
    bScroll.on("scrollEnd", handlePullUp);

    return () => {
      bScroll.off("scrollEnd", handlePullUp);
    };
  }, [pullUp, pullUpDebounce, bScroll]);

  // 判断用户下拉动作
  useEffect(() => {
    if (!bScroll || !pullDown) return;
    const handlePullDown = (pos) => {
      // 判断用户的下拉动作
      if (pos.y > 50) {
        pullDownDebounce();
      }
    };
    bScroll.on("touchEnd", handlePullDown);
    return () => {
      bScroll.off("touchEnd", handlePullDown);
    };
  }, [pullDown, pullDownDebounce, bScroll]);

  useImperativeHandle(ref, () => ({
    refresh() {
      if (bScroll) {
        bScroll.refresh();
        bScroll.scrollTo(0, 0);
      }
    },
    getBScroll() {
      if (bScroll) {
        return bScroll;
      }
    },
  }));

  const PullUpdisplayStyle = pullUpLoading ? { display: "" } : { display: "none" };
  const PullDowndisplayStyle = pullDownLoading ? { display: "" } : { display: "none" };

  return (
    <ScrollContanier ref={scrollContaninerRef}>
      {props.children}
      <PullUpLoading style={PullUpdisplayStyle}>
        <Loading></Loading>
      </PullUpLoading>
      <PullDownLoading style={PullDowndisplayStyle}>
        <LoadingV2></LoadingV2>
      </PullDownLoading>
    </ScrollContanier>
  );
});

Scroll.propTypes = {
  direction: PropTypes.oneOf(["vertical", "horizental"]), // 滚动的方向
  click: PropTypes.bool, // 是否支持点击
  refresh: PropTypes.bool, // 是否刷新
  onScroll: PropTypes.func, // 滑动触发的回调函数
  pullUp: PropTypes.func, // 上拉加载逻辑
  pullDown: PropTypes.func, // 下拉加载逻辑
  pullUpLoading: PropTypes.bool, // 是否显示上拉 loading 动画
  pullDownLoading: PropTypes.bool, // 是否显示下拉 loading 动画
  bounceTop: PropTypes.bool, // 是否支持向上吸顶
  bounceBottom: PropTypes.bool, // 是否支持向下吸底
};

Scroll.defaultProps = {
  direction: "vertical",
  click: true,
  refresh: true,
  onScroll: null,
  pullUpLoading: false,
  pullDownLoading: false,
  pullUp: null,
  pullDown: null,
  bounceTop: true,
  bounceBottom: true,
};

export default Scroll;
