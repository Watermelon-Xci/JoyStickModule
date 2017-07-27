(function () {
   (function () {
        Laya.init(600, 900);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_WIDTH;
        Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
        Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
        Laya.stage.screenMode = Laya.Stage.SCREEN_VERTICAL;
        loadRes();
   })();

   function loadRes() {
       var resArray = [
            { url : 'res/atlas/joystick.json', type : Laya.Loader.ATLAS },
            { url : 'res/atlas/comp.json', type : Laya.Loader.ATLAS }
        ];
        Laya.loader.load(resArray, Laya.Handler.create(this, onLoad));
   }

   function onLoad() {
        var leftText = new Laya.Text();
        leftText.text = '0';
        leftText.pos(Laya.stage.width/4, Laya.stage.width/2);
        leftText.fontSize = 50;
        leftText.color = '#ffffff';
        leftText.pivot(leftText.width/2, leftText.height/2);
        Laya.stage.addChild(leftText);

        var rightText = new Laya.Text();
        rightText.text = '0';
        rightText.pos(Laya.stage.width/4*3, Laya.stage.width/2);
        rightText.fontSize = 50;
        rightText.color = '#ffffff';
        rightText.pivot(rightText.width/2, rightText.height/2);
        Laya.stage.addChild(rightText);

        var leftJ = new JoyStick();
        leftJ.pos(0, Laya.stage.width);
        leftJ.setTouchSize(Laya.stage.width/2, Laya.stage.height - Laya.stage.width);
        leftJ.setOriginPos(Laya.stage.width/4, (Laya.stage.height - Laya.stage.width) / 2 );
        leftJ.fixRadius();
        leftJ.setDebug(true);
        leftJ.on('move',this,function(angle,rad){
            leftText.text = angle.toFixed(2) + '';
            leftText.pivot(leftText.width/2, leftText.height/2);
        });
        Laya.stage.addChild(leftJ);

        var rightJ = new JoyStick();
        rightJ.pos(Laya.stage.width/2, Laya.stage.width);
        rightJ.setTouchSize(Laya.stage.width/2, Laya.stage.height - Laya.stage.width);
        rightJ.setOriginPos(Laya.stage.width/4, (Laya.stage.height - Laya.stage.width) / 2 );
        rightJ.fixRadius();
        rightJ.setDebug(true);
        rightJ.on('move',this,function(angle,rad){
            rightText.text = angle.toFixed(2) + '';
            rightText.pivot(rightText.width/2, rightText.height/2);
        });
        Laya.stage.addChild(rightJ);

        var debugBtn = new Laya.Button('comp/button.png');
        debugBtn.width = 160;
        debugBtn.height = 40;
        debugBtn.label = 'debug:已开';
        debugBtn.labelSize = 30;
        debugBtn.pos(Laya.stage.width/4, 20);
        debugBtn.pivot(debugBtn.width/2, 0);
        debugBtn.on(Laya.Event.CLICK, this, function (e) {
            if(debugBtn.label == 'debug:已开'){
                leftJ.setDebug(false);
                rightJ.setDebug(false);
                debugBtn.label = 'debug:已关';    
            }else{
                leftJ.setDebug(true);
                rightJ.setDebug(true);
                debugBtn.label = 'debug:已开';       
            }
            
        });
        Laya.stage.addChild(debugBtn);

        var skinBtn = new Laya.Button('comp/button.png');
        skinBtn.width = 160;
        skinBtn.height = 40;
        skinBtn.label = '皮肤:已关';
        skinBtn.labelSize = 30;
        skinBtn.pos(Laya.stage.width/4*3,20);
        skinBtn.pivot(skinBtn.width/2, 0);
        skinBtn.on(Laya.Event.CLICK, this, function (e) {
            if(skinBtn.label == '皮肤:已关'){
                leftJ.setImg('joystick/button.png','joystick/background.png','joystick/arrow.png');
                leftJ.fixRadius();
                rightJ.setImg('joystick/button.png','joystick/background.png','joystick/arrow.png');
                rightJ.fixRadius();
                skinBtn.label = '皮肤:已开';    
            }else{
                leftJ.setImg();
                rightJ.setImg();
                skinBtn.label = '皮肤:已关'; 
            }
        });
        Laya.stage.addChild(skinBtn);
   }
})();