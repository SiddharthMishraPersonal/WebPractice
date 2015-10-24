import React from 'react';

export default React.createClass({
    propTypes: {
        logo: React.PropTypes.object,  // containing obj { img: imageSource }
        field: React.PropTypes.string,
        val: React.PropTypes.string
    },
    getInitialState: function() {
        return {

        }
    },
    render: function () {
        var logoSrc = (this.props.logo && this.props.logo.img) ? this.props.logo.img : null;
        var logo = logoSrc ? (
            <div className="logoDiv right"><img className="logoImg" src={logoSrc}></img></div>
        ) : "";

        return (
            <div className="ric_rp_header" >
                <div className="left">
                    <div className="ric_rp_field">{this.props.field}</div>
                    <div className="ric_rp_val">{this.props.val}</div>
                </div>
                {logo}
                <div className='last'></div>
            </div>
        );
    }
});

