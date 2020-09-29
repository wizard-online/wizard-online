import { createMuiTheme, Theme } from "@material-ui/core";
import { colors } from "./colors";

export function getWizardTheme(primary: string = colors.wizard.green): Theme {
  return createMuiTheme({
    palette: {
      primary: {
        main: primary,
      },
    },
  });
}
