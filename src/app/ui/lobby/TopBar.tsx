import React from "react";
import { AppBar, Theme, Toolbar, useTheme } from "@material-ui/core";
import styled from "styled-components";
import { colors } from "../util/colors";
import { useHeaderContext, HeaderSpot } from "../header/HeaderElementsProvider";

export const TopBar: React.FC = () => {
  const { elements } = useHeaderContext();
  const theme = useTheme();
  const elementsEntries = Object.entries(elements).sort(
    ([, a], [, b]) => b.position - a.position
  );
  const leftElements = elementsEntries.filter(
    ([, element]) => element.spot === HeaderSpot.LEFT
  );
  const rightElements = elementsEntries.filter(
    ([, element]) => element.spot !== HeaderSpot.LEFT
  );
  return (
    <>
      <AppBar>
        <Toolbar>
          {leftElements.map(([id, { element }]) => (
            <HeaderElement key={id}>{element}</HeaderElement>
          ))}
          <PageTitle $theme={theme}>Wizard Online</PageTitle>
          <SpaceFill />
          {rightElements.map(([id, { element }]) => (
            <HeaderElement key={id}>{element}</HeaderElement>
          ))}
        </Toolbar>
      </AppBar>
      <AppBarSpacer />
    </>
  );
};

const PageTitle = styled.h1<{ $theme: Theme }>`
  margin: 0 12px;
  font-style: italic;
  color: ${colors.white};
  /* text-outline effect only supported with prefix */
  -webkit-text-fill-color: ${colors.wizard.darker};
  -webkit-text-stroke: 0.5px ${({ $theme }) => $theme.palette.primary.light};
  text-shadow: 0 0 12px ${colors.white},
    0 0 5px ${({ $theme }) => $theme.palette.primary.light};
`;

const SpaceFill = styled.div`
  flex-grow: 1;
`;

const AppBarSpacer = styled.div`
  height: 64px;
  margin-bottom: 5px;
`;

const HeaderElement = styled.div`
  margin: 0 7px;
`;
