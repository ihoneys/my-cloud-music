import React, { memo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getRankList } from "./store/index";

import { renderRoutes } from "react-router-config";

import { filterIndex } from "../../api/utils";

import Scroll from "../../baseUI/Scroll";
import Loading from "../../baseUI/Loading";

import { Container, List, ListItem, SongList } from "./style";
import { EnterLoading } from "../Singers/style";

export default memo(function Rank(props) {
  const { rankList, loading } = useSelector((state) => ({
    rankList: state.getIn(["rank", "rankList"]).toJS(),
    loading: state.getIn(["rank", "loading"]),
  }));

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getRankList());
  }, [dispatch]);

  const globalStartIndex = filterIndex(rankList);
  const officialList = rankList.slice(0, globalStartIndex);
  const globalList = rankList.slice(globalStartIndex);

  console.log(rankList);

  const enterDetail = ({ id }) => {
    props.history.push(`/rank/${id}`);
  };

  const renderRankList = (list, global) => {
    return (
      <List globalRank={global}>
        {list.map((item) => (
          <ListItem
            key={item.coverImgUrl}
            tracks={item.tracks}
            onClick={() => enterDetail(item)}
          >
            <div className="img_wrapper">
              <img src={item.coverImgUrl} alt="" />
              <div className="decorate"></div>
              <span className="update_frequecy">{item.updateFrequency}</span>
            </div>
            {renderSongList(item.tracks)}
          </ListItem>
        ))}
      </List>
    );
  };

  const renderSongList = (list) => {
    return list.length ? (
      <SongList>
        {list.map((item, index) => {
          return (
            <li key={index}>
              {index + 1}. {item.first} - {item.second}
            </li>
          );
        })}
      </SongList>
    ) : null;
  };

  // 榜单数据未加载出来之前都给隐藏
  let displayStyle = loading ? { display: "none" } : { display: "" };

  return (
    <Container>
      <Scroll>
        <div>
          <h1 className="offical" style={displayStyle}>
            官方榜
          </h1>
          {renderRankList(officialList)}
          <h1 className="global" style={displayStyle}>
            全球榜
          </h1>
          {renderRankList(globalList, true)}
          {loading ? (
            <EnterLoading>
              <Loading></Loading>
            </EnterLoading>
          ) : null}
        </div>
      </Scroll>
      {renderRoutes(props.route.routes)}
    </Container>
  );
});
