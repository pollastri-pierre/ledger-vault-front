// @flow

// ----------------------------------------------------------------------------
// -                    TODO: REFACTOR WITH BOX & STUFF                       -
// ----------------------------------------------------------------------------

import React, { PureComponent } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import { Trans } from "react-i18next";
import { FaRegCopy } from "react-icons/fa";

import colors from "shared/colors";

import Text from "components/base/Text";
import Box from "components/base/Box";
import Absolute from "components/base/Absolute";
import InfoBox from "components/base/InfoBox";

import { SectionTitle, SectionRow } from "./SettingsSection";

type Props = {
  derivationPath: string,
  xpub: string,
};

type State = {
  isXpubWarning: boolean,
  hasUnderstoodCopy: boolean,
};

class XPUBDisplay extends PureComponent<Props, State> {
  state = {
    isXpubWarning: false,
    hasUnderstoodCopy: false,
  };

  toggleXpub = () => {
    this.setState(state => ({ isXpubWarning: !state.isXpubWarning }));
  };

  toggleCopy = () => {
    this.setState(state => ({ hasUnderstoodCopy: !state.hasUnderstoodCopy }));
  };

  render() {
    const { xpub, derivationPath } = this.props;
    const { isXpubWarning, hasUnderstoodCopy } = this.state;

    const title = <Trans i18nKey="accountSettings:advanced.title" />;
    const derivationPathLabel = (
      <Trans i18nKey="accountSettings:advanced.derivation_path" />
    );
    const xpubLabel = <Trans i18nKey="accountSettings:advanced.xpub" />;

    return (
      <Box>
        <SectionTitle title={title} />

        <SectionRow label={derivationPathLabel}>
          <Text small>{derivationPath}</Text>
        </SectionRow>

        <SectionRow label={xpubLabel} onClick={this.toggleXpub}>
          <Box horizontal>
            <FaRegCopy
              size={13}
              className={styles.icon}
              color={colors.lightGrey}
            />
            <Text bold>
              <Trans i18nKey="accountSettings:advanced.copy" />
            </Text>
          </Box>
        </SectionRow>

        {isXpubWarning && (
          <Box position="relative" flow={20}>
            <InfoBox type="error" withIcon>
              <Text small>
                <Trans i18nKey="accountSettings:advanced.warning" />
                <Absolute bottom={0} left={8}>
                  <Checkbox color="secondary" checked={hasUnderstoodCopy} />
                  <Text style={styles.understandStyle}>I understand</Text>
                </Absolute>
                {hasUnderstoodCopy && (
                  <Absolute bottom={10} right={10}>
                    <CopyToClipboard text={xpub}>
                      <Button variant="outlined" size="small" color="secondary">
                        <FaRegCopy size={13} className={styles.icon} />
                        <span>Copy XPUB</span>
                      </Button>
                    </CopyToClipboard>
                  </Absolute>
                )}
              </Text>
            </InfoBox>
          </Box>
        )}
      </Box>
    );
  }
}

const styles = {
  understandStyle: {
    cursor: "pointer",
    color: "black",
    display: "inline-block",
    verticalAlign: "middle",
  },
  icon: {
    marginRight: 5,
  },
};

export default XPUBDisplay;
