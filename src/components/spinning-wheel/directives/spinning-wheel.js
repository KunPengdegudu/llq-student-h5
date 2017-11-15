define([
    'angular',
    'jq',
    'text!components/spinning-wheel/views/spinning-wheel-tpl.html',
    'services/backdrop/backdrop'], function (angular, $, spinningWheelTpl) {
    'use strict';

    angular.module('components.spinningWheel', ['services.backdrop'])
        .directive('uiSpinningWheel', ['$rootScope', 'backdrop', function ($rootScope, backdrop) {
            return {
                restrict: 'EA',
                templateUrl: function (tElement, tAttrs) {
                    return tAttrs.templateUrl;
                },
                compile: function compile(tElement, tAttrs) {
                    tElement.addClass('ui-sw');
                    if (tAttrs.zIndex) {    // z-index
                        var zIndex = parseInt(tAttrs.zIndex || '1000');
                        tElement.css('z-index', zIndex);
                    }

                    function SpinningWheel() {
                        this.overlay = tAttrs.overlay !== 'false';                  // 是否显示蒙版
                        this.visible = false;                                       // sw是否显示

                        this.cellHeight = 44;
                        this.friction = 0.003;
                        this.slotData = [];

                        this.isInit = false;

                        this.attrs = {};

                    }

                    SpinningWheel.prototype.isVisible = function () {
                        return this.visible;
                    };

                    SpinningWheel.prototype.setVisible = function (v) {
                        this.visible = v;
                    };


                    /**
                     *
                     * Event handler
                     *
                     */
                    SpinningWheel.prototype.handleEvent = function (e) {

                        if (e.type == 'touchstart') {
                            this.lockScreen(e);
                            if ($(e.currentTarget).hasClass('ui-sw-cancel') || $(e.currentTarget).hasClass('ui-sw-done')) {
                                this.tapDown(e);
                            } else if (e.currentTarget.className == 'ui-sw-frame') {
                                this.scrollStart(e);
                            }
                        } else if (e.type == 'touchmove') {
                            this.lockScreen(e);
                            if ($(e.currentTarget).hasClass('ui-sw-cancel') || $(e.currentTarget).hasClass('ui-sw-done')) {
                                this.tapCancel(e);
                            } else if (e.currentTarget.className == 'ui-sw-frame') {
                                this.scrollMove(e);
                            }
                        } else if (e.type == 'touchend') {
                            if ($(e.currentTarget).hasClass('ui-sw-cancel') || $(e.currentTarget).hasClass('ui-sw-done')) {
                                this.tapUp(e);
                            } else if (e.currentTarget.className == 'ui-sw-frame') {
                                this.scrollEnd(e);
                            }
                        } else if (e.type == 'webkitTransitionEnd') {
                            if (e.target.className == 'ui-sw-wrapper') {
                                this.destroy();
                            } else {
                                this.backWithinBoundaries(e);
                            }
                        } else if (e.type == 'orientationchange') {
                            this.onOrientationChange(e);
                        } else if (e.type == 'scroll') {
                            this.onScroll(e);
                        }
                    };


                    /**
                     *
                     * Global events
                     *
                     */
                    SpinningWheel.prototype.onOrientationChange = function (e) {
                        window.scrollTo(0, 0);
                        this.swWrapper.style.top = window.innerHeight + window.pageYOffset + 'px';
                        this.calculateSlotsWidth();
                    };

                    SpinningWheel.prototype.onScroll = function (e) {
                        this.swWrapper.style.top = window.innerHeight + window.pageYOffset + 'px';
                    };

                    SpinningWheel.prototype.lockScreen = function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    };


                    /**
                     *
                     * Initialization
                     *
                     */
                    SpinningWheel.prototype.reset = function () {
                        this.slotEl = [];

                        this.activeSlot = null;

                        this.swWrapper = undefined;
                        this.swHeader = undefined;
                        this.swSlotWrapper = undefined;
                        this.swSlots = undefined;
                        this.swFrame = undefined;

                        this.swCancel = undefined;
                        this.swDone = undefined;
                    };

                    SpinningWheel.prototype.calculateSlotsWidth = function () {
                        var div = this.swSlots.getElementsByTagName('div');
                        for (var i = 0; i < div.length; i += 1) {
                            this.slotEl[i].slotWidth = div[i].offsetWidth;
                        }
                    };

                    SpinningWheel.prototype.getByClass = function (oParent, sClass) {
                        var aEle = oParent.getElementsByTagName('*');
                        var re = new RegExp("\\b" + sClass + "\\b", "g");
                        var aResult = [];
                        for (var i = 0; i < aEle.length; i++) {
                            if (re.test(aEle[i].className)) {
                                aResult.push(aEle[i]);
                            }
                        }
                        return aResult;
                    };

                    SpinningWheel.prototype.create = function () {

                        if (this.isInit) {
                            return;
                        }


                        var i, l, out, ul, div;

                        this.reset();	// Initialize object variables

                        this.swWrapper = tElement[0];                                            // The SW wrapper
                        this.swHeader = this.getByClass(this.swWrapper, "ui-sw-header")[0];
                        this.swSlotWrapper = this.getByClass(this.swWrapper, "ui-sw-slots-wrapper")[0];           // Slots visible area
                        this.swSlots = this.getByClass(this.swSlotWrapper, "ui-sw-slots")[0];                         // Pseudo table element (inner wrapper)
                        this.swFrame = this.getByClass(this.swWrapper, "ui-sw-frame")[0];                         // The scrolling controller

                        this.swWrapper.style.display = 'block';

                        // Create the Spinning Wheel main wrapper
                        this.swWrapper.style.top = window.innerHeight + window.pageYOffset + 'px';		// Place the SW down the actual viewing screen
                        this.swWrapper.style.webkitTransitionProperty = '-webkit-transform';

                        // Create HTML slot elements
                        for (l = 0; l < this.slotData.length; l += 1) {
                            // Create the slot
                            ul = document.createElement('ul');
                            out = '';
                            for (i in this.slotData[l].values) {
                                out += '<li>' + this.slotData[l].values[i] + '<' + '/li>';
                            }
                            ul.innerHTML = out;

                            div = document.createElement('div');		// Create slot container
                            div.className = this.slotData[l].style;		// Add styles to the container
                            div.appendChild(ul);

                            // Append the slot to the wrapper
                            this.swSlots.appendChild(div);

                            ul.slotPosition = l;			// Save the slot position inside the wrapper
                            ul.slotYPosition = 0;
                            ul.slotWidth = 0;
                            ul.slotMaxScroll = this.swSlotWrapper.clientHeight - ul.clientHeight - 86;
                            ul.style.webkitTransitionTimingFunction = 'cubic-bezier(0, 0, 0.2, 1)';		// Add default transition

                            this.slotEl.push(ul);			// Save the slot for later use

                            // Place the slot to its default position (if other than 0)
                            if (this.slotData[l].defaultValue) {
                                this.scrollToValue(l, this.slotData[l].defaultValue);
                            }
                        }

                        this.calculateSlotsWidth();

                        // Global events
                        //document.addEventListener('touchstart', this, false);			// Prevent page scrolling
                        //document.addEventListener('touchmove', this, false);			// Prevent page scrolling
                        //window.addEventListener('orientationchange', this, true);		// Optimize SW on orientation change
                        //window.addEventListener('scroll', this, true);				// Reposition SW on page scroll

                        // Cancel/Done buttons events
                        this.swCancel = this.getByClass(this.swHeader, "ui-sw-cancel")[0],
                            this.swDone = this.getByClass(this.swHeader, "ui-sw-done")[0];
                        this.swCancel.addEventListener('touchstart', this, false);
                        this.swDone.addEventListener('touchstart', this, false);

                        // Add scrolling to the slots
                        this.swFrame.addEventListener('touchstart', this, false);


                        this.isInit = true;
                    };

                    SpinningWheel.prototype.open = function () {
                        this.create();

                        if (this.overlay) {
                            backdrop.showMask();
                        }
                        this.setVisible(true);
                        this.swWrapper.style.webkitTransitionTimingFunction = 'ease-out';
                        this.swWrapper.style.webkitTransitionDuration = '400ms';
                        this.swWrapper.style.webkitTransform = 'translate3d(0, -260px, 0)';
                    };


                    /**
                     *
                     * Unload
                     *
                     */
                    SpinningWheel.prototype.destroy = function () {
                        //this.swWrapper.removeEventListener('webkitTransitionEnd', this, false);
                    };

                    SpinningWheel.prototype.close = function () {
                        if (this.overlay) {
                            backdrop.hideMask();
                        }

                        this.setVisible(false);
                        this.swWrapper.style.webkitTransitionTimingFunction = 'ease-in';
                        this.swWrapper.style.webkitTransitionDuration = '400ms';
                        this.swWrapper.style.webkitTransform = 'translate3d(0, 0, 0)';

                        this.swWrapper.addEventListener('webkitTransitionEnd', this, false);
                    };


                    /**
                     *
                     * Generic methods
                     *
                     */
                    SpinningWheel.prototype.addSlot = function (values, style, defaultValue) {
                        if (!style) {
                            style = '';
                        }

                        style = style.split(' ');

                        for (var i = 0; i < style.length; i += 1) {
                            style[i] = 'sw-' + style[i];
                        }

                        style = style.join(' ');

                        var obj = {'values': values, 'style': style, 'defaultValue': defaultValue};
                        this.slotData.push(obj);
                    };

                    SpinningWheel.prototype.setSelectedValues = function (vals) {
                        for (var i = 0; i < vals.length; i++) {
                            if (vals[i] !== undefined) {
                                this.scrollToValue(i, vals[i]);
                            }
                        }
                    }

                    SpinningWheel.prototype.getSelectedValues = function () {
                        var index, count,
                            i, l,
                            keys = [], values = [];

                        for (i in this.slotEl) {
                            // Remove any residual animation
                            this.slotEl[i].removeEventListener('webkitTransitionEnd', this, false);
                            this.slotEl[i].style.webkitTransitionDuration = '0';

                            if (this.slotEl[i].slotYPosition > 0) {
                                this.setPosition(i, 0);
                            } else if (this.slotEl[i].slotYPosition < this.slotEl[i].slotMaxScroll) {
                                this.setPosition(i, this.slotEl[i].slotMaxScroll);
                            }

                            index = -Math.round(this.slotEl[i].slotYPosition / this.cellHeight);

                            count = 0;
                            for (l in this.slotData[i].values) {
                                if (count == index) {
                                    keys.push(l);
                                    values.push(this.slotData[i].values[l]);
                                    break;
                                }

                                count += 1;
                            }
                        }

                        return {'keys': keys, 'values': values};
                    };


                    /**
                     *
                     * Rolling slots
                     *
                     */
                    SpinningWheel.prototype.setPosition = function (slot, pos) {
                        this.slotEl[slot].slotYPosition = pos;
                        this.slotEl[slot].style.webkitTransform = 'translate3d(0, ' + pos + 'px, 0)';
                    };

                    SpinningWheel.prototype.scrollStart = function (e) {
                        // Find the clicked slot
                        var xPos = e.targetTouches[0].clientX - this.swSlots.offsetLeft;	// Clicked position minus left offset (should be 11px)

                        // Find tapped slot
                        var slot = 0;
                        for (var i = 0; i < this.slotEl.length; i += 1) {
                            slot += this.slotEl[i].slotWidth;

                            if (xPos < slot) {
                                this.activeSlot = i;
                                break;
                            }
                        }

                        // If slot is readonly do nothing
                        if (this.slotData[this.activeSlot].style.match('readonly')) {
                            this.swFrame.removeEventListener('touchmove', this, false);
                            this.swFrame.removeEventListener('touchend', this, false);
                            return false;
                        }

                        this.slotEl[this.activeSlot].removeEventListener('webkitTransitionEnd', this, false);	// Remove transition event (if any)
                        this.slotEl[this.activeSlot].style.webkitTransitionDuration = '0';		// Remove any residual transition

                        // Stop and hold slot position
                        var theTransform = window.getComputedStyle(this.slotEl[this.activeSlot]).webkitTransform;
                        theTransform = new WebKitCSSMatrix(theTransform).m42;
                        if (theTransform != this.slotEl[this.activeSlot].slotYPosition) {
                            this.setPosition(this.activeSlot, theTransform);
                        }

                        this.startY = e.targetTouches[0].clientY;
                        this.scrollStartY = this.slotEl[this.activeSlot].slotYPosition;
                        this.scrollStartTime = e.timeStamp;

                        this.swFrame.addEventListener('touchmove', this, false);
                        this.swFrame.addEventListener('touchend', this, false);

                        return true;
                    };

                    SpinningWheel.prototype.scrollMove = function (e) {
                        var topDelta = e.targetTouches[0].clientY - this.startY;

                        if (this.slotEl[this.activeSlot].slotYPosition > 0 || this.slotEl[this.activeSlot].slotYPosition < this.slotEl[this.activeSlot].slotMaxScroll) {
                            topDelta /= 2;
                        }

                        this.setPosition(this.activeSlot, this.slotEl[this.activeSlot].slotYPosition + topDelta);
                        this.startY = e.targetTouches[0].clientY;

                        // Prevent slingshot effect
                        if (e.timeStamp - this.scrollStartTime > 80) {
                            this.scrollStartY = this.slotEl[this.activeSlot].slotYPosition;
                            this.scrollStartTime = e.timeStamp;
                        }
                    };

                    SpinningWheel.prototype.scrollEnd = function (e) {
                        this.swFrame.removeEventListener('touchmove', this, false);
                        this.swFrame.removeEventListener('touchend', this, false);

                        // If we are outside of the boundaries, let's go back to the sheepfold
                        if (this.slotEl[this.activeSlot].slotYPosition > 0 || this.slotEl[this.activeSlot].slotYPosition < this.slotEl[this.activeSlot].slotMaxScroll) {
                            this.scrollTo(this.activeSlot, this.slotEl[this.activeSlot].slotYPosition > 0 ? 0 : this.slotEl[this.activeSlot].slotMaxScroll);
                            return false;
                        }

                        // Lame formula to calculate a fake deceleration
                        var scrollDistance = this.slotEl[this.activeSlot].slotYPosition - this.scrollStartY;

                        // The drag session was too short
                        if (scrollDistance < this.cellHeight / 1.5 && scrollDistance > -this.cellHeight / 1.5) {
                            if (this.slotEl[this.activeSlot].slotYPosition % this.cellHeight) {
                                this.scrollTo(this.activeSlot, Math.round(this.slotEl[this.activeSlot].slotYPosition / this.cellHeight) * this.cellHeight, '100ms');
                            }

                            return false;
                        }

                        var scrollDuration = e.timeStamp - this.scrollStartTime;

                        var newDuration = (2 * scrollDistance / scrollDuration) / this.friction;
                        var newScrollDistance = (this.friction / 2) * (newDuration * newDuration);

                        if (newDuration < 0) {
                            newDuration = -newDuration;
                            newScrollDistance = -newScrollDistance;
                        }

                        var newPosition = this.slotEl[this.activeSlot].slotYPosition + newScrollDistance;

                        if (newPosition > 0) {
                            // Prevent the slot to be dragged outside the visible area (top margin)
                            newPosition /= 2;
                            newDuration /= 3;

                            if (newPosition > this.swSlotWrapper.clientHeight / 4) {
                                newPosition = this.swSlotWrapper.clientHeight / 4;
                            }
                        } else if (newPosition < this.slotEl[this.activeSlot].slotMaxScroll) {
                            // Prevent the slot to be dragged outside the visible area (bottom margin)
                            newPosition = (newPosition - this.slotEl[this.activeSlot].slotMaxScroll) / 2 + this.slotEl[this.activeSlot].slotMaxScroll;
                            newDuration /= 3;

                            if (newPosition < this.slotEl[this.activeSlot].slotMaxScroll - this.swSlotWrapper.clientHeight / 4) {
                                newPosition = this.slotEl[this.activeSlot].slotMaxScroll - this.swSlotWrapper.clientHeight / 4;
                            }
                        } else {
                            newPosition = Math.round(newPosition / this.cellHeight) * this.cellHeight;
                        }

                        this.scrollTo(this.activeSlot, Math.round(newPosition), Math.round(newDuration) + 'ms');

                        return true;
                    };

                    SpinningWheel.prototype.scrollTo = function (slotNum, dest, runtime) {
                        if (slotNum === undefined) {
                            return;
                        }

                        this.slotEl[slotNum].style.webkitTransitionDuration = runtime ? runtime : '100ms';
                        this.setPosition(slotNum, dest ? dest : 0);

                        // If we are outside of the boundaries go back to the sheepfold
                        if (this.slotEl[slotNum].slotYPosition > 0 || this.slotEl[slotNum].slotYPosition < this.slotEl[slotNum].slotMaxScroll) {
                            this.slotEl[slotNum].addEventListener('webkitTransitionEnd', this, false);
                        }
                    };

                    SpinningWheel.prototype.scrollToValue = function (slot, value) {
                        var yPos, count, i;

                        this.slotEl[slot].removeEventListener('webkitTransitionEnd', this, false);
                        this.slotEl[slot].style.webkitTransitionDuration = '0';

                        count = 0;
                        for (i in this.slotData[slot].values) {
                            if (i == value) {
                                yPos = count * this.cellHeight;
                                this.setPosition(slot, yPos);
                                break;
                            }

                            count -= 1;
                        }
                    };

                    SpinningWheel.prototype.backWithinBoundaries = function (e) {
                        e.target.removeEventListener('webkitTransitionEnd', this, false);

                        this.scrollTo(e.target.slotPosition, e.target.slotYPosition > 0 ? 0 : e.target.slotMaxScroll, '150ms');
                        return false;
                    };


                    /**
                     *
                     * Buttons
                     *
                     */
                    SpinningWheel.prototype.tapDown = function (e) {
                        e.currentTarget.addEventListener('touchmove', this, false);
                        e.currentTarget.addEventListener('touchend', this, false);
                        $(e.currentTarget).addClass('ui-sw-pressed');
                    };

                    SpinningWheel.prototype.tapCancel = function (e) {
                        e.currentTarget.removeEventListener('touchmove', this, false);
                        e.currentTarget.removeEventListener('touchend', this, false);
                        $(e.currentTarget).removeClass('ui-sw-pressed');

                        if ($(e.currentTarget).hasClass('ui-sw-cancel')) {
                            this.cancelAction();
                        } else {
                            this.doneAction();
                        }
                        this.close();
                    };

                    SpinningWheel.prototype.tapUp = function (e) {
                        this.tapCancel(e);
                    };

                    SpinningWheel.prototype.setCancelAction = function (action) {
                        this.cancelAction = action;
                    };

                    SpinningWheel.prototype.setDoneAction = function (action) {
                        this.doneAction = action;
                    };

                    SpinningWheel.prototype.cancelAction = function () {
                        return false;
                    };

                    SpinningWheel.prototype.cancelDone = function () {
                        return true;
                    };


                    var sw = new SpinningWheel()
                        , closeByOverlay = tAttrs.closeByOverlay !== 'false';   // 点击对话框外部区域是否关闭对话框;

                    return function postLink(scope, element, attrs) {

                        function onClick() {
                            if (sw.isVisible()) {
                                if (attrs.beforeHide && scope.$eval(attrs.beforeHide) !== true) {
                                    return false;
                                }
                                scope.$apply(function () {
                                    scope.$eval(attrs.isVisible + '=false');
                                });
                            }
                        }

                        function onVisibleChange(isVisible) {
                            var isSwVisible = sw.isVisible();
                            if (isVisible && !isSwVisible) {
                                sw.open();
                                if (attrs.getValues) {
                                    var values = scope.$eval(attrs.getValues);
                                    if (values) {
                                        sw.setSelectedValues(values);
                                    }
                                }
                            } else if (!isVisible && isSwVisible) {
                                sw.close();
                            }
                        }

                        function cancelAction() {
                            scope.$apply(function () {
                                scope.$eval(attrs.isVisible + '=false');
                            });
                        }

                        function doneAction() {
                            scope.$apply(function () {
                                scope.$eval(attrs.isVisible + '=false');
                                scope.selectValues = sw.getSelectedValues();
                                scope.$eval(attrs.setValues);

                            });
                        }

                        // watch attrs.isVisible
                        var unWatch = scope.$watch(attrs.isVisible, onVisibleChange);

                        // listen to click event
                        if (closeByOverlay) {
                            $rootScope.$on('backdrop.click', onClick);
                        }


                        // init
                        onVisibleChange(scope.$eval(attrs.isVisible));


                        // slotData
                        var slotData = scope.$eval(attrs.slotData);

                        function addSlotData(slotData) {
                            for (var i = 0; i < slotData.length; i++) {
                                sw.addSlot(slotData[i].values, slotData[i].style, slotData[i].defaultValue);
                            }
                        }

                        var unWatchData = scope.$watch(attrs.slotData, function () {
                            sw.isInit = false;
                            slotData = scope.$eval(attrs.slotData);
                            addSlotData(slotData);
                        }, true);

                        scope.$on('$destroy', function () {
                            if (sw.isVisible()) {
                                sw.close(); // 关闭全局蒙版的显示
                            }
                            unWatch();
                            unWatchData();
                        });

                        sw.setCancelAction(cancelAction);
                        sw.setDoneAction(doneAction);

                    };
                }
            };
        }])
        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('components/spinning-wheel/views/spinning-wheel-tpl.html', spinningWheelTpl);
        }]);

})
;