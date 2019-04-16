/*global data of import and export of wine */

/*add title*/

var dataOfInExWine;
var margin = {top: 20, right: 20, bottom: 30, left: 40},
	width = 800 - margin.left - margin.right,
	height = 530 - margin.top - margin.bottom;

var svg = d3.select("#left_chart")
	        .append("svg")
	        .attr("id", "barSvg")
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom);

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
var y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom(x);
var yAxis = d3.axisLeft(y);


barInExVis = function(_parentElement, _theData) {
	this.parentElement = _parentElement;
	this.theData = _theData;
	dataOfInExWine = this.theData;
	this.initVis();
}

barInExVis.prototype.initVis = function(){
	var vis = this;
	
	
	vis.g = svg.append("g")
	           .attr("id", "gSvg")
	           .attr("transform","translate("+margin.left+","+margin.top+")");

	d3.select("#ranking-type").on("change", updateInExVis);

	dataOfInExWine.sort(function(a, b) { return b.wine_exports - a.wine_exports;});
	x.domain(dataOfInExWine.map(function(d) { return d.exporter;}));
	y.domain([0, dataOfInExWine[0].wine_exports]).nice();

	vis.g.append("g")
	     .attr("class", "axis")
	    //  .style("font-size","12px")
	     .attr("transform", "translate(0,"+height+")")
	     .call(xAxis);

	vis.g.append("g")
		 .attr("class", "axis")
	    //  .style("font-size","12px")
	     .call(yAxis)
	     .append("text")
	     .attr("transform","rotate(-90)")
	     .attr("y", -35)
	     .attr("dy", "0.71em")
	     .style("text-anchor", "end")
	     .attr("class", "axis-title")
	     .style("font-size", "20px")
	     .style("fill","black")
	     .text("Exports (billion)");

	vis.bars = vis.g.selectAll(".bar")
	                .data(dataOfInExWine)
	                .enter()
	                .append("rect")
	                .attr("class", "bar")
	                .style("fill", "#ac00e6")
	                .attr("x", function(d){
	                	return x(d.exporter) + 22;
	                })
	                .attr("y", function(d){
	                	return y(d.wine_exports);
	                })
	                .attr("width", x.bandwidth()/2)
	                .attr("height", function(d){
	                	return height - y(d.wine_exports);
	                });
};

/* select different rank type (import or export) */
function updateInExVis() {
	var vis = this;
	var selectedVal = d3.select("#ranking-type").property("value");
	if(selectedVal === "exports") {
		d3.select("#gSvg").remove();
		vis.g0 = svg.append("g")
		            .attr("id","gSvg")
		            .attr("transform", "translate("+margin.left+","+margin.top+")");

		dataOfInExWine.sort(function(a, b) { return b.wine_exports - a.wine_exports;});
		x.domain(dataOfInExWine.map(function(d) { return d.exporter;}));
		y.domain([0, dataOfInExWine[0].wine_exports]).nice();

		vis.g0.append("g")
		      .attr("class", "axis")
		      .style("font-size","12px")
		      .attr("transform", "translate(0,"+height+")")
		      .call(xAxis);

		vis.g0.append("g")
		      .style("font-size","12px")
		      .call(yAxis)
		      .append("text")
		      .attr("transform","rotate(-90)")
	     	  .attr("y", -35)
	          .attr("dy", "0.71em")
	          .style("text-anchor", "end")
	          .attr("class", "axis-title")
	          .style("font-size", "15px")
	          .style("fill","black")
	          .text("Exports (billion)");

	    vis.bars = vis.g0.selectAll(".bar")
	                     .data(dataOfInExWine)
	                	 .enter()
	                	 .append("rect")
	                	 .attr("class", "bar")
	                	 .style("fill", "#ac00e6")
	                	 .attr("x", function(d){
	                		 return x(d.exporter) + 22;
	                	 })
	                	 .attr("y", function(d){
	                		 return y(d.wine_exports);
	                	 })
	                	 .attr("width", x.bandwidth()/2)
	                	 .attr("height", function(d){
	                		 return height - y(d.wine_exports);
	                	 });
	}else if (selectedVal === "imports") {
		d3.select("#gSvg").remove();
		vis.g0 = svg.append("g")
		            .attr("id","gSvg")
		            .attr("transform", "translate("+margin.left+","+margin.top+")");

		dataOfInExWine.sort(function(a, b) { return b.wine_import - a.wine_import;});
		x.domain(dataOfInExWine.map(function(d) { return d.exporter;}));
		y.domain([0, dataOfInExWine[0].wine_import]).nice();

		vis.g0.append("g")
		      .attr("class", "x axis")
		      .style("font-size","12px")
		      .attr("transform", "translate(0,"+height+")")
		      .call(xAxis);

		vis.g0.append("g")
		      .style("font-size","12px")
		      .call(yAxis)
		      .append("text")
		      .attr("transform","rotate(-90)")
	     	  .attr("y", -35)
	          .attr("dy", "0.71em")
	          .style("text-anchor", "end")
	          .attr("class", "axis-title")
	          .style("font-size", "15px")
	          .style("fill","black")
	          .text("Imports (billion)");

	    vis.bars = vis.g0.selectAll(".bar")
	                     .data(dataOfInExWine)
	                	 .enter()
	                	 .append("rect")
	                	 .attr("class", "bar")
	                	 .style("fill", "#ac00e6")
	                	 .attr("x", function(d){
	                		 return x(d.exporter) + 22;
	                	 })
	                	 .attr("y", function(d){
	                		 return y(d.wine_import);
	                	 })
	                	 .attr("width", x.bandwidth()/2)
	                	 .attr("height", function(d){
	                		 return height - y(d.wine_import);
	                	 });
	}
}
