/* global variables */
var imexBtns = ["Import", "Export"];
var imexSelectedBtn = {};
var f = d3.format(".3f");
var wineTradeData = [];

tradeVis = function(_parentElement, _tradeCountries) {
	this.parentElement = _parentElement;
	this.tradeCountries = _tradeCountries;
	this.initVis();
}

tradeVis.prototype.initVis = function(){
	var vis = this;
	initSelectedBtn();
	vis.btnWidth = 1200;
	vis.btnHeight = 100;
	vis.titleSvg = d3.select("#trade_title")
	                 .append("text")
	                 .attr("x", 160)
	                 .attr("y", 60)
	                 .style("text-align","center")
	                 .style("text-anchor", "start")
	                 .attr("class", "titleStyle")
	                 .style("fill", "black")
	                 .style("padding-left","180px")
	                 .text("The Wine Trade Between Countries (in billions)");


	vis.imexSvg = d3.select("#imex_btn")
	                 .append("svg")
	                 .attr("id", "imexSvg")
	                 .attr("width", vis.btnWidth)
	                 .attr("height", vis.btnHeight);

	vis.imexSvg.selectAll("imexRect")
	           .data(imexBtns)
	           .enter()
	           .append("rect")
	           .attr("x", function(d, i){
	           	 return (160 + i * 350);
	           })
	           .attr("y", 30)
	           .attr("width", 150)
	           .attr("height", 40)
	           .style("fill", "#BDC0BA")
	           .attr("rx",20)
	           .attr("ry",20)
	           .on("click", function(d, i){
	          	vis.updateSelectedimexBtns(i);
	          	vis.updateSelection(i);
	           });

	vis.imexBtnText = vis.imexSvg.append("svg")
	                             .attr("id", "imexBtnText");

	vis.imexBtnText.selectAll(".imexText")
	               .data(imexBtns)
	               .enter()
	               .append("text")
	               .attr("x", function(d, i){
	               	 return 168 + i * 350;
	               })
	               .attr("y", 57)
	               .style("text-align","center")
	               .style("text-anchor","start")
	               .style("font-size", "20px")
	               .style("font-family","Acme")
	               .style("fill", "white")
	               .text(function(d, i){
	               	 return imexBtns[i];
	               })
	               .on("click", function(d, i){
	          		 vis.updateSelectedimexBtns(i);
	          		 vis.updateSelection(i);
	          	   });

	vis.updateSelectedimexBtns(0);
	vis.updateSelection(0);
	//vis.chordVis(vis.tradeCountries);
};

/* initialize the selected btns */
function initSelectedBtn() {
	for(var i = 0; i < imexBtns.length; i++){
		imexSelectedBtn[imexBtns[i]] = false;
	}
}

/* highlight the selected buttons */
tradeVis.prototype.updateSelectedimexBtns = function(id){
	var vis = this;
	initSelectedBtn();
	d3.select("#imexSvg").remove();
	imexSelectedBtn[imexBtns[id]] = true;
	vis.btnWidth = 1200;
	vis.btnHeight = 100;
	vis.imexSvg = d3.select("#imex_btn")
	                 .append("svg")
	                 .attr("id", "imexSvg")
	                 .attr("width", vis.btnWidth)
	                 .attr("height", vis.btnHeight);

	vis.imexSvg.selectAll("imexRect")
	           .data(imexBtns)
	           .enter()
	           .append("rect")
	           .attr("x", function(d, i){
	           	 return (160 + i * 450);
	           })
	           .attr("y", 30)
	           .attr("width", 150)
	           .attr("height", 40)
	           .attr("rx",20)
	           .attr("ry",20)
	           .style("fill", function(d, i){
	          	if (imexSelectedBtn[imexBtns[i]]) {
	          		return "#4F4F48";
	          	}else{
	          		return "#BDC0BA";
	          	}
	          })
	          .on("click", function(d, i){
	          	vis.updateSelectedimexBtns(i);
	          	vis.updateSelection(i);
	          });

	vis.imexBtnText = vis.imexSvg.append("svg")
	                             .attr("id", "imexBtnText");

	vis.imexBtnText.selectAll(".imexText")
	               .data(imexBtns)
	               .enter()
	               .append("text")
	               .attr("x", function(d, i){
	               	 return (208 + i * 450);
	               })
	               .attr("y", 57)
	               .style("text-align","center")
	               .style("text-anchor","start")
	               .style("font-size", "20px")
	               .style("font-family","Acme")
	               .style("fill", "white")
	               .text(function(d, i){
	               	 return imexBtns[i];
	               })
	               .on("click", function(d, i){
	               	 vis.updateSelectedimexBtns(i);
	               	 vis.updateSelection(i);
	               });
};

/* draw the chord diagram */
tradeVis.prototype.chordVis = function(theData){
	var vis = this;
	var countriesName = ["France", "Australia", "US", "Spain", "Argentina", "Canada", "Italy"];
	var countriesColor = ["#E65C00", "#CD6596", "#897E7A", "#6D93C5", "#A6D8D1", "#FFBE36", "#43B59E"];
	console.log(theData);
	vis.chordWidth = 960;
	vis.chordHeight = 600;
	vis.legendWidth = 400;
	vis.legendHeight = 500;

	vis.outerRadius = Math.min(vis.chordWidth, vis.chordHeight)/2 - 40;
	vis.innerRadius = vis.outerRadius - 30;

	vis.arc = d3.arc()
	            .innerRadius(vis.innerRadius)
	            .outerRadius(vis.outerRadius);

	vis.layout = d3.multichord()
	               .padAngle(.05)
	               .sortSubgroups(d3.descending)
	               .sortChords(d3.descending);

	vis.path = d3.ribbon()
	             .radius(vis.innerRadius);

	vis.chordSvg = d3.select("#trade_view")
	            .append("svg")
	            .attr("id", "chordSvg")
	            .attr("width",vis.chordWidth)
	            .attr("height", vis.chordHeight);

	vis.legendSvg = d3.select("#trade_legend")
	                  .append("svg")
	                  .attr("id", "legendSvg")
	                  .attr("width", vis.legendWidth)
	                  .attr("height", vis.legendHeight);

	vis.nodes = theData.nodes;
	vis.categories = theData.categories;
	vis.chords = vis.layout(theData.links);
	console.log(vis.chords);

	/* compute the chord layout */
	vis.g = vis.chordSvg.append("g")
	                    .attr("id", "gCircle")
	                    .style("fill", "none")
	                    .style("pointer-events","all")
	                    .attr("transform", "translate("+(vis.chordWidth/2 - 120)+","+(vis.chordHeight/2 - 20)+")")
	                    .datum(vis.chords);

	vis.g.append("g")
	     .attr("id", "groups");

	vis.g.append("g")
	     .attr("id", "chords");

	/* add a group per neighborhood */
	vis.group = vis.g.select("#groups")
	                 .selectAll("g")
	                 .data(function(d){
	                 	return d.groups;
	                 })
	                 .enter()
	                 .append("g")
	                 .attr("class", "group")
	                 .on("mouseover", function(d){
	                 	vis.mouseover(d);
	                 })
	                 .on("mouseout", function(d){
	                 	vis.mouseover_restore(d);
	                 });

    /* add the group arc */
	vis.groupPath = vis.group.append("path")
	                         .attr("id", function(d, i){
	                         	return "group" + i;
	                         })
	                         .attr("d", vis.arc)
	                         .style("fill", function(d, i){
	                         	return vis.nodes[i].color;
	                         });

	/* add a text label */
	vis.groupText = vis.group.append("text")
	                         .attr("x", 6)
	                         .attr("dy",15)
	                         .append("textPath")
	                         .attr("xlink:href", function(d, i){
	                         	return "#group" + i;
	                         })
	                         //.text(function(d,i){ return vis.nodes[i].name;})
	                         .attr("opacity", function(d, i){
	                         	if(vis.groupPath._groups[0][i].getTotalLength()/2-25 < this.getComputedTextLength()){
	                         		return 0;
	                         	}else {
	                         		return 1;
	                         	}
	                         });

	/* add a mouseover title */
	vis.group.append("title")
	         .text(function(d, i){
	         	wineTradeData.push({"Country":vis.nodes[i].name, "Import": vis.chords.groups[i].value.in, "Export": vis.chords.groups[i].value.out});
	         	return vis.nodes[i].name
        				+ "\n" + "Total Import: " + f(vis.chords.groups[i].value.in)
        				+ "\n" + "Total Export: " + f(vis.chords.groups[i].value.out);
	         });

	//console.log(wineTradeData);
	var temptest = [];
	for(var i = 0; i < vis.chords.length; i++){
		temptest.push(vis.chords[i]);
		temptest.push({source:vis.chords[i].target,target:vis.chords[i].source});
	}
	console.log(temptest);

	/* add the chords */
	vis.chord = vis.g.select("#chords")
	                  .selectAll("g")
	                  .data(function(d){
	                  	return d;
	                  })
	                  .enter()
	                  .append("g")
	                  .attr("class", "chord");

	vis.chord.append("path")
	         .attr("class", "chord")
	         .attr("fill", function(d){
	         	return vis.nodes[d.source.index].color;
	         })
	         .attr("d", vis.path);
	         // .on("mouseover", function(d){
	         // 	vis.mouseover_types(d);
	         // })
	         // .on("mouseout", function(d){
	         // 	vis.mouseover_restore(d);
	         // });

	/* add a mouseover title for each chord */
	vis.chord.append("title")
	         .text(function(d){
	         	return vis.categories[d.source.category].name
        				+ "\n" + vis.nodes[d.source.index].name
        				+ " → " + vis.nodes[d.target.index].name
        				+ ": " + f(d.source.value)
        				+ "\n" + vis.nodes[d.target.index].name
        				+ " → " + vis.nodes[d.source.index].name
        				+ ": " + f(d.target.value);
	         });

	/* draw the legend */
	vis.legendSvg.selectAll(".legendRect")
	             .data(countriesColor)
	             .enter()
	             .append("rect")
	             .attr("x", 5)
	             .attr("y", function(d, i){
	             	return (210 + i * 25);
	             })
	             .attr("width", 40)
	             .attr("height", 20)
	             .style("fill", function(d, i){
	             	return countriesColor[i];
	             });

	vis.legendSvg.selectAll(".legendText")
	             .data(countriesName)
	             .enter()
	             .append("text")
	             .attr("x", 50)
	             .attr("y", function(d, i){
	             	return (225 + i * 25);
	             })
	             .style("font-family", "Lato")
	             .style("font-size", "15px")
	             .style("text-anchor", "start")
	             .style("text-align", "center")
	             .text(function(d, i){
	             	return countriesName[i];
	             });


	/* functions of mouseover, mouseover_types, mouseover_restore */
	tradeVis.prototype.mouseover = function(d){
		var vis = this;
		vis.g.select("#chords")
		     .selectAll("path")
		     .classed("fade", function(p){
		     	return p.source.index != d.index && p.target.index != d.index;
		     });
	};

	tradeVis.prototype.mouseover_types = function(d){
		var vis = this;
		vis.g.select("#chords")
		     .selectAll("path")
		     .classed("fade", function(p){
		     	return p.source.category != d.source.category && p.target.category != d.target.category;
		     });
	};

	tradeVis.prototype.mouseover_restore = function(d){
		var vis = this;
		vis.g.select("#chords")
		     .selectAll("path")
		     .classed("fade", function(p){
		     	return false;
		     });
	};
};

/* functions to show when chooseing import button or export button */
tradeVis.prototype.updateSelection = function(id){
	var vis = this;
	if (id === 0) {
		// visualize the import charts
		$("#trade_charts").show();
		$("#trade_aster").show();
		$("#leftarrow").show();
		$("#trade_viewAll").hide();
		$("#trade_barChart").empty();
		$("#asterView").empty();
		$("#asterLegend").empty();
		$("#trade_title").empty();
		var importsPlot = new importsVis("importsvis");
	} else if (id === 1) {
		//visualize the export charts
		$("#trade_charts").show();
		$("#trade_viewAll").hide();
		$("#trade_barChart").empty();
		$("#trade_aster").show();
		$("#leftarrow").show();
		$("#asterView").empty();
		$("#asterLegend").empty();
		$("#trade_title").empty();
		var exportsPlot = new exportsVis("exportsvis");
	}
	// } else if (id === 2) {
	// 	//visualize the whole trade chart
	// 	$("#trade_viewAll").show();
	// 	$("#trade_aster").hide();
	// 	$("#leftarrow").hide();
	// 	$("#trade_charts").hide();
	// 	$("#trade_title").empty();
	// 	$("#imex_btn").empty();
	// 	$("#trade_view").empty();
	// 	$("#trade_legend").empty();
	// 	$("#asterView").empty();
	// 	$("#asterLegend").empty();
	// 	var tradePlot = new tradeVis("tradevis", vis.tradeCountries);
	// }
};