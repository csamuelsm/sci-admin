'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { SessionProvider } from "next-auth/react"

import { Chakra as ChakraProvider } from '~/lib/components/Chakra';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <CacheProvider>
      <SessionProvider>
        <ChakraProvider>{children}</ChakraProvider>
      </SessionProvider>
    </CacheProvider>
  );
};

export default Providers;
