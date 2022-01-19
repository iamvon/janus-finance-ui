const nextConfig = {
    reactStrictMode: true,
    rewrites: async () => {
        return [
            {
                source: '/sitemap.xml',
                destination: '/api/sitemap'
            }
        ]
    },
}

module.exports = {...nextConfig}