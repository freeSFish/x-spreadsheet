import { h } from './element';
import { cssPrefix } from '../config';
import FilterMenu from './filtermenu';
import Icon from './icon';

const $ = require('jquery');

function dpr() {
  
  return window.devicePixelRatio || 1;
}

function thinLineWidth() {
  return dpr() - 0.5;
}

function npx(px) {
  return parseInt(px * dpr(), 10);
}


function offset(){

}


function buildButton(tooltipdata) {
  return h('div', `${cssPrefix}-menu-btn`)
    .on('mouseenter', (evt) => {
       
    });
    
}
function buildIcon(name) {
  return new Icon(name);
}
function buildButtonWithIcon(tooltipdata, iconName, change = () => {}) {
  return buildButton(tooltipdata)
    .child(buildIcon(iconName))
    .on('click', () => change());
}

function drawbtn(cellbox,i){
  
	const {data,table} = this;

  console.info("drawbtn cellbox",i,this.order);
 
    i= parseInt(i);
        
    this.areaEl[i].children( this.btn[i]);
    this.layerEl.children(this.areaEl[i]);

    if(this.ctx[i]==null) {   
      console.info("::draw filter is null");
      this.ctx[i] = this.btn[i].el.getContext("2d"); 
    }
    this.ctx[i].clearRect(0,0,npx(17),npx(17));
    this.ctx[i].scale(dpr(), dpr());
	  if(this.order){
      if(parseInt(this.order.key)==i){
        console.info("::draw filter btn");
         
       // const filterimg ='<g xmlns="http://www.w3.org/2000/svg" transform="translate(0,0)"><path fill="#000000" fill-rule="evenodd" d="M0,0 L0,1 L6,7 L6,12 L8,11 L8,7 L14,1 L14,0 L0,0 Z M4,3 L10,3 L7,6 L4,3 Z" transform="translate(2 3)"/></g>';
        

        //this.ctx[i].scale(dpr(), dpr());
        //this.ctx[i].clearRect(0,0,npx(17),npx(17));

       //this.btn[i].el.classList.remove("filter-down");
       //this.btn[i].el.classList.add("autofilter");
       //this.ctx[i].restore();
       this.ctx[i].strokeStyle = '#A9A9A9';
       this.ctx[i].lineWidth = npx(2);
       this.ctx[i].beginPath();
       this.ctx[i].moveTo(npx(8.5), npx(9.5));
       this.ctx[i].lineTo(npx(2.5), npx(3.5));
       this.ctx[i].lineTo(npx(14.5), npx(3.5));
       this.ctx[i].lineTo(npx(8.5), npx(9.5));
       this.ctx[i].lineTo(npx(8.5), npx(17));
       this.ctx[i].lineTo(npx(17), npx(17)); 
       this.ctx[i].lineTo(npx(17), npx(0)); 
       this.ctx[i].lineTo(npx(0), npx(0)); 
       this.ctx[i].lineTo(npx(0), npx(17)); 
       this.ctx[i].lineTo(npx(8.5), npx(17));
       this.ctx[i].closePath();
       this.ctx[i].stroke();
       this.ctx[i].save();
        return;
      }
    }
    //this.btn[i].el.classList.remove("autofilter");
    //this.btn[i].el.classList.add("filter-down");
    //$(this.btn[i].el).removeClass("autofilter");
    //$(this.btn[i].el).addClass("filter-down");
    //$.parser.parse();
   
    

    
    
    //this.ctx[i].fillStyle = '#A9A9A9';
   
    this.ctx[i].strokeStyle = '#A9A9A9';
    this.ctx[i].lineWidth = npx(2);
   
  

    //this.ctx[i].rect(0, 0, npx(17),npx(17));
    //this.ctx[i].stroke();
     

   
    this.ctx[i].strokeStyle = '#a8a9aa';
    this.ctx[i].lineWidth = npx(2);
    this.ctx[i].beginPath();
    this.ctx[i].moveTo(npx(8.5), npx(10.5));
    this.ctx[i].lineTo(npx(5.5), npx(6.5));
    this.ctx[i].lineTo(npx(11.5), npx(6.5));

    this.ctx[i].closePath();
  
    this.ctx[i].stroke();
    this.ctx[i].fillStyle = '#a8a9aa';
    this.ctx[i].fill();

    this.ctx[i].save();
    this.ctx[i].beginPath();
    this.ctx[i].lineTo(0, 0);
    this.ctx[i].lineTo(npx(17) , npx(0));
    
    this.ctx[i].lineTo(npx(17),npx(17));
    this.ctx[i].lineTo(0,npx(17));
    this.ctx[i].closePath();
    this.ctx[i].stroke();
    //this.ctx[i].fill();
    this.ctx[i].save();
     
}



export default class Filter{
   constructor(data,viewFn,layerEl,table,sheet) {
       
         this.table = table;
   	    //console.info("Filter create");
   	    let range = data.selector.range;

   	    const [ri, ci] = data.freeze;
   	    if(ri>0||ci>0){
   	        this.freeze = { w: data.freezeTotalWidth(), h: data.freezeTotalHeight() };


   	    }else{
   	        this.freeze = { w: 0, h: 0};	
   	    }
       // console.info("freeze",this.freeze);
   	    const {
		    sri, sci, eri, eci,
		  } = range;
	   this.range = {};	  
	   if(sri<eri){
	   	 this.range.sri = sri;

	   }else{
	   	this.range.sri = eri;
	   }
	   if(this.range.sri!=0){
          //this.range.sri = this.range.sri-1;
          this.range.sri=0; 
	   }
	   this.range.eri = this.range.sri;

	   if(sci<eci){
	   	 this.range.sci = sci;
         this.range.eci = eci;
	   }else{
	   	this.range.sci = eci;
	   	this.range.eci = sci;
	   }



       this.data = data;
       this.viewFn = viewFn;
	   
       this.panel = null;
       this.btn = {};

       this.areaEl={};
       this.ctx ={};
       this.layerEl = layerEl;
       //console.info("range", this.range);
        
       this.setOffset();
 
       this.menu = new FilterMenu(viewFn,table,layerEl,sheet,this);

      
       this.sheet = sheet;
  }

  setFreezeLengths(width, height) {
    this.freeze.w = width;
    this.freeze.h = height;
  }

  clear(){
     this.table.order={};
  	 //console.info("clear");
  	 for(var i =  this.range.sci;i<= this.range.eci;i++){
  	 	//console.info("areaEl",this.areaEl[i]);
  	 
  	 	if(this.areaEl[i]&&this.areaEl[i].el.parentNode==this.layerEl.el){
            if(this.btn[i]&&this.ctx[i]){
            	console.info("clearRect"); 	
				      this.ctx[i].clearRect(0,0,npx(17),npx(17));
            }
  	 	    this.layerEl.el.removeChild(this.areaEl[i].el);
  	    }
  	 }
     this.ctx = {}; 
     if(this.menu&&this.menu.el&&this.menu.el.parentNode==this.layerEl.el){
       this.layerEl.el.removeChild(this.menu.el);
     }
     console.info("clear done");
  }

  change(key,ci){
     if(key=="asc"||key=="desc"){
       this.setOffset();
     } 
  }
  setOrder(order){
     this.order = order;
  }
  showmenu(evt){
       const {elOffset} = this;
       const ri = this.range.sri;
       //console.info("evt",evt);
       //console.info("ri",ri,"ci",evt.target.getAttribute("ci"));
       const ci = evt.target.getAttribute("ci");
       console.info("evt.target",evt.target.parentNode.offsetLeft);

       const {left,top} = {left:evt.target.parentNode.offsetLeft,top:evt.target.parentNode.offsetTop};
     
       const cell = this.data.getCell(ri,ci);
       this.menu.setPosition(left,top+npx(17),ci);
       //console.info("cell",cell);
  }


  setOffset() {
  
    const {
      btn,freeze,areaEl,viewFn,data,range,menu
    } = this;
    for(var i =  this.range.sci;i<= this.range.eci;i++){
      let offset = data.getRect({sri:this.range.sri, sci:i,eri:this.range.sri,eci:i} );
      this.areaOffset = offset;
      const cellpos = data.cellPosition(this.range.sri,i);
      const {
        left, top, width, height, l, t,
      } = offset;

      //console.info("offset",offset);


      if(left<0){
      	continue;
      }
      if(l>=freeze.w){
      if(left<freeze.w){
      	continue;
      }
      }
       if((l-left)>0) {
       	   if(freeze.w<l&&freeze.w>left){
	         continue;
       	   }
	   }
      if(l>freeze.w||t>freeze.h){

	      
	      if(freeze.h>(offset.top)&&t-top>0) {
	         continue;
	      }
      }
       
      this.areaEl[i] =h("div",`${cssPrefix}-filter-area`);
      this.btn[i] = h("canvas", `${cssPrefix}-filter-btn`);
      this.btn[i].attr("ci",i);
      this.btn[i].attr("width","17px");
      this.btn[i].attr("height","17px");


      //let top = this.viewFn().top+cellbox.top+cellbox.width-npx(17);
      //let left = this.viewFn().left + cellbox.left-npx(17);
      //this.btn[i].offset({top:top,left:left})
       
  
 
     
      // console.log('left:', left, ',top:', top, ', freeze:', freeze);
      const elOffset = { left: offset.left+viewFn().left, top: offset.top+viewFn().top };
      // top left

      if (freeze.w >=(l+width) && freeze.h >=(t+height)) {
        //
      } else if (freeze.w < (l+width) && freeze.h < (t+height)) {
        //elOffset.left += freeze.w;
       // elOffset.top += freeze.h;
      } else if (freeze.w > (l+width)) {
        //elOffset.top += freeze.h;
      } else if (freeze.h > (t+height)) {
        //elOffset.left =  elOffset.left+freeze.w;
      }
       //console.info("freeze",freeze);
      elOffset.left = elOffset.left+offset.width-npx(17);
      elOffset.top = elOffset.top+offset.height-npx(17);
      //if(elOffset.left<viewFn().left||elOffset.top<viewFn().left){
      	//continue;
      //}
     

      //console.info(data.scroll);
      areaEl[i].offset(elOffset);
       
      drawbtn.call(this,offset,i);
      this.elOffset = elOffset;
      this.btn[i].on("click",(evt)=>this.showmenu.call(this,evt))
     

     }
  }


} 