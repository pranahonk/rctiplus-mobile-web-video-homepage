import videojs from 'video.js';
import '../../scss/videojs.scss';
import Playicon from './playIcon';
import PauseIcon from './pauseIcon';

const Plugin = videojs.getPlugin('plugin');
const Component = videojs.getComponent('Component');
const Button = videojs.getComponent('Button');
const PlayToggle = videojs.getComponent('PlayToggle');
const VolumeMenuButton = videojs.getComponent('MuteToggle');

// export class PlayButton extends Plugin {
//   constructor(player, options) {
//     super(player, options);
//     this.player = player;
//     player.on('playing', function() {
//       videojs.log('PLAY FROM PLUGIN');
//       const el = player.el();
//       el.createEl('div', {
//         className: 'rplus-play-button',
//       });
//     });
//     player.on('useractive', () => {
//       videojs.log('USER ACTIVE');
//     });
//     player.on('userinactive', () => {
//       videojs.log('USER INACTIVE');
//     });
//   }
//   createEl() {
//     return videojs.dom.createEl('div', {
//       className: 'rplus-play-button',
//     });
//   }
// }
export const MuteToggleCustom = videojs.extend(VolumeMenuButton, {
  constructor: function(player, options) {
    VolumeMenuButton.apply(this, arguments);
    this.addClass('rplus-button-mute');
    this.init();
    player.on('volumechange', (e) => {
      if (player.muted()) {
        this.showButton();
        return;
      }
      this.hideButton();
    });
  },
  init() {
    this.el().innerText = 'TAP TO UNMUTE';
  },
  hideButton() {
    this.el().style.visibility = 'hidden';
  },
  showButton() {
    this.el().style.visibility = 'visible';
  },
});
export const PlayToggleCustom = videojs.extend(PlayToggle, {
  constructor: function(player, options) {
    PlayToggle.apply(this, arguments);
    this.addClass('rplus-play-toggle');
    this.init();
    player.on('play', () => {
      videojs.log('USER CLICK PLAY');
      this.initIconPause();
    });
    player.on('pause', () => {
      videojs.log('USER CLICK PAUSE');
      this.initIconPlay();
    });
    player.on('useractive', () => {
      videojs.log('USER ACTIVE');
      if (player.hasClass('vjs-waiting')) {
        this.hideButton();
        return;
      }
      this.showButton();

    });
    player.on('userinactive', () => {
      videojs.log('USER INACTIVE');
      player.$('.vjs-quality-selector ');
      if (player.hasClass('vjs-paused')) {
        this.showButton();
        return;
      }
      this.hideButton();
    });
    player.on('waiting', () => {
      videojs.log('DATA WAITING');
      this.hideButton();
    });
  },
  initIconPlay() {
    this.el().innerHTML = Playicon();
  },
  initIconPause() {
    this.el().innerHTML = PauseIcon();
  },
  init() {
    this.el().innerHTML = Playicon();
  },
  hideButton() {
    this.el().style.visibility = 'hidden';
  },
  showButton() {
    this.el().style.visibility = 'visible';
  },
});

class TitleOverlay extends Component {
  constructor(player, options) {
    super(player, options);
    Component.apply(this, arguments);
      if (options.text) {
        this.updateTextContent(options.text);
      }
      player.on('useractive', () => {
        this.visible();
      });
      player.on('userinactive', () => {
        if (player.hasClass('vjs-paused')) {
          this.visible();
          return;
        }
        this.hidden();
      });
  }
  createEl() {
    return videojs.dom.createEl('div', {
      className: 'rplus-title-bar',
    });
  }
  visible() {
    this.el().style.visibility = 'visible';
  }
  hidden() {
    this.el().style.visibility = 'hidden';
  }
  updateTextContent(text) {
  if (typeof text !== 'string') {
    text = 'Title Unknown';
  }
  videojs.dom.emptyEl(this.el());
  videojs.dom.appendContent(this.el(), text);
  }
}

export default TitleOverlay;
