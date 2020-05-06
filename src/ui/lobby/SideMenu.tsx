import React, { useState, useMemo } from "react";
import {
  Drawer,
  List,
  ListItem,
  Divider,
  ListItemIcon,
  Icon,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useHeaderElement } from "../header/HeaderElementsProvider";
import { useProfile } from "../ProfileProvider";
import { ExternalLink } from "../components/ExternalLink";
import { packageVersion, gitVersion } from "../../version";

export const SideMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const headerButton = useMemo(
    () => (
      <button type="button" onClick={() => setOpen((prevOpen) => !prevOpen)}>
        Menüü
      </button>
    ),
    []
  );
  useHeaderElement("menu-button", 100, headerButton);

  const { name } = useProfile();

  const handleClose = (): void => setOpen(false);
  return (
    <Drawer open={open} onClose={handleClose} onClick={handleClose}>
      <List>
        <ListItem color="primary">
          <ListItemAvatar>
            <Avatar>{name[0]}</Avatar>
          </ListItemAvatar>
          <ListItemText>{name}</ListItemText>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <Icon>add</Icon>
          </ListItemIcon>
          <ListItemText>Neues Spiel erstellen</ListItemText>
        </ListItem>
        <ListItem button component={Link} to="/games">
          <ListItemIcon>
            <Icon>view_list</Icon>
          </ListItemIcon>
          <ListItemText>Alle Spiele anzeigen</ListItemText>
        </ListItem>
      </List>
      <Spacer />
      <List>
        <ListItem
          button
          component={ExternalLink}
          href={process.env.FEEDBACK_FORM}
        >
          <ListItemIcon>
            <Icon>feedback</Icon>
          </ListItemIcon>
          <ListItemText>Feedback</ListItemText>
        </ListItem>
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
    </Drawer>
  );
};

const Spacer = styled.div`
  flex-grow: 1;
`;
