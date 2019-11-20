self.__precacheManifest = [
  {
    "url": "/_next/static/chunks/commons.de199f3715beedc2e81c.js",
    "revision": "8823e6c00da73d714d96"
  },
  {
    "url": "/_next/static/css/commons.c362ebea.chunk.css",
    "revision": "8823e6c00da73d714d96"
  },
  {
    "url": "/_next/static/runtime/main-a443c7c43094cf283c7e.js",
    "revision": "340b3be5733ea2adbb67"
  },
  {
    "url": "/_next/static/runtime/webpack-f5e50b6b501ccea2a79b.js",
    "revision": "ae583f202258b164868a"
  },
  {
    "url": "/_next/static\\dbXVkSXpGDdz7hIPYWKTt\\pages\\_app.js",
    "revision": "c0b0bfacc07299c865e2"
  },
  {
    "url": "/_next/static\\dbXVkSXpGDdz7hIPYWKTt\\pages\\_error.js",
    "revision": "e2a40999ae4b7532b690"
  },
  {
    "url": "/_next/static\\dbXVkSXpGDdz7hIPYWKTt\\pages\\index.js",
    "revision": "a7e50156653a374cfdd2"
  },
  {
    "url": "/_next/static\\dbXVkSXpGDdz7hIPYWKTt\\pages\\signin.js",
    "revision": "b430601252ecbd0d471f"
  },
  {
    "url": "/_next/static\\dbXVkSXpGDdz7hIPYWKTt\\pages\\signup.js",
    "revision": "2953addc82f5ec61561e"
  },
  {
    "url": "/_next/static\\dbXVkSXpGDdz7hIPYWKTt\\pages\\users.js",
    "revision": "bbbe009094573d30c272"
  }
];

/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

importScripts(
  
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "static/android-chrome-192x192.png",
    "revision": "530141b9ba7c48c046b7be068992fbea"
  },
  {
    "url": "static/android-chrome-512x512.png",
    "revision": "03e1e69e355a1e67830d9d6eb73c1529"
  },
  {
    "url": "static/apple-touch-icon.png",
    "revision": "c85de09057f2c9e7f28b4e12b21db83a"
  },
  {
    "url": "static/browserconfig.xml",
    "revision": "68c9044fa4a08749efb85bb2a4edaede"
  },
  {
    "url": "static/css/bootstrap.min.css",
    "revision": "f664efec09a985a2cd8a791d867bf63b"
  },
  {
    "url": "static/favicon-16x16.png",
    "revision": "6f32c8d064cb9227a542beca31b7706e"
  },
  {
    "url": "static/favicon-32x32.png",
    "revision": "ff0f064d4f31dc5f75cbd864a695811f"
  },
  {
    "url": "static/icons/rcti_128.png",
    "revision": "144d6549ef85fc2d09416e7689ca0c2c"
  },
  {
    "url": "static/icons/rcti_144.png",
    "revision": "5f5c57e0887afd8f62f750cbf3b8141c"
  },
  {
    "url": "static/icons/rcti_16.png",
    "revision": "af5af1cb01858bc45b91bf889b00b1e1"
  },
  {
    "url": "static/icons/rcti_192.png",
    "revision": "acd2b9afa4d51ba6255bb1363e5b820a"
  },
  {
    "url": "static/icons/rcti_256.png",
    "revision": "e154f6db529a2da482de5c532d8c66b3"
  },
  {
    "url": "static/icons/rcti_32.png",
    "revision": "a07cda56f3a5034e669f1ee04ba15e1b"
  },
  {
    "url": "static/icons/rcti_384.png",
    "revision": "1f1b39e0ea54e87169b0252b13514933"
  },
  {
    "url": "static/icons/rcti_512.png",
    "revision": "b5daa9b47944d072def10496b6546a05"
  },
  {
    "url": "static/manifest.json",
    "revision": "7e73b0bc07fe7c05b663bdddcb8db565"
  },
  {
    "url": "static/mstile-150x150.png",
    "revision": "bcbcd87df04932e11eef6faf134a2593"
  },
  {
    "url": "static/robot.txt",
    "revision": "e806d11ee85a7fa4a7a5e482698d4e16"
  },
  {
    "url": "static/safari-pinned-tab.svg",
    "revision": "ceabbc2dc9273200c833e6f307adc1e9"
  },
  {
    "url": "static/splashscreen-icon-512x512.png",
    "revision": "0be5f9bfd8d4e977a3a3293ed3f1ce2c"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/^https?.*/, new workbox.strategies.NetworkFirst({ "cacheName":"offlineCache", plugins: [new workbox.expiration.Plugin({ maxEntries: 200, purgeOnQuotaError: false })] }), 'GET');
