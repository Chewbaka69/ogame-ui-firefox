var fn = function () {
  'use strict';

  window._parseResearchTab = function _parseResearchTab () {
    if (document.location.href.indexOf('research') === -1) {
      return;
    }

    window.config.combustionDrive = Number($('[data-technology=115] .level').data('value'));
    window.config.plasmaTech = Number($('[data-technology=122] .level').data('value'));
    window.config.astroTech = Number($('[data-technology=124] .level').data('value'));
    window.config.computerTech = Number($('[data-technology=108] .level').data('value'));
    
    window._saveConfig();
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
