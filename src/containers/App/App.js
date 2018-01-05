//@flow
//import "open-sans-fontface/open-sans.css";
import React from "react";
import injectTapEventPlugin from "react-tap-event-plugin";
import Content from "components/content/Content";
import ActionBar from "components/actionBar/ActionBar";
import Menu from "components/menu/Menu";
import { GlobalLoadingRendering } from "components/GlobalLoading";

injectTapEventPlugin(); // Required by Material-UI

function App({ location }: *) {
  return (
    <div className="App">
      <GlobalLoadingRendering />
      <ActionBar />
      <div className="Main">
        <Menu location={location} />
        <Content />
      </div>
    </div>
  );
}

export default App;
