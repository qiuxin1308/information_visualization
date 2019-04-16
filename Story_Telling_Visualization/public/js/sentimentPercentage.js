function SentimentPercetage() {
	//console.log("senPer");
	updateSentiPer("TOM TIT TOT");
}

function updateSentiPer(name) {
	d3.select("#sentiPerChart").remove();
	var donut = donutChart().width(550)
	                        .height(550)
	                        .cornerRadius(3)
	                        .padAngle(0.015)
	                        .variable("Probability")
	                        .category("Sentiment");

	var dataArr = [];
	var sadness = 0, anger = 0, disgust = 0, fear = 0,
        surprise = 0, anticipation = 0, trust = 0, joy = 0;
    var sadnessPer = 0, angerPer = 0, disgustPer = 0, fearPer = 0,
        surprisePer = 0, anticipationPer = 0, trustPer = 0, joyPer = 0;
    var totalNum = 0;
    d3.csv("data/sentiments_new/"+name+".csv", function(error, csv){
        if (error) throw error;
        csv.forEach(function(d){
            d.sentiment = d.sentiment;
            d.n = +d.n;
            if (d.sentiment === "sadness") {
                sadness = sadness + d.n;
            }else if(d.sentiment === "anger"){
                anger = anger + d.n;
            }else if(d.sentiment === "disgust"){
                disgust = disgust + d.n;
            }else if (d.sentiment === "fear") {
                fear = fear + d.n;
            }else if (d.sentiment === "surprise") {
                surprise = surprise + d.n;
            }else if (d.sentiment === "anticipation") {
                anticipation = anticipation + d.n;
            }else if (d.sentiment === "trust") {
                trust = trust + d.n;
            }else if (d.sentiment === "joy") {
                joy = joy + d.n;
            }
            totalNum = totalNum + d.n;
        });
        var text = ["sadness","anger","disgust","fear","surprise","anticipation","trust","joy"];
        sadnessPer = sadness / totalNum;
        angerPer = anger / totalNum;
        disgustPer = disgust / totalNum;
        fearPer = fear / totalNum;
        surprisePer = surprise / totalNum;
        anticipationPer = anticipation / totalNum;
        trustPer = trust / totalNum;
        joyPer = joy / totalNum;
        var textData = [sadnessPer,angerPer,disgustPer,fearPer,surprisePer,anticipationPer,trustPer,joyPer];
        var colorVal = [-4,-3,-2,-1,1,2,3,4];
        for(var i = 0; i < 8; i++){
            dataArr.push({"Sentiment": text[i], "Probability": textData[i], "eDepth": colorVal[i]});
        }
        d3.select("#ePieChart")
            .datum(dataArr) 
            .call(donut);
    });
}
//adapt and modify the reference from https://bl.ocks.org/mbhall88/b2504f8f3e384de4ff2b9dfa60f325e2
function donutChart() {
    var width,
        height,
        margin = {top: 10, right: 10, bottom: 10, left: 10},
        cDomain = [-4,-3,-2,-1,1,2,3,4],
        cRange = ["#cf3e2b","#ee7351","#f09775","#f4bca3","#c9daee","#a5c9e1","#77acd4","#4380b9"],
        colorScale = d3.scaleQuantile().domain(cDomain).range(cRange),
        variable, 
        category, 
        padAngle, 
        floatFormat = d3.format(".4r"),
        cornerRadius,
        percentFormat = d3.format(",.2%");

    function chart(selection){
        selection.each(function(data) {
            var radius = Math.min(360, 360) / 2;
            var pie = d3.pie()
                .value(function(d) { return floatFormat(d[variable]); })
                .sort(null);
            var arc = d3.arc()
                .outerRadius(radius * 0.8)
                .innerRadius(radius * 0.6)
                .cornerRadius(cornerRadius)
                .padAngle(padAngle);
            var outerArc = d3.arc()
                .outerRadius(radius * 0.9)
                .innerRadius(radius * 0.9);
            var circlePer = selection.append("svg").attr("id","sentiPerChart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + (width / 2 + 15) + "," + (height / 2 + 45) + ")");
            circlePer.append("g").attr("class", "slices");
            circlePer.append("g").attr("class", "labelName");
            circlePer.append("g").attr("class", "lines");
            var path = circlePer.select(".slices")
                .datum(data).selectAll("path")
                .data(pie)
                .enter()
                .append("path")
                .attr("fill", function(d) { return colorScale(d.data["eDepth"]); })
                .attr("d", arc);
            var label = circlePer.select(".labelName").selectAll("text")
                .data(pie)
                .enter().append("text")
                .attr("dy", ".35em")
                .html(function(d) {
                    return d.data[category] + ": <tspan>" + percentFormat(d.data[variable]) + "</tspan>";
                })
                .attr("transform", function(d) {
                    var pos = outerArc.centroid(d);
                    pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                    return "translate(" + pos + ")";
                })
                .style("text-anchor", function(d) {
                    return (midAngle(d)) < Math.PI ? "start" : "end";
                });
            var polyline = circlePer.select(".lines")
                .selectAll("polyline")
                .data(pie)
                .enter().append("polyline")
                .attr("points", function(d) {
                    var pos = outerArc.centroid(d);
                    pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                    return [arc.centroid(d), outerArc.centroid(d), pos]
                });
            d3.selectAll(".labelName text, .slices path").call(toolTip);
            function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }
            function toolTip(selection) {
                selection.on("mouseenter", function (data) {

                    circlePer.append("text")
                        .attr("class", "toolCircle")
                        .attr("dy", -15)
                        .html(toolTipHTML(data))
                        .style("font-size", "0.9em")
                        .style("font-family", "Lato")
                        .style("text-anchor", "middle");

                    circlePer.append("circle")
                        .attr("class", "toolCircle")
                        .attr("r", radius * 0.55)
                        .style("fill", colorScale(data.data["eDepth"]))
                        .style("fill-opacity", 0.35);

                });
                selection.on("mouseout", function () {
                    d3.selectAll(".toolCircle").remove();
                });
            }
            function toolTipHTML(data) {
                var tip = "",
                    i   = 0;
                for (var key in data.data) {
                    var value = (!isNaN(parseFloat(data.data[key]))) ? percentFormat(data.data[key]) : data.data[key];
                    if (i === 0) tip += "<tspan x='0'>" + key + ": " + value + "</tspan>";
                    else tip += "<tspan x='0' dy='2.2em'>" + key + ": " + value + "</tspan>";
                    if (i === Object.keys(data.data).length - 2) {
                        break;
                    }
                    i++;
                }
                return tip;
            }
        });
    }
    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.margin = function(value) {
        if (!arguments.length) return margin;
        margin = value;
        return chart;
    };

    chart.radius = function(value) {
        if (!arguments.length) return radius;
        radius = value;
        return chart;
    };

    chart.padAngle = function(value) {
        if (!arguments.length) return padAngle;
        padAngle = value;
        return chart;
    };

    chart.cornerRadius = function(value) {
        if (!arguments.length) return cornerRadius;
        cornerRadius = value;
        return chart;
    };

    chart.colorScale = function(value) {
        if (!arguments.length) return colorScale;
        colorScale = value;
        return chart;
    };

    chart.variable = function(value) {
        if (!arguments.length) return variable;
        variable = value;
        return chart;
    };

    chart.category = function(value) {
        if (!arguments.length) return category;
        category = value;
        return chart;
    };

    return chart;
}