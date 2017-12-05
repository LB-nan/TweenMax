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

> add():添加一个状态，参数一个字符串或者函数。


> TweenTo():完成指定的动画,有过度效果，参数是add()方法添加的状态。

> seek():完成指定的动画，无过度。参数：1.指定的状态或者函数、2.true（默认，不执行函数）、false（执行函数）。

> time():获得动画已执行的时间

> clear():清除所有动画

> staggerTo()：添加动画,参数：1.元素选择器或对象、2.持续时间、3.对象（变化的属性：值）、4.可选，动画的延迟时间，"-=0.1","+=0.1"

> totalDuration()：获取动画的总时长

> getLabelTime()：返回从开始到当前状态的时间  参数：状态的字符串，返回一个数字

> currentLabel()：获取当前状态,返回是状态的字符串

> getLabelAfter()：获取下一个状态,参数：时间数字，如果没有就返回null。

> getLabelBefore()：获取上一个状态,参数：时间数字，如果没有就返回null。

> ease：动画运动形式.

