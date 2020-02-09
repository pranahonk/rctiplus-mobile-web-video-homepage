import Router from 'next/router';
import { getCookie } from '../utils/cookie';

export default function (ctx) {
	if (ctx.isServer) {
		if (ctx.req.headers.cookie) {
			// logged session logic here
			const token = getCookie('ACCESS_TOKEN');
			if (token && (ctx.pathname === '/login' || ctx.pathname === '/register')) {
				setTimeout(function () {
					Router.push('/');
				}, 0);
			}
		}
	}
	else {
		const token = getCookie('ACCESS_TOKEN');
		if (token && (ctx.pathname === '/login' || ctx.pathname === '/register')) {
			setTimeout(function () {
				Router.push('/');
			}, 0);
		}
	}
}

