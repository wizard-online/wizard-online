import { createTheme, Theme } from "@mui/material/styles";
import { colors, ColorTripleTone } from "./colors";

export function getWizardTheme(
  { medium: main, light, dark }: ColorTripleTone = colors.green
): Theme {
  return createTheme({
    palette: {
      primary: {
        main,
        light,
        dark,
      },
    },
  });
}
