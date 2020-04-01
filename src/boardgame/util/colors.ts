export interface ColorSet {
  background: string;
  text: string;
  outline: string;
  shadow?: string;
}

export interface ColorSetCollection {
  [item: string]: ColorSet;
}

export const cardColors: ColorSetCollection = {
  back: {
    background: "#090b08",
    text: "#181100",
    outline: "#34573f",
    shadow: "#ffffff",
  },
  blue: {
    background: "#4f60b2",
    text: "#9094d4",
    outline: "#313a75",
  },
  green: {
    background: "#223320",
    text: "#75b370",
    outline: "#2a6340",
  },
  red: {
    background: "#be5327",
    text: "#db7a33",
    outline: "#93331b",
  },
  yellow: {
    background: "#b97011",
    text: "#ffe862",
    outline: "#795a2b",
  },
  zn: {
    background: "#aba8af",
    text: "#ffffff",
    outline: "#000000",
  },
};
