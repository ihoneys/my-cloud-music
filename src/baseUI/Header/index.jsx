import React from "react";

import styled from "styled-components";
import style from "../../assets/global-style";
import PropTypes from "prop-types";

const HeaderContainer = styled.div`
  position: fixed;
  padding: 5px 10px;
  padding-top: 0;
  height: 40px;
  width: 100%;
  z-index: 100;
  display: flex;
  line-height: 40px;
  color: ${style["font-color-light"]};
  .back {
    margin-right: 5px;
    font-size: 20px;
    width: 20px;
  }
  > h1 {
    font-size: ${style["font-size-l"]};
    font-weight: 700;
  }
`;

const Header = React.forwardRef((props, ref) => {
  const { handleClick, title, isMarquee } = props;

  return (
    <HeaderContainer ref={ref} onClick={handleClick}>
      <i className="iconfont back">
        &#xe655;
      </i>
      {isMarquee ? null : <h1>{title}</h1>}
    </HeaderContainer>
  );
});

Header.propTypes = {
  handleClick: PropTypes.func,
  title: PropTypes.string,
  isMarquee: PropTypes.bool,
};

Header.defaultProps = {
  handleClick: () => {},
  title: "标题",
  isMarquee: false,
};

export default React.memo(Header);
