/*
* 虚拟摇杆类JoyStick
* usage normal:
*        var j = new JoyStick();
*        j.pos(0, Laya.stage.height-400);
*        j.setTouchSize(Laya.stage.width/2, 400);
*        j.setOriginPos(150, 150);
*        j.setImg('joystick/button.png','joystick/background.png','joystick/arrow.png');
*        j.fixRadius();
*        j.on('move',this,function(angle,rad){
*            console.log(angle,rad);
*        });
*        Laya.stage.addChild(j);
*
*
* usage all api:
*        var j = new JoyStick();
*        j.pos(0, 300);
*        j.autoAlpha = true;//自动半透明.默认true
*        j.joystickAlpha = 0.4;//半透明值.默认0.4
*        j.fixedPosition = true;//固定位置.默认true
*        j.setRadius(100);//设置半径.默认100
*        j.setTouchSize(Laya.stage.width, 500);//设置可触摸区域.默认全屏
*        j.setOriginPos(Laya.stage.width/3, 250);//设置摇杆起始位置.默认正中
*        j.setImg('joystick/button.png','joystick/background.png','joystick/arrow.png');//设置图片
*        j.fixRadius();//修正半径
*        j.setDebug(true);//开启调试.默认不开启
*        j.on('down',this,function(){//按下监听
*        });
*        j.on('move',this,function(angle,rad){//滑动中监听
*            console.log(angle,rad);
*        });
*        j.on('up',this,function(){//抬起监听
*        });
*        Laya.stage.addChild(j);
*/
var JoyStick = (function (_super) {

    function JoyStick() {
        JoyStick.super(this);

        this._touchId = -1;
        this._radius = 100;
        this._lastRad = -999;
        this._lastAngle = -999;
        this._debug = false;
        this._curPos = new Laya.Point(0, 0);
        this._originPos = new Laya.Point(Laya.stage.width/2, Laya.stage.height/2);
        this._touchWidth = Laya.stage.width;
        this._touchHeight = Laya.stage.height;
        this._buttonImg = null;
        this._backgroundImg = null;
        this._arrowImg = null;
        this._debugColor = '#7ED321';
        this._debugTouchAreaColor = '#D8D8D8';

        this.autoAlpha = true;
        this.joystickAlpha = 0.4;
        this.fixedPosition = true;
        this.arrow = new Laya.Sprite();
        this.button = new Laya.Sprite();
        this.background = new Laya.Sprite();

        this._init();
    }

    Laya.class(JoyStick, 'JoyStick', _super);
    
    var __proto__ = JoyStick.prototype;

    __proto__._init = function () {
        this.setTouchSize();
        this.addChild(this.background);
        this.addChild(this.button);
        this.addChild(this.arrow);
        this.arrow.visible = false;
        if(this.autoAlpha){
            this.alpha = this.joystickAlpha;
        }

        this.on(Laya.Event.MOUSE_DOWN, this, this.onTouchDown);
        this.on(Laya.Event.MOUSE_MOVE, this, this.onTouchMove);
        this.on(Laya.Event.MOUSE_UP, this, this.onTouchUp);
    }

    __proto__.onTouchDown = function (e) {
        if(this._touchId !== -1){
            return;
        }
        this.alpha = 1;
        this._touchId = e.touchId;
        var localPoint = this.globalToLocal(new Laya.Point(e.stageX, e.stageY));
        this.arrow.visible = true;
        if(!this.fixedPosition){
            this._curPos.x = localPoint.x;
            this._curPos.y = localPoint.y;
            this.button.pos(this._curPos.x, this._curPos.y);
            this.background.pos(this._curPos.x, this._curPos.y);
            this.arrow.pos(this._curPos.x, this._curPos.y);
        }
        this.event('down');
        if(this._lastAngle !== -999 && this._lastRad !== -999){
            this.event('move', [this._lastAngle,this._lastRad]);
        }
    }

    __proto__.onTouchMove = function (e) {
        if(e.touchId !== this._touchId){
            return;
        }
        var localPoint = this.globalToLocal(new Laya.Point(e.stageX, e.stageY));
        var referencePoint;
        if(this.fixedPosition){
            referencePoint = new Laya.Point(this._originPos.x, this._originPos.y);
        }else{
            referencePoint = new Laya.Point(this._curPos.x, this._curPos.y);
        }
        var offsetX = localPoint.x - referencePoint.x;
        var offsetY = localPoint.y - referencePoint.y;
        var rad = Math.atan2(offsetY, offsetX);
        var angle = rad * 180 / Math.PI;
        this._lastRad = rad;
        this._lastAngle = angle;
        if(localPoint.distance(referencePoint.x, referencePoint.y) <= this._radius){
            this.button.pos(localPoint.x, localPoint.y);
        }else{
            this.button.pos(this._radius * Math.cos(rad) + referencePoint.x, this._radius * Math.sin(rad) + referencePoint.y);  
        }
        this.arrow.rotation = angle + 90;
        this.event('move', [angle,rad]);
    }

    __proto__.onTouchUp = function (e) {
        if(e.touchId !== this._touchId){
            return;
        }
        if(this.autoAlpha){
            this.alpha = this.joystickAlpha;
        }else{
            this.alpha = 1;
        }
        this.arrow.pos(this._originPos.x, this._originPos.y);
        this.button.pos(this._originPos.x, this._originPos.y);
        this.background.pos(this._originPos.x, this._originPos.y);
        this.arrow.visible = false;
        this._touchId = -1;
        this.event('up');
    }

    //设置皮肤
    __proto__.setImg = function (buttonImg, backgroundImg, arrowImg) {
        this._buttonImg = buttonImg;
        this._backgroundImg = backgroundImg;
        this._arrowImg = arrowImg;
        this._draw();
    }

    //设置虚拟摇杆起始位置
    __proto__.setOriginPos = function (x, y) {
        this._originPos.x = x;
        this._originPos.y = y;
        this.button.pos(this._originPos.x, this._originPos.y);
        this.background.pos(this._originPos.x, this._originPos.y);
        this.arrow.pos(this._originPos.x, this._originPos.y);
    }

    //设置摇杆半径
    __proto__.setRadius = function (_radius) {
        this._radius = _radius;
        this._draw();
    }

    //设置触摸区域
    __proto__.setTouchSize = function (width, height) {
        this._touchWidth = width || this._touchWidth;
        this._touchHeight = height || this._touchHeight;
        this.size(this._touchWidth, this._touchHeight);
        this._draw();
    }

    //根据background自动调整_radius
    __proto__.fixRadius = function () {
        if(this._backgroundImg){
            var texture = Laya.loader.getRes(this._backgroundImg);
            this._radius = texture.width/2;
            this._draw();
        }
    }

    //设置debug开关
    __proto__.setDebug = function (_switch) {
        this._debug = _switch;
        this._draw();
    }

    //绘制
    __proto__._draw = function () {
        this._clearDraw();
        if(this._debug){
            this._drawDebug();
        }
        if(this._buttonImg){
            var texture = Laya.loader.getRes(this._buttonImg);
            this.button.graphics.drawTexture(texture, -texture.width/2, -texture.height/2);
        }
        if(this._backgroundImg){
            var texture = Laya.loader.getRes(this._backgroundImg);
            this.background.graphics.drawTexture(texture, -texture.width/2, -texture.height/2);
        }
        if(this._arrowImg){
            var texture = Laya.loader.getRes(this._arrowImg);
            this.arrow.graphics.drawTexture(texture, -texture.width/2, -texture.height/2);
        }
    }

    //绘制debug
    __proto__._drawDebug = function () {
        this.background.graphics.drawCircle(0, 0, this._radius, null, this._debugColor, 15);
        this.button.graphics.drawCircle(0, 0, 30, this._debugColor);
        this.arrow.graphics.drawPoly(0, 0, [-30,-1*(this._radius-30), 0, -1*(this._radius+30), 30, -1*(this._radius-30)], this._debugColor);
        this.graphics.drawRect(0, 0, this._touchWidth, this._touchHeight, this._debugTouchAreaColor);
    }

    //清除draw
    __proto__._clearDraw = function () {
        this.graphics.clear();
        this.arrow.graphics.clear();
        this.button.graphics.clear();
        this.background.graphics.clear();
    }

    return JoyStick;

}(Laya.Sprite));