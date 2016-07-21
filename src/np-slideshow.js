/* globals module, require, define */

(function(root, factory) {
  'use strict';

  if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = factory(require('angular'));
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['angular'], factory);
  } else {
    // Global Variables
    factory(root.angular, root.jQuery);
  }
}(window, function(angular, $) {
  'use strict';

  var appModule;

  try {
    appModule = angular.module('ng-pros');
  } catch (error) {
    appModule = angular.module('ng-pros', []);
  }

  appModule.directive('npSlideshow', function() {
    return {
      scope: {
        npSlideshow: '=',
        npSlideWidth: '@',
        npSlideMargin: '@',
        npSlideHeight: '@'
      },
      restrict: 'A',
      template: '<ul class="np-slideshow">' +
        '<li class="slide"></li>' +
        '<li class="slide"></li>' +
        '<li class="slide"></li>' +
        '</ul>' +
        '<ul class="np-slideshow">' +
        '<li class="overlay"><button ng-click="animate(true)"><</button></li>' +
        '<li class="overlay"><button ng-click="animate()">></button></li>' +
        '</ul>',
      link: function(scope, element) {
        var slideWidth = scope.npSlideWidth ?
          parseInt(scope.npSlideWidth, 10) :
          800;

        var slideHeight = scope.npSlideHeight ?
          parseInt(scope.npSlideHeight, 10) :
          600;

        var slideMargin = scope.npSlideMargin ?
          parseInt(scope.npSlideMargin, 10) :
          5;

        var animDur = scope.npAnimationDuration ?
          parseInt(scope.npAnimationDuration, 10) :
          0.5;

        var listElement = $(element.children()[0]);

        listElement.children().css('width', slideWidth);
        listElement.children('li + li').css('margin-left', slideMargin);

        var data = scope.npSlideshow;

        var current;

        var overlayElement = $(element.children()[1]);
        overlayElement.height(slideHeight);
        overlayElement.children().width(slideWidth);
        overlayElement.children().height(slideHeight);

        function resizeHandler() {
          var windowWidth = element.width();

          var cumulativeWidth = slideWidth * 3 + slideMargin * 2;

          var marginLeft = windowWidth > cumulativeWidth ? cumulativeWidth :
            (windowWidth - cumulativeWidth) / 2;

          $(listElement.children()[0]).css('margin-left', marginLeft);

          overlayElement.children().first().css('margin-left', marginLeft);
          overlayElement.children().last()
            .css('left', slideWidth + slideMargin * 2);

        }

        function animate(isPrevious) {
          var toAdd;
          var dataLength = data.length;

          if (isPrevious) {
            toAdd =
              (current - 2) < 0 ?
              dataLength - Math.abs(current - 2) :
              current - 2;

            var firstMargin = listElement.children().first().css('margin-left');

            listElement.children().first().css('margin-left', slideMargin);

            listElement.prepend(
              '<li class="slide" style="width: ' + slideWidth + 'px;">' +
              '<img src="' + data[toAdd].src + '">' +
              '</li>'
            );

            listElement.children().first()
              .css(
                'margin-left',
                parseInt(firstMargin.replace('px', ''), 10) - slideWidth -
                slideMargin
              );

            $(listElement.children()[0]).animate({
              'margin-left': '+=' + (slideWidth + slideMargin)
            }, animDur * 1000, function() {
              listElement.children().last().remove();

              current = --current < 0 ? dataLength - 1 : current;

              resizeHandler();
            });
          } else {
            toAdd = (current + 2) % dataLength;

            listElement.append(
              '<li class="slide" style="width: ' + slideWidth + 'px;">' +
              '<img src="' + data[toAdd].src + '">' +
              '</li>'
            );

            listElement.children().last().css('margin-left', slideMargin);

            listElement.children().first().animate({
              'margin-left': '-=' + (slideWidth + slideMargin)
            }, animDur * 1000, function() {
              listElement.children().first().remove();

              current = ++current % dataLength;

              resizeHandler();
            });
          }
        }

        $(window).resize(resizeHandler);

        resizeHandler();

        // var counter = -1;
        // var toggler = true;

        /*setInterval(function() {
          if (++counter % 3 === 0) {
            toggler = !toggler;
          }
          animate(toggler);
        }, 5000);*/

        scope.$watch('npSlideshow', function() {
          data = scope.npSlideshow;

          if (data && data.length) {
            var dataLength = data.length;

            current = 0;

            $(listElement.children()[1])
              .html('<img src="' + data[0].src + '">');

            if (dataLength > 1) {
              $(listElement.children()[2])
                .html('<img src="' + data[1].src + '">');

              if (dataLength > 2) {
                $(listElement.children()[0])
                  .html('<img src="' + data[dataLength - 1].src + '">');
              }
            }
          }
        });

        scope.animate = animate;
      }
    };
  });
}));
