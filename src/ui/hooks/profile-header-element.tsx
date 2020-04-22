import React, { useMemo } from "react";
import { Icon } from "@material-ui/core";
import { useProfile } from "../ProfileProvider";
import { useHeaderElement } from "../header/HeaderElementsProvider";

export function useProfileHeaderElement(): void {
  const { name } = useProfile();
  useHeaderElement(
    "profile",
    1,
    useMemo(
      () => (
        <>
          <Icon>account_circle</Icon>
          {name}
        </>
      ),
      [name]
    )
  );
}
