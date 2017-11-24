//@flow
import React, { Component } from "react";
import renderer from "react-test-renderer";
import connectData from "../connectData";
import { createRender, networkFromMock, flushPromises } from "../tests-utils";
import {
  mockNetworkSync,
  AnimalsQuery,
  AnimalQuery
} from "../tests-utils/mock-1";

test("100 concurrent components only trigger one query and don't break", () => {
  expect(this).toBe("implemented");
});
