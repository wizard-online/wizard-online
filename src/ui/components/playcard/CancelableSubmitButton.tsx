import { Button } from "@material-ui/core";
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
      timeoutHandleRef.current = setTimeout(() => onSubmit(), timeout);
    }
    return () => {
      clearTimeout(timeoutHandleRef.current);
    };
  }, [activated, onSubmit, timeout]);

  return isActive ? (
    <Container>
      <Button
        title="Abbrechen"
        onClick={() => {
          clearTimeout(timeoutHandleRef.current);
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
