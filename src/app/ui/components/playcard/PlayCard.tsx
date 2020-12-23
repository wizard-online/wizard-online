import React from "react";
import { Card } from "../../../../shared/entities/cards";
import { PlayCardFrontsideProps, PlayCardFrontside } from "./PlayCardFrontside";
import { PlayCardPlaceholder } from "./PlayCardPlaceholder";
import { PlayCardBackside } from "./PlayCardBackside";

export interface PlayCardProps extends Omit<PlayCardFrontsideProps, "card"> {
  card: Card | null | undefined;
}

export const PlayCard: React.FC<PlayCardProps> = ({
  card,
  interactive = true,
  disabled = false,
  onClick = () => {},
  preselected = false,
}) => {
  if (card === undefined) {
    return <PlayCardPlaceholder />;
  }
  if (card === null) {
    return <PlayCardBackside />;
  }
  return (
    <PlayCardFrontside
      card={card}
      interactive={interactive}
      disabled={disabled}
      onClick={onClick}
      preselected={preselected}
    />
  );
};
