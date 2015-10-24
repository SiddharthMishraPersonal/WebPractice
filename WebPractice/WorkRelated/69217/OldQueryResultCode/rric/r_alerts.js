

import React from 'react';

export default React.createClass({
    propTypes: {
        alertArr : React.PropTypes.array,
        isRep: React.PropTypes.bool
    },
    getInitialState: function() {
        return {

        }
    },
    render: function () {

        var alerts = this.props.alertArr.map((el) =>{
            var clname = "al_level al_lv" + el.lv;
            if(this.props.isRep) {
                return (<div><span className="al_levelpre">&nbsp;</span><span
                    className={clname}>&nbsp;</span><span>{el.tx}</span></div> );
            }
            else {
                return (<span><span className="al_levelpre">&nbsp;</span><span
                    className={clname}>&nbsp;</span><span>{el.tx}</span></span> );
            }
        });

        return (
            <div>
                <div className="alerttitle"><span className="al_tit">Alerts</span>&nbsp;<span>({this.props.alertArr.length})</span>
                    {alerts}
                </div>
            </div>
        );
    }
});
