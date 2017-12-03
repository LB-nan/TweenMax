var run = {};
//初始化
run.init = function(){
	run.resize();//设置每一屏的高度和top值
	
	run.events(); //配置事件函数方法
	
	run.configNav();//配置首屏的动画
	
	run.button3D(".start",".state1",".state2",0.3);//初始化3D函数
	
	$('body').height(8500);
}

//页面加载完后初始化
$(document).ready(run.init);

//配置事件函数方法
run.events = function(){
	//在窗口改变的时候给每一屏重新赋值
	$(window).resize( run.resize() );
	
	//执行导航的交互
	run.nav();
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
	initAnimate.to('body',0,{'overflow-y':'scroll'});
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
	btnAnimate.to($(obj).find(elem1),0,{rotationX:0,transformPerspective:600,transformOrgin:"center bottom"});
	btnAnimate.to($(obj).find(elem2),0,{rotationX:-90,transformPerspective:600,transformOrgin:"top center"});
	
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
	
	//设置响应
	if( $(window).width() <= 950 ){
		$("body").addClass("r950");
		$(".menu").css("top",0);
	}else{
		$("body").removeClass("r950");
		$(".menu").css("top",22);
	}
}
