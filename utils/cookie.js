import cookie from 'js-cookie';
import ax from 'axios';
import { NEWS_API, DEV_API, VISITOR_TOKEN } from '../config';

const axios = ax.create({
    // baseURL: API + '/api',
    baseURL: DEV_API + '/api',
    headers: {
        'Authorization': VISITOR_TOKEN
    }
});


export const setCookie = (key, value) => {
	if (process.browser) {
		cookie.set(key, value, {
			expires: 1,
			path: '/',
		});
	}
};

export const removeCookie = key => {
	if (process.browser) {
		cookie.remove(key, {
			expires: 1
		});
	}

	cookie.remove(key);
};

// export const getCookie = (key, req) => {
//     return process.browser ? getCookieFromBrowser(key) : getCookieFromServer(key, req);
// };

export const getCookie = key => getCookieFromBrowser(key);

const getCookieFromServer = (key, req) => {
	if (!req.headers.cookie) {
		return undefined;
	}

	const rawCookie = req.headers.cookie
		.split(';')
		.find(c => c.trim().startsWith(`${key}=`));

	if (!rawCookie) {
		return undefined;
	}

	return rawCookie.split('=')[1];
};

const getCookieFromBrowser = key => {
	return cookie.get(key);
};

export const setDeviceId = () => {
	window.localStorage['DEVICE_ID'] = new DeviceUUID().get();
};

export const getVisitorToken = () => {
	const visitorToken = cookie.get('VISITOR_TOKEN');
	if (visitorToken) {
		const data = JSON.parse(visitorToken);
		return data['VALUE'];
	}

	return null;
};

export const getNewsToken = () => {
	const newsToken = cookie.get('NEWS_TOKEN');
	if (newsToken) {
		const data = JSON.parse(newsToken);
		return data['VALUE'];
	}

	return null;
};

export const setVisitorToken = async () => {
	try {
		let visitorToken = cookie.get('VISITOR_TOKEN');
		if (!visitorToken) {
			const response = await axios.get(`/v1/visitor?platform=mweb&device_id=${new DeviceUUID().get()}`);
			if (response.status === 200 && response.data.status.code === 0) {
				cookie.set('VISITOR_TOKEN', JSON.stringify({
					NAME: 'VISITOR_TOKEN',
					VALUE: response.data.data.access_token,
					CREATED_AT: new Date()
				}));
				return JSON.parse(cookie.get('VISITOR_TOKEN'));
			}
		}
		else {
			visitorToken = JSON.parse(cookie.get('VISITOR_TOKEN'));
			const dayDiff = (Date.now() - new Date(visitorToken['CREATED_AT']).getTime()) / (1000 * 60 * 60 * 24);
			if (dayDiff > 7) {
				const response = await axios.get(`/v1/visitor?platform=mweb&device_id=${new DeviceUUID().get()}`);
				if (response.status === 200 && response.data.status.code === 0) {
					cookie.set('VISITOR_TOKEN', JSON.stringify({
						NAME: 'VISITOR_TOKEN',
						VALUE: response.data.data.access_token,
						CREATED_AT: new Date()
					}));
					return JSON.parse(cookie.get('VISITOR_TOKEN'));
				}
			}
			else {
				return JSON.parse(cookie.get('VISITOR_TOKEN'));
			}
		}
	}
	catch (error) {
		console.log(error);
	}
	
	return null;
};

export const setNewsToken = async () => {
	try {
		let newsToken = cookie.get('NEWS_TOKEN');
		if (!newsToken) {
			const response = await axios.post(`/v1/token`, {
				merchantName: 'rcti+',
				hostToken: getVisitorToken(),
				platform: 'mweb'
			}, {
				baseURL: NEWS_API + '/api'
			});

			console.log(response);
			if (response.status === 200 && response.data.status.code === 0) {
				cookie.set('NEWS_TOKEN', JSON.stringify({
					NAME: 'NEWS_TOKEN',
					VALUE: response.data.data.news_token,
					CREATED_AT: new Date()
				}));
				return JSON.parse(cookie.get('NEWS_TOKEN'));
			}
		}
		else {
			newsToken = JSON.parse(cookie.get('NEWS_TOKEN'));
			const dayDiff = (Date.now() - new Date(newsToken['CREATED_AT']).getTime()) / (1000 * 60 * 60 * 24);
			if (dayDiff > 7) {
				const response = await axios.post(`/v1/token`, {
					merchantName: 'rcti+',
					hostToken: getVisitorToken(),
					platform: 'mweb'
				}, {
					baseURL: NEWS_API + '/api'
				});
				if (response.status === 200 && response.data.status.code === 0) {
					cookie.set('NEWS_TOKEN', JSON.stringify({
						NAME: 'NEWS_TOKEN',
						VALUE: response.data.data.news_token,
						CREATED_AT: new Date()
					}));
					return JSON.parse(cookie.get('NEWS_TOKEN'));
				}
			}
			else {
				return JSON.parse(cookie.get('NEWS_TOKEN'));
			}
		}
	}
	catch (error) {
		console.log(error);
	}
	
	return null;
};