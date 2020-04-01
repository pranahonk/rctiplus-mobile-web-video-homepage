import { getUserId } from './appier';

export const convivaVideoJs = (assetName, player, isLive, playerUrl, playerName, tags) => {
    return {
        assetName: assetName,
        player: player,
        sessionId: null,
        createSession: function() {
            this.cleanUpSession();
			
            const assetName = this.assetName.toUpperCase();
            let convivaMetadata = new Conviva.ConvivaContentInfo(assetName, tags);
            convivaMetadata.streamUrl = playerUrl;
            if (isLive === true) {
                convivaMetadata.isLive = isLive;
            }
            else {
                convivaMetadata.isLive = false;
                convivaMetadata.duration = isLive;
            }
            
            convivaMetadata.playerName = playerName;
            convivaMetadata.viewerId = getUserId();

            const streamer = new Conviva.ConvivaVideojsStreamerProxy(this.player);
            this.sessionId = Conviva.LivePass.createSession(streamer, convivaMetadata);
        },
        cleanUpSession: function() {
            if (this.sessionId != null) {
                Conviva.LivePass.cleanupSession(this.sessionId);
                this.sessionId = null;
            }
        }
    };
};