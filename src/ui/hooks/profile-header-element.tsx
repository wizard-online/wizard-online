import { useProfile } from "../ProfileProvider";
import { useHeaderElement } from "../header/HeaderElementsProvider";

export function useProfileHeaderElement(): void {
  const { name } = useProfile();
  useHeaderElement("profile", 1, name);
}
