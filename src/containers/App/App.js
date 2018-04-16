//@flow
import React from "react";
import Content from "components/content/Content";
import ActionBar from "components/actionBar/ActionBar";
import Menu from "components/menu/Menu";
import { GlobalLoadingRendering } from "components/GlobalLoading";

function App({ location, match }: *) {
  return (
    <div className="App">
      <GlobalLoadingRendering />
      <ActionBar match={match} location={location} />
      <div className="Main">
        <Menu location={location} match={match} />
        <Content match={match} />
      </div>
    </div>
  );
}

export default App;
