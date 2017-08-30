import React, { Component } from 'react';
import { connect } from 'react-redux';
import { save, nextTab, previousTab, exitTabs, validate } from './tabBarActions';

function asTab(WrappedComponent, index, id, otherProps = {}) {
  class Tab extends Component {
    render() {
      const callbacks = {
        nextTab: () => this.props.nextTab(id),
        previousTab: () => this.props.previousTab(id),
        save: x => this.props.save(x, index, id),
        exitTabs: () => this.props.exitTabs(id),
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
  };

  function mapStateToProps(state, ownProps) {
    return {
      tabState: state.manageTab.tabBar[id].tab[index].state,
      activeTab: state.manageTab.tabBar[id].activeTab,
    };
  }

  return connect(mapStateToProps, { save, nextTab, previousTab, exitTabs, validate })(Tab);
}

export default asTab;
