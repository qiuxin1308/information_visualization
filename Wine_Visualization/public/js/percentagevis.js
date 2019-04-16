/* global variable */
var line_margin = {top: 20, right: 20, bottom: 30, left: 40},
    line_width = 520 - line_margin.left - line_margin.right,
    line_height = 300 - line_margin.top - line_margin.bottom;

var countValues;

percentageVis = function(_parentElement, _theName, _statePercentage) {
	this.parentElement = _parentElement;
	this.curStateName = _theName;
	this.statePercentage = _statePercentage;
	this.initVis();
}

percentageVis.prototype.initVis = function(){
	var vis = this;
	vis.format = d3.format(".0f");
	$("#percentage_chart").empty();
    // var chartTitle = "<h2 class ='contentTitleStyle'>Wine Quality-Price Distribution in " + vis.curStateName + "</h2>";
    // $("#percentage_chart").append(chartTitle);
    vis.countMethod(vis.statePercentage);
    //vis.lineChart(countValues,"Scores");
    switch (selectedButtonIndex) {
    	case 0:
    		vis.lineChart(countValues,"Scores",vis.curStateName);
    		break;
    	case 1:
    		vis.lineChart(countValues,"Price",vis.curStateName);
    		break;
    	case 2:
    	    vis.lineChart(countValues,"Values",vis.curStateName);
    	    break;
    }
};

/* count method */
percentageVis.prototype.countMethod = function(theData){
	/* count the number of points */
	var vis = this;
	countValues = d3.nest().key(function(d) {
		switch(selectedButtonIndex){
			case 0:
				return d.points;
			case 1:
				return d.price;
			case 2:
				return vis.format(d.points / d.price);
		}
      }).rollup(function(leaves) {
        return leaves.length;
      }).entries(theData);
};

/* draw the line chart here */
percentageVis.prototype.lineChart = function(curData,title,stateName){
	var vis = this;
	vis.svgTrend = d3.select("#percentage_chart")
	                 .append("svg")
	                 .attr("id","svgWineTag")
	                 .attr("width",line_width+line_margin.left+line_margin.right)
	                 .attr("height",line_height+line_margin.top+line_margin.bottom)
	                 .append("g")
	            	 .attr("transform", "translate("+line_margin.left+","+line_margin.top+")");
	vis.ymin = d3.min(curData,function(d){ return d.value;});
	vis.ymax = d3.max(curData,function(d){ return d.value;});
	if (vis.ymin === vis.ymax) {
		if (vis.ymin > 2) {
			vis.ymin = 0;
		}else{
			vis.ymin = 0;
			vis.ymax = 2;
		}
	}
	curData.sort(function(a,b) {return d3.descending(parseInt(a.key,10), parseInt(b.key,10));});
	switch (selectedButtonIndex) {
		case 0:
			vis.xmin = 80;
			vis.xmax = 100;
			break;
		case 1:
		    vis.xmin = d3.min(curData,function(d){ return parseInt(d.key,10);});
			vis.xmax = d3.max(curData,function(d){ return parseInt(d.key,10);});
			break;
		case 2:
			vis.xmin = d3.min(curData,function(d){ return parseInt(d.key,10);});
			vis.xmax = d3.max(curData,function(d){ return parseInt(d.key,10);});
			if (vis.xmin === vis.xmax) {
				vis.xmin = 0;
				vis.xmax = 2;
			}
			break;
	}
	vis.xScale = d3.scaleLinear().domain([vis.xmin,vis.xmax]).range([0,line_width]).nice();
	// switch(selectedButtonIndex){
	// 	case 0:
	// 		vis.xScale = d3.scaleLinear().domain([80,100]).range([0,line_width]).nice();
	// 	case 1:
	// }
	
	vis.yScale = d3.scaleLinear().domain([vis.ymin,vis.ymax]).range([line_height,0]).nice();
	vis.theLine = d3.line().x(function(d){ return vis.xScale(parseInt(d.key,10));})
	                       .y(function(d){ return vis.yScale(d.value);})
	                       .curve(d3.curveMonotoneX);

	vis.svgTrend.append("path")
	            .datum(curData)
	            .attr("class","trendLine")
	            .style("stroke","#5063AF")
	            .style("stroke-width",3)
	            .style("fill","none")
	            .attr("d",vis.theLine);

	vis.svgTrend.append("text")
	            .attr("class","titleOfLine")
	            .attr("x", (line_width - line_margin.left)/2 - 18)
	            .attr("y", -4)
	            .style("fill", "#5063AF")
	            .style("font-family","Titillium Web")
	            .style("font-size","15px")
	            .text("Wine "+title+" Distribution in "+stateName);

	vis.svgTrend.append("g")
	            .attr("transform","translate(0,"+line_height+")")
	            .call(d3.axisBottom(vis.xScale));

	vis.svgTrend.append("text")
	            .attr("transform","translate("+(line_width/2)+","+(line_height+line_margin.top+10)+")")
	            .style("text-anchor","middle")
	            .style("fill","#000")
	            .style("font-family","Titillium Web")
	            .style("font-size","13px")
	            .text(title);

	vis.svgTrend.append("g")
	            .call(d3.axisLeft(vis.yScale))
	            .append("text")
	            .attr("y",15)
	            .attr("transform","rotate(-90)")
	            .style("fill","#000")
	            .style("font-family","Titillium Web")
	            .style("font-size","13px")
	            .text("Quantities");


	vis.dots = vis.svgTrend.selectAll(".dot")
	                       .data(curData)
	                       .enter()
	                       .append("circle")
	                       .attr("class","trendCircles")
	                       .style("fill","#5063AF")
	                       .style("stroke","#fff")
	                       .attr("cx", function(d){
	                       	 return vis.xScale(parseInt(d.key, 10));
	                       })
	                       .attr("cy", function(d){
	                       	 return vis.yScale(d.value);
	                       })
	                       .attr("r",4)
	                       .on("mouseover",function(d){
	                       	 d3.select(this)
	                       	   .transition()
	                       	   .duration(500)
	                       	   .attr("r",8);
	                       	 vis.svgTrend.append("text")
	                       	             .attr("class","cTagText")
	                       	             .attr("x", vis.xScale(parseInt(d.key,10))+2)
	                       	             .attr("y", vis.yScale(d.value)-10)
	                       	             .style("font-family","Titillium Web")
	                       	             .style("fill","#283257")
	                       	             .style("font-size","15px")
	                       	             .text("("+parseInt(d.key,10)+", "+d.value+")");
	                       })
	                       .on("mouseout", function(d){
	                       	 d3.select(this)
	                       	   .transition()
	                       	   .duration(500)
	                       	   .attr("r",4);
	                       	 vis.svgTrend.select(".cTagText").transition().duration(500);
	                       	 vis.svgTrend.select(".cTagText").remove();
	                       });
};