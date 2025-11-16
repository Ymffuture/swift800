/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
  api: {
    bodyParser: {
      sizeLimit: '10mb' // allow large base64 uploads
    }
  }
};
