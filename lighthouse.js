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
    chromeFlags: ['--headless'],
    output: 'html'
};

(async () => {
    // Usage:
    const baseUrl = 'https://rc-m-new.rctiplus.com';
    const urls = {
        home: baseUrl,
        login: baseUrl + '/login',
        register: baseUrl + '/register',
        exclusive: baseUrl + '/exclusive',
        trending: baseUrl + '/trending',
        content: baseUrl + '/programs/439/take-me-out',
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