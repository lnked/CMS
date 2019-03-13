'use strict';

(function (global) {
	'use strict';

	global.console = global.console || {};
	var con = global.console,
	    prop,
	    method,
	    empty = {},
	    dummy = function dummy() {},
	    properties = 'memory'.split(','),
	    methods = 'assert,clear,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn'.split(',');
	while (prop = properties.pop()) {
		if (!con[prop]) con[prop] = empty;
	}while (method = methods.pop()) {
		if (!con[method]) con[method] = dummy;
	}
})(typeof window === 'undefined' ? undefined : window);

!function () {
	function e(e, t) {
		var n = 'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;font-size: 14px;' + (e ? "font-weight: bold;" : "") + "color: " + t + ";";
		return n;
	}

	if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
		console.log("%c♥ %c✰ %cCELEBRO.CMS %c✰ %c http://cms.celebro.ru %c♥", e(!0, "#f00"), e(!0, "#af55e2"), e(!0, "#777"), e(!0, "#af55e2"), e(!0, "#557de2"), e(!0, "#f00"));
	} else {
		console.log('celebro.cms http://cms.celebro.ru');
	}
}();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9jb25zb2xlLmpzIl0sIm5hbWVzIjpbImdsb2JhbCIsImNvbnNvbGUiLCJjb24iLCJwcm9wIiwibWV0aG9kIiwiZW1wdHkiLCJkdW1teSIsInByb3BlcnRpZXMiLCJzcGxpdCIsIm1ldGhvZHMiLCJwb3AiLCJ3aW5kb3ciLCJlIiwidCIsIm4iLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJ0b0xvd2VyQ2FzZSIsImluZGV4T2YiLCJsb2ciXSwibWFwcGluZ3MiOiI7O0FBQUEsQ0FBQyxVQUFTQSxNQUFULEVBQWlCO0FBQ2pCOztBQUNBQSxRQUFPQyxPQUFQLEdBQWlCRCxPQUFPQyxPQUFQLElBQWtCLEVBQW5DO0FBQ0EsS0FBSUMsTUFBTUYsT0FBT0MsT0FBakI7QUFBQSxLQUNDRSxJQUREO0FBQUEsS0FDT0MsTUFEUDtBQUFBLEtBRUNDLFFBQVEsRUFGVDtBQUFBLEtBR0NDLFFBQVEsU0FBUkEsS0FBUSxHQUFXLENBQUUsQ0FIdEI7QUFBQSxLQUlDQyxhQUFhLFNBQVNDLEtBQVQsQ0FBZSxHQUFmLENBSmQ7QUFBQSxLQUtDQyxVQUFXLHVNQUFELENBQTBNRCxLQUExTSxDQUFnTixHQUFoTixDQUxYO0FBTUEsUUFBT0wsT0FBT0ksV0FBV0csR0FBWCxFQUFkO0FBQWdDLE1BQUksQ0FBQ1IsSUFBSUMsSUFBSixDQUFMLEVBQWdCRCxJQUFJQyxJQUFKLElBQVlFLEtBQVo7QUFBaEQsRUFDQSxPQUFPRCxTQUFTSyxRQUFRQyxHQUFSLEVBQWhCO0FBQStCLE1BQUksQ0FBQ1IsSUFBSUUsTUFBSixDQUFMLEVBQWtCRixJQUFJRSxNQUFKLElBQWNFLEtBQWQ7QUFBakQ7QUFDQSxDQVhELEVBV0csT0FBT0ssTUFBUCxLQUFrQixXQUFsQixlQUF1Q0EsTUFYMUM7O0FBYUEsQ0FBQyxZQUFXO0FBQ1IsVUFBU0MsQ0FBVCxDQUFXQSxDQUFYLEVBQWNDLENBQWQsRUFBaUI7QUFDYixNQUFJQyxJQUFJLGtGQUFrRkYsSUFBSSxvQkFBSixHQUEyQixFQUE3RyxJQUFtSCxTQUFuSCxHQUErSEMsQ0FBL0gsR0FBbUksR0FBM0k7QUFDQSxTQUFPQyxDQUFQO0FBQ0g7O0FBRUosS0FBSUMsVUFBVUMsU0FBVixDQUFvQkMsV0FBcEIsR0FBa0NDLE9BQWxDLENBQTBDLFFBQTFDLElBQXNELENBQUMsQ0FBM0QsRUFBOEQ7QUFDN0RqQixVQUFRa0IsR0FBUixDQUFZLHdEQUFaLEVBQXNFUCxFQUFFLENBQUMsQ0FBSCxFQUFNLE1BQU4sQ0FBdEUsRUFBcUZBLEVBQUUsQ0FBQyxDQUFILEVBQU0sU0FBTixDQUFyRixFQUF1R0EsRUFBRSxDQUFDLENBQUgsRUFBTSxNQUFOLENBQXZHLEVBQXNIQSxFQUFFLENBQUMsQ0FBSCxFQUFNLFNBQU4sQ0FBdEgsRUFBd0lBLEVBQUUsQ0FBQyxDQUFILEVBQU0sU0FBTixDQUF4SSxFQUEwSkEsRUFBRSxDQUFDLENBQUgsRUFBTSxNQUFOLENBQTFKO0FBQ0EsRUFGRCxNQUdLO0FBQ0pYLFVBQVFrQixHQUFSLENBQVksbUNBQVo7QUFDQTtBQUNELENBWkEsRUFBRCIsImZpbGUiOiJfY29uc29sZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbihnbG9iYWwpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHRnbG9iYWwuY29uc29sZSA9IGdsb2JhbC5jb25zb2xlIHx8IHt9O1xuXHR2YXIgY29uID0gZ2xvYmFsLmNvbnNvbGUsXG5cdFx0cHJvcCwgbWV0aG9kLFxuXHRcdGVtcHR5ID0ge30sXG5cdFx0ZHVtbXkgPSBmdW5jdGlvbigpIHt9LFxuXHRcdHByb3BlcnRpZXMgPSAnbWVtb3J5Jy5zcGxpdCgnLCcpLFxuXHRcdG1ldGhvZHMgPSAoJ2Fzc2VydCxjbGVhcixjb3VudCxkZWJ1ZyxkaXIsZGlyeG1sLGVycm9yLGV4Y2VwdGlvbixncm91cCxncm91cENvbGxhcHNlZCxncm91cEVuZCxpbmZvLGxvZyxtYXJrVGltZWxpbmUscHJvZmlsZSxwcm9maWxlcyxwcm9maWxlRW5kLHNob3csdGFibGUsdGltZSx0aW1lRW5kLHRpbWVsaW5lLHRpbWVsaW5lRW5kLHRpbWVTdGFtcCx0cmFjZSx3YXJuJykuc3BsaXQoJywnKTtcblx0d2hpbGUgKHByb3AgPSBwcm9wZXJ0aWVzLnBvcCgpKSBpZiAoIWNvbltwcm9wXSkgY29uW3Byb3BdID0gZW1wdHk7XG5cdHdoaWxlIChtZXRob2QgPSBtZXRob2RzLnBvcCgpKSBpZiAoIWNvblttZXRob2RdKSBjb25bbWV0aG9kXSA9IGR1bW15O1xufSkodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyB0aGlzIDogd2luZG93KTtcblxuIWZ1bmN0aW9uKCkge1xuICAgIGZ1bmN0aW9uIGUoZSwgdCkge1xuICAgICAgICB2YXIgbiA9ICdmb250LWZhbWlseTogXCJIZWx2ZXRpY2EgTmV1ZVwiLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmO2ZvbnQtc2l6ZTogMTRweDsnICsgKGUgPyBcImZvbnQtd2VpZ2h0OiBib2xkO1wiIDogXCJcIikgKyBcImNvbG9yOiBcIiArIHQgKyBcIjtcIjtcbiAgICAgICAgcmV0dXJuIG5cbiAgICB9XG5cdFxuXHRpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJjaHJvbWVcIikgPiAtMSkge1xuXHRcdGNvbnNvbGUubG9nKFwiJWPimaUgJWPinLAgJWNDRUxFQlJPLkNNUyAlY+KcsCAlYyBodHRwOi8vY21zLmNlbGVicm8ucnUgJWPimaVcIiwgZSghMCwgXCIjZjAwXCIpLCBlKCEwLCBcIiNhZjU1ZTJcIiksIGUoITAsIFwiIzc3N1wiKSwgZSghMCwgXCIjYWY1NWUyXCIpLCBlKCEwLCBcIiM1NTdkZTJcIiksIGUoITAsIFwiI2YwMFwiKSk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0Y29uc29sZS5sb2coJ2NlbGVicm8uY21zIGh0dHA6Ly9jbXMuY2VsZWJyby5ydScpXG5cdH1cbn0oKTsiXX0=

'use strict';

var cp = function ($) {
    var data = [];

    var notify_timeout, _notify;

    return {
        addTemplate: function addTemplate(e) {
            $('#addtemplate').find('input').attr('disabled', false);
            $('#addtemplate').toggle();
        },
        addTemplateFile: function addTemplateFile(tid) {
            var name = $('#template_name').val(),
                file = $('#template_file').val();

            $.ajax({
                url: '/' + ADMIN_DIR + '/ajax/structure/',
                type: "post",
                data: {
                    act: "ajaxAddTemplate",
                    name: name,
                    file: file
                },
                success: function success(response) {
                    if (response.length) {
                        var select = [];

                        for (var x in response) {
                            var _data = response[x];
                            var selected = tid == _data.id ? ' selected' : '';

                            select.push('<option value="' + _data.id + '"' + selected + '>' + _data.name + '</option>');
                        }

                        $('#select_field').html('<select name="stc_tid" id="templates_list">' + select.join('') + '</select>');
                        selectize('#templates_list');
                    }

                    $('#addtemplate').find('input').attr('disabled', true);
                    $('#addtemplate').hide();
                },
                dataType: "JSON"
            });
        },


        dropdown: function dropdown() {
            $('.trigger-dropdown').on('click', function () {
                var dd = $(this).data('toggle');
                $('#dropdown-' + dd).toggle();
            });
        },

        cleditor: function cleditor() {
            if (typeof jQuery.cleditor !== 'undefined') {
                $(".redactor_cleditor").cleditor();
            }
        },

        notify: function notify(text, status) {
            clearTimeout(notify_timeout);

            if (!$('body').find('.notify-message').length) {
                _notify = $('<div class="notify notify-message">' + text + '</div>');

                $('body').append(_notify);

                setTimeout(function () {
                    _notify.addClass('animate');
                }, 10);
            }

            notify_timeout = setTimeout(function () {

                _notify.removeClass('animate');

                setTimeout(function () {

                    _notify.remove();
                }, 300);
            }, 2500);
        },

        fileChange: function fileChange(element) {
            var filename = element.value;

            if (filename.lastIndexOf('\\')) {
                var i = filename.lastIndexOf('\\') + 1;
            } else {
                var i = filename.lastIndexOf('/') + 1;
            }
            filename = filename.slice(i);

            $(element).closest('.file--upload').find('.file--upload-placehoder').html(filename);
        },

        binding: function binding(name, element) {
            $('input[name="' + name + '"]').on('keyup', function () {
                if (this.value != '') {
                    $('input[name="' + element + '"]').val(transliterate(this.value, URL_TRANSLATE));
                }
            });
        },

        saveSettings: function saveSettings(id, e) {
            if (typeof e !== 'undefined') {
                e.preventDefault ? e.preventDefault() : e.returnValue = !1;
            }

            var arr = {},
                block = '#settings-container-toggle-' + id;

            $(block).find('input, select').each(function () {
                var type = $(this).attr('type'),
                    name = $(this).attr('name'),
                    value = $(this).val();

                if (typeof name !== 'undefined') {
                    if (type !== 'radio' && type !== 'checkbox' || $(this).is(':checked') === true) {
                        name = name.replace('SETTINGS_', '');
                        arr[name] = value;
                    }
                }
            });

            $.post('/' + ADMIN_DIR + '/structure/saveSettings/', { 'arr': arr }, function (data) {

                if (data.result == 1) {
                    cp.notify('Сохранено', 'success');
                }
            }, 'JSON');

            return !1;
        },

        removeSettings: function removeSettings(id, e) {
            if (typeof e !== 'undefined') {
                e.preventDefault ? e.preventDefault() : e.returnValue = !1;
            }

            if (cp.dialog("Вы дейсвительно хотите удалить блок?")) {
                $.post('/' + ADMIN_DIR + '/structure/removeSettings/', { 'id': id }, function (data) {
                    if (data.result == 1) {
                        $('#settings-' + id).remove();
                        $('#breadcrumbs-' + id).remove();
                        $('#container-' + id).remove();
                        $('#emptysplash-' + id).remove();
                    }
                }, 'JSON');
            }

            return !1;
        },

        arrLength: function arrLength(obj) {
            var i = 0;
            for (var x in obj) {
                if (obj.hasOwnProperty(x)) i++;
            }return i;
        },

        loadSettings: function loadSettings(val, id, item) {
            var arr = { 1: 'type', 2: 'item', 3: 'mode' },
                prev = '',
                action = '',
                mode = '',
                lvl = 1,
                next,
                block = 'cnt_' + item + '-' + id;

            if (item == 'type') {
                lvl = 1;
                action = val;
            } else if (item == 'item') {
                lvl = 2;
                action = $('#cnt_' + arr[1] + '-' + id).find('option:selected').val();
                mode = val;
            } else if (item == 'mode') {
                lvl = 3;
                action = $('#cnt_' + arr[2] + '-' + id).find('option:selected').val();
                mode = val;
            }

            next = lvl + 1;

            for (var xx = next; xx <= 4; xx++) {
                if ($('#block-lvl' + xx + '-' + id).length > 0) {
                    $('#block-lvl' + xx + '-' + id).remove();
                }
            }

            $.post('/' + ADMIN_DIR + '/structure/loadSettings/', { 'action': action, 'mode': mode }, function (data) {
                if (typeof data !== 'undefined' && cp.arrLength(data) > 0) {
                    var select = [],
                        hash = 'cnt_' + arr[next] + '-' + id,
                        block = 'cnt_item-' + id + '-type';

                    select.push('<div class="block-settings-select-block lvl' + next + '" id="block-lvl' + next + '-' + id + '">');
                    select.push('<select name="SETTINGS_' + arr[next] + '_' + id + '" id="' + hash + '" onchange="cp.loadSettings(this.value, ' + id + ', \'' + arr[next] + '\');">');

                    select.push(' <option value="" selected>Выбрать</option>');

                    for (var system in data) {
                        select.push('<option value="' + system + '">' + data[system] + '</option>');
                    }

                    select.push('</select>');
                    select.push('</div>');

                    $('#block-settings-select-block-' + id).append(select.join(''));

                    selectize('#' + hash);
                }
            }, 'JSON');
        },

        toggleModule: function toggleModule(element, e) {
            if (typeof e !== 'undefined') {
                e.preventDefault ? e.preventDefault() : e.returnValue = !1;
            }

            var path = $(element).attr('href');

            $(element).append('<i class="loading"></i>');

            $.post(path, function (data) {
                if (data.status === true) {
                    if ($(element).hasClass('icon-eye-off')) {
                        $(element).removeClass('icon-eye-off').addClass('icon-eye').html('');
                    } else {
                        $(element).removeClass('icon-eye').addClass('icon-eye-off').html('');
                    }
                }
            }, 'JSON');

            return !1;
        },

        toggleSettings: function toggleSettings(element, e) {
            if (typeof e !== 'undefined') {
                e.preventDefault ? e.preventDefault() : e.returnValue = !1;
            }

            var href = $(element).attr('href').substr(1);

            $(element).toggleClass('block-settings-open');
            $("#" + href).toggle();

            return !1;
        },

        tableToggle: function tableToggle(id, e) {
            if (typeof e !== 'undefined') {
                e.preventDefault ? e.preventDefault() : e.returnValue = !1;
            }

            var hash = window.location.pathname.replace(/\//g, "|"),
                PATH_HASH = md5(hash);
            var cookie_toggle = id + '_toogle_' + PATH_HASH;

            if (typeof e == 'undefined') {
                if (typeof $.cookie(cookie_toggle) == 'undefined') {
                    $("#" + id + " th .table_hdr").removeClass('table_u').addClass('table_d');
                    $("#" + id + " tr:not(.th)").hide();
                }
            } else {
                $("#" + id + " th .table_hdr").toggleClass('table_u').toggleClass('table_d');
                $("#" + id + " tr:not(.th)").toggle();

                if ($("#" + id + " tr:not(.th)").is(':visible')) {
                    $.cookie(cookie_toggle, 'show', { expires: 30, path: '/' });
                } else {
                    $.removeCookie(cookie_toggle, { path: '/' });
                }
            }

            return !1;
        },

        tableToggleList: function tableToggleList() {
            var hash = window.location.pathname.replace(/\//g, "|"),
                PATH_HASH = md5(hash);

            if ($('.table-toggle-trigger').length > 0) {
                $('.table-toggle-trigger').each(function () {
                    var id = this.id,
                        cookie_toggle = id + '_toogle_' + PATH_HASH;

                    if (typeof $.cookie(cookie_toggle) !== 'undefined') {
                        $("#" + id + " th .table_hdr").addClass('table_u').removeClass('table_d');
                        $("#" + id + " tr:not(.th)").show();
                    } else {
                        $("#" + id + " th .table_hdr").removeClass('table_u').addClass('table_d');
                        $("#" + id + " tr:not(.th)").hide();
                    }
                });
            }
        },

        addBlock: function addBlock(parent, e) {
            if (typeof e !== 'undefined') {
                e.preventDefault ? e.preventDefault() : e.returnValue = !1;
            }

            var order = 10;

            if ($('#cont_data').find('.block-settings-order-input').length) {
                var temp = [];
                $('#cont_data').find('.block-settings-order-input').each(function () {
                    temp.push($(this).find('input').val());
                });

                if (temp.length) {
                    order = temp.max() + 10;
                }
            }

            $.post('/' + ADMIN_DIR + '/structure/getNewId/', { 'parent': parent, 'order': order }, function (newitem) {

                var row = ['<tr id="settings-' + newitem + '">', '<td class="settings-row">', '<div class="settings-container clearfix">', '<a href="#" onclick="return cp.removeSettings(' + newitem + ', event);" class="block-settings-link block-settings-remove"><i class="icon icon-delete"></i>Удалить блок</a>', '<a href="#settings-container-toggle-' + newitem + '" onclick="return cp.toggleSettings(this, event);" class="block-settings-link block-settings-title block-settings-open">', '<span class="block-settings-title-drop"><i class="icon icon-cog"></i></span>', '<span class="block-settings-title-text">Настройки блока</span>', '</a>', '<div class="settings-container-toggle opened" id="settings-container-toggle-' + newitem + '">', '<div class="block-settings-ln block-settings-visible clearfix">', '<div class="option-group option-combo option-simple">', '<label><input type="radio" name="SETTINGS_visible_' + newitem + '" value="1" checked="checked"><span class="option">Активен</span></label>', '<label class="disallow"><input type="radio" name="SETTINGS_visible_' + newitem + '" value="0"><span class="option">Не активен</span></label>', '</div>', '</div>', '<div class="block-settings-ln block-settings-order clearfix">', '<div class="block-settings-order-input">', '<input name="SETTINGS_ord_' + newitem + '" value="' + order + '" placeholder="Порядок">', '</div>', '</div>', '<div class="block-settings-ln block-settings-select clearfix" id="block-settings-select-block-' + newitem + '">', '<div class="block-settings-select-block lvl1" id="block-lvl1-' + newitem + '">', '<select name="SETTINGS_type_' + newitem + '" id="cnt_type-' + newitem + '" onchange="cp.loadSettings(this.value, ' + newitem + ', \'type\');"><option value="" selected>Выбрать</option><option value="redactor">Визуальный редактор</option><option value="editor">Редактор кода</option><option value="module">Модуль</option><option value="zone">Зона</option><option value="block">Блок</option><option value="banner">Баннер</option><option value="search">Поиск</option></select>', '</div>', '</div>', '<div class="block-settings-ln block-settings-system clearfix">', '<div class="block-settings-system-input">', '<input name="SETTINGS_system_' + newitem + '" value="" placeholder="Системное имя">', '</div>', '</div>', '<div class="block-settings-buttons clearfix">', '<a href="#" onclick="return cp.saveSettings(' + newitem + ', event);" class="button button-purple block-settings-save"><i class="icon icon-check-square"></i>Сохранить</a>', '</div>', '</div>', '</div>', '</td>', '</tr>'];

                $('#cont_data').find('tbody').append(row.join(''));

                selectize();
            });

            return !1;
        },

        dialog: function dialog(text) {
            return confirm(text);
        },

        indexation: function indexation(e) {
            if (typeof e !== 'undefined') {
                e.preventDefault ? e.preventDefault() : e.returnValue = !1;
            }

            if (cp.dialog('Начать индексацию?')) {
                $('#indexation-good').hide();
                $('#loader').fadeIn();

                var iurl = '/' + ADMIN_DIR + '/search/indexer/';

                $.ajax({
                    url: iurl,
                    type: 'get',
                    data: {
                        start: 0
                    },
                    success: function success(data) {
                        if (data != "good") {
                            $.get(iurl, {
                                start: data
                            });
                        } else {
                            $("#loader").fadeOut();
                            $("#indexation-good").show();
                        }
                    },
                    error: function error(response) {}
                });
            }
        },

        push: function push(item) {
            data.push(item);
        },

        pop: function pop() {
            return data.pop();
        },

        length: function length() {
            return data.length;
        }
    };
}(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9jcC5qcyJdLCJuYW1lcyI6WyJjcCIsIiQiLCJkYXRhIiwibm90aWZ5X3RpbWVvdXQiLCJub3RpZnkiLCJhZGRUZW1wbGF0ZSIsImUiLCJmaW5kIiwiYXR0ciIsInRvZ2dsZSIsImFkZFRlbXBsYXRlRmlsZSIsInRpZCIsIm5hbWUiLCJ2YWwiLCJmaWxlIiwiYWpheCIsInVybCIsIkFETUlOX0RJUiIsInR5cGUiLCJhY3QiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJsZW5ndGgiLCJzZWxlY3QiLCJ4Iiwic2VsZWN0ZWQiLCJpZCIsInB1c2giLCJodG1sIiwiam9pbiIsInNlbGVjdGl6ZSIsImhpZGUiLCJkYXRhVHlwZSIsImRyb3Bkb3duIiwib24iLCJkZCIsImNsZWRpdG9yIiwialF1ZXJ5IiwidGV4dCIsInN0YXR1cyIsImNsZWFyVGltZW91dCIsImFwcGVuZCIsInNldFRpbWVvdXQiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwicmVtb3ZlIiwiZmlsZUNoYW5nZSIsImVsZW1lbnQiLCJmaWxlbmFtZSIsInZhbHVlIiwibGFzdEluZGV4T2YiLCJpIiwic2xpY2UiLCJjbG9zZXN0IiwiYmluZGluZyIsInRyYW5zbGl0ZXJhdGUiLCJVUkxfVFJBTlNMQVRFIiwic2F2ZVNldHRpbmdzIiwicHJldmVudERlZmF1bHQiLCJyZXR1cm5WYWx1ZSIsImFyciIsImJsb2NrIiwiZWFjaCIsImlzIiwicmVwbGFjZSIsInBvc3QiLCJyZXN1bHQiLCJyZW1vdmVTZXR0aW5ncyIsImRpYWxvZyIsImFyckxlbmd0aCIsIm9iaiIsImhhc093blByb3BlcnR5IiwibG9hZFNldHRpbmdzIiwiaXRlbSIsInByZXYiLCJhY3Rpb24iLCJtb2RlIiwibHZsIiwibmV4dCIsInh4IiwiaGFzaCIsInN5c3RlbSIsInRvZ2dsZU1vZHVsZSIsInBhdGgiLCJoYXNDbGFzcyIsInRvZ2dsZVNldHRpbmdzIiwiaHJlZiIsInN1YnN0ciIsInRvZ2dsZUNsYXNzIiwidGFibGVUb2dnbGUiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwiUEFUSF9IQVNIIiwibWQ1IiwiY29va2llX3RvZ2dsZSIsImNvb2tpZSIsImV4cGlyZXMiLCJyZW1vdmVDb29raWUiLCJ0YWJsZVRvZ2dsZUxpc3QiLCJzaG93IiwiYWRkQmxvY2siLCJwYXJlbnQiLCJvcmRlciIsInRlbXAiLCJtYXgiLCJuZXdpdGVtIiwicm93IiwiY29uZmlybSIsImluZGV4YXRpb24iLCJmYWRlSW4iLCJpdXJsIiwic3RhcnQiLCJnZXQiLCJmYWRlT3V0IiwiZXJyb3IiLCJwb3AiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsS0FBTSxVQUFTQyxDQUFULEVBQVk7QUFDcEIsUUFBSUMsT0FBTyxFQUFYOztBQUVBLFFBQUlDLGNBQUosRUFBb0JDLE9BQXBCOztBQUVBLFdBQU87QUFFSEMsbUJBRkcsdUJBRVVDLENBRlYsRUFFYTtBQUNaTCxjQUFFLGNBQUYsRUFBa0JNLElBQWxCLENBQXVCLE9BQXZCLEVBQWdDQyxJQUFoQyxDQUFxQyxVQUFyQyxFQUFpRCxLQUFqRDtBQUNBUCxjQUFFLGNBQUYsRUFBa0JRLE1BQWxCO0FBQ0gsU0FMRTtBQU9IQyx1QkFQRywyQkFPY0MsR0FQZCxFQU9tQjtBQUNsQixnQkFBSUMsT0FBT1gsRUFBRSxnQkFBRixFQUFvQlksR0FBcEIsRUFBWDtBQUFBLGdCQUNJQyxPQUFPYixFQUFFLGdCQUFGLEVBQW9CWSxHQUFwQixFQURYOztBQUdBWixjQUFFYyxJQUFGLENBQU87QUFDSEMscUJBQUssTUFBTUMsU0FBTixHQUFrQixrQkFEcEI7QUFFSEMsc0JBQU0sTUFGSDtBQUdIaEIsc0JBQU07QUFDRmlCLHlCQUFLLGlCQURIO0FBRUZQLDBCQUFNQSxJQUZKO0FBR0ZFLDBCQUFNQTtBQUhKLGlCQUhIO0FBUUhNLHlCQUFTLGlCQUFTQyxRQUFULEVBQW1CO0FBQ3hCLHdCQUFJQSxTQUFTQyxNQUFiLEVBQXFCO0FBQ2pCLDRCQUFNQyxTQUFTLEVBQWY7O0FBRUEsNkJBQUksSUFBSUMsQ0FBUixJQUFhSCxR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VThDLElBQVY7QUFDSCxTQTVjRTs7QUE4Y0gyQyxhQUFLLGVBQ0w7QUFDSSxtQkFBT2xILEtBQUtrSCxHQUFMLEVBQVA7QUFDSCxTQWpkRTs7QUFtZEg5RixnQkFBUSxrQkFBVztBQUNmLG1CQUFPcEIsS0FBS29CLE1BQVo7QUFDSDtBQXJkRSxLQUFQO0FBdWRILENBNWRXLENBNGRWZSxNQTVkVSxDQUFaIiwiZmlsZSI6Il9jcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGNwID0gKGZ1bmN0aW9uKCQpIHtcbiAgICB2YXIgZGF0YSA9IFtdO1xuXG4gICAgdmFyIG5vdGlmeV90aW1lb3V0LCBub3RpZnk7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIGFkZFRlbXBsYXRlIChlKSB7XG4gICAgICAgICAgICAkKCcjYWRkdGVtcGxhdGUnKS5maW5kKCdpbnB1dCcpLmF0dHIoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgJCgnI2FkZHRlbXBsYXRlJykudG9nZ2xlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkVGVtcGxhdGVGaWxlICh0aWQpIHtcbiAgICAgICAgICAgIHZhciBuYW1lID0gJCgnI3RlbXBsYXRlX25hbWUnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBmaWxlID0gJCgnI3RlbXBsYXRlX2ZpbGUnKS52YWwoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvJyArIEFETUlOX0RJUiArICcvYWpheC9zdHJ1Y3R1cmUvJyxcbiAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGFjdDogXCJhamF4QWRkVGVtcGxhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZmlsZTogZmlsZSBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlbGVjdCA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHggaW4gcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gcmVzcG9uc2VbeF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSAodGlkID09IGRhdGEuaWQpID8gJyBzZWxlY3RlZCcgOiAnJztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPG9wdGlvbiB2YWx1ZT1cIicrZGF0YS5pZCsnXCInK3NlbGVjdGVkKyc+JytkYXRhLm5hbWUrJzwvb3B0aW9uPidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNzZWxlY3RfZmllbGQnKS5odG1sKCc8c2VsZWN0IG5hbWU9XCJzdGNfdGlkXCIgaWQ9XCJ0ZW1wbGF0ZXNfbGlzdFwiPicrc2VsZWN0LmpvaW4oJycpKyc8L3NlbGVjdD4nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGl6ZSgnI3RlbXBsYXRlc19saXN0Jyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAkKCcjYWRkdGVtcGxhdGUnKS5maW5kKCdpbnB1dCcpLmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICQoJyNhZGR0ZW1wbGF0ZScpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcIkpTT05cIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZHJvcGRvd246IGZ1bmN0aW9uICgpXG4gICAgICAgIHtcbiAgICAgICAgICAgICQoJy50cmlnZ2VyLWRyb3Bkb3duJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgZGQgPSAkKHRoaXMpLmRhdGEoJ3RvZ2dsZScpO1xuICAgICAgICAgICAgICAgICQoJyNkcm9wZG93bi0nICsgZGQpLnRvZ2dsZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2xlZGl0b3I6IGZ1bmN0aW9uICgpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YoalF1ZXJ5LmNsZWRpdG9yKSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJChcIi5yZWRhY3Rvcl9jbGVkaXRvclwiKS5jbGVkaXRvcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIG5vdGlmeTogZnVuY3Rpb24gKHRleHQsIHN0YXR1cylcbiAgICAgICAge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KG5vdGlmeV90aW1lb3V0KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCEkKCdib2R5JykuZmluZCgnLm5vdGlmeS1tZXNzYWdlJykubGVuZ3RoKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5vdGlmeSA9ICQoJzxkaXYgY2xhc3M9XCJub3RpZnkgbm90aWZ5LW1lc3NhZ2VcIj4nICsgdGV4dCArICc8L2Rpdj4nKTtcblxuICAgICAgICAgICAgICAgICQoJ2JvZHknKS5hcHBlbmQobm90aWZ5KTtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgbm90aWZ5LmFkZENsYXNzKCdhbmltYXRlJyk7XG4gICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBub3RpZnlfdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBub3RpZnkucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICAgICBub3RpZnkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0sIDMwMCk7XG5cbiAgICAgICAgICAgIH0sIDI1MDApO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZpbGVDaGFuZ2U6IGZ1bmN0aW9uKGVsZW1lbnQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBmaWxlbmFtZSA9IGVsZW1lbnQudmFsdWU7XG5cbiAgICAgICAgICAgIGlmIChmaWxlbmFtZS5sYXN0SW5kZXhPZignXFxcXCcpKXtcbiAgICAgICAgICAgICAgICB2YXIgaSA9IGZpbGVuYW1lLmxhc3RJbmRleE9mKCdcXFxcJykrMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgdmFyIGkgPSBmaWxlbmFtZS5sYXN0SW5kZXhPZignLycpKzE7XG4gICAgICAgICAgICB9ICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIGZpbGVuYW1lID0gZmlsZW5hbWUuc2xpY2UoaSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICQoZWxlbWVudCkuY2xvc2VzdCgnLmZpbGUtLXVwbG9hZCcpLmZpbmQoJy5maWxlLS11cGxvYWQtcGxhY2Vob2RlcicpLmh0bWwoZmlsZW5hbWUpO1xuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgYmluZGluZzogZnVuY3Rpb24obmFtZSwgZWxlbWVudClcbiAgICAgICAge1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cIicgKyBuYW1lICsgJ1wiXScpLm9uKCdrZXl1cCcsIGZ1bmN0aW9uKCl7XG5cdFx0ICAgICAgICBpZiAodGhpcy52YWx1ZSAhPSAnJylcblx0XHQgICAgICAgIHtcblx0XHQgICAgICAgIFx0JCgnaW5wdXRbbmFtZT1cIicgKyBlbGVtZW50ICsgJ1wiXScpLnZhbCh0cmFuc2xpdGVyYXRlKHRoaXMudmFsdWUsIFVSTF9UUkFOU0xBVEUpKTtcblx0XHQgICAgICAgIH1cblx0XHQgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc2F2ZVNldHRpbmdzOiBmdW5jdGlvbihpZCwgZSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYodHlwZW9mIGUgIT09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQgPyBlLnByZXZlbnREZWZhdWx0KCkgOiBlLnJldHVyblZhbHVlID0gITE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhcnIgPSB7fSwgYmxvY2sgPSAnI3NldHRpbmdzLWNvbnRhaW5lci10b2dnbGUtJyArIGlkO1xuXG4gICAgICAgICAgICAkKGJsb2NrKS5maW5kKCdpbnB1dCwgc2VsZWN0JykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciB0eXBlID0gJCh0aGlzKS5hdHRyKCd0eXBlJyksIG5hbWUgPSAkKHRoaXMpLmF0dHIoJ25hbWUnKSwgdmFsdWUgPSAkKHRoaXMpLnZhbCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZihuYW1lKSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZih0eXBlICE9PSAncmFkaW8nICYmIHR5cGUgIT09ICdjaGVja2JveCcgfHwgJCh0aGlzKS5pcygnOmNoZWNrZWQnKSA9PT0gdHJ1ZSlcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgnU0VUVElOR1NfJywgJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJyW25hbWVdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJC5wb3N0KCcvJyArIEFETUlOX0RJUiArICcvc3RydWN0dXJlL3NhdmVTZXR0aW5ncy8nLCB7ICdhcnInOiBhcnIgfSwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYoZGF0YS5yZXN1bHQgPT0gMSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNwLm5vdGlmeSgn0KHQvtGF0YDQsNC90LXQvdC+JywgJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0sICdKU09OJyk7XG5cbiAgICAgICAgICAgIHJldHVybiAhMTtcbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmVTZXR0aW5nczogZnVuY3Rpb24oaWQsIGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlICE9PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0ID8gZS5wcmV2ZW50RGVmYXVsdCgpIDogZS5yZXR1cm5WYWx1ZSA9ICExO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY3AuZGlhbG9nKFwi0JLRiyDQtNC10LnRgdCy0LjRgtC10LvRjNC90L4g0YXQvtGC0LjRgtC1INGD0LTQsNC70LjRgtGMINCx0LvQvtC6P1wiKSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAkLnBvc3QoJy8nICsgQURNSU5fRElSICsgJy9zdHJ1Y3R1cmUvcmVtb3ZlU2V0dGluZ3MvJywgeyAnaWQnOiBpZCB9LCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGRhdGEucmVzdWx0ID09IDEpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNzZXR0aW5ncy0nK2lkKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNicmVhZGNydW1icy0nK2lkKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNjb250YWluZXItJytpZCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjZW1wdHlzcGxhc2gtJytpZCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCAnSlNPTicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gITE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYXJyTGVuZ3RoOiBmdW5jdGlvbihvYmopXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBpPTA7XG4gICAgICAgICAgICBmb3IgKHZhciB4IGluIG9iaikgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eSh4KSkgaSsrO1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbG9hZFNldHRpbmdzOiBmdW5jdGlvbih2YWwsIGlkLCBpdGVtKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgYXJyID0geyAxOiAndHlwZScsIDI6ICdpdGVtJywgMzogJ21vZGUnIH0sIHByZXYgPSAnJywgYWN0aW9uID0gJycsIG1vZGUgPSAnJywgbHZsID0gMSwgbmV4dCwgYmxvY2sgPSAnY250XycgKyBpdGVtICsgJy0nICsgaWQ7XG5cbiAgICAgICAgICAgIGlmKGl0ZW0gPT0gJ3R5cGUnKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGx2bCA9IDE7XG4gICAgICAgICAgICAgICAgYWN0aW9uID0gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihpdGVtID09ICdpdGVtJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsdmwgPSAyO1xuICAgICAgICAgICAgICAgIGFjdGlvbiA9ICQoJyNjbnRfJyArIGFyclsxXSArICctJyArIGlkKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS52YWwoKTtcbiAgICAgICAgICAgICAgICBtb2RlID0gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihpdGVtID09ICdtb2RlJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsdmwgPSAzO1xuICAgICAgICAgICAgICAgIGFjdGlvbiA9ICQoJyNjbnRfJyArIGFyclsyXSArICctJyArIGlkKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS52YWwoKTtcbiAgICAgICAgICAgICAgICBtb2RlID0gdmFsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBuZXh0ID0gbHZsICsgMTtcblxuICAgICAgICAgICAgZm9yKHZhciB4eCA9IG5leHQ7IHh4IDw9IDQ7IHh4ICsrKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmKCQoJyNibG9jay1sdmwnICsgeHggKyAnLScgKyBpZCkubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICQoJyNibG9jay1sdmwnICsgeHggKyAnLScgKyBpZCkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkLnBvc3QoJy8nICsgQURNSU5fRElSICsgJy9zdHJ1Y3R1cmUvbG9hZFNldHRpbmdzLycsIHsgJ2FjdGlvbic6IGFjdGlvbiwgJ21vZGUnOiBtb2RlIH0sIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YoZGF0YSkgIT09ICd1bmRlZmluZWQnICYmIGNwLmFyckxlbmd0aChkYXRhKSA+IDApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ID0gW10sIGhhc2ggPSAnY250XycgKyBhcnJbbmV4dF0gKyAnLScgKyBpZCwgYmxvY2sgPSAnY250X2l0ZW0tJyArIGlkICsgJy10eXBlJztcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdC5wdXNoKCc8ZGl2IGNsYXNzPVwiYmxvY2stc2V0dGluZ3Mtc2VsZWN0LWJsb2NrIGx2bCcgKyBuZXh0ICsgJ1wiIGlkPVwiYmxvY2stbHZsJyArIG5leHQgKyAnLScgKyBpZCArICdcIj4nKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnB1c2goJzxzZWxlY3QgbmFtZT1cIlNFVFRJTkdTXycgKyBhcnJbbmV4dF0gKyAnXycgKyBpZCArICdcIiBpZD1cIicgKyBoYXNoICsgJ1wiIG9uY2hhbmdlPVwiY3AubG9hZFNldHRpbmdzKHRoaXMudmFsdWUsICcgKyBpZCArICcsIFxcJycgKyBhcnJbbmV4dF0gKyAnXFwnKTtcIj4nKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdC5wdXNoKCcgPG9wdGlvbiB2YWx1ZT1cIlwiIHNlbGVjdGVkPtCS0YvQsdGA0LDRgtGMPC9vcHRpb24+Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgc3lzdGVtIGluIGRhdGEpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdC5wdXNoKCc8b3B0aW9uIHZhbHVlPVwiJyArIHN5c3RlbSArICdcIj4nICsgZGF0YVtzeXN0ZW1dICsgJzwvb3B0aW9uPicpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0LnB1c2goJzwvc2VsZWN0PicpO1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3QucHVzaCgnPC9kaXY+Jyk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAkKCcjYmxvY2stc2V0dGluZ3Mtc2VsZWN0LWJsb2NrLScgKyBpZCkuYXBwZW5kKHNlbGVjdC5qb2luKCcnKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aXplKCcjJytoYXNoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0sICdKU09OJyk7XG4gICAgICAgICAgIFxuICAgICAgICB9LFxuXG4gICAgICAgIHRvZ2dsZU1vZHVsZTogZnVuY3Rpb24oZWxlbWVudCwgZSlcbiAgICAgICAge1xuICAgICAgICAgICAgaWYodHlwZW9mIGUgIT09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQgPyBlLnByZXZlbnREZWZhdWx0KCkgOiBlLnJldHVyblZhbHVlID0gITE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBwYXRoID0gJChlbGVtZW50KS5hdHRyKCdocmVmJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICQoZWxlbWVudCkuYXBwZW5kKCc8aSBjbGFzcz1cImxvYWRpbmdcIj48L2k+Jyk7XG5cbiAgICAgICAgICAgICQucG9zdChwYXRoLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSB0cnVlKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQoZWxlbWVudCkuaGFzQ2xhc3MoJ2ljb24tZXllLW9mZicpKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLnJlbW92ZUNsYXNzKCdpY29uLWV5ZS1vZmYnKS5hZGRDbGFzcygnaWNvbi1leWUnKS5odG1sKCcnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoZWxlbWVudCkucmVtb3ZlQ2xhc3MoJ2ljb24tZXllJykuYWRkQ2xhc3MoJ2ljb24tZXllLW9mZicpLmh0bWwoJycpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgJ0pTT04nKTtcblxuICAgICAgICAgICAgcmV0dXJuICExO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRvZ2dsZVNldHRpbmdzOiBmdW5jdGlvbihlbGVtZW50LCBlKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZih0eXBlb2YgZSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCA/IGUucHJldmVudERlZmF1bHQoKSA6IGUucmV0dXJuVmFsdWUgPSAhMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGhyZWYgPSAkKGVsZW1lbnQpLmF0dHIoJ2hyZWYnKS5zdWJzdHIoMSk7XG5cbiAgICAgICAgICAgICQoZWxlbWVudCkudG9nZ2xlQ2xhc3MoJ2Jsb2NrLXNldHRpbmdzLW9wZW4nKTtcbiAgICAgICAgICAgICQoXCIjXCIraHJlZikudG9nZ2xlKCk7XG5cbiAgICAgICAgICAgIHJldHVybiAhMTtcbiAgICAgICAgfSxcblxuICAgICAgICB0YWJsZVRvZ2dsZTogZnVuY3Rpb24oaWQsIGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlICE9PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0ID8gZS5wcmV2ZW50RGVmYXVsdCgpIDogZS5yZXR1cm5WYWx1ZSA9ICExO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC8vZywgXCJ8XCIpLCBQQVRIX0hBU0ggPSBtZDUoaGFzaCk7XG4gICAgICAgICAgICB2YXIgY29va2llX3RvZ2dsZSA9IGlkICsgJ190b29nbGVfJyArIFBBVEhfSEFTSDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYodHlwZW9mKGUpID09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YoJC5jb29raWUoY29va2llX3RvZ2dsZSkpID09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJChcIiNcIitpZCtcIiB0aCAudGFibGVfaGRyXCIpLnJlbW92ZUNsYXNzKCd0YWJsZV91JykuYWRkQ2xhc3MoJ3RhYmxlX2QnKTtcbiAgICAgICAgICAgICAgICAgICAgJChcIiNcIitpZCtcIiB0cjpub3QoLnRoKVwiKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICQoXCIjXCIraWQrXCIgdGggLnRhYmxlX2hkclwiKS50b2dnbGVDbGFzcygndGFibGVfdScpLnRvZ2dsZUNsYXNzKCd0YWJsZV9kJyk7XG4gICAgICAgICAgICAgICAgJChcIiNcIitpZCtcIiB0cjpub3QoLnRoKVwiKS50b2dnbGUoKTsgICBcbiAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmKCQoXCIjXCIraWQrXCIgdHI6bm90KC50aClcIikuaXMoJzp2aXNpYmxlJykpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAkLmNvb2tpZShjb29raWVfdG9nZ2xlLCAnc2hvdycsIHsgZXhwaXJlczogMzAsIHBhdGg6ICcvJyB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJC5yZW1vdmVDb29raWUoY29va2llX3RvZ2dsZSwgeyBwYXRoOiAnLycgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gITE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdGFibGVUb2dnbGVMaXN0OiBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBoYXNoID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcLy9nLCBcInxcIiksIFBBVEhfSEFTSCA9IG1kNShoYXNoKTtcblxuICAgICAgICAgICAgaWYoJCgnLnRhYmxlLXRvZ2dsZS10cmlnZ2VyJykubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAkKCcudGFibGUtdG9nZ2xlLXRyaWdnZXInKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IHRoaXMuaWQsIGNvb2tpZV90b2dnbGUgPSBpZCArICdfdG9vZ2xlXycgKyBQQVRIX0hBU0g7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YoJC5jb29raWUoY29va2llX3RvZ2dsZSkpICE9PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIiNcIitpZCtcIiB0aCAudGFibGVfaGRyXCIpLmFkZENsYXNzKCd0YWJsZV91JykucmVtb3ZlQ2xhc3MoJ3RhYmxlX2QnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIjXCIraWQrXCIgdHI6bm90KC50aClcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIiNcIitpZCtcIiB0aCAudGFibGVfaGRyXCIpLnJlbW92ZUNsYXNzKCd0YWJsZV91JykuYWRkQ2xhc3MoJ3RhYmxlX2QnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIjXCIraWQrXCIgdHI6bm90KC50aClcIikuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkQmxvY2s6IGZ1bmN0aW9uIChwYXJlbnQsIGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBlICE9PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0ID8gZS5wcmV2ZW50RGVmYXVsdCgpIDogZS5yZXR1cm5WYWx1ZSA9ICExO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgb3JkZXIgPSAxMDtcblxuICAgICAgICAgICAgaWYoJCgnI2NvbnRfZGF0YScpLmZpbmQoJy5ibG9jay1zZXR0aW5ncy1vcmRlci1pbnB1dCcpLmxlbmd0aClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IFtdO1xuICAgICAgICAgICAgICAgICQoJyNjb250X2RhdGEnKS5maW5kKCcuYmxvY2stc2V0dGluZ3Mtb3JkZXItaW5wdXQnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAucHVzaCgkKHRoaXMpLmZpbmQoJ2lucHV0JykudmFsKCkpO1xuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICBpZih0ZW1wLmxlbmd0aClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIG9yZGVyID0gdGVtcC5tYXgoKSArIDEwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJC5wb3N0KCcvJyArIEFETUlOX0RJUiArICcvc3RydWN0dXJlL2dldE5ld0lkLycsIHsgJ3BhcmVudCc6IHBhcmVudCwgJ29yZGVyJzogb3JkZXIgfSwgZnVuY3Rpb24obmV3aXRlbSkge1xuICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgcm93ID0gW1xuICAgICAgICAgICAgICAgICAgICAnPHRyIGlkPVwic2V0dGluZ3MtJyArIG5ld2l0ZW0gKyAnXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICc8dGQgY2xhc3M9XCJzZXR0aW5ncy1yb3dcIj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwic2V0dGluZ3MtY29udGFpbmVyIGNsZWFyZml4XCI+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxhIGhyZWY9XCIjXCIgb25jbGljaz1cInJldHVybiBjcC5yZW1vdmVTZXR0aW5ncygnICsgbmV3aXRlbSArICcsIGV2ZW50KTtcIiBjbGFzcz1cImJsb2NrLXNldHRpbmdzLWxpbmsgYmxvY2stc2V0dGluZ3MtcmVtb3ZlXCI+PGkgY2xhc3M9XCJpY29uIGljb24tZGVsZXRlXCI+PC9pPtCj0LTQsNC70LjRgtGMINCx0LvQvtC6PC9hPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8YSBocmVmPVwiI3NldHRpbmdzLWNvbnRhaW5lci10b2dnbGUtJyArIG5ld2l0ZW0gKyAnXCIgb25jbGljaz1cInJldHVybiBjcC50b2dnbGVTZXR0aW5ncyh0aGlzLCBldmVudCk7XCIgY2xhc3M9XCJibG9jay1zZXR0aW5ncy1saW5rIGJsb2NrLXNldHRpbmdzLXRpdGxlIGJsb2NrLXNldHRpbmdzLW9wZW5cIj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiYmxvY2stc2V0dGluZ3MtdGl0bGUtZHJvcFwiPjxpIGNsYXNzPVwiaWNvbiBpY29uLWNvZ1wiPjwvaT48L3NwYW4+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImJsb2NrLXNldHRpbmdzLXRpdGxlLXRleHRcIj7QndCw0YHRgtGA0L7QudC60Lgg0LHQu9C+0LrQsDwvc3Bhbj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9hPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInNldHRpbmdzLWNvbnRhaW5lci10b2dnbGUgb3BlbmVkXCIgaWQ9XCJzZXR0aW5ncy1jb250YWluZXItdG9nZ2xlLScgKyBuZXdpdGVtICsgJ1wiPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJsb2NrLXNldHRpbmdzLWxuIGJsb2NrLXNldHRpbmdzLXZpc2libGUgY2xlYXJmaXhcIj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwib3B0aW9uLWdyb3VwIG9wdGlvbi1jb21ibyBvcHRpb24tc2ltcGxlXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxsYWJlbD48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cIlNFVFRJTkdTX3Zpc2libGVfJyArIG5ld2l0ZW0gKyAnXCIgdmFsdWU9XCIxXCIgY2hlY2tlZD1cImNoZWNrZWRcIj48c3BhbiBjbGFzcz1cIm9wdGlvblwiPtCQ0LrRgtC40LLQtdC9PC9zcGFuPjwvbGFiZWw+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxsYWJlbCBjbGFzcz1cImRpc2FsbG93XCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJTRVRUSU5HU192aXNpYmxlXycgKyBuZXdpdGVtICsgJ1wiIHZhbHVlPVwiMFwiPjxzcGFuIGNsYXNzPVwib3B0aW9uXCI+0J3QtSDQsNC60YLQuNCy0LXQvTwvc3Bhbj48L2xhYmVsPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyxcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJibG9jay1zZXR0aW5ncy1sbiBibG9jay1zZXR0aW5ncy1vcmRlciBjbGVhcmZpeFwiPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJibG9jay1zZXR0aW5ncy1vcmRlci1pbnB1dFwiPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8aW5wdXQgbmFtZT1cIlNFVFRJTkdTX29yZF8nICsgbmV3aXRlbSArICdcIiB2YWx1ZT1cIicgKyBvcmRlciArICdcIiBwbGFjZWhvbGRlcj1cItCf0L7RgNGP0LTQvtC6XCI+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJsb2NrLXNldHRpbmdzLWxuIGJsb2NrLXNldHRpbmdzLXNlbGVjdCBjbGVhcmZpeFwiIGlkPVwiYmxvY2stc2V0dGluZ3Mtc2VsZWN0LWJsb2NrLScgKyBuZXdpdGVtICsgJ1wiPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJibG9jay1zZXR0aW5ncy1zZWxlY3QtYmxvY2sgbHZsMVwiIGlkPVwiYmxvY2stbHZsMS0nICsgbmV3aXRlbSArICdcIj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHNlbGVjdCBuYW1lPVwiU0VUVElOR1NfdHlwZV8nICsgbmV3aXRlbSArICdcIiBpZD1cImNudF90eXBlLScgKyBuZXdpdGVtICsgJ1wiIG9uY2hhbmdlPVwiY3AubG9hZFNldHRpbmdzKHRoaXMudmFsdWUsICcgKyBuZXdpdGVtICsgJywgXFwndHlwZVxcJyk7XCI+PG9wdGlvbiB2YWx1ZT1cIlwiIHNlbGVjdGVkPtCS0YvQsdGA0LDRgtGMPC9vcHRpb24+PG9wdGlvbiB2YWx1ZT1cInJlZGFjdG9yXCI+0JLQuNC30YPQsNC70YzQvdGL0Lkg0YDQtdC00LDQutGC0L7RgDwvb3B0aW9uPjxvcHRpb24gdmFsdWU9XCJlZGl0b3JcIj7QoNC10LTQsNC60YLQvtGAINC60L7QtNCwPC9vcHRpb24+PG9wdGlvbiB2YWx1ZT1cIm1vZHVsZVwiPtCc0L7QtNGD0LvRjDwvb3B0aW9uPjxvcHRpb24gdmFsdWU9XCJ6b25lXCI+0JfQvtC90LA8L29wdGlvbj48b3B0aW9uIHZhbHVlPVwiYmxvY2tcIj7QkdC70L7Qujwvb3B0aW9uPjxvcHRpb24gdmFsdWU9XCJiYW5uZXJcIj7QkdCw0L3QvdC10YA8L29wdGlvbj48b3B0aW9uIHZhbHVlPVwic2VhcmNoXCI+0J/QvtC40YHQujwvb3B0aW9uPjwvc2VsZWN0PicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyxcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJibG9jay1zZXR0aW5ncy1sbiBibG9jay1zZXR0aW5ncy1zeXN0ZW0gY2xlYXJmaXhcIj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiYmxvY2stc2V0dGluZ3Mtc3lzdGVtLWlucHV0XCI+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxpbnB1dCBuYW1lPVwiU0VUVElOR1Nfc3lzdGVtXycgKyBuZXdpdGVtICsgJ1wiIHZhbHVlPVwiXCIgcGxhY2Vob2xkZXI9XCLQodC40YHRgtC10LzQvdC+0LUg0LjQvNGPXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImJsb2NrLXNldHRpbmdzLWJ1dHRvbnMgY2xlYXJmaXhcIj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8YSBocmVmPVwiI1wiIG9uY2xpY2s9XCJyZXR1cm4gY3Auc2F2ZVNldHRpbmdzKCcgKyBuZXdpdGVtICsgJywgZXZlbnQpO1wiIGNsYXNzPVwiYnV0dG9uIGJ1dHRvbi1wdXJwbGUgYmxvY2stc2V0dGluZ3Mtc2F2ZVwiPjxpIGNsYXNzPVwiaWNvbiBpY29uLWNoZWNrLXNxdWFyZVwiPjwvaT7QodC+0YXRgNCw0L3QuNGC0Yw8L2E+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L3RkPicsXG4gICAgICAgICAgICAgICAgICAgICc8L3RyPidcbiAgICAgICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICAgICAgJCgnI2NvbnRfZGF0YScpLmZpbmQoJ3Rib2R5JykuYXBwZW5kKHJvdy5qb2luKCcnKSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgc2VsZWN0aXplKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuICExO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRpYWxvZzogZnVuY3Rpb24gKHRleHQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maXJtKHRleHQpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluZGV4YXRpb246IGZ1bmN0aW9uIChlKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZih0eXBlb2YgZSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCA/IGUucHJldmVudERlZmF1bHQoKSA6IGUucmV0dXJuVmFsdWUgPSAhMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoY3AuZGlhbG9nKCfQndCw0YfQsNGC0Ywg0LjQvdC00LXQutGB0LDRhtC40Y4/JykpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJCgnI2luZGV4YXRpb24tZ29vZCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAkKCcjbG9hZGVyJykuZmFkZUluKCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgaXVybCA9ICcvJyArIEFETUlOX0RJUiArICcvc2VhcmNoL2luZGV4ZXIvJztcblxuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogaXVybCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiAwXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhICE9IFwiZ29vZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZ2V0KCBpdXJsLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBkYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKFwiI2xvYWRlclwiKS5mYWRlT3V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChcIiNpbmRleGF0aW9uLWdvb2RcIikuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24ocmVzcG9uc2UpXG4gICAgICAgICAgICAgICAgICAgIHt9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcHVzaDogZnVuY3Rpb24gKGl0ZW0pXG4gICAgICAgIHtcbiAgICAgICAgICAgIGRhdGEucHVzaChpdGVtKTtcbiAgICAgICAgfSxcbiAgICAgICAgXG4gICAgICAgIHBvcDogZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YS5wb3AoKTtcbiAgICAgICAgfSxcblxuICAgICAgICBsZW5ndGg6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGEubGVuZ3RoO1xuICAgICAgICB9XG4gICAgfTtcbn0oalF1ZXJ5KSk7XG4iXX0=

'use strict';

;(function ($) {
	"use strict";

	$.fn.timeoutClass = function (classname, timeout) {
		timeout = timeout || 10;
		var that = this;
		setTimeout(function () {
			$(that).toggleClass(classname);
		}, timeout);
	};

	$.fn.extend({
		popover: function popover(options) {
			this.defaults = {};
			var settings = $.extend({}, this.defaults, options),
			    isopen = false,
			    scrollShift = 100,
			    popover = {},
			    $page = $('#page-wrapper'),
			    onOpenScrollTop,
			    $popover,
			    $target;

			popover.position = function (target) {
				var left = 0,
				    ww = $(window).width(),
				    top = 0;

				if ($(target).hasClass('trigger-popover')) {
					$target = $(target);
				} else {
					$target = $(target).closest('.trigger-popover');
				}

				left = $target.offset().left + $target.width();
				top = $target.offset().top + $target.height() + 8;

				return { 'left': left, 'top': top };
			};

			popover.hide = function (callback) {
				if ($('.popover.open').length) {
					$popover = $('.popover.open');
					$popover.removeClass('animate');

					setTimeout(function () {
						$popover.removeClass('open');

						if (typeof callback == 'function') {
							callback.apply();
						}
					}, 250);
				} else {
					if (typeof callback == 'function') {
						callback.apply();
					}
				}
			};

			$page.on('click', function (e) {
				if ((isopen || $('.popover.open').length) && !$(e.target).closest('.trigger-popover').length && !$(e.target).closest('.popover').length) {
					popover.hide();
				}
			});

			$(window).resize(function () {
				popover.hide();
			});

			$page.scroll(function () {
				if (isopen === true && (onOpenScrollTop + scrollShift < $page.scrollTop() || onOpenScrollTop - scrollShift > $page.scrollTop())) {
					popover.hide();
				}
			});

			return this.each(function () {
				$(this).on('click', function (e) {
					e.preventDefault();

					var block = $(this).data('popover'),
					    $popover;

					isopen = true;

					popover.hide(function () {

						if ($('#popover-' + block).length == 0) {
							$popover = $(template('tpl_' + block, {}));
							$page.append($popover);
						} else {
							$popover = $('#popover-' + block);
						}

						if (!$('#popover-' + block).hasClass('open')) {
							onOpenScrollTop = $page.scrollTop();

							$popover.css(popover.position(e.target));
							$popover.toggleClass('open').timeoutClass('animate');
						}
					});
				});
			});
		}
	});
})(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9wb3BvdmVyLmpzIl0sIm5hbWVzIjpbIiQiLCJmbiIsInRpbWVvdXRDbGFzcyIsImNsYXNzbmFtZSIsInRpbWVvdXQiLCJ0aGF0Iiwic2V0VGltZW91dCIsInRvZ2dsZUNsYXNzIiwiZXh0ZW5kIiwicG9wb3ZlciIsIm9wdGlvbnMiLCJkZWZhdWx0cyIsInNldHRpbmdzIiwiaXNvcGVuIiwic2Nyb2xsU2hpZnQiLCIkcGFnZSIsIm9uT3BlblNjcm9sbFRvcCIsIiRwb3BvdmVyIiwiJHRhcmdldCIsInBvc2l0aW9uIiwidGFyZ2V0IiwibGVmdCIsInd3Iiwid2luZG93Iiwid2lkdGgiLCJ0b3AiLCJoYXNDbGFzcyIsImNsb3Nlc3QiLCJvZmZzZXQiLCJoZWlnaHQiLCJoaWRlIiwiY2FsbGJhY2siLCJsZW5ndGgiLCJyZW1vdmVDbGFzcyIsImFwcGx5Iiwib24iLCJlIiwicmVzaXplIiwic2Nyb2xsIiwic2Nyb2xsVG9wIiwiZWFjaCIsInByZXZlbnREZWZhdWx0IiwiYmxvY2siLCJkYXRhIiwidGVtcGxhdGUiLCJhcHBlbmQiLCJjc3MiLCJqUXVlcnkiXSwibWFwcGluZ3MiOiI7O0FBQUEsQ0FBQyxDQUFFLFVBQVVBLENBQVYsRUFBYTtBQUNmOztBQUVHQSxHQUFFQyxFQUFGLENBQUtDLFlBQUwsR0FBb0IsVUFBU0MsU0FBVCxFQUFvQkMsT0FBcEIsRUFBNkI7QUFDN0NBLFlBQVVBLFdBQVcsRUFBckI7QUFDQSxNQUFJQyxPQUFPLElBQVg7QUFDQUMsYUFBVyxZQUFVO0FBQ2pCTixLQUFFSyxJQUFGLEVBQVFFLFdBQVIsQ0FBb0JKLFNBQXBCO0FBQ0gsR0FGRCxFQUVHQyxPQUZIO0FBR0gsRUFORDs7QUFRSEosR0FBRUMsRUFBRixDQUFLTyxNQUFMLENBQVk7QUFDWEMsV0FBUyxpQkFBU0MsT0FBVCxFQUNUO0FBQ0MsUUFBS0MsUUFBTCxHQUFnQixFQUFoQjtBQUNBLE9BQUlDLFdBQVdaLEVBQUVRLE1BQUYsQ0FBVSxFQUFWLEVBQWMsS0FBS0csUUFBbkIs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dEIsVUFBSTlCLEVBQUUsY0FBYzBDLEtBQWhCLEVBQXVCVixNQUF2QixJQUFpQyxDQUFyQyxFQUNBO0FBQ0NmLGtCQUFXakIsRUFBRTRDLFNBQVMsU0FBU0YsS0FBbEIsRUFBeUIsRUFBekIsQ0FBRixDQUFYO0FBQ0EzQixhQUFNOEIsTUFBTixDQUFhNUIsUUFBYjtBQUNBLE9BSkQsTUFNQTtBQUNDQSxrQkFBV2pCLEVBQUUsY0FBYzBDLEtBQWhCLENBQVg7QUFDQTs7QUFFRCxVQUFJLENBQUMxQyxFQUFFLGNBQWMwQyxLQUFoQixFQUF1QmhCLFFBQXZCLENBQWdDLE1BQWhDLENBQUwsRUFDQTtBQUNDVix5QkFBa0JELE1BQU13QixTQUFOLEVBQWxCOztBQUVBdEIsZ0JBQVM2QixHQUFULENBQWFyQyxRQUFRVSxRQUFSLENBQWlCaUIsRUFBRWhCLE1BQW5CLENBQWI7QUFDQUgsZ0JBQVNWLFdBQVQsQ0FBcUIsTUFBckIsRUFBNkJMLFlBQTdCLENBQTBDLFNBQTFDO0FBQ0E7QUFFRCxNQXBCRDtBQXFCQSxLQTVCRDtBQThCQSxJQS9CTSxDQUFQO0FBZ0NBO0FBdEdVLEVBQVo7QUF3R0EsQ0FuSEEsRUFtSEc2QyxNQW5ISCIsImZpbGUiOiJfcG9wb3Zlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIjsoIGZ1bmN0aW9uKCAkICl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG4gICAgJC5mbi50aW1lb3V0Q2xhc3MgPSBmdW5jdGlvbihjbGFzc25hbWUsIHRpbWVvdXQpIHtcbiAgICAgICAgdGltZW91dCA9IHRpbWVvdXQgfHwgMTA7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgJCh0aGF0KS50b2dnbGVDbGFzcyhjbGFzc25hbWUpO1xuICAgICAgICB9LCB0aW1lb3V0KTtcbiAgICB9O1xuXG5cdCQuZm4uZXh0ZW5kKHtcblx0XHRwb3BvdmVyOiBmdW5jdGlvbihvcHRpb25zKVxuXHRcdHtcblx0XHRcdHRoaXMuZGVmYXVsdHMgPSB7fTtcblx0XHRcdHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKCB7fSwgdGhpcy5kZWZhdWx0cywgb3B0aW9ucyApLFxuXHRcdFx0XHRpc29wZW4gPSBmYWxzZSwgc2Nyb2xsU2hpZnQgPSAxMDAsIHBvcG92ZXIgPSB7fSxcblx0XHRcdFx0JHBhZ2UgPSAkKCcjcGFnZS13cmFwcGVyJyksXG5cdFx0XHRcdG9uT3BlblNjcm9sbFRvcCwgJHBvcG92ZXIsICR0YXJnZXQ7XG5cblx0XHRcdHBvcG92ZXIucG9zaXRpb24gPSBmdW5jdGlvbih0YXJnZXQpXG5cdFx0XHR7XG5cdFx0XHRcdHZhciBsZWZ0ID0gMCwgd3cgPSAkKHdpbmRvdykud2lkdGgoKSwgdG9wID0gMDtcblxuXHRcdFx0XHRpZiAoJCh0YXJnZXQpLmhhc0NsYXNzKCd0cmlnZ2VyLXBvcG92ZXInKSlcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCR0YXJnZXQgPSAkKHRhcmdldCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0JHRhcmdldCA9ICQodGFyZ2V0KS5jbG9zZXN0KCcudHJpZ2dlci1wb3BvdmVyJyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsZWZ0ID0gJHRhcmdldC5vZmZzZXQoKS5sZWZ0ICsgJHRhcmdldC53aWR0aCgpO1xuXHRcdFx0XHR0b3AgPSAkdGFyZ2V0Lm9mZnNldCgpLnRvcCArICR0YXJnZXQuaGVpZ2h0KCkgKyA4O1xuXHRcdFx0XHRcblx0XHRcdFx0cmV0dXJuIHsgJ2xlZnQnOiBsZWZ0LCAndG9wJzogdG9wIH07XG5cdFx0XHR9XG5cblx0XHRcdHBvcG92ZXIuaGlkZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKVxuXHRcdFx0e1xuXHRcdFx0XHRpZiAoJCgnLnBvcG92ZXIub3BlbicpLmxlbmd0aClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCRwb3BvdmVyID0gJCgnLnBvcG92ZXIub3BlbicpO1xuXHRcdFx0XHRcdCRwb3BvdmVyLnJlbW92ZUNsYXNzKCdhbmltYXRlJyk7XG5cdFx0XHRcdFxuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdCAgXHRcdFx0JHBvcG92ZXIucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcblx0XHRcdCAgXHRcdFx0XG5cdFx0XHQgIFx0XHRcdGlmICh0eXBlb2YoY2FsbGJhY2spID09ICdmdW5jdGlvbicpXG5cdFx0XHQgIFx0XHRcdHtcblx0XHRcdCAgXHRcdFx0XHRjYWxsYmFjay5hcHBseSgpO1xuXHRcdFx0ICBcdFx0XHR9XG5cdFx0XHQgIFx0XHR9LCAyNTApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmICh0eXBlb2YoY2FsbGJhY2spID09ICdmdW5jdGlvbicpXG5cdFx0ICBcdFx0XHR7XG5cdFx0ICBcdFx0XHRcdGNhbGxiYWNrLmFwcGx5KCk7XG5cdFx0ICBcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0JHBhZ2Uub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRpZiAoKGlzb3BlbiB8fCAkKCcucG9wb3Zlci5vcGVuJykubGVuZ3RoKSAmJiAhJChlLnRhcmdldCkuY2xvc2VzdCgnLnRyaWdnZXItcG9wb3ZlcicpLmxlbmd0aCAmJiAhJChlLnRhcmdldCkuY2xvc2VzdCgnLnBvcG92ZXInKS5sZW5ndGgpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRwb3BvdmVyLmhpZGUoKTtcblx0XHRcdFx0fVxuXHRcdCAgICB9KTtcblxuXHRcdFx0JCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpe1xuXHRcdFx0XHRwb3BvdmVyLmhpZGUoKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQkcGFnZS5zY3JvbGwoZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYgKGlzb3BlbiA9PT0gdHJ1ZSAmJiAoKChvbk9wZW5TY3JvbGxUb3AgKyBzY3JvbGxTaGlmdCkgPCAkcGFnZS5zY3JvbGxUb3AoKSkgfHwgKChvbk9wZW5TY3JvbGxUb3AgLSBzY3JvbGxTaGlmdCkgPiAkcGFnZS5zY3JvbGxUb3AoKSkpKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cG9wb3Zlci5oaWRlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQkKHRoaXMpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0XHR2YXIgYmxvY2sgPSAkKHRoaXMpLmRhdGEoJ3BvcG92ZXInKSwgJHBvcG92ZXI7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0aXNvcGVuID0gdHJ1ZTtcblxuXHRcdFx0XHRcdHBvcG92ZXIuaGlkZShmdW5jdGlvbigpe1xuXG5cdFx0XHRcdFx0XHRpZiAoJCgnI3BvcG92ZXItJyArIGJsb2NrKS5sZW5ndGggPT0gMClcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0JHBvcG92ZXIgPSAkKHRlbXBsYXRlKCd0cGxfJyArIGJsb2NrLCB7fSkpO1xuXHRcdFx0XHRcdFx0XHQkcGFnZS5hcHBlbmQoJHBvcG92ZXIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHQkcG9wb3ZlciA9ICQoJyNwb3BvdmVyLScgKyBibG9jayk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICghJCgnI3BvcG92ZXItJyArIGJsb2NrKS5oYXNDbGFzcygnb3BlbicpKVxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRvbk9wZW5TY3JvbGxUb3AgPSAkcGFnZS5zY3JvbGxUb3AoKTtcblx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdCRwb3BvdmVyLmNzcyhwb3BvdmVyLnBvc2l0aW9uKGUudGFyZ2V0KSk7XG5cdFx0XHRcdFx0XHRcdCRwb3BvdmVyLnRvZ2dsZUNsYXNzKCdvcGVuJykudGltZW91dENsYXNzKCdhbmltYXRlJyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdH0pO1xuXHRcdH1cblx0fSk7XG59KSggalF1ZXJ5ICk7Il19

"use strict";

var category, controls;

function doOnLoad(path) {
  category = new dhtmlXTreeObject("treeboxbox_tree", "100%", "100%", 0);
  category.setImagePath('/' + ADMIN_DIR + '/images/tree/');
  category.enableDragAndDrop(true);
  category.setEditStartAction(true / false);
  category.enableKeyboardNavigation(true);
  category.enableMultiselection(true);
  category.enableTreeLines(true);
  category.makeAllDraggable();

  /*
  category.enableCheckBoxes(true);
  */

  category.attachEvent("onDrop", function (sId, tId, id, sObject, tObject) {
    $.ajax({
      url: '/' + ADMIN_DIR + '/' + path + '/updateStructure',
      type: "post",
      data: {
        oid: sId,
        pid: tId
      }
    });
  });

  category.attachEvent("onDblClick", function (id) {});
}

function controlLink(path, page, type, id, attribute) {
  switch (type) {
    case 'add':
      return '<a href="/' + ADMIN_DIR + '/' + path + '/' + page + '/add/' + id + '" class="control-icon icon icon-file-plus" title="Добавить подраздел" data-no-instant></a>';
      break;

    case 'edit':
      return '<a href="/' + ADMIN_DIR + '/' + path + '/' + page + '/edit/' + id + '" class="control-icon icon icon-edit" title="Редактировать раздел" data-no-instant></a>';
      break;

    case 'visible':
      return '<a href="/' + ADMIN_DIR + '/' + path + '/' + page + '/visible/' + id + '" class="control-icon icon icon-eye' + (attribute == 0 ? '-off' : '') + '" onclick="ajax_vis_toggle(this, 15, 0); return false;" title="Отображение страницы" data-no-instant></a>';
      break;

    case 'delete':
      return '<a href="/' + ADMIN_DIR + '/' + path + '/' + page + '/del/' + id + '" class="control-icon icon icon-delete" title="Удалить раздел" onclick="return cp.dialog(\'Вы действительно хотите удалить раздел?\');" data-no-instant></a>';
      break;
  }
}

function buildTree(path, page) {
  $.ajax({
    url: '/' + ADMIN_DIR + '/' + path + '/getStructure',
    type: "get",
    dataType: "JSON",
    success: function success(response) {
      category.deleteChildItems(0);

      if (response.length) {
        for (var x in response) {
          controls = '';

          controls += '<span class="control-icons">';
          controls += controlLink(path, page, 'add', response[x].id);
          controls += controlLink(path, page, 'edit', response[x].id);
          controls += controlLink(path, page, 'visible', response[x].id, response[x].visible);
          controls += controlLink(path, page, 'delete', response[x].id);
          controls += '</span>';

          close = 0;
          open = 0;
          leaf = 0;

          if (response[x].pid == 0) {
            leaf = 'icon/home.svg';
            open = 'icon/home.svg';
            close = 'icon/home.svg';
          } else if (response[x].dynamic == 1) {
            leaf = 'icon/application-code.svg';
          } else {
            leaf = 'icon/file.svg';
          }

          category.insertNewChild(response[x].pid, response[x].id, response[x].name + ' ' + controls, 0, leaf, open, close);
        }
      }

      category.openOnItemAdding(true);
    }
  });
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zdHJ1Y3R1cmUuanMiXSwibmFtZXMiOlsiY2F0ZWdvcnkiLCJjb250cm9scyIsImRvT25Mb2FkIiwicGF0aCIsImRodG1sWFRyZWVPYmplY3QiLCJzZXRJbWFnZVBhdGgiLCJBRE1JTl9ESVIiLCJlbmFibGVEcmFnQW5kRHJvcCIsInNldEVkaXRTdGFydEFjdGlvbiIsImVuYWJsZUtleWJvYXJkTmF2aWdhdGlvbiIsImVuYWJsZU11bHRpc2VsZWN0aW9uIiwiZW5hYmxlVHJlZUxpbmVzIiwibWFrZUFsbERyYWdnYWJsZSIsImF0dGFjaEV2ZW50Iiwic0lkIiwidElkIiwiaWQiLCJzT2JqZWN0IiwidE9iamVjdCIsIiQiLCJhamF4IiwidXJsIiwidHlwZSIsImRhdGEiLCJvaWQiLCJwaWQiLCJjb250cm9sTGluayIsInBhZ2UiLCJhdHRyaWJ1dGUiLCJidWlsZFRyZWUiLCJkYXRhVHlwZSIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsImRlbGV0ZUNoaWxkSXRlbXMiLCJsZW5ndGgiLCJ4IiwidmlzaWJsZSIsImNsb3NlIiwib3BlbiIsImxlYWYiLCJkeW5hbWljIiwiaW5zZXJ0TmV3Q2hpbGQiLCJuYW1lIiwib3Blbk9uSXRlbUFkZGluZyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxRQUFKLEVBQWNDLFFBQWQ7O0FBRUEsU0FBU0MsUUFBVCxDQUFrQkMsSUFBbEIsRUFDQTtBQUNDSCxhQUFXLElBQUlJLGdCQUFKLENBQXFCLGlCQUFyQixFQUF3QyxNQUF4QyxFQUFnRCxNQUFoRCxFQUF3RCxDQUF4RCxDQUFYO0FBQ0FKLFdBQVNLLFlBQVQsQ0FBc0IsTUFBTUMsU0FBTixHQUFrQixlQUF4QztBQUNBTixXQUFTTyxpQkFBVCxDQUEyQixJQUEzQjtBQUNBUCxXQUFTUSxrQkFBVCxDQUE0QixPQUFLLEtBQWpDO0FBQ0FSLFdBQVNTLHdCQUFULENBQWtDLElBQWxDO0FBQ0FULFdBQVNVLG9CQUFULENBQThCLElBQTlCO0FBQ0FWLFdBQVNXLGVBQVQsQ0FBeUIs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QkFBUSxDQUFSO0FBQ0FDLGlCQUFPLENBQVA7QUFDQUMsaUJBQU8sQ0FBUDs7QUFFQSxjQUFJUCxTQUFTRyxDQUFULEVBQVlWLEdBQVosSUFBbUIsQ0FBdkIsRUFDQTtBQUNDYyxtQkFBTyxlQUFQO0FBQ0FELG1CQUFPLGVBQVA7QUFDQUQsb0JBQVEsZUFBUjtBQUNBLFdBTEQsTUFNSyxJQUFJTCxTQUFTRyxDQUFULEVBQVlLLE9BQVosSUFBdUIsQ0FBM0IsRUFDTDtBQUNSRCxtQkFBTywyQkFBUDtBQUNTLFdBSEksTUFJQTtBQUNKQSxtQkFBTyxlQUFQO0FBQ0E7O0FBRUR2QyxtQkFBU3lDLGNBQVQsQ0FBd0JULFNBQVNHLENBQVQsRUFBWVYsR0FBcEMsRUFBeUNPLFNBQVNHLENBQVQsRUFBWW5CLEVBQXJELEVBQXlEZ0IsU0FBU0csQ0FBVCxFQUFZTyxJQUFaLEdBQW1CLEdBQW5CLEdBQXlCekMsUUFBbEYsRUFBNEYsQ0FBNUYsRUFBK0ZzQyxJQUEvRixFQUFxR0QsSUFBckcsRUFBMkdELEtBQTNHO0FBQ0E7QUFDSjs7QUFFRHJDLGVBQVMyQyxnQkFBVCxDQUEwQixJQUExQjtBQUNBO0FBNUNELEdBQVA7QUE4Q0EiLCJmaWxlIjoiX3N0cnVjdHVyZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjYXRlZ29yeSwgY29udHJvbHM7XG5cbmZ1bmN0aW9uIGRvT25Mb2FkKHBhdGgpXG57XG5cdGNhdGVnb3J5ID0gbmV3IGRodG1sWFRyZWVPYmplY3QoXCJ0cmVlYm94Ym94X3RyZWVcIiwgXCIxMDAlXCIsIFwiMTAwJVwiLCAwKTtcblx0Y2F0ZWdvcnkuc2V0SW1hZ2VQYXRoKCcvJyArIEFETUlOX0RJUiArICcvaW1hZ2VzL3RyZWUvJyk7XG5cdGNhdGVnb3J5LmVuYWJsZURyYWdBbmREcm9wKHRydWUpO1xuXHRjYXRlZ29yeS5zZXRFZGl0U3RhcnRBY3Rpb24odHJ1ZS9mYWxzZSk7XG5cdGNhdGVnb3J5LmVuYWJsZUtleWJvYXJkTmF2aWdhdGlvbih0cnVlKTtcblx0Y2F0ZWdvcnkuZW5hYmxlTXVsdGlzZWxlY3Rpb24odHJ1ZSk7XG5cdGNhdGVnb3J5LmVuYWJsZVRyZWVMaW5lcyh0cnVlKTtcblx0Y2F0ZWdvcnkubWFrZUFsbERyYWdnYWJsZSgpO1xuXHRcblx0Lypcblx0Y2F0ZWdvcnkuZW5hYmxlQ2hlY2tCb3hlcyh0cnVlKTtcblx0Ki9cblx0XG5cdGNhdGVnb3J5LmF0dGFjaEV2ZW50KFwib25Ecm9wXCIsIGZ1bmN0aW9uKHNJZCwgdElkLCBpZCwgc09iamVjdCwgdE9iamVjdCl7XG5cdFx0JC5hamF4KHtcbiAgICAgICAgICAgIHVybDogJy8nICsgQURNSU5fRElSICsgJy8nICsgcGF0aCArICcvdXBkYXRlU3RydWN0dXJlJyxcbiAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgXHRvaWQ6IHNJZCxcbiAgICAgICAgICAgIFx0cGlkOiB0SWRcbiAgICAgICAgICAgIH1cbiAgICAgICBcdH0pO1xuXHR9KTtcblxuXHRjYXRlZ29yeS5hdHRhY2hFdmVudChcIm9uRGJsQ2xpY2tcIiwgZnVuY3Rpb24oaWQpe1xuXHQgICAgXG5cdH0pO1xufVxuXG5mdW5jdGlvbiBjb250cm9sTGluayhwYXRoLCBwYWdlLCB0eXBlLCBpZCwgYXR0cmlidXRlKVxue1xuXHRzd2l0Y2godHlwZSlcblx0e1xuXHRcdGNhc2UgJ2FkZCc6XG5cdFx0XHRyZXR1cm4gJzxhIGhyZWY9XCIvJyArIEFETUlOX0RJUiArICcvJyArIHBhdGggKyAnLycgKyBwYWdlICsgJy9hZGQvJyArIGlkICsgJ1wiIGNsYXNzPVwiY29udHJvbC1pY29uIGljb24gaWNvbi1maWxlLXBsdXNcIiB0aXRsZT1cItCU0L7QsdCw0LLQuNGC0Ywg0L/QvtC00YDQsNC30LTQtdC7XCIgZGF0YS1uby1pbnN0YW50PjwvYT4nO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSAnZWRpdCc6XG5cdFx0XHRyZXR1cm4gJzxhIGhyZWY9XCIvJyArIEFETUlOX0RJUiArICcvJyArIHBhdGggKyAnLycgKyBwYWdlICsgJy9lZGl0LycgKyBpZCArICdcIiBjbGFzcz1cImNvbnRyb2wtaWNvbiBpY29uIGljb24tZWRpdFwiIHRpdGxlPVwi0KDQtdC00LDQutGC0LjRgNC+0LLQsNGC0Ywg0YDQsNC30LTQtdC7XCIgZGF0YS1uby1pbnN0YW50PjwvYT4nO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSAndmlzaWJsZSc6XG5cdFx0XHRyZXR1cm4gJzxhIGhyZWY9XCIvJyArIEFETUlOX0RJUiArICcvJyArIHBhdGggKyAnLycgKyBwYWdlICsgJy92aXNpYmxlLycgKyBpZCArICdcIiBjbGFzcz1cImNvbnRyb2wtaWNvbiBpY29uIGljb24tZXllJyArIChhdHRyaWJ1dGUgPT0gMCA/ICctb2ZmJyA6ICcnKSArICdcIiBvbmNsaWNrPVwiYWpheF92aXNfdG9nZ2xlKHRoaXMsIDE1LCAwKTsgcmV0dXJuIGZhbHNlO1wiIHRpdGxlPVwi0J7RgtC+0LHRgNCw0LbQtdC90LjQtSDRgdGC0YDQsNC90LjRhtGLXCIgZGF0YS1uby1pbnN0YW50PjwvYT4nO1xuXHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSAnZGVsZXRlJzpcblx0XHRcdHJldHVybiAnPGEgaHJlZj1cIi8nICsgQURNSU5fRElSICsgJy8nICsgcGF0aCArICcvJyArIHBhZ2UgKyAnL2RlbC8nICsgaWQgKyAnXCIgY2xhc3M9XCJjb250cm9sLWljb24gaWNvbiBpY29uLWRlbGV0ZVwiIHRpdGxlPVwi0KPQtNCw0LvQuNGC0Ywg0YDQsNC30LTQtdC7XCIgb25jbGljaz1cInJldHVybiBjcC5kaWFsb2coXFwn0JLRiyDQtNC10LnRgdGC0LLQuNGC0LXQu9GM0L3QviDRhdC+0YLQuNGC0LUg0YPQtNCw0LvQuNGC0Ywg0YDQsNC30LTQtdC7P1xcJyk7XCIgZGF0YS1uby1pbnN0YW50PjwvYT4nO1xuXHRcdGJyZWFrO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGJ1aWxkVHJlZShwYXRoLCBwYWdlKVxue1xuXHQkLmFqYXgoe1xuICAgICAgICB1cmw6ICcvJyArIEFETUlOX0RJUiArICcvJyArIHBhdGggKyAnL2dldFN0cnVjdHVyZScsXG4gICAgICAgIHR5cGU6IFwiZ2V0XCIsXG4gICAgICAgIGRhdGFUeXBlOiBcIkpTT05cIixcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpXG4gICAgICAgIHtcbiAgICAgICAgXHRjYXRlZ29yeS5kZWxldGVDaGlsZEl0ZW1zKDApO1xuXHRcdFx0XG4gICAgICAgIFx0aWYgKHJlc3BvbnNlLmxlbmd0aClcbiAgICAgICAgXHR7XG4gICAgICAgICAgICBcdGZvcih2YXIgeCBpbiByZXNwb25zZSlcbiAgICAgICAgICAgIFx0e1xuICAgICAgICAgICAgXHRcdGNvbnRyb2xzID0gJyc7XG5cbiAgICAgICAgICAgIFx0XHRjb250cm9scyArPSAnPHNwYW4gY2xhc3M9XCJjb250cm9sLWljb25zXCI+JztcbiAgICAgICAgICAgIFx0XHRjb250cm9scyArPSBjb250cm9sTGluayhwYXRoLCBwYWdlLCAnYWRkJywgcmVzcG9uc2VbeF0uaWQpO1xuICAgICAgICAgICAgXHRcdGNvbnRyb2xzICs9IGNvbnRyb2xMaW5rKHBhdGgsIHBhZ2UsICdlZGl0JywgcmVzcG9uc2VbeF0uaWQpO1xuICAgICAgICAgICAgXHRcdGNvbnRyb2xzICs9IGNvbnRyb2xMaW5rKHBhdGgsIHBhZ2UsICd2aXNpYmxlJywgcmVzcG9uc2VbeF0uaWQsIHJlc3BvbnNlW3hdLnZpc2libGUpO1xuICAgICAgICAgICAgXHRcdGNvbnRyb2xzICs9IGNvbnRyb2xMaW5rKHBhdGgsIHBhZ2UsICdkZWxldGUnLCByZXNwb25zZVt4XS5pZCk7XG4gICAgICAgICAgICBcdFx0Y29udHJvbHMgKz0gJzwvc3Bhbj4nO1xuXG4gICAgICAgICAgICBcdFx0Y2xvc2UgPSAwO1xuICAgICAgICAgICAgXHRcdG9wZW4gPSAwO1xuICAgICAgICAgICAgXHRcdGxlYWYgPSAwO1xuXG4gICAgICAgICAgICBcdFx0aWYgKHJlc3BvbnNlW3hdLnBpZCA9PSAwKVxuICAgICAgICAgICAgXHRcdHtcbiAgICAgICAgICAgIFx0XHRcdGxlYWYgPSAnaWNvbi9ob21lLnN2Zyc7XG4gICAgICAgICAgICBcdFx0XHRvcGVuID0gJ2ljb24vaG9tZS5zdmcnO1xuICAgICAgICAgICAgXHRcdFx0Y2xvc2UgPSAnaWNvbi9ob21lLnN2Zyc7XG4gICAgICAgICAgICBcdFx0fVxuICAgICAgICAgICAgXHRcdGVsc2UgaWYgKHJlc3BvbnNlW3hdLmR5bmFtaWMgPT0gMSlcbiAgICAgICAgICAgIFx0XHR7XG5cdFx0XHRcdFx0XHRsZWFmID0gJ2ljb24vYXBwbGljYXRpb24tY29kZS5zdmcnO1xuICAgICAgICAgICAgXHRcdH1cbiAgICAgICAgICAgIFx0XHRlbHNlIHtcbiAgICAgICAgICAgIFx0XHRcdGxlYWYgPSAnaWNvbi9maWxlLnN2Zyc7XG4gICAgICAgICAgICBcdFx0fVxuXG4gICAgICAgICAgICBcdFx0Y2F0ZWdvcnkuaW5zZXJ0TmV3Q2hpbGQocmVzcG9uc2VbeF0ucGlkLCByZXNwb25zZVt4XS5pZCwgcmVzcG9uc2VbeF0ubmFtZSArICcgJyArIGNvbnRyb2xzLCAwLCBsZWFmLCBvcGVuLCBjbG9zZSk7XG4gICAgICAgICAgICBcdH1cbiAgICAgICAgXHR9XG5cdFx0XHRcbiAgICAgICAgXHRjYXRlZ29yeS5vcGVuT25JdGVtQWRkaW5nKHRydWUpO1xuICAgICAgICB9XG4gICBcdH0pO1xufSJdfQ==

'use strict';

;(function (d) {
    function template(id, data) {
        if (d.getElementById(id) !== null) {
            return Template7.compile(d.getElementById(id).innerHTML)(data || {});
        }
        return '';
    }
    window.template = template;
})(document);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl90ZW1wbGF0ZS5qcyJdLCJuYW1lcyI6WyJ0ZW1wbGF0ZSIsImlkIiwiZGF0YSIsImQiLCJnZXRFbGVtZW50QnlJZCIsIlRlbXBsYXRlNyIsImNvbXBpbGUiLCJpbm5lckhUTUwiLCJ3aW5kb3ciLCJkb2N1bWVudCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxDQUFDLENBQUUsYUFBSztBQUNKLGFBQVNBLFFBQVQsQ0FBa0JDLEVBQWxCLEVBQXNCQyxJQUF0QixFQUE0QjtBQUN4QixZQUFJQyxFQUFFQyxjQUFGLENBQWlCSCxFQUFqQixNQUF5QixJQUE3QixFQUFtQztBQUMvQixtQkFBT0ksVUFBVUMsT0FBVixDQUFrQkgsRUFBRUMsY0FBRixDQUFpQkgsRUFBakIsRUFBcUJNLFNBQXZDLEVBQWtETCxRQUFRLEVBQTFELENBQVA7QUFDSDtBQUNELGVBQU8sRUFBUDtBQUNIO0FBQ0RNLFdBQU9SLFFBQVAsR0FBa0JBLFFBQWxCO0FBQ0gsQ0FSQSxFQVFHUyxRQVJIIiwiZmlsZSI6Il90ZW1wbGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIjsoKGQgPT4ge1xuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKGlkLCBkYXRhKSB7XG4gICAgICAgIGlmIChkLmdldEVsZW1lbnRCeUlkKGlkKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuIFRlbXBsYXRlNy5jb21waWxlKGQuZ2V0RWxlbWVudEJ5SWQoaWQpLmlubmVySFRNTCkoZGF0YSB8fCB7fSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICB3aW5kb3cudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcbn0pKShkb2N1bWVudCk7XG4iXX0=

'use strict';

$(document).ready(function () {

    $.upload = {
        open: function open(selector, isClearErr, isResetForm, isOverlay) {
            clearInterval(uploadOpenTimeout);
            uploadOpenTimeout = setTimeout(function () {
                upload._open(selector, isClearErr, isResetForm, isOverlay);
            }, 200);
        },
        clearErrors: function clearErrors($upload) {
            $upload.find('.error').removeClass('error');
            $upload.find('.upload__errorList').addClass('hide').empty();
            $upload.find('.hide-on-open').hide();
            $upload.find('.tooltip').remove();
        }
    };

    $.upload.init = function () {
        var formAction = '/' + ADMIN_DIR + '/meta/fileUpload';
        var filesLimit = 0;

        $('.js-fileupload').each(function (index, item) {
            return function (element) {
                var $attachments = $(element);
                var id = $attachments.find('.js-fileupload-control').attr('id');

                var groupid = $attachments.find('.js-fileupload-group').val();
                var settings = $attachments.find('.js-fileupload-settings').val();
                var input_name = $attachments.find('.js-fileupload-group').attr('name');

                if ($attachments.data('action')) {
                    formAction = $attachments.data('action');
                }

                var uploader = new qq.FineUploader({
                    debug: false,

                    multiple: true,

                    element: document.getElementById(id),

                    template: 'upload-template',

                    request: {
                        accessKey: "file_key",
                        endpoint: formAction,
                        inputName: 'file',
                        includeExif: false,
                        defaultQuality: 100,
                        params: {
                            groupid: groupid,
                            settings: settings
                        }
                    },

                    deleteFile: {
                        enabled: true,
                        forceConfirm: false,
                        endpoint: '/' + ADMIN_DIR + '/meta/filedelete'
                    },

                    thumbnails: {
                        placeholders: {
                            waitingPath: '/' + ADMIN_DIR + '/images/fine-uploader/waiting-generic.png',
                            notAvailablePath: '/' + ADMIN_DIR + '/images/fine-uploader/not_available-generic.png'
                        }
                    },

                    validation: {
                        // allowedExtensions: ['jpeg', 'jpg', 'png', 'gif', 'txt'],
                        itemLimit: filesLimit,
                        sizeLimit: 2048000
                    },

                    callbacks: {
                        onComplete: function onComplete(id, name, response) {
                            this.setUuid(id, response.id);
                        }
                    }
                });

                console.log(initialFiles[groupid] || []);

                uploader.addInitialFiles(initialFiles[groupid] || []);

                $attachments.on('click', '.qq-upload-file-selector', function (e) {
                    e.preventDefault();
                    var title = $(this).text();
                    var index = $(this).closest('.attachments-list__item').index();
                    var id = uploader.getUuid(index);

                    var update = Module.changeFileName(id, title);

                    if (update) {
                        uploader.setName(index, update);
                    }
                });
            }(item);
        });
    };
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl91cGxvYWQuanMiXSwibmFtZXMiOlsiJCIsImRvY3VtZW50IiwicmVhZHkiLCJ1cGxvYWQiLCJvcGVuIiwic2VsZWN0b3IiLCJpc0NsZWFyRXJyIiwiaXNSZXNldEZvcm0iLCJpc092ZXJsYXkiLCJjbGVhckludGVydmFsIiwidXBsb2FkT3BlblRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiX29wZW4iLCJjbGVhckVycm9ycyIsIiR1cGxvYWQiLCJmaW5kIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsImVtcHR5IiwiaGlkZSIsInJlbW92ZSIsImluaXQiLCJmb3JtQWN0aW9uIiwiQURNSU5fRElSIiwiZmlsZXNMaW1pdCIsImVhY2giLCJpbmRleCIsIml0ZW0iLCJlbGVtZW50IiwiJGF0dGFjaG1lbnRzIiwiaWQiLCJhdHRyIiwiZ3JvdXBpZCIsInZhbCIsInNldHRpbmdzIiwiaW5wdXRfbmFtZSIsImRhdGEiLCJ1cGxvYWRlciIsInFxIiwiRmluZVVwbG9hZGVyIiwiZGVidWciLCJtdWx0aXBsZSIsImdldEVsZW1lbnRCeUlkIiwidGVtcGxhdGUiLCJyZXF1ZXN0IiwiYWNjZXNzS2V5IiwiZW5kcG9pbnQiLCJpbnB1dE5hbWUiLCJpbmNsdWRlRXhpZiIsImRlZmF1bHRRdWFsaXR5IiwicGFyYW1zIiwiZGVsZXRlRmlsZSIsImVuYWJsZWQiLCJmb3JjZUNvbmZpcm0iLCJ0aHVtYm5haWxzIiwicGxhY2Vob2xkZXJzIiwid2FpdGluZ1BhdGgiLCJub3RBdmFpbGFibGVQYXRoIiwidmFsaWRhdGlvbiIsIml0ZW1MaW1pdCIsInNpemVMaW1pdCIsImNhbGxiYWNrcyIsIm9uQ29tcGxldGUiLCJuYW1lIiwicmVzcG9uc2UiLCJzZXRVdWlkIiwiY29uc29sZSIsImxvZyIsImluaXRpYWxGaWxlcyIsImFkZEluaXRpYWxGaWxlcyIsIm9uIiwiZSIsInByZXZlbnREZWZhdWx0IiwidGl0bGUiLCJ0ZXh0IiwiY2xvc2VzdCIsImdldFV1aWQiLCJ1cGRhdGUiLCJNb2R1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aUNBQUtDLE9BQUwsQ0FBYW5DLEVBQWIsRUFBaUJrQyxTQUFTbEMsRUFBMUI7QUFDSDtBQUhNO0FBeENzQixpQkFBcEIsQ0FBakI7O0FBK0NBb0Msd0JBQVFDLEdBQVIsQ0FBWUMsYUFBYXBDLE9BQWIsS0FBeUIsRUFBckM7O0FBRUFLLHlCQUFTZ0MsZUFBVCxDQUF5QkQsYUFBYXBDLE9BQWIsS0FBeUIsRUFBbEQ7O0FBRUFILDZCQUFheUMsRUFBYixDQUFnQixPQUFoQixFQUF5QiwwQkFBekIsRUFBcUQsVUFBU0MsQ0FBVCxFQUFZO0FBQzdEQSxzQkFBRUMsY0FBRjtBQUNBLHdCQUFNQyxRQUFRekUsRUFBRSxJQUFGLEVBQVEwRSxJQUFSLEVBQWQ7QUFDQSx3QkFBTWhELFFBQVExQixFQUFFLElBQUYsRUFBUTJFLE9BQVIsQ0FBZ0IseUJBQWhCLEVBQTJDakQsS0FBM0MsRUFBZDtBQUNBLHdCQUFNSSxLQUFLTyxTQUFTdUMsT0FBVCxDQUFpQmxELEtBQWpCLENBQVg7O0FBRUEsd0JBQU1tRCxTQUFTQyxPQUFPQyxjQUFQLENBQXNCakQsRUFBdEIsRUFBMEIyQyxLQUExQixDQUFmOztBQUVBLHdCQUFJSSxNQUFKLEVBQVk7QUFDUnhDLGlDQUFTMkMsT0FBVCxDQUFpQnRELEtBQWpCLEVBQXdCbUQsTUFBeEI7QUFDSDtBQUNKLGlCQVhEO0FBYUgsYUE3RU0sQ0E2RUpsRCxJQTdFSSxDQUFQO0FBOEVILFNBL0VEO0FBZ0ZILEtBcEZEO0FBcUZILENBdkdEIiwiZmlsZSI6Il91cGxvYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXG4gICAkLnVwbG9hZCA9IHtcbiAgICAgICAgb3BlbjogZnVuY3Rpb24oc2VsZWN0b3IsIGlzQ2xlYXJFcnIsIGlzUmVzZXRGb3JtLCBpc092ZXJsYXkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodXBsb2FkT3BlblRpbWVvdXQpO1xuICAgICAgICAgICAgdXBsb2FkT3BlblRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHVwbG9hZC5fb3BlbihzZWxlY3RvciwgaXNDbGVhckVyciwgaXNSZXNldEZvcm0sIGlzT3ZlcmxheSk7XG4gICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICB9LFxuICAgICAgICBjbGVhckVycm9yczogZnVuY3Rpb24oJHVwbG9hZCkge1xuICAgICAgICAgICAgJHVwbG9hZC5maW5kKCcuZXJyb3InKS5yZW1vdmVDbGFzcygnZXJyb3InKTtcbiAgICAgICAgICAgICR1cGxvYWQuZmluZCgnLnVwbG9hZF9fZXJyb3JMaXN0JykuYWRkQ2xhc3MoJ2hpZGUnKS5lbXB0eSgpO1xuICAgICAgICAgICAgJHVwbG9hZC5maW5kKCcuaGlkZS1vbi1vcGVuJykuaGlkZSgpO1xuICAgICAgICAgICAgJHVwbG9hZC5maW5kKCcudG9vbHRpcCcpLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgICQudXBsb2FkLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IGZvcm1BY3Rpb24gPSBgLyR7QURNSU5fRElSfS9tZXRhL2ZpbGVVcGxvYWRgO1xuICAgICAgICBsZXQgZmlsZXNMaW1pdCA9IDA7XG5cbiAgICAgICAgJCgnLmpzLWZpbGV1cGxvYWQnKS5lYWNoKChpbmRleCwgaXRlbSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuICgoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0ICRhdHRhY2htZW50cyA9ICQoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSAkYXR0YWNobWVudHMuZmluZCgnLmpzLWZpbGV1cGxvYWQtY29udHJvbCcpLmF0dHIoJ2lkJyk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBncm91cGlkID0gJGF0dGFjaG1lbnRzLmZpbmQoJy5qcy1maWxldXBsb2FkLWdyb3VwJykudmFsKCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2V0dGluZ3MgPSAkYXR0YWNobWVudHMuZmluZCgnLmpzLWZpbGV1cGxvYWQtc2V0dGluZ3MnKS52YWwoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBpbnB1dF9uYW1lID0gJGF0dGFjaG1lbnRzLmZpbmQoJy5qcy1maWxldXBsb2FkLWdyb3VwJykuYXR0cignbmFtZScpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCRhdHRhY2htZW50cy5kYXRhKCdhY3Rpb24nKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1BY3Rpb24gPSAkYXR0YWNobWVudHMuZGF0YSgnYWN0aW9uJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgdXBsb2FkZXIgPSBuZXcgcXEuRmluZVVwbG9hZGVyKHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWc6IGZhbHNlLFxuXG4gICAgICAgICAgICAgICAgICAgIG11bHRpcGxlOiB0cnVlLFxuXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSxcblxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ3VwbG9hZC10ZW1wbGF0ZScsXG5cbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXNzS2V5OiBcImZpbGVfa2V5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRwb2ludDogZm9ybUFjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0TmFtZTogJ2ZpbGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZUV4aWY6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFF1YWxpdHk6IDEwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwaWQ6IGdyb3VwaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHNldHRpbmdzXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlRmlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcmNlQ29uZmlybTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRwb2ludDogYC8ke0FETUlOX0RJUn0vbWV0YS9maWxlZGVsZXRlYFxuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIHRodW1ibmFpbHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdhaXRpbmdQYXRoOiBgLyR7QURNSU5fRElSfS9pbWFnZXMvZmluZS11cGxvYWRlci93YWl0aW5nLWdlbmVyaWMucG5nYCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3RBdmFpbGFibGVQYXRoOiBgLyR7QURNSU5fRElSfS9pbWFnZXMvZmluZS11cGxvYWRlci9ub3RfYXZhaWxhYmxlLWdlbmVyaWMucG5nYFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb246IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsbG93ZWRFeHRlbnNpb25zOiBbJ2pwZWcnLCAnanBnJywgJ3BuZycsICdnaWYnLCAndHh0J10sXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtTGltaXQ6IGZpbGVzTGltaXQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaXplTGltaXQ6IDIwNDgwMDBcbiAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja3M6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKGlkLCBuYW1lLCByZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0VXVpZChpZCwgcmVzcG9uc2UuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpbml0aWFsRmlsZXNbZ3JvdXBpZF0gfHwgW10pO1xuXG4gICAgICAgICAgICAgICAgdXBsb2FkZXIuYWRkSW5pdGlhbEZpbGVzKGluaXRpYWxGaWxlc1tncm91cGlkXSB8fCBbXSk7XG5cbiAgICAgICAgICAgICAgICAkYXR0YWNobWVudHMub24oJ2NsaWNrJywgJy5xcS11cGxvYWQtZmlsZS1zZWxlY3RvcicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0aXRsZSA9ICQodGhpcykudGV4dCgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9ICQodGhpcykuY2xvc2VzdCgnLmF0dGFjaG1lbnRzLWxpc3RfX2l0ZW0nKS5pbmRleCgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IHVwbG9hZGVyLmdldFV1aWQoaW5kZXgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVwZGF0ZSA9IE1vZHVsZS5jaGFuZ2VGaWxlTmFtZShpZCwgdGl0bGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh1cGRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwbG9hZGVyLnNldE5hbWUoaW5kZXgsIHVwZGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSkoaXRlbSk7XG4gICAgICAgIH0pO1xuICAgIH07XG59KTsiXX0=

'use strict';

var d = document;

function keyControls() {
    if ($('.j-clipboard').length) {
        var clipboard = new ClipboardJS('.j-clipboard', {
            text: function text(trigger) {
                $(trigger).addClass('copied');

                setTimeout(function () {
                    $(trigger).removeClass("copied");
                }, 700);

                return trigger.getAttribute('data-clipboard');
            }
        });
    }

    $("body").on('click', '.remove-trigger', function (e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var _self_ = this,
            href = $(_self_).attr('href');

        $.post(href, function () {
            cp.notify('Удалено', 'info');

            if (typeof $(_self_).attr('rel') !== 'undefined' && $($(_self_).attr('rel')).length > 0) {
                $($(_self_).attr('rel')).remove();
            } else {
                $(_self_).closest('tr').remove();
            }
        });

        return !1;
    });

    $('body').on('click', '.js-remove-item', function (e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var _self_ = this,
            href = $(_self_).attr('href');

        $.post(href, function () {
            cp.notify('Удалено', 'info');

            if (typeof $(_self_).attr('rel') !== 'undefined' && $($(_self_).attr('rel')).length > 0) {
                $($(_self_).attr('rel')).remove();
            } else {
                $(_self_).closest('tr').remove();
            }
        });

        return !1;
    });

    $('body').on('click', '.js-add-template', function (e) {
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

    $('body').on('keydown', '.reducing-trigger', function (e) {
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

            if (typeof format !== 'undefined') {
                result = '?i%'.replace('?i', result);
            }

            $(this).val(result);
        }
    });

    $('body').on('keypress', '.latin', function (e) {
        var regex = /[^A-Za-z]/g;
        if (regex.test(String.fromCharCode(e.keyCode))) {
            return !1;
        }
    });

    $("body").on('keypress', '.integer', function (e) {
        if ([0, 8, 13, 38, 40].indexOf(e.which) < 0 && (e.which < 48 || e.which > 57)) {
            return !1;
        }
    });

    $("body").on('keypress', '.float', function (e) {
        if ([0, 8, 13, 38, 40, 44, 46].indexOf(e.which) < 0 && (e.which < 48 || e.which > 57)) {
            return !1;
        }
    });
}

function fileManager() {}

function fullCalendar() {
    var removeEvent = function removeEvent(id, callback) {
        $.ajax({
            url: '/' + ADMIN_DIR + '/meta/sheduler/delete',
            type: 'post',
            data: {
                'id': id
            },
            success: callback,
            dataType: "json"
        });
    };

    var changeEvent = function changeEvent(event, callback) {
        $.ajax({
            url: '/' + ADMIN_DIR + '/meta/sheduler/edit',
            type: 'post',
            data: {
                'id': event.id,
                'start': event.start.format(),
                'end': event.end.format()
            },
            success: callback,
            dataType: "json"
        });
    };

    var createEvent = function createEvent(input, callback) {
        $.ajax({
            url: input.action,
            type: input.method,
            data: input.data,
            success: callback,
            dataType: "json"
        });
    };

    var prepareEvent = function prepareEvent($calendar, data, isCreate) {
        var keys = Object.keys(data);

        var count = keys.length - 1;

        var event = {};

        var excellent = ['id', 'group', 'title', 'item', 'color', 'types', 'start', 'end', 'extra', 'visible'];

        keys.forEach(function (name, index) {
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
    };

    var closePopup = function closePopup($popup) {
        $popup.removeClass('is-animated');

        setTimeout(function () {
            $popup.removeClass('is-visible').remove();
        }, 350);
    };

    var prepareEditEvent = function prepareEditEvent($calendar, data) {
        var keys = Object.keys(data);

        var count = keys.length - 1;

        var event = {};

        var excellent = ['id', 'group', 'title', 'item', 'color', 'types', 'extra', 'visible'];

        keys.forEach(function (name, index) {
            if (excellent.indexOf(name) >= 0) {
                event[name] = data[name];
            }

            if (name === 'types' && data[name] !== '') {
                event[name] = data[name].split(',');
            }

            if (index === count) {
                event.action = '/' + ADMIN_DIR + '/meta/sheduler/edit';
                openPopup($calendar, event, false);
            }
        });
    };

    var openPopup = function openPopup($calendar, data, isCreate) {
        var $popup = $(template('tpl_schedule', data || {}));

        if (!$('body').find('#schedule-popup').length) {
            $('body').append($popup);

            $popup.addClass('is-visible');

            setTimeout(function () {
                selectize();
                jscolor.install();
                $popup.addClass('is-animated');
            }, 50);

            $popup.find('form').on('submit', function (e) {
                e.preventDefault ? e.preventDefault() : e.returnValue = false;

                var $form = $(this);

                if ($form.data('is-busy')) {
                    return;
                }

                var action = $form.attr('action');
                var method = $form.attr('method') || 'post';
                var formdata = $form.serializeArray();

                $form.data('is-busy', true);

                createEvent({
                    action: action,
                    method: method,
                    data: formdata
                }, function (responce) {
                    $form.data('is-busy', false);

                    closePopup($popup);
                    prepareEvent($calendar, responce, isCreate);
                });

                return false;
            });

            $popup.find('.j-schedule-popup-close').on('click', function (e) {
                e.preventDefault();
                closePopup($popup);
            });
        }
    };

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

    $('body').on('click', '.js-size-delete', function (e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = !1;
        $(this).closest('tr').remove();
    });

    $('body').on('click', '.js-add-size', function (e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = !1;

        var $table = $(this).closest('.js-size-list').find('table').find('tbody'),
            iteration = parseInt($(this).data('iteration')),
            index = 0;

        $table.find('tr').each(function () {
            if (parseInt($(this).data('index')) > index) {
                index = parseInt($(this).data('index'));
            }
        });

        index++;

        $table.append(template('tpl_image_row', {
            index: index,
            button: true,
            iteration: iteration
        }));
    });

    if ($('.js-slider').length) {
        $('.js-slider').each(function () {
            var id = $(this).attr('id');
            var type = $(this).data('type');
            var value = $(this).data('value');
            var min = $(this).data('min');
            var max = $(this).data('max');

            slider(id, type, value, min, max);
        });
    }

    if ($('.js-map').length) {
        $('.js-map').each(function () {
            var element = $(this).data('element');
            var provider = $(this).data('provider');

            mapConteiner(provider, element);
        });
    }

    if ($('.js-redactor').length) {
        $('.js-redactor').each(function () {
            var id = $(this).attr('id');
            var type = $(this).data('redactor');

            _redactor.init(id, type);
        });
    }

    if ($('.js-editor').length) {
        $('.js-editor').each(function () {
            var id = $(this).attr('id');
            var type = $(this).data('editor');
            var hightlight = $(this).data('hightlight');

            _editor.init(id, type, hightlight);
        });
    }

    alert('length : ' + $('.js-table-toggle').length + ' , ' + document.querySelectorAll('.js-table-toggle').length);

    if ($('.js-table-toggle').length) {
        $('.js-table-toggle').on('click', function (e, flag) {
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

    $("body").on('click', '.js-toggle-binding', function (e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        var $target = $(this);

        if ($target.data('element').length) {
            var $input = $($(this).data('element'));
            $target.toggleClass('on').toggleClass('off');
            $input.prop('readonly', !$target.hasClass('on'));
            $('input[name="' + $input.data('binding-name') + '"]').trigger('blur');
        }
    });

    if ($('.js-binding').length) {
        $('.js-binding').each(function () {
            if (!$(this).hasClass('js-binding-init')) {
                binding($(this).data('binding-name'), $(this).data('binding-element'));
            }
        });
    }

    if ($('.js-fileupload').length) {
        $.upload.init();
    }

    $('body').on('mouseenter', '.js-structure-controll', function (e) {
        $(this).find('.structure__control.animate').removeClass('animate');
    });

    $('body').on('mouseleave', '.js-structure-controll', function (e) {
        $(this).find('.structure__control').addClass('animate');
    });

    $('body').on('click', '.menu-trigger', function (e) {
        e.preventDefault();
        $('#page').toggleClass('page-open');

        var visibility = 'visible';

        if (!$('#page').hasClass('page-open')) {
            visibility = 'hidden';
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
        onDrop: function onDrop($item, container, _super, event) {
            $item.removeClass('dragged').removeAttr("style");
            $("body").removeClass('dragging');
        }
    });

    $('body').on('mouseenter', '.trigger-navigation', function (e) {
        var $item = $(this),
            $page = $('#page'),
            title = $item.attr('rel'),
            tooltip,
            id = 'tooltip-' + $item.attr('id');

        if (title && !$('#' + id).length && !$page.hasClass('page-open')) {
            var pos_top = $item.offset().top + 10;

            tooltip = document.createElement('span');
            tooltip.id = id;
            tooltip.innerHTML = title;
            tooltip.className = 'navigation__tooltip navigation__tooltip_animate';
            tooltip.style.top = pos_top + 'px';

            $page.append(tooltip);

            setTimeout(function () {
                $(tooltip).removeClass('navigation__tooltip_animate');
            }, 30);
        }
    });

    $('body').on('mouseleave', '.trigger-navigation', function (e) {
        var id = 'tooltip-' + $(this).attr('id');

        if ($('#' + id).length) {
            var $tooltip = $('#' + id);

            $tooltip.addClass('navigation__tooltip_animate');

            setTimeout(function () {
                $tooltip.remove();
            }, 200);
        }
    });

    $('body').on('click', '.wrapper', function (e) {
        $('#page').removeClass('page-open');
        $('#overlay').css({
            'visibility': 'hidden'
        });
    });

    $('body').on('mouseenter', '.trigger-tooltip', function (e) {
        $(this).data('xtitle', $(this).prop('title'));
        $(this).prop('title', '');
    });

    $('body').on('mouseleave', '.trigger-tooltip', function (e) {
        $(this).prop('title', $(this).data('xtitle'));
        $(this).data('xtitle', '');
    });

    $('.trigger-popover').popover();

    if ($('.nestable-tree').length) {
        var structure_tree = $('.nestable-tree').eq(0);

        if (typeof structure_tree.data('path') !== 'undefined' && typeof structure_tree.data('group') !== 'undefined') {
            var path = structure_tree.data('path'),
                group = parseInt(structure_tree.data('group'));

            structure_tree.nestable({
                group: group,
                maxDepth: 20,
                dragStop: function dragStop(el) {
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
                afterExpand: function afterExpand(el) {
                    var id = el[0].id.split('-')[1];
                    $.removeCookie(path + '_collapse_' + id, { path: '/' });
                },
                afterCollapse: function afterCollapse(el) {
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

function initApp() {
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

$(window).on('load', function () {
    initApp();

    // Raven.context(function() {
    //     initApp();
    // });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluaXQuanMiXSwibmFtZXMiOlsiZCIsImRvY3VtZW50Iiwia2V5Q29udHJvbHMiLCIkIiwibGVuZ3RoIiwiY2xpcGJvYXJkIiwiQ2xpcGJvYXJkSlMiLCJ0ZXh0IiwidHJpZ2dlciIsImFkZENsYXNzIiwic2V0VGltZW91dCIsInJlbW92ZUNsYXNzIiwiZ2V0QXR0cmlidXRlIiwib24iLCJlIiwicHJldmVudERlZmF1bHQiLCJyZXR1cm5WYWx1ZSIsIl9zZWxmXyIsImhyZWYiLCJhdHRyIiwicG9zdCIsImNwIiwibm90aWZ5IiwicmVtb3ZlIiwiY2xvc2VzdCIsIiR3cmFwIiwiaXRlcmF0aW9uIiwicGFyc2VJbnQiLCJkYXRhIiwidHBsIiwiYXBwZW5kIiwidGVtcGxhdGUiLCJ3aGljaCIsInJlZHVjaW5nIiwiZm9ybWF0IiwidmFsdWUiLCJ2YWwiLCJyZXN1bHQiLCJyZXBsYWNlIiwicmVnZXgiLCJ0ZXN0IiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwia2V5Q29kZSIsImluZGV4T2YiLCJmaWxlTWFuYWdlciIsImZ1bGxDYWxlbmRhciIsInJlbW92ZUV2ZW50IiwiaWQiLCJjYWxsYmFjayIsImFqYXgiLCJ1cmwiLCJBRE1JTl9ESVIiLCJ0eXBlIiwic3VjY2VzcyIsImRhdGFUeXBlIiwiY2hhbmdlRXZlbnQiLCJldmVudCIsInN0YXJ0IiwiZW5kIiwiY3JlYXRlRXZlbnQiLCJpbnB1dCIsImFjdGlvbiIsIm1ldGhvZCIsInByZXBhcmVFdmVudCIsIiRjYWxlbmRhciIsImlzQ3JlYXRlIiwia2V5cyIsIk9iamVjdCIsImNvdW50IiwiZXhjZWxsZW50IiwiZm9yRWFjaCIsIm5hbWUiLCJpbmRleCIsInNwbGl0IiwiY2xvc2VQb3B1cCIsIiRwb3B1cCIsInByZXBhcmVFZGl0RXZlbnQiLCJvcGVuUG9wdXAiLCJmaW5kIiwic2VsZWN0aXplIiwianNjb2xvciIsImluc3RhbGwiLCIkZm9ybSIsImZvcm1kYXRhIiwic2VyaWFsaXplQXJyYXkiLCJyZXNwb25jZSIsIm9uX2xvYWQiLCJtYXNrIiwiJHRhYmxlIiwiZWFjaCIsImJ1dHRvbiIsIm1pbiIsIm1heCIsInNsaWRlciIsImVsZW1lbnQiLCJwcm92aWRlciIsIm1hcENvbnRlaW5lciIsIl9yZWRhY3RvciIsImluaXQiLCJoaWdodGxpZ2h0IiwiX2VkaXRvciIsImFsZXJ0IiwicXVlcnlTZWxlY3RvckFsbCIsImZsYWciLCJ0YWJsZVRvZ2dsZSIsIiR0YXJnZXQiLCIkaW5wdXQiLCJ0b2dnbGVDbGFzcyIsInByb3AiLCJoYXNDbGFzcyIsImJpbmRpbmciLCJ1cGxvYWQiLCJ2aXNpYmlsaXR5IiwiY3NzIiwic29ydGFibGUiLCJoYW5kbGUiLCJwdWxsUGxhY2Vob2xkZXIiLCJib2R5Q2xhc3MiLCJkcmFnZ2VkQ2xhc3MiLCJjb250YWluZXJTZWxlY3RvciIsIml0ZW1QYXRoIiwiaXRlbVNlbGVjdG9yIiwicGxhY2Vob2xkZXIiLCJvbkRyb3AiLCIkaXRlbSIsImNvbnRhaW5lciIsIl9zdXBlciIsInJlbW92ZUF0dHIiLCIkcGFnZSIsInRpdGxlIiwidG9vbHRpcCIsInBvc190b3AiLCJvZmZzZXQiLCJ0b3AiLCJjcmVhdGVFbGVtZW50IiwiaW5uZXJIVE1MIiwiY2xhc3NOYW1lIiwic3R5bGUiLCIkdG9vbHRpcCIsInBvcG92ZXIiLCJzdHJ1Y3R1cmVfdHJlZSIsImVxIiwicGF0aCIsImdyb3VwIiwibmVzdGFibGUiLCJtYXhEZXB0aCIsImRyYWdTdG9wIiwiZWwiLCJ0YXJnZXQiLCJwYXJlbnQiLCJuZXh0Iiwib2Zmc2V0UGFyZW50IiwiaXNOYU4iLCJuZXh0RWxlbWVudFNpYmxpbmciLCJvaWQiLCJwaWQiLCJuaWQiLCJhZnRlckV4cGFuZCIsInJlbW92ZUNvb2tpZSIsImFmdGVyQ29sbGFwc2UiLCJjb29raWUiLCJleHBpcmVzIiwiaW5pdEFwcCIsImRhdGVwaWNrZXIiLCJtZXRhQ291bnRlciIsInNlb0Nyb3dsIiwiZHJvcGRvd24iLCJ0YWJsZVRvZ2dsZUxpc3QiLCJjbGVkaXRvciIsIndpbmRvdyJd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QUF3QyxFQUFFa0gsU0FBUyxFQUFYLEVBQWVuQixNQUFNLEdBQXJCLEVBQXhDO0FBQ0g7QUFyQ21CLGFBQXhCO0FBdUNIO0FBQ0o7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0ZIOztBQUVELFNBQVNvQixPQUFULEdBQW1CO0FBQ2ZuRjtBQUNBb0Y7QUFDQUM7QUFDQUM7QUFDQXBLO0FBQ0FxRjtBQUNBbEUsT0FBR2tKLFFBQUg7QUFDQWxKLE9BQUdtSixlQUFIO0FBQ0FuSixPQUFHb0osUUFBSDtBQUNBeEYsWUFBUUMsT0FBUjtBQUNIOztBQUVEL0UsRUFBRXVLLE1BQUYsRUFBVTdKLEVBQVYsQ0FBYSxNQUFiLEVBQXFCLFlBQU07QUFDdkJzSjs7QUFFQTtBQUNBO0FBQ0E7QUFDSCxDQU5EIiwiZmlsZSI6ImluaXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZCA9IGRvY3VtZW50O1xuXG5mdW5jdGlvbiBrZXlDb250cm9scygpIHtcbiAgICBpZiAoJCgnLmotY2xpcGJvYXJkJykubGVuZ3RoKSB7XG4gICAgICAgIHZhciBjbGlwYm9hcmQgPSBuZXcgQ2xpcGJvYXJkSlMoJy5qLWNsaXBib2FyZCcsIHtcbiAgICAgICAgICAgIHRleHQ6IGZ1bmN0aW9uKHRyaWdnZXIpIHtcbiAgICAgICAgICAgICAgICAkKHRyaWdnZXIpLmFkZENsYXNzKCdjb3BpZWQnKTtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQodHJpZ2dlcikucmVtb3ZlQ2xhc3MoXCJjb3BpZWRcIik7XG4gICAgICAgICAgICAgICAgfSwgNzAwKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0cmlnZ2VyLmdldEF0dHJpYnV0ZSgnZGF0YS1jbGlwYm9hcmQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgJChcImJvZHlcIikub24oJ2NsaWNrJywgJy5yZW1vdmUtdHJpZ2dlcicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCA/IGUucHJldmVudERlZmF1bHQoKSA6IGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcblxuICAgICAgICB2YXIgX3NlbGZfID0gdGhpcyxcbiAgICAgICAgICAgIGhyZWYgPSAkKF9zZWxmXykuYXR0cignaHJlZicpO1xuXG4gICAgICAgICQucG9zdChocmVmLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNwLm5vdGlmeSgn0KPQtNCw0LvQtdC90L4nLCAnaW5mbycpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mKCQoX3NlbGZfKS5hdHRyKCdyZWwnKSkgIT09ICd1bmRlZmluZWQnICYmICQoJChfc2VsZl8pLmF0dHIoJ3JlbCcpKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgJCgkKF9zZWxmXykuYXR0cigncmVsJykpLnJlbW92ZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKF9zZWxmXykuY2xvc2VzdCgndHInKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuICExO1xuICAgIH0pO1xuXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtcmVtb3ZlLWl0ZW0nLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQgPyBlLnByZXZlbnREZWZhdWx0KCkgOiBlLnJldHVyblZhbHVlID0gZmFsc2U7XG5cbiAgICAgICAgdmFyIF9zZWxmXyA9IHRoaXMsXG4gICAgICAgICAgICBocmVmID0gJChfc2VsZl8pLmF0dHIoJ2hyZWYnKTtcblxuICAgICAgICAkLnBvc3QoaHJlZiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjcC5ub3RpZnkoJ9Cj0LTQsNC70LXQvdC+JywgJ2luZm8nKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZigkKF9zZWxmXykuYXR0cigncmVsJykpICE9PSAndW5kZWZpbmVkJyAmJiAkKCQoX3NlbGZfKS5hdHRyKCdyZWwnKSkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICQoJChfc2VsZl8pLmF0dHIoJ3JlbCcpKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJChfc2VsZl8pLmNsb3Nlc3QoJ3RyJykucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiAhMTtcbiAgICB9KTtcblxuICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmpzLWFkZC10ZW1wbGF0ZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCA/IGUucHJldmVudERlZmF1bHQoKSA6IGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgdmFyICR3cmFwID0gJCh0aGlzKS5jbG9zZXN0KCcuanMtdGVtcGxhdGUtd3JhcHBlcicpLFxuICAgICAgICAgICAgaXRlcmF0aW9uID0gcGFyc2VJbnQoJCh0aGlzKS5kYXRhKCdpdGVyYXRpb24nKSksXG4gICAgICAgICAgICB0cGwgPSAkKHRoaXMpLmRhdGEoJ3RlbXBsYXRlJyksXG4gICAgICAgICAgICBkYXRhID0ge307XG5cbiAgICAgICAgaWYgKHR5cGVvZiBpdGVyYXRpb24gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBkYXRhWydpZCddID0gaXRlcmF0aW9uO1xuICAgICAgICAgICAgaXRlcmF0aW9uICs9IC0xO1xuICAgICAgICAgICAgJCh0aGlzKS5kYXRhKCdpdGVyYXRpb24nLCBpdGVyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgJHdyYXAuYXBwZW5kKHRlbXBsYXRlKHRwbCwgZGF0YSkpO1xuICAgIH0pO1xuXG4gICAgJCgnYm9keScpLm9uKCdrZXlkb3duJywgJy5yZWR1Y2luZy10cmlnZ2VyJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS53aGljaCA9PSAzOCB8fCBlLndoaWNoID09IDQwKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHZhciByZWR1Y2luZyA9ICQodGhpcykuZGF0YSgncmVkdWNpbmcnKSB8fCAxMCxcbiAgICAgICAgICAgICAgICBmb3JtYXQgPSAkKHRoaXMpLmRhdGEoJ2Zvcm1hdCcpLFxuICAgICAgICAgICAgICAgIHZhbHVlID0gcGFyc2VJbnQoJCh0aGlzKS52YWwoKSkgfHwgMCxcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAwO1xuXG4gICAgICAgICAgICBpZiAoZS53aGljaCA9PSAzOCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHZhbHVlICsgcmVkdWNpbmc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGUud2hpY2ggPT0gNDApIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB2YWx1ZSAtIHJlZHVjaW5nO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmVzdWx0IDwgMCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YoZm9ybWF0KSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAnP2klJy5yZXBsYWNlKCc/aScsIHJlc3VsdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICQodGhpcykudmFsKHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoJ2JvZHknKS5vbigna2V5cHJlc3MnLCAnLmxhdGluJywgZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgcmVnZXggPSAvW15BLVphLXpdL2c7XG4gICAgICAgIGlmIChyZWdleC50ZXN0KFN0cmluZy5mcm9tQ2hhckNvZGUoZS5rZXlDb2RlKSkpIHtcbiAgICAgICAgICAgIHJldHVybiAhMTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgJChcImJvZHlcIikub24oJ2tleXByZXNzJywgJy5pbnRlZ2VyJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoWzAsIDgsIDEzLCAzOCwgNDBdLmluZGV4T2YoZS53aGljaCkgPCAwICYmIChlLndoaWNoIDwgNDggfHwgZS53aGljaCA+IDU3KSkge1xuICAgICAgICAgICAgcmV0dXJuICExO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkKFwiYm9keVwiKS5vbigna2V5cHJlc3MnLCAnLmZsb2F0JywgZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoWzAsIDgsIDEzLCAzOCwgNDAsIDQ0LCA0Nl0uaW5kZXhPZihlLndoaWNoKSA8IDAgJiYgKGUud2hpY2ggPCA0OCB8fCBlLndoaWNoID4gNTcpKSB7XG4gICAgICAgICAgICByZXR1cm4gITE7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZmlsZU1hbmFnZXIoKSB7fVxuXG5mdW5jdGlvbiBmdWxsQ2FsZW5kYXIoKSB7XG4gICAgY29uc3QgcmVtb3ZlRXZlbnQgPSBmdW5jdGlvbihpZCwgY2FsbGJhY2spIHtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogYC8ke0FETUlOX0RJUn0vbWV0YS9zaGVkdWxlci9kZWxldGVgLFxuICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICdpZCc6IGlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogY2FsbGJhY2ssXG4gICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCJcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgY2hhbmdlRXZlbnQgPSBmdW5jdGlvbihldmVudCwgY2FsbGJhY2spIHtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogYC8ke0FETUlOX0RJUn0vbWV0YS9zaGVkdWxlci9lZGl0YCxcbiAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAnaWQnOiBldmVudC5pZCxcbiAgICAgICAgICAgICAgICAnc3RhcnQnOiBldmVudC5zdGFydC5mb3JtYXQoKSxcbiAgICAgICAgICAgICAgICAnZW5kJzogZXZlbnQuZW5kLmZvcm1hdCgpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczogY2FsbGJhY2ssXG4gICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCJcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgY3JlYXRlRXZlbnQgPSBmdW5jdGlvbihpbnB1dCwgY2FsbGJhY2spIHtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogaW5wdXQuYWN0aW9uLFxuICAgICAgICAgICAgdHlwZTogaW5wdXQubWV0aG9kLFxuICAgICAgICAgICAgZGF0YTogaW5wdXQuZGF0YSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGNhbGxiYWNrLFxuICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHByZXBhcmVFdmVudCA9IGZ1bmN0aW9uKCRjYWxlbmRhciwgZGF0YSwgaXNDcmVhdGUpIHtcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGRhdGEpO1xuXG4gICAgICAgIGNvbnN0IGNvdW50ID0ga2V5cy5sZW5ndGggLSAxO1xuXG4gICAgICAgIGNvbnN0IGV2ZW50ID0ge307XG5cbiAgICAgICAgY29uc3QgZXhjZWxsZW50ID0gW1xuICAgICAgICAgICAgJ2lkJywgJ2dyb3VwJywgJ3RpdGxlJywgJ2l0ZW0nLCAnY29sb3InLCAndHlwZXMnLCAnc3RhcnQnLCAnZW5kJywgJ2V4dHJhJywgJ3Zpc2libGUnXG4gICAgICAgIF07XG5cbiAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUsIGluZGV4KSB7XG4gICAgICAgICAgICBpZiAoZXhjZWxsZW50LmluZGV4T2YobmFtZSkgPj0gMCkge1xuICAgICAgICAgICAgICAgIGV2ZW50W25hbWVdID0gZGF0YVtuYW1lXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG5hbWUgPT09ICd0eXBlcycgJiYgZGF0YVtuYW1lXSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICBldmVudFtuYW1lXSA9IGRhdGFbbmFtZV0uc3BsaXQoJywnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGluZGV4ID09PSBjb3VudCkge1xuICAgICAgICAgICAgICAgIGlmIChpc0NyZWF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAkY2FsZW5kYXIuZnVsbENhbGVuZGFyKCdyZW5kZXJFdmVudCcsIGV2ZW50LCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgJGNhbGVuZGFyLmZ1bGxDYWxlbmRhcigncmVmZXRjaEV2ZW50cycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRjYWxlbmRhci5mdWxsQ2FsZW5kYXIoJ3VwZGF0ZUV2ZW50JywgZXZlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgY2xvc2VQb3B1cCA9IGZ1bmN0aW9uKCRwb3B1cCkge1xuICAgICAgICAkcG9wdXAucmVtb3ZlQ2xhc3MoJ2lzLWFuaW1hdGVkJyk7XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAkcG9wdXAucmVtb3ZlQ2xhc3MoJ2lzLXZpc2libGUnKS5yZW1vdmUoKTtcbiAgICAgICAgfSwgMzUwKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcmVwYXJlRWRpdEV2ZW50ID0gZnVuY3Rpb24oJGNhbGVuZGFyLCBkYXRhKSB7XG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhkYXRhKTtcblxuICAgICAgICBjb25zdCBjb3VudCA9IGtleXMubGVuZ3RoIC0gMTtcblxuICAgICAgICBjb25zdCBldmVudCA9IHt9O1xuXG4gICAgICAgIGNvbnN0IGV4Y2VsbGVudCA9IFtcbiAgICAgICAgICAgICdpZCcsICdncm91cCcsICd0aXRsZScsICdpdGVtJywgJ2NvbG9yJywgJ3R5cGVzJywgJ2V4dHJhJywgJ3Zpc2libGUnXG4gICAgICAgIF07XG5cbiAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUsIGluZGV4KSB7XG4gICAgICAgICAgICBpZiAoZXhjZWxsZW50LmluZGV4T2YobmFtZSkgPj0gMCkge1xuICAgICAgICAgICAgICAgIGV2ZW50W25hbWVdID0gZGF0YVtuYW1lXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG5hbWUgPT09ICd0eXBlcycgJiYgZGF0YVtuYW1lXSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICBldmVudFtuYW1lXSA9IGRhdGFbbmFtZV0uc3BsaXQoJywnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGluZGV4ID09PSBjb3VudCkge1xuICAgICAgICAgICAgICAgIGV2ZW50LmFjdGlvbiA9IGAvJHtBRE1JTl9ESVJ9L21ldGEvc2hlZHVsZXIvZWRpdGA7XG4gICAgICAgICAgICAgICAgb3BlblBvcHVwKCRjYWxlbmRhciwgZXZlbnQsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3Qgb3BlblBvcHVwID0gZnVuY3Rpb24oJGNhbGVuZGFyLCBkYXRhLCBpc0NyZWF0ZSkge1xuICAgICAgICBjb25zdCAkcG9wdXAgPSAkKHRlbXBsYXRlKCd0cGxfc2NoZWR1bGUnLCBkYXRhIHx8IHt9KSk7XG5cbiAgICAgICAgaWYgKCEkKCdib2R5JykuZmluZCgnI3NjaGVkdWxlLXBvcHVwJykubGVuZ3RoKSB7XG4gICAgICAgICAgICAkKCdib2R5JykuYXBwZW5kKCRwb3B1cCk7XG5cbiAgICAgICAgICAgICRwb3B1cC5hZGRDbGFzcygnaXMtdmlzaWJsZScpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBzZWxlY3RpemUoKTtcbiAgICAgICAgICAgICAgICBqc2NvbG9yLmluc3RhbGwoKTtcbiAgICAgICAgICAgICAgICAkcG9wdXAuYWRkQ2xhc3MoJ2lzLWFuaW1hdGVkJyk7XG4gICAgICAgICAgICB9LCA1MCk7XG5cbiAgICAgICAgICAgICRwb3B1cC5maW5kKCdmb3JtJykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0ID8gZS5wcmV2ZW50RGVmYXVsdCgpIDogKGUucmV0dXJuVmFsdWUgPSBmYWxzZSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCAkZm9ybSA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoJGZvcm0uZGF0YSgnaXMtYnVzeScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBhY3Rpb24gPSAkZm9ybS5hdHRyKCdhY3Rpb24nKTtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXRob2QgPSAkZm9ybS5hdHRyKCdtZXRob2QnKSB8fCAncG9zdCc7XG4gICAgICAgICAgICAgICAgY29uc3QgZm9ybWRhdGEgPSAkZm9ybS5zZXJpYWxpemVBcnJheSgpO1xuXG4gICAgICAgICAgICAgICAgJGZvcm0uZGF0YSgnaXMtYnVzeScsIHRydWUpO1xuXG4gICAgICAgICAgICAgICAgY3JlYXRlRXZlbnQoe1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGZvcm1kYXRhLFxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgICRmb3JtLmRhdGEoJ2lzLWJ1c3knLCBmYWxzZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY2xvc2VQb3B1cCgkcG9wdXApO1xuICAgICAgICAgICAgICAgICAgICBwcmVwYXJlRXZlbnQoJGNhbGVuZGFyLCByZXNwb25jZSwgaXNDcmVhdGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRwb3B1cC5maW5kKCcuai1zY2hlZHVsZS1wb3B1cC1jbG9zZScpLm9uKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGNsb3NlUG9wdXAoJHBvcHVwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gaWYgKCQoJy5mdWxsY2FsZW5kYXInKS5sZW5ndGgpIHtcbiAgICAvLyAgICAgY29uc3QgdG9kYXlEYXRlID0gbW9tZW50KCkuc3RhcnRPZignZGF5Jyk7XG4gICAgLy8gICAgIGNvbnN0IFlFU1RFUkRBWSA9IHRvZGF5RGF0ZS5jbG9uZSgpLnN1YnRyYWN0KDEsICdkYXknKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcbiAgICAvLyAgICAgY29uc3QgVE9EQVkgPSB0b2RheURhdGUuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4gICAgLy8gICAgIGNvbnN0IFRPTU9SUk9XID0gdG9kYXlEYXRlLmNsb25lKCkuYWRkKDEsICdkYXknKS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcbiAgICAvLyAgICAgY29uc3QgU1RBUlRfV0VFSyA9IG1vbWVudCgnMjAxOC0wMS0wMScpLnN0YXJ0T2YoJ3dlZWsnKTtcbiAgICAvLyAgICAgY29uc3QgRU5EX1dFRUsgPSBtb21lbnQoJzIwMTgtMDEtMDEnKS5lbmRPZignd2VlaycpO1xuXG4gICAgLy8gICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAvLyAgICAgICAgIGxhbmc6ICdydScsXG4gICAgLy8gICAgICAgICBoZWlnaHQ6ICdhdXRvJyxcbiAgICAvLyAgICAgICAgIHRpbWV6b25lOiAnbG9jYWwnLFxuICAgIC8vICAgICAgICAgaGVhZGVyOiB7XG4gICAgLy8gICAgICAgICAgICAgbGVmdDogJ2FnZW5kYVdlZWssYWdlbmRhRGF5JyxcbiAgICAvLyAgICAgICAgICAgICByaWdodDogJydcbiAgICAvLyAgICAgICAgICAgICAvLyBsZWZ0OiAncHJvbXB0RXZlbnQgdG9kYXkgcHJldixuZXh0JyxcbiAgICAvLyAgICAgICAgICAgICAvLyBjZW50ZXI6ICd0aXRsZScsXG4gICAgLy8gICAgICAgICAgICAgLy8gcmlnaHQ6ICdtb250aCxhZ2VuZGFXZWVrLGFnZW5kYURheSxsaXN0V2VlaydcbiAgICAvLyAgICAgICAgIH0sXG4gICAgLy8gICAgICAgICBldmVudExpbWl0OiBmYWxzZSxcbiAgICAvLyAgICAgICAgIGxhenlGZXRjaGluZzogZmFsc2UsXG4gICAgLy8gICAgICAgICBkZWZhdWx0VmlldzogJ2FnZW5kYVdlZWsnLFxuICAgIC8vICAgICAgICAgZGVmYXVsdERhdGU6ICcyMDE4LTAxLTAxJyxcbiAgICAvLyAgICAgICAgIG5hdkxpbmtzOiB0cnVlLFxuICAgIC8vICAgICAgICAgZWRpdGFibGU6IHRydWUsXG4gICAgLy8gICAgICAgICBkcm9wcGFibGU6IHRydWUsXG4gICAgLy8gICAgICAgICBzZWxlY3RhYmxlOiB0cnVlLFxuICAgIC8vICAgICAgICAgc2VsZWN0SGVscGVyOiB0cnVlLFxuICAgIC8vICAgICAgICAgYXNwZWN0UmF0aW86IDIsXG4gICAgLy8gICAgICAgICBhbGxEYXlTbG90OiBmYWxzZSxcbiAgICAvLyAgICAgICAgIG1pblRpbWU6ICcwNzowMDowMCcsXG4gICAgLy8gICAgICAgICBtYXhUaW1lOiAnMjE6MDA6MDAnLFxuICAgIC8vICAgICAgICAgc25hcER1cmF0aW9uOiAnMDA6MDU6MDAnLFxuICAgIC8vICAgICAgICAgc2xvdER1cmF0aW9uOiAnMDA6MDU6MDAnLFxuICAgIC8vICAgICAgICAgc2xvdExhYmVsRm9ybWF0OiAnSCg6bW0pJyxcbiAgICAvLyAgICAgICAgIHNjaGVkdWxlckxpY2Vuc2VLZXk6ICdHUEwtTXktUHJvamVjdC1Jcy1PcGVuLVNvdXJjZSdcbiAgICAvLyAgICAgfTtcblxuICAgIC8vICAgICAkKCcuZnVsbGNhbGVuZGFyJykuZWFjaChmdW5jdGlvbihlKSB7XG4gICAgLy8gICAgICAgICBjb25zdCBpZCA9ICQodGhpcykuYXR0cignaWQnKTtcblxuICAgIC8vICAgICAgICAgY29uc3QgJGNhbGVuZGFyID0gJChgIyR7aWR9YCk7XG4gICAgLy8gICAgICAgICBjb25zdCBuYW1lID0gJGNhbGVuZGFyLmRhdGEoJ25hbWUnKTtcbiAgICAvLyAgICAgICAgIGNvbnN0IGdyb3VwID0gJChgaW5wdXRbbmFtZT1cIiR7bmFtZX1cIl1gKS52YWwoKTtcblxuICAgIC8vICAgICAgICAgLy8gY29uZmlnLmN1c3RvbUJ1dHRvbnMgPSB7XG4gICAgLy8gICAgICAgICAvLyAgICAgcHJvbXB0RXZlbnQ6IHtcbiAgICAvLyAgICAgICAgIC8vICAgICAgICAgdGV4dDogJ9CU0L7QsdCw0LLQuNGC0Ywg0Y3Qu9C10LzQtdC90YInLFxuICAgIC8vICAgICAgICAgLy8gICAgICAgICBjbGljazogZnVuY3Rpb24oKSB7XG4gICAgLy8gICAgICAgICAvLyAgICAgICAgICAgICBjb25zdCB0aXRsZSA9IHByb21wdCgn0JfQsNCz0L7Qu9C+0LLQvtC6INGB0L7QsdGL0YLQuNGPOicpO1xuXG4gICAgLy8gICAgICAgICAvLyAgICAgICAgICAgICBpZiAodGl0bGUpIHtcbiAgICAvLyAgICAgICAgIC8vICAgICAgICAgICAgICAgICBjcmVhdGVFdmVudCh7XG4gICAgLy8gICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIC8vIGlkOiAxMDAwLFxuICAgIC8vICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAvLyBjb2xvcjogJyNmMDAnLFxuICAgIC8vICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgLy8gICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIGdyb3VwOiBncm91cCxcbiAgICAvLyAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgIC8vICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICBlbmQ6IGVuZFxuICAgIC8vICAgICAgICAgLy8gICAgICAgICAgICAgICAgIH0sXG4gICAgLy8gICAgICAgICAvLyAgICAgICAgICAgICAgICAgZnVuY3Rpb24ocmVzcG9uY2UpIHtcbiAgICAvLyAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgcHJlcGFyZUV2ZW50KCRjYWxlbmRhciwgcmVzcG9uY2UpO1xuICAgIC8vICAgICAgICAgLy8gICAgICAgICAgICAgICAgIH0pO1xuICAgIC8vICAgICAgICAgLy8gICAgICAgICAgICAgfVxuICAgIC8vICAgICAgICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgICAgICAvLyAgICAgfVxuICAgIC8vICAgICAgICAgLy8gfTtcblxuICAgIC8vICAgICAgICAgY29uZmlnLnNlbGVjdCA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAvLyAgICAgICAgICAgICBvcGVuUG9wdXAoJGNhbGVuZGFyLCB7XG4gICAgLy8gICAgICAgICAgICAgICAgIGFjdGlvbjogYC8ke0FETUlOX0RJUn0vbWV0YS9zaGVkdWxlci9hZGRgLFxuICAgIC8vICAgICAgICAgICAgICAgICBncm91cDogZ3JvdXAsXG4gICAgLy8gICAgICAgICAgICAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAvLyAgICAgICAgICAgICAgICAgZW5kOiBlbmRcbiAgICAvLyAgICAgICAgICAgICB9LCB0cnVlKTtcblxuICAgIC8vICAgICAgICAgICAgICRjYWxlbmRhci5mdWxsQ2FsZW5kYXIoJ3Vuc2VsZWN0Jyk7XG4gICAgLy8gICAgICAgICB9O1xuXG4gICAgLy8gICAgICAgICBjb25maWcuZXZlbnRSZW5kZXIgPSBmdW5jdGlvbihldmVudCwgZWxlbWVudCkge1xuICAgIC8vICAgICAgICAgICAgIGxldCB0aW1lb3V0ID0gbnVsbDtcblxuICAgIC8vICAgICAgICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblxuICAgIC8vICAgICAgICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBwcmVwYXJlRWRpdEV2ZW50KCRjYWxlbmRhciwgZXZlbnQpO1xuICAgIC8vICAgICAgICAgICAgICAgICB9LCAzMDApO1xuICAgIC8vICAgICAgICAgICAgIH0pO1xuXG4gICAgLy8gICAgICAgICAgICAgZWxlbWVudC5vbignZGJsY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgaWYgKGNvbmZpcm0oJ9Cj0LTQsNC70LjRgtGMPycpKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG5cbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHJlbW92ZUV2ZW50KGV2ZW50LmlkLCBmdW5jdGlvbigpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAkY2FsZW5kYXIuZnVsbENhbGVuZGFyKFwicmVtb3ZlRXZlbnRzXCIsIGZ1bmN0aW9uKGV2KSB7XG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBldi5pZCA9PSBldmVudC5pZDtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgIC8vICAgICAgICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICAgICAgfSk7XG4gICAgLy8gICAgICAgICB9O1xuXG4gICAgLy8gICAgICAgICBjb25maWcuZXZlbnREcm9wID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAvLyAgICAgICAgICAgICBjaGFuZ2VFdmVudChldmVudCk7XG4gICAgLy8gICAgICAgICB9O1xuXG4gICAgLy8gICAgICAgICBjb25maWcuZXZlbnRSZXNpemUgPSBmdW5jdGlvbihldmVudCkge1xuICAgIC8vICAgICAgICAgICAgIGNoYW5nZUV2ZW50KGV2ZW50KTtcbiAgICAvLyAgICAgICAgIH07XG5cbiAgICAvLyAgICAgICAgIGlmICh0eXBlb2YoZXZlbnRzSnNvbltuYW1lXSkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gICAgICAgICAgICAgY29uZmlnLmV2ZW50cyA9IGV2ZW50c0pzb25bbmFtZV07XG4gICAgLy8gICAgICAgICB9XG5cbiAgICAvLyAgICAgICAgICQoXCJib2R5XCIpLm9uKCdjbGljaycsICcuai1yZW1vdmUtZXZlbnQnLCBmdW5jdGlvbihlKSB7XG4gICAgLy8gICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgLy8gICAgICAgICAgICAgY29uc3QgbGluayA9ICQodGhpcyk7XG5cbiAgICAvLyAgICAgICAgICAgICBpZiAobGluay5kYXRhKCdpcy1idXN5JykpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgIC8vICAgICAgICAgICAgIH1cblxuICAgIC8vICAgICAgICAgICAgIGxpbmsuZGF0YSgnaXMtYnVzeScsIHRydWUpO1xuXG4gICAgLy8gICAgICAgICAgICAgY29uc3QgZXZlbnRfaWQgPSBsaW5rLmRhdGEoJ2V2ZW50Jyk7XG4gICAgLy8gICAgICAgICAgICAgY29uc3QgJGNsb3Nlc3RQb3B1cCA9IGxpbmsuY2xvc2VzdCgnLnNjaGVkdWxlLXBvcHVwJyk7XG5cbiAgICAvLyAgICAgICAgICAgICByZW1vdmVFdmVudChldmVudF9pZCwgZnVuY3Rpb24oKSB7XG4gICAgLy8gICAgICAgICAgICAgICAgICRjYWxlbmRhci5mdWxsQ2FsZW5kYXIoXCJyZW1vdmVFdmVudHNcIiwgZnVuY3Rpb24oZXYpIHtcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHJldHVybiBldi5pZCA9PSBldmVudF9pZDtcbiAgICAvLyAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAvLyAgICAgICAgICAgICAgICAgY2xvc2VQb3B1cCgkY2xvc2VzdFBvcHVwKTtcbiAgICAvLyAgICAgICAgICAgICB9KTtcbiAgICAvLyAgICAgICAgIH0pO1xuXG4gICAgLy8gICAgICAgICAkY2FsZW5kYXIuZnVsbENhbGVuZGFyKGNvbmZpZyk7XG5cbiAgICAvLyAgICAgICAgICRjYWxlbmRhci5mdWxsQ2FsZW5kYXIoJ2NoYW5nZVZpZXcnLCAnYWdlbmRhV2VlaycsIHtcbiAgICAvLyAgICAgICAgICAgICBzdGFydDogU1RBUlRfV0VFSyxcbiAgICAvLyAgICAgICAgICAgICBlbmQ6IEVORF9XRUVLXG4gICAgLy8gICAgICAgICB9KTtcblxuICAgIC8vICAgICAgICAgJGNhbGVuZGFyLmZ1bGxDYWxlbmRhcigncmVuZGVyJyk7XG4gICAgLy8gICAgIH0pO1xuICAgIC8vIH1cbn1cblxuZnVuY3Rpb24gb25fbG9hZCgpIHtcbiAgICBmaWxlTWFuYWdlcigpO1xuXG4gICAgLy8gZnVsbENhbGVuZGFyKCk7XG5cbiAgICAkKFwiLndhdGNoLWRhdGVtYXNrXCIpLm1hc2soXCI5OS85OS85OTk5XCIpO1xuICAgICQoXCIud2F0Y2gtcGhvbmVtYXNrXCIpLm1hc2soXCIrIDcgKDk5OSkgOTk5LTk5LTk5XCIpO1xuICAgICQoXCIud2F0Y2gtY2FydG51bWJlclwiKS5tYXNrKFwiOTk5LTk5OS05OTlcIik7XG5cbiAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5qcy1zaXplLWRlbGV0ZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCA/IGUucHJldmVudERlZmF1bHQoKSA6IGUucmV0dXJuVmFsdWUgPSAhMTtcbiAgICAgICAgJCh0aGlzKS5jbG9zZXN0KCd0cicpLnJlbW92ZSgpO1xuICAgIH0pO1xuXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcuanMtYWRkLXNpemUnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQgPyBlLnByZXZlbnREZWZhdWx0KCkgOiBlLnJldHVyblZhbHVlID0gITE7XG5cbiAgICAgICAgdmFyICR0YWJsZSA9ICQodGhpcykuY2xvc2VzdCgnLmpzLXNpemUtbGlzdCcpLmZpbmQoJ3RhYmxlJykuZmluZCgndGJvZHknKSxcbiAgICAgICAgICAgIGl0ZXJhdGlvbiA9IHBhcnNlSW50KCQodGhpcykuZGF0YSgnaXRlcmF0aW9uJykpLFxuICAgICAgICAgICAgaW5kZXggPSAwO1xuXG4gICAgICAgICR0YWJsZS5maW5kKCd0cicpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAocGFyc2VJbnQoJCh0aGlzKS5kYXRhKCdpbmRleCcpKSA+IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBwYXJzZUludCgkKHRoaXMpLmRhdGEoJ2luZGV4JykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpbmRleCsrO1xuXG4gICAgICAgICR0YWJsZS5hcHBlbmQoXG4gICAgICAgICAgICB0ZW1wbGF0ZSgndHBsX2ltYWdlX3JvdycsIHtcbiAgICAgICAgICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgICAgICAgICAgYnV0dG9uOiB0cnVlLFxuICAgICAgICAgICAgICAgIGl0ZXJhdGlvbjogaXRlcmF0aW9uXG4gICAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH0pO1xuXG4gICAgaWYgKCQoJy5qcy1zbGlkZXInKS5sZW5ndGgpIHtcbiAgICAgICAgJCgnLmpzLXNsaWRlcicpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaWQgPSAkKHRoaXMpLmF0dHIoJ2lkJyk7XG4gICAgICAgICAgICB2YXIgdHlwZSA9ICQodGhpcykuZGF0YSgndHlwZScpO1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gJCh0aGlzKS5kYXRhKCd2YWx1ZScpO1xuICAgICAgICAgICAgdmFyIG1pbiA9ICQodGhpcykuZGF0YSgnbWluJyk7XG4gICAgICAgICAgICB2YXIgbWF4ID0gJCh0aGlzKS5kYXRhKCdtYXgnKTtcblxuICAgICAgICAgICAgc2xpZGVyKGlkLCB0eXBlLCB2YWx1ZSwgbWluLCBtYXgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoJCgnLmpzLW1hcCcpLmxlbmd0aCkge1xuICAgICAgICAkKCcuanMtbWFwJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gJCh0aGlzKS5kYXRhKCdlbGVtZW50Jyk7XG4gICAgICAgICAgICB2YXIgcHJvdmlkZXIgPSAkKHRoaXMpLmRhdGEoJ3Byb3ZpZGVyJyk7XG5cbiAgICAgICAgICAgIG1hcENvbnRlaW5lcihwcm92aWRlciwgZWxlbWVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgkKCcuanMtcmVkYWN0b3InKS5sZW5ndGgpIHtcbiAgICAgICAgJCgnLmpzLXJlZGFjdG9yJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBpZCA9ICQodGhpcykuYXR0cignaWQnKTtcbiAgICAgICAgICAgIHZhciB0eXBlID0gJCh0aGlzKS5kYXRhKCdyZWRhY3RvcicpO1xuXG4gICAgICAgICAgICBfcmVkYWN0b3IuaW5pdChpZCwgdHlwZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgkKCcuanMtZWRpdG9yJykubGVuZ3RoKSB7XG4gICAgICAgICQoJy5qcy1lZGl0b3InKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGlkID0gJCh0aGlzKS5hdHRyKCdpZCcpO1xuICAgICAgICAgICAgdmFyIHR5cGUgPSAkKHRoaXMpLmRhdGEoJ2VkaXRvcicpO1xuICAgICAgICAgICAgdmFyIGhpZ2h0bGlnaHQgPSAkKHRoaXMpLmRhdGEoJ2hpZ2h0bGlnaHQnKTtcblxuICAgICAgICAgICAgX2VkaXRvci5pbml0KGlkLCB0eXBlLCBoaWdodGxpZ2h0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWxlcnQoJ2xlbmd0aCA6ICcgKyAkKCcuanMtdGFibGUtdG9nZ2xlJykubGVuZ3RoICsgJyAsICcgKyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtdGFibGUtdG9nZ2xlJykubGVuZ3RoKVxuXG4gICAgaWYgKCQoJy5qcy10YWJsZS10b2dnbGUnKS5sZW5ndGgpIHtcbiAgICAgICAgJCgnLmpzLXRhYmxlLXRvZ2dsZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUsIGZsYWcpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQgPyBlLnByZXZlbnREZWZhdWx0KCkgOiBlLnJldHVyblZhbHVlID0gITE7XG5cbiAgICAgICAgICAgIGlmIChmbGFnKSB7XG4gICAgICAgICAgICAgICAgY3AudGFibGVUb2dnbGUoJCh0aGlzKS5kYXRhKCd0b2dnbGUnKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNwLnRhYmxlVG9nZ2xlKCQodGhpcykuZGF0YSgndG9nZ2xlJyksIGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoJCgnLmpzLXRhYmxlLXRvZ2dsZVtkYXRhLXRvZ2dsZS1pbml0PVwidHJ1ZVwiXScpLmxlbmd0aCkge1xuICAgICAgICAgICAgJCgnLmpzLXRhYmxlLXRvZ2dsZVtkYXRhLXRvZ2dsZS1pbml0PVwidHJ1ZVwiXScpLnRyaWdnZXIoJ2NsaWNrJywgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAkKFwiYm9keVwiKS5vbignY2xpY2snLCAnLmpzLXRvZ2dsZS1iaW5kaW5nJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0ID8gZS5wcmV2ZW50RGVmYXVsdCgpIDogZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICBjb25zdCAkdGFyZ2V0ID0gJCh0aGlzKTtcblxuICAgICAgICBpZiAoJHRhcmdldC5kYXRhKCdlbGVtZW50JykubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zdCAkaW5wdXQgPSAkKCQodGhpcykuZGF0YSgnZWxlbWVudCcpKTtcbiAgICAgICAgICAgICR0YXJnZXQudG9nZ2xlQ2xhc3MoJ29uJykudG9nZ2xlQ2xhc3MoJ29mZicpO1xuICAgICAgICAgICAgJGlucHV0LnByb3AoJ3JlYWRvbmx5JywgISR0YXJnZXQuaGFzQ2xhc3MoJ29uJykpO1xuICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cIicgKyAkaW5wdXQuZGF0YSgnYmluZGluZy1uYW1lJykgKyAnXCJdJykudHJpZ2dlcignYmx1cicpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoJCgnLmpzLWJpbmRpbmcnKS5sZW5ndGgpIHtcbiAgICAgICAgJCgnLmpzLWJpbmRpbmcnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCEkKHRoaXMpLmhhc0NsYXNzKCdqcy1iaW5kaW5nLWluaXQnKSkge1xuICAgICAgICAgICAgICAgIGJpbmRpbmcoJCh0aGlzKS5kYXRhKCdiaW5kaW5nLW5hbWUnKSwgJCh0aGlzKS5kYXRhKCdiaW5kaW5nLWVsZW1lbnQnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICgkKCcuanMtZmlsZXVwbG9hZCcpLmxlbmd0aCkge1xuICAgICAgICAkLnVwbG9hZC5pbml0KCk7XG4gICAgfVxuXG4gICAgJCgnYm9keScpLm9uKCdtb3VzZWVudGVyJywgJy5qcy1zdHJ1Y3R1cmUtY29udHJvbGwnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICQodGhpcykuZmluZCgnLnN0cnVjdHVyZV9fY29udHJvbC5hbmltYXRlJykucmVtb3ZlQ2xhc3MoJ2FuaW1hdGUnKTtcbiAgICB9KTtcblxuICAgICQoJ2JvZHknKS5vbignbW91c2VsZWF2ZScsICcuanMtc3RydWN0dXJlLWNvbnRyb2xsJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAkKHRoaXMpLmZpbmQoJy5zdHJ1Y3R1cmVfX2NvbnRyb2wnKS5hZGRDbGFzcygnYW5pbWF0ZScpO1xuICAgIH0pO1xuXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcubWVudS10cmlnZ2VyJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICQoJyNwYWdlJykudG9nZ2xlQ2xhc3MoJ3BhZ2Utb3BlbicpO1xuXG4gICAgICAgIHZhciB2aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuXG4gICAgICAgIGlmICghJCgnI3BhZ2UnKS5oYXNDbGFzcygncGFnZS1vcGVuJykpIHtcbiAgICAgICAgICAgIHZpc2liaWxpdHkgPSAnaGlkZGVuJ1xuICAgICAgICB9XG5cbiAgICAgICAgJCgnI292ZXJsYXknKS5jc3Moe1xuICAgICAgICAgICAgJ3Zpc2liaWxpdHknOiB2aXNpYmlsaXR5XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiAhMTtcbiAgICB9KTtcblxuICAgICQoJyNtZXRhX2RhdGEnKS5zb3J0YWJsZSh7XG4gICAgICAgIGhhbmRsZTogJy5qcy10cmlnZ2VyLWRyYWcnLFxuICAgICAgICBwdWxsUGxhY2Vob2xkZXI6IGZhbHNlLFxuICAgICAgICBib2R5Q2xhc3M6ICdkcmFnZ2luZycsXG4gICAgICAgIGRyYWdnZWRDbGFzczogJ2RyYWdnZWQnLFxuICAgICAgICBjb250YWluZXJTZWxlY3RvcjogJ3RhYmxlJyxcbiAgICAgICAgaXRlbVBhdGg6ICc+IHRib2R5JyxcbiAgICAgICAgaXRlbVNlbGVjdG9yOiAndHInLFxuICAgICAgICBwbGFjZWhvbGRlcjogJzx0ciBjbGFzcz1cInBsYWNlaG9sZGVyXCIvPicsXG4gICAgICAgIG9uRHJvcDogZnVuY3Rpb24oJGl0ZW0sIGNvbnRhaW5lciwgX3N1cGVyLCBldmVudCkge1xuICAgICAgICAgICAgJGl0ZW0ucmVtb3ZlQ2xhc3MoJ2RyYWdnZWQnKS5yZW1vdmVBdHRyKFwic3R5bGVcIik7XG4gICAgICAgICAgICAkKFwiYm9keVwiKS5yZW1vdmVDbGFzcygnZHJhZ2dpbmcnKVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkKCdib2R5Jykub24oJ21vdXNlZW50ZXInLCAnLnRyaWdnZXItbmF2aWdhdGlvbicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyICRpdGVtID0gJCh0aGlzKSxcbiAgICAgICAgICAgICRwYWdlID0gJCgnI3BhZ2UnKSxcbiAgICAgICAgICAgIHRpdGxlID0gJGl0ZW0uYXR0cigncmVsJyksXG4gICAgICAgICAgICB0b29sdGlwLCBpZCA9ICd0b29sdGlwLScgKyAkaXRlbS5hdHRyKCdpZCcpO1xuXG4gICAgICAgIGlmICh0aXRsZSAmJiAhJCgnIycgKyBpZCkubGVuZ3RoICYmICEkcGFnZS5oYXNDbGFzcygncGFnZS1vcGVuJykpIHtcbiAgICAgICAgICAgIHZhciBwb3NfdG9wID0gJGl0ZW0ub2Zmc2V0KCkudG9wICsgMTA7XG5cbiAgICAgICAgICAgIHRvb2x0aXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgICAgICB0b29sdGlwLmlkID0gaWQ7XG4gICAgICAgICAgICB0b29sdGlwLmlubmVySFRNTCA9IHRpdGxlO1xuICAgICAgICAgICAgdG9vbHRpcC5jbGFzc05hbWUgPSAnbmF2aWdhdGlvbl9fdG9vbHRpcCBuYXZpZ2F0aW9uX190b29sdGlwX2FuaW1hdGUnO1xuICAgICAgICAgICAgdG9vbHRpcC5zdHlsZS50b3AgPSBwb3NfdG9wICsgJ3B4JztcblxuICAgICAgICAgICAgJHBhZ2UuYXBwZW5kKHRvb2x0aXApO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICQodG9vbHRpcCkucmVtb3ZlQ2xhc3MoJ25hdmlnYXRpb25fX3Rvb2x0aXBfYW5pbWF0ZScpO1xuICAgICAgICAgICAgfSwgMzApO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkKCdib2R5Jykub24oJ21vdXNlbGVhdmUnLCAnLnRyaWdnZXItbmF2aWdhdGlvbicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIGlkID0gJ3Rvb2x0aXAtJyArICQodGhpcykuYXR0cignaWQnKTtcblxuICAgICAgICBpZiAoJCgnIycgKyBpZCkubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgJHRvb2x0aXAgPSAkKCcjJyArIGlkKTtcblxuICAgICAgICAgICAgJHRvb2x0aXAuYWRkQ2xhc3MoJ25hdmlnYXRpb25fX3Rvb2x0aXBfYW5pbWF0ZScpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICR0b29sdGlwLnJlbW92ZSgpO1xuICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgJCgnYm9keScpLm9uKCdjbGljaycsICcud3JhcHBlcicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgJCgnI3BhZ2UnKS5yZW1vdmVDbGFzcygncGFnZS1vcGVuJyk7XG4gICAgICAgICQoJyNvdmVybGF5JykuY3NzKHtcbiAgICAgICAgICAgICd2aXNpYmlsaXR5JzogJ2hpZGRlbidcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAkKCdib2R5Jykub24oJ21vdXNlZW50ZXInLCAnLnRyaWdnZXItdG9vbHRpcCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgJCh0aGlzKS5kYXRhKCd4dGl0bGUnLCAkKHRoaXMpLnByb3AoJ3RpdGxlJykpO1xuICAgICAgICAkKHRoaXMpLnByb3AoJ3RpdGxlJywgJycpO1xuICAgIH0pO1xuXG4gICAgJCgnYm9keScpLm9uKCdtb3VzZWxlYXZlJywgJy50cmlnZ2VyLXRvb2x0aXAnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICQodGhpcykucHJvcCgndGl0bGUnLCAkKHRoaXMpLmRhdGEoJ3h0aXRsZScpKTtcbiAgICAgICAgJCh0aGlzKS5kYXRhKCd4dGl0bGUnLCAnJyk7XG4gICAgfSk7XG5cbiAgICAkKCcudHJpZ2dlci1wb3BvdmVyJykucG9wb3ZlcigpO1xuXG4gICAgaWYgKCQoJy5uZXN0YWJsZS10cmVlJykubGVuZ3RoKSB7XG4gICAgICAgIHZhciBzdHJ1Y3R1cmVfdHJlZSA9ICQoJy5uZXN0YWJsZS10cmVlJykuZXEoMCk7XG5cbiAgICAgICAgaWYgKHR5cGVvZihzdHJ1Y3R1cmVfdHJlZS5kYXRhKCdwYXRoJykpICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Yoc3RydWN0dXJlX3RyZWUuZGF0YSgnZ3JvdXAnKSkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB2YXIgcGF0aCA9IHN0cnVjdHVyZV90cmVlLmRhdGEoJ3BhdGgnKSxcbiAgICAgICAgICAgICAgICBncm91cCA9IHBhcnNlSW50KHN0cnVjdHVyZV90cmVlLmRhdGEoJ2dyb3VwJykpO1xuXG4gICAgICAgICAgICBzdHJ1Y3R1cmVfdHJlZS5uZXN0YWJsZSh7XG4gICAgICAgICAgICAgICAgZ3JvdXA6IGdyb3VwLFxuICAgICAgICAgICAgICAgIG1heERlcHRoOiAyMCxcbiAgICAgICAgICAgICAgICBkcmFnU3RvcDogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhcmdldCwgcGFyZW50LCBuZXh0O1xuXG4gICAgICAgICAgICAgICAgICAgIG5leHQgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSBwYXJzZUludChlbFswXS5pZC5zcGxpdCgnLScpWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gcGFyc2VJbnQoZWxbMF0ub2Zmc2V0UGFyZW50Lm9mZnNldFBhcmVudC5pZC5zcGxpdCgnLScpWzFdKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNOYU4ocGFyZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gZ3JvdXA7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxbMF0ubmV4dEVsZW1lbnRTaWJsaW5nICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0ID0gcGFyc2VJbnQoZWxbMF0ubmV4dEVsZW1lbnRTaWJsaW5nLmlkLnNwbGl0KCctJylbMV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc05hTih0YXJnZXQpICYmICFpc05hTihwYXJlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJy8nICsgQURNSU5fRElSICsgJy8nICsgcGF0aCArICcvdXBkYXRlU3RydWN0dXJlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9pZDogdGFyZ2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaWQ6IHBhcmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmlkOiBuZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGFmdGVyRXhwYW5kOiBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSBlbFswXS5pZC5zcGxpdCgnLScpWzFdO1xuICAgICAgICAgICAgICAgICAgICAkLnJlbW92ZUNvb2tpZShwYXRoICsgJ19jb2xsYXBzZV8nICsgaWQsIHsgcGF0aDogJy8nIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYWZ0ZXJDb2xsYXBzZTogZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkID0gZWxbMF0uaWQuc3BsaXQoJy0nKVsxXTtcbiAgICAgICAgICAgICAgICAgICAgJC5jb29raWUocGF0aCArICdfY29sbGFwc2VfJyArIGlkLCAnMScsIHsgZXhwaXJlczogMzAsIHBhdGg6ICcvJyB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qXG4gICAgZG9PbkxvYWQoJ3N0cnVjdHVyZScpO1xuICAgIGJ1aWxkVHJlZSgnc3RydWN0dXJlJywgJ2luZGV4Jyk7XG5cbiAgICAkKCcjbmVzdGFibGUtbWVudScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpXG4gICAge1xuICAgICAgICB2YXIgdGFyZ2V0ID0gJChlLnRhcmdldCksXG4gICAgICAgICAgICBhY3Rpb24gPSB0YXJnZXQuZGF0YSgnYWN0aW9uJyk7XG4gICAgICAgIGlmIChhY3Rpb24gPT09ICdleHBhbmQtYWxsJykge1xuICAgICAgICAgICAgJCgnLmRkJykubmVzdGFibGUoJ2V4cGFuZEFsbCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhY3Rpb24gPT09ICdjb2xsYXBzZS1hbGwnKSB7XG4gICAgICAgICAgICAkKCcuZGQnKS5uZXN0YWJsZSgnY29sbGFwc2VBbGwnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGxpc3QgPSB0aGlzO1xuICAgIGxpc3QuZWwuZmluZChsaXN0Lm9wdGlvbnMuaXRlbU5vZGVOYW1lKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICBsaXN0LmNvbGxhcHNlSXRlbSgkKHRoaXMpKTtcbiAgICB9KTtcblxuXG4gICAgZXhwYW5kSXRlbTogZnVuY3Rpb24obGkpXG4gICAge1xuICAgICAgICBsaS5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY29sbGFwc2VkQ2xhc3MpO1xuICAgICAgICBsaS5jaGlsZHJlbignW2RhdGEtYWN0aW9uPVwiZXhwYW5kXCJdJykuaGlkZSgpO1xuICAgICAgICBsaS5jaGlsZHJlbignW2RhdGEtYWN0aW9uPVwiY29sbGFwc2VcIl0nKS5zaG93KCk7XG4gICAgICAgIGxpLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5saXN0Tm9kZU5hbWUpLnNob3coKTtcbiAgICB9LFxuXG4gICAgY29sbGFwc2VJdGVtOiBmdW5jdGlvbihsaSlcbiAgICB7XG4gICAgICAgIHZhciBsaXN0cyA9IGxpLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5saXN0Tm9kZU5hbWUpO1xuICAgICAgICBpZiAobGlzdHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBsaS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY29sbGFwc2VkQ2xhc3MpO1xuICAgICAgICAgICAgbGkuY2hpbGRyZW4oJ1tkYXRhLWFjdGlvbj1cImNvbGxhcHNlXCJdJykuaGlkZSgpO1xuICAgICAgICAgICAgbGkuY2hpbGRyZW4oJ1tkYXRhLWFjdGlvbj1cImV4cGFuZFwiXScpLnNob3coKTtcbiAgICAgICAgICAgIGxpLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5saXN0Tm9kZU5hbWUpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICB2YXIgdXBkYXRlT3V0cHV0ID0gZnVuY3Rpb24oZSlcbiAgICB7XG4gICAgICAgIHZhciBsaXN0ICAgPSBlLmxlbmd0aCA/IGUgOiAkKGUudGFyZ2V0KSxcbiAgICAgICAgICAgIG91dHB1dCA9IGxpc3QuZGF0YSgnb3V0cHV0Jyk7XG4gICAgICAgIGlmICh3aW5kb3cuSlNPTikge1xuICAgICAgICAgICAgb3V0cHV0LnZhbCh3aW5kb3cuSlNPTi5zdHJpbmdpZnkobGlzdC5uZXN0YWJsZSgnc2VyaWFsaXplJykpKTsvLywgbnVsbCwgMikpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0cHV0LnZhbCgnSlNPTiBicm93c2VyIHN1cHBvcnQgcmVxdWlyZWQgZm9yIHRoaXMgZGVtby4nKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBhY3RpdmF0ZSBOZXN0YWJsZSBmb3IgbGlzdCAxXG4gICAgJCgnI25lc3RhYmxlJykubmVzdGFibGUoe1xuICAgICAgICBncm91cDogMVxuICAgIH0pXG4gICAgLm9uKCdjaGFuZ2UnLCB1cGRhdGVPdXRwdXQpO1xuXG4gICAgLy8gYWN0aXZhdGUgTmVzdGFibGUgZm9yIGxpc3QgMlxuICAgICQoJyNuZXN0YWJsZTInKS5uZXN0YWJsZSh7XG4gICAgICAgIGdyb3VwOiAxXG4gICAgfSlcbiAgICAub24oJ2NoYW5nZScsIHVwZGF0ZU91dHB1dCk7XG5cbiAgICAvLyBvdXRwdXQgaW5pdGlhbCBzZXJpYWxpc2VkIGRhdGFcbiAgICB1cGRhdGVPdXRwdXQoJCgnI25lc3RhYmxlJykuZGF0YSgnb3V0cHV0JywgJCgnI25lc3RhYmxlLW91dHB1dCcpKSk7XG4gICAgdXBkYXRlT3V0cHV0KCQoJyNuZXN0YWJsZTInKS5kYXRhKCdvdXRwdXQnLCAkKCcjbmVzdGFibGUyLW91dHB1dCcpKSk7XG5cbiAgICAkKCcjbmVzdGFibGUtbWVudScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpXG4gICAge1xuICAgICAgICB2YXIgdGFyZ2V0ID0gJChlLnRhcmdldCksXG4gICAgICAgICAgICBhY3Rpb24gPSB0YXJnZXQuZGF0YSgnYWN0aW9uJyk7XG4gICAgICAgIGlmIChhY3Rpb24gPT09ICdleHBhbmQtYWxsJykge1xuICAgICAgICAgICAgJCgnLmRkJykubmVzdGFibGUoJ2V4cGFuZEFsbCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhY3Rpb24gPT09ICdjb2xsYXBzZS1hbGwnKSB7XG4gICAgICAgICAgICAkKCcuZGQnKS5uZXN0YWJsZSgnY29sbGFwc2VBbGwnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgJCgnI25lc3RhYmxlMycpLm5lc3RhYmxlKCk7XG4gICAgKi9cbn1cblxuZnVuY3Rpb24gaW5pdEFwcCgpIHtcbiAgICBzZWxlY3RpemUoKTtcbiAgICBkYXRlcGlja2VyKCk7XG4gICAgbWV0YUNvdW50ZXIoKTtcbiAgICBzZW9Dcm93bCgpO1xuICAgIGtleUNvbnRyb2xzKCk7XG4gICAgb25fbG9hZCgpO1xuICAgIGNwLmRyb3Bkb3duKCk7XG4gICAgY3AudGFibGVUb2dnbGVMaXN0KCk7XG4gICAgY3AuY2xlZGl0b3IoKTtcbiAgICBqc2NvbG9yLmluc3RhbGwoKTtcbn1cblxuJCh3aW5kb3cpLm9uKCdsb2FkJywgKCkgPT4ge1xuICAgIGluaXRBcHAoKTtcblxuICAgIC8vIFJhdmVuLmNvbnRleHQoZnVuY3Rpb24oKSB7XG4gICAgLy8gICAgIGluaXRBcHAoKTtcbiAgICAvLyB9KTtcbn0pOyJdfQ==
