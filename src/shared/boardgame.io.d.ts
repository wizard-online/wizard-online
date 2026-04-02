import { WizardCharacter } from "../app/ui/util/character-theme";

declare module "boardgame.io" {
  export interface PlayerMetadata {
    id: number;
    name?: string;
    data?: {
      userID: string;
      character: WizardCharacter;
    };
  }
}
