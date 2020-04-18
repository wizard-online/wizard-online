import React, { useState, useRef, useCallback, useContext } from "react";
import { Snackbar, SnackbarCloseReason, Icon } from "@material-ui/core";
import styled from "styled-components";
import { colors } from "./util/colors";

export interface Notification {
  message: string | JSX.Element;
  icon?: string;
}
interface NotificationWithKey extends Notification {
  key: number;
}

export type Notify = (notification: Notification) => void;

export interface NotificationsProviderContext {
  notify: Notify;
}

export const NotificationsContext = React.createContext<
  NotificationsProviderContext | undefined
>(undefined);

export const NotificationsProvider: React.FC = ({ children }) => {
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState<Notification | undefined>(
    undefined
  );
  const queue = useRef<NotificationWithKey[]>([]);

  const processQueue = useCallback((): void => {
    if (queue.current.length > 0) {
      setNotification(queue.current.shift());
      setShow(true);
    }
  }, []);

  const notify = useCallback(
    (newNotification: Notification): void => {
      queue.current.push({ ...newNotification, key: new Date().getTime() });
      if (show) {
        setShow(false);
      } else {
        processQueue();
      }
    },
    [processQueue, show]
  );

  return (
    <NotificationsContext.Provider value={{ notify }}>
      {children}
      <Snackbar
        open={show}
        autoHideDuration={5000}
        // eslint-disable-next-line no-empty-pattern
        onClose={({}, reason: SnackbarCloseReason) => {
          if (reason === "clickaway") {
            return;
          }
          setShow(false);
        }}
        onExited={processQueue}
      >
        <NotificationContainer>
          {notification?.icon && (
            <NotificationIcon>{notification?.icon}</NotificationIcon>
          )}
          <NotificationMessage>{notification?.message}</NotificationMessage>
        </NotificationContainer>
      </Snackbar>
    </NotificationsContext.Provider>
  );
};

const NotificationContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  min-width: 288px;
  max-width: 500px;
  padding: 6px 16px;
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.43;
  border-radius: 4px;
  letter-spacing: 0.01071em;
  background-color: ${colors.wizard.dark};
  color: ${colors.white};
`;

const NotificationIcon = styled(Icon)`
  margin-right: 10px;
`;

const NotificationMessage = styled.div`
  padding: 8px 0;
`;

export function useNotify(): Notify {
  const notificationsContext = useContext(NotificationsContext);
  if (!notificationsContext)
    throw new Error(
      "useNotify hook is called outside the scope of NotificationProvider"
    );
  return notificationsContext.notify;
}
