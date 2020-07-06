import { getUserId } from './appier';
import { setCookie, getCookie } from './cookie';
export const convivaVideoJs = (assetName, player, isLive, playerUrl, playerName, tags, cdn = '') => {
    console.log('TAGS',tags)
    return {
        assetName: assetName,
        player: player,
        sessionId: getCookie('CONVIVA_SESSION_ID'),
        createSession: function() {
            // this.cleanUpSession();
            const assetName = this.assetName;
            let convivaMetadata = new Conviva.ConvivaContentInfo(assetName, tags);
            convivaMetadata.streamUrl = playerUrl;
            if (cdn) {
                convivaMetadata.cdn = cdn;
            }
            if (isLive === true) {
                convivaMetadata.isLive = isLive;
            }
            else {
                convivaMetadata.isLive = false;
                convivaMetadata.duration = isLive;
            }
            
            convivaMetadata.playerName = 'RCTI+ MWEB';
            convivaMetadata.viewerId = getUserId().toString();

            const streamer = new Conviva.ConvivaVideojsStreamerProxy(this.player);
            this.sessionId = Conviva.LivePass.createSession(streamer, convivaMetadata);
            console.log('CONVIVA SESSION CREATED WITH ID', this.sessionId);
            setCookie('CONVIVA_SESSION_ID', this.sessionId);
            return this.sessionId;
        },
        cleanUpSession: function() {
            const sessionId = getCookie('CONVIVA_SESSION_ID');
            console.log('CLEAN UP SESSION: ' + sessionId);
            if (sessionId != null) {
                Conviva.LivePass.cleanupSession(sessionId);
                this.sessionId = null;
            }
        }
    };
};

export const convivaJwPlayer = (assetName = null, player = null, duration = null, playerUrl = null, tags = {}, cdn = 'Anevia') => {
    console.log('TAGS',tags)
    console.log('TAGS 2',assetName)
    return {
        assetName: assetName,
        player: player,
        sessionId: getCookie('CONVIVA_SESSION_ID'),
        createSession: function() {
            console.log('CREATE SESSION CONVIVA')
            let convivaVideoAnalytics = null;
            if(convivaVideoAnalytics === null) {
                switch (process.env.MODE) {
                    case 'DEVELOPMENT':
                        const settings = {  };
                        settings[Conviva.Constants.GATEWAY_URL] = 'https://rcti-test.testonly.conviva.com';
                        settings[Conviva.Constants.LOG_LEVEL] = Conviva.Constants.LogLevel.DEBUG;
                        Conviva.Analytics.init('ffc2bacab709e3c5eedc49af6520b33d3c204182', null, settings);
                        break;
    
                    case 'PRODUCTION':
                        Conviva.Analytics.init('ff84ae928c3b33064b76dec08f12500465e59a6f');
                        break;
                }
                convivaVideoAnalytics = Conviva.Analytics.buildVideoAnalytics();
                window.convivaVideoAnalytics = convivaVideoAnalytics;
                const contentInfo = {};
                console.log('CONVIVA: ', Conviva)
                contentInfo[Conviva.Constants.ASSET_NAME] = assetName;
                contentInfo[Conviva.Constants.PLAYER_NAME] = "JWPLAYER";
                contentInfo[Conviva.Constants.DURATION] = 30;
                contentInfo[Conviva.Constants.STREAM_URL] = playerUrl;
                // contentInfo["CDN"] = cdn;
                contentInfo[Conviva.Constants.IS_LIVE] = Conviva.Constants.StreamType.VOD;
                contentInfo[Conviva.Constants.VIEWER_ID] = getUserId().toString();
                const playerInfo = {};
                playerInfo[Conviva.Constants.FRAMEWORK_NAME] = "HTML5";
                playerInfo[Conviva.Constants.FRAMEWORK_VERSION] = "NaForHTML5";
                convivaVideoAnalytics.setPlayerInfo(playerInfo);
                convivaVideoAnalytics.reportPlaybackRequested({...contentInfo, ...tags});
                convivaVideoAnalytics.setCallback(function () {
                    if (convivaVideoAnalytics != null) {
                        if (player) {
                            convivaVideoAnalytics.reportPlaybackMetric(Conviva.Constants.Playback.PLAY_HEAD_TIME, duration * 1000);
                            convivaVideoAnalytics.reportPlaybackMetric(Conviva.Constants.Playback.BUFFER_LENGTH, player.getBuffer());
                        }
                    }
                });
            }
        },
        updateMetaData: function(value) {
            console.log('UPDATE METADATA CONVIVA')
            const convivaVideoAnalytics = Conviva.Analytics.buildVideoAnalytics();
            if(convivaVideoAnalytics != null) {
                convivaVideoAnalytics.setContentInfo(value);
            }
        },
        cleanUpSession: function() {
            console.log('CLEANUP CONVIVA')
            window.convivaVideoAnalytics.release();
            Conviva.Analytics.release();
        },
        playing: function() {
            if(window.convivaVideoAnalytics) {
            console.log('CONVIVA PLAYING')
                window.convivaVideoAnalytics.reportPlaybackMetric(Conviva.Constants.Playback.PLAYER_STATE, Conviva.Constants.PlayerState.PLAYING);
            }
        },
        pause: function() {
            if(window.convivaVideoAnalytics) {
            console.log('CONVIVA PLAYING')
                window.convivaVideoAnalytics.reportPlaybackMetric(Conviva.Constants.Playback.PLAYER_STATE, Conviva.Constants.PlayerState.PAUSED);
            }
        },
        buffer: function() {
            if(window.convivaVideoAnalytics) {
            console.log('CONVIVA PLAYING')
                window.convivaVideoAnalytics.reportPlaybackMetric(Conviva.Constants.Playback.PLAYER_STATE, Conviva.Constants.PlayerState.BUFFERING);
            }
        },
    };
};

// const getBufferLength = () => {
//     var buffered = videoPlayer.buffered;
//     if (buffered === undefined) return;

//     var bufferLength = 0;
//     for (var i = 0; i < buffered.length; i++) {
//         var start = buffered.start(i);
//         var end = buffered.end(i);
//         if (start <= _s.videoPlayer.currentTime && _s.videoPlayer.currentTime < end) {
//             bufferLength += end - _s.videoPlayer.currentTime;
//         }
//     }
//     return bufferLength * 1000;
// }