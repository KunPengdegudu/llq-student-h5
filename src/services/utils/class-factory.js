define(['angular'], function(angular) {
  'use strict';

  angular
      .module('services.classFactory', [])
      .factory('classFactory', [function() {
        // ClassFactory
        // -----------------
        // Thanks to:
        //  - http://mootools.net/docs/core/Class/Class
        //  - http://ejohn.org/blog/simple-javascript-inheritance/
        //  - https://github.com/ded/klass
        //  - http://documentcloud.github.com/backbone/#Model-extend
        //  - https://github.com/joyent/node/blob/master/lib/util.js
        //  - https://github.com/kissyteam/kissy/blob/master/src/seed/src/kissy.js
        // The base Class implementation.
        function ClassFactory(o) {
            // Convert existed function to ClassFactory.
            if (!(this instanceof ClassFactory) && isFunction(o)) {
                return classify(o);
            }
        }

        // Create a new ClassFactory.
        //
        //  var SuperPig = ClassFactory.create({
        //    Extends: Animal,
        //    Implements: Flyable,
        //    initialize: function() {
        //      SuperPig.superclass.initialize.apply(this, arguments)
        //    },
        //    Statics: {
        //      COLOR: 'red'
        //    }
        // })
        //
        ClassFactory.create = function(parent, properties) {
            if (!isFunction(parent)) {
                properties = parent;
                parent = null;
            }
            properties || (properties = {});
            parent || (parent = properties.Extends || ClassFactory);
            properties.Extends = parent;
            // The created class constructor
            function SubClass() {
                // Call the parent constructor.
                parent.apply(this, arguments);
                // Only call initialize in self constructor.
                if (this.constructor === SubClass && this.initialize) {
                    this.initialize.apply(this, arguments);
                }
            }
            // Inherit class (static) properties from parent.
            if (parent !== ClassFactory) {
                mix(SubClass, parent, parent.StaticsWhiteList);
            }
            // Add instance properties to the subclass.
            implement.call(SubClass, properties);
            // Make subclass extendable.
            return classify(SubClass);
        };
        function implement(properties) {
            var key, value;
            for (key in properties) {
                value = properties[key];
                if (ClassFactory.Mutators.hasOwnProperty(key)) {
                    ClassFactory.Mutators[key].call(this, value);
                } else {
                    this.prototype[key] = value;
                }
            }
        }
        // Create a sub Class based on `ClassFactory`.
        ClassFactory.extend = function(properties) {
            properties || (properties = {});
            properties.Extends = this;
            return ClassFactory.create(properties);
        };
        function classify(cls) {
            cls.extend = ClassFactory.extend;
            cls.implement = implement;
            return cls;
        }
        // Mutators define special properties.
        ClassFactory.Mutators = {
            Extends: function(parent) {
                var existed = this.prototype;
                var proto = createProto(parent.prototype);
                // Keep existed properties.
                mix(proto, existed);
                // Enforce the constructor to be what we expect.
                proto.constructor = this;
                // Set the prototype chain to inherit from `parent`.
                this.prototype = proto;
                // Set a convenience property in case the parent's prototype is
                // needed later.
                this.superclass = parent.prototype;
            },
            Implements: function(items) {
                isArray(items) || (items = [ items ]);
                var proto = this.prototype, item;
                while (item = items.shift()) {
                    mix(proto, item.prototype || item);
                }
            },
            Statics: function(staticProperties) {
                mix(this, staticProperties);
            }
        };
        // Shared empty constructor function to aid in prototype-chain creation.
        function Ctor() {}
        // See: http://jsperf.com/object-create-vs-new-ctor
        var createProto = Object.__proto__ ? function(proto) {
            return {
                __proto__: proto
            };
        } : function(proto) {
            Ctor.prototype = proto;
            return new Ctor();
        };
        // Helpers
        // ------------
        function mix(r, s, wl) {
            // Copy 'all' properties including inherited ones.
            for (var p in s) {
                if (s.hasOwnProperty(p)) {
                    if (wl && indexOf(wl, p) === -1) {continue};
                    // 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
                    if (p !== 'prototype') {
                        r[p] = s[p];
                    }
                }
            }
        }
        var toString = Object.prototype.toString;
        var isArray = Array.isArray || function(val) {
            return toString.call(val) === '[object Array]';
        };
        var isFunction = function(val) {
            return toString.call(val) === '[object Function]';
        };
        var indexOf = Array.prototype.indexOf ? function(arr, item) {
            return arr.indexOf(item);
        } : function(arr, item) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i] === item) {
                    return i;
                }
            }
            return -1;
        };
        return ClassFactory;
      }]);
});

