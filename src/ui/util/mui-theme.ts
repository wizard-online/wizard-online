import { createMuiTheme, Theme } from "@material-ui/core";
import { colors, ColorTripleTone } from "./colors";

export function getWizardTheme(
  { medium: main, light, dark }: ColorTripleTone = colors.green
): Theme {
  return createMuiTheme({
    palette: {
      primary: {
        main,
        light,
        dark,
      },
    },
  });
}
