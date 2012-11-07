/*!
 * jquery.zoomEffect.js
 *
 * @varsion   1.0
 * @require   jquery.js
 * @create    2012-10-31
 * @modify    2012-11-07
 * @author    rin316 [Yuta Hayashi] - http://5am.jp/
 * @link      https://github.com/rin316/jquery.zoomEffect/
 */
;(function ($, window, undefined) {
'use strict'

var ZoomEffect
	,DEFAULT_OPTIONS
	;

/**
 * DEFAULT_OPTIONS
 */
DEFAULT_OPTIONS = {
	 scale: 1.5 //{number} - 拡大サイズ
	,speed: 400 //{number} - animation speed
	,easing: 'swing' //{string} (swing | linear) - animation easing effect
	,scaleClass: 'mod-zoomEffect-scale' //{string} - 上に被せるelementのclass
	,scaleOnClass: 'mod-zoomEffect-scaleOn' //{string} - 上に被せるelementのmouse over class
	,scaleOffClass: 'mod-zoomEffect-scaleOff' //{string} - 上に被せるelementのmouse out class
	,baseZIndex: 1 //{number} - 関連する全てのelementに付与するz-index。hover時にこの値を元にz-indexが調整される
	,scaleOnCallback: function () {} //{function} - run callback function after scale on animation
	,scaleOffCallback: function () {} //{function} - run callback function after scale off animation
};

/**
 * ZoomEffect
 */
ZoomEffect = function ($element, options) {
	var self = this;

	self.o = $.extend({}, DEFAULT_OPTIONS, options);

	self.$wrapper = $element;
	self.$element = self.$wrapper.children().eq(0);
	self.$allElement = self.$element.add(self.$wrapper);
	self.offW = self.$element.width();
	self.offH = self.$element.height();
	self.onW  = self.offW * self.o.scale;
	self.onH  = self.offH * self.o.scale;
	self.onLeft  = (self.offW - self.onW) / 2;
	self.onTop  = (self.offH - self.onH) / 2;
	self.scaleOnCallback = (typeof self.o.scaleOnCallback === 'function') ? self.o.scaleOnCallback : function () {};
	self.scaleOffCallback = (typeof self.o.scaleOffCallback === 'function') ? self.o.scaleOffCallback : function () {};
	self.isAnimation = false;

	self.init();
};


/**
 * ZoomEffect.prototype
 */
(function (fn) {
	/**
	 * init
	 */
	fn.init = function () {
		var self = this
			,$targetElement;

		//mouseenter, mouseleave Event
		self.$element.on({
			'mouseenter':function () {
				self.$element.off('mouseenter');

				//$elementをcloneして上に被せる
				self.$scalingElement = self.makeElement();
				self.$allElement = self.$allElement.add(self.$scalingElement);

				//scaleが1より小さい時に$elementをcloneしてタッチ判定用のElementを作る
				if (self.o.scale < 1) {
					self.$touchAreaElement = self.makeElement();
					self.$allElement = self.$allElement.add(self.$touchAreaElement);
				}

				// bind mouseenter target element
				$targetElement = (self.o.scale < 1) ? self.$touchAreaElement : self.$scalingElement;

				self.setClass('init');
				self.setStyle('init');

				$targetElement.on({
					'mouseenter':function () {
						self.setClass('scaleOn');
						self.setStyle('scaleOn');
						self.animate('scaleOn', function () {
							self.scaleOnCallback();
						});
					},
					'mouseleave':function(){
						self.setClass('scaleOff');
						self.setStyle('scaleOff');
						self.animate('scaleOff', function () {
							self.setStyle('scaleOffEnd');
							self.scaleOffCallback();
						});
					}
				});
			}

		});
	};

	/**
	 * makeElement
	 * $elementをcloneして新たなelementを作成、$wrapper内に挿入
	 */
	fn.makeElement = function () {
		var self = this;

		return self.$element.clone()
			.appendTo(self.$wrapper);
	};

	/**
	 * setStyle
	 * set css style on html element
	 */
	fn.setStyle = function (scaleState) {
		var self = this;

		switch (scaleState){
			case 'init':
				self.$wrapper.css({
					 position: 'relative'
				});

				self.$element.css({
					opacity: 0.001
				});

				self.$scalingElement.css({
					 position: 'absolute'
					,top: 0
					,left: 0
					,maxWidth: 'none'
				});

				if (self.$touchAreaElement){
					self.$touchAreaElement.css({
						 position: 'absolute'
						,top: 0
						,left: 0
						,opacity: 0.001
					});
				}

				self.$allElement.css({
					zIndex: self.o.baseZIndex
				});
				break;

			case 'scaleOn':
				self.$allElement.css({
					zIndex: self.o.baseZIndex + 2
				});
				break;

			case 'scaleOff':
				self.$allElement.css({
					zIndex: self.o.baseZIndex + 1
				});
				break;

			case 'scaleOffEnd':
				self.$allElement.css({
					zIndex: self.o.baseZIndex
				});
				break;
		}
	};

	/**
	 * setClass
	 * set class on html element
	 */
	fn.setClass = function (scaleState) {
		var self = this
			,_addClass
			,_removeClass
			;

		switch (scaleState){
			case 'init':
				_addClass = self.o.scaleClass;
				_removeClass = false;
				break;

			case 'scaleOn':
				_addClass = self.o.scaleOnClass;
				_removeClass = self.o.scaleOffClass;
				break;

			case 'scaleOff':
				_addClass = self.o.scaleOffClass;
				_removeClass = self.o.scaleOnClass;
				break;
		}

		self.$scalingElement.addClass(_addClass);
		self.$scalingElement.removeClass(_removeClass);
	};

	/**
	 * animate
	 * fadeアニメーション
	 * @param {string} scale -
	 */
	fn.animate = function (scaleState, callback) {
		var self = this
			,prop = {}
			;

		self.isAnimation = true;

		switch (scaleState){
			case 'scaleOn':
				prop = {
					 width  : self.onW + 'px'
					,height : self.onH + 'px'
					,left   : self.onLeft + 'px'
					,top    : self.onTop + 'px'
				}
				break;

			case 'scaleOff':
				prop = {
					 width  : self.offW + 'px'
					,height : self.offH + 'px'
					,left   : 0
					,top    : 0
				}
				break;
		}

		self.$scalingElement.stop(true,false).animate(
			prop,
			{
				 duration: self.o.speed
				,easing: self.o.easing
				,complete: function () {
					self.isAnimation = false;
					callback();
				}
			}
		);
	};
})(ZoomEffect.prototype);//ZoomEffect.prototype


/**
 * $.fn.ZoomEffect
 */
$.fn.zoomEffect = function (options) {
	return this.each(function () {
		var $this = $(this);
		$this.data('zoomEffect', new ZoomEffect($this, options));
	});
};//$.fn.ZoomEffect


})(jQuery, this);
