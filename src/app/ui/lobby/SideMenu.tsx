import React, { useState, useMemo } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Divider,
  ListItemIcon,
  Icon,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Toolbar,
} from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useHeaderElement, HeaderSpot } from "../header/HeaderElementsProvider";
import { useProfile } from "../ProfileProvider";
import { ExternalLink } from "../components/ExternalLink";
import { packageVersion, gitVersion } from "../../../version";

export const SideMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const headerButton = useMemo(
    () => (
      <IconButton
        onClick={() => setOpen((prevOpen) => !prevOpen)}
        edge="start"
        color="inherit"
      >
        <Icon>menu</Icon>
      </IconButton>
    ),
    []
  );
  useHeaderElement("menu-button", 100, headerButton, HeaderSpot.LEFT);

  const { name } = useProfile();

  const handleClose = (): void => setOpen(false);
  return (
    <StyledDrawer
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      anchor="left"
    >
      <StyledToolbar>
        <ListItem>
          <ListItemAvatar>
            <Avatar>{name[0]}</Avatar>
          </ListItemAvatar>
          <ListItemText>{name}</ListItemText>
        </ListItem>
        <Spacer />
        <IconButton>
          <Icon>navigate_before</Icon>
        </IconButton>
      </StyledToolbar>
      <Divider />

      <List>
        <ListItemButton component={Link} to="/">
          <ListItemIcon>
            <Icon>add</Icon>
          </ListItemIcon>
          <ListItemText>Neues Spiel erstellen</ListItemText>
        </ListItemButton>
        <ListItemButton component={Link} to="/matches">
          <ListItemIcon>
            <Icon>view_list</Icon>
          </ListItemIcon>
          <ListItemText>Aktuelle Spiele anzeigen</ListItemText>
        </ListItemButton>
      </List>
      <Spacer />
      <List>
        <ListItemButton component={Link} to="/profile">
          <ListItemIcon>
            <Icon>edit</Icon>
          </ListItemIcon>
          <ListItemText>Profil bearbeiten</ListItemText>
        </ListItemButton>
        <ListItemButton
          component={ExternalLink}
          href={process.env.FEEDBACK_FORM}
          title="Feedback geben oder Fehler melden"
        >
          <ListItemIcon>
            <Icon>feedback</Icon>
          </ListItemIcon>
          <ListItemText>Feedback</ListItemText>
        </ListItemButton>
        <ListItem>
          <ListItemText>
            <small>
              Version:
              <br />
              {packageVersion}
              <br />
              {gitVersion}
            </small>
          </ListItemText>
        </ListItem>
      </List>
    </StyledDrawer>
  );
};

const Spacer = styled.div`
  flex-grow: 1;
`;

const StyledToolbar = styled(Toolbar)`
  padding-left: 0;
  padding-right: 0;
`;

const StyledDrawer = styled(Drawer)`
  & .MuiDrawer-paper {
    width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
