const nextConfig = {
  devIndicators: false,
  productionBrowserSourceMaps: false,
  transpilePackages: ['@ecommerce/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:
          'ecommerce-application-for-business.s3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
