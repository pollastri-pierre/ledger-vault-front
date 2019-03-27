// @flow

import React, { PureComponent, Fragment } from "react";
import { Trans, translate } from "react-i18next";
import type { Translate } from "data/types";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import InputAdornment from "@material-ui/core/InputAdornment";

import { FaUserEdit, FaLink, FaEdit } from "react-icons/fa";

import VaultButton from "components/base/Button";
import InputField from "components/InputField";
import Box from "components/base/Box";
import colors from "shared/colors";

type Props = {
  request_id: string,
  processUserInfo: (string, string, string) => Promise<*>,
  t: Translate,
};
type State = {
  username: string,
  user_id: string,
  userRole: string,
};

class InviteUserForm extends PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      user_id: "",
      userRole: props.t("inviteUser:form.radio.admin"),
    };
  }

  updateUsername = (username: string) => {
    this.setState({ username });
  };

  updateUserID = (user_id: string) => {
    this.setState({ user_id });
  };

  updateUserRole = (event: Object) => {
    this.setState({ userRole: event.target.value });
  };

  processUserInfo = async () => {
    const { processUserInfo } = this.props;
    const { userRole, username, user_id } = this.state;
    await processUserInfo(username, user_id, userRole);
  };

  render() {
    const { request_id, t } = this.props;
    const { userRole, username, user_id } = this.state;
    return (
      <Fragment>
        <Box flow={20}>
          <FormControl disabled={!!request_id}>
            <RadioGroup
              row
              name="userRole"
              value={userRole}
              onChange={this.updateUserRole}
            >
              <FormControlLabel
                value={t("inviteUser:form.radio.admin")}
                control={<Radio />}
                label={t("inviteUser:form.radio.admin")}
              />
              <FormControlLabel
                value={t("inviteUser:form.radio.operator")}
                control={<Radio />}
                label={t("inviteUser:form.radio.operator")}
              />
            </RadioGroup>
          </FormControl>
          <InputField
            value={username}
            label={t("inviteUser:form.labelUsername")}
            onChange={this.updateUsername}
            placeholder={t("inviteUser:form.placeholderUsername")}
            fullWidth
            maxLength={19}
            onlyAscii
            InputProps={{
              endAdornment: !!request_id && (
                <InputAdornment position="end">
                  <FaEdit color={colors.lead} />
                </InputAdornment>
              ),
            }}
            error={null}
          />
          <InputField
            value={user_id}
            label={t("inviteUser:form.labelUserID")}
            onChange={this.updateUserID}
            placeholder={t("inviteUser:form.placeholderUserID")}
            fullWidth
            maxLength={20}
            InputProps={{
              endAdornment: !!request_id && (
                <InputAdornment position="end">
                  <FaEdit color={colors.lead} />
                </InputAdornment>
              ),
            }}
            error={null}
          />
          <VaultButton
            onClick={this.processUserInfo}
            disabled={!username || !user_id}
            IconLeft={request_id ? FaUserEdit : FaLink}
            size="small"
            variant="outlined"
            type="submit"
          >
            {request_id ? (
              <Trans i18nKey="inviteUser:updateMember" />
            ) : (
              <Trans i18nKey="inviteUser:generateLink" />
            )}
          </VaultButton>
        </Box>
      </Fragment>
    );
  }
}

export default translate()(InviteUserForm);
