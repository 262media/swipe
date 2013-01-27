# Port of Swipeable jQuery plugin to Zepto

An attempt at an implementation the **layered approach mobile navigation pattern** that can be seen in for instance the [Path app](https://path.com/). Swipeable is for use on responsive websites, so unlike a native app it has (or rather, will have) fallbacks for non-touch and non-JS devices. 

## Background

On smaller devices, screen real estate is hard to come by. Navigation often gets in the way of content. With Swipeable, I'm trying to move the navigation out of the way, while still letting it be easily accessible. I'm doing this by implementing a navigation that's _progressively enhanced_:

### 1. Basic functionality

When no touch or Javascript support is available, navigation should follow the [footer anchor pattern](http://bradfrostweb.com/blog/web/responsive-nav-patterns/#footer-anchor). This means that the navigation is placed in the bottom of the page, and that a button in the top of the page with an achor link, will take you to the navigation.

### 2. Enhance 1: With Javascript

If javascript support is detected, the navigation layer should be placed on a lower z-index than the main content, and placed below it, while the "extra" layer (contact info for instance), should be put on an even lower z-index and underneath as well. This will allow you to click the "MENU" button to slide the main content right to reveal the main menu, and click the button "CONTACT" to slide the content and menu to the left to reveal the contact info layer.

### 3. Enhance 2: With touch

If the device supports touch, then touch support is added so that revealing the menu or the contact info can be done by swiping right and left.


### Made this  fork to fix the iOS6 bug 
#### re-implements setTimeout, setInterval, clearTimeout, clearInterval for iOS6.
#### iOS6 suffers from a bug that kills timers that are created while a page is scrolling.
###### timers recreation  after scrolling finishes (with interval correction)
