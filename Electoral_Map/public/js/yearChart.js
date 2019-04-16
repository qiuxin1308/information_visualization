var data;
var circleSelected = {};
var circleStyle = {};
//var electoralVoteChart_year;
var width = 1200;
var timeLineSvg = d3.select("#year-chart")
	                 .append("svg")
	                 .attr("width",width)
	                 .attr("height",60);

var timeLine = timeLineSvg.append("svg")
                          .attr("width", width)
                          .attr("height",60);
var dashLine = timeLine.append("line")
	        			.attr("x1", 0)
	        			.attr("x2", width)
	        			.attr("y1", 20)
	        			.attr("y2", 20)
	        			.style("stroke-dasharray", ("5, 5"))
	                    .style("stroke", "gray")
	        			.style("stroke-width", 3);
var allCircles = timeLine.append("svg").attr("id","allCircles");
var allTexts = timeLine.append("svg").attr("id","allTexts");
function YearChart(electoralVoteChart,tileChart,votePercentageChart,electionWinners){
	electionWinners.forEach(function(d){
		d.YEAR = +d.YEAR;
		d.PARTY = d.PARTY;
		circleSelected[d.YEAR] = false;
	});
	data = electionWinners;
	allCircles.selectAll("circle")
	        .data(data)
	        .enter()
	        .append("circle")
	        .attr("r", 10)
	        .attr("cx", function(d, i){return (22 + i * 60);})
	        .attr("cy", 20)
	        .style("fill", function(d){
	        	if (d.PARTY === "D") {
	        		return "#3182bd";
	        	}else{
	        		return "#de2d26";
	        	}
	        })
	        .on("click", function(d){
	        	updateSelectedTime(d.YEAR);
                updateEVCYear(d.YEAR);	
		        updateVP(d.YEAR);
		        updateTitleChart(d.YEAR);
		        loadLastData(d.YEAR);
	        });
	// data.forEach(function(d, i){
	// 	var circle = timeLine.append("circle")
	// 	        		     .attr("r", 10)
	// 	        		     .attr("cx", 22 + i * 60)
	// 	        			 .attr("cy", 20)
	// 	        			 .style("fill", colorParty(d.PARTY))
	// 	        			 .on("click", function(){
	// 	        				 updateSelectedTime(d.YEAR);
	// 	        				 updateEVCYear(d.YEAR);	
	// 	        				 updateVP(d.YEAR);
	// 	        				 updateTitleChart(d.YEAR);
	// 	        				 loadLastData(d.YEAR);
	// 	        			 });
	// 	circleStyle[d.YEAR] = circle;
	// });
	updateSelectedTime("1940");
	//console.log(Object.keys(circleSelected).length);
	// circleSelected["1940"] = true;
	// console.log(circleSelected["1940"]);
	allTexts.selectAll("text")
	        .data(data)
	        .enter()
	        .append("text")
		    .attr("x", function(d, i){return (22 + i * 60);})
		    .attr("y", 50)
		    .style("text-align", "center")
		    .style("text-anchor", "middle")
		    .style("font-family", "Arial")
		    .style("font-size", "12px")
		    .text(function(d){return (""+d.YEAR+"");});
}

//update selected time
function updateSelectedTime(year){
	data.forEach(function(d){
		circleSelected[d.YEAR] = false;
		// var circle = circleStyle[d.YEAR];
		// circle.attr("r", 10).style("stroke", "none");
	});
	allCircles.remove()
	circleSelected[year] = true;
	allCircles = timeLine.append("svg").attr("id","allCircles");
	allCircles.selectAll("circle")
	        .data(data)
	        .enter()
	        .append("circle")
	        .attr("r", function(d){
	        	if (circleSelected[d.YEAR]) {
	        		return 15;
	        	}else{
	        		return 10;
	        	}
	        })
	        .attr("cx", function(d, i){return (22 + i * 60);})
	        .attr("cy", 20)
	        .style("fill", function(d){
	        	if (d.PARTY === "D") {
	        		return "#3182bd";
	        	}else{
	        		return "#de2d26";
	        	}
	        })
	        .style("stroke", function(d){
	        	if (circleSelected[d.YEAR]) {
	        		return "black";
	        	}else{
	        		return "none";
	        	}
	        })
	        .style("stroke-width",function(d){
	        	if (circleSelected[d.YEAR]) {
	        		return 2;
	        	}else{
	        		return 0;
	        	}
	        })
	        .on("click", function(d){
	        	updateSelectedTime(d.YEAR);
                updateEVCYear(d.YEAR);	
		        updateVP(d.YEAR);
		        updateTitleChart(d.YEAR);
		        loadLastData(d.YEAR);
	        });
	// var c = circleStyle[year];
	// c.attr("r", 15)
	//  .style("stroke", "black")
	//  .style("stroke-width", 2);
}

// function colorParty(party){
// 	if (party === "D") {
// 		return "#3182bd";
// 	}else if(party === "R") {
// 		return "#de2d26";
// 	}
// }