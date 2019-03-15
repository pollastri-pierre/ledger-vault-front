// @flow
import React, { PureComponent, Fragment } from "react";
import type { Match } from "react-router-dom";
import ModalRoute from "components/ModalRoute";
import CreateGroup from "containers/Admin/Groups/CreateGroup";
import GroupDetails from "containers/Admin/Groups/GroupDetails";

type Props = {
  match: Match,
};

class Modals extends PureComponent<Props> {
  render() {
    return (
      <Fragment>
        <ModalRoute
          path="*/groups/:groupId"
          render={(
            props, // looks hacky but prevent bug with <Switch> and ModalRoute with the overlay animation
          ) =>
            props.match.params.groupId === "new" ? (
              <CreateGroup {...props} />
            ) : (
              <GroupDetails {...props} />
            )
          }
        />
      </Fragment>
    );
  }
}

export default Modals;
