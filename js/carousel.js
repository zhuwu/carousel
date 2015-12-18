(function($) {
  var defaults = {
    elements: 'li',
    prev: '.prev',
    next: '.next',
    activeListLength: 5,
    activeStyleList: [{}, {}, {}, {}, {}],
    activeZIndexList: [2, 5, 10, 5, 2],
    activeClassList: ['side-2', 'side-1', 'active', 'side-1', 'side-2'],
    inactiveStyle: {zIndex: 0, left: 0, top: 0, width: 0},
    inactiveClass: 'hidden'
  };

  var caculateActiveList = function($carouselElementList, activeListLength, activeElementIndex) {
    var activeList = [],
        activeListCenter = (activeListLength - 1)/2,
        carouselLength = $carouselElementList.length,
        elementIndex;

    activeList[activeListCenter] = $carouselElementList.eq(activeElementIndex);

    for (var i = 0; i < activeListCenter; i++) {
      elementIndex = activeElementIndex + activeListCenter - i;
      if (elementIndex >= $carouselElementList.length) {
        elementIndex = elementIndex - carouselLength;
      }

      activeList[i] = $carouselElementList.eq(elementIndex);
    }

    for (i = activeListCenter + 1; i < activeListLength; i++) {
      elementIndex = activeElementIndex + activeListCenter - i;
      if (elementIndex < 0) {
        elementIndex = elementIndex + carouselLength;
      }

      activeList[i] = $carouselElementList.eq(elementIndex);
    }

    return activeList;
  };

  var caculateInactiveList = function($carouselElementList, activeListLength, activeElementIndex) {
    var activeIndexList = [],
        activeListCenter = (activeListLength - 1)/2,
        carouselLength = $carouselElementList.length,
        elementIndex, $inactiveElementList;

    activeIndexList[activeListCenter] = activeElementIndex;

    for (var i = 0; i < activeListCenter; i++) {
      elementIndex = activeElementIndex + activeListCenter - i;
      if (elementIndex >= $carouselElementList.length) {
        elementIndex = elementIndex - carouselLength;
      }

      activeIndexList[i] = elementIndex;
    }

    for (i = activeListCenter + 1; i < activeListLength; i++) {
      elementIndex = activeElementIndex + activeListCenter - i;
      if (elementIndex < 0) {
        elementIndex = elementIndex + carouselLength;
      }

      activeIndexList[i] = elementIndex;
    }

    $inactiveElementList = $carouselElementList.filter(function(index) {
      return $.inArray(index, activeIndexList) == -1;
    });

    return $inactiveElementList;
  };

  var updateCarousel = function (activeList, inactiveElement, activeStyleList, activeZIndexList, activeClassList, 
          inactiveStyle, inactiveClass, hasTransition) {
    $.each(activeList, function(index, $element) {
      if (!$element.hasClass(activeClassList[index])) {
        $element.removeClass();
      }

      $element.css({zIndex: activeZIndexList[index]}).addClass(activeClassList[index]);

      if (hasTransition) {
        $element.animate(activeStyleList[index]);
      } else  {
        $element.css(activeStyleList[index]);
      }
    });

    inactiveElement.removeClass().addClass(inactiveClass).css(inactiveStyle);
  };

  $.fn.initCarousel = function(opts) {
    var options = $.extend({}, defaults, opts);
    return this.each(function() {
      var $carouselHolder = $(this),
          activeElementIndex = 0,
          activeListLength = options.activeListLength,
          activeListCenter = (activeListLength - 1)/2,
          $carouselElementList = $carouselHolder.find(options.elements),
          $prev = $carouselHolder.find(options.prev),
          $next = $carouselHolder.find(options.next),
          carouselLength = $carouselElementList.length,
          activeStyleList = options.activeStyleList,
          activeZIndexList = options.activeZIndexList,
          activeClassList = options.activeClassList,
          inactiveStyle = options.inactiveStyle,
          inactiveClass = options.inactiveClass;
      updateCarousel(caculateActiveList($carouselElementList, activeListLength, activeElementIndex), 
              caculateInactiveList($carouselElementList, activeListLength, activeElementIndex),
              activeStyleList, activeZIndexList, activeClassList, inactiveStyle, inactiveClass, false, '');
      $prev.on('click', function(e) {
        e.preventDefault();
        var inactiveElementIndex = activeElementIndex + activeListCenter;
        if (inactiveElementIndex >= carouselLength) {
          inactiveElementIndex = inactiveElementIndex - carouselLength;
        }

        activeElementIndex--;
        if (activeElementIndex < 0) {
          activeElementIndex = carouselLength - 1;
        }

        updateCarousel(caculateActiveList($carouselElementList, activeListLength, activeElementIndex), 
                $carouselElementList.eq(inactiveElementIndex), activeStyleList, activeZIndexList, activeClassList, 
                inactiveStyle, inactiveClass, true);
      });

      $next.on('click', function(e) {
        e.preventDefault();
        var inactiveElementIndex = activeElementIndex - activeListCenter;
        if (inactiveElementIndex < 0) {
          inactiveElementIndex = inactiveElementIndex + carouselLength;
        }

        activeElementIndex++;
        if (activeElementIndex >= carouselLength) {
          activeElementIndex = activeElementIndex - carouselLength;
        }

        updateCarousel(caculateActiveList($carouselElementList, activeListLength, activeElementIndex), 
                $carouselElementList.eq(inactiveElementIndex), activeStyleList, activeZIndexList, activeClassList, 
                inactiveStyle, inactiveClass, true);

      });
    });
  };
} (jQuery));
