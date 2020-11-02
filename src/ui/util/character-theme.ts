import { colors, ColorTripleTone } from "./colors";

export enum WizardCharacter {
  Human = "human",
  Dwarf = "dwarf",
  Elf = "elf",
  Giant = "giant",
}

interface Character {
  label: string;
  color: ColorTripleTone;
}

export const characters: Record<WizardCharacter, Character> = {
  [WizardCharacter.Human]: { label: "Mensch", color: colors.blue },
  [WizardCharacter.Dwarf]: { label: "Zwerg", color: colors.red },
  [WizardCharacter.Elf]: { label: "Elfe", color: colors.green },
  [WizardCharacter.Giant]: { label: "Riese", color: colors.yellow },
};
