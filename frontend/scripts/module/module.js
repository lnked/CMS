const Module = (function($) {

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

            Object.keys(get).map(id => {
                if (id !== 'page' && get[id] !== 'undefined' && get[id] !== '') {
                    if (url !== '') {
                        url += '&'
                    }

                    url += [id, get[id]].join('=')
                }
            })

            location.search = url
        }
    }

    return {

        changeFileName: function(id, title) {
            console.log('ed', id, title);

            if (typeof(id) !== 'undefined' && typeof(title) !== 'undefined')
            {
                const name = prompt('Введите новое имя', title);

                if (name !== '' && name !== title && name !== null) {
                    $.ajax({
                        url: `/${ADMIN_DIR}/meta/filename`,
                        type: 'POST',
                        data: {
                            id: id,
                            name: name
                        }
                    });

                    return name;
                }
            }

            return false;
        },

        ajaxFileDelete: function(id, obj) {
            if (cp.dialog("Вы дейсвительно хотите удалить файл?"))
            {
                $.ajax({
                    url: '/' + ADMIN_DIR + '/meta/filedelete',
                    type: "post",
                    data: {
                        id: id
                    },
                    dataType: 'JSON',
                    success: function(response)
                    {
                        console.log(response);

                        if (response.status === true)
                        {
                            $('#'+obj).remove();
                        }
                    }
                });
            }

            return false;
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

        setSort (element, id, field)
        {
            const name = ['module', 'sorted', id].join('_');
            const value = element.value;
            const cache = $.cookie(name);

            if (cache) {
                let sort = [];
                const temp = unserialize(cache);

                if (temp[id] == 'undefined') {
                    sort[id] = {};
                    sort[id][field] = value;
                } else {
                    if (temp[id][field] == 'undefined') {
                        temp[id][field] = value;
                    } else {
                        temp[id][field] = value;
                    }

                    sort = temp;
                }

                $.removeCookie(name);
                $.cookie(name, serialize(sort), { expires: 30, path: '/' });

            } else {
                const sort = [];

                sort[id] = {};
                sort[id][field] = value;

                $.cookie(name, serialize(sort), { expires: 30, path: '/' });
            }

            setTimeout(() => {
                location.reload();
            }, 50);
        },

        setLimit (element, id)
        {
            const name = ['module', 'limit', id].join('_');
            const limit = parseInt(element.value);

            $.removeCookie(name);
            $.cookie(name, limit, { expires: 30, path: '/' });

            setTimeout(() => {
                location.reload();
            }, 50);
        },

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

        deleteQuestion (e, element) {
            e.preventDefault();

            const isDelete = cp.dialog('Вы действительно хотите удалить позицию?');

            if (isDelete) {
                const _href = $(element).attr('href');

                $.post(_href, () => {
                    cp.notify('Позиция удалена', 'info');
                    $(element).closest('tr').remove();
                });
            }

            return false;
        },

        deleteItem (id, mid, notify) {
            $.ajax({
                url: `/${ADMIN_DIR}/meta/module/del/${mid}/${id}`,
                type: "post",
                data: {
                    id: id,
                    module: mid
                },
                dataType: 'JSON',
                success: function success() {
                    $('#module-table').find('.module-table__row[data-id="' + id + '"]').remove();

                    if (notify) {
                        cp.notify('Позиция удалена', 'info');
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

                if (cp.dialog(['Вы действительно хотите удалить ', declOfNum(count, ['позиция', 'позиций', 'позиции']), '?'].join('')))
                {
                    $('.check-all-spy:checked').each((k, element) => {
                        const mix = $(element).val();
                        const tmp = mix.split('_');

                        _this.deleteItem(parseInt(tmp[0]), parseInt(tmp[1]), false);

                        if ((k + 1) == count) {
                            cp.notify(['Удалено ', declOfNum(count, ['позиция', 'позиций', 'позиции'])].join(''), 'info');

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