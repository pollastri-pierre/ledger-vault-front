import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { activateTab, addTab, exitTabs, addTabBar } from './tabBarActions';
import TabButton from './TabButton';
import './TabBar.css';

class TabBar extends Component {
  constructor(props) {
    super(props);
    //props.cleanTabBar();
    props.addTabBar(props.id);
    props.titles.forEach((item, index) => props.addTab(index, props.id));
    props.activateTab(0, props.id);
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
    const childrenWithProps = React.Children.map(this.props.children,
     (child) => React.cloneElement(child, {
       id: this.props.id,
     })
    );
    const tabs = this.props.titles.map((item, index) => {
      let classes = '';
      if (this.props.activeTab === index) { classes += ' active'; }
      if (this.props.sequential && this.props.activeTab < index) { classes += ' locked'; }
      const func = this.handleClick;
      return <TabButton key={item} data-tab={index} className={classes} onClick={func}>{item}</TabButton>;
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
        {childrenWithProps}
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
  titles: PropTypes.array.isRequired,
  activeTab: PropTypes.number,
  id: PropTypes.string.isRequired,
  addTabBar: PropTypes.func.isRequired,
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
