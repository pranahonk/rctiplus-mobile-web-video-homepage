import { isIOS, isAndroid } from "react-device-detect";

export const BASE_URL = process.env.BASE_URL;
export const MODE = process.env.MODE
export const APPIER_ID = process.env.APPIER_ID

export const FE = process.env.FE;
export const VERSION = process.env.VERSION;

export const API = process.env.API;

export const GTM = process.env.GTM;

export const GTM_AUTH = process.env.GTM_AUTH;

export const DEV_API = process.env.DEV_API;

export const API_V2 = process.env.API_V2 ? process.env.API_V2 : process.env.DEV_API;

export const CHAT_API = process.env.CHAT_API;
export const LINK_RADIO = process.env.LINK_RADIO;
export const LINK_GAMES = process.env.LINK_GAMES;
export const LINK_HOT = process.env.LINK_HOT;
export const LINK_NEWS = process.env.LINK_NEWS;
export const LINK_HERA = process.env.LINK_NEWS;

export const REDIRECT_WEB_DESKTOP = process.env.REDIRECT_WEB_DESKTOP;
export const SHARE_BASE_URL = process.env.SHARE_BASE_URL;
export const RESOLUTION_IMG = process.env.RESOLUTION_IMG;

export const NEWS_API = process.env.NEWS_API;
export const NEWS_API_V2 = process.env.NEWS_API_V2;

export const REWARDS_API = process.env.REWARDS_API;
export const STATIC = process.env.STATIC;

export const FIREBASE_apiKey = process.env.FIREBASE_apiKey;
export const FIREBASE_authDomain = process.env.FIREBASE_authDomain;
export const FIREBASE_databaseURL = process.env.FIREBASE_databaseURL;
export const FIREBASE_projectId = process.env.FIREBASE_projectId;
export const FIREBASE_storageBucket = process.env.FIREBASE_storageBucket;
export const FIREBASE_messagingSenderId = process.env.FIREBASE_messagingSenderId;
export const FIREBASE_appId = process.env.FIREBASE_appId;
export const FIREBASE_measurementId = process.env.FIREBASE_measurementId;

export const GPT_NEWS_MWEB_LIST = process.env.GPT_NEWS_MWEB_LIST
export const GPT_NEWS_IOS_LIST = process.env.GPT_NEWS_IOS_LIST
export const GPT_NEWS_ANDROID_LIST = process.env.GPT_NEWS_ANDROID_LIST
export const GPT_NEWS_LINK_LIST = process.env.GPT_NEWS_LINK_LIST

export const GPT_NEWS_MWEB_DETAIL = process.env.GPT_NEWS_MWEB_DETAIL
export const GPT_NEWS_IOS_DETAIL = process.env.GPT_NEWS_IOS_DETAIL
export const GPT_NEWS_ANDROID_DETAIL = process.env.GPT_NEWS_ANDROID_DETAIL
export const GPT_NEWS_LINK_DETAIL = process.env.GPT_NEWS_LINK_DETAIL

export const GPT_NEWS_MWEB_SEARCH = process.env.GPT_NEWS_MWEB_SEARCH
export const GPT_NEWS_IOS_SEARCH = process.env.GPT_NEWS_IOS_SEARCH
export const GPT_NEWS_ANDROID_SEARCH = process.env.GPT_NEWS_ANDROID_SEARCH

export const GPT_ID_LIST = process.env.GPT_ID_LIST

export const GPT_ID_SEARCH = process.env.GPT_ID_SEARCH

export const GPT_ID_DETAIL = process.env.GPT_ID_DETAIL

export const REDIRECT_SSR = process.env.REDIRECT_SSR;
export const API_TIMEOUT = process.env.API_TIMEOUT;

export const CONVIVA_TRACKING_KEY = process.env.CONVIVA_TRACKING_KEY;
export const CONVIVA_TRACKING_HOST = process.env.CONVIVA_TRACKING_HOST;

export const VISITOR_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2aWQiOjAsInRva2VuIjoiNWRhNmE2ODY2ZTg5N2Q0MSIsInBsIjoibXdlYiIsImRldmljZV9pZCI6IjY5NDIwIn0.rOdLG9s4KFcKcQT8n58RaD8MgnAclnS13z4GOcJaJ5I';
export const NEWS_TOKEN = '';
export const IS_SHOWN = true;

export const WS_SECRET_KEY = process.env.WS_SECRET_KEY;


// SEO CONSTANTS

export const AUTHOR = 'RCTI+';
export const VIEWPORT = 'initial-scale=1.0, width=device-width, user-scalable=no';
export const MAIN_DESCRIPTION = 'Live Streaming Program RCTI, MNCTV, GTV & iNews. Menyajikan konten ekslusif yang tidak tayang di TV & Informasi Trending Terupdate. Nonton Gak Monoton di RCTI+.';
export const MAIN_TITLE = 'RCTI+ - Live Streaming Program 4 TV Terpopuler';
export const OPEN_GRAPH = {
    type: 'article',
    url: process.env.BASE_URL,
    image: 'https://www.rcti.tv/img/favicon.png',
    site_name: process.env.BASE_URL
};
export const GRAPH_SITEMAP = {
    appId: '211272363627736',
    twitterCard: 'summary_large_image',
    twitterCreator: '@RCTIPlus',
    twitterSite: '@RCTIPlus',
};
export const SITE_NAME = 'RCTI+';
export const SITE_NAME_NEWS = 'News+ on RCTI+';
export const UTM_NAME = (utm, utmCampaign, utmMedium, platform = 'mweb') => {
    switch (utm) {
        case 'trending':
        case 'news':
            if (platform === 'ios') {
                return '?utm_source=RplusiOsApp&utm_medium=share_' + utmCampaign + '&utm_campaign=' + utm + utmMedium;
            }
            if (platform === 'android') {
                return '?utm_source=RplusaOsApp&utm_medium=sharenews&utm_campaign=' + utm;
            }
            return '?utm_source=Rplusmweb&utm_medium=sharenews&utm_campaign=' + utm;
        default:
            return '?utm_source=Rplusmweb&utm_medium=share_' + utmMedium + '&utm_campaign=news' + utmCampaign;
    }
};
export const SITEMAP = {
    home: {
        title: `${SITE_NAME} - Satu Aplikasi, Semua Hiburan`,
        description: 'Nonton Film & Live Streaming TV Online di RCTI Plus. Satu Aplikasi, Semua Hiburan: Video, Berita, Radio, Podcast, Games, dan Ajang Pencarian Bakat. Download sekarang.',
        keywords: `rcti plus, rcti+, tv online, streaming tv, live streaming, nonton film`,
        image: `${STATIC}/media/600/files/fta_rcti/metaimages/Home-RCTIPlus-compress.jpg`
    },
    terms_and_conditions: {
        title: `Terms and Conditions - ${SITE_NAME}`,
        description: `Layanan aplikasi RCTI Plus bersifat gratis. Untuk menggunakan layanan RCTI+, Anda harus mengikuti syarat dan ketentuan yang berlaku.`,
        keywords: "rctiplus gratis, aplikasi rcti plus, peraturan pengguna rcti plus, terms and conditions rcti plus",
        image: `https://rctiplus.com/assets/image/elements/logo.b9f35229.png`
    },
    privacy_policy: {
        title: `Privacy Policy - ${SITE_NAME}`,
        description: `Kebijakan privasi ini menjelaskan teknik dan proses kerja kami tentang informasi yang terkumpul melalui layanan internet, mobile, aplikasi dan widget pada RCTI+`,
        keywords: `privacy policy rcti plus, kebijakan privasi rcti plus`,
        image: `https://rctiplus.com/assets/image/elements/logo.b9f35229.png`
    },
    contact_us: {
        title: `Hubungi Kami - ${SITE_NAME}`,
        description: `Hubungi kami terkait informasi, kebijakan privasi, serta syarat dan ketentuan yang ada di RCTI+ melalui halaman ini.`,
        keywords: `hubungi kami, hubungi kami sekarang, rcti plus hubungi kami, hubungi rcti plus, hubungi rcti+, hubungi rctiplus`,
        image: `https://rctiplus.com/assets/image/elements/logo.b9f35229.png`
    },
    faq: {
        title: `Frequently Asked and Questions - ${SITE_NAME}`,
        description: `Kumpulan pertanyaan yang paling sering diajukan (FAQ) terkait informasi penggunaan dan program tayangan di RCTI+ beserta jawabannya.`,
        keywords: `faq rctiplus, faq rcti+, cara melihat tv di hp, cara menggunakan aplikasi rcti plus, cara download rcti plus, cara download video di rctiplus`,
        image: `https://rctiplus.com/assets/image/elements/logo.b9f35229.png`
    },
    register: {
        title: `Sign Up / Pendaftaran Akun - ${SITE_NAME}`,
        description: `Pendaftaran/register akun di RCTI Plus. Register sekarang. Gratis streaming online sepuasnya. Nikmati semua layanan entertainment di RCTI+.`,
        keywords: `daftar rcti, daftar rcti plus, register rcti plus, register rcti+, sign up rcti plus, sign up rcti+`,
        image: `https://rctiplus.com/assets/image/elements/logo.b9f35229.png`
    },
    login: {
        title: `Login Akun - ${SITE_NAME}`,
        description: `Login akun untuk menikmati semua layanan entertainment gratis di RCTI+.`,
        keywords: `login, login akun, login rcti plus, login rctiplus, login rcti+, masuk rctiplus`,
        image: `https://rctiplus.com/assets/image/elements/logo.b9f35229.png`
    },
    interest: {
        title: `Pilih Kategori Program Favorit Kamu - ${SITE_NAME}`,
        description: `Pilih program dan kategori favorit kamu di dalam aplikasi RCTI+.`,
        keywords: `program rcti, tayangan rcti, acara rcti`,
        image: `https://rctiplus.com/assets/image/elements/logo.b9f35229.png`
    },
    verification_email: {
        title: `Selamat! Verifikasi Email Kamu Sudah Berhasil - ${SITE_NAME}`,
        description: `Silahkan nikmati program favorit kamu`,
        keywords: `rctiplus, rcti+`,
        image: `https://rctiplus.com/assets/image/elements/logo.b9f35229.png`
    },
    profile: {
        title: `Profile User - ${SITE_NAME}`,
        description: `Profile user untuk melanjutkan video yang belum selesai ditonton`,
        keywords: `rctiplus, rcti+`,
        image: `https://rctiplus.com/assets/image/elements/logo.b9f35229.png`
    },
    edit_profile: {
        title: `Edit Profile - ${SITE_NAME}`,
        description: `Edit profile user`,
        keywords: `rctiplus, rcti+`,
        image: `https://rctiplus.com/assets/image/elements/logo.b9f35229.png`
    },
    history: {
        title: `Riwayat Pencarian dan Tayangan - ${SITE_NAME}`,
        description: `Kumpulan video dan program yang sudah ditonton`,
        keywords: `rctiplus, rcti+`,
        image: `https://rctiplus.com/assets/image/elements/logo.b9f35229.png`
    },
    my_list: {
        title: `Koleksi User - ${SITE_NAME}`,
        description: `Kumpulan koleksi video dan program milik user`,
        keywords: `rctiplus, rcti+`,
        image: `https://rctiplus.com/assets/image/elements/logo.b9f35229.png`
    },
    qr_code: {
        title: `Scan QR Code- ${SITE_NAME}`,
        description: `Scan QR Code menggunakan HP kamu disini`,
        keywords: `rctiplus, rcti+`,
        image: `https://rctiplus.com/assets/image/elements/logo.b9f35229.png`
    },
    exclusive_all: {
        title: `Nonton Tayangan Menarik dan Terbaru dari RCTI, MNC, GTV, iNews - ${SITE_NAME}`,
        description: `Nonton acara dan tayangan TV terbaru favoritmu dan jangan lewatkan berita terbaru program RCTI, MNC, GTV, dan iNews eksklusif hanya di RCTI+`,
        keywords: `exclusive, nonton film uncensored, tayangan tv`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Exclusive%20Content-min.png`
    },
    exclusive_original_series: {
        title: `Nonton Tayangan Menarik dan Terbaru dari RCTI, MNC, GTV, iNews - ${SITE_NAME}`,
        description: `Nonton acara dan tayangan TV terbaru favoritmu dan jangan lewatkan berita terbaru program RCTI, MNC, GTV, dan iNews eksklusif hanya di RCTI+`,
        keywords: `exclusive, nonton film uncensored, tayangan tv`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Exclusive%20Content-min.png`
    },
    exclusive_original_movies: {
        title: `Nonton Tayangan Menarik dan Terbaru dari RCTI, MNC, GTV, iNews - ${SITE_NAME}`,
        description: `Nonton acara dan tayangan TV terbaru favoritmu dan jangan lewatkan berita terbaru program RCTI, MNC, GTV, dan iNews eksklusif hanya di RCTI+`,
        keywords: `exclusive, nonton film uncensored, tayangan tv`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Exclusive%20Content-min.png`
    },
    exclusive_original_entertainment: {
        title: `Nonton Tayangan Menarik dan Terbaru dari RCTI, MNC, GTV, iNews - ${SITE_NAME}`,
        description: `Nonton acara dan tayangan TV terbaru favoritmu dan jangan lewatkan berita terbaru program RCTI, MNC, GTV, dan iNews eksklusif hanya di RCTI+`,
        keywords: `exclusive, nonton film uncensored, tayangan tv`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Exclusive%20Content-min.png`
    },
    exclusive_clip: {
        title: `Saksikan Clip Video Menarik dan Lucu Sinetron Indonesia - ${SITE_NAME}`,
        description: `Nonton potongan video lucu, menarik dan pendek dari berbagai sinetron favorit orang Indonesia, mulai dari permasalahan ekomoni, horor, hingga romantisnya percintaan`,
        keywords: `video menarik, video lucu, video lucu pendek`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Exclusive%20Content-min.png`
    },
    exclusive_photo: {
        title: `Kumpulan Foto Artis dan Poster Menarik Talent Indonesia - ${SITE_NAME}`,
        description: `Lihat kumpulan foto artis cantik dan ganteng dalam negeri dan luar negeri lengkap dengan posternya`,
        keywords: `foto artis, foto artis cantik, foto artis ganteng`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Exclusive%20Content-min.png`
    },
    exclusive_entertainment: {
        title: `Nonton Video Gosip Kabar Artis Indonesia Terbaru - ${SITE_NAME}`,
        description: `Nonton gosip dan video entertainment viral terbaru dari para artis dan selebritis tanah air dan internasional yang sedang sensasional`,
        keywords: `gosip, kabar artis`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Exclusive%20Content-min.png`
    },
    exclusive_news: {
        title: `Saksikan Berita Terkini dari Dalam Negeri dan Internasional - ${SITE_NAME}`,
        description: `Nonton berita iNews, RCTI, MNC, dan GTV online terkini terkait bisnis, ekonomi, politik, sport, teknologi, bola dan yang lainnya`,
        keywords: `berita terkini, berita inews, berita rcti, berita mnc, berita gtv`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Exclusive%20Content-min.png`
    },
    exclusive_gossip: {
        title: `Saksikan Berita Terkini dari Dalam Negeri dan Internasional - ${SITE_NAME}`,
        description: `Nonton berita iNews, RCTI, MNC, dan GTV online terkini terkait bisnis, ekonomi, politik, sport, teknologi, bola dan yang lainnya`,
        keywords: `berita terkini, berita inews, berita rcti, berita mnc, berita gtv`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Exclusive%20Content-min.png`
    },
    exclusive_bloopers: {
        title: `Kumpulan Video Lucu dari Sinetron Favorit Indonesia - ${SITE_NAME}`,
        description: `Nonton video lucu pendek artis sinetron Indonesia program RCTI, MNC, GTV, dan iNews hanya di RCTI+ - Streaming video online terlengkap`,
        keywords: "sinetron lucu, kumpulan video lucu, video lucu,  video lucu pendek",
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Exclusive%20Content-min.png`
    },
    exclusive_behind_the_scenes: {
        title: `Cuplikan Behind the Scenes Eksklusif Hanya di RCTI+ - ${SITE_NAME}`,
        description: "Nonton behind the scenes di RCTI+: cuplikan dan cerita di balik layar program dan acara TV RCTI, MNCTV, GTV, iNews TV.",
        keywords: "behind the scene, di balik layar, cerita di balik layar",
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Exclusive%20Content-min.png`
    },
    live_tv_rcti: {
        title: `Nonton Live Streaming RCTI Hari Ini - TV Online Indonesia - ${SITE_NAME}`,
        description: `Nonton tv online bersama Indonesia. Cek jadwal live streaming tayangan video siaran RCTI terbaru hari ini di RCTI+.`,
        keywords: `rcti, streaming rcti, live streaming rcti, rcti live, tv online, streaming tv, live streaming, tv bersama, nonton tv`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_RCTI-min.png`,
        image_catchup: `${STATIC}/media/500/files/assets/metaimages/CATCH_UP_RCTI.png`,
        twitter_img_alt: 'streaming rcti',
        id_channel:1
    },
    live_tv_mnctv: {
        title: `Nonton Live Streaming MNCTV Hari Ini - TV Online Indonesia - ${SITE_NAME}`,
        description: `Nonton live streaming tv Indonesia, MNCTV online hari ini tanpa buffering. Cek juga jadwal program dan acara terbaru di RCTI+.`,
        keywords: `streaming mnctv, live streaming mnctv, mnctv, mnctv live, live mnctv, mnc, tv online mnctv, mnc tv, tv online indonesia, streaming tv indonesia`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_MNCTV-min.png`,
        image_catchup: `${STATIC}/media/500/files/assets/metaimages/CATCH_UP_MNCTV.png`,
        twitter_img_alt: 'streaming mnc tv',
        id_channel:2
    },
    live_tv_globaltv: {
        title: `Nonton Live Streaming GTV Hari Ini - TV Online Indonesia - ${SITE_NAME}`,
        description: `Nonton live streaming GTV online hari ini tanpa buffering untuk semua program dan acara favorit yang tayang setiap hari. Dapatkan juga jadwal acara Global TV terbaru hanya di RCTI+`,
        keywords: `gtv, streaming gtv, live streaming gtv, global tv, gtv live, streaming global tv, live streaming global tv, global tv live, jadwal global tv hari ini, live tv online`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_GTV-min.png`,
        image_catchup: `${STATIC}/media/500/files/assets/metaimages/CATCH_UP_GTV.png`,
        twitter_img_alt: 'streaming gtv',
        id_channel:3
    },
    live_tv_gtv: {
        title: `Nonton Live Streaming GTV Hari Ini - TV Online Indonesia - ${SITE_NAME}`,
        description: `Nonton live streaming GTV online hari ini tanpa buffering untuk semua program dan acara favorit yang tayang setiap hari. Dapatkan juga jadwal acara Global TV terbaru hanya di RCTI+`,
        keywords: `gtv, streaming gtv, live streaming gtv, global tv, gtv live, streaming global tv, live streaming global tv, global tv live, jadwal global tv hari ini, live tv online`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_GTV-min.png`,
        image_catchup: `${STATIC}/media/500/files/assets/metaimages/CATCH_UP_GTV.png`,
        twitter_img_alt: 'streaming gtv',
        id_channel:3
    },
    live_tv_inews: {
        title: `Nonton Live Streaming iNews TV - Berita Terkini Terbaru Hari Ini - ${SITE_NAME}`,
        description: `Berita terkini terbaru hari ini dan program favorit lainnya disajikan iNews TV. Nonton online live streaming di RCTI+.`,
        keywords: `inews, inews tv, streaming inews, live streaming inews, inews tv online, inews live, streaming inews tv, berita terkini, berita terbaru`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_INEWS-min.png`,
        image_catchup: `${STATIC}/media/500/files/assets/metaimages/CATCH_UP_INEWS.png`,
        twitter_img_alt: 'streaming inews tv',
        id_channel:4
    },
    live_event_index: {
        title: `Nonton Streaming Live Event - Siaran Langsung - TV Online Indonesia - ${SITE_NAME}`,
        description: `Nonton live streaming tv online Indonesia berbagai event menarik eksklusif hanya di RCTI+, mulai dari bola, entertainment, musik dan lainnya.`,
        keywords: `siaran langsung, jadwal siaran langsung, siaran langsung tv, tv siaran langsung, tv online siaran langsung, siaran langsung tv indonesia, live event`,
        image: 'https://rctiplus.com/assets/image/elements/logo.b9f35229.png',
    },
    missed_event_index: {
        title: `Nonton Siaran Ulang Streaming Live Event TV Online - ${SITE_NAME}`,
        description: `Nonton tayangan ulang live streaming tv online Indonesia berbagai siaran event menarik eksklusif hanya di aplikasi RCTI+.`,
        keywords: `siaran ulang, siaran ulang tv, aplikasi siaran ulang tv, tayangan ulang, tayangan ulang tv`,
        image: 'https://rctiplus.com/assets/image/elements/logo.b9f35229.png',
    },
    trending: {
        title: `Informasi Berita Terkini dan Viral dari Berbagai Sumber Terpercaya - ${SITE_NAME_NEWS}`,
        description: `RCTI+ - Portal berita trending Indonesia dan dunia hari ini dari berbagai situs terpercaya, mulai dari peristiwa, politik, hukum, ekonomi, bola, hingga gosip artis terbaru`,
        keywords: `berita hari ini, berita harian, berita terkini, berita terbaru, berita indonesia, berita terpopuler, berita, berita terupdate, berita online, info terkini, berita dunia, peristiwa hari ini, berita viral`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_NEWS-min.png`
    },
    trending_populer: {
        title: `Berita Terpopuler dan Paling Dicari Hari Ini - ${SITE_NAME_NEWS}`,
        description: `Kumpulan berita populer hari ini eksklusif hanya di rctiplus.com dari berbagai kanal`,
        keywords: `berita populer, Berita Terpopuler Hari Ini rctiplus.com, berita terbaru hari ini, berita terhangat, viral`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_NEWS-min.png`
    },
    trending_top: {
        title: `Informasi Berita Top Terbaru Hari ini dari Berbagai Sumber Terpercaya - ${SITE_NAME_NEWS}`,
        description: `Indeks portal berita trending Indonesia dan dunia hari ini dari situs terpercaya, dari peristiwa, politik, tekno, ekonomi, bola, hingga gosip artis`,
        keywords: `berita top, berita top hari ini, berita teratas`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_NEWS-min.png`
    },
    trending_terkini: {
        title: `Berita Terkini, Viral dan Terbaru Dalam Negeri dan Internasional - ${SITE_NAME_NEWS}`,
        description: `Baca berita terkini yang sedang viral dari dalam negeri dan luar yang dikumpulkan dari berbagai situs terpercaya dan teraktual`,
        keywords: `berita terkini, berita hari ini, berita harian, berita terkini, berita terbaru, berita indonesia, berita terpopuler, berita, berita terupdate, berita online, info terkini, berita dunia, peristiwa hari ini, berita viral`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_NEWS-min.png`,
    },
    trending_hiburan: {
        title: `Gosip dan Hiburan Terbaru Artis Dalam Negeri & Internasional - ${SITE_NAME_NEWS}`,
        description: `Kumpulan berita dan artikel hiburan dari gosip artis nasional dan internasional terkini di Indonesia`,
        keywords: `berita hiburan, artikel hiburan`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_NEWS-min.png`
    },
    trending_travel: {
        title: `Berita Travel, Pariwisata, Kuliner Kekinian Hari Ini - ${SITE_NAME_NEWS}`,
        description: `Kumpulan berita travel, wisata, liburan, promosi, pesawat, hotel, dan kuliner terbaru hari ini dari berbagai sumber terpercaya`,
        keywords: `berita travel, berita wisata, berita pariwisata, destinasi wisata, tempat liburan, promosi, pesawat, hotel, wisata kuliner`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_NEWS-min.png`
    },
    trending_gaya_hidup: {
        title: `Informasi Gaya Hidup, Lifestyle, dan Fashion Terkini - ${SITE_NAME_NEWS}`,
        description: `Kumpulan berita dan artikel gaya hidup, lifestyle, dan fashional dari artis serta publik figure nasional dan internasional terkini di Indonesia`,
        keywords: `berita lifestyle, berita gaya hidup, lifestyle`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_NEWS-min.png`
    },
    trending_olahraga: {
        title: `Berita Olahraga Nasional dan Internasional Terupdate - ${SITE_NAME_NEWS}`,
        description: `Kumpulan berita dan artikel olahraga nasional dan internasional terkini di Indonesia, mulai dari bola, motogp, bulu tangkis, futsal, hingga catur`,
        keywords: `berita bola, berita olahraga, bola`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_NEWS-min.png`
    },
    trending_olah_raga: {
        title: `Berita Dunia Olahraga Nasional dan Internasional Terupdate - ${SITE_NAME}`,
        description: `Baca kumpulan berita dan artikel olahraga nasional dan internasional terkini di Indonesia, mulai dari sepak bola, motogp, F1, bulu tangkis, futsal, fakta, gosip hingga catur terbaru hari ini eksklusif hanya di rctiplus.com`,
        keywords: `berita bola, berita olahraga, bola, informasi olahraga, berita olahraga, berita olahraga terbaru, berita olahraga terlengkap, klasemen sepakbola, jadwal pertandingan, hasil pertandingan, fakta olahraga, gosip olahraga, sepakbola, tenis, bulutangkis, formula 1, moto gp, basket`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_NEWS-min.png`
    },
    trending_kesehatan: {
        title: `Berita Terkini Dunia Kesehatan dari Sumber Terpercaya - ${SITE_NAME_NEWS}`,
        description: `Kumpulan berita, artikel dan tips kesehatan terpercaya, mulai dari diet, olahraga, parenting, penyakit, obat hingga seks`,
        keywords: `berita kesehatan, artikel kesehatan, tips kesehatan`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_NEWS-min.png`
    },
    trending_bisnis: {
        title: `Info Berita Bisnis Terkini Nasional dan Dunia - ${SITE_NAME_NEWS}`,
        description: `Kumpulan berita, artikel dan tips terhangat seputar bisnis, finansial, investasi, dan ekonomi, UKM nasional dan internasional terkini di Indonesia`,
        keywords: `berita bisnis, kabar bisnis hari ini, berita bisnis terbaru`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_NEWS-min.png`
    },
    trending_otomotif: {
        title: `Berita Otomotif Mobil dan Motor Terbaru Hari Ini - ${SITE_NAME_NEWS}`,
        description: `Baca kumpulan berita, artikel highlight, informasi, event, modifikasi, konsultasi, komunitas, review dan foto nasional dan internasional terkini di Indonesia eksklusif hanya di rctiplus.com`,
        keywords: `rctiplus otomotif, berita otomotif, berita otomotif terbaru, otomotif, highlight otomotif, event otomotif, tips & tricks otomotif, modifikasi otomotif, konsultasi otomotif, komunitas otomotif, test review otomotif, foto otomotif dan video otomotif`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_NEWS-min.png`
    },
    trending_muslim: {
        title: `Berita Dunia Islam Terkini dan Terupdate Hari Ini - ${SITE_NAME_NEWS}`,
        description: `Baca berita seputar dunia Islam seperti al-quraan digital, tanya jawab ustad tips muslim, Halal Food,Fashion hijab, terupdate dan religi terbaru hari ini dari berbagai sumber terpercaya dan teraktual`,
        keywords: `berita muslim, kabar muslim, berita harian muslim, Muslim, Berita Muslim, kabar Muslim, Muslim hari ini, berita harian Muslim, tag Muslim, arsip Muslim, indeks Muslim, Muslim terkini, Muslim terbaru dan viral`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_NEWS-min.png`
    },
    trending_teknologi: {
        title: `Berita Teknologi IT, Informasi Gadget dan Sains Terbaru Hari Ini - ${SITE_NAME_NEWS}`,
        description: `Kumpulan berita harian teknologi, aplikasi, game, sains, smartphone, internet, software, hardware, dan gadget terbaru hari ini dari berbagai sumber terpercaya`,
        keywords: `teknologi informasi, berita teknologi, berita teknologi gadget, berita tekno, teknologi, teknologi terbaru, teknologi terkini, berita gadget, berita game, berita start-up, start-up, gadget terbaru, berita fotografi, berita aplikasi mobile, review gadget, review aplikasi, review game, review notebook terviral`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_NEWS-min.png`
    },
    trending_nasional: {
        title: `Berita Nasional Indonesia Terbaru Hari Ini - ${SITE_NAME_NEWS}`,
        description: `Kumpulan berita nasional hari ini eksklusif hanya di rctiplus.com dari berbagai kanal`,
        keywords: `informasi, berita terbaru, politik, kriminal, hukum, peristiwa, berita hari ini, Indonesia, nasional terviral`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_NEWS-min.png`
    },
    trending_global: {
        title: `Berita Global dan Isu Internasional Terbaru Hari Ini - ${SITE_NAME_NEWS}`,
        description: `Baca kumpulan berita global, internasional baik peristiwa kecelakaan, kriminal, hukum, berita unik, politik, dan liputan khusus hari ini eksklusif hanya di rctiplus.com`,
        keywords: `iberita global informasi kecelakaan ,berita hari ini, politik, kriminal, hukum, peristiwa, terupdate, liputan khusus, Indonesia, Internasional, terbaru, `,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_NEWS-min.png`
    },
    trending_ekonomi: {
        title: `Berita Ekonomi Bisnis, dan InvestasiTerbaru Hari Ini - ${SITE_NAME_NEWS}`,
        description: `Baca Berita dan Informasi Terbaru Hari ini Bisnis, Finansial, Ekonomi, Perbankan, Investasi, Market Research, Keuangan, UMKM, ekonomi makro terbaru hari ini eksklusif hanya di rctiplus.com `,
        keywords: `berita ekonomi, berita ekonomi hari ini, Berita Bisnis dan Ekonomi, Bisnis, Finansial, Ekonomi, Perbankan, Investasi, Market Research, Keuangan, terbaru, berita bisnis, berita Finance, berita investasi, berita keuangan, berita finansial`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_NEWS-min.png`
    },
    trending_seleb: {
        title: `Berita Selebritis dan Gosip  Berita, Foto, Video TerHOT di Indonesia dan Dunia Terbaru - ${SITE_NAME_NEWS}`,
        description: `Baca Info berita selebritis gosip, foto, video terHot di dunia di berbagai industri, meliputi film, musik, dan hiburan terbaru hari ini eksklusif hanya di rctiplus.com`,
        keywords: `berita selebritis, hot, selebriti, artis, foto, video, entertainment, showbiz`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_NEWS-min.png`
    },
    trending_gaya_hidup: {
        title: `Informasi Gaya Hidup, Lifestyle, dan Fashion Terkini - ${SITE_NAME_NEWS}`,
        description: `Baca kumpulan berita dan artikel gaya hidup, lifestyle, fashional, kesehatan, travel keluarga dari artis serta publik figure nasional dan internasional terkini di Indonesia eksklusif hanya di rctiplus.com `,
        keywords: `berita lifestyle, berita gaya hidup, lifestyle, lifestyle rctiplus, berita lifestyle, berita gaya hidup, panduan wisata, tour dan travel, tips wirausaha, menu masakan kuliner, voucher belanja, promo produk, dekorasi`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_NEWS-min.png`
    },
    explore_for_you: {
        title: `Nonton Streaming Film Drama Sub Indo, Serial, Sinetron - ${SITE_NAME}`,
        description: `Nonton kumpulan for you program, sinetron dan acara TV RCTI, MNCTV, GTV, iNews TV terbaru full episode tanpa buffering hanya di RCTI+`,
        keywords: `film sub indo, nonton film, nonton film indonesia, nonton drama korea, nonton sinetron, kumpulan ftv, drama, Realilty Show, Special Event, Variety Show, Sport Hightlight, Music, Talet Search, Match, Documentary, Hard News, Infotainment, Animation, Kids Entertainment, Comedy, Skill / Hobbies, Travel, Action, Horror, Game Show, Sitcom Comedy, Pearch Dialog, Trailer, Talkshow, Crime, TV Magazine, Edutaiment, Sport Hightlight, Quiz, Kids Game Show, Series, Exercise, Light Entertainement, drama indonesia, sinetron indonesia`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_talent_search: {
        title: `Nonton Streaming Film Talent Search Sub Indo Gratis Terlengkap di Indonesia - ${SITE_NAME}`,
        description: `Nonton video ajang pencarian bakat nyanyi, sulap, atraksi dan lainnya terpopuler di Indonesia tanpa buffering hanya di RCTI+`,
        keywords: `Nonton talent search, acara talent search, streaming talent search`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_drama: {
        title: `Nonton Streaming Film Drama Sub Indo Gratis Terlengkap di Indonesia - ${SITE_NAME}`,
        description: `Nonton kumpulan drama program, sinetron dan acara TV RCTI, MNCTV, GTV, iNews TV terbaru full episode tanpa buffering hanya di RCTI+`,
        keywords: `Drama, nonton drama, sinetron, drama tv, streaming drama, sinetron indonesia, drama korea, drakor`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'Drama di RCTIPlus'
    },
    explore_special_event: {
        title: `Nonton Streaming Film Special Event Sub Indo Gratis Terlengkap di Indonesia - ${SITE_NAME}`,
        description: `Nonton kumpulan special event program, sinetron dan acara TV RCTI, MNCTV, GTV, iNews TV terbaru full episode tanpa buffering hanya di RCTI+`,
        keywords: `special events, nonton special event, live event, acara spesial, special show`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'Special Event di RCTIPlus'
    },
    explore_sport: {
        title: `Nonton Bola dan Video Olahraga Lainnya Terbaru - ${SITE_NAME}`,
        description: `Nonton bola online dan highlight olahraga lainnya paling lengkap dan terupdate liga Champion, Inggris, Italia, Indonesia dan lainnya hanya di RCTI+`,
        keywords: `Nonton sport, acara sport, streaming sport`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_animation: {
        title: `Nonton Film Kartun Lucu dan Program TV Anak Lainnya - ${SITE_NAME}`,
        description: `Nonton tayangan program dan acara kartun animasi, kartun anak lucu dan paling baru hanya di RCTI+`,
        keywords: `kartun, film kartun, kartun anak, film anak`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_entertainment: {
        title: `Nonton Gosip dan Hiburan Dunia Artis Terbaru - ${SITE_NAME}`,
        description: `Nonton gosip, hiburan dan entertainment online dari artis top dunia dan Indonesia paling lengkap dan tanpa buffering hanya di RCTI+`,
        keywords: `Nonton entertaiment, acara entertaiment, streaming entertaiment`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_variety_music: {
        title: `Nonton Video Musik Lengkap dan Terbaru - ${SITE_NAME}`,
        description: `Nonton video dan acara musik terbaru dan terkini lagi viral nasional dan internasional gratis tanpa buffering hanya di RCTI+`,
        keywords: `video musik, acara musik, program musik`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_comedy: {
        title: `Nonton Streaming Film Comedy Sub Indo Gratis Terlengkap di Indonesia - ${SITE_NAME}`,
        description: `Nonton kumpulan Comedy program, sinetron dan acara TV RCTI, MNCTV, GTV, iNews TV terbaru full episode tanpa buffering hanya di RCTI+`,
        keywords: `Nonton comedy, acara comedy, streaming comedy`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'Comedy di RCTIPlus'
    },
    explore_sitcom: {
        title: `Nonton Streaming Film Sitcom Sub Indo Gratis Terlengkap di Indonesia - ${SITE_NAME}`,
        description: `Nonton kumpulan sitcom program, sinetron dan acara TV RCTI, MNCTV, GTV, iNews TV terbaru full episode tanpa buffering hanya di RCTI+`,
        keywords: `watch sitcom tv shows online, sitcom tv streaming, stream sitcom tv shows online`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'Sitcom Comedy di RCTIPlus'
    },
    explore_misteri: {
        title: `Nonton Program Misteri Horor Paling Seram Terbaru - ${SITE_NAME}`,
        description: `Nonton acara horor, misteri, mitos untuk menguak semua pengalaman mengerikan hanya di RCTI+`,
        keywords: `video horor, acara horor, program horor, film horor`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_movie: {
        title: `Nonton Film, Drama dan Serial Favorit Terbaru - ${SITE_NAME}`,
        description: `Nonton film Indonesia online, drama korea, jepang, barat, dan bollywood terbaru. Pilih dan tonton online favoritmu hanya di RCTI+`,
        keywords: `nonton film online, nonton film streaming, nonton drakor, nonton movie online`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_ftv: {
        title: `Nonton Sinetron FTV Romantis Terbaru - ${SITE_NAME}`,
        description: `Nonton FTV, sinetron, dan acara TV paling menarik untuk menemani hari-harimu. Lihat selengkapnya hanya di RCTI+`,
        keywords: `ftv, nonton ftv, nonton sinetron, sinetron`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_religious: {
        title: `Nonton Program Religi dan Sinetron Religi Terbaru - ${SITE_NAME}`,
        description: `Nonton film religi, azab, dan program siraman rohani terupdate, lengkap dan tidak membosankan tanpa buffering hanya di RCTI+`,
        keywords: `film religi, nonton film religi`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_game_show: {
        title: `Nonton Tayangan Program Reality Show Terbaru - ${SITE_NAME}`,
        description: `Nonton reality show terbaik di RCTI, MNC TV, GTV dan iNews full episode tanpa buffering hanya di RCTI+`,
        keywords: `Nonton game show, acara game show, streaming game show`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_infotainment: {
        title: `Saksikan Program Infotainment dan Gosip Artis Terbaru dan Teraktual - ${SITE_NAME}`,
        description: `Nonton gosip infotainment artis top paling update dan seru untuk ditonton terkait gaya hidup, kasus, perjalanan karir dan lainnya hanya di RCTI+`,
        keywords: `kabar artis, kabar artis terbaru`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_information: {
        title: `Tayangan Berita dan Informasi Terbaru dari Berbagai Kanal - ${SITE_NAME}`,
        description: `Nonton berita peristiwa, bola, kriminal, travel, teknologi paling update dan terkini tanpa buffering hanya di RCTI+`,
        keywords: `berita paling update`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_reality_show: {
        title: `Tayangan Berita dan Informasi Terbaru dari Berbagai Kanal - ${SITE_NAME}`,
        description: `Nonton berita peristiwa, bola, kriminal, travel, teknologi paling update dan terkini tanpa buffering hanya di RCTI+`,
        keywords: `reality show, reality show korea, acara reality show, nonton reality show, streaming reality show`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_sport_highlights: {
        title: `Tayangan Berita dan Informasi Terbaru dari Berbagai Kanal - ${SITE_NAME}`,
        description: `Nonton berita peristiwa, bola, kriminal, travel, teknologi paling update dan terkini tanpa buffering hanya di RCTI+`,
        keywords: `Nonton sport highlights, acara sport highlights, streaming sport highlights`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_music: {
        title: `Tayangan Berita dan Informasi Terbaru dari Berbagai Kanal - ${SITE_NAME}`,
        description: `Nonton berita peristiwa, bola, kriminal, travel, teknologi paling update dan terkini tanpa buffering hanya di RCTI+`,
        keywords: `Nonton music, acara music, streaming music`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_match: {
        title: `Tayangan Berita dan Informasi Terbaru dari Berbagai Kanal - ${SITE_NAME}`,
        description: `Nonton berita peristiwa, bola, kriminal, travel, teknologi paling update dan terkini tanpa buffering hanya di RCTI+`,
        keywords: `Nonton match, acara match, streaming match`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_documentary: {
        title: `Tayangan Berita dan Informasi Terbaru dari Berbagai Kanal - ${SITE_NAME}`,
        description: `Nonton berita peristiwa, bola, kriminal, travel, teknologi paling update dan terkini tanpa buffering hanya di RCTI+`,
        keywords: `Nonton documentary, acara documentary, streaming documentary`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_hard_news: {
        title: `Tayangan Berita dan Informasi Terbaru dari Berbagai Kanal - ${SITE_NAME}`,
        description: `Nonton berita peristiwa, bola, kriminal, travel, teknologi paling update dan terkini tanpa buffering hanya di RCTI+`,
        keywords: `Nonton hard news, acara hard news, streaming hard news`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_travel: {
        title: `Tayangan Berita dan Informasi Terbaru dari Berbagai Kanal - ${SITE_NAME}`,
        description: `Nonton berita peristiwa, bola, kriminal, travel, teknologi paling update dan terkini tanpa buffering hanya di RCTI+`,
        keywords: `Nonton travel, acara travel, streaming travel`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_action: {
        title: `Tayangan Berita dan Informasi Terbaru dari Berbagai Kanal - ${SITE_NAME}`,
        description: `Nonton berita peristiwa, bola, kriminal, travel, teknologi paling update dan terkini tanpa buffering hanya di RCTI+`,
        keywords: `Nonton action, acara action, streaming action`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_horror: {
        title: `Tayangan Berita dan Informasi Terbaru dari Berbagai Kanal - ${SITE_NAME}`,
        description: `Nonton berita peristiwa, bola, kriminal, travel, teknologi paling update dan terkini tanpa buffering hanya di RCTI+`,
        keywords: `Nonton horror, acara horror, streaming horror`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_trailer: {
        title: `Tayangan Berita dan Informasi Terbaru dari Berbagai Kanal - ${SITE_NAME}`,
        description: `Nonton berita peristiwa, bola, kriminal, travel, teknologi paling update dan terkini tanpa buffering hanya di RCTI+`,
        keywords: `Nonton trailer, acara trailer, streaming trailer`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_talkshow: {
        title: `Tayangan Berita dan Informasi Terbaru dari Berbagai Kanal - ${SITE_NAME}`,
        description: `Nonton berita peristiwa, bola, kriminal, travel, teknologi paling update dan terkini tanpa buffering hanya di RCTI+`,
        keywords: `Nonton talkshow, acara talkshow, streaming talkshow`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_crime: {
        title: `Tayangan Berita dan Informasi Terbaru dari Berbagai Kanal - ${SITE_NAME}`,
        description: `Nonton berita peristiwa, bola, kriminal, travel, teknologi paling update dan terkini tanpa buffering hanya di RCTI+`,
        keywords: `Nonton crime, acara crime, streaming crime`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_tv_magazine: {
        title: `Tayangan Berita dan Informasi Terbaru dari Berbagai Kanal - ${SITE_NAME}`,
        description: `Nonton berita peristiwa, bola, kriminal, travel, teknologi paling update dan terkini tanpa buffering hanya di RCTI+`,
        keywords: `Nonton tv magazine, acara tv magazine, streaming tv magazine`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_quiz: {
        title: `Tayangan Berita dan Informasi Terbaru dari Berbagai Kanal - ${SITE_NAME}`,
        description: `Nonton berita peristiwa, bola, kriminal, travel, teknologi paling update dan terkini tanpa buffering hanya di RCTI+`,
        keywords: `Nonton quiz, acara quiz, streaming quiz`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_kids_game_show: {
        title: `Tayangan Berita dan Informasi Terbaru dari Berbagai Kanal - ${SITE_NAME}`,
        description: `Nonton berita peristiwa, bola, kriminal, travel, teknologi paling update dan terkini tanpa buffering hanya di RCTI+`,
        keywords: `Nonton kids game show, acara kids game show, streaming kids game show`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_series: {
        title: `Tayangan Berita dan Informasi Terbaru dari Berbagai Kanal - ${SITE_NAME}`,
        description: `Nonton berita peristiwa, bola, kriminal, travel, teknologi paling update dan terkini tanpa buffering hanya di RCTI+`,
        keywords: `Nonton series, acara series, streaming series`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_exercise: {
        title: `Tayangan Berita dan Informasi Terbaru dari Berbagai Kanal - ${SITE_NAME}`,
        description: `Nonton berita peristiwa, bola, kriminal, travel, teknologi paling update dan terkini tanpa buffering hanya di RCTI+`,
        keywords: `Nonton exercise, acara exercise, streaming exercise`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_light_entertainment: {
        title: `Tayangan Berita dan Informasi Terbaru dari Berbagai Kanal - ${SITE_NAME}`,
        description: `Nonton berita peristiwa, bola, kriminal, travel, teknologi paling update dan terkini tanpa buffering hanya di RCTI+`,
        keywords: `Nonton light entertainment, acara light entertainment, streaming light entertainment`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    ['explore_sitcom/comedy']: {
        title: `Tayangan Berita dan Informasi Terbaru dari Berbagai Kanal - ${SITE_NAME}`,
        description: `Nonton berita peristiwa, bola, kriminal, travel, teknologi paling update dan terkini tanpa buffering hanya di RCTI+`,
        keywords: `Nonton sitcom/comedy, acara sitcom/comedy, streaming sitcom/comedy`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    ['explore_preach/dialog']: {
        title: `Tayangan Berita dan Informasi Terbaru dari Berbagai Kanal - ${SITE_NAME}`,
        description: `Nonton berita peristiwa, bola, kriminal, travel, teknologi paling update dan terkini tanpa buffering hanya di RCTI+`,
        keywords: `Nonton preach/dialog, acara preach/dialog, streaming preach/dialog`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    topic_tagar: {
        title: `Daftar Tagar Terpopular dan Terbaru Hari ini - ${SITE_NAME}`,
        description: `Kumpulan berita, artikel dan tips terhangat seputar otomotif, motor dan mobil nasional dan internasional terkini di Indonesia`,
        keywords: `tagar`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_NEWS-min.png`
    }
};
