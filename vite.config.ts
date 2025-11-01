// vite.config.js

/** @type {import('vite').UserConfig} */
export default {
  define: {
    // This injects the environment variable into the client-side code during the build.
    // It replaces any occurrence of `process.env.API_KEY` with the value of the API_KEY
    // environment variable set in your Cloudflare dashboard.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  server: {
    // This setting allows Vite's dev server to accept requests from hosts other than localhost.
    // It's necessary for services like ngrok to forward traffic to your local machine.
    // We are specifically allowing any subdomain of ngrok's free tier.
    allowedHosts: ['.ngrok-free.dev'],
  },
};
