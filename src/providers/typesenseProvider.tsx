"use client";

import { Client } from "typesense";
import React, { createContext, useContext, useState } from "react";

interface ITypesenseContext {
  client: Client | null;
  setClient: React.Dispatch<React.SetStateAction<Client | null>>;
}


const TypesenseContext = createContext<ITypesenseContext | null>(null);

export const useTypesense = () => useContext(TypesenseContext);


export const TypesenseProvider = ({ children }: {
    children: React.ReactNode;
  }) => {
  const [client, setClient] = useState<Client | null>(null);

  return (
    <TypesenseContext.Provider value={{ client, setClient }}>
      {children}
    </TypesenseContext.Provider>
  );
};