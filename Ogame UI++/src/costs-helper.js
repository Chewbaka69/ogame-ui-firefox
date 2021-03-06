var fn = function () {
  'use strict';
  window._addCostsHelperInterval = function _addCostsHelperInterval () {
    var worth = window.uipp_getResourcesWorth();
    var resources = window._getCurrentPlanetResources();

    if (!resources) {
      return;
    }

    var resNames = ['metal', 'crystal', 'deuterium'];
    var missingResources = {};

    let element = null;
    element = '#technologydetails_content .content';

    window._enhanceOnceOnDomChange (element, function () {
      var costs = {};
      resNames.forEach(function (res) {
        let value = null;
        value = $('.resource.' + res + '.tooltip').data('value') === undefined ? '' : $('.resource.' + res + '.tooltip').data('value').toString();
        costs[res] = window._gfNumberToJsNumber(value),
        missingResources[res] = costs[res] - resources[res].now;
      });
      if (costs.metal || costs.crystal || costs.deuterium) {
        if (window.config.features.missingresources) {
          _addRessourceCountHelper();
          //_addLimitingReagentHelper();
        }

        // for non-commanders only
        if ($('.commander.on').length === 0) {
          _addProductionBuildableInTextHelper();
          _addProductionMaximumBuildableTextHelper(costs);
        }

        if (window.config.features.minetext) {
          _addProductionEconomyTimeTextHelper(costs);
          _addProductionRentabilityTimeTextHelper(costs);
        }
      }
    });

    function _addRessourceCountHelper () {
      resNames.forEach(function (res) {
        var $element = $('.' + res + '.tooltip:not(.enhanced)').first();
        $(element + ' .costs').css('top', '110px');
        $element.css('height', '65px');
        if (missingResources[res] > 0) {
          $element.append('<div class="enhancement">-' + window._num(missingResources[res], -1 * resources[res].prod) + '</div>');
        }

        $element.addClass('enhanced');
      });
    }

    function _addLimitingReagentHelper () {
      var limitingreagent = null;
      var availableInLimitingReagent = null;
      ['metal', 'crystal', 'deuterium'].forEach(function (res) {
        var availableIn = missingResources[res] / resources[res].prod;
        if (isNaN(availableIn)) {
          availableIn = Infinity;
        }

        if (availableIn && availableIn > 0) {
          if (limitingreagent === null || availableIn > availableInLimitingReagent) {
            limitingreagent = res;
            availableInLimitingReagent = availableIn;
          }
        }
      });

      if (limitingreagent) {
        $('.' + limitingreagent + '.tooltip.enhanced:not(.limitingreagent)').addClass('limitingreagent');
      }
    }

    function _addProductionEconomyTimeTextHelper (costs) {
      var $el = null;
      $el = $('#technologydetails .content .information > ul:not(.enhanced-economy-time)')
      $el.addClass('enhanced-economy-time');

      var totalPrice = costs.metal * worth.metal
        + costs.crystal * worth.crystal
        + costs.deuterium * worth.deuterium;

      var totalProd = resources.metal.prod * worth.metal
        + resources.crystal.prod * worth.crystal
        + resources.deuterium.prod * worth.deuterium;

      $el.append('<li class="enhancement" style="margin: 0;">' + window._translate('ECONOMY_TIME', {
        time: window._time(totalPrice / totalProd)
      }) + '</li>');
    }

    function _addProductionBuildableInTextHelper () {
      var $el = null;
      $el = $('#technologydetails .content .information > ul:not(.enhanced-buildable-in)');
      $el.addClass('enhanced-buildable-in');

      let availableIn = {};

      ['metal', 'crystal', 'deuterium'].forEach(function (res) {
        let missing = missingResources[res] >= 0 ? missingResources[res] : 0;
        availableIn[res] = missing / (resources[res].prod === 0 ? 1 : resources[res].prod);
      });

      var availableInMax = Math.max(availableIn.metal, availableIn.crystal, availableIn.deuterium);

      if (availableInMax > 0) {
        $el.append('<li class="enhancement" style="margin: 0;">' + window._translate('BUILDABLE_IN', {
          time: window._time(availableInMax, -1)
        }) + '</li>');
      }
    }

    function _addProductionMaximumBuildableTextHelper (costs) {
      var $amount = null;
      $amount = $('#technologydetails .content .information .build_amount > label:not(.enhanced)');

      if ($amount.length > 0) {
        var maxMetal = resources.metal.now / costs.metal;
        var maxCrystal = resources.crystal.now / costs.crystal;
        var maxDeuterium = resources.deuterium.now / costs.deuterium;
        maxDeuterium = (isNaN(maxDeuterium) ? Infinity : maxDeuterium);
        var max = Math.floor(Math.min(maxMetal, maxCrystal, maxDeuterium));

        if (isFinite(max)) {
          $amount.append('<span class="enhancement"> (' + max + ')</span>');
        }

        $amount.addClass('enhanced');
      }
    }

    function _addProductionRentabilityTimeTextHelper () {
      var tradeRateStr = window.config.tradeRate.map(String).join(' / ');

      // if we are viewing a metal mine, computes rentability time
      if ($('#resources_1_large:not(.enhanced)').length > 0) {
        $('#content .production_info').append('<li class="enhancement">' + window._translate('ROI', {
          time: window._time(window._getRentabilityTime('metal', resources.metal.prod, resources.metal.level)),
          tradeRate: tradeRateStr
        }) + '</li>');
        $('#resources_1_large').addClass('enhanced');
      }

      // if we are viewing a crystal mine, computes rentability time
      else if ($('#resources_2_large:not(.enhanced)').length > 0) {
        $('#content .production_info').append('<li class="enhancement">' + window._translate('ROI', {
          time: window._time(window._getRentabilityTime('crystal', resources.crystal.prod, resources.crystal.level)),
          tradeRate: tradeRateStr
        }) + '</li>');
        $('#resources_2_large').addClass('enhanced');
      }

      // if we are viewing a deuterium mine, computes rentability time
      else if ($('#resources_3_large:not(.enhanced)').length > 0) {
        $('#content .production_info').append('<li class="enhancement">' + window._translate('ROI', {
          time: window._time(window._getRentabilityTime('deuterium', resources.deuterium.prod, resources.deuterium.level)),
          tradeRate: tradeRateStr
        }) + '</li>');
        $('#resources_3_large').addClass('enhanced');
      }

      // if we are viewing a plasma technology, computes rentability time
      else if ($('#research_122_large:not(.enhanced)').length > 0) {
        var technologyLevel = Number($('#content span.level').text().trim().split(' ').pop()) || 0;
        var rentabilityTime = window._getRentabilityTime('plasma', null, technologyLevel);
        $('#content .production_info').append('<li class="enhancement">' + window._translate('ROI', {
          time: window._time(rentabilityTime),
          tradeRate: tradeRateStr
        }) + '</li>');
        $('#research_122_large').addClass('enhanced');
      }
    }
  };
};

var script = document.createElement('script');
script.textContent = '(' + fn + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
