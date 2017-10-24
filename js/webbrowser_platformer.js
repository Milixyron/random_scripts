
// cleanup

if (window.funcInt != undefined)
	clearInterval(window.funcInt);

document.head.remove();
document.body.remove();

// config

var delta = 1/60;

Math.clamp = function(val, min, max) {
	return Math.min(max, Math.max(min, val));
}

var player = null;
GetPlayer = function() {
	if (player == null)
		for (var i = 0; i < World.entities.length; i ++)
			if (World.entities[i] instanceof Player) {
				player = World.entities[i];
				break;
			}
	
	return player;
}


// classes, structs

class Wall {
	constructor(x, y, w, h) {
		World.walls.push(this);
		
		this.pos = { x: 0, y: 0 };
		this.size = { x: 0, y: 0 };
		
		this.element = document.createElement('div');
		this.element.style.position = 'absolute';
		//this.element.style.transform = 'translate(-50%, -50%)';
		this.element.style.backgroundColor = 'rgba(0, 0, 0, 0)';
		this.element.style.border = '1px solid rgb(0, 255, 255)';
		
		document.ent_container.appendChild(this.element);
		
		this.setBounds(x, y, w, h);
	}
	
	setBounds(x, y, w, h) {
		this.pos.x = x;
		this.pos.y = y;
		this.size.x = w;
		this.size.y = h;
		
		this.element.style.left = x + 'px';
		this.element.style.bottom = y + 'px';
		this.element.style.width = w + 'px';
		this.element.style.height = h + 'px';
	}
}

class Entity {
	constructor() {
		World.entities.push(this);
		
		this.pos = { x: 0, y: 0 };
		this.vel = { x: 0, y: 0 };
		this.size = { x: 0, y: 0 };
		this.accelSpeed = 5;
		this.deccelSpeed = 10;
		this.speed = 5;
		
		
		this.health = 0;
		this.maxHealth = 0;
		
		this.element = document.createElement('div');
		this.element.style.position = 'absolute';
		this.element.style.left = '0px';
		this.element.style.bottom = '0px';
		this.element.style.width = '0px';
		this.element.style.height = '0px';
		//this.element.style.transform = 'translate(-50%, -50%)';
		this.element.style.backgroundColor = 'rgb(255, 0, 255)';
		
		document.ent_container.appendChild(this.element);
	}
	dispose() {
		//document.body.removeChild(this.element);
		this.element.remove();
	}
	update() {
		
		
	}
	drawUpdate() {
		
		this.element.style.left = this.pos.x + 'px';
		this.element.style.bottom = this.pos.y + 'px';
		
		this.element.style.width = this.size.x + 'px';
		this.element.style.height = this.size.y + 'px';
	}
}

class Player extends Entity {
	constructor() {
		if (player != null) throw "Only one instance of player is allowed";
		
		super();
		this.element.style.backgroundColor = 'rgb(0, 255, 0)';
		
		this.pressedUp = false;
		this.pressedDown = false;
		this.pressedLeft = false;
		this.pressedRight = false;
		
		this.size = { x: 32, y: 64 };
		
		var t = this;
		
		
		this.goX = 0;
		this.goY = 0;
		
		window.onkeypress = function(e) {
			if (e.key === 'a') t.pressedLeft = true;
			if (e.key === 'd') t.pressedRight = true;
			if (e.key === 'w') t.pressedUp = true;
			if (e.key === 's') t.pressedDown = true;
		}
		
		window.onkeyup = function(e) {
			if (e.key === 'a') t.pressedLeft = false;
			if (e.key === 'd') t.pressedRight = false;
			if (e.key === 'w') t.pressedUp = false;
			if (e.key === 's') t.pressedDown = false;
		}
	}
	update() {
		this.goY = this.pressedUp && !this.pressedDown ? -1 : !this.pressedUp && this.pressedDown ? 1 : 0;
		this.goX = this.pressedLeft && !this.pressedRight ? -1 : !this.pressedLeft && this.pressedRight ? 1 : 0;
		
		this.goX = Math.clamp(this.goX, -1, 1);
		this.goY = Math.clamp(this.goY, -1, 1);
		
		var angle = Math.atan2(this.goX, -this.goY);
		var sin = Math.sin(angle);
		var cos = Math.cos(angle);
		
		if (this.goX == 0 && this.goY == 0) {
			sin = 0;
			cos = 0;
		}
		
		this.vel.x += (sin * this.speed - this.vel.x) * (this.goX != 0 ? this.accelSpeed : this.deccelSpeed) * delta;
		this.vel.y += (cos * this.speed - this.vel.y) * (this.goY != 0 ? this.accelSpeed : this.deccelSpeed) * delta;
		
		
		
		//this.vel.x += (this.goX * this.speed - this.vel.x) * this.accelSpeed * delta;
		
		this.pos.x += this.vel.x;
		this.pos.y += this.vel.y;
		
		super.update();
	}
	drawUpdate() {
		super.drawUpdate();
	}
}

Utils = {};
//Utils.Epsilon = 1E-1000;
//Utils.GapEpsilon = 0.5;

Utils.len = function(x, y) {
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
};

Utils.dist = function(x1, y1, x2, y2) {
	return Utils.len(x2 - x1, y2 - y1);
};

Utils.angle = function(x, y) {
	return Math.atan2(x, -y) / Math.PI * 180;
};

Utils.angle = function(x1, y1, x2, y2) {
	return Math.atan2(x2 - x1, - y2 + y1) / Math.PI * 180;
};

Utils.closestPoint = function() {
	if (arguments.length < 2) return null;
	
	var cx = arguments[0].x;
	var cy = arguments[0].y;
	
	
	//World.drawPoint(cx, cy, [255,128,0]);
	
	var rx = 0;
	var ry = 0;
	var r = null;
	
	//World.drawPoint(rx, ry, [255,255,0]);
	
	log('closestPoint:');
	
	var initP = false;
	
	for (var i = 1; i < arguments.length; i ++) {
		
		//log('d'+i+': '+typeof(arguments[i]));
		if ("object" != typeof(arguments[i])) continue;
		
		if (!initP) {
			
			rx = arguments[i].x;
			ry = arguments[i].y;
			r = Utils.dist(cx, cy, rx, ry);
			
			initP = true;
		}
		
		var px = arguments[i].x;
		var py = arguments[i].y;
		
		var d = Utils.dist(cx, cy, px, py);
		//log('d'+i+': '+ d);
		
		//World.drawPoint(px, py, [255,255,0]);
		
		if (d < r) {
			rx = px;
			ry = py;
			r = d;
		}
	}
	if (r == null) return null;
	return { x: rx, y: ry };
};

Utils.rectCenter = function(pos, size) {
	return { x: pos.x + size.x / 2, y: pos.y + size.y / 2 };
}

Utils.manage2Rects = function(ent, wall) {
	/*
	// 1st method
	
	if (Utils.testTwoZoneCollide1D(ent.pos.y, ent.size.y, wall.pos.y + Utils.GapEpsilon, wall.size.y - (Utils.GapEpsilon * 2))) {
		if (Utils.testTwoZoneCollide1D(ent.pos.x, ent.size.x, wall.pos.x, 0)) {
			ent.pos.x = wall.pos.x - ent.size.x;
			if (ent.vel.x > 0) ent.vel.x = 0;
		}
		if (Utils.testTwoZoneCollide1D(ent.pos.x, ent.size.x, wall.pos.x + wall.size.x, 0)) {
			ent.pos.x = wall.pos.x + wall.size.x;
			if (ent.vel.x < 0) ent.vel.x = 0;
		}
	}
	
	if (Utils.testTwoZoneCollide1D(ent.pos.x, ent.size.x, wall.pos.x + Utils.GapEpsilon, wall.size.x - (Utils.GapEpsilon * 2))) {
		if (Utils.testTwoZoneCollide1D(ent.pos.y, ent.size.y, wall.pos.y, 0)) {
			ent.pos.y = wall.pos.y - ent.size.y;
			if (ent.vel.y > 0) ent.vel.y = 0;
		}
		if (Utils.testTwoZoneCollide1D(ent.pos.y, ent.size.y, wall.pos.y + wall.size.y, 0)) {
			ent.pos.y = wall.pos.y + wall.size.y;
			if (ent.vel.y < 0) ent.vel.y = 0;
		}
	}
	*/
	
	// 2nd method
	
	
	
	// for adaptive collision detection we first check if two rectangles actually collide
	if (ent.pos.x + ent.size.x <= wall.pos.x || ent.pos.x >= wall.pos.x + wall.size.x ||
		ent.pos.y + ent.size.y <= wall.pos.y || ent.pos.y >= wall.pos.y + wall.size.y) {
		
		return;
	}
	
	log('is in');
	
	
	// find closest points between first rectangle with second rectangle's center and other way around
	var wallCenter = Utils.rectCenter(wall.pos, wall.size);
	var entCenter = Utils.rectCenter(ent.pos, ent.size);
	
	var entP1 = { x: ent.pos.x, y: ent.pos.y };
	var entP2 = { x: ent.pos.x + ent.size.x, y: ent.pos.y };
	var entP3 = { x: ent.pos.x, y: ent.pos.y + ent.size.y };
	var entP4 = { x: ent.pos.x + ent.size.x, y: ent.pos.y + ent.size.y };
	
	var wallP1 = { x: wall.pos.x, y: wall.pos.y };
	var wallP2 = { x: wall.pos.x + wall.size.x, y: wall.pos.y };
	var wallP3 = { x: wall.pos.x, y: wall.pos.y + wall.size.y };
	var wallP4 = { x: wall.pos.x + wall.size.x, y: wall.pos.y + wall.size.y };
	
	//World.drawPoint(entP1.x, entP1.y, [255,255,255]);
	//World.drawPoint(entP2.x, entP2.y, [255,255,255]);
	//World.drawPoint(entP3.x, entP3.y, [255,255,255]);
	//World.drawPoint(entP4.x, entP4.y, [255,255,255]);
	
	// ent corner to wall
	var toWall = Utils.closestPoint(wallCenter, entP1, entP2, entP3, entP4);
	//World.drawPoint(toWall.x, toWall.y, [0,128,255]);
	
	// wall corner to ent
	var toEnt = Utils.closestPoint(entCenter, wallP1, wallP2, wallP3, wallP4);
	
	//World.drawPoint(wallP1.x, wallP1.y, [255,0,255]);
	//World.drawPoint(wallP2.x, wallP2.y, [255,0,255]);
	//World.drawPoint(wallP3.x, wallP3.y, [255,0,255]);
	//World.drawPoint(wallP4.x, wallP4.y, [255,0,255]);
	
	//World.drawPoint(toEnt.x, toEnt.y, [0,200,0]);
	
	
	// decide on which side is the entity's closest point to the wall
	var secondClosest = Utils.closestPoint(entCenter,
		Utils.pointMatch(wallP1, toEnt) ? 0 : wallP1,
		Utils.pointMatch(wallP2, toEnt) ? 0 : wallP2,
		Utils.pointMatch(wallP3, toEnt) ? 0 : wallP3,
		Utils.pointMatch(wallP4, toEnt) ? 0 : wallP4
	);
	
	//log('wallP1 ' + Utils.pointToString(wallP1));
	//log('toEnt ' + Utils.pointToString(toEnt));
	//log('match? ' + Utils.pointMatch(wallP1, toWall));
	
	//World.drawPoint(toWall.x, toWall.y, [255,255,255]);
	
	//World.drawPoint(secondClosest.x, secondClosest.y, [255,0,0]);
	
	if (toEnt.x == secondClosest.x) {
		if (toEnt.y == wall.pos.y) {
			ent.pos.x = toEnt.x - ent.size.x;
			if (ent.vel.x > 0) ent.vel.x = 0;
		} else if (toEnt.y == wall.pos.y + wall.size.y) {
			ent.pos.x = toEnt.x;
			if (ent.vel.x < 0) ent.vel.x = 0;
		}
	} else if (toEnt.y == secondClosest.y) {
		if (toEnt.x == wall.pos.x) {
			ent.pos.y = toEnt.y - ent.size.y;
			if (ent.vel.y > 0) ent.vel.y = 0;
		} else if (toEnt.x == wall.pos.x + wall.size.x) {
			ent.pos.y = toEnt.y;
			if (ent.vel.y < 0) ent.vel.y = 0;
		}
	}
	
};

Utils.testTwoZoneCollide1D = function(z1Pos, z1Size, z2Pos, z2Size) {
	
	if (z1Pos + z1Size < z2Pos || z1Pos > z2Pos + z2Size)
		return false;
	
	return true;
};

Utils.pointMatch = function(p1, p2) {
	return p1.x == p2.x && p1.y == p2.y;
};

Utils.pointToString = function(point) {
	return '[\n\t' + point.x + ',\n\t' + point.y + '\n]';
}

World = {};
World.gravity = {
	x: 0,
	y: -9.81
};
World.walls = [];
World.entities = [];
World.step = function() {
	
	/*
	if (obj.a.x < 0 + 16) obj.a.x = 0 + 16;
	if (obj.a.x > 1280 - 16) obj.a.x = 1280 - 16;
	if (obj.a.y < 0 + 16) obj.a.y = 0 + 16;
	if (obj.a.y > 720 - 16) obj.a.y = 720 - 16;
	*/
	
	for (var i = 0; i < World.entities.length; i ++) {
		
		//World.entities[i].vel.x += World.gravity.x * delta;
		//World.entities[i].vel.y += World.gravity.y * delta;
		
		
		for (var i2 = 0; i2 < World.walls.length; i2 ++) {
			Utils.manage2Rects(World.entities[i], World.walls[i2]);
		}
		
		World.entities[i].update();
		
		
		if (World.entities[i].pos.x < 0) World.entities[i].pos.x = 0;
		if (World.entities[i].pos.x > 1280 - 32) World.entities[i].pos.x = 1280 - 32;
		if (World.entities[i].pos.y < 0) World.entities[i].pos.y = 0;
		if (World.entities[i].pos.y > 720 - 32) World.entities[i].pos.y = 720 - 32;
	}
	
	for (var i = 0; i < World.entities.length; i ++) {
		World.entities[i].drawUpdate();
	}
	
	
};

World.pointsContainer = document.createElement('div');

World.drawPoint = function(x, y, color) {
	var p = document.createElement('div');
	
	p.style.position = 'absolute';
	p.style.width = '3px';
	p.style.height = '3px';
	p.style.left = x + 'px';
	p.style.bottom = y + 'px';
	p.style.transform = 'translate(-25%, 25%)';
	p.style.backgroundColor = 'rgb('+color[0]+', '+color[1]+', '+color[2]+')';
	
	World.pointsContainer.appendChild(p);
};

World.clearPoints = function() {
	World.pointsContainer.innerHTML = '';
};

// setup

document.head = document.createElement('head');
document.body = document.createElement('body');
document.body.style.overflow = 'hidden';
document.body.style.backgroundColor = 'rgb(64, 64, 64)';
document.body.style.margin = '0';

document.ent_container = document.createElement('div');
document.body.appendChild(document.ent_container);


var healthBar = {};
healthBar.bg = document.createElement('div');
healthBar.bg.style.position = 'absolute';
healthBar.bg.style.width = '128px';
healthBar.bg.style.height = '16px';
healthBar.bg.style.left = '16px';
healthBar.bg.style.bottom = '16px';
healthBar.bg.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

healthBar.bar = document.createElement('div');
healthBar.bar.style.position = 'absolute';
healthBar.bar.style.width = '128px';
healthBar.bar.style.height = '4px';
healthBar.bar.style.left = '0px';
healthBar.bar.style.bottom = '6px';
healthBar.bar.style.backgroundColor = 'rgb(0, 255, 64)';

document.body.appendChild(World.pointsContainer);

document.body.appendChild(healthBar.bg);
healthBar.bg.appendChild(healthBar.bar);

healthBar.update = function() {
	if (GetPlayer() == null) return;
	
	var hp = GetPlayer().health;
	var maxHp = GetPlayer().maxHealth;
	
	healthBar.bar.style.width = (128 * (hp / maxHp)) + 'px';
}

document.debug = document.createElement('div');
document.debug.id = 'debug';
//document.debug.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
document.debug.style.color = 'white';
document.debug.style.whiteSpace = 'pre';
document.debug.style.fontFamily = 'monospace';
document.body.appendChild(document.debug);

clearLog = function() {
	document.debug.innerText = '';
};

log = function(text) {
	document.debug.innerText += '\n' + text;
};

//new Entity();
new Player();
GetPlayer();

player.pos.x = 100;
player.pos.y = 300;


//new Wall(0, 0, 1280, 10);
//new Wall(0, 40, 500, 20);
new Wall(200, 200, 200, 200);

// run

window.funcInt = setInterval(function() {
	clearLog();
	World.clearPoints();
	
	World.step();
	
	healthBar.update();
	
}, delta * 1000); // 60 fps
