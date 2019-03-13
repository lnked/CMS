;( function( $ ){
	"use strict";

    $.fn.timeoutClass = function(classname, timeout) {
        timeout = timeout || 10;
        var that = this;
        setTimeout(function(){
            $(that).toggleClass(classname);
        }, timeout);
    };

	$.fn.extend({
		popover: function(options)
		{
			this.defaults = {};
			var settings = $.extend( {}, this.defaults, options ),
				isopen = false, scrollShift = 100, popover = {},
				$page = $('#page-wrapper'),
				onOpenScrollTop, $popover, $target;

			popover.position = function(target)
			{
				var left = 0, ww = $(window).width(), top = 0;

				if ($(target).hasClass('trigger-popover'))
				{
					$target = $(target);
				}
				else {
					$target = $(target).closest('.trigger-popover');
				}

				left = $target.offset().left + $target.width();
				top = $target.offset().top + $target.height() + 8;
				
				return { 'left': left, 'top': top };
			}

			popover.hide = function(callback)
			{
				if ($('.popover.open').length)
				{
					$popover = $('.popover.open');
					$popover.removeClass('animate');
				
					setTimeout(function(){
			  			$popover.removeClass('open');
			  			
			  			if (typeof(callback) == 'function')
			  			{
			  				callback.apply();
			  			}
			  		}, 250);
				}
				else
				{
					if (typeof(callback) == 'function')
		  			{
		  				callback.apply();
		  			}
				}
			}

			$page.on('click', function(e) {
				if ((isopen || $('.popover.open').length) && !$(e.target).closest('.trigger-popover').length && !$(e.target).closest('.popover').length)
				{
					popover.hide();
				}
		    });

			$(window).resize(function(){
				popover.hide();
			});

			$page.scroll(function(){
				if (isopen === true && (((onOpenScrollTop + scrollShift) < $page.scrollTop()) || ((onOpenScrollTop - scrollShift) > $page.scrollTop())))
				{
					popover.hide();
				}
			});

			return this.each(function() {
				$(this).on('click', function(e) {
					e.preventDefault();

					var block = $(this).data('popover'), $popover;
					
					isopen = true;

					popover.hide(function(){

						if ($('#popover-' + block).length == 0)
						{
							$popover = $(template('tpl_' + block, {}));
							$page.append($popover);
						}
						else
						{
							$popover = $('#popover-' + block);
						}

						if (!$('#popover-' + block).hasClass('open'))
						{
							onOpenScrollTop = $page.scrollTop();
							
							$popover.css(popover.position(e.target));
							$popover.toggleClass('open').timeoutClass('animate');
						}

					});
				});

			});
		}
	});
})( jQuery );