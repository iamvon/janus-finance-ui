const nextConfig = {
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback.fs = false;
        }
        return config;
    },
    rewrites: async () => {
        return [
            {
                source: '/sitemap.xml',
                destination: '/api/sitemap'
            }
        ]
    },
}

module.exports = { ...nextConfig }