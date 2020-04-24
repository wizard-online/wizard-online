import React, { useMemo } from "react";
import { IconButton, Icon, Tooltip, Link } from "@material-ui/core";
import styled from "styled-components";
import { useHeaderElement } from "../header/HeaderElementsProvider";
import { colors } from "../util/colors";

const HeaderIconButton = styled(IconButton)`
  color: ${colors.white};
`;

export function useFeedbackHeaderElement(): void {
  useHeaderElement(
    "feedback",
    -10,
    useMemo(
      () =>
        process.env.FEEDBACK_FORM ? (
          <Tooltip arrow title="Feedback geben oder Fehler melden">
            <Link
              component={HeaderIconButton}
              href={process.env.FEEDBACK_FORM}
              target="_blank"
              rel="noreferrer"
            >
              <Icon>feedback</Icon>
            </Link>
          </Tooltip>
        ) : (
          <span />
        ),
      []
    )
  );
}
