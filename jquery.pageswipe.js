/**
 * pageSwipe 1.1
 * https://github.com/torkiljohnsen/swipe
 *
 * Adapted from https://github.com/sgentile/jquery.swipe
 * Borrowed some ideas from https://github.com/bradbirdsall/Swipe
 * Modelled after http://www.virgentech.com/blog/2009/10/building-object-oriented-jquery-plugin.html
 *
 * Dual licensed under the MIT and GPL licenses
 */

(function($){
    var Swipeable = function(element, options)
    {
        var plugin   = this;
        var page     = $(element);
        var defaults = {
            minSwipeLength  : 20, // the shortest distance, in % of the page width, that user must swipe to move the page
            snapPosition    : 85  // number of % left/right that the page will be moved on a successful swipe. If set to 100%, the page will disappear completely.
        };

        plugin.config = {};

        var init = function() {
            plugin.config = $.extend(defaults, options || {});
            plugin.state  = {
                touchesCount            : 0,         // number of fingers that are touching
                startTouchXPosition     : 0,         // initial start location  x
                startTouchYPosition     : 0,         // initial start location  x
                deltaX                  : 0,         // horizontal movement
                elementPosition         : undefined,
                currentXTouchPosition   : 0,
                currentYTouchPosition   : 0,
                swipeLength             : 0,
                previousPosition        : {},
                isScrolling             : undefined
            };
            attach();
        };

        var attach = function () {

            // attach handlers to events
            page.on({
                "touchstart": function(event) {
                    // http://stackoverflow.com/questions/671498/jquery-live-removing-iphone-touch-event-attributes
                    touchStart(event.originalEvent);
                },
                "touchmove": function(event) {
                    touchMove(event.originalEvent);
                },
                "touchcancel": function(event) {
                    touchCancel(event.originalEvent);
                },
                "touchend": function(event) {
                    touchEnd(event.originalEvent);
                }
            });

            // Windows 8 touch support
            if (window.navigator.msPointerEnabled) {
                page.on({
                    "MSPointerCancel": function(event) {
                        touchCancel(event.originalEvent);
                    },
                    "MSPointerDown": function(event) {
                        touchStart(event.originalEvent);
                    },
                    "MSPointerMove": function(event) {
                        touchMove(event.originalEvent);
                    },
                    "MSPointerOut": function(event) {
                        touchCancel(event.originalEvent);
                    },
                    "MSPointerUp": function(event) {
                        touchEnd(event.originalEvent);
                    }
                });
            }
        };

        var touchStart = function(event) {

            var state = plugin.state;

            // get the total number of fingers touching the screen
            state.touchesCount = event.touches.length;

            // since we're looking for a swipe (single finger) and not a gesture (multiple fingers),
            // check that only one finger was used
            if (state.touchesCount == 1) {
                
                // reset some pr swipe variables
                state.isScrolling = undefined;
                state.deltaX      = 0;

                // get the elements current position
                if (typeof state.elementPosition == 'undefined') {
                    state.elementPosition = page.position().left;
                }

                // get the coordinates of the touch
                state.startTouchXPosition = event.touches[0].pageX;
                state.startTouchYPosition = event.touches[0].pageY;

            } else {
                // not one finger touching, so cancel
                touchCancel(event);
            }
        };

        var touchMove = function(event) {
            
            var state = plugin.state;

            // One finger is swiping
            if (state.touchesCount == 1) {

                state.currentXTouchPosition = event.touches[0].pageX;
                state.currentYTouchPosition = event.touches[0].pageY;

                state.deltaX = state.currentXTouchPosition - state.startTouchXPosition;
                var deltaY   = state.currentYTouchPosition - state.startTouchYPosition;

                if (typeof state.isScrolling == 'undefined') {
                    state.isScrolling = !!(state.isScrolling || Math.abs(state.deltaX) < Math.abs(deltaY));
                }
                
                // move the element 
                if (!state.isScrolling) {
                    event.preventDefault();

                    page.css('left', state.elementPosition + state.deltaX); // let the element follow the finger
                }
            } else {
                // not one finger touching, so cancel
                touchCancel(event);
            }
        };

        var touchEnd = function(event) {

            var state = plugin.state;
            
            // Check that we aren't scrolling and that we have X-axis movement with one finger touching
            if (!state.isScrolling && state.deltaX != 0 && state.touchesCount == 1 && state.currentXTouchPosition != 0) {
                
                // should we perform a swipe or snap back to old position?
                var elementWidth        = page.width();
                var requiredSwipeLength = elementWidth * (plugin.config.minSwipeLength/100);            // swipe length required to move the page
                var distance            = Math.round(elementWidth * plugin.config.snapPosition/100);    // distance to snap position
                var endPosition         = 0;

                if (Math.abs(state.deltaX) > requiredSwipeLength) {
                    // Snap page into new position
                    if (state.deltaX < 0 && state.elementPosition >= 0) {
                        endPosition = state.elementPosition - distance;
                    } else if (state.deltaX > 0 && state.elementPosition <= 0) {
                        endPosition = state.elementPosition + distance;
                    } else {
                        endPosition = state.elementPosition;
                    }
                } else {
                    // Swipe too short, snap back into old position
                    endPosition = state.elementPosition;
                }

                alert(endPosition);

                // Animate the snap
                page.animate({left: endPosition}, 350, 'easeOutQuint', function() {
                    // update the state on complete
                    state.elementPosition = endPosition;
                }); 
            } else {
                // we're either scrolling, do not have one finger touching or have no X-axis movement, so cancel
                self.touchCancel(event);
            }
        };

        var touchCancel = function(event) {
            plugin.state = $extend(plugin.state, {
                touchesCount            : 0, // number of fingers that are touching
                startTouchXPosition     : 0, // initial start location  x
                startTouchYPosition     : 0, // initial start location  x
                currentXTouchPosition   : 0,
                currentYTouchPosition   : 0
            });
        };

        init();
    };

    $.fn.swipeable = function(options)
    {
        return this.each(function() {
           var element = $(this);
          
           // Return early if this element already has a plugin instance
           if (element.data('swipeable')) return;

           // pass options to plugin constructor
           var swipeable = new Swipeable(this, options);

           // Store plugin object in this element's data
           element.data('swipeable', swipeable);
        });
    };
})(jQuery);

/*
(function($) {
    $.fn.pageSwipe = function() {

        // Set options
        var defaults = {
            minSwipeLength      : 20, // the shortest distance, in % of the page width, that user must swipe to move the page
            snapPosition        : 85  // number of % left/right that the page will be moved on a successful swipe. If set to 100%, the page will disappear completely.
        };

        var options = $.extend(defaults, options);
    
        return this.each(function() {

            var page = $(this);

            // attach handlers to events
            page.on({
                "touchstart": function(event) {
                    // http://stackoverflow.com/questions/671498/jquery-live-removing-iphone-touch-event-attributes
                    this.touchStart(event.originalEvent);
                },
                "touchmove": function(event) {
                    this.touchMove(event.originalEvent);
                },
                "touchcancel": function(event) {
                    this.touchCancel(event.originalEvent);
                },
                "touchend": function(event) {
                    this.touchEnd(event.originalEvent, function (swipe) {
                        this._trigger("swiped", event, { swipeDirection: swipe });
                    });
                }
            });

            // Windows 8 touch support
            if (window.navigator.msPointerEnabled) {
                page.on({
                    "MSPointerCancel": function(event) {
                        this.touchCancel(event.originalEvent);
                       
                    },
                    "MSPointerDown": function(event) {
                        this.touchStart(event.originalEvent);
                    },
                    "MSPointerMove": function(event) {
                        this.touchMove(event.originalEvent);

                    },
                    "MSPointerOut": function(event) {
                        this.touchCancel(event.originalEvent);
                       
                    },
                    "MSPointerUp": function(event) {
                        this.touchEnd(event.originalEvent, function(swipe) {
                            this._trigger("swiped", event, { swipeDirection: swipe });
                        });
                    }
                });
            }

        });
    
    };
})(jQuery);*/