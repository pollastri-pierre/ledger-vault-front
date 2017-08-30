import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { activateTab, addTab, exitTabs, addTabBar } from './tabBarActions';
import TabButton from './TabButton';
import asTab from './Tab';
import './TabBar.css';

class TabBar extends Component {
  constructor(props) {
    super(props);
    //props.cleanTabBar();
    props.addTabBar(props.id);
    props.tabs.forEach((item, index) => props.addTab(index, props.id));
    props.activateTab(0, props.id);
    this.state = {};
  }
  componentWillMount() {
    console.log('tabbar MOUNT', this)
  }

  componentWillUpdate() {
    console.log('tabbar update', this)
  }

  componentWillReceiveProps(props) {
    console.log('tabbar props', this, props)
  }

  componentWillUnmount() {
    console.log('tabbar unmount')
    this.props.exitTabs();
  }

  handleClick = (e) => {
    e.preventDefault();
    if (!(this.props.sequential && parseInt(e.currentTarget.dataset.tab, 10) > this.props.activeTab)) {
      this.props.activateTab(parseInt(e.currentTarget.dataset.tab, 10), this.props.id);
    }
  }

  render() {
    const tabs = [];
    const childrenWithProps = this.props.tabs.map((child, index) => {
      let classes = '';
      if (this.props.activeTab === index) { classes += ' active'; }
      if (this.props.sequential && this.props.activeTab < index) { classes += ' locked'; }
      const func = this.handleClick;
      tabs.push(<TabButton key={child.title} data-tab={index} className={classes} onClick={func}>{child.title}</TabButton>);
      const Tab = asTab(child.content, index, this.props.id, child.props);
      return <Tab />;
    });
    if (this.props.activeTab < 0) {
      return null;
    }
    return (
      <div className="tabBar">
        <div className="tabs">
          {tabs}
        </div>
        <br/>
        <div className="line" />
        <div className="contentTab">
          {childrenWithProps}
        </div>
      </div>
    );
  }
}

TabBar.defaultProps = {
  sequential: false,
  activeTab: 0,
};

TabBar.propTypes = {
  sequential: PropTypes.bool,
  activateTab: PropTypes.func.isRequired,
  addTab: PropTypes.func.isRequired,
  exitTabs: PropTypes.func.isRequired,
  activeTab: PropTypes.number,
  id: PropTypes.string.isRequired,
  addTabBar: PropTypes.func.isRequired,
  tabs: PropTypes.array.isRequired,
};

function mapStateToProps(state, ownProps) {
  if (state.manageTab.tabBar[ownProps.id]) {
    return {
      activeTab: state.manageTab.tabBar[ownProps.id].activeTab,
    };
  }
  return {
    activeTab: 0,
  };
}

export default connect(mapStateToProps, { activateTab, addTab, exitTabs, addTabBar })(TabBar);
