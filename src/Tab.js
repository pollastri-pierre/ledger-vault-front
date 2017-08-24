import React, { Component } from 'react';
import { connect } from 'react-redux';
import { save, nextTab, previousTab, exitTabs, validate } from './tabBarActions';

function asTab(WrappedComponent, index, otherProps = {}) {
  class Tab extends Component {
    render() {
      const callbacks = {
        nextTab: () => this.props.nextTab(this.props.id),
        previousTab: () => this.props.previousTab(this.props.id),
        save: x => this.props.save(x, index, this.props.id),
        exitTabs: () => this.props.exitTabs(this.props.id),
      };

      let JSX;
      if (this.props.activeTab === index) {
        JSX = (
          <div>
            <WrappedComponent index={index} {...callbacks} state={this.props.tabState} otherProps={otherProps} />
          </div>);
      } else {
        JSX = null;
      }
      return JSX;
    }
  }

  Tab.propTypes = {
    tabState: React.PropTypes.object.isRequired,
    activeTab: React.PropTypes.number.isRequired,
    save: React.PropTypes.func.isRequired,
    previousTab: React.PropTypes.func.isRequired,
    nextTab: React.PropTypes.func.isRequired,
    exitTabs: React.PropTypes.func.isRequired,
    id: React.PropTypes.string.isRequired,
  };

  function mapStateToProps(state, ownProps) {
    return {
      tabState: state.manageTab.tabBar[ownProps.id].tab[index].state,
      activeTab: state.manageTab.tabBar[ownProps.id].activeTab,
    };
  }

  return connect(mapStateToProps, { save, nextTab, previousTab, exitTabs, validate })(Tab);
}

export default asTab;
