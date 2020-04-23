import { getCookie } from '../utils/cookie';
import { formatDateTime } from '../utils/dateHelpers';

const jwtDecode = require('jwt-decode');
const TOKEN_KEY = 'ACCESS_TOKEN';

export const getUserId = () => {
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
        date_time: new Date().getTime() / 1000
    });
};
export const liveEventTabClicked = (event = 'mweb_liveevent_clicked', tabName) => {
    console.log(event);
    qg('event', event,
    {
        users_id: getUserId(),
        tab_name: tabName,
        date_time: new Date().getTime() / 1000
    });
};

export const homeProgramClicked = (homepageTitle, programId, programTitle, genre, portraitImage, landscapeImage, event = 'mweb_homepage_program_clicked') => {
    console.log(event);
    qg('event', event,
    {
        homepage_title: homepageTitle,
        program_id: programId,
        program_name: programTitle,
        genre: genre,
        portrait_image: portraitImage,
        landscape_image: landscapeImage,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
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
        date_time: new Date().getTime() / 1000
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
        date_time: new Date().getTime() / 1000
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
        content_name: contentTitle,
        program_name: programTitle,
        genre: genre,
        portrait_image: portraitImage,
        landscape_image: landscapeImage,
        users_id: userId,
        date_time: new Date().getTime() / 1000
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
        content_name: contentTitle,
        program_name: programTitle,
        program_id: programId,
        users_id: userId,
        date_time: new Date().getTime() / 1000
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
        program_name: programTitle,
        program_id: programId,
        program_type: programType,
        users_id: userId,
        date_time: new Date().getTime() / 1000
    });
};

export const liveShareEvent = (contentId, contentName , event = 'mweb_homepage_live_event_share_clicked') => {
    console.log(event);

    qg('event', event,
    {
        content_id: contentId,
        content_name: contentName,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
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
        program_name: programTitle,
        program_id: programId,
        program_type: programType,
        users_id: userId,
        date_time: new Date().getTime() / 1000
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
        program_name: programTitle,
        program_id: programId,
        program_type: programType,
        duration: duration,
        video_duration: videoDuration,
        users_id: userId,
        date_time: new Date().getTime() / 1000
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
        program_name: programTitle,
        program_id: programId,
        content_name: contentTitle,
        content_type: contentType,
        content_id: contentId,
        users_id: userId,
        date_time: new Date().getTime() / 1000
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
        program_name: programTitle,
        program_id: programId,
        content_name: contentTitle,
        content_type: contentType,
        content_id: contentId,
        users_id: userId,
        date_time: new Date().getTime() / 1000
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
        program_name: programTitle,
        program_id: programId,
        content_id: contentId,
        content_name: contentTitle,
        content_type: contentType,
        users_id: userId,
        date_time: new Date().getTime() / 1000
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
        program_name: programTitle,
        program_id: programId,
        users_id: userId,
        date_time: new Date().getTime() / 1000
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
        date_time: new Date().getTime() / 1000
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
        date_time: new Date().getTime() / 1000
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
        program_name: programTitle,
        program_id: programId,
        content_id: contentId,
        content_name: contentTitle,
        content_type: contentType,
        duration: duration,
        video_duration: videoDuration,
        users_id: userId,
        date_time: new Date().getTime() / 1000
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
        program_name: programTitle,
        content_id: contentId,
        content_name: contentTitle,
        content_type: contentType,
        duration: duration,
        video_duration: videoDuration,
        genre: genre,
        portrait_image: portraitImage,
        landscape_image: landscapeImage,
        users_id: userId,
        date_time: new Date().getTime() / 1000
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
        date_time: new Date().getTime() / 1000
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
        content_name: contentTitle,
        program_name: programTitle,
        genre: genre,
        portrait_image: portraitImage,
        landscape_image: landscapeImage,
        users_id: userId,
        date_time: new Date().getTime() / 1000
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
        content_name: contentTitle,
        program_name: programTitle,
        genre: genre,
        portrait_image: portraitImage,
        landscape_image: landscapeImage,
        duration: duration,
        video_duration: videoDuration,
        users_id: userId,
        date_time: new Date().getTime() / 1000
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
        content_name: contentTitle,
        program_name: programTitle,
        program_id: programId,
        tab_name: tabName,
        photo_id: photoId,
        photo_image: photoImage,
        photo_url: photoUrl,
        users_id: userId,
        date_time: new Date().getTime() / 1000
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
        date_time: new Date().getTime() / 1000
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

export const liveTvChannelClicked = (channelId, channelName, programTitleLive, event = 'mweb_livetv_channel_clicked') => {
    console.log(event);
    qg('event', event,
    {
        channel_id: channelId,
        channel_name: channelName,
        program_name_live: programTitleLive,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const liveTvShareClicked = (channelId, channelName, event = 'mweb_livetv_channel_clicked') => {
    console.log(event);
    qg('event', event,
    {
        channel_id: channelId,
        channel_name: channelName,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
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
        date_time: new Date().getTime() / 1000
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
        date_time: new Date().getTime() / 1000
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
        date_time: new Date().getTime() / 1000
    });
};

export const liveTvLiveChatClicked = (channelId, channelName, event = 'mweb_livetv_livechat_clicked') => {
    console.log(event);
    qg('event', event,
    {
        channel_id: channelId,
        channel_name: channelName,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const accountGeneralEvent = (event = 'mweb_account_logo_clicked') => {
    homeGeneralClicked(event);
};

export const accountScanQrCode = (status, event = 'mweb_account_scan_qrcode') => {
    console.log(event);
    qg('event', event,
    {
        status: status,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
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
        date_time: new Date().getTime() / 1000
    });
};

export const accountHistoryContentClicked = (programId, programTitle, contentTitle, contentType, contentId, event = 'mweb_account_history_content_clicked') => {
    console.log(event);
    qg('event', event,
    {
        program_id: programId,
        program_name: programTitle,
        content_id: contentId,
        content_name: contentTitle,
        content_type: contentType,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const accountHistoryContentPlayEvent = (contentType, contentId, contentTitle, programTitle, genre, portraitImage, landscapeImage, duration, videoDuration, event = 'mweb_account_history_content_play') => {
    console.log(event);
    qg('event', event,
    {
        program_name: programTitle,
        content_id: contentId,
        content_name: contentTitle,
        content_type: contentType,
        genre: genre,
        portrait_image: portraitImage,
        landscape_image: landscapeImage,
        duration: duration,
        video_duration: videoDuration,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const accountHistoryShareClicked = (programId, programTitle, contentTitle, contentType, contentId, event = 'mweb_account_history_share_clicked') => {
    accountHistoryContentClicked(programId, programTitle, contentTitle, contentType, contentId, event);
};

export const accountHistoryDownloadClicked = (programId, programTitle, contentTitle, contentType, contentId, event = 'mweb_account_history_download_clicked') => {
    accountHistoryContentClicked(programId, programTitle, contentTitle, contentType, contentId, event);
};

export const accountHistoryAddMyListClicked = (programId, programTitle, contentTitle, contentType, contentId, event = 'mweb_account_history_add_mylist_clicked') => {
    console.log(event);
    qg('event', event, 
    {
        program_id: programId,
        program_name: programTitle,
        content_name: contentTitle,
        content_type: contentType,
        content_id: contentId,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const accountMylistContentClicked = (programId, programTitle, contentTitle, contentType, contentId, event = 'mweb_account_mylist_content_clicked') => {
    accountHistoryContentClicked(programId, programTitle, contentTitle, contentType, contentId, event);
};

export const accountMylistContentPlayEvent = (contentType, contentId, contentTitle, programTitle, genre, portraitImage, landscapeImage, duration, videoDuration, event = 'mweb_account_mylist_content_play') => {
    accountHistoryContentPlayEvent(contentType, contentId, contentTitle, programTitle, genre, portraitImage, landscapeImage, duration, videoDuration, event);
};

export const accountMylistRemoveMylistClicked = (contentType, contentId, contentTitle, programTitle, genre, portraitImage, landscapeImage, duration, videoDuration, event = 'mweb_account_mylist_remove_mylist_clicked') => {
    accountHistoryContentPlayEvent(contentType, contentId, contentTitle, programTitle, genre, portraitImage, landscapeImage, duration, videoDuration, event);
};

export const accountMylistShareClicked = (programId, programTitle, contentTitle, contentType, contentId, event = 'mweb_account_mylist_share_clicked') => {
    accountHistoryContentClicked(programId, programTitle, contentTitle, contentType, contentId, event);
};

export const accountMylistDownloadClicked = (programId, programTitle, contentTitle, contentType, contentId, event = 'mweb_account_mylist_download_clicked') => {
    accountHistoryContentClicked(programId, programTitle, contentTitle, contentType, contentId, event);
};

export const accountMylistRelatedProgramClicked = (programId, programTitle, contentTitle, contentType, contentId, event = 'mweb_account_mylist_related_program_clicked') => {
    accountHistoryContentClicked(programId, programTitle, contentTitle, contentType, contentId, event);
};

export const accountContinueWatchingContentClicked = (programId, programTitle, contentTitle, contentType, contentId, event = 'mweb_account_continue_watching_content_clicked') => {
    accountHistoryContentClicked(programId, programTitle, contentTitle, contentType, contentId, event);
};

export const accountContinueWatchingContentPlayEvent = (contentType, contentId, contentTitle, programTitle, genre, portraitImage, landscapeImage, duration, videoDuration, event = 'mweb_account_continue_watching_content_play') => {
    accountHistoryContentPlayEvent(contentType, contentId, contentTitle, programTitle, genre, portraitImage, landscapeImage, duration, videoDuration, event);
};

export const accountContinueWatchingRemoveContinueWatchingClicked = (contentType, contentId, contentTitle, programTitle, genre, portraitImage, landscapeImage, duration, videoDuration, event = 'mweb_account_continue_watching_remove_continue_watching_clicked') => {
    accountHistoryContentPlayEvent(contentType, contentId, contentTitle, programTitle, genre, portraitImage, landscapeImage, duration, videoDuration, event);
};

export const accountContinueWatchingShareClicked = (programId, programTitle, contentTitle, contentType, contentId, event = 'mweb_account_continue_watching_share_clicked') => {
    accountHistoryContentClicked(programId, programTitle, contentTitle, contentType, contentId, event);
};

export const accountContinueWatchingDownloadClicked = (programId, programTitle, contentTitle, contentType, contentId, event = 'mweb_account_continue_watching_download_clicked') => {
    accountHistoryContentClicked(programId, programTitle, contentTitle, contentType, contentId, event);
};

export const accountContactUsFormEvent = (message, event = 'mweb_account_contact_us_form') => {
    console.log(event);
    qg('event', event,
    {
        message: message,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const libraryGeneralEvent = (event = 'mweb_library_clicked') => {
    homeGeneralClicked(event);
};

export const libraryProgramBackClicked = (programTitle, programId, programType, event = 'mweb_library_program_back_clicked') => {
    console.log(event);
    qg('event', event,
    {
        program_name: programTitle,
        program_id: programId,
        program_type: programType,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const libraryProgramClicked = (programTitle, programId, programType, event = 'mweb_library_program_clicked') => {
    libraryProgramBackClicked(programTitle, programId, programType, event);
};

export const libraryProgramRateClicked = (status, programTitle, programId, programType, event = 'mweb_library_program_rate_clicked') => {
    console.log(event);
    qg('event', event,
    {
        status: status,
        program_name: programTitle,
        program_id: programId,
        program_type: programType,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const libraryProgramShareClicked = (programTitle, programId, programType, event = 'mweb_library_program_share_clicked') => {
    libraryProgramBackClicked(programTitle, programId, programType, event);
};

export const libraryProgramTrailerClicked = (status, programTitle, programId, programType, event = 'mweb_library_program_trailer_clicked') => {
    libraryProgramRateClicked(status, programTitle, programId, programType, event);
};

export const libraryProgramAddMylistClicked = (status, programTitle, programId, programType, event = 'mweb_library_program_add_mylist_clicked') => {
    libraryProgramRateClicked(status, programTitle, programId, programType, event);
};

export const libraryProgramTrailerPlayEvent = (programTitle, programId, programType, duration, videoDuration, event = 'mweb_library_program_trailer_play') => {
    console.log(event);
    qg('event', event,
    {
        duration: duration,
        video_duration: videoDuration,
        program_name: programTitle,
        program_id: programId,
        program_type: programType,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const libraryProgramContentDownloadClicked = (programId, programTitle, contentTitle, contentType, contentId, event = 'mweb_library_program_content_download_clicked') => {
    console.log(event);
    qg('event', event, 
    {
        program_id: programId,
        program_name: programTitle,
        content_name: contentTitle,
        content_type: contentType,
        content_id: contentId,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const libraryProgramContentAddMylistClicked = (programId, programTitle, contentTitle, contentType, contentId, event = 'mweb_library_program_content_add_mylist_clicked') => {
    libraryProgramContentDownloadClicked(programId, programTitle, contentTitle, contentType, contentId, event);
};

export const libraryProgramContentShareClicked = (programId, programTitle, contentTitle, contentType, contentId, event = 'mweb_library_program_content_share_clicked') => {
    libraryProgramContentDownloadClicked(programId, programTitle, contentTitle, contentType, contentId, event);
};

export const libraryProgramContentClicked = (programId, programTitle, contentTitle, contentType, contentId, event = 'mweb_library_program_content_clicked') => {
    libraryProgramContentDownloadClicked(programId, programTitle, contentTitle, contentType, contentId, event);
};

export const libraryProgramContentPlayEvent = (programTitle, programId, contentTitle, contentType, contentId, duration, videoDuration, event = 'mweb_library_program_content_play') => {
    console.log(event);
    qg('event', event,
    {
        duration: duration,
        video_duration: videoDuration,
        program_name: programTitle,
        program_id: programId,
        content_type: contentType,
        content_name: contentTitle,
        content_id: contentId,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const libraryProgramTabClicked = (programId, programName, tabName, event = 'mweb_library_program_tab_clicked') => {
    console.log(event);
    qg('event', event, 
    {
        program_name: programName,
        program_id: programId,
        tab_name: tabName,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const libraryProgramSeasonClicked = (programId, programName, season, event = 'mweb_library_program_season_clicked') => {
    console.log(event);
    qg('event', event, 
    {
        program_name: programName,
        program_id: programId,
        season: season,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const libraryProgramSeasonListClicked = (programId, programName, season, event = 'mweb_library_program_season_list_clicked') => {
    libraryProgramSeasonClicked(programId, programName, season, event);
};

export const libraryProgramSeasonCloseClicked = (programId, programName, season, event = 'mweb_library_program_season_close_clicked') => {
    libraryProgramSeasonClicked(programId, programName, season, event);
};

export const newsGeneralEvent = (event = 'mweb_news_logo_clicked') => {
    homeGeneralClicked(event);
};

export const newsTabClicked = (tabName, event = 'mweb_news_tab_clicked') => {
    console.log(event);
    qg('event', event, 
    {
        tab_name: tabName,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const newsArticleClicked = (articleId, articleName, category, event = 'mweb_news_article_clicked') => {
    console.log(event);
    qg('event', event, 
    {
        article_id: articleId,
        article_name: articleName,
        category: category,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const newsSearchClicked = (searchKeyword, event = 'mweb_news_search_clicked') => {
    console.log(event);
    qg('event', event, 
    {
        search_keyword: searchKeyword,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const newsRelatedArticleClicked = (articleId, articleName, category, event = 'mweb_news_related_article_clicked') => {
    newsArticleClicked(articleId, articleName, category, event);
};

export const newsRateArticleClicked = (articleId, articleName, status, tabName, event = 'mweb_news_rate_article_clicked') => {
    console.log(event);
    qg('event', event, 
    {
        article_id: articleId,
        article_name: articleName,
        status: status,
        tab_name: tabName,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const newsOriginalArticleClicked = (articleId, articleName, category, event = 'mweb_news_original_article_clicked') => {
    newsArticleClicked(articleId, articleName, category, event);
};

export const newsArticleShareClicked = (articleId, articleName, category, event = 'mweb_news_share_article_clicked') => {
    newsArticleClicked(articleId, articleName, category, event);
};

export const newsArticleBackClicked = (articleId, articleName, category, event = 'mweb_news_article_back_clicked') => {
    newsArticleClicked(articleId, articleName, category, event);
};

export const newsAddChannelClicked = (event = 'mweb_news_add_kanal_clicked') => {
    newsGeneralEvent(event);
};

export const newsTabChannelClicked = (tabName, event = 'mweb_news_tab_kanal_clicked') => {
    newsTabClicked(tabName, event);
};

export const newsAddCategoryChannelClicked = (channelName, event = 'mweb_news_add_category_kanal_clicked') => {
    console.log(event);
    qg('event', event, 
    {
        kanal_name: channelName,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const newsRemoveCategoryChannelClicked = (channelName, event = 'mweb_news_remove_category_kanal_clicked') => {
    newsAddCategoryChannelClicked(channelName, event);
};

export const searchKeywordEvent = (search, event = 'mweb_search_keyword') => {
    console.log(event);
    qg('event', event, 
    {
        search_keyword: search,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const searchTabClicked = (programId, programName, contentName, tabName, event = 'mweb_search_tab_clicked') => {
    console.log(event);
    qg('event', event, 
    {
        program_id: programId,
        program_name: programName,
        content_name: contentName,
        tab_name: tabName,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const searchBackClicked = (search, event = 'mweb_search_back_clicked') => {
    searchKeywordEvent(search, event);
};

export const searchClearKeywordClicked = (search, event = 'mweb_search_clear_keyword_clicked') => {
    searchKeywordEvent(search, event);
};

export const searchProgramBackClicked = (programId, programName, contentName, tabName, event = 'mweb_search_program_back_clicked') => {
    searchTabClicked(programId, programName, contentName, tabName, event);
};

export const searchProgramClicked = (programTitle, programId, programType, event = 'mweb_search_program_clicked') => {
    console.log(event);
    qg('event', event, 
    {
        program_name: programTitle,
        program_id: programId,
        program_type: programType,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const searchProgramRateClicked = (status, programTitle, programId, programType, event = 'mweb_search_program_rate_clicked') => {
    console.log(event);
    qg('event', event, 
    {
        status: status,
        program_name: programTitle,
        program_id: programId,
        program_type: programType,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const searchProgramShareClicked = (status, programTitle, programId, programType, event = 'mweb_search_program_share_clicked') => {
    searchProgramRateClicked(status, programTitle, programId, programType, event);
};

export const searchProgramTrailerClicked = (status, programTitle, programId, programType, event = 'mweb_search_program_trailer_clicked') => {
    searchProgramRateClicked(status, programTitle, programId, programType, event);
};

export const searchProgramAddMyListClicked = (status, programTitle, programId, programType, event = 'mweb_search_program_add_mylist_clicked') => {
    searchProgramRateClicked(status, programTitle, programId, programType, event);
};

export const searchProgramTrailerPlayEvent = (programId, programTitle, programType, duration, videoDuration, event = 'mweb_search_program_trailer_play') => {
    console.log(event);
    qg('event', event, 
    {
        program_id: programId,
        program_name: programTitle,
        program_type: programType,
        duration: duration,
        video_duration: videoDuration,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const searchProgramContentDownloadClicked = (programId, programTitle, contentTitle, contentType, contentId, event = 'mweb_search_program_content_download_clicked') => {
    libraryProgramContentDownloadClicked(programId, programTitle, contentTitle, contentType, contentId, event);
};

export const searchProgramContentShareClicked = (programId, programTitle, contentTitle, contentType, contentId, event = 'mweb_search_program_content_share_clicked') => {
    libraryProgramContentDownloadClicked(programId, programTitle, contentTitle, contentType, contentId, event);
};

export const searchProgramContentAddMyListClicked = (programId, programTitle, contentTitle, contentType, contentId, event = 'mweb_search_program_content_add_mylist_clicked') => {
    libraryProgramContentDownloadClicked(programId, programTitle, contentTitle, contentType, contentId, event);
};

export const searchProgramContentClicked = (programId, programTitle, contentTitle, contentType, contentId, event = 'mweb_search_program_content_clicked') => {
    console.log(event);
    qg('event', event, 
    {
        program_id: programId,
        program_name: programTitle,
        content_name: contentTitle,
        content_type: contentType,
        content_id: contentId,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const searchProgramContentPlayEvent = (programId, programTitle, contentTitle, contentType, contentId, duration, videoDuration, event = 'mweb_search_program_content_play') => {
    console.log(event);
    qg('event', event, 
    {
        program_id: programId,
        program_name: programTitle,
        content_name: contentTitle,
        content_type: contentType,
        content_id: contentId,
        duration: duration,
        video_duration: videoDuration,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const searchProgramTabClicked = (programId, programName, tabName, event = 'mweb_search_program_tab_clicked') => {
    console.log(event);
    qg('event', event, 
    {
        program_id: programId,
        program_name: programName,
        tab_name: tabName,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const searchProgramSeasonClicked = (programId, programName, season, event = 'mweb_search_program_season_clicked') => {
    console.log(event);
    qg('event', event, 
    {
        program_id: programId,
        program_name: programName,
        season: season,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const searchProgramSeasonListClicked = (programId, programName, season, event = 'mweb_search_program_season_list_clicked') => {
    searchProgramSeasonClicked(programId, programName, season, event);
};

export const searchProgramSeasonCloseClicked = (programId, programName, season, event = 'mweb_search_program_season_close_clicked') => {
    searchProgramSeasonClicked(programId, programName, season, event);
};

export const searchProgramRelatedScrollHorizontalEvent = (programId, programTitle, event = 'mweb_search_program_related_scroll_horizontal') => {
    console.log(event);
    qg('event', event, 
    {
        program_id: programId,
        program_name: programTitle,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};

export const searchProgramShowmoreClicked = (programId, programTitle, event = 'mweb_search_program_showmore_clicked') => {
    searchProgramRelatedScrollHorizontalEvent(programId, programTitle, event);
};

export const searchPhotoSlideNextEvent = (programId, programTitle, event = 'mweb_search_photo_slide_next') => {
    searchProgramRelatedScrollHorizontalEvent(programId, programTitle, event);
};

export const searchPhotoSlidePreviousEvent = (programId, programTitle, event = 'mweb_search_photo_slide_previous') => {
    searchProgramRelatedScrollHorizontalEvent(programId, programTitle, event);
};

export const searchScrollVerticalEvent = (event = 'mweb_search_scroll_vertical') => {
    homeGeneralClicked(event);
};

export const accountVideoProgress = (contentType, contentId, contentTitle, programTitle, genre, portraitImage, landscapeImage, startDuration, endDuration, videoDuration, event = 'mweb_account_video_finished') => {
    console.log(event);
    qg('event', event, 
    {
        content_type: contentType,
        content_id: contentId,
        content_name: contentTitle,
        genre: genre,
        program_name: programTitle,
        portrait_image: portraitImage,
        landscape_image: landscapeImage,
        start_duration: startDuration,
        end_duration: endDuration,
        video_duration: videoDuration,
        users_id: getUserId(),
        date_time: new Date().getTime() / 1000
    });
};