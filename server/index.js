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

const UIVersion = '2.0';

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

    server.get('/programs/:id/:title', (req, res) => {
      return app.render(req, res, '/programs', { 
        id: req.params.id, 
        title: req.params.title 
      });
    });

    server.get('/programs/:id/:title/:content_type', (req, res) => {
      return app.render(req, res, '/programs', { 
        id: req.params.id, 
        title: req.params.title,
        content_type: req.params.content_type 
      });
    });

    server.get('/programs/:id/:title/photo/:content_id/:content_title', (req, res) => {
      return app.render(req, res, '/detail/photo', {
        id: req.params.id,
        title: req.params.title,
        content_id: req.params.content_id,
        content_title: req.params.content_title
      });
    });

    server.get('/programs/:id/:title/:content_type/:content_id/:content_title', (req, res) => {
      return app.render(req, res, '/detail/content', { 
        id: req.params.id, 
        title: req.params.title,
        type: req.params.content_type,
        content_id: req.params.content_id,
        content_title: req.params.content_title 
      });
    });

    server.get('/mylist', (req, res) => {
      return app.render(req, res, '/user/my-list');
    });

    server.get('/continue-watching', (req, res) => {
      return app.render(req, res, '/user/continue-watching');
    });

    server.get('/edit-profile', (req, res) => {
      return app.render(req, res, '/user/edit-profile');
    });

    server.get('/privacy-policy', (req, res) => {
      return app.render(req, res, '/user/privacy-policy');
    });

    server.get('/terms-&-conditions', (req, res) => {
      return app.render(req, res, '/user/term-cond');
    });

    server.get('/history', (req, res) => {
      return app.render(req, res, '/user/history');
    });

    server.get('/faq', (req, res) => {
      return app.render(req, res, '/user/faq');
    });

    server.get('/contact-us', (req, res) => {
      return app.render(req, res, '/user/contact-us');
    });

    server.get('/qrcode', (req, res) => {
      return app.render(req, res, '/user/qrcode');
    });

    server.get('/tv/:channel', (req, res) => {
      return app.render(req, res, '/tv', { channel: req.params.channel });
    });

    server.get('/tv/:channel/:epg_id/:epg_title', (req, res) => {
      return app.render(req, res, '/tv', {
        channel: req.params.channel,
        epg_id: req.params.epg_id,
        epg_title: req.params.epg_title
      })
    });
    
    server.get('/trending/detail/:id/:title', (req, res) => {
      return app.render(req, res, '/trending/detail', {
        id: req.params.id,
        title: req.params.title
      })
    });

    server.get('/exclusive/:category', (req, res) => {
      return app.render(req, res, '/exclusive', {
        category: req.params.category
      })
    });

    server.get('/explores/search', (req, res) => {
      return app.render(req, res, '/explores', {
        id: req.params.id
      })
    })

    server.get('/trending/:subcategory_id/:subcategory_title', (req, res) => {
      return app.render(req, res, '/trending', {
        subcategory_id: req.params.subcategory_id,
        subcategory_title: req.params.subcategory_title
      });
    });

    server.get('/radio', (req, res) => {
      return app.render(req, res, '/roov');
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
    console.error(error);
  }
})();
