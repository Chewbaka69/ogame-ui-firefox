var fn = function () {
  'use strict';
  var _cachedResources = null;

  window._getCurrentPlanetResources = function _getCurrentPlanetResources () {
    if (_cachedResources) {
      return _cachedResources;
    }

    var currentPlanetCoordinatesStr = '[' + window._getCurrentPlanetCoordinates().join(':') + ']';
    if ($('meta[name=ogame-planet-type]').attr('content') === 'moon') {
      currentPlanetCoordinatesStr += 'L';
    }

    var currentPlanet = window.config.my.planets[currentPlanetCoordinatesStr];
    var tradeRate = window.config.tradeRate;

    var resources = {
      lastUpdate: Date.now(),
      metal: {
        now: 0,
        max: 0,
        prod: 0,
        worth: (
          (Math.min(tradeRate[0], tradeRate[1], tradeRate[2]) / tradeRate[0]) *
          Math.max(tradeRate[0], tradeRate[1], tradeRate[2]) * 100
        ) / 100,
        level: (currentPlanet && currentPlanet.resources) ? currentPlanet.resources.metal.level : 0
      },
      crystal: {
        now: 0,
        max: 0,
        prod: 0,
        worth: (
          (Math.min(tradeRate[0], tradeRate[1], tradeRate[2]) / tradeRate[1]) *
          Math.max(tradeRate[0], tradeRate[1], tradeRate[2]) * 100
        ) / 100,
        level: (currentPlanet && currentPlanet.resources) ? currentPlanet.resources.crystal.level : 0
      },
      deuterium: {
        now: 0,
        max: 0,
        prod: 0,
        worth: (
          (Math.min(tradeRate[0], tradeRate[1], tradeRate[2]) / tradeRate[2]) *
          Math.max(tradeRate[0], tradeRate[1], tradeRate[2]) * 100
        ) / 100,
        level: (currentPlanet && currentPlanet.resources) ? currentPlanet.resources.deuterium.level : 0
      }
    };

    // parse resources data from the DOM and sets the resources object
    let f = null;

    f = [...document.querySelectorAll('script')].find(e => e.innerText.includes('reloadResources')).innerText;
    f = f.replace(/(.|\n)+reloadResources\(/gi, '');
    f = f.replace(/\)\;\n|\s\}\)\(jQuery\)\;/gi, '');

    let data = JSON.parse(f);
    let dataResources = data.resources;

    let tmp = null;

    resources.metal.now = dataResources.metal.amount;
    resources.metal.max = dataResources.metal.storage;
    tmp = parseInt($($(dataResources.metal.tooltip.split('|')[1]).find('tr').get(2)).find('td span').text().replace(/\+|\-/i, ''));
    resources.metal.prod = tmp / 3600;

    resources.crystal.now = dataResources.crystal.amount;
    resources.crystal.max = dataResources.crystal.storage;
    tmp = parseInt($($(dataResources.crystal.tooltip.split('|')[1]).find('tr').get(2)).find('td span').text().replace(/\+|\-/i, ''));
    resources.crystal.prod = tmp / 3600;

    resources.deuterium.now = dataResources.deuterium.amount;
    resources.deuterium.max = dataResources.deuterium.storage;
    tmp = parseInt($($(dataResources.deuterium.tooltip.split('|')[1]).find('tr').get(2)).find('td span').text().replace(/\+|\-/i, ''));
    resources.deuterium.prod = tmp / 3600;

    // if on the resources page, update the planet's resource levels
    if (document.location.search.indexOf('supplies') !== -1) {
      // get mines level
      resources.metal.level = parseInt($('#producers li[data-technology="1"]').data('technology'));
      resources.crystal.level = parseInt($('#producers li[data-technology="2"]').data('technology'));
      resources.deuterium.level = parseInt($('#producers li[data-technology="3"]').data('technology'));
    }

    window.config.my.planets[currentPlanetCoordinatesStr].resources = resources;
    window._saveConfig();

    _cachedResources = resources;
    return resources;
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
