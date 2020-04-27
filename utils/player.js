export const triggerQualityButtonClick = (type = '') => {
  const qualitySelectorElement = document.getElementsByClassName('vjs-quality-selector');
  if (qualitySelectorElement.length > 0) {
      const childs = qualitySelectorElement[0].childNodes;
      for (let i = 0; i < childs.length; i++) {
          if (childs[i].className == 'vjs-menu-button vjs-menu-button-popup vjs-button' && type == 'inactive') {
              childs[i].click();
              break;
          }
      }
  }
}

