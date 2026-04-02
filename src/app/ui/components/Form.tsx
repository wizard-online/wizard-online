import React from "react";

export const Form: React.FC<React.FormHTMLAttributes<HTMLFormElement>> = ({
  onSubmit,
  className,
  children,
}) => (
  <form
    onSubmit={
      onSubmit
        ? (event) => {
            event.preventDefault();
            onSubmit(event);
          }
        : undefined
    }
    className={className}
  >
    {children}
  </form>
);
