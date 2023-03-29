if (typeof ymaps != "undefined") {
    ymaps.ready(function() {

        $('.js-map_block').each(function() {
            var $this = $(this),
                idMap = $this.attr('id'),
                coord = $this.data('coord');

            var myMap = new ymaps.Map(idMap, {
                    center: coord,
                    zoom: 15,
                    controls: ['zoomControl']
                }, {
                    searchControlProvider: 'yandex#search'
                }),
                myPlacemark = new ymaps.Placemark(coord, {}, {
                    iconLayout: 'default#image',

                    iconImageHref: '/DESIGN/SITE/images/pin.svg',
                    // Размеры метки.
                    iconImageSize: [38, 50],
                    // Смещение левого верхнего угла иконки относительно
                    // её "ножки" (точки привязки).
                    iconImageOffset: [-17, -50]
                });

            myMap.geoObjects.add(myPlacemark);
            myMap.behaviors.disable(['scrollZoom']);
        });

        if ($('.js-map_blocks').length) {
            var myMap = new ymaps.Map('map_blocks', {
                    center: [56.838204, 60.574046],
                    zoom: 15,
                    controls: ['zoomControl']
                }, {
                    searchControlProvider: 'yandex#search'
                }),
                clusterer = new ymaps.Clusterer({
                    preset: 'islands#invertedDarkBlueClusterIcons',
                    groupByCoordinates: false,
                    clusterDisableClickZoom: false,
                    clusterHideIconOnBalloonOpen: false,
                    geoObjectHideIconOnBalloonOpen: false
                }),
                coordsMap_items = coordsMap(),
                myGeoObjects = [],
                i = 0;




            $.each(coordsMap_items, function(keyItem, dataItem) {

                if (dataItem.coord_map.length) {
                    myGeoObjects[i] = new ymaps.Placemark(dataItem.coord_map, {
                        balloonContentBody: '<div class="balloon">' +
                            '<div>' +
                            (dataItem.link != undefined ? '<a href="' + dataItem.link + '">' + dataItem.title + '</a>' : dataItem.title) +
                            '</div>' +
                            '<div>' + dataItem.address + '</div>' +
                            '</div>',
                        clusterCaption: dataItem.title
                    }, {
                        iconLayout: 'default#image',

                        iconImageHref: '/DESIGN/SITE/images/pin.svg',
                        // Размеры метки.
                        iconImageSize: [38, 50],
                        // Смещение левого верхнего угла иконки относительно
                        // её "ножки" (точки привязки).
                        iconImageOffset: [-17, -50]
                    });


                    i++;
                }
            });


            clusterer.add(myGeoObjects);
            myMap.geoObjects.add(clusterer);
            myMap.setBounds(clusterer.getBounds());

            if (myMap.getZoom() > 18)
                myMap.setZoom(18);

            myMap.setZoom(myMap.getZoom() - 1);

            myMap.behaviors.disable(['scrollZoom']);


            /*$(document).on({
                click:function(){
                    $('html,body').animate({scrollTop:$block_map.offset().top-20},300);
                    myMap.setCenter($(this).data('coord'));
                    myMap.setZoom(16);
                    return false;
                }
            },'.js-center_map');*/
        }



        var myMap2 = new ymaps.Map('yaMapContacts', {
                center: $('#yaMapContacts').data('coord'),
                zoom: 15,
                controls: ['zoomControl']
            }, {
                searchControlProvider: 'yandex#search'
            }),
            myPlacemarks = [],
            $map_schedule = $('.js-map-schedule');

        $.each(coordMap, function($key, $data) {
            console.log($data.coordinates);
            // Инициируем метки
            myPlacemarks[$key] = new ymaps.Placemark([$data.coordinates[0], $data.coordinates[1]]);

            // Добавляем их на карту
            myMap2.geoObjects.add(myPlacemarks[$key]);

            // Вешаем события на клик
            myPlacemarks[$key].events.add('click', function() {
                $map_schedule.removeClass('active');
                $('.js-map-schedule[data-id=' + $key + ']').addClass('active');
            });
        });

        //myMap2.setZoom(4);


        myMap2.behaviors.disable(['scrollZoom']);

        $(document).on({
            click: function(e) {
                e.preventDefault();
                var $this = $(this),
                    id = $this.data('id'),
                    thisCoord = coordMap[id]['coordinates'];

                $('.js-addressCity').removeClass('active');
                $this.addClass('active');
                $('.addr').removeClass('open');
                $('.addr[data-id=' + id + ']').addClass('open');
                $('h2').html($this.data('address'));
                $this.addClass('active');
                myMap2.setCenter([thisCoord[0], thisCoord[1]]);

                //$map_schedule.removeClass('active');
                //$('.js-map-schedule[data-id='+id+']').addClass('active');
                //$(window).trigger('updateBaronScrollers');
                return false;
            }
        }, '.js-addressCity');


        $(document).on({
            click: function() {
                var $this = $(this),
                    id = $this.data('id'),
                    $addressCityParents = $('.js-addressCity[data-parent=' + id + ']');

                $('.js-addressCity').addClass('hidden');
                $addressCityParents.removeClass('hidden');
                $($addressCityParents[0]).click();
                $('.js-currentCityName').text($this.text());

                return false;

            }
        }, '.js-selectMapCity');



    });
}