// https://medium.com/@bhavikbamania/a-beginner-guide-for-redux-with-next-js-4d018e1342b2
import ax from 'axios';
export const BASE_URL = 'http://localhost:3000';

export const FE = 'https://rc-rctiplus.com';
export const VERSION = '0.9.2';

export const API = 'https://rc-api.rctiplus.com';

export const DEV_API = 'https://rc-api.rctiplus.com';

// export const API = 'https://api.rctiplus.com';

// export const DEV_API = 'https://dev-api.rctiplus.com';


export const NEWS_API = 'https://api-news.rctiplus.id';
export const REWARDS_API = 'https://rc-api-rewards.rctiplus.id';
export const STATIC = 'https://rc-static.rctiplus.id';

export const FIREBASE_apiKey = "AIzaSyC8qlTIK8fnlpyXGWmP9Q_J8bfcxToeKI8";
export const FIREBASE_authDomain = "rcti-dev-6a81d.firebaseapp.com";
export const FIREBASE_databaseURL = "https://rcti-dev-6a81d.firebaseio.com";
export const FIREBASE_projectId = "rcti-dev-6a81d";
export const FIREBASE_storageBucket = "rcti-dev-6a81d.appspot.com";
export const FIREBASE_messagingSenderId = "464531657599";

export const REDIRECT_SSR = 'https://dev-ssr.rctiplus.com';

export const CONVIVA_TRACKING_KEY = '25f1bbffdca1e0a4d059c0d8f802234bbb97dcf1';
export const CONVIVA_TRACKING_HOST = 'mnc-test.testonly.conviva.com';

export const VISITOR_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2aWQiOjAsInRva2VuIjoiZmUyZWMwM2E5ZTliYTUxYiIsInBsIjoid2ViIn0.5bAp_UT0o8DfAxx5UAQDG5U-mc0ZjxxdKivuA7Y3v_g';
export const NEWS_TOKEN = '';
export const IS_SHOWN = true;


// SEO CONSTANTS

export const AUTHOR = 'RCTI+';
export const VIEWPORT = 'initial-scale=1.0, width=device-width, user-scalable=no';
export const MAIN_DESCRIPTION = 'Live Streaming Program RCTI, MNCTV, GTV & iNews. Menyajikan konten ekslusif yang tidak tayang di TV & Informasi Trending Terupdate. Nonton Gak Monoton di RCTI+.';
export const MAIN_TITLE = 'RCTI+ - Live Streaming Program 4 TV Terpopuler';
export const OPEN_GRAPH = {
    type: 'article',
    url: 'https://m2.rctiplus.com',
    image: 'https://www.rcti.tv/img/favicon.png',
    site_name: 'm2.rctiplus.com'
};

export const SITE_NAME = 'RCTI+';
export const SITEMAP = {
    home: {
        title: `${SITE_NAME} - Live Streaming Program 4 TV Terpopuler`,
        description: `Live Streaming Program RCTI, MNCTV, GTV & iNews. Menyajikan konten eksklusif yang tidak tayang di TV & Informasi Trending Terupdate. Nonton Gak Monoton di RCTI+.`,
        keywords: `rctiplus, rcti plus, rcti+`
    },
    terms_and_conditions: {
        title: `Halaman Terms and Conditions - ${SITE_NAME}`,
        description: `Untuk menggunakan layanan RCTI+, Anda harus mengikuti syarat dan ketentuan yang berlaku`,
        keywords: `layanan rctiplus, layanan rcti+, rctiplus`
    },
    privacy_policy: {
        title: `Halaman Privacy Policy - ${SITE_NAME}`,
        description: `Kebijakan privasi ini menjelaskan teknik dan proses kerja kami tentang informasi yang terkumpul melalui layanan internet, mobile, aplikasi dan widget pada RCTI+`,
        keywords: `privasi rctiplus, privasi rcti+, rctiplus`
    },
    contact_us: {
        title: `Hubungi Kami - ${SITE_NAME}`,
        description: `Hubungi kami terkait informasi, kebijakan privasi, serta syarat dan ketentuan yang ada di RCTI+ melalui halaman ini`,
        keywords: `hubungi rctiplus, hubungi rcti+, rctiplus`
    },
    faq: {
        title: `Halaman Frequently Asked Questions - ${SITE_NAME}`,
        description: `Pertanyaan yang paling sering diajukan terkait informasi penggunaan dan program tayangan di RCTI+ beserta jawabannya`,
        keywords: `faq rctiplus, faq rcti+, cara pakai rctiplus, rctiplus`
    },
    register: {
        title: `Halaman Sign Up / Pendaftaran Akun - ${SITE_NAME}`,
        description: `Tempat pendaftaran / register akun di RCTI+. Buruan register sekarang, gratis streaming online sepuasnya`,
        keywords: `register rctiplus, register rcti+, daftar rctiplus, rctiplus`
    },
    login: {
        title: `Halaman Login Akun - ${SITE_NAME}`,
        description: `Tempat login akun dan nonton tayangan streaming tv online gratis di RCTI+`,
        keywords: `login rctiplus, login rcti+, masuk rctiplus, rctiplus`
    },
    exclusive_all: {
        title: `Nonton Tayangan Menarik dan Terbaru dari RCTI, MNC, GTV, iNews - ${SITE_NAME}`,
        description: `Nonton acara dan tayangan TV terbaru favoritmu dan jangan lewatkan berita terbaru program RCTI, MNC, GTV, dan iNews eksklusif hanya di RCTI+`,
        keywords: `tayangan tv`
    },
    exclusive_clip: {
        title: `Saksikan Clip Video Menarik dan Lucu Sinetron Indonesia - ${SITE_NAME}`,
        description: `Nonton potongan video lucu, menarik dan pendek dari berbagai sinetron favorit orang Indonesia, mulai dari permasalahan ekomoni, horor, hingga romantisnya percintaan`,
        keywords: `video menarik, video lucu, video lucu pendek`
    },
    exclusive_photo: {
        title: `Kumpulan Foto Artis dan Poster Menarik Talent Indonesia - ${SITE_NAME}`,
        description: `Lihat kumpulan foto artis cantik dan ganteng dalam negeri dan luar negeri lengkap dengan posternya`,
        keywords: `foto artis, foto artis cantik, foto artis ganteng`
    },
    exclusive_entertainment: {
        title: `Nonton Video Gosip Kabar Artis Indonesia Terbaru - ${SITE_NAME}`,
        description: `Nonton gosip dan video entertainment viral terbaru dari para artis dan selebritis tanah air dan internasional yang sedang sensasional`,
        keywords: `gosip, kabar artis`
    },
    exclusive_news: {
        title: `Saksikan Berita Terkini dari Dalam Negeri dan Internasional - ${SITE_NAME}`,
        description: `Nonton berita iNews, RCTI, MNC, dan GTV online terkini terkait bisnis, ekonomi, politik, sport, teknologi, bola dan yang lainnya`,
        keywords: `berita terkini, berita inews, berita rcti, berita mnc, berita gtv`
    },
    exclusive_bloopers: {
        title: `Kumpulan Video Lucu dari Sinetron Favorit Indonesia - ${SITE_NAME}`,
        description: `Nonton video lucu pendek artis sinetron Indonesia program RCTI, MNC, GTV, dan iNews hanya di RCTI+ - Streaming video online terlengkap`,
        keywords: `video lucu, video lucu artis`
    },
    exclusive_behind_the_scenes: {
        title: `Cuplikan Behind the Scenes Eksklusif Hanya di RCTI+ - ${SITE_NAME}`,
        description: `Nonton behind the scenes, cuplikan lucu program dan acara TV RCTI, MNC, GTV, iNews Online Indonesia`,
        keywords: `behind the scene rcti, behind the scene mnc, behind the scene inews, behind the scene gtv, behind the scene`
    },
    live_tv_rcti: {
        title: `Live Streaming RCTI Hari Ini - TV Online Indonesia - ${SITE_NAME}`,
        description: `Nonton live streaming RCTI online hari ini tanpa buffering untuk semua program dan acara favorit yang tayang setiap hari. Dapatkan juga jadwal acara RCTI terbaru hanya di RCTI+`,
        keywords: `streaming rcti, live streaming rcti, rcti live, rcti streaming, rcti live streaming`
    },
    live_tv_mnctv: {
        title: `Live Streaming MNC TV Hari Ini | TV Online Indonesia - ${SITE_NAME}`,
        description: `Nonton live streaming MNC TV online hari ini tanpa buffering untuk semua program dan acara favorit yang tayang setiap hari. Dapatkan juga jadwal acara MNC TV terbaru hanya di RCTI+`,
        keywords: `mnctv, live streaming mnctv sekarang, mnctv online, tv mnctv, tv bersama mnctv`
    },
    live_tv_gtv: {
        title: `Live Streaming Global TV (GTV) Hari Ini | TV Online Indonesia - ${SITE_NAME}`,
        description: `Nonton live streaming GTV online hari ini tanpa buffering untuk semua program dan acara favorit yang tayang setiap hari. Dapatkan juga jadwal acara Global TV terbaru hanya di RCTI+`,
        keywords: `global tv, gtv jadwal, tv bersama gtv, live streaming gtv sekarang, siaran langsung gtv`
    },
    live_tv_inews: {
        title: `Live Streaming iNews Hari Ini | TV Online Indonesia - ${SITE_NAME}`,
        description: `Nonton live streaming iNews online hari ini tanpa buffering untuk semua program dan berita favorit yang tayang setiap hari. Dapatkan juga jadwal berita RCTI terbaru hanya di RCTI+`,
        keywords: `berita inews, inews, streaming inews, berita inews tv terbaru, inews terkini`
    },
    trending: {
        title: `Informasi Berita Trending dan Terkini dari Berbagai Sumber Terpercaya - ${SITE_NAME}`,
        description: `RCTI+ - Indeks portal berita trending Indonesia dan dunia hari ini dari berbagai situs terpercaya, mulai dari peristiwa, politik, hukum, ekonomi, bola, hingga gosip artis terbaru`,
        keywords: `berita trending`
    },
    trending_top: {
        title: `Informasi Berita Top Terbaru Hari ini dari Berbagai Sumber Terpercaya - ${SITE_NAME}`,
        description: `Indeks portal berita trending Indonesia dan dunia hari ini dari situs terpercaya, dari peristiwa, politik, tekno, ekonomi, bola, hingga gosip artis`,
        keywords: `berita top, berita top hari ini, berita teratas`
    },
    trending_berita_terkini: {
        title: `Berita Terkini, Viral dan Terbaru Dalam Negeri dan Internasional - ${SITE_NAME}`,
        description: `Baca berita terkini yang sedang viral dari dalam negeri dan luar yang dikumpulkan dari berbagai situs terpercaya dan teraktual`,
        keywords: `berita terkini`
    },
    trending_hiburan: {
        title: `Gosip dan Hiburan Terbaru Artis Dalam Negeri & Internasional - ${SITE_NAME}`,
        description: `Kumpulan berita dan artikel hiburan dari gosip artis nasional dan internasional terkini di Indonesia`,
        keywords: `berita hiburan, artikel hiburan`
    },
    trending_gaya_hidup: {
        title: `Informasi Gaya Hidup, Lifestyle, dan Fashion Terkini - ${SITE_NAME}`,
        description: `Kumpulan berita dan artikel gaya hidup, lifestyle, dan fashional dari artis serta publik figure nasional dan internasional terkini di Indonesia`,
        keywords: `berita lifestyle, berita gaya hidup, lifestyle`
    },
    trending_olahraga: {
        title: `Berita Olahraga Nasional dan Internasional Terupdate - ${SITE_NAME}`,
        description: `Kumpulan berita dan artikel olahraga nasional dan internasional terkini di Indonesia, mulai dari bola, motogp, bulu tangkis, futsal, hingga catur`,
        keywords: `berita bola, berita olahraga, bola`
    },
    trending_kesehatan: {
        title: `Berita Terkini Dunia Kesehatan dari Sumber Terpercaya - ${SITE_NAME}`,
        description: `Kumpulan berita, artikel dan tips kesehatan terpercaya, mulai dari diet, olahraga, parenting, penyakit, obat hingga seks`,
        keywords: `berita kesehatan, artikel kesehatan, tips kesehatan`
    },
    trending_bisnis: {
        title: `Info Berita Bisnis Terkini Nasional dan Dunia - ${SITE_NAME}`,
        description: `Kumpulan berita, artikel dan tips terhangat seputar bisnis, finansial, investasi, dan ekonomi, UKM nasional dan internasional terkini di Indonesia`,
        keywords: `berita bisnis, kabar bisnis hari ini, berita bisnis terbaru`
    },
    trending_otomotif: {
        title: `Berita Otomotif Mobil dan Motor Terbaru Hari Ini - ${SITE_NAME}`,
        description: `Kumpulan berita, artikel dan tips terhangat seputar otomotif, motor dan mobil nasional dan internasional terkini di Indonesia`,
        keywords: `otomotif, berita otomotif, berita otomotif terbaru, kabar otomotif`
    },
    trending_muslim: {
        title: `Kabar dan Berita Muslim Terbaru Hari Ini - ${SITE_NAME}`,
        description: `Kumpulan berita, artikel dan tips terhangat seputar muslim, dan islam nasional dan internasional terkini di Indonesia`,
        keywords: `kabar muslim terbaru, berita muslim`
    },
    explore_for_you: {
        title: `Nonton Kumpulan Program TV dan Sinetron RCTI, MNC, GTV, iNews - ${SITE_NAME}`,
        description: `Nonton kumpulan program, sinetron dan acara TV RCTI, MNC TV, GTV, iNews terbaru full episode tanpa buffering hanya di RCTI+`,
        keywords: `program TV`
    },
    explore_talent_search: {
        title: `Nonton Acara TV Ajang Pencarian Bakat Terbaru - ${SITE_NAME}`,
        description: `Nonton video ajang pencarian bakat nyanyi, sulap, atraksi dan lainnya terpopuler di Indonesia tanpa buffering hanya di RCTI+`,
        keywords: `ajang pencarian bakat`
    },
    explore_drama: {
        title: `Nonton Kumpulan Drama & Sinetron Terbaik dan Terbaru - ${SITE_NAME}`,
        description: `Nonton drama acara sinetron romantis, religi dan misteri favoritmu full episode tanpa buffering hanya di RCTI+`,
        keywords: `nonton drama`
    },
    explore_special_event: {
        title: `Nonton Tayangan Acara Spesial Terbaru - ${SITE_NAME}`,
        description: `Nonton tayangan program dan acara momentum spesial dan besar di Indonesia tanpa buffering hanya di RCTI+`,
        keywords: `special events`
    },
    explore_sport: {
        title: `Nonton Bola dan Video Olahraga Lainnya Terbaru - ${SITE_NAME}`,
        description: `Nonton bola online dan highlight olahraga lainnya paling lengkap dan terupdate liga Champion, Inggris, Italia, Indonesia dan lainnya hanya di RCTI+`,
        keywords: `nonton bola`
    },
    explore_children: {
        title: `Nonton Film Kartun Lucu dan Program TV Anak Lainnya - ${SITE_NAME}`,
        description: `Nonton tayangan program dan acara kartun animasi, kartun anak lucu dan paling baru hanya di RCTI+`,
        keywords: `film kartun, film kartun lucu, film kartun anak`
    },
    explore_entertainment: {
        title: `Nonton Gosip dan Hiburan Dunia Artis Terbaru - ${SITE_NAME}`,
        description: `Nonton gosip, hiburan dan entertainment online dari artis top dunia dan Indonesia paling lengkap dan tanpa buffering hanya di RCTI+`,
        keywords: `gosip artis, gosip artis terbaru`
    },
    explore_variety_music: {
        title: `Nonton Video Musik Lengkap dan Terbaru - ${SITE_NAME}`,
        description: `Nonton video dan acara musik terbaru dan terkini lagi viral nasional dan internasional gratis tanpa buffering hanya di RCTI+`,
        keywords: `video musik, acara musik, program musik`
    },
    explore_comedy: {
        title: `Nonton Video dan Acara Komedi Paling Lucu dan Terbaru - ${SITE_NAME}`,
        description: `Nonton video komedi paling lucu dari seluruh tayangan dan program RCTI, MNC TV, GTV, dan iNews. Selengkapnya hanya ada di RCTI+`,
        keywords: `acara komedi, video komedi`
    },
    explore_sitkom: {
        title: `Nonton Program Komedi Terbaru Paling Kocak - ${SITE_NAME}`,
        description: `Nonton program acara situasi komedi paling lucu favoritmu full episode tanpa buffering hanya di RCTI+`,
        keywords: `video komedi lucu, video lucu komedi`
    },
    expore_mistery: {
        title: `Nonton Program Misteri Horor Paling Seram Terbaru - ${SITE_NAME}`,
        description: `Nonton acara horor, misteri, mitos untuk menguak semua pengalaman mengerikan hanya di RCTI+`,
        keywords: `video horor, acara horor, program horor, film horor`
    },
    explore_movie: {
        title: `Nonton Film, Drama dan Serial Favorit Terbaru - ${SITE_NAME}`,
        description: `Nonton film Indonesia online, drama korea, jepang, barat, dan bollywood terbaru. Pilih dan tonton online favoritmu hanya di RCTI+`,
        keywords: `nonton film online, nonton film streaming, nonton drakor, nonton movie online`
    },
    explore_ftv: {
        title: `Nonton Sinetron FTV Romantis Terbaru - ${SITE_NAME}`,
        description: `Nonton FTV, sinetron, dan acara TV paling menarik untuk menemani hari-harimu. Lihat selengkapnya hanya di RCTI+`,
        keywords: `ftv, nonton ftv, nonton sinetron, sinetron`
    },
    explore_religious: {
        title: `Nonton Program Religi dan Sinetron Religi Terbaru - ${SITE_NAME}`,
        description: `Nonton film religi, azab, dan program siraman rohani terupdate, lengkap dan tidak membosankan tanpa buffering hanya di RCTI+`,
        keywords: `film religi, nonton film religi`
    },
    explore_reality_show: {
        title: `Nonton Tayangan Program Reality Show Terbaru - ${SITE_NAME}`,
        description: `Nonton reality show terbaik di RCTI, MNC TV, GTV dan iNews full episode tanpa buffering hanya di RCTI+`,
        keywords: `reality show, program tv, program tv hari ini`
    },
    explore_infotainment: {
        title: `Saksikan Program Infotainment dan Gosip Artis Terbaru dan Teraktual - ${SITE_NAME}`,
        description: `Nonton gosip infotainment artis top paling update dan seru untuk ditonton terkait gaya hidup, kasus, perjalanan karir dan lainnya hanya di RCTI+`,
        keywords: `kabar artis, kabar artis terbaru`
    },
    explore_information: {
        title: `Tayangan Berita dan Informasi Terbaru dari Berbagai Kanal - ${SITE_NAME}`,
        description: `Nonton berita peristiwa, bola, kriminal, travel, teknologi paling update dan terkini tanpa buffering hanya di RCTI+`,
        keywords: `berita paling update`
    }
};