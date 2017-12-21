//@flow
import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import Search from "../../components/icons/thin/Search";

const styles = {
  header: {
    marginBottom: 20,
    "& > div": {
      flex: 1,
      marginLeft: 30,
      "& > h3": {
        marginBottom: 8,
        fontSize: 11,
        fontWeight: 600,
        color: "#000"
      },
      "& > em": {
        fontStyle: "normal",
        fontSize: 11,
        color: "#767676"
      }
    }
  }
};

class SearchFiltersCardHeader extends Component<*> {
  render() {
    const { classes } = this.props;
    return (
      <header className={classes.header}>
        <Search width={24} height={32} color="#ccc" />
        <div>
          <h3>FILTERS</h3>
          <em>Find operations</em>
        </div>
      </header>
    );
  }
}

export default withStyles(styles)(SearchFiltersCardHeader);
