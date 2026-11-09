import type { NextConfig } from 'next';

const githubPages = process.env.KODEO_STATIC_EXPORT === '1';
const basePath = process.env.KODEO_BASE_PATH ?? '';

const config: NextConfig = githubPages ? {
  output: 'export',
  trailingSlash: true,
  basePath,
  env: { NEXT_PUBLIC_KODEO_BASE_PATH: basePath, NEXT_PUBLIC_KODEO_STATIC_EXPORT: '1' },
} : {};

export default config;
