import React, { Component } from 'react';

import TabBar from './TabBar';
import asTab from './Tab';
import ExampleTab from './ExampleTab';

class Tabtest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titi: asTab(ExampleTab, 0),
      blah: asTab(ExampleTab, 1),
      sdksdksdk: asTab(ExampleTab, 2),
    };
  }
  render() {
    console.log(this);
    return (
      <div className="tabs">
        <TabBar titles={['titi', 'blah', 'fdslkuga']} />
        <br/>
        <this.state.titi />
        <this.state.blah />
        <this.state.sdksdksdk />
      </div>
    );
  }
}

export default Tabtest;
