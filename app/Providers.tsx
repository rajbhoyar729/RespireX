"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps): React.ReactElement => {
  return( <SessionProvider> <div className="h-screen">{children}</div></SessionProvider>);
};

export default Providers;