//@flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import ArrowDown from "../icons/ArrowDown";
import colors from "../../shared/colors";
import { withStyles } from "material-ui/styles";
import classnames from "classnames";
import PopBubble from "../utils/PopBubble.js";
const contextTypes = {
  onOptionClick: PropTypes.func.isRequired
};

const stylesOptions = {
  base: {
    padding: "10px",
    opacity: "0.5",
    cursor: "pointer",
    "&:after": {
      background: colors.ocean,
      content: '""',
      height: "26px",
      width: "0px",
      position: "absolute",
      marginTop: "-5px",
      right: "0",
      opacity: "0"
    },
    "&:hover:after": {
      opacity: "1",
      width: "5px",
      transition: "width 200ms ease"
    }
  },
  selected: {
    opacity: "1",
    "&:after": {
      opacity: "1",
      width: "5px"
    }
  }
};

class Option_c<T> extends Component<{
  children: string | React$Node,
  value: T, // data to attach to the option that will be passed to onChange
  selected?: boolean
}> {
  context: {
    onOptionClick: T => void
  };
  static contextTypes = contextTypes;
  render() {
    const { selected, value, children, classes } = this.props;
    const { onOptionClick } = this.context;
    return (
      <div
        className={classnames(classes.base, { [classes.selected]: selected })}
        onClick={() => onOptionClick(value)}
      >
        {children}
      </div>
    );
  }
}

export const Option = withStyles(stylesOptions)(Option_c);

// TODO we need to have a max-height and scroll because on big select, it will go off screen (see Settings screen)
const styleSelect = {
  label: {
    display: "inline-block",
    verticalAlign: "middle",
    color: colors.ocean,
    "& div": {
      padding: "0 10px 0 10px"
    },
    "& div:after": {
      display: "none"
    }
  }
};
class Select_c<T> extends Component<
  {
    onChange: (value: T) => void,
    children: React$Node,
    theme: "blue" | "black"
  },
  {
    isOpen: boolean
  }
> {
  static childContextTypes = contextTypes;
  filter: ?HTMLElement;

  static defaultProps = {
    theme: "blue"
  };

  state = {
    isOpen: false
  };

  getChildContext() {
    return {
      onOptionClick: this.onOptionClick
    };
  }

  onFilterRef = (el: *) => {
    this.filter = el;
  };

  onOptionClick = (value: T) => {
    this.close();
    this.props.onChange(value);
  };

  close = () => {
    this.setState({ isOpen: false });
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const { children, theme, classes } = this.props;
    const { isOpen } = this.state;
    const arrayChildren = React.Children.toArray(children);
    const selectedOption =
      arrayChildren.find(({ props }) => props.selected) || arrayChildren[0];
    return (
      <div className="Select">
        <div
          className={`LabelSelectField ${theme}`}
          ref={this.onFilterRef}
          onClick={() => this.toggle()}
        >
          <ArrowDown />
          <span className={classes.label}>{selectedOption}</span>
        </div>
        <PopBubble
          open={isOpen}
          anchorEl={this.filter}
          onRequestClose={this.close}
          className="Select-menu"
          style={{
            boxShadow:
              "0 0 5px 0 rgba(0, 0, 0, 0.04), 0 10px 10px 0 rgba(0, 0, 0, 0.04)",
            padding: "20px",
            fontSize: "11px",
            textAlign: "right"
          }}
        >
          {children}
        </PopBubble>
      </div>
    );
  }
}

export const Select = withStyles(styleSelect)(Select_c);
