/*!
 * main.js
 *
 */
 
(function ($, window, undefined) {
	$(window).on('load', function(){
		$('#sample1-1 > p').zoomEffect({
			scale: 1.5
		});
	});

	$(window).on('load', function(){
		$('#sample2-1 > p').zoomEffect({
			 scale: 2.5 //{number} - 拡大サイズ
			,speed: 200 //{number} - animation speed
			,easing: 'swing' //{string} (swing | linear) - animation easing effect
			,scaleClass: 'mod-zoomEffect-scale' //{string} - 上に被せるelementのclass
			,scaleOnClass: 'mod-zoomEffect-scaleOn' //{string} - 上に被せるelementのmouse over class
			,scaleOffClass: 'mod-zoomEffect-scaleOff' //{string} - 上に被せるelementのmouse out class
			,baseZIndex: 100 //{number} - 関連する全てのelementに付与するz-index。hover時にこの値を元にz-indexが調整される
		});
	});

	$(window).on('load', function(){
		$('#sample3-1 > p').zoomEffect({
			 scale: 0.5
			,scaleOnCallback: function () {alert('after scale on callback!');} //{function} - run callback function after scale on animation
			,scaleOffCallback: function () {alert('after scale off callback!');} //{function} - run callback function after scale off animation
		});
	});

})(jQuery, this)
