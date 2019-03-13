(function(global) {
	'use strict';
	global.console = global.console || {};
	var con = global.console,
		prop, method,
		empty = {},
		dummy = function() {},
		properties = 'memory'.split(','),
		methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
	while (prop = properties.pop()) if (!con[prop]) con[prop] = empty;
	while (method = methods.pop()) if (!con[method]) con[method] = dummy;
})(typeof window === 'undefined' ? this : window);

!function() {
    function e(e, t) {
        var n = 'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;font-size: 14px;' + (e ? "font-weight: bold;" : "") + "color: " + t + ";";
        return n
    }
	
	if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
		console.log("%c♥ %c✰ %cCELEBRO.CMS %c✰ %c http://cms.celebro.ru %c♥", e(!0, "#f00"), e(!0, "#af55e2"), e(!0, "#777"), e(!0, "#af55e2"), e(!0, "#557de2"), e(!0, "#f00"));
	}
	else {
		console.log('celebro.cms http://cms.celebro.ru')
	}
}();