var dataOfLE;
// var width = 900,
//     height = 900;
var svgWidth = 600,
    svgHeight = 600;
var legendWidth = 250,
    legendHeight = 500;
var start = 0,
    end = 2.3,
    numSpirals = 1.8;
var margin = {top: 50, bottom: 50, left: 50, right: 50};

var theta = function(r) {
    return numSpirals * Math.PI * r;
};

var domain = [-4, -3, -2, -1, 1, 2, 3, 4];
var senti = ["sadness","anger","disgust","fear","surprise","anticipation","trust","joy"];
var range = ["#cf3e2b","#ee7351","#f09775","#f4bca3","#c9daee","#a5c9e1","#77acd4","#4380b9"];
var colorScale = d3.scaleQuantile().domain(domain).range(range);
var r = d3.min([svgWidth, svgHeight - 100]) / 2 - 40;
var radius = d3.scaleLinear().domain([start, end]).range([40, r]);

var lineSvg = d3.select("#eCondegram")
                .append("svg")
                .attr("id", "lineSVG")
                .attr("width", svgWidth)
                .attr("height", svgHeight - 100);

var legend = d3.select("#legend")
               .append("svg")
               .attr("width", legendWidth)
               .attr("height", legendHeight);

var points = d3.range(start, end + 0.001, (end - start) / 1000);
var spiral = d3.radialLine().curve(d3.curveCardinal).angle(theta).radius(radius);

var path = lineSvg.append("path")
                  .datum(points)
                  .attr("id", "spiral")
                  .attr("d", spiral)
                  .style("fill","none")
                  .style("stroke", "gray")
                  .style("stroke-width", 3);
var spiralLen = path.node().getTotalLength();
var totalLength = 0;
var toolTip = d3.select("#eCondegram")
                .append("div")
                .attr("class", "d3-tip")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("padding-top","0px");

function LineEmotions(){
	//console.log("line");
	updateLineEmo("TOM TIT TOT");
}

function updateLineEmo(name){
	d3.select("#lineSVG").remove();
    legend.remove();
    //console.log(name);
    totalLength = 0;
    lineSvg = d3.select("#eCondegram")
                .append("svg")
                .attr("id", "lineSVG")
                .attr("width", svgWidth)
                .attr("height", svgHeight - 20)
                .append("g")
                .attr("transform", "translate("+(svgWidth / 2) +", "+(svgHeight / 2 - 30)+")");

    path = lineSvg.append("path")
                  .datum(points)
                  .attr("id", "spiral")
                  .attr("d", spiral)
                  .style("fill","none")
                  .style("stroke", "gray")
                  .style("stroke-width", 3);

    legend = d3.select("#legend")
               .append("svg")
               .attr("width", legendWidth)
               .attr("height", legendHeight);

    d3.csv("data/sentiments_new/"+name+".csv", function(error, csv){
    	if(error) throw error;
    	csv.forEach(function(d, i){
    		d.line = +d.line;
    		d.sentiment = d.sentiment;
    		d.n = +d.n;
    		d.e_depth = +d.e_depth;
    		totalLength = totalLength + 1;
    	});
    	dataOfLE = csv;
    	var barWidth = (spiralLen / totalLength) - 1;
    	//console.log(dataOfLE);
    	var lineScale = d3.scaleLinear().domain([0, totalLength]).range([0, spiralLen]);
    	var barScale = d3.scaleLinear().domain([0, d3.max(dataOfLE, function(d){ return d.n;})]).range([0, (r / numSpirals) - 30]);
    	lineSvg.selectAll("rect")
    	       .data(dataOfLE)
    	       .enter()
    	       .append("rect")
    	       .attr("x", function(d, i){
    	       	//console.log(i);
    	       	 var perLine = lineScale(i+1);
    	       	 var posOnLine = path.node().getPointAtLength(perLine);
    	       	 var angleOnLine = path.node().getPointAtLength(perLine - barWidth);
    	       	 d.perLine = perLine;
    	       	 d.x = posOnLine.x;
    	       	 d.y = posOnLine.y;
    	       	 d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90;
    	       	 return d.x;
    	       })
    	       .attr("y", function(d){ return d.y;})
    	       .attr("width", function(d){ return barWidth;})
    	       .attr("height", function(d){ return barScale(d.n);})
    	       .style("fill", function(d){ return colorScale(d.e_depth);})
    	       .attr("transform", function(d){
    	       	 return "rotate(" + d.a + "," + d.x+ "," + d.y + ")";
    	       })
               .on("mouseover", function(d){
                 d3.select(this)
                   .style("fill", "#fff")
                   .style("stroke", colorScale(d.e_depth))
                   .style("stroke-width", 2);
                 toolTip.transition().duration(500).style("opacity", 0.9);
                 toolTip.attr("width","200px").attr("height","40px").style("text-align","left");
                 toolTip.html("<span style=\"color: black;\">Sentiments: "+d.sentiment+"</span><br/>" + 
                              "<span style=\"color: black;\">Appear times: "+d.n+"</span>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 200) + "px");
               })
               .on("mouseout", function(d){
                 d3.select(this)
                   .style("fill", colorScale(d.e_depth))
                   .style("stroke", "none")
                   .style("stroke-width", 0);
                 toolTip.transition().duration(500).style("opacity", 0);
               });
        lineSvg.selectAll("text")
               .data(dataOfLE)
               .enter()
               .append("text")
               .attr("dy", 13)
               .style("text-anchor", function(d,i){
                if (i === 0) {
                    return "start";
                }else if(i === totalLength - 1){
                    return "end";
                }else{
                    return "start";
                }
               })
               .style("font", "12px arial")
               .append("textPath")
               .text(function(d, i){
                 if (i === 0) {
                    return "START ==>";
                 }else if (i === totalLength - 1) {
                    return "==> END";
                 }else{
                    return "";
                 }
               })
               .attr("xlink:href", "#spiral")
               .style("fill", "black")
               .attr("startOffset", function(d){
                return ((d.perLine / spiralLen) * 100) + "%";
               });

        legend.selectAll("rect")
              .data(range)
              .enter()
              .append("rect")
              .attr("x", 50)
              .attr("y", function(d, i){
                return (160 + i * 25);
              })
              .attr("width", 15)
              .attr("height", 15)
              .style("fill", function(d, i){
                return range[i];
              });

        legend.selectAll("text")
              .data(senti)
              .enter()
              .append("text")
              .attr("x", 72)
              .attr("y", function(d, i){
                return (172 + i * 25);
              })
              .attr("font-family","Rancho")
              .attr("font-size","20px")
              .attr("text-align","center")
              .attr("text-anchor","start")
              .text(function(d, i){
                return senti[i];
              })
    });
}