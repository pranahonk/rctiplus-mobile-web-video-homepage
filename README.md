
# RCTIPlus Operation / Video

this repository is for Video or New R+ project



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```markdown
is_show_sticky_ads=true
site_name=RCTI+

MODE=DEVELOPMENT

VERSION=0.9.2
APP_VERSION=1.0.0
PLAYER_VERSION='7.7.5'
ADVERTISING_CLIENT='googima'
VMAP_KEY='vmap_ima'
UI_VERSION=2.0

REDIRECT_WEB_DESKTOP=https://rc-webd.rctiplus.com
SHARE_BASE_URL=https://dev-webm.rctiplus.com

BASE_URL='https://dev-webm.rctiplus.com'
FE = 'https://rc-rctiplus.com'
VERSION = '0.9.2'

API='https://api.rctiplus.com'

//Development API Environment
DEV_API='https://dev-api.rctiplus.com'
NEWS_API='https://dev-api.rctiplus.com/news'
NEWS_API_V2='https://dev-api.rctiplus.com/news'
REWARDS_API='https://dev-api-rewards.rctiplus.id'
STATIC='https://dev-static.rctiplus.id'
CHAT_API='https://dev-chat-api.rctiplus.com'


//Production API Environment
# DEV_API='https://api.rctiplus.com'
# NEWS_API='https://api.rctiplus.com/news'
# NEWS_API_V2='https://api.rctiplus.com/news'
# REWARDS_API='https://api-rewards.rctiplus.id'
# STATIC='https://static.rctiplus.id'
# CHAT_API='https://chat-api.rctiplus.com'

# DEV_API='https://rc-api.rctiplus.com'
# NEWS_API='https://rc-api.rctiplus.com/news'
# NEWS_API_V2='https://rc-api.rctiplus.com/news'
# REWARDS_API='https://rc-api-rewards.rctiplus.id'
# STATIC='https://rc-static.rctiplus.id'
# CHAT_API='https://rc-chat-api.rctiplus.com'

# GRAPHQL CREDENTIALS
GRAPHQL_BASE_URL="hera.mncplus.id/graphql"
GRAPHQL_APIKEY="Tpa0pF9gLU989TKBslyWvhS6ghWXVm0V"
GRAPHQL_URI="https://$GRAPHQL_BASE_URL"

FIREBASE_apiKey = "AIzaSyC8qlTIK8fnlpyXGWmP9Q_J8bfcxToeKI8"
FIREBASE_authDomain = "rcti-dev-6a81d.firebaseapp.com"
FIREBASE_databaseURL = "https://rcti-dev-6a81d.firebaseio.com"
FIREBASE_projectId = "rcti-dev-6a81d"
FIREBASE_storageBucket = "rcti-dev-6a81d.appspot.com"
FIREBASE_messagingSenderId = "464531657599"
FIREBASE_appId = "1:464531657599:web:4970b3ba390e23bf"
FIREBASE_measurementId = "G-JR2L0ZYPG7"

CONVIVA_TRACKING_KEY = '25f1bbffdca1e0a4d059c0d8f802234bbb97dcf1'
CONVIVA_TRACKING_HOST = 'mnc-test.testonly.conviva.com'

REDIRECT_SSR='https://dev-ssr.rctiplus.com'
RESOLUTION_IMG = '500'

GPT_NEWS_MWEB_LIST = '/21865661642/RC_MOBILE_LIST-NEWS_DISPLAY'
GPT_NEWS_IOS_LIST = '/21865661642/RC_IOS-APP_LIST-NEWS_DISPLAY'
GPT_NEWS_ANDROID_LIST = '/21865661642/RC_ANDROID-APP_LIST-NEWS_DISPLAY'

GPT_NEWS_MWEB_DETAIL = '/21865661642/RC_MOBILE_DETAIL-NEWS_DISPLAY'
GPT_NEWS_IOS_DETAIL = '/21865661642/RC_IOS-APP_DETAIL-NEWS_DISPLAY'
GPT_NEWS_ANDROID_DETAIL = '/21865661642/RC_ANDROID-APP_DETAIL-NEWS_DISPLAY'

GPT_MOBILE_OVERLAY_LIVE_TV = '/21865661642/RC_MOBILE_OVERLAY_LIVE-TV'
GPT_MOBILE_OVERLAY_LIVE_TV_DIV = 'div-gpt-ad-1592499579381-0'

GPT_MOBILE_OVERLAY_LIVE_EVENT = '/21865661642/RC_MOBILE_OVERLAY_LIVE-EVENT'
GPT_MOBILE_OVERLAY_LIVE_EVENT_DIV = 'div-gpt-ad-1592499705159-0'

GPT_ID_LIST = 'div-gpt-ad-1606113572364-0'

GPT_ID_DETAIL = 'div-gpt-ad-1606113667633-0'

LINK_RADIO = 'https://stag-rctiplus-roov.herokuapp.com'
LINK_GAMES = "https://www.visionplus.id/games"
LINK_HOT = 'https://rc-ugctalent.rctiplus.com'

NEXT_PUBLIC_INFOGRAPHIC_ID = "20"

GTM =  "env-41"

GTM_AUTH = 'ogx0OihVjJdMhvsmTnEFyA'

APPIER_ID = 'c63c2960bf562e9ec2de'

API_V2 = 'https://api-v2.rctiplus.com'

GTM_INIT_ID = "GTM-WJNRTJP"
GA_INIT_ID = "UA-145455301-17"
TREBEL_IFRAME_URL="https://www.rctiplus.com/trebel/content_test"
STATIC_CDN_URL="https://je-es.rctiplus.com/assets"
```


# Installation

Install my-project with npm or yarn, we strongly recommend to use yarn

```bash
  cd mobile-web
  npm install
 
```
### Or

```bash
  cd mobile-web
  yarn
```


## Run Locally

Go to the project directory

```bash
  cd mobile-web
```

Install dependencies

```bash
  npm install || yarn
```

Start the server

```bash
  npm run dev || yarn dev
```


<!-- CONTRIBUTING -->


## Contributing To Development
1. Clone the project
2. Create your Feature or Bugfix or Hotfix Branch (`git checkout -b feature/TF-891-webm-ubah-tampilan-line-up-hot`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin git checkout -b feature/TF-891-webm-ubah-tampilan-line-up-hot`)
5. Open a Pull Request to development (`development`)
6. check is your code works in (`https://dev-webm.rctiplus.com/`)
7. Move card into Ready to test


## Contributing To Release Candidates
1. If yur card already passed and the card is in (`DONE QC DEV`)
2. Open a Pull Request to release candidate (`release-candidate`)
3. check is your code works in (`https://rc-webm.rctiplus.com/`)
4. Move card into Ready to regress


## Badges


[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)


## Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

* [Next.js](https://nextjs.org/)


## Demo
* [Development](https://dev-webm.rctiplus.com/)
* [Release Candidate](https://rc-webm.rctiplus.com/)
* [Production](https://m.rctiplus.com/)



## License

[MIT](https://choosealicense.com/licenses/mit/)


## Tech Stack

**Client:** React, Redux, Bootstrap, SCSS, graphql
