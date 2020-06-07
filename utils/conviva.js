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