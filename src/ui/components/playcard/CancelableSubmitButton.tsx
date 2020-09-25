import { Button, CircularProgress } from "@material-ui/core";
import React from "react";

export interface CancelableSubmitButtonProps {
  timeout: number;
  steps: number;
  onSubmit: () => void;
  onCancel?: () => void;
  isActive: boolean;
}

export const CancelableSubmitButton: React.FC<CancelableSubmitButtonProps> = ({
  timeout,
  steps,
  onSubmit,
  onCancel,
  isActive,
}) => {
  const [progress, setProgress] = React.useState(0);
  const startedTimestampRef = React.useRef(Date.now());
  const timeoutHandleRef = React.useRef<number>();
  const stepDuration = timeout / steps;

  const updateProgress = React.useCallback(() => {
    const timestamp = Date.now();
    const diff = timestamp - startedTimestampRef.current;
    const percent = ((diff + stepDuration) / timeout) * 100;
    setProgress(percent);
    if (percent < 100) {
      setTimeout(() => updateProgress(), stepDuration);
    }
  }, [stepDuration, timeout]);

  React.useEffect(() => {
    if (isActive) {
      startedTimestampRef.current = Date.now();
      timeoutHandleRef.current = setTimeout(() => onSubmit(), timeout);
      updateProgress();
    }
  }, [isActive, onSubmit, timeout, updateProgress]);

  return isActive ? (
    <div>
      <CircularProgress variant="static" value={progress} />
      <Button
        title="Abbrechen"
        onClick={() => {
          clearTimeout(timeoutHandleRef.current);
          onCancel?.();
        }}
        variant="contained"
      >
        Abbrechen
      </Button>
    </div>
  ) : null;
};
