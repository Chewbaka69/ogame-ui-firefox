var fn = function () {
  'use strict';

  window._parseResearchTab = function _parseResearchTab () {
    if (document.location.href.indexOf('research') === -1) {
      return;
    }

    if(document.querySelector('meta[name="ogame-version"]').content.startsWith('7.')) {
      window.config.combustionDrive = Number($('[data-technology=115] .level').data('value'));
      window.config.plasmaTech = Number($('[data-technology=122] .level').data('value'));
      window.config.astroTech = Number($('[data-technology=124] .level').data('value'));
      window.config.computerTech = Number($('[data-technology=108] .level').data('value'));
    } else {
      window.config.combustionDrive = Number($('[ref=115] .level').text().match(/\d+/g)[0]);
      window.config.plasmaTech = Number($('[ref=122] .level').text().match(/\d+/g)[0]);
      window.config.astroTech = Number($('[ref=124] .level').text().match(/\d+/g)[0]);
      window.config.computerTech = Number($('[ref=108] .level').text().match(/\d+/g)[0]);
    }

    window._saveConfig();
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
