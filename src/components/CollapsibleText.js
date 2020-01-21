// @flow

import React from "react";
import Box from "components/base/Box";
import Text from "components/base/Text";
import LineRow from "components/LineRow";
import LineSeparator from "components/LineSeparator";
import NotApplicableText from "components/base/NotApplicableText";

type Props = {
  label: React$Node,
  content: string,
  visibleContentLength?: number,
  noBorder?: boolean,
};
export default function CollapsibleText(props: Props) {
  const { label, content, visibleContentLength, noBorder, ...p } = props;

  const isExcerpt = content.length > (visibleContentLength || 60);

  return (
    <LineRow
      label={label}
      collapsibleState={isExcerpt ? "collapsed" : null}
      collapsibleChildren={
        isExcerpt ? (
          <>
            <Text>{content}</Text>
            {!noBorder && <LineSeparator />}
          </>
        ) : null
      }
    >
      <Box width={350} align={!isExcerpt ? "flex-end" : "initial"}>
        <Text ellipsis {...p}>
          {content.length ? content : <NotApplicableText />}
        </Text>
      </Box>
    </LineRow>
  );
}
