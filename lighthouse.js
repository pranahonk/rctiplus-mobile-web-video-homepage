const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');

function launchChromeAndRunLighthouse(url, label, opts, config = null) {
    return chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then(chrome => {
        opts.port = chrome.port;
        return lighthouse(url, opts, config).then(results => {
            // use results.lhr for the JS-consumable output
            // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
            // use results.report for the HTML/JSON/CSV output as a string
            // use results.artifacts for the trace/screenshots/other specific case you need (rarer)

            if (!fs.existsSync('lighthouse-reports')) {
                fs.mkdirSync('lighthouse-reports');
            }
            fs.writeFile(`lighthouse-reports/${label}.html`, results.report, function(err) {
                if (err) {
                    return console.log(err);
                }
            });

            return chrome.kill().then(() => results.lhr)
        });
    });
}

const opts = {
    chromeFlags: ['--headless', '--no-sandbox', '--ignore-certificate-errors'],
    output: 'html'
};

(async () => {
    // Usage:
    // const baseUrl = 'https://rc-m-new.rctiplus.com';
    const baseUrl = 'https://m2.rctiplus.com';
    const urls = {
        home: baseUrl,
        login: baseUrl + '/login',
        register: baseUrl + '/register',
        exclusive_all: baseUrl + '/exclusive',
        exclusive_photo: baseUrl + '/exclusive/photo',
        exclusive_gossip: baseUrl + '/exclusive/gossip',
        exclusive_news: baseUrl + '/exclusive/news',
        exclusive_clip: baseUrl + '/exclusive/clip',
        exclusive_bloopers: baseUrl + '/exclusive/bloopers',
        exclusive_behind_the_scenes: baseUrl + '/exclusive/behind-the-scenes',
        trending: baseUrl + '/trending',
        // content: baseUrl + '/programs/439/take-me-out-indonesia',
        // content_episodes: baseUrl + '/programs/439/take-me-out-indonesia/episodes',
        // content_extras: baseUrl + '/programs/439/take-me-out-indonesia/extras',
        // content_clips: baseUrl + '/programs/439/take-me-out-indonesia/clips',
        // content_photos: baseUrl + '/programs/439/take-me-out-indonesia/photos',
        // content_episode_detail: baseUrl + '/programs/439/take-me-out-indonesia/episode/4316/take-me-out-indonesia-ep.1',
        // content_extra_detail: baseUrl + '/programs/439/take-me-out-indonesia/extra/272/bts-episode-8',
        // content_clip_detail: baseUrl + '/programs/439/take-me-out-indonesia/clip/547/take-me-out-indonesiatake-me-out-indonesiatake-me-out-indonesiatake-me-out-indonesiatake-me-out-indonesiatake-me-out-indonesiatake-me-out-indonesiatake-me-out-i',
        // content_photo_detail: baseUrl + '/programs/439/take-me-out-indonesia/photo/38/take-me-take',
        tv_rcti: baseUrl + '/tv/rcti',
        tv_mnctv: baseUrl + '/tv/mnctv',
        tv_globaltv: baseUrl + '/tv/globaltv',
        tv_inews: baseUrl + '/tv/inews',
        profile: baseUrl + '/profile'
    };

    console.log('--- MEASURE PERFORMANCE ---');

    const urlKeys = Object.keys(urls);
    for (let i = 0; i < urlKeys.length; i++) {
        const results = await launchChromeAndRunLighthouse(urls[urlKeys[i]], urlKeys[i], opts);

        // Use results!
        const categoryKeys = Object.keys(results.categories);
        let scoreOutput = '';
        for (let j = 0; j < categoryKeys.length; j++) {
            const score = results.categories[categoryKeys[j]].score;
            scoreOutput += `${results.categories[categoryKeys[j]].title}(${score ? score * 100 : 'not scored'})`;
            if (j < categoryKeys.length - 1) {
                scoreOutput += ', ';
            }
        }

        console.log(`${urlKeys[i]} -> ${scoreOutput}`);
    }
    
})();