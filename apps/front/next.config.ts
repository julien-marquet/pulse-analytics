import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  logging: {
    browserToTerminal: true,
  },
  turbopack: {
    root: path.resolve(__dirname, '../..'), // points to monorepo root
  },
  output: 'standalone',
};

export default nextConfig;
