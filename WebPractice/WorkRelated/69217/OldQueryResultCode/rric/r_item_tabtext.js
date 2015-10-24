
import React from 'react';

export default React.createClass({
    propTypes: {
        fkey: React.PropTypes.string,
        formdata: React.PropTypes.array,
        allOpen: React.PropTypes.bool,
        isHighlight: React.PropTypes.bool,
        selHigh: React.PropTypes.object,
        selForms: React.PropTypes.object,
        selidx: React.PropTypes.string,
        onekeyidx: React.PropTypes.string,
        isRep: React.PropTypes.bool           // is a print report ?
    },
    getInitialState: function() {
        this.myidx = 0; // used to count and index all highightable elements in box.

        return {
            isopen: false,          // is given box open? or close?
            isbig: false,           // is given box size bigger than std size?
            issel: this.isselform(),
            selHigh: this.props.selHigh,
            maxheight:150
        }
    },
    getopenstr:function(onopen,onclose,def) {
        var ret = def;
        if(this.props.allOpen) {
            // leave def
        }
        else {
            if (this.state.isbig) {
                if (this.state.isopen) {
                    ret = onopen;
                }
                else {
                    ret = onclose;
                }
            }
            else {
                // default
            }
        }
        return ret;
    },
    getopenclass:function(onopen,onclose,def) {
        var ret = def;

        if (this.state.isbig) {
            if (this.state.isopen || this.props.allOpen) {
                ret = onopen;
            }
            else {
                ret = onclose;
            }
        }
        else {
            // default
        }

        return ret;
    },
    getselstr:function(onsel,onnotsel) {
        var ret = '';
        var issel = this.isselform();
        ret = issel ? onsel : onnotsel;
        return ret;
    },
    getmyidx: function(elel) {
        var uidx;

        if(elel.hasOwnProperty("uidx")) {
            uidx = elel.uidx;
        }
        else {
            this.myidx++;
            //console.log("Max UIDX = " + this.myidx);
            if (this.myidx > 3000) {
                console.log("Error in r_item_tabtext: loop too long - too many box elements");
            }

            uidx = this.props.onekeyidx + "." + this.myidx; // univeral index of hightligtable elems
            elel.uidx = uidx;
            this.state.selHigh.items[uidx] = {el: elel, uidx: uidx};
        }
        return uidx;
    },
    getstyle: function(el) {
        var st = {};
        var issel = el.issel;
        var ishigh = this.props.isHighlight && el.uidx && issel;
        if(el.bkg) {
            st.background = (ishigh ? 'lawngreen' : el.bkg);
        }
        else if(ishigh) {
            st.background = 'yellow';
        }
        return st;
    },
    isstring: function (el) {
        return el && ( typeof el == "string" ) && ( el.length>0 );
    },
    isempty: function (el) {
        var jel = '';
        if(el && (typeof el == 'object')) {
            jel = JSON.stringify(el);
        }
        var ret = (el == null) || (el==undefined) || (el == "") || (jel == "{}") || (jel == '{"text":""}');
        return ret;
    },
    hasprop: function(el,prop) {
        var ret = el && el.hasOwnProperty(prop);
        return ret;
    },
    changeOpen: function(ev) {
        this.state.isopen = !this.state.isopen;
        this.setState(this.state);
    },
    clickSelHigh: function(ev) {
        if(this.props.isHighlight) {
            var del = ev.currentTarget;
            var uidx = del.getAttribute("data-selhighidx");

            if(uidx) {
                if (this.state.selHigh.uidxs.hasOwnProperty(uidx) && this.state.selHigh.uidxs[uidx]) {
                    this.state.selHigh.uidxs[uidx].el.issel = false;
                    this.state.selHigh.uidxs[uidx] = null;
                }
                else {
                    var el = this.state.selHigh.items[uidx].el;
                    this.state.selHigh.uidxs[uidx] = { uidx: uidx, el: el };
                    el.issel = true;
                }
                this.setState(this.state);
            }
        }
    },
    changeSelForm: function(ev) {
        var domElem = ev.currentTarget;
        var sidx = domElem.getAttribute("data-selidx");

        if(this.props.selForms.items.hasOwnProperty(sidx)){
            this.props.selForms.items[sidx].issel = domElem.checked;
            this.state.issel = domElem.checked;
        }
        this.setState(this.state);
    },
    isselform: function() {
        var ret = this.props.selForms.items[this.props.selidx].issel;
        return ret;
    },
    hasLevel: function(el) {
        var ret = el && el.hasOwnProperty("lv");
        return ret;
    },
    markerLevel: function(lv) {
        var level = (typeof lv == "string") ? parseInt(lv) : lv;
        return level;
    },
    markerClass: function(lv) {
        var cl = "it_level it_lv" + this.markerLevel(lv);
        return cl;
    },
    componentWillReceiveProps: function() {
        console.log("Item Tabtext - new props: keyidx=" + this.props.onekeyidx);
    },
    componentDidMount: function() {
        console.log("Item TabText " + this.props.onekeyidx + ": Render");
        var domElem = React.findDOMNode(this.refs.datacol);
        var isBig;
        var prevIsBig  = this.state.isbig;
        if(domElem) {
            var ch = domElem.clientHeight;
            var sh = domElem.scrollHeight;
            if(sh > this.state.maxheight) {
                isBig = true;
            }
            else {
                isBig = false;
            }
            if(isBig != prevIsBig) {
                this.state.isbig = isBig;
                this.setState(this.state);
            }
        }
    },
    render: function () {
        var self = this;
        var formitems = this.props.formdata.map((el) => {

            if (el && (el instanceof Array)) {

                var hasMarkers = el.reduce((p,c,i,a) => {
                    return self.hasLevel(c) ? true : p;
                },false);

                var elels = el.map((elel) => {
                    // in case val is an array - build a series of TDs
                    var valtable = (elel && (elel.val instanceof Array)) ? elel.val.map((myel) => {
                        return (
                            <td>{myel}</td>
                        )
                    }) : '';

                    // for string - build a single column
                    var strdata = self.isstring(elel.val) ?
                        ( <td className="it_txb" colSpan="3">{elel.val}</td> ) : '';

                    var marker = self.hasLevel(elel) ?
                        ( <td className="it_lvtd"><span className={self.markerClass(elel.lv)}>&nbsp;</span> </td> ) :
                        (hasMarkers ? ( <td>&nbsp; </td> ) : '' );

                    return (
                        <tr style={self.getstyle(elel)} data-selhighidx={self.getmyidx(elel)}
                            onClick={self.clickSelHigh}>
                            {marker}
                            <td>{elel.key}</td>
                            {valtable}
                            {strdata}
                        </tr>
                    );
                });

                return (
                    <div className="ric_tablediv">
                        <table className='it_table'>
                            <tbody>
                                {elels}
                            </tbody>
                        </table>
                    </div>
                );
            }

            // add marker if present
            var marker = '';
            if(this.hasLevel(el)) {
                marker = ( <span className={self.markerClass(el.lv)}>&nbsp;</span> );
            }

            if (this.hasprop(el, 'title')) {
                return ( <div className="it_tit" onClick={self.clickSelHigh} style={self.getstyle(el)}  data-selhighidx={self.getmyidx(el)}>{[marker,el.title]}</div> );
            }
            if (this.hasprop(el, 'textb')) {
                return ( <div className="it_txb" onClick={self.clickSelHigh} style={self.getstyle(el)}  data-selhighidx={self.getmyidx(el)}>{[marker,el.textb]}</div> );
            }
            if (this.hasprop(el, 'text')) {
                return ( <div className="it_tx" onClick={self.clickSelHigh} style={self.getstyle(el)}  data-selhighidx={self.getmyidx(el)}>{[marker,el.text]}</div> );
            }
            if (this.hasprop(el, 'date')) {
                return ( <div className="it_dat" onClick={self.clickSelHigh} style={self.getstyle(el)}  data-selhighidx={self.getmyidx(el)}>{[marker,el.date]}</div> );
            }
            if (this.isempty(el)) {
                return ( <div className="it_tx">&nbsp;</div> );
            }
            if (this.isstring(el)) {
                return ( <div className="it_tx" >{el}</div> );
            }
            return '';
        });

        // note: we added class 'none' when we want placeholder to stay, but show no real icon
        var plusminusinner = self.getopenstr('\ue160','\ue159','');
        var more = self.getopenstr('','More...','');
        var plusminusclass = (plusminusinner.length>0) ? "ric_plusminus" : "ric_plusminus none";
        var plusmin = this.props.isRep ? ( "" ) : (
            <td>
                <button className={plusminusclass} onClick={self.changeOpen}>{plusminusinner}</button>
            </td>
        );
        var morediv = (more.length>0) ? ( <div className='it_morediv' onClick={self.changeOpen}>{more}</div> ) : "";
        var tabclass = (more.length>0) ? "toptable morediv" : "toptable";

        var chbox = this.props.isRep ? ( "" ) : (
            <div className="ric_sel"><input type="checkbox" onChange={self.changeSelForm} checked={self.isselform()} data-selidx={self.props.selidx} /></div>
        );

        return (
            <div className={self.getopenclass('ric_onekey isopen','ric_onekey','ric_onekey') + self.getselstr(' bkgsel','')} >
                {morediv}
                <table className={tabclass}>
                    <tbody>
                    <tr className="toptr">
                        {plusmin}
                        <td ref="datacol">
                            <div className="ric_key">{self.props.fkey}</div>
                            {chbox}
                            <br className="last" />
                                {formitems}
                        </td>
                    </tr>
                    </tbody>
                </table>

            </div>
        );
    }
});

