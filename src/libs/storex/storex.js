;(function(win) {
  var storage = win['localStorage'];

  var EventEmitter = (function() {
    function EventEmitter() {}

    EventEmitter.prototype.on = function(name, handler) {
      if (this.handlers == null) {
        this.handlers = {};
      }
      if (this.handlers[name] == null) {
        this.handlers[name] = [];
      }
      this.handlers[name].push(handler);
      return this;
    };

    EventEmitter.prototype.fire = function() {
      var args, handler, name, _i, _len, _ref, _results;
      name = arguments[0], args = 2 <= arguments.length ? [].slice.call(arguments, 1) : [];
      if ((this.handlers != null) && (this.handlers[name] != null)) {
        _ref = this.handlers[name];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          handler = _ref[_i];
          _results.push(handler.apply(null, args));
        }
        return _results;
      }
    };

    // Mix `Events` to object instance or Class function.
    EventEmitter.mixTo = function(receiver) {
      receiver = receiver.prototype || receiver;
      var proto = EventEmitter.prototype;
      for (var p in proto) {
        if (proto.hasOwnProperty(p)) {
          receiver[p] = proto[p];
        }
      }
    };

    return EventEmitter;

  })();

  var StoreX = function() {};

  StoreX.prototype = {
    _maxRetry: 15,

    disabled: false,

    setItem: function(key, val) {
      if (val === undefined) { return this.removeItem(key); }
      storage.setItem(key, this._serialize(val));
      return val;
    },

    getItem: function(key) {
      return this.deserialize(storage.getItem(key));
    },

    removeItem: function(key) {
      storage.removeItem(key);
    },

    clear: function() {
      storage.clear();
      this.fire('queue_key_removed');
    },

    /**
     * safe set.
     * expire - 指定过期时间，接受Date实例或13位时间戳，不指定过期时间的将永不过期；
     * force - 如果设置为true，将会强制删除最先压入堆的数据，直至写入正确；
     * _maxRetry - 最大尝试删除次数，避免无限循环；
     */
    set: function(key, value, expire, force) {
      try {
        // 为存储数据增加过期时间expire
        if (expire instanceof Date) expire = expire.getTime();
        this.setItem(key, this.serialize({
          value : value,
          expire : expire || -1
        }));
        this.addQKey(key);

        return value;
      } catch(e) {
        this.fire('full');

        if (force) {
          // 开始强制写入
          var max = this._maxRetry;   // 最大尝试删除的次数
          while (max > 0) {
            max--;
            var qkey = this.shiftQKey();
            if (qkey) {
              this.removeItem(qkey);

              if (this.set(key, value, expire) != null) {
                this.addQKey(key);
                return value;
              }
            } else {
              // 如果得到的 qkey 为undefined了，说明已经删除完了，没得可删了
              break;
            }
          }
        }
        return null;
      }
    },

    /**
     * safe get.
     * 数据过期删除
     */
    get: function (key) {
      // 如果读出的数据已过期，删除该数据
      var value = this.getItem(key);
      var rtnval = !value ? null : (typeof value.value != 'undefined' ? value.value : value);

      if (value && value.expire &&
          value.expire > 0 && value.expire < new Date().getTime()) {
        // 已过期，删除该值
        this.remove(key);
        rtnval = null;
        this.fire('expired');
      }

      return rtnval;
    },

    transact: function(key, defaultVal, transactionFn) {
      var val = this.getItem(key);

      if (transactionFn == null) {
        transactionFn = defaultVal
        defaultVal = null
      }

      if (typeof val == 'undefined') {
        val = defaultVal || {}
      }

      transactionFn(val);
      this.setItem(key, val);
    },

    getAll: function() {
      var ret = {};

      this.forEach(function(key, val) {
        ret[key] = val;
      });

      return ret;
    },

    forEach: function(callback) {
      for (var i = 0; i < storage.length; i++) {
        var key = storage.key(i);
        callback(key, this.getItem(key));
      }
    },

    status: function () {
      return {
        queueCount : this.getQueueCount(),
        enabled    : this.enabled
      };
    },

    /**
     * 本地存储队列
     */
    _queueKey: '__queue__',

    getQueue: function () {
      var queue_str = this.get(this._queueKey);
      var queue = queue_str && queue_str.split('|');

      if (queue != null) {
        for (var i = 0; i < queue.length; i++) {
          queue[i] = unescape(queue[i]);
        }
      }

      return queue || [];
    },

    setQueue: function(que) {
      try {
        for (var i = 0; i < que.length; i++) {
          que[i] = escape(que[i]);
        }

        this.setItem(this._queueKey, que.join('|'));
      } catch(e) {}
    },

    addQKey: function(key, silent) {
      var que = this.getQueue();

      if (this._getIndexOfArray(que, key) === -1) {
        // key 不存在，新增
        que.push(key);
        this.setQueue(que);
        if (!silent) this.fire('queue_key_added');
      } else {
        this.removeQKey(key, true);
        this.addQKey(key, true);
        this.fire('queue_key_updated');
      }
    },

    shiftQKey: function () {
      var que = this.getQueue();
      var key = que.shift();
      this.setQueue(que);

      this.fire('queue_key_removed');
      this.fire('queue_key_shifted');

      return key;
    },

    /**
     * silent - 不希望触发事件时置为true
     */
    removeQKey: function (key, silent) {
      var que = this.getQueue();
      var ind;

      while ((ind = this._getIndexOfArray(que, key)) !== -1) {
        que.splice(ind, 1);
      }

      this.setQueue(que);
      if(!silent) this.fire('queue_key_removed');
    },

    getQueueCount: function () {
      return this.getQueue().length;
    },

    _getIndexOfArray: function (arr, value) {
      if (arr.indexOf) return arr.indexOf(value);

      var i = 0, L = arr.length;
      while (i < L) {
        if (arr[i] === value) return i;
        ++i;
      }
      return -1;
    },

    /**
     * 序列化工具，将过期时间、长度校验等加入进去
     */
    _serialize: function (value) {
      return JSON.stringify(value);
    },

    /** 给上面序列化的结果一层包装，增加length **/
    serialize: function (value) {
      var out = this._serialize(value);
      return out.length + '|' + out;
    },

    /**
     * 反序列化工具，将过期时间、长度校验检出
     */
    deserialize: function(value) {
      // 先剔除length字段, lf = length field
      if (value != null) {
        try { value = JSON.parse(value); } catch (e) {}
        if (typeof value != 'string') return value;

        var lf = value.match(/^(\d+?)\|/);
        if (lf != null && lf.length == 2) {
          // matched
          var len = lf[1] * 1;
          value = value.replace(lf[0], '');
          if (len != value.length) {
            // throw exception
            this.fire('broken');
            return null;
          }
          // storex格式的数据解析
          try {
            value = JSON.parse(value)
          } catch(e) {
            // throw exception
            this.fire('broken');
            return null;
          }
        }
      }

      return value;
    },

    /**
     * 常用函数代理
     */
    remove: function (key) {
      // 先从队列中剔除
      this.removeQKey(key);
      this.removeItem(key);
    }
  };

  EventEmitter.mixTo(StoreX);

  var storex = new StoreX;

  try {
    var testKey = '__storexjs__'
    storex.setItem(testKey, testKey)
    if (storex.getItem(testKey) != testKey) { storex.disabled = true }
    storex.removeItem(testKey)
  } catch(e) {
    storex.disabled = true
  }
  storex.enabled = !storex.disabled

  if (typeof module != 'undefined' && module.exports && this.module !== module) { module.exports = storex }
  else if (typeof define === 'function' && define.amd) { define(storex); }
  else { win.storex = storex }

})(Function('return this')());
