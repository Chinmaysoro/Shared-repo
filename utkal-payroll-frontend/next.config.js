// /** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    trailingSlash: true,
    basePath: process.env.NODE_ENV === 'production' ? '' : '',
    publicRuntimeConfig: {
        contextPath: process.env.NODE_ENV === 'production' ? '' : '',
        uploadPath: process.env.NODE_ENV === 'production' ? '' : ''
    },
    images: {
        domains: ['payroll.creuto-stg-s3.s3.ap-south-1.amazonaws.com']
    },
    env: {
        baseURL: process.env.REACT_APP_API_URL
    }
};
module.exports = nextConfig;