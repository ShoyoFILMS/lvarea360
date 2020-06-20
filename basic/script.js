'use strict';

/*
Lvarea360（ラべリア） サンプル
内装の紹介や道案内、観光案内などに使える
VRプログラムです。
*/

const area_name={'t1':'須田町1',
't2':'須田町2'};

const arrow1=document.querySelector('#arrow1');
const sky=document.querySelector('#sky');
const rotator=document.querySelector('#rotator');
const tooltip=document.querySelector('#tooltip');
const loading=document.querySelector('#preload');
const stage = new Konva.Stage({
	container: 'map',
	width: 250,
	height: 100
});
const layer = new Konva.Layer();

const areas={};
const labels=[];
const icons=[];
let move_from='';
let mode = 'view';
let tooltip_left=0;
let icon_links=[];

//エリア移動
function moveArea(name){

	if(move_from!=name){
		sky.setAttribute('src', './img/'+name+'.jpg');
		loading.style.visibility='visible';

		switch (name){
		    case 't1':
	    	    rotator.setAttribute('rotation',{x: 0, y: 20, z: 0});
				arrow1.setAttribute('visible',true);
				arrow1.setAttribute('position','-2 -2 -4');
				arrow1.setAttribute('rotation','-90 20 0');
				icon_links[0]='t2';
		    break;
		    case 't2':
		    	arrow1.setAttribute('visible',true);
		    	arrow1.setAttribute('position','4 -2 4');
		    	arrow1.setAttribute('rotation','-90 0 -100');
		    	icon_links[0]='t1';
		    break;
		}
		move_from=name;
		resetUI(name);
	}
}

sky.addEventListener('materialtextureloaded', function () {
	preload.style.visibility='hidden';
});


//ミニマップ
function makeArea(name, pos_x, pos_y){
	areas[name] = new Konva.Rect({
		x: pos_x,
		y: pos_y,
		width: 30,
		height: 30,
		fill: 'white',
		stroke: 'black',
		strokeWidth: 2
	});
	areas[name].attrs.name=name;
	areas[name].attrs.selected=false;
	areas[name].addEventListener('click', function(){
		event.preventDefault();
		moveArea(this.attrs.name);
	});
	areas[name].addEventListener('mouseover', function() {
		tooltip.innerText=area_name[this.attrs.name];
		tooltip.style.display='inline-block';
		this.fill('#fc0');
		layer.draw();
	});
	areas[name].addEventListener('mouseout', function() {
		tooltip.style.display='none';
		if(!this.attrs.selected){
			this.fill('#fff');
			layer.draw();
		}
	});
	layer.add(areas[name]);
}
function makeAreaFree(name, pos_x, pos_y, width, height){
	areas[name] = new Konva.Rect({
		x: pos_x,
		y: pos_y,
		width: width,
		height: height,
		fill: 'white',
		stroke: 'black',
		strokeWidth: 2
	});
	areas[name].attrs.name=name;
	areas[name].attrs.selected=false;
	areas[name].addEventListener('click', function(){
		event.preventDefault();
		moveArea(this.attrs.name);
	});
	areas[name].addEventListener('mouseover', function() {
		tooltip.innerText=area_name[this.attrs.name];
		tooltip.style.display='inline-block';
		this.fill('#fc0');
		layer.draw();
	});
	areas[name].on('mouseout', function(e) {
		tooltip.style.display='none';
		if(!e.target.attrs['selected']){
			e.target.fill('white');
			layer.draw();
		}
	});
	layer.add(areas[name]);
}
function makelabel(label_text, x, y){
	const label = new Konva.Text({
		x: x,
		y: y,
		text: label_text,
		fontSize: 30,
		fontFamily: 'Calibri',
		fill: 'white'
	});
	layer.add(label);
	labels.push(label);
}
function putIcon(id, icon_x, icon_y){
	const img = new Image();
	img.onload = function() {
		let icon = new Konva.Image({
			x: icon_x,
			y: icon_y,
			image: img,
			width: 30,
			height: 30
		});
		layer.add(icon);
		layer.draw();
	};
	img.src = './icon/'+id+'.png';
}

function resetUI(name){
	document.querySelectorAll('#jump_map li').forEach((el) => {el.classList.remove('selected');});
	document.querySelector('#jump_map li[sky='+name+']').classList.add('selected');
	if( typeof areas[name] !== 'undefined'){

		Object.keys(areas).forEach(function(index){
			areas[index].attrs['selected']=false
			areas[index].fill('white');
		});
		areas[name].attrs['selected']=true;
		areas[name].fill('#fc0');
		layer.draw();
	}
}

document.addEventListener("mousemove", function(e){
	tooltip_left = e.clientX+10;
	if(window.innerWidth<tooltip_left+tooltip.clientWidth){
		tooltip_left=e.clientX-tooltip.clientWidth;
	}
	tooltip.style.top=e.clientY+10+'px';
	tooltip.style.left=tooltip_left+'px';
});




arrow1.addEventListener('mousedown', function(){
	event.preventDefault();
	moveArea(icon_links[0]);
});


makelabel('須田町',10, 10);
makeArea('t1', 10, 50);
makeArea('t2', 40, 50);

stage.add(layer);

document.querySelector('#mode .view').addEventListener('click', function(){
	event.preventDefault();
	document.querySelectorAll('#mode li').forEach((el) => { el.classList.remove('selected'); });
	document.querySelector('#mode .view').classList.add('selected');

	if(window.innerWidth>=560){
		document.querySelector('#map').style.visibility = 'visible';
		document.querySelector('#jump_map').style.visibility = 'visible';
	}else{
		document.querySelector('#map').style.visibility='hidden';
		document.querySelector('#jump_map').style.visibility='hidden';
	}
	mode = 'view';
});
document.querySelector('#mode .map').addEventListener('click', function(){
	event.preventDefault();
	document.querySelectorAll('#mode li').forEach((el) => { el.classList.remove('selected'); });
	document.querySelector('#mode .map').classList.add('selected');
	document.querySelector('#map').style.visibility = 'visible';
	document.querySelector('#jump_map').style.visibility='hidden';
	mode = 'map';
});
document.querySelector('#mode .area').addEventListener('click', function(){
	event.preventDefault();
	document.querySelectorAll('#mode li').forEach((el) => { el.classList.remove('selected'); });
	document.querySelector('#mode .area').classList.add('selected');
	document.querySelector('#map').style.visibility = 'hidden';
	document.querySelector('#jump_map').style.visibility='visible';
	mode = 'area';
});


Object.keys(area_name).forEach(function(index){
  document.querySelector('#jump_map').insertAdjacentHTML('beforeend','<li sky='+index+'>'+area_name[index]+'</li>');
});

for (const index of document.querySelector('#jump_map').children){
	index.addEventListener('click', function(e){
		e.preventDefault();
		moveArea(e.target.getAttribute('sky'));
	});
}

//init
moveArea('t1');
loading.style.visibility = 'hidden';