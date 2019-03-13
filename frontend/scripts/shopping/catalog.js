const shopping = (function($) {

    function _getUrl() {
        const query = location.search.substr(1);
        const result = {};

        query.split("&").forEach(function(part) {
            const item = part.split("=");
            result[item[0]] = encodeURI(unescape(unescape(item[1])));
        });

        return result;
    }

    function _setUrl(name, parameter) {
        const _url = _getUrl();

        _url[name] = parameter;

        return _url;
    }

    function _joinUrl(get) {
        const url = [];

        Object.keys(get).map(id => {
            if (get[id] !== 'undefined' && get[id] !== '') {
                url.push([id, get[id]].join('='));
            }
        });

        return url.join('&');
    }

    function _redirectUrl(get) {
        if (Object.keys(get).length) {
            let url = '';

            const ignore = [
                'page',
                'backuri'
            ];

            Object.keys(get).map(id => {
                if (ignore.indexOf(id) < 0 && get[id] !== 'undefined' && get[id] !== '') {
                    if (url !== '') {
                        url += '&'
                    }

                    url += [id, get[id]].join('=')
                }
            })

            location.href = '/' + ADMIN_DIR + '/shopping/catalog?' + url;

            // location.search = url
        }
    }

    return {

        tab (element, id)
        {
            $('.tabs__list__link').removeClass('tabs__list__link_current');
            $('.catalog-tabs__item').removeClass('current');

            $(element).addClass('tabs__list__link_current');
            $("#tab-"+id).addClass('current');
        },

        sort (name)
        {
            const _get = _getUrl();

            if (typeof _get.sort !== 'undefined') {
                let type = _get.sort.split('-')[1];
                type = (type === 'asc') ? 'desc' : 'asc';
                location.search = _joinUrl(_setUrl('sort', name + '-' + type));
            } else {
                location.search = _joinUrl(_setUrl('sort', name + '-asc'));
            }
        },

        search (name, value, bind, e)
        {
            if (bind) {
                if (e.keyCode == 13) {
                    _redirectUrl(_setUrl(name, value));
                }
            } else {
                _redirectUrl(_setUrl(name, value));
            }
        },

        reload ()
        {
            const _get = _getUrl();

            if (typeof _get.page !== 'undefined')
            {
                const prev = (_get.page - 1) >= 0 ? (_get.page - 1) : '';

                if (prev) {
                    location.search = 'page='+prev;
                } else {
                    location.reload();
                }
            } else {
                location.reload();
            }
        },

        setLimit (section, element)
        {
            const limit = parseInt(element.value);

            if (limit > 0)
            {
                const name = ['module', 'pages', section].join('_');

                $.removeCookie(name);
                $.cookie(name, limit, { expires: 30, path: '/' });

                setTimeout(() => {
                    location.reload();
                }, 50);
            }
        },

        generateMeta () {
            console.log('generate');
        },

        requestBalance ($input, data) {
            $.ajax({
                url: ['/', ADMIN_DIR, '/shopping/set/balance'].join(''),
                type: "post",
                data: data,
                dataType: 'JSON',
                success: function(response) {
                    $input.prop('disabled', data.disabled);

                    if (typeof(data.disabled) !== 'undefined' && !data.disabled) {
                        $input.focus();
                    }
                }
            });
        },

        inputBalance (id) {
            const $input = $(`#balance-${id}`);
            const value = $input.val();

            this.requestBalance($input, {
                id: id,
                value: value
            });
        },

        changeBalance (element) {
            const id = element.value;
            const $input = $(`#balance-${id}`);

            const value = $input.val();
            const disabled = element.checked;

            this.requestBalance($input, {
                id: id,
                value: value,
                disabled: (disabled ? 1 : 0)
            });
        },

        // function setModuleSort(obj, module_id, field)
        // {
        //     cn = "moduleSort";
        //     value = $(obj).val();
        //     var cv = getCookie(cn);
        //     if (cv)
        //     {
        //         var arr = new Array();
        //         tmp = unserialize(cv);

        //         if (tmp[module_id] == undefined){
        //             var arr = new Array();
        //             arr[field] = value;
        //             tmp[module_id] = arr;
        //         }
        //         else{
        //             if (tmp[module_id][field] == undefined){
        //                 tmp[module_id][field] = value;
        //             }
        //             else{
        //                 tmp[module_id][field] = value;
        //             }
        //         }

        //         setCookie(cn,serialize(tmp));
        //     }
        //     else
        //     {
        //         var arr = new Array();
        //         var tmp = new Array();
        //         tmp[field] = value;
        //         arr[module_id] = tmp;
        //         setCookie(cn,serialize(arr));
        //     }
        //     location.href = location.href;
        // }

        update (e, name, id)
        {
            const value = Number(e.target.checked);

            $.ajax({
                url: ['/', ADMIN_DIR, '/shopping/update'].join(''),
                type: "post",
                data: {
                    id: id,
                    name: name,
                    value: value
                },
                dataType: 'JSON',
                success: function(response)
                {
                    console.log('update');
                }
            });
        },

        checkByName (element)
        {
            const name = $(element).val();
            const checked = $(element).prop('checked');

            $(`.check-all-spy[name="${name}"]`).prop('checked', checked);
        },

        checkAll (element)
        {
            const checked = $(element).prop('checked');
            $('.check-all-spy').prop('checked', checked);

            if (checked) {
                $('#remove-button').addClass('enable');
            } else {
                $('#remove-button').removeClass('enable');
            }
        },

        checkItem (element)
        {
            if ($('.check-all-spy:checked').length) {
                $('#remove-button').addClass('enable');
            } else {
                $('#remove-button').removeClass('enable');
            }
        },

        deleteManufacturer (e, id) {
            e.preventDefault();

            if (cp.dialog('Вы действительно хотите удалить производителя?')) {
                $.ajax({
                    url: ['/', ADMIN_DIR, '/shopping/manufacturer/del/', id].join(''),
                    type: "get",
                    dataType: 'JSON',
                    success: function()
                    {
                        $('#module-table').find('.module-table__row[data-id="'+id+'"]').remove();
                        cp.notify('Производитель удален', 'info');
                    }
                });
            }
        },

        deleteProduct (e, id) {
            e.preventDefault();

            if (cp.dialog('Вы действительно хотите удалить товар?')) {
                this.deleteItem(id, true);
            }
        },

        deleteItem (id, notify)
        {
            $.ajax({
                url: ['/', ADMIN_DIR, '/shopping/catalog/del/', id].join(''),
                type: "get",
                dataType: 'JSON',
                success: function()
                {
                    $('#module-table').find('.module-table__row[data-id="'+id+'"]').remove();

                    if (notify) {
                        cp.notify('Товар удален', 'info');
                    }
                }
            });
        },

        deleteAll (e)
        {
            e.preventDefault();

            const count = $('.check-all-spy:checked').length;
            const limit = $('.check-all-spy').length;

            if (count)
            {
                const _this = this;

                if (cp.dialog(['Вы действительно хотите удалить ', declOfNum(count, ['товар', 'товара', 'товаров']), '?'].join('')))
                {
                    $('.check-all-spy:checked').each((k, element) => {
                        _this.deleteItem(parseInt($(element).val()), false);

                        if ((k + 1) == count) {
                            cp.notify(['Удалено ', declOfNum(count, ['товар', 'товара', 'товаров'])].join(''), 'info');

                            setTimeout(() => {
                                if (count == limit) {
                                    _this.reload();
                                } else {
                                    location.reload();
                                }
                            }, 150);
                        }
                    });
                }
            }
        }
    }
}(jQuery));