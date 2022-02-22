import cookie from 'js-cookie';
import ax from 'axios';
import { NEWS_API_V2, NEWS_API, DEV_API, VISITOR_TOKEN, MODE } from '../config';

const axios = ax.create({
    // baseURL: API + '/api',
    baseURL: DEV_API + '/api',
    headers: {
        'Authorization': VISITOR_TOKEN
    }
});


export const setCookie = (name, value, days) => {
    // if (process.browser) {
    //     cookie.set(key, value, { domain: 'rc-webm.rctiplus.com' });
    // }
    var domain, domainParts, date, expires, host;

      if (days)
      {
         date = new Date();
         date.setTime(date.getTime()+(days*24*60*60*1000));
         expires = "; expires="+date.toGMTString();
      }
      else
      {
         expires = "";
      }


      if(process.browser){
          host = window.location.host;
          if (host.split('.').length === 1)
          {
              // no "." in a domain - it's localhost or something similar
              document.cookie = name+"="+value+expires+"; path=/";
          }
          else
          {
              domainParts = host.split('.');
              domainParts.shift();
              domain = '.'+domainParts.join('.');

              document.cookie = name+"="+value+expires+"; path=/; domain="+domain;
              if (getCookieHelper(name) == null || getCookieHelper(name) != value)
              {

                  domain = '.'+host;
                  document.cookie = name+"="+value+expires+"; path=/; domain="+domain;
              }
          }
      }


};

const getCookieHelper = (name) => {
    {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for (var i=0; i < ca.length; i++)
      {
         var c = ca[i];
         while (c.charAt(0)==' ')
         {
            c = c.substring(1,c.length);
         }

         if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
   }
}

export const erese = key => {
    if (process.browser) {
        setCookie(key, '', -1)
    }
};

export const removeCookie = key => {
    if (window.location.host.split('.').length === 1) {
        cookie.remove(key, { path: '/' })
    }
    else {
        let domainParts = window.location.host.split('.');
        domainParts.shift();
        const domain = `.${domainParts.join('.')}`

        cookie.remove(key, { path: '/', domain })
    }
};

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

export const checkToken = async () => {
    const visitorToken = getVisitorToken();
    if (!visitorToken) {
        await setVisitorToken();
    }

    const newsToken = getNewsToken();
    if (!newsToken) {
        await setNewsToken();
    }

    const newsTokenV2 = getNewsTokenV2();
    if (!newsTokenV2) {
        await setNewsTokenV2();
    }
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

export const getVisitorTokenNews = () => {
    const visitorTokenNews = cookie.get('VISITOR_TOKEN_NEWS');
    if (visitorTokenNews) {
        const data = JSON.parse(visitorTokenNews);
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

export const getNewsTokenV2 = () => {
    const newsToken = cookie.get('NEWS_TOKEN_V2');
    if (newsToken) {
        const data = JSON.parse(newsToken);
        return data['VALUE'];
    }

    return null;
};

export const setVisitorToken = async () => {
    try {
        let visitorToken = cookie.get('VISITOR_TOKEN');
        let cookieDataToken = '';
        if (!visitorToken) {
            const response = await axios.get(`/v1/visitor?platform=mweb&device_id=${new DeviceUUID().get()}`);
            if (response.status === 200 && response.data.status.code === 0) {
                cookieDataToken = cookie.set('VISITOR_TOKEN', JSON.stringify({
                    NAME: 'VISITOR_TOKEN',
                    VALUE: response.data.data.access_token,
                    CREATED_AT: new Date()
                }));
                return JSON.parse(cookieDataToken);
            }
        }
        else {
            visitorToken = JSON.parse(cookie.get('VISITOR_TOKEN'));
            const dayDiff = (Date.now() - new Date(visitorToken['CREATED_AT']).getTime()) / (1000 * 60 * 60 * 24);
            if (dayDiff > 7) {
                const response = await axios.get(`/v1/visitor?platform=mweb&device_id=${new DeviceUUID().get()}`);
                if (response.status === 200 && response.data.status.code === 0) {
                    cookieDataToken = cookie.set('VISITOR_TOKEN', JSON.stringify({
                        NAME: 'VISITOR_TOKEN',
                        VALUE: response.data.data.access_token,
                        CREATED_AT: new Date()
                    }));
                    return JSON.parse(visitorToken);
                }
            }
            else {
                return JSON.parse(visitorToken);
            }
        }
    } catch (error) {
        // console.log(error);
    }

    return null;
};

export const setVisitorTokenNews = async () => {
    try {
        let visitorTokenNews = cookie.get('VISITOR_TOKEN_NEWS');
        let cookieDataToken = '';
        if (!visitorTokenNews) {
            const response = await axios.get(`/v1/visitor`, {
                baseURL: NEWS_API_V2 + '/api'
            });
            if (response.status === 200 && response.data.status.code === 0) {
                cookieDataToken = cookie.set('VISITOR_TOKEN_NEWS', JSON.stringify({
                    NAME: 'VISITOR_TOKEN_NEWS',
                    VALUE: response.data.data.access_token,
                    CREATED_AT: new Date()
                }));
            }
        }
        else {
            visitorTokenNews = JSON.parse(visitorTokenNews);
            const dayDiff = (Date.now() - new Date(visitorTokenNews['CREATED_AT']).getTime()) / (1000 * 60 * 60 * 24);
            if (dayDiff > 7) {
                const response = await axios.get(`/v1/visitor`, {
                    baseURL: NEWS_API_V2 + '/api'
                });
                if (response.status === 200 && response.data.status.code === 0) {
                    cookieDataToken = cookie.set('VISITOR_TOKEN_NEWS', JSON.stringify({
                        NAME: 'VISITOR_TOKEN_NEWS',
                        VALUE: response.data.data.access_token,
                        CREATED_AT: new Date()
                    }));
                    return JSON.parse(cookieDataToken);
                }
            }
            else {
                return visitorTokenNews;
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
                merchantName: 'RCTI+',
                hostToken: getVisitorToken(),
                platform: 'mweb'
            }, {
                baseURL: NEWS_API + '/api'
            });

            if (response.status === 200 && response.data.status.code === 0) {
                newsToken = JSON.stringify({
                    NAME: 'NEWS_TOKEN',
                    VALUE: response.data.data.news_token,
                    CREATED_AT: new Date()
                });
                let cookieDataToken = cookie.set('NEWS_TOKEN', newsToken);
                return JSON.parse(newsToken);
            }
        } else {
            newsToken = JSON.parse(cookie.get('NEWS_TOKEN'));
            const dayDiff = (Date.now() - new Date(newsToken['CREATED_AT']).getTime()) / (1000 * 60 * 60 * 24);
            if (dayDiff > 7) {
                const response = await axios.post(`/v1/token`, {
                    merchantName: 'RCTI+',
                    hostToken: getVisitorToken(),
                    platform: 'mweb'
                }, {
                    baseURL: NEWS_API + '/api'
                });
                if (response.status === 200 && response.data.status.code === 0) {
                    newsToken = JSON.stringify({
                        NAME: 'NEWS_TOKEN',
                        VALUE: response.data.data.news_token,
                        CREATED_AT: new Date()
                    });
                    let cookieDataToken = cookie.set('NEWS_TOKEN', newsToken);
                    return JSON.parse(newsToken);
                }
            } else {
                return newsToken;
            }
        }
    } catch (error) {
        console.log(error);
    }

    return null;
};

export const setNewsTokenV2 = async () => {
    try {
        let newsToken = cookie.get('NEWS_TOKEN_V2');
        let visitorToken = getCookie('ACCESS_TOKEN') ? getCookie('ACCESS_TOKEN') : getVisitorToken();

        if (!newsToken) {
            const response = await axios.post(`/v1/token`, {
                merchantName: 'rcti+',
                hostToken: visitorToken,
                platform: 'mweb'
            }, {
                baseURL: NEWS_API_V2 + '/api'
            });
            if (response.status === 200 && response.data.status.code === 0) {
                newsToken = JSON.stringify({
                    NAME: 'NEWS_TOKEN_V2',
                    VALUE: response.data.data.news_token,
                    CREATED_AT: new Date()
                });
                let cookieDataToken = cookie.set('NEWS_TOKEN_V2', newsToken);
                return JSON.parse(newsToken);
            }
        } else {
            newsToken = JSON.parse(cookie.get('NEWS_TOKEN_V2'));
            const dayDiff = (Date.now() - new Date(newsToken['CREATED_AT']).getTime()) / (1000 * 60 * 60 * 24);
            if (dayDiff > 7) {
                const response = await axios.post(`/v1/token`, {
                    merchantName: 'rcti+',
                    hostToken: visitorToken,
                    platform: 'mweb'
                }, {
                    baseURL: NEWS_API_V2 + '/api'
                });
                if (response.status === 200 && response.data.status.code === 0) {
                    let cookieDataToken = cookie.set('NEWS_TOKEN_V2', JSON.stringify({
                        NAME: 'NEWS_TOKEN_V2',
                        VALUE: response.data.data.news_token,
                        CREATED_AT: new Date()
                    }));
                    return JSON.parse(cookieDataToken);
                }
            } else {
                return newsToken;
            }
        }
    } catch (error) {
        console.log(error);
    }

    return null;
};

export const setNewsChannels = channels => {
    cookie.set('NEWS_CHANNELS', JSON.stringify(channels));
};

export const getNewsChannels = () => {
    const newsChannels = cookie.get('NEWS_CHANNELS');
    if (newsChannels) {
        return JSON.parse(newsChannels);
    }

    return [];
};

export const setAccessToken = token => {
    setCookie('GLOBAL_ACCESS_TOKEN', token);
};

export const getAccessToken = () => {
    return getCookie('GLOBAL_ACCESS_TOKEN');
};

export const getUserAccessToken = () => {
    return getCookie('ACCESS_TOKEN');
};

export const removeAccessToken = () => {
    removeCookie('GLOBAL_ACCESS_TOKEN');
};
