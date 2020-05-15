// @flow

import React from "react";

import Box from "components/base/Box";
import type { Group } from "data/types";

import { List, ListEmpty, ListItem } from "./List";

type Display = "list" | "grid";

type Props = {
  groups: Group[],
  display?: Display,
  tileWidth?: number,
  compact?: boolean,
};

export default function GroupsList(props: Props) {
  const { groups, display, tileWidth, compact } = props;

  if (!groups.length) {
    return <ListEmpty>No groups</ListEmpty>;
  }

  return (
    <List display={display} compact={compact}>
      {groups.map((group) => (
        <ListItem
          display={display}
          tileWidth={tileWidth}
          compact={compact}
          key={group.id}
          to={`/groups/details/${group.id}/overview`}
        >
          <Box horizontal align="center">
            <Box grow>{group.name}</Box>
            <Box noShrink>{group.members.length} member(s)</Box>
          </Box>
        </ListItem>
      ))}
    </List>
  );
}
