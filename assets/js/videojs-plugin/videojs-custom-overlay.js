import videojs from 'video.js';
import '../../scss/videojs.scss';

const Plugin = videojs.getPlugin('plugin');
const Component = videojs.getComponent('Component');

// class CustomOverlay extends Plugin {
//   constructor(player, options) {
//     super(player, options);
//     this.setButtonPlay = player.$('.vjs-big-play-button')
//     this.player = player;
//     player.on('playing', function() {
//       videojs.log('PLAY FROM PLUGIN');
//     });
//   }
//   createEl() {
//     return videojs.createEl('div', {
//       className: 'rplus-title-bar',
//     })
//   }
//   updateTextContent(text) {
//     if (typeof text !== 'string') {
//       text = 'Title Unknown'
//     }
//     videojs.emptyEl(this.player.el());
//     videojs.appendContent(this.player.el(), text)
//   }
//   titleOverlay(title) {
//     this.player.on('useractive', () => {
//       videojs.log('USER ACTIVE', title)
//       console.log(this.setButtonPlay)
//     })
//     this.player.on('userinactive', function() {
//       videojs.log('USER INACTIVE', title)
//     })
//   }
// }
class TitleOverlay extends Component {
  constructor(player, options) {
    super(player, options);
    Component.apply(this, arguments);
      if (options.text) {
        this.updateTextContent(options.text);
      }
      player.on('useractive', () => {
        videojs.log('USER ACTIVE');
        console.log(player.$('.rplus-title-bar'));
        this.visible();
      });
      player.on('userinactive', () => {
        videojs.log('USER INACTIVE');
        if (player.hasClass('vjs-paused')) {
          this.visible();
          videojs.log('PAUSED');
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
