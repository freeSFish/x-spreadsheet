import { stringAt } from '../core/alphabet';
import { getFontSizePxByPt } from '../core/font';
import _cell from '../core/cell';
import { formulam } from '../core/formula';
import { formatm } from '../core/format';
import { CellRange } from '../core/cell_range';

import {
  Draw, DrawBox, thinLineWidth, npx,
} from '../canvas/draw';




// gobal var
const dict = require('../pinyin/dict_common.js');
const pinyin = require('../pinyin/pinyin.js')(dict);
const cellPaddingWidth = 5;
const tableFixedHeaderCleanStyle = { fillStyle: '#f4f5f8' };
const tableGridStyle = {
  fillStyle: '#fff',
  lineWidth: thinLineWidth,
  strokeStyle: '#e6e6e6',
};




function tableFixedHeaderStyle() {
  return {
    textAlign: 'center',
    textBaseline: 'middle',
    font: `500 ${npx(12)}px Source Sans Pro`,
    fillStyle: '#585757',
    lineWidth: thinLineWidth(),
    strokeStyle: '#e6e6e6',
  };
}

function getDrawBox(rindex, cindex) {
  const { data } = this;
  const {
    left, top, width, height,
  } = data.cellRect(rindex, cindex);
  return new DrawBox(left, top, width, height, cellPaddingWidth);
}

function renderCell(rindex, cindex) {
  const { draw, data } = this;
  const cell = data.getCell(rindex, cindex);

  const style = data.getCellStyleOrDefault(rindex, cindex);
  // console.log('style:', style);
  const dbox = getDrawBox.call(this, rindex, cindex);
  dbox.bgcolor = style.bgcolor;
  if (style.border !== undefined) {
    dbox.setBorders(style.border);
  }
  draw.rect(dbox, () => {
    if (cell !== null) {
      // render text
      let cellText = _cell.render(rindex, cindex, cell.text || '', formulam, (y, x) => (data.getCellTextOrDefault(x, y)));
      if (style.format) {
        // console.log(data.formatm, '>>', cell.format);
        cellText = formatm[style.format].render(cellText);
      }
      const font = Object.assign({}, style.font);
      font.size = getFontSizePxByPt(font.size);
      // console.log('style:', style);
      draw.text(cellText, dbox, {
        align: style.align,
        valign: style.valign,
        font,
        color: style.color,
        strike: style.strike,
        underline: style.underline,
      }, style.textwrap);
    }
  });
}

function renderContent({
  sri, sci, eri, eci,
}, scrollOffset) {
  const { draw, data } = this;
  const { cols, rows } = data;
  draw.save();
  draw.translate(cols.indexWidth, rows.height)
    .translate(-scrollOffset.x, -scrollOffset.y);

  // render cell at first
  const nviewRange = new CellRange(sri, sci, eri - 1, eci - 1);
  nviewRange.each((ri, ci) => {
    renderCell.call(this, ri, ci);
  });
  // render mergeCell at second
  data.eachMergesInView(nviewRange, (r) => {
    renderCell.call(this, r.sri, r.sci);
  });

  draw.restore();
}

function renderSelectedHeaderCell(x, y, w, h) {
  const { draw } = this;
  draw.save();
  draw.attr({ fillStyle: 'rgba(75, 137, 255, 0.08)' })
    .fillRect(x, y, w, h);
  draw.restore();
}

function renderFixedHeaders(viewRange) {
  const { draw, data } = this;
  const { cols, rows } = data;
  draw.save();
  const sumHeight = rows.sumHeight(viewRange.sri, viewRange.eri) + rows.height;
  const sumWidth = cols.sumWidth(viewRange.sci, viewRange.eci) + cols.indexWidth;
  // draw rect background
  draw.attr(tableFixedHeaderCleanStyle)
    .fillRect(0, 0, cols.indexWidth, sumHeight)
    .fillRect(0, 0, sumWidth, rows.height);

  const {
    sri, sci, eri, eci,
  } = data.selector.range;
  // console.log(data.selectIndexes);
  // draw text
  // text font, align...
  draw.attr(tableFixedHeaderStyle());
  // y-header-text
  data.rowEach(viewRange.sri, viewRange.eri, (i, y1, rowHeight) => {
    const y = y1 + rows.height;
    // console.log('y1:', y1, ', i:', i);
    draw.line([0, y], [cols.indexWidth, y]);
    if (i !== viewRange.eri) {
      if (sri <= i && i < eri + 1) {
        renderSelectedHeaderCell.call(this, 0, y, cols.indexWidth, rowHeight);
      }
      draw.fillText(i + 1, cols.indexWidth / 2, y + (rowHeight / 2));
    }
  });
  draw.line([cols.indexWidth, 0], [cols.indexWidth, sumHeight]);
  // x-header-text
  data.colEach(viewRange.sci, viewRange.eci, (i, x1, colWidth) => {
    const x = x1 + cols.indexWidth;
    // console.log('x1:', x1, ', i:', i);
    draw.line([x, 0], [x, rows.height]);
    if (i !== viewRange.eci) {
      if (sci <= i && i < eci + 1) {
        renderSelectedHeaderCell.call(this, x, 0, colWidth, rows.height);
      }
      draw.fillText(stringAt(i), x + (colWidth / 2), rows.height / 2);
    }
  });
  draw.line([0, rows.height], [sumWidth, rows.height]);
  // left-top-cell
  draw.attr({ fillStyle: '#f4f5f8' })
    .fillRect(0, 0, cols.indexWidth, rows.height)
    .line([cols.indexWidth, 0], [cols.indexWidth, rows.height])
    .line([0, rows.height], [cols.indexWidth, rows.height]);
  // context.closePath();
  draw.restore();
}

function renderContentGrid({
  sri, sci, eri, eci,
}, scrollOffset = { x: 0, y: 0 }) {
  const { draw, data } = this;
  const { cols, rows, settings } = data;
  if (!settings.showGrid) return;

  draw.save();
  draw.attr(tableGridStyle)
    .translate(cols.indexWidth, rows.height)
    .translate(scrollOffset.x, scrollOffset.y);
  const sumWidth = cols.sumWidth(sci, eci);
  const sumHeight = rows.sumHeight(sri, eri);
  // console.log('sumWidth:', sumWidth);
  draw.fillRect(0, 0, sumWidth, sumHeight);
  // console.log('rowStart:', rowStart, ', rowLen:', rowLen);
  data.rowEach(sri, eri, (i, y) => {
    draw.line([0, y], [sumWidth, y]);
  });
  data.colEach(sci, eci, (i, x) => {
    draw.line([x, 0], [x, sumHeight]);
  });
  draw.restore();
}

function renderFreezeHighlightLine(p1, p2) {
  const { draw, data } = this;
  const { rows, cols } = data;
  draw.save()
    .translate(cols.indexWidth, rows.height)
    .attr({ strokeStyle: 'rgba(75, 137, 255, .6)' });
  draw.line(p1, p2);
  draw.restore();
}

function renderFreezeGridAndContent({ eri, eci }) {
  const { data } = this;
  const [fri, fci] = data.freeze;
  const { scroll, cols, rows } = data;
  const sheight = rows.sumHeight(0, fri);
  const twidth = data.viewWidth();
  const ftw = data.freezeTotalWidth();
  const fth = data.freezeTotalHeight();
  if (fri > 0) {
    renderContentGrid.call(
      this,
      new CellRange(0, fci + data.scroll.ci, fri, eci),
      { x: ftw, y: 0 },
    );
    renderContent.call(
      this,
      new CellRange(0, fci, fri, eci),
      { x: scroll.x, y: 0 },
    );
  }
  const theight = data.viewHeight();
  const swidth = cols.sumWidth(0, fci);
  if (fci > 0) {
    renderContentGrid.call(
      this,
      new CellRange(fri + data.scroll.ri, 0, eri, fci),
      { x: 0, y: fth },
    );
    renderContent.call(
      this,
      new CellRange(fri, 0, eri, fci),
      { x: 0, y: scroll.y },
    );
  }
  renderFreezeHighlightLine.call(
    this, [0, sheight], [twidth, sheight],
  );
  renderFreezeHighlightLine.call(
    this, [swidth, 0], [swidth, theight],
  );
}

function renderAll(viewRange, scrollOffset) {
  // const { row, col, scrollOffset } = this;
  // console.log('viewRange:', viewRange);
  renderContentGrid.call(this, viewRange);
  renderContent.call(this, viewRange, scrollOffset);
  renderFixedHeaders.call(this, viewRange);
}

/** end */
class Table {
  constructor(el, data) {
    this.el = el;
    this.draw = new Draw(el, data.viewWidth(), data.viewHeight());
    this.data = data;
    this.odata = data.getData();
    this.filter = {};
    this.order = {};
  }

  getFilter(){
    return this.filter;
  } 
   
  setFilter(filter){
    this.filter = filter;
  }
  
  getOrder(){


    return this.order;
  }

  setOrder(order){
    const{data} =this;

    console.info("merges",data.merges.getData());
    if(data.merges.getData()&&data.merges.getData().length>0){
      alert("只有合并单元格内值相同，才能进行该操作！");
      return false;
    }
    //if(checkMerge()){
    //  alert("只有合并单元格内值相同，才能进行该操作！");
    //  return false;
    //}
    this.order=order;

 
    this.orderData.call(this,data);
    
    return true;
  }

  clearFilter(){
    const{data,odata} =this;
    data.setData(odata.getData());
  } 

  orderData(data){
    const {order} = this;

    const {key,value} = order;
    if(key&&value){
      console.info("data",data.rows);
      let rows = data.rows.getData();
      let rowarray = [];
      console.info("rows",rows);
      let firstrow = {};
      for(var i in rows){
        console.info("i",i);
        if(i!=0){
          rowarray.push(rows[i]);
        }else{
          firstrow = rows[i];
        }
      }
      console.info(rowarray);
      rowarray.sort((item1,item2)=>{
        console.info("item1",item1);
        console.info("pinyin",pinyin("测试"));
        let c1 = item1.cells[key]&&pinyin(item1.cells[key]['text']).join('')||"";
        let c2 = item2.cells[key]&&pinyin(item2.cells[key]['text']).join('')||"";
        if(value=="asc"){
          return c1.localeCompare(c2);
        }
        return c2.localeCompare(c1);
      })
      console.info(rowarray);
      let orderedrows = {};
      orderedrows[0] = firstrow; 
      rowarray.forEach((i,it)=>{
        console.info("i",i,"it",it);
        orderedrows[it+1]=i;
      });
      console.info("orderedrows",orderedrows);
      data.rows.setData(orderedrows);
    }
     
    return data;
  } 
  


  render() {
    // resize canvas
    const { data } = this;
    this.draw.resize(data.viewWidth(), data.viewHeight());
    this.clear();
    const viewRange = data.viewRange();
    renderAll.call(this, data.viewRange(), data.scroll);
    const [fri, fci] = data.freeze;
    if (fri > 0 || fci > 0) {
      renderFreezeGridAndContent.call(this, viewRange);
      renderAll.call(this, data.freezeViewRange(), { x: 0, y: 0 });
    }
  }

  clear() {
    this.draw.clear();
  }
}

export default Table;
