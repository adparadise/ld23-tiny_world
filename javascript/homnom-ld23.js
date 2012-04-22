var Game={Screen:{},Resources:{},Characters:{},Physics:{},begin:function(){Game.$=jQuery;
var a=Game.$("canvas#main");
Game.random=new Game.Random();
Game.instance=new Game.Application({$canvas:a,usageUrl:"http://localhost:4567"})
},Class:function(b){var a;
var c=this.getBaseObject(this.BaseClassPrototype);
_.extend(c,b);
a=function(){if(this.initialize){this.initialize.apply(this,arguments)
}};
a.prototype=c;
return a
},getBaseObject:function(a){var b;
var c=function(){};
c.prototype=a;
b=new c();
return b
},BaseClassPrototype:{eventCallback:function(b){var a=[].slice.apply(arguments).slice(1);
var c=[this[b],this].concat(a);
return _.bind.apply(_,c)
}}};
Game.Application=Game.Class({initialize:function(a){this.display=new Game.Display(a.$canvas);
this.resources=new Game.Resources();
this.usage=new Game.Usage(a.usageUrl);
this.input=new Game.Input();
this.resources.loadResources(Game.Constants.resourceDefinitions,this.eventCallback("ready"));
this.screen=new Game.Screen.Gameplay();
this.usage.report({event:"start"})
},ready:function(){this.screen.resolveResources(this.resources);
this.start()
},start:function(){var a=this;
var b=function(){a.render();
window.requestAnimationFrame(b)
};
this.frameNumber=0;
window.requestAnimationFrame(b);
this.stepInterval=setInterval(this.eventCallback("step"),1000/Game.Constants.worldRate)
},step:function(){this.frameNumber+=1;
this.input.step();
this.screen.step(1000/Game.Constants.worldRate,this.frameNumber,this.input)
},render:function(){this.display.clear();
this.screen.render(this.display,this.resources,this.frameNumber)
}});
Game.Camera=Game.Class({initialize:function(){this.offset={x:0,y:0}
}});
Game.Constants={worldRate:60,resourceDefinitions:{bgtiles:{type:"tileset",url:"images/bgtiles.png",tileWidth:24,tileHeight:16,width:10,height:10,sets:{solid:[31,32,41,42,21,21,21,21],leftEdge:[35,45,25,55],rightEdge:[34,44,24,54],topEdge:[61,62,60,60],bottomEdge:[64,65,63,63],blCorner:[47],brCorner:[48],tlCorner:[37],trCorner:[38],_blank:[12]},rules:{e_n_s_self_w:"solid",n_s_self_w:"rightEdge",e_n_s_self:"leftEdge",e_s_self_w:"topEdge",e_n_self_w:"bottomEdge",e_n_self:"blCorner",n_self_w:"brCorner",e_s_self:"tlCorner",s_self_w:"trCorner"}},player:{type:"spritesheet",url:"images/player.png",tileWidth:32,tileHeight:48,width:10,height:10,origin:{x:16,y:40},sets:{stand:[23],walkLeft:[24,25,26,27,28,29],walkRight:[38,37,36,35,34,33],dead:[43]}},enemy:{type:"spritesheet",url:"images/globe_4up.gif",tileWidth:282,tileHeight:282,width:2,height:2,origin:{x:141,y:266},sets:{roll:[0,1,2,3]}}}};
Game.Display=Game.Class({initialize:function(a){this.scale=1;
this.hwScale=1;
this.width=1000;
this.height=400;
this.$canvas=a;
this.$canvas.css("border","1px solid black");
this.context=this.$canvas[0].getContext("2d");
this.$canvas[0].width=this.width;
this.$canvas[0].height=this.height;
this.$canvas.width(this.width*this.hwScale);
this.$canvas.height(this.height*this.hwScale)
},clear:function(){this.context.clearRect(0,0,this.width,this.height);
this.context.fillStyle="#000000";
this.context.fillRect(0,0,this.width,this.height)
}});
Game.Input=Game.Class({initialize:function(){this.keydown=this.eventCallback("keydown");
this.keyup=this.eventCallback("keyup");
this.bind();
this.buttonState={};
this.events=[]
},bind:function(){Game.$(document).bind("keydown",this.keydown);
Game.$(document).bind("keyup",this.keyup)
},keydown:function(a){if(this.isWatchedKey(a.keyCode)){this.events.push({keyCode:a.keyCode,action:"down"})
}},keyup:function(a){if(this.isWatchedKey(a.keyCode)){this.events.push({keyCode:a.keyCode,action:"up"})
}},isWatchedKey:function(a){if(a>=37&&a<=41){return true
}else{if(a===65||a===68||a===87||a===83){return true
}}},exclusivePairsOf:function(a){switch(a){case 65:case 37:return["right"];
case 38:case 87:return["down"];
case 39:case 68:return["left"];
case 40:case 83:return["up"]
}},keyCodeToSymbol:function(a){switch(a){case 37:case 65:return"left";
case 38:case 87:return"up";
case 39:case 68:return"right";
case 40:case 83:return"down"
}},step:function(){var a=this;
_.each(this.events,function(b){var d=a.keyCodeToSymbol(b.keyCode);
var c=a.exclusivePairsOf(b.keyCode);
var e=false;
if(b.action==="down"){e=true
}a.buttonState[d]=e;
if(e&&c){_.each(c,function(f){a.buttonState[f]=false
})
}});
this.events=[]
}});
Game.Map=Game.Class({initialize:function(b,a,c){this.width=b;
this.height=a;
this.panelWidth=16;
this.panelHeight=16;
this.panelsWide=Math.ceil(this.width/this.panelWidth);
this.panelsHigh=Math.ceil(this.height/this.panelHeight);
this.tilesetName=c;
this.buildPanels();
this.bakePanels()
},buildPanels:function(){var b,a;
var d;
var c;
this.panels=[];
for(a=0;
a<this.panelsHigh;
a++){d=[];
for(b=0;
b<this.panelsWide;
b++){c={x:this.panelWidth*b,y:this.panelHeight*a};
d.push(new Game.Map.Panel(this.panelWidth,this.panelHeight,c,this.tilesetName))
}this.panels.push(d)
}},resolveResources:function(d){this.tileset=d.tileset[this.tilesetName];
var c,b;
var a;
for(b=this.panelsHigh;
b--;
){for(c=this.panelsWide;
c--;
){a=this.panels[b][c];
a.resolveResources(d);
a.buildBackbuffer()
}}},bakePanels:function(){var c,b;
var a;
for(b=this.panelsHigh;
b--;
){for(c=this.panelsWide;
c--;
){a=this.panels[b][c];
this.bakePanel(a)
}}},bakePanel:function(a){var e,d;
var h,g;
var c;
var f,k;
var b;
var l;
for(d=this.panelHeight;
d--;
){g=a.offset.y+d;
for(e=this.panelWidth;
e--;
){h=a.offset.x+e;
c=this.cellNeighbors(h,g);
f=Game.Constants.resourceDefinitions[this.tilesetName].rules[c];
if(!f){f="_blank"
}k=Game.Constants.resourceDefinitions[this.tilesetName].sets[f];
b=Game.random.get(g*(this.width+2)+h);
l=this.getAt(h,g);
l.tileID=k[b%k.length]
}}},getAt:function(a,e){var d,c;
var b;
d=Math.floor(a/this.panelWidth);
c=Math.floor(e/this.panelHeight);
if(this.panels[c]){b=this.panels[c][d]
}if(b){return b.getAt(a,e)
}},getAttributeAt:function(b,e,c,d){var a=this.getAt(b,e);
if(!a||!a[c]){return d
}return a[c]
},cellNeighbors:function(a,f,e){var d,b;
var c=[];
e=e||"solid";
if(this.getAttributeAt(a,f,e)){c.push("self")
}if(this.getAttributeAt(a+1,f,e)){c.push("e")
}if(this.getAttributeAt(a-1,f,e)){c.push("w")
}if(this.getAttributeAt(a,f+1,e)){c.push("s")
}if(this.getAttributeAt(a,f-1,e)){c.push("n")
}return c.sort().join("_")
},resolveObstructions:function(c,e){var f=e.x-c.position.x;
var d=e.y-c.position.y;
var n,l;
var m,h;
var b,a;
var o,i;
var g=0.01;
var q=1,p=1;
var k=0,j=0;
if(f<0){q=-1;
k=1
}if(d<0){p=-1;
j=1
}n=Math.floor((e.x+q*c.radius)/this.tileset.tileWidth);
b=Math.floor((e.y+c.radius*0.7)/this.tileset.tileHeight);
a=Math.floor((e.y-c.radius*0.7)/this.tileset.tileHeight);
o=this.getAttributeAt(n,b,"solid");
i=this.getAttributeAt(n,b,"solid");
if(!o||!i){e.x=((n+k)*this.tileset.tileWidth)-q*(c.radius+g)
}m=Math.floor((e.x+c.radius*0.7)/this.tileset.tileWidth);
h=Math.floor((e.x-c.radius*0.7)/this.tileset.tileWidth);
l=Math.floor((e.y+p*c.radius)/this.tileset.tileHeight);
o=this.getAttributeAt(m,l,"solid");
i=this.getAttributeAt(h,l,"solid");
if(!o||!i){e.y=((l+j)*this.tileset.tileHeight)-p*(c.radius+g)
}},render:function(f,d,e){var c,b;
var a;
for(b=this.panelsHigh;
b--;
){for(c=this.panelsWide;
c--;
){a=this.panels[b][c];
a.render(f,d)
}}}});
Game.Random=Game.Class({initialize:function(a){this.stock=a||Game.Random.stock;
this.stockLength=this.stock.length
},get:function(a){return this.stock[a%this.stockLength]
}});
Game.Random.stock=[238,146,75,165,166,16,135,220,89,214,17,247,94,241,190,229,238,92,55,180,155,36,28,218,80,224,249,16,82,70,215,97,3,107,18,125,250,15,43,75,201,31,129,28,106,53,163,150,10,207,79,252,192,202,150,226,115,200,191,187,244,233,67,158,152,128,127,174,163,56,163,241,141,192,214,60,190,66,178,119,17,95,211,2,132,144,69,250,1,100,207,128,113,234,174,111,135,227,61,132,175,167,68,28,26,41,96,149,195,210,139,7,88,80,151,240,175,106,35,10,92,76,88,107,50,177,189,227,247,29,126,92,66,52,96,1,29,121,135,212,83,45,230,182,122,160,75,98,155,54,4,23,162,44,35,172,103,83,184,224,137,254,158,156,116,156,10,250,46,16,233,60,194,70,26,31,16,219,158,34,195,199,190,46,13,247,123,17,14,156,194,25,186,169,217,115,39,44,111,46,165,9,50,24,65,230,158,92,222,154,60,163,162,53,122,196,250,91,197,177,233,130,178,24,5,218,40,14,11,65,39,68,87,150,39,57,40,136,184,18,12,210,211,205,189,131,160,18,162,172,62,73,115,209,92,30,85,101,189,30,119,95,9,236,54,250,152,136,55,166,166,198,219,135,69,195,62,245,234,205,183,199,47,44,198,210,90,229,58,48,108,250,251,122,24,12,185,55,104,74,195,16,222,140,243,239,111,88,1,98,202,13,21,93,93,108,231,25,231,3,21,38,213,101,99,126,115,46,160,133,75,21,169,171,48,254,73,230,230,74,62,76,175,179,90,184,8,102,60,43,213,27,198,122,108,71,91,11,69,111,0,217,247,240,238,136,62,159,137,50,244,171,44,31,235,80,159,27,52,44,157,26,68,74,6,224,90,116,145,69,111,243,221,129,152,168,87,197,159,232,120,36,86,92,24,11,208,252,51,220,2,10,6,39,176,73,206,224,47,48,49,39,104,128,3,56,232,183,90,244,51,29,151,203,215,229,191,189,22,142,253,178,218,205,28,58,212,142,249,98,25,194,121,108,203,196,29,212,244,21,82,216,33,128,36,4,213,112,86,175,231,174,157,220,17,140,86,42,10,165,184,54,120,227,219,241,196,55,61,42,94,105,106,231,83,97,150,127,54,139,101,232,141,100,196,197,58,110,108,233,58,227,201,249,214,227,252,188,150,69,102,223,253,108,134,133,186,162,184,126,121,12,227,177,185,187,111,233,211,104,217,157,145,185,78,184,209,122,17,169,120,76,82,94,232,71,83,192,227,26,48,251,114,97,153,177,49,235,139,64,53,129,220,92,247,83,179,35,243,24,81,218,232,230,15,11,248,16,199,32,61,31,213,131,0,39,229,5,57,181,209,130,1,245,97,223,171,68,249,130,49,197,8,147,67,20,214,230,98,105,69,103,83,101,207,242,48,142,246,254,144,84,63,122,66,145,84,99,51,210,116,70,96,155,219,103,37,16,11,126,54,114,115,169,198,215,229,2,11,34,252,209,72,216,81,243,21,188,252,211,189,246,228,244,81,44,100,190,148,222,24,99,209,253,9,40,157,155,53,93,142,4,244,113,67,84,221,226,16,25,59,214,16,209,15,30,153,48,66,174,72,48,66,69,252,114,227,53,183,154,37,249,206,90,119,126,82,40,251,129,128,213,52,179,178,109,114,73,61,230,229,112,134,110,59,219,206,90,228,75,79,245,55,42,126,89,219,128,5,53,81,220,67,245,218,51,42,54,27,203,132,158,5,196,204,126,91,209,28,236,184,76,202,180,250,174,133,66,211,185,93,48,210,67,124,149,207,4,85,138,38,164,161,131,64,97,200,94,27,204,81,163,111,170,116,251,187,23,164,21,87,98,20,60,254,29,129,198,18,26,240,22,180,14,144,73,232,128,177,49,35,240,196,249,195,20,187,57,244,22,231,174,10,131,132,1,242,135,96,41,34,65,73,120,152,35,81,90,80,91,29,105,56,182,90,195,171,130,244,190,46,88,251,171,183,59,109,156,252,69,34,9,215,185,61,128,177,81,7,21,129,185,64,228,131,238,81,254,247,27,184,47,249,37,155,91,199,91,107,77,208,3,221,165,108,156,29,167,203,0,5,105,114,189,2,141,154,219,194,140,25,244,44,205,228,35,140,167,158,196,177,73,23,55,240,233,219,63,121,51,230,248,8,3,136,36,169,124,66,90,156,133,125,189,202,191,39,73,67,196,81,168,95,96,120,69,182,6,50,235,235,145,221,240,164,120,137,175,200,205,73,113,32,90,73,163,191,138,254,161,175,93,1,154,197,92,91,139,100,156,51,137,80,231];
Game.Resources=Game.Class({initialize:function(){},loadResources:function(a,c){var d=this;
var b;
this.completeCallback=c;
this.tileset={};
this.spritesheet={};
this.pendingResourceCount=0;
_.each(a,function(f,e){switch(f.type){case"tileset":b=new Game.Resources.Tileset(e,f);
b.load(d.eventCallback("resourceComplete",b));
d.tileset[e]=b;
d.pendingResourceCount+=1;
break;
case"spritesheet":b=new Game.Resources.Spritesheet(e,f);
b.load(d.eventCallback("resourceComplete",b));
d.spritesheet[e]=b;
d.pendingResourceCount+=1;
break
}})
},resourceComplete:function(b,a){this.pendingResourceCount-=1;
if(this.pendingResourceCount===0){if(this.completeCallback){this.completeCallback()
}}}});
Game.Usage=Game.Class({initialize:function(a){this.url=a
},report:function(a){var b=_.map(a,function(d,c){return encodeURIComponent(c)+"="+encodeURIComponent(d)
}).join("&");
Game.$.ajax({url:this.url+"?"+b})
}});
Game.Characters.Player=Game.Class({initialize:function(){this.SPEED_X=120;
this.SPEED_Y=100;
this.SPEED_XY=105;
this.ACCEL=40;
this.position={x:50,y:50};
this.targetVelocity={x:0,y:0};
this.velocity={x:0,y:0};
this.radius=8;
this.isDead=false;
this.state=false;
this.inStateSince=0
},step:function(b,c,a){this.resolveInput(a);
this.resolveAcceleration(b,c)
},resolveInput:function(b){var c=0;
var a=0;
if(this.isDead){return
}if(b.buttonState.left){c=-1
}else{if(b.buttonState.right){c=1
}}if(b.buttonState.up){a=-1
}else{if(b.buttonState.down){a=1
}}if(c!==0||a!==0){if(c!==0&&a!==0){this.targetVelocity.x=c*this.SPEED_XY;
this.targetVelocity.y=a*this.SPEED_XY
}else{this.targetVelocity.x=c*this.SPEED_X;
this.targetVelocity.y=a*this.SPEED_Y
}}else{this.targetVelocity.x=0;
this.targetVelocity.y=0
}},resolveAcceleration:function(d){var b,a,c;
if(this.targetVelocity.x!==this.velocity.x||this.targetVelocity.y!==this.velocity.y){b=this.targetVelocity.x-this.velocity.x;
a=this.targetVelocity.y-this.velocity.y;
c=Math.sqrt(Math.pow(b,2)+Math.pow(a,2));
this.velocity.x+=b*this.ACCEL/c;
this.velocity.y+=a*this.ACCEL/c;
if((this.targetVelocity.x-this.velocity.x)*b<0||(this.targetVelocity.y-this.velocity.y)*a<0){this.velocity.x=this.targetVelocity.x;
this.velocity.y=this.targetVelocity.y
}}},resolveState:function(a){if(this.velocity.x!==0||this.velocity.y!==0){if(this.state!=="moving"){this.state="moving";
this.inStateSince=a
}}else{this.state=false
}},wasKilled:function(){this.isDead=true;
this.targetVelocity.x=0;
this.targetVelocity.y=0
},getSpriteID:function(c){var e=5;
var d;
var a=0;
var b=0;
if(this.isDead){return Game.Constants.resourceDefinitions.player.sets.dead[0]
}else{if(this.state==="moving"){d=Math.floor((c-this.inStateSince)/e);
if(this.velocity.x>0){a=Game.Constants.resourceDefinitions.player.sets.walkRight.length;
b=Game.Constants.resourceDefinitions.player.sets.walkRight[d%a]
}else{a=Game.Constants.resourceDefinitions.player.sets.walkLeft.length;
b=Game.Constants.resourceDefinitions.player.sets.walkLeft[d%a]
}return b
}else{return Game.Constants.resourceDefinitions.player.sets.stand[0]
}}},render:function(e,b,d,f){var c=this.getSpriteID(f);
var a=1;
if(this.isDead){a=2
}d.spritesheet.player.drawSprite(e,b,c,this.position.x,this.position.y,a)
}});
Game.Characters.Enemy=Game.Class({initialize:function(a){this.SPEED_X=90;
this.SPEED_Y=60;
this.SPEED_XY=70;
this.ACCEL=2;
this.position={x:a.x,y:a.y};
this.priorPosition={x:a.x,y:a.y};
this.distanceTraveled=0;
this.targetVelocity={x:0,y:0};
this.velocity={x:0,y:0};
this.radius=8
},step:function(b,c,a){this.persuePlayer(b,c,a);
this.resolveAcceleration(b)
},persuePlayer:function(e,f,c){var b,a;
var d=this.radius/2;
b=c.position.x-this.position.x;
a=c.position.y-this.position.y;
if(Math.abs(b)<d){b=0
}else{if(b<0){b=-1
}else{b=1
}}if(Math.abs(a)<d){a=0
}else{if(a<0){a=-1
}else{a=1
}}if(b!==0&&a!==0){this.targetVelocity.x=b*this.SPEED_XY;
this.targetVelocity.y=a*this.SPEED_XY
}else{this.targetVelocity.x=b*this.SPEED_X;
this.targetVelocity.y=a*this.SPEED_Y
}},resolveAcceleration:function(d){var b,a,c;
if(this.targetVelocity.x!==this.velocity.x||this.targetVelocity.y!==this.velocity.y){b=this.targetVelocity.x-this.velocity.x;
a=this.targetVelocity.y-this.velocity.y;
c=Math.sqrt(Math.pow(b,2)+Math.pow(a,2));
this.velocity.x+=b*this.ACCEL/c;
this.velocity.y+=a*this.ACCEL/c;
if((this.targetVelocity.x-this.velocity.x)*b<0||(this.targetVelocity.y-this.velocity.y)*a<0){this.velocity.x=this.targetVelocity.x;
this.velocity.y=this.targetVelocity.y
}}},resolveState:function(a){var b=Math.sqrt(Math.pow(this.priorPosition.x-this.position.x,2)+Math.pow(this.priorPosition.y-this.position.y,2));
this.distanceTraveled+=b;
this.priorPosition.x=this.position.x;
this.priorPosition.y=this.position.y
},getSpriteID:function(e){var a=10;
var b=Game.Constants.resourceDefinitions.enemy.sets.roll.length;
var c=Math.floor(this.distanceTraveled/a)%b;
var d=Game.Constants.resourceDefinitions.enemy.sets.roll[c];
return d
},render:function(d,a,c){var b=this.getSpriteID();
c.spritesheet.enemy.drawSprite(d,a,b,this.position.x,this.position.y)
}});
Game.Resources.Tileset=Game.Class({initialize:function(a,b){this.name=a;
this.image=new Image();
this.imageUrl=b.url;
this.tileWidth=b.tileWidth;
this.tileHeight=b.tileHeight;
this.width=b.width;
this.height=b.height
},load:function(a){Game.$(this.image).bind("load",a);
this.image.src=this.imageUrl
},tileIDToUV:function(b){var a=b%this.width;
return{u:a,v:(b-a)/this.width}
},drawTile:function(e,d,b,a,f){var c=this.tileIDToUV(b.tileID);
e.context.drawImage(this.image,c.u*this.tileWidth,c.v*this.tileHeight,this.tileWidth,this.tileHeight,(a*this.tileWidth-d.offset.x)*e.scale,(f*this.tileHeight-d.offset.y)*e.scale,this.tileWidth*e.scale,this.tileHeight*e.scale)
}});
Game.Resources.Spritesheet=Game.Class({initialize:function(a,b){this.name=a;
this.image=new Image();
this.imageUrl=b.url;
this.tileWidth=b.tileWidth;
this.tileHeight=b.tileHeight;
this.width=b.width;
this.height=b.height;
this.origin={x:b.origin.x,y:b.origin.y}
},load:function(a){Game.$(this.image).bind("load",a);
this.image.src=this.imageUrl
},spriteIDToUV:function(b){var a=b%this.width;
return{u:a,v:(b-a)/this.width}
},drawSprite:function(e,d,b,h,f,i){var a=this.spriteIDToUV(b);
var g=1;
var c;
i=i||1;
c=this.tileWidth*(i-1)/2;
e.context.drawImage(this.image,a.u*this.tileWidth,a.v*this.tileHeight,this.tileWidth*i,this.tileHeight,(h-d.offset.x-this.origin.x-c+e.width/2)*e.scale,(f-d.offset.y-this.origin.y+e.height/2)*e.scale,this.tileWidth*i*e.scale,this.tileHeight*e.scale)
}});
Game.Physics.Collection=Game.Class({initialize:function(){this.objects=[];
this.statics=[]
},addStatic:function(a){this.statics.push(a)
},addObject:function(a){this.objects.push(a)
},resolveVelocities:function(b){var c=this;
var a={x:0,y:0};
_.each(this.objects,function(d){if(d.velocity){a.x=d.position.x+d.velocity.x*b/1000;
a.y=d.position.y+d.velocity.y*b/1000;
_.each(c.statics,function(e){e.resolveObstructions(d,a)
});
d.velocity.x=Math.min((a.x-d.position.x)*1000/b,d.SPEED_X);
d.velocity.y=Math.min((a.y-d.position.y)*1000/b,d.SPEED_Y);
d.position.x=a.x;
d.position.y=a.y
}})
}});
Game.Screen.Gameplay=Game.Class({initialize:function(){var a;
this.physicsCollection=new Game.Physics.Collection();
this.map=new Game.Map(32,32,"bgtiles");
this.player=new Game.Characters.Player();
this.physicsCollection.addStatic(this.map);
this.physicsCollection.addObject(this.player);
this.camera=new Game.Camera();
this.enemies=[];
a=new Game.Characters.Enemy({x:500,y:300});
this.enemies.push(a);
this.physicsCollection.addObject(a);
a=new Game.Characters.Enemy({x:400,y:200});
this.enemies.push(a);
this.physicsCollection.addObject(a)
},resolveResources:function(a){this.map.resolveResources(a)
},step:function(c,d,a){var b;
this.player.step(c,d,a);
for(b=this.enemies.length;
b--;
){this.enemies[b].step(c,d,this.player)
}this.physicsCollection.resolveVelocities(c);
this.checkForDeath();
this.player.resolveState(d);
for(b=this.enemies.length;
b--;
){this.enemies[b].resolveState(d)
}this.camera.offset.x=this.player.position.x;
this.camera.offset.y=this.player.position.y
},checkForDeath:function(){var b;
var a;
var c;
for(b=this.enemies.length;
b--;
){a=this.enemies[b];
c=Math.sqrt(Math.pow(this.player.position.x-a.position.x,2)+Math.pow(this.player.position.y-a.position.y,2));
if(c<a.radius+this.player.radius){this.player.wasKilled();
break
}}},render:function(d,c,e){var b;
var a;
this.map.render(d,this.camera,c,e);
this.enemies.sort(function(g,f){if(g.position.y<f.position.y){return 1
}else{if(g.position.y>f.position.y){return -1
}}});
a=false;
for(b=this.enemies.length;
b--;
){if(this.player.position.y<this.enemies[b].position.y&&!a){this.player.render(d,this.camera,c,e);
a=true
}this.enemies[b].render(d,this.camera,c,e)
}if(!a){this.player.render(d,this.camera,c,e)
}}});
Game.Display.Backbuffer=Game.Class({initialize:function(b,a){this.width=b;
this.height=a;
this.$buffer=Game.$("<canvas></canvas>");
this.$buffer[0].width=this.width;
this.$buffer[0].height=this.height;
this.context=this.$buffer[0].getContext("2d");
this.scale=1
},render:function(b,a,c){c=c||{x:0,y:0};
b.context.drawImage(this.$buffer[0],0,0,this.width,this.height,(c.x-a.offset.x+b.width/2)*b.scale,(c.y-a.offset.y+b.height/2)*b.scale,this.width*b.scale,this.height*b.scale)
}});
Game.Map.Generator=Game.Class({initialize:function(b,a){this.width=b;
this.height=a;
this.fragments=new Game.Map.Fragments(40,30)
},render:function(a){this.fragments.render(a)
}});
Game.Map.Panel=Game.Class({initialize:function(b,a,d,c){this.width=b;
this.height=a;
this.tilesetName=c;
this.offset=d;
this.buildCells()
},buildCells:function(){var a,c;
var b;
this.cells=[];
for(c=0;
c<this.height;
c++){b=[];
for(a=0;
a<this.width;
a++){b.push({solid:1})
}this.cells.push(b)
}},resolveResources:function(a){this.tileset=a.tileset[this.tilesetName];
this.buildBackbuffer()
},getAttributeAt:function(b,e,c,d){var a=this.getAt(b-this.offset.x,e-this.offset.y);
if(!a||!a[c]){return d
}return a[c]
},getAt:function(a,b){if(this.cells[b-this.offset.y]){return this.cells[b-this.offset.y][a-this.offset.x]
}},buildBackbuffer:function(){this.backbuffer=new Game.Display.Backbuffer(this.width*this.tileset.tileWidth,this.height*this.tileset.tileHeight);
this.renderToBackbuffer()
},renderToBackbuffer:function(){var b,c;
var a;
for(c=this.height;
c--;
){for(b=this.width;
b--;
){a=this.cells[c][b];
this.tileset.drawTile(this.backbuffer,{offset:{x:0,y:0}},a,b,c)
}}},render:function(c,a,b){this.backbuffer.render(c,a,{x:this.offset.x*this.tileset.tileWidth,y:this.offset.y*this.tileset.tileHeight})
}});
Game.Map.Fragments=Game.Class({initialize:function(c,a,b){this.width=c;
this.height=a;
if(!b){if(!Game.Map.Fragments._seed){Game.Map.Fragments._seed=0
}Game.Map.Fragments._seed+=1;
b=Game.Map.Fragments._seed
}this.border=2;
this.seed=b;
this.seed=new Date().getTime();
this.generate()
},generate:function(){var a=this;
this.fixed=this.seedCells(256*0.03);
this.cells=this.seedCells(128);
this.apply(function(b,c){return a.filledCount(b,c)<5?1:0
});
this.apply(function(b,c){return a.filledCount(b,c)<5?1:0
});
this.apply(function(b,c){return a.filledCount(b,c)<5?1:0
});
this.apply(function(b,c){return a.filledCount(b,c)<5?1:0
});
this.findContinuities()
},findContinuities:function(){var a=this;
this.continuities=new Game.Map.Continuities();
this.overwrite(function(b,h){var c,g,f;
var d,e;
c=a.cellValue(b,h);
if(!c){return 0
}g=a.cellValue(b,h+1);
f=a.cellValue(b+1,h);
d=Math.max(g,f);
e=Math.min(g,f);
if(e>1){c=e
}else{if(d>1){c=d
}}c=a.continuities.increaseBounds(c,b,h);
if(d>1){a.continuities.markSame(d,c)
}return c
});
this.continuities.finalize(this.cells,this.width,this.height)
},overwrite:function(b){var a,c;
for(c=this.height;
c--;
){for(a=this.width;
a--;
){this.cells[c][a]=b(a,c)
}}},apply:function(b){var a,f;
var e=[];
var d,c;
for(f=this.height;
f--;
){d=[];
for(a=this.width;
a--;
){d.push(b(a,f))
}e.push(d)
}this.cells=e
},cellValue:function(a,b){if(a<0||a>=this.width||b<0||b>=this.height){return 0
}return this.cells[b][a]
},isFilled:function(a,b){if(a<0||a>=this.width||b<0||b>=this.height){return 0
}return this.fixed[b][a]||this.cells[b][a]
},filledCount:function(a,e){var d,c;
var b=0;
for(c=-1;
c<=1;
c++){for(d=-1;
d<=1;
d++){if(this.isFilled(a+d,e+c)){b+=1
}}}return b
},seedCells:function(b){var a,h,d;
var c=[];
var e;
var g,f;
for(h=this.height;
h--;
){g=[];
for(a=this.width;
a--;
){f=0;
if(a>=this.border&&a<this.width-this.border&&h>=this.border&&h<this.height-this.border){e=Game.random.get(h*this.width+a+this.seed);
if(e<b){f=1
}}g.push(f)
}c.push(g)
}return c
},render:function(g){var j,h;
var k=8;
var d={x:60,y:40};
var b,f;
var c;
var e,a;
for(h=this.height;
h--;
){for(j=this.width;
j--;
){b=this.fixed[h][j];
f=this.cells[h][j];
c="#448";
if(f){c="#"+(f*5).toString(16)+"0"
}g.context.fillStyle=c;
g.context.fillRect(j*k+d.x,h*k+d.y,k,k)
}}this.continuities.render(g,d,k)
}});
Game.Map.Continuities=Game.Class({initialize:function(){this.offsetMarker=10;
this.bounds=[]
},increaseBounds:function(c,a,d){var b;
if(c===1){c=this.bounds.length+this.offsetMarker;
this.bounds.push({value:c,minX:a,maxX:a,minY:d,maxY:d})
}else{c=this.resolveLowest(c);
b=this.bounds[c-this.offsetMarker];
if(a<b.minX){b.minX=a
}if(a>b.maxX){b.maxX=a
}if(d<b.minY){b.minY=d
}if(d>b.maxY){b.maxY=d
}}return c
},markSame:function(f,d){var c,a;
var b,e;
f=this.resolveLowest(f);
if(f===d){return
}c=Math.min(f,d);
a=Math.max(f,d);
b=this.bounds[c-this.offsetMarker];
e=this.bounds[a-this.offsetMarker];
e.isReplacedBy=c;
b.isReplacedBy=undefined;
this.takeBounds(b,e)
},takeBounds:function(a,b){if(b.minX<a.minX){a.minX=b.minX
}if(b.maxX>a.maxX){a.maxX=b.maxX
}if(b.minY<a.minY){a.minY=b.minY
}if(b.maxY>a.maxY){a.maxY=b.maxY
}},resolveLowest:function(d,e){var b;
var c;
var a;
for(a=100;
a--;
){b=this.bounds[d-this.offsetMarker];
if(!b){break
}if(b.isReplacedBy){d=b.isReplacedBy;
c=b
}}return d
},finalize:function(h,b,g){var i=this;
var f,a;
var e,d;
var c={};
for(d=g;
d--;
){for(e=b;
e--;
){f=h[d][e];
if(f>=this.offsetMarker){a=this.resolveLowest(f);
if(a!==f){h[d][e]=a
}c[a]=true
}}}this.masses=[];
_.each(c,function(j,m){var l=i.bounds[m-i.offsetMarker];
var k=(l.maxX-l.minX)*(l.maxY-l.minY);
if(k>10){i.masses.push(l)
}})
},render:function(d,e,b){var a;
var c;
for(a=this.masses.length;
a--;
){c=this.masses[a];
if(!c.isReplacedBy){d.context.strokeStyle="#f80";
d.context.strokeRect(c.minX*b+e.x,c.minY*b+e.y,(c.maxX-c.minX+1)*b,(c.maxY-c.minY+1)*b)
}}}});