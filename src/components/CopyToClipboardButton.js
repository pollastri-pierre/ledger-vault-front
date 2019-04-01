// @flow
import React, { Component } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Button from "@material-ui/core/Button";
import styled from "styled-components";
import Copy from "components/icons/Copy";
import Box from "components/base/Box";
import Text from "components/base/Text";
import colors from "shared/colors";

type Props = {
  textToCopy: string,
  visible?: boolean,
};

type State = {
  copied: boolean,
};

const ButtonContainer = styled(Box)`
  display: ${p => (p.visible ? "flex" : "none")};
`;
const Container = styled(Box).attrs({
  horizontal: true,
  justify: "space-between",
})`
  align-items: center;
  &:hover {
    cursor: ${p => !p.visible && "pointer"};
    ${ButtonContainer} {
      display: ${p => !p.visible && "flex"};
    }
  }
`;
const styles = {
  text: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};
class CopyToClipboardButton extends Component<Props, State> {
  state = {
    copied: false,
  };

  componentWillUnmount() {
    if (this._timeout) clearTimeout(this._timeout);
  }

  onCopy = () => {
    this.setState({ copied: true });
    this._timeout = setTimeout(() => this.setState({ copied: false }), 1e3);
  };

  _timeout: ?TimeoutID = null;

  render() {
    const { textToCopy } = this.props;
    const { copied } = this.state;
    return (
      <Container {...this.props}>
        <Text style={styles.text} {...this.props}>
          {textToCopy}
        </Text>
        <CopyToClipboard text={textToCopy} onCopy={this.onCopy}>
          <ButtonContainer {...this.props}>
            <Button size="small">
              {copied ? (
                <Text
                  color={colors.ocean}
                  i18nKey="transactionDetails:overview.copied"
                />
              ) : (
                <Box horizontal align="center" flow={5}>
                  <Copy color={colors.ocean} size={12} />
                  <Text
                    color={colors.ocean}
                    i18nKey="transactionDetails:overview.copy"
                  />
                </Box>
              )}
            </Button>
          </ButtonContainer>
        </CopyToClipboard>
      </Container>
    );
  }
}

export default CopyToClipboardButton;
