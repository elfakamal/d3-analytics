/*!
 * Kamal Farsaoui
 * picked from:
 *
 * Bootstrap Colorpicker
 * http://mjaalnir.github.io/bootstrap-colorpicker/
 *
 * Originally written by (c) 2012 Stefan Petre
 * Licensed under the Apache License v2.0
 * http://www.apache.org/licenses/LICENSE-2.0.txt
 *
 */
define(['underscore', 'jquery'], function(_, $)
{
	// Color object
	var Color = function(val) {
		this.value = {
			h: 1,
			s: 1,
			b: 1,
			a: 1
		};
		this.setColor(val);
	};

	Color.prototype = {
		constructor: Color,
		//parse a string to HSB
		setColor: function(val) {
			val = val.toLowerCase();
			var that = this;
			$.each(CPGlobal.stringParsers, function(i, parser) {
				var match = parser.re.exec(val),
				values = match && parser.parse(match),
				space = parser.space || 'rgba';
				if (values) {
					if (space === 'hsla') {
						that.value = CPGlobal.RGBtoHSB.apply(null, CPGlobal.HSLtoRGB.apply(null, values));
					} else {
						that.value = CPGlobal.RGBtoHSB.apply(null, values);
					}
					return false;
				}
				return true;
			});
		},
		setHue: function(h) {
			this.value.h = 1 - h;
		},
		setSaturation: function(s) {
			this.value.s = s;
		},
		setLightness: function(b) {
			this.value.b = 1 - b;
		},
		setAlpha: function(a) {
			this.value.a = a;// parseInt((1 - a) * 100, 10) / 100;
		},
		// HSBtoRGB from RaphaelJS
		// https://github.com/DmitryBaranovskiy/raphael/
		toRGB: function(h, s, b, a) {
			if (!h) {
				h = this.value.h;
				s = this.value.s;
				b = this.value.b;
			}
			h *= 360;
			var R, G, B, X, C;
			h = (h % 360) / 60;
			C = b * s;
			X = C * (1 - Math.abs(h % 2 - 1));
			R = G = B = b - C;

			h = ~~h;
			R += [C, X, 0, 0, X, C][h];
			G += [X, C, C, X, 0, 0][h];
			B += [0, 0, X, C, C, X][h];
			return {
				r: Math.round(R * 255),
				g: Math.round(G * 255),
				b: Math.round(B * 255),
				a: a || this.value.a
			};
		},

		/**
		 * return the string representation of the RGB color object.
		 */
		toRGBString: function()
		{
			return CPGlobal.translateFormats["rgb"].apply(this);
		},

		/**
		 * return the string representation of the RGB color object (+alpha).
		 */
		toRGBAString: function()
		{
			return CPGlobal.translateFormats["rgba"].apply(this);
		},


		toHex: function(h, s, b, a) {
			var rgb = this.toRGB(h, s, b, a);
			return '#' + ((1 << 24) | (parseInt(rgb.r) << 16) | (parseInt(rgb.g) << 8) | parseInt(rgb.b)).toString(16).substr(1);
		},
		toHSL: function(h, s, b, a) {
			if (!h) {
				h = this.value.h;
				s = this.value.s;
				b = this.value.b;
			}
			var H = h,
			L = (2 - s) * b,
			S = s * b;
			if (L > 0 && L <= 1) {
				S /= L;
			} else {
				S /= 2 - L;
			}
			L /= 2;
			if (S > 1) {
				S = 1;
			}
			return {
				h: H,
				s: S,
				l: L,
				a: a || this.value.a
			};
		}
	};

	var CPGlobal = {
		// translate a format from Color object to a string
		translateFormats: {
			'rgb': function() {
				var rgb = this.toRGB();
				return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
			},
			'rgba': function() {
				var rgb = this.toRGB();
				return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';
			},
			'hsl': function() {
				var hsl = this.toHSL();
				return 'hsl(' + Math.round(hsl.h * 360) + ',' + Math.round(hsl.s * 100) + '%,' + Math.round(hsl.l * 100) + '%)';
			},
			'hsla': function() {
				var hsl = this.toHSL();
				return 'hsla(' + Math.round(hsl.h * 360) + ',' + Math.round(hsl.s * 100) + '%,' + Math.round(hsl.l * 100) + '%,' + hsl.a + ')';
			},
			'hex': function() {
				return  this.toHex();
			}
		},

		// HSBtoRGB from RaphaelJS
		// https://github.com/DmitryBaranovskiy/raphael/
		RGBtoHSB: function(r, g, b, a) {
			r /= 255;
			g /= 255;
			b /= 255;

			var H, S, V, C;
			V = Math.max(r, g, b);
			C = V - Math.min(r, g, b);
			H = (C === 0 ? null :
				V === r ? (g - b) / C :
				V === g ? (b - r) / C + 2 :
				(r - g) / C + 4
				);
			H = ((H + 360) % 6) * 60 / 360;
			S = C === 0 ? 0 : C / V;
			return {
				h: H || 1,
				s: S,
				b: V,
				a: a || 1
				};
		},
		HueToRGB: function(p, q, h) {
			if (h < 0)
				h += 1;
			else if (h > 1)
				h -= 1;

			if ((h * 6) < 1)
				return p + (q - p) * h * 6;
			else if ((h * 2) < 1)
				return q;
			else if ((h * 3) < 2)
				return p + (q - p) * ((2 / 3) - h) * 6;
			else
				return p;
		},
		HSLtoRGB: function(h, s, l, a) {
			if (s < 0) {
				s = 0;
			}
			var q;
			if (l <= 0.5) {
				q = l * (1 + s);
			} else {
				q = l + s - (l * s);
			}

			var p = 2 * l - q;

			var tr = h + (1 / 3);
			var tg = h;
			var tb = h - (1 / 3);

			var r = Math.round(CPGlobal.HueToRGB(p, q, tr) * 255);
			var g = Math.round(CPGlobal.HueToRGB(p, q, tg) * 255);
			var b = Math.round(CPGlobal.HueToRGB(p, q, tb) * 255);
			return [r, g, b, a || 1];
		},
		// a set of RE's that can match strings and generate color tuples.
		// from John Resig color plugin
		// https://github.com/jquery/jquery-color/
		stringParsers: [
		{
			re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
			parse: function(execResult) {
				return [
				execResult[1],
				execResult[2],
				execResult[3],
				execResult[4]
				];
			}
		},
		{
			re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
			parse: function(execResult) {
				return [
				2.55 * execResult[1],
				2.55 * execResult[2],
				2.55 * execResult[3],
				execResult[4]
				];
			}
		},
		{
			re: /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
			parse: function(execResult) {
				return [
				parseInt(execResult[1], 16),
				parseInt(execResult[2], 16),
				parseInt(execResult[3], 16)
				];
			}
		},
		{
			re: /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/,
			parse: function(execResult) {
				return [
				parseInt(execResult[1] + execResult[1], 16),
				parseInt(execResult[2] + execResult[2], 16),
				parseInt(execResult[3] + execResult[3], 16)
				];
			}
		},
		{
			re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
			space: 'hsla',
			parse: function(execResult) {
				return [
				execResult[1] / 360,
				execResult[2] / 100,
				execResult[3] / 100,
				execResult[4]
				];
			}
		}
		],
		template: '<div class="colorpicker dropdown-menu">' +
							'<div class="colorpicker-saturation"><i><b></b></i></div>' +
							'<div class="colorpicker-hue"><i></i></div>' +
							'<div class="colorpicker-alpha"><i></i></div>' +
							'<div class="colorpicker-color"><div /></div>' +
							'</div>'
	};

	return Color;

});
