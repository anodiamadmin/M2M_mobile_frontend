import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Landing from "../app/landing";
import { EntryIntentContext } from "../context/EntryIntentContext";

/* ----------------------------------
   Expo Router Mock (CORRECT)
----------------------------------- */
jest.mock("expo-router", () => {
  const push = jest.fn();
  const replace = jest.fn();

  return {
    useRouter: () => ({
      push,
      replace,
    }),
    __mock: {
      push,
      replace,
    },
  };
});

/* ----------------------------------
   Mock custom components
----------------------------------- */
jest.mock("../components/Button", () => {
  return ({ title, onPress }) => {
    const React = require("react");
    const { Text, TouchableOpacity } = require("react-native");
    return (
      <TouchableOpacity onPress={onPress}>
        <Text>{title}</Text>
      </TouchableOpacity>
    );
  };
});

jest.mock("../components/Label", () => {
  return ({ children }) => {
    const React = require("react");
    const { Text } = require("react-native");
    return <Text>{children}</Text>;
  };
});

/* ----------------------------------
   Helper
----------------------------------- */
const renderWithContext = (setEntryIntent = jest.fn()) => {
  return render(
    <EntryIntentContext.Provider
      value={{ entryIntent: null, setEntryIntent }}
    >
      <Landing />
    </EntryIntentContext.Provider>
  );
};

describe("Landing Screen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders Landing screen", () => {
    const { getByText } = renderWithContext();
    expect(
      getByText("Shining the light on\nmicro-mobility")
    ).toBeTruthy();
  });

  it("shows Rent, List and Explore buttons", () => {
    const { getByText } = renderWithContext();

    expect(getByText("Rent a Bike")).toBeTruthy();
    expect(getByText("List a Bike")).toBeTruthy();
    expect(getByText("Explore")).toBeTruthy();
  });

  it("sets RENT intent and navigates to signin", () => {
    const setEntryIntent = jest.fn();
    const { getByText } = renderWithContext(setEntryIntent);

    fireEvent.press(getByText("Rent a Bike"));

    const { __mock } = require("expo-router");

    expect(setEntryIntent).toHaveBeenCalledWith("RENT");
    expect(__mock.push).toHaveBeenCalledWith("/(auth)/signin");
  });

  it("sets LIST intent and navigates to signin", () => {
    const setEntryIntent = jest.fn();
    const { getByText } = renderWithContext(setEntryIntent);

    fireEvent.press(getByText("List a Bike"));

    const { __mock } = require("expo-router");

    expect(setEntryIntent).toHaveBeenCalledWith("LIST");
    expect(__mock.push).toHaveBeenCalledWith("/(auth)/signin");
  });

  it("navigates to Explore tab", () => {
    const { getByText } = renderWithContext();

    fireEvent.press(getByText("Explore"));

    const { __mock } = require("expo-router");

    expect(__mock.replace).toHaveBeenCalledWith("/(tabs)/explore");
  });
});
