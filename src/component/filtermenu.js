/* global window */
import { h } from './element';
import { bind } from '../event';
import { cssPrefix } from '../config';
import { tf } from '../locale/locale';
import Icon from './icon';

const menuItems = [
  { key: 'asc', title: tf('filtermenu.asc'), label: '' },
  { key: 'desc', title: tf('filtermenu.desc'), label: '' },
 
  { key: 'divider' },
  
];

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

function buildMenuItem(item) {
  if (item.key === 'divider') {
    return h('div', `${cssPrefix}-item divider`);
  }
  return h('div', `${cssPrefix}-item`)
    .on('click', () => {
      this.itemClick(item.key,this.ci);
     
      this.hide();
    })
    .children(
      buildButtonWithIcon.call(this,"",item.key),
      item.title(),
      h('div', 'label').child(item.label || ''),
    );
}

function buildMenu() {
  return menuItems.map(it => buildMenuItem.call(this, it));
}

export default class FilterMenu {
  constructor(viewFn,table,layerEl,sheet,filter) {
    this.filter = filter;
    this.table=table;
    this.sheet=sheet;
    this.layerEl = layerEl;
    this.el = h('div', `${cssPrefix}-filtermenu`)
      .children(...buildMenu.call(this))
      .hide();
    this.layerEl.children(this.el);

    this.viewFn = viewFn;
    this.itemClick = (key,ci) => {
      console.info(key);
      console.info(ci);
      if(key=="asc"||key=="desc"){
        const success = this.table.setOrder.call(this.table,{key:ci,value:key});
        if(success){
          this.sheet.orderChange.call(this.sheet,{key:ci,value:key});
          this.filter.change(key,ci);
        }
      }
    };
    bind(window, 'click', (evt) => {
      console.log('outside:::', evt.target.className);
      if(evt.target.className.indexOf("x-spreadsheet-filter-btn")!=-1) return;
      if (this.el.contains(evt.target)) return;
      this.hide();
    });
  }

  hide() {
    this.el.hide();
  }

  setPosition(x, y,ci) {
    console.info("mene show");
    this.ci = ci;
    const { el } = this;
    const { height, width } = el.show().offset();
    const view = this.viewFn();
    let top = y;
    let left = x;
    if (view.height - y <= height) {
      // -1 : firefox bug, focus contextmenu
      top -= height - 1;
    }
    if (view.width - x <= width) {
      // -1 : firefox bug, focus contextmenu
      left -= width - 1;
    }
    el.offset({ left, top });
    el.show();
  }
}
