import Control from 'ol/control/Control';
import { CENTRO, VIEW_CONFIG } from '../rules';

export class RecenterControl extends Control {
  constructor(opt_options) {
    const options = opt_options || {};

    const button = document.createElement('button');
    button.innerHTML = '⌖';
    button.title = 'Centralizar mapa';

    const element = document.createElement('div');
    element.className = 'ol-unselectable ol-control top-[65px] left-[0.5em]';
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });

    button.addEventListener('click', () => {
      this.getMap().getView().animate({ center: CENTRO, zoom: VIEW_CONFIG.zoom, duration: 500 });
    });
  }
}