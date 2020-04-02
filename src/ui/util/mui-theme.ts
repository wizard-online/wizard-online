import { createMuiTheme } from "@material-ui/core";
import { colors } from "./colors";

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.wizard.green,
    },
  },
});
