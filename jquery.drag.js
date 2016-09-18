(function ($){

	function Drag(element,optionsObj){

		// console.log(optionsObj.moveEle);
		// console.log( optionsObj.moveEle != "undefined")
		 
		// if( optionsObj.moveEle && optionsObj.moveEle != "undefined" ){
		// 	this.element = $(optionsObj.moveEle);
		// } else {
		// 	this.element = element;
		// 	console.log(this.element);
		// }
		
		this.element = element;

		this.defaultObj = {};

		this.defaultObj.limit = false;

		$.extend(true,this.defaultObj,optionsObj);

		console.log(this.defaultObj.moveEle && $(this.defaultObj.moveEle))

		this.target = this.defaultObj.moveEle && $(this.defaultObj.moveEle) || this.element;

		this.disX = 0;
		this.disY = 0;
		this.x = 0;
		this.y = 0;
		this.init();

	}

	Drag.prototype = {
		constructor:Drag,
		init: function (){
			this.element.on("mousedown",$.proxy(this.downFn,this));
			this.dragStatus = 0;
		},
		downFn: function (ev){
			this.disX = ev.pageX - this.element.offset().left;
			this.disY = ev.pageY - this.element.offset().top;

			$(document).on("mousemove",$.proxy(this.moveFn,this));
			$(document).on("mouseup",$.proxy(this.upFn,this));

			this.dragStatus = 1;
			this.statusFn();

			ev.preventDefault();
		},
		moveFn: function (ev){

			var minX,minY,maxX,maxY;
			this.x = ev.pageX - this.disX;
			this.y = ev.pageY - this.disY;

			this.dragRangeFn();

			this.target.css({
				left: this.x,
				top: this.y
			});

			this.dragStatus = 2;
			this.statusFn();

		},
		upFn: function (){

			$(document).off("mousemove",this.moveFn);
			$(document).off("mouseup",this.upFn);

			this.dragStatus = 3;
			this.statusFn();

		},
		statusFn: function (){
			switch( this.dragStatus ){
				case 1:
					this.element.trigger("dragStart");
				break;
				case 2:
					this.element.trigger("draging");
				break;
				case 3:
					this.element.trigger("dragEnd");
				break;
			}
		},
		dragRangeFn: function (){

			if( $.isPlainObject(this.defaultObj.x) || $.isPlainObject(this.defaultObj.y) ){
				minX = this.defaultObj.x.minX;
				minY = this.defaultObj.y.minY;
				maxX = this.defaultObj.x.maxX;
				maxY = this.defaultObj.y.maxY;
			} else {
				if( this.defaultObj.limit ){
					minX = 0;
					minY = 0;
					maxX = $(window).width() - this.target.outerWidth();
					maxY = $(window).height() - this.target.outerHeight();
				}
			}

			if( this.x < minX ){
				this.x = 0;
			}

			if( this.x > maxX ){
				this.x = maxX;
			}

			if( this.y < minY ){
				this.y = minY;
			}

			if( this.y > maxY ){
				this.y = maxY;
			}
		}
	}

	$.fn.drag = function (optionsObj){
		new Drag(this,optionsObj);
	}



})(jQuery);