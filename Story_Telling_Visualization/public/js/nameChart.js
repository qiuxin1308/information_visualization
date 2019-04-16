var data;
var circleSelected = {};
var width = 1700;
var nameLinesSvg = d3.select("#listStories-chart")
                     .append("svg")
                     .attr("width", width)
                     .attr("height", 60);

var nameLines = nameLinesSvg.append("svg")
                            .attr("width", width)
                            .attr("height", 60);

var dashLine = nameLines.append("line")
                        .attr("x1", 0)
                        .attr("x2", width)
                        .attr("y1", 20)
                        .attr("y2", 20)
                        .style("stroke", "gray")
                        .style("opacity", 0.6)
                        .style("stroke-width", 2);

var allCircles = nameLines.append("svg").attr("id","allCircles");
var textName = d3.select("#listStories-chart")
                 .append("div")
                 .attr("class", "d3-tip")
                 .style("opacity", 0)
                 .style("position", "absolute")
                 .style("padding-top","2px");

function NameChart(lineEmoInfo, radarSentiment, sentimentPercetage, sentimentTrend, fairyTales){
	//console.log(fairyTales);
	fairyTales.forEach(function(d){
		d.Name = d.Name;
		d.Sentiment = d.Sentiment;
		circleSelected[d.Name] = false;
	});
	data = fairyTales;
	allCircles.selectAll("circle")
	          .data(data)
	          .enter()
	          .append("circle")
	          .attr("r", 13)
	          .attr("cx", function(d, i){ return (30 + i * 140);})
	          .attr("cy", 20)
	          .style("fill", function(d){
	          	if (d.Sentiment === "N") {
	          		return "#cf3e2b";
	          	}else if (d.Sentiment === "P") {
	          		return "#4380b9";
	          	}
	          })
	          .on("mouseover", function(d){
	          	textName.transition()
	          	        .duration(500)
	          	        .style("opacity", 0.9);
	          	textName.style("width", "180px")
	          	        .style("height", "40px");
	          	textName.html("<span style=\"color: black;\">"+d.Name+"</span>")
	          	        .style("left", (d3.event.pageX) + "px")
	          	        .style("top", (d3.event.pageY - 28) + "px");
	          })
	          .on("mouseout", function(){
	          	textName.transition().duration(500).style("opacity", 0);
	          });
	updateSelectedName("TOM TIT TOT");	
}

function updateSelectedName(name) {
	data.forEach(function(d){
		circleSelected[d.Name] = false;
	});
	allCircles.remove();
	circleSelected[name] = true;
	allCircles = nameLines.append("svg").attr("id","allCircles");
	allCircles.selectAll("circle")
	          .data(data)
	          .enter()
	          .append("circle")
	          .attr("r", function(d){
	          	if (circleSelected[d.Name]) {
	          		return 18;
	          	}else{
	          		return 13;
	          	}
	          })
	          .attr("cx", function(d, i){ return (30 + i * 140);})
	          .attr("cy", 20)
	          .style("fill", function(d){
	          	if (d.Sentiment === "N") {
	          		return "#cf3e2b";
	          	}else if (d.Sentiment === "P") {
	          		return "#4380b9";
	          	}
	          })
	          .style("stroke", function(d){
	          	if (circleSelected[d.Name]) {
	          		return "black";
	          	}else{
	          		return "none";
	          	}
	          })
	          .style("stroke-width", function(d){
	          	if (circleSelected[d.Name]) {
	          		return 2;
	          	}else{
	          		return 0;
	          	}
	          })
	          .on("mouseover", function(d){
	          	textName.transition()
	          	        .duration(500)
	          	        .style("opacity", 0.9);
	          	textName.style("width", "180px").style("height", "40px").style("text-align","center");
	          	textName.html("<span style=\"color: black;\">"+d.Name+"</span>")
	          	        .style("left", (d3.event.pageX) + "px")
	          	        .style("top", (d3.event.pageY - 28) + "px");
	          })
	          .on("mouseout", function(){
	          	textName.transition().duration(500).style("opacity", 0);
	          })
	          .on("click", function(d){
	          	updateSelectedName(d.Name);
	          	updateLineEmo(d.Name);
	          	updateRadarSentiment(d.Name);
	          	updateSentiPer(d.Name);
	          	updateTrend(d.Name);
	          });
}

// function colorFun(name) {
// 	//var textData = [];
// 	var sadness = 0, anger = 0, disgust = 0, fear = 0,
// 		surprise = 0, anticipation = 0, trust = 0, joy = 0;
// 	d3.csv("data/sentiments_new/"+name+".csv", function(error, csv){
// 		if (error) throw error;
// 		csv.forEach(function(d){
// 			d.sentiment = d.sentiment;
//     		d.n = +d.n;
//     		if (d.sentiment === "sadness") {
//       			sadness = sadness + d.n;
//     		}else if(d.sentiment === "anger"){
//       			anger = anger + d.n;
//     		}else if(d.sentiment === "disgust"){
//       			disgust = disgust + d.n;
//     		}else if (d.sentiment === "fear") {
//       			fear = fear + d.n;
//     		}else if (d.sentiment === "surprise") {
//       			surprise = surprise + d.n;
//     		}else if (d.sentiment === "anticipation") {
//       			anticipation = anticipation + d.n;
//     		}else if (d.sentiment === "trust") {
//       			trust = trust + d.n;
//     		}else if (d.sentiment === "joy") {
//       			joy = joy + d.n;
//     		}
// 		});
// 		var positive = sadness + anger + disgust + fear;
//   		var negative = surprise + anticipation + trust + joy;
//   		if (negative > positive) {
//   			return "negative";
//   		}else{
//   			return "positive";
//   		}
//   	});
// }

// function colorReturn(cName){
// 	colorTheName = [];

// }