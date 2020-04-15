import { OptionalTrickCard, TrickCard } from "./trick";

export function checkTrickCard(
  optionalTrickCard: OptionalTrickCard
): optionalTrickCard is TrickCard {
  return !!optionalTrickCard.card;
}

export function checkTrickCards(
  optionalTrickCards: OptionalTrickCard[]
): optionalTrickCards is TrickCard[] {
  return optionalTrickCards.every(checkTrickCard);
}
