//@flow
import React from "react";
import Content from "components/content/Content";
import ActionBar from "components/actionBar/ActionBar";
import Menu from "components/menu/Menu";
import { GlobalLoadingRendering } from "components/GlobalLoading";

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
