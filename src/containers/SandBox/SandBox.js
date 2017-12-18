//
// Sandbox for tests and stuff
//

import React, { Component, Fragment } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import List, { ListItem } from "material-ui/List";
import { MenuItem } from "material-ui/Menu";
import MUISelect from "material-ui/Select";
import Input from "material-ui/Input";
import Paper from "material-ui/Paper";
import { connect } from "react-redux";
import { Row, Col } from "./grid/Grid";
import BlurDialog from "../../components/BlurDialog";
import { Alert, Overscroll } from "../../components";
import { switchLocale } from "../../redux/modules/locale";
import ArrowDown from "../../components/icons/ArrowDown";

import "./SandBox.css";

const Select = ({
  triangleLeft,
  tickerRight,
  iconLeft,
  blue,
  renderValue,
  ...props
}) => (
  <MUISelect
    {...props}
    className={classNames({
      "MuiSelect-disable-arrow": blue
    })}
    renderValue={
      blue
        ? value => (
            <span style={{ color: "#27d0e2" }}>
              <ArrowDown width={11} style={{ marginRight: 20 }} />
              {renderValue ? renderValue(value) : value}
            </span>
          )
        : null
    }
    MenuProps={{
      className: classNames({
        "MuiPopover-triangle-left": triangleLeft,
        "MuiListItem-ticker-right": tickerRight
      }),
      anchorOrigin: {
        horizontal: triangleLeft ? "left" : "right",
        vertical: "top"
      },
      transformOrigin: {
        horizontal: triangleLeft ? "left" : "right",
        vertical: -70
      },
      PaperProps: {
        style: {
          maxHeight: 200,
          width: 100
        }
      }
    }}
  >
    {props.children}
  </MUISelect>
);

const mapStateToProps = state => ({
  locale: state.locale
});

const mapDispatchToProps = dispatch => ({
  onSwitch: () => dispatch(switchLocale())
});

class SandBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      snackOpen: false,
      dialogOpen: false
    };
  }

  hideDialog = () => {
    this.setState({
      dialogOpen: false
    });
  };

  showDialog = () => {
    this.setState({
      dialogOpen: true
    });
  };

  showSnack = () => {
    this.setState({
      snackOpen: true
    });
  };

  hideSnack = () => {
    this.setState({
      snackOpen: false
    });
  };

  switchLanguage = () => {
    this.props.onSwitch();
    // if (window.localStorage.getItem('locale') === 'en') {
    //   window.localStorage.setItem('locale', 'fr');
    // } else {
    //   window.localStorage.setItem('locale', 'en');
    // }
    //
    // document.location.reload();
  };

  render() {
    return (
      <div className="SandBox">
        <BlurDialog
          title="Lipsum!"
          open={this.state.dialogOpen}
          onRequestClose={this.hideDialog}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
          quis tempus massa, sed consectetur est. Integer ultricies finibus
          lobortis. In quis tincidunt mauris, ut tempus magna. Mauris pretium
          libero neque, id ullamcorper ex pellentesque a. Nulla condimentum
          neque at quam hendrerit, imperdiet suscipit orci rhoncus. Proin a
          felis placerat, tristique est vitae, auctor elit. Maecenas semper
          volutpat commodo. Maecenas quis mattis neque, eget bibendum enim.
          Fusce ut cursus diam. Proin eget nisl in massa euismod rhoncus. Fusce
          interdum orci id lacinia luctus. Sed magna lectus, sodales quis ex
          eget, tempor molestie velit. Donec urna tortor, volutpat id odio quis,
          gravida ultricies urna. Praesent et fringilla magna, et rhoncus eros.
          Maecenas mollis lacinia laoreet. Mauris tortor ex, suscipit a mi ac,
          fringilla blandit lorem.
        </BlurDialog>
        <Alert
          open={this.state.snackOpen}
          onRequestClose={this.hideSnack}
          theme="success"
          title="this is a title"
        >
          blah
        </Alert>
        <Row>
          <Col width={8}>
            <Row>
              <Col width={6}>
                <Paper className="block short-block">Blah</Paper>
              </Col>
              <Col width={6}>
                <Paper className="block short-block">
                  <Overscroll top={40} bottom={40} backgroundColor="white">
                    [[ BEGIN ]]<br />
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Vestibulum quis tempus massa, sed consectetur est. Integer
                    ultricies finibus lobortis. In quis tincidunt mauris, ut
                    tempus magna. Mauris pretium libero neque, id ullamcorper ex
                    pellentesque a. Nulla condimentum neque at quam hendrerit,
                    imperdiet suscipit orci rhoncus. Proin a felis placerat,
                    tristique est vitae, auctor elit. Maecenas semper volutpat
                    commodo. Maecenas quis mattis neque, eget bibendum enim.
                    Fusce ut cursus diam. Proin eget nisl in massa euismod
                    rhoncus. Fusce interdum orci id lacinia luctus. Sed magna
                    lectus, sodales quis ex eget, tempor molestie velit. Donec
                    urna tortor, volutpat id odio quis, gravida ultricies urna.
                    Praesent et fringilla magna, et rhoncus eros. Maecenas
                    mollis lacinia laoreet. Mauris tortor ex, suscipit a mi ac,
                    fringilla blandit lorem. Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit. Vestibulum quis tempus massa,
                    sed consectetur est. Integer ultricies finibus lobortis. In
                    quis tincidunt mauris, ut tempus magna. Mauris pretium
                    libero neque, id ullamcorper ex pellentesque a. Nulla
                    condimentum neque at quam hendrerit, imperdiet suscipit orci
                    rhoncus. Proin a felis placerat, tristique est vitae, auctor
                    elit. Maecenas semper volutpat commodo. Maecenas quis mattis
                    neque, eget bibendum enim. Fusce ut cursus diam. Proin eget
                    nisl in massa euismod rhoncus. Fusce interdum orci id
                    lacinia luctus. Sed magna lectus, sodales quis ex eget,
                    tempor molestie velit. Donec urna tortor, volutpat id odio
                    quis, gravida ultricies urna. Praesent et fringilla magna,
                    et rhoncus eros. Maecenas mollis lacinia laoreet. Mauris
                    tortor ex, suscipit a mi ac, fringilla blandit lorem. Lorem
                    ipsum dolor sit amet, consectetur adipiscing elit.
                    Vestibulum quis tempus massa, sed consectetur est. Integer
                    ultricies finibus lobortis. In quis tincidunt mauris, ut
                    tempus magna. Mauris pretium libero neque, id ullamcorper ex
                    pellentesque a. Nulla condimentum neque at quam hendrerit,
                    imperdiet suscipit orci rhoncus. Proin a felis placerat,
                    tristique est vitae, auctor elit. Maecenas semper volutpat
                    commodo. Maecenas quis mattis neque, eget bibendum enim.
                    Fusce ut cursus diam. Proin eget nisl in massa euismod
                    rhoncus. Fusce interdum orci id lacinia luctus. Sed magna
                    lectus, sodales quis ex eget, tempor molestie velit. Donec
                    urna tortor, volutpat id odio quis, gravida ultricies urna.
                    Praesent et fringilla magna, et rhoncus eros. Maecenas
                    mollis lacinia laoreet. Mauris tortor ex, suscipit a mi ac,
                    fringilla blandit lorem.
                    <br />[[ END ]]
                  </Overscroll>
                </Paper>
              </Col>
            </Row>
            <Row>
              <Col width={12}>
                <Paper className="block short-block">
                  <List>
                    <ListItem style={{ color: "red" }} button>
                      <span style={{ color: "black" }}>FOO</span>
                    </ListItem>
                    <ListItem button>BAR</ListItem>
                  </List>
                  <List className="MuiListItem-ticker-right">
                    <ListItem button>FOO</ListItem>
                    <ListItem button>BAR</ListItem>
                  </List>
                </Paper>
              </Col>
            </Row>
          </Col>
          <Col width={4}>
            <Row>
              <Col width={12}>
                <Paper className="block tall-block">
                  <div style={{ padding: 20 }}>
                    <Select value={1} fullWidth displayEmpty tickerRight>
                      {Array(50)
                        .fill(null)
                        .map((_, i) => 1 + i)
                        .map(i => (
                          <MenuItem key={i} value={i}>
                            {i}
                          </MenuItem>
                        ))}
                    </Select>

                    <Select
                      value={1}
                      fullWidth
                      displayEmpty
                      triangleLeft
                      blue
                      disableUnderline
                    >
                      {Array(50)
                        .fill(null)
                        .map((_, i) => 1 + i)
                        .map(i => (
                          <MenuItem key={i} value={i}>
                            {i}
                          </MenuItem>
                        ))}
                    </Select>
                  </div>
                </Paper>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

SandBox.propTypes = {
  onSwitch: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(SandBox);
