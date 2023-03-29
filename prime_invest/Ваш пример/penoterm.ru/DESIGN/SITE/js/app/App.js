;
var App = {
    components: {},
    classes: {},
    modules: {},
    system: {}
};

App.define = function(namespace) {
    var parts = namespace.split("."),
        parent = App,
        i;

    // убрать начальный префикс если это имя глобальной переменной
    if (parts[0] == "App") {
        parts = parts.slice(1);
    }

    // если в глобальном объекте нет свойства - создать его.
    for (i = 0; i < parts.length; i++) {
        if (typeof parent[parts[i]] == "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};

$(document).ready(function() {
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $('.to-top').fadeIn();
        } else {
            $('.to-top').fadeOut();
        }
    });
    $('.to-top').on('click', function() {
        $('html, body').animate({
            scrollTop: 0
        }, 400);
    });
});