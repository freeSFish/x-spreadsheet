import { h } from './element';
import { cssPrefix } from '../config';

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

function drawbtn(cellbox,i){
	const {data} = this;
	
    this.btn[i].ctx = this.btn[i].el.getContext("2d");
    this.areaEl[i].children( this.btn[i]);
    this.layerEl.children(this.areaEl[i]);

    this.btn[i].ctx.scale(dpr(), dpr());
    //this.btn[i].ctx.fillStyle = '#A9A9A9';
    this.btn[i].ctx.strokeStyle = '#A9A9A9';
    this.btn[i].ctx.lineWidth = npx(2);
   
  

    //this.btn[i].ctx.rect(0, 0, npx(17),npx(17));
    //this.btn[i].ctx.stroke();
     

    this.btn[i].ctx.fillStyle = '#a8a9aa';
    this.btn[i].ctx.strokeStyle = '#a8a9aa';
    this.btn[i].ctx.lineWidth = npx(2);
    this.btn[i].ctx.moveTo(npx(8.5), npx(10.5));
    this.btn[i].ctx.lineTo(npx(5.5), npx(6.5));
    this.btn[i].ctx.lineTo(npx(11.5), npx(6.5));

    this.btn[i].ctx.closePath();
  
    this.btn[i].ctx.stroke();
    this.btn[i].ctx.fill();

     this.btn[i].ctx.save();
    this.btn[i].ctx.beginPath();
    this.btn[i].ctx.lineTo(0, 0);
    this.btn[i].ctx.lineTo(npx(17) , npx(0));
    
    this.btn[i].ctx.lineTo(npx(17),npx(17));
    this.btn[i].ctx.lineTo(0,npx(17));
    this.btn[i].ctx.closePath();
    this.btn[i].ctx.stroke();
    //this.btn[i].ctx.fill();
    this.btn[i].ctx.save();

    
}



export default class Filter{
   constructor(data,viewFn,layerEl) {
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
           this.range.sri = this.range.sri-1;
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
       this.layerEl = layerEl;
       //console.info("range", this.range);
        
       this.setOffset();
  }

  setFreezeLengths(width, height) {
    this.freeze.w = width;
    this.freeze.h = height;
  }

  clear(){
  	 //console.info("clear");
  	 for(var i =  this.range.sci;i<= this.range.eci;i++){
  	 	//console.info("areaEl",this.areaEl[i]);
  	 	if(this.areaEl[i]&&this.areaEl[i].parentNode){
  	 	//console.info("compare node",this.areaEl[i].parentNode==this.layerEl);
  	    }
  	 	if(this.areaEl[i]&&this.areaEl[i].el.parentNode==this.layerEl.el){
            if(this.btn[i]&&this.btn[i].ctx){
            	 	
				this.btn[i].ctx.clearRect(0,0,npx(17),npx(17));
            }
  	 	    this.layerEl.el.removeChild(this.areaEl[i].el);
  	    }
  	 }
  }

  showmenu(evt){
       const ri = this.range.sri;
       //console.info("evt",evt);
       //console.info("ri",ri,"ci",evt.target.getAttribute("ci"));
       const ci = evt.target.getAttribute("ci");
       //console.info("ri",ri,"ci",ci,);
       const cell = this.data.getCell(ri,ci);
       //console.info("cell",cell);
  }


  setOffset() {
  
    const {
      btn,freeze,areaEl,viewFn,data,range
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

      this.btn[i].on("click",(evt)=>this.showmenu.call(this,evt))

     }
  }


} 