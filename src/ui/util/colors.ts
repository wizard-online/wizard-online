export interface ColorSet {
  background: string;
  text: string;
  outline: string;
  shadow?: string;
}

export interface ColorSetCollection {
  [item: string]: ColorSet;
}

export const colors = {
  white: "#ffffff",
  black: "#000000",
  grey: "#aba8af",
  lightgrey: "#eeeeee",
  lightTransparentGrey: "rgba(255, 255, 255, 0.3)",
  wood: {
    light: "#deb887",
    medium: "#cdaa7d",
    dark: "#8b6914",
  },
  wizard: {
    dark: "#090b08",
    darker: "#181100",
    green: "#34573f",
  },
  blue: {
    light: "#9094d4",
    medium: "#4f60b2",
    dark: "#313a75",
  },
  green: {
    light: "#75b370",
    medium: "#2a6340",
    dark: "#223320",
  },
  red: {
    light: "#db7a33",
    medium: "#be5327",
    dark: "#93331b",
  },
  yellow: {
    light: "#ffe862",
    medium: "#b97011",
    dark: "#795a2b",
  },
};

export const cardColors: ColorSetCollection = {
  back: {
    background: colors.wizard.dark,
    text: colors.wizard.darker,
    outline: colors.wizard.green,
    shadow: colors.white,
  },
  blue: {
    background: colors.blue.medium,
    text: colors.blue.light,
    outline: colors.blue.dark,
  },
  green: {
    background: colors.green.dark,
    text: colors.green.light,
    outline: colors.green.medium,
  },
  red: {
    background: colors.red.medium,
    text: colors.red.light,
    outline: colors.red.dark,
  },
  yellow: {
    background: colors.yellow.medium,
    text: colors.yellow.light,
    outline: colors.yellow.dark,
  },
  zn: {
    background: colors.grey,
    text: colors.white,
    outline: colors.black,
  },
};
