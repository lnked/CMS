var d = document;

function keyControls() {
    if ($('.j-clipboard').length) {
        var clipboard = new ClipboardJS('.j-clipboard', {
            text: function(trigger) {
                $(trigger).addClass('copied');

                setTimeout(function() {
                    $(trigger).removeClass("copied");
                }, 700);

                return trigger.getAttribute('data-clipboard');
            }
        });
    }

    $("body").on('click', '.remove-trigger', function(e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var _self_ = this,
            href = $(_self_).attr('href');

        $.post(href, function() {
            cp.notify('Удалено', 'info');

            if (typeof($(_self_).attr('rel')) !== 'undefined' && $($(_self_).attr('rel')).length > 0) {
                $($(_self_).attr('rel')).remove();
            } else {
                $(_self_).closest('tr').remove();
            }
        });

        return !1;
    });

    $('body').on('click', '.js-remove-item', function(e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var _self_ = this,
            href = $(_self_).attr('href');

        $.post(href, function() {
            cp.notify('Удалено', 'info');

            if (typeof($(_self_).attr('rel')) !== 'undefined' && $($(_self_).attr('rel')).length > 0) {
                $($(_self_).attr('rel')).remove();
            } else {
                $(_self_).closest('tr').remove();
            }
        });

        return !1;
    });

    $('body').on('click', '.js-add-template', function(e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        var $wrap = $(this).closest('.js-template-wrapper'),
            iteration = parseInt($(this).data('iteration')),
            tpl = $(this).data('template'),
            data = {};

        if (typeof iteration !== 'undefined') {
            data['id'] = iteration;
            iteration += -1;
            $(this).data('iteration', iteration);
        }

        $wrap.append(template(tpl, data));
    });

    $('body').on('keydown', '.reducing-trigger', function(e) {
        if (e.which == 38 || e.which == 40) {
            e.preventDefault();

            var reducing = $(this).data('reducing') || 10,
                format = $(this).data('format'),
                value = parseInt($(this).val()) || 0,
                result = 0;

            if (e.which == 38) {
                result = value + reducing;
            } else if (e.which == 40) {
                result = value - reducing;
            }

            if (result < 0) {
                result = 0;
            }

            if (typeof(format) !== 'undefined') {
                result = '?i%'.replace('?i', result);
            }

            $(this).val(result);
        }
    });

    $('body').on('keypress', '.latin', function(e) {
        var regex = /[^A-Za-z]/g;
        if (regex.test(String.fromCharCode(e.keyCode))) {
            return !1;
        }
    });

    $("body").on('keypress', '.integer', function(e) {
        if ([0, 8, 13, 38, 40].indexOf(e.which) < 0 && (e.which < 48 || e.which > 57)) {
            return !1;
        }
    });

    $("body").on('keypress', '.float', function(e) {
        if ([0, 8, 13, 38, 40, 44, 46].indexOf(e.which) < 0 && (e.which < 48 || e.which > 57)) {
            return !1;
        }
    });
}

function fileManager() {}

function fullCalendar() {
    const removeEvent = function(id, callback) {
        $.ajax({
            url: `/${ADMIN_DIR}/meta/sheduler/delete`,
            type: 'post',
            data: {
                'id': id
            },
            success: callback,
            dataType: "json"
        });
    }

    const changeEvent = function(event, callback) {
        $.ajax({
            url: `/${ADMIN_DIR}/meta/sheduler/edit`,
            type: 'post',
            data: {
                'id': event.id,
                'start': event.start.format(),
                'end': event.end.format()
            },
            success: callback,
            dataType: "json"
        });
    }

    const createEvent = function(input, callback) {
        $.ajax({
            url: input.action,
            type: input.method,
            data: input.data,
            success: callback,
            dataType: "json"
        });
    }

    const prepareEvent = function($calendar, data, isCreate) {
        const keys = Object.keys(data);

        const count = keys.length - 1;

        const event = {};

        const excellent = [
            'id', 'group', 'title', 'item', 'color', 'types', 'start', 'end', 'extra', 'visible'
        ];

        keys.forEach(function(name, index) {
            if (excellent.indexOf(name) >= 0) {
                event[name] = data[name];
            }

            if (name === 'types' && data[name] !== '') {
                event[name] = data[name].split(',');
            }

            if (index === count) {
                if (isCreate) {
                    $calendar.fullCalendar('renderEvent', event, true);
                    $calendar.fullCalendar('refetchEvents');
                } else {
                    $calendar.fullCalendar('updateEvent', event);
                }
            }
        });
    }

    const closePopup = function($popup) {
        $popup.removeClass('is-animated');

        setTimeout(() => {
            $popup.removeClass('is-visible').remove();
        }, 350);
    }

    const prepareEditEvent = function($calendar, data) {
        const keys = Object.keys(data);

        const count = keys.length - 1;

        const event = {};

        const excellent = [
            'id', 'group', 'title', 'item', 'color', 'types', 'extra', 'visible'
        ];

        keys.forEach(function(name, index) {
            if (excellent.indexOf(name) >= 0) {
                event[name] = data[name];
            }

            if (name === 'types' && data[name] !== '') {
                event[name] = data[name].split(',');
            }

            if (index === count) {
                event.action = `/${ADMIN_DIR}/meta/sheduler/edit`;
                openPopup($calendar, event, false);
            }
        });
    }

    const openPopup = function($calendar, data, isCreate) {
        const $popup = $(template('tpl_schedule', data || {}));

        if (!$('body').find('#schedule-popup').length) {
            $('body').append($popup);

            $popup.addClass('is-visible');

            setTimeout(() => {
                selectize();
                jscolor.install();
                $popup.addClass('is-animated');
            }, 50);

            $popup.find('form').on('submit', function(e) {
                e.preventDefault ? e.preventDefault() : (e.returnValue = false);

                const $form = $(this);

                if ($form.data('is-busy')) {
                    return;
                }

                const action = $form.attr('action');
                const method = $form.attr('method') || 'post';
                const formdata = $form.serializeArray();

                $form.data('is-busy', true);

                createEvent({
                    action: action,
                    method: method,
                    data: formdata,
                }, function(responce) {
                    $form.data('is-busy', false);

                    closePopup($popup);
                    prepareEvent($calendar, responce, isCreate);
                });

                return false;
            });

            $popup.find('.j-schedule-popup-close').on('click', (e) => {
                e.preventDefault();
                closePopup($popup);
            });
        }
    }

    // if ($('.fullcalendar').length) {
    //     const todayDate = moment().startOf('day');
    //     const YESTERDAY = todayDate.clone().subtract(1, 'day').format('YYYY-MM-DD');
    //     const TODAY = todayDate.format('YYYY-MM-DD');
    //     const TOMORROW = todayDate.clone().add(1, 'day').format('YYYY-MM-DD');
    //     const START_WEEK = moment('2018-01-01').startOf('week');
    //     const END_WEEK = moment('2018-01-01').endOf('week');

    //     const config = {
    //         lang: 'ru',
    //         height: 'auto',
    //         timezone: 'local',
    //         header: {
    //             left: 'agendaWeek,agendaDay',
    //             right: ''
    //             // left: 'promptEvent today prev,next',
    //             // center: 'title',
    //             // right: 'month,agendaWeek,agendaDay,listWeek'
    //         },
    //         eventLimit: false,
    //         lazyFetching: false,
    //         defaultView: 'agendaWeek',
    //         defaultDate: '2018-01-01',
    //         navLinks: true,
    //         editable: true,
    //         droppable: true,
    //         selectable: true,
    //         selectHelper: true,
    //         aspectRatio: 2,
    //         allDaySlot: false,
    //         minTime: '07:00:00',
    //         maxTime: '21:00:00',
    //         snapDuration: '00:05:00',
    //         slotDuration: '00:05:00',
    //         slotLabelFormat: 'H(:mm)',
    //         schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source'
    //     };

    //     $('.fullcalendar').each(function(e) {
    //         const id = $(this).attr('id');

    //         const $calendar = $(`#${id}`);
    //         const name = $calendar.data('name');
    //         const group = $(`input[name="${name}"]`).val();

    //         // config.customButtons = {
    //         //     promptEvent: {
    //         //         text: 'Добавить элемент',
    //         //         click: function() {
    //         //             const title = prompt('Заголовок события:');

    //         //             if (title) {
    //         //                 createEvent({
    //         //                     // id: 1000,
    //         //                     // color: '#f00',
    //         //                     title: title,
    //         //                     group: group,
    //         //                     start: start,
    //         //                     end: end
    //         //                 },
    //         //                 function(responce) {
    //         //                     prepareEvent($calendar, responce);
    //         //                 });
    //         //             }
    //         //         }
    //         //     }
    //         // };

    //         config.select = function(start, end) {
    //             openPopup($calendar, {
    //                 action: `/${ADMIN_DIR}/meta/sheduler/add`,
    //                 group: group,
    //                 start: start,
    //                 end: end
    //             }, true);

    //             $calendar.fullCalendar('unselect');
    //         };

    //         config.eventRender = function(event, element) {
    //             let timeout = null;

    //             element.on('click', function() {
    //                 clearTimeout(timeout);

    //                 timeout = setTimeout(() => {
    //                     prepareEditEvent($calendar, event);
    //                 }, 300);
    //             });

    //             element.on('dblclick', function() {
    //                 if (confirm('Удалить?')) {
    //                     clearTimeout(timeout);

    //                     removeEvent(event.id, function() {
    //                         $calendar.fullCalendar("removeEvents", function(ev) {
    //                             return ev.id == event.id;
    //                         });
    //                     });
    //                 }
    //             });
    //         };

    //         config.eventDrop = function(event) {
    //             changeEvent(event);
    //         };

    //         config.eventResize = function(event) {
    //             changeEvent(event);
    //         };

    //         if (typeof(eventsJson[name]) !== 'undefined') {
    //             config.events = eventsJson[name];
    //         }

    //         $("body").on('click', '.j-remove-event', function(e) {
    //             e.preventDefault();

    //             const link = $(this);

    //             if (link.data('is-busy')) {
    //                 return;
    //             }

    //             link.data('is-busy', true);

    //             const event_id = link.data('event');
    //             const $closestPopup = link.closest('.schedule-popup');

    //             removeEvent(event_id, function() {
    //                 $calendar.fullCalendar("removeEvents", function(ev) {
    //                     return ev.id == event_id;
    //                 });

    //                 closePopup($closestPopup);
    //             });
    //         });

    //         $calendar.fullCalendar(config);

    //         $calendar.fullCalendar('changeView', 'agendaWeek', {
    //             start: START_WEEK,
    //             end: END_WEEK
    //         });

    //         $calendar.fullCalendar('render');
    //     });
    // }
}

function on_load() {
    fileManager();

    // fullCalendar();

    $(".watch-datemask").mask("99/99/9999");
    $(".watch-phonemask").mask("+ 7 (999) 999-99-99");
    $(".watch-cartnumber").mask("999-999-999");

    $('body').on('click', '.js-size-delete', function(e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = !1;
        $(this).closest('tr').remove();
    });

    $('body').on('click', '.js-add-size', function(e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = !1;

        var $table = $(this).closest('.js-size-list').find('table').find('tbody'),
            iteration = parseInt($(this).data('iteration')),
            index = 0;

        $table.find('tr').each(function() {
            if (parseInt($(this).data('index')) > index) {
                index = parseInt($(this).data('index'));
            }
        });

        index++;

        $table.append(
            template('tpl_image_row', {
                index: index,
                button: true,
                iteration: iteration
            })
        );
    });

    if ($('.js-slider').length) {
        $('.js-slider').each(function() {
            var id = $(this).attr('id');
            var type = $(this).data('type');
            var value = $(this).data('value');
            var min = $(this).data('min');
            var max = $(this).data('max');

            slider(id, type, value, min, max);
        });
    }

    if ($('.js-map').length) {
        $('.js-map').each(function() {
            var element = $(this).data('element');
            var provider = $(this).data('provider');

            mapConteiner(provider, element);
        });
    }

    if ($('.js-redactor').length) {
        $('.js-redactor').each(function() {
            const id = $(this).attr('id');
            const type = $(this).data('type');

            _redactor.init(id, type);
        });
    }

    if ($('.js-editor').length) {
        $('.js-editor').each(function() {
            var id = $(this).attr('id');
            var type = $(this).data('editor');
            var hightlight = $(this).data('hightlight');

            _editor.init(id, type, hightlight);
        });
    }

    if ($('.js-table-toggle').length) {
        $('.js-table-toggle').on('click', function(e, flag) {
            e.preventDefault ? e.preventDefault() : e.returnValue = !1;

            if (flag) {
                cp.tableToggle($(this).data('toggle'));
            } else {
                cp.tableToggle($(this).data('toggle'), e);
            }
        });

        if ($('.js-table-toggle[data-toggle-init="true"]').length) {
            $('.js-table-toggle[data-toggle-init="true"]').trigger('click', true);
        }
    }

    $("body").on('click', '.js-toggle-binding', function(e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        const $target = $(this);

        if ($target.data('element').length) {
            const $input = $($(this).data('element'));
            $target.toggleClass('on').toggleClass('off');
            $input.prop('readonly', !$target.hasClass('on'));
            $('input[name="' + $input.data('binding-name') + '"]').trigger('blur');
        }
    });

    if ($('.js-binding').length) {
        $('.js-binding').each(function() {
            if (!$(this).hasClass('js-binding-init')) {
                binding($(this).data('binding-name'), $(this).data('binding-element'));
            }
        });
    }

    if ($('.js-fileupload').length) {
        $.upload.init();
    }

    $('body').on('mouseenter', '.js-structure-controll', function(e) {
        $(this).find('.structure__control.animate').removeClass('animate');
    });

    $('body').on('mouseleave', '.js-structure-controll', function(e) {
        $(this).find('.structure__control').addClass('animate');
    });

    $('body').on('click', '.menu-trigger', function(e) {
        e.preventDefault();
        $('#page').toggleClass('page-open');

        var visibility = 'visible';

        if (!$('#page').hasClass('page-open')) {
            visibility = 'hidden'
        }

        $('#overlay').css({
            'visibility': visibility
        });

        return !1;
    });

    $('#meta_data').sortable({
        handle: '.js-trigger-drag',
        pullPlaceholder: false,
        bodyClass: 'dragging',
        draggedClass: 'dragged',
        containerSelector: 'table',
        itemPath: '> tbody',
        itemSelector: 'tr',
        placeholder: '<tr class="placeholder"/>',
        onDrop: function($item, container, _super, event) {
            $item.removeClass('dragged').removeAttr("style");
            $("body").removeClass('dragging')
        }
    });

    $('body').on('mouseenter', '.trigger-navigation', function(e) {
        var $item = $(this),
            $page = $('#page'),
            title = $item.attr('rel'),
            tooltip, id = 'tooltip-' + $item.attr('id');

        if (title && !$('#' + id).length && !$page.hasClass('page-open')) {
            var pos_top = $item.offset().top + 10;

            tooltip = document.createElement('span');
            tooltip.id = id;
            tooltip.innerHTML = title;
            tooltip.className = 'navigation__tooltip navigation__tooltip_animate';
            tooltip.style.top = pos_top + 'px';

            $page.append(tooltip);

            setTimeout(function() {
                $(tooltip).removeClass('navigation__tooltip_animate');
            }, 30);
        }
    });

    $('body').on('mouseleave', '.trigger-navigation', function(e) {
        var id = 'tooltip-' + $(this).attr('id');

        if ($('#' + id).length) {
            var $tooltip = $('#' + id);

            $tooltip.addClass('navigation__tooltip_animate');

            setTimeout(function() {
                $tooltip.remove();
            }, 200);
        }
    });

    $('body').on('click', '.wrapper', function(e) {
        $('#page').removeClass('page-open');
        $('#overlay').css({
            'visibility': 'hidden'
        });
    });

    $('body').on('mouseenter', '.trigger-tooltip', function(e) {
        $(this).data('xtitle', $(this).prop('title'));
        $(this).prop('title', '');
    });

    $('body').on('mouseleave', '.trigger-tooltip', function(e) {
        $(this).prop('title', $(this).data('xtitle'));
        $(this).data('xtitle', '');
    });

    $('.trigger-popover').popover();

    if ($('.nestable-tree').length) {
        var structure_tree = $('.nestable-tree').eq(0);

        if (typeof(structure_tree.data('path')) !== 'undefined' && typeof(structure_tree.data('group')) !== 'undefined') {
            var path = structure_tree.data('path'),
                group = parseInt(structure_tree.data('group'));

            structure_tree.nestable({
                group: group,
                maxDepth: 20,
                dragStop: function(el) {
                    var target, parent, next;

                    next = 0;
                    target = parseInt(el[0].id.split('-')[1]);
                    parent = parseInt(el[0].offsetParent.offsetParent.id.split('-')[1]);

                    if (isNaN(parent)) {
                        parent = group;
                    }

                    if (el[0].nextElementSibling !== null) {
                        next = parseInt(el[0].nextElementSibling.id.split('-')[1]);
                    }

                    if (!isNaN(target) && !isNaN(parent)) {
                        $.ajax({
                            url: '/' + ADMIN_DIR + '/' + path + '/updateStructure',
                            type: "post",
                            data: {
                                oid: target,
                                pid: parent,
                                nid: next
                            }
                        });
                    }
                },
                afterExpand: function(el) {
                    var id = el[0].id.split('-')[1];
                    $.removeCookie(path + '_collapse_' + id, { path: '/' });
                },
                afterCollapse: function(el) {
                    var id = el[0].id.split('-')[1];
                    $.cookie(path + '_collapse_' + id, '1', { expires: 30, path: '/' });
                }
            });
        }
    }

    /*
    doOnLoad('structure');
    buildTree('structure', 'index');

    $('#nestable-menu').on('click', function(e)
    {
        var target = $(e.target),
            action = target.data('action');
        if (action === 'expand-all') {
            $('.dd').nestable('expandAll');
        }
        if (action === 'collapse-all') {
            $('.dd').nestable('collapseAll');
        }
    });

    var list = this;
    list.el.find(list.options.itemNodeName).each(function() {
        list.collapseItem($(this));
    });


    expandItem: function(li)
    {
        li.removeClass(this.options.collapsedClass);
        li.children('[data-action="expand"]').hide();
        li.children('[data-action="collapse"]').show();
        li.children(this.options.listNodeName).show();
    },

    collapseItem: function(li)
    {
        var lists = li.children(this.options.listNodeName);
        if (lists.length) {
            li.addClass(this.options.collapsedClass);
            li.children('[data-action="collapse"]').hide();
            li.children('[data-action="expand"]').show();
            li.children(this.options.listNodeName).hide();
        }
    },

    var updateOutput = function(e)
    {
        var list   = e.length ? e : $(e.target),
            output = list.data('output');
        if (window.JSON) {
            output.val(window.JSON.stringify(list.nestable('serialize')));//, null, 2));
        } else {
            output.val('JSON browser support required for this demo.');
        }
    };

    // activate Nestable for list 1
    $('#nestable').nestable({
        group: 1
    })
    .on('change', updateOutput);

    // activate Nestable for list 2
    $('#nestable2').nestable({
        group: 1
    })
    .on('change', updateOutput);

    // output initial serialised data
    updateOutput($('#nestable').data('output', $('#nestable-output')));
    updateOutput($('#nestable2').data('output', $('#nestable2-output')));

    $('#nestable-menu').on('click', function(e)
    {
        var target = $(e.target),
            action = target.data('action');
        if (action === 'expand-all') {
            $('.dd').nestable('expandAll');
        }
        if (action === 'collapse-all') {
            $('.dd').nestable('collapseAll');
        }
    });

    $('#nestable3').nestable();
    */
}

const initApp = () => {
    selectize();
    datepicker();
    metaCounter();
    seoCrowl();
    keyControls();
    on_load();
    cp.dropdown();
    cp.tableToggleList();
    cp.cleditor();
    jscolor.install();
}

$(window).ready(() => {
    Raven.context(() => {
        initApp();
    });
});