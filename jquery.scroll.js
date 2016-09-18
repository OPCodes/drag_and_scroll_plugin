(function ($){

	function Scroll(element,scrollBox,content,main){

		this.element = element;
		this.scrollBox = scrollBox;
		this.content = content;
		this.main = main;

		this.disY = 0;
		// 滚动条滚动的top值
		this.t = 0;

		this.scale = 0;


		console.log(this.scrollBox.height(),this.element.outerHeight())

		this.init();
	}

	Scroll.prototype = {
		constructor: Scroll,
		init: function (ev){

		 	this.mouseWheel();
		 	
		 	this.element.on("mousedown",$.proxy(this.mouseDownFn,this));

			this.element.css("height",(this.main.height()/this.content.outerHeight()) * this.scrollBox.height());

			//滚动条能滚动的最大距离
			this.maxJL = this.scrollBox.height() - this.element.outerHeight();

		
			//content能走的最大的距离
			this.mainMaxJL = this.content.height() - this.main.height();

			if( this.main.height() >= this.content.outerHeight() ){
				this.scrollBox.css("display","none");
			}
		},
		mouseDownFn:function (ev){

			this.disY = ev.pageY - this.element.position().top;
			
			$(document).on("mousemove",$.proxy(this.mouseMoveFn,this));

			$(document).on("mouseup",$.proxy(this.mouseUpFn,this));

			return false;

		},
		mouseMoveFn: function (ev){

			console.log(this.t);

			this.t = ev.pageY - this.disY;

			if( this.t < 0 ){
				this.t = 0;
			}
			if( this.t > this.maxJL ){
				this.t = this.maxJL;
			}

			this.scale = this.t / this.maxJL;
			this.element.css("top",this.t);	
			this.content.css("top",-this.scale*this.mainMaxJL);	

		},
		mouseUpFn: function (ev){
			$(document).off("mousemove",this.moveFn);
			$(document).off("mouseup",this.upFn);
		},

		mouseWheel: function (){
			this.scrollBox.on("mousewheel DOM",$.proxy(this.wheelFunc,this));
		},
		wheelFunc:function (ev){
			this.wheelFn(ev);
		},
		wheelFn: function (ev){

			var direction = true;
			if(ev.originalEvent.wheelDelta){  //ie和chrome
				direction = ev.originalEvent.wheelDelta > 0 ? true : false;
			}else if(ev.originalEvent.detail){ //FF
				direction = ev.originalEvent.detail < 0 ? true : false;
			}

			if( direction ){  //向上
				this.upFn();
			}else{  //向下
				this.downFn();
			}

			ev.preventDefault();
		},

		
		upFn: function (){
			this.t = this.element.position().top - 10;
			if( this.t < 0 ) {
				this.t = 0;
			}
			this.scale = this.t / this.maxJL;
			this.element.css("top",this.t);
			this.content.css("top",-this.scale*this.mainMaxJL);
		},
		downFn: function (){
			this.t = this.element.position().top + 10;
			if( this.t > this.maxJL ) {
				this.t = this.maxJL;
			}
			this.scale = this.t / this.maxJL;
			this.element.css("top",this.t);
			this.content.css("top",-this.scale*this.mainMaxJL);
		}

	}

	$.fn.scrollFn = function (element,scrollBox,content,contentParent){
		new Scroll(this,scrollBox,content,contentParent);
	}


})(jQuery)