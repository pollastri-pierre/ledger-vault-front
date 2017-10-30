//
// Sandbox for tests and stuff
//

import React, { Component } from "react";
import PropTypes from "prop-types";
import RaisedButton from "material-ui/RaisedButton";
import { Link } from "react-router-dom";
import Paper from "material-ui/Paper";
import { connect } from "react-redux";
import { Row, Col } from "../../components/grid/Grid";
import { BlurDialog } from "../../containers";
import { Tooltip, Alert, Overscroll } from "../../components";
import { switchLocale } from "../../redux/modules/locale";

import "./SandBox.css";

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
                  <Overscroll
                    height={200}
                    overscrollSize={40}
                    backgroundColor="white"
                  >
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
                  <span
                    data-tip="je suis un touletippe"
                    style={{ position: "absolute" }}
                  >
                    Bluh
                  </span>
                  <br />
                  <RaisedButton
                    label="Dialog Lipsum?"
                    secondary
                    onClick={this.showDialog}
                  />
                  <RaisedButton
                    label="Snack Lipsum?"
                    primary
                    onClick={this.showSnack}
                  />
                  <RaisedButton
                    label="Switch language"
                    onClick={this.switchLanguage}
                  />
                </Paper>
              </Col>
            </Row>
          </Col>
          <Col width={4}>
            <Row>
              <Col width={12}>
                <Paper className="block tall-block">
                  <a data-tip="je suis un touletippe">
                    Blouh <i className="material-icons">face</i>
                  </a>
                  <Link to="?operationDetail=1">operation id1</Link>
                </Paper>
              </Col>
            </Row>
          </Col>
        </Row>
        <Tooltip />
      </div>
    );
  }
}

SandBox.propTypes = {
  onSwitch: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(SandBox);
