import React, { memo } from "react";

import PropTypes from "prop-types";

import Scroll from "../Scroll";

import { ListWrapper, List, ListItem } from "./style";

const Horizen = (props) => {
  const { list, oldVal, title } = props;

  const { handleClick } = props;

  return (
    <Scroll direction={"horizental"}>
      <ListWrapper>
        <List>
          <span>{title}</span>
          {list.map((item) => (
            <ListItem key={item.key} className={`${oldVal === item.key ? "selected" : ""}`} onClick={() => handleClick(item)}>
              {item.name}
            </ListItem>
          ))}
        </List>
      </ListWrapper>
    </Scroll>
  );
};

Horizen.defaultProps = {
  list: [],
  oldVal: "",
  title: "",
  handleClick: null,
};

Horizen.propTypes = {
  list: PropTypes.array,
  oldVal: PropTypes.string,
  title: PropTypes.string,
  handleClick: PropTypes.func,
};

export default memo(Horizen);
