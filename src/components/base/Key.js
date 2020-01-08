// @flow

import styled from "styled-components";

export default styled.div`
  display: inline-flex;
  align: center;
  padding: 3px;
  border-radius: 3px;
  line-height: 1;
  color: #aaa;
  font-size: 10px;
  border: 1px solid #ddd;
  box-shadow: #ddd 0 1px 0px, #eee 0 2px 3px;
  user-select: none;
  > * + * {
    margin-left: 5px;
  }
`;
