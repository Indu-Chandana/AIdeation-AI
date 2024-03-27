/** @type {import('next').NextConfig} */
const nextConfig = {
    images: { // --------------------- we need to configure the remote links, when we are using next Images ---------------------
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                port: '',
                pathname: '/v0/b/aideation-indu.appspot.com/o/**',
            },
        ]
    }
};

export default nextConfig;
