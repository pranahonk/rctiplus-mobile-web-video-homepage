import { getCookie } from '../utils/cookie';
import { formatDateTime } from '../utils/dateHelpers';

const jwtDecode = require('jwt-decode');
const TOKEN_KEY = 'ACCESS_TOKEN';

const getUserId = () => {
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
    
    return userId;
};

export const homeGeneralClicked = (event = 'mweb_homepage_logo_clicked') => {
    console.log(event);
    qg('event', event,
    {
        users_id: getUserId(),
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

export const exclusiveGeneralEvent = (event = 'mweb_exclusive_logo_clicked') => {
    homeGeneralClicked(event);
};

export const exclusiveTabEvent = (tabName, event = 'mweb_exclusive_tab_clicked') => {
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
        tab_name: tabName,
        users_id: userId,
        date_time: formatDateTime(new Date())
    });
};

export const exclusiveContentEvent = (contentType, contentId, contentTitle, programTitle, genre, portraitImage, landscapeImage, event = 'mweb_exclusive_content_clicked') => {
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
        genre: genre,
        portrait_image: portraitImage,
        landscape_image: landscapeImage,
        users_id: userId,
        date_time: formatDateTime(new Date())
    });
};

export const exclusiveContentPlayEvent = (contentType, contentId, contentTitle, programTitle, genre, portraitImage, landscapeImage, duration, videoDuration, event = 'mweb_exclusive_content_play') => {
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
        genre: genre,
        portrait_image: portraitImage,
        landscape_image: landscapeImage,
        duration: duration,
        video_duration: videoDuration,
        users_id: userId,
        date_time: formatDateTime(new Date())
    });
};

export const exclusiveShareEvent = (programId, programTitle, contentTitle, contentType, contentId, tabName, photoId, photoImage, photoUrl, event = 'mweb_exclusive_share_clicked') => {
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
        tab_name: tabName,
        photo_id: photoId,
        photo_image: photoImage,
        photo_url: photoUrl,
        users_id: userId,
        date_time: formatDateTime(new Date())
    });
};

export const exclusiveProfileProgramEvent = (programId, programName, tabName, event = 'mweb_exclusive_profile_program_clicked') => {
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
        program_id: programId,
        program_name: programName,
        tab_name: tabName,
        users_id: userId,
        date_time: formatDateTime(new Date())
    });
}; 

export const exclusiveTitleProgramEvent = (programId, programName, tabName, event = 'mweb_exclusive_title_program_clicked') => {
    exclusiveProfileProgramEvent(programId, programName, tabName, event);
};

export const exclusivePhotoSlideNextEvent = (programId, programName, tabName, event = 'mweb_exclusive_photo_slide_next') => {
    exclusiveProfileProgramEvent(programId, programName, tabName, event);
};

export const exclusivePhotoSlidePreviousEvent = (programId, programName, tabName, event = 'mweb_exclusive_photo_slide_previous') => {
    exclusiveProfileProgramEvent(programId, programName, tabName, event);
};

// START

export const liveTvChannelClicked = (channelId, channelName, programTitleLive, event = 'mweb_livetv_channel_clicked') => {
    console.log(event);
    qg('event', event,
    {
        channel_id: channelId,
        channel_name: channelName,
        program_title_live: programTitleLive,
        users_id: getUserId(),
        date_time: formatDateTime(new Date())
    });
};

export const liveTvShareClicked = (channelId, channelName, event = 'mweb_livetv_channel_clicked') => {
    console.log(event);
    qg('event', event,
    {
        channel_id: channelId,
        channel_name: channelName,
        users_id: getUserId(),
        date_time: formatDateTime(new Date())
    });
};

export const liveTvCatchupScheduleClicked = (channelId, channelName, event = 'mweb_livetv_catchup_schedule_clicked') => {
    liveTvShareClicked(channelId, channelName, event);
};

export const liveTvShareCatchupClicked = (channelId, channelName, identity, event = 'mweb_livetv_share_catchup_clicked') => {
    console.log(event);
    qg('event', event,
    {
        channel_id: channelId,
        channel_name: channelName,
        identity: identity,
        users_id: getUserId(),
        date_time: formatDateTime(new Date())
    });
};

export const liveTvTabClicked = (channelId, channelName, tabName, event = 'mweb_livetv_tab_clicked') => {
    console.log(event);
    qg('event', event,
    {
        channel_id: channelId,
        channel_name: channelName,
        tab_name: tabName,
        users_id: getUserId(),
        date_time: formatDateTime(new Date())
    });
};

export const liveTvCatchupSchedulePlay = (catchupScheduleDate, channelId, channelName, catchupName, event = 'mweb_livetv_catchup_schedule_play') => {
    console.log(event);
    qg('event', event,
    {
        catchup_schedule_date: catchupScheduleDate,
        channel_id: channelId,
        channel_name: channelName,
        catchup_name: catchupName,
        users_id: getUserId(),
        date_time: formatDateTime(new Date())
    });
};

export const liveTvLiveChatClicked = (channelId, channelName, event = 'mweb_livetv_livechat_clicked') => {
    console.log(event);
    qg('event', event,
    {
        channel_id: channelId,
        channel_name: channelName,
        users_id: getUserId(),
        date_time: formatDateTime(new Date())
    });
};

export const accountGeneralEvent = (event = 'mweb_account_logo_clicked') => {
    homeGeneralClicked(event);
};

export const accountHistoryClearHistoryClicked = (programId, programName, contentId, contentName, event = 'mweb_account_history_clear_history_clicked') => {
    console.log(event);
    qg('event', event,
    {
        program_id: programId,
        program_name: programName,
        content_id: contentId,
        content_name: contentName,
        users_id: getUserId(),
        date_time: formatDateTime(new Date())
    });
};

export const accountHistoryContentClicked = (programId, programTitle, contentTitle, contentType, contentId, event = 'mweb_account_history_content_clicked') => {
    console.log(event);
    qg('event', event,
    {
        program_id: programId,
        program_title: programTitle,
        content_id: contentId,
        content_title: contentTitle,
        content_type: contentType,
        users_id: getUserId(),
        date_time: formatDateTime(new Date())
    });
};

export const accountHistoryContentPlayEvent = (contentType, contentId, contentTitle, programTitle, genre, portraitImage, landscapeImage, duration, videoDuration, event = 'mweb_account_history_content_play') => {
    console.log(event);
    qg('event', event,
    {
        program_title: programTitle,
        content_id: contentId,
        content_title: contentTitle,
        content_type: contentType,
        genre: genre,
        portrait_image: portraitImage,
        landscape_image: landscapeImage,
        duration: duration,
        video_duration: videoDuration,
        users_id: getUserId(),
        date_time: formatDateTime(new Date())
    });
};

export const accountHistoryShareClicked = (programId, programTitle, contentTitle, contentType, contentId, event = 'mweb_account_history_share_clicked') => {
    accountHistoryContentClicked(programId, programTitle, contentTitle, contentType, contentId, event);
};

export const accountHistoryDownloadClicked = (programId, programTitle, contentTitle, contentType, contentId, event = 'mweb_account_history_download_clicked') => {
    accountHistoryContentClicked(programId, programTitle, contentTitle, contentType, contentId, event);
};

// END