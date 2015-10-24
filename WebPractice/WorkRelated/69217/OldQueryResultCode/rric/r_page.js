import React from "react";
import R_alerts from "./r_alerts";
import R_reportHeader from "./r_report_header";
import R_grid from "./r_grid";

export default React.createClass({
    propTypes: {
        alertArr: React.PropTypes.array,  // array of Alert elements: { lv: 1, tx: "Active warrant" },
        datas: React.PropTypes.array,     // array of panel forms: { key: "Item title", fd: [ .. form description .. ] }
        titleArr: React.PropTypes.arrayOf(React.PropTypes.string), // 3 strings: PERSON/CASE/PROPERTY, subtitle PERSON NAME/REPORT TYPE/DESCRIPTION, name
        selHigh: React.PropTypes.object,  // local prop (not to be used by parent elem) List of highlight selections of text.
        selForms: React.PropTypes.object,  // local prop (not to be used by parent elem) List of form selections + image selections
        colCnt: React.PropTypes.number,       // max count of colums
        logo: React.PropTypes.object,  // object containing { img: "image source" }
        isRep: React.PropTypes.bool,
        myWindow: React.PropTypes.object,
        actionAct: React.PropTypes.object
    },
    getDefaultProps: function() {
        return {
            selHigh: {
                items : {},
                uidxs : {}
            },
            selForms: {
                items: {},
                imgs: []
            }
        }
    },
    getInitialState: function() {
        var self = this;
        
        return {
            isHighlight : this.props.isRep,
            allOpen: false,
            selForms: this.props.selForms
        }
    },
    
    allOpenToggle: function() {
        this.state.allOpen = !this.state.allOpen;
        this.setState(this.state);
    },
    highlightToggle: function() {
        this.state.isHighlight = !this.state.isHighlight;
        this.setState(this.state);
    },
    getSelected: function() { // rewrites all selected data objs into new object
        var nobj = {};
        if( this.props.alertArr ) {
            nobj.alerts = this.props.alertArr;
        }
        if( this.props.logo ) {
            nobj.logo = this.props.logo;
        }
        var npanels = [];
        if(this.state.selForms.imgs) {
            this.state.selForms.imgs.forEach((el,i,a) => {
                var nimgs = el.fd.reduce((p,c,ii,aa) => {
                    if(c.issel) {
						p.push(c);
        }
        return p;
    },[]);
if(nimgs.length>0) {
    var newobj = JSON.parse(JSON.stringify(el));
    newobj.fd = nimgs;
    npanels.push(newobj);
}
});
}
for(var kk in this.state.selForms.items) {
    var it = this.state.selForms.items[kk];
    if(it.hasOwnProperty("key") && it.hasOwnProperty("fd") && it.issel) {
        npanels.push(it);
    }
}
nobj.data = npanels;
nobj.title = this.props.titleArr;

return nobj;
},
shareSelChanged: function shareSelChanged(ev) {
    var act = ev.currentTarget.selectedOptions[0].getAttribute("data-act");
    this.actionAct = ev.currentTarget.selectedOptions[0].getAttribute("action");
    
    if (act == "newdoc") {
        var seldata = this.getSelected();
        sessionStorage["ric_selected_data"] = JSON.stringify(seldata);
        this.myWindow = window.open('report.html?seskey=ric_selected_data', 'newwindow', 'width=730, height=700');	            
        this.injectReportShareCapability();
    }
    else{
        this.callReportMethod();
    }		
			
    return false;
},
injectReportShareCapability: function injectReportShareCapability() {
    try {
        this.myWindow.onload = this.callReportMethod;
    } catch (e) {
        alert('injectReportShareCapability ' + e);
    }
},
callReportMethod: function callReportMethod() {
	var shouldCloseReportWindow = false;
    try {
			if (this.actionAct === 'print') {
						this.myWindow.print();
					}

					if (this.actionAct === 'createpdf') {
						var innerHtml = this.myWindow.document.getElementsByTagName("html")[0].innerHTML;
						createPDF(innerHtml);
						shouldCloseReportWindow = true;
					}

					if (this.actionAct === 'email') {
						var innerHtml = this.myWindow.document.getElementsByTagName("html")[0].innerHTML;
						sendEmail(innerHtml);
						shouldCloseReportWindow = true;
					}

					if (this.actionAct === 'workspace') {
						var innerHtml = this.myWindow.document.getElementsByTagName("html")[0].innerHTML;
						sendToCollaborationWorkSpace(innerHtml);
						shouldCloseReportWindow = true;
					}

					if (this.actionAct === 'smartclient') {
						var innerHtml = this.myWindow.document.getElementsByTagName("html")[0].innerHTML;
						sendToSmartClient(innerHtml);
						shouldCloseReportWindow = true;
					}
					if(shouldCloseReportWindow)
					{
						this.myWindow.close();
					}	      
       this.myWindow.close();
    } catch (e) {
        alert('callReportMethod ' + e);
    }
},
selAllChanged: function(ev) {
    var ch = ev.currentTarget.checked;
    for(var k in this.state.selForms.items) {
        var el = this.state.selForms.items[k];
        el.issel = ch;
    }
    this.setState(this.state);
},
componentWillReceiveProps: function componentWillReceiveProps() {
    console.log("Report will receive props: datcnt=" + this.props.datas.length);
},
clickClose: function() {
    console.log("Close button clicked");
},
render: function() {
    console.log("Report: Render, datcnt=" + this.props.datas.length);
    var title = this.props.titleArr[0];
    var heading = this.props.titleArr[1];
    var name = this.props.titleArr[2];

    // //<span className="tools separ" onClick={this.allOpenToggle}>N</span> - for symbol of Tools/Settings
    var plusminus = this.state.allOpen ? '\ue160' : '\ue159';
    var rightControls = this.props.isRep ?
		(
					<span className="right">
						<span className="separ"><button className={this.state.isHighlight?'highlight on':'highlight'} onClick={this.highlightToggle}>H</button></span>
					</span>
		)
    :
    (
				<span className="right">
					<span className="toolsplusminus separ" onClick={this.allOpenToggle}>{plusminus}</span>
					<span className="separ">
						<button className={this.state.isHighlight?'highlight on':'highlight'} onClick={this.highlightToggle}>H</button>
					</span>
					<span className="separ">
                        <label htmlFor="selall">
                            <input id="selall" type="checkbox" onChange={this.selAllChanged}/>Select all</label>
                    </span>
					<span className="separ">Share:
							<select className="shareselect" id="shareDropDown" onChange={this.shareSelChanged} onload>		
								<option data-act="" action="">Select</option>							
							</select>&nbsp;</span>
						<span className="tools" onClick={this.clickClose}>-</span>
					</span>
	);

    return (
		<div>
			<div className="report">
				<div className="reptitle">
					<span className="logo">!</span><span className="reptitletext"><b>{title}</b> REPORT</span>
    {rightControls}
    </div>
	<R_reportHeader field={heading} val={name} logo={this.props.logo}></R_reportHeader>
	<div className="frames">
		<R_alerts alertArr={this.props.alertArr} isRep={this.props.isRep}></R_alerts>
		<R_grid datas={this.props.datas} allOpen={this.state.allOpen} isHighlight={this.state.isHighlight}
    selHigh={this.props.selHigh} selForms={this.props.selForms} colCnt={this.props.colCnt}
    isRep={this.props.isRep}></R_grid>
</div>
</div>
</div>
	);

}
});


