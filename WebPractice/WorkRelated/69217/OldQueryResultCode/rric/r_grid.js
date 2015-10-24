
import React from 'react';
import R_col from './r_col';

export default React.createClass({
    propTypes: {
        datas: React.PropTypes.array,        // array of panel forms: { key: "Item title", fd: [ .. form description .. ] }
        isHighlight : React.PropTypes.bool,  // Highlight mode on/off
        allOpen: React.PropTypes.bool,       // toggle all forms open (true), or grid view (false)
        selHigh: React.PropTypes.object,     // selection of all highlighted items
        selForms: React.PropTypes.object,    // selection of all selected items
        colCnt: React.PropTypes.number,       // max count of colums
        isRep: React.PropTypes.bool           // is a print report ?
    },
    init: function() {
        this.f_keys1 = ["Photos","Known addresses","Contact Information","Narrative"];
        this.f_keys2 = ["Description","Identification","Gang affiliation","Family, associates" ];
        this.f_keys3 = ["Registry, Court","Incident history",  "Recent CAD calls"];
        this.f_keys4 = ["Automobiles","Permits","Weapons"];

        this.f_keysAll = [this.f_keys1, this.f_keys2, this.f_keys3, this.f_keys4];

        this.f_keysImgs = ["Photos"];
        this.f_keysDouble = ["Narrative"];
    },
    getInitialState: function() {
        this.init();
        var state = {
            dataCols : this.processDatas(this.props.datas)
        };

        return state;
    },
    componentWillReceiveProps: function() {
        console.log("Grid: updated data, datcnt=" + this.props.datas.length);

    },
    getFormat: function(el) {
        var match;
        match = this.f_keysImgs.reduce(function(p,c,i,a){
            return p || (el.key.substr(0, c.length)==c);
        },false);
        if(match){
            return "imgs";
        }

        return "tabtext";
    },
    processDatas: function(nv) {
        var cols = [];
        for(i=0;i<this.props.colCnt;i++) {
            cols.push([]);
        }

        this.cidx  = 0;
        this.props.selForms.imgs = [];
        if(nv) {
            for (var i = 0; i < nv.length; i++) {
                var el = nv[i];
                el.format = this.getFormat(el);

                if(this.props.colCnt!=4) {
                    // assign datas to colums one by one
                    var cid = i % this.props.colCnt;
                    cols[cid].push(el);
                }
                else {
                    // or assign datas to columns according to key dictionaries
                    var idx = this.f_keysAll.reduce(function (p, c, ii, a) {
                        if (p >= 0) {
                            return p;
                        }
                        else {
                            var k = c.reduce(function (p1, c1, i1, a1) {
                                return (c1 == el.key) ? i1 : p1;
                            }, -1);

                            return (k >= 0) ? ii : p;
                        }
                    }, -1);

                    if (idx >= 0) {
                        cols[idx].push(el);
                    }
                    else {
                        var colcnt = cols.reduce((p, c, k, a) => {
                            return (c < p.cnt) ? {cnt: c, idx: k} : p;
                        }, {cnt: 1000, idx: -1});

                        if (colcnt.idx >= 0) {
                            cols[colcnt.idx].push(el);
                        }
                        else {
                            cols[0].push(el);
                        }
                    }
                }

                // add item to selection pool. If picture, do it for each pic.
                if(this.f_keysImgs.indexOf(el.key)>=0) { // this is images
                    this.props.selForms.imgs.push(el);
                    for(var ii=0;ii<el.fd.length;ii++) {
                        var img = el.fd[ii];
                        var id = i + "." + ii;
                        if(!img.hasOwnProperty("issel")) {
                            img.issel = true;
                        }
                        img.selid = id;
                        this.props.selForms.items[id] = img;
                    }
                }
                else { // normal text
                    if(!el.hasOwnProperty("issel")) {
                        el.issel = true;
                    }
                    el.selid = i;
                    this.props.selForms.items[i] = el;
                }
            }
        }
        return cols;
    },
    render: function () {
        console.log("Grid: Render, datcnt=" + this.props.datas.length);
        var dataCols = this.processDatas(this.props.datas);
        console.log("Grid: processed data, col forms cnt=" + dataCols.map( (el) => { return el.length }).join());

        var self = this;
        var cols = dataCols.reduce(function(p,el,i,a) {
            p.push (
                <div>
                    <R_col datas={el} colidx={i} isHighlight={self.props.isHighlight} allOpen={self.props.allOpen}
                           selHigh={self.props.selHigh} selForms={self.props.selForms} isRep={self.props.isRep}></R_col>
                </div>
            );
            return p;
        },[]);

        return (
            <div className="grid">
                {cols}
                <div className='last'></div>
            </div>
        );
    }
});
