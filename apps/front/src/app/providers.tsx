'use client';

import { PrimeReactProvider } from 'primereact/api';

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PrimeReactProvider>{children}</PrimeReactProvider>;
}
