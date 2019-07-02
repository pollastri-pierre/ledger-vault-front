import styled from "styled-components";

export default styled.div`
  display: flex;
  align-items: flex-start;

  > * {
    flex: 1;
  }

  > * + * {
    margin-left: 20px;
    margin-top: 0;
  }

  @media (max-width: ${p => p.breakpoint || 900}px) {
    flex-direction: column;
    align-items: stretch;
    > * + * {
      margin-top: 20px;
      margin-left: 0;
    }
  }
`;
