import React, { useMemo } from "react";
import styled from "styled-components";
import { Icon, Button } from "@material-ui/core";
import { useProfile } from "../ProfileProvider";
import { useHeaderElement } from "../header/HeaderElementsProvider";
import { colors } from "../util/colors";

export function useProfileHeaderElement(): void {
  const { name } = useProfile();
  useHeaderElement(
    "profile",
    1,
    useMemo(
      () => (
        <>
          <HeaderButton startIcon={<Icon>account_circle</Icon>}>
            {name}
          </HeaderButton>
        </>
      ),
      [name]
    )
  );
}

const HeaderButton = styled(Button)`
  color: ${colors.white};
`;
