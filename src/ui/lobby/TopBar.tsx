import React from "react";
import { AppBar, Toolbar } from "@material-ui/core";
import styled from "styled-components";
import { colors } from "../util/colors";
import { useHeaderContext } from "../header/HeaderElementsProvider";

export const TopBar: React.FC = () => {
  const { elements } = useHeaderContext();
  console.log("render topbar");
  return (
    <>
      <AppBar>
        <Toolbar>
          <PageTitle>Wizard Online</PageTitle>
          <SpaceFill />
          {Object.entries(elements)
            .sort(([, a], [, b]) => b.position - a.position)
            .map(([id, { element }]) => (
              <HeaderElement key={id}>{element}</HeaderElement>
            ))}
        </Toolbar>
      </AppBar>
      <AppBarSpacer />
    </>
  );
};

const PageTitle = styled.h1`
  margin: 0;
  font-style: italic;
  color: ${colors.white};
  /* text-outline effect only supported with prefix */
  -webkit-text-fill-color: ${colors.wizard.darker};
  -webkit-text-stroke: 1.5px ${colors.wizard.green};
  text-shadow: 0 0 12px ${colors.white};
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
