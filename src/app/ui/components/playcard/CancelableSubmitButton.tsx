import { Button } from "@mui/material";
import React from "react";
import styled from "styled-components";
import { TimeoutIndicatorBar } from "../TimeoutIndicatorBar";

export interface CancelableSubmitButtonProps {
  timeout: number;
  onSubmit: () => void;
  onCancel?: () => void;
  isActive: boolean;
}

export const CancelableSubmitButton: React.FC<CancelableSubmitButtonProps> = ({
  timeout,
  onSubmit,
  onCancel,
  isActive,
}) => {
  const timeoutHandleRef = React.useRef<number>();
  const [activated, setActivated] = React.useState(false);

  React.useEffect(() => {
    setActivated(isActive);
  }, [isActive]);

  React.useEffect(() => {
    if (activated) {
      /* eslint-disable unicorn/prefer-global-this -- window.setTimeout returns number; globalThis resolves to Node's Timeout */
      timeoutHandleRef.current = window.setTimeout(() => onSubmit(), timeout);
    }
    return () => {
      window.clearTimeout(timeoutHandleRef.current);
      /* eslint-enable unicorn/prefer-global-this */
    };
  }, [activated, onSubmit, timeout]);

  return isActive ? (
    <Container>
      <Button
        title="Abbrechen"
        onClick={() => {
          // eslint-disable-next-line unicorn/prefer-global-this
          window.clearTimeout(timeoutHandleRef.current);
          setActivated(false);
          onCancel?.();
        }}
        variant="contained"
      >
        Abbrechen
      </Button>
      <TimeoutIndicatorBar isActive={activated} timeout={timeout} />
    </Container>
  ) : null;
};

const Container = styled.form`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;
