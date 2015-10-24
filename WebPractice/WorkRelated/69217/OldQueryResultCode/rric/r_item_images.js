
import React from 'react';

export default React.createClass({
    propTypes: {
        fkey: React.PropTypes.string,
        formdata: React.PropTypes.array,
        allOpen: React.PropTypes.bool,
        selForms: React.PropTypes.object,
        onekeyidx: React.PropTypes.string,
        isRep: React.PropTypes.bool
    },
    getDefaultProps: function() {
        return {
            fkey : "Title",
            formdata : [
                {
                    title: "This form has no formdata"
                }
            ],
            allOpen: false
        }
    },
    getInitialState: function() {
        var initState = {
            ismore : 0,
            isopen : false,
            issel : {}
        };
        this.updateStateToProps(initState, this.props);
        return initState;
    },
    updateStateToProps: function(state, props) {
        state.ismore = props.formdata.length>2;
        state.imgcnt = props.formdata.length;
        props.formdata.forEach( (el,i,a) =>{
            state.issel[el.selid] = el.issel;
        });
    },
    componentWillReceiveProps: function() {
        console.log("Item images: will update props, idx=" + this.props.onekeyidx);
        this.updateStateToProps(this.state,this.props);
        this.setState(this.state);
    },
    getopenstr:function(onopen,onclose,def) {
        var ret = def;
        if(this.props.allOpen) {
            // leave def
        }
        else {
            if (this.state.ismore) {
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

        if (this.state.ismore) {
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
    changeOpen: function(ev) {
        this.state.isopen = !this.state.isopen;
        this.setState(this.state);
    },
    changeSelForm: function(ev) {
        var domElem = ev.currentTarget;
        var sidx = domElem.getAttribute("data-selidx");

        if(this.props.selForms.items.hasOwnProperty(sidx)){
            this.props.selForms.items[sidx].issel = domElem.checked;
            this.state.issel[sidx] = domElem.checked;
        }
        this.setState(this.state);
    },
    isselform: function(selid) {
        var ret = this.props.selForms.items[selid].issel;
        return ret;
    },
    render: function () {
        console.log("Item Image " + this.props.onekeyidx + ": Render");
        var plusminusinner = this.getopenstr('\ue160','\ue159','');
        var plusminus = (this.state.ismore && (!this.props.isRep)) ?
            ( <button className="ric_plusminus ric_imgpos" onClick={this.changeOpen}>{plusminusinner}</button> ) : "";

        var imgInRowMax = this.props.isRep ? 10 : 2;
        var imgrows = this.props.formdata.reduce( (p,c,i,a) => {
            var row = [];
            if(i%imgInRowMax != 0 ) {
                row = p[p.length-1];
            }
            else {
                p.push(row);
            }
            row.push( c );
            return p;
        },[]);

        var icnt = 0;
        var htmlRow = imgrows.map( (el) => {
            var innerRow = el.map( (im) => {
                icnt ++;
                var issel = im.issel;
                var bkg = issel ? "nobor max114 bkgsel" : "nobor max114";
                if((icnt<=imgInRowMax) || (this.state.isopen) || (this.props.allOpen)) {
                    var p1 = ( <td className={bkg}><img className="img" src={im.img}/></td> );
                    var p2 = ( <td className={bkg}><input type="checkbox" data-selidx={im.selid} onChange={this.changeSelForm} checked={issel} /></td> );
                    return this.props.isRep ? p1 : [p1,p2];
                }
                else return null;
            });
            var row = innerRow ? ( <tr className="trimg">{innerRow}</tr> ) : '';
            return row;
        });

        var icnt = this.props.isRep ? "" : ( <span className='it_cnt'>({this.state.imgcnt})</span> );
        var tit = ( <div className="ric_key">
                        <span>{this.props.fkey} </span>{icnt}
                    </div> );
        return (
            <div className={this.getopenclass('ric_onekey isopen','ric_onekey','ric_onekey')}>
                {plusminus}

                {tit}
                <div className="last"></div>

                <table><tbody>
                {htmlRow}
                </tbody></table>

            </div>
        );
    }
});

