import React, { ReactNode } from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

interface ConvexClientProviderProps {
  children: ReactNode;
}

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
