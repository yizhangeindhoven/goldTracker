// vite.config.js

/** @type {import('vite').UserConfig} */
export default {
  server: {
    // This setting allows Vite's dev server to accept requests from hosts other than localhost.
    // It's necessary for services like ngrok to forward traffic to your local machine.
    // We are specifically allowing any subdomain of ngrok's free tier.
    allowedHosts: ['.ngrok-free.dev'],
  },
};
