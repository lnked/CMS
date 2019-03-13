;(function($){
    $.fn.timeoutClass = function(classname, timeout) {
        timeout = timeout || 10;
        var that = this;
        setTimeout(function(){
            $(that).toggleClass(classname);
        }, timeout);
    };
})(jQuery);
