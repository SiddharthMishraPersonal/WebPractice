
import React from 'react';

import R_itemImages from './r_item_images';
import R_itemTabText from './r_item_tabtext';

export default React.createClass({
    propTypes: {
        datas: React.PropTypes.array, // array of panel forms: { key: "Item title", fd: [ .. form description .. ] }
        isHighlight : React.PropTypes.bool,  // Highlight mode on/off
        allOpen: React.PropTypes.bool,       // toggle all forms open (true), or grid view (false)
        selHigh:  React.PropTypes.object,  // selection of all highlighted items
        selForms:  React.PropTypes.object,  // selection of all highlighted items
        colidx: React.PropTypes.number, // id of column
        isRep: React.PropTypes.bool           // is a print report ?
    },
    getInitialState: function() {
        return {
            datas: this.props.datas
        }
    },
    componentWillReceiveProps: function componentWillReceiveProps() {
        console.log("Col id=" + this.props.colidx + " will receive props, dataCnt=" + this.props.datas.length);
    },
    render: function () {
        console.log("Col " + this.props.colidx + ": Render, datcnt=" + this.props.datas.length);
        var idx = 0;
        var els = '';

        if(this.props.datas instanceof Array) {
            els = this.props.datas.map((el) => {
                var ret = "";

                if (el.format == 'imgs') {
                    ret = (
                        <R_itemImages fkey={el.key} formdata={el.fd} format={el.format} allOpen={this.props.allOpen}
                                      onekeyidx={this.props.colidx+'.'+idx} isHighlight={this.props.isHighlight}
                                      selForms={this.props.selForms} isRep={this.props.isRep}></R_itemImages>
                    );
                    idx++;
                }
                else if (el.format == 'tabtext') {
                    ret = (
                        <R_itemTabText fkey={el.key} formdata={el.fd} format={el.format} selidx={el.selid} allOpen={this.props.allOpen}
                                       onekeyidx={this.props.colidx+'.'+idx} isHighlight={this.props.isHighlight}
                                       selHigh={this.props.selHigh} selForms={this.props.selForms} isRep={this.props.isRep} ></R_itemTabText>
                    );
                    idx++;
                }


                return ret;
            });
        }
        return (
            <div className="col">
                {els}
            </div>
        );
    }
});



