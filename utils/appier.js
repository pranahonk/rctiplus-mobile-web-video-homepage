import { getCookie } from '../utils/cookie';
import { formatDateTime } from '../utils/dateHelpers';

const jwtDecode = require('jwt-decode');
const TOKEN_KEY = 'ACCESS_TOKEN';

export const homeGeneralClicked = (event = 'mweb_homepage_logo_clicked') => {
    console.log(event);
    const accessToken = getCookie(TOKEN_KEY);
    let userId = new DeviceUUID().get();
    if (accessToken) {
        try {
            userId = jwtDecode(accessToken).vid;
        }
        catch (e) {
            console.log(e);
        }
    }

    qg('event', event,
    {
        users_id: userId,
        date_time: formatDateTime(new Date())
    });
};