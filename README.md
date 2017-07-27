## JoyStick

基于LayaAir的简单虚拟摇杆模块

#### 在线Demo

![在线Demo](http://otqdp8v1k.bkt.clouddn.com/laya_demo_joystick_qr.png)

#### 基本用法

```javascript
var j = new JoyStick();
j.pos(0, Laya.stage.height-400);
j.setTouchSize(Laya.stage.width/2, 400);
j.setOriginPos(150, 150);
j.setImg('joystick/button.png','joystick/background.png','joystick/arrow.png');
j.fixRadius();
j.on('move',this,function(angle,rad){
    console.log(angle,rad);
});
Laya.stage.addChild(j);
```



#### 完整用法

```javascript
var j = new JoyStick();
j.pos(0, 300);
j.autoAlpha = true;//自动半透明.默认true
j.joystickAlpha = 0.4;//半透明值.默认0.4
j.fixedPosition = true;//固定位置.默认true
j.setRadius(100);//设置半径.默认100
j.setTouchSize(Laya.stage.width, 500);//设置可触摸区域.默认全屏
j.setOriginPos(Laya.stage.width/3, 250);//设置摇杆起始位置.默认正中
j.setImg('joystick/button.png','joystick/background.png','joystick/arrow.png');//设置图片
j.fixRadius();//修正半径
j.setDebug(true);//开启调试.默认不开启
j.on('down',this,function(){//按下监听
});
j.on('move',this,function(angle,rad){//滑动中监听
    console.log(angle,rad);
});
j.on('up',this,function(){//抬起监听
});
Laya.stage.addChild(j);
```

