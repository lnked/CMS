'use strict';

/**
 * jscolor, JavaScript Color Picker
 *
 * @version 1.4.2
 * @license GNU Lesser General Public License, http://www.gnu.org/copyleft/lesser.html
 * @author  Jan Odvarko, http://odvarko.cz
 * @created 2008-06-15
 * @updated 2013-11-25
 * @link    http://jscolor.com
 */

var jscolor = {

	dir: '/' + ADMIN_DIR + '/images/jscolor/', // location of jscolor directory (leave empty to autodetect)
	bindClass: 'jscolor', // class name
	binding: true, // automatic binding via <input class="...">
	preloading: true, // use image preloading?

	install: function install() {
		this.init();
	},

	init: function init() {
		if (jscolor.binding) {
			jscolor.bind();
		}
		if (jscolor.preloading) {
			jscolor.preload();
		}
	},

	getDir: function getDir() {
		if (!jscolor.dir) {
			var detected = jscolor.detectDir();
			jscolor.dir = detected !== false ? detected : 'jscolor/';
		}
		return jscolor.dir;
	},

	detectDir: function detectDir() {
		var base = location.href;

		var e = document.getElementsByTagName('base');
		for (var i = 0; i < e.length; i += 1) {
			if (e[i].href) {
				base = e[i].href;
			}
		}

		var e = document.getElementsByTagName('script');
		for (var i = 0; i < e.length; i += 1) {
			if (e[i].src && /(^|\/)jscolor\.js([?#].*)?$/i.test(e[i].src)) {
				var src = new jscolor.URI(e[i].src);
				var srcAbs = src.toAbsolute(base);
				srcAbs.path = srcAbs.path.replace(/[^\/]+$/, ''); // remove filename
				srcAbs.query = null;
				srcAbs.fragment = null;
				return srcAbs.toString();
			}
		}
		return false;
	},

	bind: function bind() {
		var matchClass = new RegExp('(^|\\s)(' + jscolor.bindClass + ')\\s*(\\{[^}]*\\})?', 'i');
		var e = document.getElementsByTagName('input');
		for (var i = 0; i < e.length; i += 1) {
			var m;
			if (!e[i].color && e[i].className && (m = e[i].className.match(matchClass))) {
				var prop = {};
				if (m[3]) {
					try {
						prop = new Function('return (' + m[3] + ')')();
					} catch (eInvalidProp) {}
				}
				e[i].color = new jscolor.color(e[i], prop);
			}
		}
	},

	preload: function preload() {
		for (var fn in jscolor.imgRequire) {
			if (jscolor.imgRequire.hasOwnProperty(fn)) {
				jscolor.loadImage(fn);
			}
		}
	},

	images: {
		pad: [181, 101],
		sld: [16, 101],
		cross: [15, 15],
		arrow: [7, 11]
	},

	imgRequire: {},
	imgLoaded: {},

	requireImage: function requireImage(filename) {
		jscolor.imgRequire[filename] = true;
	},

	loadImage: function loadImage(filename) {
		if (!jscolor.imgLoaded[filename]) {
			jscolor.imgLoaded[filename] = new Image();
			jscolor.imgLoaded[filename].src = jscolor.getDir() + filename;
		}
	},

	fetchElement: function fetchElement(mixed) {
		return typeof mixed === 'string' ? document.getElementById(mixed) : mixed;
	},

	addEvent: function addEvent(el, evnt, func) {
		if (el.addEventListener) {
			el.addEventListener(evnt, func, false);
		} else if (el.attachEvent) {
			el.attachEvent('on' + evnt, func);
		}
	},

	fireEvent: function fireEvent(el, evnt) {
		if (!el) {
			return;
		}
		if (document.createEvent) {
			var ev = document.createEvent('HTMLEvents');
			ev.initEvent(evnt, true, true);
			el.dispatchEvent(ev);
		} else if (document.createEventObject) {
			var ev = document.createEventObject();
			el.fireEvent('on' + evnt, ev);
		} else if (el['on' + evnt]) {
			// alternatively use the traditional event model (IE5)
			el['on' + evnt]();
		}
	},

	getElementPos: function getElementPos(e) {
		var e1 = e,
		    e2 = e;
		var x = 0,
		    y = 0;
		if (e1.offsetParent) {
			do {
				x += e1.offsetLeft;
				y += e1.offsetTop;
			} while (e1 = e1.offsetParent);
		}
		while ((e2 = e2.parentNode) && e2.nodeName.toUpperCase() !== 'BODY') {
			x -= e2.scrollLeft;
			y -= e2.scrollTop;
		}
		return [x, y];
	},

	getElementSize: function getElementSize(e) {
		return [e.offsetWidth, e.offsetHeight];
	},

	getRelMousePos: function getRelMousePos(e) {
		var x = 0,
		    y = 0;
		if (!e) {
			e = window.event;
		}
		if (typeof e.offsetX === 'number') {
			x = e.offsetX;
			y = e.offsetY;
		} else if (typeof e.layerX === 'number') {
			x = e.layerX;
			y = e.layerY;
		}
		return { x: x, y: y };
	},

	getViewPos: function getViewPos() {
		if (typeof window.pageYOffset === 'number') {
			return [window.pageXOffset, window.pageYOffset];
		} else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
			return [document.body.scrollLeft, document.body.scrollTop];
		} else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
			return [document.documentElement.scrollLeft, document.documentElement.scrollTop];
		} else {
			return [0, 0];
		}
	},

	getViewSize: function getViewSize() {
		if (typeof window.innerWidth === 'number') {
			return [window.innerWidth, window.innerHeight];
		} else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
			return [document.body.clientWidth, document.body.clientHeight];
		} else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
			return [document.documentElement.clientWidth, document.documentElement.clientHeight];
		} else {
			return [0, 0];
		}
	},

	URI: function URI(uri) {
		// See RFC3986

		this.scheme = null;
		this.authority = null;
		this.path = '';
		this.query = null;
		this.fragment = null;

		this.parse = function (uri) {
			var m = uri.match(/^(([A-Za-z][0-9A-Za-z+.-]*)(:))?((\/\/)([^\/?#]*))?([^?#]*)((\?)([^#]*))?((#)(.*))?/);
			this.scheme = m[3] ? m[2] : null;
			this.authority = m[5] ? m[6] : null;
			this.path = m[7];
			this.query = m[9] ? m[10] : null;
			this.fragment = m[12] ? m[13] : null;
			return this;
		};

		this.toString = function () {
			var result = '';
			if (this.scheme !== null) {
				result = result + this.scheme + ':';
			}
			if (this.authority !== null) {
				result = result + '//' + this.authority;
			}
			if (this.path !== null) {
				result = result + this.path;
			}
			if (this.query !== null) {
				result = result + '?' + this.query;
			}
			if (this.fragment !== null) {
				result = result + '#' + this.fragment;
			}
			return result;
		};

		this.toAbsolute = function (base) {
			var base = new jscolor.URI(base);
			var r = this;
			var t = new jscolor.URI();

			if (base.scheme === null) {
				return false;
			}

			if (r.scheme !== null && r.scheme.toLowerCase() === base.scheme.toLowerCase()) {
				r.scheme = null;
			}

			if (r.scheme !== null) {
				t.scheme = r.scheme;
				t.authority = r.authority;
				t.path = removeDotSegments(r.path);
				t.query = r.query;
			} else {
				if (r.authority !== null) {
					t.authority = r.authority;
					t.path = removeDotSegments(r.path);
					t.query = r.query;
				} else {
					if (r.path === '') {
						t.path = base.path;
						if (r.query !== null) {
							t.query = r.query;
						} else {
							t.query = base.query;
						}
					} else {
						if (r.path.substr(0, 1) === '/') {
							t.path = removeDotSegments(r.path);
						} else {
							if (base.authority !== null && base.path === '') {
								t.path = '/' + r.path;
							} else {
								t.path = base.path.replace(/[^\/]+$/, '') + r.path;
							}
							t.path = removeDotSegments(t.path);
						}
						t.query = r.query;
					}
					t.authority = base.authority;
				}
				t.scheme = base.scheme;
			}
			t.fragment = r.fragment;

			return t;
		};

		function removeDotSegments(path) {
			var out = '';
			while (path) {
				if (path.substr(0, 3) === '../' || path.substr(0, 2) === './') {
					path = path.replace(/^\.+/, '').substr(1);
				} else if (path.substr(0, 3) === '/./' || path === '/.') {
					path = '/' + path.substr(3);
				} else if (path.substr(0, 4) === '/../' || path === '/..') {
					path = '/' + path.substr(4);
					out = out.replace(/\/?[^\/]*$/, '');
				} else if (path === '.' || path === '..') {
					path = '';
				} else {
					var rm = path.match(/^\/?[^\/]*/)[0];
					path = path.substr(rm.length);
					out = out + rm;
				}
			}
			return out;
		}

		if (uri) {
			this.parse(uri);
		}
	},

	//
	// Usage example:
	// var myColor = new jscolor.color(myInputElement)
	//

	color: function color(target, prop) {

		this.required = true; // refuse empty values?
		this.adjust = true; // adjust value to uniform notation?
		this.hash = false; // prefix color with # symbol?
		this.caps = true; // uppercase?
		this.slider = true; // show the value/saturation slider?
		this.valueElement = target; // value holder
		this.styleElement = target; // where to reflect current color
		this.onImmediateChange = null; // onchange callback (can be either string or function)
		this.hsv = [0, 0, 1]; // read-only  0-6, 0-1, 0-1
		this.rgb = [1, 1, 1]; // read-only  0-1, 0-1, 0-1
		this.minH = 0; // read-only  0-6
		this.maxH = 6; // read-only  0-6
		this.minS = 0; // read-only  0-1
		this.maxS = 1; // read-only  0-1
		this.minV = 0; // read-only  0-1
		this.maxV = 1; // read-only  0-1

		this.pickerOnfocus = true; // display picker on focus?
		this.pickerMode = 'HSV'; // HSV | HVS
		this.pickerPosition = 'bottom'; // left | right | top | bottom
		this.pickerSmartPosition = true; // automatically adjust picker position when necessary
		this.pickerButtonHeight = 20; // px
		this.pickerClosable = false;
		this.pickerCloseText = 'Close';
		this.pickerButtonColor = 'ButtonText'; // px
		this.pickerFace = 10; // px
		this.pickerFaceColor = 'ThreeDFace'; // CSS color
		this.pickerBorder = 1; // px
		this.pickerBorderColor = 'ThreeDHighlight ThreeDShadow ThreeDShadow ThreeDHighlight'; // CSS color
		this.pickerInset = 1; // px
		this.pickerInsetColor = 'ThreeDShadow ThreeDHighlight ThreeDHighlight ThreeDShadow'; // CSS color
		this.pickerZIndex = 10000;

		for (var p in prop) {
			if (prop.hasOwnProperty(p)) {
				this[p] = prop[p];
			}
		}

		this.hidePicker = function () {
			if (isPickerOwner()) {
				removePicker();
			}
		};

		this.showPicker = function () {
			if (!isPickerOwner()) {
				var tp = jscolor.getElementPos(target); // target pos
				var ts = jscolor.getElementSize(target); // target size
				var vp = jscolor.getViewPos(); // view pos
				var vs = jscolor.getViewSize(); // view size
				var ps = getPickerDims(this); // picker size
				var a, b, c;
				switch (this.pickerPosition.toLowerCase()) {
					case 'left':
						a = 1;b = 0;c = -1;break;
					case 'right':
						a = 1;b = 0;c = 1;break;
					case 'top':
						a = 0;b = 1;c = -1;break;
					default:
						a = 0;b = 1;c = 1;break;
				}
				var l = (ts[b] + ps[b]) / 2;

				// picker pos
				if (!this.pickerSmartPosition) {
					var pp = [tp[a], tp[b] + ts[b] - l + l * c];
				} else {
					var pp = [-vp[a] + tp[a] + ps[a] > vs[a] ? -vp[a] + tp[a] + ts[a] / 2 > vs[a] / 2 && tp[a] + ts[a] - ps[a] >= 0 ? tp[a] + ts[a] - ps[a] : tp[a] : tp[a], -vp[b] + tp[b] + ts[b] + ps[b] - l + l * c > vs[b] ? -vp[b] + tp[b] + ts[b] / 2 > vs[b] / 2 && tp[b] + ts[b] - l - l * c >= 0 ? tp[b] + ts[b] - l - l * c : tp[b] + ts[b] - l + l * c : tp[b] + ts[b] - l + l * c >= 0 ? tp[b] + ts[b] - l + l * c : tp[b] + ts[b] - l - l * c];
				}
				drawPicker(pp[a], pp[b]);
			}
		};

		this.importColor = function () {
			if (!valueElement) {
				this.exportColor();
			} else {
				if (!this.adjust) {
					if (!this.fromString(valueElement.value, leaveValue)) {
						styleElement.style.backgroundImage = styleElement.jscStyle.backgroundImage;
						styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor;
						styleElement.style.color = styleElement.jscStyle.color;
						this.exportColor(leaveValue | leaveStyle);
					}
				} else if (!this.required && /^\s*$/.test(valueElement.value)) {
					valueElement.value = '';
					styleElement.style.backgroundImage = styleElement.jscStyle.backgroundImage;
					styleElement.style.backgroundColor = styleElement.jscStyle.backgroundColor;
					styleElement.style.color = styleElement.jscStyle.color;
					this.exportColor(leaveValue | leaveStyle);
				} else if (this.fromString(valueElement.value)) {
					// OK
				} else {
					this.exportColor();
				}
			}
		};

		this.exportColor = function (flags) {
			if (!(flags & leaveValue) && valueElement) {
				var value = this.toString();
				if (this.caps) {
					value = value.toUpperCase();
				}
				if (this.hash) {
					value = '#' + value;
				}
				valueElement.value = value;
			}
			if (!(flags & leaveStyle) && styleElement) {
				styleElement.style.backgroundImage = "none";
				styleElement.style.backgroundColor = '#' + this.toString();
				styleElement.style.color = 0.213 * this.rgb[0] + 0.715 * this.rgb[1] + 0.072 * this.rgb[2] < 0.5 ? '#FFF' : '#000';
			}
			if (!(flags & leavePad) && isPickerOwner()) {
				redrawPad();
			}
			if (!(flags & leaveSld) && isPickerOwner()) {
				redrawSld();
			}
		};

		this.fromHSV = function (h, s, v, flags) {
			// null = don't change
			if (h !== null) {
				h = Math.max(0.0, this.minH, Math.min(6.0, this.maxH, h));
			}
			if (s !== null) {
				s = Math.max(0.0, this.minS, Math.min(1.0, this.maxS, s));
			}
			if (v !== null) {
				v = Math.max(0.0, this.minV, Math.min(1.0, this.maxV, v));
			}

			this.rgb = HSV_RGB(h === null ? this.hsv[0] : this.hsv[0] = h, s === null ? this.hsv[1] : this.hsv[1] = s, v === null ? this.hsv[2] : this.hsv[2] = v);

			this.exportColor(flags);
		};

		this.fromRGB = function (r, g, b, flags) {
			// null = don't change
			if (r !== null) {
				r = Math.max(0.0, Math.min(1.0, r));
			}
			if (g !== null) {
				g = Math.max(0.0, Math.min(1.0, g));
			}
			if (b !== null) {
				b = Math.max(0.0, Math.min(1.0, b));
			}

			var hsv = RGB_HSV(r === null ? this.rgb[0] : r, g === null ? this.rgb[1] : g, b === null ? this.rgb[2] : b);
			if (hsv[0] !== null) {
				this.hsv[0] = Math.max(0.0, this.minH, Math.min(6.0, this.maxH, hsv[0]));
			}
			if (hsv[2] !== 0) {
				this.hsv[1] = hsv[1] === null ? null : Math.max(0.0, this.minS, Math.min(1.0, this.maxS, hsv[1]));
			}
			this.hsv[2] = hsv[2] === null ? null : Math.max(0.0, this.minV, Math.min(1.0, this.maxV, hsv[2]));

			// update RGB according to final HSV, as some values might be trimmed
			var rgb = HSV_RGB(this.hsv[0], this.hsv[1], this.hsv[2]);
			this.rgb[0] = rgb[0];
			this.rgb[1] = rgb[1];
			this.rgb[2] = rgb[2];

			this.exportColor(flags);
		};

		this.fromString = function (hex, flags) {
			var m = hex.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i);
			if (!m) {
				return false;
			} else {
				if (m[1].length === 6) {
					// 6-char notation
					this.fromRGB(parseInt(m[1].substr(0, 2), 16) / 255, parseInt(m[1].substr(2, 2), 16) / 255, parseInt(m[1].substr(4, 2), 16) / 255, flags);
				} else {
					// 3-char notation
					this.fromRGB(parseInt(m[1].charAt(0) + m[1].charAt(0), 16) / 255, parseInt(m[1].charAt(1) + m[1].charAt(1), 16) / 255, parseInt(m[1].charAt(2) + m[1].charAt(2), 16) / 255, flags);
				}
				return true;
			}
		};

		this.toString = function () {
			return (0x100 | Math.round(255 * this.rgb[0])).toString(16).substr(1) + (0x100 | Math.round(255 * this.rgb[1])).toString(16).substr(1) + (0x100 | Math.round(255 * this.rgb[2])).toString(16).substr(1);
		};

		function RGB_HSV(r, g, b) {
			var n = Math.min(Math.min(r, g), b);
			var v = Math.max(Math.max(r, g), b);
			var m = v - n;
			if (m === 0) {
				return [null, 0, v];
			}
			var h = r === n ? 3 + (b - g) / m : g === n ? 5 + (r - b) / m : 1 + (g - r) / m;
			return [h === 6 ? 0 : h, m / v, v];
		}

		function HSV_RGB(h, s, v) {
			if (h === null) {
				return [v, v, v];
			}
			var i = Math.floor(h);
			var f = i % 2 ? h - i : 1 - (h - i);
			var m = v * (1 - s);
			var n = v * (1 - s * f);
			switch (i) {
				case 6:
				case 0:
					return [v, n, m];
				case 1:
					return [n, v, m];
				case 2:
					return [m, v, n];
				case 3:
					return [m, n, v];
				case 4:
					return [n, m, v];
				case 5:
					return [v, m, n];
			}
		}

		function removePicker() {
			jscolor.picker.owner.styleElement.parentNode.removeChild(jscolor.picker.boxB);
			delete jscolor.picker.owner;
		}

		function drawPicker(x, y) {
			if (!jscolor.picker) {
				jscolor.picker = {
					box: document.createElement('div'),
					boxB: document.createElement('div'),
					pad: document.createElement('div'),
					padB: document.createElement('div'),
					padM: document.createElement('div'),
					sld: document.createElement('div'),
					sldB: document.createElement('div'),
					sldM: document.createElement('div'),
					btn: document.createElement('div'),
					btnS: document.createElement('span'),
					btnT: document.createTextNode(THIS.pickerCloseText)
				};
				for (var i = 0, segSize = 4; i < jscolor.images.sld[1]; i += segSize) {
					var seg = document.createElement('div');
					seg.style.height = segSize + 'px';
					seg.style.fontSize = '1px';
					seg.style.lineHeight = '0';
					jscolor.picker.sld.appendChild(seg);
				}
				jscolor.picker.sldB.appendChild(jscolor.picker.sld);
				jscolor.picker.box.appendChild(jscolor.picker.sldB);
				jscolor.picker.box.appendChild(jscolor.picker.sldM);
				jscolor.picker.padB.appendChild(jscolor.picker.pad);
				jscolor.picker.box.appendChild(jscolor.picker.padB);
				jscolor.picker.box.appendChild(jscolor.picker.padM);
				jscolor.picker.btnS.appendChild(jscolor.picker.btnT);
				jscolor.picker.btn.appendChild(jscolor.picker.btnS);
				jscolor.picker.box.appendChild(jscolor.picker.btn);
				jscolor.picker.boxB.appendChild(jscolor.picker.box);
			}

			var p = jscolor.picker;

			// controls interaction
			p.box.onmouseup = p.box.onmouseout = function () {
				target.focus();
			};
			p.box.onmousedown = function () {
				abortBlur = true;
			};
			p.box.onmousemove = function (e) {
				if (holdPad || holdSld) {
					holdPad && setPad(e);
					holdSld && setSld(e);
					if (document.selection) {
						document.selection.empty();
					} else if (window.getSelection) {
						window.getSelection().removeAllRanges();
					}
					dispatchImmediateChange();
				}
			};
			if ('ontouchstart' in window) {
				// if touch device
				var handle_touchmove = function handle_touchmove(e) {
					var event = {
						'offsetX': e.touches[0].pageX - touchOffset.X,
						'offsetY': e.touches[0].pageY - touchOffset.Y
					};
					if (holdPad || holdSld) {
						holdPad && setPad(event);
						holdSld && setSld(event);
						dispatchImmediateChange();
					}
					e.stopPropagation(); // prevent move "view" on broswer
					e.preventDefault(); // prevent Default - Android Fix (else android generated only 1-2 touchmove events)
				};
				p.box.removeEventListener('touchmove', handle_touchmove, false);
				p.box.addEventListener('touchmove', handle_touchmove, false);
			}
			p.padM.onmouseup = p.padM.onmouseout = function () {
				if (holdPad) {
					holdPad = false;jscolor.fireEvent(valueElement, 'change');
				}
			};
			p.padM.onmousedown = function (e) {
				// if the slider is at the bottom, move it up
				switch (modeID) {
					case 0:
						if (THIS.hsv[2] === 0) {
							THIS.fromHSV(null, null, 1.0);
						};break;
					case 1:
						if (THIS.hsv[1] === 0) {
							THIS.fromHSV(null, 1.0, null);
						};break;
				}
				holdSld = false;
				holdPad = true;
				setPad(e);
				dispatchImmediateChange();
			};
			if ('ontouchstart' in window) {
				p.padM.addEventListener('touchstart', function (e) {
					touchOffset = {
						'X': e.target.offsetParent.offsetLeft,
						'Y': e.target.offsetParent.offsetTop
					};
					this.onmousedown({
						'offsetX': e.touches[0].pageX - touchOffset.X,
						'offsetY': e.touches[0].pageY - touchOffset.Y
					});
				});
			}
			p.sldM.onmouseup = p.sldM.onmouseout = function () {
				if (holdSld) {
					holdSld = false;jscolor.fireEvent(valueElement, 'change');
				}
			};
			p.sldM.onmousedown = function (e) {
				holdPad = false;
				holdSld = true;
				setSld(e);
				dispatchImmediateChange();
			};
			if ('ontouchstart' in window) {
				p.sldM.addEventListener('touchstart', function (e) {
					touchOffset = {
						'X': e.target.offsetParent.offsetLeft,
						'Y': e.target.offsetParent.offsetTop
					};
					this.onmousedown({
						'offsetX': e.touches[0].pageX - touchOffset.X,
						'offsetY': e.touches[0].pageY - touchOffset.Y
					});
				});
			}

			// picker
			var dims = getPickerDims(THIS);
			p.box.style.width = dims[0] + 'px';
			p.box.style.height = dims[1] + 'px';

			// picker border
			p.boxB.style.position = 'absolute';
			p.boxB.style.clear = 'both';
			p.boxB.style.left = '0px';
			p.boxB.style.top = '100%';
			p.boxB.style.marginTop = '2px';
			p.boxB.style.zIndex = THIS.pickerZIndex;
			p.boxB.style.border = THIS.pickerBorder + 'px solid';
			p.boxB.style.borderColor = THIS.pickerBorderColor;
			p.boxB.style.background = THIS.pickerFaceColor;

			// pad image
			p.pad.style.width = jscolor.images.pad[0] + 'px';
			p.pad.style.height = jscolor.images.pad[1] + 'px';

			// pad border
			p.padB.style.position = 'absolute';
			p.padB.style.left = THIS.pickerFace + 'px';
			p.padB.style.top = '10px';
			p.padB.style.border = THIS.pickerInset + 'px solid';
			p.padB.style.borderColor = THIS.pickerInsetColor;

			// pad mouse area
			p.padM.style.position = 'absolute';
			p.padM.style.left = '0';
			p.padM.style.top = '0';
			p.padM.style.width = THIS.pickerFace + 2 * THIS.pickerInset + jscolor.images.pad[0] + jscolor.images.arrow[0] + 'px';
			p.padM.style.height = p.box.style.height;
			p.padM.style.cursor = 'crosshair';

			// slider image
			p.sld.style.overflow = 'hidden';
			p.sld.style.width = jscolor.images.sld[0] + 'px';
			p.sld.style.height = jscolor.images.sld[1] + 'px';

			// slider border
			p.sldB.style.display = THIS.slider ? 'block' : 'none';
			p.sldB.style.position = 'absolute';
			p.sldB.style.right = THIS.pickerFace + 'px';
			p.sldB.style.top = THIS.pickerFace + 'px';
			p.sldB.style.border = THIS.pickerInset + 'px solid';
			p.sldB.style.borderColor = THIS.pickerInsetColor;

			// slider mouse area
			p.sldM.style.display = THIS.slider ? 'block' : 'none';
			p.sldM.style.position = 'absolute';
			p.sldM.style.right = '0';
			p.sldM.style.top = '0';
			p.sldM.style.width = jscolor.images.sld[0] + jscolor.images.arrow[0] + THIS.pickerFace + 2 * THIS.pickerInset + 'px';
			p.sldM.style.height = p.box.style.height;
			try {
				p.sldM.style.cursor = 'pointer';
			} catch (eOldIE) {
				p.sldM.style.cursor = 'hand';
			}

			// "close" button
			function setBtnBorder() {
				var insetColors = THIS.pickerInsetColor.split(/\s+/);
				var pickerOutsetColor = insetColors.length < 2 ? insetColors[0] : insetColors[1] + ' ' + insetColors[0] + ' ' + insetColors[0] + ' ' + insetColors[1];
				p.btn.style.borderColor = pickerOutsetColor;
			}
			p.btn.style.display = THIS.pickerClosable ? 'block' : 'none';
			p.btn.style.position = 'absolute';
			p.btn.style.left = THIS.pickerFace + 'px';
			p.btn.style.bottom = THIS.pickerFace + 'px';
			p.btn.style.padding = '0 15px';
			p.btn.style.height = '18px';
			p.btn.style.border = THIS.pickerInset + 'px solid';
			setBtnBorder();
			p.btn.style.color = THIS.pickerButtonColor;
			p.btn.style.font = '12px sans-serif';
			p.btn.style.textAlign = 'center';
			try {
				p.btn.style.cursor = 'pointer';
			} catch (eOldIE) {
				p.btn.style.cursor = 'hand';
			}
			p.btn.onmousedown = function () {
				THIS.hidePicker();
			};
			p.btnS.style.lineHeight = p.btn.style.height;

			// load images in optimal order
			switch (modeID) {
				case 0:
					var padImg = 'hs.png';break;
				case 1:
					var padImg = 'hv.png';break;
			}
			p.padM.style.backgroundImage = "url('" + jscolor.getDir() + "cross.gif')";
			p.padM.style.backgroundRepeat = "no-repeat";
			p.sldM.style.backgroundImage = "url('" + jscolor.getDir() + "arrow.gif')";
			p.sldM.style.backgroundRepeat = "no-repeat";
			p.pad.style.backgroundImage = "url('" + jscolor.getDir() + padImg + "')";
			p.pad.style.backgroundRepeat = "no-repeat";
			p.pad.style.backgroundPosition = "0 0";

			// place pointers
			redrawPad();
			redrawSld();

			jscolor.picker.owner = THIS;

			jscolor.picker.owner.styleElement.parentNode.appendChild(p.boxB);
			// document.getElementsByTagName('body')[0].appendChild(p.boxB);
		}

		function getPickerDims(o) {
			var dims = [2 * o.pickerInset + 2 * o.pickerFace + jscolor.images.pad[0] + (o.slider ? 2 * o.pickerInset + 2 * jscolor.images.arrow[0] + jscolor.images.sld[0] : 0), o.pickerClosable ? 4 * o.pickerInset + 3 * o.pickerFace + jscolor.images.pad[1] + o.pickerButtonHeight : 2 * o.pickerInset + 2 * o.pickerFace + jscolor.images.pad[1]];
			return dims;
		}

		function redrawPad() {
			// redraw the pad pointer
			switch (modeID) {
				case 0:
					var yComponent = 1;break;
				case 1:
					var yComponent = 2;break;
			}
			var x = Math.round(THIS.hsv[0] / 6 * (jscolor.images.pad[0] - 1));
			var y = Math.round((1 - THIS.hsv[yComponent]) * (jscolor.images.pad[1] - 1));
			jscolor.picker.padM.style.backgroundPosition = THIS.pickerFace + THIS.pickerInset + x - Math.floor(jscolor.images.cross[0] / 2) + 'px ' + (THIS.pickerFace + THIS.pickerInset + y - Math.floor(jscolor.images.cross[1] / 2)) + 'px';

			// redraw the slider image
			var seg = jscolor.picker.sld.childNodes;

			switch (modeID) {
				case 0:
					var rgb = HSV_RGB(THIS.hsv[0], THIS.hsv[1], 1);
					for (var i = 0; i < seg.length; i += 1) {
						seg[i].style.backgroundColor = 'rgb(' + rgb[0] * (1 - i / seg.length) * 100 + '%,' + rgb[1] * (1 - i / seg.length) * 100 + '%,' + rgb[2] * (1 - i / seg.length) * 100 + '%)';
					}
					break;
				case 1:
					var rgb,
					    s,
					    c = [THIS.hsv[2], 0, 0];
					var i = Math.floor(THIS.hsv[0]);
					var f = i % 2 ? THIS.hsv[0] - i : 1 - (THIS.hsv[0] - i);
					switch (i) {
						case 6:
						case 0:
							rgb = [0, 1, 2];break;
						case 1:
							rgb = [1, 0, 2];break;
						case 2:
							rgb = [2, 0, 1];break;
						case 3:
							rgb = [2, 1, 0];break;
						case 4:
							rgb = [1, 2, 0];break;
						case 5:
							rgb = [0, 2, 1];break;
					}
					for (var i = 0; i < seg.length; i += 1) {
						s = 1 - 1 / (seg.length - 1) * i;
						c[1] = c[0] * (1 - s * f);
						c[2] = c[0] * (1 - s);
						seg[i].style.backgroundColor = 'rgb(' + c[rgb[0]] * 100 + '%,' + c[rgb[1]] * 100 + '%,' + c[rgb[2]] * 100 + '%)';
					}
					break;
			}
		}

		function redrawSld() {
			// redraw the slider pointer
			switch (modeID) {
				case 0:
					var yComponent = 2;break;
				case 1:
					var yComponent = 1;break;
			}
			var y = Math.round((1 - THIS.hsv[yComponent]) * (jscolor.images.sld[1] - 1));
			jscolor.picker.sldM.style.backgroundPosition = '0 ' + (THIS.pickerFace + THIS.pickerInset + y - Math.floor(jscolor.images.arrow[1] / 2)) + 'px';
		}

		function isPickerOwner() {
			return jscolor.picker && jscolor.picker.owner === THIS;
		}

		function blurTarget() {
			if (valueElement === target) {
				THIS.importColor();
			}
			if (THIS.pickerOnfocus) {
				THIS.hidePicker();
			}
		}

		function blurValue() {
			if (valueElement !== target) {
				THIS.importColor();
			}
		}

		function setPad(e) {
			var mpos = jscolor.getRelMousePos(e);
			var x = mpos.x - THIS.pickerFace - THIS.pickerInset;
			var y = mpos.y - THIS.pickerFace - THIS.pickerInset;
			switch (modeID) {
				case 0:
					THIS.fromHSV(x * (6 / (jscolor.images.pad[0] - 1)), 1 - y / (jscolor.images.pad[1] - 1), null, leaveSld);break;
				case 1:
					THIS.fromHSV(x * (6 / (jscolor.images.pad[0] - 1)), null, 1 - y / (jscolor.images.pad[1] - 1), leaveSld);break;
			}
		}

		function setSld(e) {
			var mpos = jscolor.getRelMousePos(e);
			var y = mpos.y - THIS.pickerFace - THIS.pickerInset;
			switch (modeID) {
				case 0:
					THIS.fromHSV(null, null, 1 - y / (jscolor.images.sld[1] - 1), leavePad);break;
				case 1:
					THIS.fromHSV(null, 1 - y / (jscolor.images.sld[1] - 1), null, leavePad);break;
			}
		}

		function dispatchImmediateChange() {
			if (THIS.onImmediateChange) {
				var callback;
				if (typeof THIS.onImmediateChange === 'string') {
					callback = new Function(THIS.onImmediateChange);
				} else {
					callback = THIS.onImmediateChange;
				}
				callback.call(THIS);
			}
		}

		var THIS = this;
		var modeID = this.pickerMode.toLowerCase() === 'hvs' ? 1 : 0;
		var abortBlur = false;
		var valueElement = jscolor.fetchElement(this.valueElement),
		    styleElement = jscolor.fetchElement(this.styleElement);
		var holdPad = false,
		    holdSld = false,
		    touchOffset = {};
		var leaveValue = 1 << 0,
		    leaveStyle = 1 << 1,
		    leavePad = 1 << 2,
		    leaveSld = 1 << 3;

		// target
		jscolor.addEvent(target, 'focus', function () {
			if (THIS.pickerOnfocus) {
				THIS.showPicker();
			}
		});
		jscolor.addEvent(target, 'blur', function () {
			if (!abortBlur) {
				window.setTimeout(function () {
					abortBlur || blurTarget();abortBlur = false;
				}, 0);
			} else {
				abortBlur = false;
			}
		});

		// valueElement
		if (valueElement) {
			var updateField = function updateField() {
				THIS.fromString(valueElement.value, leaveValue);
				dispatchImmediateChange();
			};
			jscolor.addEvent(valueElement, 'keyup', updateField);
			jscolor.addEvent(valueElement, 'input', updateField);
			jscolor.addEvent(valueElement, 'blur', blurValue);
			valueElement.setAttribute('autocomplete', 'off');
		}

		// styleElement
		if (styleElement) {
			styleElement.jscStyle = {
				backgroundImage: styleElement.style.backgroundImage,
				backgroundColor: styleElement.style.backgroundColor,
				color: styleElement.style.color
			};
		}

		// require images
		switch (modeID) {
			case 0:
				jscolor.requireImage('hs.png');break;
			case 1:
				jscolor.requireImage('hv.png');break;
		}
		jscolor.requireImage('cross.gif');
		jscolor.requireImage('arrow.gif');

		this.importColor();
	}

};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9qc2NvbG9yLmpzIl0sIm5hbWVzIjpbImpzY29sb3IiLCJkaXIiLCJBRE1JTl9ESVIiLCJiaW5kQ2xhc3MiLCJiaW5kaW5nIiwicHJlbG9hZGluZyIsImluc3RhbGwiLCJpbml0IiwiYmluZCIsInByZWxvYWQiLCJnZXREaXIiLCJkZXRlY3RlZCIsImRldGVjdERpciIsImJhc2UiLCJsb2NhdGlvbiIsImhyZWYiLCJlIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImkiLCJsZW5ndGgiLCJzcmMiLCJ0ZXN0IiwiVVJJIiwic3JjQWJzIiwidG9BYnNvbHV0ZSIsInBhdGgiLCJyZXBsYWNlIiwicXVlcnkiLCJmcmFnbWVudCIsInRvU3RyaW5nIiwibWF0Y2hDbGFzcyIsIlJlZ0V4cCIsIm0iLCJjb2xvciIsImNsYXNzTmFtZSIsIm1hdGNoIiwicHJvcCIsIkZ1bmN0aW9uIiwiZUludmFsaWRQcm9wIiwiZm4iLCJpbWdSZXF1aXJlIiwiaGFzT3duUHJvcGVydHkiLCJsb2FkSW1hZ2UiLCJpbWFnZXMiLCJwYWQiLCJzbGQiLCJjcm9zcyIsImFycm93IiwiaW1nTG9hZGVkIiwicmVxdWlyZUltYWdlIiwiZmlsZW5hbWUiLCJJbWFnZSIsImZldGNoRWxlbWVudCIsIm1peGVkIiwiZ2V0RWxlbWVudEJ5SWQiLCJhZGRFdmVudCIsImVsIiwiZXZudCIsImZ1bmMiLCJhZGRFdmVudExpc3RlbmVyIiwiYXR0YWNoRXZlbnQiLCJmaXJlRXZlbnQiLCJjcmVhdGVFdmVudCIsImV2IiwiaW5pdEV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsImNyZWF0ZUV2ZW50T2JqZWN0IiwiZ2V0RWxlbWVudFBvcyIsImUxIiwiZTIiLCJ4IiwieSIsIm9mZnNldFBhcmVudCIsIm9mZnNldExlZnQiLCJvZmZzZXRUb3AiLCJwYXJlbnROb2RlIiwibm9kZU5hbWUiLCJ0b1VwcGVyQ2FzZSIsInNjcm9sbExlZnQiLCJzY3JvbGxUb3AiLCJnZXRFbGVtZW50U2l6ZSIsIm9mZnNldFdpZHRoIiwib2Zmc2V0SGVpZ2h0IiwiZ2V0UmVsTW91c2VQb3MiLCJ3aW5kb3ciLCJldmVudCIsIm9mZnNldFgiLCJvZmZzZXRZIiwibGF5ZXJYIiwibGF5ZXJZIiwiZ2V0Vmlld1BvcyIsInBhZ2VZT2Zmc2V0IiwicGFnZVhPZmZzZXQiLCJib2R5IiwiZG9jdW1lbnRFbGVtZW50IiwiZ2V0Vmlld1NpemUiLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJjbGllbnRXaWR0aCIsImNsaWVudEhlaWdodCIsInVyaSIsInNjaGVtZSIsImF1dGhvcml0eSIsInBhcnNlIiwicmVzdWx0IiwiciIsInQiLCJ0b0xvd2VyQ2FzZSIsInJlbW92ZURvdFNlZ21lbnRzIiwic3Vic3RyIiwib3V0Iiwicm0iLCJ0YXJnZXQiLCJyZXF1aXJlZCIsImFkanVzdCIsImhhc2giLCJjYXBzIiwic2xpZGVyIiwidmFsdWVFbGVtZW50Iiwic3R5bGVFbGVtZW50Iiwib25JbW1lZGlhdGVDaGFuZ2UiLCJoc3YiLCJyZ2IiLCJtaW5IIiwibWF4SCIsIm1pblMiLCJtYXhTIiwibWluViIsIm1heFYiLCJwaWNrZXJPbmZvY3VzIiwicGlja2VyTW9kZSIsInBpY2tlclBvc2l0aW9uIiwicGlja2VyU21hcnRQb3NpdGlvbiIsInBpY2tlckJ1dHRvbkhlaWdodCIsInBpY2tlckNsb3NhYmxlIiwicGlja2VyQ2xvc2VUZXh0IiwicGlja2VyQnV0dG9uQ29sb3IiLCJwaWNrZXJGYWNlIiwicGlja2VyRmFjZUNvbG9yIiwicGlja2VyQm9yZGVyIiwicGlja2VyQm9yZGVyQ29sb3IiLCJwaWNrZXJJbnNldCIsInBpY2tlckluc2V0Q29sb3IiLCJwaWNrZXJaSW5kZXgiLCJwIiwiaGlkZVBpY2tlciIsImlzUGlja2VyT3duZXIiLCJyZW1vdmVQaWNrZXIiLCJzaG93UGlja2VyIiwidHAiLCJ0cyIsInZwIiwidnMiLCJwcyIsImdldFBpY2tlckRpbXMiLCJhIiwiYiIsImMiLCJsIiwicHAiLCJkcmF3UGlja2VyIiwiaW1wb3J0Q29sb3IiLCJleHBvcnRDb2xvciIsImZyb21TdHJpbmciLCJ2YWx1ZSIsImxlYXZlVmFsdWUiLCJzdHlsZSIsImJhY2tncm91bmRJbWFnZSIsImpzY1N0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwibGVhdmVTdHlsZSIsImZsYWdzIiwibGVhdmVQYWQiLCJyZWRyYXdQYWQiLCJsZWF2ZVNsZCIsInJlZHJhd1NsZCIsImZyb21IU1YiLCJoIiwicyIsInYiLCJNYXRoIiwibWF4IiwibWluIiwiSFNWX1JHQiIsImZyb21SR0IiLCJnIiwiUkdCX0hTViIsImhleCIsInBhcnNlSW50IiwiY2hhckF0Iiwicm91bmQiLCJuIiwiZmxvb3IiLCJmIiwicGlja2VyIiwib3duZXIiLCJyZW1vdmVDaGlsZCIsImJveEIiLCJib3giLCJjcmVhdGVFbGVtZW50IiwicGFkQiIsInBhZE0iLCJzbGRCIiwic2xkTSIsImJ0biIsImJ0blMiLCJidG5UIiwiY3JlYXRlVGV4dE5vZGUiLCJUSElTIiwic2VnU2l6ZSIsInNlZyIsImhlaWdodCIsImZvbnRTaXplIiwibGluZUhlaWdodCIsImFwcGVuZENoaWxkIiwib25tb3VzZXVwIiwib25tb3VzZW91dCIsImZvY3VzIiwib25tb3VzZWRvd24iLCJhYm9ydEJsdXIiLCJvbm1vdXNlbW92ZSIsImhvbGRQYWQiLCJob2xkU2xkIiwic2V0UGFkIiwic2V0U2xkIiwic2VsZWN0aW9uIiwiZW1wdHkiLCJnZXRTZWxlY3Rpb24iLCJyZW1vdmVBbGxSYW5nZXMiLCJkaXNwYXRjaEltbWVkaWF0ZUNoYW5nZSIsImhhbmRsZV90b3VjaG1vdmUiLCJ0b3VjaGVzIiwicGFnZVgiLCJ0b3VjaE9mZnNldCIsIlgiLCJwYWdlWSIsIlkiLCJzdG9wUHJvcGFnYXRpb24iLCJwcmV2ZW50RGVmYXVsdCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJtb2RlSUQiLCJkaW1zIiwid2lkdGgiLCJwb3NpdGlvbiIsImNsZWFyIiwibGVmdCIsInRvcCIsIm1hcmdpblRvcCIsInpJbmRleCIsImJvcmRlciIsImJvcmRlckNvbG9yIiwiYmFja2dyb3VuZCIsImN1cnNvciIsIm92ZXJmbG93IiwiZGlzcGxheSIsInJpZ2h0IiwiZU9sZElFIiwic2V0QnRuQm9yZGVyIiwiaW5zZXRDb2xvcnMiLCJzcGxpdCIsInBpY2tlck91dHNldENvbG9yIiwiYm90dG9tIiwicGFkZGluZyIsImZvbnQiLCJ0ZXh0QWxpZ24iLCJwYWRJbWciLCJiYWNrZ3JvdW5kUmVwZWF0IiwiYmFja2dyb3VuZFBvc2l0aW9uIiwibyIsInlDb21wb25lbnQiLCJjaGlsZE5vZGVzIiwiYmx1clRhcmdldCIsImJsdXJWYWx1ZSIsIm1wb3MiLCJjYWxsYmFjayIsImNhbGwiLCJzZXRUaW1lb3V0IiwidXBkYXRlRmllbGQiLCJzZXRBdHRyaWJ1dGUiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7Ozs7O0FBV0EsSUFBSUEsVUFBVTs7QUFFYkMsWUFBVUMsU0FBVixxQkFGYSxFQUUwQjtBQUN2Q0MsWUFBWSxTQUhDLEVBR1U7QUFDdkJDLFVBQVUsSUFKRyxFQUlHO0FBQ2hCQyxhQUFhLElBTEEsRUFLTTs7QUFFbkJDLFVBQVUsbUJBQVc7QUFDcEIsT0FBS0MsSUFBTDtBQUNBLEVBVFk7O0FBV2JBLE9BQU8sZ0JBQVc7QUFDakIsTUFBR1AsUUFBUUksT0FBWCxFQUFvQjtBQUNuQkosV0FBUVEsSUFBUjtBQUNBO0FBQ0QsTUFBR1IsUUFBUUssVUFBWCxFQUF1QjtBQUN0QkwsV0FBUVMsT0FBUjtBQUNBO0FBQ0QsRUFsQlk7O0FBcUJiQyxTQUFTLGtCQUFXO0FBQ25CLE1BQUcsQ0FBQ1YsUUFBUUMsR0FBWixFQUFpQjtBQUNoQixPQUFJVSxXQUFXWCxRQUFRWSxTQUFSLEVBQWY7QUFDQVosV0FBUUMsR0FBUixHQUFjVSxhQUFXLEtBQVgsR0FBbUJBLFFBQW5CLEdBQThCLFVBQTVDO0FBQ0E7QUFDRCxTQUFPWCxRQUFRQyxHQUFmO0FBQ0EsRUEzQlk7O0FBOEJiVyxZQUFZLHFCQUFXO0FBQ3RCLE1BQUlDLE9BQU9DLFNBQVNDLElBQXBCOztBQUVBLE1BQUlDLElBQUlDLFNBQVNDLG9CQUFULENBQThCLE1BQTlCLENBQVI7QUFDQSxPQUFJLElBQUlDLElBQUUsQ0FBVixFQUFhQSxJQUFFSCxFQUFFSSxNQUFqQixFQUF5QkQsS0FBRyxDQUE1QixFQUErQjtBQUM5QixPQUFHSCxFQUFFRyxDQUFGLEVBQUtKLElBQVIsRUFBYztBQUFFRixXQUFPRyxFQUFFRyxDQUFGLEVBQUtKLElBQVo7QUFBbUI7QUFDbkM7O0FBRUQsTUFBSUMsSUFBSUMsU0FBU0Msb0JBQVQsQ0FBOEIsUUFBOUIsQ0FBUjtBQUNBLE9BQUksSUFBSUMsSUFBRSxDQUFWLEVBQWFBLElBQUVILEVBQUVJLE1BQWpCLEVBQXlCRCxLQUFHLENBQTVCLEVBQStCO0FBQzlCLE9BQUdILEVBQUVHLENBQUYsRUFBS0UsR0FBTCxJQUFZLCtCQUErQkMsSUFBL0IsQ0FBb0NOLEVBQUVHLENBQUYsRUFBS0UsR0FBekMsQ0FBZixFQUE4RDtBQUM3RCxRQUFJQSxNQUFNLElBQUlyQixRQUFRdUIsR0FBWixDQUFnQlAsRUFBRUcsQ0FBRixFQUFLRSxHQUFyQixDQUFWO0FBQ0EsUUFBSUcsU0FBU0gsSUFBSUksVUFBSixDQUFlWixJQUFmLENBQWI7QUFDQVcsV0FBT0UsSUFBUCxHQUFjRixPQUFPRSxJQUFQLENBQVlDLE9BQVosQ0FBb0IsU0FBcEIsRUFBK0IsRUFBL0IsQ0FBZCxDQUg2RCxDQUdYO0FBQ2xESCxXQUFPSSxLQUFQLEdBQWUsSUFBZjtBQUNBSixXQUFPSyxRQUFQLEdBQWtCLElBQWxCO0FBQ0EsV0FBT0wsT0FBT00sUUFBUCxFQUFQO0FBQ0E7QUFDRDtBQUNELFNBQU8sS0FBUDtBQUNBLEVBbERZOztBQXFEYnRCLE9BQU8sZ0JBQVc7QUFDakIsTUFBSXVCLGFBQWEsSUFBSUMsTUFBSixDQUFXLGFBQVdoQyxRQUFRRyxTQUFuQixHQUE2QixxQkFBeEMsRUFBK0QsR0FBL0QsQ0FBakI7QUFDQSxNQUFJYSxJQUFJQyxTQUFTQyxvQkFBVCxDQUE4QixPQUE5QixDQUFSO0FBQ0EsT0FBSSxJQUFJQyxJQUFFLENBQVYsRUFBYUEsSUFBRUgsRUFBRUksTUFBakIsRUFBeUJELEtBQUcsQ0FBNUIsRUFBK0I7QUFDOUIsT0FBSWMsQ0FBSjtBQUNBLE9BQUcsQ0FBQ2pCLEVBQUVHLENBQUYsRUFBS2UsS0FBTixJQUFlbEIsRUFBRUcsQ0FBRixFQUFLZ0IsU0FBcEIsS0FBa0NGLElBQUlqQixFQUFFRyxDQUFGLEVBQUtnQixTQUFMLENBQWVDLEtBQWYsQ0FBcUJMLFVBQXJCLENBQXRDLENBQUgsRUFBNEU7QUFDM0UsUUFBSU0sT0FBTyxFQUFYO0FBQ0EsUUFBR0osRUFBRSxDQUFGLENBQUgsRUFBUztBQUNSLFNBQUk7QUFDSEksYUFBUSxJQUFJQyxRQUFKLENBQWMsYUFBYUwsRUFBRSxDQUFGLENBQWIsR0FBb0IsR0FBbEMsQ0FBRCxFQUFQO0FBQ0EsTUFGRCxDQUVFLE9BQU1NLFlBQU4sRUFBb0IsQ0FBRTtBQUN4QjtBQUNEdkIsTUFBRUcsQ0FBRixFQUFLZSxLQUFMLEdBQWEsSUFBSWxDLFFBQVFrQyxLQUFaLENBQWtCbEIsRUFBRUcsQ0FBRixDQUFsQixFQUF3QmtCLElBQXhCLENBQWI7QUFDQTtBQUNEO0FBQ0QsRUFwRVk7O0FBdUViNUIsVUFBVSxtQkFBVztBQUNwQixPQUFJLElBQUkrQixFQUFSLElBQWN4QyxRQUFReUMsVUFBdEIsRUFBa0M7QUFDakMsT0FBR3pDLFFBQVF5QyxVQUFSLENBQW1CQyxjQUFuQixDQUFrQ0YsRUFBbEMsQ0FBSCxFQUEwQztBQUN6Q3hDLFlBQVEyQyxTQUFSLENBQWtCSCxFQUFsQjtBQUNBO0FBQ0Q7QUFDRCxFQTdFWTs7QUFnRmJJLFNBQVM7QUFDUkMsT0FBTSxDQUFFLEdBQUYsRUFBTyxHQUFQLENBREU7QUFFUkMsT0FBTSxDQUFFLEVBQUYsRUFBTSxHQUFOLENBRkU7QUFHUkMsU0FBUSxDQUFFLEVBQUYsRUFBTSxFQUFOLENBSEE7QUFJUkMsU0FBUSxDQUFFLENBQUYsRUFBSyxFQUFMO0FBSkEsRUFoRkk7O0FBd0ZiUCxhQUFhLEVBeEZBO0FBeUZiUSxZQUFZLEVBekZDOztBQTRGYkMsZUFBZSxzQkFBU0MsUUFBVCxFQUFtQjtBQUNqQ25ELFVBQVF5QyxVQUFSLENBQW1CVSxRQUFuQixJQUErQixJQUEvQjtBQUNBLEVBOUZZOztBQWlHYlIsWUFBWSxtQkFBU1EsUUFBVCxFQUFtQjtBQUM5QixNQUFHLENBQUNuRCxRQUFRaUQsU0FBUixDQUFrQkUsUUFBbEIsQ0FBSixFQUFpQztBQUNoQ25ELFdBQVFpRCxTQUFSLENBQWtCRSxRQUFsQixJQUE4QixJQUFJQyxLQUFKLEVBQTlCO0FBQ0FwRCxXQUFRaUQsU0FBUixDQUFrQkUsUUFBbEIsRUFBNEI5QixHQUE1QixHQUFrQ3JCLFFBQVFVLE1BQVIsS0FBaUJ5QyxRQUFuRDtBQUNBO0FBQ0QsRUF0R1k7O0FBeUdiRSxlQUFlLHNCQUFTQyxLQUFULEVBQWdCO0FBQzlCLFNBQU8sT0FBT0EsS0FBUCxLQUFpQixRQUFqQixHQUE0QnJDLFNBQVNzQyxjQUFULENBQXdCRCxLQUF4QixDQUE1QixHQUE2REEsS0FBcEU7QUFDQSxFQTNHWTs7QUE4R2JFLFdBQVcsa0JBQVNDLEVBQVQsRUFBYUMsSUFBYixFQUFtQkMsSUFBbkIsRUFBeUI7QUFDbkMsTUFBR0YsR0FBR0csZ0JBQU4sRUFBd0I7QUFDdkJILE1BQUdHLGdCQUFILENBQW9CRixJQUFwQixFQUEwQkMsSUFBMUIsRUFBZ0MsS0FBaEM7QUFDQSxHQUZELE1BRU8sSUFBR0YsR0FBR0ksV0FBTixFQUFtQjtBQUN6QkosTUFBR0ksV0FBSCxDQUFlLE9BQUtILElBQXBCLEVBQTBCQyxJQUExQjtBQUNBO0FBQ0QsRUFwSFk7O0FBdUhiRyxZQUFZLG1CQUFTTCxFQUFULEVBQWFDLElBQWIsRUFBbUI7QUFDOUIsTUFBRyxDQUFDRCxFQUFKLEVBQVE7QUFDUDtBQUNBO0FBQ0QsTUFBR3hDLFNBQVM4QyxXQUFaLEVBQXlCO0FBQ3hCLE9BQUlDLEtBQUsvQyxTQUFTOEMsV0FBVCxDQUFxQixZQUFyQixDQUFUO0FBQ0FDLE1BQUdDLFNBQUgsQ0FBYVAsSUFBYixFQUFtQixJQUFuQixFQUF5QixJQUF6QjtBQUNBRCxNQUFHUyxhQUFILENBQWlCRixFQUFqQjtBQUNBLEdBSkQsTUFJTyxJQUFHL0MsU0FBU2tELGlCQUFaLEVBQStCO0FBQ3JDLE9BQUlILEtBQUsvQyxTQUFTa0QsaUJBQVQsRUFBVDtBQUNBVixNQUFHSyxTQUFILENBQWEsT0FBS0osSUFBbEIsRUFBd0JNLEVBQXhCO0FBQ0EsR0FITSxNQUdBLElBQUdQLEdBQUcsT0FBS0MsSUFBUixDQUFILEVBQWtCO0FBQUU7QUFDMUJELE1BQUcsT0FBS0MsSUFBUjtBQUNBO0FBQ0QsRUFySVk7O0FBd0liVSxnQkFBZ0IsdUJBQVNwRCxDQUFULEVBQVk7QUFDM0IsTUFBSXFELEtBQUdyRCxDQUFQO0FBQUEsTUFBVXNELEtBQUd0RCxDQUFiO0FBQ0EsTUFBSXVELElBQUUsQ0FBTjtBQUFBLE1BQVNDLElBQUUsQ0FBWDtBQUNBLE1BQUdILEdBQUdJLFlBQU4sRUFBb0I7QUFDbkIsTUFBRztBQUNGRixTQUFLRixHQUFHSyxVQUFSO0FBQ0FGLFNBQUtILEdBQUdNLFNBQVI7QUFDQSxJQUhELFFBR1FOLEtBQUtBLEdBQUdJLFlBSGhCO0FBSUE7QUFDRCxTQUFNLENBQUNILEtBQUtBLEdBQUdNLFVBQVQsS0FBd0JOLEdBQUdPLFFBQUgsQ0FBWUMsV0FBWixPQUE4QixNQUE1RCxFQUFvRTtBQUNuRVAsUUFBS0QsR0FBR1MsVUFBUjtBQUNBUCxRQUFLRixHQUFHVSxTQUFSO0FBQ0E7QUFDRCxTQUFPLENBQUNULENBQUQsRUFBSUMsQ0FBSixDQUFQO0FBQ0EsRUF0Slk7O0FBeUpiUyxpQkFBaUIsd0JBQVNqRSxDQUFULEVBQVk7QUFDNUIsU0FBTyxDQUFDQSxFQUFFa0UsV0FBSCxFQUFnQmxFLEVBQUVtRSxZQUFsQixDQUFQO0FBQ0EsRUEzSlk7O0FBOEpiQyxpQkFBaUIsd0JBQVNwRSxDQUFULEVBQVk7QUFDNUIsTUFBSXVELElBQUksQ0FBUjtBQUFBLE1BQVdDLElBQUksQ0FBZjtBQUNBLE1BQUksQ0FBQ3hELENBQUwsRUFBUTtBQUFFQSxPQUFJcUUsT0FBT0MsS0FBWDtBQUFtQjtBQUM3QixNQUFJLE9BQU90RSxFQUFFdUUsT0FBVCxLQUFxQixRQUF6QixFQUFtQztBQUNsQ2hCLE9BQUl2RCxFQUFFdUUsT0FBTjtBQUNBZixPQUFJeEQsRUFBRXdFLE9BQU47QUFDQSxHQUhELE1BR08sSUFBSSxPQUFPeEUsRUFBRXlFLE1BQVQsS0FBb0IsUUFBeEIsRUFBa0M7QUFDeENsQixPQUFJdkQsRUFBRXlFLE1BQU47QUFDQWpCLE9BQUl4RCxFQUFFMEUsTUFBTjtBQUNBO0FBQ0QsU0FBTyxFQUFFbkIsR0FBR0EsQ0FBTCxFQUFRQyxHQUFHQSxDQUFYLEVBQVA7QUFDQSxFQXpLWTs7QUE0S2JtQixhQUFhLHNCQUFXO0FBQ3ZCLE1BQUcsT0FBT04sT0FBT08sV0FBZCxLQUE4QixRQUFqQyxFQUEyQztBQUMxQyxVQUFPLENBQUNQLE9BQU9RLFdBQVIsRUFBcUJSLE9BQU9PLFdBQTVCLENBQVA7QUFDQSxHQUZELE1BRU8sSUFBRzNFLFNBQVM2RSxJQUFULEtBQWtCN0UsU0FBUzZFLElBQVQsQ0FBY2YsVUFBZCxJQUE0QjlELFNBQVM2RSxJQUFULENBQWNkLFNBQTVELENBQUgsRUFBMkU7QUFDakYsVUFBTyxDQUFDL0QsU0FBUzZFLElBQVQsQ0FBY2YsVUFBZixFQUEyQjlELFNBQVM2RSxJQUFULENBQWNkLFNBQXpDLENBQVA7QUFDQSxHQUZNLE1BRUEsSUFBRy9ELFNBQVM4RSxlQUFULEtBQTZCOUUsU0FBUzhFLGVBQVQsQ0FBeUJoQixVQUF6QixJQUF1QzlELFNBQVM4RSxlQUFULENBQXlCZixTQUE3RixDQUFILEVBQTRHO0FBQ2xILFVBQU8sQ0FBQy9ELFNBQVM4RSxlQUFULENBQXlCaEIsVUFBMUIsRUFBc0M5RCxTQUFTOEUsZUFBVCxDQUF5QmYsU0FBL0QsQ0FBUDtBQUNBLEdBRk0sTUFFQTtBQUNOLFVBQU8sQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFQO0FBQ0E7QUFDRCxFQXRMWTs7QUF5TGJnQixjQUFjLHVCQUFXO0FBQ3hCLE1BQUcsT0FBT1gsT0FBT1ksVUFBZCxLQUE2QixRQUFoQyxFQUEwQztBQUN6QyxVQUFPLENBQUNaLE9BQU9ZLFVBQVIsRUFBb0JaLE9BQU9hLFdBQTNCLENBQVA7QUFDQSxHQUZELE1BRU8sSUFBR2pGLFNBQVM2RSxJQUFULEtBQWtCN0UsU0FBUzZFLElBQVQsQ0FBY0ssV0FBZCxJQUE2QmxGLFNBQVM2RSxJQUFULENBQWNNLFlBQTdELENBQUgsRUFBK0U7QUFDckYsVUFBTyxDQUFDbkYsU0FBUzZFLElBQVQsQ0FBY0ssV0FBZixFQUE0QmxGLFNBQVM2RSxJQUFULENBQWNNLFlBQTFDLENBQVA7QUFDQSxHQUZNLE1BRUEsSUFBR25GLFNBQVM4RSxlQUFULEtBQTZCOUUsU0FBUzhFLGVBQVQsQ0FBeUJJLFdBQXpCLElBQXdDbEYsU0FBUzhFLGVBQVQsQ0FBeUJLLFlBQTlGLENBQUgsRUFBZ0g7QUFDdEgsVUFBTyxDQUFDbkYsU0FBUzhFLGVBQVQsQ0FBeUJJLFdBQTFCLEVBQXVDbEYsU0FBUzhFLGVBQVQsQ0FBeUJLLFlBQWhFLENBQVA7QUFDQSxHQUZNLE1BRUE7QUFDTixVQUFPLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBUDtBQUNBO0FBQ0QsRUFuTVk7O0FBc01iN0UsTUFBTSxhQUFTOEUsR0FBVCxFQUFjO0FBQUU7O0FBRXJCLE9BQUtDLE1BQUwsR0FBYyxJQUFkO0FBQ0EsT0FBS0MsU0FBTCxHQUFpQixJQUFqQjtBQUNBLE9BQUs3RSxJQUFMLEdBQVksRUFBWjtBQUNBLE9BQUtFLEtBQUwsR0FBYSxJQUFiO0FBQ0EsT0FBS0MsUUFBTCxHQUFnQixJQUFoQjs7QUFFQSxPQUFLMkUsS0FBTCxHQUFhLFVBQVNILEdBQVQsRUFBYztBQUMxQixPQUFJcEUsSUFBSW9FLElBQUlqRSxLQUFKLENBQVUscUZBQVYsQ0FBUjtBQUNBLFFBQUtrRSxNQUFMLEdBQWNyRSxFQUFFLENBQUYsSUFBT0EsRUFBRSxDQUFGLENBQVAsR0FBYyxJQUE1QjtBQUNBLFFBQUtzRSxTQUFMLEdBQWlCdEUsRUFBRSxDQUFGLElBQU9BLEVBQUUsQ0FBRixDQUFQLEdBQWMsSUFBL0I7QUFDQSxRQUFLUCxJQUFMLEdBQVlPLEVBQUUsQ0FBRixDQUFaO0FBQ0EsUUFBS0wsS0FBTCxHQUFhSyxFQUFFLENBQUYsSUFBT0EsRUFBRSxFQUFGLENBQVAsR0FBZSxJQUE1QjtBQUNBLFFBQUtKLFFBQUwsR0FBZ0JJLEVBQUUsRUFBRixJQUFRQSxFQUFFLEVBQUYsQ0FBUixHQUFnQixJQUFoQztBQUNBLFVBQU8sSUFBUDtBQUNBLEdBUkQ7O0FBVUEsT0FBS0gsUUFBTCxHQUFnQixZQUFXO0FBQzFCLE9BQUkyRSxTQUFTLEVBQWI7QUFDQSxPQUFHLEtBQUtILE1BQUwsS0FBZ0IsSUFBbkIsRUFBeUI7QUFBRUcsYUFBU0EsU0FBUyxLQUFLSCxNQUFkLEdBQXVCLEdBQWhDO0FBQXNDO0FBQ2pFLE9BQUcsS0FBS0MsU0FBTCxLQUFtQixJQUF0QixFQUE0QjtBQUFFRSxhQUFTQSxTQUFTLElBQVQsR0FBZ0IsS0FBS0YsU0FBOUI7QUFBMEM7QUFDeEUsT0FBRyxLQUFLN0UsSUFBTCxLQUFjLElBQWpCLEVBQXVCO0FBQUUrRSxhQUFTQSxTQUFTLEtBQUsvRSxJQUF2QjtBQUE4QjtBQUN2RCxPQUFHLEtBQUtFLEtBQUwsS0FBZSxJQUFsQixFQUF3QjtBQUFFNkUsYUFBU0EsU0FBUyxHQUFULEdBQWUsS0FBSzdFLEtBQTdCO0FBQXFDO0FBQy9ELE9BQUcsS0FBS0MsUUFBTCxLQUFrQixJQUFyQixFQUEyQjtBQUFFNEUsYUFBU0EsU0FBUyxHQUFULEdBQWUsS0FBSzVFLFFBQTdCO0FBQXdDO0FBQ3JFLFVBQU80RSxNQUFQO0FBQ0EsR0FSRDs7QUFVQSxPQUFLaEYsVUFBTCxHQUFrQixVQUFTWixJQUFULEVBQWU7QUFDaEMsT0FBSUEsT0FBTyxJQUFJYixRQUFRdUIsR0FBWixDQUFnQlYsSUFBaEIsQ0FBWDtBQUNBLE9BQUk2RixJQUFJLElBQVI7QUFDQSxPQUFJQyxJQUFJLElBQUkzRyxRQUFRdUIsR0FBWixFQUFSOztBQUVBLE9BQUdWLEtBQUt5RixNQUFMLEtBQWdCLElBQW5CLEVBQXlCO0FBQUUsV0FBTyxLQUFQO0FBQWU7O0FBRTFDLE9BQUdJLEVBQUVKLE1BQUYsS0FBYSxJQUFiLElBQXFCSSxFQUFFSixNQUFGLENBQVNNLFdBQVQsT0FBMkIvRixLQUFLeUYsTUFBTCxDQUFZTSxXQUFaLEVBQW5ELEVBQThFO0FBQzdFRixNQUFFSixNQUFGLEdBQVcsSUFBWDtBQUNBOztBQUVELE9BQUdJLEVBQUVKLE1BQUYsS0FBYSxJQUFoQixFQUFzQjtBQUNyQkssTUFBRUwsTUFBRixHQUFXSSxFQUFFSixNQUFiO0FBQ0FLLE1BQUVKLFNBQUYsR0FBY0csRUFBRUgsU0FBaEI7QUFDQUksTUFBRWpGLElBQUYsR0FBU21GLGtCQUFrQkgsRUFBRWhGLElBQXBCLENBQVQ7QUFDQWlGLE1BQUUvRSxLQUFGLEdBQVU4RSxFQUFFOUUsS0FBWjtBQUNBLElBTEQsTUFLTztBQUNOLFFBQUc4RSxFQUFFSCxTQUFGLEtBQWdCLElBQW5CLEVBQXlCO0FBQ3hCSSxPQUFFSixTQUFGLEdBQWNHLEVBQUVILFNBQWhCO0FBQ0FJLE9BQUVqRixJQUFGLEdBQVNtRixrQkFBa0JILEVBQUVoRixJQUFwQixDQUFUO0FBQ0FpRixPQUFFL0UsS0FBRixHQUFVOEUsRUFBRTlFLEtBQVo7QUFDQSxLQUpELE1BSU87QUFDTixTQUFHOEUsRUFBRWhGLElBQUYsS0FBVyxFQUFkLEVBQWtCO0FBQ2pCaUYsUUFBRWpGLElBQUYsR0FBU2IsS0FBS2EsSUFBZDtBQUNBLFVBQUdnRixFQUFFOUUsS0FBRixLQUFZLElBQWYsRUFBcUI7QUFDcEIrRSxTQUFFL0UsS0FBRixHQUFVOEUsRUFBRTlFLEtBQVo7QUFDQSxPQUZELE1BRU87QUFDTitFLFNBQUUvRSxLQUFGLEdBQVVmLEtBQUtlLEtBQWY7QUFDQTtBQUNELE1BUEQsTUFPTztBQUNOLFVBQUc4RSxFQUFFaEYsSUFBRixDQUFPb0YsTUFBUCxDQUFjLENBQWQsRUFBZ0IsQ0FBaEIsTUFBdUIsR0FBMUIsRUFBK0I7QUFDOUJILFNBQUVqRixJQUFGLEdBQVNtRixrQkFBa0JILEVBQUVoRixJQUFwQixDQUFUO0FBQ0EsT0FGRCxNQUVPO0FBQ04sV0FBR2IsS0FBSzBGLFNBQUwsS0FBbUIsSUFBbkIsSUFBMkIxRixLQUFLYSxJQUFMLEtBQWMsRUFBNUMsRUFBZ0Q7QUFDL0NpRixVQUFFakYsSUFBRixHQUFTLE1BQUlnRixFQUFFaEYsSUFBZjtBQUNBLFFBRkQsTUFFTztBQUNOaUYsVUFBRWpGLElBQUYsR0FBU2IsS0FBS2EsSUFBTCxDQUFVQyxPQUFWLENBQWtCLFNBQWxCLEVBQTRCLEVBQTVCLElBQWdDK0UsRUFBRWhGLElBQTNDO0FBQ0E7QUFDRGlGLFNBQUVqRixJQUFGLEdBQVNtRixrQkFBa0JGLEVBQUVqRixJQUFwQixDQUFUO0FBQ0E7QUFDRGlGLFFBQUUvRSxLQUFGLEdBQVU4RSxFQUFFOUUsS0FBWjtBQUNBO0FBQ0QrRSxPQUFFSixTQUFGLEdBQWMxRixLQUFLMEYsU0FBbkI7QUFDQTtBQUNESSxNQUFFTCxNQUFGLEdBQVd6RixLQUFLeUYsTUFBaEI7QUFDQTtBQUNESyxLQUFFOUUsUUFBRixHQUFhNkUsRUFBRTdFLFFBQWY7O0FBRUEsVUFBTzhFLENBQVA7QUFDQSxHQWpERDs7QUFtREEsV0FBU0UsaUJBQVQsQ0FBMkJuRixJQUEzQixFQUFpQztBQUNoQyxPQUFJcUYsTUFBTSxFQUFWO0FBQ0EsVUFBTXJGLElBQU4sRUFBWTtBQUNYLFFBQUdBLEtBQUtvRixNQUFMLENBQVksQ0FBWixFQUFjLENBQWQsTUFBbUIsS0FBbkIsSUFBNEJwRixLQUFLb0YsTUFBTCxDQUFZLENBQVosRUFBYyxDQUFkLE1BQW1CLElBQWxELEVBQXdEO0FBQ3ZEcEYsWUFBT0EsS0FBS0MsT0FBTCxDQUFhLE1BQWIsRUFBb0IsRUFBcEIsRUFBd0JtRixNQUF4QixDQUErQixDQUEvQixDQUFQO0FBQ0EsS0FGRCxNQUVPLElBQUdwRixLQUFLb0YsTUFBTCxDQUFZLENBQVosRUFBYyxDQUFkLE1BQW1CLEtBQW5CLElBQTRCcEYsU0FBTyxJQUF0QyxFQUE0QztBQUNsREEsWUFBTyxNQUFJQSxLQUFLb0YsTUFBTCxDQUFZLENBQVosQ0FBWDtBQUNBLEtBRk0sTUFFQSxJQUFHcEYsS0FBS29GLE1BQUwsQ0FBWSxDQUFaLEVBQWMsQ0FBZCxNQUFtQixNQUFuQixJQUE2QnBGLFNBQU8sS0FBdkMsRUFBOEM7QUFDcERBLFlBQU8sTUFBSUEsS0FBS29GLE1BQUwsQ0FBWSxDQUFaLENBQVg7QUFDQUMsV0FBTUEsSUFBSXBGLE9BQUosQ0FBWSxZQUFaLEVBQTBCLEVBQTFCLENBQU47QUFDQSxLQUhNLE1BR0EsSUFBR0QsU0FBTyxHQUFQLElBQWNBLFNBQU8sSUFBeEIsRUFBOEI7QUFDcENBLFlBQU8sRUFBUDtBQUNBLEtBRk0sTUFFQTtBQUNOLFNBQUlzRixLQUFLdEYsS0FBS1UsS0FBTCxDQUFXLFlBQVgsRUFBeUIsQ0FBekIsQ0FBVDtBQUNBVixZQUFPQSxLQUFLb0YsTUFBTCxDQUFZRSxHQUFHNUYsTUFBZixDQUFQO0FBQ0EyRixXQUFNQSxNQUFNQyxFQUFaO0FBQ0E7QUFDRDtBQUNELFVBQU9ELEdBQVA7QUFDQTs7QUFFRCxNQUFHVixHQUFILEVBQVE7QUFDUCxRQUFLRyxLQUFMLENBQVdILEdBQVg7QUFDQTtBQUVELEVBOVNZOztBQWlUYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQW5FLFFBQVEsZUFBUytFLE1BQVQsRUFBaUI1RSxJQUFqQixFQUF1Qjs7QUFHOUIsT0FBSzZFLFFBQUwsR0FBZ0IsSUFBaEIsQ0FIOEIsQ0FHUjtBQUN0QixPQUFLQyxNQUFMLEdBQWMsSUFBZCxDQUo4QixDQUlWO0FBQ3BCLE9BQUtDLElBQUwsR0FBWSxLQUFaLENBTDhCLENBS1g7QUFDbkIsT0FBS0MsSUFBTCxHQUFZLElBQVosQ0FOOEIsQ0FNWjtBQUNsQixPQUFLQyxNQUFMLEdBQWMsSUFBZCxDQVA4QixDQU9WO0FBQ3BCLE9BQUtDLFlBQUwsR0FBb0JOLE1BQXBCLENBUjhCLENBUUY7QUFDNUIsT0FBS08sWUFBTCxHQUFvQlAsTUFBcEIsQ0FUOEIsQ0FTRjtBQUM1QixPQUFLUSxpQkFBTCxHQUF5QixJQUF6QixDQVY4QixDQVVDO0FBQy9CLE9BQUtDLEdBQUwsR0FBVyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxDQUFYLENBWDhCLENBV1I7QUFDdEIsT0FBS0MsR0FBTCxHQUFXLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBQVgsQ0FaOEIsQ0FZUjtBQUN0QixPQUFLQyxJQUFMLEdBQVksQ0FBWixDQWI4QixDQWFmO0FBQ2YsT0FBS0MsSUFBTCxHQUFZLENBQVosQ0FkOEIsQ0FjZjtBQUNmLE9BQUtDLElBQUwsR0FBWSxDQUFaLENBZjhCLENBZWY7QUFDZixPQUFLQyxJQUFMLEdBQVksQ0FBWixDQWhCOEIsQ0FnQmY7QUFDZixPQUFLQyxJQUFMLEdBQVksQ0FBWixDQWpCOEIsQ0FpQmY7QUFDZixPQUFLQyxJQUFMLEdBQVksQ0FBWixDQWxCOEIsQ0FrQmY7O0FBRWYsT0FBS0MsYUFBTCxHQUFxQixJQUFyQixDQXBCOEIsQ0FvQkg7QUFDM0IsT0FBS0MsVUFBTCxHQUFrQixLQUFsQixDQXJCOEIsQ0FxQkw7QUFDekIsT0FBS0MsY0FBTCxHQUFzQixRQUF0QixDQXRCOEIsQ0FzQkU7QUFDaEMsT0FBS0MsbUJBQUwsR0FBMkIsSUFBM0IsQ0F2QjhCLENBdUJHO0FBQ2pDLE9BQUtDLGtCQUFMLEdBQTBCLEVBQTFCLENBeEI4QixDQXdCQTtBQUM5QixPQUFLQyxjQUFMLEdBQXNCLEtBQXRCO0FBQ0EsT0FBS0MsZUFBTCxHQUF1QixPQUF2QjtBQUNBLE9BQUtDLGlCQUFMLEdBQXlCLFlBQXpCLENBM0I4QixDQTJCUztBQUN2QyxPQUFLQyxVQUFMLEdBQWtCLEVBQWxCLENBNUI4QixDQTRCUjtBQUN0QixPQUFLQyxlQUFMLEdBQXVCLFlBQXZCLENBN0I4QixDQTZCTztBQUNyQyxPQUFLQyxZQUFMLEdBQW9CLENBQXBCLENBOUI4QixDQThCUDtBQUN2QixPQUFLQyxpQkFBTCxHQUF5QiwyREFBekIsQ0EvQjhCLENBK0J3RDtBQUN0RixPQUFLQyxXQUFMLEdBQW1CLENBQW5CLENBaEM4QixDQWdDUjtBQUN0QixPQUFLQyxnQkFBTCxHQUF3QiwyREFBeEIsQ0FqQzhCLENBaUN1RDtBQUNyRixPQUFLQyxZQUFMLEdBQW9CLEtBQXBCOztBQUdBLE9BQUksSUFBSUMsQ0FBUixJQUFhNUcsSUFBYixFQUFtQjtBQUNsQixPQUFHQSxLQUFLSyxjQUFMLENBQW9CdUcsQ0FBcEIsQ0FBSCxFQUEyQjtBQUMxQixTQUFLQSxDQUFMLElBQVU1RyxLQUFLNEcsQ0FBTCxDQUFWO0FBQ0E7QUFDRDs7QUFHRCxPQUFLQyxVQUFMLEdBQWtCLFlBQVc7QUFDNUIsT0FBR0MsZUFBSCxFQUFvQjtBQUNuQkM7QUFDQTtBQUNELEdBSkQ7O0FBT0EsT0FBS0MsVUFBTCxHQUFrQixZQUFXO0FBQzVCLE9BQUcsQ0FBQ0YsZUFBSixFQUFxQjtBQUNwQixRQUFJRyxLQUFLdEosUUFBUW9FLGFBQVIsQ0FBc0I2QyxNQUF0QixDQUFULENBRG9CLENBQ29CO0FBQ3hDLFFBQUlzQyxLQUFLdkosUUFBUWlGLGNBQVIsQ0FBdUJnQyxNQUF2QixDQUFULENBRm9CLENBRXFCO0FBQ3pDLFFBQUl1QyxLQUFLeEosUUFBUTJGLFVBQVIsRUFBVCxDQUhvQixDQUdXO0FBQy9CLFFBQUk4RCxLQUFLekosUUFBUWdHLFdBQVIsRUFBVCxDQUpvQixDQUlZO0FBQ2hDLFFBQUkwRCxLQUFLQyxjQUFjLElBQWQsQ0FBVCxDQUxvQixDQUtVO0FBQzlCLFFBQUlDLENBQUosRUFBT0MsQ0FBUCxFQUFVQyxDQUFWO0FBQ0EsWUFBTyxLQUFLMUIsY0FBTCxDQUFvQnhCLFdBQXBCLEVBQVA7QUFDQyxVQUFLLE1BQUw7QUFBYWdELFVBQUUsQ0FBRixDQUFLQyxJQUFFLENBQUYsQ0FBS0MsSUFBRSxDQUFDLENBQUgsQ0FBTTtBQUM3QixVQUFLLE9BQUw7QUFBYUYsVUFBRSxDQUFGLENBQUtDLElBQUUsQ0FBRixDQUFLQyxJQUFFLENBQUYsQ0FBSztBQUM1QixVQUFLLEtBQUw7QUFBYUYsVUFBRSxDQUFGLENBQUtDLElBQUUsQ0FBRixDQUFLQyxJQUFFLENBQUMsQ0FBSCxDQUFNO0FBQzdCO0FBQWFGLFVBQUUsQ0FBRixDQUFLQyxJQUFFLENBQUYsQ0FBS0MsSUFBRSxDQUFGLENBQUs7QUFKN0I7QUFNQSxRQUFJQyxJQUFJLENBQUNSLEdBQUdNLENBQUgsSUFBTUgsR0FBR0csQ0FBSCxDQUFQLElBQWMsQ0FBdEI7O0FBRUE7QUFDQSxRQUFJLENBQUMsS0FBS3hCLG1CQUFWLEVBQStCO0FBQzlCLFNBQUkyQixLQUFLLENBQ1JWLEdBQUdNLENBQUgsQ0FEUSxFQUVSTixHQUFHTyxDQUFILElBQU1OLEdBQUdNLENBQUgsQ0FBTixHQUFZRSxDQUFaLEdBQWNBLElBQUVELENBRlIsQ0FBVDtBQUlBLEtBTEQsTUFLTztBQUNOLFNBQUlFLEtBQUssQ0FDUixDQUFDUixHQUFHSSxDQUFILENBQUQsR0FBT04sR0FBR00sQ0FBSCxDQUFQLEdBQWFGLEdBQUdFLENBQUgsQ0FBYixHQUFxQkgsR0FBR0csQ0FBSCxDQUFyQixHQUNFLENBQUNKLEdBQUdJLENBQUgsQ0FBRCxHQUFPTixHQUFHTSxDQUFILENBQVAsR0FBYUwsR0FBR0ssQ0FBSCxJQUFNLENBQW5CLEdBQXVCSCxHQUFHRyxDQUFILElBQU0sQ0FBN0IsSUFBa0NOLEdBQUdNLENBQUgsSUFBTUwsR0FBR0ssQ0FBSCxDQUFOLEdBQVlGLEdBQUdFLENBQUgsQ0FBWixJQUFxQixDQUF2RCxHQUEyRE4sR0FBR00sQ0FBSCxJQUFNTCxHQUFHSyxDQUFILENBQU4sR0FBWUYsR0FBR0UsQ0FBSCxDQUF2RSxHQUErRU4sR0FBR00sQ0FBSCxDQURqRixHQUVDTixHQUFHTSxDQUFILENBSE8sRUFJUixDQUFDSixHQUFHSyxDQUFILENBQUQsR0FBT1AsR0FBR08sQ0FBSCxDQUFQLEdBQWFOLEdBQUdNLENBQUgsQ0FBYixHQUFtQkgsR0FBR0csQ0FBSCxDQUFuQixHQUF5QkUsQ0FBekIsR0FBMkJBLElBQUVELENBQTdCLEdBQWlDTCxHQUFHSSxDQUFILENBQWpDLEdBQ0UsQ0FBQ0wsR0FBR0ssQ0FBSCxDQUFELEdBQU9QLEdBQUdPLENBQUgsQ0FBUCxHQUFhTixHQUFHTSxDQUFILElBQU0sQ0FBbkIsR0FBdUJKLEdBQUdJLENBQUgsSUFBTSxDQUE3QixJQUFrQ1AsR0FBR08sQ0FBSCxJQUFNTixHQUFHTSxDQUFILENBQU4sR0FBWUUsQ0FBWixHQUFjQSxJQUFFRCxDQUFoQixJQUFxQixDQUF2RCxHQUEyRFIsR0FBR08sQ0FBSCxJQUFNTixHQUFHTSxDQUFILENBQU4sR0FBWUUsQ0FBWixHQUFjQSxJQUFFRCxDQUEzRSxHQUErRVIsR0FBR08sQ0FBSCxJQUFNTixHQUFHTSxDQUFILENBQU4sR0FBWUUsQ0FBWixHQUFjQSxJQUFFRCxDQURqRyxHQUVFUixHQUFHTyxDQUFILElBQU1OLEdBQUdNLENBQUgsQ0FBTixHQUFZRSxDQUFaLEdBQWNBLElBQUVELENBQWhCLElBQXFCLENBQXJCLEdBQXlCUixHQUFHTyxDQUFILElBQU1OLEdBQUdNLENBQUgsQ0FBTixHQUFZRSxDQUFaLEdBQWNBLElBQUVELENBQXpDLEdBQTZDUixHQUFHTyxDQUFILElBQU1OLEdBQUdNLENBQUgsQ0FBTixHQUFZRSxDQUFaLEdBQWNBLElBQUVELENBTnZELENBQVQ7QUFRQTtBQUNERyxlQUFXRCxHQUFHSixDQUFILENBQVgsRUFBa0JJLEdBQUdILENBQUgsQ0FBbEI7QUFDQTtBQUNELEdBbENEOztBQXFDQSxPQUFLSyxXQUFMLEdBQW1CLFlBQVc7QUFDN0IsT0FBRyxDQUFDM0MsWUFBSixFQUFrQjtBQUNqQixTQUFLNEMsV0FBTDtBQUNBLElBRkQsTUFFTztBQUNOLFFBQUcsQ0FBQyxLQUFLaEQsTUFBVCxFQUFpQjtBQUNoQixTQUFHLENBQUMsS0FBS2lELFVBQUwsQ0FBZ0I3QyxhQUFhOEMsS0FBN0IsRUFBb0NDLFVBQXBDLENBQUosRUFBcUQ7QUFDcEQ5QyxtQkFBYStDLEtBQWIsQ0FBbUJDLGVBQW5CLEdBQXFDaEQsYUFBYWlELFFBQWIsQ0FBc0JELGVBQTNEO0FBQ0FoRCxtQkFBYStDLEtBQWIsQ0FBbUJHLGVBQW5CLEdBQXFDbEQsYUFBYWlELFFBQWIsQ0FBc0JDLGVBQTNEO0FBQ0FsRCxtQkFBYStDLEtBQWIsQ0FBbUJySSxLQUFuQixHQUEyQnNGLGFBQWFpRCxRQUFiLENBQXNCdkksS0FBakQ7QUFDQSxXQUFLaUksV0FBTCxDQUFpQkcsYUFBYUssVUFBOUI7QUFDQTtBQUNELEtBUEQsTUFPTyxJQUFHLENBQUMsS0FBS3pELFFBQU4sSUFBa0IsUUFBUTVGLElBQVIsQ0FBYWlHLGFBQWE4QyxLQUExQixDQUFyQixFQUF1RDtBQUM3RDlDLGtCQUFhOEMsS0FBYixHQUFxQixFQUFyQjtBQUNBN0Msa0JBQWErQyxLQUFiLENBQW1CQyxlQUFuQixHQUFxQ2hELGFBQWFpRCxRQUFiLENBQXNCRCxlQUEzRDtBQUNBaEQsa0JBQWErQyxLQUFiLENBQW1CRyxlQUFuQixHQUFxQ2xELGFBQWFpRCxRQUFiLENBQXNCQyxlQUEzRDtBQUNBbEQsa0JBQWErQyxLQUFiLENBQW1CckksS0FBbkIsR0FBMkJzRixhQUFhaUQsUUFBYixDQUFzQnZJLEtBQWpEO0FBQ0EsVUFBS2lJLFdBQUwsQ0FBaUJHLGFBQWFLLFVBQTlCO0FBRUEsS0FQTSxNQU9BLElBQUcsS0FBS1AsVUFBTCxDQUFnQjdDLGFBQWE4QyxLQUE3QixDQUFILEVBQXdDO0FBQzlDO0FBQ0EsS0FGTSxNQUVBO0FBQ04sVUFBS0YsV0FBTDtBQUNBO0FBQ0Q7QUFDRCxHQXhCRDs7QUEyQkEsT0FBS0EsV0FBTCxHQUFtQixVQUFTUyxLQUFULEVBQWdCO0FBQ2xDLE9BQUcsRUFBRUEsUUFBUU4sVUFBVixLQUF5Qi9DLFlBQTVCLEVBQTBDO0FBQ3pDLFFBQUk4QyxRQUFRLEtBQUt2SSxRQUFMLEVBQVo7QUFDQSxRQUFHLEtBQUt1RixJQUFSLEVBQWM7QUFBRWdELGFBQVFBLE1BQU12RixXQUFOLEVBQVI7QUFBOEI7QUFDOUMsUUFBRyxLQUFLc0MsSUFBUixFQUFjO0FBQUVpRCxhQUFRLE1BQUlBLEtBQVo7QUFBb0I7QUFDcEM5QyxpQkFBYThDLEtBQWIsR0FBcUJBLEtBQXJCO0FBQ0E7QUFDRCxPQUFHLEVBQUVPLFFBQVFELFVBQVYsS0FBeUJuRCxZQUE1QixFQUEwQztBQUN6Q0EsaUJBQWErQyxLQUFiLENBQW1CQyxlQUFuQixHQUFxQyxNQUFyQztBQUNBaEQsaUJBQWErQyxLQUFiLENBQW1CRyxlQUFuQixHQUNDLE1BQUksS0FBSzVJLFFBQUwsRUFETDtBQUVBMEYsaUJBQWErQyxLQUFiLENBQW1CckksS0FBbkIsR0FDQyxRQUFRLEtBQUt5RixHQUFMLENBQVMsQ0FBVCxDQUFSLEdBQ0EsUUFBUSxLQUFLQSxHQUFMLENBQVMsQ0FBVCxDQURSLEdBRUEsUUFBUSxLQUFLQSxHQUFMLENBQVMsQ0FBVCxDQUZSLEdBR0UsR0FIRixHQUdRLE1BSFIsR0FHaUIsTUFKbEI7QUFLQTtBQUNELE9BQUcsRUFBRWlELFFBQVFDLFFBQVYsS0FBdUIxQixlQUExQixFQUEyQztBQUMxQzJCO0FBQ0E7QUFDRCxPQUFHLEVBQUVGLFFBQVFHLFFBQVYsS0FBdUI1QixlQUExQixFQUEyQztBQUMxQzZCO0FBQ0E7QUFDRCxHQXZCRDs7QUEwQkEsT0FBS0MsT0FBTCxHQUFlLFVBQVNDLENBQVQsRUFBWUMsQ0FBWixFQUFlQyxDQUFmLEVBQWtCUixLQUFsQixFQUF5QjtBQUFFO0FBQ3pDLE9BQUdNLE1BQU0sSUFBVCxFQUFlO0FBQUVBLFFBQUlHLEtBQUtDLEdBQUwsQ0FBUyxHQUFULEVBQWMsS0FBSzFELElBQW5CLEVBQXlCeUQsS0FBS0UsR0FBTCxDQUFTLEdBQVQsRUFBYyxLQUFLMUQsSUFBbkIsRUFBeUJxRCxDQUF6QixDQUF6QixDQUFKO0FBQTREO0FBQzdFLE9BQUdDLE1BQU0sSUFBVCxFQUFlO0FBQUVBLFFBQUlFLEtBQUtDLEdBQUwsQ0FBUyxHQUFULEVBQWMsS0FBS3hELElBQW5CLEVBQXlCdUQsS0FBS0UsR0FBTCxDQUFTLEdBQVQsRUFBYyxLQUFLeEQsSUFBbkIsRUFBeUJvRCxDQUF6QixDQUF6QixDQUFKO0FBQTREO0FBQzdFLE9BQUdDLE1BQU0sSUFBVCxFQUFlO0FBQUVBLFFBQUlDLEtBQUtDLEdBQUwsQ0FBUyxHQUFULEVBQWMsS0FBS3RELElBQW5CLEVBQXlCcUQsS0FBS0UsR0FBTCxDQUFTLEdBQVQsRUFBYyxLQUFLdEQsSUFBbkIsRUFBeUJtRCxDQUF6QixDQUF6QixDQUFKO0FBQTREOztBQUU3RSxRQUFLekQsR0FBTCxHQUFXNkQsUUFDVk4sTUFBSSxJQUFKLEdBQVcsS0FBS3hELEdBQUwsQ0FBUyxDQUFULENBQVgsR0FBMEIsS0FBS0EsR0FBTCxDQUFTLENBQVQsSUFBWXdELENBRDVCLEVBRVZDLE1BQUksSUFBSixHQUFXLEtBQUt6RCxHQUFMLENBQVMsQ0FBVCxDQUFYLEdBQTBCLEtBQUtBLEdBQUwsQ0FBUyxDQUFULElBQVl5RCxDQUY1QixFQUdWQyxNQUFJLElBQUosR0FBVyxLQUFLMUQsR0FBTCxDQUFTLENBQVQsQ0FBWCxHQUEwQixLQUFLQSxHQUFMLENBQVMsQ0FBVCxJQUFZMEQsQ0FINUIsQ0FBWDs7QUFNQSxRQUFLakIsV0FBTCxDQUFpQlMsS0FBakI7QUFDQSxHQVpEOztBQWVBLE9BQUthLE9BQUwsR0FBZSxVQUFTL0UsQ0FBVCxFQUFZZ0YsQ0FBWixFQUFlN0IsQ0FBZixFQUFrQmUsS0FBbEIsRUFBeUI7QUFBRTtBQUN6QyxPQUFHbEUsTUFBTSxJQUFULEVBQWU7QUFBRUEsUUFBSTJFLEtBQUtDLEdBQUwsQ0FBUyxHQUFULEVBQWNELEtBQUtFLEdBQUwsQ0FBUyxHQUFULEVBQWM3RSxDQUFkLENBQWQsQ0FBSjtBQUFzQztBQUN2RCxPQUFHZ0YsTUFBTSxJQUFULEVBQWU7QUFBRUEsUUFBSUwsS0FBS0MsR0FBTCxDQUFTLEdBQVQsRUFBY0QsS0FBS0UsR0FBTCxDQUFTLEdBQVQsRUFBY0csQ0FBZCxDQUFkLENBQUo7QUFBc0M7QUFDdkQsT0FBRzdCLE1BQU0sSUFBVCxFQUFlO0FBQUVBLFFBQUl3QixLQUFLQyxHQUFMLENBQVMsR0FBVCxFQUFjRCxLQUFLRSxHQUFMLENBQVMsR0FBVCxFQUFjMUIsQ0FBZCxDQUFkLENBQUo7QUFBc0M7O0FBRXZELE9BQUluQyxNQUFNaUUsUUFDVGpGLE1BQUksSUFBSixHQUFXLEtBQUtpQixHQUFMLENBQVMsQ0FBVCxDQUFYLEdBQXlCakIsQ0FEaEIsRUFFVGdGLE1BQUksSUFBSixHQUFXLEtBQUsvRCxHQUFMLENBQVMsQ0FBVCxDQUFYLEdBQXlCK0QsQ0FGaEIsRUFHVDdCLE1BQUksSUFBSixHQUFXLEtBQUtsQyxHQUFMLENBQVMsQ0FBVCxDQUFYLEdBQXlCa0MsQ0FIaEIsQ0FBVjtBQUtBLE9BQUduQyxJQUFJLENBQUosTUFBVyxJQUFkLEVBQW9CO0FBQ25CLFNBQUtBLEdBQUwsQ0FBUyxDQUFULElBQWMyRCxLQUFLQyxHQUFMLENBQVMsR0FBVCxFQUFjLEtBQUsxRCxJQUFuQixFQUF5QnlELEtBQUtFLEdBQUwsQ0FBUyxHQUFULEVBQWMsS0FBSzFELElBQW5CLEVBQXlCSCxJQUFJLENBQUosQ0FBekIsQ0FBekIsQ0FBZDtBQUNBO0FBQ0QsT0FBR0EsSUFBSSxDQUFKLE1BQVcsQ0FBZCxFQUFpQjtBQUNoQixTQUFLQSxHQUFMLENBQVMsQ0FBVCxJQUFjQSxJQUFJLENBQUosTUFBUyxJQUFULEdBQWdCLElBQWhCLEdBQXVCMkQsS0FBS0MsR0FBTCxDQUFTLEdBQVQsRUFBYyxLQUFLeEQsSUFBbkIsRUFBeUJ1RCxLQUFLRSxHQUFMLENBQVMsR0FBVCxFQUFjLEtBQUt4RCxJQUFuQixFQUF5QkwsSUFBSSxDQUFKLENBQXpCLENBQXpCLENBQXJDO0FBQ0E7QUFDRCxRQUFLQSxHQUFMLENBQVMsQ0FBVCxJQUFjQSxJQUFJLENBQUosTUFBUyxJQUFULEdBQWdCLElBQWhCLEdBQXVCMkQsS0FBS0MsR0FBTCxDQUFTLEdBQVQsRUFBYyxLQUFLdEQsSUFBbkIsRUFBeUJxRCxLQUFLRSxHQUFMLENBQVMsR0FBVCxFQUFjLEtBQUt0RCxJQUFuQixFQUF5QlAsSUFBSSxDQUFKLENBQXpCLENBQXpCLENBQXJDOztBQUVBO0FBQ0EsT0FBSUMsTUFBTTZELFFBQVEsS0FBSzlELEdBQUwsQ0FBUyxDQUFULENBQVIsRUFBcUIsS0FBS0EsR0FBTCxDQUFTLENBQVQsQ0FBckIsRUFBa0MsS0FBS0EsR0FBTCxDQUFTLENBQVQsQ0FBbEMsQ0FBVjtBQUNBLFFBQUtDLEdBQUwsQ0FBUyxDQUFULElBQWNBLElBQUksQ0FBSixDQUFkO0FBQ0EsUUFBS0EsR0FBTCxDQUFTLENBQVQsSUFBY0EsSUFBSSxDQUFKLENBQWQ7QUFDQSxRQUFLQSxHQUFMLENBQVMsQ0FBVCxJQUFjQSxJQUFJLENBQUosQ0FBZDs7QUFFQSxRQUFLd0MsV0FBTCxDQUFpQlMsS0FBakI7QUFDQSxHQXpCRDs7QUE0QkEsT0FBS1IsVUFBTCxHQUFrQixVQUFTd0IsR0FBVCxFQUFjaEIsS0FBZCxFQUFxQjtBQUN0QyxPQUFJM0ksSUFBSTJKLElBQUl4SixLQUFKLENBQVUsc0NBQVYsQ0FBUjtBQUNBLE9BQUcsQ0FBQ0gsQ0FBSixFQUFPO0FBQ04sV0FBTyxLQUFQO0FBQ0EsSUFGRCxNQUVPO0FBQ04sUUFBR0EsRUFBRSxDQUFGLEVBQUtiLE1BQUwsS0FBZ0IsQ0FBbkIsRUFBc0I7QUFBRTtBQUN2QixVQUFLcUssT0FBTCxDQUNDSSxTQUFTNUosRUFBRSxDQUFGLEVBQUs2RSxNQUFMLENBQVksQ0FBWixFQUFjLENBQWQsQ0FBVCxFQUEwQixFQUExQixJQUFnQyxHQURqQyxFQUVDK0UsU0FBUzVKLEVBQUUsQ0FBRixFQUFLNkUsTUFBTCxDQUFZLENBQVosRUFBYyxDQUFkLENBQVQsRUFBMEIsRUFBMUIsSUFBZ0MsR0FGakMsRUFHQytFLFNBQVM1SixFQUFFLENBQUYsRUFBSzZFLE1BQUwsQ0FBWSxDQUFaLEVBQWMsQ0FBZCxDQUFULEVBQTBCLEVBQTFCLElBQWdDLEdBSGpDLEVBSUM4RCxLQUpEO0FBTUEsS0FQRCxNQU9PO0FBQUU7QUFDUixVQUFLYSxPQUFMLENBQ0NJLFNBQVM1SixFQUFFLENBQUYsRUFBSzZKLE1BQUwsQ0FBWSxDQUFaLElBQWU3SixFQUFFLENBQUYsRUFBSzZKLE1BQUwsQ0FBWSxDQUFaLENBQXhCLEVBQXVDLEVBQXZDLElBQTZDLEdBRDlDLEVBRUNELFNBQVM1SixFQUFFLENBQUYsRUFBSzZKLE1BQUwsQ0FBWSxDQUFaLElBQWU3SixFQUFFLENBQUYsRUFBSzZKLE1BQUwsQ0FBWSxDQUFaLENBQXhCLEVBQXVDLEVBQXZDLElBQTZDLEdBRjlDLEVBR0NELFNBQVM1SixFQUFFLENBQUYsRUFBSzZKLE1BQUwsQ0FBWSxDQUFaLElBQWU3SixFQUFFLENBQUYsRUFBSzZKLE1BQUwsQ0FBWSxDQUFaLENBQXhCLEVBQXVDLEVBQXZDLElBQTZDLEdBSDlDLEVBSUNsQixLQUpEO0FBTUE7QUFDRCxXQUFPLElBQVA7QUFDQTtBQUNELEdBdEJEOztBQXlCQSxPQUFLOUksUUFBTCxHQUFnQixZQUFXO0FBQzFCLFVBQ0MsQ0FBQyxRQUFRdUosS0FBS1UsS0FBTCxDQUFXLE1BQUksS0FBS3BFLEdBQUwsQ0FBUyxDQUFULENBQWYsQ0FBVCxFQUFzQzdGLFFBQXRDLENBQStDLEVBQS9DLEVBQW1EZ0YsTUFBbkQsQ0FBMEQsQ0FBMUQsSUFDQSxDQUFDLFFBQVF1RSxLQUFLVSxLQUFMLENBQVcsTUFBSSxLQUFLcEUsR0FBTCxDQUFTLENBQVQsQ0FBZixDQUFULEVBQXNDN0YsUUFBdEMsQ0FBK0MsRUFBL0MsRUFBbURnRixNQUFuRCxDQUEwRCxDQUExRCxDQURBLEdBRUEsQ0FBQyxRQUFRdUUsS0FBS1UsS0FBTCxDQUFXLE1BQUksS0FBS3BFLEdBQUwsQ0FBUyxDQUFULENBQWYsQ0FBVCxFQUFzQzdGLFFBQXRDLENBQStDLEVBQS9DLEVBQW1EZ0YsTUFBbkQsQ0FBMEQsQ0FBMUQsQ0FIRDtBQUtBLEdBTkQ7O0FBU0EsV0FBUzZFLE9BQVQsQ0FBaUJqRixDQUFqQixFQUFvQmdGLENBQXBCLEVBQXVCN0IsQ0FBdkIsRUFBMEI7QUFDekIsT0FBSW1DLElBQUlYLEtBQUtFLEdBQUwsQ0FBU0YsS0FBS0UsR0FBTCxDQUFTN0UsQ0FBVCxFQUFXZ0YsQ0FBWCxDQUFULEVBQXVCN0IsQ0FBdkIsQ0FBUjtBQUNBLE9BQUl1QixJQUFJQyxLQUFLQyxHQUFMLENBQVNELEtBQUtDLEdBQUwsQ0FBUzVFLENBQVQsRUFBV2dGLENBQVgsQ0FBVCxFQUF1QjdCLENBQXZCLENBQVI7QUFDQSxPQUFJNUgsSUFBSW1KLElBQUlZLENBQVo7QUFDQSxPQUFHL0osTUFBTSxDQUFULEVBQVk7QUFBRSxXQUFPLENBQUUsSUFBRixFQUFRLENBQVIsRUFBV21KLENBQVgsQ0FBUDtBQUF3QjtBQUN0QyxPQUFJRixJQUFJeEUsTUFBSXNGLENBQUosR0FBUSxJQUFFLENBQUNuQyxJQUFFNkIsQ0FBSCxJQUFNekosQ0FBaEIsR0FBcUJ5SixNQUFJTSxDQUFKLEdBQVEsSUFBRSxDQUFDdEYsSUFBRW1ELENBQUgsSUFBTTVILENBQWhCLEdBQW9CLElBQUUsQ0FBQ3lKLElBQUVoRixDQUFILElBQU16RSxDQUF6RDtBQUNBLFVBQU8sQ0FBRWlKLE1BQUksQ0FBSixHQUFNLENBQU4sR0FBUUEsQ0FBVixFQUFhakosSUFBRW1KLENBQWYsRUFBa0JBLENBQWxCLENBQVA7QUFDQTs7QUFHRCxXQUFTSSxPQUFULENBQWlCTixDQUFqQixFQUFvQkMsQ0FBcEIsRUFBdUJDLENBQXZCLEVBQTBCO0FBQ3pCLE9BQUdGLE1BQU0sSUFBVCxFQUFlO0FBQUUsV0FBTyxDQUFFRSxDQUFGLEVBQUtBLENBQUwsRUFBUUEsQ0FBUixDQUFQO0FBQXFCO0FBQ3RDLE9BQUlqSyxJQUFJa0ssS0FBS1ksS0FBTCxDQUFXZixDQUFYLENBQVI7QUFDQSxPQUFJZ0IsSUFBSS9LLElBQUUsQ0FBRixHQUFNK0osSUFBRS9KLENBQVIsR0FBWSxLQUFHK0osSUFBRS9KLENBQUwsQ0FBcEI7QUFDQSxPQUFJYyxJQUFJbUosS0FBSyxJQUFJRCxDQUFULENBQVI7QUFDQSxPQUFJYSxJQUFJWixLQUFLLElBQUlELElBQUVlLENBQVgsQ0FBUjtBQUNBLFdBQU8vSyxDQUFQO0FBQ0MsU0FBSyxDQUFMO0FBQ0EsU0FBSyxDQUFMO0FBQVEsWUFBTyxDQUFDaUssQ0FBRCxFQUFHWSxDQUFILEVBQUsvSixDQUFMLENBQVA7QUFDUixTQUFLLENBQUw7QUFBUSxZQUFPLENBQUMrSixDQUFELEVBQUdaLENBQUgsRUFBS25KLENBQUwsQ0FBUDtBQUNSLFNBQUssQ0FBTDtBQUFRLFlBQU8sQ0FBQ0EsQ0FBRCxFQUFHbUosQ0FBSCxFQUFLWSxDQUFMLENBQVA7QUFDUixTQUFLLENBQUw7QUFBUSxZQUFPLENBQUMvSixDQUFELEVBQUcrSixDQUFILEVBQUtaLENBQUwsQ0FBUDtBQUNSLFNBQUssQ0FBTDtBQUFRLFlBQU8sQ0FBQ1ksQ0FBRCxFQUFHL0osQ0FBSCxFQUFLbUosQ0FBTCxDQUFQO0FBQ1IsU0FBSyxDQUFMO0FBQVEsWUFBTyxDQUFDQSxDQUFELEVBQUduSixDQUFILEVBQUsrSixDQUFMLENBQVA7QUFQVDtBQVNBOztBQUdELFdBQVM1QyxZQUFULEdBQXdCO0FBQ3ZCcEosV0FBUW1NLE1BQVIsQ0FBZUMsS0FBZixDQUFxQjVFLFlBQXJCLENBQWtDNUMsVUFBbEMsQ0FBNkN5SCxXQUE3QyxDQUF5RHJNLFFBQVFtTSxNQUFSLENBQWVHLElBQXhFO0FBQ0EsVUFBT3RNLFFBQVFtTSxNQUFSLENBQWVDLEtBQXRCO0FBQ0E7O0FBR0QsV0FBU25DLFVBQVQsQ0FBb0IxRixDQUFwQixFQUF1QkMsQ0FBdkIsRUFBMEI7QUFDekIsT0FBRyxDQUFDeEUsUUFBUW1NLE1BQVosRUFBb0I7QUFDbkJuTSxZQUFRbU0sTUFBUixHQUFpQjtBQUNoQkksVUFBTXRMLFNBQVN1TCxhQUFULENBQXVCLEtBQXZCLENBRFU7QUFFaEJGLFdBQU9yTCxTQUFTdUwsYUFBVCxDQUF1QixLQUF2QixDQUZTO0FBR2hCM0osVUFBTTVCLFNBQVN1TCxhQUFULENBQXVCLEtBQXZCLENBSFU7QUFJaEJDLFdBQU94TCxTQUFTdUwsYUFBVCxDQUF1QixLQUF2QixDQUpTO0FBS2hCRSxXQUFPekwsU0FBU3VMLGFBQVQsQ0FBdUIsS0FBdkIsQ0FMUztBQU1oQjFKLFVBQU03QixTQUFTdUwsYUFBVCxDQUF1QixLQUF2QixDQU5VO0FBT2hCRyxXQUFPMUwsU0FBU3VMLGFBQVQsQ0FBdUIsS0FBdkIsQ0FQUztBQVFoQkksV0FBTzNMLFNBQVN1TCxhQUFULENBQXVCLEtBQXZCLENBUlM7QUFTaEJLLFVBQU01TCxTQUFTdUwsYUFBVCxDQUF1QixLQUF2QixDQVRVO0FBVWhCTSxXQUFPN0wsU0FBU3VMLGFBQVQsQ0FBdUIsTUFBdkIsQ0FWUztBQVdoQk8sV0FBTzlMLFNBQVMrTCxjQUFULENBQXdCQyxLQUFLekUsZUFBN0I7QUFYUyxLQUFqQjtBQWFBLFNBQUksSUFBSXJILElBQUUsQ0FBTixFQUFRK0wsVUFBUSxDQUFwQixFQUF1Qi9MLElBQUVuQixRQUFRNEMsTUFBUixDQUFlRSxHQUFmLENBQW1CLENBQW5CLENBQXpCLEVBQWdEM0IsS0FBRytMLE9BQW5ELEVBQTREO0FBQzNELFNBQUlDLE1BQU1sTSxTQUFTdUwsYUFBVCxDQUF1QixLQUF2QixDQUFWO0FBQ0FXLFNBQUk1QyxLQUFKLENBQVU2QyxNQUFWLEdBQW1CRixVQUFRLElBQTNCO0FBQ0FDLFNBQUk1QyxLQUFKLENBQVU4QyxRQUFWLEdBQXFCLEtBQXJCO0FBQ0FGLFNBQUk1QyxLQUFKLENBQVUrQyxVQUFWLEdBQXVCLEdBQXZCO0FBQ0F0TixhQUFRbU0sTUFBUixDQUFlckosR0FBZixDQUFtQnlLLFdBQW5CLENBQStCSixHQUEvQjtBQUNBO0FBQ0RuTixZQUFRbU0sTUFBUixDQUFlUSxJQUFmLENBQW9CWSxXQUFwQixDQUFnQ3ZOLFFBQVFtTSxNQUFSLENBQWVySixHQUEvQztBQUNBOUMsWUFBUW1NLE1BQVIsQ0FBZUksR0FBZixDQUFtQmdCLFdBQW5CLENBQStCdk4sUUFBUW1NLE1BQVIsQ0FBZVEsSUFBOUM7QUFDQTNNLFlBQVFtTSxNQUFSLENBQWVJLEdBQWYsQ0FBbUJnQixXQUFuQixDQUErQnZOLFFBQVFtTSxNQUFSLENBQWVTLElBQTlDO0FBQ0E1TSxZQUFRbU0sTUFBUixDQUFlTSxJQUFmLENBQW9CYyxXQUFwQixDQUFnQ3ZOLFFBQVFtTSxNQUFSLENBQWV0SixHQUEvQztBQUNBN0MsWUFBUW1NLE1BQVIsQ0FBZUksR0FBZixDQUFtQmdCLFdBQW5CLENBQStCdk4sUUFBUW1NLE1BQVIsQ0FBZU0sSUFBOUM7QUFDQXpNLFlBQVFtTSxNQUFSLENBQWVJLEdBQWYsQ0FBbUJnQixXQUFuQixDQUErQnZOLFFBQVFtTSxNQUFSLENBQWVPLElBQTlDO0FBQ0ExTSxZQUFRbU0sTUFBUixDQUFlVyxJQUFmLENBQW9CUyxXQUFwQixDQUFnQ3ZOLFFBQVFtTSxNQUFSLENBQWVZLElBQS9DO0FBQ0EvTSxZQUFRbU0sTUFBUixDQUFlVSxHQUFmLENBQW1CVSxXQUFuQixDQUErQnZOLFFBQVFtTSxNQUFSLENBQWVXLElBQTlDO0FBQ0E5TSxZQUFRbU0sTUFBUixDQUFlSSxHQUFmLENBQW1CZ0IsV0FBbkIsQ0FBK0J2TixRQUFRbU0sTUFBUixDQUFlVSxHQUE5QztBQUNBN00sWUFBUW1NLE1BQVIsQ0FBZUcsSUFBZixDQUFvQmlCLFdBQXBCLENBQWdDdk4sUUFBUW1NLE1BQVIsQ0FBZUksR0FBL0M7QUFDQTs7QUFFRCxPQUFJdEQsSUFBSWpKLFFBQVFtTSxNQUFoQjs7QUFFQTtBQUNBbEQsS0FBRXNELEdBQUYsQ0FBTWlCLFNBQU4sR0FDQXZFLEVBQUVzRCxHQUFGLENBQU1rQixVQUFOLEdBQW1CLFlBQVc7QUFBRXhHLFdBQU95RyxLQUFQO0FBQWlCLElBRGpEO0FBRUF6RSxLQUFFc0QsR0FBRixDQUFNb0IsV0FBTixHQUFvQixZQUFXO0FBQUVDLGdCQUFVLElBQVY7QUFBaUIsSUFBbEQ7QUFDQTNFLEtBQUVzRCxHQUFGLENBQU1zQixXQUFOLEdBQW9CLFVBQVM3TSxDQUFULEVBQVk7QUFDL0IsUUFBSThNLFdBQVdDLE9BQWYsRUFBd0I7QUFDdkJELGdCQUFXRSxPQUFPaE4sQ0FBUCxDQUFYO0FBQ0ErTSxnQkFBV0UsT0FBT2pOLENBQVAsQ0FBWDtBQUNBLFNBQUlDLFNBQVNpTixTQUFiLEVBQXdCO0FBQ3ZCak4sZUFBU2lOLFNBQVQsQ0FBbUJDLEtBQW5CO0FBQ0EsTUFGRCxNQUVPLElBQUk5SSxPQUFPK0ksWUFBWCxFQUF5QjtBQUMvQi9JLGFBQU8rSSxZQUFQLEdBQXNCQyxlQUF0QjtBQUNBO0FBQ0RDO0FBQ0E7QUFDRCxJQVhEO0FBWUEsT0FBRyxrQkFBa0JqSixNQUFyQixFQUE2QjtBQUFFO0FBQzlCLFFBQUlrSixtQkFBbUIsU0FBbkJBLGdCQUFtQixDQUFTdk4sQ0FBVCxFQUFZO0FBQ2xDLFNBQUlzRSxRQUFNO0FBQ1QsaUJBQVd0RSxFQUFFd04sT0FBRixDQUFVLENBQVYsRUFBYUMsS0FBYixHQUFtQkMsWUFBWUMsQ0FEakM7QUFFVCxpQkFBVzNOLEVBQUV3TixPQUFGLENBQVUsQ0FBVixFQUFhSSxLQUFiLEdBQW1CRixZQUFZRztBQUZqQyxNQUFWO0FBSUEsU0FBSWYsV0FBV0MsT0FBZixFQUF3QjtBQUN2QkQsaUJBQVdFLE9BQU8xSSxLQUFQLENBQVg7QUFDQXlJLGlCQUFXRSxPQUFPM0ksS0FBUCxDQUFYO0FBQ0FnSjtBQUNBO0FBQ0R0TixPQUFFOE4sZUFBRixHQVZrQyxDQVViO0FBQ3JCOU4sT0FBRStOLGNBQUYsR0FYa0MsQ0FXZDtBQUNwQixLQVpEO0FBYUE5RixNQUFFc0QsR0FBRixDQUFNeUMsbUJBQU4sQ0FBMEIsV0FBMUIsRUFBdUNULGdCQUF2QyxFQUF5RCxLQUF6RDtBQUNBdEYsTUFBRXNELEdBQUYsQ0FBTTNJLGdCQUFOLENBQXVCLFdBQXZCLEVBQW9DMkssZ0JBQXBDLEVBQXNELEtBQXREO0FBQ0E7QUFDRHRGLEtBQUV5RCxJQUFGLENBQU9jLFNBQVAsR0FDQXZFLEVBQUV5RCxJQUFGLENBQU9lLFVBQVAsR0FBb0IsWUFBVztBQUFFLFFBQUdLLE9BQUgsRUFBWTtBQUFFQSxlQUFRLEtBQVIsQ0FBZTlOLFFBQVE4RCxTQUFSLENBQWtCeUQsWUFBbEIsRUFBK0IsUUFBL0I7QUFBMkM7QUFBRSxJQUQzRztBQUVBMEIsS0FBRXlELElBQUYsQ0FBT2lCLFdBQVAsR0FBcUIsVUFBUzNNLENBQVQsRUFBWTtBQUNoQztBQUNBLFlBQU9pTyxNQUFQO0FBQ0MsVUFBSyxDQUFMO0FBQVEsVUFBSWhDLEtBQUt2RixHQUFMLENBQVMsQ0FBVCxNQUFnQixDQUFwQixFQUF1QjtBQUFFdUYsWUFBS2hDLE9BQUwsQ0FBYSxJQUFiLEVBQW1CLElBQW5CLEVBQXlCLEdBQXpCO0FBQWdDLFFBQUU7QUFDbkUsVUFBSyxDQUFMO0FBQVEsVUFBSWdDLEtBQUt2RixHQUFMLENBQVMsQ0FBVCxNQUFnQixDQUFwQixFQUF1QjtBQUFFdUYsWUFBS2hDLE9BQUwsQ0FBYSxJQUFiLEVBQW1CLEdBQW5CLEVBQXdCLElBQXhCO0FBQWdDLFFBQUU7QUFGcEU7QUFJQThDLGNBQVEsS0FBUjtBQUNBRCxjQUFRLElBQVI7QUFDQUUsV0FBT2hOLENBQVA7QUFDQXNOO0FBQ0EsSUFWRDtBQVdBLE9BQUcsa0JBQWtCakosTUFBckIsRUFBNkI7QUFDNUI0RCxNQUFFeUQsSUFBRixDQUFPOUksZ0JBQVAsQ0FBd0IsWUFBeEIsRUFBc0MsVUFBUzVDLENBQVQsRUFBWTtBQUNqRDBOLG1CQUFZO0FBQ1gsV0FBSzFOLEVBQUVpRyxNQUFGLENBQVN4QyxZQUFULENBQXNCQyxVQURoQjtBQUVYLFdBQUsxRCxFQUFFaUcsTUFBRixDQUFTeEMsWUFBVCxDQUFzQkU7QUFGaEIsTUFBWjtBQUlBLFVBQUtnSixXQUFMLENBQWlCO0FBQ2hCLGlCQUFVM00sRUFBRXdOLE9BQUYsQ0FBVSxDQUFWLEVBQWFDLEtBQWIsR0FBbUJDLFlBQVlDLENBRHpCO0FBRWhCLGlCQUFVM04sRUFBRXdOLE9BQUYsQ0FBVSxDQUFWLEVBQWFJLEtBQWIsR0FBbUJGLFlBQVlHO0FBRnpCLE1BQWpCO0FBSUEsS0FURDtBQVVBO0FBQ0Q1RixLQUFFMkQsSUFBRixDQUFPWSxTQUFQLEdBQ0F2RSxFQUFFMkQsSUFBRixDQUFPYSxVQUFQLEdBQW9CLFlBQVc7QUFBRSxRQUFHTSxPQUFILEVBQVk7QUFBRUEsZUFBUSxLQUFSLENBQWUvTixRQUFROEQsU0FBUixDQUFrQnlELFlBQWxCLEVBQStCLFFBQS9CO0FBQTJDO0FBQUUsSUFEM0c7QUFFQTBCLEtBQUUyRCxJQUFGLENBQU9lLFdBQVAsR0FBcUIsVUFBUzNNLENBQVQsRUFBWTtBQUNoQzhNLGNBQVEsS0FBUjtBQUNBQyxjQUFRLElBQVI7QUFDQUUsV0FBT2pOLENBQVA7QUFDQXNOO0FBQ0EsSUFMRDtBQU1BLE9BQUcsa0JBQWtCakosTUFBckIsRUFBNkI7QUFDNUI0RCxNQUFFMkQsSUFBRixDQUFPaEosZ0JBQVAsQ0FBd0IsWUFBeEIsRUFBc0MsVUFBUzVDLENBQVQsRUFBWTtBQUNqRDBOLG1CQUFZO0FBQ1gsV0FBSzFOLEVBQUVpRyxNQUFGLENBQVN4QyxZQUFULENBQXNCQyxVQURoQjtBQUVYLFdBQUsxRCxFQUFFaUcsTUFBRixDQUFTeEMsWUFBVCxDQUFzQkU7QUFGaEIsTUFBWjtBQUlBLFVBQUtnSixXQUFMLENBQWlCO0FBQ2hCLGlCQUFVM00sRUFBRXdOLE9BQUYsQ0FBVSxDQUFWLEVBQWFDLEtBQWIsR0FBbUJDLFlBQVlDLENBRHpCO0FBRWhCLGlCQUFVM04sRUFBRXdOLE9BQUYsQ0FBVSxDQUFWLEVBQWFJLEtBQWIsR0FBbUJGLFlBQVlHO0FBRnpCLE1BQWpCO0FBSUEsS0FURDtBQVVBOztBQUVEO0FBQ0EsT0FBSUssT0FBT3ZGLGNBQWNzRCxJQUFkLENBQVg7QUFDQWhFLEtBQUVzRCxHQUFGLENBQU1oQyxLQUFOLENBQVk0RSxLQUFaLEdBQW9CRCxLQUFLLENBQUwsSUFBVSxJQUE5QjtBQUNBakcsS0FBRXNELEdBQUYsQ0FBTWhDLEtBQU4sQ0FBWTZDLE1BQVosR0FBcUI4QixLQUFLLENBQUwsSUFBVSxJQUEvQjs7QUFFQTtBQUNBakcsS0FBRXFELElBQUYsQ0FBTy9CLEtBQVAsQ0FBYTZFLFFBQWIsR0FBd0IsVUFBeEI7QUFDQW5HLEtBQUVxRCxJQUFGLENBQU8vQixLQUFQLENBQWE4RSxLQUFiLEdBQXFCLE1BQXJCO0FBQ0FwRyxLQUFFcUQsSUFBRixDQUFPL0IsS0FBUCxDQUFhK0UsSUFBYixHQUFvQixLQUFwQjtBQUNBckcsS0FBRXFELElBQUYsQ0FBTy9CLEtBQVAsQ0FBYWdGLEdBQWIsR0FBbUIsTUFBbkI7QUFDQXRHLEtBQUVxRCxJQUFGLENBQU8vQixLQUFQLENBQWFpRixTQUFiLEdBQXlCLEtBQXpCO0FBQ0F2RyxLQUFFcUQsSUFBRixDQUFPL0IsS0FBUCxDQUFha0YsTUFBYixHQUFzQnhDLEtBQUtqRSxZQUEzQjtBQUNBQyxLQUFFcUQsSUFBRixDQUFPL0IsS0FBUCxDQUFhbUYsTUFBYixHQUFzQnpDLEtBQUtyRSxZQUFMLEdBQWtCLFVBQXhDO0FBQ0FLLEtBQUVxRCxJQUFGLENBQU8vQixLQUFQLENBQWFvRixXQUFiLEdBQTJCMUMsS0FBS3BFLGlCQUFoQztBQUNBSSxLQUFFcUQsSUFBRixDQUFPL0IsS0FBUCxDQUFhcUYsVUFBYixHQUEwQjNDLEtBQUt0RSxlQUEvQjs7QUFFQTtBQUNBTSxLQUFFcEcsR0FBRixDQUFNMEgsS0FBTixDQUFZNEUsS0FBWixHQUFvQm5QLFFBQVE0QyxNQUFSLENBQWVDLEdBQWYsQ0FBbUIsQ0FBbkIsSUFBc0IsSUFBMUM7QUFDQW9HLEtBQUVwRyxHQUFGLENBQU0wSCxLQUFOLENBQVk2QyxNQUFaLEdBQXFCcE4sUUFBUTRDLE1BQVIsQ0FBZUMsR0FBZixDQUFtQixDQUFuQixJQUFzQixJQUEzQzs7QUFFQTtBQUNBb0csS0FBRXdELElBQUYsQ0FBT2xDLEtBQVAsQ0FBYTZFLFFBQWIsR0FBd0IsVUFBeEI7QUFDQW5HLEtBQUV3RCxJQUFGLENBQU9sQyxLQUFQLENBQWErRSxJQUFiLEdBQW9CckMsS0FBS3ZFLFVBQUwsR0FBZ0IsSUFBcEM7QUFDQU8sS0FBRXdELElBQUYsQ0FBT2xDLEtBQVAsQ0FBYWdGLEdBQWIsR0FBbUIsTUFBbkI7QUFDQXRHLEtBQUV3RCxJQUFGLENBQU9sQyxLQUFQLENBQWFtRixNQUFiLEdBQXNCekMsS0FBS25FLFdBQUwsR0FBaUIsVUFBdkM7QUFDQUcsS0FBRXdELElBQUYsQ0FBT2xDLEtBQVAsQ0FBYW9GLFdBQWIsR0FBMkIxQyxLQUFLbEUsZ0JBQWhDOztBQUVBO0FBQ0FFLEtBQUV5RCxJQUFGLENBQU9uQyxLQUFQLENBQWE2RSxRQUFiLEdBQXdCLFVBQXhCO0FBQ0FuRyxLQUFFeUQsSUFBRixDQUFPbkMsS0FBUCxDQUFhK0UsSUFBYixHQUFvQixHQUFwQjtBQUNBckcsS0FBRXlELElBQUYsQ0FBT25DLEtBQVAsQ0FBYWdGLEdBQWIsR0FBbUIsR0FBbkI7QUFDQXRHLEtBQUV5RCxJQUFGLENBQU9uQyxLQUFQLENBQWE0RSxLQUFiLEdBQXFCbEMsS0FBS3ZFLFVBQUwsR0FBa0IsSUFBRXVFLEtBQUtuRSxXQUF6QixHQUF1QzlJLFFBQVE0QyxNQUFSLENBQWVDLEdBQWYsQ0FBbUIsQ0FBbkIsQ0FBdkMsR0FBK0Q3QyxRQUFRNEMsTUFBUixDQUFlSSxLQUFmLENBQXFCLENBQXJCLENBQS9ELEdBQXlGLElBQTlHO0FBQ0FpRyxLQUFFeUQsSUFBRixDQUFPbkMsS0FBUCxDQUFhNkMsTUFBYixHQUFzQm5FLEVBQUVzRCxHQUFGLENBQU1oQyxLQUFOLENBQVk2QyxNQUFsQztBQUNBbkUsS0FBRXlELElBQUYsQ0FBT25DLEtBQVAsQ0FBYXNGLE1BQWIsR0FBc0IsV0FBdEI7O0FBRUE7QUFDQTVHLEtBQUVuRyxHQUFGLENBQU15SCxLQUFOLENBQVl1RixRQUFaLEdBQXVCLFFBQXZCO0FBQ0E3RyxLQUFFbkcsR0FBRixDQUFNeUgsS0FBTixDQUFZNEUsS0FBWixHQUFvQm5QLFFBQVE0QyxNQUFSLENBQWVFLEdBQWYsQ0FBbUIsQ0FBbkIsSUFBc0IsSUFBMUM7QUFDQW1HLEtBQUVuRyxHQUFGLENBQU15SCxLQUFOLENBQVk2QyxNQUFaLEdBQXFCcE4sUUFBUTRDLE1BQVIsQ0FBZUUsR0FBZixDQUFtQixDQUFuQixJQUFzQixJQUEzQzs7QUFFQTtBQUNBbUcsS0FBRTBELElBQUYsQ0FBT3BDLEtBQVAsQ0FBYXdGLE9BQWIsR0FBdUI5QyxLQUFLM0YsTUFBTCxHQUFjLE9BQWQsR0FBd0IsTUFBL0M7QUFDQTJCLEtBQUUwRCxJQUFGLENBQU9wQyxLQUFQLENBQWE2RSxRQUFiLEdBQXdCLFVBQXhCO0FBQ0FuRyxLQUFFMEQsSUFBRixDQUFPcEMsS0FBUCxDQUFheUYsS0FBYixHQUFxQi9DLEtBQUt2RSxVQUFMLEdBQWdCLElBQXJDO0FBQ0FPLEtBQUUwRCxJQUFGLENBQU9wQyxLQUFQLENBQWFnRixHQUFiLEdBQW1CdEMsS0FBS3ZFLFVBQUwsR0FBZ0IsSUFBbkM7QUFDQU8sS0FBRTBELElBQUYsQ0FBT3BDLEtBQVAsQ0FBYW1GLE1BQWIsR0FBc0J6QyxLQUFLbkUsV0FBTCxHQUFpQixVQUF2QztBQUNBRyxLQUFFMEQsSUFBRixDQUFPcEMsS0FBUCxDQUFhb0YsV0FBYixHQUEyQjFDLEtBQUtsRSxnQkFBaEM7O0FBRUE7QUFDQUUsS0FBRTJELElBQUYsQ0FBT3JDLEtBQVAsQ0FBYXdGLE9BQWIsR0FBdUI5QyxLQUFLM0YsTUFBTCxHQUFjLE9BQWQsR0FBd0IsTUFBL0M7QUFDQTJCLEtBQUUyRCxJQUFGLENBQU9yQyxLQUFQLENBQWE2RSxRQUFiLEdBQXdCLFVBQXhCO0FBQ0FuRyxLQUFFMkQsSUFBRixDQUFPckMsS0FBUCxDQUFheUYsS0FBYixHQUFxQixHQUFyQjtBQUNBL0csS0FBRTJELElBQUYsQ0FBT3JDLEtBQVAsQ0FBYWdGLEdBQWIsR0FBbUIsR0FBbkI7QUFDQXRHLEtBQUUyRCxJQUFGLENBQU9yQyxLQUFQLENBQWE0RSxLQUFiLEdBQXFCblAsUUFBUTRDLE1BQVIsQ0FBZUUsR0FBZixDQUFtQixDQUFuQixJQUF3QjlDLFFBQVE0QyxNQUFSLENBQWVJLEtBQWYsQ0FBcUIsQ0FBckIsQ0FBeEIsR0FBa0RpSyxLQUFLdkUsVUFBdkQsR0FBb0UsSUFBRXVFLEtBQUtuRSxXQUEzRSxHQUF5RixJQUE5RztBQUNBRyxLQUFFMkQsSUFBRixDQUFPckMsS0FBUCxDQUFhNkMsTUFBYixHQUFzQm5FLEVBQUVzRCxHQUFGLENBQU1oQyxLQUFOLENBQVk2QyxNQUFsQztBQUNBLE9BQUk7QUFDSG5FLE1BQUUyRCxJQUFGLENBQU9yQyxLQUFQLENBQWFzRixNQUFiLEdBQXNCLFNBQXRCO0FBQ0EsSUFGRCxDQUVFLE9BQU1JLE1BQU4sRUFBYztBQUNmaEgsTUFBRTJELElBQUYsQ0FBT3JDLEtBQVAsQ0FBYXNGLE1BQWIsR0FBc0IsTUFBdEI7QUFDQTs7QUFFRDtBQUNBLFlBQVNLLFlBQVQsR0FBd0I7QUFDdkIsUUFBSUMsY0FBY2xELEtBQUtsRSxnQkFBTCxDQUFzQnFILEtBQXRCLENBQTRCLEtBQTVCLENBQWxCO0FBQ0EsUUFBSUMsb0JBQW9CRixZQUFZL08sTUFBWixHQUFxQixDQUFyQixHQUF5QitPLFlBQVksQ0FBWixDQUF6QixHQUEwQ0EsWUFBWSxDQUFaLElBQWlCLEdBQWpCLEdBQXVCQSxZQUFZLENBQVosQ0FBdkIsR0FBd0MsR0FBeEMsR0FBOENBLFlBQVksQ0FBWixDQUE5QyxHQUErRCxHQUEvRCxHQUFxRUEsWUFBWSxDQUFaLENBQXZJO0FBQ0FsSCxNQUFFNEQsR0FBRixDQUFNdEMsS0FBTixDQUFZb0YsV0FBWixHQUEwQlUsaUJBQTFCO0FBQ0E7QUFDRHBILEtBQUU0RCxHQUFGLENBQU10QyxLQUFOLENBQVl3RixPQUFaLEdBQXNCOUMsS0FBSzFFLGNBQUwsR0FBc0IsT0FBdEIsR0FBZ0MsTUFBdEQ7QUFDQVUsS0FBRTRELEdBQUYsQ0FBTXRDLEtBQU4sQ0FBWTZFLFFBQVosR0FBdUIsVUFBdkI7QUFDQW5HLEtBQUU0RCxHQUFGLENBQU10QyxLQUFOLENBQVkrRSxJQUFaLEdBQW1CckMsS0FBS3ZFLFVBQUwsR0FBa0IsSUFBckM7QUFDQU8sS0FBRTRELEdBQUYsQ0FBTXRDLEtBQU4sQ0FBWStGLE1BQVosR0FBcUJyRCxLQUFLdkUsVUFBTCxHQUFrQixJQUF2QztBQUNBTyxLQUFFNEQsR0FBRixDQUFNdEMsS0FBTixDQUFZZ0csT0FBWixHQUFzQixRQUF0QjtBQUNBdEgsS0FBRTRELEdBQUYsQ0FBTXRDLEtBQU4sQ0FBWTZDLE1BQVosR0FBcUIsTUFBckI7QUFDQW5FLEtBQUU0RCxHQUFGLENBQU10QyxLQUFOLENBQVltRixNQUFaLEdBQXFCekMsS0FBS25FLFdBQUwsR0FBbUIsVUFBeEM7QUFDQW9IO0FBQ0FqSCxLQUFFNEQsR0FBRixDQUFNdEMsS0FBTixDQUFZckksS0FBWixHQUFvQitLLEtBQUt4RSxpQkFBekI7QUFDQVEsS0FBRTRELEdBQUYsQ0FBTXRDLEtBQU4sQ0FBWWlHLElBQVosR0FBbUIsaUJBQW5CO0FBQ0F2SCxLQUFFNEQsR0FBRixDQUFNdEMsS0FBTixDQUFZa0csU0FBWixHQUF3QixRQUF4QjtBQUNBLE9BQUk7QUFDSHhILE1BQUU0RCxHQUFGLENBQU10QyxLQUFOLENBQVlzRixNQUFaLEdBQXFCLFNBQXJCO0FBQ0EsSUFGRCxDQUVFLE9BQU1JLE1BQU4sRUFBYztBQUNmaEgsTUFBRTRELEdBQUYsQ0FBTXRDLEtBQU4sQ0FBWXNGLE1BQVosR0FBcUIsTUFBckI7QUFDQTtBQUNENUcsS0FBRTRELEdBQUYsQ0FBTWMsV0FBTixHQUFvQixZQUFZO0FBQy9CVixTQUFLL0QsVUFBTDtBQUNBLElBRkQ7QUFHQUQsS0FBRTZELElBQUYsQ0FBT3ZDLEtBQVAsQ0FBYStDLFVBQWIsR0FBMEJyRSxFQUFFNEQsR0FBRixDQUFNdEMsS0FBTixDQUFZNkMsTUFBdEM7O0FBRUE7QUFDQSxXQUFPNkIsTUFBUDtBQUNDLFNBQUssQ0FBTDtBQUFRLFNBQUl5QixTQUFTLFFBQWIsQ0FBdUI7QUFDL0IsU0FBSyxDQUFMO0FBQVEsU0FBSUEsU0FBUyxRQUFiLENBQXVCO0FBRmhDO0FBSUF6SCxLQUFFeUQsSUFBRixDQUFPbkMsS0FBUCxDQUFhQyxlQUFiLEdBQStCLFVBQVF4SyxRQUFRVSxNQUFSLEVBQVIsR0FBeUIsYUFBeEQ7QUFDQXVJLEtBQUV5RCxJQUFGLENBQU9uQyxLQUFQLENBQWFvRyxnQkFBYixHQUFnQyxXQUFoQztBQUNBMUgsS0FBRTJELElBQUYsQ0FBT3JDLEtBQVAsQ0FBYUMsZUFBYixHQUErQixVQUFReEssUUFBUVUsTUFBUixFQUFSLEdBQXlCLGFBQXhEO0FBQ0F1SSxLQUFFMkQsSUFBRixDQUFPckMsS0FBUCxDQUFhb0csZ0JBQWIsR0FBZ0MsV0FBaEM7QUFDQTFILEtBQUVwRyxHQUFGLENBQU0wSCxLQUFOLENBQVlDLGVBQVosR0FBOEIsVUFBUXhLLFFBQVFVLE1BQVIsRUFBUixHQUF5QmdRLE1BQXpCLEdBQWdDLElBQTlEO0FBQ0F6SCxLQUFFcEcsR0FBRixDQUFNMEgsS0FBTixDQUFZb0csZ0JBQVosR0FBK0IsV0FBL0I7QUFDQTFILEtBQUVwRyxHQUFGLENBQU0wSCxLQUFOLENBQVlxRyxrQkFBWixHQUFpQyxLQUFqQzs7QUFFQTtBQUNBOUY7QUFDQUU7O0FBRUFoTCxXQUFRbU0sTUFBUixDQUFlQyxLQUFmLEdBQXVCYSxJQUF2Qjs7QUFFQWpOLFdBQVFtTSxNQUFSLENBQWVDLEtBQWYsQ0FBcUI1RSxZQUFyQixDQUFrQzVDLFVBQWxDLENBQTZDMkksV0FBN0MsQ0FBeUR0RSxFQUFFcUQsSUFBM0Q7QUFDQTtBQUNBOztBQUVELFdBQVMzQyxhQUFULENBQXVCa0gsQ0FBdkIsRUFBMEI7QUFDekIsT0FBSTNCLE9BQU8sQ0FDVixJQUFFMkIsRUFBRS9ILFdBQUosR0FBa0IsSUFBRStILEVBQUVuSSxVQUF0QixHQUFtQzFJLFFBQVE0QyxNQUFSLENBQWVDLEdBQWYsQ0FBbUIsQ0FBbkIsQ0FBbkMsSUFDRWdPLEVBQUV2SixNQUFGLEdBQVcsSUFBRXVKLEVBQUUvSCxXQUFKLEdBQWtCLElBQUU5SSxRQUFRNEMsTUFBUixDQUFlSSxLQUFmLENBQXFCLENBQXJCLENBQXBCLEdBQThDaEQsUUFBUTRDLE1BQVIsQ0FBZUUsR0FBZixDQUFtQixDQUFuQixDQUF6RCxHQUFpRixDQURuRixDQURVLEVBR1YrTixFQUFFdEksY0FBRixHQUNDLElBQUVzSSxFQUFFL0gsV0FBSixHQUFrQixJQUFFK0gsRUFBRW5JLFVBQXRCLEdBQW1DMUksUUFBUTRDLE1BQVIsQ0FBZUMsR0FBZixDQUFtQixDQUFuQixDQUFuQyxHQUEyRGdPLEVBQUV2SSxrQkFEOUQsR0FFQyxJQUFFdUksRUFBRS9ILFdBQUosR0FBa0IsSUFBRStILEVBQUVuSSxVQUF0QixHQUFtQzFJLFFBQVE0QyxNQUFSLENBQWVDLEdBQWYsQ0FBbUIsQ0FBbkIsQ0FMMUIsQ0FBWDtBQU9BLFVBQU9xTSxJQUFQO0FBQ0E7O0FBR0QsV0FBU3BFLFNBQVQsR0FBcUI7QUFDcEI7QUFDQSxXQUFPbUUsTUFBUDtBQUNDLFNBQUssQ0FBTDtBQUFRLFNBQUk2QixhQUFhLENBQWpCLENBQW9CO0FBQzVCLFNBQUssQ0FBTDtBQUFRLFNBQUlBLGFBQWEsQ0FBakIsQ0FBb0I7QUFGN0I7QUFJQSxPQUFJdk0sSUFBSThHLEtBQUtVLEtBQUwsQ0FBWWtCLEtBQUt2RixHQUFMLENBQVMsQ0FBVCxJQUFZLENBQWIsSUFBbUIxSCxRQUFRNEMsTUFBUixDQUFlQyxHQUFmLENBQW1CLENBQW5CLElBQXNCLENBQXpDLENBQVgsQ0FBUjtBQUNBLE9BQUkyQixJQUFJNkcsS0FBS1UsS0FBTCxDQUFXLENBQUMsSUFBRWtCLEtBQUt2RixHQUFMLENBQVNvSixVQUFULENBQUgsS0FBNEI5USxRQUFRNEMsTUFBUixDQUFlQyxHQUFmLENBQW1CLENBQW5CLElBQXNCLENBQWxELENBQVgsQ0FBUjtBQUNBN0MsV0FBUW1NLE1BQVIsQ0FBZU8sSUFBZixDQUFvQm5DLEtBQXBCLENBQTBCcUcsa0JBQTFCLEdBQ0UzRCxLQUFLdkUsVUFBTCxHQUFnQnVFLEtBQUtuRSxXQUFyQixHQUFpQ3ZFLENBQWpDLEdBQXFDOEcsS0FBS1ksS0FBTCxDQUFXak0sUUFBUTRDLE1BQVIsQ0FBZUcsS0FBZixDQUFxQixDQUFyQixJQUF3QixDQUFuQyxDQUF0QyxHQUErRSxLQUEvRSxJQUNDa0ssS0FBS3ZFLFVBQUwsR0FBZ0J1RSxLQUFLbkUsV0FBckIsR0FBaUN0RSxDQUFqQyxHQUFxQzZHLEtBQUtZLEtBQUwsQ0FBV2pNLFFBQVE0QyxNQUFSLENBQWVHLEtBQWYsQ0FBcUIsQ0FBckIsSUFBd0IsQ0FBbkMsQ0FEdEMsSUFDK0UsSUFGaEY7O0FBSUE7QUFDQSxPQUFJb0ssTUFBTW5OLFFBQVFtTSxNQUFSLENBQWVySixHQUFmLENBQW1CaU8sVUFBN0I7O0FBRUEsV0FBTzlCLE1BQVA7QUFDQyxTQUFLLENBQUw7QUFDQyxTQUFJdEgsTUFBTTZELFFBQVF5QixLQUFLdkYsR0FBTCxDQUFTLENBQVQsQ0FBUixFQUFxQnVGLEtBQUt2RixHQUFMLENBQVMsQ0FBVCxDQUFyQixFQUFrQyxDQUFsQyxDQUFWO0FBQ0EsVUFBSSxJQUFJdkcsSUFBRSxDQUFWLEVBQWFBLElBQUVnTSxJQUFJL0wsTUFBbkIsRUFBMkJELEtBQUcsQ0FBOUIsRUFBaUM7QUFDaENnTSxVQUFJaE0sQ0FBSixFQUFPb0osS0FBUCxDQUFhRyxlQUFiLEdBQStCLFNBQzdCL0MsSUFBSSxDQUFKLEtBQVEsSUFBRXhHLElBQUVnTSxJQUFJL0wsTUFBaEIsSUFBd0IsR0FESyxHQUNBLElBREEsR0FFN0J1RyxJQUFJLENBQUosS0FBUSxJQUFFeEcsSUFBRWdNLElBQUkvTCxNQUFoQixJQUF3QixHQUZLLEdBRUEsSUFGQSxHQUc3QnVHLElBQUksQ0FBSixLQUFRLElBQUV4RyxJQUFFZ00sSUFBSS9MLE1BQWhCLElBQXdCLEdBSEssR0FHQSxJQUgvQjtBQUlBO0FBQ0Q7QUFDRCxTQUFLLENBQUw7QUFDQyxTQUFJdUcsR0FBSjtBQUFBLFNBQVN3RCxDQUFUO0FBQUEsU0FBWXJCLElBQUksQ0FBRW1ELEtBQUt2RixHQUFMLENBQVMsQ0FBVCxDQUFGLEVBQWUsQ0FBZixFQUFrQixDQUFsQixDQUFoQjtBQUNBLFNBQUl2RyxJQUFJa0ssS0FBS1ksS0FBTCxDQUFXZ0IsS0FBS3ZGLEdBQUwsQ0FBUyxDQUFULENBQVgsQ0FBUjtBQUNBLFNBQUl3RSxJQUFJL0ssSUFBRSxDQUFGLEdBQU04TCxLQUFLdkYsR0FBTCxDQUFTLENBQVQsSUFBWXZHLENBQWxCLEdBQXNCLEtBQUc4TCxLQUFLdkYsR0FBTCxDQUFTLENBQVQsSUFBWXZHLENBQWYsQ0FBOUI7QUFDQSxhQUFPQSxDQUFQO0FBQ0MsV0FBSyxDQUFMO0FBQ0EsV0FBSyxDQUFMO0FBQVF3RyxhQUFJLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQUosQ0FBYTtBQUNyQixXQUFLLENBQUw7QUFBUUEsYUFBSSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFKLENBQWE7QUFDckIsV0FBSyxDQUFMO0FBQVFBLGFBQUksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBSixDQUFhO0FBQ3JCLFdBQUssQ0FBTDtBQUFRQSxhQUFJLENBQUMsQ0FBRCxFQUFHLENBQUgsRUFBSyxDQUFMLENBQUosQ0FBYTtBQUNyQixXQUFLLENBQUw7QUFBUUEsYUFBSSxDQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTCxDQUFKLENBQWE7QUFDckIsV0FBSyxDQUFMO0FBQVFBLGFBQUksQ0FBQyxDQUFELEVBQUcsQ0FBSCxFQUFLLENBQUwsQ0FBSixDQUFhO0FBUHRCO0FBU0EsVUFBSSxJQUFJeEcsSUFBRSxDQUFWLEVBQWFBLElBQUVnTSxJQUFJL0wsTUFBbkIsRUFBMkJELEtBQUcsQ0FBOUIsRUFBaUM7QUFDaENnSyxVQUFJLElBQUksS0FBR2dDLElBQUkvTCxNQUFKLEdBQVcsQ0FBZCxJQUFpQkQsQ0FBekI7QUFDQTJJLFFBQUUsQ0FBRixJQUFPQSxFQUFFLENBQUYsS0FBUSxJQUFJcUIsSUFBRWUsQ0FBZCxDQUFQO0FBQ0FwQyxRQUFFLENBQUYsSUFBT0EsRUFBRSxDQUFGLEtBQVEsSUFBSXFCLENBQVosQ0FBUDtBQUNBZ0MsVUFBSWhNLENBQUosRUFBT29KLEtBQVAsQ0FBYUcsZUFBYixHQUErQixTQUM3QlosRUFBRW5DLElBQUksQ0FBSixDQUFGLElBQVUsR0FEbUIsR0FDZCxJQURjLEdBRTdCbUMsRUFBRW5DLElBQUksQ0FBSixDQUFGLElBQVUsR0FGbUIsR0FFZCxJQUZjLEdBRzdCbUMsRUFBRW5DLElBQUksQ0FBSixDQUFGLElBQVUsR0FIbUIsR0FHZCxJQUhqQjtBQUlBO0FBQ0Q7QUFoQ0Y7QUFrQ0E7O0FBR0QsV0FBU3FELFNBQVQsR0FBcUI7QUFDcEI7QUFDQSxXQUFPaUUsTUFBUDtBQUNDLFNBQUssQ0FBTDtBQUFRLFNBQUk2QixhQUFhLENBQWpCLENBQW9CO0FBQzVCLFNBQUssQ0FBTDtBQUFRLFNBQUlBLGFBQWEsQ0FBakIsQ0FBb0I7QUFGN0I7QUFJQSxPQUFJdE0sSUFBSTZHLEtBQUtVLEtBQUwsQ0FBVyxDQUFDLElBQUVrQixLQUFLdkYsR0FBTCxDQUFTb0osVUFBVCxDQUFILEtBQTRCOVEsUUFBUTRDLE1BQVIsQ0FBZUUsR0FBZixDQUFtQixDQUFuQixJQUFzQixDQUFsRCxDQUFYLENBQVI7QUFDQTlDLFdBQVFtTSxNQUFSLENBQWVTLElBQWYsQ0FBb0JyQyxLQUFwQixDQUEwQnFHLGtCQUExQixHQUNDLFFBQVEzRCxLQUFLdkUsVUFBTCxHQUFnQnVFLEtBQUtuRSxXQUFyQixHQUFpQ3RFLENBQWpDLEdBQXFDNkcsS0FBS1ksS0FBTCxDQUFXak0sUUFBUTRDLE1BQVIsQ0FBZUksS0FBZixDQUFxQixDQUFyQixJQUF3QixDQUFuQyxDQUE3QyxJQUFzRixJQUR2RjtBQUVBOztBQUdELFdBQVNtRyxhQUFULEdBQXlCO0FBQ3hCLFVBQU9uSixRQUFRbU0sTUFBUixJQUFrQm5NLFFBQVFtTSxNQUFSLENBQWVDLEtBQWYsS0FBeUJhLElBQWxEO0FBQ0E7O0FBR0QsV0FBUytELFVBQVQsR0FBc0I7QUFDckIsT0FBR3pKLGlCQUFpQk4sTUFBcEIsRUFBNEI7QUFDM0JnRyxTQUFLL0MsV0FBTDtBQUNBO0FBQ0QsT0FBRytDLEtBQUsvRSxhQUFSLEVBQXVCO0FBQ3RCK0UsU0FBSy9ELFVBQUw7QUFDQTtBQUNEOztBQUdELFdBQVMrSCxTQUFULEdBQXFCO0FBQ3BCLE9BQUcxSixpQkFBaUJOLE1BQXBCLEVBQTRCO0FBQzNCZ0csU0FBSy9DLFdBQUw7QUFDQTtBQUNEOztBQUdELFdBQVM4RCxNQUFULENBQWdCaE4sQ0FBaEIsRUFBbUI7QUFDbEIsT0FBSWtRLE9BQU9sUixRQUFRb0YsY0FBUixDQUF1QnBFLENBQXZCLENBQVg7QUFDQSxPQUFJdUQsSUFBSTJNLEtBQUszTSxDQUFMLEdBQVMwSSxLQUFLdkUsVUFBZCxHQUEyQnVFLEtBQUtuRSxXQUF4QztBQUNBLE9BQUl0RSxJQUFJME0sS0FBSzFNLENBQUwsR0FBU3lJLEtBQUt2RSxVQUFkLEdBQTJCdUUsS0FBS25FLFdBQXhDO0FBQ0EsV0FBT21HLE1BQVA7QUFDQyxTQUFLLENBQUw7QUFBUWhDLFVBQUtoQyxPQUFMLENBQWExRyxLQUFHLEtBQUd2RSxRQUFRNEMsTUFBUixDQUFlQyxHQUFmLENBQW1CLENBQW5CLElBQXNCLENBQXpCLENBQUgsQ0FBYixFQUE4QyxJQUFJMkIsS0FBR3hFLFFBQVE0QyxNQUFSLENBQWVDLEdBQWYsQ0FBbUIsQ0FBbkIsSUFBc0IsQ0FBekIsQ0FBbEQsRUFBK0UsSUFBL0UsRUFBcUZrSSxRQUFyRixFQUFnRztBQUN4RyxTQUFLLENBQUw7QUFBUWtDLFVBQUtoQyxPQUFMLENBQWExRyxLQUFHLEtBQUd2RSxRQUFRNEMsTUFBUixDQUFlQyxHQUFmLENBQW1CLENBQW5CLElBQXNCLENBQXpCLENBQUgsQ0FBYixFQUE4QyxJQUE5QyxFQUFvRCxJQUFJMkIsS0FBR3hFLFFBQVE0QyxNQUFSLENBQWVDLEdBQWYsQ0FBbUIsQ0FBbkIsSUFBc0IsQ0FBekIsQ0FBeEQsRUFBcUZrSSxRQUFyRixFQUFnRztBQUZ6RztBQUlBOztBQUdELFdBQVNrRCxNQUFULENBQWdCak4sQ0FBaEIsRUFBbUI7QUFDbEIsT0FBSWtRLE9BQU9sUixRQUFRb0YsY0FBUixDQUF1QnBFLENBQXZCLENBQVg7QUFDQSxPQUFJd0QsSUFBSTBNLEtBQUsxTSxDQUFMLEdBQVN5SSxLQUFLdkUsVUFBZCxHQUEyQnVFLEtBQUtuRSxXQUF4QztBQUNBLFdBQU9tRyxNQUFQO0FBQ0MsU0FBSyxDQUFMO0FBQVFoQyxVQUFLaEMsT0FBTCxDQUFhLElBQWIsRUFBbUIsSUFBbkIsRUFBeUIsSUFBSXpHLEtBQUd4RSxRQUFRNEMsTUFBUixDQUFlRSxHQUFmLENBQW1CLENBQW5CLElBQXNCLENBQXpCLENBQTdCLEVBQTBEK0gsUUFBMUQsRUFBcUU7QUFDN0UsU0FBSyxDQUFMO0FBQVFvQyxVQUFLaEMsT0FBTCxDQUFhLElBQWIsRUFBbUIsSUFBSXpHLEtBQUd4RSxRQUFRNEMsTUFBUixDQUFlRSxHQUFmLENBQW1CLENBQW5CLElBQXNCLENBQXpCLENBQXZCLEVBQW9ELElBQXBELEVBQTBEK0gsUUFBMUQsRUFBcUU7QUFGOUU7QUFJQTs7QUFHRCxXQUFTeUQsdUJBQVQsR0FBbUM7QUFDbEMsT0FBSXJCLEtBQUt4RixpQkFBVCxFQUE0QjtBQUMzQixRQUFJMEosUUFBSjtBQUNBLFFBQUksT0FBT2xFLEtBQUt4RixpQkFBWixLQUFrQyxRQUF0QyxFQUFnRDtBQUMvQzBKLGdCQUFXLElBQUk3TyxRQUFKLENBQWMySyxLQUFLeEYsaUJBQW5CLENBQVg7QUFDQSxLQUZELE1BRU87QUFDTjBKLGdCQUFXbEUsS0FBS3hGLGlCQUFoQjtBQUNBO0FBQ0QwSixhQUFTQyxJQUFULENBQWNuRSxJQUFkO0FBQ0E7QUFDRDs7QUFHRCxNQUFJQSxPQUFPLElBQVg7QUFDQSxNQUFJZ0MsU0FBUyxLQUFLOUcsVUFBTCxDQUFnQnZCLFdBQWhCLE9BQWdDLEtBQWhDLEdBQXdDLENBQXhDLEdBQTRDLENBQXpEO0FBQ0EsTUFBSWdILFlBQVksS0FBaEI7QUFDQSxNQUNDckcsZUFBZXZILFFBQVFxRCxZQUFSLENBQXFCLEtBQUtrRSxZQUExQixDQURoQjtBQUFBLE1BRUNDLGVBQWV4SCxRQUFRcUQsWUFBUixDQUFxQixLQUFLbUUsWUFBMUIsQ0FGaEI7QUFHQSxNQUNDc0csVUFBVSxLQURYO0FBQUEsTUFFQ0MsVUFBVSxLQUZYO0FBQUEsTUFHQ1csY0FBYyxFQUhmO0FBSUEsTUFDQ3BFLGFBQWEsS0FBRyxDQURqQjtBQUFBLE1BRUNLLGFBQWEsS0FBRyxDQUZqQjtBQUFBLE1BR0NFLFdBQVcsS0FBRyxDQUhmO0FBQUEsTUFJQ0UsV0FBVyxLQUFHLENBSmY7O0FBTUE7QUFDQS9LLFVBQVF3RCxRQUFSLENBQWlCeUQsTUFBakIsRUFBeUIsT0FBekIsRUFBa0MsWUFBVztBQUM1QyxPQUFHZ0csS0FBSy9FLGFBQVIsRUFBdUI7QUFBRStFLFNBQUs1RCxVQUFMO0FBQW9CO0FBQzdDLEdBRkQ7QUFHQXJKLFVBQVF3RCxRQUFSLENBQWlCeUQsTUFBakIsRUFBeUIsTUFBekIsRUFBaUMsWUFBVztBQUMzQyxPQUFHLENBQUMyRyxTQUFKLEVBQWU7QUFDZHZJLFdBQU9nTSxVQUFQLENBQWtCLFlBQVU7QUFBRXpELGtCQUFhb0QsWUFBYixDQUEyQnBELFlBQVUsS0FBVjtBQUFrQixLQUEzRSxFQUE2RSxDQUE3RTtBQUNBLElBRkQsTUFFTztBQUNOQSxnQkFBWSxLQUFaO0FBQ0E7QUFDRCxHQU5EOztBQVFBO0FBQ0EsTUFBR3JHLFlBQUgsRUFBaUI7QUFDaEIsT0FBSStKLGNBQWMsU0FBZEEsV0FBYyxHQUFXO0FBQzVCckUsU0FBSzdDLFVBQUwsQ0FBZ0I3QyxhQUFhOEMsS0FBN0IsRUFBb0NDLFVBQXBDO0FBQ0FnRTtBQUNBLElBSEQ7QUFJQXRPLFdBQVF3RCxRQUFSLENBQWlCK0QsWUFBakIsRUFBK0IsT0FBL0IsRUFBd0MrSixXQUF4QztBQUNBdFIsV0FBUXdELFFBQVIsQ0FBaUIrRCxZQUFqQixFQUErQixPQUEvQixFQUF3QytKLFdBQXhDO0FBQ0F0UixXQUFRd0QsUUFBUixDQUFpQitELFlBQWpCLEVBQStCLE1BQS9CLEVBQXVDMEosU0FBdkM7QUFDQTFKLGdCQUFhZ0ssWUFBYixDQUEwQixjQUExQixFQUEwQyxLQUExQztBQUNBOztBQUVEO0FBQ0EsTUFBRy9KLFlBQUgsRUFBaUI7QUFDaEJBLGdCQUFhaUQsUUFBYixHQUF3QjtBQUN2QkQscUJBQWtCaEQsYUFBYStDLEtBQWIsQ0FBbUJDLGVBRGQ7QUFFdkJFLHFCQUFrQmxELGFBQWErQyxLQUFiLENBQW1CRyxlQUZkO0FBR3ZCeEksV0FBUXNGLGFBQWErQyxLQUFiLENBQW1Cckk7QUFISixJQUF4QjtBQUtBOztBQUVEO0FBQ0EsVUFBTytNLE1BQVA7QUFDQyxRQUFLLENBQUw7QUFBUWpQLFlBQVFrRCxZQUFSLENBQXFCLFFBQXJCLEVBQWdDO0FBQ3hDLFFBQUssQ0FBTDtBQUFRbEQsWUFBUWtELFlBQVIsQ0FBcUIsUUFBckIsRUFBZ0M7QUFGekM7QUFJQWxELFVBQVFrRCxZQUFSLENBQXFCLFdBQXJCO0FBQ0FsRCxVQUFRa0QsWUFBUixDQUFxQixXQUFyQjs7QUFFQSxPQUFLZ0gsV0FBTDtBQUNBOztBQWw5QlksQ0FBZCIsImZpbGUiOiJfanNjb2xvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBqc2NvbG9yLCBKYXZhU2NyaXB0IENvbG9yIFBpY2tlclxyXG4gKlxyXG4gKiBAdmVyc2lvbiAxLjQuMlxyXG4gKiBAbGljZW5zZSBHTlUgTGVzc2VyIEdlbmVyYWwgUHVibGljIExpY2Vuc2UsIGh0dHA6Ly93d3cuZ251Lm9yZy9jb3B5bGVmdC9sZXNzZXIuaHRtbFxyXG4gKiBAYXV0aG9yICBKYW4gT2R2YXJrbywgaHR0cDovL29kdmFya28uY3pcclxuICogQGNyZWF0ZWQgMjAwOC0wNi0xNVxyXG4gKiBAdXBkYXRlZCAyMDEzLTExLTI1XHJcbiAqIEBsaW5rICAgIGh0dHA6Ly9qc2NvbG9yLmNvbVxyXG4gKi9cclxuXHJcbnZhciBqc2NvbG9yID0ge1xyXG5cclxuXHRkaXIgOiBgLyR7QURNSU5fRElSfS9pbWFnZXMvanNjb2xvci9gLCAvLyBsb2NhdGlvbiBvZiBqc2NvbG9yIGRpcmVjdG9yeSAobGVhdmUgZW1wdHkgdG8gYXV0b2RldGVjdClcclxuXHRiaW5kQ2xhc3MgOiAnanNjb2xvcicsIC8vIGNsYXNzIG5hbWVcclxuXHRiaW5kaW5nIDogdHJ1ZSwgLy8gYXV0b21hdGljIGJpbmRpbmcgdmlhIDxpbnB1dCBjbGFzcz1cIi4uLlwiPlxyXG5cdHByZWxvYWRpbmcgOiB0cnVlLCAvLyB1c2UgaW1hZ2UgcHJlbG9hZGluZz9cclxuXHJcblx0aW5zdGFsbCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5pbml0KCk7XHJcblx0fSxcclxuXHJcblx0aW5pdCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYoanNjb2xvci5iaW5kaW5nKSB7XHJcblx0XHRcdGpzY29sb3IuYmluZCgpO1xyXG5cdFx0fVxyXG5cdFx0aWYoanNjb2xvci5wcmVsb2FkaW5nKSB7XHJcblx0XHRcdGpzY29sb3IucHJlbG9hZCgpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cclxuXHRnZXREaXIgOiBmdW5jdGlvbigpIHtcclxuXHRcdGlmKCFqc2NvbG9yLmRpcikge1xyXG5cdFx0XHR2YXIgZGV0ZWN0ZWQgPSBqc2NvbG9yLmRldGVjdERpcigpO1xyXG5cdFx0XHRqc2NvbG9yLmRpciA9IGRldGVjdGVkIT09ZmFsc2UgPyBkZXRlY3RlZCA6ICdqc2NvbG9yLyc7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4ganNjb2xvci5kaXI7XHJcblx0fSxcclxuXHJcblxyXG5cdGRldGVjdERpciA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGJhc2UgPSBsb2NhdGlvbi5ocmVmO1xyXG5cclxuXHRcdHZhciBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2Jhc2UnKTtcclxuXHRcdGZvcih2YXIgaT0wOyBpPGUubGVuZ3RoOyBpKz0xKSB7XHJcblx0XHRcdGlmKGVbaV0uaHJlZikgeyBiYXNlID0gZVtpXS5ocmVmOyB9XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0Jyk7XHJcblx0XHRmb3IodmFyIGk9MDsgaTxlLmxlbmd0aDsgaSs9MSkge1xyXG5cdFx0XHRpZihlW2ldLnNyYyAmJiAvKF58XFwvKWpzY29sb3JcXC5qcyhbPyNdLiopPyQvaS50ZXN0KGVbaV0uc3JjKSkge1xyXG5cdFx0XHRcdHZhciBzcmMgPSBuZXcganNjb2xvci5VUkkoZVtpXS5zcmMpO1xyXG5cdFx0XHRcdHZhciBzcmNBYnMgPSBzcmMudG9BYnNvbHV0ZShiYXNlKTtcclxuXHRcdFx0XHRzcmNBYnMucGF0aCA9IHNyY0Ficy5wYXRoLnJlcGxhY2UoL1teXFwvXSskLywgJycpOyAvLyByZW1vdmUgZmlsZW5hbWVcclxuXHRcdFx0XHRzcmNBYnMucXVlcnkgPSBudWxsO1xyXG5cdFx0XHRcdHNyY0Ficy5mcmFnbWVudCA9IG51bGw7XHJcblx0XHRcdFx0cmV0dXJuIHNyY0Ficy50b1N0cmluZygpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHJcblxyXG5cdGJpbmQgOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBtYXRjaENsYXNzID0gbmV3IFJlZ0V4cCgnKF58XFxcXHMpKCcranNjb2xvci5iaW5kQ2xhc3MrJylcXFxccyooXFxcXHtbXn1dKlxcXFx9KT8nLCAnaScpO1xyXG5cdFx0dmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW5wdXQnKTtcclxuXHRcdGZvcih2YXIgaT0wOyBpPGUubGVuZ3RoOyBpKz0xKSB7XHJcblx0XHRcdHZhciBtO1xyXG5cdFx0XHRpZighZVtpXS5jb2xvciAmJiBlW2ldLmNsYXNzTmFtZSAmJiAobSA9IGVbaV0uY2xhc3NOYW1lLm1hdGNoKG1hdGNoQ2xhc3MpKSkge1xyXG5cdFx0XHRcdHZhciBwcm9wID0ge307XHJcblx0XHRcdFx0aWYobVszXSkge1xyXG5cdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0cHJvcCA9IChuZXcgRnVuY3Rpb24gKCdyZXR1cm4gKCcgKyBtWzNdICsgJyknKSkoKTtcclxuXHRcdFx0XHRcdH0gY2F0Y2goZUludmFsaWRQcm9wKSB7fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlW2ldLmNvbG9yID0gbmV3IGpzY29sb3IuY29sb3IoZVtpXSwgcHJvcCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHJcblx0cHJlbG9hZCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Zm9yKHZhciBmbiBpbiBqc2NvbG9yLmltZ1JlcXVpcmUpIHtcclxuXHRcdFx0aWYoanNjb2xvci5pbWdSZXF1aXJlLmhhc093blByb3BlcnR5KGZuKSkge1xyXG5cdFx0XHRcdGpzY29sb3IubG9hZEltYWdlKGZuKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cclxuXHRpbWFnZXMgOiB7XHJcblx0XHRwYWQgOiBbIDE4MSwgMTAxIF0sXHJcblx0XHRzbGQgOiBbIDE2LCAxMDEgXSxcclxuXHRcdGNyb3NzIDogWyAxNSwgMTUgXSxcclxuXHRcdGFycm93IDogWyA3LCAxMSBdXHJcblx0fSxcclxuXHJcblxyXG5cdGltZ1JlcXVpcmUgOiB7fSxcclxuXHRpbWdMb2FkZWQgOiB7fSxcclxuXHJcblxyXG5cdHJlcXVpcmVJbWFnZSA6IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XHJcblx0XHRqc2NvbG9yLmltZ1JlcXVpcmVbZmlsZW5hbWVdID0gdHJ1ZTtcclxuXHR9LFxyXG5cclxuXHJcblx0bG9hZEltYWdlIDogZnVuY3Rpb24oZmlsZW5hbWUpIHtcclxuXHRcdGlmKCFqc2NvbG9yLmltZ0xvYWRlZFtmaWxlbmFtZV0pIHtcclxuXHRcdFx0anNjb2xvci5pbWdMb2FkZWRbZmlsZW5hbWVdID0gbmV3IEltYWdlKCk7XHJcblx0XHRcdGpzY29sb3IuaW1nTG9hZGVkW2ZpbGVuYW1lXS5zcmMgPSBqc2NvbG9yLmdldERpcigpK2ZpbGVuYW1lO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cclxuXHRmZXRjaEVsZW1lbnQgOiBmdW5jdGlvbihtaXhlZCkge1xyXG5cdFx0cmV0dXJuIHR5cGVvZiBtaXhlZCA9PT0gJ3N0cmluZycgPyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChtaXhlZCkgOiBtaXhlZDtcclxuXHR9LFxyXG5cclxuXHJcblx0YWRkRXZlbnQgOiBmdW5jdGlvbihlbCwgZXZudCwgZnVuYykge1xyXG5cdFx0aWYoZWwuYWRkRXZlbnRMaXN0ZW5lcikge1xyXG5cdFx0XHRlbC5hZGRFdmVudExpc3RlbmVyKGV2bnQsIGZ1bmMsIGZhbHNlKTtcclxuXHRcdH0gZWxzZSBpZihlbC5hdHRhY2hFdmVudCkge1xyXG5cdFx0XHRlbC5hdHRhY2hFdmVudCgnb24nK2V2bnQsIGZ1bmMpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cclxuXHRmaXJlRXZlbnQgOiBmdW5jdGlvbihlbCwgZXZudCkge1xyXG5cdFx0aWYoIWVsKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGlmKGRvY3VtZW50LmNyZWF0ZUV2ZW50KSB7XHJcblx0XHRcdHZhciBldiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XHJcblx0XHRcdGV2LmluaXRFdmVudChldm50LCB0cnVlLCB0cnVlKTtcclxuXHRcdFx0ZWwuZGlzcGF0Y2hFdmVudChldik7XHJcblx0XHR9IGVsc2UgaWYoZG9jdW1lbnQuY3JlYXRlRXZlbnRPYmplY3QpIHtcclxuXHRcdFx0dmFyIGV2ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnRPYmplY3QoKTtcclxuXHRcdFx0ZWwuZmlyZUV2ZW50KCdvbicrZXZudCwgZXYpO1xyXG5cdFx0fSBlbHNlIGlmKGVsWydvbicrZXZudF0pIHsgLy8gYWx0ZXJuYXRpdmVseSB1c2UgdGhlIHRyYWRpdGlvbmFsIGV2ZW50IG1vZGVsIChJRTUpXHJcblx0XHRcdGVsWydvbicrZXZudF0oKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHJcblx0Z2V0RWxlbWVudFBvcyA6IGZ1bmN0aW9uKGUpIHtcclxuXHRcdHZhciBlMT1lLCBlMj1lO1xyXG5cdFx0dmFyIHg9MCwgeT0wO1xyXG5cdFx0aWYoZTEub2Zmc2V0UGFyZW50KSB7XHJcblx0XHRcdGRvIHtcclxuXHRcdFx0XHR4ICs9IGUxLm9mZnNldExlZnQ7XHJcblx0XHRcdFx0eSArPSBlMS5vZmZzZXRUb3A7XHJcblx0XHRcdH0gd2hpbGUoZTEgPSBlMS5vZmZzZXRQYXJlbnQpO1xyXG5cdFx0fVxyXG5cdFx0d2hpbGUoKGUyID0gZTIucGFyZW50Tm9kZSkgJiYgZTIubm9kZU5hbWUudG9VcHBlckNhc2UoKSAhPT0gJ0JPRFknKSB7XHJcblx0XHRcdHggLT0gZTIuc2Nyb2xsTGVmdDtcclxuXHRcdFx0eSAtPSBlMi5zY3JvbGxUb3A7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gW3gsIHldO1xyXG5cdH0sXHJcblxyXG5cclxuXHRnZXRFbGVtZW50U2l6ZSA6IGZ1bmN0aW9uKGUpIHtcclxuXHRcdHJldHVybiBbZS5vZmZzZXRXaWR0aCwgZS5vZmZzZXRIZWlnaHRdO1xyXG5cdH0sXHJcblxyXG5cclxuXHRnZXRSZWxNb3VzZVBvcyA6IGZ1bmN0aW9uKGUpIHtcclxuXHRcdHZhciB4ID0gMCwgeSA9IDA7XHJcblx0XHRpZiAoIWUpIHsgZSA9IHdpbmRvdy5ldmVudDsgfVxyXG5cdFx0aWYgKHR5cGVvZiBlLm9mZnNldFggPT09ICdudW1iZXInKSB7XHJcblx0XHRcdHggPSBlLm9mZnNldFg7XHJcblx0XHRcdHkgPSBlLm9mZnNldFk7XHJcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBlLmxheWVyWCA9PT0gJ251bWJlcicpIHtcclxuXHRcdFx0eCA9IGUubGF5ZXJYO1xyXG5cdFx0XHR5ID0gZS5sYXllclk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4geyB4OiB4LCB5OiB5IH07XHJcblx0fSxcclxuXHJcblxyXG5cdGdldFZpZXdQb3MgOiBmdW5jdGlvbigpIHtcclxuXHRcdGlmKHR5cGVvZiB3aW5kb3cucGFnZVlPZmZzZXQgPT09ICdudW1iZXInKSB7XHJcblx0XHRcdHJldHVybiBbd2luZG93LnBhZ2VYT2Zmc2V0LCB3aW5kb3cucGFnZVlPZmZzZXRdO1xyXG5cdFx0fSBlbHNlIGlmKGRvY3VtZW50LmJvZHkgJiYgKGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCkpIHtcclxuXHRcdFx0cmV0dXJuIFtkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQsIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wXTtcclxuXHRcdH0gZWxzZSBpZihkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3ApKSB7XHJcblx0XHRcdHJldHVybiBbZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3BdO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIFswLCAwXTtcclxuXHRcdH1cclxuXHR9LFxyXG5cclxuXHJcblx0Z2V0Vmlld1NpemUgOiBmdW5jdGlvbigpIHtcclxuXHRcdGlmKHR5cGVvZiB3aW5kb3cuaW5uZXJXaWR0aCA9PT0gJ251bWJlcicpIHtcclxuXHRcdFx0cmV0dXJuIFt3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0XTtcclxuXHRcdH0gZWxzZSBpZihkb2N1bWVudC5ib2R5ICYmIChkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIHx8IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0KSkge1xyXG5cdFx0XHRyZXR1cm4gW2RvY3VtZW50LmJvZHkuY2xpZW50V2lkdGgsIGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0XTtcclxuXHRcdH0gZWxzZSBpZihkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KSkge1xyXG5cdFx0XHRyZXR1cm4gW2RvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodF07XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gWzAsIDBdO1xyXG5cdFx0fVxyXG5cdH0sXHJcblxyXG5cclxuXHRVUkkgOiBmdW5jdGlvbih1cmkpIHsgLy8gU2VlIFJGQzM5ODZcclxuXHJcblx0XHR0aGlzLnNjaGVtZSA9IG51bGw7XHJcblx0XHR0aGlzLmF1dGhvcml0eSA9IG51bGw7XHJcblx0XHR0aGlzLnBhdGggPSAnJztcclxuXHRcdHRoaXMucXVlcnkgPSBudWxsO1xyXG5cdFx0dGhpcy5mcmFnbWVudCA9IG51bGw7XHJcblxyXG5cdFx0dGhpcy5wYXJzZSA9IGZ1bmN0aW9uKHVyaSkge1xyXG5cdFx0XHR2YXIgbSA9IHVyaS5tYXRjaCgvXigoW0EtWmEtel1bMC05QS1aYS16Ky4tXSopKDopKT8oKFxcL1xcLykoW15cXC8/I10qKSk/KFtePyNdKikoKFxcPykoW14jXSopKT8oKCMpKC4qKSk/Lyk7XHJcblx0XHRcdHRoaXMuc2NoZW1lID0gbVszXSA/IG1bMl0gOiBudWxsO1xyXG5cdFx0XHR0aGlzLmF1dGhvcml0eSA9IG1bNV0gPyBtWzZdIDogbnVsbDtcclxuXHRcdFx0dGhpcy5wYXRoID0gbVs3XTtcclxuXHRcdFx0dGhpcy5xdWVyeSA9IG1bOV0gPyBtWzEwXSA6IG51bGw7XHJcblx0XHRcdHRoaXMuZnJhZ21lbnQgPSBtWzEyXSA/IG1bMTNdIDogbnVsbDtcclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHJlc3VsdCA9ICcnO1xyXG5cdFx0XHRpZih0aGlzLnNjaGVtZSAhPT0gbnVsbCkgeyByZXN1bHQgPSByZXN1bHQgKyB0aGlzLnNjaGVtZSArICc6JzsgfVxyXG5cdFx0XHRpZih0aGlzLmF1dGhvcml0eSAhPT0gbnVsbCkgeyByZXN1bHQgPSByZXN1bHQgKyAnLy8nICsgdGhpcy5hdXRob3JpdHk7IH1cclxuXHRcdFx0aWYodGhpcy5wYXRoICE9PSBudWxsKSB7IHJlc3VsdCA9IHJlc3VsdCArIHRoaXMucGF0aDsgfVxyXG5cdFx0XHRpZih0aGlzLnF1ZXJ5ICE9PSBudWxsKSB7IHJlc3VsdCA9IHJlc3VsdCArICc/JyArIHRoaXMucXVlcnk7IH1cclxuXHRcdFx0aWYodGhpcy5mcmFnbWVudCAhPT0gbnVsbCkgeyByZXN1bHQgPSByZXN1bHQgKyAnIycgKyB0aGlzLmZyYWdtZW50OyB9XHJcblx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMudG9BYnNvbHV0ZSA9IGZ1bmN0aW9uKGJhc2UpIHtcclxuXHRcdFx0dmFyIGJhc2UgPSBuZXcganNjb2xvci5VUkkoYmFzZSk7XHJcblx0XHRcdHZhciByID0gdGhpcztcclxuXHRcdFx0dmFyIHQgPSBuZXcganNjb2xvci5VUkk7XHJcblxyXG5cdFx0XHRpZihiYXNlLnNjaGVtZSA9PT0gbnVsbCkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHJcblx0XHRcdGlmKHIuc2NoZW1lICE9PSBudWxsICYmIHIuc2NoZW1lLnRvTG93ZXJDYXNlKCkgPT09IGJhc2Uuc2NoZW1lLnRvTG93ZXJDYXNlKCkpIHtcclxuXHRcdFx0XHRyLnNjaGVtZSA9IG51bGw7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKHIuc2NoZW1lICE9PSBudWxsKSB7XHJcblx0XHRcdFx0dC5zY2hlbWUgPSByLnNjaGVtZTtcclxuXHRcdFx0XHR0LmF1dGhvcml0eSA9IHIuYXV0aG9yaXR5O1xyXG5cdFx0XHRcdHQucGF0aCA9IHJlbW92ZURvdFNlZ21lbnRzKHIucGF0aCk7XHJcblx0XHRcdFx0dC5xdWVyeSA9IHIucXVlcnk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYoci5hdXRob3JpdHkgIT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHQuYXV0aG9yaXR5ID0gci5hdXRob3JpdHk7XHJcblx0XHRcdFx0XHR0LnBhdGggPSByZW1vdmVEb3RTZWdtZW50cyhyLnBhdGgpO1xyXG5cdFx0XHRcdFx0dC5xdWVyeSA9IHIucXVlcnk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmKHIucGF0aCA9PT0gJycpIHtcclxuXHRcdFx0XHRcdFx0dC5wYXRoID0gYmFzZS5wYXRoO1xyXG5cdFx0XHRcdFx0XHRpZihyLnF1ZXJ5ICE9PSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdFx0dC5xdWVyeSA9IHIucXVlcnk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0dC5xdWVyeSA9IGJhc2UucXVlcnk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGlmKHIucGF0aC5zdWJzdHIoMCwxKSA9PT0gJy8nKSB7XHJcblx0XHRcdFx0XHRcdFx0dC5wYXRoID0gcmVtb3ZlRG90U2VnbWVudHMoci5wYXRoKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRpZihiYXNlLmF1dGhvcml0eSAhPT0gbnVsbCAmJiBiYXNlLnBhdGggPT09ICcnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0LnBhdGggPSAnLycrci5wYXRoO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0LnBhdGggPSBiYXNlLnBhdGgucmVwbGFjZSgvW15cXC9dKyQvLCcnKStyLnBhdGg7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdHQucGF0aCA9IHJlbW92ZURvdFNlZ21lbnRzKHQucGF0aCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0dC5xdWVyeSA9IHIucXVlcnk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0LmF1dGhvcml0eSA9IGJhc2UuYXV0aG9yaXR5O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0LnNjaGVtZSA9IGJhc2Uuc2NoZW1lO1xyXG5cdFx0XHR9XHJcblx0XHRcdHQuZnJhZ21lbnQgPSByLmZyYWdtZW50O1xyXG5cclxuXHRcdFx0cmV0dXJuIHQ7XHJcblx0XHR9O1xyXG5cclxuXHRcdGZ1bmN0aW9uIHJlbW92ZURvdFNlZ21lbnRzKHBhdGgpIHtcclxuXHRcdFx0dmFyIG91dCA9ICcnO1xyXG5cdFx0XHR3aGlsZShwYXRoKSB7XHJcblx0XHRcdFx0aWYocGF0aC5zdWJzdHIoMCwzKT09PScuLi8nIHx8IHBhdGguc3Vic3RyKDAsMik9PT0nLi8nKSB7XHJcblx0XHRcdFx0XHRwYXRoID0gcGF0aC5yZXBsYWNlKC9eXFwuKy8sJycpLnN1YnN0cigxKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYocGF0aC5zdWJzdHIoMCwzKT09PScvLi8nIHx8IHBhdGg9PT0nLy4nKSB7XHJcblx0XHRcdFx0XHRwYXRoID0gJy8nK3BhdGguc3Vic3RyKDMpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZihwYXRoLnN1YnN0cigwLDQpPT09Jy8uLi8nIHx8IHBhdGg9PT0nLy4uJykge1xyXG5cdFx0XHRcdFx0cGF0aCA9ICcvJytwYXRoLnN1YnN0cig0KTtcclxuXHRcdFx0XHRcdG91dCA9IG91dC5yZXBsYWNlKC9cXC8/W15cXC9dKiQvLCAnJyk7XHJcblx0XHRcdFx0fSBlbHNlIGlmKHBhdGg9PT0nLicgfHwgcGF0aD09PScuLicpIHtcclxuXHRcdFx0XHRcdHBhdGggPSAnJztcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dmFyIHJtID0gcGF0aC5tYXRjaCgvXlxcLz9bXlxcL10qLylbMF07XHJcblx0XHRcdFx0XHRwYXRoID0gcGF0aC5zdWJzdHIocm0ubGVuZ3RoKTtcclxuXHRcdFx0XHRcdG91dCA9IG91dCArIHJtO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gb3V0O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKHVyaSkge1xyXG5cdFx0XHR0aGlzLnBhcnNlKHVyaSk7XHJcblx0XHR9XHJcblxyXG5cdH0sXHJcblxyXG5cclxuXHQvL1xyXG5cdC8vIFVzYWdlIGV4YW1wbGU6XHJcblx0Ly8gdmFyIG15Q29sb3IgPSBuZXcganNjb2xvci5jb2xvcihteUlucHV0RWxlbWVudClcclxuXHQvL1xyXG5cclxuXHRjb2xvciA6IGZ1bmN0aW9uKHRhcmdldCwgcHJvcCkge1xyXG5cclxuXHJcblx0XHR0aGlzLnJlcXVpcmVkID0gdHJ1ZTsgLy8gcmVmdXNlIGVtcHR5IHZhbHVlcz9cclxuXHRcdHRoaXMuYWRqdXN0ID0gdHJ1ZTsgLy8gYWRqdXN0IHZhbHVlIHRvIHVuaWZvcm0gbm90YXRpb24/XHJcblx0XHR0aGlzLmhhc2ggPSBmYWxzZTsgLy8gcHJlZml4IGNvbG9yIHdpdGggIyBzeW1ib2w/XHJcblx0XHR0aGlzLmNhcHMgPSB0cnVlOyAvLyB1cHBlcmNhc2U/XHJcblx0XHR0aGlzLnNsaWRlciA9IHRydWU7IC8vIHNob3cgdGhlIHZhbHVlL3NhdHVyYXRpb24gc2xpZGVyP1xyXG5cdFx0dGhpcy52YWx1ZUVsZW1lbnQgPSB0YXJnZXQ7IC8vIHZhbHVlIGhvbGRlclxyXG5cdFx0dGhpcy5zdHlsZUVsZW1lbnQgPSB0YXJnZXQ7IC8vIHdoZXJlIHRvIHJlZmxlY3QgY3VycmVudCBjb2xvclxyXG5cdFx0dGhpcy5vbkltbWVkaWF0ZUNoYW5nZSA9IG51bGw7IC8vIG9uY2hhbmdlIGNhbGxiYWNrIChjYW4gYmUgZWl0aGVyIHN0cmluZyBvciBmdW5jdGlvbilcclxuXHRcdHRoaXMuaHN2ID0gWzAsIDAsIDFdOyAvLyByZWFkLW9ubHkgIDAtNiwgMC0xLCAwLTFcclxuXHRcdHRoaXMucmdiID0gWzEsIDEsIDFdOyAvLyByZWFkLW9ubHkgIDAtMSwgMC0xLCAwLTFcclxuXHRcdHRoaXMubWluSCA9IDA7IC8vIHJlYWQtb25seSAgMC02XHJcblx0XHR0aGlzLm1heEggPSA2OyAvLyByZWFkLW9ubHkgIDAtNlxyXG5cdFx0dGhpcy5taW5TID0gMDsgLy8gcmVhZC1vbmx5ICAwLTFcclxuXHRcdHRoaXMubWF4UyA9IDE7IC8vIHJlYWQtb25seSAgMC0xXHJcblx0XHR0aGlzLm1pblYgPSAwOyAvLyByZWFkLW9ubHkgIDAtMVxyXG5cdFx0dGhpcy5tYXhWID0gMTsgLy8gcmVhZC1vbmx5ICAwLTFcclxuXHJcblx0XHR0aGlzLnBpY2tlck9uZm9jdXMgPSB0cnVlOyAvLyBkaXNwbGF5IHBpY2tlciBvbiBmb2N1cz9cclxuXHRcdHRoaXMucGlja2VyTW9kZSA9ICdIU1YnOyAvLyBIU1YgfCBIVlNcclxuXHRcdHRoaXMucGlja2VyUG9zaXRpb24gPSAnYm90dG9tJzsgLy8gbGVmdCB8IHJpZ2h0IHwgdG9wIHwgYm90dG9tXHJcblx0XHR0aGlzLnBpY2tlclNtYXJ0UG9zaXRpb24gPSB0cnVlOyAvLyBhdXRvbWF0aWNhbGx5IGFkanVzdCBwaWNrZXIgcG9zaXRpb24gd2hlbiBuZWNlc3NhcnlcclxuXHRcdHRoaXMucGlja2VyQnV0dG9uSGVpZ2h0ID0gMjA7IC8vIHB4XHJcblx0XHR0aGlzLnBpY2tlckNsb3NhYmxlID0gZmFsc2U7XHJcblx0XHR0aGlzLnBpY2tlckNsb3NlVGV4dCA9ICdDbG9zZSc7XHJcblx0XHR0aGlzLnBpY2tlckJ1dHRvbkNvbG9yID0gJ0J1dHRvblRleHQnOyAvLyBweFxyXG5cdFx0dGhpcy5waWNrZXJGYWNlID0gMTA7IC8vIHB4XHJcblx0XHR0aGlzLnBpY2tlckZhY2VDb2xvciA9ICdUaHJlZURGYWNlJzsgLy8gQ1NTIGNvbG9yXHJcblx0XHR0aGlzLnBpY2tlckJvcmRlciA9IDE7IC8vIHB4XHJcblx0XHR0aGlzLnBpY2tlckJvcmRlckNvbG9yID0gJ1RocmVlREhpZ2hsaWdodCBUaHJlZURTaGFkb3cgVGhyZWVEU2hhZG93IFRocmVlREhpZ2hsaWdodCc7IC8vIENTUyBjb2xvclxyXG5cdFx0dGhpcy5waWNrZXJJbnNldCA9IDE7IC8vIHB4XHJcblx0XHR0aGlzLnBpY2tlckluc2V0Q29sb3IgPSAnVGhyZWVEU2hhZG93IFRocmVlREhpZ2hsaWdodCBUaHJlZURIaWdobGlnaHQgVGhyZWVEU2hhZG93JzsgLy8gQ1NTIGNvbG9yXHJcblx0XHR0aGlzLnBpY2tlclpJbmRleCA9IDEwMDAwO1xyXG5cclxuXHJcblx0XHRmb3IodmFyIHAgaW4gcHJvcCkge1xyXG5cdFx0XHRpZihwcm9wLmhhc093blByb3BlcnR5KHApKSB7XHJcblx0XHRcdFx0dGhpc1twXSA9IHByb3BbcF07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0dGhpcy5oaWRlUGlja2VyID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmKGlzUGlja2VyT3duZXIoKSkge1xyXG5cdFx0XHRcdHJlbW92ZVBpY2tlcigpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLnNob3dQaWNrZXIgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYoIWlzUGlja2VyT3duZXIoKSkge1xyXG5cdFx0XHRcdHZhciB0cCA9IGpzY29sb3IuZ2V0RWxlbWVudFBvcyh0YXJnZXQpOyAvLyB0YXJnZXQgcG9zXHJcblx0XHRcdFx0dmFyIHRzID0ganNjb2xvci5nZXRFbGVtZW50U2l6ZSh0YXJnZXQpOyAvLyB0YXJnZXQgc2l6ZVxyXG5cdFx0XHRcdHZhciB2cCA9IGpzY29sb3IuZ2V0Vmlld1BvcygpOyAvLyB2aWV3IHBvc1xyXG5cdFx0XHRcdHZhciB2cyA9IGpzY29sb3IuZ2V0Vmlld1NpemUoKTsgLy8gdmlldyBzaXplXHJcblx0XHRcdFx0dmFyIHBzID0gZ2V0UGlja2VyRGltcyh0aGlzKTsgLy8gcGlja2VyIHNpemVcclxuXHRcdFx0XHR2YXIgYSwgYiwgYztcclxuXHRcdFx0XHRzd2l0Y2godGhpcy5waWNrZXJQb3NpdGlvbi50b0xvd2VyQ2FzZSgpKSB7XHJcblx0XHRcdFx0XHRjYXNlICdsZWZ0JzogYT0xOyBiPTA7IGM9LTE7IGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAncmlnaHQnOmE9MTsgYj0wOyBjPTE7IGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAndG9wJzogIGE9MDsgYj0xOyBjPS0xOyBicmVhaztcclxuXHRcdFx0XHRcdGRlZmF1bHQ6ICAgICBhPTA7IGI9MTsgYz0xOyBicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dmFyIGwgPSAodHNbYl0rcHNbYl0pLzI7XHJcblxyXG5cdFx0XHRcdC8vIHBpY2tlciBwb3NcclxuXHRcdFx0XHRpZiAoIXRoaXMucGlja2VyU21hcnRQb3NpdGlvbikge1xyXG5cdFx0XHRcdFx0dmFyIHBwID0gW1xyXG5cdFx0XHRcdFx0XHR0cFthXSxcclxuXHRcdFx0XHRcdFx0dHBbYl0rdHNbYl0tbCtsKmNcclxuXHRcdFx0XHRcdF07XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHZhciBwcCA9IFtcclxuXHRcdFx0XHRcdFx0LXZwW2FdK3RwW2FdK3BzW2FdID4gdnNbYV0gP1xyXG5cdFx0XHRcdFx0XHRcdCgtdnBbYV0rdHBbYV0rdHNbYV0vMiA+IHZzW2FdLzIgJiYgdHBbYV0rdHNbYV0tcHNbYV0gPj0gMCA/IHRwW2FdK3RzW2FdLXBzW2FdIDogdHBbYV0pIDpcclxuXHRcdFx0XHRcdFx0XHR0cFthXSxcclxuXHRcdFx0XHRcdFx0LXZwW2JdK3RwW2JdK3RzW2JdK3BzW2JdLWwrbCpjID4gdnNbYl0gP1xyXG5cdFx0XHRcdFx0XHRcdCgtdnBbYl0rdHBbYl0rdHNbYl0vMiA+IHZzW2JdLzIgJiYgdHBbYl0rdHNbYl0tbC1sKmMgPj0gMCA/IHRwW2JdK3RzW2JdLWwtbCpjIDogdHBbYl0rdHNbYl0tbCtsKmMpIDpcclxuXHRcdFx0XHRcdFx0XHQodHBbYl0rdHNbYl0tbCtsKmMgPj0gMCA/IHRwW2JdK3RzW2JdLWwrbCpjIDogdHBbYl0rdHNbYl0tbC1sKmMpXHJcblx0XHRcdFx0XHRdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRkcmF3UGlja2VyKHBwW2FdLCBwcFtiXSk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cclxuXHRcdHRoaXMuaW1wb3J0Q29sb3IgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0aWYoIXZhbHVlRWxlbWVudCkge1xyXG5cdFx0XHRcdHRoaXMuZXhwb3J0Q29sb3IoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZighdGhpcy5hZGp1c3QpIHtcclxuXHRcdFx0XHRcdGlmKCF0aGlzLmZyb21TdHJpbmcodmFsdWVFbGVtZW50LnZhbHVlLCBsZWF2ZVZhbHVlKSkge1xyXG5cdFx0XHRcdFx0XHRzdHlsZUVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gc3R5bGVFbGVtZW50LmpzY1N0eWxlLmJhY2tncm91bmRJbWFnZTtcclxuXHRcdFx0XHRcdFx0c3R5bGVFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHN0eWxlRWxlbWVudC5qc2NTdHlsZS5iYWNrZ3JvdW5kQ29sb3I7XHJcblx0XHRcdFx0XHRcdHN0eWxlRWxlbWVudC5zdHlsZS5jb2xvciA9IHN0eWxlRWxlbWVudC5qc2NTdHlsZS5jb2xvcjtcclxuXHRcdFx0XHRcdFx0dGhpcy5leHBvcnRDb2xvcihsZWF2ZVZhbHVlIHwgbGVhdmVTdHlsZSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIGlmKCF0aGlzLnJlcXVpcmVkICYmIC9eXFxzKiQvLnRlc3QodmFsdWVFbGVtZW50LnZhbHVlKSkge1xyXG5cdFx0XHRcdFx0dmFsdWVFbGVtZW50LnZhbHVlID0gJyc7XHJcblx0XHRcdFx0XHRzdHlsZUVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gc3R5bGVFbGVtZW50LmpzY1N0eWxlLmJhY2tncm91bmRJbWFnZTtcclxuXHRcdFx0XHRcdHN0eWxlRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBzdHlsZUVsZW1lbnQuanNjU3R5bGUuYmFja2dyb3VuZENvbG9yO1xyXG5cdFx0XHRcdFx0c3R5bGVFbGVtZW50LnN0eWxlLmNvbG9yID0gc3R5bGVFbGVtZW50LmpzY1N0eWxlLmNvbG9yO1xyXG5cdFx0XHRcdFx0dGhpcy5leHBvcnRDb2xvcihsZWF2ZVZhbHVlIHwgbGVhdmVTdHlsZSk7XHJcblxyXG5cdFx0XHRcdH0gZWxzZSBpZih0aGlzLmZyb21TdHJpbmcodmFsdWVFbGVtZW50LnZhbHVlKSkge1xyXG5cdFx0XHRcdFx0Ly8gT0tcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy5leHBvcnRDb2xvcigpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dGhpcy5leHBvcnRDb2xvciA9IGZ1bmN0aW9uKGZsYWdzKSB7XHJcblx0XHRcdGlmKCEoZmxhZ3MgJiBsZWF2ZVZhbHVlKSAmJiB2YWx1ZUVsZW1lbnQpIHtcclxuXHRcdFx0XHR2YXIgdmFsdWUgPSB0aGlzLnRvU3RyaW5nKCk7XHJcblx0XHRcdFx0aWYodGhpcy5jYXBzKSB7IHZhbHVlID0gdmFsdWUudG9VcHBlckNhc2UoKTsgfVxyXG5cdFx0XHRcdGlmKHRoaXMuaGFzaCkgeyB2YWx1ZSA9ICcjJyt2YWx1ZTsgfVxyXG5cdFx0XHRcdHZhbHVlRWxlbWVudC52YWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCEoZmxhZ3MgJiBsZWF2ZVN0eWxlKSAmJiBzdHlsZUVsZW1lbnQpIHtcclxuXHRcdFx0XHRzdHlsZUVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJub25lXCI7XHJcblx0XHRcdFx0c3R5bGVFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9XHJcblx0XHRcdFx0XHQnIycrdGhpcy50b1N0cmluZygpO1xyXG5cdFx0XHRcdHN0eWxlRWxlbWVudC5zdHlsZS5jb2xvciA9XHJcblx0XHRcdFx0XHQwLjIxMyAqIHRoaXMucmdiWzBdICtcclxuXHRcdFx0XHRcdDAuNzE1ICogdGhpcy5yZ2JbMV0gK1xyXG5cdFx0XHRcdFx0MC4wNzIgKiB0aGlzLnJnYlsyXVxyXG5cdFx0XHRcdFx0PCAwLjUgPyAnI0ZGRicgOiAnIzAwMCc7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoIShmbGFncyAmIGxlYXZlUGFkKSAmJiBpc1BpY2tlck93bmVyKCkpIHtcclxuXHRcdFx0XHRyZWRyYXdQYWQoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZighKGZsYWdzICYgbGVhdmVTbGQpICYmIGlzUGlja2VyT3duZXIoKSkge1xyXG5cdFx0XHRcdHJlZHJhd1NsZCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLmZyb21IU1YgPSBmdW5jdGlvbihoLCBzLCB2LCBmbGFncykgeyAvLyBudWxsID0gZG9uJ3QgY2hhbmdlXHJcblx0XHRcdGlmKGggIT09IG51bGwpIHsgaCA9IE1hdGgubWF4KDAuMCwgdGhpcy5taW5ILCBNYXRoLm1pbig2LjAsIHRoaXMubWF4SCwgaCkpOyB9XHJcblx0XHRcdGlmKHMgIT09IG51bGwpIHsgcyA9IE1hdGgubWF4KDAuMCwgdGhpcy5taW5TLCBNYXRoLm1pbigxLjAsIHRoaXMubWF4UywgcykpOyB9XHJcblx0XHRcdGlmKHYgIT09IG51bGwpIHsgdiA9IE1hdGgubWF4KDAuMCwgdGhpcy5taW5WLCBNYXRoLm1pbigxLjAsIHRoaXMubWF4ViwgdikpOyB9XHJcblxyXG5cdFx0XHR0aGlzLnJnYiA9IEhTVl9SR0IoXHJcblx0XHRcdFx0aD09PW51bGwgPyB0aGlzLmhzdlswXSA6ICh0aGlzLmhzdlswXT1oKSxcclxuXHRcdFx0XHRzPT09bnVsbCA/IHRoaXMuaHN2WzFdIDogKHRoaXMuaHN2WzFdPXMpLFxyXG5cdFx0XHRcdHY9PT1udWxsID8gdGhpcy5oc3ZbMl0gOiAodGhpcy5oc3ZbMl09dilcclxuXHRcdFx0KTtcclxuXHJcblx0XHRcdHRoaXMuZXhwb3J0Q29sb3IoZmxhZ3MpO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dGhpcy5mcm9tUkdCID0gZnVuY3Rpb24ociwgZywgYiwgZmxhZ3MpIHsgLy8gbnVsbCA9IGRvbid0IGNoYW5nZVxyXG5cdFx0XHRpZihyICE9PSBudWxsKSB7IHIgPSBNYXRoLm1heCgwLjAsIE1hdGgubWluKDEuMCwgcikpOyB9XHJcblx0XHRcdGlmKGcgIT09IG51bGwpIHsgZyA9IE1hdGgubWF4KDAuMCwgTWF0aC5taW4oMS4wLCBnKSk7IH1cclxuXHRcdFx0aWYoYiAhPT0gbnVsbCkgeyBiID0gTWF0aC5tYXgoMC4wLCBNYXRoLm1pbigxLjAsIGIpKTsgfVxyXG5cclxuXHRcdFx0dmFyIGhzdiA9IFJHQl9IU1YoXHJcblx0XHRcdFx0cj09PW51bGwgPyB0aGlzLnJnYlswXSA6IHIsXHJcblx0XHRcdFx0Zz09PW51bGwgPyB0aGlzLnJnYlsxXSA6IGcsXHJcblx0XHRcdFx0Yj09PW51bGwgPyB0aGlzLnJnYlsyXSA6IGJcclxuXHRcdFx0KTtcclxuXHRcdFx0aWYoaHN2WzBdICE9PSBudWxsKSB7XHJcblx0XHRcdFx0dGhpcy5oc3ZbMF0gPSBNYXRoLm1heCgwLjAsIHRoaXMubWluSCwgTWF0aC5taW4oNi4wLCB0aGlzLm1heEgsIGhzdlswXSkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGhzdlsyXSAhPT0gMCkge1xyXG5cdFx0XHRcdHRoaXMuaHN2WzFdID0gaHN2WzFdPT09bnVsbCA/IG51bGwgOiBNYXRoLm1heCgwLjAsIHRoaXMubWluUywgTWF0aC5taW4oMS4wLCB0aGlzLm1heFMsIGhzdlsxXSkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuaHN2WzJdID0gaHN2WzJdPT09bnVsbCA/IG51bGwgOiBNYXRoLm1heCgwLjAsIHRoaXMubWluViwgTWF0aC5taW4oMS4wLCB0aGlzLm1heFYsIGhzdlsyXSkpO1xyXG5cclxuXHRcdFx0Ly8gdXBkYXRlIFJHQiBhY2NvcmRpbmcgdG8gZmluYWwgSFNWLCBhcyBzb21lIHZhbHVlcyBtaWdodCBiZSB0cmltbWVkXHJcblx0XHRcdHZhciByZ2IgPSBIU1ZfUkdCKHRoaXMuaHN2WzBdLCB0aGlzLmhzdlsxXSwgdGhpcy5oc3ZbMl0pO1xyXG5cdFx0XHR0aGlzLnJnYlswXSA9IHJnYlswXTtcclxuXHRcdFx0dGhpcy5yZ2JbMV0gPSByZ2JbMV07XHJcblx0XHRcdHRoaXMucmdiWzJdID0gcmdiWzJdO1xyXG5cclxuXHRcdFx0dGhpcy5leHBvcnRDb2xvcihmbGFncyk7XHJcblx0XHR9O1xyXG5cclxuXHJcblx0XHR0aGlzLmZyb21TdHJpbmcgPSBmdW5jdGlvbihoZXgsIGZsYWdzKSB7XHJcblx0XHRcdHZhciBtID0gaGV4Lm1hdGNoKC9eXFxXKihbMC05QS1GXXszfShbMC05QS1GXXszfSk/KVxcVyokL2kpO1xyXG5cdFx0XHRpZighbSkge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZihtWzFdLmxlbmd0aCA9PT0gNikgeyAvLyA2LWNoYXIgbm90YXRpb25cclxuXHRcdFx0XHRcdHRoaXMuZnJvbVJHQihcclxuXHRcdFx0XHRcdFx0cGFyc2VJbnQobVsxXS5zdWJzdHIoMCwyKSwxNikgLyAyNTUsXHJcblx0XHRcdFx0XHRcdHBhcnNlSW50KG1bMV0uc3Vic3RyKDIsMiksMTYpIC8gMjU1LFxyXG5cdFx0XHRcdFx0XHRwYXJzZUludChtWzFdLnN1YnN0cig0LDIpLDE2KSAvIDI1NSxcclxuXHRcdFx0XHRcdFx0ZmxhZ3NcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0fSBlbHNlIHsgLy8gMy1jaGFyIG5vdGF0aW9uXHJcblx0XHRcdFx0XHR0aGlzLmZyb21SR0IoXHJcblx0XHRcdFx0XHRcdHBhcnNlSW50KG1bMV0uY2hhckF0KDApK21bMV0uY2hhckF0KDApLDE2KSAvIDI1NSxcclxuXHRcdFx0XHRcdFx0cGFyc2VJbnQobVsxXS5jaGFyQXQoMSkrbVsxXS5jaGFyQXQoMSksMTYpIC8gMjU1LFxyXG5cdFx0XHRcdFx0XHRwYXJzZUludChtWzFdLmNoYXJBdCgyKSttWzFdLmNoYXJBdCgyKSwxNikgLyAyNTUsXHJcblx0XHRcdFx0XHRcdGZsYWdzXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0dGhpcy50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdCgweDEwMCB8IE1hdGgucm91bmQoMjU1KnRoaXMucmdiWzBdKSkudG9TdHJpbmcoMTYpLnN1YnN0cigxKSArXHJcblx0XHRcdFx0KDB4MTAwIHwgTWF0aC5yb3VuZCgyNTUqdGhpcy5yZ2JbMV0pKS50b1N0cmluZygxNikuc3Vic3RyKDEpICtcclxuXHRcdFx0XHQoMHgxMDAgfCBNYXRoLnJvdW5kKDI1NSp0aGlzLnJnYlsyXSkpLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSlcclxuXHRcdFx0KTtcclxuXHRcdH07XHJcblxyXG5cclxuXHRcdGZ1bmN0aW9uIFJHQl9IU1YociwgZywgYikge1xyXG5cdFx0XHR2YXIgbiA9IE1hdGgubWluKE1hdGgubWluKHIsZyksYik7XHJcblx0XHRcdHZhciB2ID0gTWF0aC5tYXgoTWF0aC5tYXgocixnKSxiKTtcclxuXHRcdFx0dmFyIG0gPSB2IC0gbjtcclxuXHRcdFx0aWYobSA9PT0gMCkgeyByZXR1cm4gWyBudWxsLCAwLCB2IF07IH1cclxuXHRcdFx0dmFyIGggPSByPT09biA/IDMrKGItZykvbSA6IChnPT09biA/IDUrKHItYikvbSA6IDErKGctcikvbSk7XHJcblx0XHRcdHJldHVybiBbIGg9PT02PzA6aCwgbS92LCB2IF07XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGZ1bmN0aW9uIEhTVl9SR0IoaCwgcywgdikge1xyXG5cdFx0XHRpZihoID09PSBudWxsKSB7IHJldHVybiBbIHYsIHYsIHYgXTsgfVxyXG5cdFx0XHR2YXIgaSA9IE1hdGguZmxvb3IoaCk7XHJcblx0XHRcdHZhciBmID0gaSUyID8gaC1pIDogMS0oaC1pKTtcclxuXHRcdFx0dmFyIG0gPSB2ICogKDEgLSBzKTtcclxuXHRcdFx0dmFyIG4gPSB2ICogKDEgLSBzKmYpO1xyXG5cdFx0XHRzd2l0Y2goaSkge1xyXG5cdFx0XHRcdGNhc2UgNjpcclxuXHRcdFx0XHRjYXNlIDA6IHJldHVybiBbdixuLG1dO1xyXG5cdFx0XHRcdGNhc2UgMTogcmV0dXJuIFtuLHYsbV07XHJcblx0XHRcdFx0Y2FzZSAyOiByZXR1cm4gW20sdixuXTtcclxuXHRcdFx0XHRjYXNlIDM6IHJldHVybiBbbSxuLHZdO1xyXG5cdFx0XHRcdGNhc2UgNDogcmV0dXJuIFtuLG0sdl07XHJcblx0XHRcdFx0Y2FzZSA1OiByZXR1cm4gW3YsbSxuXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRmdW5jdGlvbiByZW1vdmVQaWNrZXIoKSB7XHJcblx0XHRcdGpzY29sb3IucGlja2VyLm93bmVyLnN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGpzY29sb3IucGlja2VyLmJveEIpO1xyXG5cdFx0XHRkZWxldGUganNjb2xvci5waWNrZXIub3duZXI7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGZ1bmN0aW9uIGRyYXdQaWNrZXIoeCwgeSkge1xyXG5cdFx0XHRpZighanNjb2xvci5waWNrZXIpIHtcclxuXHRcdFx0XHRqc2NvbG9yLnBpY2tlciA9IHtcclxuXHRcdFx0XHRcdGJveCA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxyXG5cdFx0XHRcdFx0Ym94QiA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxyXG5cdFx0XHRcdFx0cGFkIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXHJcblx0XHRcdFx0XHRwYWRCIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXHJcblx0XHRcdFx0XHRwYWRNIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXHJcblx0XHRcdFx0XHRzbGQgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuXHRcdFx0XHRcdHNsZEIgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuXHRcdFx0XHRcdHNsZE0gOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuXHRcdFx0XHRcdGJ0biA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxyXG5cdFx0XHRcdFx0YnRuUyA6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSxcclxuXHRcdFx0XHRcdGJ0blQgOiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShUSElTLnBpY2tlckNsb3NlVGV4dClcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGZvcih2YXIgaT0wLHNlZ1NpemU9NDsgaTxqc2NvbG9yLmltYWdlcy5zbGRbMV07IGkrPXNlZ1NpemUpIHtcclxuXHRcdFx0XHRcdHZhciBzZWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFx0XHRcdHNlZy5zdHlsZS5oZWlnaHQgPSBzZWdTaXplKydweCc7XHJcblx0XHRcdFx0XHRzZWcuc3R5bGUuZm9udFNpemUgPSAnMXB4JztcclxuXHRcdFx0XHRcdHNlZy5zdHlsZS5saW5lSGVpZ2h0ID0gJzAnO1xyXG5cdFx0XHRcdFx0anNjb2xvci5waWNrZXIuc2xkLmFwcGVuZENoaWxkKHNlZyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGpzY29sb3IucGlja2VyLnNsZEIuYXBwZW5kQ2hpbGQoanNjb2xvci5waWNrZXIuc2xkKTtcclxuXHRcdFx0XHRqc2NvbG9yLnBpY2tlci5ib3guYXBwZW5kQ2hpbGQoanNjb2xvci5waWNrZXIuc2xkQik7XHJcblx0XHRcdFx0anNjb2xvci5waWNrZXIuYm94LmFwcGVuZENoaWxkKGpzY29sb3IucGlja2VyLnNsZE0pO1xyXG5cdFx0XHRcdGpzY29sb3IucGlja2VyLnBhZEIuYXBwZW5kQ2hpbGQoanNjb2xvci5waWNrZXIucGFkKTtcclxuXHRcdFx0XHRqc2NvbG9yLnBpY2tlci5ib3guYXBwZW5kQ2hpbGQoanNjb2xvci5waWNrZXIucGFkQik7XHJcblx0XHRcdFx0anNjb2xvci5waWNrZXIuYm94LmFwcGVuZENoaWxkKGpzY29sb3IucGlja2VyLnBhZE0pO1xyXG5cdFx0XHRcdGpzY29sb3IucGlja2VyLmJ0blMuYXBwZW5kQ2hpbGQoanNjb2xvci5waWNrZXIuYnRuVCk7XHJcblx0XHRcdFx0anNjb2xvci5waWNrZXIuYnRuLmFwcGVuZENoaWxkKGpzY29sb3IucGlja2VyLmJ0blMpO1xyXG5cdFx0XHRcdGpzY29sb3IucGlja2VyLmJveC5hcHBlbmRDaGlsZChqc2NvbG9yLnBpY2tlci5idG4pO1xyXG5cdFx0XHRcdGpzY29sb3IucGlja2VyLmJveEIuYXBwZW5kQ2hpbGQoanNjb2xvci5waWNrZXIuYm94KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIHAgPSBqc2NvbG9yLnBpY2tlcjtcclxuXHJcblx0XHRcdC8vIGNvbnRyb2xzIGludGVyYWN0aW9uXHJcblx0XHRcdHAuYm94Lm9ubW91c2V1cCA9XHJcblx0XHRcdHAuYm94Lm9ubW91c2VvdXQgPSBmdW5jdGlvbigpIHsgdGFyZ2V0LmZvY3VzKCk7IH07XHJcblx0XHRcdHAuYm94Lm9ubW91c2Vkb3duID0gZnVuY3Rpb24oKSB7IGFib3J0Qmx1cj10cnVlOyB9O1xyXG5cdFx0XHRwLmJveC5vbm1vdXNlbW92ZSA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRpZiAoaG9sZFBhZCB8fCBob2xkU2xkKSB7XHJcblx0XHRcdFx0XHRob2xkUGFkICYmIHNldFBhZChlKTtcclxuXHRcdFx0XHRcdGhvbGRTbGQgJiYgc2V0U2xkKGUpO1xyXG5cdFx0XHRcdFx0aWYgKGRvY3VtZW50LnNlbGVjdGlvbikge1xyXG5cdFx0XHRcdFx0XHRkb2N1bWVudC5zZWxlY3Rpb24uZW1wdHkoKTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAod2luZG93LmdldFNlbGVjdGlvbikge1xyXG5cdFx0XHRcdFx0XHR3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRkaXNwYXRjaEltbWVkaWF0ZUNoYW5nZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0aWYoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB7IC8vIGlmIHRvdWNoIGRldmljZVxyXG5cdFx0XHRcdHZhciBoYW5kbGVfdG91Y2htb3ZlID0gZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdFx0dmFyIGV2ZW50PXtcclxuXHRcdFx0XHRcdFx0J29mZnNldFgnOiBlLnRvdWNoZXNbMF0ucGFnZVgtdG91Y2hPZmZzZXQuWCxcclxuXHRcdFx0XHRcdFx0J29mZnNldFknOiBlLnRvdWNoZXNbMF0ucGFnZVktdG91Y2hPZmZzZXQuWVxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdGlmIChob2xkUGFkIHx8IGhvbGRTbGQpIHtcclxuXHRcdFx0XHRcdFx0aG9sZFBhZCAmJiBzZXRQYWQoZXZlbnQpO1xyXG5cdFx0XHRcdFx0XHRob2xkU2xkICYmIHNldFNsZChldmVudCk7XHJcblx0XHRcdFx0XHRcdGRpc3BhdGNoSW1tZWRpYXRlQ2hhbmdlKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpOyAvLyBwcmV2ZW50IG1vdmUgXCJ2aWV3XCIgb24gYnJvc3dlclxyXG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyBwcmV2ZW50IERlZmF1bHQgLSBBbmRyb2lkIEZpeCAoZWxzZSBhbmRyb2lkIGdlbmVyYXRlZCBvbmx5IDEtMiB0b3VjaG1vdmUgZXZlbnRzKVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0cC5ib3gucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgaGFuZGxlX3RvdWNobW92ZSwgZmFsc2UpXHJcblx0XHRcdFx0cC5ib3guYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgaGFuZGxlX3RvdWNobW92ZSwgZmFsc2UpXHJcblx0XHRcdH1cclxuXHRcdFx0cC5wYWRNLm9ubW91c2V1cCA9XHJcblx0XHRcdHAucGFkTS5vbm1vdXNlb3V0ID0gZnVuY3Rpb24oKSB7IGlmKGhvbGRQYWQpIHsgaG9sZFBhZD1mYWxzZTsganNjb2xvci5maXJlRXZlbnQodmFsdWVFbGVtZW50LCdjaGFuZ2UnKTsgfSB9O1xyXG5cdFx0XHRwLnBhZE0ub25tb3VzZWRvd24gPSBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0Ly8gaWYgdGhlIHNsaWRlciBpcyBhdCB0aGUgYm90dG9tLCBtb3ZlIGl0IHVwXHJcblx0XHRcdFx0c3dpdGNoKG1vZGVJRCkge1xyXG5cdFx0XHRcdFx0Y2FzZSAwOiBpZiAoVEhJUy5oc3ZbMl0gPT09IDApIHsgVEhJUy5mcm9tSFNWKG51bGwsIG51bGwsIDEuMCk7IH07IGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAxOiBpZiAoVEhJUy5oc3ZbMV0gPT09IDApIHsgVEhJUy5mcm9tSFNWKG51bGwsIDEuMCwgbnVsbCk7IH07IGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRob2xkU2xkPWZhbHNlO1xyXG5cdFx0XHRcdGhvbGRQYWQ9dHJ1ZTtcclxuXHRcdFx0XHRzZXRQYWQoZSk7XHJcblx0XHRcdFx0ZGlzcGF0Y2hJbW1lZGlhdGVDaGFuZ2UoKTtcclxuXHRcdFx0fTtcclxuXHRcdFx0aWYoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB7XHJcblx0XHRcdFx0cC5wYWRNLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0XHR0b3VjaE9mZnNldD17XHJcblx0XHRcdFx0XHRcdCdYJzogZS50YXJnZXQub2Zmc2V0UGFyZW50Lm9mZnNldExlZnQsXHJcblx0XHRcdFx0XHRcdCdZJzogZS50YXJnZXQub2Zmc2V0UGFyZW50Lm9mZnNldFRvcFxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdHRoaXMub25tb3VzZWRvd24oe1xyXG5cdFx0XHRcdFx0XHQnb2Zmc2V0WCc6ZS50b3VjaGVzWzBdLnBhZ2VYLXRvdWNoT2Zmc2V0LlgsXHJcblx0XHRcdFx0XHRcdCdvZmZzZXRZJzplLnRvdWNoZXNbMF0ucGFnZVktdG91Y2hPZmZzZXQuWVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cC5zbGRNLm9ubW91c2V1cCA9XHJcblx0XHRcdHAuc2xkTS5vbm1vdXNlb3V0ID0gZnVuY3Rpb24oKSB7IGlmKGhvbGRTbGQpIHsgaG9sZFNsZD1mYWxzZTsganNjb2xvci5maXJlRXZlbnQodmFsdWVFbGVtZW50LCdjaGFuZ2UnKTsgfSB9O1xyXG5cdFx0XHRwLnNsZE0ub25tb3VzZWRvd24gPSBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0aG9sZFBhZD1mYWxzZTtcclxuXHRcdFx0XHRob2xkU2xkPXRydWU7XHJcblx0XHRcdFx0c2V0U2xkKGUpO1xyXG5cdFx0XHRcdGRpc3BhdGNoSW1tZWRpYXRlQ2hhbmdlKCk7XHJcblx0XHRcdH07XHJcblx0XHRcdGlmKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdykge1xyXG5cdFx0XHRcdHAuc2xkTS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdFx0dG91Y2hPZmZzZXQ9e1xyXG5cdFx0XHRcdFx0XHQnWCc6IGUudGFyZ2V0Lm9mZnNldFBhcmVudC5vZmZzZXRMZWZ0LFxyXG5cdFx0XHRcdFx0XHQnWSc6IGUudGFyZ2V0Lm9mZnNldFBhcmVudC5vZmZzZXRUb3BcclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHR0aGlzLm9ubW91c2Vkb3duKHtcclxuXHRcdFx0XHRcdFx0J29mZnNldFgnOmUudG91Y2hlc1swXS5wYWdlWC10b3VjaE9mZnNldC5YLFxyXG5cdFx0XHRcdFx0XHQnb2Zmc2V0WSc6ZS50b3VjaGVzWzBdLnBhZ2VZLXRvdWNoT2Zmc2V0LllcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBwaWNrZXJcclxuXHRcdFx0dmFyIGRpbXMgPSBnZXRQaWNrZXJEaW1zKFRISVMpO1xyXG5cdFx0XHRwLmJveC5zdHlsZS53aWR0aCA9IGRpbXNbMF0gKyAncHgnO1xyXG5cdFx0XHRwLmJveC5zdHlsZS5oZWlnaHQgPSBkaW1zWzFdICsgJ3B4JztcclxuXHJcblx0XHRcdC8vIHBpY2tlciBib3JkZXJcclxuXHRcdFx0cC5ib3hCLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuXHRcdFx0cC5ib3hCLnN0eWxlLmNsZWFyID0gJ2JvdGgnO1xyXG5cdFx0XHRwLmJveEIuc3R5bGUubGVmdCA9ICcwcHgnO1xyXG5cdFx0XHRwLmJveEIuc3R5bGUudG9wID0gJzEwMCUnO1xyXG5cdFx0XHRwLmJveEIuc3R5bGUubWFyZ2luVG9wID0gJzJweCc7XHJcblx0XHRcdHAuYm94Qi5zdHlsZS56SW5kZXggPSBUSElTLnBpY2tlclpJbmRleDtcclxuXHRcdFx0cC5ib3hCLnN0eWxlLmJvcmRlciA9IFRISVMucGlja2VyQm9yZGVyKydweCBzb2xpZCc7XHJcblx0XHRcdHAuYm94Qi5zdHlsZS5ib3JkZXJDb2xvciA9IFRISVMucGlja2VyQm9yZGVyQ29sb3I7XHJcblx0XHRcdHAuYm94Qi5zdHlsZS5iYWNrZ3JvdW5kID0gVEhJUy5waWNrZXJGYWNlQ29sb3I7XHJcblxyXG5cdFx0XHQvLyBwYWQgaW1hZ2VcclxuXHRcdFx0cC5wYWQuc3R5bGUud2lkdGggPSBqc2NvbG9yLmltYWdlcy5wYWRbMF0rJ3B4JztcclxuXHRcdFx0cC5wYWQuc3R5bGUuaGVpZ2h0ID0ganNjb2xvci5pbWFnZXMucGFkWzFdKydweCc7XHJcblxyXG5cdFx0XHQvLyBwYWQgYm9yZGVyXHJcblx0XHRcdHAucGFkQi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcblx0XHRcdHAucGFkQi5zdHlsZS5sZWZ0ID0gVEhJUy5waWNrZXJGYWNlKydweCc7XHJcblx0XHRcdHAucGFkQi5zdHlsZS50b3AgPSAnMTBweCc7XHJcblx0XHRcdHAucGFkQi5zdHlsZS5ib3JkZXIgPSBUSElTLnBpY2tlckluc2V0KydweCBzb2xpZCc7XHJcblx0XHRcdHAucGFkQi5zdHlsZS5ib3JkZXJDb2xvciA9IFRISVMucGlja2VySW5zZXRDb2xvcjtcclxuXHJcblx0XHRcdC8vIHBhZCBtb3VzZSBhcmVhXHJcblx0XHRcdHAucGFkTS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcblx0XHRcdHAucGFkTS5zdHlsZS5sZWZ0ID0gJzAnO1xyXG5cdFx0XHRwLnBhZE0uc3R5bGUudG9wID0gJzAnO1xyXG5cdFx0XHRwLnBhZE0uc3R5bGUud2lkdGggPSBUSElTLnBpY2tlckZhY2UgKyAyKlRISVMucGlja2VySW5zZXQgKyBqc2NvbG9yLmltYWdlcy5wYWRbMF0gKyBqc2NvbG9yLmltYWdlcy5hcnJvd1swXSArICdweCc7XHJcblx0XHRcdHAucGFkTS5zdHlsZS5oZWlnaHQgPSBwLmJveC5zdHlsZS5oZWlnaHQ7XHJcblx0XHRcdHAucGFkTS5zdHlsZS5jdXJzb3IgPSAnY3Jvc3NoYWlyJztcclxuXHJcblx0XHRcdC8vIHNsaWRlciBpbWFnZVxyXG5cdFx0XHRwLnNsZC5zdHlsZS5vdmVyZmxvdyA9ICdoaWRkZW4nO1xyXG5cdFx0XHRwLnNsZC5zdHlsZS53aWR0aCA9IGpzY29sb3IuaW1hZ2VzLnNsZFswXSsncHgnO1xyXG5cdFx0XHRwLnNsZC5zdHlsZS5oZWlnaHQgPSBqc2NvbG9yLmltYWdlcy5zbGRbMV0rJ3B4JztcclxuXHJcblx0XHRcdC8vIHNsaWRlciBib3JkZXJcclxuXHRcdFx0cC5zbGRCLnN0eWxlLmRpc3BsYXkgPSBUSElTLnNsaWRlciA/ICdibG9jaycgOiAnbm9uZSc7XHJcblx0XHRcdHAuc2xkQi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcblx0XHRcdHAuc2xkQi5zdHlsZS5yaWdodCA9IFRISVMucGlja2VyRmFjZSsncHgnO1xyXG5cdFx0XHRwLnNsZEIuc3R5bGUudG9wID0gVEhJUy5waWNrZXJGYWNlKydweCc7XHJcblx0XHRcdHAuc2xkQi5zdHlsZS5ib3JkZXIgPSBUSElTLnBpY2tlckluc2V0KydweCBzb2xpZCc7XHJcblx0XHRcdHAuc2xkQi5zdHlsZS5ib3JkZXJDb2xvciA9IFRISVMucGlja2VySW5zZXRDb2xvcjtcclxuXHJcblx0XHRcdC8vIHNsaWRlciBtb3VzZSBhcmVhXHJcblx0XHRcdHAuc2xkTS5zdHlsZS5kaXNwbGF5ID0gVEhJUy5zbGlkZXIgPyAnYmxvY2snIDogJ25vbmUnO1xyXG5cdFx0XHRwLnNsZE0uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG5cdFx0XHRwLnNsZE0uc3R5bGUucmlnaHQgPSAnMCc7XHJcblx0XHRcdHAuc2xkTS5zdHlsZS50b3AgPSAnMCc7XHJcblx0XHRcdHAuc2xkTS5zdHlsZS53aWR0aCA9IGpzY29sb3IuaW1hZ2VzLnNsZFswXSArIGpzY29sb3IuaW1hZ2VzLmFycm93WzBdICsgVEhJUy5waWNrZXJGYWNlICsgMipUSElTLnBpY2tlckluc2V0ICsgJ3B4JztcclxuXHRcdFx0cC5zbGRNLnN0eWxlLmhlaWdodCA9IHAuYm94LnN0eWxlLmhlaWdodDtcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRwLnNsZE0uc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInO1xyXG5cdFx0XHR9IGNhdGNoKGVPbGRJRSkge1xyXG5cdFx0XHRcdHAuc2xkTS5zdHlsZS5jdXJzb3IgPSAnaGFuZCc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFwiY2xvc2VcIiBidXR0b25cclxuXHRcdFx0ZnVuY3Rpb24gc2V0QnRuQm9yZGVyKCkge1xyXG5cdFx0XHRcdHZhciBpbnNldENvbG9ycyA9IFRISVMucGlja2VySW5zZXRDb2xvci5zcGxpdCgvXFxzKy8pO1xyXG5cdFx0XHRcdHZhciBwaWNrZXJPdXRzZXRDb2xvciA9IGluc2V0Q29sb3JzLmxlbmd0aCA8IDIgPyBpbnNldENvbG9yc1swXSA6IGluc2V0Q29sb3JzWzFdICsgJyAnICsgaW5zZXRDb2xvcnNbMF0gKyAnICcgKyBpbnNldENvbG9yc1swXSArICcgJyArIGluc2V0Q29sb3JzWzFdO1xyXG5cdFx0XHRcdHAuYnRuLnN0eWxlLmJvcmRlckNvbG9yID0gcGlja2VyT3V0c2V0Q29sb3I7XHJcblx0XHRcdH1cclxuXHRcdFx0cC5idG4uc3R5bGUuZGlzcGxheSA9IFRISVMucGlja2VyQ2xvc2FibGUgPyAnYmxvY2snIDogJ25vbmUnO1xyXG5cdFx0XHRwLmJ0bi5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcblx0XHRcdHAuYnRuLnN0eWxlLmxlZnQgPSBUSElTLnBpY2tlckZhY2UgKyAncHgnO1xyXG5cdFx0XHRwLmJ0bi5zdHlsZS5ib3R0b20gPSBUSElTLnBpY2tlckZhY2UgKyAncHgnO1xyXG5cdFx0XHRwLmJ0bi5zdHlsZS5wYWRkaW5nID0gJzAgMTVweCc7XHJcblx0XHRcdHAuYnRuLnN0eWxlLmhlaWdodCA9ICcxOHB4JztcclxuXHRcdFx0cC5idG4uc3R5bGUuYm9yZGVyID0gVEhJUy5waWNrZXJJbnNldCArICdweCBzb2xpZCc7XHJcblx0XHRcdHNldEJ0bkJvcmRlcigpO1xyXG5cdFx0XHRwLmJ0bi5zdHlsZS5jb2xvciA9IFRISVMucGlja2VyQnV0dG9uQ29sb3I7XHJcblx0XHRcdHAuYnRuLnN0eWxlLmZvbnQgPSAnMTJweCBzYW5zLXNlcmlmJztcclxuXHRcdFx0cC5idG4uc3R5bGUudGV4dEFsaWduID0gJ2NlbnRlcic7XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0cC5idG4uc3R5bGUuY3Vyc29yID0gJ3BvaW50ZXInO1xyXG5cdFx0XHR9IGNhdGNoKGVPbGRJRSkge1xyXG5cdFx0XHRcdHAuYnRuLnN0eWxlLmN1cnNvciA9ICdoYW5kJztcclxuXHRcdFx0fVxyXG5cdFx0XHRwLmJ0bi5vbm1vdXNlZG93biA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRUSElTLmhpZGVQaWNrZXIoKTtcclxuXHRcdFx0fTtcclxuXHRcdFx0cC5idG5TLnN0eWxlLmxpbmVIZWlnaHQgPSBwLmJ0bi5zdHlsZS5oZWlnaHQ7XHJcblxyXG5cdFx0XHQvLyBsb2FkIGltYWdlcyBpbiBvcHRpbWFsIG9yZGVyXHJcblx0XHRcdHN3aXRjaChtb2RlSUQpIHtcclxuXHRcdFx0XHRjYXNlIDA6IHZhciBwYWRJbWcgPSAnaHMucG5nJzsgYnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAxOiB2YXIgcGFkSW1nID0gJ2h2LnBuZyc7IGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHRcdHAucGFkTS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnXCIranNjb2xvci5nZXREaXIoKStcImNyb3NzLmdpZicpXCI7XHJcblx0XHRcdHAucGFkTS5zdHlsZS5iYWNrZ3JvdW5kUmVwZWF0ID0gXCJuby1yZXBlYXRcIjtcclxuXHRcdFx0cC5zbGRNLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCdcIitqc2NvbG9yLmdldERpcigpK1wiYXJyb3cuZ2lmJylcIjtcclxuXHRcdFx0cC5zbGRNLnN0eWxlLmJhY2tncm91bmRSZXBlYXQgPSBcIm5vLXJlcGVhdFwiO1xyXG5cdFx0XHRwLnBhZC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnXCIranNjb2xvci5nZXREaXIoKStwYWRJbWcrXCInKVwiO1xyXG5cdFx0XHRwLnBhZC5zdHlsZS5iYWNrZ3JvdW5kUmVwZWF0ID0gXCJuby1yZXBlYXRcIjtcclxuXHRcdFx0cC5wYWQuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gXCIwIDBcIjtcclxuXHJcblx0XHRcdC8vIHBsYWNlIHBvaW50ZXJzXHJcblx0XHRcdHJlZHJhd1BhZCgpO1xyXG5cdFx0XHRyZWRyYXdTbGQoKTtcclxuXHJcblx0XHRcdGpzY29sb3IucGlja2VyLm93bmVyID0gVEhJUztcclxuXHJcblx0XHRcdGpzY29sb3IucGlja2VyLm93bmVyLnN0eWxlRWxlbWVudC5wYXJlbnROb2RlLmFwcGVuZENoaWxkKHAuYm94Qik7XHJcblx0XHRcdC8vIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQocC5ib3hCKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBnZXRQaWNrZXJEaW1zKG8pIHtcclxuXHRcdFx0dmFyIGRpbXMgPSBbXHJcblx0XHRcdFx0MipvLnBpY2tlckluc2V0ICsgMipvLnBpY2tlckZhY2UgKyBqc2NvbG9yLmltYWdlcy5wYWRbMF0gK1xyXG5cdFx0XHRcdFx0KG8uc2xpZGVyID8gMipvLnBpY2tlckluc2V0ICsgMipqc2NvbG9yLmltYWdlcy5hcnJvd1swXSArIGpzY29sb3IuaW1hZ2VzLnNsZFswXSA6IDApLFxyXG5cdFx0XHRcdG8ucGlja2VyQ2xvc2FibGUgP1xyXG5cdFx0XHRcdFx0NCpvLnBpY2tlckluc2V0ICsgMypvLnBpY2tlckZhY2UgKyBqc2NvbG9yLmltYWdlcy5wYWRbMV0gKyBvLnBpY2tlckJ1dHRvbkhlaWdodCA6XHJcblx0XHRcdFx0XHQyKm8ucGlja2VySW5zZXQgKyAyKm8ucGlja2VyRmFjZSArIGpzY29sb3IuaW1hZ2VzLnBhZFsxXVxyXG5cdFx0XHRdO1xyXG5cdFx0XHRyZXR1cm4gZGltcztcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0ZnVuY3Rpb24gcmVkcmF3UGFkKCkge1xyXG5cdFx0XHQvLyByZWRyYXcgdGhlIHBhZCBwb2ludGVyXHJcblx0XHRcdHN3aXRjaChtb2RlSUQpIHtcclxuXHRcdFx0XHRjYXNlIDA6IHZhciB5Q29tcG9uZW50ID0gMTsgYnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAxOiB2YXIgeUNvbXBvbmVudCA9IDI7IGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciB4ID0gTWF0aC5yb3VuZCgoVEhJUy5oc3ZbMF0vNikgKiAoanNjb2xvci5pbWFnZXMucGFkWzBdLTEpKTtcclxuXHRcdFx0dmFyIHkgPSBNYXRoLnJvdW5kKCgxLVRISVMuaHN2W3lDb21wb25lbnRdKSAqIChqc2NvbG9yLmltYWdlcy5wYWRbMV0tMSkpO1xyXG5cdFx0XHRqc2NvbG9yLnBpY2tlci5wYWRNLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9XHJcblx0XHRcdFx0KFRISVMucGlja2VyRmFjZStUSElTLnBpY2tlckluc2V0K3ggLSBNYXRoLmZsb29yKGpzY29sb3IuaW1hZ2VzLmNyb3NzWzBdLzIpKSArICdweCAnICtcclxuXHRcdFx0XHQoVEhJUy5waWNrZXJGYWNlK1RISVMucGlja2VySW5zZXQreSAtIE1hdGguZmxvb3IoanNjb2xvci5pbWFnZXMuY3Jvc3NbMV0vMikpICsgJ3B4JztcclxuXHJcblx0XHRcdC8vIHJlZHJhdyB0aGUgc2xpZGVyIGltYWdlXHJcblx0XHRcdHZhciBzZWcgPSBqc2NvbG9yLnBpY2tlci5zbGQuY2hpbGROb2RlcztcclxuXHJcblx0XHRcdHN3aXRjaChtb2RlSUQpIHtcclxuXHRcdFx0XHRjYXNlIDA6XHJcblx0XHRcdFx0XHR2YXIgcmdiID0gSFNWX1JHQihUSElTLmhzdlswXSwgVEhJUy5oc3ZbMV0sIDEpO1xyXG5cdFx0XHRcdFx0Zm9yKHZhciBpPTA7IGk8c2VnLmxlbmd0aDsgaSs9MSkge1xyXG5cdFx0XHRcdFx0XHRzZWdbaV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JnYignK1xyXG5cdFx0XHRcdFx0XHRcdChyZ2JbMF0qKDEtaS9zZWcubGVuZ3RoKSoxMDApKyclLCcrXHJcblx0XHRcdFx0XHRcdFx0KHJnYlsxXSooMS1pL3NlZy5sZW5ndGgpKjEwMCkrJyUsJytcclxuXHRcdFx0XHRcdFx0XHQocmdiWzJdKigxLWkvc2VnLmxlbmd0aCkqMTAwKSsnJSknO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAxOlxyXG5cdFx0XHRcdFx0dmFyIHJnYiwgcywgYyA9IFsgVEhJUy5oc3ZbMl0sIDAsIDAgXTtcclxuXHRcdFx0XHRcdHZhciBpID0gTWF0aC5mbG9vcihUSElTLmhzdlswXSk7XHJcblx0XHRcdFx0XHR2YXIgZiA9IGklMiA/IFRISVMuaHN2WzBdLWkgOiAxLShUSElTLmhzdlswXS1pKTtcclxuXHRcdFx0XHRcdHN3aXRjaChpKSB7XHJcblx0XHRcdFx0XHRcdGNhc2UgNjpcclxuXHRcdFx0XHRcdFx0Y2FzZSAwOiByZ2I9WzAsMSwyXTsgYnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgMTogcmdiPVsxLDAsMl07IGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlIDI6IHJnYj1bMiwwLDFdOyBicmVhaztcclxuXHRcdFx0XHRcdFx0Y2FzZSAzOiByZ2I9WzIsMSwwXTsgYnJlYWs7XHJcblx0XHRcdFx0XHRcdGNhc2UgNDogcmdiPVsxLDIsMF07IGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRjYXNlIDU6IHJnYj1bMCwyLDFdOyBicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGZvcih2YXIgaT0wOyBpPHNlZy5sZW5ndGg7IGkrPTEpIHtcclxuXHRcdFx0XHRcdFx0cyA9IDEgLSAxLyhzZWcubGVuZ3RoLTEpKmk7XHJcblx0XHRcdFx0XHRcdGNbMV0gPSBjWzBdICogKDEgLSBzKmYpO1xyXG5cdFx0XHRcdFx0XHRjWzJdID0gY1swXSAqICgxIC0gcyk7XHJcblx0XHRcdFx0XHRcdHNlZ1tpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiKCcrXHJcblx0XHRcdFx0XHRcdFx0KGNbcmdiWzBdXSoxMDApKyclLCcrXHJcblx0XHRcdFx0XHRcdFx0KGNbcmdiWzFdXSoxMDApKyclLCcrXHJcblx0XHRcdFx0XHRcdFx0KGNbcmdiWzJdXSoxMDApKyclKSc7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRmdW5jdGlvbiByZWRyYXdTbGQoKSB7XHJcblx0XHRcdC8vIHJlZHJhdyB0aGUgc2xpZGVyIHBvaW50ZXJcclxuXHRcdFx0c3dpdGNoKG1vZGVJRCkge1xyXG5cdFx0XHRcdGNhc2UgMDogdmFyIHlDb21wb25lbnQgPSAyOyBicmVhaztcclxuXHRcdFx0XHRjYXNlIDE6IHZhciB5Q29tcG9uZW50ID0gMTsgYnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIHkgPSBNYXRoLnJvdW5kKCgxLVRISVMuaHN2W3lDb21wb25lbnRdKSAqIChqc2NvbG9yLmltYWdlcy5zbGRbMV0tMSkpO1xyXG5cdFx0XHRqc2NvbG9yLnBpY2tlci5zbGRNLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9XHJcblx0XHRcdFx0JzAgJyArIChUSElTLnBpY2tlckZhY2UrVEhJUy5waWNrZXJJbnNldCt5IC0gTWF0aC5mbG9vcihqc2NvbG9yLmltYWdlcy5hcnJvd1sxXS8yKSkgKyAncHgnO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRmdW5jdGlvbiBpc1BpY2tlck93bmVyKCkge1xyXG5cdFx0XHRyZXR1cm4ganNjb2xvci5waWNrZXIgJiYganNjb2xvci5waWNrZXIub3duZXIgPT09IFRISVM7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGZ1bmN0aW9uIGJsdXJUYXJnZXQoKSB7XHJcblx0XHRcdGlmKHZhbHVlRWxlbWVudCA9PT0gdGFyZ2V0KSB7XHJcblx0XHRcdFx0VEhJUy5pbXBvcnRDb2xvcigpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKFRISVMucGlja2VyT25mb2N1cykge1xyXG5cdFx0XHRcdFRISVMuaGlkZVBpY2tlcigpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGZ1bmN0aW9uIGJsdXJWYWx1ZSgpIHtcclxuXHRcdFx0aWYodmFsdWVFbGVtZW50ICE9PSB0YXJnZXQpIHtcclxuXHRcdFx0XHRUSElTLmltcG9ydENvbG9yKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0ZnVuY3Rpb24gc2V0UGFkKGUpIHtcclxuXHRcdFx0dmFyIG1wb3MgPSBqc2NvbG9yLmdldFJlbE1vdXNlUG9zKGUpO1xyXG5cdFx0XHR2YXIgeCA9IG1wb3MueCAtIFRISVMucGlja2VyRmFjZSAtIFRISVMucGlja2VySW5zZXQ7XHJcblx0XHRcdHZhciB5ID0gbXBvcy55IC0gVEhJUy5waWNrZXJGYWNlIC0gVEhJUy5waWNrZXJJbnNldDtcclxuXHRcdFx0c3dpdGNoKG1vZGVJRCkge1xyXG5cdFx0XHRcdGNhc2UgMDogVEhJUy5mcm9tSFNWKHgqKDYvKGpzY29sb3IuaW1hZ2VzLnBhZFswXS0xKSksIDEgLSB5Lyhqc2NvbG9yLmltYWdlcy5wYWRbMV0tMSksIG51bGwsIGxlYXZlU2xkKTsgYnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAxOiBUSElTLmZyb21IU1YoeCooNi8oanNjb2xvci5pbWFnZXMucGFkWzBdLTEpKSwgbnVsbCwgMSAtIHkvKGpzY29sb3IuaW1hZ2VzLnBhZFsxXS0xKSwgbGVhdmVTbGQpOyBicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRmdW5jdGlvbiBzZXRTbGQoZSkge1xyXG5cdFx0XHR2YXIgbXBvcyA9IGpzY29sb3IuZ2V0UmVsTW91c2VQb3MoZSk7XHJcblx0XHRcdHZhciB5ID0gbXBvcy55IC0gVEhJUy5waWNrZXJGYWNlIC0gVEhJUy5waWNrZXJJbnNldDtcclxuXHRcdFx0c3dpdGNoKG1vZGVJRCkge1xyXG5cdFx0XHRcdGNhc2UgMDogVEhJUy5mcm9tSFNWKG51bGwsIG51bGwsIDEgLSB5Lyhqc2NvbG9yLmltYWdlcy5zbGRbMV0tMSksIGxlYXZlUGFkKTsgYnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAxOiBUSElTLmZyb21IU1YobnVsbCwgMSAtIHkvKGpzY29sb3IuaW1hZ2VzLnNsZFsxXS0xKSwgbnVsbCwgbGVhdmVQYWQpOyBicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRmdW5jdGlvbiBkaXNwYXRjaEltbWVkaWF0ZUNoYW5nZSgpIHtcclxuXHRcdFx0aWYgKFRISVMub25JbW1lZGlhdGVDaGFuZ2UpIHtcclxuXHRcdFx0XHR2YXIgY2FsbGJhY2s7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBUSElTLm9uSW1tZWRpYXRlQ2hhbmdlID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdFx0Y2FsbGJhY2sgPSBuZXcgRnVuY3Rpb24gKFRISVMub25JbW1lZGlhdGVDaGFuZ2UpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjYWxsYmFjayA9IFRISVMub25JbW1lZGlhdGVDaGFuZ2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhbGxiYWNrLmNhbGwoVEhJUyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblxyXG5cdFx0dmFyIFRISVMgPSB0aGlzO1xyXG5cdFx0dmFyIG1vZGVJRCA9IHRoaXMucGlja2VyTW9kZS50b0xvd2VyQ2FzZSgpPT09J2h2cycgPyAxIDogMDtcclxuXHRcdHZhciBhYm9ydEJsdXIgPSBmYWxzZTtcclxuXHRcdHZhclxyXG5cdFx0XHR2YWx1ZUVsZW1lbnQgPSBqc2NvbG9yLmZldGNoRWxlbWVudCh0aGlzLnZhbHVlRWxlbWVudCksXHJcblx0XHRcdHN0eWxlRWxlbWVudCA9IGpzY29sb3IuZmV0Y2hFbGVtZW50KHRoaXMuc3R5bGVFbGVtZW50KTtcclxuXHRcdHZhclxyXG5cdFx0XHRob2xkUGFkID0gZmFsc2UsXHJcblx0XHRcdGhvbGRTbGQgPSBmYWxzZSxcclxuXHRcdFx0dG91Y2hPZmZzZXQgPSB7fTtcclxuXHRcdHZhclxyXG5cdFx0XHRsZWF2ZVZhbHVlID0gMTw8MCxcclxuXHRcdFx0bGVhdmVTdHlsZSA9IDE8PDEsXHJcblx0XHRcdGxlYXZlUGFkID0gMTw8MixcclxuXHRcdFx0bGVhdmVTbGQgPSAxPDwzO1xyXG5cclxuXHRcdC8vIHRhcmdldFxyXG5cdFx0anNjb2xvci5hZGRFdmVudCh0YXJnZXQsICdmb2N1cycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZihUSElTLnBpY2tlck9uZm9jdXMpIHsgVEhJUy5zaG93UGlja2VyKCk7IH1cclxuXHRcdH0pO1xyXG5cdFx0anNjb2xvci5hZGRFdmVudCh0YXJnZXQsICdibHVyJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmKCFhYm9ydEJsdXIpIHtcclxuXHRcdFx0XHR3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpeyBhYm9ydEJsdXIgfHwgYmx1clRhcmdldCgpOyBhYm9ydEJsdXI9ZmFsc2U7IH0sIDApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGFib3J0Qmx1ciA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyB2YWx1ZUVsZW1lbnRcclxuXHRcdGlmKHZhbHVlRWxlbWVudCkge1xyXG5cdFx0XHR2YXIgdXBkYXRlRmllbGQgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRUSElTLmZyb21TdHJpbmcodmFsdWVFbGVtZW50LnZhbHVlLCBsZWF2ZVZhbHVlKTtcclxuXHRcdFx0XHRkaXNwYXRjaEltbWVkaWF0ZUNoYW5nZSgpO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHRqc2NvbG9yLmFkZEV2ZW50KHZhbHVlRWxlbWVudCwgJ2tleXVwJywgdXBkYXRlRmllbGQpO1xyXG5cdFx0XHRqc2NvbG9yLmFkZEV2ZW50KHZhbHVlRWxlbWVudCwgJ2lucHV0JywgdXBkYXRlRmllbGQpO1xyXG5cdFx0XHRqc2NvbG9yLmFkZEV2ZW50KHZhbHVlRWxlbWVudCwgJ2JsdXInLCBibHVyVmFsdWUpO1xyXG5cdFx0XHR2YWx1ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdhdXRvY29tcGxldGUnLCAnb2ZmJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gc3R5bGVFbGVtZW50XHJcblx0XHRpZihzdHlsZUVsZW1lbnQpIHtcclxuXHRcdFx0c3R5bGVFbGVtZW50LmpzY1N0eWxlID0ge1xyXG5cdFx0XHRcdGJhY2tncm91bmRJbWFnZSA6IHN0eWxlRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UsXHJcblx0XHRcdFx0YmFja2dyb3VuZENvbG9yIDogc3R5bGVFbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvcixcclxuXHRcdFx0XHRjb2xvciA6IHN0eWxlRWxlbWVudC5zdHlsZS5jb2xvclxyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHJlcXVpcmUgaW1hZ2VzXHJcblx0XHRzd2l0Y2gobW9kZUlEKSB7XHJcblx0XHRcdGNhc2UgMDoganNjb2xvci5yZXF1aXJlSW1hZ2UoJ2hzLnBuZycpOyBicmVhaztcclxuXHRcdFx0Y2FzZSAxOiBqc2NvbG9yLnJlcXVpcmVJbWFnZSgnaHYucG5nJyk7IGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0anNjb2xvci5yZXF1aXJlSW1hZ2UoJ2Nyb3NzLmdpZicpO1xyXG5cdFx0anNjb2xvci5yZXF1aXJlSW1hZ2UoJ2Fycm93LmdpZicpO1xyXG5cclxuXHRcdHRoaXMuaW1wb3J0Q29sb3IoKTtcclxuXHR9XHJcblxyXG59O1xyXG4iXX0=

'use strict';

var getSettings = {
    merge: function merge(a1, a2) {
        return Object.assign({}, a1, a2);
    },
    trix: function trix(combine) {
        return this.merge(combine, {
            smartyVersion: 3,
            continueComments: "Enter"
        });
    },
    quill: function quill(combine) {
        var toolbarOptions = [['code-block'], [{ 'font': [] }], [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown

        ['bold', 'italic', 'underline', 'strike'], // toggled buttons

        ['blockquote'], [{ 'header': 1 }, { 'header': 2 }], [{ 'header': [1, 2, 3, 4, 5, 6, false] }], [{ 'list': 'ordered' }, { 'list': 'bullet' }], [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
        [{ 'direction': 'rtl' }], // text direction

        [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme

        [{ 'align': [] }], ['clean'] // remove formatting button
        ];

        return this.merge(combine, {
            modules: {
                toolbar: toolbarOptions
            },
            theme: 'snow',
            placeholder: 'Содержимое блока...'
        });
    },
    froala: function froala(combine) {
        return this.merge(combine, {
            language: 'ru',
            toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', '|', 'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', 'print', 'spellChecker', 'help', 'html', '|', 'undo', 'redo'],
            pluginsEnabled: null
        });
    },
    Ckeditor5: function Ckeditor5(combine) {
        return this.merge(combine, {});
    },
    imperavi: function imperavi(combine) {
        return this.merge(combine, {
            lang: 'ru',
            plugins: ['clips', 'beyondgrammar', 'alignment', 'widget', 'video', 'textexpander', 'table', 'specialchars', 'properties', 'pagebreak', 'limiter', 'inlinestyle', 'imagemanager', 'handle', 'fullscreen', 'fontsize', 'fontfamily', 'fontcolor', 'filemanager', 'definedlinks', 'counter'],

            toolbarFixed: true,

            imageResizable: true,

            imagePosition: true,

            toolbarFixedTopOffset: 10,

            // air: true,
            // buttonsTextLabeled: true,

            fileUpload: '/api/upload/file',
            imageUpload: '/api/upload/image',
            clipboardUploadUrl: '/api/upload/clipboard'
        });
    },
    summernote: function summernote(combine) {
        // var element = document.querySelector("trix-editor")
        // element.editor  // is a Trix.Editor instance

        return this.merge(combine, {
            smartyVersion: 3,
            continueComments: "Enter"
        });

        // $('#summernote').summernote({
        //     lang: 'ru-RU'
        //     height: 300,                 // set editor height
        //     minHeight: null,             // set minimum height of editor
        //     maxHeight: null,             // set maximum height of editor
        //     focus: true                  // set focus to editable area after initializing summernote
        // });
    },
    codemirror: function codemirror(combine) {
        return this.merge(combine, {
            gutters: ["note-gutter", "CodeMirror-linenumbers"],
            tabSize: 4,
            indentUnit: 4,
            lineNumbers: true,
            lineWrapping: true,
            tabMode: "indent",
            autofocus: false,
            smartIndent: false,
            enterMode: "keep",
            smartyVersion: 3,
            continueComments: "Enter"
        });
    },
    tinymce: function tinymce(combine) {
        return this.merge(combine, {
            selector: 'textarea',
            height: 70,
            theme: 'modern',
            plugins: 'searchreplace directionality visualblocks visualchars fullscreen link image media codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists textcolor wordcount imagetools colorpicker textpattern',
            toolbar1: 'formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat',
            menubar: false,
            fullpage: false,
            remove_script_host: false,
            relative_urls: false,
            image_advtab: true,
            content_css: ['/static/apps/wysiwyg/tinymce/codepen.min.css']
        });
    }
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zZXR0aW5ncy5qcyJdLCJuYW1lcyI6WyJnZXRTZXR0aW5ncyIsIm1lcmdlIiwiYTEiLCJhMiIsIk9iamVjdCIsImFzc2lnbiIsInRyaXgiLCJjb21iaW5lIiwic21hcnR5VmVyc2lvbiIsImNvbnRpbnVlQ29tbWVudHMiLCJxdWlsbCIsInRvb2xiYXJPcHRpb25zIiwibW9kdWxlcyIsInRvb2xiYXIiLCJ0aGVtZSIsInBsYWNlaG9sZGVyIiwiZnJvYWxhIiwibGFuZ3VhZ2UiLCJ0b29sYmFyQnV0dG9ucyIsInBsdWdpbnNFbmFibGVkIiwiQ2tlZGl0b3I1IiwiaW1wZXJhdmkiLCJsYW5nIiwicGx1Z2lucyIsInRvb2xiYXJGaXhlZCIsImltYWdlUmVzaXphYmxlIiwiaW1hZ2VQb3NpdGlvbiIsInRvb2xiYXJGaXhlZFRvcE9mZnNldCIsImZpbGVVcGxvYWQiLCJpbWFnZVVwbG9hZCIsImNsaXBib2FyZFVwbG9hZFVybCIsInN1bW1lcm5vdGUiLCJjb2RlbWlycm9yIiwiZ3V0dGVycyIsInRhYlNpemUiLCJpbmRlbnRVbml0IiwibGluZU51bWJlcnMiLCJsaW5lV3JhcHBpbmciLCJ0YWJNb2RlIiwiYXV0b2ZvY3VzIiwic21hcnRJbmRlbnQiLCJlbnRlck1vZGUiLCJ0aW55bWNlIiwic2VsZWN0b3IiLCJoZWlnaHQiLCJ0b29sYmFyMSIsIm1lbnViYXIiLCJmdWxscGFnZSIsInJlbW92ZV9zY3JpcHRfaG9zdCIsInJlbGF0aXZlX3VybHMiLCJpbWFnZV9hZHZ0YWIiLCJjb250ZW50X2NzcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxjQUFjO0FBQ2hCQyxTQURnQixpQkFDVEMsRUFEUyxFQUNMQyxFQURLLEVBQ0Q7QUFDWCxlQUFPQyxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQkgsRUFBbEIsRUFBc0JDLEVBQXRCLENBQVA7QUFDSCxLQUhlO0FBS2hCRyxRQUxnQixnQkFLVkMsT0FMVSxFQUtEO0FBQ1gsZUFBTyxLQUFLTixLQUFMLENBQVdNLE9B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TXZCQyxxQkFBUyxRQU5jO0FBT3ZCQyx1QkFBVyxLQVBZO0FBUXZCQyx5QkFBYSxLQVJVO0FBU3ZCQyx1QkFBVyxNQVRZO0FBVXZCakMsMkJBQWlCLENBVk07QUFXdkJDLDhCQUFrQjtBQVhLLFNBQXBCLENBQVA7QUFhSCxLQXpIZTtBQTJIaEJpQyxXQTNIZ0IsbUJBMkhQbkMsT0EzSE8sRUEySEU7QUFDZCxlQUFPLEtBQUtOLEtBQUwsQ0FBV00sT0FBWCxFQUFvQjtBQUN2Qm9DLHNCQUFVLFVBRGE7QUFFdkJDLG9CQUFRLEVBRmU7QUFHdkI5QixtQkFBTyxRQUhnQjtBQUl2QlMscUJBQVMsZ09BSmM7QUFLdkJzQixzQkFBVSxxS0FMYTtBQU12QkMscUJBQVMsS0FOYztBQU92QkMsc0JBQVUsS0FQYTtBQVF2QkMsZ0NBQW9CLEtBUkc7QUFTdkJDLDJCQUFlLEtBVFE7QUFVdkJDLDBCQUFjLElBVlM7QUFXdkJDLHlCQUFhLENBQ1QsOENBRFM7QUFYVSxTQUFwQixDQUFQO0FBZUg7QUEzSWUsQ0FBcEIiLCJmaWxlIjoiX3NldHRpbmdzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZ2V0U2V0dGluZ3MgPSB7XG4gICAgbWVyZ2UgKGExLCBhMikge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgYTEsIGEyKTtcbiAgICB9LFxuXG4gICAgdHJpeCAoY29tYmluZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5tZXJnZShjb21iaW5lLCB7XG4gICAgICAgICAgICBzbWFydHlWZXJzaW9uICA6IDMsXG4gICAgICAgICAgICBjb250aW51ZUNvbW1lbnRzOiBcIkVudGVyXCJcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHF1aWxsIChjb21iaW5lKSB7XG4gICAgICAgIGNvbnN0IHRvb2xiYXJPcHRpb25zID0gW1xuICAgICAgICAgICAgWydjb2RlLWJsb2NrJ10sXG5cbiAgICAgICAgICAgIFt7ICdmb250JzogW10gfV0sXG5cbiAgICAgICAgICAgIFt7ICdzaXplJzogWydzbWFsbCcsIGZhbHNlLCAnbGFyZ2UnLCAnaHVnZSddIH1dLCAgLy8gY3VzdG9tIGRyb3Bkb3duXG5cbiAgICAgICAgICAgIFsnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ3N0cmlrZSddLCAgICAgICAgLy8gdG9nZ2xlZCBidXR0b25zXG5cbiAgICAgICAgICAgIFsnYmxvY2txdW90ZSddLFxuXG4gICAgICAgICAgICBbeyAnaGVhZGVyJzogMSB9LCB7ICdoZWFkZXInOiAyIH1dLFxuXG4gICAgICAgICAgICBbeyAnaGVhZGVyJzogWzEsIDIsIDMsIDQsIDUsIDYsIGZhbHNlXSB9XSxcblxuICAgICAgICAgICAgW3sgJ2xpc3QnOiAnb3JkZXJlZCd9LCB7ICdsaXN0JzogJ2J1bGxldCcgfV0sXG4gICAgICAgICAgICBbeyAnc2NyaXB0JzogJ3N1Yid9LCB7ICdzY3JpcHQnOiAnc3VwZXInIH1dLCAgICAgIC8vIHN1cGVyc2NyaXB0L3N1YnNjcmlwdFxuICAgICAgICAgICAgW3sgJ2luZGVudCc6ICctMSd9LCB7ICdpbmRlbnQnOiAnKzEnIH1dLCAgICAgICAgICAvLyBvdXRkZW50L2luZGVudFxuICAgICAgICAgICAgW3sgJ2RpcmVjdGlvbic6ICdydGwnIH1dLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0ZXh0IGRpcmVjdGlvblxuXG4gICAgICAgICAgICBbeyAnY29sb3InOiBbXSB9LCB7ICdiYWNrZ3JvdW5kJzogW10gfV0sICAgICAgICAgIC8vIGRyb3Bkb3duIHdpdGggZGVmYXVsdHMgZnJvbSB0aGVtZVxuXG4gICAgICAgICAgICBbeyAnYWxpZ24nOiBbXSB9XSxcblxuICAgICAgICAgICAgWydjbGVhbiddICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgZm9ybWF0dGluZyBidXR0b25cbiAgICAgICAgXTtcblxuICAgICAgICByZXR1cm4gdGhpcy5tZXJnZShjb21iaW5lLCB7XG4gICAgICAgICAgICBtb2R1bGVzOiB7XG4gICAgICAgICAgICAgICAgdG9vbGJhcjogdG9vbGJhck9wdGlvbnNcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aGVtZTogJ3Nub3cnLFxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6ICfQodC+0LTQtdGA0LbQuNC80L7QtSDQsdC70L7QutCwLi4uJ1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgZnJvYWxhIChjb21iaW5lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1lcmdlKGNvbWJpbmUsIHtcbiAgICAgICAgICAgIGxhbmd1YWdlOiAncnUnLFxuICAgICAgICAgICAgdG9vbGJhckJ1dHRvbnM6IFsnZnVsbHNjcmVlbicsICdib2xkJywgJ2l0YWxpYycsICd1bmRlcmxpbmUnLCAnc3RyaWtlVGhyb3VnaCcsICdzdWJzY3JpcHQnLCAnc3VwZXJzY3JpcHQnLCAnfCcsICdmb250RmFtaWx5JywgJ2ZvbnRTaXplJywgJ2NvbG9yJywgJ2lubGluZVN0eWxlJywgJ3BhcmFncmFwaFN0eWxlJywgJ3wnLCAncGFyYWdyYXBoRm9ybWF0JywgJ2FsaWduJywgJ2Zvcm1hdE9MJywgJ2Zvcm1hdFVMJywgJ291dGRlbnQnLCAnaW5kZW50JywgJ3F1b3RlJywgJy0nLCAnaW5zZXJ0TGluaycsICdpbnNlcnRJbWFnZScsICdpbnNlcnRWaWRlbycsICdpbnNlcnRGaWxlJywgJ2luc2VydFRhYmxlJywgJ3wnLCAnZW1vdGljb25zJywgJ3NwZWNpYWxDaGFyYWN0ZXJzJywgJ2luc2VydEhSJywgJ3NlbGVjdEFsbCcsICdjbGVhckZvcm1hdHRpbmcnLCAnfCcsICdwcmludCcsICdzcGVsbENoZWNrZXInLCAnaGVscCcsICdodG1sJywgJ3wnLCAndW5kbycsICdyZWRvJ10sXG4gICAgICAgICAgICBwbHVnaW5zRW5hYmxlZDogbnVsbFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgQ2tlZGl0b3I1IChjb21iaW5lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1lcmdlKGNvbWJpbmUsIHt9KTtcbiAgICB9LFxuXG4gICAgaW1wZXJhdmkgKGNvbWJpbmUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWVyZ2UoY29tYmluZSwge1xuICAgICAgICAgICAgbGFuZzogJ3J1JyxcbiAgICAgICAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgICAgICAgICAnY2xpcHMnLCAnYmV5b25kZ3JhbW1hcicsICdhbGlnbm1lbnQnLFxuICAgICAgICAgICAgICAgICd3aWRnZXQnLCAndmlkZW8nLCAndGV4dGV4cGFuZGVyJyxcbiAgICAgICAgICAgICAgICAndGFibGUnLCAnc3BlY2lhbGNoYXJzJywgJ3Byb3BlcnRpZXMnLCAncGFnZWJyZWFrJywgJ2xpbWl0ZXInLFxuICAgICAgICAgICAgICAgICdpbmxpbmVzdHlsZScsICdpbWFnZW1hbmFnZXInLCAnaGFuZGxlJywgJ2Z1bGxzY3JlZW4nLCAnZm9udHNpemUnLFxuICAgICAgICAgICAgICAgICdmb250ZmFtaWx5JywgJ2ZvbnRjb2xvcicsICdmaWxlbWFuYWdlcicsICdkZWZpbmVkbGlua3MnLCAnY291bnRlcidcbiAgICAgICAgICAgIF0sXG5cbiAgICAgICAgICAgIHRvb2xiYXJGaXhlZDogdHJ1ZSxcblxuICAgICAgICAgICAgaW1hZ2VSZXNpemFibGU6IHRydWUsXG5cbiAgICAgICAgICAgIGltYWdlUG9zaXRpb246IHRydWUsXG5cbiAgICAgICAgICAgIHRvb2xiYXJGaXhlZFRvcE9mZnNldDogMTAsXG5cbiAgICAgICAgICAgIC8vIGFpcjogdHJ1ZSxcbiAgICAgICAgICAgIC8vIGJ1dHRvbnNUZXh0TGFiZWxlZDogdHJ1ZSxcblxuICAgICAgICAgICAgZmlsZVVwbG9hZDogJy9hcGkvdXBsb2FkL2ZpbGUnLFxuICAgICAgICAgICAgaW1hZ2VVcGxvYWQ6ICcvYXBpL3VwbG9hZC9pbWFnZScsXG4gICAgICAgICAgICBjbGlwYm9hcmRVcGxvYWRVcmw6ICcvYXBpL3VwbG9hZC9jbGlwYm9hcmQnXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBzdW1tZXJub3RlIChjb21iaW5lKSB7XG4gICAgICAgIC8vIHZhciBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRyaXgtZWRpdG9yXCIpXG4gICAgICAgIC8vIGVsZW1lbnQuZWRpdG9yICAvLyBpcyBhIFRyaXguRWRpdG9yIGluc3RhbmNlXG5cbiAgICAgICAgcmV0dXJuIHRoaXMubWVyZ2UoY29tYmluZSwge1xuICAgICAgICAgICAgc21hcnR5VmVyc2lvbiAgOiAzLFxuICAgICAgICAgICAgY29udGludWVDb21tZW50czogXCJFbnRlclwiXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vICQoJyNzdW1tZXJub3RlJykuc3VtbWVybm90ZSh7XG4gICAgICAgIC8vICAgICBsYW5nOiAncnUtUlUnXG4gICAgICAgIC8vICAgICBoZWlnaHQ6IDMwMCwgICAgICAgICAgICAgICAgIC8vIHNldCBlZGl0b3IgaGVpZ2h0XG4gICAgICAgIC8vICAgICBtaW5IZWlnaHQ6IG51bGwsICAgICAgICAgICAgIC8vIHNldCBtaW5pbXVtIGhlaWdodCBvZiBlZGl0b3JcbiAgICAgICAgLy8gICAgIG1heEhlaWdodDogbnVsbCwgICAgICAgICAgICAgLy8gc2V0IG1heGltdW0gaGVpZ2h0IG9mIGVkaXRvclxuICAgICAgICAvLyAgICAgZm9jdXM6IHRydWUgICAgICAgICAgICAgICAgICAvLyBzZXQgZm9jdXMgdG8gZWRpdGFibGUgYXJlYSBhZnRlciBpbml0aWFsaXppbmcgc3VtbWVybm90ZVxuICAgICAgICAvLyB9KTtcbiAgICB9LFxuXG4gICAgY29kZW1pcnJvciAoY29tYmluZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5tZXJnZShjb21iaW5lLCB7XG4gICAgICAgICAgICBndXR0ZXJzOiBbXCJub3RlLWd1dHRlclwiLCBcIkNvZGVNaXJyb3ItbGluZW51bWJlcnNcIl0sXG4gICAgICAgICAgICB0YWJTaXplOiA0LFxuICAgICAgICAgICAgaW5kZW50VW5pdDogNCxcbiAgICAgICAgICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxuICAgICAgICAgICAgbGluZVdyYXBwaW5nOiB0cnVlLFxuICAgICAgICAgICAgdGFiTW9kZTogXCJpbmRlbnRcIixcbiAgICAgICAgICAgIGF1dG9mb2N1czogZmFsc2UsXG4gICAgICAgICAgICBzbWFydEluZGVudDogZmFsc2UsXG4gICAgICAgICAgICBlbnRlck1vZGU6IFwia2VlcFwiLFxuICAgICAgICAgICAgc21hcnR5VmVyc2lvbiAgOiAzLFxuICAgICAgICAgICAgY29udGludWVDb21tZW50czogXCJFbnRlclwiXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICB0aW55bWNlIChjb21iaW5lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1lcmdlKGNvbWJpbmUsIHtcbiAgICAgICAgICAgIHNlbGVjdG9yOiAndGV4dGFyZWEnLFxuICAgICAgICAgICAgaGVpZ2h0OiA3MCxcbiAgICAgICAgICAgIHRoZW1lOiAnbW9kZXJuJyxcbiAgICAgICAgICAgIHBsdWdpbnM6ICdzZWFyY2hyZXBsYWNlIGRpcmVjdGlvbmFsaXR5IHZpc3VhbGJsb2NrcyB2aXN1YWxjaGFycyBmdWxsc2NyZWVuIGxpbmsgaW1hZ2UgbWVkaWEgY29kZXNhbXBsZSB0YWJsZSBjaGFybWFwIGhyIHBhZ2VicmVhayBub25icmVha2luZyBhbmNob3IgaW5zZXJ0ZGF0ZXRpbWUgYWR2bGlzdCBsaXN0cyB0ZXh0Y29sb3Igd29yZGNvdW50IGltYWdldG9vbHMgY29sb3JwaWNrZXIgdGV4dHBhdHRlcm4nLFxuICAgICAgICAgICAgdG9vbGJhcjE6ICdmb3JtYXRzZWxlY3QgfCBib2xkIGl0YWxpYyBzdHJpa2V0aHJvdWdoIGZvcmVjb2xvciBiYWNrY29sb3IgfCBsaW5rIHwgYWxpZ25sZWZ0IGFsaWduY2VudGVyIGFsaWducmlnaHQgYWxpZ25qdXN0aWZ5IHwgbnVtbGlzdCBidWxsaXN0IG91dGRlbnQgaW5kZW50IHwgcmVtb3ZlZm9ybWF0JyxcbiAgICAgICAgICAgIG1lbnViYXI6IGZhbHNlLFxuICAgICAgICAgICAgZnVsbHBhZ2U6IGZhbHNlLFxuICAgICAgICAgICAgcmVtb3ZlX3NjcmlwdF9ob3N0OiBmYWxzZSxcbiAgICAgICAgICAgIHJlbGF0aXZlX3VybHM6IGZhbHNlLFxuICAgICAgICAgICAgaW1hZ2VfYWR2dGFiOiB0cnVlLFxuICAgICAgICAgICAgY29udGVudF9jc3M6IFtcbiAgICAgICAgICAgICAgICAnL3N0YXRpYy9hcHBzL3d5c2l3eWcvdGlueW1jZS9jb2RlcGVuLm1pbi5jc3MnXG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiJdfQ==

'use strict';

var cmp = function cmp(a, b) {
	if (typeof a === 'number' && typeof b === 'number') {
		return a > b ? 1 : a < b ? -1 : 0;
	}
	a = asciifold(String(a || ''));
	b = asciifold(String(b || ''));
	if (a > b) return 1;
	if (b > a) return -1;
	return 0;
};

var extend = function extend(a, b) {
	var i, n, k, object;
	for (i = 1, n = arguments.length; i < n; i++) {
		object = arguments[i];
		if (!object) continue;
		for (k in object) {
			if (object.hasOwnProperty(k)) {
				a[k] = object[k];
			}
		}
	}
	return a;
};

var trim = function trim(str) {
	return (str + '').replace(/^\s+|\s+$|/g, '');
};

var escape_regex = function escape_regex(str) {
	return (str + '').replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
};

var is_array = Array.isArray || $ && $.isArray || function (object) {
	return Object.prototype.toString.call(object) === '[object Array]';
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl91dGlsaXRpZXMuanMiXSwibmFtZXMiOlsiY21wIiwiYSIsImIiLCJhc2NpaWZvbGQiLCJTdHJpbmciLCJleHRlbmQiLCJpIiwibiIsImsiLCJvYmplY3QiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJoYXNPd25Qcm9wZXJ0eSIsInRyaW0iLCJzdHIiLCJyZXBsYWNlIiwiZXNjYXBlX3JlZ2V4IiwiaXNfYXJyYXkiLCJBcnJheSIsImlzQXJyYXkiLCIkIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJjYWxsIl0sIm1hcHBpbmdzIjoiOztBQUNDLElBQUlBLE1BQU0sU0FBTkEsR0FBTSxDQUFTQyxDQUFULEVBQVlDLENBQVosRUFBZTtBQUN4QixLQUFJLE9BQU9ELENBQVAsS0FBYSxRQUFiLElBQXlCLE9BQU9DLENBQVAsS0FBYSxRQUExQyxFQUFvRDtBQUNuRCxTQUFPRCxJQUFJQyxDQUFKLEdBQVEsQ0FBUixHQUFhRCxJQUFJQyxDQUFKLEdBQVEsQ0FBQyxDQUFULEdBQWEsQ0FBakM7QUFDQTtBQUNERCxLQUFJRSxVQUFVQyxPQUFPSCxLQUFLLEVBQVosQ0FBVixDQUFKO0FBQ0FDLEtBQUlDLFVBQVVDLE9BQU9GLEtBQUssRUFBWixDQUFWLENBQUo7QUFDQSxLQUFJRCxJQUFJQyxDQUFSLEVBQVcsT0FBTyxDQUFQO0FBQ1gsS0FBSUEsSUFBSUQsQ0FBUixFQUFXLE9BQU8sQ0FBQyxDQUFSO0FBQ1gsUUFBTyxDQUFQO0FBQ0EsQ0FURDs7QUFXQSxJQUFJSSxTQUFTLFNBQVRBLE1BQVMsQ0FBU0osQ0FBVCxFQUFZQyxDQUFaLEVBQWU7QUFDM0IsS0FBSUksQ0FBSixFQUFPQyxDQUFQLEVBQVVDLENBQVYsRUFBYUMsTUFBYjtBQUNBLE1BQUtILElBQUksQ0FBSixFQUFPQyxJQUFJRyxVQUFVQyxNQUExQixFQUFrQ0wsSUFBSUMsQ0FBdEMsRUFBeUNELEdBQXpDLEVBQThDO0FBQzdDRyxXQUFTQyxVQUFVSixDQUFWLENBQVQ7QUFDQSxNQUFJLENBQUNHLE1BQUwsRUFBYTtBQUNiLE9BQUtELENBQUwsSUFBVUMsTUFBVixFQUFrQjtBQUNqQixPQUFJQSxPQUFPRyxjQUFQLENBQXNCSixDQUF0QixDQUFKLEVBQThCO0FBQzdCUCxNQUFFTyxDQUFGLElBQU9DLE9BQU9ELENBQVAsQ0FBUDtBQUNBO0FBQ0Q7QUFDRDtBQUNELFFBQU9QLENBQVA7QUFDQSxDQVpEOztBQWNBLElBQUlZLE9BQU8sU0FBUEEsSUFBTyxDQUFTQyxHQUFULEVBQWM7QUFDeEIsUUFBTyxDQUFDQSxNQUFNLEVBQVAsRUFBV0MsT0FBWCxDQUFtQixhQUFuQixFQUFrQyxFQUFsQyxDQUFQO0FBQ0EsQ0FGRDs7QUFJQSxJQUFJQyxlQUFlLFNBQWZBLFlBQWUsQ0FBU0YsR0FBVCxFQUFjO0FBQ2hDLFFBQU8sQ0FBQ0EsTUFBTSxFQUFQLEVBQVdDLE9BQVgsQ0FBbUIsd0JBQW5CLEVBQTZDLE1BQTdDLENBQVA7QUFDQSxDQUZEOztBQUlBLElBQUlFLFdBQVdDLE1BQU1DLE9BQU4sSUFBa0JDLEtBQUtBLEVBQUVELE9BQXpCLElBQXFDLFVBQVNWLE1BQVQsRUFBaUI7QUFDcEUsUUFBT1ksT0FBT0MsU0FBUCxDQUFpQkMsUUFBakIsQ0FBMEJDLElBQTFCLENBQStCZixNQUEvQixNQUEyQyxnQkFBbEQ7QUFDQSxDQUZEIiwiZmlsZSI6Il91dGlsaXRpZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcblx0dmFyIGNtcCA9IGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRpZiAodHlwZW9mIGEgPT09ICdudW1iZXInICYmIHR5cGVvZiBiID09PSAnbnVtYmVyJykge1xuXHRcdFx0cmV0dXJuIGEgPiBiID8gMSA6IChhIDwgYiA/IC0xIDogMCk7XG5cdFx0fVxuXHRcdGEgPSBhc2NpaWZvbGQoU3RyaW5nKGEgfHwgJycpKTtcblx0XHRiID0gYXNjaWlmb2xkKFN0cmluZyhiIHx8ICcnKSk7XG5cdFx0aWYgKGEgPiBiKSByZXR1cm4gMTtcblx0XHRpZiAoYiA+IGEpIHJldHVybiAtMTtcblx0XHRyZXR1cm4gMDtcblx0fTtcblxuXHR2YXIgZXh0ZW5kID0gZnVuY3Rpb24oYSwgYikge1xuXHRcdHZhciBpLCBuLCBrLCBvYmplY3Q7XG5cdFx0Zm9yIChpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcblx0XHRcdG9iamVjdCA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdGlmICghb2JqZWN0KSBjb250aW51ZTtcblx0XHRcdGZvciAoayBpbiBvYmplY3QpIHtcblx0XHRcdFx0aWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShrKSkge1xuXHRcdFx0XHRcdGFba10gPSBvYmplY3Rba107XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGE7XG5cdH07XG5cblx0dmFyIHRyaW0gPSBmdW5jdGlvbihzdHIpIHtcblx0XHRyZXR1cm4gKHN0ciArICcnKS5yZXBsYWNlKC9eXFxzK3xcXHMrJHwvZywgJycpO1xuXHR9O1xuXG5cdHZhciBlc2NhcGVfcmVnZXggPSBmdW5jdGlvbihzdHIpIHtcblx0XHRyZXR1cm4gKHN0ciArICcnKS5yZXBsYWNlKC8oWy4/KiteJFtcXF1cXFxcKCl7fXwtXSkvZywgJ1xcXFwkMScpO1xuXHR9O1xuXG5cdHZhciBpc19hcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgKCQgJiYgJC5pc0FycmF5KSB8fCBmdW5jdGlvbihvYmplY3QpIHtcblx0XHRyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG5cdH07XG4iXX0=

'use strict';

(function ($) {
    'use strict';

    $.browser = {};
    $.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
    $.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
    $.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
    $.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
})(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJyb3dzZXIuanMiXSwibmFtZXMiOlsiJCIsImJyb3dzZXIiLCJtb3ppbGxhIiwidGVzdCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInRvTG93ZXJDYXNlIiwid2Via2l0Iiwib3BlcmEiLCJtc2llIiwialF1ZXJ5Il0sIm1hcHBpbmdzIjoiOztBQUFDLFdBQVNBLENBQVQsRUFBWTtBQUNUOztBQUVBQSxNQUFFQyxPQUFGLEdBQVksRUFBWjtBQUNBRCxNQUFFQyxPQUFGLENBQVVDLE9BQVYsR0FBb0IsVUFBVUMsSUFBVixDQUFlQyxVQUFVQyxTQUFWLENBQW9CQyxXQUFwQixFQUFmLEtBQXFELENBQUMsU0FBU0gsSUFBVCxDQUFjQyxVQUFVQyxTQUFWLENBQW9CQyxXQUFwQixFQUFkLENBQTFFO0FBQ0FOLE1BQUVDLE9BQUYsQ0FBVU0sTUFBVixHQUFtQixTQUFTSixJQUFULENBQWNDLFVBQVVDLFNBQVYsQ0FBb0JDLFdBQXBCLEVBQWQsQ0FBbkI7QUFDQU4sTUFBRUMsT0FBRixDQUFVTyxLQUFWLEdBQWtCLFFBQVFMLElBQVIsQ0FBYUMsVUFBVUMsU0FBVixDQUFvQkMsV0FBcEIsRUFBYixDQUFsQjtBQUNBTixNQUFFQyxPQUFGLENBQVVRLElBQVYsR0FBaUIsT0FBT04sSUFBUCxDQUFZQyxVQUFVQyxTQUFWLENBQW9CQyxXQUFwQixFQUFaLENBQWpCO0FBRUgsQ0FUQSxFQVNDSSxNQVRELENBQUQiLCJmaWxlIjoiYnJvd3Nlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgJC5icm93c2VyID0ge307XG4gICAgJC5icm93c2VyLm1vemlsbGEgPSAvbW96aWxsYS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkpICYmICEvd2Via2l0Ly50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSk7XG4gICAgJC5icm93c2VyLndlYmtpdCA9IC93ZWJraXQvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKTtcbiAgICAkLmJyb3dzZXIub3BlcmEgPSAvb3BlcmEvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKTtcbiAgICAkLmJyb3dzZXIubXNpZSA9IC9tc2llLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSk7XG5cbn0oalF1ZXJ5KSk7Il19

'use strict';

function declOfNum(n, titles) {
    var cases = [2, 0, 1, 1, 1, 2];
    n = Math.abs(n);
    return [n, titles[n % 100 > 4 && n % 100 < 20 ? 2 : cases[n % 10 < 5 ? n % 10 : 5]]].join(' ');
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlY2xvZm51bS5qcyJdLCJuYW1lcyI6WyJkZWNsT2ZOdW0iLCJuIiwidGl0bGVzIiwiY2FzZXMiLCJNYXRoIiwiYWJzIiwiam9pbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxTQUFTQSxTQUFULENBQW1CQyxDQUFuQixFQUFzQkMsTUFBdEIsRUFBOEI7QUFDMUIsUUFBTUMsUUFBUSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLENBQWhCLENBQWQ7QUFDQUYsUUFBSUcsS0FBS0MsR0FBTCxDQUFTSixDQUFULENBQUo7QUFDQSxXQUFPLENBQUNBLENBQUQsRUFBSUMsT0FBUUQsSUFBSSxHQUFKLEdBQVUsQ0FBVixJQUFlQSxJQUFJLEdBQUosR0FBVSxFQUExQixHQUFnQyxDQUFoQyxHQUFvQ0UsTUFBT0YsSUFBSSxFQUFKLEdBQVMsQ0FBVixHQUFlQSxJQUFJLEVBQW5CLEdBQXdCLENBQTlCLENBQTNDLENBQUosRUFBa0ZLLElBQWxGLENBQXVGLEdBQXZGLENBQVA7QUFDSCIsImZpbGUiOiJkZWNsb2ZudW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBkZWNsT2ZOdW0obiwgdGl0bGVzKSB7XG4gICAgY29uc3QgY2FzZXMgPSBbMiwgMCwgMSwgMSwgMSwgMl07XG4gICAgbiA9IE1hdGguYWJzKG4pO1xuICAgIHJldHVybiBbbiwgdGl0bGVzWyhuICUgMTAwID4gNCAmJiBuICUgMTAwIDwgMjApID8gMiA6IGNhc2VzWyhuICUgMTAgPCA1KSA/IG4gJSAxMCA6IDVdXV0uam9pbignICcpO1xufSJdfQ==

'use strict';

function saving(id, content) {
    $.ajax({
        url: '/' + ADMIN_DIR + '/save/',
        type: 'post',
        data: {
            id: id,
            cont: content,
            pathname: location.pathname
        },
        dataType: 'JSON',
        success: function success(response) {
            if (response == 1) {
                alert("Данные удачно сохранены.");
            } else {
                alert("Ошибка, данные небыли сохранены.");
            }
        }
    });
}

function isFullScreen(cm) {
    return (/\bCodeMirror-fullscreen\b/.test(cm.getWrapperElement().className)
    );
}

function winHeight() {
    return window.innerHeight || (document.documentElement || document.body).clientHeight;
}

function setFullScreen(cm, full) {
    var wrap = cm.getWrapperElement(),
        scroll = cm.getScrollerElement();
    if (full) {
        wrap.className += " CodeMirror-fullscreen";
        scroll.style.height = winHeight() + "px";
        document.documentElement.style.overflow = "hidden";
    } else {
        wrap.className = wrap.className.replace(" CodeMirror-fullscreen", "");
        scroll.style.height = "";
        document.documentElement.style.overflow = "";
    }
    cm.refresh();
}

var _editor = {
    inited: [],

    codemirror: function codemirror(id, mode) {
        var object = document.getElementById(id);

        if (mode == 'xml') {
            mode = {
                name: "xml",
                alignCDATA: true
            };
        }

        if (mode == 'sql') {
            mode = 'text/x-mariadb';

            if (window.location.href.indexOf('mime=') > -1) {
                mode = window.location.href.substr(window.location.href.indexOf('mime=') + 5);
            }
        }

        CodeMirror.fromTextArea(object, getSettings.codemirror({
            mode: mode,
            extraKeys: {
                "Ctrl-S": function CtrlS(cm) {
                    saving();
                    return false;
                },
                "Cmd-S": function CmdS(cm) {
                    saving();
                    return false;
                },
                "Ctrl-Q": "toggleComment",
                "Cmd-Q": "toggleComment"
            }
        }));
    },

    init: function init(id, type, mode) {
        if (typeof this[type] !== 'undefined') {
            if (this.inited.indexOf(id) < 0) {
                this.inited.push(id);
                this[type](id, mode);
            }
        }
    }
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVkaXRvci5qcyJdLCJuYW1lcyI6WyJzYXZpbmciLCJpZCIsImNvbnRlbnQiLCIkIiwiYWpheCIsInVybCIsIkFETUlOX0RJUiIsInR5cGUiLCJkYXRhIiwiY29udCIsInBhdGhuYW1lIiwibG9jYXRpb24iLCJkYXRhVHlwZSIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsImFsZXJ0IiwiaXNGdWxsU2NyZWVuIiwiY20iLCJ0ZXN0IiwiZ2V0V3JhcHBlckVsZW1lbnQiLCJjbGFzc05hbWUiLCJ3aW5IZWlnaHQiLCJ3aW5kb3ciLCJpbm5lckhlaWdodCIsImRvY3VtZW50IiwiZG9jdW1lbnRFbGVtZW50IiwiYm9keSIsImNsaWVudEhlaWdodCIsInNldEZ1bGxTY3JlZW4iLCJmdWxsIiwid3JhcCIsInNjcm9sbCIsImdldFNjcm9sbGVyRWxlbWVudCIsInN0eWxlIiwiaGVpZ2h0Iiwib3ZlcmZsb3ciLCJyZXBsYWNlIiwicmVmcmVzaCIsIl9lZGl0b3IiLCJpbml0ZWQiLCJjb2RlbWlycm9yIiwibW9kZSIsIm9iamVjdCIsImdldEVsZW1lbnRCeUlkIiwibmFtZSIsImFsaWduQ0RBVEEiLCJocmVmIiwiaW5kZXhPZiIsInN1YnN0ciIsIkNvZGVNaXJyb3IiLCJmcm9tVGV4dEFyZWEiLCJnZXRTZXR0aW5ncyIsImV4dHJhS2V5cyIsImluaXQiLCJwdXNoIl0sIm1hcHBpbmdzIjoiOztBQUFBLFNBQVNBLE1BQVQsQ0FBZ0JDLEVBQWhCLEVBQW9CQyxPQUFwQixFQUNBO0FBQ0lDLE1BQUVDLElBQUYsQ0FBTztBQUNIQyxhQUFLLE1BQU1DLFNBQU4sR0FBa0IsUUFEcEI7QUFFSEMsY0FBTSxNQUZIO0FBR0hDLGNBQU07QUFDRlAsZ0JBQUlBLEVBREY7QUFFRlEsa0JBQU1QLE9BRko7QUFHRlEsc0JBQVVDLFNBQVNEO0FBSGpCLFNBSEg7QUFRSEUsa0JBQVUsTUFSUDtBQVNIQyxpQkFBUyxpQkFBU0MsUUFBVCxFQUNUO0FBQ0ksZ0JBQUlBLFlBQVksQ0FBaEIsRUFBbUI7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O0FBbkRXLENBQWhCIiwiZmlsZSI6ImVkaXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIHNhdmluZyhpZCwgY29udGVudClcbntcbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6ICcvJyArIEFETUlOX0RJUiArICcvc2F2ZS8nLFxuICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGlkOiBpZCxcbiAgICAgICAgICAgIGNvbnQ6IGNvbnRlbnQsXG4gICAgICAgICAgICBwYXRobmFtZTogbG9jYXRpb24ucGF0aG5hbWVcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YVR5cGU6ICdKU09OJyxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCLQlNCw0L3QvdGL0LUg0YPQtNCw0YfQvdC+INGB0L7RhdGA0LDQvdC10L3Riy5cIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwi0J7RiNC40LHQutCwLCDQtNCw0L3QvdGL0LUg0L3QtdCx0YvQu9C4INGB0L7RhdGA0LDQvdC10L3Riy5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gaXNGdWxsU2NyZWVuKGNtKSB7XG4gICAgcmV0dXJuIC9cXGJDb2RlTWlycm9yLWZ1bGxzY3JlZW5cXGIvLnRlc3QoY20uZ2V0V3JhcHBlckVsZW1lbnQoKS5jbGFzc05hbWUpO1xufVxuXG5mdW5jdGlvbiB3aW5IZWlnaHQoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5pbm5lckhlaWdodCB8fCAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8IGRvY3VtZW50LmJvZHkpLmNsaWVudEhlaWdodDtcbn1cblxuZnVuY3Rpb24gc2V0RnVsbFNjcmVlbihjbSwgZnVsbCkge1xuICAgIHZhciB3cmFwID0gY20uZ2V0V3JhcHBlckVsZW1lbnQoKSwgc2Nyb2xsID0gY20uZ2V0U2Nyb2xsZXJFbGVtZW50KCk7XG4gICAgaWYgKGZ1bGwpXG4gICAge1xuICAgICAgICB3cmFwLmNsYXNzTmFtZSArPSBcIiBDb2RlTWlycm9yLWZ1bGxzY3JlZW5cIjtcbiAgICAgICAgc2Nyb2xsLnN0eWxlLmhlaWdodCA9IHdpbkhlaWdodCgpICsgXCJweFwiO1xuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICB3cmFwLmNsYXNzTmFtZSA9IHdyYXAuY2xhc3NOYW1lLnJlcGxhY2UoXCIgQ29kZU1pcnJvci1mdWxsc2NyZWVuXCIsIFwiXCIpO1xuICAgICAgICBzY3JvbGwuc3R5bGUuaGVpZ2h0ID0gXCJcIjtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gXCJcIjtcbiAgICB9XG4gICAgY20ucmVmcmVzaCgpO1xufVxuXG5jb25zdCBfZWRpdG9yID0ge1xuICAgIGluaXRlZDogW10sXG5cbiAgICBjb2RlbWlycm9yOiBmdW5jdGlvbihpZCwgbW9kZSlcbiAgICB7XG4gICAgICAgIGNvbnN0IG9iamVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcblxuICAgICAgICBpZiAobW9kZSA9PSAneG1sJylcbiAgICAgICAge1xuICAgICAgICAgICAgbW9kZSA9IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBcInhtbFwiLFxuICAgICAgICAgICAgICAgIGFsaWduQ0RBVEE6IHRydWVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW9kZSA9PSAnc3FsJylcbiAgICAgICAge1xuICAgICAgICAgICAgbW9kZSA9ICd0ZXh0L3gtbWFyaWFkYic7XG5cbiAgICAgICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCdtaW1lPScpID4gLTEpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbW9kZSA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnN1YnN0cih3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCdtaW1lPScpICsgNSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBDb2RlTWlycm9yLmZyb21UZXh0QXJlYShvYmplY3QsIGdldFNldHRpbmdzLmNvZGVtaXJyb3Ioe1xuICAgICAgICAgICAgbW9kZTogbW9kZSxcbiAgICAgICAgICAgIGV4dHJhS2V5czoge1xuICAgICAgICAgICAgICAgIFwiQ3RybC1TXCI6IGZ1bmN0aW9uKGNtKSB7XG4gICAgICAgICAgICAgICAgICAgIHNhdmluZygpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIkNtZC1TXCI6IGZ1bmN0aW9uKGNtKSB7XG4gICAgICAgICAgICAgICAgICAgIHNhdmluZygpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBcIkN0cmwtUVwiOiBcInRvZ2dsZUNvbW1lbnRcIixcbiAgICAgICAgICAgICAgICBcIkNtZC1RXCI6IFwidG9nZ2xlQ29tbWVudFwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICB9LFxuXG4gICAgaW5pdDogZnVuY3Rpb24oaWQsIHR5cGUsIG1vZGUpXG4gICAge1xuICAgICAgICBpZiAodHlwZW9mKHRoaXNbdHlwZV0pICE9PSAndW5kZWZpbmVkJylcbiAgICAgICAge1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5pdGVkLmluZGV4T2YoaWQpIDwgMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdGVkLnB1c2goaWQpXG4gICAgICAgICAgICAgICAgdGhpc1t0eXBlXShpZCwgbW9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59OyJdfQ==

'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var d = document;

var css = function css(element, style) {
    for (var prop in style) {
        element.style[prop] = style[prop];
    }
};

var animate = function animate(opts, callback) {
    var start = new Date();
    var timer = setInterval(function () {
        var progress = (new Date() - start) / opts.duration;
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
        stop: function stop() {
            clearInterval(timer);
        }
    };
};

var addClass = function addClass(element, classname) {
    var cn = element.className;
    if (cn.indexOf(classname) != -1) {
        return;
    }
    if (cn != '') {
        classname = ' ' + classname;
    }
    element.className = cn + classname;
};

var removeClass = function removeClass(element, classname) {
    var cn = element.className;
    var rxp = new RegExp("\\s?\\b" + classname + "\\b", "g");
    cn = cn.replace(rxp, '');
    element.className = cn;
};

function is_string(mixed_var) {
    return typeof mixed_var == 'string';
}

function is_numeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

var mapConteiner = function mapConteiner(type, mapid) {
    if (type === 'google') {
        googleMaps(mapid);
    } else if (type === 'yandex') {
        yandexMaps(mapid);
    }
};

function checkAll(element) {
    var checked = $(element).prop('checked');
    $('.check-all-spy').prop('checked', checked);
}

function yandexMaps(mapid) {
    var map = {
        link: null,
        mapid: 'map-conteiner-' + mapid,
        place: 'krasnodar',
        type: 'yandex#map', // 'yandex#map' 'yandex#satellite' 'yandex#hybrid' 'yandex#publicMap' 'yandex#publicMapHybrid'
        city: {
            'krasnodar': [45.09471716593029, 39.01589900000001],
            'moscow': [55.76, 37.64]
        },
        getBaloon: function getBaloon(coord) {
            return new ymaps.Placemark(coord, {}, {
                draggable: true
                //,
                //iconImageHref: '/images/myIcon.gif',
                //iconImageSize: [30, 42],
                //iconImageOffset: [-3, -42]
            });
        },
        draw: function draw(ymaps) {
            map.link = new ymaps.Map(this.mapid, {
                center: map.city[this.place],
                zoom: 12,
                type: map.type
            });

            map.link.controls.add('smallZoomControl', { right: 10, top: 15 }).add(new ymaps.control.ScaleLine()).add('searchControl', { left: 20, top: 20 });

            var dragBalloon = this.getBaloon(map.city[this.place]);

            map.link.events.add('click', function (e) {
                map.link.geoObjects.remove(dragBalloon);

                dragBalloon = map.getBaloon(e.get('coordPosition'));
                map.link.geoObjects.add(dragBalloon);

                map.setCoord(e.get('coordPosition'));
            });

            map.link.geoObjects.add(dragBalloon).events.add('dragend', function (e) {
                var object = e.get('target');
                var coords = object.geometry.getCoordinates();
                object.properties.set('balloonContent', coords);

                map.setCoord(coords);
            });
        },
        add: function add() {
            if (arguments.length == 1) {
                map.link.geoObjects.add(new ymaps.GeoObject({
                    geometry: {
                        type: "Point",
                        coordinates: arguments[0]
                    }
                }));
            } else {
                var collection = new ymaps.GeoObjectCollection();
                for (var i = 0; i < arguments.length; i++) {
                    collection.add(new ymaps.Placemark(arguments[i]));
                }
                map.link.geoObjects.add(collection);
            }
        }
    };

    ymaps.ready(function () {
        map.draw(ymaps);
    });
}

function googleMaps(mapid) {
    var map = new google.maps.Map(d.getElementById('map-conteiner-' + mapid), {
        zoom: 14,
        zoomControl: !1,
        panControl: !1,
        scrollwheel: !1,
        navigationControl: !1,
        mapTypeControl: !1,
        scaleControl: !1,
        draggable: !0,
        disableDoubleClickZoom: !0,
        center: new google.maps.LatLng(45.053548, 39.016056)
    });
}

var datepicker = function datepicker() {
    var _this = this;

    var $calendar = $('.calendar');

    $calendar.each(function (id, item) {
        var $closest = $(item).closest('.calendar');
        var $element = $closest.find('.calendar-input');
        var disabled = $element.is(':disabled');
        var timestamp = $element.data('timestamp') || false;
        var d_format = timestamp !== false ? 'DD.MM.YYYY' : $element.data('format') || 'DD.MM.YYYY';

        d_format = d_format.toLowerCase();

        if (!disabled) {
            $element.prop('date', '');
            $element.data('format', d_format);

            var $calendarItem = $element.datepicker({
                format: d_format,
                // todayBtn: true,
                autoclose: true,
                container: $closest,
                language: ADMIN_LOCALE
            });

            $calendarItem.on('changeDate', function (ev) {
                var result = $(_this).data('date');

                if (timestamp !== false) {
                    result = new Date(result).getTime() / 1000;
                }

                $element.val($calendarItem.datepicker('getFormattedDate'));
            });

            if ($closest.find('.input-group-addon')) {
                $closest.find('.input-group-addon').on('click', function () {
                    $calendarItem.datepicker('show');
                });
            }
        }
    });
};

function selectize(selector) {
    var $selector = null;

    selector = selector || 'select';

    if (is_string(selector)) {
        $selector = $(selector);
    } else if (is_object(selector)) {
        $selector = selector;
    }

    var options = {
        width: "100%",
        allow_single_deselect: true,
        no_results_text: 'Не найдено!',
        disable_search_threshold: 10
    };

    $selector.each(function () {
        var $select = $(this);
        var placeholder = $select.attr('placeholder');

        if (placeholder) {
            var isMultiple = $select.prop('multiple');

            if (isMultiple) {
                options.placeholder_text_multiple = placeholder;
            } else {
                options.placeholder_text_single = placeholder;
            }
        }

        $select.chosen(options);
    });
}

function changeRow(element) {
    var checked = $(element).prop('checked');

    if (checked) {
        $(element).closest('tr').find('td').addClass('ch');
    } else {
        $(element).closest('tr').find('td').removeClass('ch');
    }
}

function toggle_small_photo(id) {
    $("#" + id).toggle();
}

function removeSection(element, e, id, _self_) {
    e.preventDefault();
    if (confirm('Вы действительно хотите удалить?')) {
        id = parseInt(id);

        var x,
            section = [],
            tmp = $(element).val().split(',');
        for (x in tmp) {
            if (tmp[x] !== '' && parseInt(tmp[x]) !== id) {
                section.push(parseInt(tmp[x]));
            }
        }

        $(_self_).remove();
        $(element).val(section.length > 1 ? section.join(',') : section);
    }
    return false;
}

function slider(id, type, value, min, max, orientation) {
    var element = '#' + id;
    var slider = document.getElementById(id);

    orientation = !orientation ? 'horizontal' : orientation;

    min = min || 0;
    max = max || 100;

    var values = value,
        connect = 'lower',
        behaviour = 'tap-drag';

    if (type == 'range') {
        behaviour = 'tap-drag';
        connect = true;
        values = [value[0], value[1]];
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

    var handles = {
        'range': {
            0: 'min',
            1: 'max'
        },
        'slider': {
            0: 'value'
        }
    };

    slider.noUiSlider.on('update', function (values, handle) {
        $(element + '-' + handles[type][handle]).val(values[handle]);
    });
}

function metaCounter() {
    $('.count-number').on('keyup', function () {
        var $block = $(this).closest('.count-number-block'),
            $counter = $block.find('.count-number-block-count'),
            recomend = parseInt($counter.data('recomend')) || '';

        $counter.html($(this).val().length + (recomend !== '' ? '/' + recomend : ''));

        if (recomend !== '' && $(this).val().length > recomend) {
            $counter.addClass('unlim');
        } else if ($counter.hasClass('unlim')) {
            $counter.removeClass('unlim');
        }
    });
}

function seoCrowl() {
    $("input[name='changefreq']").on('change', function () {
        if ($.trim($(this).val()) == 'fixed') {
            $('#changefreq_fixed').removeClass('hidden');
        } else {
            $('#changefreq_fixed').addClass('hidden');
        }
    });

    $("input[name='priority']").on('change', function () {
        if ($.trim($(this).val()) == 'fixed') {
            $('#priority_fixed').removeClass('hidden');
        } else {
            $('#priority_fixed').addClass('hidden');
        }
    });
}

function toggle_item(e, element, id, elclass) {
    e.preventDefault();
    $("#" + id).toggle();
    var $icon = $(element).find('.zmdi');

    if ($icon.hasClass(elclass[0])) {
        $icon.removeClass(elclass[0]);
        $icon.addClass(elclass[1]);
    } else {
        $icon.removeClass(elclass[1]);
        $icon.addClass(elclass[0]);
    }
}

function switch_type_fields(obj) {
    if (obj.checked === true) {
        $("#case2").hide();
        $("#case2 input").attr({ "disabled": true });
        $("#case1").show();
        $("#case1 input").attr({ "disabled": false });
    } else {
        $("#case1").hide();
        $("#case1 input").attr({ "disabled": true });
        $("#case2").show();
        $("#case2 input").attr({ "disabled": false });
    }
}

function show_tr(obj) {
    var val = $(obj).val();

    if (val == 10 || val == 11 || val == 12) $("#to_list").show();else $("#to_list").hide();
}

function translate_key(element) {
    $(element).val(generatePassword(random(14, 24), false, /\w/));

    // $(element).val(PassGenJS.getPassword({
    //     symbols: 0,
    //     letters: random(14, 24),
    //     numbers: 0,
    //     lettersUpper: 0
    // }));
}

function secret(element, length) {
    $(element).val(generatePassword(12, false));

    // $(element).val(PassGenJS.getPassword({
    //     symbols: 0,
    //     letters: random(2, 4),
    //     numbers: random(2, 4),
    //     lettersUpper: random(3, 7)
    // }));
}

function random(min, max) {
    min = min || 0;
    max = max || 100;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function token(length) {
    length = length || 8;

    var secret = '',
        chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (i = 1; i < length; i++) {
        var c = Math.floor(Math.random() * chars.length + 1);
        secret += chars.charAt(c);
    }

    return secret;
}

function del_list_fields(id) {
    if (cp.dialog("Вы дейсвительно хотите удалить поле?")) {
        $("#tr" + id).remove();
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

function add_list_fields() {
    field_counter++;
    str = '<tr id="tr' + field_counter + '">';
    str += '<td><input type="hidden" name="field_id[' + field_counter + ']" value="0" \/>';
    str += '<input type="text" name="field_name[' + field_counter + ']" class="bord padd ness" \/><\/td>';
    str += '<td><input type="text" name="field_sys_name[' + field_counter + ']" class="bord padd ness" \/><\/td>';
    str += '<td><select name="field_type[' + field_counter + ']" class="field_type ness" id="' + field_counter + '" onchange="select_type(this);">';
    $.each(arr_field_type, function (k, v) {
        if (k * 1) str += '<option value="' + k + '">' + v + '<\/option>';
    });
    str += '<\/select><\/td>';
    str += '<td class="addition"><\/td>';
    str += '<td><input type="text" name="f_ord[' + field_counter + ']" value="' + field_counter + '0" class="bord padd w60px r" \/><\/td>';
    str += '<td style="text-align:center"><input type="checkbox" name="in_list[' + field_counter + ']" \/><\/td>';
    str += '<td class="actions c"><a href="#" class="ctr_a ctr_del margin" title="Удалить" onclick="del_list_fields(' + field_counter + ');return false;"><\/a><\/td>';
    str += '<\/tr>';

    $("#add_btn").before(str);
}

function add_list_fields_list() {
    field_counter++;

    var str = ['<tr id="tr' + field_counter + '">', '<td>', '<input type="hidden" name="field_id[' + field_counter + ']" value="0">', '<input name="var[' + field_counter + ']" placeholder="Например: Краснодарский край">', '</td>', '<td><input name="value[' + field_counter + ']" placeholder="Например: 23"></td>', '<td><label class="controll"><input type="checkbox" class="controll__input" value="' + field_counter + '" name="default[' + field_counter + ']"><span class="controll__visible controll__visible_checkbox"></span></label></td>', '<td><input name="ord[' + field_counter + ']" value="' + field_counter + '0" class="ord integer reducing-trigger"></td>', '<td class="tac"><a href="#" class="icon icon-delete remove-trigger" title="Удалить" onclick="del_list_fields(' + field_counter + ');return false;"></a></td>', '</tr>'].join('');

    $("#add_btn").before(str);
}

function del_fields(numb) {
    field_counter--;
    $("#tr" + numb).remove();
}

function add_fields() {
    field_counter++;
    var select = '',
        k = '';

    for (k in arr_field_type) {
        if (typeof arr_field_type[k] == 'string') {
            select += '<option value="' + k + '">' + arr_field_type[k] + '</option>';
        }
    }

    var str = ['<tr id="tr' + field_counter + '">', '<td class="va_t"><input name="f_name[' + field_counter + ']" class="ness"></td>', '<td class="va_t"><input name="f_sys_name[' + field_counter + ']" class="ness"></td>', '<td class="va_t"><select name="f_type[' + field_counter + ']" class="f_type ness" data-placeholder="Тип поля" id="fieldtype_' + field_counter + '" onchange="select_type(this)">', select, '</select></td>', '<td class="addition va_t">' + get_addition('input', field_counter) + '</td>', '<td class="va_t"><input name="f_ord[' + field_counter + ']" value="' + field_counter + '0"></td>', '<td class="va_m tac"><label class="controll controll_single"><input type="checkbox" class="controll__input" value="1" name="f_in_list[' + field_counter + ']"><span class="controll__visible controll__visible_checkbox"></span></label></td>', '<td class="va_m tac"><label class="controll controll_single"><input type="checkbox" class="controll__input" value="1" name="f_index[' + field_counter + ']"><span class="controll__visible controll__visible_checkbox"></span></label></td>', '<td class="va_m tac"><label class="controll controll_single"><input type="checkbox" class="controll__input" value="1" name="f_unique[' + field_counter + ']"><span class="controll__visible controll__visible_checkbox"></span></label></td>', '<td class="tac"><a href="#" class="icon icon-delete remove-trigger" title="Удалить" onclick="del_fields(' + field_counter + ');return false;"></a></td>', '</tr>'].join('');

    $("#add_btn").before(str);

    selectize('#fieldtype_' + field_counter);
}

function add_fields_list() {
    field_counter++;

    str = ['<tr id="tr' + field_counter + '">', '<td><input name="var[' + field_counter + ']"></td>', '<td><input name="value[' + field_counter + ']"></td>', '<td><input type="checkbox" name="default[' + field_counter + ']"></td>', '<td><input name="ord[' + field_counter + ']" value="' + field_counter + '0"></td>', '<td class="tac"><a href="#" class="icon icon-delete remove-trigger" title="Удалить" onclick="del_fields(' + field_counter + ');return false;"></a></td>', '</tr>'].join('\n');

    $("#add_btn").before(str);
}

function select_type(obj) {
    var row_numd = 1 * $(obj).attr("id").split('_')[1],
        append_obj = $("#tr" + row_numd + " .addition"),
        str = get_addition(obj.value.split(':')[0], row_numd);

    $(append_obj).empty().append(str || '');

    selectize();
}

function get_addition(type, index) {
    var tmp = [],
        str = [];

    if (['input', 'cost', 'int', 'hidden', 'document', 'timestamp', 'email', 'list', 'autocomplete', 'select', 'treeselect', 'float', 'system', 'multiselect', 'datetime'].indexOf(type) >= 0) {
        str = ['<div class="group">', '<label class="group__item"><input type="radio" class="group__item__rb" name="f_width[' + index + ']" value="25"><span class="group__item__style"></span><span class="group__item__text">25%</span></label>', '<label class="group__item"><input type="radio" class="group__item__rb" name="f_width[' + index + ']" value="50"><span class="group__item__style"></span><span class="group__item__text">50%</span></label>', '<label class="group__item"><input type="radio" class="group__item__rb" name="f_width[' + index + ']" value="75"><span class="group__item__style"></span><span class="group__item__text">75%</span></label>', '<label class="group__item"><input type="radio" class="group__item__rb" name="f_width[' + index + ']" value="100" checked><span class="group__item__style"></span><span class="group__item__text">100%</span></label>', '</div>'];

        if (['list', 'autocomplete', 'select', 'treeselect', 'radio', 'multiselect', 'checkbox', 'system'].indexOf(type) >= 0) {
            str.push('<div class="cb mb10"></div>');
        }
    }

    if (type == 'hidden') {
        str.push('<input value="" name="f_hidden_default[' + index + ']" placeholder="Значение по умолчанию">');
    }

    if (type == 'system') {
        str.push('<input value="" name="f_binding[' + index + ']" placeholder="Например поле (title)">');
    }

    if (type == 'date') {
        tmp = ['<div class="help-cover">', '<input name="f_date_format[' + index + ']" value="DD.MM.YYYY" placeholder="Формат даты">', '<div class="tooltip tooltip-down">', 'D — день,<br>', 'M — месяц (без нуля впереди)<br>', 'DD, MM — день и месяц с нулём впереди для значений от 1 до 9<br>', 'YY — 2-символьное обозначение года<br>', 'YYYY — 4-символьное обозначение года (год пишется полностью)', '</div>', '</div>'];

        str.push(tmp.join('\n'));
    }

    if (['file', 'image'].indexOf(type) >= 0) {
        tmp = ['<div class="option-group option-combo">', '<label><input type="radio" name="f_file_count[' + index + ']" value="0"><span class="option">Один файл</span></label>', '<label><input type="radio" name="f_file_count[' + index + ']" value="1" checked><span class="option">Много файлов</span></label>', '</div>'];

        if (type == 'image') {
            tmp.push('<div class="cb mb10"></div>');
        }

        str.push(tmp.join('\n'));
    }

    if (['gallery', 'image'].indexOf(type) >= 0 && typeof CONFIGURE !== 'undefined' && typeof CONFIGURE.image !== 'undefined') {
        var tmp0 = [],
            tmp1 = [],
            tmp2 = [],
            x,
            checked = '';
        tmp0 = ['<div class="js-size-list">', '<table class="table-simple">', '<col><col><col><col width="57"><col width="20">', '<thead>', '<tr>', '<td class="h">Префикс</td>', '<td class="h">Ширина</td>', '<td class="h">Высота</td>', '<td class="h">Метод</td>', '<td class="h"></td>', '</tr>', '</thead>', '<tbody>'];

        tmp1 = template('tpl_image_row', {
            index: 0,
            button: true,
            iteration: index
        });

        tmp2 = ['</tbody>', '</table>', '<a href="#" class="add-size js-add-size" data-iteration="{$smarty.foreach.i.iteration}"><i class="icon icon-plus-square"></i> Добавить размер</a>', '</div>'];

        str.push(tmp0.join('\n'));
        str.push(tmp1);
        str.push(tmp2.join('\n'));
    }

    if (['embedded'].indexOf(type) >= 0) {
        if (!is_undefined(MODULE_LIST)) {
            var select = '',
                m;

            for (m in MODULE_LIST) {
                select += '<option value="' + m + '">' + MODULE_LIST[m].name + '</option>';
            }
        }

        tmp = ['<div class="j-select-wrapper">', '<div class="mb5">', '<select name="f_module[' + index + ']" data-placeholder="Выбрать модуль" class="j-select-choosen">', '<option value="0">---</option>', select, '</select>', '</div>', '<div class="clearfix j-select-container">', '<select name="f_fields[' + index + '][]" multiple data-placeholder="Выбрать" disabled></select>', '</div>', '</div>'];

        str.push(tmp.join('\n'));
    }

    if (['list', 'section', 'autocomplete', 'select', 'treeselect', 'radio', 'checkbox', 'multiselect'].indexOf(type) >= 0) {
        tmp = ['<div class="cb clearfix">', '<label class="controll"><input type="checkbox" class="controll__input" value="1" onchange="switch_types(this)" name="f_use_table_list[' + index + ']"><span class="controll__visible controll__visible_checkbox"></span><span class="controll__text">привязать к `#__mdd_lists`</span></label>', '<div class="case case0">', '<input name="f_table_name[' + index + ']" value="" class="mb5" placeholder="Название таблицы (#_news)">', '<input name="f_table_field[' + index + ']" value="" placeholder="Поле (title)">', '</div>', '<div class="case case1 hidden">', '<input name="f_table_list[' + index + ']" disabled placeholder="BIND списка" value="">', '</div>', '</div>'];

        str.push(tmp.join('\n'));
    }

    if (['range', 'slider'].indexOf(type) >= 0) {
        tmp = ['<div class="-col">', '<div class="-left">', '<input name="f_range[' + index + '][min]" value="" placeholder="Min" class="integer">', '</div>', '<div class="-right">', '<input name="f_range[' + index + '][max]" value="" placeholder="Max" class="integer">', '</div>', '</div>'];

        str.push(tmp.join('\n'));
    }

    if (type == 'editor' && typeof CONFIGURE !== 'undefined' && typeof CONFIGURE.editor !== 'undefined') {
        tmp = [];
        tmp.push('<div class="option-group option-combo">');

        var x,
            checked = '';

        for (x in CONFIGURE.editor) {
            checked = '';

            if (typeof CONFIGURE.editor[x]['default'] !== 'undefined' && CONFIGURE.editor[x]['default'] == 1) {
                checked = ' checked';
            }

            tmp.push('<label><input type="radio" name="f_editor[' + index + ']" value="' + CONFIGURE.editor[x]['system'] + '" ' + checked + '><span class="option">' + CONFIGURE.editor[x]['name'] + '</span></label>');
        }

        tmp.push('</div>');

        if (typeof CONFIGURE !== 'undefined' && typeof CONFIGURE.editor_mode !== 'undefined') {
            tmp.push('<div class="cb mb10"></div>');

            tmp.push('<div class="option-group">');
            for (x in CONFIGURE.editor_mode) {
                tmp.push('<label><input type="radio" name="f_editor_mode[' + index + ']" value="' + CONFIGURE.editor_mode[x] + '"><span class="option">' + CONFIGURE.editor_mode[x] + '</span></label>');
            }

            tmp.push('</div>');
        }

        str.push(tmp.join('\n'));
    }

    if (type == 'redactor' && typeof CONFIGURE !== 'undefined' && typeof CONFIGURE.redactor !== 'undefined') {
        tmp = [];
        tmp.push('<div class="group">');

        var x,
            checked = '';

        for (x in CONFIGURE.redactor) {
            if (typeof CONFIGURE.redactor[x]['name'] !== 'undefined' && typeof CONFIGURE.redactor[x]['system'] !== 'undefined') {
                checked = '';

                if (typeof CONFIGURE.redactor[x]['default'] !== 'undefined' && CONFIGURE.redactor[x]['default'] == 1) {
                    checked = ' checked';
                }

                tmp.push('<label class="group__item"><input type="radio" class="group__item__rb" name="f_redactor[' + index + ']" value="' + CONFIGURE.redactor[x]['system'] + '"' + checked + '><span class="group__item__style"></span><span class="group__item__text">' + CONFIGURE.redactor[x]['name'] + '</span></label>');
            }
        }

        tmp.push('</div>');

        str.push(tmp.join('\n'));
    }

    return str.join('\n');
}

function switch_types(obj) {
    p_obj = $(obj).closest('td');
    if (obj.checked) {
        $(".case1", p_obj).show();
        $(".case1 input", p_obj).attr({ "disabled": false });
        $(".case0", p_obj).hide();
        $(".case0 input", p_obj).attr({ "disabled": true });
    } else {
        $(".case0", p_obj).show();
        $(".case0 input", p_obj).attr({ "disabled": false });
        $(".case1", p_obj).hide();
        $(".case1 input", p_obj).attr({ "disabled": true });
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

    if (bytes >= 1024) {
        return (bytes / 1000).toFixed(2) + ' Кб';
    }

    return bytes + ' б';
}

function addExtendet() {
    $.post("/" + ADMIN_DIR + "/ajax/vote/", {
        action: $("#action").attr("value"),
        id: $("#id").attr("value"),
        title: $("#title").attr("value"),
        ord: $("#ord").attr("value"),
        visible: $("#VoteAddQuestions input:radio[name=visible]:checked").val()
    }, onAjaxSuccessAdd);
    function onAjaxSuccessAdd(data) {
        //
        var vis;
        if ($("#VoteAddQuestions input:radio[name=visible]:checked").val() == 1) vis = "Да";else vis = "Нет";

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
        $("#title").attr({ value: "" });
        $("#ord").attr({ value: "" });

        //  HIDE FORM
        $("#ajax_add_form").hide();
    }
}
function saveExtendet(id) {
    $.post("/" + ADMIN_DIR + "/ajax/vote/", {
        action: "update",
        id: $("#id_" + id).attr("value"),
        parent_id: $("#parent_id_" + id).attr("value"),
        title: $("#title_input_" + id).attr("value"),
        ord: $("#ord_input_" + id).attr("value"),
        visible: $("#VoteAddQuestions input:radio[name=visible_" + id + "]:checked").val()
    }, onAjaxSuccessSave);
    function onAjaxSuccessSave(data) {
        var vis;
        if ($("#vis_" + id).val() == 1) vis = "Да";else vis = "Нет";
        $("#title_" + id).html("<b>" + $("#title_input_" + id).attr("value") + "</b>");
        $("#ord_" + id).html($("#ord_input_" + id).attr("value"));
        $("#visible_" + id).html(vis);

        $("#title_" + id).show();
        $("#ord_" + id).show();
        $("#visible_" + id).show();
        $("#title_i_" + id).hide();
        $("#ord_i_" + id).hide();
        $("#visible_i_" + id).hide();
    }
}
//
function editExtendet(id) {
    $("#title_" + id).hide();
    $("#ord_" + id).hide();
    $("#visible_" + id).hide();
    $("#title_i_" + id).show();
    $("#ord_i_" + id).show();
    $("#visible_i_" + id).show();
}
//
function delExtendet(id) {
    if (cp.dialog("Вы действительно хотите удалить запись?")) {
        $.post("/" + ADMIN_DIR + "/ajax/vote/", {
            action: "del",
            id: $("#id_" + id).val()
        }, onAjaxSuccessDel);
    }
}
function onAjaxSuccessDel(data) {
    $("#tr_" + data).remove();
}
//
function cancelExtendet(id) {
    $("#title_" + id).show();
    $("#ord_" + id).show();
    $("#visible_" + id).show();
    $("#title_i_" + id).hide();
    $("#ord_i_" + id).hide();
    $("#visible_i_" + id).hide();
}

function onAjaxSuccess(data) {
    alert(data);
}

function editTitle(id, title) {
    if (typeof title == 'undefined') {
        var title = $('#ftitle_' + id).text();
    }

    var name = prompt('Введите новое имя', title);

    if (name != '' && name != title && name !== null) {
        $.ajax({
            url: '/' + ADMIN_DIR + '/meta/filename',
            type: "post",
            data: {
                id: id,
                name: name
            },
            dataType: 'JSON',
            success: function success(response) {
                if (response.status === true) {
                    $('#ftitle_' + id).html(name);
                }
            }
        });
    }

    return false;
}

function editVisible(id, visible) {
    visible = visible == 1 ? 0 : 1;

    $.ajax({
        url: '/' + ADMIN_DIR + '/meta/filevisible',
        type: "post",
        data: {
            id: id,
            visible: visible
        },
        dataType: 'JSON',
        success: function success(response) {
            if (response.status === true) {
                $('#fvisible_' + id).removeClass('icon-eye icon-eye-off');

                if (visible == 1) {
                    $('#fvisible_' + id).addClass('icon-eye');
                } else {
                    $('#fvisible_' + id).addClass('icon-eye-off');
                }
            }
        }
    });

    return false;
}

function editOrd(id, ord) {
    var neword = prompt('Порядок', ord);

    if (!neword) return false;

    if (neword != '' && neword != ord) {
        $.post('/' + ADMIN_DIR + '/ajax/meta/', { action: "newfileord", neword: neword, id: id }, function (data) {
            if (data == 1) {
                $('#ordfile_' + id).html(neword);
            }
        });
    }
    return false;
}

function ajax_vis_toggle(obj, id, mod_id) {
    $(obj).append('<i class="loading"></i>');

    $.post('/' + ADMIN_DIR + '/ajax/structure/', { act: "toggle_visible", mod_id: mod_id, id: id }, function (data) {
        if (data == 1) {
            $(obj).toggleClass("icon-eye").toggleClass("icon-eye-off").html('');
        }
    });

    return !1;
}

function show_tooltips(id) {
    $("#" + id).toggle();
}

function my_uncheck() {
    $(".access").each(function () {
        $(this).attr({ checked: '' });
    });
}

function CheckAndSubmit(id) {
    var flag = true;
    $("#" + id + " .ness").each(function () {
        if ($(this).val() == "") {
            $(this).focus().addClass("error");
            flag = false;
            return false;
        } else {
            $(this).removeClass("error");
        }
    });
    if (flag) $("#" + id).submit();else return false;
}

function setSort(obj, cookie_name) {
    value = $(obj).val();
    setCookie(cookie_name, value);
    location.href = location.href;
}

function form_submit(id, param) {
    if (param == "save") $("#" + id).submit();
    if (param == "apply") $("#" + id).submit();else $("#" + id).submit();
}

function openwin(img, w, h, title) {
    if (hwnd != null) hwnd.close();
    hwnd = window.open(img, "", "toolbar=no , location=no , directories=no , resizable=no , width=" + w + " , height=" + h);
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

function openwin_text(url, w, h) {
    window.open(url, "", "toolbar=no , location=no , directories=no , resizable=no , scrollbars=no , width=" + w + " , height=" + h);
}

function ltrim(str) {
    for (var k = 0; k < str.length && isWhitespace(str.charAt(k)); k++) {}
    return str.substring(k, str.length);
}

function rtrim(str) {
    for (var j = str.length - 1; j >= 0 && isWhitespace(str.charAt(j)); j--) {}
    return str.substring(0, j + 1);
}

function trim(str) {
    str = str.replace(/\s{2,}/g, ' ');
    return ltrim(rtrim(str));
}

function isWhitespace(charToCheck) {
    var whitespaceChars = " \t\n\r\f";
    return whitespaceChars.indexOf(charToCheck) != -1;
}

function transliterate(string, url) {
    string = trim(string.toLowerCase());

    if (string != '') {
        var _char_map;

        var char_map = {},
            test = [],
            result = '',
            x;

        char_map = (_char_map = {
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
            'ş': 's', 'ı': 'i' }, _defineProperty(_char_map, '\xE7', 'c'), _defineProperty(_char_map, '\xFC', 'u'), _defineProperty(_char_map, '\xF6', 'o'), _defineProperty(_char_map, 'ğ', 'g'), _defineProperty(_char_map, 'а', 'a'), _defineProperty(_char_map, 'б', 'b'), _defineProperty(_char_map, 'в', 'v'), _defineProperty(_char_map, 'г', 'g'), _defineProperty(_char_map, 'д', 'd'), _defineProperty(_char_map, 'е', 'e'), _defineProperty(_char_map, 'ё', 'yo'), _defineProperty(_char_map, 'ж', 'zh'), _defineProperty(_char_map, 'з', 'z'), _defineProperty(_char_map, 'и', 'i'), _defineProperty(_char_map, 'й', 'j'), _defineProperty(_char_map, 'к', 'k'), _defineProperty(_char_map, 'л', 'l'), _defineProperty(_char_map, 'м', 'm'), _defineProperty(_char_map, 'н', 'n'), _defineProperty(_char_map, 'о', 'o'), _defineProperty(_char_map, 'п', 'p'), _defineProperty(_char_map, 'р', 'r'), _defineProperty(_char_map, 'с', 's'), _defineProperty(_char_map, 'т', 't'), _defineProperty(_char_map, 'у', 'u'), _defineProperty(_char_map, 'ф', 'f'), _defineProperty(_char_map, 'х', 'h'), _defineProperty(_char_map, 'ц', 'c'), _defineProperty(_char_map, 'ч', 'ch'), _defineProperty(_char_map, 'ш', 'sh'), _defineProperty(_char_map, 'щ', 'sch'), _defineProperty(_char_map, 'ъ', ''), _defineProperty(_char_map, 'ы', 'y'), _defineProperty(_char_map, 'ь', ''), _defineProperty(_char_map, 'э', 'e'), _defineProperty(_char_map, 'ю', 'yu'), _defineProperty(_char_map, 'я', 'ya'), _defineProperty(_char_map, 'є', 'ye'), _defineProperty(_char_map, 'і', 'i'), _defineProperty(_char_map, 'ї', 'yi'), _defineProperty(_char_map, 'ґ', 'g'), _defineProperty(_char_map, 'č', 'c'), _defineProperty(_char_map, 'ď', 'd'), _defineProperty(_char_map, 'ě', 'e'), _defineProperty(_char_map, 'ň', 'n'), _defineProperty(_char_map, 'ř', 'r'), _defineProperty(_char_map, 'š', 's'), _defineProperty(_char_map, 'ť', 't'), _defineProperty(_char_map, 'ů', 'u'), _defineProperty(_char_map, 'ž', 'z'), _defineProperty(_char_map, 'ą', 'a'), _defineProperty(_char_map, 'ć', 'c'), _defineProperty(_char_map, 'ę', 'e'), _defineProperty(_char_map, 'ł', 'l'), _defineProperty(_char_map, 'ń', 'n'), _defineProperty(_char_map, '\xF3', 'o'), _defineProperty(_char_map, 'ś', 's'), _defineProperty(_char_map, 'ź', 'z'), _defineProperty(_char_map, 'ż', 'z'), _defineProperty(_char_map, 'ā', 'a'), _defineProperty(_char_map, '\u010D', 'c'), _defineProperty(_char_map, 'ē', 'e'), _defineProperty(_char_map, 'ģ', 'g'), _defineProperty(_char_map, 'ī', 'i'), _defineProperty(_char_map, 'ķ', 'k'), _defineProperty(_char_map, 'ļ', 'l'), _defineProperty(_char_map, 'ņ', 'n'), _defineProperty(_char_map, '\u0161', 's'), _defineProperty(_char_map, 'ū', 'u'), _defineProperty(_char_map, '\u017E', 'z'), _char_map);

        // Очищаем от лишних символов

        result = string.replace(/[^a-zа-я0-9]/gi, '-');

        if (url == 'cyrillic') {
            result = encodeURI(unescape(unescape(result)));
        } else if (url == 'translate') {
            for (x in char_map) {
                result = result.replace(RegExp(x, 'g'), char_map[x]);
            }
            // result = result.replace(RegExp(x, 'g'), char_map[x]);
        } else {
            for (x in char_map) {
                result = result.replace(RegExp(x, 'g'), char_map[x]);
            }
        }

        // Очищаем от лишних дефисов

        test = result.split('');

        if (test[0] == '-') {
            result = result.slice(1);
        }

        if (test[test.length - 1] == '-') {
            result = result.slice(0, -1);
        }

        string = result;
    }

    return redouble(string);
}

function binding(name, element) {
    $('body').on('keyup blur keypress', 'input[name="' + name + '"]', function () {
        if (this.value !== '') {
            var $input = $('input[name="' + element + '"]');
            if (!$input.prop('readonly')) {
                $input.val(transliterate(this.value, URL_TRANSLATE));
            }
        }
    });
}

function redouble(string) {
    string = string.replace('__', '_');
    string = string.replace('_-_', '_');
    string = string.replace('--', '-');

    if (string.indexOf('__') > -1) {
        return redouble(string);
    }

    if (string.substr(0, 1) == '_' && string.length > 1) {
        string = string.substr(1, string.length);
    }

    return string;
}

function ajax_toggle_group(obj, id) {
    var visible = 0;

    if ($(obj).hasClass('icon-eye-off')) {
        visible = 1;
    } else {
        visible = 0;
    }

    $(obj).append('<i class="loading"></i>');

    $.post('/' + ADMIN_DIR + '/ajax/modules/', { action: "devisible", id: id, visible: visible }, function (data) {
        if (data == 1) {
            if ($(obj).hasClass('icon-eye-off')) {
                $(obj).removeClass('icon-eye-off').addClass('icon-eye').html('');
            } else {
                $(obj).removeClass('icon-eye').addClass('icon-eye-off').html('');
            }
        }
    });

    return false;
}

function toggle_menu(obj, id) {
    $(obj).toggleClass("minus").toggleClass("plus").parent();
    $("#item" + id).toggle();
}

function toggle_small_photo(id) {
    $("#" + id).toggle();
}

function hideField(id) {
    title = $("#docs_" + id + " .title_in").val();
    ord = $("#docs_" + id + " .ord_in").val();

    $("#docs_" + id + " .title_f").empty().append(title);
    $("#docs_" + id + " .ord_f").empty().append(ord);
    $("#docs_" + id + " .but_save").hide();
    $("#docs_" + id + " .ctr_edit").show();
}

function EditDocs(id) {
    $("#docs_" + id + " .but_save").show();
    $("#docs_" + id + " .ctr_edit").hide();

    curr_value = $("#docs_" + id + " .title_f").text();
    $("#docs_" + id + " .title_f").empty().append("<input type='text' value='" + curr_value + "' name='title' class='bord padd w100 title_in' />");
    curr_value = $("#docs_" + id + " .ord_f").text();
    $("#docs_" + id + " .ord_f").empty().append("<input type='text' value='" + curr_value + "' name='ord' class='bord padd w20 ord_in' />");

    $("#docs_" + id + " .title_in").focus();
    return false;
}

function SaveDocs(id) {
    title = $("#docs_" + id + " .title_in").val();
    ord = $("#docs_" + id + " .ord_in").val();

    if (!title) {
        alert("Пустое имя документа");
        hideField(id);
    }

    $.post('/' + ADMIN_DIR + '/ajax/document/', {
        id: "document_edit",
        docsid: id,
        title: title,
        ord: ord
    }, function (data) {
        alert('Данные обновлены');
        hideField(id);
    });
    return false;
}

function DelDocs(id) {
    if (cp.dialog('Вы действительно хотите удалить?')) {
        $.post('/' + ADMIN_DIR + '/ajax/document/', {
            id: "document_del",
            docsid: id
        }, function (data) {
            if (data > 0) {
                $("#docs_" + id).hide();
            } else alert('ошибка обновления');
        });
    }
    return false;
}

function page_update(item_id) {
    $.post('/' + ADMIN_DIR + '/ajax/document/', {
        id: "update", post_id: item_id
    }, function (data) {
        var json = eval("(" + data + ")");
        parseMsg(json, "file_docs");
    });
    return false;
}

function parseMsg(msg, obj) {
    $("#" + obj + " .uploadfiles").empty();
    $("#" + obj + " input:file").attr({ "value": "" });

    str = '<table style="margin-bottom:10px;width:80%"><tr>\n<td class="h w100">Документ</td>\n<td class="h">Размер</td>\n<td class="h">Удалить</td></tr>\n';
    var i = 0;
    $.each(msg, function (k, v) {
        if (i % 2 != 0) odd = "odd ";else odd = "";
        str += '<tr>\n<td class="' + odd + '"><a href="' + v.sys_name + '" title="" target="_blank">' + v.title + '</a></td>\n';
        str += '<td class="' + odd + 'r"> ' + v.size + '</td>\n';
        str += '<td class="actions"><a href="#" onclick="return Module.ajaxFileDelete(' + v.id + ',\'' + obj + '\');" class="ctr_a ctr_del margin" title="Удалить" onclick="return confirm(\'Вы действительно хотите удалить?\')"></a></td>\n</tr>\n';
        i++;
    });
    str += '</table>';
    $("#" + obj + " .uploadfiles").append(str);
}

function ajaxFileDocsUpload(docs_group_id) {}

function screening(str) {
    var reg = /"/g;
    var result = str.replace(reg, "&quot;");

    return result;
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlbHBlcnMuanMiXSwibmFtZXMiOlsiZCIsImRvY3VtZW50IiwiY3NzIiwiZWxlbWVudCIsInN0eWxlIiwicHJvcCIsImFuaW1hdGUiLCJvcHRzIiwiY2FsbGJhY2siLCJzdGFydCIsIkRhdGUiLCJ0aW1lciIsInNldEludGVydmFsIiwicHJvZ3Jlc3MiLCJkdXJhdGlvbiIsInN0ZXAiLCJhcHBseSIsImNsZWFySW50ZXJ2YWwiLCJkZWxheSIsInN0b3AiLCJhZGRDbGFzcyIsImNsYXNzbmFtZSIsImNuIiwiY2xhc3NOYW1lIiwiaW5kZXhPZiIsInJlbW92ZUNsYXNzIiwicnhwIiwiUmVnRXhwIiwicmVwbGFjZSIsImlzX3N0cmluZyIsIm1peGVkX3ZhciIsImlzX251bWVyaWMiLCJuIiwiaXNOYU4iLCJwYXJzZUZsb2F0IiwiaXNGaW5pdGUiLCJtYXBDb250ZWluZXIiLCJ0eXBlIiwibWFwaWQiLCJnb29nbGVNYXBzIiwieWFuZGV4TWFwcyIsImNoZWNrQWxsIiwiY2hlY2tlZCIsIiQiLCJtYXAiLCJsaW5rIiwicGxhY2UiLCJjaXR5IiwiZ2V0QmFsb29uIiwiY29vcmQiLCJ5bWFwcyIsIlBsYWNlbWFyayIsImRyYWdnYWJsZSIsImRyYXciLCJNYXAiLCJjZW50ZXIiLCJ6b29tIiwiY29udHJvbHMiLCJhZGQiLCJyaWdodCIsInRvcCIsImNvbnRyb2wiLCJTY2FsZUxpbmUiLCJsZWZ0IiwiZHJhZ0JhbGxvb24iLCJldmVudHMiLCJlIiwiZ2VvT2JqZWN0cyIsInJlbW92ZSIsImdldCIsInNldENvb3JkIiwib2JqZWN0IiwiY29vcmRzIiwiZ2VvbWV0cnkiLCJnZXRDb29yZGluYXRlcyIsInByb3BlcnRpZXMiLCJzZXQiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJHZW9PYmplY3QiLCJjb29yZGluYXRlcyIsImNvbGxlY3Rpb24iLCJHZW9PYmplY3RDb2xsZWN0aW9uIiwiaSIsInJlYWR5IiwiZ29vZ2xlIiwibWFwcyIsImdldEVsZW1lbnRCeUlkIiwiem9vbUNvbnRyb2wiLCJwYW5Db250cm9sIiwic2Nyb2xsd2hlZWwiLCJuYXZpZ2F0aW9uQ29udHJvbCIsIm1hcFR5cGVDb250cm9sIiwic2NhbGVDb250cm9sIiwiZGlzYWJsZURvdWJsZUNsaWNrWm9vbSIsIkxhdExuZyIsImRhdGVwaWNrZXIiLCIkY2FsZW5kYXIiLCJlYWNoIiwiaWQiLCJpdGVtIiwiJGNsb3Nlc3QiLCJjbG9zZXN0IiwiJGVsZW1lbnQiLCJmaW5kIiwiZGlzYWJsZWQiLCJpcyIsInRpbWVzdGFtcCIsImRhdGEiLCJkX2Zvcm1hdCIsInRvTG93ZXJDYXNlIiwiJGNhbGVuZGFySXRlbSIsImZvcm1hdCIsImF1dG9jbG9zZSIsImNvbnRhaW5lciIsImxhbmd1YWdlIiwiQURNSU5fTE9DQUxFIiwib24iLCJldiIsInJlc3VsdCIsImdldFRpbWUiLCJ2YWwiLCJzZWxlY3RpemUiLCJzZWxlY3RvciIsIiRzZWxlY3RvciIsImlzX29iamVjdCIsIm9wdGlvbnMiLCJ3aWR0aCIsImFsbG93X3NpbmdsZV9kZXNlbGVjdCIsIm5vX3Jlc3VsdHNfdGV4dCIsImRpc2FibGVfc2VhcmNoX3RocmVzaG9sZCIsIiRzZWxlY3QiLCJwbGFjZWhvbGRlciIsImF0dHIiLCJpc011bHRpcGxlIiwicGxhY2Vob2xkZXJfdGV4dF9tdWx0aXBsZSIsInBsYWNlaG9sZGVyX3RleHRfc2luZ2xlIiwiY2hvc2VuIiwiY2hhbmdlUm93IiwidG9nZ2xlX3NtYWxsX3Bob3RvIiwidG9nZ2xlIiwicmVtb3ZlU2VjdGlvbiIsIl9zZWxmXyIsInByZXZlbnREZWZhdWx0IiwiY29uZmlybSIsInBhcnNlSW50IiwieCIsInNlY3Rpb24iLCJ0bXAiLCJzcGxpdCIsInB1c2giLCJqb2luIiwic2xpZGVyIiwidmFsdWUiLCJtaW4iLCJtYXgiLCJvcmllbnRhdGlvbiIsInZhbHVlcyIsImNvbm5lY3QiLCJiZWhhdmlvdXIiLCJub1VpU2xpZGVyIiwiY3JlYXRlIiwicmFuZ2UiLCJ3TnVtYiIsImRlY2ltYWxzIiwiaGFuZGxlcyIsImhhbmRsZSIsIm1ldGFDb3VudGVyIiwiJGJsb2NrIiwiJGNvdW50ZXIiLCJyZWNvbWVuZCIsImh0bWwiLCJoYXNDbGFzcyIsInNlb0Nyb3dsIiwidHJpbSIsInRvZ2dsZV9pdGVtIiwiZWxjbGFzcyIsIiRpY29uIiwic3dpdGNoX3R5cGVfZmllbGRzIiwib2JqIiwiaGlkZSIsInNob3ciLCJzaG93X3RyIiwidHJhbnNsYXRlX2tleSIsImdlbmVyYXRlUGFzc3dvcmQiLCJyYW5kb20iLCJzZWNyZXQiLCJNYXRoIiwiZmxvb3IiLCJ0b2tlbiIsImNoYXJzIiwiYyIsImNoYXJBdCIsImRlbF9saXN0X2ZpZWxkcyIsImNwIiwiZGlhbG9nIiwiYWRkX2xpc3RfZmllbGRzIiwiZmllbGRfY291bnRlciIsInN0ciIsImFycl9maWVsZF90eXBlIiwiayIsInYiLCJiZWZvcmUiLCJhZGRfbGlzdF9maWVsZHNfbGlzdCIsImRlbF9maWVsZHMiLCJudW1iIiwiYWRkX2ZpZWxkcyIsInNlbGVjdCIsImdldF9hZGRpdGlvbiIsImFkZF9maWVsZHNfbGlzdCIsInNlbGVjdF90eXBlIiwicm93X251bWQiLCJhcHBlbmRfb2JqIiwiZW1wdHkiLCJhcHBlbmQiLCJpbmRleCIsIkNPTkZJR1VSRSIsImltYWdlIiwidG1wMCIsInRtcDEiLCJ0bXAyIiwidGVtcGxhdGUiLCJidXR0b24iLCJpdGVyYXRpb24iLCJpc191bmRlZmluZWQiLCJNT0RVTEVfTElTVCIsIm0iLCJuYW1lIiwiZWRpdG9yIiwiZWRpdG9yX21vZGUiLCJyZWRhY3RvciIsInN3aXRjaF90eXBlcyIsInBfb2JqIiwiaHVtYW5TaXplIiwiYnl0ZXMiLCJ0b0ZpeGVkIiwiYWRkRXh0ZW5kZXQiLCJwb3N0IiwiQURNSU5fRElSIiwiYWN0aW9uIiwidGl0bGUiLCJvcmQiLCJ2aXNpYmxlIiwib25BamF4U3VjY2Vzc0FkZCIsInZpcyIsImlubmVyIiwiaW5zZXJ0QmVmb3JlIiwic2F2ZUV4dGVuZGV0IiwicGFyZW50X2lkIiwib25BamF4U3VjY2Vzc1NhdmUiLCJlZGl0RXh0ZW5kZXQiLCJkZWxFeHRlbmRldCIsIm9uQWpheFN1Y2Nlc3NEZWwiLCJjYW5jZWxFeHRlbmRldCIsIm9uQWpheFN1Y2Nlc3MiLCJhbGVydCIsImVkaXRUaXRsZSIsInRleHQiLCJwcm9tcHQiLCJhamF4IiwidXJsIiwiZGF0YVR5cGUiLCJzdWNjZXNzIiwicmVzcG9uc2UiLCJzdGF0dXMiLCJlZGl0VmlzaWJsZSIsImVkaXRPcmQiLCJuZXdvcmQiLCJhamF4X3Zpc190b2dnbGUiLCJtb2RfaWQiLCJhY3QiLCJ0b2dnbGVDbGFzcyIsInNob3dfdG9vbHRpcHMiLCJteV91bmNoZWNrIiwiQ2hlY2tBbmRTdWJtaXQiLCJmbGFnIiwiZm9jdXMiLCJzdWJtaXQiLCJzZXRTb3J0IiwiY29va2llX25hbWUiLCJzZXRDb29raWUiLCJsb2NhdGlvbiIsImhyZWYiLCJmb3JtX3N1Ym1pdCIsInBhcmFtIiwib3BlbndpbiIsImltZyIsInciLCJoIiwiaHduZCIsImNsb3NlIiwid2luZG93Iiwib3BlbiIsIndyaXRlIiwib3Blbndpbl90ZXh0IiwibHRyaW0iLCJpc1doaXRlc3BhY2UiLCJzdWJzdHJpbmciLCJydHJpbSIsImoiLCJjaGFyVG9DaGVjayIsIndoaXRlc3BhY2VDaGFycyIsInRyYW5zbGl0ZXJhdGUiLCJzdHJpbmciLCJjaGFyX21hcCIsInRlc3QiLCJlbmNvZGVVUkkiLCJ1bmVzY2FwZSIsInNsaWNlIiwicmVkb3VibGUiLCJiaW5kaW5nIiwiJGlucHV0IiwiVVJMX1RSQU5TTEFURSIsInN1YnN0ciIsImFqYXhfdG9nZ2xlX2dyb3VwIiwidG9nZ2xlX21lbnUiLCJwYXJlbnQiLCJoaWRlRmllbGQiLCJFZGl0RG9jcyIsImN1cnJfdmFsdWUiLCJTYXZlRG9jcyIsImRvY3NpZCIsIkRlbERvY3MiLCJwYWdlX3VwZGF0ZSIsIml0ZW1faWQiLCJwb3N0X2lkIiwianNvbiIsImV2YWwiLCJwYXJzZU1zZyIsIm1zZyIsIm9kZCIsInN5c19uYW1lIiwic2l6ZSIsImFqYXhGaWxlRG9jc1VwbG9hZCIsImRv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QUFDQSxRQUFJbkgsSUFBSSxDQUFSO0FBQ0F4QyxNQUFFdUQsSUFBRixDQUFRdU8sR0FBUixFQUFhLFVBQVNqSSxDQUFULEVBQVdDLENBQVgsRUFBYztBQUN2QixZQUFLdEgsSUFBSSxDQUFKLElBQVMsQ0FBZCxFQUFrQnVQLE1BQU0sTUFBTixDQUFsQixLQUNLQSxNQUFNLEVBQU47QUFDTHBJLGVBQU8sc0JBQXNCb0ksR0FBdEIsR0FBNEIsYUFBNUIsR0FBNENqSSxFQUFFa0ksUUFBOUMsR0FBeUQsNkJBQXpELEdBQXlGbEksRUFBRXVDLEtBQTNGLEdBQW1HLGFBQTFHO0FBQ0ExQyxlQUFPLGdCQUFnQm9JLEdBQWhCLEdBQXNCLE1BQXRCLEdBQStCakksRUFBRW1JLElBQWpDLEdBQXdDLFNBQS9DO0FBQ0F0SSxlQUFPLDJFQUEyRUcsRUFBRXRHLEVBQTdFLEdBQWtGLEtBQWxGLEdBQTBGZ0YsR0FBMUYsR0FBZ0csc0lBQXZHO0FBQ0FoRztBQUNILEtBUEQ7QUFRQW1ILFdBQU8sVUFBUDtBQUNBM0osTUFBRSxNQUFJd0ksR0FBSixHQUFRLGVBQVYsRUFBMkJtQyxNQUEzQixDQUFrQ2hCLEdBQWxDO0FBQ0g7O0FBRUQsU0FBU3VJLGtCQUFULENBQTRCQyxhQUE1QixFQUEwQyxDQUV6Qzs7QUFFRCxTQUFTQyxTQUFULENBQW9CekksR0FBcEIsRUFBMEI7QUFDdEIsUUFBSTBJLE1BQUksSUFBUjtBQUNBLFFBQUl6TixTQUFPK0UsSUFBSTFLLE9BQUosQ0FBWW9ULEdBQVosRUFBaUIsUUFBakIsQ0FBWDs7QUFFQSxXQUFPek4sTUFBUDtBQUNIIiwiZmlsZSI6ImhlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZCA9IGRvY3VtZW50O1xuXG52YXIgY3NzID0gZnVuY3Rpb24oZWxlbWVudCwgc3R5bGUpIHtcbiAgICBmb3IgKHZhciBwcm9wIGluIHN0eWxlKSB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGVbcHJvcF0gPSBzdHlsZVtwcm9wXTtcbiAgICB9XG59XG5cbnZhciBhbmltYXRlID0gZnVuY3Rpb24ob3B0cywgY2FsbGJhY2spIHtcbiAgICB2YXIgc3RhcnQgPSBuZXcgRGF0ZTtcbiAgICB2YXIgdGltZXIgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHByb2dyZXNzID0gKG5ldyBEYXRlIC0gc3RhcnQpIC8gb3B0cy5kdXJhdGlvbjtcbiAgICAgICAgaWYgKHByb2dyZXNzID4gMSkgcHJvZ3Jlc3MgPSAxO1xuICAgICAgICBvcHRzLnN0ZXAocHJvZ3Jlc3MpO1xuICAgICAgICBpZiAocHJvZ3Jlc3MgPT0gMSkge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgICB9XG4gICAgfSwgb3B0cy5kZWxheSB8fCAyMCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgICB9XG4gICAgfTtcbn1cblxudmFyIGFkZENsYXNzID0gZnVuY3Rpb24oZWxlbWVudCwgY2xhc3NuYW1lKSB7XG4gICAgdmFyIGNuID0gZWxlbWVudC5jbGFzc05hbWU7XG4gICAgaWYoY24uaW5kZXhPZihjbGFzc25hbWUpICE9IC0xKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoY24gIT0gJycpIHtcbiAgICAgICAgY2xhc3NuYW1lID0gJyAnK2NsYXNzbmFtZTtcbiAgICB9XG4gICAgZWxlbWVudC5jbGFzc05hbWUgPSBjbitjbGFzc25hbWU7XG59XG5cbnZhciByZW1vdmVDbGFzcyA9IGZ1bmN0aW9uKGVsZW1lbnQsIGNsYXNzbmFtZSkge1xuICAgIHZhciBjbiA9IGVsZW1lbnQuY2xhc3NOYW1lO1xuICAgIHZhciByeHAgPSBuZXcgUmVnRXhwKFwiXFxcXHM/XFxcXGJcIitjbGFzc25hbWUrXCJcXFxcYlwiLCBcImdcIik7XG4gICAgY24gPSBjbi5yZXBsYWNlKHJ4cCwgJycpO1xuICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gY247XG59XG5cbmZ1bmN0aW9uIGlzX3N0cmluZyggbWl4ZWRfdmFyICl7XG4gICAgcmV0dXJuICh0eXBlb2YoIG1peGVkX3ZhciApID09ICdzdHJpbmcnKTtcbn1cblxuXG5mdW5jdGlvbiBpc19udW1lcmljKG4pIHtcbiAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xufVxuXG52YXIgbWFwQ29udGVpbmVyID0gZnVuY3Rpb24oIHR5cGUsIG1hcGlkIClcbntcbiAgICBpZiAoIHR5cGUgPT09ICdnb29nbGUnIClcbiAgICB7XG4gICAgICAgIGdvb2dsZU1hcHMoIG1hcGlkICk7XG4gICAgfVxuICAgIGVsc2UgaWYgKCB0eXBlID09PSAneWFuZGV4JyApXG4gICAge1xuICAgICAgICB5YW5kZXhNYXBzKCBtYXBpZCApO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tBbGwoZWxlbWVudClcbntcbiAgICB2YXIgY2hlY2tlZCA9ICQoZWxlbWVudCkucHJvcCgnY2hlY2tlZCcpO1xuICAgICQoJy5jaGVjay1hbGwtc3B5JykucHJvcCgnY2hlY2tlZCcsIGNoZWNrZWQpO1xufVxuXG5mdW5jdGlvbiB5YW5kZXhNYXBzKCBtYXBpZCApXG57XG4gICAgdmFyIG1hcCA9IHtcbiAgICAgICAgbGluazogbnVsbCxcbiAgICAgICAgbWFwaWQ6ICdtYXAtY29udGVpbmVyLScgKyBtYXBpZCxcbiAgICAgICAgcGxhY2U6ICdrcmFzbm9kYXInLFxuICAgICAgICB0eXBlOiAneWFuZGV4I21hcCcsIC8vICd5YW5kZXgjbWFwJyAneWFuZGV4I3NhdGVsbGl0ZScgJ3lhbmRleCNoeWJyaWQnICd5YW5kZXgjcHVibGljTWFwJyAneWFuZGV4I3B1YmxpY01hcEh5YnJpZCdcbiAgICAgICAgY2l0eToge1xuICAgICAgICAgICAgJ2tyYXNub2Rhcic6IFs0NS4wOTQ3MTcxNjU5MzAyOSwgMzkuMDE1ODk5MDAwMDAwMDFdLFxuICAgICAgICAgICAgJ21vc2Nvdyc6IFs1NS43NiwgMzcuNjRdLFxuICAgICAgICB9LFxuICAgICAgICBnZXRCYWxvb246IGZ1bmN0aW9uKCBjb29yZCApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgeW1hcHMuUGxhY2VtYXJrKCBjb29yZCwge30sIHtcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGU6IHRydWVcbiAgICAgICAgICAgICAgICAvLyxcbiAgICAgICAgICAgICAgICAvL2ljb25JbWFnZUhyZWY6ICcvaW1hZ2VzL215SWNvbi5naWYnLFxuICAgICAgICAgICAgICAgIC8vaWNvbkltYWdlU2l6ZTogWzMwLCA0Ml0sXG4gICAgICAgICAgICAgICAgLy9pY29uSW1hZ2VPZmZzZXQ6IFstMywgLTQyXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGRyYXc6IGZ1bmN0aW9uKCB5bWFwcyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIG1hcC5saW5rID0gbmV3IHltYXBzLk1hcCh0aGlzLm1hcGlkLCB7XG4gICAgICAgICAgICAgICAgY2VudGVyOiBtYXAuY2l0eVsgdGhpcy5wbGFjZSBdLFxuICAgICAgICAgICAgICAgIHpvb206IDEyLFxuICAgICAgICAgICAgICAgIHR5cGU6IG1hcC50eXBlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbWFwLmxpbmsuY29udHJvbHNcbiAgICAgICAgICAgICAgICAuYWRkKCdzbWFsbFpvb21Db250cm9sJywgeyByaWdodDogMTAsIHRvcDogMTUgfSlcbiAgICAgICAgICAgICAgICAuYWRkKG5ldyB5bWFwcy5jb250cm9sLlNjYWxlTGluZSgpKVxuICAgICAgICAgICAgICAgIC5hZGQoJ3NlYXJjaENvbnRyb2wnLCB7IGxlZnQ6IDIwLCB0b3A6IDIwIH0pO1xuXG4gICAgICAgICAgICB2YXIgZHJhZ0JhbGxvb24gPSB0aGlzLmdldEJhbG9vbiggbWFwLmNpdHlbIHRoaXMucGxhY2UgXSApO1xuXG4gICAgICAgICAgICBtYXAubGluay5ldmVudHMuYWRkKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgbWFwLmxpbmsuZ2VvT2JqZWN0cy5yZW1vdmUoIGRyYWdCYWxsb29uICk7XG5cbiAgICAgICAgICAgICAgICBkcmFnQmFsbG9vbiA9IG1hcC5nZXRCYWxvb24oIGUuZ2V0KCdjb29yZFBvc2l0aW9uJykgKTtcbiAgICAgICAgICAgICAgICBtYXAubGluay5nZW9PYmplY3RzLmFkZCggZHJhZ0JhbGxvb24gKTtcblxuICAgICAgICAgICAgICAgIG1hcC5zZXRDb29yZCggZS5nZXQoJ2Nvb3JkUG9zaXRpb24nKSApO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIG1hcC5saW5rLmdlb09iamVjdHMuYWRkKCBkcmFnQmFsbG9vbiApLmV2ZW50cy5hZGQoJ2RyYWdlbmQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9iamVjdCA9IGUuZ2V0KCd0YXJnZXQnKTtcbiAgICAgICAgICAgICAgICB2YXIgY29vcmRzID0gb2JqZWN0Lmdlb21ldHJ5LmdldENvb3JkaW5hdGVzKCk7XG4gICAgICAgICAgICAgICAgb2JqZWN0LnByb3BlcnRpZXMuc2V0KCdiYWxsb29uQ29udGVudCcsIGNvb3Jkcyk7XG5cbiAgICAgICAgICAgICAgICBtYXAuc2V0Q29vcmQoIGNvb3JkcyApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGFkZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoIGFyZ3VtZW50cy5sZW5ndGggPT0gMSApIHtcbiAgICAgICAgICAgICAgICBtYXAubGluay5nZW9PYmplY3RzLmFkZChcbiAgICAgICAgICAgICAgICAgICAgbmV3IHltYXBzLkdlb09iamVjdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiUG9pbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlczogYXJndW1lbnRzWzBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBjb2xsZWN0aW9uID0gbmV3IHltYXBzLkdlb09iamVjdENvbGxlY3Rpb24oKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaTxhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbi5hZGQobmV3IHltYXBzLlBsYWNlbWFyayhhcmd1bWVudHNbaV0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbWFwLmxpbmsuZ2VvT2JqZWN0cy5hZGQoY29sbGVjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgeW1hcHMucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgbWFwLmRyYXcoIHltYXBzICk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGdvb2dsZU1hcHMoIG1hcGlkIClcbntcbiAgICB2YXIgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkLmdldEVsZW1lbnRCeUlkKCAnbWFwLWNvbnRlaW5lci0nICsgbWFwaWQgKSwge1xuICAgICAgICB6b29tOiAxNCxcbiAgICAgICAgem9vbUNvbnRyb2w6ICExLFxuICAgICAgICBwYW5Db250cm9sOiAhMSxcbiAgICAgICAgc2Nyb2xsd2hlZWw6ICExLFxuICAgICAgICBuYXZpZ2F0aW9uQ29udHJvbDogITEsXG4gICAgICAgIG1hcFR5cGVDb250cm9sOiAhMSxcbiAgICAgICAgc2NhbGVDb250cm9sOiAhMSxcbiAgICAgICAgZHJhZ2dhYmxlOiAhMCxcbiAgICAgICAgZGlzYWJsZURvdWJsZUNsaWNrWm9vbTogITAsXG4gICAgICAgIGNlbnRlcjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZyg0NS4wNTM1NDgsMzkuMDE2MDU2KVxuICAgIH0pO1xufVxuXG52YXIgZGF0ZXBpY2tlciA9IGZ1bmN0aW9uKClcbntcbiAgICBjb25zdCAkY2FsZW5kYXIgPSAkKCcuY2FsZW5kYXInKTtcblxuICAgICRjYWxlbmRhci5lYWNoKChpZCwgaXRlbSkgPT4ge1xuICAgICAgICBjb25zdCAkY2xvc2VzdCA9ICQoaXRlbSkuY2xvc2VzdCgnLmNhbGVuZGFyJyk7XG4gICAgICAgIGNvbnN0ICRlbGVtZW50ID0gJGNsb3Nlc3QuZmluZCgnLmNhbGVuZGFyLWlucHV0Jyk7XG4gICAgICAgIGNvbnN0IGRpc2FibGVkID0gJGVsZW1lbnQuaXMoJzpkaXNhYmxlZCcpO1xuICAgICAgICBjb25zdCB0aW1lc3RhbXAgPSAkZWxlbWVudC5kYXRhKCd0aW1lc3RhbXAnKSB8fCBmYWxzZTtcbiAgICAgICAgbGV0IGRfZm9ybWF0ID0gKHRpbWVzdGFtcCAhPT0gZmFsc2UpID8gJ0RELk1NLllZWVknIDogJGVsZW1lbnQuZGF0YSgnZm9ybWF0JykgfHwgJ0RELk1NLllZWVknO1xuXG4gICAgICAgIGRfZm9ybWF0ID0gZF9mb3JtYXQudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICBpZiAoIWRpc2FibGVkKSB7XG4gICAgICAgICAgICAkZWxlbWVudC5wcm9wKCdkYXRlJywgJycpO1xuICAgICAgICAgICAgJGVsZW1lbnQuZGF0YSgnZm9ybWF0JywgZF9mb3JtYXQpO1xuXG4gICAgICAgICAgICBjb25zdCAkY2FsZW5kYXJJdGVtID0gJGVsZW1lbnQuZGF0ZXBpY2tlcih7XG4gICAgICAgICAgICAgICAgZm9ybWF0OiBkX2Zvcm1hdCxcbiAgICAgICAgICAgICAgICAvLyB0b2RheUJ0bjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBhdXRvY2xvc2U6IHRydWUsXG4gICAgICAgICAgICAgICAgY29udGFpbmVyOiAkY2xvc2VzdCxcbiAgICAgICAgICAgICAgICBsYW5ndWFnZTogQURNSU5fTE9DQUxFXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJGNhbGVuZGFySXRlbS5vbignY2hhbmdlRGF0ZScsIChldikgPT4ge1xuICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSAkKHRoaXMpLmRhdGEoJ2RhdGUnKTtcblxuICAgICAgICAgICAgICAgIGlmICh0aW1lc3RhbXAgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IChuZXcgRGF0ZShyZXN1bHQpKS5nZXRUaW1lKCkgLyAxMDAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICRlbGVtZW50LnZhbChcbiAgICAgICAgICAgICAgICAgICAgJGNhbGVuZGFySXRlbS5kYXRlcGlja2VyKCdnZXRGb3JtYXR0ZWREYXRlJylcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICgkY2xvc2VzdC5maW5kKCcuaW5wdXQtZ3JvdXAtYWRkb24nKSkge1xuICAgICAgICAgICAgICAgICRjbG9zZXN0LmZpbmQoJy5pbnB1dC1ncm91cC1hZGRvbicpLm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgJGNhbGVuZGFySXRlbS5kYXRlcGlja2VyKCdzaG93Jyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbmZ1bmN0aW9uIHNlbGVjdGl6ZShzZWxlY3RvcilcbntcbiAgICB2YXIgJHNlbGVjdG9yID0gbnVsbDtcblxuICAgIHNlbGVjdG9yID0gc2VsZWN0b3IgfHwgJ3NlbGVjdCc7XG5cbiAgICBpZiAoaXNfc3RyaW5nKHNlbGVjdG9yKSlcbiAgICB7XG4gICAgICAgICRzZWxlY3RvciA9ICQoc2VsZWN0b3IpO1xuICAgIH1cbiAgICBlbHNlIGlmKGlzX29iamVjdChzZWxlY3RvcikpXG4gICAge1xuICAgICAgICAkc2VsZWN0b3IgPSBzZWxlY3RvcjtcbiAgICB9XG5cbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICB3aWR0aDogXCIxMDAlXCIsXG4gICAgICAgIGFsbG93X3NpbmdsZV9kZXNlbGVjdDogdHJ1ZSxcbiAgICAgICAgbm9fcmVzdWx0c190ZXh0OiAn0J3QtSDQvdCw0LnQtNC10L3QviEnLFxuICAgICAgICBkaXNhYmxlX3NlYXJjaF90aHJlc2hvbGQ6IDEwXG4gICAgfTtcblxuICAgICRzZWxlY3Rvci5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCAkc2VsZWN0ID0gJCh0aGlzKTtcbiAgICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSAkc2VsZWN0LmF0dHIoJ3BsYWNlaG9sZGVyJyk7XG5cbiAgICAgICAgaWYgKHBsYWNlaG9sZGVyKVxuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCBpc011bHRpcGxlID0gJHNlbGVjdC5wcm9wKCdtdWx0aXBsZScpO1xuXG4gICAgICAgICAgICBpZiAoaXNNdWx0aXBsZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLnBsYWNlaG9sZGVyX3RleHRfbXVsdGlwbGUgPSBwbGFjZWhvbGRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLnBsYWNlaG9sZGVyX3RleHRfc2luZ2xlID0gcGxhY2Vob2xkZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAkc2VsZWN0LmNob3NlbihvcHRpb25zKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gY2hhbmdlUm93KGVsZW1lbnQpXG57XG4gICAgdmFyIGNoZWNrZWQgPSAkKGVsZW1lbnQpLnByb3AoJ2NoZWNrZWQnKTtcblxuICAgIGlmKGNoZWNrZWQpXG4gICAge1xuICAgICAgICAkKGVsZW1lbnQpLmNsb3Nlc3QoJ3RyJykuZmluZCgndGQnKS5hZGRDbGFzcygnY2gnKTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgJChlbGVtZW50KS5jbG9zZXN0KCd0cicpLmZpbmQoJ3RkJykucmVtb3ZlQ2xhc3MoJ2NoJyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiB0b2dnbGVfc21hbGxfcGhvdG8oaWQpXG57XG4gICAgJChcIiNcIitpZCkudG9nZ2xlKCk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVNlY3Rpb24oZWxlbWVudCwgZSwgaWQsIF9zZWxmXylcbntcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKGNvbmZpcm0oJ9CS0Ysg0LTQtdC50YHRgtCy0LjRgtC10LvRjNC90L4g0YXQvtGC0LjRgtC1INGD0LTQsNC70LjRgtGMPycpKVxuICAgIHtcbiAgICAgICAgaWQgPSBwYXJzZUludChpZCk7XG5cbiAgICAgICAgdmFyIHgsIHNlY3Rpb24gPSBbXSwgdG1wID0gJChlbGVtZW50KS52YWwoKS5zcGxpdCgnLCcpO1xuICAgICAgICBmb3IoeCBpbiB0bXApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICh0bXBbeF0gIT09ICcnICYmIHBhcnNlSW50KHRtcFt4XSkgIT09IGlkKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHNlY3Rpb24ucHVzaChwYXJzZUludCh0bXBbeF0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICQoX3NlbGZfKS5yZW1vdmUoKTtcbiAgICAgICAgJChlbGVtZW50KS52YWwoIChzZWN0aW9uLmxlbmd0aCA+IDEgPyBzZWN0aW9uLmpvaW4oJywnKSA6IHNlY3Rpb24pICk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gc2xpZGVyKGlkLCB0eXBlLCB2YWx1ZSwgbWluLCBtYXgsIG9yaWVudGF0aW9uKVxue1xuICAgIGNvbnN0IGVsZW1lbnQgPSAnIycgKyBpZDtcbiAgICBjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG5cbiAgICBvcmllbnRhdGlvbiA9ICFvcmllbnRhdGlvbiA/ICdob3Jpem9udGFsJyA6IG9yaWVudGF0aW9uO1xuXG4gICAgbWluID0gbWluIHx8IDA7XG4gICAgbWF4ID0gbWF4IHx8IDEwMDtcblxuICAgIHZhciB2YWx1ZXMgPSB2YWx1ZSwgY29ubmVjdCA9ICdsb3dlcicsIGJlaGF2aW91ciA9ICd0YXAtZHJhZyc7XG5cbiAgICBpZiAodHlwZSA9PSAncmFuZ2UnKVxuICAgIHtcbiAgICAgICAgYmVoYXZpb3VyID0gJ3RhcC1kcmFnJztcbiAgICAgICAgY29ubmVjdCA9IHRydWU7XG4gICAgICAgIHZhbHVlcyA9IFsgdmFsdWVbMF0gLCB2YWx1ZVsxXSBdO1xuICAgIH1cblxuICAgIG5vVWlTbGlkZXIuY3JlYXRlKHNsaWRlciwge1xuICAgICAgICBzdGVwOiAxLFxuICAgICAgICBhbmltYXRlOiBmYWxzZSxcbiAgICAgICAgb3JpZW50YXRpb246IG9yaWVudGF0aW9uLFxuICAgICAgICBzdGFydDogdmFsdWVzLFxuICAgICAgICBjb25uZWN0OiBjb25uZWN0LFxuICAgICAgICBiZWhhdmlvdXI6IGJlaGF2aW91cixcbiAgICAgICAgcmFuZ2U6IHtcbiAgICAgICAgICAgICdtaW4nOiBtaW4sXG4gICAgICAgICAgICAnbWF4JzogbWF4XG4gICAgICAgIH0sXG4gICAgICAgIGZvcm1hdDogd051bWIoe1xuICAgICAgICAgICAgZGVjaW1hbHM6IDBcbiAgICAgICAgfSlcbiAgICB9KTtcblxuICAgIGNvbnN0IGhhbmRsZXMgPSB7XG4gICAgICAgICdyYW5nZSc6IHtcbiAgICAgICAgICAgIDA6ICdtaW4nLFxuICAgICAgICAgICAgMTogJ21heCdcbiAgICAgICAgfSxcbiAgICAgICAgJ3NsaWRlcic6IHtcbiAgICAgICAgICAgIDA6ICd2YWx1ZSdcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBzbGlkZXIubm9VaVNsaWRlci5vbigndXBkYXRlJywgZnVuY3Rpb24odmFsdWVzLCBoYW5kbGUpe1xuICAgICAgICAkKGAke2VsZW1lbnR9LSR7aGFuZGxlc1t0eXBlXVtoYW5kbGVdfWApLnZhbCh2YWx1ZXNbaGFuZGxlXSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIG1ldGFDb3VudGVyKClcbntcbiAgICAkKCcuY291bnQtbnVtYmVyJykub24oJ2tleXVwJywgZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyICRibG9jayA9ICQodGhpcykuY2xvc2VzdCgnLmNvdW50LW51bWJlci1ibG9jaycpLFxuICAgICAgICAgICAgJGNvdW50ZXIgPSAkYmxvY2suZmluZCgnLmNvdW50LW51bWJlci1ibG9jay1jb3VudCcpLFxuICAgICAgICAgICAgcmVjb21lbmQgPSBwYXJzZUludCgkY291bnRlci5kYXRhKCdyZWNvbWVuZCcpKSB8fCAnJztcblxuICAgICAgICAkY291bnRlci5odG1sKCQodGhpcykudmFsKCkubGVuZ3RoICsgKHJlY29tZW5kICE9PSAnJyA/ICcvJyArIHJlY29tZW5kIDogJycpKTtcblxuICAgICAgICBpZiAocmVjb21lbmQgIT09ICcnICYmICQodGhpcykudmFsKCkubGVuZ3RoID4gcmVjb21lbmQpXG4gICAgICAgIHtcbiAgICAgICAgICAgJGNvdW50ZXIuYWRkQ2xhc3MoJ3VubGltJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoJGNvdW50ZXIuaGFzQ2xhc3MoJ3VubGltJykpXG4gICAgICAgIHtcbiAgICAgICAgICAgICRjb3VudGVyLnJlbW92ZUNsYXNzKCd1bmxpbScpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNlb0Nyb3dsKClcbntcbiAgICAkKFwiaW5wdXRbbmFtZT0nY2hhbmdlZnJlcSddXCIpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkLnRyaW0oJCh0aGlzKS52YWwoKSkgPT0gJ2ZpeGVkJylcbiAgICAgICAge1xuICAgICAgICAgICAgJCgnI2NoYW5nZWZyZXFfZml4ZWQnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICAkKCcjY2hhbmdlZnJlcV9maXhlZCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgJChcImlucHV0W25hbWU9J3ByaW9yaXR5J11cIikub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQudHJpbSgkKHRoaXMpLnZhbCgpKSA9PSAnZml4ZWQnKVxuICAgICAgICB7XG4gICAgICAgICAgICAkKCcjcHJpb3JpdHlfZml4ZWQnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgICAkKCcjcHJpb3JpdHlfZml4ZWQnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlX2l0ZW0oZSwgZWxlbWVudCwgaWQsIGVsY2xhc3MpXG57XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICQoXCIjXCIraWQpLnRvZ2dsZSgpO1xuICAgIHZhciAkaWNvbiA9ICQoZWxlbWVudCkuZmluZCgnLnptZGknKTtcblxuICAgIGlmICgkaWNvbi5oYXNDbGFzcyhlbGNsYXNzWzBdKSlcbiAgICB7XG4gICAgICAgICRpY29uLnJlbW92ZUNsYXNzKGVsY2xhc3NbMF0pO1xuICAgICAgICAkaWNvbi5hZGRDbGFzcyhlbGNsYXNzWzFdKTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgJGljb24ucmVtb3ZlQ2xhc3MoZWxjbGFzc1sxXSk7XG4gICAgICAgICRpY29uLmFkZENsYXNzKGVsY2xhc3NbMF0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc3dpdGNoX3R5cGVfZmllbGRzKG9iailcbntcbiAgICBpZiAoIG9iai5jaGVja2VkID09PSB0cnVlIClcbiAgICB7XG4gICAgICAgICQoXCIjY2FzZTJcIikuaGlkZSgpO1xuICAgICAgICAkKFwiI2Nhc2UyIGlucHV0XCIpLmF0dHIoe1wiZGlzYWJsZWRcIjogdHJ1ZX0pO1xuICAgICAgICAkKFwiI2Nhc2UxXCIpLnNob3coKTtcbiAgICAgICAgJChcIiNjYXNlMSBpbnB1dFwiKS5hdHRyKHtcImRpc2FibGVkXCI6IGZhbHNlfSk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAgICQoXCIjY2FzZTFcIikuaGlkZSgpO1xuICAgICAgICAkKFwiI2Nhc2UxIGlucHV0XCIpLmF0dHIoe1wiZGlzYWJsZWRcIjogdHJ1ZX0pO1xuICAgICAgICAkKFwiI2Nhc2UyXCIpLnNob3coKTtcbiAgICAgICAgJChcIiNjYXNlMiBpbnB1dFwiKS5hdHRyKHtcImRpc2FibGVkXCI6IGZhbHNlfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzaG93X3RyKG9iailcbntcbiAgICB2YXIgdmFsID0gJChvYmopLnZhbCgpO1xuXG4gICAgaWYgKHZhbCA9PSAxMCB8fCB2YWwgPT0gMTEgfHwgdmFsID09IDEyKVxuICAgICAgICAkKFwiI3RvX2xpc3RcIikuc2hvdygpO1xuICAgIGVsc2VcbiAgICAgICAgJChcIiN0b19saXN0XCIpLmhpZGUoKTtcbn1cblxuZnVuY3Rpb24gdHJhbnNsYXRlX2tleSggZWxlbWVudCApXG57XG4gICAgJChlbGVtZW50KS52YWwoZ2VuZXJhdGVQYXNzd29yZChyYW5kb20oMTQsIDI0KSwgZmFsc2UsIC9cXHcvKSk7XG5cbiAgICAvLyAkKGVsZW1lbnQpLnZhbChQYXNzR2VuSlMuZ2V0UGFzc3dvcmQoe1xuICAgIC8vICAgICBzeW1ib2xzOiAwLFxuICAgIC8vICAgICBsZXR0ZXJzOiByYW5kb20oMTQsIDI0KSxcbiAgICAvLyAgICAgbnVtYmVyczogMCxcbiAgICAvLyAgICAgbGV0dGVyc1VwcGVyOiAwXG4gICAgLy8gfSkpO1xufVxuXG5mdW5jdGlvbiBzZWNyZXQoIGVsZW1lbnQsIGxlbmd0aCApXG57XG4gICAgJChlbGVtZW50KS52YWwoZ2VuZXJhdGVQYXNzd29yZCgxMiwgZmFsc2UpKTtcblxuICAgIC8vICQoZWxlbWVudCkudmFsKFBhc3NHZW5KUy5nZXRQYXNzd29yZCh7XG4gICAgLy8gICAgIHN5bWJvbHM6IDAsXG4gICAgLy8gICAgIGxldHRlcnM6IHJhbmRvbSgyLCA0KSxcbiAgICAvLyAgICAgbnVtYmVyczogcmFuZG9tKDIsIDQpLFxuICAgIC8vICAgICBsZXR0ZXJzVXBwZXI6IHJhbmRvbSgzLCA3KVxuICAgIC8vIH0pKTtcbn1cblxuZnVuY3Rpb24gcmFuZG9tKG1pbiwgbWF4KVxue1xuICAgIG1pbiA9IG1pbiB8fCAwO1xuICAgIG1heCA9IG1heCB8fCAxMDA7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICggbWF4IC0gbWluICsgMSApKSArIG1pbjtcbn1cblxuXG5mdW5jdGlvbiB0b2tlbiggbGVuZ3RoIClcbntcbiAgICBsZW5ndGggPSBsZW5ndGggfHwgODtcblxuICAgIHZhciBzZWNyZXQgPSAnJywgY2hhcnMgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWjAxMjM0NTY3ODknO1xuXG4gICAgZm9yKCBpPTE7IGk8bGVuZ3RoOyBpKysgKVxuICAgIHtcbiAgICAgICAgdmFyIGMgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqY2hhcnMubGVuZ3RoICsgMSk7XG4gICAgICAgIHNlY3JldCArPSBjaGFycy5jaGFyQXQoYylcbiAgICB9XG5cbiAgICByZXR1cm4gc2VjcmV0O1xufVxuXG5mdW5jdGlvbiBkZWxfbGlzdF9maWVsZHMoaWQpXG57XG4gICAgaWYgKGNwLmRpYWxvZyhcItCS0Ysg0LTQtdC50YHQstC40YLQtdC70YzQvdC+INGF0L7RgtC40YLQtSDRg9C00LDQu9C40YLRjCDQv9C+0LvQtT9cIikpe1xuICAgICAgICQoXCIjdHJcIitpZCkucmVtb3ZlKCk7XG4gICAgICAgLypcbiAgICAgICAkLnBvc3QoIFwiL1wiICsgQURNSU5fRElSICsgXCIvYWpheC9saXN0cy9cIixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBhY3Rpb246IFwicmVtb3ZlXCIsXG4gICAgICAgICAgICAgICAgaWQ6IGlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24oZGF0YSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAkKFwiI3RyXCIraWQpLnJlbW92ZSgpO1xuICAgICAgICAgICAgfSAsXG4gICAgICAgICAgICBcImpzb25cIlxuICAgICAgICApXG4gICAgICAgICovXG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gYWRkX2xpc3RfZmllbGRzKClcbntcbiAgICBmaWVsZF9jb3VudGVyKys7XG4gICAgc3RyID0gJzx0ciBpZD1cInRyJyArIGZpZWxkX2NvdW50ZXIgKyAnXCI+JztcbiAgICBzdHIgKz0gJzx0ZD48aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJmaWVsZF9pZFsnICsgZmllbGRfY291bnRlciArICddXCIgdmFsdWU9XCIwXCIgXFwvPic7XG4gICAgc3RyICs9ICc8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZmllbGRfbmFtZVsnICsgZmllbGRfY291bnRlciArICddXCIgY2xhc3M9XCJib3JkIHBhZGQgbmVzc1wiIFxcLz48XFwvdGQ+JztcbiAgICBzdHIgKz0gJzx0ZD48aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZmllbGRfc3lzX25hbWVbJyArIGZpZWxkX2NvdW50ZXIgKyAnXVwiIGNsYXNzPVwiYm9yZCBwYWRkIG5lc3NcIiBcXC8+PFxcL3RkPic7XG4gICAgc3RyICs9ICc8dGQ+PHNlbGVjdCBuYW1lPVwiZmllbGRfdHlwZVsnICsgZmllbGRfY291bnRlciArICddXCIgY2xhc3M9XCJmaWVsZF90eXBlIG5lc3NcIiBpZD1cIicgKyBmaWVsZF9jb3VudGVyICsgJ1wiIG9uY2hhbmdlPVwic2VsZWN0X3R5cGUodGhpcyk7XCI+JztcbiAgICAkLmVhY2goYXJyX2ZpZWxkX3R5cGUsZnVuY3Rpb24oayx2KXtcbiAgICAgICAgaWYgKGsqMSkgc3RyICs9ICc8b3B0aW9uIHZhbHVlPVwiJyArIGsgKyAnXCI+JyArIHYgKyAnPFxcL29wdGlvbj4nXG4gICAgfSk7XG4gICAgc3RyICs9ICc8XFwvc2VsZWN0PjxcXC90ZD4nO1xuICAgIHN0ciArPSAnPHRkIGNsYXNzPVwiYWRkaXRpb25cIj48XFwvdGQ+JztcbiAgICBzdHIgKz0gJzx0ZD48aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiZl9vcmRbJyArIGZpZWxkX2NvdW50ZXIgKyAnXVwiIHZhbHVlPVwiJyArIGZpZWxkX2NvdW50ZXIgKyAnMFwiIGNsYXNzPVwiYm9yZCBwYWRkIHc2MHB4IHJcIiBcXC8+PFxcL3RkPic7XG4gICAgc3RyICs9ICc8dGQgc3R5bGU9XCJ0ZXh0LWFsaWduOmNlbnRlclwiPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwiaW5fbGlzdFsnICsgZmllbGRfY291bnRlciArICddXCIgXFwvPjxcXC90ZD4nO1xuICAgIHN0ciArPSAnPHRkIGNsYXNzPVwiYWN0aW9ucyBjXCI+PGEgaHJlZj1cIiNcIiBjbGFzcz1cImN0cl9hIGN0cl9kZWwgbWFyZ2luXCIgdGl0bGU9XCLQo9C00LDQu9C40YLRjFwiIG9uY2xpY2s9XCJkZWxfbGlzdF9maWVsZHMoJyArIGZpZWxkX2NvdW50ZXIgKyAnKTtyZXR1cm4gZmFsc2U7XCI+PFxcL2E+PFxcL3RkPic7XG4gICAgc3RyICs9ICc8XFwvdHI+JztcblxuICAgICQoXCIjYWRkX2J0blwiKS5iZWZvcmUoc3RyKTtcbn1cblxuZnVuY3Rpb24gYWRkX2xpc3RfZmllbGRzX2xpc3QoKVxue1xuICAgIGZpZWxkX2NvdW50ZXIrKztcblxuICAgIHZhciBzdHIgPSBbXG4gICAgICAgICc8dHIgaWQ9XCJ0cicgKyBmaWVsZF9jb3VudGVyICsgJ1wiPicsXG4gICAgICAgICc8dGQ+JyxcbiAgICAgICAgJzxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImZpZWxkX2lkWycgKyBmaWVsZF9jb3VudGVyICsgJ11cIiB2YWx1ZT1cIjBcIj4nLFxuICAgICAgICAnPGlucHV0IG5hbWU9XCJ2YXJbJyArIGZpZWxkX2NvdW50ZXIgKyAnXVwiIHBsYWNlaG9sZGVyPVwi0J3QsNC/0YDQuNC80LXRgDog0JrRgNCw0YHQvdC+0LTQsNGA0YHQutC40Lkg0LrRgNCw0LlcIj4nLFxuICAgICAgICAnPC90ZD4nLFxuICAgICAgICAnPHRkPjxpbnB1dCBuYW1lPVwidmFsdWVbJyArIGZpZWxkX2NvdW50ZXIgKyAnXVwiIHBsYWNlaG9sZGVyPVwi0J3QsNC/0YDQuNC80LXRgDogMjNcIj48L3RkPicsXG4gICAgICAgICc8dGQ+PGxhYmVsIGNsYXNzPVwiY29udHJvbGxcIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJjb250cm9sbF9faW5wdXRcIiB2YWx1ZT1cIicgKyBmaWVsZF9jb3VudGVyICsgJ1wiIG5hbWU9XCJkZWZhdWx0WycgKyBmaWVsZF9jb3VudGVyICsgJ11cIj48c3BhbiBjbGFzcz1cImNvbnRyb2xsX192aXNpYmxlIGNvbnRyb2xsX192aXNpYmxlX2NoZWNrYm94XCI+PC9zcGFuPjwvbGFiZWw+PC90ZD4nLFxuICAgICAgICAnPHRkPjxpbnB1dCBuYW1lPVwib3JkWycgKyBmaWVsZF9jb3VudGVyICsgJ11cIiB2YWx1ZT1cIicgKyBmaWVsZF9jb3VudGVyICsgJzBcIiBjbGFzcz1cIm9yZCBpbnRlZ2VyIHJlZHVjaW5nLXRyaWdnZXJcIj48L3RkPicsXG4gICAgICAgICc8dGQgY2xhc3M9XCJ0YWNcIj48YSBocmVmPVwiI1wiIGNsYXNzPVwiaWNvbiBpY29uLWRlbGV0ZSByZW1vdmUtdHJpZ2dlclwiIHRpdGxlPVwi0KPQtNCw0LvQuNGC0YxcIiBvbmNsaWNrPVwiZGVsX2xpc3RfZmllbGRzKCcgKyBmaWVsZF9jb3VudGVyICsgJyk7cmV0dXJuIGZhbHNlO1wiPjwvYT48L3RkPicsXG4gICAgICAgICc8L3RyPidcbiAgICBdLmpvaW4oICcnICk7XG5cbiAgICAkKFwiI2FkZF9idG5cIikuYmVmb3JlKHN0cik7XG59XG5cbmZ1bmN0aW9uIGRlbF9maWVsZHMobnVtYilcbntcbiAgICBmaWVsZF9jb3VudGVyLS07XG4gICAgJChcIiN0clwiK251bWIpLnJlbW92ZSgpO1xufVxuXG5mdW5jdGlvbiBhZGRfZmllbGRzKClcbntcbiAgICBmaWVsZF9jb3VudGVyKys7XG4gICAgdmFyIHNlbGVjdCA9ICcnLCBrID0gJyc7XG5cbiAgICBmb3IgKCBrIGluIGFycl9maWVsZF90eXBlIClcbiAgICB7XG4gICAgICAgIGlmICh0eXBlb2YgYXJyX2ZpZWxkX3R5cGVba10gPT0gJ3N0cmluZycpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHNlbGVjdCArPSAnPG9wdGlvbiB2YWx1ZT1cIicgKyBrICsgJ1wiPicgKyBhcnJfZmllbGRfdHlwZVtrXSArICc8L29wdGlvbj4nO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHN0ciA9IFtcbiAgICAgICAgJzx0ciBpZD1cInRyJyArIGZpZWxkX2NvdW50ZXIgKyAnXCI+JyxcbiAgICAgICAgJzx0ZCBjbGFzcz1cInZhX3RcIj48aW5wdXQgbmFtZT1cImZfbmFtZVsnICsgZmllbGRfY291bnRlciArICddXCIgY2xhc3M9XCJuZXNzXCI+PC90ZD4nLFxuICAgICAgICAnPHRkIGNsYXNzPVwidmFfdFwiPjxpbnB1dCBuYW1lPVwiZl9zeXNfbmFtZVsnICsgZmllbGRfY291bnRlciArICddXCIgY2xhc3M9XCJuZXNzXCI+PC90ZD4nLFxuICAgICAgICAnPHRkIGNsYXNzPVwidmFfdFwiPjxzZWxlY3QgbmFtZT1cImZfdHlwZVsnICsgZmllbGRfY291bnRlciArICddXCIgY2xhc3M9XCJmX3R5cGUgbmVzc1wiIGRhdGEtcGxhY2Vob2xkZXI9XCLQotC40L8g0L/QvtC70Y9cIiBpZD1cImZpZWxkdHlwZV8nICsgZmllbGRfY291bnRlciArICdcIiBvbmNoYW5nZT1cInNlbGVjdF90eXBlKHRoaXMpXCI+JyxcbiAgICAgICAgc2VsZWN0LFxuICAgICAgICAnPC9zZWxlY3Q+PC90ZD4nLFxuICAgICAgICAnPHRkIGNsYXNzPVwiYWRkaXRpb24gdmFfdFwiPicgKyBnZXRfYWRkaXRpb24oJ2lucHV0JywgZmllbGRfY291bnRlcikgKyAnPC90ZD4nLFxuICAgICAgICAnPHRkIGNsYXNzPVwidmFfdFwiPjxpbnB1dCBuYW1lPVwiZl9vcmRbJyArIGZpZWxkX2NvdW50ZXIgKyAnXVwiIHZhbHVlPVwiJyArIGZpZWxkX2NvdW50ZXIgKyAnMFwiPjwvdGQ+JyxcbiAgICAgICAgJzx0ZCBjbGFzcz1cInZhX20gdGFjXCI+PGxhYmVsIGNsYXNzPVwiY29udHJvbGwgY29udHJvbGxfc2luZ2xlXCI+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY29udHJvbGxfX2lucHV0XCIgdmFsdWU9XCIxXCIgbmFtZT1cImZfaW5fbGlzdFsnICsgZmllbGRfY291bnRlciArICddXCI+PHNwYW4gY2xhc3M9XCJjb250cm9sbF9fdmlzaWJsZSBjb250cm9sbF9fdmlzaWJsZV9jaGVja2JveFwiPjwvc3Bhbj48L2xhYmVsPjwvdGQ+JyxcbiAgICAgICAgJzx0ZCBjbGFzcz1cInZhX20gdGFjXCI+PGxhYmVsIGNsYXNzPVwiY29udHJvbGwgY29udHJvbGxfc2luZ2xlXCI+PGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY29udHJvbGxfX2lucHV0XCIgdmFsdWU9XCIxXCIgbmFtZT1cImZfaW5kZXhbJyArIGZpZWxkX2NvdW50ZXIgKyAnXVwiPjxzcGFuIGNsYXNzPVwiY29udHJvbGxfX3Zpc2libGUgY29udHJvbGxfX3Zpc2libGVfY2hlY2tib3hcIj48L3NwYW4+PC9sYWJlbD48L3RkPicsXG4gICAgICAgICc8dGQgY2xhc3M9XCJ2YV9tIHRhY1wiPjxsYWJlbCBjbGFzcz1cImNvbnRyb2xsIGNvbnRyb2xsX3NpbmdsZVwiPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz1cImNvbnRyb2xsX19pbnB1dFwiIHZhbHVlPVwiMVwiIG5hbWU9XCJmX3VuaXF1ZVsnICsgZmllbGRfY291bnRlciArICddXCI+PHNwYW4gY2xhc3M9XCJjb250cm9sbF9fdmlzaWJsZSBjb250cm9sbF9fdmlzaWJsZV9jaGVja2JveFwiPjwvc3Bhbj48L2xhYmVsPjwvdGQ+JyxcbiAgICAgICAgJzx0ZCBjbGFzcz1cInRhY1wiPjxhIGhyZWY9XCIjXCIgY2xhc3M9XCJpY29uIGljb24tZGVsZXRlIHJlbW92ZS10cmlnZ2VyXCIgdGl0bGU9XCLQo9C00LDQu9C40YLRjFwiIG9uY2xpY2s9XCJkZWxfZmllbGRzKCcgKyBmaWVsZF9jb3VudGVyICsgJyk7cmV0dXJuIGZhbHNlO1wiPjwvYT48L3RkPicsXG4gICAgICAgICc8L3RyPidcbiAgICBdLmpvaW4oJycpO1xuXG4gICAgJChcIiNhZGRfYnRuXCIpLmJlZm9yZShzdHIpO1xuXG4gICAgc2VsZWN0aXplKCAnI2ZpZWxkdHlwZV8nICsgZmllbGRfY291bnRlciApO1xufVxuXG5mdW5jdGlvbiBhZGRfZmllbGRzX2xpc3QoKVxue1xuICAgIGZpZWxkX2NvdW50ZXIrKztcblxuICAgIHN0ciA9IFtcbiAgICAgICAgJzx0ciBpZD1cInRyJyArIGZpZWxkX2NvdW50ZXIgKyAnXCI+JyxcbiAgICAgICAgJzx0ZD48aW5wdXQgbmFtZT1cInZhclsnICsgZmllbGRfY291bnRlciArICddXCI+PC90ZD4nLFxuICAgICAgICAnPHRkPjxpbnB1dCBuYW1lPVwidmFsdWVbJyArIGZpZWxkX2NvdW50ZXIgKyAnXVwiPjwvdGQ+JyxcbiAgICAgICAgJzx0ZD48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cImRlZmF1bHRbJyArIGZpZWxkX2NvdW50ZXIgKyAnXVwiPjwvdGQ+JyxcbiAgICAgICAgJzx0ZD48aW5wdXQgbmFtZT1cIm9yZFsnICsgZmllbGRfY291bnRlciArICddXCIgdmFsdWU9XCInICsgZmllbGRfY291bnRlciArICcwXCI+PC90ZD4nLFxuICAgICAgICAnPHRkIGNsYXNzPVwidGFjXCI+PGEgaHJlZj1cIiNcIiBjbGFzcz1cImljb24gaWNvbi1kZWxldGUgcmVtb3ZlLXRyaWdnZXJcIiB0aXRsZT1cItCj0LTQsNC70LjRgtGMXCIgb25jbGljaz1cImRlbF9maWVsZHMoJyArIGZpZWxkX2NvdW50ZXIgKyAnKTtyZXR1cm4gZmFsc2U7XCI+PC9hPjwvdGQ+JyxcbiAgICAgICAgJzwvdHI+J1xuICAgIF0uam9pbignXFxuJyk7XG5cbiAgICAkKFwiI2FkZF9idG5cIikuYmVmb3JlKHN0cik7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdF90eXBlKCBvYmogKVxue1xuICAgIHZhciByb3dfbnVtZCA9IDEgKiAoICQob2JqKS5hdHRyKFwiaWRcIikuc3BsaXQoJ18nKVsxXSApLFxuICAgICAgICBhcHBlbmRfb2JqID0gJChcIiN0clwiK3Jvd19udW1kK1wiIC5hZGRpdGlvblwiKSxcbiAgICAgICAgc3RyID0gZ2V0X2FkZGl0aW9uKCBvYmoudmFsdWUuc3BsaXQoJzonKVswXSwgcm93X251bWQgKTtcblxuICAgICQoIGFwcGVuZF9vYmogKS5lbXB0eSgpLmFwcGVuZCggc3RyIHx8ICcnICk7XG5cbiAgICBzZWxlY3RpemUoKTtcbn1cblxuZnVuY3Rpb24gZ2V0X2FkZGl0aW9uKCB0eXBlLCBpbmRleCApXG57XG4gICAgdmFyIHRtcCA9IFtdLCBzdHIgPSBbXTtcblxuICAgIGlmICggWyAnaW5wdXQnLCAnY29zdCcsICdpbnQnLCAnaGlkZGVuJywgJ2RvY3VtZW50JywgJ3RpbWVzdGFtcCcsICdlbWFpbCcsICdsaXN0JywgJ2F1dG9jb21wbGV0ZScsICdzZWxlY3QnLCAndHJlZXNlbGVjdCcsICdmbG9hdCcsICdzeXN0ZW0nLCAnbXVsdGlzZWxlY3QnLCAnZGF0ZXRpbWUnIF0uaW5kZXhPZiggdHlwZSApID49IDAgKVxuICAgIHtcbiAgICAgICAgc3RyID0gW1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJncm91cFwiPicsXG4gICAgICAgICAgICAgICAgJzxsYWJlbCBjbGFzcz1cImdyb3VwX19pdGVtXCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIGNsYXNzPVwiZ3JvdXBfX2l0ZW1fX3JiXCIgbmFtZT1cImZfd2lkdGhbJyArIGluZGV4ICsgJ11cIiB2YWx1ZT1cIjI1XCI+PHNwYW4gY2xhc3M9XCJncm91cF9faXRlbV9fc3R5bGVcIj48L3NwYW4+PHNwYW4gY2xhc3M9XCJncm91cF9faXRlbV9fdGV4dFwiPjI1JTwvc3Bhbj48L2xhYmVsPicsXG4gICAgICAgICAgICAgICAgJzxsYWJlbCBjbGFzcz1cImdyb3VwX19pdGVtXCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIGNsYXNzPVwiZ3JvdXBfX2l0ZW1fX3JiXCIgbmFtZT1cImZfd2lkdGhbJyArIGluZGV4ICsgJ11cIiB2YWx1ZT1cIjUwXCI+PHNwYW4gY2xhc3M9XCJncm91cF9faXRlbV9fc3R5bGVcIj48L3NwYW4+PHNwYW4gY2xhc3M9XCJncm91cF9faXRlbV9fdGV4dFwiPjUwJTwvc3Bhbj48L2xhYmVsPicsXG4gICAgICAgICAgICAgICAgJzxsYWJlbCBjbGFzcz1cImdyb3VwX19pdGVtXCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIGNsYXNzPVwiZ3JvdXBfX2l0ZW1fX3JiXCIgbmFtZT1cImZfd2lkdGhbJyArIGluZGV4ICsgJ11cIiB2YWx1ZT1cIjc1XCI+PHNwYW4gY2xhc3M9XCJncm91cF9faXRlbV9fc3R5bGVcIj48L3NwYW4+PHNwYW4gY2xhc3M9XCJncm91cF9faXRlbV9fdGV4dFwiPjc1JTwvc3Bhbj48L2xhYmVsPicsXG4gICAgICAgICAgICAgICAgJzxsYWJlbCBjbGFzcz1cImdyb3VwX19pdGVtXCI+PGlucHV0IHR5cGU9XCJyYWRpb1wiIGNsYXNzPVwiZ3JvdXBfX2l0ZW1fX3JiXCIgbmFtZT1cImZfd2lkdGhbJyArIGluZGV4ICsgJ11cIiB2YWx1ZT1cIjEwMFwiIGNoZWNrZWQ+PHNwYW4gY2xhc3M9XCJncm91cF9faXRlbV9fc3R5bGVcIj48L3NwYW4+PHNwYW4gY2xhc3M9XCJncm91cF9faXRlbV9fdGV4dFwiPjEwMCU8L3NwYW4+PC9sYWJlbD4nLFxuICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgXTtcblxuICAgICAgICBpZiAoIFsgJ2xpc3QnLCAnYXV0b2NvbXBsZXRlJywgJ3NlbGVjdCcsICd0cmVlc2VsZWN0JywgJ3JhZGlvJywgJ211bHRpc2VsZWN0JywgJ2NoZWNrYm94JywgJ3N5c3RlbScgXS5pbmRleE9mKCB0eXBlICkgPj0gMCApXG4gICAgICAgIHtcbiAgICAgICAgICAgc3RyLnB1c2goICc8ZGl2IGNsYXNzPVwiY2IgbWIxMFwiPjwvZGl2PicgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICggdHlwZSA9PSAnaGlkZGVuJyApXG4gICAge1xuICAgICAgICBzdHIucHVzaCggJzxpbnB1dCB2YWx1ZT1cIlwiIG5hbWU9XCJmX2hpZGRlbl9kZWZhdWx0WycgKyBpbmRleCArICddXCIgcGxhY2Vob2xkZXI9XCLQl9C90LDRh9C10L3QuNC1INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXCI+JyApO1xuICAgIH1cblxuICAgIGlmICggdHlwZSA9PSAnc3lzdGVtJyApXG4gICAge1xuICAgICAgICBzdHIucHVzaCggJzxpbnB1dCB2YWx1ZT1cIlwiIG5hbWU9XCJmX2JpbmRpbmdbJyArIGluZGV4ICsgJ11cIiBwbGFjZWhvbGRlcj1cItCd0LDQv9GA0LjQvNC10YAg0L/QvtC70LUgKHRpdGxlKVwiPicgKTtcbiAgICB9XG5cbiAgICBpZiAoIHR5cGUgPT0gJ2RhdGUnIClcbiAgICB7XG4gICAgICAgIHRtcCA9IFtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiaGVscC1jb3ZlclwiPicsXG4gICAgICAgICAgICAgICAgJzxpbnB1dCBuYW1lPVwiZl9kYXRlX2Zvcm1hdFsnICsgaW5kZXggKyAnXVwiIHZhbHVlPVwiREQuTU0uWVlZWVwiIHBsYWNlaG9sZGVyPVwi0KTQvtGA0LzQsNGCINC00LDRgtGLXCI+JyxcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInRvb2x0aXAgdG9vbHRpcC1kb3duXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgJ0Qg4oCUINC00LXQvdGMLDxicj4nLFxuICAgICAgICAgICAgICAgICAgICAnTSDigJQg0LzQtdGB0Y/RhiAo0LHQtdC3INC90YPQu9GPINCy0L/QtdGA0LXQtNC4KTxicj4nLFxuICAgICAgICAgICAgICAgICAgICAnREQsIE1NIOKAlCDQtNC10L3RjCDQuCDQvNC10YHRj9GGINGBINC90YPQu9GR0Lwg0LLQv9C10YDQtdC00Lgg0LTQu9GPINC30L3QsNGH0LXQvdC40Lkg0L7RgiAxINC00L4gOTxicj4nLFxuICAgICAgICAgICAgICAgICAgICAnWVkg4oCUIDIt0YHQuNC80LLQvtC70YzQvdC+0LUg0L7QsdC+0LfQvdCw0YfQtdC90LjQtSDQs9C+0LTQsDxicj4nLFxuICAgICAgICAgICAgICAgICAgICAnWVlZWSDigJQgNC3RgdC40LzQstC+0LvRjNC90L7QtSDQvtCx0L7Qt9C90LDRh9C10L3QuNC1INCz0L7QtNCwICjQs9C+0LQg0L/QuNGI0LXRgtGB0Y8g0L/QvtC70L3QvtGB0YLRjNGOKScsXG4gICAgICAgICAgICAgICAgJzwvZGl2PicsXG4gICAgICAgICAgICAnPC9kaXY+J1xuICAgICAgICBdO1xuXG4gICAgICAgIHN0ci5wdXNoKCB0bXAuam9pbignXFxuJykgKTtcbiAgICB9XG5cbiAgICBpZiAoIFsgJ2ZpbGUnLCAnaW1hZ2UnIF0uaW5kZXhPZiggdHlwZSApID49IDAgKVxuICAgIHtcbiAgICAgICAgdG1wID0gW1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJvcHRpb24tZ3JvdXAgb3B0aW9uLWNvbWJvXCI+JyxcbiAgICAgICAgICAgICAgICAnPGxhYmVsPjxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwiZl9maWxlX2NvdW50WycgKyBpbmRleCArICddXCIgdmFsdWU9XCIwXCI+PHNwYW4gY2xhc3M9XCJvcHRpb25cIj7QntC00LjQvSDRhNCw0LnQuzwvc3Bhbj48L2xhYmVsPicsXG4gICAgICAgICAgICAgICAgJzxsYWJlbD48aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cImZfZmlsZV9jb3VudFsnICsgaW5kZXggKyAnXVwiIHZhbHVlPVwiMVwiIGNoZWNrZWQ+PHNwYW4gY2xhc3M9XCJvcHRpb25cIj7QnNC90L7Qs9C+INGE0LDQudC70L7Qsjwvc3Bhbj48L2xhYmVsPicsXG4gICAgICAgICAgICAnPC9kaXY+J1xuICAgICAgICBdO1xuXG4gICAgICAgIGlmICggdHlwZSA9PSAnaW1hZ2UnIClcbiAgICAgICAge1xuICAgICAgICAgICAgdG1wLnB1c2goICc8ZGl2IGNsYXNzPVwiY2IgbWIxMFwiPjwvZGl2PicgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0ci5wdXNoKCB0bXAuam9pbignXFxuJykgKTtcbiAgICB9XG5cbiAgICBpZiAoIFsgJ2dhbGxlcnknLCAnaW1hZ2UnIF0uaW5kZXhPZiggdHlwZSApID49IDAgJiYgdHlwZW9mIENPTkZJR1VSRSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIENPTkZJR1VSRS5pbWFnZSAhPT0gJ3VuZGVmaW5lZCcgKVxuICAgIHtcbiAgICAgICAgdmFyIHRtcDAgPSBbXSwgdG1wMSA9IFtdLCB0bXAyID0gW10sIHgsIGNoZWNrZWQgPSAnJztcbiAgICAgICAgdG1wMCA9IFtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwianMtc2l6ZS1saXN0XCI+JyxcbiAgICAgICAgICAgICc8dGFibGUgY2xhc3M9XCJ0YWJsZS1zaW1wbGVcIj4nLFxuICAgICAgICAgICAgICAgICc8Y29sPjxjb2w+PGNvbD48Y29sIHdpZHRoPVwiNTdcIj48Y29sIHdpZHRoPVwiMjBcIj4nLFxuICAgICAgICAgICAgICAgICc8dGhlYWQ+JyxcbiAgICAgICAgICAgICAgICAgICAgJzx0cj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJzx0ZCBjbGFzcz1cImhcIj7Qn9GA0LXRhNC40LrRgTwvdGQ+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICc8dGQgY2xhc3M9XCJoXCI+0KjQuNGA0LjQvdCwPC90ZD4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJzx0ZCBjbGFzcz1cImhcIj7QktGL0YHQvtGC0LA8L3RkPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnPHRkIGNsYXNzPVwiaFwiPtCc0LXRgtC+0LQ8L3RkPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnPHRkIGNsYXNzPVwiaFwiPjwvdGQ+JyxcbiAgICAgICAgICAgICAgICAgICAgJzwvdHI+JyxcbiAgICAgICAgICAgICAgICAnPC90aGVhZD4nLFxuICAgICAgICAgICAgICAgICc8dGJvZHk+J1xuICAgICAgICBdO1xuXG4gICAgICAgIHRtcDEgPSB0ZW1wbGF0ZSgndHBsX2ltYWdlX3JvdycsIHtcbiAgICAgICAgICAgIGluZGV4OiAwLFxuICAgICAgICAgICAgYnV0dG9uOiB0cnVlLFxuICAgICAgICAgICAgaXRlcmF0aW9uOiBpbmRleFxuICAgICAgICB9KTtcblxuICAgICAgICB0bXAyID0gW1xuICAgICAgICAgICAgJzwvdGJvZHk+JyxcbiAgICAgICAgICAgICc8L3RhYmxlPicsXG4gICAgICAgICAgICAnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImFkZC1zaXplIGpzLWFkZC1zaXplXCIgZGF0YS1pdGVyYXRpb249XCJ7JHNtYXJ0eS5mb3JlYWNoLmkuaXRlcmF0aW9ufVwiPjxpIGNsYXNzPVwiaWNvbiBpY29uLXBsdXMtc3F1YXJlXCI+PC9pPiDQlNC+0LHQsNCy0LjRgtGMINGA0LDQt9C80LXRgDwvYT4nLFxuICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgXTtcblxuICAgICAgICBzdHIucHVzaCggdG1wMC5qb2luKCdcXG4nKSApO1xuICAgICAgICBzdHIucHVzaCggdG1wMSApO1xuICAgICAgICBzdHIucHVzaCggdG1wMi5qb2luKCdcXG4nKSApO1xuICAgIH1cblxuICAgIGlmICggWyAnZW1iZWRkZWQnIF0uaW5kZXhPZiggdHlwZSApID49IDAgKVxuICAgIHtcbiAgICAgICAgaWYgKCFpc191bmRlZmluZWQoTU9EVUxFX0xJU1QpKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0ID0gJycsIG07XG5cbiAgICAgICAgICAgIGZvciAobSBpbiBNT0RVTEVfTElTVClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzZWxlY3QgKz0gJzxvcHRpb24gdmFsdWU9XCInICsgbSArICdcIj4nICsgTU9EVUxFX0xJU1RbbV0ubmFtZSArICc8L29wdGlvbj4nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdG1wID0gW1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJqLXNlbGVjdC13cmFwcGVyXCI+JyxcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIm1iNVwiPicsXG4gICAgICAgICAgICAgICAgICAgICc8c2VsZWN0IG5hbWU9XCJmX21vZHVsZVsnICsgaW5kZXggKyAnXVwiIGRhdGEtcGxhY2Vob2xkZXI9XCLQktGL0LHRgNCw0YLRjCDQvNC+0LTRg9C70YxcIiBjbGFzcz1cImotc2VsZWN0LWNob29zZW5cIj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJzxvcHRpb24gdmFsdWU9XCIwXCI+LS0tPC9vcHRpb24+Jywgc2VsZWN0LFxuICAgICAgICAgICAgICAgICAgICAnPC9zZWxlY3Q+JyxcbiAgICAgICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNsZWFyZml4IGotc2VsZWN0LWNvbnRhaW5lclwiPicsXG4gICAgICAgICAgICAgICAgICAgICc8c2VsZWN0IG5hbWU9XCJmX2ZpZWxkc1snICsgaW5kZXggKyAnXVtdXCIgbXVsdGlwbGUgZGF0YS1wbGFjZWhvbGRlcj1cItCS0YvQsdGA0LDRgtGMXCIgZGlzYWJsZWQ+PC9zZWxlY3Q+JyxcbiAgICAgICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICc8L2Rpdj4nXG4gICAgICAgIF07XG5cbiAgICAgICAgc3RyLnB1c2goIHRtcC5qb2luKCdcXG4nKSApO1xuICAgIH1cblxuICAgIGlmICggWyAnbGlzdCcsICdzZWN0aW9uJywgJ2F1dG9jb21wbGV0ZScsICdzZWxlY3QnLCAndHJlZXNlbGVjdCcsICdyYWRpbycsICdjaGVja2JveCcsICdtdWx0aXNlbGVjdCcgXS5pbmRleE9mKCB0eXBlICkgPj0gMCApXG4gICAge1xuICAgICAgICB0bXAgPSBbXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNiIGNsZWFyZml4XCI+JyxcbiAgICAgICAgICAgICAgICAnPGxhYmVsIGNsYXNzPVwiY29udHJvbGxcIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJjb250cm9sbF9faW5wdXRcIiB2YWx1ZT1cIjFcIiBvbmNoYW5nZT1cInN3aXRjaF90eXBlcyh0aGlzKVwiIG5hbWU9XCJmX3VzZV90YWJsZV9saXN0WycgKyBpbmRleCArICddXCI+PHNwYW4gY2xhc3M9XCJjb250cm9sbF9fdmlzaWJsZSBjb250cm9sbF9fdmlzaWJsZV9jaGVja2JveFwiPjwvc3Bhbj48c3BhbiBjbGFzcz1cImNvbnRyb2xsX190ZXh0XCI+0L/RgNC40LLRj9C30LDRgtGMINC6IGAjX19tZGRfbGlzdHNgPC9zcGFuPjwvbGFiZWw+JyxcblxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2FzZSBjYXNlMFwiPicsXG4gICAgICAgICAgICAgICAgICAgICc8aW5wdXQgbmFtZT1cImZfdGFibGVfbmFtZVsnICsgaW5kZXggKyAnXVwiIHZhbHVlPVwiXCIgY2xhc3M9XCJtYjVcIiBwbGFjZWhvbGRlcj1cItCd0LDQt9Cy0LDQvdC40LUg0YLQsNCx0LvQuNGG0YsgKCNfbmV3cylcIj4nLFxuICAgICAgICAgICAgICAgICAgICAnPGlucHV0IG5hbWU9XCJmX3RhYmxlX2ZpZWxkWycgKyBpbmRleCArICddXCIgdmFsdWU9XCJcIiBwbGFjZWhvbGRlcj1cItCf0L7Qu9C1ICh0aXRsZSlcIj4nLFxuICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjYXNlIGNhc2UxIGhpZGRlblwiPicsXG4gICAgICAgICAgICAgICAgICAgICc8aW5wdXQgbmFtZT1cImZfdGFibGVfbGlzdFsnICsgaW5kZXggKyAnXVwiIGRpc2FibGVkIHBsYWNlaG9sZGVyPVwiQklORCDRgdC/0LjRgdC60LBcIiB2YWx1ZT1cIlwiPicsXG4gICAgICAgICAgICAgICAgJzwvZGl2PicsXG4gICAgICAgICAgICAnPC9kaXY+J1xuICAgICAgICBdO1xuXG4gICAgICAgIHN0ci5wdXNoKCB0bXAuam9pbignXFxuJykgKTtcbiAgICB9XG5cbiAgICBpZiAoIFsgJ3JhbmdlJywgJ3NsaWRlcicgXS5pbmRleE9mKCB0eXBlICkgPj0gMCApXG4gICAge1xuICAgICAgICB0bXAgPSBbXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cIi1jb2xcIj4nLFxuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiLWxlZnRcIj4nLFxuICAgICAgICAgICAgICAgICAgICAnPGlucHV0IG5hbWU9XCJmX3JhbmdlWycgKyBpbmRleCArICddW21pbl1cIiB2YWx1ZT1cIlwiIHBsYWNlaG9sZGVyPVwiTWluXCIgY2xhc3M9XCJpbnRlZ2VyXCI+JyxcbiAgICAgICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cIi1yaWdodFwiPicsXG4gICAgICAgICAgICAgICAgICAgICc8aW5wdXQgbmFtZT1cImZfcmFuZ2VbJyArIGluZGV4ICsgJ11bbWF4XVwiIHZhbHVlPVwiXCIgcGxhY2Vob2xkZXI9XCJNYXhcIiBjbGFzcz1cImludGVnZXJcIj4nLFxuICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgXTtcblxuICAgICAgICBzdHIucHVzaCggdG1wLmpvaW4oJ1xcbicpICk7XG4gICAgfVxuXG4gICAgaWYgKCB0eXBlID09ICdlZGl0b3InICYmIHR5cGVvZiBDT05GSUdVUkUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBDT05GSUdVUkUuZWRpdG9yICE9PSAndW5kZWZpbmVkJyApXG4gICAge1xuICAgICAgICB0bXAgPSBbXTtcbiAgICAgICAgdG1wLnB1c2goICc8ZGl2IGNsYXNzPVwib3B0aW9uLWdyb3VwIG9wdGlvbi1jb21ib1wiPicgKTtcblxuICAgICAgICB2YXIgeCwgY2hlY2tlZCA9ICcnO1xuXG4gICAgICAgIGZvciggeCBpbiBDT05GSUdVUkUuZWRpdG9yIClcbiAgICAgICAge1xuICAgICAgICAgICAgY2hlY2tlZCA9ICcnO1xuXG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBDT05GSUdVUkUuZWRpdG9yW3hdWydkZWZhdWx0J10gIT09ICd1bmRlZmluZWQnICYmIENPTkZJR1VSRS5lZGl0b3JbeF1bJ2RlZmF1bHQnXSA9PSAxIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjaGVja2VkID0gJyBjaGVja2VkJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdG1wLnB1c2goICc8bGFiZWw+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJmX2VkaXRvclsnICsgaW5kZXggKyAnXVwiIHZhbHVlPVwiJyArIENPTkZJR1VSRS5lZGl0b3JbeF1bJ3N5c3RlbSddICsgJ1wiICcgKyBjaGVja2VkICsgJz48c3BhbiBjbGFzcz1cIm9wdGlvblwiPicgKyBDT05GSUdVUkUuZWRpdG9yW3hdWyduYW1lJ10gKyAnPC9zcGFuPjwvbGFiZWw+JyApO1xuICAgICAgICB9XG5cbiAgICAgICAgdG1wLnB1c2goICc8L2Rpdj4nICk7XG5cblxuICAgICAgICBpZiAoIHR5cGVvZiBDT05GSUdVUkUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBDT05GSUdVUkUuZWRpdG9yX21vZGUgIT09ICd1bmRlZmluZWQnIClcbiAgICAgICAge1xuICAgICAgICAgICAgdG1wLnB1c2goICc8ZGl2IGNsYXNzPVwiY2IgbWIxMFwiPjwvZGl2PicgKTtcblxuICAgICAgICAgICAgdG1wLnB1c2goICc8ZGl2IGNsYXNzPVwib3B0aW9uLWdyb3VwXCI+JyApO1xuICAgICAgICAgICAgICAgIGZvciggeCBpbiBDT05GSUdVUkUuZWRpdG9yX21vZGUgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdG1wLnB1c2goICc8bGFiZWw+PGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJmX2VkaXRvcl9tb2RlWycgKyBpbmRleCArICddXCIgdmFsdWU9XCInICsgQ09ORklHVVJFLmVkaXRvcl9tb2RlWyB4IF0gKyAnXCI+PHNwYW4gY2xhc3M9XCJvcHRpb25cIj4nICsgQ09ORklHVVJFLmVkaXRvcl9tb2RlWyB4IF0gKyAnPC9zcGFuPjwvbGFiZWw+JyApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdG1wLnB1c2goICc8L2Rpdj4nICk7XG4gICAgICAgIH1cblxuICAgICAgICBzdHIucHVzaCggdG1wLmpvaW4oJ1xcbicpICk7XG4gICAgfVxuXG4gICAgaWYgKCB0eXBlID09ICdyZWRhY3RvcicgJiYgdHlwZW9mIENPTkZJR1VSRSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIENPTkZJR1VSRS5yZWRhY3RvciAhPT0gJ3VuZGVmaW5lZCcgKVxuICAgIHtcbiAgICAgICAgdG1wID0gW107XG4gICAgICAgIHRtcC5wdXNoKCAnPGRpdiBjbGFzcz1cImdyb3VwXCI+JyApO1xuXG4gICAgICAgIHZhciB4LCBjaGVja2VkID0gJyc7XG5cbiAgICAgICAgZm9yKCB4IGluIENPTkZJR1VSRS5yZWRhY3RvciApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YoQ09ORklHVVJFLnJlZGFjdG9yW3hdWyduYW1lJ10pICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YoQ09ORklHVVJFLnJlZGFjdG9yW3hdWydzeXN0ZW0nXSkgIT09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNoZWNrZWQgPSAnJztcblxuICAgICAgICAgICAgICAgIGlmICggdHlwZW9mIENPTkZJR1VSRS5yZWRhY3Rvclt4XVsnZGVmYXVsdCddICE9PSAndW5kZWZpbmVkJyAmJiBDT05GSUdVUkUucmVkYWN0b3JbeF1bJ2RlZmF1bHQnXSA9PSAxIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNoZWNrZWQgPSAnIGNoZWNrZWQnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRtcC5wdXNoKCAnPGxhYmVsIGNsYXNzPVwiZ3JvdXBfX2l0ZW1cIj48aW5wdXQgdHlwZT1cInJhZGlvXCIgY2xhc3M9XCJncm91cF9faXRlbV9fcmJcIiBuYW1lPVwiZl9yZWRhY3RvclsnICsgaW5kZXggKyAnXVwiIHZhbHVlPVwiJyArIENPTkZJR1VSRS5yZWRhY3Rvclt4XVsnc3lzdGVtJ10gKyAnXCInICsgY2hlY2tlZCArICc+PHNwYW4gY2xhc3M9XCJncm91cF9faXRlbV9fc3R5bGVcIj48L3NwYW4+PHNwYW4gY2xhc3M9XCJncm91cF9faXRlbV9fdGV4dFwiPicgKyBDT05GSUdVUkUucmVkYWN0b3JbeF1bJ25hbWUnXSArICc8L3NwYW4+PC9sYWJlbD4nICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0bXAucHVzaCggJzwvZGl2PicgKTtcblxuICAgICAgICBzdHIucHVzaCggdG1wLmpvaW4oJ1xcbicpICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0ci5qb2luKCdcXG4nKTtcbn1cblxuZnVuY3Rpb24gc3dpdGNoX3R5cGVzKG9iailcbntcbiAgICBwX29iaiA9ICQob2JqKS5jbG9zZXN0KCd0ZCcpO1xuICAgIGlmICggb2JqLmNoZWNrZWQgKVxuICAgIHtcbiAgICAgICAgJChcIi5jYXNlMVwiLHBfb2JqKS5zaG93KCk7XG4gICAgICAgICQoXCIuY2FzZTEgaW5wdXRcIixwX29iaikuYXR0cih7XCJkaXNhYmxlZFwiOiBmYWxzZX0pO1xuICAgICAgICAkKFwiLmNhc2UwXCIscF9vYmopLmhpZGUoKTtcbiAgICAgICAgJChcIi5jYXNlMCBpbnB1dFwiLHBfb2JqKS5hdHRyKHtcImRpc2FibGVkXCI6IHRydWV9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgICQoXCIuY2FzZTBcIixwX29iaikuc2hvdygpO1xuICAgICAgICAkKFwiLmNhc2UwIGlucHV0XCIscF9vYmopLmF0dHIoe1wiZGlzYWJsZWRcIjogZmFsc2V9KTtcbiAgICAgICAgJChcIi5jYXNlMVwiLHBfb2JqKS5oaWRlKCk7XG4gICAgICAgICQoXCIuY2FzZTEgaW5wdXRcIixwX29iaikuYXR0cih7XCJkaXNhYmxlZFwiOiB0cnVlfSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBodW1hblNpemUoYnl0ZXMpIHtcbiAgICBpZiAodHlwZW9mIGJ5dGVzICE9PSAnbnVtYmVyJykge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgaWYgKGJ5dGVzID49IDEwMDAwMDAwMDApIHtcbiAgICAgICAgcmV0dXJuIChieXRlcyAvIDEwMDAwMDAwMDApLnRvRml4ZWQoMikgKyAnINCT0LEnO1xuICAgIH1cblxuICAgIGlmIChieXRlcyA+PSAxMDAwMDAwKSB7XG4gICAgICAgIHJldHVybiAoYnl0ZXMgLyAxMDAwMDAwKS50b0ZpeGVkKDIpICsgJyDQnNCxJztcbiAgICB9XG5cbiAgICBpZiAoYnl0ZXMgPj0gMTAyNClcbiAgICB7XG4gICAgICAgIHJldHVybiAoYnl0ZXMgLyAxMDAwKS50b0ZpeGVkKDIpICsgJyDQmtCxJztcbiAgICB9XG5cbiAgICByZXR1cm4gYnl0ZXMgKyAnINCxJztcbn1cblxuZnVuY3Rpb24gYWRkRXh0ZW5kZXQoKSB7XG4gICAgJC5wb3N0KFxuICAgICAgICBcIi9cIiArIEFETUlOX0RJUiArIFwiL2FqYXgvdm90ZS9cIixcbiAgICAgICAge1xuICAgICAgICAgICAgYWN0aW9uOiAkKFwiI2FjdGlvblwiKS5hdHRyKFwidmFsdWVcIikgICxcbiAgICAgICAgICAgIGlkOiAkKFwiI2lkXCIpLmF0dHIoXCJ2YWx1ZVwiKSAsXG4gICAgICAgICAgICB0aXRsZTogJChcIiN0aXRsZVwiKS5hdHRyKFwidmFsdWVcIikgLFxuICAgICAgICAgICAgb3JkOiAkKFwiI29yZFwiKS5hdHRyKFwidmFsdWVcIikgLFxuICAgICAgICAgICAgdmlzaWJsZTogJChcIiNWb3RlQWRkUXVlc3Rpb25zIGlucHV0OnJhZGlvW25hbWU9dmlzaWJsZV06Y2hlY2tlZFwiKS52YWwoKVxuICAgICAgICB9LFxuICAgICAgICBvbkFqYXhTdWNjZXNzQWRkXG4gICAgKTtcbiAgICBmdW5jdGlvbiBvbkFqYXhTdWNjZXNzQWRkKGRhdGEpIHsgLy9cbiAgICAgICAgdmFyIHZpcztcbiAgICAgICAgaWYgKCAkKFwiI1ZvdGVBZGRRdWVzdGlvbnMgaW5wdXQ6cmFkaW9bbmFtZT12aXNpYmxlXTpjaGVja2VkXCIpLnZhbCgpID09IDEgKSB2aXMgPSBcItCU0LBcIjtcbiAgICAgICAgZWxzZSAgdmlzID0gXCLQndC10YJcIjtcblxuICAgICAgICB2YXIgaW5uZXIgPSAnPHRyIGlkPVwidHJfJyArIGRhdGEgKyAnXCI+JztcbiAgICAgICAgaW5uZXIgKz0gJzx0ZD4nO1xuICAgICAgICBpbm5lciArPSAnPGlucHV0IG5hbWU9XCJwYXJlbnRfaWRfJyArIGRhdGEgKyAnXCIgaWQ9XCJwYXJlbnRfaWRfJyArIGRhdGEgKyAnXCIgdmFsdWU9XCIyXCIgdHlwZT1cImhpZGRlblwiPic7XG4gICAgICAgIGlubmVyICs9ICc8aW5wdXQgbmFtZT1cImlkXycgKyBkYXRhICsgJ1wiIGlkPVwiaWRfJyArIGRhdGEgKyAnXCIgdmFsdWU9XCInICsgZGF0YSArICdcIiB0eXBlPVwiaGlkZGVuXCI+JztcbiAgICAgICAgaW5uZXIgKz0gJzxkaXYgaWQ9XCJ0aXRsZV8nICsgZGF0YSArICdcIj48Yj4nICsgJChcIiN0aXRsZVwiKS5hdHRyKFwidmFsdWVcIikgKyAnPC9iPjwvZGl2Pic7XG4gICAgICAgIGlubmVyICs9ICc8ZGl2IGlkPVwidGl0bGVfaV8nICsgZGF0YSArICdcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+JztcbiAgICAgICAgaW5uZXIgKz0gJzxpbnB1dCBuYW1lPVwidGl0bGVfJyArIGRhdGEgKyAnXCIgdmFsdWU9XCInICsgJChcIiN0aXRsZVwiKS5hdHRyKFwidmFsdWVcIikgKyAnXCIgY2xhc3M9XCJib3JkIHBhZGQgdzEwMFwiIGlkPVwidGl0bGVfaW5wdXRfJyArIGRhdGEgKyAnXCIgdHlwZT1cInRleHRcIj4nO1xuICAgICAgICBpbm5lciArPSAnPHAgYWxpZ249XCJyaWdodFwiPic7XG4gICAgICAgIGlubmVyICs9ICc8YSBocmVmPVwiamF2YXNjcmlwdDo7XCIgb25jbGljaz1cInNhdmVFeHRlbmRldChcXCcnICsgZGF0YSArICdcXCcpO1wiPtCh0L7RhdGA0LDQvdC40YLRjDwvYT4gfCAnO1xuICAgICAgICBpbm5lciArPSAnPGEgaHJlZj1cImphdmFzY3JpcHQ6O1wiIG9uY2xpY2s9XCJjYW5jZWxFeHRlbmRldChcXCcnICsgZGF0YSArICdcXCcpO1wiPtCe0YLQvNC10L3QsDwvYT4gJztcbiAgICAgICAgaW5uZXIgKz0gJzwvcD4nO1xuICAgICAgICBpbm5lciArPSAnPC9kaXY+JztcbiAgICAgICAgaW5uZXIgKz0gJzwvdGQ+JztcbiAgICAgICAgaW5uZXIgKz0gJzx0ZD4nO1xuICAgICAgICBpbm5lciArPSAnPGRpdiBpZD1cIm9yZF8nICsgZGF0YSArICdcIj48Yj4nICsgJChcIiNvcmRcIikuYXR0cihcInZhbHVlXCIpICsgJzwvYj48L2Rpdj4nO1xuICAgICAgICBpbm5lciArPSAnPGRpdiBpZD1cIm9yZF9pXycgKyBkYXRhICsgJ1wiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj4nO1xuICAgICAgICBpbm5lciArPSAnPGlucHV0IG5hbWU9XCJvcmRfJyArIGRhdGEgKyAnXCIgdmFsdWU9XCInICsgJChcIiNvcmRcIikuYXR0cihcInZhbHVlXCIpICsgJ1wiIHN0eWxlPVwid2lkdGg6IDEwMCU7XCIgY2xhc3M9XCJib3JkIHBhZGQgdzEwMFwiIGlkPVwib3JkX2lucHV0XycgKyBkYXRhICsgJ1wiIHR5cGU9XCJ0ZXh0XCI+JztcbiAgICAgICAgaW5uZXIgKz0gJzwvZGl2Pic7XG4gICAgICAgIGlubmVyICs9ICc8L3RkPic7XG5cbiAgICAgICAgaW5uZXIgKz0gJzx0ZCBhbGlnbj1cImNlbnRlclwiPic7XG4gICAgICAgIGlubmVyICs9ICc8ZGl2IGlkPVwidmlzaWJsZV8nICsgZGF0YSArICdcIj48Yj4nICsgdmlzICsgJzwvYj48L2Rpdj4nO1xuICAgICAgICBpbm5lciArPSAnPGRpdiBpZD1cInZpc2libGVfaV8nICsgZGF0YSArICdcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+JztcbiAgICAgICAgaW5uZXIgKz0gJzxpbnB1dCBuYW1lPVwidmlzaWJsZV8nICsgZGF0YSArICdcIiB2YWx1ZT1cIjFcIiBjaGVja2VkPVwiY2hlY2tlZFwiIG9uY2xpY2s9XCIkKFxcJyN2aXNfJyArIGRhdGEgKyAnXFwnKS52YWwoXFwnMVxcJyk7XCIgaWQ9XCJ2aXNpYmxlX2lucHV0XycgKyBkYXRhICsgJ18xXCIgdHlwZT1cInJhZGlvXCI+0JTQsCAmbmJzcDsmbmJzcDsnO1xuICAgICAgICBpbm5lciArPSAnPGlucHV0IG5hbWU9XCJ2aXNpYmxlXycgKyBkYXRhICsgJ1wiIHZhbHVlPVwiMFwiIG9uY2xpY2s9XCIkKFxcJyN2aXNfJyArIGRhdGEgKyAnXFwnKS52YWwoXFwnMFxcJyk7XCIgaWQ9XCJ2aXNpYmxlX2lucHV0XycgKyBkYXRhICsgJ18wXCIgdHlwZT1cInJhZGlvXCI+0J3QtdGCJztcbiAgICAgICAgaW5uZXIgKz0gJzxpbnB1dCBuYW1lPVwidmlzXycgKyBkYXRhICsgJ1wiIGlkPVwidmlzXycgKyBkYXRhICsgJ1wiIHZhbHVlPVwiXCIgdHlwZT1cImhpZGRlblwiPic7XG4gICAgICAgIGlubmVyICs9ICc8L2Rpdj4nO1xuICAgICAgICBpbm5lciArPSAnPC90ZD4nO1xuICAgICAgICBpbm5lciArPSAnPHRkPic7XG4gICAgICAgIGlubmVyICs9ICc8YSBocmVmPVwiI1wiIGNsYXNzPVwiaWNvbiBpY29uLWVkaXRcIiBvbmNsaWNrPVwiZWRpdEV4dGVuZGV0KFxcJycgKyBkYXRhICsgJ1xcJylcIj48L2E+JztcbiAgICAgICAgaW5uZXIgKz0gJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJpY29uIGljb24tZGVsZXRlIHJlbW92ZS10cmlnZ2VyXCIgb25DbGljaz1cImRlbEV4dGVuZGV0KFxcJycgKyBkYXRhICsgJ1xcJylcIj48L2E+JztcbiAgICAgICAgaW5uZXIgKz0gJzwvdGQ+JztcbiAgICAgICAgaW5uZXIgKz0gJzwvdHI+JztcblxuICAgICAgICAvLyAgSU5TRVJUIE5FVyBGSUVMRFxuICAgICAgICAkKGlubmVyKS5pbnNlcnRCZWZvcmUoXCIjYWpheF9hZGRfZm9ybVwiKTtcblxuICAgICAgICAvLyAgUkVTRVQgRk9STVMgRUxFTUVOVFNcbiAgICAgICAgJChcIiN0aXRsZVwiKS5hdHRyKHt2YWx1ZTpcIlwifSk7XG4gICAgICAgICQoXCIjb3JkXCIpLmF0dHIoe3ZhbHVlOlwiXCJ9KTtcblxuICAgICAgICAvLyAgSElERSBGT1JNXG4gICAgICAgICQoXCIjYWpheF9hZGRfZm9ybVwiKS5oaWRlKCk7XG4gICAgfVxufVxuICAgIGZ1bmN0aW9uIHNhdmVFeHRlbmRldChpZCkge1xuICAgICQucG9zdChcbiAgICAgICAgXCIvXCIgKyBBRE1JTl9ESVIgKyBcIi9hamF4L3ZvdGUvXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFjdGlvbjogXCJ1cGRhdGVcIiAsXG4gICAgICAgICAgICBpZDogJChcIiNpZF9cIitpZCkuYXR0cihcInZhbHVlXCIpICxcbiAgICAgICAgICAgIHBhcmVudF9pZDogJChcIiNwYXJlbnRfaWRfXCIraWQpLmF0dHIoXCJ2YWx1ZVwiKSAsXG4gICAgICAgICAgICB0aXRsZTogJChcIiN0aXRsZV9pbnB1dF9cIitpZCkuYXR0cihcInZhbHVlXCIpICxcbiAgICAgICAgICAgIG9yZDogJChcIiNvcmRfaW5wdXRfXCIraWQpLmF0dHIoXCJ2YWx1ZVwiKSAsXG4gICAgICAgICAgICB2aXNpYmxlOiAkKFwiI1ZvdGVBZGRRdWVzdGlvbnMgaW5wdXQ6cmFkaW9bbmFtZT12aXNpYmxlX1wiK2lkK1wiXTpjaGVja2VkXCIpLnZhbCgpXG4gICAgICAgIH0sXG4gICAgICAgIG9uQWpheFN1Y2Nlc3NTYXZlXG4gICAgKTtcbiAgICBmdW5jdGlvbiBvbkFqYXhTdWNjZXNzU2F2ZShkYXRhKSB7XG4gICAgICAgIHZhciB2aXM7XG4gICAgICAgIGlmICggJChcIiN2aXNfXCIraWQpLnZhbCgpID09IDEgKSB2aXMgPSBcItCU0LBcIjtcbiAgICAgICAgZWxzZSAgdmlzID0gXCLQndC10YJcIjtcbiAgICAgICAgJChcIiN0aXRsZV9cIitpZCkuaHRtbCggXCI8Yj5cIiskKFwiI3RpdGxlX2lucHV0X1wiK2lkKS5hdHRyKFwidmFsdWVcIikrXCI8L2I+XCIgKTtcbiAgICAgICAgJChcIiNvcmRfXCIraWQpLmh0bWwoICQoXCIjb3JkX2lucHV0X1wiK2lkKS5hdHRyKFwidmFsdWVcIikgKTtcbiAgICAgICAgJChcIiN2aXNpYmxlX1wiK2lkKS5odG1sKCB2aXMgKTtcblxuICAgICAgICAkKFwiI3RpdGxlX1wiK2lkKS5zaG93KCk7XG4gICAgICAgICQoXCIjb3JkX1wiK2lkKS5zaG93KCk7XG4gICAgICAgICQoXCIjdmlzaWJsZV9cIitpZCkuc2hvdygpO1xuICAgICAgICAkKFwiI3RpdGxlX2lfXCIraWQpLmhpZGUoKTtcbiAgICAgICAgJChcIiNvcmRfaV9cIitpZCkuaGlkZSgpO1xuICAgICAgICAkKFwiI3Zpc2libGVfaV9cIitpZCkuaGlkZSgpO1xuICAgIH1cblxufVxuLy9cbmZ1bmN0aW9uIGVkaXRFeHRlbmRldChpZCkge1xuICAgICQoXCIjdGl0bGVfXCIraWQpLmhpZGUoKTtcbiAgICAkKFwiI29yZF9cIitpZCkuaGlkZSgpO1xuICAgICQoXCIjdmlzaWJsZV9cIitpZCkuaGlkZSgpO1xuICAgICQoXCIjdGl0bGVfaV9cIitpZCkuc2hvdygpO1xuICAgICQoXCIjb3JkX2lfXCIraWQpLnNob3coKTtcbiAgICAkKFwiI3Zpc2libGVfaV9cIitpZCkuc2hvdygpO1xufVxuLy9cbmZ1bmN0aW9uIGRlbEV4dGVuZGV0KGlkKSB7XG4gICAgaWYgKGNwLmRpYWxvZyhcItCS0Ysg0LTQtdC50YHRgtCy0LjRgtC10LvRjNC90L4g0YXQvtGC0LjRgtC1INGD0LTQsNC70LjRgtGMINC30LDQv9C40YHRjD9cIikpIHtcbiAgICAgICAgJC5wb3N0KFxuICAgICAgICAgICAgXCIvXCIgKyBBRE1JTl9ESVIgKyBcIi9hamF4L3ZvdGUvXCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYWN0aW9uOiBcImRlbFwiICxcbiAgICAgICAgICAgICAgICBpZDogJChcIiNpZF9cIitpZCkudmFsKClcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkFqYXhTdWNjZXNzRGVsXG4gICAgICAgICk7XG4gICAgfVxufVxuZnVuY3Rpb24gb25BamF4U3VjY2Vzc0RlbChkYXRhKXtcbiAgICAkKFwiI3RyX1wiK2RhdGEpLnJlbW92ZSgpO1xufVxuLy9cbmZ1bmN0aW9uIGNhbmNlbEV4dGVuZGV0KGlkKSB7XG4gICAgJChcIiN0aXRsZV9cIitpZCkuc2hvdygpO1xuICAgICQoXCIjb3JkX1wiK2lkKS5zaG93KCk7XG4gICAgJChcIiN2aXNpYmxlX1wiK2lkKS5zaG93KCk7XG4gICAgJChcIiN0aXRsZV9pX1wiK2lkKS5oaWRlKCk7XG4gICAgJChcIiNvcmRfaV9cIitpZCkuaGlkZSgpO1xuICAgICQoXCIjdmlzaWJsZV9pX1wiK2lkKS5oaWRlKCk7XG59XG5cbmZ1bmN0aW9uIG9uQWpheFN1Y2Nlc3MoZGF0YSkge1xuICAgIGFsZXJ0KGRhdGEpO1xufVxuXG5mdW5jdGlvbiBlZGl0VGl0bGUoIGlkLCB0aXRsZSApXG57XG4gICAgaWYgKHR5cGVvZih0aXRsZSkgPT0gJ3VuZGVmaW5lZCcpXG4gICAge1xuICAgICAgICB2YXIgdGl0bGUgPSAkKCcjZnRpdGxlXycgKyBpZCkudGV4dCgpO1xuICAgIH1cblxuICAgIHZhciBuYW1lID0gcHJvbXB0KCfQktCy0LXQtNC40YLQtSDQvdC+0LLQvtC1INC40LzRjycsIHRpdGxlKTtcblxuICAgIGlmIChuYW1lICE9ICcnICYmIG5hbWUgIT0gdGl0bGUgJiYgbmFtZSAhPT0gbnVsbClcbiAgICB7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6ICcvJyArIEFETUlOX0RJUiArICcvbWV0YS9maWxlbmFtZScsXG4gICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICAgICAgbmFtZTogbmFtZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnSlNPTicsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSB0cnVlKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2Z0aXRsZV8nICsgaWQpLmh0bWwoIG5hbWUgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZWRpdFZpc2libGUoaWQsIHZpc2libGUpXG57XG4gICAgdmlzaWJsZSA9ICh2aXNpYmxlID09IDEgPyAwIDogMSk7XG5cbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6ICcvJyArIEFETUlOX0RJUiArICcvbWV0YS9maWxldmlzaWJsZScsXG4gICAgICAgIHR5cGU6IFwicG9zdFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBpZDogaWQsXG4gICAgICAgICAgICB2aXNpYmxlOiB2aXNpYmxlXG4gICAgICAgIH0sXG4gICAgICAgIGRhdGFUeXBlOiAnSlNPTicsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSB0cnVlKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICQoJyNmdmlzaWJsZV8nICsgaWQpLnJlbW92ZUNsYXNzKCdpY29uLWV5ZSBpY29uLWV5ZS1vZmYnKTtcblxuICAgICAgICAgICAgICAgIGlmICh2aXNpYmxlID09IDEpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAkKCcjZnZpc2libGVfJyArIGlkKS5hZGRDbGFzcygnaWNvbi1leWUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJyNmdmlzaWJsZV8nICsgaWQpLmFkZENsYXNzKCdpY29uLWV5ZS1vZmYnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGVkaXRPcmQoIGlkLCBvcmQgKVxue1xuXHRjb25zdCBuZXdvcmQgPSBwcm9tcHQoJ9Cf0L7RgNGP0LTQvtC6Jywgb3JkKTtcblxuXHRpZiAoIW5ld29yZCkgcmV0dXJuIGZhbHNlO1xuXG5cdGlmIChuZXdvcmQgIT0gJycgJiYgbmV3b3JkICE9IG9yZCkge1xuXHRcdCQucG9zdCgnLycgKyBBRE1JTl9ESVIgKyAnL2FqYXgvbWV0YS8nLCB7IGFjdGlvbjogXCJuZXdmaWxlb3JkXCIsIG5ld29yZDogbmV3b3JkLCBpZDogaWQgfSwgZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0aWYgKGRhdGEgPT0gMSkge1xuXHRcdFx0XHQkKCcjb3JkZmlsZV8nICsgaWQpLmh0bWwobmV3b3JkKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGFqYXhfdmlzX3RvZ2dsZShvYmosIGlkLCBtb2RfaWQpXG57XG4gICAgJChvYmopLmFwcGVuZCgnPGkgY2xhc3M9XCJsb2FkaW5nXCI+PC9pPicpO1xuXG5cdCQucG9zdCggJy8nICsgQURNSU5fRElSICsgJy9hamF4L3N0cnVjdHVyZS8nLCB7IGFjdDogXCJ0b2dnbGVfdmlzaWJsZVwiLCBtb2RfaWQ6IG1vZF9pZCwgaWQ6IGlkIH0sIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgaWYgKCBkYXRhID09IDEgKVxuICAgICAgICB7XG4gICAgICAgICAgICAkKG9iaikudG9nZ2xlQ2xhc3MoXCJpY29uLWV5ZVwiKS50b2dnbGVDbGFzcyhcImljb24tZXllLW9mZlwiKS5odG1sKCcnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cdHJldHVybiAhMTtcbn1cblxuZnVuY3Rpb24gc2hvd190b29sdGlwcyhpZClcbntcblx0JChcIiNcIitpZCkudG9nZ2xlKCk7XG59XG5cbmZ1bmN0aW9uIG15X3VuY2hlY2soKXtcblx0JChcIi5hY2Nlc3NcIikuZWFjaChmdW5jdGlvbigpe1xuXHRcdCQodGhpcykuYXR0cih7Y2hlY2tlZDonJ30pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gQ2hlY2tBbmRTdWJtaXQoaWQpe1xuICAgIHZhciBmbGFnID0gdHJ1ZTtcblx0JChcIiNcIitpZCtcIiAubmVzc1wiKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0aWYgKCAkKHRoaXMpLnZhbCgpID09IFwiXCIgKSB7XG5cdFx0XHQkKHRoaXMpLmZvY3VzKCkuYWRkQ2xhc3MoXCJlcnJvclwiKTtcblx0XHRcdGZsYWcgPSBmYWxzZTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcyhcImVycm9yXCIpO1xuXHRcdH1cblx0fSk7XG5cdGlmIChmbGFnKVxuXHRcdCQoXCIjXCIraWQpLnN1Ym1pdCgpO1xuXHRlbHNlIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gc2V0U29ydChvYmosY29va2llX25hbWUpe1xuXHR2YWx1ZSA9ICQob2JqKS52YWwoKTtcblx0c2V0Q29va2llKGNvb2tpZV9uYW1lLHZhbHVlKTtcblx0bG9jYXRpb24uaHJlZiA9IGxvY2F0aW9uLmhyZWY7XG59XG5cbmZ1bmN0aW9uIGZvcm1fc3VibWl0KGlkLHBhcmFtKVxue1xuXHRpZiAocGFyYW0gPT0gXCJzYXZlXCIpXG5cdFx0JChcIiNcIitpZCkuc3VibWl0KCk7XG5cdGlmIChwYXJhbSA9PSBcImFwcGx5XCIpXG5cdFx0JChcIiNcIitpZCkuc3VibWl0KCk7XG5cdGVsc2Vcblx0XHQkKFwiI1wiK2lkKS5zdWJtaXQoKTtcbn1cblxuZnVuY3Rpb24gb3BlbndpbiggaW1nICwgdyAsIGggLCB0aXRsZSApXG57XG5cdGlmICggaHduZCAhPSBudWxsIClcblx0aHduZC5jbG9zZSgpO1xuXHRod25kID0gd2luZG93Lm9wZW4oIGltZyAsIFwiXCIgLCBcInRvb2xiYXI9bm8gLCBsb2NhdGlvbj1ubyAsIGRpcmVjdG9yaWVzPW5vICwgcmVzaXphYmxlPW5vICwgd2lkdGg9XCIgKyB3ICsgXCIgLCBoZWlnaHQ9XCIgKyBoICk7XG5cdGh3bmQuZG9jdW1lbnQub3BlbigpO1xuXHRod25kLmRvY3VtZW50LndyaXRlKFwiPGh0bWw+XCIpO1xuXHRod25kLmRvY3VtZW50LndyaXRlKFwiPGhlYWQ+XCIpO1xuXHRod25kLmRvY3VtZW50LndyaXRlKFwiPHRpdGxlPlwiICsgdGl0bGUgKyBcIjwvdGl0bGU+XCIpO1xuXHRod25kLmRvY3VtZW50LndyaXRlKFwiPC9oZWFkPlwiKTtcblx0aHduZC5kb2N1bWVudC53cml0ZShcIjxib2R5IGJnY29sb3I9I2ZmZmZmZiBib3R0b21tYXJnaW49MCBsZWZ0bWFyZ2luPTAgbWFyZ2luaGVpZ2h0PTAgbWFyZ2lud2lkdGg9MCByaWdodG1hcmdpbj0wIHRvcG1hcmdpbj0wIHN0eWxlPSdib3JkZXI6MHB4Oyc+XCIpO1xuXHRod25kLmRvY3VtZW50LndyaXRlKFwiPHRhYmxlIGFsaWduPWNlbnRlciB3aWR0aD0xMDAlIGhlaWdodD0xMDAlIGNlbGxzcGFjaW5nPTAgY2VsbHBhZGRpbmc9MCBib3JkZXI9MD5cIik7XG5cdGh3bmQuZG9jdW1lbnQud3JpdGUoXCI8dHI+PHRkPjxpbWcgc3JjPSdcIiArIGltZyArIFwiJyBib3JkZXI9MD48L3RkPjwvdHI+XCIpO1xuXHRod25kLmRvY3VtZW50LndyaXRlKFwiPC90YWJsZT48L2JvZHk+PC9odG1sPlwiKTtcblx0aHduZC5kb2N1bWVudC5jbG9zZSgpO1xufVxuXG5mdW5jdGlvbiBvcGVud2luX3RleHQoIHVybCAsIHcgLCBoIClcbntcblx0d2luZG93Lm9wZW4oIHVybCAsIFwiXCIgLCBcInRvb2xiYXI9bm8gLCBsb2NhdGlvbj1ubyAsIGRpcmVjdG9yaWVzPW5vICwgcmVzaXphYmxlPW5vICwgc2Nyb2xsYmFycz1ubyAsIHdpZHRoPVwiICsgdyArIFwiICwgaGVpZ2h0PVwiICsgaCApO1xufVxuXG5mdW5jdGlvbiBsdHJpbShzdHIpXG57XG5cdGZvcih2YXIgayA9IDA7IGsgPCBzdHIubGVuZ3RoICYmIGlzV2hpdGVzcGFjZShzdHIuY2hhckF0KGspKTsgaysrKTtcblx0cmV0dXJuIHN0ci5zdWJzdHJpbmcoaywgc3RyLmxlbmd0aCk7XG59XG5cbmZ1bmN0aW9uIHJ0cmltKHN0cilcbntcblx0Zm9yKHZhciBqPXN0ci5sZW5ndGgtMTsgaj49MCAmJiBpc1doaXRlc3BhY2Uoc3RyLmNoYXJBdChqKSk7IGotLSk7XG5cdHJldHVybiBzdHIuc3Vic3RyaW5nKDAsaisxKTtcbn1cblxuZnVuY3Rpb24gdHJpbShzdHIpXG57XG5cdHN0ciA9IHN0ci5yZXBsYWNlKC9cXHN7Mix9L2csJyAnKTtcblx0cmV0dXJuIGx0cmltKHJ0cmltKHN0cikpO1xufVxuXG5mdW5jdGlvbiBpc1doaXRlc3BhY2UoY2hhclRvQ2hlY2spXG57XG5cdHZhciB3aGl0ZXNwYWNlQ2hhcnMgPSBcIiBcXHRcXG5cXHJcXGZcIjtcblx0cmV0dXJuICh3aGl0ZXNwYWNlQ2hhcnMuaW5kZXhPZihjaGFyVG9DaGVjaykgIT0gLTEpO1xufVxuXG5mdW5jdGlvbiB0cmFuc2xpdGVyYXRlKHN0cmluZywgdXJsKVxue1xuICAgIHN0cmluZyA9IHRyaW0oc3RyaW5nLnRvTG93ZXJDYXNlKCkpO1xuXG4gICAgaWYgKHN0cmluZyAhPSAnJylcbiAgICB7XG4gICAgICAgIHZhciBjaGFyX21hcCA9IHt9LCB0ZXN0ID0gW10sIHJlc3VsdCA9ICcnLCB4O1xuXG4gICAgICAgIGNoYXJfbWFwID0ge1xuICAgICAgICAgICAgLy8gTGF0aW5cbiAgICAgICAgICAgICfDoCc6ICdhJywgJ8OhJzogJ2EnLCAnw6InOiAnYScsICfDoyc6ICdhJywgJ8OkJzogJ2EnLCAnw6UnOiAnYScsICfDpic6ICdhZScsICfDpyc6ICdjJyxcbiAgICAgICAgICAgICfDqCc6ICdlJywgJ8OpJzogJ2UnLCAnw6onOiAnZScsICfDqyc6ICdlJywgJ8OsJzogJ2knLCAnw60nOiAnaScsICfDric6ICdpJywgJ8OvJzogJ2knLFxuICAgICAgICAgICAgJ8OwJzogJ2QnLCAnw7EnOiAnbicsICfDsic6ICdvJywgJ8OzJzogJ28nLCAnw7QnOiAnbycsICfDtSc6ICdvJywgJ8O2JzogJ28nLCAnxZEnOiAnbycsXG4gICAgICAgICAgICAnw7gnOiAnbycsICfDuSc6ICd1JywgJ8O6JzogJ3UnLCAnw7snOiAndScsICfDvCc6ICd1JywgJ8WxJzogJ3UnLCAnw70nOiAneScsICfDvic6ICd0aCcsXG4gICAgICAgICAgICAnw78nOiAneScsXG5cbiAgICAgICAgICAgIC8vIEdyZWVrXG4gICAgICAgICAgICAnzrEnOiAnYScsICfOsic6ICdiJywgJ86zJzogJ2cnLCAnzrQnOiAnZCcsICfOtSc6ICdlJywgJ862JzogJ3onLCAnzrcnOiAnaCcsICfOuCc6ICc4JyxcbiAgICAgICAgICAgICfOuSc6ICdpJywgJ866JzogJ2snLCAnzrsnOiAnbCcsICfOvCc6ICdtJywgJ869JzogJ24nLCAnzr4nOiAnMycsICfOvyc6ICdvJywgJ8+AJzogJ3AnLFxuICAgICAgICAgICAgJ8+BJzogJ3InLCAnz4MnOiAncycsICfPhCc6ICd0JywgJ8+FJzogJ3knLCAnz4YnOiAnZicsICfPhyc6ICd4JywgJ8+IJzogJ3BzJywgJ8+JJzogJ3cnLFxuICAgICAgICAgICAgJ86sJzogJ2EnLCAnzq0nOiAnZScsICfOryc6ICdpJywgJ8+MJzogJ28nLCAnz40nOiAneScsICfOric6ICdoJywgJ8+OJzogJ3cnLCAnz4InOiAncycsXG4gICAgICAgICAgICAnz4onOiAnaScsICfOsCc6ICd5JywgJ8+LJzogJ3knLCAnzpAnOiAnaScsXG5cbiAgICAgICAgICAgIC8vIFR1cmtpc2hcbiAgICAgICAgICAgICfFnyc6ICdzJywgJ8SxJzogJ2knLCAnw6cnOiAnYycsICfDvCc6ICd1JywgJ8O2JzogJ28nLCAnxJ8nOiAnZycsXG5cbiAgICAgICAgICAgIC8vIFJ1c3NpYW5cbiAgICAgICAgICAgICfQsCc6ICdhJywgJ9CxJzogJ2InLCAn0LInOiAndicsICfQsyc6ICdnJywgJ9C0JzogJ2QnLCAn0LUnOiAnZScsICfRkSc6ICd5bycsICfQtic6ICd6aCcsXG4gICAgICAgICAgICAn0LcnOiAneicsICfQuCc6ICdpJywgJ9C5JzogJ2onLCAn0LonOiAnaycsICfQuyc6ICdsJywgJ9C8JzogJ20nLCAn0L0nOiAnbicsICfQvic6ICdvJyxcbiAgICAgICAgICAgICfQvyc6ICdwJywgJ9GAJzogJ3InLCAn0YEnOiAncycsICfRgic6ICd0JywgJ9GDJzogJ3UnLCAn0YQnOiAnZicsICfRhSc6ICdoJywgJ9GGJzogJ2MnLFxuICAgICAgICAgICAgJ9GHJzogJ2NoJywgJ9GIJzogJ3NoJywgJ9GJJzogJ3NjaCcsICfRiic6ICcnLCAn0YsnOiAneScsICfRjCc6ICcnLCAn0Y0nOiAnZScsICfRjic6ICd5dScsXG4gICAgICAgICAgICAn0Y8nOiAneWEnLFxuXG4gICAgICAgICAgICAvLyBVa3JhaW5pYW5cbiAgICAgICAgICAgICfRlCc6ICd5ZScsICfRlic6ICdpJywgJ9GXJzogJ3lpJywgJ9KRJzogJ2cnLFxuXG4gICAgICAgICAgICAvLyBDemVjaFxuICAgICAgICAgICAgJ8SNJzogJ2MnLCAnxI8nOiAnZCcsICfEmyc6ICdlJywgJ8WIJzogJ24nLCAnxZknOiAncicsICfFoSc6ICdzJywgJ8WlJzogJ3QnLCAnxa8nOiAndScsICfFvic6ICd6JyxcblxuICAgICAgICAgICAgLy8gUG9saXNoXG4gICAgICAgICAgICAnxIUnOiAnYScsICfEhyc6ICdjJywgJ8SZJzogJ2UnLCAnxYInOiAnbCcsICfFhCc6ICduJywgJ8OzJzogJ28nLCAnxZsnOiAncycsICfFuic6ICd6JywgJ8W8JzogJ3onLFxuXG4gICAgICAgICAgICAvLyBMYXR2aWFuXG4gICAgICAgICAgICAnxIEnOiAnYScsICfEjSc6ICdjJywgJ8STJzogJ2UnLCAnxKMnOiAnZycsICfEqyc6ICdpJywgJ8S3JzogJ2snLCAnxLwnOiAnbCcsICfFhic6ICduJywgJ8WhJzogJ3MnLCAnxasnOiAndScsICfFvic6ICd6J1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vINCe0YfQuNGJ0LDQtdC8INC+0YIg0LvQuNGI0L3QuNGFINGB0LjQvNCy0L7Qu9C+0LJcblxuICAgICAgICByZXN1bHQgPSBzdHJpbmcucmVwbGFjZSgvW15hLXrQsC3RjzAtOV0vZ2ksICctJyk7XG5cbiAgICAgICAgaWYgKHVybCA9PSAnY3lyaWxsaWMnKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXN1bHQgPSBlbmNvZGVVUkkodW5lc2NhcGUodW5lc2NhcGUocmVzdWx0KSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHVybCA9PSAndHJhbnNsYXRlJylcbiAgICAgICAge1xuICAgICAgICAgICAgZm9yICh4IGluIGNoYXJfbWFwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKFJlZ0V4cCh4LCAnZycpLCBjaGFyX21hcFt4XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyByZXN1bHQgPSByZXN1bHQucmVwbGFjZShSZWdFeHAoeCwgJ2cnKSwgY2hhcl9tYXBbeF0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAge1xuICAgICAgICAgICAgZm9yICh4IGluIGNoYXJfbWFwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKFJlZ0V4cCh4LCAnZycpLCBjaGFyX21hcFt4XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyDQntGH0LjRidCw0LXQvCDQvtGCINC70LjRiNC90LjRhSDQtNC10YTQuNGB0L7QslxuXG4gICAgICAgIHRlc3QgPSByZXN1bHQuc3BsaXQoJycpO1xuXG4gICAgICAgIGlmICh0ZXN0WzBdID09ICctJylcbiAgICAgICAge1xuICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnNsaWNlKDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRlc3RbdGVzdC5sZW5ndGggLSAxXSA9PSAnLScpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdC5zbGljZSgwLCAtMSk7XG4gICAgICAgIH1cblxuICAgICAgICBzdHJpbmcgPSByZXN1bHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlZG91YmxlKHN0cmluZyk7XG59XG5cbmZ1bmN0aW9uIGJpbmRpbmcobmFtZSwgZWxlbWVudClcbntcbiAgICAkKCdib2R5Jykub24oJ2tleXVwIGJsdXIga2V5cHJlc3MnLCAnaW5wdXRbbmFtZT1cIicgKyBuYW1lICsgJ1wiXScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy52YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgICAgIGNvbnN0ICRpbnB1dCA9ICQoJ2lucHV0W25hbWU9XCInICsgZWxlbWVudCArICdcIl0nKTtcbiAgICAgICAgICAgIGlmICghJGlucHV0LnByb3AoJ3JlYWRvbmx5JykpIHtcbiAgICAgICAgICAgICAgICAkaW5wdXQudmFsKHRyYW5zbGl0ZXJhdGUodGhpcy52YWx1ZSwgVVJMX1RSQU5TTEFURSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHJlZG91YmxlKCBzdHJpbmcgKVxue1xuXHRzdHJpbmcgPSBzdHJpbmcucmVwbGFjZSggJ19fJywgJ18nICk7XG4gICAgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoICdfLV8nLCAnXycgKTtcblx0c3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoICctLScsICctJyApO1xuXG5cdGlmICggc3RyaW5nLmluZGV4T2YoJ19fJykgPiAtMSApXG5cdHtcblx0XHRyZXR1cm4gcmVkb3VibGUoIHN0cmluZyApO1xuXHR9XG5cblx0aWYgKCBzdHJpbmcuc3Vic3RyKDAsMSkgPT0gJ18nICYmIHN0cmluZy5sZW5ndGggPiAxIClcblx0e1xuXHRcdHN0cmluZyA9IHN0cmluZy5zdWJzdHIoMSwgc3RyaW5nLmxlbmd0aCApXG5cdH1cblxuXHRyZXR1cm4gc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBhamF4X3RvZ2dsZV9ncm91cChvYmosaWQpXG57XG4gICAgdmFyIHZpc2libGUgPSAwO1xuXG4gICAgaWYgKCAkKG9iaikuaGFzQ2xhc3MoJ2ljb24tZXllLW9mZicpIClcbiAgICB7XG4gICAgICAgIHZpc2libGUgPSAxO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgICB2aXNpYmxlID0gMDtcbiAgICB9XG5cbiAgICAkKG9iaikuYXBwZW5kKCc8aSBjbGFzcz1cImxvYWRpbmdcIj48L2k+Jyk7XG5cbiAgICAkLnBvc3QoJy8nICsgQURNSU5fRElSICsgJy9hamF4L21vZHVsZXMvJywgeyBhY3Rpb246IFwiZGV2aXNpYmxlXCIsIGlkOiBpZCwgdmlzaWJsZTogdmlzaWJsZSB9LCBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgaWYgKCBkYXRhID09IDEgKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAoICQob2JqKS5oYXNDbGFzcygnaWNvbi1leWUtb2ZmJykgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICQob2JqKS5yZW1vdmVDbGFzcygnaWNvbi1leWUtb2ZmJykuYWRkQ2xhc3MoJ2ljb24tZXllJykuaHRtbCgnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKG9iaikucmVtb3ZlQ2xhc3MoJ2ljb24tZXllJykuYWRkQ2xhc3MoJ2ljb24tZXllLW9mZicpLmh0bWwoJycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZV9tZW51KG9iaixpZClcbntcblx0JChvYmopLnRvZ2dsZUNsYXNzKFwibWludXNcIikudG9nZ2xlQ2xhc3MoXCJwbHVzXCIpLnBhcmVudCgpO1xuXHQkKFwiI2l0ZW1cIitpZCkudG9nZ2xlKCk7XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZV9zbWFsbF9waG90byhpZCl7XG4gICAgJChcIiNcIitpZCkudG9nZ2xlKCk7XG59XG5cbmZ1bmN0aW9uIGhpZGVGaWVsZChpZCl7XG4gICAgdGl0bGUgPSAkKFwiI2RvY3NfXCIraWQrXCIgLnRpdGxlX2luXCIpLnZhbCgpO1xuICAgIG9yZCA9ICQoXCIjZG9jc19cIitpZCtcIiAub3JkX2luXCIpLnZhbCgpO1xuXG4gICAgJChcIiNkb2NzX1wiK2lkK1wiIC50aXRsZV9mXCIpLmVtcHR5KCkuYXBwZW5kKHRpdGxlKTtcbiAgICAkKFwiI2RvY3NfXCIraWQrXCIgLm9yZF9mXCIpLmVtcHR5KCkuYXBwZW5kKG9yZCk7XG4gICAgJChcIiNkb2NzX1wiK2lkK1wiIC5idXRfc2F2ZVwiKS5oaWRlKCk7XG4gICAgJChcIiNkb2NzX1wiK2lkK1wiIC5jdHJfZWRpdFwiKS5zaG93KCk7XG59XG5cbmZ1bmN0aW9uIEVkaXREb2NzKGlkKXtcbiAgICAkKFwiI2RvY3NfXCIraWQrXCIgLmJ1dF9zYXZlXCIpLnNob3coKTtcbiAgICAkKFwiI2RvY3NfXCIraWQrXCIgLmN0cl9lZGl0XCIpLmhpZGUoKTtcblxuICAgIGN1cnJfdmFsdWUgPSAkKFwiI2RvY3NfXCIraWQrXCIgLnRpdGxlX2ZcIikudGV4dCgpO1xuICAgICQoXCIjZG9jc19cIitpZCtcIiAudGl0bGVfZlwiKS5lbXB0eSgpLmFwcGVuZChcIjxpbnB1dCB0eXBlPSd0ZXh0JyB2YWx1ZT0nXCIrY3Vycl92YWx1ZStcIicgbmFtZT0ndGl0bGUnIGNsYXNzPSdib3JkIHBhZGQgdzEwMCB0aXRsZV9pbicgLz5cIik7XG4gICAgY3Vycl92YWx1ZSA9ICQoXCIjZG9jc19cIitpZCtcIiAub3JkX2ZcIikudGV4dCgpO1xuICAgICQoXCIjZG9jc19cIitpZCtcIiAub3JkX2ZcIikuZW1wdHkoKS5hcHBlbmQoXCI8aW5wdXQgdHlwZT0ndGV4dCcgdmFsdWU9J1wiK2N1cnJfdmFsdWUrXCInIG5hbWU9J29yZCcgY2xhc3M9J2JvcmQgcGFkZCB3MjAgb3JkX2luJyAvPlwiKTtcblxuICAgICQoXCIjZG9jc19cIitpZCtcIiAudGl0bGVfaW5cIikuZm9jdXMoKTtcbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIFNhdmVEb2NzKGlkKXtcbiAgICB0aXRsZSA9ICQoXCIjZG9jc19cIitpZCtcIiAudGl0bGVfaW5cIikudmFsKCk7XG4gICAgb3JkID0gJChcIiNkb2NzX1wiK2lkK1wiIC5vcmRfaW5cIikudmFsKCk7XG5cbiAgICBpZiAoIXRpdGxlKSB7XG4gICAgICAgIGFsZXJ0KFwi0J/Rg9GB0YLQvtC1INC40LzRjyDQtNC+0LrRg9C80LXQvdGC0LBcIik7XG4gICAgICAgIGhpZGVGaWVsZChpZCk7XG4gICAgfVxuXG4gICAgJC5wb3N0KFxuICAgICAgICAnLycgKyBBRE1JTl9ESVIgKyAnL2FqYXgvZG9jdW1lbnQvJyxcbiAgICAgICAge1xuICAgICAgICAgICAgaWQ6XCJkb2N1bWVudF9lZGl0XCIsXG4gICAgICAgICAgICBkb2NzaWQ6aWQsXG4gICAgICAgICAgICB0aXRsZTp0aXRsZSxcbiAgICAgICAgICAgIG9yZDpvcmRcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBhbGVydCgn0JTQsNC90L3Ri9C1INC+0LHQvdC+0LLQu9C10L3RiycpO1xuICAgICAgICAgICAgaGlkZUZpZWxkKGlkKTtcbiAgICAgICAgfVxuICAgICk7XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBEZWxEb2NzKGlkKXtcbiAgICBpZiAoY3AuZGlhbG9nKCfQktGLINC00LXQudGB0YLQstC40YLQtdC70YzQvdC+INGF0L7RgtC40YLQtSDRg9C00LDQu9C40YLRjD8nKSl7XG4gICAgICAgICQucG9zdChcbiAgICAgICAgICAgICcvJyArIEFETUlOX0RJUiArICcvYWpheC9kb2N1bWVudC8nLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlkOlwiZG9jdW1lbnRfZGVsXCIsXG4gICAgICAgICAgICAgICAgZG9jc2lkOmlkXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGE+MCkge1xuICAgICAgICAgICAgICAgICAgICAkKFwiI2RvY3NfXCIraWQpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBhbGVydCgn0L7RiNC40LHQutCwINC+0LHQvdC+0LLQu9C10L3QuNGPJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gcGFnZV91cGRhdGUoIGl0ZW1faWQgKVxue1xuICAgICQucG9zdCgnLycgKyBBRE1JTl9ESVIgKyAnL2FqYXgvZG9jdW1lbnQvJyxcbiAgICAgICAge1xuICAgICAgICAgICAgaWQ6XCJ1cGRhdGVcIiwgcG9zdF9pZDppdGVtX2lkXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgdmFyIGpzb24gPSBldmFsKCBcIihcIiArIGRhdGEgKyBcIilcIiApO1xuICAgICAgICAgICAgcGFyc2VNc2coIGpzb24gLCBcImZpbGVfZG9jc1wiICk7XG4gICAgICAgIH1cbiAgICApO1xuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gcGFyc2VNc2cobXNnLG9iail7XG4gICAgJChcIiNcIitvYmorXCIgLnVwbG9hZGZpbGVzXCIpLmVtcHR5KCk7XG4gICAgJChcIiNcIitvYmorXCIgaW5wdXQ6ZmlsZVwiKS5hdHRyKHtcInZhbHVlXCI6XCJcIn0pO1xuXG4gICAgc3RyID0gJzx0YWJsZSBzdHlsZT1cIm1hcmdpbi1ib3R0b206MTBweDt3aWR0aDo4MCVcIj48dHI+XFxuPHRkIGNsYXNzPVwiaCB3MTAwXCI+0JTQvtC60YPQvNC10L3RgjwvdGQ+XFxuPHRkIGNsYXNzPVwiaFwiPtCg0LDQt9C80LXRgDwvdGQ+XFxuPHRkIGNsYXNzPVwiaFwiPtCj0LTQsNC70LjRgtGMPC90ZD48L3RyPlxcbic7XG4gICAgdmFyIGkgPSAwO1xuICAgICQuZWFjaCggbXNnLCBmdW5jdGlvbihrLHYpIHtcbiAgICAgICAgaWYgKCBpICUgMiAhPSAwICkgb2RkID0gXCJvZGQgXCI7XG4gICAgICAgIGVsc2Ugb2RkID0gXCJcIjtcbiAgICAgICAgc3RyICs9ICc8dHI+XFxuPHRkIGNsYXNzPVwiJyArIG9kZCArICdcIj48YSBocmVmPVwiJyArIHYuc3lzX25hbWUgKyAnXCIgdGl0bGU9XCJcIiB0YXJnZXQ9XCJfYmxhbmtcIj4nICsgdi50aXRsZSArICc8L2E+PC90ZD5cXG4nO1xuICAgICAgICBzdHIgKz0gJzx0ZCBjbGFzcz1cIicgKyBvZGQgKyAnclwiPiAnICsgdi5zaXplICsgJzwvdGQ+XFxuJztcbiAgICAgICAgc3RyICs9ICc8dGQgY2xhc3M9XCJhY3Rpb25zXCI+PGEgaHJlZj1cIiNcIiBvbmNsaWNrPVwicmV0dXJuIE1vZHVsZS5hamF4RmlsZURlbGV0ZSgnICsgdi5pZCArICcsXFwnJyArIG9iaiArICdcXCcpO1wiIGNsYXNzPVwiY3RyX2EgY3RyX2RlbCBtYXJnaW5cIiB0aXRsZT1cItCj0LTQsNC70LjRgtGMXCIgb25jbGljaz1cInJldHVybiBjb25maXJtKFxcJ9CS0Ysg0LTQtdC50YHRgtCy0LjRgtC10LvRjNC90L4g0YXQvtGC0LjRgtC1INGD0LTQsNC70LjRgtGMP1xcJylcIj48L2E+PC90ZD5cXG48L3RyPlxcbic7XG4gICAgICAgIGkrKztcbiAgICB9KTtcbiAgICBzdHIgKz0gJzwvdGFibGU+J1xuICAgICQoXCIjXCIrb2JqK1wiIC51cGxvYWRmaWxlc1wiKS5hcHBlbmQoc3RyKTtcbn1cblxuZnVuY3Rpb24gYWpheEZpbGVEb2NzVXBsb2FkKGRvY3NfZ3JvdXBfaWQpe1xuXG59XG5cbmZ1bmN0aW9uIHNjcmVlbmluZyggc3RyICkge1xuICAgIHZhciByZWc9L1wiL2c7XG4gICAgdmFyIHJlc3VsdD1zdHIucmVwbGFjZShyZWcsIFwiJnF1b3Q7XCIgKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG59XG4iXX0=

'use strict';

/*!
 * Nestable jQuery Plugin - Copyright (c) 2012 David Bushell - http://dbushell.com/
 * Dual-licensed under the BSD or MIT licenses
 */
;(function ($, window, document, undefined) {
    var hasTouch = 'ontouchstart' in document;

    /**
     * Detect CSS pointer-events property
     * events are normally disabled on the dragging element to avoid conflicts
     * https://github.com/ausi/Feature-detection-technique-for-pointer-events/blob/master/modernizr-pointerevents.js
     */
    var hasPointerEvents = function () {
        var el = document.createElement('div'),
            docEl = document.documentElement;
        if (!('pointerEvents' in el.style)) {
            return false;
        }
        el.style.pointerEvents = 'auto';
        el.style.pointerEvents = 'x';
        docEl.appendChild(el);
        var supports = window.getComputedStyle && window.getComputedStyle(el, '').pointerEvents === 'auto';
        docEl.removeChild(el);
        return !!supports;
    }();

    var defaults = {
        listNodeName: 'ol',
        itemNodeName: 'li',
        rootClass: 'dd',
        listClass: 'dd-list',
        itemClass: 'dd-item',
        dragClass: 'dd-dragel',
        handleClass: 'dd-handle',
        collapsedClass: 'dd-collapsed',
        placeClass: 'dd-placeholder',
        noDragClass: 'dd-nodrag',
        emptyClass: 'dd-empty',
        expandBtnHTML: '<button data-action="expand" type="button" class="dd-button dd-button__expand"></button>',
        collapseBtnHTML: '<button data-action="collapse" type="button" class="dd-button dd-button__collapse"></button>',
        group: 0,
        maxDepth: 5,
        threshold: 20,
        dragStop: null,
        afterExpand: null,
        afterCollapse: null
    };

    function Plugin(element, options) {
        this.w = $(document);
        this.el = $(element);
        this.options = $.extend({}, defaults, options);
        this.init();
    }

    Plugin.prototype = {

        init: function init() {
            var list = this;

            list.reset();

            list.el.data('nestable-group', this.options.group);

            list.placeEl = $('<div class="' + list.options.placeClass + '"/>');

            $.each(this.el.find(list.options.itemNodeName), function (k, el) {
                list.setParent($(el));
            });

            list.el.on('click', 'button', function (e) {
                if (list.dragEl) {
                    return;
                }
                var target = $(e.currentTarget),
                    action = target.data('action'),
                    item = target.parent(list.options.itemNodeName);
                if (action === 'collapse') {
                    list.collapseItem(item);
                }
                if (action === 'expand') {
                    list.expandItem(item);
                }
            });

            var onStartEvent = function onStartEvent(e) {
                var handle = $(e.target);
                if (!handle.hasClass(list.options.handleClass)) {
                    if (handle.closest('.' + list.options.noDragClass).length) {
                        return;
                    }
                    handle = handle.closest('.' + list.options.handleClass);
                }

                if (!handle.length || list.dragEl) {
                    return;
                }

                list.isTouch = /^touch/.test(e.type);
                if (list.isTouch && e.touches.length !== 1) {
                    return;
                }

                e.preventDefault();
                list.dragStart(e.touches ? e.touches[0] : e);
            };

            var onMoveEvent = function onMoveEvent(e) {
                if (list.dragEl) {
                    e.preventDefault();
                    list.dragMove(e.touches ? e.touches[0] : e);
                }
            };

            var onEndEvent = function onEndEvent(e) {
                if (list.dragEl) {
                    e.preventDefault();
                    list.dragStop(e.touches ? e.touches[0] : e);
                }
            };

            if (hasTouch) {
                list.el[0].addEventListener('touchstart', onStartEvent, false);
                window.addEventListener('touchmove', onMoveEvent, false);
                window.addEventListener('touchend', onEndEvent, false);
                window.addEventListener('touchcancel', onEndEvent, false);
            }

            list.el.on('mousedown', onStartEvent);
            list.w.on('mousemove', onMoveEvent);
            list.w.on('mouseup', onEndEvent);
        },

        serialize: function serialize() {
            var data,
                depth = 0,
                list = this;
            step = function (_step) {
                function step(_x, _x2) {
                    return _step.apply(this, arguments);
                }

                step.toString = function () {
                    return _step.toString();
                };

                return step;
            }(function (level, depth) {
                var array = [],
                    items = level.children(list.options.itemNodeName);
                items.each(function () {
                    var li = $(this),
                        item = $.extend({}, li.data()),
                        sub = li.children(list.options.listNodeName);
                    if (sub.length) {
                        item.children = step(sub, depth + 1);
                    }
                    array.push(item);
                });
                return array;
            });
            data = step(list.el.find(list.options.listNodeName).first(), depth);
            return data;
        },

        serialise: function serialise() {
            return this.serialize();
        },

        reset: function reset() {
            this.mouse = {
                offsetX: 0,
                offsetY: 0,
                startX: 0,
                startY: 0,
                lastX: 0,
                lastY: 0,
                nowX: 0,
                nowY: 0,
                distX: 0,
                distY: 0,
                dirAx: 0,
                dirX: 0,
                dirY: 0,
                lastDirX: 0,
                lastDirY: 0,
                distAxX: 0,
                distAxY: 0
            };
            this.isTouch = false;
            this.moving = false;
            this.dragEl = null;
            this.dragRootEl = null;
            this.dragDepth = 0;
            this.hasNewRoot = false;
            this.pointEl = null;
        },

        expandItem: function expandItem(li) {
            li.removeClass(this.options.collapsedClass);
            li.children('[data-action="expand"]').hide();
            li.children('[data-action="collapse"]').show();
            li.children(this.options.listNodeName).show();

            if (typeof this.options.afterExpand == 'function') {
                this.options.afterExpand(li);
            }
        },

        collapseItem: function collapseItem(li) {
            var lists = li.children(this.options.listNodeName);

            if (lists.length) {
                li.addClass(this.options.collapsedClass);
                li.children('[data-action="collapse"]').hide();
                li.children('[data-action="expand"]').show();
                li.children(this.options.listNodeName).hide();
            }

            if (typeof this.options.afterCollapse == 'function') {
                this.options.afterCollapse(li);
            }
        },

        expandAll: function expandAll() {
            var list = this;
            list.el.find(list.options.itemNodeName).each(function () {
                list.expandItem($(this));
            });
        },

        collapseAll: function collapseAll() {
            var list = this;
            list.el.find(list.options.itemNodeName).each(function () {
                list.collapseItem($(this));
            });
        },

        setParent: function setParent(li) {
            if (li.children(this.options.listNodeName).length) {
                if (!li.find('.dd-button__expand').length) {
                    li.prepend($(this.options.expandBtnHTML));
                }

                if (!li.find('.dd-button__collapse').length) {
                    li.prepend($(this.options.collapseBtnHTML));
                }
            }

            if ($(li[0]).hasClass('dd-collapsed')) {
                li.children('[data-action="collapse"]').hide();
            } else {
                li.children('[data-action="expand"]').hide();
            }
        },

        unsetParent: function unsetParent(li) {
            li.removeClass(this.options.collapsedClass);
            li.children('[data-action]').remove();
            li.children(this.options.listNodeName).remove();
        },

        dragStart: function dragStart(e) {
            var mouse = this.mouse,
                target = $(e.target),
                dragItem = target.closest(this.options.itemNodeName);

            this.placeEl.css('height', dragItem.height());

            mouse.offsetX = e.offsetX !== undefined ? e.offsetX : e.pageX - target.offset().left;
            mouse.offsetY = e.offsetY !== undefined ? e.offsetY : e.pageY - target.offset().top;
            mouse.startX = mouse.lastX = e.pageX;
            mouse.startY = mouse.lastY = e.pageY;

            this.dragRootEl = this.el;

            this.dragEl = $(document.createElement(this.options.listNodeName)).addClass(this.options.listClass + ' ' + this.options.dragClass);
            this.dragEl.css('width', dragItem.width());

            dragItem.after(this.placeEl);
            dragItem[0].parentNode.removeChild(dragItem[0]);
            dragItem.appendTo(this.dragEl);

            $(document.body).append(this.dragEl);
            this.dragEl.css({
                'left': e.pageX - mouse.offsetX,
                'top': e.pageY - mouse.offsetY
            });
            // total depth of dragging item
            var i,
                depth,
                items = this.dragEl.find(this.options.itemNodeName);
            for (i = 0; i < items.length; i++) {
                depth = $(items[i]).parents(this.options.listNodeName).length;
                if (depth > this.dragDepth) {
                    this.dragDepth = depth;
                }
            }
        },

        dragStop: function dragStop(e) {
            var el = this.dragEl.children(this.options.itemNodeName).first();
            el[0].parentNode.removeChild(el[0]);
            this.placeEl.replaceWith(el);

            this.dragEl.remove();
            this.el.trigger('change');
            if (this.hasNewRoot) {
                this.dragRootEl.trigger('change');
            }
            this.reset();

            if (typeof this.options.dragStop == 'function') {
                this.options.dragStop(el);
            }
        },

        dragMove: function dragMove(e) {
            var list,
                parent,
                prev,
                next,
                depth,
                opt = this.options,
                mouse = this.mouse;

            this.dragEl.css({
                'left': e.pageX - mouse.offsetX,
                'top': e.pageY - mouse.offsetY
            });

            // mouse position last events
            mouse.lastX = mouse.nowX;
            mouse.lastY = mouse.nowY;
            // mouse position this events
            mouse.nowX = e.pageX;
            mouse.nowY = e.pageY;
            // distance mouse moved between events
            mouse.distX = mouse.nowX - mouse.lastX;
            mouse.distY = mouse.nowY - mouse.lastY;
            // direction mouse was moving
            mouse.lastDirX = mouse.dirX;
            mouse.lastDirY = mouse.dirY;
            // direction mouse is now moving (on both axis)
            mouse.dirX = mouse.distX === 0 ? 0 : mouse.distX > 0 ? 1 : -1;
            mouse.dirY = mouse.distY === 0 ? 0 : mouse.distY > 0 ? 1 : -1;
            // axis mouse is now moving on
            var newAx = Math.abs(mouse.distX) > Math.abs(mouse.distY) ? 1 : 0;

            // do nothing on first move
            if (!mouse.moving) {
                mouse.dirAx = newAx;
                mouse.moving = true;
                return;
            }

            // calc distance moved on this axis (and direction)
            if (mouse.dirAx !== newAx) {
                mouse.distAxX = 0;
                mouse.distAxY = 0;
            } else {
                mouse.distAxX += Math.abs(mouse.distX);
                if (mouse.dirX !== 0 && mouse.dirX !== mouse.lastDirX) {
                    mouse.distAxX = 0;
                }
                mouse.distAxY += Math.abs(mouse.distY);
                if (mouse.dirY !== 0 && mouse.dirY !== mouse.lastDirY) {
                    mouse.distAxY = 0;
                }
            }
            mouse.dirAx = newAx;

            /**
             * move horizontal
             */
            if (mouse.dirAx && mouse.distAxX >= opt.threshold) {
                // reset move distance on x-axis for new phase
                mouse.distAxX = 0;
                prev = this.placeEl.prev(opt.itemNodeName);
                // increase horizontal level if previous sibling exists and is not collapsed
                if (mouse.distX > 0 && prev.length && !prev.hasClass(opt.collapsedClass)) {
                    // cannot increase level when item above is collapsed
                    list = prev.find(opt.listNodeName).last();
                    // check if depth limit has reached
                    depth = this.placeEl.parents(opt.listNodeName).length;
                    if (depth + this.dragDepth <= opt.maxDepth) {
                        // create new sub-level if one doesn't exist
                        if (!list.length) {
                            list = $('<' + opt.listNodeName + '/>').addClass(opt.listClass);
                            list.append(this.placeEl);
                            prev.append(list);
                            this.setParent(prev);
                        } else {
                            // else append to next level up
                            list = prev.children(opt.listNodeName).last();
                            list.append(this.placeEl);
                        }
                    }
                }
                // decrease horizontal level
                if (mouse.distX < 0) {
                    // we can't decrease a level if an item preceeds the current one
                    next = this.placeEl.next(opt.itemNodeName);
                    if (!next.length) {
                        parent = this.placeEl.parent();
                        this.placeEl.closest(opt.itemNodeName).after(this.placeEl);
                        if (!parent.children().length) {
                            this.unsetParent(parent.parent());
                        }
                    }
                }
            }

            var isEmpty = false;

            // find list item under cursor
            if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'hidden';
            }
            this.pointEl = $(document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - (window.pageYOffset || document.documentElement.scrollTop)));
            if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'visible';
            }
            if (this.pointEl.hasClass(opt.handleClass)) {
                this.pointEl = this.pointEl.parent(opt.itemNodeName);
            }
            if (this.pointEl.hasClass(opt.emptyClass)) {
                isEmpty = true;
            } else if (!this.pointEl.length || !this.pointEl.hasClass(opt.itemClass)) {
                return;
            }

            // find parent list of item under cursor
            var pointElRoot = this.pointEl.closest('.' + opt.rootClass),
                isNewRoot = this.dragRootEl.data('nestable-id') !== pointElRoot.data('nestable-id');

            /**
             * move vertical
             */
            if (!mouse.dirAx || isNewRoot || isEmpty) {
                // check if groups match if dragging over new root
                if (isNewRoot && opt.group !== pointElRoot.data('nestable-group')) {
                    return;
                }
                // check depth limit
                depth = this.dragDepth - 1 + this.pointEl.parents(opt.listNodeName).length;
                if (depth > opt.maxDepth) {
                    return;
                }
                var before = e.pageY < this.pointEl.offset().top + this.pointEl.height() / 2;
                parent = this.placeEl.parent();
                // if empty create new list to replace empty placeholder
                if (isEmpty) {
                    list = $(document.createElement(opt.listNodeName)).addClass(opt.listClass);
                    list.append(this.placeEl);
                    this.pointEl.replaceWith(list);
                } else if (before) {
                    this.pointEl.before(this.placeEl);
                } else {
                    this.pointEl.after(this.placeEl);
                }
                if (!parent.children().length) {
                    this.unsetParent(parent.parent());
                }
                if (!this.dragRootEl.find(opt.itemNodeName).length) {
                    this.dragRootEl.append('<div class="' + opt.emptyClass + '"/>');
                }
                // parent root list has changed
                if (isNewRoot) {
                    this.dragRootEl = pointElRoot;
                    this.hasNewRoot = this.el[0] !== this.dragRootEl[0];
                }
            }
        }

    };

    $.fn.nestable = function (params) {
        var lists = this,
            retval = this;

        lists.each(function () {
            var plugin = $(this).data("nestable");

            if (!plugin) {
                $(this).data("nestable", new Plugin(this, params));
                $(this).data("nestable-id", new Date().getTime());
            } else {
                if (typeof params === 'string' && typeof plugin[params] === 'function') {
                    retval = plugin[params]();
                }
            }
        });

        return retval || lists;
    };
})(window.jQuery || window.Zepto, window, document);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5lc3RhYmxlLmpzIl0sIm5hbWVzIjpbIiQiLCJ3aW5kb3ciLCJkb2N1bWVudCIsInVuZGVmaW5lZCIsImhhc1RvdWNoIiwiaGFzUG9pbnRlckV2ZW50cyIsImVsIiwiY3JlYXRlRWxlbWVudCIsImRvY0VsIiwiZG9jdW1lbnRFbGVtZW50Iiwic3R5bGUiLCJwb2ludGVyRXZlbnRzIiwiYXBwZW5kQ2hpbGQiLCJzdXBwb3J0cyIsImdldENvbXB1dGVkU3R5bGUiLCJyZW1vdmVDaGlsZCIsImRlZmF1bHRzIiwibGlzdE5vZGVOYW1lIiwiaXRlbU5vZGVOYW1lIiwicm9vdENsYXNzIiwibGlzdENsYXNzIiwiaXRlbUNsYXNzIiwiZHJhZ0NsYXNzIiwiaGFuZGxlQ2xhc3MiLCJjb2xsYXBzZWRDbGFzcyIsInBsYWNlQ2xhc3MiLCJub0RyYWdDbGFzcyIsImVtcHR5Q2xhc3MiLCJleHBhbmRCdG5IVE1MIiwiY29sbGFwc2VCdG5IVE1MIiwiZ3JvdXAiLCJtYXhEZXB0aCIsInRocmVzaG9sZCIsImRyYWdTdG9wIiwiYWZ0ZXJFeHBhbmQiLCJhZnRlckNvbGxhcHNlIiwiUGx1Z2luIiwiZWxlbWVudCIsIm9wdGlvbnMiLCJ3IiwiZXh0ZW5kIiwiaW5pdCIsInByb3RvdHlwZSIsImxpc3QiLCJyZXNldCIsImRhdGEiLCJwbGFjZUVsIiwiZWFjaCIsImZpbmQiLCJrIiwic2V0UGFyZW50Iiwib24iLCJlIiwiZHJhZ0VsIiwidGFyZ2V0IiwiY3VycmVudFRhcmdldCIsImFjdGlvbiIsIml0ZW0iLCJwYXJlbnQiLCJjb2xsYXBzZUl0ZW0iLCJleHBhbmRJdGVtIiwib25TdGFydEV2ZW50IiwiaGFuZGxlIiwiaGFzQ2xhc3MiLCJjbG9zZXN0IiwibGVuZ3RoIiwiaXNUb3VjaCIsInRlc3QiLCJ0eXBlIiwidG91Y2hlcyIsInByZXZlbnREZWZhdWx0IiwiZHJhZ1N0YXJ0Iiwib25Nb3ZlRXZlbnQiLCJkcmFnTW92ZSIsIm9uRW5kRXZlbnQiLCJhZGRFdmVudExpc3RlbmVyIiwic2VyaWFsaXplIiwiZGVwdGgiLCJzdGVwIiwibGV2ZWwiLCJhcnJheSIsIml0ZW1zIiwiY2hpbGRyZW4iLCJsaSIsInN1YiIsInB1c2giLCJmaXJzdCIsInNlcmlhbGlzZSIsIm1vdXNlIiwib2Zmc2V0WCIsIm9mZnNldFkiLCJzdGFydFgiLCJzdGFydFkiLCJsYXN0WCIsImxhc3RZIiwibm93WCIsIm5vd1kiLCJkaXN0WCIsImRpc3RZIiwiZGlyQXgiLCJkaXJYIiwiZGlyWSIsImxhc3REaXJYIiwibGFzdERpclkiLCJkaXN0QXhYIiwiZGlzdEF4WSIsIm1vdmluZyIsImRyYWdSb290RWwiLCJkcmFnRGVwdGgiLCJoYXNOZXdSb290IiwicG9pbnRFbCIsInJlbW92ZUNsYXNzIiwiaGlkZSIsInNob3ciLCJsaXN0cyIsImFkZENsYXNzIiwiZXhwYW5kQWxsIiwiY29sbGFwc2VBbGwiLCJwcmVwZW5kIiwidW5zZXRQYXJlbnQiLCJyZW1vdmUiLCJkcmFnSXRlbSIsImNzcyIsImhlaWdodCIsInBhZ2VYIiwib2Zmc2V0IiwibGVmdCIsInBhZ2VZIiwidG9wIiwid2lkdGgiLCJhZnRlciIsInBhcmVudE5vZGUiLCJhcHBlbmRUbyIsImJvZHkiLCJhcHBlbmQiLCJpIiwicGFyZW50cyIsInJlcGxhY2VXaXRoIiwidHJpZ2dlciIsInByZXYiLCJuZXh0Iiwib3B0IiwibmV3QXgiLCJNYXRoIiwiYWJzIiwibGFzdCIsImlzRW1wdHkiLCJ2aXNpYmlsaXR5IiwiZWxlbWVudEZyb21Qb2ludCIsInNjcm9sbExlZnQiLCJwYWdlWU9mZnNldCIsInNjcm9sbFRvcCIsInBvaW50RWxSb290IiwiaXNOZXdSb290IiwiYmVmb3JlIiwiZm4iLCJuZXN0YWJsZSIsInBhcmFtcyIsInJldHZhbCIsInBsdWdpbiIsIkRhdGUiLCJnZXRUaW1lIiwialF1ZXJ5IiwiWmVwdG8iXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7QUFJQSxDQUFDLENBQUMsVUFBU0EsQ0FBVCxFQUFZQyxNQUFaLEVBQW9CQyxRQUFwQixFQUE4QkMs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O0FBQ3BFQyw2QkFBU0MsT0FBT0YsTUFBUCxHQUFUO0FBQ0g7QUFDSjtBQUNKLFNBWkQ7O0FBY0EsZUFBT0MsVUFBVTVDLEtBQWpCO0FBQ0gsS0FwQkQ7QUFzQkgsQ0FsZ0JBLEVBa2dCRWpILE9BQU9pSyxNQUFQLElBQWlCakssT0FBT2tLLEtBbGdCMUIsRUFrZ0JpQ2xLLE1BbGdCakMsRUFrZ0J5Q0MsUUFsZ0J6QyIsImZpbGUiOiJuZXN0YWJsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogTmVzdGFibGUgalF1ZXJ5IFBsdWdpbiAtIENvcHlyaWdodCAoYykgMjAxMiBEYXZpZCBCdXNoZWxsIC0gaHR0cDovL2RidXNoZWxsLmNvbS9cbiAqIER1YWwtbGljZW5zZWQgdW5kZXIgdGhlIEJTRCBvciBNSVQgbGljZW5zZXNcbiAqL1xuOyhmdW5jdGlvbigkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpXG57XG4gICAgdmFyIGhhc1RvdWNoID0gJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQ7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlY3QgQ1NTIHBvaW50ZXItZXZlbnRzIHByb3BlcnR5XG4gICAgICogZXZlbnRzIGFyZSBub3JtYWxseSBkaXNhYmxlZCBvbiB0aGUgZHJhZ2dpbmcgZWxlbWVudCB0byBhdm9pZCBjb25mbGljdHNcbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20vYXVzaS9GZWF0dXJlLWRldGVjdGlvbi10ZWNobmlxdWUtZm9yLXBvaW50ZXItZXZlbnRzL2Jsb2IvbWFzdGVyL21vZGVybml6ci1wb2ludGVyZXZlbnRzLmpzXG4gICAgICovXG4gICAgdmFyIGhhc1BvaW50ZXJFdmVudHMgPSAoZnVuY3Rpb24oKVxuICAgIHtcbiAgICAgICAgdmFyIGVsICAgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgICAgICBkb2NFbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgaWYgKCEoJ3BvaW50ZXJFdmVudHMnIGluIGVsLnN0eWxlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnYXV0byc7XG4gICAgICAgIGVsLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAneCc7XG4gICAgICAgIGRvY0VsLmFwcGVuZENoaWxkKGVsKTtcbiAgICAgICAgdmFyIHN1cHBvcnRzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUgJiYgd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwsICcnKS5wb2ludGVyRXZlbnRzID09PSAnYXV0byc7XG4gICAgICAgIGRvY0VsLnJlbW92ZUNoaWxkKGVsKTtcbiAgICAgICAgcmV0dXJuICEhc3VwcG9ydHM7XG4gICAgfSkoKTtcblxuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIGxpc3ROb2RlTmFtZSAgICA6ICdvbCcsXG4gICAgICAgICAgICBpdGVtTm9kZU5hbWUgICAgOiAnbGknLFxuICAgICAgICAgICAgcm9vdENsYXNzICAgICAgIDogJ2RkJyxcbiAgICAgICAgICAgIGxpc3RDbGFzcyAgICAgICA6ICdkZC1saXN0JyxcbiAgICAgICAgICAgIGl0ZW1DbGFzcyAgICAgICA6ICdkZC1pdGVtJyxcbiAgICAgICAgICAgIGRyYWdDbGFzcyAgICAgICA6ICdkZC1kcmFnZWwnLFxuICAgICAgICAgICAgaGFuZGxlQ2xhc3MgICAgIDogJ2RkLWhhbmRsZScsXG4gICAgICAgICAgICBjb2xsYXBzZWRDbGFzcyAgOiAnZGQtY29sbGFwc2VkJyxcbiAgICAgICAgICAgIHBsYWNlQ2xhc3MgICAgICA6ICdkZC1wbGFjZWhvbGRlcicsXG4gICAgICAgICAgICBub0RyYWdDbGFzcyAgICAgOiAnZGQtbm9kcmFnJyxcbiAgICAgICAgICAgIGVtcHR5Q2xhc3MgICAgICA6ICdkZC1lbXB0eScsXG4gICAgICAgICAgICBleHBhbmRCdG5IVE1MICAgOiAnPGJ1dHRvbiBkYXRhLWFjdGlvbj1cImV4cGFuZFwiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImRkLWJ1dHRvbiBkZC1idXR0b25fX2V4cGFuZFwiPjwvYnV0dG9uPicsXG4gICAgICAgICAgICBjb2xsYXBzZUJ0bkhUTUwgOiAnPGJ1dHRvbiBkYXRhLWFjdGlvbj1cImNvbGxhcHNlXCIgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiZGQtYnV0dG9uIGRkLWJ1dHRvbl9fY29sbGFwc2VcIj48L2J1dHRvbj4nLFxuICAgICAgICAgICAgZ3JvdXAgICAgICAgICAgIDogMCxcbiAgICAgICAgICAgIG1heERlcHRoICAgICAgICA6IDUsXG4gICAgICAgICAgICB0aHJlc2hvbGQgICAgICAgOiAyMCxcbiAgICAgICAgICAgIGRyYWdTdG9wICAgICAgICA6IG51bGwsXG4gICAgICAgICAgICBhZnRlckV4cGFuZCAgICAgOiBudWxsLFxuICAgICAgICAgICAgYWZ0ZXJDb2xsYXBzZSAgIDogbnVsbFxuICAgICAgICB9O1xuXG4gICAgZnVuY3Rpb24gUGx1Z2luKGVsZW1lbnQsIG9wdGlvbnMpXG4gICAge1xuICAgICAgICB0aGlzLncgID0gJChkb2N1bWVudCk7XG4gICAgICAgIHRoaXMuZWwgPSAkKGVsZW1lbnQpO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICBQbHVnaW4ucHJvdG90eXBlID0ge1xuXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGxpc3QgPSB0aGlzO1xuXG4gICAgICAgICAgICBsaXN0LnJlc2V0KCk7XG5cbiAgICAgICAgICAgIGxpc3QuZWwuZGF0YSgnbmVzdGFibGUtZ3JvdXAnLCB0aGlzLm9wdGlvbnMuZ3JvdXApO1xuXG4gICAgICAgICAgICBsaXN0LnBsYWNlRWwgPSAkKCc8ZGl2IGNsYXNzPVwiJyArIGxpc3Qub3B0aW9ucy5wbGFjZUNsYXNzICsgJ1wiLz4nKTtcblxuICAgICAgICAgICAgJC5lYWNoKHRoaXMuZWwuZmluZChsaXN0Lm9wdGlvbnMuaXRlbU5vZGVOYW1lKSwgZnVuY3Rpb24oaywgZWwpIHtcbiAgICAgICAgICAgICAgICBsaXN0LnNldFBhcmVudCgkKGVsKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGlzdC5lbC5vbignY2xpY2snLCAnYnV0dG9uJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGlmIChsaXN0LmRyYWdFbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCksXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbiA9IHRhcmdldC5kYXRhKCdhY3Rpb24nKSxcbiAgICAgICAgICAgICAgICAgICAgaXRlbSAgID0gdGFyZ2V0LnBhcmVudChsaXN0Lm9wdGlvbnMuaXRlbU5vZGVOYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09PSAnY29sbGFwc2UnKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QuY29sbGFwc2VJdGVtKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uID09PSAnZXhwYW5kJykge1xuICAgICAgICAgICAgICAgICAgICBsaXN0LmV4cGFuZEl0ZW0oaXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBvblN0YXJ0RXZlbnQgPSBmdW5jdGlvbihlKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciBoYW5kbGUgPSAkKGUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICBpZiAoIWhhbmRsZS5oYXNDbGFzcyhsaXN0Lm9wdGlvbnMuaGFuZGxlQ2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChoYW5kbGUuY2xvc2VzdCgnLicgKyBsaXN0Lm9wdGlvbnMubm9EcmFnQ2xhc3MpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZSA9IGhhbmRsZS5jbG9zZXN0KCcuJyArIGxpc3Qub3B0aW9ucy5oYW5kbGVDbGFzcyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFoYW5kbGUubGVuZ3RoIHx8IGxpc3QuZHJhZ0VsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsaXN0LmlzVG91Y2ggPSAvXnRvdWNoLy50ZXN0KGUudHlwZSk7XG4gICAgICAgICAgICAgICAgaWYgKGxpc3QuaXNUb3VjaCAmJiBlLnRvdWNoZXMubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgbGlzdC5kcmFnU3RhcnQoZS50b3VjaGVzID8gZS50b3VjaGVzWzBdIDogZSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgb25Nb3ZlRXZlbnQgPSBmdW5jdGlvbihlKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmIChsaXN0LmRyYWdFbCkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QuZHJhZ01vdmUoZS50b3VjaGVzID8gZS50b3VjaGVzWzBdIDogZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIG9uRW5kRXZlbnQgPSBmdW5jdGlvbihlKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmIChsaXN0LmRyYWdFbCkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QuZHJhZ1N0b3AoZS50b3VjaGVzID8gZS50b3VjaGVzWzBdIDogZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKGhhc1RvdWNoKSB7XG4gICAgICAgICAgICAgICAgbGlzdC5lbFswXS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgb25TdGFydEV2ZW50LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG9uTW92ZUV2ZW50LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25FbmRFdmVudCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGNhbmNlbCcsIG9uRW5kRXZlbnQsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGlzdC5lbC5vbignbW91c2Vkb3duJywgb25TdGFydEV2ZW50KTtcbiAgICAgICAgICAgIGxpc3Qudy5vbignbW91c2Vtb3ZlJywgb25Nb3ZlRXZlbnQpO1xuICAgICAgICAgICAgbGlzdC53Lm9uKCdtb3VzZXVwJywgb25FbmRFdmVudCk7XG5cbiAgICAgICAgfSxcblxuICAgICAgICBzZXJpYWxpemU6IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGRhdGEsXG4gICAgICAgICAgICAgICAgZGVwdGggPSAwLFxuICAgICAgICAgICAgICAgIGxpc3QgID0gdGhpcztcbiAgICAgICAgICAgICAgICBzdGVwICA9IGZ1bmN0aW9uKGxldmVsLCBkZXB0aClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcnJheSA9IFsgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zID0gbGV2ZWwuY2hpbGRyZW4obGlzdC5vcHRpb25zLml0ZW1Ob2RlTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zLmVhY2goZnVuY3Rpb24oKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGkgICA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSA9ICQuZXh0ZW5kKHt9LCBsaS5kYXRhKCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YiAgPSBsaS5jaGlsZHJlbihsaXN0Lm9wdGlvbnMubGlzdE5vZGVOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdWIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5jaGlsZHJlbiA9IHN0ZXAoc3ViLCBkZXB0aCArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXkucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcnJheTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgZGF0YSA9IHN0ZXAobGlzdC5lbC5maW5kKGxpc3Qub3B0aW9ucy5saXN0Tm9kZU5hbWUpLmZpcnN0KCksIGRlcHRoKTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9LFxuXG4gICAgICAgIHNlcmlhbGlzZTogZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXJpYWxpemUoKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZXNldDogZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLm1vdXNlID0ge1xuICAgICAgICAgICAgICAgIG9mZnNldFggICA6IDAsXG4gICAgICAgICAgICAgICAgb2Zmc2V0WSAgIDogMCxcbiAgICAgICAgICAgICAgICBzdGFydFggICAgOiAwLFxuICAgICAgICAgICAgICAgIHN0YXJ0WSAgICA6IDAsXG4gICAgICAgICAgICAgICAgbGFzdFggICAgIDogMCxcbiAgICAgICAgICAgICAgICBsYXN0WSAgICAgOiAwLFxuICAgICAgICAgICAgICAgIG5vd1ggICAgICA6IDAsXG4gICAgICAgICAgICAgICAgbm93WSAgICAgIDogMCxcbiAgICAgICAgICAgICAgICBkaXN0WCAgICAgOiAwLFxuICAgICAgICAgICAgICAgIGRpc3RZICAgICA6IDAsXG4gICAgICAgICAgICAgICAgZGlyQXggICAgIDogMCxcbiAgICAgICAgICAgICAgICBkaXJYICAgICAgOiAwLFxuICAgICAgICAgICAgICAgIGRpclkgICAgICA6IDAsXG4gICAgICAgICAgICAgICAgbGFzdERpclggIDogMCxcbiAgICAgICAgICAgICAgICBsYXN0RGlyWSAgOiAwLFxuICAgICAgICAgICAgICAgIGRpc3RBeFggICA6IDAsXG4gICAgICAgICAgICAgICAgZGlzdEF4WSAgIDogMFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuaXNUb3VjaCAgICA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5tb3ZpbmcgICAgID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmRyYWdFbCAgICAgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5kcmFnUm9vdEVsID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZHJhZ0RlcHRoICA9IDA7XG4gICAgICAgICAgICB0aGlzLmhhc05ld1Jvb3QgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMucG9pbnRFbCAgICA9IG51bGw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZXhwYW5kSXRlbTogZnVuY3Rpb24obGkpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxpLnJlbW92ZUNsYXNzKHRoaXMub3B0aW9ucy5jb2xsYXBzZWRDbGFzcyk7XG4gICAgICAgICAgICBsaS5jaGlsZHJlbignW2RhdGEtYWN0aW9uPVwiZXhwYW5kXCJdJykuaGlkZSgpO1xuICAgICAgICAgICAgbGkuY2hpbGRyZW4oJ1tkYXRhLWFjdGlvbj1cImNvbGxhcHNlXCJdJykuc2hvdygpO1xuICAgICAgICAgICAgbGkuY2hpbGRyZW4odGhpcy5vcHRpb25zLmxpc3ROb2RlTmFtZSkuc2hvdygpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5hZnRlckV4cGFuZCA9PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5hZnRlckV4cGFuZChsaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29sbGFwc2VJdGVtOiBmdW5jdGlvbihsaSlcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGxpc3RzID0gbGkuY2hpbGRyZW4odGhpcy5vcHRpb25zLmxpc3ROb2RlTmFtZSk7XG5cbiAgICAgICAgICAgIGlmIChsaXN0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBsaS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY29sbGFwc2VkQ2xhc3MpO1xuICAgICAgICAgICAgICAgIGxpLmNoaWxkcmVuKCdbZGF0YS1hY3Rpb249XCJjb2xsYXBzZVwiXScpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICBsaS5jaGlsZHJlbignW2RhdGEtYWN0aW9uPVwiZXhwYW5kXCJdJykuc2hvdygpO1xuICAgICAgICAgICAgICAgIGxpLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5saXN0Tm9kZU5hbWUpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuYWZ0ZXJDb2xsYXBzZSA9PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5hZnRlckNvbGxhcHNlKGxpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBleHBhbmRBbGw6IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGxpc3QgPSB0aGlzO1xuICAgICAgICAgICAgbGlzdC5lbC5maW5kKGxpc3Qub3B0aW9ucy5pdGVtTm9kZU5hbWUpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbGlzdC5leHBhbmRJdGVtKCQodGhpcykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29sbGFwc2VBbGw6IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGxpc3QgPSB0aGlzO1xuICAgICAgICAgICAgbGlzdC5lbC5maW5kKGxpc3Qub3B0aW9ucy5pdGVtTm9kZU5hbWUpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgbGlzdC5jb2xsYXBzZUl0ZW0oJCh0aGlzKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBzZXRQYXJlbnQ6IGZ1bmN0aW9uKGxpKVxuICAgICAgICB7XG4gICAgICAgICAgICBpZiAobGkuY2hpbGRyZW4odGhpcy5vcHRpb25zLmxpc3ROb2RlTmFtZSkubGVuZ3RoKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmICghbGkuZmluZCgnLmRkLWJ1dHRvbl9fZXhwYW5kJykubGVuZ3RoKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbGkucHJlcGVuZCgkKHRoaXMub3B0aW9ucy5leHBhbmRCdG5IVE1MKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFsaS5maW5kKCcuZGQtYnV0dG9uX19jb2xsYXBzZScpLmxlbmd0aClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGxpLnByZXBlbmQoJCh0aGlzLm9wdGlvbnMuY29sbGFwc2VCdG5IVE1MKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoJChsaVswXSkuaGFzQ2xhc3MoJ2RkLWNvbGxhcHNlZCcpKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGxpLmNoaWxkcmVuKCdbZGF0YS1hY3Rpb249XCJjb2xsYXBzZVwiXScpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxpLmNoaWxkcmVuKCdbZGF0YS1hY3Rpb249XCJleHBhbmRcIl0nKS5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgdW5zZXRQYXJlbnQ6IGZ1bmN0aW9uKGxpKVxuICAgICAgICB7XG4gICAgICAgICAgICBsaS5yZW1vdmVDbGFzcyh0aGlzLm9wdGlvbnMuY29sbGFwc2VkQ2xhc3MpO1xuICAgICAgICAgICAgbGkuY2hpbGRyZW4oJ1tkYXRhLWFjdGlvbl0nKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIGxpLmNoaWxkcmVuKHRoaXMub3B0aW9ucy5saXN0Tm9kZU5hbWUpLnJlbW92ZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRyYWdTdGFydDogZnVuY3Rpb24oZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIG1vdXNlICAgID0gdGhpcy5tb3VzZSxcbiAgICAgICAgICAgICAgICB0YXJnZXQgICA9ICQoZS50YXJnZXQpLFxuICAgICAgICAgICAgICAgIGRyYWdJdGVtID0gdGFyZ2V0LmNsb3Nlc3QodGhpcy5vcHRpb25zLml0ZW1Ob2RlTmFtZSk7XG5cbiAgICAgICAgICAgIHRoaXMucGxhY2VFbC5jc3MoJ2hlaWdodCcsIGRyYWdJdGVtLmhlaWdodCgpKTtcblxuICAgICAgICAgICAgbW91c2Uub2Zmc2V0WCA9IGUub2Zmc2V0WCAhPT0gdW5kZWZpbmVkID8gZS5vZmZzZXRYIDogZS5wYWdlWCAtIHRhcmdldC5vZmZzZXQoKS5sZWZ0O1xuICAgICAgICAgICAgbW91c2Uub2Zmc2V0WSA9IGUub2Zmc2V0WSAhPT0gdW5kZWZpbmVkID8gZS5vZmZzZXRZIDogZS5wYWdlWSAtIHRhcmdldC5vZmZzZXQoKS50b3A7XG4gICAgICAgICAgICBtb3VzZS5zdGFydFggPSBtb3VzZS5sYXN0WCA9IGUucGFnZVg7XG4gICAgICAgICAgICBtb3VzZS5zdGFydFkgPSBtb3VzZS5sYXN0WSA9IGUucGFnZVk7XG5cbiAgICAgICAgICAgIHRoaXMuZHJhZ1Jvb3RFbCA9IHRoaXMuZWw7XG5cbiAgICAgICAgICAgIHRoaXMuZHJhZ0VsID0gJChkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMub3B0aW9ucy5saXN0Tm9kZU5hbWUpKS5hZGRDbGFzcyh0aGlzLm9wdGlvbnMubGlzdENsYXNzICsgJyAnICsgdGhpcy5vcHRpb25zLmRyYWdDbGFzcyk7XG4gICAgICAgICAgICB0aGlzLmRyYWdFbC5jc3MoJ3dpZHRoJywgZHJhZ0l0ZW0ud2lkdGgoKSk7XG5cbiAgICAgICAgICAgIGRyYWdJdGVtLmFmdGVyKHRoaXMucGxhY2VFbCk7XG4gICAgICAgICAgICBkcmFnSXRlbVswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRyYWdJdGVtWzBdKTtcbiAgICAgICAgICAgIGRyYWdJdGVtLmFwcGVuZFRvKHRoaXMuZHJhZ0VsKTtcblxuICAgICAgICAgICAgJChkb2N1bWVudC5ib2R5KS5hcHBlbmQodGhpcy5kcmFnRWwpO1xuICAgICAgICAgICAgdGhpcy5kcmFnRWwuY3NzKHtcbiAgICAgICAgICAgICAgICAnbGVmdCcgOiBlLnBhZ2VYIC0gbW91c2Uub2Zmc2V0WCxcbiAgICAgICAgICAgICAgICAndG9wJyAgOiBlLnBhZ2VZIC0gbW91c2Uub2Zmc2V0WVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyB0b3RhbCBkZXB0aCBvZiBkcmFnZ2luZyBpdGVtXG4gICAgICAgICAgICB2YXIgaSwgZGVwdGgsXG4gICAgICAgICAgICAgICAgaXRlbXMgPSB0aGlzLmRyYWdFbC5maW5kKHRoaXMub3B0aW9ucy5pdGVtTm9kZU5hbWUpO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZGVwdGggPSAkKGl0ZW1zW2ldKS5wYXJlbnRzKHRoaXMub3B0aW9ucy5saXN0Tm9kZU5hbWUpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBpZiAoZGVwdGggPiB0aGlzLmRyYWdEZXB0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdEZXB0aCA9IGRlcHRoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBkcmFnU3RvcDogZnVuY3Rpb24oZSlcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGVsID0gdGhpcy5kcmFnRWwuY2hpbGRyZW4odGhpcy5vcHRpb25zLml0ZW1Ob2RlTmFtZSkuZmlyc3QoKTtcbiAgICAgICAgICAgIGVsWzBdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxbMF0pO1xuICAgICAgICAgICAgdGhpcy5wbGFjZUVsLnJlcGxhY2VXaXRoKGVsKTtcblxuICAgICAgICAgICAgdGhpcy5kcmFnRWwucmVtb3ZlKCk7XG4gICAgICAgICAgICB0aGlzLmVsLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaGFzTmV3Um9vdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1Jvb3RFbC50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuZHJhZ1N0b3AgPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuZHJhZ1N0b3AoZWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0sXG5cbiAgICAgICAgZHJhZ01vdmU6IGZ1bmN0aW9uKGUpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBsaXN0LCBwYXJlbnQsIHByZXYsIG5leHQsIGRlcHRoLFxuICAgICAgICAgICAgICAgIG9wdCAgID0gdGhpcy5vcHRpb25zLFxuICAgICAgICAgICAgICAgIG1vdXNlID0gdGhpcy5tb3VzZTtcblxuICAgICAgICAgICAgdGhpcy5kcmFnRWwuY3NzKHtcbiAgICAgICAgICAgICAgICAnbGVmdCcgOiBlLnBhZ2VYIC0gbW91c2Uub2Zmc2V0WCxcbiAgICAgICAgICAgICAgICAndG9wJyAgOiBlLnBhZ2VZIC0gbW91c2Uub2Zmc2V0WVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIG1vdXNlIHBvc2l0aW9uIGxhc3QgZXZlbnRzXG4gICAgICAgICAgICBtb3VzZS5sYXN0WCA9IG1vdXNlLm5vd1g7XG4gICAgICAgICAgICBtb3VzZS5sYXN0WSA9IG1vdXNlLm5vd1k7XG4gICAgICAgICAgICAvLyBtb3VzZSBwb3NpdGlvbiB0aGlzIGV2ZW50c1xuICAgICAgICAgICAgbW91c2Uubm93WCAgPSBlLnBhZ2VYO1xuICAgICAgICAgICAgbW91c2Uubm93WSAgPSBlLnBhZ2VZO1xuICAgICAgICAgICAgLy8gZGlzdGFuY2UgbW91c2UgbW92ZWQgYmV0d2VlbiBldmVudHNcbiAgICAgICAgICAgIG1vdXNlLmRpc3RYID0gbW91c2Uubm93WCAtIG1vdXNlLmxhc3RYO1xuICAgICAgICAgICAgbW91c2UuZGlzdFkgPSBtb3VzZS5ub3dZIC0gbW91c2UubGFzdFk7XG4gICAgICAgICAgICAvLyBkaXJlY3Rpb24gbW91c2Ugd2FzIG1vdmluZ1xuICAgICAgICAgICAgbW91c2UubGFzdERpclggPSBtb3VzZS5kaXJYO1xuICAgICAgICAgICAgbW91c2UubGFzdERpclkgPSBtb3VzZS5kaXJZO1xuICAgICAgICAgICAgLy8gZGlyZWN0aW9uIG1vdXNlIGlzIG5vdyBtb3ZpbmcgKG9uIGJvdGggYXhpcylcbiAgICAgICAgICAgIG1vdXNlLmRpclggPSBtb3VzZS5kaXN0WCA9PT0gMCA/IDAgOiBtb3VzZS5kaXN0WCA+IDAgPyAxIDogLTE7XG4gICAgICAgICAgICBtb3VzZS5kaXJZID0gbW91c2UuZGlzdFkgPT09IDAgPyAwIDogbW91c2UuZGlzdFkgPiAwID8gMSA6IC0xO1xuICAgICAgICAgICAgLy8gYXhpcyBtb3VzZSBpcyBub3cgbW92aW5nIG9uXG4gICAgICAgICAgICB2YXIgbmV3QXggICA9IE1hdGguYWJzKG1vdXNlLmRpc3RYKSA+IE1hdGguYWJzKG1vdXNlLmRpc3RZKSA/IDEgOiAwO1xuXG4gICAgICAgICAgICAvLyBkbyBub3RoaW5nIG9uIGZpcnN0IG1vdmVcbiAgICAgICAgICAgIGlmICghbW91c2UubW92aW5nKSB7XG4gICAgICAgICAgICAgICAgbW91c2UuZGlyQXggID0gbmV3QXg7XG4gICAgICAgICAgICAgICAgbW91c2UubW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNhbGMgZGlzdGFuY2UgbW92ZWQgb24gdGhpcyBheGlzIChhbmQgZGlyZWN0aW9uKVxuICAgICAgICAgICAgaWYgKG1vdXNlLmRpckF4ICE9PSBuZXdBeCkge1xuICAgICAgICAgICAgICAgIG1vdXNlLmRpc3RBeFggPSAwO1xuICAgICAgICAgICAgICAgIG1vdXNlLmRpc3RBeFkgPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtb3VzZS5kaXN0QXhYICs9IE1hdGguYWJzKG1vdXNlLmRpc3RYKTtcbiAgICAgICAgICAgICAgICBpZiAobW91c2UuZGlyWCAhPT0gMCAmJiBtb3VzZS5kaXJYICE9PSBtb3VzZS5sYXN0RGlyWCkge1xuICAgICAgICAgICAgICAgICAgICBtb3VzZS5kaXN0QXhYID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbW91c2UuZGlzdEF4WSArPSBNYXRoLmFicyhtb3VzZS5kaXN0WSk7XG4gICAgICAgICAgICAgICAgaWYgKG1vdXNlLmRpclkgIT09IDAgJiYgbW91c2UuZGlyWSAhPT0gbW91c2UubGFzdERpclkpIHtcbiAgICAgICAgICAgICAgICAgICAgbW91c2UuZGlzdEF4WSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbW91c2UuZGlyQXggPSBuZXdBeDtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBtb3ZlIGhvcml6b250YWxcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKG1vdXNlLmRpckF4ICYmIG1vdXNlLmRpc3RBeFggPj0gb3B0LnRocmVzaG9sZCkge1xuICAgICAgICAgICAgICAgIC8vIHJlc2V0IG1vdmUgZGlzdGFuY2Ugb24geC1heGlzIGZvciBuZXcgcGhhc2VcbiAgICAgICAgICAgICAgICBtb3VzZS5kaXN0QXhYID0gMDtcbiAgICAgICAgICAgICAgICBwcmV2ID0gdGhpcy5wbGFjZUVsLnByZXYob3B0Lml0ZW1Ob2RlTmFtZSk7XG4gICAgICAgICAgICAgICAgLy8gaW5jcmVhc2UgaG9yaXpvbnRhbCBsZXZlbCBpZiBwcmV2aW91cyBzaWJsaW5nIGV4aXN0cyBhbmQgaXMgbm90IGNvbGxhcHNlZFxuICAgICAgICAgICAgICAgIGlmIChtb3VzZS5kaXN0WCA+IDAgJiYgcHJldi5sZW5ndGggJiYgIXByZXYuaGFzQ2xhc3Mob3B0LmNvbGxhcHNlZENsYXNzKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjYW5ub3QgaW5jcmVhc2UgbGV2ZWwgd2hlbiBpdGVtIGFib3ZlIGlzIGNvbGxhcHNlZFxuICAgICAgICAgICAgICAgICAgICBsaXN0ID0gcHJldi5maW5kKG9wdC5saXN0Tm9kZU5hbWUpLmxhc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2hlY2sgaWYgZGVwdGggbGltaXQgaGFzIHJlYWNoZWRcbiAgICAgICAgICAgICAgICAgICAgZGVwdGggPSB0aGlzLnBsYWNlRWwucGFyZW50cyhvcHQubGlzdE5vZGVOYW1lKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXB0aCArIHRoaXMuZHJhZ0RlcHRoIDw9IG9wdC5tYXhEZXB0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY3JlYXRlIG5ldyBzdWItbGV2ZWwgaWYgb25lIGRvZXNuJ3QgZXhpc3RcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0ID0gJCgnPCcgKyBvcHQubGlzdE5vZGVOYW1lICsgJy8+JykuYWRkQ2xhc3Mob3B0Lmxpc3RDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5hcHBlbmQodGhpcy5wbGFjZUVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2LmFwcGVuZChsaXN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFBhcmVudChwcmV2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZWxzZSBhcHBlbmQgdG8gbmV4dCBsZXZlbCB1cFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QgPSBwcmV2LmNoaWxkcmVuKG9wdC5saXN0Tm9kZU5hbWUpLmxhc3QoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0LmFwcGVuZCh0aGlzLnBsYWNlRWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGRlY3JlYXNlIGhvcml6b250YWwgbGV2ZWxcbiAgICAgICAgICAgICAgICBpZiAobW91c2UuZGlzdFggPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdlIGNhbid0IGRlY3JlYXNlIGEgbGV2ZWwgaWYgYW4gaXRlbSBwcmVjZWVkcyB0aGUgY3VycmVudCBvbmVcbiAgICAgICAgICAgICAgICAgICAgbmV4dCA9IHRoaXMucGxhY2VFbC5uZXh0KG9wdC5pdGVtTm9kZU5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW5leHQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSB0aGlzLnBsYWNlRWwucGFyZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYWNlRWwuY2xvc2VzdChvcHQuaXRlbU5vZGVOYW1lKS5hZnRlcih0aGlzLnBsYWNlRWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwYXJlbnQuY2hpbGRyZW4oKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVuc2V0UGFyZW50KHBhcmVudC5wYXJlbnQoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpc0VtcHR5ID0gZmFsc2U7XG5cbiAgICAgICAgICAgIC8vIGZpbmQgbGlzdCBpdGVtIHVuZGVyIGN1cnNvclxuICAgICAgICAgICAgaWYgKCFoYXNQb2ludGVyRXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnRWxbMF0uc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wb2ludEVsID0gJChkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KGUucGFnZVggLSBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQsIGUucGFnZVkgLSAod2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3ApKSk7XG4gICAgICAgICAgICBpZiAoIWhhc1BvaW50ZXJFdmVudHMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdFbFswXS5zdHlsZS52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucG9pbnRFbC5oYXNDbGFzcyhvcHQuaGFuZGxlQ2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wb2ludEVsID0gdGhpcy5wb2ludEVsLnBhcmVudChvcHQuaXRlbU5vZGVOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnBvaW50RWwuaGFzQ2xhc3Mob3B0LmVtcHR5Q2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgaXNFbXB0eSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICghdGhpcy5wb2ludEVsLmxlbmd0aCB8fCAhdGhpcy5wb2ludEVsLmhhc0NsYXNzKG9wdC5pdGVtQ2xhc3MpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBmaW5kIHBhcmVudCBsaXN0IG9mIGl0ZW0gdW5kZXIgY3Vyc29yXG4gICAgICAgICAgICB2YXIgcG9pbnRFbFJvb3QgPSB0aGlzLnBvaW50RWwuY2xvc2VzdCgnLicgKyBvcHQucm9vdENsYXNzKSxcbiAgICAgICAgICAgICAgICBpc05ld1Jvb3QgICA9IHRoaXMuZHJhZ1Jvb3RFbC5kYXRhKCduZXN0YWJsZS1pZCcpICE9PSBwb2ludEVsUm9vdC5kYXRhKCduZXN0YWJsZS1pZCcpO1xuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIG1vdmUgdmVydGljYWxcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKCFtb3VzZS5kaXJBeCB8fCBpc05ld1Jvb3QgfHwgaXNFbXB0eSkge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIGdyb3VwcyBtYXRjaCBpZiBkcmFnZ2luZyBvdmVyIG5ldyByb290XG4gICAgICAgICAgICAgICAgaWYgKGlzTmV3Um9vdCAmJiBvcHQuZ3JvdXAgIT09IHBvaW50RWxSb290LmRhdGEoJ25lc3RhYmxlLWdyb3VwJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBjaGVjayBkZXB0aCBsaW1pdFxuICAgICAgICAgICAgICAgIGRlcHRoID0gdGhpcy5kcmFnRGVwdGggLSAxICsgdGhpcy5wb2ludEVsLnBhcmVudHMob3B0Lmxpc3ROb2RlTmFtZSkubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGlmIChkZXB0aCA+IG9wdC5tYXhEZXB0aCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBiZWZvcmUgPSBlLnBhZ2VZIDwgKHRoaXMucG9pbnRFbC5vZmZzZXQoKS50b3AgKyB0aGlzLnBvaW50RWwuaGVpZ2h0KCkgLyAyKTtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gdGhpcy5wbGFjZUVsLnBhcmVudCgpO1xuICAgICAgICAgICAgICAgIC8vIGlmIGVtcHR5IGNyZWF0ZSBuZXcgbGlzdCB0byByZXBsYWNlIGVtcHR5IHBsYWNlaG9sZGVyXG4gICAgICAgICAgICAgICAgaWYgKGlzRW1wdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdCA9ICQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChvcHQubGlzdE5vZGVOYW1lKSkuYWRkQ2xhc3Mob3B0Lmxpc3RDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgIGxpc3QuYXBwZW5kKHRoaXMucGxhY2VFbCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9pbnRFbC5yZXBsYWNlV2l0aChsaXN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYmVmb3JlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9pbnRFbC5iZWZvcmUodGhpcy5wbGFjZUVsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9pbnRFbC5hZnRlcih0aGlzLnBsYWNlRWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXBhcmVudC5jaGlsZHJlbigpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVuc2V0UGFyZW50KHBhcmVudC5wYXJlbnQoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5kcmFnUm9vdEVsLmZpbmQob3B0Lml0ZW1Ob2RlTmFtZSkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhZ1Jvb3RFbC5hcHBlbmQoJzxkaXYgY2xhc3M9XCInICsgb3B0LmVtcHR5Q2xhc3MgKyAnXCIvPicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBwYXJlbnQgcm9vdCBsaXN0IGhhcyBjaGFuZ2VkXG4gICAgICAgICAgICAgICAgaWYgKGlzTmV3Um9vdCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdSb290RWwgPSBwb2ludEVsUm9vdDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXNOZXdSb290ID0gdGhpcy5lbFswXSAhPT0gdGhpcy5kcmFnUm9vdEVsWzBdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgICQuZm4ubmVzdGFibGUgPSBmdW5jdGlvbihwYXJhbXMpXG4gICAge1xuICAgICAgICB2YXIgbGlzdHMgID0gdGhpcyxcbiAgICAgICAgICAgIHJldHZhbCA9IHRoaXM7XG5cbiAgICAgICAgbGlzdHMuZWFjaChmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBwbHVnaW4gPSAkKHRoaXMpLmRhdGEoXCJuZXN0YWJsZVwiKTtcblxuICAgICAgICAgICAgaWYgKCFwbHVnaW4pIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmRhdGEoXCJuZXN0YWJsZVwiLCBuZXcgUGx1Z2luKHRoaXMsIHBhcmFtcykpO1xuICAgICAgICAgICAgICAgICQodGhpcykuZGF0YShcIm5lc3RhYmxlLWlkXCIsIG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwYXJhbXMgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBwbHVnaW5bcGFyYW1zXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICByZXR2YWwgPSBwbHVnaW5bcGFyYW1zXSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJldHZhbCB8fCBsaXN0cztcbiAgICB9O1xuXG59KSh3aW5kb3cualF1ZXJ5IHx8IHdpbmRvdy5aZXB0bywgd2luZG93LCBkb2N1bWVudCk7XG4iXX0=

"use strict";

Array.prototype.max = function () {
  return Math.max.apply(null, this);
};
Array.prototype.min = function () {
  return Math.min.apply(null, this);
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb3RvdHlwZS5qcyJdLCJuYW1lcyI6WyJBcnJheSIsInByb3RvdHlwZSIsIm1heCIsIk1hdGgiLCJhcHBseSIsIm1pbiJdLCJtYXBwaW5ncyI6Ijs7QUFBQUEsTUFBTUMsU0FBTixDQUFnQkMsR0FBaEIsR0FBc0IsWUFBVztBQUFFLFNBQU9DLEtBQUtELEdBQUwsQ0FBU0UsS0FBVCxDQUFlLElBQWYsRUFBcUIsSUFBckIsQ0FBUDtBQUFvQyxDQUF2RTtBQUNBSixNQUFNQyxTQUFOLENBQWdCSSxHQUFoQixHQUFzQixZQUFXO0FBQUUsU0FBT0YsS0FBS0UsR0FBTCxDQUFTRCxLQUFULENBQWUsSUFBZixFQUFxQixJQUFyQixDQUFQO0FBQW9DLENBQXZFIiwiZmlsZSI6InByb3RvdHlwZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIkFycmF5LnByb3RvdHlwZS5tYXggPSBmdW5jdGlvbigpIHsgcmV0dXJuIE1hdGgubWF4LmFwcGx5KG51bGwsIHRoaXMpOyB9O1xuQXJyYXkucHJvdG90eXBlLm1pbiA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gTWF0aC5taW4uYXBwbHkobnVsbCwgdGhpcyk7IH07XG4iXX0=

'use strict';

var _redactor = {
    inited: [],

    imperavi: function imperavi(id) {
        // $R.options = {
        //     buttonsTextLabeled: true
        // };

        $R('.redactor_imperavi', getSettings.imperavi({
            styles: true
        }));
    },

    // imperavi: function(id)
    // {
    //     const element = $(['#', id].join(''))[0];

    //     $(element).redactor(getSettings.imperavi({
    //         mode: 'htmlmixed'
    //     }));
    // },

    quill: function quill(id) {
        // var BackgroundClass = Quill.import('attributors/class/background');
        // var ColorClass = Quill.import('attributors/class/color');
        // var SizeStyle = Quill.import('attributors/style/size');
        // Quill.register(BackgroundClass, true);
        // Quill.register(ColorClass, true);
        // Quill.register(SizeStyle, true);

        var element = $('#' + id + '-container').get(0);

        var editor = new Quill(element, getSettings.quill());

        editor.on('text-change', function () {
            $('#' + id).val(editor.root.innerHTML);
        });
    },

    tinymce: function (_tinymce) {
        function tinymce(_x) {
            return _tinymce.apply(this, arguments);
        }

        tinymce.toString = function () {
            return _tinymce.toString();
        };

        return tinymce;
    }(function (id) {
        tinymce.init(getSettings.tinymce({
            selector: ['#', id].join('')
        }));
    }),

    cleditor: function cleditor(id) {
        $(['#', id].join('')).cleditor();
    },

    froala: function froala(id) {
        $(['#', id].join('')).froalaEditor(getSettings.tinymce({
            heightMin: 200
        }));
    },

    summernote: function summernote(id) {
        $(['#', id].join('')).summernote({
            height: 200,
            tabsize: 2,
            toolbar: true,
            codemirror: {
                theme: 'monokai'
            }
        });
    },

    ckeditor5: function ckeditor5(id) {
        ClassicEditor.create(document.querySelector(['#', id].join('')), {
            // language: 'ru',
            toolbar: ['heading', '|', 'bold', 'italic', 'link', '|', 'bulletedList', 'numberedList', 'blockQuote'],
            alignment: {
                toolbar: ['alignment:left', 'alignment:right', 'alignment:center', 'alignment:justify'],
                options: ['left', 'right', 'center', 'justify']
            },
            fontSize: {
                options: ['tiny', 'small', 'default', 'big', 'huge']
                // options: [ 9, 10, 11, 12, 13, 14, 15 ]
            },
            highlight: {
                options: [{
                    model: 'yellowMarker',
                    class: 'marker-yellow',
                    title: 'Yellow marker',
                    color: 'var(--ck-highlight-marker-yellow)',
                    type: 'marker'
                }, {
                    model: 'greenMarker',
                    class: 'marker-green',
                    title: 'Green marker',
                    color: 'var(--ck-highlight-marker-green)',
                    type: 'marker'
                }, {
                    model: 'pinkMarker',
                    class: 'marker-pink',
                    title: 'Pink marker',
                    color: 'var(--ck-highlight-marker-pink)',
                    type: 'marker'
                }, {
                    model: 'blueMarker',
                    class: 'marker-blue',
                    title: 'Blue marker',
                    color: 'var(--ck-highlight-marker-blue)',
                    type: 'marker'
                }, {
                    model: 'redPen',
                    class: 'pen-red',
                    title: 'Red pen',
                    color: 'var(--ck-highlight-pen-red)',
                    type: 'pen'
                }, {
                    model: 'greenPen',
                    class: 'pen-green',
                    title: 'Green pen',
                    color: 'var(--ck-highlight-pen-green)',
                    type: 'pen'
                }]
            },
            image: {
                toolbar: ['imageStyle:full', 'imageStyle:side', '|', 'imageTextAlternative'],
                styles: [{ name: 'left', icon: 'left' }, { name: 'center', icon: 'center' }, { name: 'right', icon: 'right' }, { name: 'fullSize', title: 'Full size', icon: 'right', isDefault: true }, { name: 'side', icon: 'left', title: 'My side style', class: 'custom-side-image' }]
            },
            ckfinder: {
                uploadUrl: '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json'
            }
        }).catch(function (error) {
            console.log(error);
        });
    },

    ckeditor: function ckeditor(id) {
        CKEDITOR.config.width = 'auto';
        CKEDITOR.config.height = 600;
        CKEDITOR.disableAutoInline = true;

        // CKEDITOR.replace(id, {
        //     toolbar: [
        //         { name: 'document', items: [ 'Print' ] },
        //         { name: 'clipboard', items: [ 'Undo', 'Redo' ] },
        //         { name: 'styles', items: [ 'Format', 'Font', 'FontSize' ] },
        //         { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat', 'CopyFormatting' ] },
        //         { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
        //         { name: 'align', items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
        //         { name: 'links', items: [ 'Link', 'Unlink' ] },
        //         { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote' ] },
        //         { name: 'insert', items: [ 'Image', 'Table' ] },
        //         { name: 'tools', items: [ 'Maximize' ] },
        //         { name: 'editing', items: [ 'Scayt' ] }
        //     ],
        //     customConfig: '',
        //     disallowedContent: 'img{width,height,float}',
        //     extraAllowedContent: 'img[width,height,align]',
        //     // extraPlugins: 'tableresize,uploadimage,uploadfile',
        //     extraPlugins: 'tableresize',
        //     height: 800,
        //     contentsCss: [ 'https://cdn.ckeditor.com/4.6.1/full-all/contents.css' ],
        //     bodyClass: 'document-editor',
        //     format_tags: 'p;h1;h2;h3;pre',
        //     removeDialogTabs: 'image:advanced;link:advanced',
        //     stylesSet: [
        //         /* Inline Styles */
        //         { name: 'Marker', element: 'span', attributes: { 'class': 'marker' } },
        //         { name: 'Cited Work', element: 'cite' },
        //         { name: 'Inline Quotation', element: 'q' },
        //         /* Object Styles */
        //         {
        //             name: 'Special Container',
        //             element: 'div',
        //             styles: {
        //                 padding: '5px 10px',
        //                 background: '#eee',
        //                 border: '1px solid #ccc'
        //             }
        //         },
        //         {
        //             name: 'Compact table',
        //             element: 'table',
        //             attributes: {
        //                 cellpadding: '5',
        //                 cellspacing: '0',
        //                 border: '1',
        //                 bordercolor: '#ccc'
        //             },
        //             styles: {
        //                 'border-collapse': 'collapse'
        //             }
        //         },
        //         { name: 'Borderless Table', element: 'table', styles: { 'border-style': 'hidden', 'background-color': '#E6E6FA' } },
        //         { name: 'Square Bulleted List', element: 'ul', styles: { 'list-style-type': 'square' } }
        //     ]
        // } );

        CKEDITOR.replace(id, {
            customConfig: '/static/apps/wysiwyg/ckeditor/config.js'
        });
    },

    wysiwyg: function wysiwyg(id) {
        $(['#', id].join('')).wysiwyg({
            toolbar: 'top', // 'selection'|'top'|'top-selection'|'bottom'|'bottom-selection'
            hotKeys: {
                'ctrl+b meta+b': 'bold',
                'ctrl+i meta+i': 'italic',
                'ctrl+u meta+u': 'underline',
                'ctrl+z meta+z': 'undo',
                'ctrl+y meta+y meta+shift+z': 'redo'
            }
        });
    },

    init: function init(id, type) {
        if (typeof this[type] !== 'undefined') {
            if (this.inited.indexOf(id) < 0) {
                this.inited.push(id);
                this[type](id);
            }
        }
    }
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlZGFjdG9yLmpzIl0sIm5hbWVzIjpbIl9yZWRhY3RvciIsImluaXRlZCIsImltcGVyYXZpIiwiaWQiLCIkUiIsImdldFNldHRpbmdzIiwic3R5bGVzIiwicXVpbGwiLCJlbGVtZW50IiwiJCIsImdldCIsImVkaXRvciIsIlF1aWxsIiwib24iLCJ2YWwiLCJyb290IiwiaW5uZXJIVE1MIiwidGlueW1jZSIsImluaXQiLCJzZWxlY3RvciIsImpvaW4iLCJjbGVkaXRvciIsImZyb2FsYSIsImZyb2FsYUVkaXRvciIsImhlaWdodE1pbiIsInN1bW1lcm5vdGUiLCJoZWlnaHQiLCJ0YWJzaXplIiwidG9vbGJhciIsImNvZGVtaXJyb3IiLCJ0aGVtZSIsImNrZWRpdG9yNSIsIkNsYXNzaWNFZGl0b3IiLCJjcmVhdGUiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJhbGlnbm1lbnQiLCJvcHRpb25zIiwiZm9udFNpemUiLCJoaWdobGlnaHQiLCJtb2RlbCIsImNsYXNzIiwidGl0bGUiLCJjb2xvciIsInR5cGUiLCJpbWFnZSIsIm5hbWUiLCJpY29uIiwiaXNEZWZhdWx0IiwiY2tmaW5kZXIiLCJ1cGxvYWRVcmwiLCJjYXRjaCIsImNvbnNvbGUiLCJsb2ciLCJlcnJvciIsImNrZWRpdG9yIiwiQ0tFRElUT1IiLCJjb25maWciLCJ3aWR0aCIsImRpc2FibGVBdXRvSW5saW5lIiwicmVwbGFjZSIsImN1c3RvbUNvbmZpZyIsInd5c2l3eWciLCJob3RLZXlzIiwiaW5kZXhPZiIsInB1c2giXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsWUFBWTtBQUNkQyxZQUFRLEVBRE07O0FBR2RDLGNBQVUsa0JBQVNDLEVBQVQsRUFDVjtBQUNJO0FBQ0E7QUFDQTs7QUFFQUMsV0FBRyxvQkFBSCxFQUF5QkMsWUFBWUgsUUFBWixDQUFxQjtBQUMxQ0ksb0JBQVE7QUFEa0MsU0FBckIsQ0FBekI7QUFHSCxLQVphOztBQWNkO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFD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TUFBTCxDQUFZZ0UsSUFBWixDQUFpQjlELEVBQWpCO0FBQ0EscUJBQUt5QyxJQUFMLEVBQVd6QyxFQUFYO0FBQ0g7QUFDVjtBQUNEO0FBdlBnQixDQUFsQiIsImZpbGUiOiJyZWRhY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IF9yZWRhY3RvciA9IHtcbiAgICBpbml0ZWQ6IFtdLFxuXG4gICAgaW1wZXJhdmk6IGZ1bmN0aW9uKGlkKVxuICAgIHtcbiAgICAgICAgLy8gJFIub3B0aW9ucyA9IHtcbiAgICAgICAgLy8gICAgIGJ1dHRvbnNUZXh0TGFiZWxlZDogdHJ1ZVxuICAgICAgICAvLyB9O1xuXG4gICAgICAgICRSKCcucmVkYWN0b3JfaW1wZXJhdmknLCBnZXRTZXR0aW5ncy5pbXBlcmF2aSh7XG4gICAgICAgICAgICBzdHlsZXM6IHRydWVcbiAgICAgICAgfSkpO1xuICAgIH0sXG5cbiAgICAvLyBpbXBlcmF2aTogZnVuY3Rpb24oaWQpXG4gICAgLy8ge1xuICAgIC8vICAgICBjb25zdCBlbGVtZW50ID0gJChbJyMnLCBpZF0uam9pbignJykpWzBdO1xuXG4gICAgLy8gICAgICQoZWxlbWVudCkucmVkYWN0b3IoZ2V0U2V0dGluZ3MuaW1wZXJhdmkoe1xuICAgIC8vICAgICAgICAgbW9kZTogJ2h0bWxtaXhlZCdcbiAgICAvLyAgICAgfSkpO1xuICAgIC8vIH0sXG5cbiAgICBxdWlsbDogZnVuY3Rpb24oaWQpXG4gICAge1xuICAgICAgICAvLyB2YXIgQmFja2dyb3VuZENsYXNzID0gUXVpbGwuaW1wb3J0KCdhdHRyaWJ1dG9ycy9jbGFzcy9iYWNrZ3JvdW5kJyk7XG4gICAgICAgIC8vIHZhciBDb2xvckNsYXNzID0gUXVpbGwuaW1wb3J0KCdhdHRyaWJ1dG9ycy9jbGFzcy9jb2xvcicpO1xuICAgICAgICAvLyB2YXIgU2l6ZVN0eWxlID0gUXVpbGwuaW1wb3J0KCdhdHRyaWJ1dG9ycy9zdHlsZS9zaXplJyk7XG4gICAgICAgIC8vIFF1aWxsLnJlZ2lzdGVyKEJhY2tncm91bmRDbGFzcywgdHJ1ZSk7XG4gICAgICAgIC8vIFF1aWxsLnJlZ2lzdGVyKENvbG9yQ2xhc3MsIHRydWUpO1xuICAgICAgICAvLyBRdWlsbC5yZWdpc3RlcihTaXplU3R5bGUsIHRydWUpO1xuXG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSAkKGAjJHtpZH0tY29udGFpbmVyYCkuZ2V0KDApO1xuXG4gICAgICAgIGNvbnN0IGVkaXRvciA9IG5ldyBRdWlsbChlbGVtZW50LCBnZXRTZXR0aW5ncy5xdWlsbCgpKTtcblxuICAgICAgICBlZGl0b3Iub24oJ3RleHQtY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKGAjJHtpZH1gKS52YWwoZWRpdG9yLnJvb3QuaW5uZXJIVE1MKTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHRpbnltY2U6IGZ1bmN0aW9uKGlkKVxuICAgIHtcbiAgICAgICAgdGlueW1jZS5pbml0KGdldFNldHRpbmdzLnRpbnltY2Uoe1xuICAgICAgICAgICAgc2VsZWN0b3I6IFsnIycsIGlkXS5qb2luKCcnKVxuICAgICAgICB9KSk7XG4gICAgfSxcblxuICAgIGNsZWRpdG9yOiBmdW5jdGlvbihpZClcbiAgICB7XG4gICAgICAgICQoWycjJywgaWRdLmpvaW4oJycpKS5jbGVkaXRvcigpO1xuICAgIH0sXG5cbiAgICBmcm9hbGE6IGZ1bmN0aW9uKGlkKVxuICAgIHtcbiAgICAgICAgJChbJyMnLCBpZF0uam9pbignJykpLmZyb2FsYUVkaXRvcihnZXRTZXR0aW5ncy50aW55bWNlKHtcbiAgICAgICAgICAgIGhlaWdodE1pbjogMjAwXG4gICAgICAgIH0pKTtcbiAgICB9LFxuXG4gICAgc3VtbWVybm90ZTogZnVuY3Rpb24oaWQpXG4gICAge1xuICAgICAgICAkKFsnIycsIGlkXS5qb2luKCcnKSkuc3VtbWVybm90ZSh7XG4gICAgICAgICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgICAgICAgIHRhYnNpemU6IDIsXG4gICAgICAgICAgICB0b29sYmFyOiB0cnVlLFxuICAgICAgICAgICAgY29kZW1pcnJvcjoge1xuICAgICAgICAgICAgICAgIHRoZW1lOiAnbW9ub2thaSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGNrZWRpdG9yNTogZnVuY3Rpb24oaWQpXG4gICAge1xuICAgICAgICBDbGFzc2ljRWRpdG9yLmNyZWF0ZShkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFsnIycsIGlkXS5qb2luKCcnKSksIHtcbiAgICAgICAgICAgIC8vIGxhbmd1YWdlOiAncnUnLFxuICAgICAgICAgICAgdG9vbGJhcjogWyAnaGVhZGluZycsICd8JywgJ2JvbGQnLCAnaXRhbGljJywgJ2xpbmsnLCAnfCcsICdidWxsZXRlZExpc3QnLCAnbnVtYmVyZWRMaXN0JywgJ2Jsb2NrUXVvdGUnIF0sXG4gICAgICAgICAgICBhbGlnbm1lbnQ6IHtcbiAgICAgICAgICAgICAgICB0b29sYmFyOiBbICdhbGlnbm1lbnQ6bGVmdCcsICdhbGlnbm1lbnQ6cmlnaHQnLCAnYWxpZ25tZW50OmNlbnRlcicsICdhbGlnbm1lbnQ6anVzdGlmeScgXSxcbiAgICAgICAgICAgICAgICBvcHRpb25zOiBbICdsZWZ0JywgJ3JpZ2h0JywgJ2NlbnRlcicsICdqdXN0aWZ5JyBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZm9udFNpemU6IHtcbiAgICAgICAgICAgICAgICBvcHRpb25zOiBbXG4gICAgICAgICAgICAgICAgICAgICd0aW55JyxcbiAgICAgICAgICAgICAgICAgICAgJ3NtYWxsJyxcbiAgICAgICAgICAgICAgICAgICAgJ2RlZmF1bHQnLFxuICAgICAgICAgICAgICAgICAgICAnYmlnJyxcbiAgICAgICAgICAgICAgICAgICAgJ2h1Z2UnXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIC8vIG9wdGlvbnM6IFsgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGlnaGxpZ2h0OiB7XG4gICAgICAgICAgICAgICAgb3B0aW9uczogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbDogJ3llbGxvd01hcmtlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ21hcmtlci15ZWxsb3cnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdZZWxsb3cgbWFya2VyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAndmFyKC0tY2staGlnaGxpZ2h0LW1hcmtlci15ZWxsb3cpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtYXJrZXInXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsOiAnZ3JlZW5NYXJrZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdtYXJrZXItZ3JlZW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdHcmVlbiBtYXJrZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICd2YXIoLS1jay1oaWdobGlnaHQtbWFya2VyLWdyZWVuKScsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbWFya2VyJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbDogJ3BpbmtNYXJrZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdtYXJrZXItcGluaycsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1BpbmsgbWFya2VyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAndmFyKC0tY2staGlnaGxpZ2h0LW1hcmtlci1waW5rKScsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbWFya2VyJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbDogJ2JsdWVNYXJrZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdtYXJrZXItYmx1ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0JsdWUgbWFya2VyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAndmFyKC0tY2staGlnaGxpZ2h0LW1hcmtlci1ibHVlKScsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbWFya2VyJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbDogJ3JlZFBlbicsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ3Blbi1yZWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdSZWQgcGVuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAndmFyKC0tY2staGlnaGxpZ2h0LXBlbi1yZWQpJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwZW4nXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsOiAnZ3JlZW5QZW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdwZW4tZ3JlZW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdHcmVlbiBwZW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICd2YXIoLS1jay1oaWdobGlnaHQtcGVuLWdyZWVuKScsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncGVuJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGltYWdlOiB7XG4gICAgICAgICAgICAgICAgdG9vbGJhcjogWyAnaW1hZ2VTdHlsZTpmdWxsJywgJ2ltYWdlU3R5bGU6c2lkZScsICd8JywgJ2ltYWdlVGV4dEFsdGVybmF0aXZlJyBdLFxuICAgICAgICAgICAgICAgIHN0eWxlczogW1xuICAgICAgICAgICAgICAgICAgICB7IG5hbWU6ICdsZWZ0JywgaWNvbjogJ2xlZnQnIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogJ2NlbnRlcicsIGljb246ICdjZW50ZXInIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogJ3JpZ2h0JywgaWNvbjogJ3JpZ2h0JyB9LFxuICAgICAgICAgICAgICAgICAgICB7IG5hbWU6ICdmdWxsU2l6ZScsIHRpdGxlOiAnRnVsbCBzaXplJywgaWNvbjogJ3JpZ2h0JywgaXNEZWZhdWx0OiB0cnVlIH0sXG4gICAgICAgICAgICAgICAgICAgIHsgbmFtZTogJ3NpZGUnLCBpY29uOiAnbGVmdCcsIHRpdGxlOiAnTXkgc2lkZSBzdHlsZScsIGNsYXNzOiAnY3VzdG9tLXNpZGUtaW1hZ2UnIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2tmaW5kZXI6IHtcbiAgICAgICAgICAgICAgICB1cGxvYWRVcmw6ICcvY2tmaW5kZXIvY29yZS9jb25uZWN0b3IvcGhwL2Nvbm5lY3Rvci5waHA/Y29tbWFuZD1RdWlja1VwbG9hZCZ0eXBlPUZpbGVzJnJlc3BvbnNlVHlwZT1qc29uJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coIGVycm9yICk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBja2VkaXRvcjogZnVuY3Rpb24oaWQpXG5cdHtcbiAgICAgICAgQ0tFRElUT1IuY29uZmlnLndpZHRoID0gJ2F1dG8nO1xuICAgICAgICBDS0VESVRPUi5jb25maWcuaGVpZ2h0ID0gNjAwO1xuICAgICAgICBDS0VESVRPUi5kaXNhYmxlQXV0b0lubGluZSA9IHRydWU7XG5cbiAgICAgICAgLy8gQ0tFRElUT1IucmVwbGFjZShpZCwge1xuICAgICAgICAvLyAgICAgdG9vbGJhcjogW1xuICAgICAgICAvLyAgICAgICAgIHsgbmFtZTogJ2RvY3VtZW50JywgaXRlbXM6IFsgJ1ByaW50JyBdIH0sXG4gICAgICAgIC8vICAgICAgICAgeyBuYW1lOiAnY2xpcGJvYXJkJywgaXRlbXM6IFsgJ1VuZG8nLCAnUmVkbycgXSB9LFxuICAgICAgICAvLyAgICAgICAgIHsgbmFtZTogJ3N0eWxlcycsIGl0ZW1zOiBbICdGb3JtYXQnLCAnRm9udCcsICdGb250U2l6ZScgXSB9LFxuICAgICAgICAvLyAgICAgICAgIHsgbmFtZTogJ2Jhc2ljc3R5bGVzJywgaXRlbXM6IFsgJ0JvbGQnLCAnSXRhbGljJywgJ1VuZGVybGluZScsICdTdHJpa2UnLCAnUmVtb3ZlRm9ybWF0JywgJ0NvcHlGb3JtYXR0aW5nJyBdIH0sXG4gICAgICAgIC8vICAgICAgICAgeyBuYW1lOiAnY29sb3JzJywgaXRlbXM6IFsgJ1RleHRDb2xvcicsICdCR0NvbG9yJyBdIH0sXG4gICAgICAgIC8vICAgICAgICAgeyBuYW1lOiAnYWxpZ24nLCBpdGVtczogWyAnSnVzdGlmeUxlZnQnLCAnSnVzdGlmeUNlbnRlcicsICdKdXN0aWZ5UmlnaHQnLCAnSnVzdGlmeUJsb2NrJyBdIH0sXG4gICAgICAgIC8vICAgICAgICAgeyBuYW1lOiAnbGlua3MnLCBpdGVtczogWyAnTGluaycsICdVbmxpbmsnIF0gfSxcbiAgICAgICAgLy8gICAgICAgICB7IG5hbWU6ICdwYXJhZ3JhcGgnLCBpdGVtczogWyAnTnVtYmVyZWRMaXN0JywgJ0J1bGxldGVkTGlzdCcsICctJywgJ091dGRlbnQnLCAnSW5kZW50JywgJy0nLCAnQmxvY2txdW90ZScgXSB9LFxuICAgICAgICAvLyAgICAgICAgIHsgbmFtZTogJ2luc2VydCcsIGl0ZW1zOiBbICdJbWFnZScsICdUYWJsZScgXSB9LFxuICAgICAgICAvLyAgICAgICAgIHsgbmFtZTogJ3Rvb2xzJywgaXRlbXM6IFsgJ01heGltaXplJyBdIH0sXG4gICAgICAgIC8vICAgICAgICAgeyBuYW1lOiAnZWRpdGluZycsIGl0ZW1zOiBbICdTY2F5dCcgXSB9XG4gICAgICAgIC8vICAgICBdLFxuICAgICAgICAvLyAgICAgY3VzdG9tQ29uZmlnOiAnJyxcbiAgICAgICAgLy8gICAgIGRpc2FsbG93ZWRDb250ZW50OiAnaW1ne3dpZHRoLGhlaWdodCxmbG9hdH0nLFxuICAgICAgICAvLyAgICAgZXh0cmFBbGxvd2VkQ29udGVudDogJ2ltZ1t3aWR0aCxoZWlnaHQsYWxpZ25dJyxcbiAgICAgICAgLy8gICAgIC8vIGV4dHJhUGx1Z2luczogJ3RhYmxlcmVzaXplLHVwbG9hZGltYWdlLHVwbG9hZGZpbGUnLFxuICAgICAgICAvLyAgICAgZXh0cmFQbHVnaW5zOiAndGFibGVyZXNpemUnLFxuICAgICAgICAvLyAgICAgaGVpZ2h0OiA4MDAsXG4gICAgICAgIC8vICAgICBjb250ZW50c0NzczogWyAnaHR0cHM6Ly9jZG4uY2tlZGl0b3IuY29tLzQuNi4xL2Z1bGwtYWxsL2NvbnRlbnRzLmNzcycgXSxcbiAgICAgICAgLy8gICAgIGJvZHlDbGFzczogJ2RvY3VtZW50LWVkaXRvcicsXG4gICAgICAgIC8vICAgICBmb3JtYXRfdGFnczogJ3A7aDE7aDI7aDM7cHJlJyxcbiAgICAgICAgLy8gICAgIHJlbW92ZURpYWxvZ1RhYnM6ICdpbWFnZTphZHZhbmNlZDtsaW5rOmFkdmFuY2VkJyxcbiAgICAgICAgLy8gICAgIHN0eWxlc1NldDogW1xuICAgICAgICAvLyAgICAgICAgIC8qIElubGluZSBTdHlsZXMgKi9cbiAgICAgICAgLy8gICAgICAgICB7IG5hbWU6ICdNYXJrZXInLCBlbGVtZW50OiAnc3BhbicsIGF0dHJpYnV0ZXM6IHsgJ2NsYXNzJzogJ21hcmtlcicgfSB9LFxuICAgICAgICAvLyAgICAgICAgIHsgbmFtZTogJ0NpdGVkIFdvcmsnLCBlbGVtZW50OiAnY2l0ZScgfSxcbiAgICAgICAgLy8gICAgICAgICB7IG5hbWU6ICdJbmxpbmUgUXVvdGF0aW9uJywgZWxlbWVudDogJ3EnIH0sXG4gICAgICAgIC8vICAgICAgICAgLyogT2JqZWN0IFN0eWxlcyAqL1xuICAgICAgICAvLyAgICAgICAgIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgbmFtZTogJ1NwZWNpYWwgQ29udGFpbmVyJyxcbiAgICAgICAgLy8gICAgICAgICAgICAgZWxlbWVudDogJ2RpdicsXG4gICAgICAgIC8vICAgICAgICAgICAgIHN0eWxlczoge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgcGFkZGluZzogJzVweCAxMHB4JyxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjZWVlJyxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjY2NjJ1xuICAgICAgICAvLyAgICAgICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICAgfSxcbiAgICAgICAgLy8gICAgICAgICB7XG4gICAgICAgIC8vICAgICAgICAgICAgIG5hbWU6ICdDb21wYWN0IHRhYmxlJyxcbiAgICAgICAgLy8gICAgICAgICAgICAgZWxlbWVudDogJ3RhYmxlJyxcbiAgICAgICAgLy8gICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgY2VsbHBhZGRpbmc6ICc1JyxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGNlbGxzcGFjaW5nOiAnMCcsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBib3JkZXI6ICcxJyxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGJvcmRlcmNvbG9yOiAnI2NjYydcbiAgICAgICAgLy8gICAgICAgICAgICAgfSxcbiAgICAgICAgLy8gICAgICAgICAgICAgc3R5bGVzOiB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAnYm9yZGVyLWNvbGxhcHNlJzogJ2NvbGxhcHNlJ1xuICAgICAgICAvLyAgICAgICAgICAgICB9XG4gICAgICAgIC8vICAgICAgICAgfSxcbiAgICAgICAgLy8gICAgICAgICB7IG5hbWU6ICdCb3JkZXJsZXNzIFRhYmxlJywgZWxlbWVudDogJ3RhYmxlJywgc3R5bGVzOiB7ICdib3JkZXItc3R5bGUnOiAnaGlkZGVuJywgJ2JhY2tncm91bmQtY29sb3InOiAnI0U2RTZGQScgfSB9LFxuICAgICAgICAvLyAgICAgICAgIHsgbmFtZTogJ1NxdWFyZSBCdWxsZXRlZCBMaXN0JywgZWxlbWVudDogJ3VsJywgc3R5bGVzOiB7ICdsaXN0LXN0eWxlLXR5cGUnOiAnc3F1YXJlJyB9IH1cbiAgICAgICAgLy8gICAgIF1cbiAgICAgICAgLy8gfSApO1xuXG4gICAgICAgIENLRURJVE9SLnJlcGxhY2UoaWQsIHtcbiAgICAgICAgICAgIGN1c3RvbUNvbmZpZzogJy9zdGF0aWMvYXBwcy93eXNpd3lnL2NrZWRpdG9yL2NvbmZpZy5qcydcbiAgICAgICAgfSk7XG5cdH0sXG5cbiAgICB3eXNpd3lnOiBmdW5jdGlvbihpZClcblx0e1xuXHRcdCQoWycjJywgaWRdLmpvaW4oJycpKS53eXNpd3lnKHtcblx0XHRcdHRvb2xiYXI6ICd0b3AnLCAvLyAnc2VsZWN0aW9uJ3wndG9wJ3wndG9wLXNlbGVjdGlvbid8J2JvdHRvbSd8J2JvdHRvbS1zZWxlY3Rpb24nXG4gICAgICAgICAgICBob3RLZXlzOiB7XG4gICAgICAgICAgICAgICAgJ2N0cmwrYiBtZXRhK2InOiAnYm9sZCcsXG4gICAgICAgICAgICAgICAgJ2N0cmwraSBtZXRhK2knOiAnaXRhbGljJyxcbiAgICAgICAgICAgICAgICAnY3RybCt1IG1ldGErdSc6ICd1bmRlcmxpbmUnLFxuICAgICAgICAgICAgICAgICdjdHJsK3ogbWV0YSt6JzogJ3VuZG8nLFxuICAgICAgICAgICAgICAgICdjdHJsK3kgbWV0YSt5IG1ldGErc2hpZnQreic6ICdyZWRvJ1xuICAgICAgICAgICAgfVxuXHRcdH0pO1xuXHR9LFxuXG5cdGluaXQ6IGZ1bmN0aW9uKGlkLCB0eXBlKVxuXHR7XG5cdFx0aWYgKHR5cGVvZih0aGlzW3R5cGVdKSAhPT0gJ3VuZGVmaW5lZCcpXG5cdFx0e1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5pdGVkLmluZGV4T2YoaWQpIDwgMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdGVkLnB1c2goaWQpXG4gICAgICAgICAgICAgICAgdGhpc1t0eXBlXShpZCk7XG4gICAgICAgICAgICB9XG5cdFx0fVxuXHR9XG59OyJdfQ==

"use strict";

;(function ($) {
    $.fn.timeoutClass = function (classname, timeout) {
        timeout = timeout || 10;
        var that = this;
        setTimeout(function () {
            $(that).toggleClass(classname);
        }, timeout);
    };
})(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpbWVvdXQuY2xhc3MuanMiXSwibmFtZXMiOlsiJCIsImZuIiwidGltZW91dENsYXNzIiwiY2xhc3NuYW1lIiwidGltZW91dCIsInRoYXQiLCJzZXRUaW1lb3V0IiwidG9nZ2xlQ2xhc3MiLCJqUXVlcnkiXSwibWFwcGluZ3MiOiI7O0FBQUEsQ0FBQyxDQUFDLFVBQVNBLENBQVQsRUFBVztBQUNUQSxNQUFFQyxFQUFGLENBQUtDLFlBQUwsR0FBb0IsVUFBU0MsU0FBVCxFQUFvQkMsT0FBcEIsRUFBNkI7QUFDN0NBLGtCQUFVQSxXQUFXLEVBQXJCO0FBQ0EsWUFBSUMsT0FBTyxJQUFYO0FBQ0FDLG1CQUFXLFlBQVU7QUFDakJOLGNBQUVLLElBQUYsRUFBUUUsV0FBUixDQUFvQkosU0FBcEI7QUFDSCxTQUZELEVBRUdDLE9BRkg7QUFHSCxLQU5EO0FBT0gsQ0FSQSxFQVFFSSxNQVJGIiwiZmlsZSI6InRpbWVvdXQuY2xhc3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyI7KGZ1bmN0aW9uKCQpe1xuICAgICQuZm4udGltZW91dENsYXNzID0gZnVuY3Rpb24oY2xhc3NuYW1lLCB0aW1lb3V0KSB7XG4gICAgICAgIHRpbWVvdXQgPSB0aW1lb3V0IHx8IDEwO1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICQodGhhdCkudG9nZ2xlQ2xhc3MoY2xhc3NuYW1lKTtcbiAgICAgICAgfSwgdGltZW91dCk7XG4gICAgfTtcbn0pKGpRdWVyeSk7XG4iXX0=

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _addslashes(str) {
  return str.replace('/(["\'\])/g', "\\$1").replace('/\0/g', "\\0");
}
function _stripslashes(str) {
  return str.replace('/\0/g', '0').replace('/\(.)/g', '$1');
}
function clearCookie() {
  var now = new Date();var yesterday = new Date(now.getTime() - 1000 * 60 * 60 * 24);this.setCookie('co' + this.obj, 'cookieValue', yesterday);this.setCookie('cs' + this.obj, 'cookieValue', yesterday);
};
function setCookie(cookieName, cookieValue, expires, path, domain, secure) {
  document.cookie = escape(cookieName) + '=' + escape(cookieValue) + (expires ? '; expires=' + expires.toGMTString() : '') + (path ? '; path=' + path : '') + (domain ? '; domain=' + domain : '') + (secure ? '; secure' : '');
};
function getCookie(cookieName) {
  var cookieValue = '';var posName = document.cookie.indexOf(escape(cookieName) + '=');if (posName != -1) {
    var posValue = posName + (escape(cookieName) + '=').length;var endPos = document.cookie.indexOf(';', posValue);if (endPos != -1) cookieValue = unescape(document.cookie.substring(posValue, endPos));else cookieValue = unescape(document.cookie.substring(posValue));
  }return cookieValue;
};
function __debug(arr, level) {
  var dumped_text = "";if (!level) level = 0;var level_padding = "";for (var j = 0; j < level + 1; j++) {
    level_padding += "    ";
  }if ((typeof arr === 'undefined' ? 'undefined' : _typeof(arr)) == 'object') {
    for (var item in arr) {
      var value = arr[item];if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
        dumped_text += level_padding + "'" + item + "' ...\n";dumped_text += dump(value, level + 1);
      } else {
        dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
      }
    }
  } else {
    dumped_text = "===>" + arr + "<===(" + (typeof arr === 'undefined' ? 'undefined' : _typeof(arr)) + ")";
  }return dumped_text;
}

function serialize(r) {
  var e,
      a,
      n = "",
      t = 0,
      o = function o(r) {
    var e,
        a,
        n,
        t,
        o = typeof r === 'undefined' ? 'undefined' : _typeof(r);if ("object" === o && !r) return "null";if ("object" === o) {
      if (!r.constructor) return "object";(e = (n = r.constructor.toString()).match(/(\w+)\(/)) && (n = e[1].toLowerCase()), t = ["boolean", "number", "string", "array"];for (a in t) {
        if (n === t[a]) {
          o = t[a];break;
        }
      }
    }return o;
  },
      c = o(r);switch (c) {case "function":
      e = "";break;case "boolean":
      e = "b:" + (r ? "1" : "0");break;case "number":
      e = (Math.round(r) === r ? "i" : "d") + ":" + r;break;case "string":
      e = "s:" + function (r) {
        var e = 0,
            a = 0,
            n = r.length,
            t = "";for (a = 0; a < n; a++) {
          e += (t = r.charCodeAt(a)) < 128 ? 1 : t < 2048 ? 2 : 3;
        }return e;
      }(r) + ':"' + r + '"';break;case "array":case "object":
      e = "a";for (a in r) {
        if (r.hasOwnProperty(a)) {
          if ("function" === o(r[a])) continue;n += serialize(a.match(/^[0-9]+$/) ? parseInt(a, 10) : a) + serialize(r[a]), t++;
        }
      }e += ":" + t + ":{" + n + "}";break;case "undefined":default:
      e = "N";}return "object" !== c && "array" !== c && (e += ";"), e;
}
function unserialize(n) {
  function r(n, e) {
    var t,
        u,
        s,
        c,
        l,
        f,
        h,
        d,
        p,
        w,
        g,
        b,
        k,
        v,
        I,
        y,
        E,
        S,
        j = 0,
        m = function m(n) {
      return n;
    };switch (e || (e = 0), t = n.slice(e, e + 1).toLowerCase(), u = e + 2, t) {case "i":
        m = function m(n) {
          return parseInt(n, 10);
        }, j = (p = o(n, u, ";"))[0], d = p[1], u += j + 1;break;case "b":
        m = function m(n) {
          return 0 !== parseInt(n, 10);
        }, j = (p = o(n, u, ";"))[0], d = p[1], u += j + 1;break;case "d":
        m = function m(n) {
          return parseFloat(n);
        }, j = (p = o(n, u, ";"))[0], d = p[1], u += j + 1;break;case "n":
        d = null;break;case "s":
        j = (w = o(n, u, ":"))[0], g = w[1], j = (p = i(n, (u += j + 2) + 1, parseInt(g, 10)))[0], d = p[1], u += j + 2, j !== parseInt(g, 10) && j !== d.length && a("SyntaxError", "String length mismatch");break;case "a":
        for (d = {}, j = (s = o(n, u, ":"))[0], c = s[1], u += j + 2, f = parseInt(c, 10), l = !0, b = 0; b < f; b++) {
          I = (v = r(n, u))[1], k = v[2], E = (y = r(n, u += I))[1], S = y[2], u += E, k !== b && (l = !1), d[k] = S;
        }if (l) {
          for (h = new Array(f), b = 0; b < f; b++) {
            h[b] = d[b];
          }d = h;
        }u += 1;break;default:
        a("SyntaxError", "Unknown / Unhandled data type(s): " + t);}return [t, u - e, m(d)];
  }var e = "undefined" != typeof window ? window : global,
      t = function t(n) {
    for (var r = n.length, e = n.length - 1; e >= 0; e--) {
      var t = n.charCodeAt(e);t > 127 && t <= 2047 ? r++ : t > 2047 && t <= 65535 && (r += 2), t >= 56320 && t <= 57343 && e--;
    }return r - 1;
  },
      a = function a(n, r, t, _a) {
    throw new e[n](r, t, _a);
  },
      o = function o(n, r, e) {
    for (var t = 2, o = [], i = n.slice(r, r + 1); i !== e;) {
      t + r > n.length && a("Error", "Invalid"), o.push(i), i = n.slice(r + (t - 1), r + t), t += 1;
    }return [o.length, o.join("")];
  },
      i = function i(n, r, e) {
    var a, o, i;for (i = [], a = 0; a < e; a++) {
      o = n.slice(r + (a - 1), r + a), i.push(o), e -= t(o);
    }return [i.length, i.join("")];
  };return r(n + "", 0)[2];
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZlbmRvcnMuanMiXSwibmFtZXMiOlsiX2FkZHNsYXNoZXMiLCJzdHIiLCJyZXBsYWNlIiwiX3N0cmlwc2xhc2hlcyIsImNsZWFyQ29va2llIiwibm93IiwiRGF0ZSIsInllc3RlcmRheSIsImdldFRpbWUiLCJzZXRDb29raWUiLCJvYmoiLCJjb29raWVOYW1lIiwiY29va2llVmFsdWUiLCJleHBpcmVzIiwicGF0aCIsImRvbWFpbiIsInNlY3VyZSIsImRvY3VtZW50IiwiY29va2llIiwiZXNjYXBlIiwidG9HTVRTdHJpbmciLCJnZXRDb29raWUiLCJwb3NOYW1lIiwiaW5kZXhPZiIsInBvc1ZhbHVlIiwibGVuZ3RoIiwiZW5kUG9zIiwidW5lc2NhcGUiLCJzdWJzdHJpbmciLCJfX2RlYnVnIiwiYXJyIiwibGV2ZWwiLCJkdW1wZWRfdGV4dCIsImxldmVsX3BhZGRpbmciLCJqIiwiaXRlbSIsInZhbHVlIiwiZHVtcCIsInNlcmlhbGl6ZSIsInIiLCJlIiwiYSIsIm4iLCJ0IiwibyIsImNvbnN0cnVjdG9yIiwidG9TdHJpbmciLCJtYXRjaCIsInRvTG93ZXJDYXNlIiwiYyIsIk1hdGgiLCJyb3VuZCIsImNoYXJDb2RlQXQiLCJoYXNPd25Qcm9wZXJ0eSIsInBhcnNlSW50IiwidW5zZXJpYWxpemUiLCJ1IiwicyIsImwiLCJmIiwiaCIsImQiLCJwIiwidyIsImciLCJiIiwiayIsInYiLCJJIiwieSIsIkUiLCJTIiwibSIsInNsaWNlIiwicGFyc2VGbG9hdCIsImkiLCJBcnJheSIsIndpbmRvdyIsImdsb2JhbCIsInB1c2giLCJqb2luIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsU0FBU0EsV0FBVCxDQUFzQkMsR0FBdEIsRUFBMkI7QUFBQyxTQUFPQSxJQUFJQyxPQUFKLENBQVksYUFBWixFQUEyQixNQUEzQixFQUFtQ0EsT0FBbkMsQ0FBMkMsT0FBM0MsRUFBb0QsS0FBcEQsQ0FBUDtBQUFtRTtBQUMvRixTQUFTQyxhQUFULENBQXdCRixHQUF4QixFQUE2QjtB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QztBQUF5Q0csVUFBRUosQ0FBRixHQUFJRyxFQUFFakIsTUFBTixJQUFjZ0IsRUFBRSxPQUFGLEVBQVUsU0FBVixDQUFkLEVBQW1DRyxFQUFFbUMsSUFBRixDQUFPSixDQUFQLENBQW5DLEVBQTZDQSxJQUFFakMsRUFBRStCLEtBQUYsQ0FBUWxDLEtBQUdJLElBQUUsQ0FBTCxDQUFSLEVBQWdCSixJQUFFSSxDQUFsQixDQUEvQyxFQUFvRUEsS0FBRyxDQUF2RTtBQUF6QyxLQUFrSCxPQUFNLENBQUNDLEVBQUVuQixNQUFILEVBQVVtQixFQUFFb0MsSUFBRixDQUFPLEVBQVAsQ0FBVixDQUFOO0FBQTRCLEdBQXhaO0FBQUEsTUFBeVpMLElBQUUsV0FBU2pDLENBQVQsRUFBV0gsQ0FBWCxFQUFhQyxDQUFiLEVBQWU7QUFBQyxRQUFJQyxDQUFKLEVBQU1HLENBQU4sRUFBUStCLENBQVIsQ0FBVSxLQUFJQSxJQUFFLEVBQUYsRUFBS2xDLElBQUUsQ0FBWCxFQUFhQSxJQUFFRCxDQUFmLEVBQWlCQyxHQUFqQjtBQUFxQkcsVUFBRUYsRUFBRStCLEtBQUYsQ0FBUWxDLEtBQUdFLElBQUUsQ0FBTCxDQUFSLEVBQWdCRixJQUFFRSxDQUFsQixDQUFGLEVBQXVCa0MsRUFBRUksSUFBRixDQUFPbkMsQ0FBUCxDQUF2QixFQUFpQ0osS0FBR0csRUFBRUMsQ0FBRixDQUFwQztBQUFyQixLQUE4RCxPQUFNLENBQUMrQixFQUFFbEQsTUFBSCxFQUFVa0QsRUFBRUssSUFBRixDQUFPLEVBQVAsQ0FBVixDQUFOO0FBQTRCLEdBQS9nQixDQUFnaEIsT0FBT3pDLEVBQUVHLElBQUUsRUFBSixFQUFPLENBQVAsRUFBVSxDQUFWLENBQVA7QUFBb0IiLCJmaWxlIjoidmVuZG9ycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIF9hZGRzbGFzaGVzKCBzdHIgKXtyZXR1cm4gc3RyLnJlcGxhY2UoJy8oW1wiXFwnXFxdKS9nJywgXCJcXFxcJDFcIikucmVwbGFjZSgnL1xcMC9nJywgXCJcXFxcMFwiKTt9XG5mdW5jdGlvbiBfc3RyaXBzbGFzaGVzKCBzdHIgKXtyZXR1cm4gc3RyLnJlcGxhY2UoJy9cXDAvZycsICcwJykucmVwbGFjZSgnL1xcKC4pL2cnLCAnJDEnKTt9XG5mdW5jdGlvbiBjbGVhckNvb2tpZSgpe3ZhciBub3cgPSBuZXcgRGF0ZSgpO3ZhciB5ZXN0ZXJkYXkgPSBuZXcgRGF0ZShub3cuZ2V0VGltZSgpIC0gMTAwMCAqIDYwICogNjAgKiAyNCk7dGhpcy5zZXRDb29raWUoJ2NvJyArIHRoaXMub2JqLCAnY29va2llVmFsdWUnLCB5ZXN0ZXJkYXkpO3RoaXMuc2V0Q29va2llKCdjcycgKyB0aGlzLm9iaiwgJ2Nvb2tpZVZhbHVlJywgeWVzdGVyZGF5KTt9O1xuZnVuY3Rpb24gc2V0Q29va2llKGNvb2tpZU5hbWUsIGNvb2tpZVZhbHVlLCBleHBpcmVzLCBwYXRoLCBkb21haW4sIHNlY3VyZSl7ZG9jdW1lbnQuY29va2llPWVzY2FwZShjb29raWVOYW1lKSArICc9JyArIGVzY2FwZShjb29raWVWYWx1ZSkrKGV4cGlyZXMgPyAnOyBleHBpcmVzPScgKyBleHBpcmVzLnRvR01UU3RyaW5nKCkgOiAnJykrKHBhdGggPyAnOyBwYXRoPScgKyBwYXRoIDogJycpKyhkb21haW4gPyAnOyBkb21haW49JyArIGRvbWFpbiA6ICcnKSsoc2VjdXJlID8gJzsgc2VjdXJlJyA6ICcnKTt9O1xuZnVuY3Rpb24gZ2V0Q29va2llIChjb29raWVOYW1lKXt2YXIgY29va2llVmFsdWUgPSAnJzt2YXIgcG9zTmFtZSA9IGRvY3VtZW50LmNvb2tpZS5pbmRleE9mKGVzY2FwZShjb29raWVOYW1lKSArICc9Jyk7aWYgKHBvc05hbWUgIT0gLTEpIHt2YXIgcG9zVmFsdWUgPSBwb3NOYW1lICsgKGVzY2FwZShjb29raWVOYW1lKSArICc9JykubGVuZ3RoO3ZhciBlbmRQb3MgPSBkb2N1bWVudC5jb29raWUuaW5kZXhPZignOycsIHBvc1ZhbHVlKTtpZiAoZW5kUG9zICE9IC0xKSBjb29raWVWYWx1ZSA9IHVuZXNjYXBlKGRvY3VtZW50LmNvb2tpZS5zdWJzdHJpbmcocG9zVmFsdWUsIGVuZFBvcykpO2Vsc2UgY29va2llVmFsdWUgPSB1bmVzY2FwZShkb2N1bWVudC5jb29raWUuc3Vic3RyaW5nKHBvc1ZhbHVlKSk7fXJldHVybiAoY29va2llVmFsdWUpO307XG5mdW5jdGlvbiBfX2RlYnVnKGFycixsZXZlbCkge3ZhciBkdW1wZWRfdGV4dCA9IFwiXCI7aWYgKCFsZXZlbCkgbGV2ZWwgPSAwO3ZhciBsZXZlbF9wYWRkaW5nID0gXCJcIjtmb3IodmFyIGo9MDtqPGxldmVsKzE7aisrKSBsZXZlbF9wYWRkaW5nICs9IFwiICAgIFwiO2lmICh0eXBlb2YoYXJyKSA9PSAnb2JqZWN0JykgeyBmb3IodmFyIGl0ZW0gaW4gYXJyKSB7dmFyIHZhbHVlID0gYXJyW2l0ZW1dO2lmICh0eXBlb2YodmFsdWUpID09ICdvYmplY3QnKSB7IGR1bXBlZF90ZXh0ICs9IGxldmVsX3BhZGRpbmcgKyBcIidcIiArIGl0ZW0gKyBcIicgLi4uXFxuXCI7ZHVtcGVkX3RleHQgKz0gZHVtcCh2YWx1ZSxsZXZlbCsxKTt9IGVsc2Uge2R1bXBlZF90ZXh0ICs9IGxldmVsX3BhZGRpbmcgKyBcIidcIiArIGl0ZW0gKyBcIicgPT4gXFxcIlwiICsgdmFsdWUgKyBcIlxcXCJcXG5cIjt9fX0gZWxzZSB7IGR1bXBlZF90ZXh0ID0gXCI9PT0+XCIrYXJyK1wiPD09PShcIit0eXBlb2YoYXJyKStcIilcIjt9cmV0dXJuIGR1bXBlZF90ZXh0O31cblxuZnVuY3Rpb24gc2VyaWFsaXplKHIpe3ZhciBlLGEsbj1cIlwiLHQ9MCxvPWZ1bmN0aW9uKHIpe3ZhciBlLGEsbix0LG89dHlwZW9mIHI7aWYoXCJvYmplY3RcIj09PW8mJiFyKXJldHVyblwibnVsbFwiO2lmKFwib2JqZWN0XCI9PT1vKXtpZighci5jb25zdHJ1Y3RvcilyZXR1cm5cIm9iamVjdFwiOyhlPShuPXIuY29uc3RydWN0b3IudG9TdHJpbmcoKSkubWF0Y2goLyhcXHcrKVxcKC8pKSYmKG49ZVsxXS50b0xvd2VyQ2FzZSgpKSx0PVtcImJvb2xlYW5cIixcIm51bWJlclwiLFwic3RyaW5nXCIsXCJhcnJheVwiXTtmb3IoYSBpbiB0KWlmKG49PT10W2FdKXtvPXRbYV07YnJlYWt9fXJldHVybiBvfSxjPW8ocik7c3dpdGNoKGMpe2Nhc2VcImZ1bmN0aW9uXCI6ZT1cIlwiO2JyZWFrO2Nhc2VcImJvb2xlYW5cIjplPVwiYjpcIisocj9cIjFcIjpcIjBcIik7YnJlYWs7Y2FzZVwibnVtYmVyXCI6ZT0oTWF0aC5yb3VuZChyKT09PXI/XCJpXCI6XCJkXCIpK1wiOlwiK3I7YnJlYWs7Y2FzZVwic3RyaW5nXCI6ZT1cInM6XCIrZnVuY3Rpb24ocil7dmFyIGU9MCxhPTAsbj1yLmxlbmd0aCx0PVwiXCI7Zm9yKGE9MDthPG47YSsrKWUrPSh0PXIuY2hhckNvZGVBdChhKSk8MTI4PzE6dDwyMDQ4PzI6MztyZXR1cm4gZX0ocikrJzpcIicrcisnXCInO2JyZWFrO2Nhc2VcImFycmF5XCI6Y2FzZVwib2JqZWN0XCI6ZT1cImFcIjtmb3IoYSBpbiByKWlmKHIuaGFzT3duUHJvcGVydHkoYSkpe2lmKFwiZnVuY3Rpb25cIj09PW8oclthXSkpY29udGludWU7bis9c2VyaWFsaXplKGEubWF0Y2goL15bMC05XSskLyk/cGFyc2VJbnQoYSwxMCk6YSkrc2VyaWFsaXplKHJbYV0pLHQrK31lKz1cIjpcIit0K1wiOntcIituK1wifVwiO2JyZWFrO2Nhc2VcInVuZGVmaW5lZFwiOmRlZmF1bHQ6ZT1cIk5cIn1yZXR1cm5cIm9iamVjdFwiIT09YyYmXCJhcnJheVwiIT09YyYmKGUrPVwiO1wiKSxlfVxuZnVuY3Rpb24gdW5zZXJpYWxpemUobil7ZnVuY3Rpb24gcihuLGUpe3ZhciB0LHUscyxjLGwsZixoLGQscCx3LGcsYixrLHYsSSx5LEUsUyxqPTAsbT1mdW5jdGlvbihuKXtyZXR1cm4gbn07c3dpdGNoKGV8fChlPTApLHQ9bi5zbGljZShlLGUrMSkudG9Mb3dlckNhc2UoKSx1PWUrMix0KXtjYXNlXCJpXCI6bT1mdW5jdGlvbihuKXtyZXR1cm4gcGFyc2VJbnQobiwxMCl9LGo9KHA9byhuLHUsXCI7XCIpKVswXSxkPXBbMV0sdSs9aisxO2JyZWFrO2Nhc2VcImJcIjptPWZ1bmN0aW9uKG4pe3JldHVybiAwIT09cGFyc2VJbnQobiwxMCl9LGo9KHA9byhuLHUsXCI7XCIpKVswXSxkPXBbMV0sdSs9aisxO2JyZWFrO2Nhc2VcImRcIjptPWZ1bmN0aW9uKG4pe3JldHVybiBwYXJzZUZsb2F0KG4pfSxqPShwPW8obix1LFwiO1wiKSlbMF0sZD1wWzFdLHUrPWorMTticmVhaztjYXNlXCJuXCI6ZD1udWxsO2JyZWFrO2Nhc2VcInNcIjpqPSh3PW8obix1LFwiOlwiKSlbMF0sZz13WzFdLGo9KHA9aShuLCh1Kz1qKzIpKzEscGFyc2VJbnQoZywxMCkpKVswXSxkPXBbMV0sdSs9aisyLGohPT1wYXJzZUludChnLDEwKSYmaiE9PWQubGVuZ3RoJiZhKFwiU3ludGF4RXJyb3JcIixcIlN0cmluZyBsZW5ndGggbWlzbWF0Y2hcIik7YnJlYWs7Y2FzZVwiYVwiOmZvcihkPXt9LGo9KHM9byhuLHUsXCI6XCIpKVswXSxjPXNbMV0sdSs9aisyLGY9cGFyc2VJbnQoYywxMCksbD0hMCxiPTA7YjxmO2IrKylJPSh2PXIobix1KSlbMV0saz12WzJdLEU9KHk9cihuLHUrPUkpKVsxXSxTPXlbMl0sdSs9RSxrIT09YiYmKGw9ITEpLGRba109UztpZihsKXtmb3IoaD1uZXcgQXJyYXkoZiksYj0wO2I8ZjtiKyspaFtiXT1kW2JdO2Q9aH11Kz0xO2JyZWFrO2RlZmF1bHQ6YShcIlN5bnRheEVycm9yXCIsXCJVbmtub3duIC8gVW5oYW5kbGVkIGRhdGEgdHlwZShzKTogXCIrdCl9cmV0dXJuW3QsdS1lLG0oZCldfXZhciBlPVwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93Omdsb2JhbCx0PWZ1bmN0aW9uKG4pe2Zvcih2YXIgcj1uLmxlbmd0aCxlPW4ubGVuZ3RoLTE7ZT49MDtlLS0pe3ZhciB0PW4uY2hhckNvZGVBdChlKTt0PjEyNyYmdDw9MjA0Nz9yKys6dD4yMDQ3JiZ0PD02NTUzNSYmKHIrPTIpLHQ+PTU2MzIwJiZ0PD01NzM0MyYmZS0tfXJldHVybiByLTF9LGE9ZnVuY3Rpb24obixyLHQsYSl7dGhyb3cgbmV3IGVbbl0ocix0LGEpfSxvPWZ1bmN0aW9uKG4scixlKXtmb3IodmFyIHQ9MixvPVtdLGk9bi5zbGljZShyLHIrMSk7aSE9PWU7KXQrcj5uLmxlbmd0aCYmYShcIkVycm9yXCIsXCJJbnZhbGlkXCIpLG8ucHVzaChpKSxpPW4uc2xpY2UocisodC0xKSxyK3QpLHQrPTE7cmV0dXJuW28ubGVuZ3RoLG8uam9pbihcIlwiKV19LGk9ZnVuY3Rpb24obixyLGUpe3ZhciBhLG8saTtmb3IoaT1bXSxhPTA7YTxlO2ErKylvPW4uc2xpY2UocisoYS0xKSxyK2EpLGkucHVzaChvKSxlLT10KG8pO3JldHVybltpLmxlbmd0aCxpLmpvaW4oXCJcIildfTtyZXR1cm4gcihuK1wiXCIsMClbMl19Il19
