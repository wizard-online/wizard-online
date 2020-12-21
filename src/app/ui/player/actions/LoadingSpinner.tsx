import React from "react";
import { CircularProgress } from "@material-ui/core";

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

  React.useEffect(
    () => {
      if (show) {
        triggerIncrement();
      }

      return () => {
        if (timeoutHandleRef.current) {
          clearTimeout(timeoutHandleRef.current);
          timeoutHandleRef.current = undefined;
        }
        setProgress(0);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [show, duration]
  );

  React.useEffect(() => {
    if (show && progress < 100) {
      setProgress(progress + stepSize);

      timeoutHandleRef.current = setTimeout(
        () => triggerIncrement(),
        msPerStep
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incrementCounter]);

  return show ? (
    <CircularProgress
      color="secondary"
      variant="static"
      value={progress}
      size={15}
      thickness={8}
    />
  ) : null;
};
