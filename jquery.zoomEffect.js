/*!
 * jquery.zoomEffect.js
 *
 * @varsion   1.0
 * @require   jquery.js
 * @create    2012-10-31
 * @modify    2012-11-01
 * @author    rin316 [Yuta Hayashi]
 * @link      https://github.com/rin316/jquery.zoomEffect/
 */
;(function ($, window, undefined) {

var ZoomEffect
	, DEFAULT_OPTIONS
	;

/**
 * DEFAULT_OPTIONS
 */
DEFAULT_OPTIONS = {
	 scale: 1.5 //{number} - 拡大サイズ
	,speed: 500 //{number} - animation speed
	,scaleClass: 'mod-zoomEffect-scale' //{string} - 上に被せるelementのclass
	,scaleOnClass: 'mod-zoomEffect-scaleOn' //{string} - 上に被せるelementのmouse over class
	,scaleOffClass: 'mod-zoomEffect-scaleOff' //{string} - 上に被せるelementのmouse out class
	,baseZIndex: 1 //{number} - 関連する全てのelementに付与するz-index。hover時にこの値を元にz-indexが調整される
};

/**
 * ZoomEffect
 */
ZoomEffect = function ($element, options) {
	var self = this;

	self.o = $.extend({}, DEFAULT_OPTIONS, options);

	self.$wrapper = $element;
	self.$element = self.$wrapper.children().eq(0);
	self.offW = self.$element.width();
	self.offH = self.$element.height();
	self.onW  = self.offW * self.o.scale;
	self.onH  = self.offH * self.o.scale;
	self.onLeft  = (self.offW - self.onW) / 2;
	self.onTop  = (self.offH - self.onH) / 2;
	self.animationFlag  = false;
	
	self.init();
};


/**
 * ZoomEffect.prototype
 */
ZoomEffect.prototype = {
	/**
	 * init
	 */
	init: function () {
		var self = this;

		//mouseenter, mouseleave Event
		self.$element.on({
			'mouseenter':function(){
				//$cloneElementが無ければ$elementをcloneして上に被せる
				if(! self.$cloneElement) {
					self.makeElement();
					self.setClass('init');
					self.setStyle('init');
				}

				//clone elementにhoverイベントを設定
				self.$cloneElement.on({
					'mouseenter':function(){
						self.setClass('scaleOn');
						self.setStyle('scaleOn');
						self.animate('scaleOn');
					},
					'mouseleave':function(){
						self.setClass('scaleOff');
						self.setStyle('scaleOff');
						self.animate('scaleOff');
					}
				});
			}

		});

	}
	,

	/**
	 * makeElement
	 * $elementをcloneして$cloneElementを作成、$elementの上に被せる
	 */
	makeElement: function () {
		var self = this;

		self.$cloneElement = self.$element.clone()
			.appendTo(self.$wrapper)
		;
	}
	,

	/**
	 * setStyle
	 * set css style on html element
	 */
	setStyle: function (scaleState) {
		var self = this;

		switch (scaleState){
			case 'init':
				self.$wrapper.css({
					 position: 'relative'
					,zIndex: self.o.baseZIndex
				});

				self.$element.css({
					 visibility: 'hidden'
					,zIndex: self.o.baseZIndex
				});

				self.$cloneElement.css({
					 position: 'absolute'
					,top: 0
					,left: 0
					,maxWidth: 'none'
					,zIndex: self.o.baseZIndex + 1
				});
				break;

			case 'scaleOn':
				self.$wrapper.css({
					zIndex: self.o.baseZIndex + 2
				});
				break;

			case 'scaleOff':
				self.$wrapper.css({
					zIndex: self.o.baseZIndex
				});
				break;
		}
	}
	,

	/**
	 * setClass
	 * set class on html element
	 */
	setClass: function (scaleState) {
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

		self.$cloneElement.addClass(_addClass);
		self.$cloneElement.removeClass(_removeClass);
	}
	,

	/**
	 * animate
	 * fadeアニメーション
	 * @param {string} scale -
	 */
	animate: function (scaleState) {
		var self = this
			,prop = {};

		self.animationFlag  = true;

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

		self.$cloneElement.stop(true,false).animate(prop, self.o.speed, function () {
			self.animationFlag  = false;
		});
	}

};//ZoomEffect.prototype


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
