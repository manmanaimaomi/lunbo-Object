(function (){
	window.Carousel = Carousel;
	
	function Carousel(JSON){
		/*父层*/
		this.$dom = document.getElementById(JSON.id);

		/*初始化所有DOM节点:*/
		this.$imagesUl = null;
		this.$imagesULis = null;
		this.$leftBtn = null;
		this.$rightBtn = null;
		this.$circleOl = null;
		this.$circleLis = null;

		/*获取宽度 高度 运动时间 绑定事件类型 autoPlay计时器*/
		this.width = JSON.width;
		this.height = JSON.height;
		this.interval = JSON.interval;
		this.event = JSON.ev;
		this.timer = null;

		/*获取滚动图片的长度 图片*/
		this.pictureLength = JSON.images.length;
		this.images = JSON.images;


		/*信号量*/
		this.indx = 0;

		/*初始化*/
		this.init();

		/*绑定事件:*/
		this.bindEvent();

		/*自动轮播*/
		if( JSON.autoPlay ){
			this.autoPlay();
		}		
	}
	Carousel.prototype.init = function (){
		/*创建ul节点:*/
		this.$imagesUl = document.createElement('ul');
		this.$dom.appendChild(this.$imagesUl);
		/*创建li节点:*/
		for( var i = 0; i < this.pictureLength; i++ )
		{
			var li = document.createElement('li');
			li.innerHTML = '<img src="'+this.images[i]+'" />';
			this.$imagesUl.appendChild(li);
		}
		this.$imagesUlis = this.$imagesUl.querySelectorAll('li');

		/*布局:*/
		this.$dom.style.cssText = 'position:relative;overflow:hidden';
		this.$dom.style.width = this.width + "px";
		this.$dom.style.height = this.height + "px";
		/*猫腻 藏起来*/
		for( var j = 0; j < this.pictureLength; j++ )
		{
			this.$imagesUlis[j].style.cssText = 'position:absolute;top:0';
			this.$imagesUlis[j].style.left = this.width + 'px';
			this.$imagesUlis[j].children[0].style.width = this.width + "px";
			this.$imagesUlis[j].children[0].style.height = this.height + "px";
		}
		this.$imagesUlis[0].style.left = 0;

		/*创建按钮:*/
		this.$leftBtn = document.createElement('a');
		this.$leftBtn.setAttribute('href','javascript:;');
		this.$leftBtn.className = 'leftBtn';
		this.$rightBtn = document.createElement('a');
		this.$rightBtn.setAttribute('href','javascript:;');
		this.$rightBtn.className = 'rightBtn';
		this.$dom.appendChild(this.$leftBtn);
		this.$dom.appendChild(this.$rightBtn);

		/*创建小圆点:*/
		this.$circleOl = document.createElement('ol');
		this.$circleOl.className = 'circles';
		this.$dom.appendChild(this.$circleOl);
		for( var i = 0; i < this.pictureLength; i++ )
		{
			var li = document.createElement('li');
			this.$circleOl.appendChild(li);
		}
		this.$circleLis = this.$circleOl.querySelectorAll('li');
		this.$circleLis[0].className = 'cur';
	}
	/*添加事件绑定:*/
	Carousel.prototype.bindEvent = function (){
		/*给左右按钮绑定事件*/
		this.$rightBtn.onclick = this.showNext.bind(this);
		this.$leftBtn.onclick = this.showPrev.bind(this);
		
		/*给小圆点绑定事件:*/
		for( var i = 0; i < this.pictureLength; i++ )
		{
			(function (i){
				this.$circleLis[i]['on'+this.event] = this.gotoIndx.bind(this,i);
			}).bind(this)(i);						
		}
	}
	/*去到哪一张图*/

	Carousel.prototype.gotoIndx = function (i){

		this.clearEvent(); /*清空所有的事件绑定*/

		var old = this.indx;
		this.indx = i;
		if( this.indx==old )
		{	/*如果老值和新值相等就结束执行*/
			return;
		}
		
		/*如果当前信号量大于old 应该往左动*/
		if( this.indx > old )
		{
			this.startMove(this.$imagesUlis[old],{left:-this.width},null,30);

			this.$imagesUlis[this.indx].style.left = this.width + "px";
			this.startMove(this.$imagesUlis[this.indx],{left:0},function (){
				
				this.bindEvent(); /*动画运动完毕后再进行添加*/

			}.bind(this),25);
		}else{
			/*如果当前信号量大于old 应该往右动*/
			this.startMove(this.$imagesUlis[old],{left:this.width},null,30);

			this.$imagesUlis[this.indx].style.left = -this.width + "px";
			this.startMove(this.$imagesUlis[this.indx],{left:0},function (){

				/*给小圆点绑定事件:*/
				this.bindEvent(); /*动画运动完毕后再进行添加*/

			}.bind(this),25);
		}
		/*改变小圆点样式*/
		this.changeCircleCur();
	}
	/*下一张图*/
	Carousel.prototype.showNext = function (){
		
		this.clearEvent(); /*清空所有的事件绑定*/

		var old = this.indx; /*存储上一张图的index*/
		this.indx++;
		if( this.indx > this.pictureLength-1 )
		{
			this.indx = 0;
		}
		/*让上一张图的left运动到-this.width*/
		this.startMove(this.$imagesUlis[old],{left:-this.width},null,30);

		/*让当前选中的这张图的left运动到0*/
		this.$imagesUlis[this.indx].style.left = this.width + "px";

		this.startMove(this.$imagesUlis[this.indx],{left:0},function (){

			this.bindEvent(); /*动画运动完毕后再进行添加*/

		}.bind(this),25);
		/*改变小圆点样式*/
		this.changeCircleCur();
	}
	/*上一张图*/
	Carousel.prototype.showPrev = function (){
		
		this.clearEvent(); /*清空所有的事件绑定*/

		var old = this.indx; /*存储上一张图的index*/
		this.indx--;
		if( this.indx < 0 )
		{
			this.indx = this.pictureLength-1;
		}

		/*让上一张图的left运动到-this.width*/
		this.startMove(this.$imagesUlis[old],{left:this.width},null,30);
		/*让当前选中的这张图的left运动到0*/
		this.$imagesUlis[this.indx].style.left = -this.width + "px";

		this.startMove(this.$imagesUlis[this.indx],{left:0},function (){

			this.bindEvent(); /*动画运动完毕后再进行添加*/
			
		}.bind(this),25);

		/*改变小圆点样式*/
		this.changeCircleCur();
	}
	/*切换小图圆点样式:*/
	Carousel.prototype.changeCircleCur = function (){
		for( var i = 0; i < this.pictureLength; i++ )
		{
			this.$circleLis[i].className = '';
		}
		this.$circleLis[this.indx].className = 'cur';
	}
	/*清除所有事件绑定*/
	Carousel.prototype.clearEvent = function (){
		this.$leftBtn.onclick = null;
		this.$rightBtn.onclick = null;
		/*先清空所有li身上的事件,当动画运动完毕以后再进行添加*/
		for( var i = 0; i < this.pictureLength; i++ )
		{
			(function (i){
				this.$circleLis[i]['on'+this.event] = null;
			}).bind(this)(i);
		}
	}
	Carousel.prototype.autoPlay = function (){
		this.timer = setInterval(this.showNext.bind(this),this.interval);
		this.enterEvent();
	}
	Carousel.prototype.enterEvent = function (){
		var _this = this;
		this.$dom.onmouseenter = function (){
			
			clearInterval(_this.timer);
		}
		this.$dom.onmouseleave = function (){
			
			_this.timer = setInterval(_this.showNext.bind(_this),_this.interval);
		}
	}
	/*运动函数*/
	Carousel.prototype.startMove = function (obj,json,fnEnd,_time){
		var _this = this;
		clearInterval(obj.time);
		obj.time = setInterval(function (){
			var stop = true; //假设没有不到终点的值了;
			for( attr in json ){
				var speed = 0;
				if( attr=='opacity' ){
					style = Math.round(parseFloat(_this.getStyle(obj,attr))*100);
					speed = (json[attr] - style)/5;
				}else{
					style = parseInt(_this.getStyle(obj,attr));
					speed = (json[attr]-style)/5;
				};			
				speed = speed >0 ? Math.ceil(speed):Math.floor(speed);
				if(style!=json[attr]){
					stop = false;//意思就是说如果设置的样式的值其中有有到终点的 就把stop变成false;
				}
				if( attr=="opacity" ){
					obj.style.opacity = (style+speed)/100;
					obj.style.filter = "alpha(opacity="+(style+speed)+")";
				}else{
					obj.style[attr] = parseInt(_this.getStyle(obj,attr)) + speed + "px";
				}
			};
			if(stop){ //判断如果stop还是true的情况下,说明没有不到终点的值;
				clearInterval(obj.time);
				if(fnEnd)fnEnd();
			}
		},_time);
	}
	/*获取非行间style*/
	Carousel.prototype.getStyle = function (obj,cur){
		if( obj.currentStyle ){
			return obj.currentStyle[cur];
		}else{
			return getComputedStyle(obj,false)[cur];
		}
	}
})()