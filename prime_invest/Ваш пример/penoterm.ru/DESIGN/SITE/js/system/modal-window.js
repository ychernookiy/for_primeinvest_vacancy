;
var Site = Site || {};

(function(global, window, $, undefined) {
    'use strict';

    var Modal = function() {

        this.cache = [];
        this.popup = {};
        this.config = {};
        this.defaultConfig = {
            id: null,
            title: null,
            $container: $('body'),
            url: null,
            content: null,
            closeOnBgClick: true,
            cache: false,
            reopen: false,
            extendClass: null,
            before: function() {},
            after: function() {},
            once: function() {}
        }
    };

    Modal.prototype.open = function(config) {

        this.config = $.extend({}, this.defaultConfig, config);

        if (this.config.cache === true && this.config.id === null) {
            throw new Error('You have to set the id of your popup');
        }

        this.before.call(this);
        this.init.call(this);
    };

    Modal.prototype.close = function(id) {

        switch (typeof id) {
            case 'undefined':
                if (this.popup.$modalWindowWrap) {
                    this.popup.$modalWindowWrap.detach();
                }
                break;
            case 'string':
                if (typeof this.cache[id] !== 'undefined') {
                    if (this.cache[id].$modalWindowWrap) {
                        this.cache[id].$modalWindowWrap.detach();
                    }
                }
                break;
            case 'number':
                if (typeof this.cache[id] !== 'undefined') {
                    if (this.cache[id].$modalWindowWrap) {
                        this.cache[id].$modalWindowWrap.detach();
                    }
                }
                break;
            case 'object':
                if (id) {
                    id.detach();
                }
                break;
        }

        if (this.config.$container) {
            this.config.$container
                .removeClass('blocked')
                .css({
                    overflow: ''
                });
        }
    };

    Modal.prototype.closeAll = function() {

    };

    Modal.prototype.init = function() {

        if (this.config.id !== null && typeof this.cache[this.config.id] !== 'undefined') {

            this.popup = this.cache[this.config.id];
            this.insert.call(this);
            this.after.call(this);

        } else {

            this.popup = this.build.call(this);
            this.fetch.call(this);
            this.insert.call(this);
        }
    };

    Modal.prototype.build = function() {

        var popup = {};

        popup.once = false;

        popup.$modalWindowWrap = $('<div class="modal-window-wrap"></div>');
        popup.$modalWindow = $('<div class="modal-window"></div>');
        popup.$modalWindowHeader = $('<div class="modal-window-header">' + this.config.title + '</div>');
        popup.$modalWindowCloseButton = $('<span class="modal-window-close" title="Закрыть окно"></span>');
        popup.$modalWindowBody = $('<div class="modal-window-body"></div>');
        popup.$modalWindowWrap.append(popup.$modalWindow);
        if (this.config.title !== null) {
            popup.$modalWindowHeader.append(popup.$modalWindowCloseButton);
            popup.$modalWindow.append(popup.$modalWindowHeader);
        }
        if (this.config.extendClass !== null) {
            popup.$modalWindow.addClass(this.config.extendClass);
        }
        popup.$modalWindow.append(popup.$modalWindowBody);

        return popup;
    };

    Modal.prototype.fetch = function() {

        if (this.config.url !== null) {

            this.popup.$modalWindow.addClass('modal-window_status_loading');

            $.get(this.config.url, function(data) {

                this.popup.$modalWindow.removeClass('modal-window_status_loading');
                this.popup.$modalWindowBody.html(data);
                this.after.call(this);

            }.bind(this), 'html');

        } else {

            if (this.config.content !== null) {
                this.popup.$modalWindowBody.append(this.config.content);
                this.after.call(this);
            } else {
                throw new Error('You have to set a content or an url in config');
            }
        }
    };

    Modal.prototype.insert = function() {

        this.config.$container = typeof this.config.$container === 'object' ?
            this.config.$container :
            $(this.config.$container);

        this.config.$container
            .addClass('blocked')
            .css({
                overflow: 'hidden'
            });

        this.config.$container.append(this.popup.$modalWindowWrap);
    };

    Modal.prototype.caching = function() {

        if (this.config.cache === true) {
            this.cache[this.config.id] = this.popup;
        }
    };

    Modal.prototype.handlers = function() {
        if (this.config.closeOnBgClick === true) {
            this.popup.$modalWindowWrap.on('click', function(e) {
                if (e.target == this.popup.$modalWindowWrap[0]) {
                    this.close.call(this);
                }
            }.bind(this));
        }
        this.popup.$modalWindowCloseButton.on('click', function() {
            this.close.call(this);
        }.bind(this));
    };

    Modal.prototype.before = function() {

        this.config.before();
    };

    Modal.prototype.after = function() {
        if (!this.popup.once) {
            this.popup.once = true;
            this.config.once(this.popup, this.config);
        }
        this.config.after(this.popup, this.config);
        this.handlers.call(this);
        this.caching.call(this);
    };

    global.modal = new Modal();

})(Site, window, jQuery);