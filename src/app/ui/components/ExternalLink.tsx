import React from "react";

export const ExternalLink = React.forwardRef<
  HTMLAnchorElement,
  React.HTMLProps<HTMLAnchorElement>
>(({ href, children, ...props }, ref: React.Ref<HTMLAnchorElement>) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      ref={ref}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {children}
    </a>
  );
});
