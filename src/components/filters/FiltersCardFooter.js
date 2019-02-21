// @flow

import React, { PureComponent } from "react";
import Button from "@material-ui/core/Button";

import Box from "components/base/Box";

type Props = {
  onClear: () => void
};

class FiltersCardFooter extends PureComponent<Props> {
  render() {
    const { onClear } = this.props;
    return (
      <Box align="flex-start">
        <Button color="secondary" onClick={onClear}>
          Clear filters
        </Button>
      </Box>
    );
  }
}

export default FiltersCardFooter;
