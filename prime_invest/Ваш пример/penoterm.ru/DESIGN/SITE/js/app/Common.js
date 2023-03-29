;
var Site = Site || {};
(function(global, window, document, $, undefined) {
    App.define('modules.common');

    var Common = function() {

        this.$document = $(document);

        this.bindEvents();
    };

    //-----------------------------------------------------
    // Event handlers
    //-----------------------------------------------------

    Common.prototype.bindEvents = function() {
        var instance = this;

        $(document).ready(function() {
            $.fancybox.defaults.hash = false;
        });

        $(document).on({
            click: function(e) {
                e.preventDefault();
                console.log($(this).data('key'));
                $('[data-fancybox="' + $(this).data('gal') + '"][data-key="' + $(this).data('key') + '"]').click();

            }
        }, '.js-fancyboxView');

        $('table.table').wrap('<div class="table-scroll-wrap"><div></div></div>');

        $("input[name=phone]").mask("+7-999-999-99-99");
        // $('.js-integer-inp').numberMask();


        $(window).resize(function() {
            instance.marginLeftMainSlider();
        });


    };

    Common.prototype.init_sliders = function() {
        var instance = this,
            $mainSlider = $('.js-main-slider'),
            $popularSlider = $('.js-popular-slider');


        if ($mainSlider.length) {

            $mainSlider.slick({
                dots: true,
                arrows: false,
                infinite: true,
                speed: 300,
                autoplay: true
            });



        }

        if ($popularSlider.length) {

            $popularSlider.slick({
                dots: true,
                arrows: false,
                infinite: true,
                speed: 300,
                slidesToShow: 4,
                slidesToScroll: 4,
                responsive: [{
                        breakpoint: 1200,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3
                        }
                    },
                    {
                        breakpoint: 992,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            dots: false
                        }
                    }
                ]
            });

        }


    };

    Common.prototype.init_select2 = function() {
        var instance = this,
            $select2 = $('.js-select2');


        if ($select2.length)
            $select2.select2({
                minimumResultsForSearch: 10
            });

    };

    Common.prototype.marginLeftMainSlider = function() {
        var marginLeftPx = ($(document).width() - $('.wrap').width()) / 2;
        $('.main-slider-text').css('marginLeft', marginLeftPx + 'px');

    };

    Common.prototype.tabs = function() {
        var instance = this;

        $(document).on({
            click: function() {
                var tabsTop = $(this),
                    tabsContent = $(this).closest('.tabs').find('.tabsContent > *'),
                    tabsIndex = tabsTop.index();

                tabsTop.siblings().removeClass('active');
                tabsTop.addClass('active');

                tabsContent.removeClass('active');
                $(tabsContent[tabsIndex]).addClass('active');

                return false;
            }
        }, '.tabsButtons > *');

    };


    Common.prototype.control_header = function() {
        var instance = this,
            scrollTop = $(window).scrollTop(),
            $header = $('header');

        $header.removeClass('header_scroll');

        if (scrollTop >= 60)
            $header.addClass('header_scroll');

    };


    Common.prototype.toggleMenu = function() {
        var instance = this;

        $(document).on({
            click: function(e) {
                e.preventDefault();



                var $this = $(this),
                    type = $this.data('type'),
                    $hiddenBlock = $('.js-toggleMenuWrap[data-type="' + type + '"]');

                $hiddenBlock.toggleClass('open');

            }
        }, '.js-toggleMenuBtn');

        $(document).on({
            click: function(e) {
                e.preventDefault();



                var $this = $(this),
                    type = $this.data('type'),
                    $hiddenBlock = $('.js-toggleMenuMobileWrap[data-type="' + type + '"]');

                $hiddenBlock.toggleClass('hidden');
                $this.toggleClass('open');

            }
        }, '.js-toggleMenuMobileBtn');
    };

    Common.prototype.toggleBlock = function() {
        var instance = this;

        $(document).on({
            click: function(e) {
                e.preventDefault();

                var $this = $(this),
                    type = $this.data('type'),
                    $hiddenBlock = $('.js-toggleBlockWrap[data-type="' + type + '"]');

                if ($hiddenBlock.hasClass('open')) {
                    $hiddenBlock.removeClass('open');
                    $('html').removeClass('fixed');
                } else {
                    $hiddenBlock.addClass('open');
                    $('html').addClass('fixed');
                }

            }
        }, '.js-toggleBlockBtn');
    };


    Common.prototype.popup = function() {

        var instance = this;

        $(document).on({
            click: function(e) {
                e.preventDefault();
                global.modal.close();

                return false;
            }
        }, '.js-close_modal,.js-too_close_modal');

        //вызов всплывашек
        $(document).on({
            click: function() {
                var id = 0,
                    url = '',
                    type = $(this).data('type');

                if ($(this).data('url') != undefined)
                    url = $(this).data('url');

                if ($(this).data('id') != undefined)
                    id = $(this).data('id');

                App.components.api.fetch(
                    '/api/form.popup/', {
                        data: {
                            id: id,
                            type: type,
                            url: url
                        },
                        successCallback: function(response) {
                            global.modal.close();
                            global.modal.open({
                                content: response.data.template,
                                after: function() {
                                    setTimeout(function() {
                                        $("input[name=phone]").mask("+7-999-999-99-99");
                                        instance.init_select2();
                                        instance.initUpload('js-addPhoto', 'js-filelist', 1, 5, "doc,docx,xls,xlsx,pdf,rar,zip", true);
                                    }, 0);
                                }
                            });
                        }
                    }
                );

                return false;
            }
        }, '.js-pop_up');
    };

    Common.prototype.send_form = function() {

        var instance = this;

        //отправка форм
        $(document).on({
            submit: function() {
                var $parentForm = $(this).closest('form'),
                    $buttonSubmit = $parentForm.find('button[type=submit]'),
                    textButtonSubmit = $buttonSubmit.text(),
                    formWrap = $(this).closest('.js-formWrap'),
                    action = $parentForm.attr('action');

                if ($parentForm.hasClass('loading')) return false;

                $parentForm.addClass('loading');
                $buttonSubmit.text('Отправка...').attr({
                    'disable': 'disable'
                });

                App.components.api.fetch(
                    action, {
                        data: $parentForm.serialize(),
                        successCallback: function(response) {
                            if (response.data.link != undefined) {
                                window.location.href = response.data.link;
                            }

                            if (response.data.close_popup != undefined) {
                                global.modal.close();
                            }

                            if (response.data.templatePopUp != undefined) {

                                global.modal.open({
                                    'content': response.data.templatePopUp
                                });

                                if (response.data.addClassPopUp != undefined) {
                                    $('.modal-window-wrap').addClass(response.data.addClassPopUp);
                                }
                            }

                            if (response.data.content != undefined) {
                                formWrap.html(response.data.content);
                            }

                            if (response.data.clearForm != undefined) {
                                $parentForm.find('input[type=text]').val('');
                                $parentForm.find('textarea').text('').val('');
                                $parentForm.find('.error').removeClass('error');
                                $parentForm.find('.error-text').remove();
                                $parentForm.removeClass('loading');
                                $buttonSubmit.text(textButtonSubmit).removeAttr('disable');
                            }
                        },
                        errorCallback: function(response) {
                            instance.showErrForm(response.data, '#' + $parentForm.attr('id'));
                            setTimeout(function() {
                                $parentForm.removeClass('loading');
                                $buttonSubmit.text(textButtonSubmit).removeAttr('disable');
                            }, 300);
                        }
                    }
                );

                return false;
            }

        }, '.js-form_action');
        //end отправка форм

    };

    Common.prototype.showErrForm = function(data, form) {
        var emptyErr = true;

        $('.error', form).removeClass('error');
        $('.error-text', form).remove();
        if (typeof data.errors != "undefined") {
            $.each(data.errors, function(id, err) {
                emptyErr = false;
                var input = $('input[name=' + id + '][type=text],input[name=' + id + '][type=password],textarea[name=' + id + '],select[name=' + id + '],input[name=' + id + '][type=checkbox]', form);

                input.addClass('error').closest('label').append('<b class="error-text">' + err + '</b>');

            });

        }

        return emptyErr;
    };

    Common.prototype.heightBlock = function() {
        $('.js-wrap_heightBlock').each(function() {
            var $heightBlocks = $(this).find('.js-heightBlock'),
                maxHeight = 0;
            $heightBlocks.each(function() {
                var thisHeight = $(this).height();
                if (thisHeight > maxHeight)
                    maxHeight = thisHeight;
            });

            $heightBlocks.height(maxHeight);
        });
    };






    Common.prototype.filterCatalog = function() {
        var that = this,
            $checkboxes = $('.js-filter-checkbox');



        //клики по чекбоксам
        $checkboxes.on('change', function() {
            var $this = $(this);
            that.selectFilter($this.data('type'));
        });


        //выбор фильтра на мобиле
        $(document).on({
            click: function(e) {
                e.preventDefault();
                $('.js-page_filter_wrap').removeClass('active');
                $('.js-page_filter_wrap[data-page=' + $(this).data('page') + ']').addClass('active');

            }
        }, '.js-action_page_filter');

    };

    Common.prototype.selectFilter = function(prefix) {
        var that = this,
            timerId = that.timerId,
            $filterCatalog = $('.js-filterCatalog[data-type=' + prefix + ']'),
            $filterButton = $filterCatalog.find('.js-filterButton'),
            $dataForm = $filterCatalog.find('input'),
            currentUrl = $filterCatalog.data('current_url'),
            type = $filterCatalog.data('type'),
            hideButton = true,
            arrayParams = {},
            count_array_params = 0;

        clearTimeout(timerId);

        that.timerId = setTimeout(function() {
            $dataForm.each(function() {
                var $thisInp = $(this),
                    origVal = $thisInp.val(),
                    idInp = $thisInp.data('id'),
                    nameInp = $thisInp.attr('name'),
                    parentInp = $thisInp.data('parent');


                if (arrayParams[parentInp] == undefined)
                    arrayParams[parentInp] = {};

                if ($thisInp.attr('type') == 'checkbox') {

                    if ($thisInp.prop('checked') === true) {
                        arrayParams[parentInp][idInp] = origVal;
                        hideButton = false;
                    }
                } else if ($thisInp.attr('type') == 'text') {
                    var origVal = parseInt(origVal),
                        $wrapSlider = $thisInp.closest('.js-filters_slider_wrap'),
                        $slider = $wrapSlider.find('.js-filter_slider');

                    if (
                        ((nameInp == 'length-from' || nameInp == 'price-from') && $slider.data('min') != origVal) ||
                        ((nameInp == 'length-to' || nameInp == 'price-to') && $slider.data('max') != origVal)
                    ) {
                        arrayParams[parentInp][idInp] = nameInp + '-' + origVal;
                        hideButton = false;
                    }

                }

            });


            $.each(arrayParams, function(keyParam, valuesParam) {

                if (Object.keys(valuesParam).length) {
                    count_array_params += Object.keys(valuesParam).length;

                    currentUrl = currentUrl + (Object.values(valuesParam).join('/')) + '/'
                }
            });

            currentUrl = currentUrl.replace('/products', '');
            if (prefix == 'desktop') {
                history.replaceState({}, 'Подборка', currentUrl);
            } else if (prefix == 'mobile') {
                var $success_filter = $('.js-success_filter'),
                    $clear_filter = $('.js-clear_filter');

                $success_filter.removeClass('hidden').attr('href', currentUrl);

                if (count_array_params) $clear_filter.removeClass('hidden');
                else $clear_filter.addClass('hidden');

                return false;

            }



            $filterButton.removeClass('hidden');
            if (hideButton)
                $filterButton.addClass('hidden');

            $.post('/api/catalog.filter/', {
                url: currentUrl
            }, function(response) {
                $('.js-result_filter_items').html(response.data.result_filter_items);
                $('.js-result_filter_pagination').html(response.data.result_filter_pagination);
                $('.js-result_filter_text').html(response.data.text);
                if (response.data.title != '')
                    $('title').html(response.data.title);
                if (response.data.header != '')
                    $('.js-filter_header').html(response.data.header);
            });
        }, 400);



    };

    Common.prototype.accordion = function() {
        var instance = this;

        $(document).on({
            click: function() {
                var $this = $(this);

                // $('.js-accWrap[data-type="'+$this.data('type')+'"]').removeClass('open');
                $this.closest('.js-accWrap').toggleClass('open');

            }
        }, '.js-accBtn');

    };


    Common.prototype.filterOurShops = function() {
        var instance = this;

        $(document).on({
            change: function() {
                var $this = $(this),
                    thisVal = $this.val(),
                    $thisOption = $this.find('[value="' + thisVal + '"]');

                window.location.href = $thisOption.data('url');


            }
        }, '.js-filterOurShops');

        $(document).on({
            change: function(e) {
                var $this = $(this),
                    thisVal = $this.val(),
                    currentUrl = $('[data-current_url]').data('current_url'),
                    arrayUrl = [];

                $('.js-filterOurShopsCheckbox').each(function() {
                    var $thisCheckbox = $(this);
                    if ($thisCheckbox.prop('checked')) {
                        arrayUrl.push($thisCheckbox.val());
                    }
                });

                if (arrayUrl.length === 2 || !arrayUrl.length) {

                    window.location.href = currentUrl;
                } else {
                    window.location.href = currentUrl + arrayUrl.join('') + '/';
                }



            }
        }, '.js-filterOurShopsCheckbox');

    };



    Common.prototype.filtersPage = function() {
        var that = this,
            $checkboxes = $('.js-filterPage-checkbox');

        //клики по чекбоксам
        $checkboxes.on('change', function() {
            var $this = $(this);
            that.selectFilterPage($this.data('type'));
        });


        //выбор фильтра на мобиле
        $(document).on({
            click: function(e) {
                e.preventDefault();
                $('.js-page_filter_wrap').removeClass('active');
                $('.js-page_filter_wrap[data-page=' + $(this).data('page') + ']').addClass('active');

            }
        }, '.js-action_page_filter');



    };

    Common.prototype.selectFilterPage = function(prefix) {
        var that = this,
            timerId = that.timerId,
            $filterCatalog = $('.js-filterPage[data-type=' + prefix + ']'),
            $filterButton = $filterCatalog.find('.js-filterButton'),
            $dataForm = $filterCatalog.find('input'),
            currentUrl = $filterCatalog.data('current_url'),
            type = $filterCatalog.data('type'),
            hideButton = true,
            arrayParams = {},
            count_array_params = 0;

        clearTimeout(timerId);

        that.timerId = setTimeout(function() {
            $dataForm.each(function() {
                var $thisInp = $(this),
                    origVal = $thisInp.val(),
                    idInp = $thisInp.data('id'),
                    nameInp = $thisInp.attr('name'),
                    parentInp = $thisInp.data('parent');


                if (arrayParams[parentInp] == undefined)
                    arrayParams[parentInp] = {};

                if ($thisInp.attr('type') == 'checkbox') {

                    if ($thisInp.prop('checked') === true) {
                        arrayParams[parentInp][idInp] = origVal;
                        hideButton = false;
                    }
                }

            });

            console.log(arrayParams);

            $.each(arrayParams, function(keyParam, valuesParam) {

                if (Object.keys(valuesParam).length) {
                    count_array_params += Object.keys(valuesParam).length;

                    currentUrl = currentUrl + (Object.values(valuesParam).join('/')) + '/'
                }
            });



            var $success_filter = $('.js-success_filter'),
                $clear_filter = $('.js-clear_filter');

            $success_filter.removeClass('hidden').attr('href', currentUrl);
            $('.js-wrap_button_filter').removeClass('hidden');

            if (count_array_params) $clear_filter.removeClass('hidden');
            else $clear_filter.addClass('hidden');




        }, 400);



    };

    Common.prototype.scrollPage = function() {
        $(document).on({
            click: function(event) {
                event.preventDefault();
                var $this = $(this);
                $('html,body').animate({
                    scrollTop: $('#' + $this.data('block')).offset().top - 20
                }, 500);
            }
        }, '.js-scrollPage');
    };


    Common.prototype.delFile = function() {
        var instance = this;


        $(document).on({
            click: function() {
                var $parent = $(this).closest('.js-uploadedFile');
                var $parentList = $parent.parent();
                $.post('/api/files.del/', {
                    section: $parent.data('section'),
                    id: $parent.data('id')
                }, function() {
                    $parent.remove();
                    if ($parentList.find('.js-uploadedFile').length == 0)
                        $('.js-no_file').removeClass('hidden');
                });

                return false;
            }
        }, '.js-delFile');
    };


    Common.prototype.initUpload = function(browse_button, file_list, count_files, maxUploadFile, extensionUploadFile, replaceFoto) {
        // Custom example logic
        var uploader = new plupload.Uploader({
            runtimes: 'html5, flash',
            browse_button: browse_button, // you can pass an id...
            url: '/api/files.upload/',
            flash_swf_url: '/DESIGN/SITE/js/uploader/Moxie.swf',
            multi_selection: false,
            multipart_params: {
                section: browse_button,
                maxUploadFile: maxUploadFile,
                count_files: count_files
            },
            filters: {
                max_file_size: maxUploadFile + 'mb',
                mime_types: [{
                    title: "Image files",
                    extensions: extensionUploadFile
                }]
            },

            init: {
                PostInit: function() {
                    $('.js-noUploaded').remove();
                    $('#' + browse_button).show();
                },

                FilesAdded: function(up, files) {
                    var $fileList = $('#' + file_list + '>.js-uploadedFile');
                    console.log($fileList.length);
                    console.log(replaceFoto);

                    plupload.each(files, function(file) {

                        $('#' + file_list).prepend('<span class="add-file-list js-uploadedFile" data-section="' + browse_button + '" data-id="' + file.id + '" id="' + file.id + '">\
                                                    Загрузка...\
                                            </span>');

                        $('.js-no_file').addClass('hidden');

                    });
                    uploader.start();
                },

                UploadProgress: function(up, file) {},
                FileUploaded: function(up, file, response) {
                    response = JSON.parse(response.response);
                    console.log(response);
                    $('#' + file.id)
                        .html(response.data.name + '<a href="#" class="js-delFile delFile">&times;</a>')
                        .data('id', response.data.id);
                },

                Error: function(up, err) {
                    var arrayErors = {
                        's-600': 'Максимальный размер: ' + maxUploadFile + 'Мб',
                        's-601': 'Разрешенные форматы: ' + extensionUploadFile
                    };
                    alert(arrayErors['s' + err.code]);
                    console.log(err.code);
                    console.log("Error #" + err.code + ": " + err.message);
                }
            }
        });
        uploader.init();
    };



    App.modules.common = new Common();
    App.modules.common.toggleMenu();
    App.modules.common.toggleBlock();
    App.modules.common.heightBlock();
    App.modules.common.init_sliders();
    App.modules.common.send_form();
    App.modules.common.popup();
    App.modules.common.filterCatalog();
    App.modules.common.tabs();
    App.modules.common.marginLeftMainSlider();
    App.modules.common.accordion();
    App.modules.common.init_select2();
    App.modules.common.filterOurShops();
    App.modules.common.filtersPage();
    App.modules.common.scrollPage();
    App.modules.common.delFile();

})(Site, window, document, jQuery);