/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Garantir que o site será exportado como estático
  images: {
    unoptimized: true,  // Desabilita a otimização de imagens
  },
}

module.exports = nextConfig;
