// @flow
/* eslint-disable no-process-env */

// #region imports
const express = require('express');
const { join } = require('path');
const chalk = require('chalk');
const next = require('next');
// const device = require('express-device');
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

    server.get('/profile', (req, res) => {
      return app.render(req, res, '/profile');
    });

    server.get('/player', (req, res) => {
      return app.render(req, res, '/player');
    });

    server.get('/tv/:channel', (req, res) => {
      return app.render(req, res, '/tv_v2', {
        channel: req.params.channel
      });
    });

    server.get('/programs/:id/:title/photo/:content_id/:content_title', (req, res) => {
      return app.render(req, res, '/detail/photo', {
        id: req.params.id,
        title: req.params.title,
        content_id: req.params.content_id,
        content_title: req.params.content_title,
      });
    });

    server.get('/programs/:id/:title/:content_type?/:content_id?/:content_title?/:tab?', (req, res) => {
      return app.render(req, res, '/programs', {
        id: req.params.id,
        title: req.params.title,
        tab: req.params.tab,
        content_type: req.params.content_type,
        content_id: req.params.content_id,
        content_title: req.params.content_title,
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

    server.get('/radio/:search?', (req, res) => {
      return app.render(req, res, '/roov', {
        search: req.params.search,
      });
    });

    // server.get('/tv/:channel', (req, res) => {
    //   return app.render(req, res, '/tv', { channel: req.params.channel });
    // });

    // server.get('/tv/:id/:title', (req, res) => {
    //   return app.render(req, res, '/live-event', {
    //     id: req.params.id,
    //     title: req.params.title
    //   });
    // });

    // server.get('/tv/:channel/:epg_id/:epg_title', (req, res) => {
    //   return app.render(req, res, '/tv', {
    //     channel: req.params.channel,
    //     epg_id: req.params.epg_id,
    //     epg_title: req.params.epg_title
    //   })
    // });

    server.get('/tv/:channel', (req, res) => {
      return app.render(req, res, '/tv_v2', { channel: req.params.channel });
    });

    server.get('/tv/:channel/:epg_id/:epg_title', (req, res) => {
      return app.render(req, res, '/tv_v2', {
        channel: req.params.channel,
        epg_id: req.params.epg_id,
        epg_title: req.params.epg_title
      })
    });

    // server.get('/news/:subcategory_id/:subcategory_title', (req, res) => {
    //   return app.render(req, res, '/news', {
    //     subcategory_id: req.params.subcategory_id,
    //     subcategory_title: req.params.subcategory_title
    //   });
    // });

    // server.get('/news/detail/:id/:title', (req, res) => {
    //   return app.render(req, res, '/trending/detail_v2', {
    //     id: req.params.id,
    //     title: req.params.title
    //   })
    // });

    // server.get('/news/topic/tag/:title_tag', (req, res) => {
    //   return app.render(req, res, '/trending/list-tags', {
    //     title_tag: req.params.title_tag,
    //   })
    // });

    // server.get('/news/detail/:category/:id/:title', (req, res) => {
    //   return app.render(req, res, '/trending/detail_v2', {
    //     id: req.params.id,
    //     title: req.params.title,
    //     category: req.params.category,
    //   });
    // });


    // server.get('/news/search', (req, res) => {
    //   return app.render(req, res, '/trending/search_v2');
    // });
    // server.get('/news/interest-topic', (req, res) => {
    //   return app.render(req, res, '/interest-topic');
    // });
    // server.get('/news', (req, res) => {
    //   return app.render(req, res, '/news');
    // });
    // server.get('/news/channels', (req, res) => {
    //   return app.render(req, res, '/trending/channels');
    // });

    // server.get('/trending/:subcategory_id/:subcategory_title', (req, res) => {
    //   return app.render(req, res, '/trending_old', {
    //     subcategory_id: req.params.subcategory_id,
    //     subcategory_title: req.params.subcategory_title
    //   });
    // });

    // server.get('/trending/detail/:id/:title', (req, res) => {
    //   return app.render(req, res, '/trending/detail', {
    //     id: req.params.id,
    //     title: req.params.title
    //   })
    // });

    // server.get('/trending/detail/:id/:title', (req, res) => {
    //   return app.render(req, res, '/trending/detail_v2', {
    //     id: req.params.id,
    //     title: req.params.title
    //   })
    // });

    // server.get('/trending/search', (req, res) => {
    //   return app.render(req, res, '/trending/search_v2');
    // });

    // server.get('/trending/detail/:id/:title', (req, res) => {
    //   return app.render(req, res, '/trending/detail', {
    //     id: req.params.id,
    //     title: req.params.title
    //   })
    // });

    // server.get('/trending/search', (req, res) => {
    //   return app.render(req, res, '/trending/search');
    // });

    // server.get('/trending', (req, res) => {
    //   return app.render(req, res, '/trending_old');
    // });

    server.get('/exclusive/:category', (req, res) => {
      return app.render(req, res, '/exclusive', {
        category: req.params.category
      })
    });
    
    server.get('/explores', (req, res) => {
      return app.render(req, res, '/explores_revamp')
    })

    server.get('/explores/search', (req, res) => {
      return app.render(req, res, '/searchLibrary', {
        id: req.params.id
      })
    })
    server.get('/explores/keyword', (req, res) => {
      return app.render(req, res, '/searchLibrary', {
        id: req.params.id,
        q: req.query.q
      })
    })
    server.get('/explores/:id/:genre_name', (req, res) => {
      return app.render(req, res, '/explores_v2', {
        id: req.params.id,
        genre_name: req.params.genre_name
      })
    })

    // server.get('/trending/:subcategory_id/:subcategory_title', (req, res) => {
    //   return app.render(req, res, '/trending', {
    //     subcategory_id: req.params.subcategory_id,
    //     subcategory_title: req.params.subcategory_title
    //   });
    // });
    // server.get('/trending', (req, res) => {
    //   return app.render(req, res, '/trending');
    // });

    server.get('/live-event/:id/:title', (req, res) => {
      return app.render(req, res, '/live-events/live-event', {
        id: req.params.id,
        title: req.params.title
      });
    });
    server.get('/missed-event/:id/:title', (req, res) => {
      return app.render(req, res, '/live-events/live-event', {
        id: req.params.id,
        title: req.params.title
      });
    });
    server.get('/live-event', (req, res) => {
      return app.render(req, res, '/live-events');
    });
    server.get('/missed-event', (req, res) => {
      return app.render(req, res, '/live-events');
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
