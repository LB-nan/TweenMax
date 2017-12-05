var run = {};
run.timeScroll = null; //挂载整屏切换动画的实例
run.currentStep = "step1"; //加载页面后的第一个状态
//初始化
run.init = function(){
	run.resize();//设置每一屏的高度和top值
	
	run.events(); //配置事件函数方法
	
	run.configNav();//配置首屏的动画
	
	run.button3D(".start",".state1",".state2",0.3);//初始化3D函数
	run.button3D(".button1",".state1",".state2",0.3);//初始化3D函数
	run.button3D(".button2",".state1",".state2",0.3);//初始化3D函数
	
	//run.imgW($(".scene img")); //设置每一屏的宽度
	
	run.configTimeScroll();//配置整屏切换动画、每一屏中的小动画
	
	twoAnimate.init(); //执行第二屏的动画
	
	threeAnimate.init(); //第三屏动画
	
	fiveAnimate.init(); //第五屏动画
}

//页面加载完后初始化
$(document).ready( run.init );

//配置事件函数方法
run.events = function(){
	
	//设置滚动条的初始值
	$(window).bind("scroll",scrollFn);
	function scrollFn(){
		$(window).scrollTop(0);
	}
	
	//当鼠标按下的时候解绑掉scrollFn函数
	$(window).bind("mousedown",function(){
		$(window).unbind("scroll",scrollFn);
	});
	//当鼠标抬起的时候让让页面到达某一屏
	$(window).bind("mouseup",run.mouseupFn);
	
	//执行导航的交互
	run.nav();
	
	//干掉浏览器默认行为
	$('.wrapper').bind("mousewheel",function(ev){
		if($(window).width() > 780){
			ev.preventDefault();
		}
		
	})
	
	//滚动条滚动的时候计算页面该到的地方
	$(window).bind("scroll",run.scrollStatus);
	
	
	//重新写滚轮事件
	var timer = null;
	$('.wrapper').one("mousewheel",mousewheelFn);
	function mousewheelFn(ev,direction){
		$(window).unbind("scroll",scrollFn);
		if(direction < 1){ // ↓
			run.changeStep('next');
		}else{ // ↑
			run.changeStep('prev')
		}
		clearTimeout(timer);
		timer = setTimeout(function(){
			if($(window).width() > 780){
				$('.wrapper').one("mousewheel",mousewheelFn);
			}
			
		},800)
	}
	
	
	//在窗口改变的时候给每一屏重新赋值
	$(window).resize( run.resize );
};

//当鼠标抬起的时候让让页面到达某一屏
run.mouseupFn = function(){
	//计算滚动条在滚动过程中的一个比例
	var sca = run.scale();
	//计算当前页面到达的某个时间点
	var times = sca * run.timeScroll.totalDuration();
	//获取当前时间点的上一个状态和下一个状态
	var prevStep = run.timeScroll.getLabelBefore(times);
	var nextStep = run.timeScroll.getLabelAfter(times);
	//获取到上一个和下一个状态的时间
	var prevTime =  run.timeScroll.getLabelTime(prevStep);
	var nextTime =  run.timeScroll.getLabelTime(nextStep);
	//计算差值
	var prevDvalue = Math.abs( prevTime - times );
	var nextDvalue = Math.abs( nextTime - times );
	
	var step = '';
	if(sca === 0){
		step ="step1";
	}else if(sca === 1){
		step ="footer";
	}else if(prevDvalue < nextDvalue){
		step = prevStep;
	}else{
		step = nextStep;
	}
	
	run.timeScroll.tweenTo(step);
	
	//------------------------当松开鼠标的时候，滚动条滚到某个状态计算出来的距离------------------
	//获取动画的总时长
	var totalTime = run.timeScroll.totalDuration();
	//获取当前要到达的状态的时间
	var afterTime = run.timeScroll.getLabelTime(step);
	//获取到滚动条可以滚的最大高度
	var maxH = $('body').height() - $(window).height();
	//计算出滚动条滚动的距离
	var positionY = afterTime/totalTime * maxH ;
	//计算出滚动距离的持续时间
	var d = Math.abs(run.timeScroll.time() - afterTime);
	//给滚动条滚动
	var scrollAnimate = new TimelineMax();
	scrollAnimate.to('html,body',d,{scrollTop:positionY});
	//更新状态
	run.currentStep = step;
};

//计算滚动条在滚动过程中的一个比例
run.scale = function(){
	var scrollT = $(window).scrollTop(); //滚动了的距离
	var MaxH = $('body').height() - $(window).height(); //滚动的最大距离
	var s = scrollT/MaxH; //比例
	return s;
}


//滚动条滚动的时候计算页面该到的地方
run.scrollStatus = function(){
	var times = run.scale() * run.timeScroll.totalDuration();
	run.timeScroll.seek(times,false);
}

//整屏切换并且计算滚动条的距离
run.changeStep = function(value){
	if(value == "next"){
		// 获取到当前的时间
		var currentTime = run.timeScroll.getLabelTime(run.currentStep);
		//获取到下一个状态的字符串
		var afterStep = run.timeScroll.getLabelAfter(currentTime);
		//防止到最后的时候仍然计算
		if(!afterStep){
			return;
		}
		//获取动画的总时长
		var totalTime = run.timeScroll.totalDuration();
		//获取到下一个状态的时间
		var afterTime = run.timeScroll.getLabelTime(afterStep);
		//获取到滚动条可以滚的最大高度
		var maxH = $('body').height() - $(window).height();
		//计算出滚动条滚动的距离
		var positionY = afterTime/totalTime * maxH ;
		//计算出滚动距离的持续时间
		var d = Math.abs(run.timeScroll.time() - afterTime);
		//给滚动条滚动
		var scrollAnimate = new TimelineMax();
		scrollAnimate.to('html,body',d,{scrollTop:positionY});
		
		//运动到下一个状态
		//run.timeScroll.tweenTo(afterStep);
		//记录当前的状态为下一个状态，方便切换
		run.currentStep = afterStep;
		
	}else{
		// 获取到当前的时间
		var currentTime = run.timeScroll.getLabelTime(run.currentStep);
		//获取到上一个状态的字符串
		var beforeStep = run.timeScroll.getLabelBefore(currentTime);
		if(!beforeStep){
			return;
		}
		//获取动画的总时长
		var totalTime = run.timeScroll.totalDuration();
		//获取到上一个状态的时间
		var beforeTime = run.timeScroll.getLabelTime(beforeStep);
		//获取到滚动条可以滚的最大高度
		var maxH = $('body').height() - $(window).height();
		//计算出滚动条滚动的距离
		var positionY = beforeTime/totalTime * maxH ;
		//计算出滚动距离的持续时间
		var d = Math.abs(run.timeScroll.time() - beforeTime);
		//给滚动条滚动
		var scrollAnimate = new TimelineMax();
		scrollAnimate.to('html,body',d,{scrollTop:positionY});
		//运动到上一个状态
		//run.timeScroll.tweenTo(beforeStep);
		//记录当前的状态为上一个状态，方便切换
		run.currentStep = beforeStep;
	}
};

//配置整屏切换动画、每一屏中的小动画
run.configTimeScroll = function(){
	var time = run.timeScroll ? run.timeScroll.time() : 0;
	if(run.timeScroll) run.timeScroll.clear();
	//把run.timeScroll 实例化
	run.timeScroll = new TimelineMax();
	
	//当从第二屏切换到第一屏的时候，让第二屏的动画时间点归0.
	run.timeScroll.to(".scene1",0,{onReverseComplete:function(){
		twoAnimate.timeline.seek(0,false);
	}},0);
	
	//让底部初始化
	run.timeScroll.to(".footer",0,{top:"100%"});
	
			run.timeScroll.add("step1"); //设置第一个状态
		run.timeScroll.to(".scene2",0.8,{top:0,ease:Cubic.easeInOut});
		run.timeScroll.to({},0.1,{onComplete:function(){
			menu.changeMenu('menu_state2'); //切换到第二屏调用的函数，同时传入导航条变化的class
		},onReverseComplete:function(){
			menu.changeMenu('menu_state1'); //第一屏
		}},"-=0.2");
		//当切换到第二屏的时候，翻转第二屏的第一个动画。
		run.timeScroll.to({},0,{onComplete:function(){
			twoAnimate.timeline.tweenTo("state1");
		}},"-=0.2");
		
			run.timeScroll.add("step2"); //设置第二个状态
			
			
		// ------------- 主动画中配置第二屏的小动画	start  ----------------
		run.timeScroll.to({},0,{onComplete:function(){
			twoAnimate.timeline.tweenTo("state2");
		},onReverseComplete:function(){
			twoAnimate.timeline.tweenTo("state1");
		}});
		
		run.timeScroll.to({},0.4,{});
		
			run.timeScroll.add("point1");
			
		run.timeScroll.to({},0,{onComplete:function(){
			twoAnimate.timeline.tweenTo("state3");
		},onReverseComplete:function(){
			twoAnimate.timeline.tweenTo("state2");
		}});
		
		run.timeScroll.to({},0.4,{});
		
			run.timeScroll.add("point2");
			
		run.timeScroll.to({},0,{onComplete:function(){
			twoAnimate.timeline.tweenTo("state4");
		},onReverseComplete:function(){
			twoAnimate.timeline.tweenTo("state3");
		}});
		
		run.timeScroll.to({},0.4,{});
		
			run.timeScroll.add("point3");
				
		// -------------- 主动画中配置第二屏的小动画	end ---------------
		
		
	
		run.timeScroll.to(".scene3",0.8,{top:0,ease:Cubic.easeInOut,onReverseComplete:function(){
			threeAnimate.timeline.seek(0,false);
		}});
		run.timeScroll.to({},0.1,{onComplete:function(){
			menu.changeMenu('menu_state3'); //切换到第二屏调用的函数，同时传入导航条变化的class
		},onReverseComplete:function(){
			menu.changeMenu('menu_state2'); //第一屏
		}},"-=0.2");
			
			run.timeScroll.to({},0.1,{onComplete:function(){
				threeAnimate.timeline.tweenTo("threeSate1");
			}},"-=0.2");
			
		run.timeScroll.add("step3"); //设置第三个状态   第三屏
			// ------------- 主动画中配置第三屏的小动画	start  ----------------
			
			run.timeScroll.to({},0,{onComplete:function(){
				threeAnimate.timeline.tweenTo("threeSate2");
			},onReverseComplete:function(){
				threeAnimate.timeline.tweenTo("threeSate1");
			}});
			
			run.timeScroll.to({},0.4,{});
			
			run.timeScroll.add("threeSate");

			
			// -------------- 主动画中配置第三屏的小动画	end ---------------
			

			
		run.timeScroll.to(".scene4",0.8,{top:0,ease:Cubic.easeInOut});
			//配置第四屏的动画
			
			run.timeScroll.add("step4"); //设置第四个状态
			
			//滚动到第五屏的时候，第四屏滚出屏幕外
		run.timeScroll.to(".scene4",0.8,{top:-$(window).height(),ease:Cubic.easeInOut});	
		
		if($(window).width()>950){
			run.timeScroll.to(".menu_wrapper",0.8,{top:-110,ease:Cubic.easeInOut},"-=0.8");
		}else{
			$(".menu_wrapper").css("top",0);
		}

		run.timeScroll.to(".scene5",0.8,{top:0,ease:Cubic.easeInOut,onReverseComplete:function(){
			fiveAnimate.timeline.seek(0,false);
		}},"-=0.8");
		
		run.timeScroll.to({},0.1,{onComplete:function(){
			fiveAnimate.timeline.tweenTo("fiveState");
		}},"-=0.2");
			run.timeScroll.add("step5"); //设置第五个状态
			
		run.timeScroll.to(".scene5",0.5,{top:-$(".footer").height(),ease:Cubic.easeInOut});
		run.timeScroll.to(".footer",0.5,{top:$(window).height()-$(".footer").height() ,ease:Cubic.easeInOut},"-=0.5");
			run.timeScroll.add("footer");
		
		run.timeScroll.stop();
		//当改变浏览器的大小时候，就让动画走到之前的时间点
		run.timeScroll.seek(time);
}

//配置首屏的动画
run.configNav = function(){
	//实例一个TweenMax的对象
	var initAnimate = new TimelineMax();
	//设置导航的动画
	initAnimate.to('.menu',0.5,{opacity:1} );
	initAnimate.to('.menu',0.5,{left:22},"-=0.3" );
	initAnimate.to('.nav',0.5,{opacity:1} );
	//设置首屏的动画
	initAnimate.to('.scene1_logo',0.5,{opacity:1});
	initAnimate.staggerTo('.scene1_1 img',2,{opacity:1,rotationX:0,ease:Elastic.easeOut},0.2);
	initAnimate.to('.light_left',0.7,{rotationZ:0,ease:Cubic.easeOut},'-=2');
	initAnimate.to('.light_right',0.7,{rotationZ:0,ease:Cubic.easeOut},'-=2');
	initAnimate.to('.controls',0.5,{bottom:20,opacity:1},'-=0.7');
	//设置是否显示滚动条
	//initAnimate.to('body',0,{'overflow-y':'scroll'});
}

//导航条中的交互
run.nav = function(){
	var navAnimate = new TimelineMax();
	$('.nav a').bind('mouseenter',function(){
		var w = $(this).width();
		var l = $(this).offset().left;
		navAnimate.clear();
		navAnimate.to('.line',0.5,{opacity:1,width:w,left:l})
	});
	$('.nav a').bind('mouseleave',function(){
		navAnimate.clear();
		navAnimate.to('.line',0.5,{opacity:0})
	});
	var languageAnimate = new TimelineMax();
	//language的移入移出效果
	$(".language").bind('mouseenter',function(){
		languageAnimate.clear();
		languageAnimate.to('.dropdown',0.5,{opacity:1,"display":"block"});
	});
	$(".language").bind('mouseleave',function(){
		languageAnimate.clear();
		languageAnimate.to('.dropdown',0.5,{opacity:0,"display":"none"});
	});
	//左侧导航
	$(".btn_mobile").click(function(){
		var btnAnimate =  new TimelineMax();
		btnAnimate.to(".left_nav",0.5,{left:0})
	});
	//关闭左侧的导航
	$(".l_close").click(function(){
		var closeAnimate =  new TimelineMax();
		closeAnimate.to(".left_nav",0.5,{left:-300})
	})
};

//3D翻转效果  obj:对象，elem1：正面，elem2：背面，d：持续时间
run.button3D = function(obj,elem1,elem2,d){

	var btnAnimate = new TimelineMax();
	btnAnimate.to($(obj).find(elem1),0,{rotationX:0,transformPerspective:600,transformOrigin:"center bottom"});
	btnAnimate.to($(obj).find(elem2),0,{rotationX:-90,transformPerspective:600,transformOrigin:"top center"});

	$(obj).bind("mouseenter",function(){
		var enterAnimate = new TimelineMax();
		var ele1 = $(this).find(elem1);
		var ele2 = $(this).find(elem2);
		enterAnimate.to(ele1,d,{rotationX:90,top:-ele1.height(),ease:Cubic.easeInOut},0);
		enterAnimate.to(ele2,d,{rotationX:0,top:0,ease:Cubic.easeInOut},0);
		
	});
	
	
	$(obj).bind("mouseleave",function(){
		var leaveAnimate = new TimelineMax();
		var ele1 = $(this).find(elem1);
		var ele2 = $(this).find(elem2);
		leaveAnimate.to(ele1,d,{rotationX:0,top:0,ease:Cubic.easeInOut},0);
		leaveAnimate.to(ele2,d,{rotationX:-90,top:ele2.height(),ease:Cubic.easeInOut},0);
		
	});

}

//设置每一屏的高度和top值
run.resize = function(){

	//设置每一屏的高度为可视区的高度
	$(".scene").height( $(window).height() );
	//设置除了第一屏的其他屏的top值为可视区的高度
	$(".scene:not(':first')").css('top',$(window).height());
	run.configTimeScroll();
	
	//设置响应
	if($(window).width() <= 780){
		$(".wrapper").unbind();
		$(window).unbind("mousewheel");
		$(window).unbind("scroll");
		$(window).unbind("mousedown");
		$(window).unbind("mouseup");
		
		$("body").css("height","auto");
		$("body").addClass("r780 r950").css("overflow","scroll");
		
		$(".menu").css("top",0);
		$(".menu").css("transform","none");
		$(".menu_wrapper").css("top",0);
		$(".menu").removeClass("menu_state2");
		$(".menu").removeClass("menu_state3");
	}else if( $(window).width() <= 950 ){
		$('body').height(8500);
		$("body").removeClass("r780");
		$("body").addClass("r950");
		$(".menu").css("top",0);
		$(".menu").css("transform","none");
	}else{
		$("body").removeClass("r780 r950");
		$("body").removeClass("r950");
		$('body').height(8500);
		$(".menu").css("top",22);
		$(".left").css("left_nav",-300);
	}
}

//设置图片的百分比
run.imgW = function(imgE){
	imgE.each(function(){
		$(this).load(function(){
			var W = $(this).width();
			if($(window).width() <=950){
				$(this).css({
				width:"100%",
				"max-width" : W,
				height : "auto"
			})
			}
			
		})
	})
}


//配置第二屏动画
var twoAnimate = {};
twoAnimate.timeline = new TimelineMax();
//具体的第二屏的动画要实现的细节
twoAnimate.init = function(){
	twoAnimate.timeline.staggerTo(".scene2_1 img",1.5,{opacity:1,rotationX:0,ease:Elastic.easeOut},0.1);
	twoAnimate.timeline.to(".points",0.2,{bottom:20},"-=1");
	//初始的时候的第一个按钮
	twoAnimate.timeline.to(".scene2 .point0 .text",0.1,{opacity:1});
	twoAnimate.timeline.to(".scene2 .point0 .point_icon",0,{"background-position":"right top"});
	
		twoAnimate.timeline.add("state1");
	twoAnimate.timeline.staggerTo(".scene2_1 img",0.2,{opacity:0,rotationX:90});
	twoAnimate.timeline.to(".scene2_2 .left",0.4,{opacity:1});
	twoAnimate.timeline.staggerTo(".scene2_2 .right img",0.3,{opacity:1,rotationX:0,ease:Cubic.easeInOut},0,"-=0.4");
	
	//第二个按钮
	twoAnimate.timeline.to(".scene2 .point .text",0,{opacity:0},"-=0.4");
	twoAnimate.timeline.to(".scene2 .point1 .text",0.1,{opacity:1});
	twoAnimate.timeline.to(".scene2 .point .point_icon",0,{"background-position":"left top"},"-=0.4");
	twoAnimate.timeline.to(".scene2 .point1 .point_icon",0,{"background-position":"right top"},"-=0.4");
	
		twoAnimate.timeline.add("state2");
		
	twoAnimate.timeline.to(".scene2_2 .left",0.4,{opacity:0});
	twoAnimate.timeline.staggerTo(".scene2_2 .right img",0.3,{opacity:0,rotationX:90,ease:Cubic.easeInOut},0,"-=0.4");
	twoAnimate.timeline.to(".scene2_3 .left",0.4,{opacity:1});
	twoAnimate.timeline.staggerTo(".scene2_3 .right img",0.3,{opacity:1,rotationX:0,ease:Cubic.easeInOut},0,"-=0.4");
	
		//第三个按钮
	twoAnimate.timeline.to(".scene2 .point .text",0,{opacity:0},"-=0.4");
	twoAnimate.timeline.to(".scene2 .point2 .text",0.1,{opacity:1});
	twoAnimate.timeline.to(".scene2 .point .point_icon",0,{"background-position":"left top"},"-=0.4");
	twoAnimate.timeline.to(".scene2 .point2 .point_icon",0,{"background-position":"right top"},"-=0.4");
	
		twoAnimate.timeline.add("state3");
	
	twoAnimate.timeline.to(".scene2_3 .left",0.4,{opacity:0});
	twoAnimate.timeline.staggerTo(".scene2_3 .right img",0.3,{opacity:0,rotationX:90,ease:Cubic.easeInOut},0,"-=0.4");
	twoAnimate.timeline.to(".scene2_4 .left",0.4,{opacity:1});
	twoAnimate.timeline.staggerTo(".scene2_4 .right img",0.3,{opacity:1,rotationX:0,ease:Cubic.easeInOut},0,"-=0.4");
	
		//第三个按钮
	twoAnimate.timeline.to(".scene2 .point .text",0,{opacity:0},"-=0.4");
	twoAnimate.timeline.to(".scene2 .point3 .text",0.1,{opacity:1});
	twoAnimate.timeline.to(".scene2 .point .point_icon",0,{"background-position":"left top"},"-=0.4");
	twoAnimate.timeline.to(".scene2 .point3 .point_icon",0,{"background-position":"right top"},"-=0.4");
	
		twoAnimate.timeline.add("state4");
	
	twoAnimate.timeline.stop();
}

//配置第三屏动画
var threeAnimate = {};
threeAnimate.timeline = new TimelineMax();
//初始化第三屏
threeAnimate.init = function(){
	
	threeAnimate.timeline.to(".scene3 .step img",0,{rotationX:-90,opacity:0,transformPerspective:600,transformOrigin:"center center"});
	threeAnimate.timeline.staggerTo(".step3_1 img",0.2,{opacity:1,rotationX:0,ease:Cubic.easeInOut},0.1);
	
		threeAnimate.timeline.add("threeSate1");
	
	threeAnimate.timeline.to(".step3_1 img",0.3,{opacity:0,rotationX:-90,ease:Cubic.easeInOut});
	threeAnimate.timeline.to(".step3_2 img",0.3,{opacity:1,rotationX:0,ease:Cubic.easeInOut});
	
		threeAnimate.timeline.add("threeSate2");
	
	threeAnimate.timeline.stop();
}



//配置第五屏的动画
var fiveAnimate = {};
fiveAnimate.timeline = new TimelineMax();
//初始化第五屏动画
fiveAnimate.init = function(){
	fiveAnimate.timeline.to(".scene5 .area_content img, .scene5 .button1, .scene5 .button2",0,{rotationX:-90,transformPerspective:600,transformOrigin:"center center"});
	fiveAnimate.timeline.to(".scene5 .scene5_img",0,{top:-220});
	
	fiveAnimate.timeline.to(".scene5 .scene5_img",0.5,{top:0,ease:Cubic.easeInOut});
	fiveAnimate.timeline.staggerTo( ".scene5 .button1,.scene5 .button2,.scene5 .area_content img",1.2,{opacity:1,rotationX:0,ease:Elastic.easeOut},0.2 );
	fiveAnimate.timeline.to(".scene5 .lines",0.5,{opacity:1});
	
		fiveAnimate.timeline.add("fiveState");
	
	fiveAnimate.timeline.stop();
}



//实现导航3D翻转动画
var  menu = {};
//每滚动一次屏幕就调用这个函数，函数里面是3D翻转的具体实现过程
menu.changeMenu = function(stateClass){ //参数：切换到某一屏的时候要传入的class名字
	//具体实现翻转效果
	var oldMenu = $(".menu");
	var newMenu = oldMenu.clone();
	newMenu.removeClass("menu_state1").removeClass("menu_state2").removeClass("menu_state3");
	newMenu.addClass(stateClass);
	$(".menu_wrapper").append(newMenu);
	oldMenu.addClass("removeClass");
	run.nav();
	run.button3D(".start",".state1",".state2",0.3);
	var menuAnimate = new TimelineMax();
	if($(window).width() > 950){
		menuAnimate.to(newMenu,0,{top:100,rotationX:-90,transformPerspective:600,transformOrigin:"top center"});
	menuAnimate.to(oldMenu,0,{top:22,rotationX:0,transformPerspective:600,transformOrigin:"center bottom"});
	
	menuAnimate.to(oldMenu,0.3,{top:-55,rotationX:90,ease:Cubic.easeInOut,onComplete:function(){
		$('.removeClass').remove();
	}});
	menuAnimate.to(newMenu,0.3,{top:22,rotationX:0,ease:Cubic.easeInOut},"-=0.3");
	}
	
}
