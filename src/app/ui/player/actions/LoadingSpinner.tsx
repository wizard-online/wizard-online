import React from "react";
import { CircularProgress } from "@mui/material";

export interface LoadingSpinnerProps {
  duration: number;
  show: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  duration,
  show,
}) => {
  const numSteps = 10;
  const stepSize = 100 / numSteps;
  const msPerStep = duration / numSteps;

  const [progress, setProgress] = React.useState(0);
  const timeoutHandleRef = React.useRef<number | undefined>(undefined);
  const [incrementCounter, setIncrementCounter] = React.useState(0);

  function triggerIncrement(): void {
    setIncrementCounter((prev) => prev + 1);
  }

  React.useEffect(() => {
    if (show) {
      triggerIncrement();
    }

    return () => {
      if (timeoutHandleRef.current) {
        // eslint-disable-next-line unicorn/prefer-global-this
        window.clearTimeout(timeoutHandleRef.current);
        timeoutHandleRef.current = undefined;
      }
      setProgress(0);
    };
  }, [show, duration]);

  React.useEffect(() => {
    if (show && progress < 100) {
      setProgress(progress + stepSize);

      // eslint-disable-next-line unicorn/prefer-global-this -- window.setTimeout returns number; globalThis resolves to Node's Timeout
      timeoutHandleRef.current = window.setTimeout(
        () => triggerIncrement(),
        msPerStep
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incrementCounter]);

  return show ? (
    <CircularProgress
      color="secondary"
      variant="determinate"
      value={progress}
      size={15}
      thickness={8}
    />
  ) : null;
};
