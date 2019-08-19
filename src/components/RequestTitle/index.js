// @flow
import React, { PureComponent } from "react";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { MdCreateNewFolder, MdDelete, MdEdit } from "react-icons/md";
import type { RequestActivityType } from "data/types";
import colors from "shared/colors";

const ICON_SIZE = 24;
const editIcon = <MdEdit size={ICON_SIZE} />;
const newIcon = <MdCreateNewFolder size={ICON_SIZE} />;
const deleteIcon = <MdDelete size={ICON_SIZE} />;

type Props = {
  type: RequestActivityType,
  entityTitle?: string,
};

class RequestTitle extends PureComponent<Props> {
  getIconByType = () => {
    const { type } = this.props;
    if (type.startsWith("CREATE")) {
      return newIcon;
    }
    if (
      type.startsWith("EDIT") ||
      type.startsWith("UPDATE") ||
      type.startsWith("MIGRATE")
    ) {
      return editIcon;
    }
    if (type.startsWith("REVOKE")) {
      return deleteIcon;
    }
  };

  render() {
    const { type, entityTitle } = this.props;
    return (
      <Box horizontal align="center" flow={5}>
        <Box horizontal align="center" flow={8}>
          <Box color={colors.lightGrey} justify="center">
            {this.getIconByType()}
          </Box>
          <Text i18nKey={`request:type.${type}`} noWrap />
        </Box>
        {entityTitle && (
          <Text uppercase noWrap>
            {entityTitle}
          </Text>
        )}
      </Box>
    );
  }
}

export default RequestTitle;
