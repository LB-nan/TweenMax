# TweenMax网站首页面

## 练习之做  预览：https://oldpubcat.github.io/TweenMax/

> 用到的库 ：  TweenMax  jQuery  jQuery-mousewheel

* 我把滚动条显示关闭了，开启的话可以在js代码中把下面代码的注释解开就好。
 
     `initAnimate.to('body',0,{'overflow-y':'scroll'});`
     
## 关于TweenMax的方法：
>  可以通过`var animate = new TimelineMax()`得到一个实例。

> to()方法：参数：1、元素选择器；2、持续时间；3、对象`attr : value`;4、动画的延迟时间（可选），值为 “-=0.5”/"+=0.5"。

> stop()：停止动画、play()：开始动画、reverse()：反向开始动画、使用，例： `animate.stop();`  

> onComplete()：运动结束后触发对应的函数，在to()方法的第三个属性里面添加。
> 例 `
  animate.to({},0,{onComplete:function(){
   //要执行的某些行为 
  }})
`
> onReverseComplete()：反向运动结束后触发对应的函数. 
> 例 `
  animate.to({},0,{onReverseComplete:function(){
   //要执行的某些行为 
  }})
`
