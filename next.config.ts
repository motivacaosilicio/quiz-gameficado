import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    // Configuração para resolver módulos com Webpack
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/modules': path.resolve(__dirname, 'src/modules'),
    };
    
    return config;
  },
  
  // Configuração do experimental para o turbopack
  experimental: {
    // Habilitar Turbopack
    turbo: {
      resolveAlias: {
        '@/modules': path.resolve(__dirname, 'src/modules'),
      },
    },
  },
};

export default nextConfig;
