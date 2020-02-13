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

export const homeBannerEvent = (bannerId, bannerType, bannerTitle, portraitImage, landscapeImage, event = 'mweb_homepage_banner_clicked') => {
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
        banner_id: bannerId,
        banner_type: bannerType,
        banner_title: bannerTitle,
        portrait_image: portraitImage,
        landscape_image: landscapeImage,
        users_id: userId,
        date_time: formatDateTime(new Date())
    });
};

export const homeStoryEvent = (storyProgramId, storyProgramName, storyType, event = 'mweb_homepage_story_clicked', storyAdsType = null) => {
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

    let qgData = {
        story_program_id: storyProgramId,
        story_program_name: storyProgramName,
        story_type: storyType,
        users_id: userId,
        date_time: formatDateTime(new Date())
    };

    if (storyAdsType != null) {
        qgData['story_ads_type'] = storyAdsType;
    }

    qg('event', event, qgData);
};

export const contentGeneralEvent = (homepageTitle, contentType, contentId, contentTitle, programTitle, genre, portraitImage, landscapeImage, event = 'mweb_homepage_content_clicked') => {
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
        homepage_title: homepageTitle,
        content_type: contentType,
        content_id: contentId,
        content_title: contentTitle,
        program_title: programTitle,
        genre: genre,
        portrait_image: portraitImage,
        landscape_image: landscapeImage,
        users_id: userId,
        date_time: formatDateTime(new Date())
    });
};

export const programContentEvent = (programId, programTitle, contentType, contentId, contentTitle, event = 'mweb_homepage_program_content_clicked') => {
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
        content_type: contentType,
        content_id: contentId,
        content_title: contentTitle,
        program_title: programTitle,
        program_id: programId,
        users_id: userId,
        date_time: formatDateTime(new Date())
    });
};

export const programRateEvent = (status, programTitle, programId, programType, event = 'mweb_homepage_program_rate_clicked') => {
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
        status: status,
        program_title: programTitle,
        program_id: programId,
        program_type: programType,
        users_id: userId,
        date_time: formatDateTime(new Date())
    });
};

export const programShareEvent = (programTitle, programId, programType, event = 'mweb_homepage_program_share_clicked') => {
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
        program_title: programTitle,
        program_id: programId,
        program_type: programType,
        users_id: userId,
        date_time: formatDateTime(new Date())
    });
};

export const programTrailerEvent = (programTitle, programId, programType, event = 'mweb_homepage_program_trailer_clicked') => {
    programShareEvent(programTitle, programId, programType, event);
};

export const programAddMyListEvent = (status, programTitle, programId, programType, event = 'mweb_homepage_program_add_mylist_clicked') => {
    programRateEvent(status, programTitle, programId, programType, event);
};

export const programTrailerPlayEvent = (programId, programTitle, programType, duration, videoDuration, event = 'mweb_homepage_program_trailer_play') => {
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
        program_title: programTitle,
        program_id: programId,
        program_type: programType,
        duration: duration,
        video_duration: videoDuration,
        users_id: userId,
        date_time: formatDateTime(new Date())
    });
};

export const programContentDownloadEvent = (programId, programTitle, contentTitle, contentType, contentId, event = 'mweb_homepage_program_content_download_clicked') => {
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
        program_title: programTitle,
        program_id: programId,
        content_title: contentTitle,
        content_type: contentType,
        content_id: contentId,
        users_id: userId,
        date_time: formatDateTime(new Date())
    });
};

export const programContentShareEvent = (programId, programTitle, contentTitle, contentType, contentId, event = 'mweb_homepage_program_content_share_clicked') => {
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
        program_title: programTitle,
        program_id: programId,
        content_title: contentTitle,
        content_type: contentType,
        content_id: contentId,
        users_id: userId,
        date_time: formatDateTime(new Date())
    });
};

export const programContentAddMyListEvent = (programId, programTitle, contentId, contentTitle, contentType, event = 'mweb_homepage_program_content_add_mylist_clicked') => {
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
        program_title: programTitle,
        program_id: programId,
        content_id: contentId,
        content_title: contentTitle,
        content_type: contentType,
        users_id: userId,
        date_time: formatDateTime(new Date())
    });
};

export const programShowMoreEvent = (programId, programTitle, event = 'mweb_homepage_program_showmore_clicked') => {
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
        program_title: programTitle,
        program_id: programId,
        users_id: userId,
        date_time: formatDateTime(new Date())
    });
};

export const programRelatedEvent = (programId, programTitle, event = 'mweb_homepage_program_related_scroll_horizontal') => {
    programShowMoreEvent(programId, programTitle, event);
};

export const programSeasonCloseEvent = (programId, programName, season, event = 'mweb_homepage_program_season_close_clicked') => {
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
        program_name: programName,
        program_id: programId,
        season: season,
        users_id: userId,
        date_time: formatDateTime(new Date())
    });
};

export const programSeasonListEvent = (programId, programName, season, event = 'mweb_homepage_program_season_list_clicked') => {
    programSeasonCloseEvent(programId, programName, season, event);
};

export const programSeasonEvent = (programId, programName, season, event = 'mweb_homepage_program_season_clicked') => {
    programSeasonCloseEvent(programId, programName, season, event);
};

export const programTabEvent = (programId, programName, tabName, event = 'mweb_homepage_program_tab_clicked') => {
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
        program_name: programName,
        program_id: programId,
        tab_name: tabName,
        users_id: userId,
        date_time: formatDateTime(new Date())
    });
};

export const programContentPlayEvent = (programId, programTitle, contentId, contentTitle, contentType, duration, videoDuration, event = 'mweb_homepage_program_content_play') => {
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
        program_title: programTitle,
        program_id: programId,
        content_id: contentId,
        content_title: contentTitle,
        content_type: contentType,
        duration: duration,
        video_duration: videoDuration,
        users_id: userId,
        date_time: formatDateTime(new Date())
    });
};

export const homepageContentPlayEvent = (homepageTitle, contentType, contentId, contentTitle, programTitle, genre, portraitImage, landscapeImage, duration, videoDuration, event = 'mweb_homepage_content_play') => {
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
        homepage_title: homepageTitle,
        program_title: programTitle,
        content_id: contentId,
        content_title: contentTitle,
        content_type: contentType,
        duration: duration,
        video_duration: videoDuration,
        genre: genre,
        portrait_image: portraitImage,
        landscape_image: landscapeImage,
        users_id: userId,
        date_time: formatDateTime(new Date())
    });
};