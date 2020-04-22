import React, { useState, useCallback, useContext, useEffect } from "react";

export interface HeaderElements {
  [id: string]: HeaderElement;
}

export interface HeaderElement {
  position: number;
  element: HeaderElementElement;
}

export type HeaderElementElement = JSX.Element | string;

interface HeaderContext {
  elements: HeaderElements;
  addElement(id: string, element: HeaderElement): void;
  removeElement(id: string): void;
}

export const HeaderContext = React.createContext<HeaderContext | undefined>(
  undefined
);

export const HeaderElementsProvider: React.FC = ({ children }) => {
  const [elements, setElements] = useState<HeaderElements>({});
  const addElement = useCallback((id: string, element: HeaderElement) => {
    setElements((others) => ({
      [id]: element,
      ...others,
    }));
  }, []);
  const removeElement = useCallback((id: string) => {
    setElements(({ [id]: element, ...others }) => others);
  }, []);
  return (
    <HeaderContext.Provider
      value={{
        elements,
        addElement,
        removeElement,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export function useHeaderContext(): HeaderContext {
  const headerContext = useContext(HeaderContext);
  if (!headerContext) {
    throw new Error(
      "useHeaderContext hook is called outside the scope of HeaderElementsProvider"
    );
  }
  return headerContext;
}

export function useHeaderElement(
  id: string,
  position: number,
  element: HeaderElementElement
): void {
  const { addElement, removeElement } = useHeaderContext();
  useEffect(() => {
    addElement(id, { position, element });
    return () => removeElement(id);
  }, [addElement, removeElement, id, position, element]);
}
