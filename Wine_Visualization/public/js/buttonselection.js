var btns = ["Producer", "Trade", "Wine Analysis In Countries"];
var btnsSelected = {};
var country_name_list = ["United State","Argentina","Australia","Canada","France","Italy","Spain"];
var country_id_list = ["USA","ARG","AUS","CAN","FRA","ITA","ESP"];

/* this is the part of button selection */
buttonSelectionVis = function(_parentElement, _data, _populationData, _wineExport, _tradeCountries) {
	this.parentElement = _parentElement;
	this.data = _data;
	this.populationData = _populationData;
	this.wineExport = _wineExport;
	this.tradeCountries = _tradeCountries;
  	this.initVis();
}

buttonSelectionVis.prototype.initVis = function(){
	var vis = this;
	initBtns();
	//console.log(btnsSelected);
	vis.svg = d3.select("#left_side")
	        	.append("svg")
	        	.attr("id", "leftSvg")
	        	.attr("width", 360)
	        	.attr("height", 800);
	vis.btnSvg = vis.svg.append("svg")
	               .attr("id", "btnsSvg");
	vis.btnSvg.selectAll("rect")
	          .data(btns)
	          .enter()
	          .append("rect")
	          .attr("x", 30)
	          .attr("y", function(d, i){
	          	return 180 + i * 150;
	          })
	          .attr("width", 180)
	          .attr("height", 60)
	          .style("fill", "#998CC7")
	          .on("click", function(d, i){
	           	vis.updateSelectedBtn(i);
	           	vis.updateSelection(i);
	          }); //#BDC0BA

	vis.btnText = vis.svg.append("svg")
	                 .attr("id", "btnTextSvg");

	vis.btnText.selectAll(".btnText")
	           .data(btns)
	           .enter()
	           .append("text")
	           .attr("x", function(d, i){
	           	if (i < 2) {
	           		return 115;
	           	}else{
	           		return 120;
	           	}
	           })
	           .attr("y", function(d, i){
	           	 return 215 + i * 150;
	           })
	           .style("text-align","center")
	           .style("text-anchor", "middle")
	           .style("font-family", "Acme")
	           .style("font-size", function(d,i){
	           	if (i < 2) {
	           		return "22px";
	           	}else{
	           		return "16px";
	           	}
	           })
	           .style("fill", "white")
	           .text(function(d, i){
	           	return btns[i];
	           })
	           .on("click", function(d, i){
	           	vis.updateSelectedBtn(i);
	           	vis.updateSelection(i);
	           });

	vis.updateSelectedBtn(0);
	vis.updateSelection(0);

};

/* initialize the btns */
function initBtns() {
	for(var i = 0; i < btns.length; i++){
		btnsSelected[btns[i]] = false;
	}
}

/* 
 * update when select the button 
 * id is the index of the btns
*/
buttonSelectionVis.prototype.updateSelectedBtn = function(id){
	// body... 
	var vis = this;
	initBtns();
	btnsSelected[btns[id]] = true;
	d3.select("#leftSvg").remove();
	vis.svg = d3.select("#left_side")
	        	.append("svg")
	        	.attr("id", "leftSvg")
	        	.attr("width", 360)
	        	.attr("height", 800);
	vis.btnSvg = vis.svg.append("svg")
	               .attr("id", "btnsSvg");
	vis.btnSvg.selectAll("rect")
	          .data(btns)
	          .enter()
	          .append("rect")
	          .attr("x", 30)
	          .attr("y", function(d, i){
	          	return 180 + i * 150;
	          })
	          .attr("width", 180)
	          .attr("height", 60)
	          .style("fill", "#af5083")
	          .style("stroke", function(d, i){
	          	if (btnsSelected[btns[i]]) { //#4F4F48
	          		return "#DFB9CD";
	          	}else{
	          		return "none";
	          	}
	          })
	          .style("stroke-width", function(d, i){
	          	if (btnsSelected[btns[i]]) {
	          		return 5;
	          	}else{
	          		return 0;
	          	}
	          })
	          .on("click", function(d, i){
	           	vis.updateSelectedBtn(i);
	           	vis.updateSelection(i);
	          });

	vis.btnSvg.append("a")
	          .attr("xlink:href","https://washuvis.github.io/wine/processbook.html")
	          .append("rect")
	          .attr("x", 30)
	          .attr("y", 630)
	          .attr("width", 180)
	          .attr("height", 60)
	          .style("fill", "#af5083");

	//https://washuvis.github.io/wine/processbook.html

	vis.btnText = vis.svg.append("svg")
	                 .attr("id", "btnTextSvg");


	vis.btnText.selectAll(".btnText")
	           .data(btns)
	           .enter()
	           .append("text")
	           .attr("x", function(d, i){
	           	if (i < 2) {
	           		return 115;
	           	}else{
	           		return 120;
	           	}
	           })
	           .attr("y", function(d, i){
	           	 return 215 + i * 150;
	           })
	           .style("text-align","center")
	           .style("text-anchor", "middle")
	           .style("font-family", "Acme")
	           .style("font-size", function(d,i){
	           	if (i < 2) {
	           		return "22px";
	           	}else{
	           		return "16px";
	           	}
	           })
	           .style("fill", "white")
	           .text(function(d, i){
	           	return btns[i];
	           })
	           .on("click", function(d, i){
	           	vis.updateSelectedBtn(i);
	           	vis.updateSelection(i);
	           });

	vis.btnText.append("a")
	           .attr("xlink:href","https://washuvis.github.io/wine/processbook.html")
	           .append("text")
	           .attr("x", 115)
	           .attr("y", 665)
	           .style("text-align","center")
	           .style("text-anchor", "middle")
	           .style("font-family", "Acme")
	           .style("font-size", "20px")
	           .style("fill","white")
	           .text("Process Book");



};

/* function to change different content based on clicking btns */
buttonSelectionVis.prototype.updateSelection = function(id){
	var vis = this;
	if (id === 0) {
		$("#producer_part").show();
		$("#trade_part").hide();
		$("#analysis_part").hide();
		$("#world_map").empty();
		var worldMap = new worldMapVis("worldmapvis", vis.data, vis.populationData);
		// visualization for producer
		/* have not adjusted and modify to suit the display */
		
	}else if (id === 1) {
		// visualization for trade
		$("#trade_part").show();
		$("#producer_part").hide();
		$("#analysis_part").hide();
		$("#trade_title").empty();
		$("#imex_btn").empty();
		$("#trade_viewAll").show();
		$("#trade_view").empty();
		$("#trade_legend").empty();
		$("#trade_charts").hide();
		$("#trade_barChart").empty();
		$("#trade_aster").show();
		$("#asterView").empty();
		$("#asterLegend").empty();
		var tradePlot = new tradeVis("tradevis", vis.tradeCountries);
		
	}else if (id === 2) {
		// visualization for wine analysis in countries
		$("#producer_part").hide();
		$("#trade_part").hide();
		$("#analysis_part").show();
		$("#top_selection").empty();
		$("#bubble_chart").empty();
		$("#percentage_chart").empty();
		$("#ranking_chart").empty();
		var analysisCharts = new analysisVis("analysisVis");
	}
};