const orders = (function($) {
    return {
        toggle (element, id, classname, button)
        {
            if ($(`#${id}`).length)
            {
                $(`#${id}`).toggleClass(classname);
            }

            if (typeof(button) === 'boolean' && button === true)
            {
                $(element).remove();
            }

            if (typeof(button) === 'object')
            {
                const status = $(`#${id}`).hasClass(classname) ? 0 : 1;

                $(element).text(button[status]);
            }
        },

        deleteItem (id, notify)
        {
            $.ajax({
                url: ['/', ADMIN_DIR, '/shopping/orders/del/', id].join(''),
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

                if (cp.dialog(['Вы действительно хотите удалить ', declOfNum(count, ['заказ', 'заказа', 'заказов']), '?'].join('')))
                {
                    $('.check-all-spy:checked').each((k, element) => {
                        _this.deleteItem(parseInt($(element).val()), false);

                        if ((k + 1) == count) {
                            cp.notify(['Удалено ', declOfNum(count, ['заказ', 'заказа', 'заказов'])].join(''), 'info');

                            setTimeout(() => {
                                if (count == limit) {
                                    shopping.reload();
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