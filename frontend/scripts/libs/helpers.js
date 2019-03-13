var d = document;

var css = function(element, style) {
    for (var prop in style) {
        element.style[prop] = style[prop];
    }
}

var animate = function(opts, callback) {
    var start = new Date;
    var timer = setInterval(function() {
        var progress = (new Date - start) / opts.duration;
        if (progress > 1) progress = 1;
        opts.step(progress);
        if (progress == 1) {
            if (callback) {
                callback.apply();
            }
            clearInterval(timer);
        }
    }, opts.delay || 20);

    return {
        stop: function() {
            clearInterval(timer);
        }
    };
}

var addClass = function(element, classname) {
    var cn = element.className;
    if(cn.indexOf(classname) != -1) {
        return;
    }
    if(cn != '') {
        classname = ' '+classname;
    }
    element.className = cn+classname;
}

var removeClass = function(element, classname) {
    var cn = element.className;
    var rxp = new RegExp("\\s?\\b"+classname+"\\b", "g");
    cn = cn.replace(rxp, '');
    element.className = cn;
}

function is_string( mixed_var ){
    return (typeof( mixed_var ) == 'string');
}


function is_numeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

var mapConteiner = function( type, mapid )
{
    if ( type === 'google' )
    {
        googleMaps( mapid );
    }
    else if ( type === 'yandex' )
    {
        yandexMaps( mapid );
    }
}

function checkAll(element)
{
    var checked = $(element).prop('checked');
    $('.check-all-spy').prop('checked', checked);
}

function yandexMaps( mapid )
{
    var map = {
        link: null,
        mapid: 'map-conteiner-' + mapid,
        place: 'krasnodar',
        type: 'yandex#map', // 'yandex#map' 'yandex#satellite' 'yandex#hybrid' 'yandex#publicMap' 'yandex#publicMapHybrid'
        city: {
            'krasnodar': [45.09471716593029, 39.01589900000001],
            'moscow': [55.76, 37.64],
        },
        getBaloon: function( coord )
        {
            return new ymaps.Placemark( coord, {}, {
                draggable: true
                //,
                //iconImageHref: '/images/myIcon.gif',
                //iconImageSize: [30, 42],
                //iconImageOffset: [-3, -42]
            });
        },
        draw: function( ymaps )
        {
            map.link = new ymaps.Map(this.mapid, {
                center: map.city[ this.place ],
                zoom: 12,
                type: map.type
            });

            map.link.controls
                .add('smallZoomControl', { right: 10, top: 15 })
                .add(new ymaps.control.ScaleLine())
                .add('searchControl', { left: 20, top: 20 });

            var dragBalloon = this.getBaloon( map.city[ this.place ] );

            map.link.events.add('click', function (e) {
                map.link.geoObjects.remove( dragBalloon );

                dragBalloon = map.getBaloon( e.get('coordPosition') );
                map.link.geoObjects.add( dragBalloon );

                map.setCoord( e.get('coordPosition') );
            });

            map.link.geoObjects.add( dragBalloon ).events.add('dragend', function(e) {
                var object = e.get('target');
                var coords = object.geometry.getCoordinates();
                object.properties.set('balloonContent', coords);

                map.setCoord( coords );
            });
        },
        add: function() {
            if ( arguments.length == 1 ) {
                map.link.geoObjects.add(
                    new ymaps.GeoObject({
                        geometry: {
                            type: "Point",
                            coordinates: arguments[0]
                        }
                    })
                );
            }
            else {
                var collection = new ymaps.GeoObjectCollection();
                for (var i = 0; i<arguments.length; i++) {
                    collection.add(new ymaps.Placemark(arguments[i]));
                }
                map.link.geoObjects.add(collection);
            }
        }
    };

    ymaps.ready(function(){
        map.draw( ymaps );
    });
}

function googleMaps( mapid )
{
    var map = new google.maps.Map(d.getElementById( 'map-conteiner-' + mapid ), {
        zoom: 14,
        zoomControl: !1,
        panControl: !1,
        scrollwheel: !1,
        navigationControl: !1,
        mapTypeControl: !1,
        scaleControl: !1,
        draggable: !0,
        disableDoubleClickZoom: !0,
        center: new google.maps.LatLng(45.053548,39.016056)
    });
}

var datepicker = function()
{
    const $calendar = $('.calendar');

    $calendar.each((id, item) => {
        const $closest = $(item).closest('.calendar');
        const $element = $closest.find('.calendar-input');
        const disabled = $element.is(':disabled');
        const timestamp = $element.data('timestamp') || false;
        let d_format = (timestamp !== false) ? 'DD.MM.YYYY' : $element.data('format') || 'DD.MM.YYYY';

        d_format = d_format.toLowerCase();

        if (!disabled) {
            $element.prop('date', '');
            $element.data('format', d_format);

            const $calendarItem = $element.datepicker({
                format: d_format,
                // todayBtn: true,
                autoclose: true,
                container: $closest,
                language: ADMIN_LOCALE
            });

            $calendarItem.on('changeDate', (ev) => {
                let result = $(this).data('date');

                if (timestamp !== false) {
                    result = (new Date(result)).getTime() / 1000;
                }

                $element.val(
                    $calendarItem.datepicker('getFormattedDate')
                );
            });

            if ($closest.find('.input-group-addon')) {
                $closest.find('.input-group-addon').on('click', () => {
                    $calendarItem.datepicker('show');
                });
            }
        }
    });
};

function selectize(selector)
{
    var $selector = null;

    selector = selector || 'select';

    if (is_string(selector))
    {
        $selector = $(selector);
    }
    else if(is_object(selector))
    {
        $selector = selector;
    }

    const options = {
        width: "100%",
        allow_single_deselect: true,
        no_results_text: 'Не найдено!',
        disable_search_threshold: 10
    };

    $selector.each(function() {
        const $select = $(this);
        const placeholder = $select.attr('placeholder');

        if (placeholder)
        {
            const isMultiple = $select.prop('multiple');

            if (isMultiple)
            {
                options.placeholder_text_multiple = placeholder;
            }
            else
            {
                options.placeholder_text_single = placeholder;
            }
        }

        $select.chosen(options);
    });
}

function changeRow(element)
{
    var checked = $(element).prop('checked');

    if(checked)
    {
        $(element).closest('tr').find('td').addClass('ch');
    }
    else
    {
        $(element).closest('tr').find('td').removeClass('ch');
    }
}

function toggle_small_photo(id)
{
    $("#"+id).toggle();
}

function removeSection(element, e, id, _self_)
{
    e.preventDefault();
    if (confirm('Вы действительно хотите удалить?'))
    {
        id = parseInt(id);

        var x, section = [], tmp = $(element).val().split(',');
        for(x in tmp)
        {
            if (tmp[x] !== '' && parseInt(tmp[x]) !== id)
            {
                section.push(parseInt(tmp[x]));
            }
        }

        $(_self_).remove();
        $(element).val( (section.length > 1 ? section.join(',') : section) );
    }
    return false;
}

function slider(id, type, value, min, max, orientation)
{
    const element = '#' + id;
    const slider = document.getElementById(id);

    orientation = !orientation ? 'horizontal' : orientation;

    min = min || 0;
    max = max || 100;

    var values = value, connect = 'lower', behaviour = 'tap-drag';

    if (type == 'range')
    {
        behaviour = 'tap-drag';
        connect = true;
        values = [ value[0] , value[1] ];
    }

    noUiSlider.create(slider, {
        step: 1,
        animate: false,
        orientation: orientation,
        start: values,
        connect: connect,
        behaviour: behaviour,
        range: {
            'min': min,
            'max': max
        },
        format: wNumb({
            decimals: 0
        })
    });

    const handles = {
        'range': {
            0: 'min',
            1: 'max'
        },
        'slider': {
            0: 'value'
        }
    };

    slider.noUiSlider.on('update', function(values, handle){
        $(`${element}-${handles[type][handle]}`).val(values[handle]);
    });
}

function metaCounter()
{
    $('.count-number').on('keyup', function(){
        var $block = $(this).closest('.count-number-block'),
            $counter = $block.find('.count-number-block-count'),
            recomend = parseInt($counter.data('recomend')) || '';

        $counter.html($(this).val().length + (recomend !== '' ? '/' + recomend : ''));

        if (recomend !== '' && $(this).val().length > recomend)
        {
           $counter.addClass('unlim');
        }
        else if ($counter.hasClass('unlim'))
        {
            $counter.removeClass('unlim');
        }
    });
}

function seoCrowl()
{
    $("input[name='changefreq']").on('change', function () {
        if ($.trim($(this).val()) == 'fixed')
        {
            $('#changefreq_fixed').removeClass('hidden');
        }
        else
        {
            $('#changefreq_fixed').addClass('hidden');
        }
    });

    $("input[name='priority']").on('change', function () {
        if ($.trim($(this).val()) == 'fixed')
        {
            $('#priority_fixed').removeClass('hidden');
        }
        else
        {
            $('#priority_fixed').addClass('hidden');
        }
    });
}

function toggle_item(e, element, id, elclass)
{
    e.preventDefault();
    $("#"+id).toggle();
    var $icon = $(element).find('.zmdi');

    if ($icon.hasClass(elclass[0]))
    {
        $icon.removeClass(elclass[0]);
        $icon.addClass(elclass[1]);
    }
    else
    {
        $icon.removeClass(elclass[1]);
        $icon.addClass(elclass[0]);
    }
}

function switch_type_fields(obj)
{
    if ( obj.checked === true )
    {
        $("#case2").hide();
        $("#case2 input").attr({"disabled": true});
        $("#case1").show();
        $("#case1 input").attr({"disabled": false});
    }
    else
    {
        $("#case1").hide();
        $("#case1 input").attr({"disabled": true});
        $("#case2").show();
        $("#case2 input").attr({"disabled": false});
    }
}

function show_tr(obj)
{
    var val = $(obj).val();

    if (val == 10 || val == 11 || val == 12)
        $("#to_list").show();
    else
        $("#to_list").hide();
}

function translate_key( element )
{
    $(element).val(generatePassword(random(14, 24), false, /\w/));

    // $(element).val(PassGenJS.getPassword({
    //     symbols: 0,
    //     letters: random(14, 24),
    //     numbers: 0,
    //     lettersUpper: 0
    // }));
}

function secret( element, length )
{
    $(element).val(generatePassword(12, false));

    // $(element).val(PassGenJS.getPassword({
    //     symbols: 0,
    //     letters: random(2, 4),
    //     numbers: random(2, 4),
    //     lettersUpper: random(3, 7)
    // }));
}

function random(min, max)
{
    min = min || 0;
    max = max || 100;
    return Math.floor(Math.random() * ( max - min + 1 )) + min;
}


function token( length )
{
    length = length || 8;

    var secret = '', chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for( i=1; i<length; i++ )
    {
        var c = Math.floor(Math.random()*chars.length + 1);
        secret += chars.charAt(c)
    }

    return secret;
}

function del_list_fields(id)
{
    if (cp.dialog("Вы дейсвительно хотите удалить поле?")){
       $("#tr"+id).remove();
       /*
       $.post( "/" + ADMIN_DIR + "/ajax/lists/",
            {
                action: "remove",
                id: id
            },
            function(data)
            {
                $("#tr"+id).remove();
            } ,
            "json"
        )
        */
    }
    return false;
}

function add_list_fields()
{
    field_counter++;
    str = '<tr id="tr' + field_counter + '">';
    str += '<td><input type="hidden" name="field_id[' + field_counter + ']" value="0" \/>';
    str += '<input type="text" name="field_name[' + field_counter + ']" class="bord padd ness" \/><\/td>';
    str += '<td><input type="text" name="field_sys_name[' + field_counter + ']" class="bord padd ness" \/><\/td>';
    str += '<td><select name="field_type[' + field_counter + ']" class="field_type ness" id="' + field_counter + '" onchange="select_type(this);">';
    $.each(arr_field_type,function(k,v){
        if (k*1) str += '<option value="' + k + '">' + v + '<\/option>'
    });
    str += '<\/select><\/td>';
    str += '<td class="addition"><\/td>';
    str += '<td><input type="text" name="f_ord[' + field_counter + ']" value="' + field_counter + '0" class="bord padd w60px r" \/><\/td>';
    str += '<td style="text-align:center"><input type="checkbox" name="in_list[' + field_counter + ']" \/><\/td>';
    str += '<td class="actions c"><a href="#" class="ctr_a ctr_del margin" title="Удалить" onclick="del_list_fields(' + field_counter + ');return false;"><\/a><\/td>';
    str += '<\/tr>';

    $("#add_btn").before(str);
}

function add_list_fields_list()
{
    field_counter++;

    var str = [
        '<tr id="tr' + field_counter + '">',
        '<td>',
        '<input type="hidden" name="field_id[' + field_counter + ']" value="0">',
        '<input name="var[' + field_counter + ']" placeholder="Например: Краснодарский край">',
        '</td>',
        '<td><input name="value[' + field_counter + ']" placeholder="Например: 23"></td>',
        '<td><label class="controll"><input type="checkbox" class="controll__input" value="' + field_counter + '" name="default[' + field_counter + ']"><span class="controll__visible controll__visible_checkbox"></span></label></td>',
        '<td><input name="ord[' + field_counter + ']" value="' + field_counter + '0" class="ord integer reducing-trigger"></td>',
        '<td class="tac"><a href="#" class="icon icon-delete remove-trigger" title="Удалить" onclick="del_list_fields(' + field_counter + ');return false;"></a></td>',
        '</tr>'
    ].join( '' );

    $("#add_btn").before(str);
}

function del_fields(numb)
{
    field_counter--;
    $("#tr"+numb).remove();
}

function add_fields()
{
    field_counter++;
    var select = '', k = '';

    for ( k in arr_field_type )
    {
        if (typeof arr_field_type[k] == 'string')
        {
            select += '<option value="' + k + '">' + arr_field_type[k] + '</option>';
        }
    }

    var str = [
        '<tr id="tr' + field_counter + '">',
        '<td class="va_t"><input name="f_name[' + field_counter + ']" class="ness"></td>',
        '<td class="va_t"><input name="f_sys_name[' + field_counter + ']" class="ness"></td>',
        '<td class="va_t"><select name="f_type[' + field_counter + ']" class="f_type ness" data-placeholder="Тип поля" id="fieldtype_' + field_counter + '" onchange="select_type(this)">',
        select,
        '</select></td>',
        '<td class="addition va_t">' + get_addition('input', field_counter) + '</td>',
        '<td class="va_t"><input name="f_ord[' + field_counter + ']" value="' + field_counter + '0"></td>',
        '<td class="va_m tac"><label class="controll controll_single"><input type="checkbox" class="controll__input" value="1" name="f_in_list[' + field_counter + ']"><span class="controll__visible controll__visible_checkbox"></span></label></td>',
        '<td class="va_m tac"><label class="controll controll_single"><input type="checkbox" class="controll__input" value="1" name="f_index[' + field_counter + ']"><span class="controll__visible controll__visible_checkbox"></span></label></td>',
        '<td class="va_m tac"><label class="controll controll_single"><input type="checkbox" class="controll__input" value="1" name="f_unique[' + field_counter + ']"><span class="controll__visible controll__visible_checkbox"></span></label></td>',
        '<td class="tac"><a href="#" class="icon icon-delete remove-trigger" title="Удалить" onclick="del_fields(' + field_counter + ');return false;"></a></td>',
        '</tr>'
    ].join('');

    $("#add_btn").before(str);

    selectize( '#fieldtype_' + field_counter );
}

function add_fields_list()
{
    field_counter++;

    str = [
        '<tr id="tr' + field_counter + '">',
        '<td><input name="var[' + field_counter + ']"></td>',
        '<td><input name="value[' + field_counter + ']"></td>',
        '<td><input type="checkbox" name="default[' + field_counter + ']"></td>',
        '<td><input name="ord[' + field_counter + ']" value="' + field_counter + '0"></td>',
        '<td class="tac"><a href="#" class="icon icon-delete remove-trigger" title="Удалить" onclick="del_fields(' + field_counter + ');return false;"></a></td>',
        '</tr>'
    ].join('\n');

    $("#add_btn").before(str);
}

function select_type( obj )
{
    var row_numd = 1 * ( $(obj).attr("id").split('_')[1] ),
        append_obj = $("#tr"+row_numd+" .addition"),
        str = get_addition( obj.value.split(':')[0], row_numd );

    $( append_obj ).empty().append( str || '' );

    selectize();
}

function get_addition( type, index )
{
    var tmp = [], str = [];

    if ( [ 'input', 'cost', 'int', 'hidden', 'document', 'timestamp', 'email', 'list', 'autocomplete', 'select', 'treeselect', 'float', 'system', 'multiselect', 'datetime' ].indexOf( type ) >= 0 )
    {
        str = [
            '<div class="group">',
                '<label class="group__item"><input type="radio" class="group__item__rb" name="f_width[' + index + ']" value="25"><span class="group__item__style"></span><span class="group__item__text">25%</span></label>',
                '<label class="group__item"><input type="radio" class="group__item__rb" name="f_width[' + index + ']" value="50"><span class="group__item__style"></span><span class="group__item__text">50%</span></label>',
                '<label class="group__item"><input type="radio" class="group__item__rb" name="f_width[' + index + ']" value="75"><span class="group__item__style"></span><span class="group__item__text">75%</span></label>',
                '<label class="group__item"><input type="radio" class="group__item__rb" name="f_width[' + index + ']" value="100" checked><span class="group__item__style"></span><span class="group__item__text">100%</span></label>',
            '</div>'
        ];

        if ( [ 'list', 'autocomplete', 'select', 'treeselect', 'radio', 'multiselect', 'checkbox', 'system' ].indexOf( type ) >= 0 )
        {
           str.push( '<div class="cb mb10"></div>' );
        }
    }

    if ( type == 'hidden' )
    {
        str.push( '<input value="" name="f_hidden_default[' + index + ']" placeholder="Значение по умолчанию">' );
    }

    if ( type == 'system' )
    {
        str.push( '<input value="" name="f_binding[' + index + ']" placeholder="Например поле (title)">' );
    }

    if ( type == 'date' )
    {
        tmp = [
            '<div class="help-cover">',
                '<input name="f_date_format[' + index + ']" value="DD.MM.YYYY" placeholder="Формат даты">',
                '<div class="tooltip tooltip-down">',
                    'D — день,<br>',
                    'M — месяц (без нуля впереди)<br>',
                    'DD, MM — день и месяц с нулём впереди для значений от 1 до 9<br>',
                    'YY — 2-символьное обозначение года<br>',
                    'YYYY — 4-символьное обозначение года (год пишется полностью)',
                '</div>',
            '</div>'
        ];

        str.push( tmp.join('\n') );
    }

    if ( [ 'file', 'image' ].indexOf( type ) >= 0 )
    {
        tmp = [
            '<div class="option-group option-combo">',
                '<label><input type="radio" name="f_file_count[' + index + ']" value="0"><span class="option">Один файл</span></label>',
                '<label><input type="radio" name="f_file_count[' + index + ']" value="1" checked><span class="option">Много файлов</span></label>',
            '</div>'
        ];

        if ( type == 'image' )
        {
            tmp.push( '<div class="cb mb10"></div>' );
        }

        str.push( tmp.join('\n') );
    }

    if ( [ 'gallery', 'image' ].indexOf( type ) >= 0 && typeof CONFIGURE !== 'undefined' && typeof CONFIGURE.image !== 'undefined' )
    {
        var tmp0 = [], tmp1 = [], tmp2 = [], x, checked = '';
        tmp0 = [
            '<div class="js-size-list">',
            '<table class="table-simple">',
                '<col><col><col><col width="57"><col width="20">',
                '<thead>',
                    '<tr>',
                        '<td class="h">Префикс</td>',
                        '<td class="h">Ширина</td>',
                        '<td class="h">Высота</td>',
                        '<td class="h">Метод</td>',
                        '<td class="h"></td>',
                    '</tr>',
                '</thead>',
                '<tbody>'
        ];

        tmp1 = template('tpl_image_row', {
            index: 0,
            button: true,
            iteration: index
        });

        tmp2 = [
            '</tbody>',
            '</table>',
            '<a href="#" class="add-size js-add-size" data-iteration="{$smarty.foreach.i.iteration}"><i class="icon icon-plus-square"></i> Добавить размер</a>',
            '</div>'
        ];

        str.push( tmp0.join('\n') );
        str.push( tmp1 );
        str.push( tmp2.join('\n') );
    }

    if ( [ 'embedded' ].indexOf( type ) >= 0 )
    {
        if (!is_undefined(MODULE_LIST))
        {
            var select = '', m;

            for (m in MODULE_LIST)
            {
                select += '<option value="' + m + '">' + MODULE_LIST[m].name + '</option>';
            }
        }

        tmp = [
            '<div class="j-select-wrapper">',
                '<div class="mb5">',
                    '<select name="f_module[' + index + ']" data-placeholder="Выбрать модуль" class="j-select-choosen">',
                        '<option value="0">---</option>', select,
                    '</select>',
                '</div>',
                '<div class="clearfix j-select-container">',
                    '<select name="f_fields[' + index + '][]" multiple data-placeholder="Выбрать" disabled></select>',
                '</div>',
            '</div>'
        ];

        str.push( tmp.join('\n') );
    }

    if ( [ 'list', 'section', 'autocomplete', 'select', 'treeselect', 'radio', 'checkbox', 'multiselect' ].indexOf( type ) >= 0 )
    {
        tmp = [
            '<div class="cb clearfix">',
                '<label class="controll"><input type="checkbox" class="controll__input" value="1" onchange="switch_types(this)" name="f_use_table_list[' + index + ']"><span class="controll__visible controll__visible_checkbox"></span><span class="controll__text">привязать к `#__mdd_lists`</span></label>',

                '<div class="case case0">',
                    '<input name="f_table_name[' + index + ']" value="" class="mb5" placeholder="Название таблицы (#_news)">',
                    '<input name="f_table_field[' + index + ']" value="" placeholder="Поле (title)">',
                '</div>',

                '<div class="case case1 hidden">',
                    '<input name="f_table_list[' + index + ']" disabled placeholder="BIND списка" value="">',
                '</div>',
            '</div>'
        ];

        str.push( tmp.join('\n') );
    }

    if ( [ 'range', 'slider' ].indexOf( type ) >= 0 )
    {
        tmp = [
            '<div class="-col">',
                '<div class="-left">',
                    '<input name="f_range[' + index + '][min]" value="" placeholder="Min" class="integer">',
                '</div>',
                '<div class="-right">',
                    '<input name="f_range[' + index + '][max]" value="" placeholder="Max" class="integer">',
                '</div>',
            '</div>'
        ];

        str.push( tmp.join('\n') );
    }

    if ( type == 'editor' && typeof CONFIGURE !== 'undefined' && typeof CONFIGURE.editor !== 'undefined' )
    {
        tmp = [];
        tmp.push( '<div class="option-group option-combo">' );

        var x, checked = '';

        for( x in CONFIGURE.editor )
        {
            checked = '';

            if ( typeof CONFIGURE.editor[x]['default'] !== 'undefined' && CONFIGURE.editor[x]['default'] == 1 )
            {
                checked = ' checked';
            }

            tmp.push( '<label><input type="radio" name="f_editor[' + index + ']" value="' + CONFIGURE.editor[x]['system'] + '" ' + checked + '><span class="option">' + CONFIGURE.editor[x]['name'] + '</span></label>' );
        }

        tmp.push( '</div>' );


        if ( typeof CONFIGURE !== 'undefined' && typeof CONFIGURE.editor_mode !== 'undefined' )
        {
            tmp.push( '<div class="cb mb10"></div>' );

            tmp.push( '<div class="option-group">' );
                for( x in CONFIGURE.editor_mode )
                {
                    tmp.push( '<label><input type="radio" name="f_editor_mode[' + index + ']" value="' + CONFIGURE.editor_mode[ x ] + '"><span class="option">' + CONFIGURE.editor_mode[ x ] + '</span></label>' );
                }

            tmp.push( '</div>' );
        }

        str.push( tmp.join('\n') );
    }

    if ( type == 'redactor' && typeof CONFIGURE !== 'undefined' && typeof CONFIGURE.redactor !== 'undefined' )
    {
        tmp = [];
        tmp.push( '<div class="group">' );

        var x, checked = '';

        for( x in CONFIGURE.redactor )
        {
            if (typeof(CONFIGURE.redactor[x]['name']) !== 'undefined' && typeof(CONFIGURE.redactor[x]['system']) !== 'undefined')
            {
                checked = '';

                if ( typeof CONFIGURE.redactor[x]['default'] !== 'undefined' && CONFIGURE.redactor[x]['default'] == 1 )
                {
                    checked = ' checked';
                }

                tmp.push( '<label class="group__item"><input type="radio" class="group__item__rb" name="f_redactor[' + index + ']" value="' + CONFIGURE.redactor[x]['system'] + '"' + checked + '><span class="group__item__style"></span><span class="group__item__text">' + CONFIGURE.redactor[x]['name'] + '</span></label>' );
            }
        }

        tmp.push( '</div>' );

        str.push( tmp.join('\n') );
    }

    return str.join('\n');
}

function switch_types(obj)
{
    p_obj = $(obj).closest('td');
    if ( obj.checked )
    {
        $(".case1",p_obj).show();
        $(".case1 input",p_obj).attr({"disabled": false});
        $(".case0",p_obj).hide();
        $(".case0 input",p_obj).attr({"disabled": true});
    }
    else {
        $(".case0",p_obj).show();
        $(".case0 input",p_obj).attr({"disabled": false});
        $(".case1",p_obj).hide();
        $(".case1 input",p_obj).attr({"disabled": true});
    }
}

function humanSize(bytes) {
    if (typeof bytes !== 'number') {
        return '';
    }

    if (bytes >= 1000000000) {
        return (bytes / 1000000000).toFixed(2) + ' Гб';
    }

    if (bytes >= 1000000) {
        return (bytes / 1000000).toFixed(2) + ' Мб';
    }

    if (bytes >= 1024)
    {
        return (bytes / 1000).toFixed(2) + ' Кб';
    }

    return bytes + ' б';
}

function addExtendet() {
    $.post(
        "/" + ADMIN_DIR + "/ajax/vote/",
        {
            action: $("#action").attr("value")  ,
            id: $("#id").attr("value") ,
            title: $("#title").attr("value") ,
            ord: $("#ord").attr("value") ,
            visible: $("#VoteAddQuestions input:radio[name=visible]:checked").val()
        },
        onAjaxSuccessAdd
    );
    function onAjaxSuccessAdd(data) { //
        var vis;
        if ( $("#VoteAddQuestions input:radio[name=visible]:checked").val() == 1 ) vis = "Да";
        else  vis = "Нет";

        var inner = '<tr id="tr_' + data + '">';
        inner += '<td>';
        inner += '<input name="parent_id_' + data + '" id="parent_id_' + data + '" value="2" type="hidden">';
        inner += '<input name="id_' + data + '" id="id_' + data + '" value="' + data + '" type="hidden">';
        inner += '<div id="title_' + data + '"><b>' + $("#title").attr("value") + '</b></div>';
        inner += '<div id="title_i_' + data + '" style="display: none;">';
        inner += '<input name="title_' + data + '" value="' + $("#title").attr("value") + '" class="bord padd w100" id="title_input_' + data + '" type="text">';
        inner += '<p align="right">';
        inner += '<a href="javascript:;" onclick="saveExtendet(\'' + data + '\');">Сохранить</a> | ';
        inner += '<a href="javascript:;" onclick="cancelExtendet(\'' + data + '\');">Отмена</a> ';
        inner += '</p>';
        inner += '</div>';
        inner += '</td>';
        inner += '<td>';
        inner += '<div id="ord_' + data + '"><b>' + $("#ord").attr("value") + '</b></div>';
        inner += '<div id="ord_i_' + data + '" style="display: none;">';
        inner += '<input name="ord_' + data + '" value="' + $("#ord").attr("value") + '" style="width: 100%;" class="bord padd w100" id="ord_input_' + data + '" type="text">';
        inner += '</div>';
        inner += '</td>';

        inner += '<td align="center">';
        inner += '<div id="visible_' + data + '"><b>' + vis + '</b></div>';
        inner += '<div id="visible_i_' + data + '" style="display: none;">';
        inner += '<input name="visible_' + data + '" value="1" checked="checked" onclick="$(\'#vis_' + data + '\').val(\'1\');" id="visible_input_' + data + '_1" type="radio">Да &nbsp;&nbsp;';
        inner += '<input name="visible_' + data + '" value="0" onclick="$(\'#vis_' + data + '\').val(\'0\');" id="visible_input_' + data + '_0" type="radio">Нет';
        inner += '<input name="vis_' + data + '" id="vis_' + data + '" value="" type="hidden">';
        inner += '</div>';
        inner += '</td>';
        inner += '<td>';
        inner += '<a href="#" class="icon icon-edit" onclick="editExtendet(\'' + data + '\')"></a>';
        inner += '<a href="#" class="icon icon-delete remove-trigger" onClick="delExtendet(\'' + data + '\')"></a>';
        inner += '</td>';
        inner += '</tr>';

        //  INSERT NEW FIELD
        $(inner).insertBefore("#ajax_add_form");

        //  RESET FORMS ELEMENTS
        $("#title").attr({value:""});
        $("#ord").attr({value:""});

        //  HIDE FORM
        $("#ajax_add_form").hide();
    }
}
    function saveExtendet(id) {
    $.post(
        "/" + ADMIN_DIR + "/ajax/vote/",
        {
            action: "update" ,
            id: $("#id_"+id).attr("value") ,
            parent_id: $("#parent_id_"+id).attr("value") ,
            title: $("#title_input_"+id).attr("value") ,
            ord: $("#ord_input_"+id).attr("value") ,
            visible: $("#VoteAddQuestions input:radio[name=visible_"+id+"]:checked").val()
        },
        onAjaxSuccessSave
    );
    function onAjaxSuccessSave(data) {
        var vis;
        if ( $("#vis_"+id).val() == 1 ) vis = "Да";
        else  vis = "Нет";
        $("#title_"+id).html( "<b>"+$("#title_input_"+id).attr("value")+"</b>" );
        $("#ord_"+id).html( $("#ord_input_"+id).attr("value") );
        $("#visible_"+id).html( vis );

        $("#title_"+id).show();
        $("#ord_"+id).show();
        $("#visible_"+id).show();
        $("#title_i_"+id).hide();
        $("#ord_i_"+id).hide();
        $("#visible_i_"+id).hide();
    }

}
//
function editExtendet(id) {
    $("#title_"+id).hide();
    $("#ord_"+id).hide();
    $("#visible_"+id).hide();
    $("#title_i_"+id).show();
    $("#ord_i_"+id).show();
    $("#visible_i_"+id).show();
}
//
function delExtendet(id) {
    if (cp.dialog("Вы действительно хотите удалить запись?")) {
        $.post(
            "/" + ADMIN_DIR + "/ajax/vote/",
            {
                action: "del" ,
                id: $("#id_"+id).val()
            },
            onAjaxSuccessDel
        );
    }
}
function onAjaxSuccessDel(data){
    $("#tr_"+data).remove();
}
//
function cancelExtendet(id) {
    $("#title_"+id).show();
    $("#ord_"+id).show();
    $("#visible_"+id).show();
    $("#title_i_"+id).hide();
    $("#ord_i_"+id).hide();
    $("#visible_i_"+id).hide();
}

function onAjaxSuccess(data) {
    alert(data);
}

function editTitle( id, title )
{
    if (typeof(title) == 'undefined')
    {
        var title = $('#ftitle_' + id).text();
    }

    var name = prompt('Введите новое имя', title);

    if (name != '' && name != title && name !== null)
    {
        $.ajax({
            url: '/' + ADMIN_DIR + '/meta/filename',
            type: "post",
            data: {
                id: id,
                name: name
            },
            dataType: 'JSON',
            success: function(response)
            {
                if (response.status === true)
                {
                    $('#ftitle_' + id).html( name );
                }
            }
        });
    }

    return false;
}

function editVisible(id, visible)
{
    visible = (visible == 1 ? 0 : 1);

    $.ajax({
        url: '/' + ADMIN_DIR + '/meta/filevisible',
        type: "post",
        data: {
            id: id,
            visible: visible
        },
        dataType: 'JSON',
        success: function(response)
        {
            if (response.status === true)
            {
                $('#fvisible_' + id).removeClass('icon-eye icon-eye-off');

                if (visible == 1)
                {
                    $('#fvisible_' + id).addClass('icon-eye');
                }
                else {
                    $('#fvisible_' + id).addClass('icon-eye-off');
                }
            }
        }
    });

	return false;
}

function editOrd( id, ord )
{
	const neword = prompt('Порядок', ord);

	if (!neword) return false;

	if (neword != '' && neword != ord) {
		$.post('/' + ADMIN_DIR + '/ajax/meta/', { action: "newfileord", neword: neword, id: id }, function(data) {
			if (data == 1) {
				$('#ordfile_' + id).html(neword);
			}
		});
	}
	return false;
}

function ajax_vis_toggle(obj, id, mod_id)
{
    $(obj).append('<i class="loading"></i>');

	$.post( '/' + ADMIN_DIR + '/ajax/structure/', { act: "toggle_visible", mod_id: mod_id, id: id }, function(data) {
        if ( data == 1 )
        {
            $(obj).toggleClass("icon-eye").toggleClass("icon-eye-off").html('');
        }
    });

	return !1;
}

function show_tooltips(id)
{
	$("#"+id).toggle();
}

function my_uncheck(){
	$(".access").each(function(){
		$(this).attr({checked:''});
	});
}

function CheckAndSubmit(id){
    var flag = true;
	$("#"+id+" .ness").each(function(){
		if ( $(this).val() == "" ) {
			$(this).focus().addClass("error");
			flag = false;
			return false;
		} else {
			$(this).removeClass("error");
		}
	});
	if (flag)
		$("#"+id).submit();
	else return false;
}

function setSort(obj,cookie_name){
	value = $(obj).val();
	setCookie(cookie_name,value);
	location.href = location.href;
}

function form_submit(id,param)
{
	if (param == "save")
		$("#"+id).submit();
	if (param == "apply")
		$("#"+id).submit();
	else
		$("#"+id).submit();
}

function openwin( img , w , h , title )
{
	if ( hwnd != null )
	hwnd.close();
	hwnd = window.open( img , "" , "toolbar=no , location=no , directories=no , resizable=no , width=" + w + " , height=" + h );
	hwnd.document.open();
	hwnd.document.write("<html>");
	hwnd.document.write("<head>");
	hwnd.document.write("<title>" + title + "</title>");
	hwnd.document.write("</head>");
	hwnd.document.write("<body bgcolor=#ffffff bottommargin=0 leftmargin=0 marginheight=0 marginwidth=0 rightmargin=0 topmargin=0 style='border:0px;'>");
	hwnd.document.write("<table align=center width=100% height=100% cellspacing=0 cellpadding=0 border=0>");
	hwnd.document.write("<tr><td><img src='" + img + "' border=0></td></tr>");
	hwnd.document.write("</table></body></html>");
	hwnd.document.close();
}

function openwin_text( url , w , h )
{
	window.open( url , "" , "toolbar=no , location=no , directories=no , resizable=no , scrollbars=no , width=" + w + " , height=" + h );
}

function ltrim(str)
{
	for(var k = 0; k < str.length && isWhitespace(str.charAt(k)); k++);
	return str.substring(k, str.length);
}

function rtrim(str)
{
	for(var j=str.length-1; j>=0 && isWhitespace(str.charAt(j)); j--);
	return str.substring(0,j+1);
}

function trim(str)
{
	str = str.replace(/\s{2,}/g,' ');
	return ltrim(rtrim(str));
}

function isWhitespace(charToCheck)
{
	var whitespaceChars = " \t\n\r\f";
	return (whitespaceChars.indexOf(charToCheck) != -1);
}

function transliterate(string, url)
{
    string = trim(string.toLowerCase());

    if (string != '')
    {
        var char_map = {}, test = [], result = '', x;

        char_map = {
            // Latin
            'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'ae', 'ç': 'c',
            'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
            'ð': 'd', 'ñ': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ő': 'o',
            'ø': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ű': 'u', 'ý': 'y', 'þ': 'th',
            'ÿ': 'y',

            // Greek
            'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'h', 'θ': '8',
            'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': '3', 'ο': 'o', 'π': 'p',
            'ρ': 'r', 'σ': 's', 'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'x', 'ψ': 'ps', 'ω': 'w',
            'ά': 'a', 'έ': 'e', 'ί': 'i', 'ό': 'o', 'ύ': 'y', 'ή': 'h', 'ώ': 'w', 'ς': 's',
            'ϊ': 'i', 'ΰ': 'y', 'ϋ': 'y', 'ΐ': 'i',

            // Turkish
            'ş': 's', 'ı': 'i', 'ç': 'c', 'ü': 'u', 'ö': 'o', 'ğ': 'g',

            // Russian
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
            'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
            'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c',
            'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
            'я': 'ya',

            // Ukrainian
            'є': 'ye', 'і': 'i', 'ї': 'yi', 'ґ': 'g',

            // Czech
            'č': 'c', 'ď': 'd', 'ě': 'e', 'ň': 'n', 'ř': 'r', 'š': 's', 'ť': 't', 'ů': 'u', 'ž': 'z',

            // Polish
            'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',

            // Latvian
            'ā': 'a', 'č': 'c', 'ē': 'e', 'ģ': 'g', 'ī': 'i', 'ķ': 'k', 'ļ': 'l', 'ņ': 'n', 'š': 's', 'ū': 'u', 'ž': 'z'
        };

        // Очищаем от лишних символов

        result = string.replace(/[^a-zа-я0-9]/gi, '-');

        if (url == 'cyrillic')
        {
            result = encodeURI(unescape(unescape(result)));
        }
        else if (url == 'translate')
        {
            for (x in char_map)
            {
                result = result.replace(RegExp(x, 'g'), char_map[x]);
            }
            // result = result.replace(RegExp(x, 'g'), char_map[x]);
        }
        else
        {
            for (x in char_map)
            {
                result = result.replace(RegExp(x, 'g'), char_map[x]);
            }
        }

        // Очищаем от лишних дефисов

        test = result.split('');

        if (test[0] == '-')
        {
            result = result.slice(1);
        }

        if (test[test.length - 1] == '-')
        {
            result = result.slice(0, -1);
        }

        string = result;
    }

    return redouble(string);
}

function binding(name, element)
{
    $('body').on('keyup blur keypress', 'input[name="' + name + '"]', function() {
        if (this.value !== '') {
            const $input = $('input[name="' + element + '"]');
            if (!$input.prop('readonly')) {
                $input.val(transliterate(this.value, URL_TRANSLATE));
            }
        }
    });
}

function redouble( string )
{
	string = string.replace( '__', '_' );
    string = string.replace( '_-_', '_' );
	string = string.replace( '--', '-' );

	if ( string.indexOf('__') > -1 )
	{
		return redouble( string );
	}

	if ( string.substr(0,1) == '_' && string.length > 1 )
	{
		string = string.substr(1, string.length )
	}

	return string;
}

function ajax_toggle_group(obj,id)
{
    var visible = 0;

    if ( $(obj).hasClass('icon-eye-off') )
    {
        visible = 1;
    }
    else
    {
        visible = 0;
    }

    $(obj).append('<i class="loading"></i>');

    $.post('/' + ADMIN_DIR + '/ajax/modules/', { action: "devisible", id: id, visible: visible }, function(data){
        if ( data == 1 )
        {
            if ( $(obj).hasClass('icon-eye-off') )
            {
                $(obj).removeClass('icon-eye-off').addClass('icon-eye').html('');
            }
            else {
                $(obj).removeClass('icon-eye').addClass('icon-eye-off').html('');
            }
        }
    });

    return false;
}

function toggle_menu(obj,id)
{
	$(obj).toggleClass("minus").toggleClass("plus").parent();
	$("#item"+id).toggle();
}

function toggle_small_photo(id){
    $("#"+id).toggle();
}

function hideField(id){
    title = $("#docs_"+id+" .title_in").val();
    ord = $("#docs_"+id+" .ord_in").val();

    $("#docs_"+id+" .title_f").empty().append(title);
    $("#docs_"+id+" .ord_f").empty().append(ord);
    $("#docs_"+id+" .but_save").hide();
    $("#docs_"+id+" .ctr_edit").show();
}

function EditDocs(id){
    $("#docs_"+id+" .but_save").show();
    $("#docs_"+id+" .ctr_edit").hide();

    curr_value = $("#docs_"+id+" .title_f").text();
    $("#docs_"+id+" .title_f").empty().append("<input type='text' value='"+curr_value+"' name='title' class='bord padd w100 title_in' />");
    curr_value = $("#docs_"+id+" .ord_f").text();
    $("#docs_"+id+" .ord_f").empty().append("<input type='text' value='"+curr_value+"' name='ord' class='bord padd w20 ord_in' />");

    $("#docs_"+id+" .title_in").focus();
    return false;
}

function SaveDocs(id){
    title = $("#docs_"+id+" .title_in").val();
    ord = $("#docs_"+id+" .ord_in").val();

    if (!title) {
        alert("Пустое имя документа");
        hideField(id);
    }

    $.post(
        '/' + ADMIN_DIR + '/ajax/document/',
        {
            id:"document_edit",
            docsid:id,
            title:title,
            ord:ord
        },
        function(data){
            alert('Данные обновлены');
            hideField(id);
        }
    );
    return false;
}

function DelDocs(id){
    if (cp.dialog('Вы действительно хотите удалить?')){
        $.post(
            '/' + ADMIN_DIR + '/ajax/document/',
            {
                id:"document_del",
                docsid:id
            },
            function(data){
                if (data>0) {
                    $("#docs_"+id).hide();
                }
                else alert('ошибка обновления');
            }
        );
    }
    return false;
}

function page_update( item_id )
{
    $.post('/' + ADMIN_DIR + '/ajax/document/',
        {
            id:"update", post_id:item_id
        },
        function(data){
            var json = eval( "(" + data + ")" );
            parseMsg( json , "file_docs" );
        }
    );
    return false;
}

function parseMsg(msg,obj){
    $("#"+obj+" .uploadfiles").empty();
    $("#"+obj+" input:file").attr({"value":""});

    str = '<table style="margin-bottom:10px;width:80%"><tr>\n<td class="h w100">Документ</td>\n<td class="h">Размер</td>\n<td class="h">Удалить</td></tr>\n';
    var i = 0;
    $.each( msg, function(k,v) {
        if ( i % 2 != 0 ) odd = "odd ";
        else odd = "";
        str += '<tr>\n<td class="' + odd + '"><a href="' + v.sys_name + '" title="" target="_blank">' + v.title + '</a></td>\n';
        str += '<td class="' + odd + 'r"> ' + v.size + '</td>\n';
        str += '<td class="actions"><a href="#" onclick="return Module.ajaxFileDelete(' + v.id + ',\'' + obj + '\');" class="ctr_a ctr_del margin" title="Удалить" onclick="return confirm(\'Вы действительно хотите удалить?\')"></a></td>\n</tr>\n';
        i++;
    });
    str += '</table>'
    $("#"+obj+" .uploadfiles").append(str);
}

function ajaxFileDocsUpload(docs_group_id){

}

function screening( str ) {
    var reg=/"/g;
    var result=str.replace(reg, "&quot;" );

    return result;
}
