//@flow
import React from "react";
import MemberAvatar from ".";
import renderer from "react-test-renderer";

test("MemberAvatar renders an url", () => {
  const component = renderer.create(
    <MemberAvatar url="https://avatars1.githubusercontent.com/u/211411?s=460&v=4" />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
