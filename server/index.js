// @flow
/* eslint-disable no-process-env */

// #region imports
const express = require('express');
const { join } = require('path');
const chalk = require('chalk');
const next = require('next');
// #endregion

// #region variables/constants initialization
const port = parseInt(process.env.PORT, 10) || 3000;
const ipAdress = 'localhost';
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
// #endregion

(async () => {
  try {
    await app.prepare();

    const server = express();

    // example of custom request handlers:
    // server.get('/a', (req, res) => app.render(req, res, '/b', req.query));
    // server.get('/b', (req, res) => app.render(req, res, '/a', req.query));

    // handles service worker file request:
    server.get('/service-worker.js', (req, res) =>
      res.sendFile(join('.next', '/service-worker.js'), { root: '.' }),
    );

    server.get('/lighthouse-report', (req, res) => {
      res.sendfile('/lighthouse-report.html', { root: '.' });
    });

    server.get('/lighthouse/:page', (req, res) => {
      res.sendFile(`/lighthouse-reports/${req.params.page}.html`, { root: '.' });
    });

    server.get('/live-tv/:channel', (req, res) => {
      return app.render(req, res, '/live-tv', { channel: req.params.channel });
    });

    server.get('/live-tv/:channel/:epg_id/:epg_title', (req, res) => {
      return app.render(req, res, '/live-tv', {
        channel: req.params.channel,
        epg_id: req.params.epg_id,
        epg_title: req.params.epg_title
      })
    });

    // default request handler by next handler:
    server.get('*', (req, res) => {
      return handle(req, res);
    });

    

    server.listen(port, err => {
      if (err) {
        throw err;
      }

      /* eslint-disable no-console */
      console.log(`
          =====================================================
          -> Server (${chalk.bgBlue(
            'NextJS PWA',
          )}) 🏃 (running) on ${chalk.green(ipAdress)}:${chalk.green(`${port}`)}
          =====================================================
        `);
      /* eslint-enable no-console */
    });
  } catch (error) {
    console.log('ERRORRRR');
    console.error(error);
  }
})();
