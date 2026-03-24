const nextConfig = {
  devIndicators: false,
  productionBrowserSourceMaps: false,
  transpilePackages: ['@ecommerce/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:
          'ecommerce-shop-assets-dzenis.s3.eu-central-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
