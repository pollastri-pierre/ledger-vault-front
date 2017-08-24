import React, { Component } from 'react';
import TextField from './TextField';
import DialogButton from './DialogButton';
import translate from './translate';

class ExampleTab extends Component {
  constructor(props) {
    super(props);
    if (this.props.state) {
      this.state = this.props.state;
    } else {
      this.state = {
        value: '',
      };
    }
  }

  componentWillMount() {
    console.log('will Mount', this.props.index);
    this.setState(this.props.state);
  }

  componentWillUnmount() {
    console.log('will unmount', this.props.index);
    this.props.save(this.state);
  }

  handleChange = (e, newVal) => {
    this.setState({ value: newVal });
  }

  selectTeam = () => {
    this.props.save(this.state);
  }


  render() {
    console.log(this)
    this.t = this.props.translate;
    return (
      <div>
        <div>  EXAMPLE TAB  </div>
        <div> {this.state.value}</div>
        <div> {this.props.state.value}</div>
        <TextField
          style={{ width: '320px' }}
          inputStyle={{ textAlign: 'center' }}
          id="textField"
          errorText=""
          onChange={this.handleChange}
          defaultValue={this.props.state.value}
        />
        <DialogButton highlight right onTouchTap={this.selectTeam}>{this.t('common.continue')}</DialogButton>
        <DialogButton highlight right onTouchTap={this.props.nextTab}>next</DialogButton>
        <DialogButton highlight right onTouchTap={this.props.previousTab}>previous</DialogButton>
        <DialogButton highlight right onTouchTap={this.props.exitTabs}>exit</DialogButton>
      </div>
    );
  }
}


ExampleTab.defaultProps = {
  state: {},
};

ExampleTab.propTypes = {
  translate: React.PropTypes.func.isRequired,
  state: React.PropTypes.object,
  save: React.PropTypes.func.isRequired,
  nextTab: React.PropTypes.func.isRequired,
  previousTab: React.PropTypes.func.isRequired,
  exitTabs: React.PropTypes.func.isRequired,
  index: React.PropTypes.number.isRequired,

};

export default translate(ExampleTab);
