var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// var svgTrend = d3.select("#eTrendChart")
//                  .append("svg")
//                  .attr("id", "svgTag")
//                  .attr("width", width + margin.left + margin.right)
//                  .attr("height", height + margin.top + margin.bottom);

var trendData;

function SentimentTrend() {
	console.log("trend");
	updateTrend("TOM TIT TOT");
}

function updateTrend(name) {
	d3.select("#svgTag").remove();
	var svgTrend = d3.select("#eTrendChart")
                 .append("svg")
                 .attr("id", "svgTag")
                 .attr("width", width + margin.left + margin.right)
                 .attr("height", height + margin.top + margin.bottom)
                 .append("g")
                 .attr("transform", "translate("+margin.left+", "+margin.top+")");
    var curLine = -1, preLine = -1;
	var negative = 0, positive = 0;
    var dataArr = [];
    d3.csv("data/sentiments_new/"+name+".csv", function(error, csv){
    	if (error) throw error;
    	csv.forEach(function(d, i){
    		d.line = +d.line;
    		d.sentiment = d.sentiment;
    		d.n = +d.n;
    		d.e_depth = +d.e_depth;
    		if (i === 0) {
    			preLine = d.line;
    			if (d.sentiment === "sadness" || d.sentiment === "anger" || d.sentiment === "disgust" || d.sentiment === "fear") {
    				negative = negative + d.n * d.e_depth;
    			}else if (d.sentiment === "surprise" || d.sentiment === "anticipation" || d.sentiment === "trust" || d.sentiment === "joy") {
    				positive = positive + d.n * d.e_depth;
    			}
    		}else {
    			curLine = d.line;
    			if (curLine === preLine) {
    				if (d.sentiment === "sadness" || d.sentiment === "anger" || d.sentiment === "disgust" || d.sentiment === "fear") {
    					negative = negative + d.n * d.e_depth;
    				}else if (d.sentiment === "surprise" || d.sentiment === "anticipation" || d.sentiment === "trust" || d.sentiment === "joy") {
    					positive = positive + d.n * d.e_depth;
    				}
    				preLine = curLine;
    			}else {
    				negative = Math.abs(negative);
    				dataArr.push({"line": preLine, "positive": positive, "negative": negative});
    				negative = 0;
    				positive = 0;
    				if (d.sentiment === "sadness" || d.sentiment === "anger" || d.sentiment === "disgust" || d.sentiment === "fear") {
    					negative = negative + d.n * d.e_depth;
    				}else if (d.sentiment === "surprise" || d.sentiment === "anticipation" || d.sentiment === "trust" || d.sentiment === "joy") {
    					positive = positive + d.n * d.e_depth;
    				}
    				preLine = curLine;
    			}
    		}
    	});
    	trendData = csv;
    	//console.log(dataArr.length);
    	var numOfPoints = dataArr.length;
    	// console.log(dataArr);
    	// console.log(maxVal);
    	var xScale = d3.scaleLinear().domain([1,d3.max(dataArr, function(d){ return d.line;})]).range([0, width]);
    	var yScale = d3.scaleLinear().domain([0,d3.max(dataArr, function(d){ return Math.max(d.positive,d.negative);})]).range([height, 0]);
    	var positiveLine = d3.line()
    	             		 .x(function(d){ return xScale(d.line);})
    	             		 .y(function(d){ return yScale(d.positive);})
    	             		 .curve(d3.curveMonotoneX);

    	var negativeLine = d3.line()
    	                     .x(function(d){ return xScale(d.line);})
    	                     .y(function(d){ return yScale(d.negative);})
    	                     .curve(d3.curveMonotoneX);

    	svgTrend.append("path")
    	   .datum(dataArr)
    	   .attr("class", "trendLine")
    	   .style("stroke", "#4380b9")
    	   .style("stroke-width", 3)
    	   .style("fill", "none")
    	   .attr("d", positiveLine)
           .on("mouseover", function(d){
             d3.selectAll(".trendLine")
               .style("opacity", 0.1);
             d3.selectAll(".trendCircle")
               .style("opacity", 0.25);
             d3.select(this)
               .style("opacity", 1)
               .style("stroke-width", 3.5)
               .style("cursor", "pointer");
             svgTrend.append("text")
                     .attr("class", "titleText")
                     .attr("x", (width - margin.left) / 2)
                     .attr("y", 0)
                     .style("fill", "#4380b9")
                     .style("font-weight", "bold")
                     .style("font-family", "Lato")
                     .style("font-size", "15px")
                     .text("Positive Sentiments Trend");
           })
           .on("mouseout", function(d){
             d3.selectAll(".trendLine")
               .style("opacity", 1);
             d3.selectAll(".trendCircle")
               .style("opacity", 1);
             d3.select(this)
               .style("stroke-width", 3)
               .style("cursor", "none");
             svgTrend.select(".titleText").remove();
           });

    	svgTrend.append("path")
    	   .datum(dataArr)
    	   .attr("class", "trendLine")
    	   .style("stroke", "#cf3e2b")
    	   .style("stroke-width", 3)
    	   .style("fill", "none")
    	   .attr("d", negativeLine)
           .on("mouseover", function(d){
             d3.selectAll(".trendLine")
               .style("opacity", 0.1);
             d3.selectAll(".trendCircle")
               .style("opacity", 0.25);
             d3.select(this)
               .style("opacity", 1)
               .style("stroke-width", 3.5)
               .style("cursor", "pointer");
             svgTrend.append("text")
                     .attr("class", "titleText")
                     .attr("x", (width - margin.left) / 2)
                     .attr("y", 0)
                     .style("fill", "#cf3e2b")
                     .style("font-weight", "bold")
                     .style("font-family", "Lato")
                     .style("font-size", "15px")
                     .text("Negative Sentiments Trend");
           })
           .on("mouseout", function(d){
             d3.selectAll(".trendLine")
               .style("opacity", 1);
             d3.selectAll(".trendCircle")
               .style("opacity", 1);
             d3.select(this)
               .style("stroke-width", 3)
               .style("cursor", "none");
             svgTrend.select(".titleText").remove();
           });

    	svgTrend.append("g")
    	        //.attr("class", "x axis")
    	        .attr("transform", "translate(0," + height + ")")
    	        .call(d3.axisBottom(xScale).ticks(8));

        svgTrend.append("text")
                .attr("transform","translate("+(width / 2)+", "+(height + margin.top - 10)+")")
                .style("text-anchor", "middle")
                .style("fill", "#000")
                .style("font-family", "Lato")
                .style("font-size", "13px")
                .text("line number");

    	svgTrend.append("g")
    	        //.attr("class","y axis")
    	        .call(d3.axisLeft(yScale).ticks(8))
                .append("text")
                .attr("y", 15)
                .attr("transform", "rotate(-90)")
                .style("fill", "#000")
                .style("font-family", "Lato")
                .style("font-size","10px")
                .text("Degrees of sentiments");

    	var dots = svgTrend.selectAll(".dot").data(dataArr).enter();
    	var positiveDots = dots.append("circle")
                               .attr("class", "trendCircle")
    	                       .style("fill", "#4380b9")
    	                       .style("stroke","#fff")
    	                       .attr("cx", function(d){ return xScale(d.line);})
    	                       .attr("cy", function(d){ return yScale(d.positive);})
    	                       .attr("r", 5)
                               .on("mouseover", function(d){
                                   d3.select(this)
                                     .transition()
                                     .duration(500)
                                     .attr("r", 8);
                                   svgTrend.append("text")
                                           .attr("class", "circleText")
                                           .attr("x", xScale(d.line) + 2)
                                           .attr("y", yScale(d.positive) - 10)
                                           .style("font-family", "Lato")
                                           .style("fill", "#4380b9")
                                           .style("font-size", "15px")
                                           .text("("+d.line+", "+d.positive+")");
                               })
                               .on("mouseout", function(d){
                                    d3.select(this)
                                      .transition()
                                      .duration(500)
                                      .attr("r", 5);
                                    svgTrend.select(".circleText").transition().duration(500);
                                    svgTrend.select(".circleText").remove();
                               });

    	var negativeDots = dots.append("circle")
                               .attr("class", "trendCircle")
    	                       .style("fill", "#cf3e2b")
    	                       .style("stroke", "#fff")
    	                       .attr("cx", function(d){ return xScale(d.line);})
    	                       .attr("cy", function(d){ return yScale(d.negative);})
    	                       .attr("r", 5)
                               .on("mouseover", function(d){
                                  d3.select(this)
                                    .transition()
                                    .duration(500)
                                    .attr("r", 8);
                                  svgTrend.append("text")
                                          .attr("class", "circleText")
                                          .attr("x", xScale(d.line) + 2)
                                          .attr("y", yScale(d.negative) - 10)
                                          .style("font-family", "Lato")
                                          .style("fill", "#cf3e2b")
                                          .style("font-size", "15px")
                                          .text("("+d.line+", "+d.negative+")");
                               })
                               .on("mouseout", function(d){
                                  d3.select(this)
                                    .transition()
                                    .duration(500)
                                    .attr("r", 5);
                                  svgTrend.select(".circleText").transition().duration(500);
                                  svgTrend.select(".circleText").remove();
                               });
    });

}