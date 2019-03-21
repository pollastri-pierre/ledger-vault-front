// @flow
import React, { PureComponent } from "react";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { MdCreateNewFolder, MdDelete, MdEdit } from "react-icons/md";
import type { RequestActivityType } from "data/types";
import colors from "shared/colors";

const ICON_SIZE = 20;
const editIcon = <MdEdit size={ICON_SIZE} />;
const newIcon = <MdCreateNewFolder size={ICON_SIZE} color={colors.lightGrey} />;
const deleteIcon = <MdDelete size={ICON_SIZE} color={colors.lightGrey} />;

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
    if (type.startsWith("EDIT")) {
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
          {this.getIconByType()}
          <Text i18nKey={`request:type.${type}`} />
        </Box>
        {entityTitle && <Text uppercase>{entityTitle}</Text>}
      </Box>
    );
  }
}

export default RequestTitle;
