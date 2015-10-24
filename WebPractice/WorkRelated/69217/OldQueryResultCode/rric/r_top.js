
import React from "react";
//import Greeting from "./greeting";
import R_page from './r_page';

import r_dataTranform from "./r_utils_dataTransform.js";

//React.render(
//    <Greeting name="World"/>,
//    document.body
//);

var R_top = React.createClass({
	propTypes: {

	},
	getQueryParams: function() {
		try{
			var query_str = location.search;

			if(query_str[0]=='?') {
				query_str = query_str.substr(1);
			}
			var r_params = query_str.split('&');
			var params = {};
			for( var i=0; i<r_params.length; i++ ){
				var param = r_params[i].split('=');
				params[ param[0] ] = param[1];
			}
			return params;
		}
		catch(e){
			return {};
		}
	},
	getInitialState: function() {
		var st = {
			data: [],
			alerts: [],
			logo: {},
			title: ["","",""],
			params: this.getQueryParams(),
			isRep : ((location.search.indexOf('&seskey=')>=0) || (location.search.indexOf('?seskey=')>=0))
		};

		try 
		{
			if (st.isRep) {
				var keyname = st.params["seskey"];
				if (keyname) 
				{
					var myJson = sessionStorage[keyname];
					var myObj = JSON.parse(myJson);
					st.title = myObj.title;
					st.logo = myObj.logo;
					st.alerts = myObj.alerts;
					console.log("Data read: sessionStorage[" + keyname + "] Cnt Items=" + myObj.data.length);
					st.data = r_dataTranform(myObj.data);
				}
			}
			else {
			    //alert(features);
				if(st.params.file)
				{
					var file = st.params.file;
					this.loadFile(file);
				}
				else 
				{
					
					// Get the key from Query URL.
					var queryKey = st.params["id"];                    
					var request = new XMLHttpRequest();
					
					//TODO: Need to fetch query ID from the request url and append the url given below.
					var url = "/odata/QueryRequests("+ queryKey + ")?$expand=Fields($expand=ChildFields)";
					
					request.open("GET", url, false);
					
					request.send(null);
					var responseJSONObject = JSON.parse(request.responseText);

					var finalResult = this.parseJSONToReact(responseJSONObject);

					// Convert result string into JSON object.
					var JSONFinalResult = JSON.parse(finalResult);  
					
					//TODO: Assign JSON object to State Data property.
					var x = new Array();
		 x.push(responseJSONObject.Type);
		 x.push(responseJSONObject.Type);
		 x.push("");
	     st.title = x;  
				
					st.data = JSONFinalResult;     
						 
					
					//this.loadFile("data/exampleBig.json");
				}
			}
			return st;
		}
		catch(e) {
		    console.log(e.message);
		    alert(e.message);
		}
	},
	parseJSONToReact: function(responseJSONObject) 
	{
		try
		{
			var finalResult = "[";

			for (var i = 0; i < responseJSONObject.Fields.length; i++) 
			{
				if(responseJSONObject.Fields[i].Title.length > 0)
				{
					if (i > 0 && finalResult.length > 1) 
					{
						finalResult = finalResult + ', ';
					}

					finalResult = finalResult + '{ ';
										
					finalResult = finalResult + '"key" ';
					finalResult = finalResult + ' : ';
					finalResult = finalResult + '" ' + responseJSONObject.Fields[i].Title + '" ';
					finalResult = finalResult + ', ';
					finalResult = finalResult + '"fd" : ';
					
					var innerResult = this.parseJSONToReactChildItems(responseJSONObject.Fields[i].ChildFields);
					
					finalResult = finalResult + innerResult;
					finalResult = finalResult + '}';
				}
			}

			finalResult = finalResult + ' ]';
			return finalResult;
		}
		catch(e)
		{
			console.log(e.message);
		}
	},
	parseJSONToReactChildItems: function(childFields) 
	{
		try
		{
			var childFieldCount = childFields.length;        
			var innerResult = '[ ';
			if (childFieldCount > 0) 
			{
				innerResult = innerResult + '[ ';                
				for (var j = 0; j < childFieldCount; j++) 
				{

					if (j > 0) {
						innerResult = innerResult + ', '; 
					}
					innerResult = innerResult + '{ ';
					innerResult = innerResult + '"key": "' + childFields[j].Title + '" ';
					innerResult = innerResult + ', ';
					innerResult = innerResult + '"val": "' + childFields[j].Value.replace(/<br\/>/g, ' ') + '" ';
					innerResult = innerResult + '} ';
				}        
				innerResult = innerResult + '] ';
			}
			innerResult = innerResult + ']';

			return innerResult;
		}
		catch(e)
		{
			console.log(e.message);
		}
	},
	loadFile: function(fname) {
		$.get(fname, (result) => {
			var myJson = result;
		this.state.title = myJson.title;
		this.state.alerts = myJson.alerts;
		this.state.logo = myJson.logo;
		console.log("Data read: " + fname + " Cnt Items=" + myJson.data.length);
		this.state.data = r_dataTranform(myJson.data);
		this.setState(this.state);
	});
},
render: function () {
	console.log("Top: Render, datcnt=" + this.state.data.length);

	var colCnt = this.state.isRep ? 1 : 4;
	return (
		<div>
			<R_page alertArr={this.state.alerts} datas={this.state.data} titleArr={this.state.title}
colCnt={colCnt} isRep={this.state.isRep} logo={this.state.logo}></R_page>
</div>
		);
}
});

React.render(
	<R_top />,
	document.getElementById('container')
);