import { isIOS, isAndroid } from "react-device-detect";

export const BASE_URL = process.env.BASE_URL;

export const FE = process.env.FE;
export const VERSION = process.env.VERSION;

export const API = process.env.API;

export const GTM = process.env.GTM;

// export const GTM_AUTH = process.env.GTM_AUTH;

export const DEV_API = process.env.DEV_API;

export const CHAT_API = process.env.CHAT_API;
export const LINK_RADIO = process.env.LINK_RADIO;
export const LINK_GAMES = process.env.LINK_GAMES;
export const LINK_HOT = process.env.LINK_HOT;

export const REDIRECT_WEB_DESKTOP = process.env.REDIRECT_WEB_DESKTOP;
export const SHARE_BASE_URL = process.env.SHARE_BASE_URL;
export const RESOLUTION_IMG = process.env.RESOLUTION_IMG;

// export const API = 'https://api.rctiplus.com';

// export const DEV_API = 'https://dev-api.rctiplus.com';

export const NEWS_API = process.env.NEWS_API;
export const NEWS_API_V2 = process.env.NEWS_API_V2;
// export const NEWS_API = 'https://api-v2.rctiplus.com/news';
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

export const GPT_ID_LIST = process.env.GPT_ID_LIST

export const GPT_ID_DETAIL = process.env.GPT_ID_DETAIL

export const REDIRECT_SSR = process.env.REDIRECT_SSR;

export const CONVIVA_TRACKING_KEY = process.env.CONVIVA_TRACKING_KEY;
export const CONVIVA_TRACKING_HOST = process.env.CONVIVA_TRACKING_HOST;

export const VISITOR_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2aWQiOjAsInRva2VuIjoiNWRhNmE2ODY2ZTg5N2Q0MSIsInBsIjoibXdlYiIsImRldmljZV9pZCI6IjY5NDIwIn0.rOdLG9s4KFcKcQT8n58RaD8MgnAclnS13z4GOcJaJ5I';
export const NEWS_TOKEN = '';
export const IS_SHOWN = true;


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
        description: 'Satu aplikasi, semua hiburan mulai dari live streaming program RCTI, MNCTV, GTV & iNews TV. Menyajikan konten eksklusif yang tidak tayang di TV & Informasi Trending Terupdate, dengar radio dan podcast favorit, menonton aksi talent terbaik, dan main games juga',
        keywords: `rctiplus, rcti plus, rcti+, rcti, mnctv, gtv, inews,hot, home of talent, games, news, radio, podcast, baca berita`,
        image: `https://rctiplus.com/assets/image/elements/logo.b9f35229.png`
    },
    terms_and_conditions: {
        title: `Halaman Terms and Conditions - ${SITE_NAME}`,
        description: `Untuk menggunakan layanan RCTI+, Anda harus mengikuti syarat dan ketentuan yang berlaku`,
        keywords: `layanan rctiplus, layanan rcti+, rctiplus`,
        image: `https://rctiplus.com/assets/image/elements/logo.b9f35229.png`
    },
    privacy_policy: {
        title: `Halaman Privacy Policy - ${SITE_NAME}`,
        description: `Kebijakan privasi ini menjelaskan teknik dan proses kerja kami tentang informasi yang terkumpul melalui layanan internet, mobile, aplikasi dan widget pada RCTI+`,
        keywords: `privasi rctiplus, privasi rcti+, rctiplus`,
        image: `https://rctiplus.com/assets/image/elements/logo.b9f35229.png`
    },
    contact_us: {
        title: `Hubungi Kami - ${SITE_NAME}`,
        description: `Hubungi kami terkait informasi, kebijakan privasi, serta syarat dan ketentuan yang ada di RCTI+ melalui halaman ini`,
        keywords: `hubungi rctiplus, hubungi rcti+, rctiplus`,
        image: `https://rctiplus.com/assets/image/elements/logo.b9f35229.png`
    },
    faq: {
        title: `Halaman Frequently Asked Questions - ${SITE_NAME}`,
        description: `Pertanyaan yang paling sering diajukan terkait informasi penggunaan dan program tayangan di RCTI+ beserta jawabannya`,
        keywords: `faq rctiplus, faq rcti+, cara pakai rctiplus, rctiplus`,
        image: `https://rctiplus.com/assets/image/elements/logo.b9f35229.png`
    },
    register: {
        title: `Halaman Sign Up / Pendaftaran Akun - ${SITE_NAME}`,
        description: `Tempat pendaftaran / register akun di RCTI+. Buruan register sekarang, gratis streaming online sepuasnya`,
        keywords: `register rctiplus, register rcti+, daftar rctiplus, rctiplus`,
        image: `https://rctiplus.com/assets/image/elements/logo.b9f35229.png`
    },
    login: {
        title: `Halaman Login Akun - ${SITE_NAME}`,
        description: `Tempat login akun dan nonton tayangan streaming tv online gratis di RCTI+`,
        keywords: `login rctiplus, login rcti+, masuk rctiplus, rctiplus`,
        image: `https://rctiplus.com/assets/image/elements/logo.b9f35229.png`
    },
    interest: {
        title: `Pilih Kategori Program Favorit Kamu - ${SITE_NAME}`,
        description: `Sesuaikan program dan kategori favorit kamu di dalam aplikasi RCTI+`,
        keywords: `rctiplus, rcti+`,
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
        description: `Profile user untuk melanjutkan video yang belum selesai ditonton`,
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
        keywords: `tayangan tv`,
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
        keywords: `video lucu, video lucu artis`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Exclusive%20Content-min.png`
    },
    exclusive_behind_the_scenes: {
        title: `Cuplikan Behind the Scenes Eksklusif Hanya di RCTI+ - ${SITE_NAME}`,
        description: `Nonton behind the scenes, cuplikan lucu program dan acara TV RCTI, MNC, GTV, iNews Online Indonesia`,
        keywords: `behind the scene rcti, behind the scene mnc, behind the scene inews, behind the scene gtv, behind the scene`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Exclusive%20Content-min.png`
    },
    live_tv_rcti: {
        title: `Live Streaming RCTI Hari Ini - TV Online Indonesia - ${SITE_NAME}`,
        description: `Nonton live streaming RCTI online hari ini tanpa buffering untuk semua program dan acara favorit yang tayang setiap hari. Dapatkan juga jadwal acara RCTI terbaru hanya di RCTI+`,
        keywords: `streaming rcti, live streaming rcti, rcti live, rcti streaming, rcti live streaming`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_RCTI-min.png`,
    },
    live_tv_mnctv: {
        title: `Live Streaming MNC TV Hari Ini | TV Online Indonesia - ${SITE_NAME}`,
        description: `Nonton live streaming MNC TV online hari ini tanpa buffering untuk semua program dan acara favorit yang tayang setiap hari. Dapatkan juga jadwal acara MNC TV terbaru hanya di RCTI+`,
        keywords: `mnctv, live streaming mnctv sekarang, mnctv online, tv mnctv, tv bersama mnctv`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_MNCTV-min.png`
    },
    live_tv_globaltv: {
        title: `Live Streaming Global TV (GTV) Hari Ini | TV Online Indonesia - ${SITE_NAME}`,
        description: `Nonton live streaming GTV online hari ini tanpa buffering untuk semua program dan acara favorit yang tayang setiap hari. Dapatkan juga jadwal acara Global TV terbaru hanya di RCTI+`,
        keywords: `global tv, gtv jadwal, tv bersama gtv, live streaming gtv sekarang, siaran langsung gtv`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_GTV-min.png`
    },
    live_tv_gtv: {
        title: `Live Streaming Global TV (GTV) Hari Ini | TV Online Indonesia - ${SITE_NAME}`,
        description: `Nonton live streaming GTV online hari ini tanpa buffering untuk semua program dan acara favorit yang tayang setiap hari. Dapatkan juga jadwal acara Global TV terbaru hanya di RCTI+`,
        keywords: `global tv, gtv jadwal, tv bersama gtv, live streaming gtv sekarang, siaran langsung gtv`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_GTV-min.png`
    },
    live_tv_inews: {
        title: `Live Streaming iNews Hari Ini | TV Online Indonesia - ${SITE_NAME}`,
        description: `Nonton live streaming iNews online hari ini tanpa buffering untuk semua program dan berita favorit yang tayang setiap hari. Dapatkan juga jadwal berita RCTI terbaru hanya di RCTI+`,
        keywords: `berita inews, inews, streaming inews, berita inews tv terbaru, inews terkini`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_INEWS-min.png`
    },
    live_event_index: {
        title: `Streaming Live Event TV Online Indonesia - ${SITE_NAME}`,
        description: `Nonton live streaming tv online Indonesia berbagai event menarik eksklusif hanya di RCTI+, mulai dari bola, entertainment, musik dan lainnya`,
        keywords: `rctiplus, tv online indonesia`,
        image: 'https://rctiplus.com/assets/image/elements/logo.b9f35229.png',
    },
    missed_event_index: {
        title: `Tonton Tayangan Ulang Streaming Live Event TV Online Indonesia - ${SITE_NAME}`,
        description: `Nonton tayangan ulang live streaming tv online Indonesia berbagai event menarik eksklusif hanya di RCTI+, mulai dari bola, entertainment, musik dan lainnya`,
        keywords: `rctiplus, tv online indonesia`,
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
        title: `Streaming Film, Serial, dan Program Lain di RCTI, MNCTV, GTV, iNews TV - ${SITE_NAME}`,
        description: `Nonton kumpulan program, sinetron dan acara TV RCTI, MNCTV, GTV, iNews TV terbaru full episode tanpa buffering hanya di RCTI+`,
        keywords: `film sub indo, Nonton film, nonton film indonesia,  nonton drama korea, cinemaindo, drama, Realilty Show, Special Event, Variety Show, Sport Hightlight, Music, Talet Search, Match, Documentary, Hard News, Infotainment, Animation, Kids Entertainment, Comedy, Skill / Hobbies, Travel, Action, Horror, Game Show, Sitcom Comedy, Pearch Dialog, Trailer, Talkshow, Crime, TV Magazine, Edutaiment, Sport Hightlight, Quiz, Kids Game Show, Series, Exercise, Light Entertainement, drama indonesia, sinetron indonesia`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_talent_search: {
        title: `Nonton Streaming Film Talent Search Sub Indo Gratis Terlengkap di Indonesia - ${SITE_NAME}`,
        description: `Nonton video ajang pencarian bakat nyanyi, sulap, atraksi dan lainnya terpopuler di Indonesia tanpa buffering hanya di RCTI+`,
        keywords: `watch talent search tv shows online, talent search tv streaming, stream talent search tv shows online`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_drama: {
        title: `Nonton Streaming Film Drama Sub Indo Gratis Terlengkap di Indonesia - ${SITE_NAME}`,
        description: `Nonton kumpulan drama program, sinetron dan acara TV RCTI, MNCTV, GTV, iNews TV terbaru full episode tanpa buffering hanya di RCTI+`,
        keywords: `watch Drama tv shows online, Drama tv streaming, stream Drama tv shows online, sinetron indonesia, drama korea, drakor`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'Drama di RCTIPlus'
    },
    explore_special_event: {
        title: `Nonton Streaming Film Special Event Sub Indo Gratis Terlengkap di Indonesia - ${SITE_NAME}`,
        description: `Nonton kumpulan special event program, sinetron dan acara TV RCTI, MNCTV, GTV, iNews TV terbaru full episode tanpa buffering hanya di RCTI+`,
        keywords: `nonton watch special event, event live, show special online`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'Special Event di RCTIPlus'
    },
    explore_sport: {
        title: `Nonton Bola dan Video Olahraga Lainnya Terbaru - ${SITE_NAME}`,
        description: `Nonton bola online dan highlight olahraga lainnya paling lengkap dan terupdate liga Champion, Inggris, Italia, Indonesia dan lainnya hanya di RCTI+`,
        keywords: `nonton bola`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_animation: {
        title: `Nonton Film Kartun Lucu dan Program TV Anak Lainnya - ${SITE_NAME}`,
        description: `Nonton tayangan program dan acara kartun animasi, kartun anak lucu dan paling baru hanya di RCTI+`,
        keywords: `film kartun, film kartun lucu, film kartun anak`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_Explore%20Program-min.png`,
        twitter_img_alt: 'ExploreRCTIPlus'
    },
    explore_entertainment: {
        title: `Nonton Gosip dan Hiburan Dunia Artis Terbaru - ${SITE_NAME}`,
        description: `Nonton gosip, hiburan dan entertainment online dari artis top dunia dan Indonesia paling lengkap dan tanpa buffering hanya di RCTI+`,
        keywords: `gosip artis, gosip artis terbaru`,
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
        keywords: `watch comedy tv shows online, comedy tv streaming, stream comedy tv shows online`,
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
        keywords: `reality show, program tv, program tv hari ini`,
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
    topic_tagar: {
        title: `Daftar Tagar Terpopular dan Terbaru Hari ini - ${SITE_NAME}`,
        description: `Kumpulan berita, artikel dan tips terhangat seputar otomotif, motor dan mobil nasional dan internasional terkini di Indonesia`,
        keywords: `tagar`,
        image: `https://static.rctiplus.id/assets/metaimages/MetaCover_NEWS-min.png`
    }
};