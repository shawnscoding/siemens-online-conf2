import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { shallow, mount } from "enzyme";

it("shallow render without crashing", () => {
  const wrapper = shallow(<App />);
  expect(wrapper).toMatchSnapshot();
});
