var totalSum = 0;
exportsVis = function(_parentElement) {
	this.parentElement = _parentElement;
	this.initVis();
}

exportsVis.prototype.initVis = function(){
	var vis = this;
	vis.barVis();
	//vis.asterPlotVis(dataExports);
};

/* function to draw bar chart */
exportsVis.prototype.barVis = function(){
	var vis = this;
	//console.log(wineTradeData);
	vis.barSvgWidth = 530;
	vis.barSvgHeight = 600;
	vis.margin = {top: 10, right: 10, bottom: 10, left: 10};
	vis.width = 430 - vis.margin.left - vis.margin.right;
	vis.height = 430 - vis.margin.top - vis.margin.bottom;
	vis.titleSvg = d3.select("#trade_title")
	                 .append("text")
	                 .attr("x", 200)
	                 .attr("y", 60)
	                 .style("text-align","center")
	                 .style("text-anchor", "start")
	                 .attr("class", "titleStyle")
	                 .style("fill", "black")
	                 .style("padding-left","180px")
	                 .text("Wine Export In Seven Countries (in billions)");

	vis.barSvg = d3.select("#trade_barChart")
	               .append("svg")
	               .attr("id", "barsSvg")
	               .attr("width", vis.barSvgWidth)
	               .attr("height", vis.barSvgHeight);

	/* add the title to the bar chart */
	vis.barTitle = vis.barSvg.append("text")
	                     .attr("x",100)
	                     .attr("y",20)
	                     .style("fill","#000")
	                     .style("text-align","center")
	                     .style("text-anchor","start")
	                     .attr("class", "contentTitleStyle")
	                     .text("Wine Export Between 2013 and 2017");

	vis.g = vis.barSvg.append("g")
	                  .attr("id", "gBarSvg")
	                  .attr("transform", "translate("+(vis.margin.left + 40)+","+(vis.margin.top + 50)+")");

	vis.x0 = d3.scaleBand()
	           .rangeRound([0, vis.width])
	           .paddingInner(0.1);

	vis.x1 = d3.scaleBand()
	           .padding(0.05);

	vis.y = d3.scaleLinear()
	          .rangeRound([vis.height,0]);

	vis.z = d3.scaleOrdinal()
	          .range(["#c2c2d6", "#bf80ff"]);

	var keys = ["2013", "2017"];
	vis.x0.domain(exTrendData.map(function(d){ return d.Country;}));
	vis.x1.domain(keys).rangeRound([0, vis.x0.bandwidth()]);
	vis.y.domain([0, d3.max(exTrendData, function(d){
		return d3.max(keys, function(key){
			return d[key];
		});
	})]).nice();

	vis.g.append("g")
	     .selectAll(".gBars")
	     .data(exTrendData)
	     .enter()
	     .append("g")
	     .attr("transform", function(d){
	     	return "translate("+vis.x0(d.Country)+",0)";
	     })
	     .selectAll(".barRects")
	     .data(function(d) {
	     	return keys.map(function(key){
	     		return {key: key, value: d[key], country: d.Country};
	     	});
	     })
	     .enter()
	     .append("rect")
	     .attr("x", function(d){
	     	//console.log(d.key);
	     	return (vis.x1(d.key));
	     })
	     .attr("y", function(d){
	     	//console.log(d.value);
	     	return vis.y(d.value);
	     })
	     .attr("width", vis.x1.bandwidth())
	     .attr("height", function(d){
	     	return (vis.height - vis.y(d.value));
	     })
	     .attr("fill", function(d){
	     	return vis.z(d.key);
	     })
	     .on("mouseover", function(d){
	     	d3.select(this)
	     	  .style("stroke","#494371")
	     	  .style("stroke-width",3);
	     })
	     .on("mouseout", function(d){
	     	d3.select(this)
	     	  .style("stroke","none")
	     	  .style("stroke-width",0);
	     })
	     .on("click", function(d){
	     	if (d.key === "2013") {
	     		var countryExports = [];
	     		for(var i = 0; i < dataExports.length; i++){
	     			if (d.country === dataExports[i].exporter && dataExports[i].year === "2013") {
	     				countryExports.push({"country": dataExports[i].country,"export":dataExports[i].export,"color":dataExports[i].color});
	     			}
	     		}
	     		//console.log(countryExports);
	     		$("#leftarrow").hide();
	     		vis.pieVis(countryExports,d.country,d.key);
	     	}else if (d.key === "2017") {
	     		var countryExports = [];
	     		for(var i = 0; i < dataExports.length; i++){
	     			if (d.country === dataExports[i].exporter && dataExports[i].year === "2017") {
	     				countryExports.push({"country": dataExports[i].country,"export":dataExports[i].export,"color":dataExports[i].color});
	     			}
	     		}
	     		//console.log(countryExports);
	     		$("#leftarrow").hide();
	     		vis.pieVis(countryExports,d.country,d.key);
	     	}
	     });

	vis.g.append("g")
	     .attr("class", "axis")
	     .attr("transform", "translate(0,"+vis.height+")")
	     .call(d3.axisBottom(vis.x0));

    vis.g.append("g")
         .attr("class", "axis")
         .style("font-size","10px")
         .call(d3.axisLeft(vis.y).ticks(null,"s"))
         .append("text")
         .attr("x", 2)
         .attr("y", vis.y(vis.y.ticks().pop()) + 0.5)
         .attr("dy", "0.22em")
         .attr("fill", "#000")
         .attr("font-weight", "bold")
         .attr("text-anchor", "start")
         .text("billions");

    vis.legend = vis.g.append("g")
                      .attr("font-family", "sans-serif")
                      .attr("font-size",10)
                      .attr("text-anchor", "end")
                      .selectAll("g")
                      .data(keys.slice().reverse())
                      .enter()
                      .append("g")
                      .attr("transform", function(d, i){
                      	return "translate(0,"+i*20+")";
                      });

    vis.legend.append("rect")
              .attr("x", vis.width - 19)
              .attr("width", 19)
              .attr("height", 19)
              .attr("fill",vis.z);

    vis.legend.append("text")
              .attr("x", vis.width - 24)
              .attr("y", 9.5)
              .attr("dy", "0.32em")
              .text(function(d){
              	return d;
              });
};

/* function to draw the pie chart */
exportsVis.prototype.pieVis = function(data,selectedCountry,curYear){
	var vis = this;
	$("#asterView").empty();
	$("#asterLegend").empty();
	var total = 0;
	vis.pieWidth = 680;
	vis.pieHeight = 600;
	vis.svgWidth = 500;
	vis.svgHeight= 500;
	vis.pielenWidth = 160;
	vis.pielenHeight = 500;
	var countriesName = ["France", "Australia", "US", "Spain", "Argentina", "Canada", "Italy"];
	var countriesColor = ["#E65C00", "#CD6596", "#897E7A", "#6D93C5", "#A6D8D1", "#FFBE36", "#43B59E"];
	var dataArr = [];

	vis.donut = vis.donutChart().width(vis.svgWidth)
	                        .height(vis.svgHeight)
	                        .cornerRadius(3)
	                        .padAngle(0.015)
	                        .variable("probability")
	                        .category("country");

	data.forEach(function(d){
		d.export = +d.export;
		total = total + d.export;
	});

	totalSum = total;

	data.forEach(function(d){
		d.country = d.country;
		d.color = d.color;
		d.export = +d.export;
		var prob = d.export / total;
		dataArr.push({"country": d.country, "probability": prob, "color": d.color});
	})
	//console.log(dataArr);
	vis.asterSvg = d3.select("#asterView")
	                 .append("svg")
	                 .attr("id", "asterSvg")
	                 .attr("width", vis.svgWidth)
	                 .attr("height", vis.svgHeight);

	vis.asterTitle = vis.asterSvg.append("text")
	                     		.style("fill","#000")
	                     		.style("text-align","center")
	                     		.style("text-anchor","start")
	                     		.attr("class", "contentTitleStyle")
	                     		.append("tspan")
	                     		.attr("x",90)
	                     		.attr("y",13)
	                     		.text("Countries where the wine in "+selectedCountry+" goes to in "+curYear)
	                     		.append("tspan")
	                     		.attr("x",145)
	                     		.attr("y",40)
	                     		// .style("font-famliy", "Arial")
	                     		.style("font-size", "14px")
	                     		.text("("+f(total)+" billions total for wine export in "+selectedCountry+")");
	d3.select("#asterSvg")
	  .datum(dataArr)
	  .call(vis.donut);

	/* draw the legend of aster plot */
	vis.legendSvg = d3.select("#asterLegend")
	                  .append("svg")
	                  .attr("id", "asterlenSvg")
	                  .attr("width", vis.pieWidth)
	                  .attr("height", vis.pieHeight);
	                  //.attr("transform", "translate(10,80)");

	vis.gLen = vis.legendSvg.append("g")
	              .attr("transform", "translate(0,80)")

	/* draw the legend */
	vis.gLen.selectAll(".asterRect")
	             .data(countriesColor)
	             .enter()
	             .append("rect")
	             .attr("x", 5)
	             .attr("y", function(d, i){
	             	return (120 + i * 25);
	             })
	             .attr("width", 40)
	             .attr("height", 20)
	             .style("fill", function(d, i){
	             	return countriesColor[i];
	             });

	vis.gLen.selectAll(".asterText")
	             .data(countriesName)
	             .enter()
	             .append("text")
	             .attr("x", 50)
	             .attr("y", function(d, i){
	             	return (135 + i * 25);
	             })
	             .style("font-family", "Lato")
	             .style("font-size", "15px")
	             .style("text-anchor", "start")
	             .style("text-align", "center")
	             .text(function(d, i){
	             	return countriesName[i];
	             });
};

/* functionn to draw the donut chart */
exportsVis.prototype.donutChart = function(){
	var width,
        height,
        margin = {top: 10, right: 10, bottom: 10, left: 10},
        // cDomain = [0,200,1000,2000,5000,10000,20000,30000,40000,50000],
        // cRange = ["#f2ccff","#e699ff","#d966ff","#cc33ff","#bf00ff","#9900cc","#8600b3","#730099","#600080","#4d0066"],
        // colorScale = d3.scaleQuantile().domain(cDomain).range(cRange),
        variable, 
        category, 
        //colored,
        padAngle, 
        floatFormat = d3.format(".4r"),
        cornerRadius,
        percentFormat = d3.format(",.2%");

    function chart(selection){
        selection.each(function(data) {
            var radius = Math.min(450, 450) / 2;
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
            var circlePer = selection.append("svg").attr("id","winePerChart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + (width / 2) + "," + (height / 2 + 45) + ")");
            circlePer.append("g").attr("class", "slices");
            console.log(data);
            var path = circlePer.select(".slices")
                .datum(data).selectAll("path")
                .data(pie)
                .enter()
                .append("path")
                .style("fill", function(d){
                	return d.data["color"];
                })
                .attr("d", arc);
            d3.selectAll(".slices path").call(toolTip);
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
                        .style("fill", function(d){
                        	return data.data["color"];
                        })
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
                    else tip += "<tspan x='0' dy='3.0em'>" + key + ": " + value + "</tspan>";
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

    // chart.colored = function(value) {
    //     if (!arguments.length) return colored;
    //     colored = value;
    //     return chart;
    // };

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
};

/* function to draw Aster plot */
exportsVis.prototype.asterPlotVis = function(data,factor,selectedCountry){
	var vis = this;
	var total = 0;
	//console.log(wineTradeData);
	vis.asterWidth = 680;
	vis.asterHeight = 600;
	vis.svgWidth = 500;
	vis.svgHeight= 500;
	vis.radius = 220; //.min(400, vis.svgHeight)/2;
	vis.innerRadius = 0.3 * vis.radius;
	vis.asterlenWidth = 160;
	vis.asterlenHeight = 500;
	var countriesName = ["France", "Australia", "US", "Spain", "Argentina", "Canada", "Italy"];
	var countriesColor = ["#E65C00", "#CD6596", "#897E7A", "#6D93C5", "#A6D8D1", "#FFBE36", "#43B59E"];

	vis.pie = d3.pie()
	            .sort(null)
	            .value(function(d){ return d.export;});

	data.forEach(function(d){
		d.country = d.country;
		d.color = d.color;
		d.export = +d.export;
		total = total + d.export;
	});

	vis.tip = d3.tip()
	            .attr("class", "d3_tip")
	            .offset([0,0])
	            .html(function(d){
	            	return d.data.country + ": <span style='color:orangered'>" +f(d.data.export)+ "</span>";
	            });

	vis.arc = d3.arc()
	            .innerRadius(vis.innerRadius)
	            .outerRadius(function(d){
	            	return (vis.radius - vis.innerRadius) * (d.data.export / factor) + vis.innerRadius;
	            });

	vis.outlineArc = d3.arc()
	                   .innerRadius(vis.innerRadius)
	                   .outerRadius(vis.radius);

	vis.asterSvg = d3.select("#asterView")
	                 .append("svg")
	                 .attr("id", "asterSvg")
	                 .attr("width", vis.svgWidth)
	                 .attr("height", vis.svgHeight);

	vis.asterTitle = vis.asterSvg.append("text")
	                     		.style("fill","#000")
	                     		.style("text-align","center")
	                     		.style("text-anchor","start")
	                     		.attr("class", "contentTitleStyle")
	                     		.append("tspan")
	                     		.attr("x",140)
	                     		.attr("y",20)
	                     		.text("Wine Export in 2017")
	                     		.append("tspan")
	                     		.attr("x",125)
	                     		.attr("y",40)
	                     		.style("font-famliy", "Arial")
	                     		.style("font-size", "10px")
	                     		.text("("+f(total)+" billions total for wine export in "+selectedCountry+")");

	vis.g = vis.asterSvg.append("g")
	                 	.attr("transform", "translate("+(vis.svgWidth/2 - 10)+","+(vis.svgHeight/2 + 30)+")");

	vis.g.call(vis.tip);

	vis.path = vis.g.selectAll(".solidArc")
	              .data(vis.pie(data))
	              .enter()
	              .append("path")
	              .attr("fill", function(d){
	              	return d.data.color;
	              })
	              .attr("class", "solidArc")
	              .attr("storke", "gray")
	              .attr("d", vis.arc);

	vis.outerPath = vis.g.selectAll(".outlineArc")
	                   .data(vis.pie(data))
	                   .enter()
	                   .append("path")
	                   .attr("fill", "none")
	                   .attr("stroke", "#dbd8d6")
	                   .attr("stroke-width",2)
	                   .attr("class", "outlineArc")
	                   .attr("d", vis.outlineArc);

	var mean = f(total / data.length);
	vis.g.append("text")
	            .attr("class", "aster-mean")
	            .style("line-height", 2)
	            .style("font-weight", "bold")
	            .style("font-size", "25px")
	            .attr("dy", ".15em")
	            .attr("text-anchor", "middle")
	            .append("tspan")
	            .attr("x", 0)
	            .attr("y", -10)
	            .text("Total")
	            .append("tspan")
	            .attr("x", 0)
	            .attr("y", 25)
	            .text(f(total));

	/* draw the legend of aster plot */
	vis.legendSvg = d3.select("#asterLegend")
	                  .append("svg")
	                  .attr("id", "asterlenSvg")
	                  .attr("width", vis.asterlenWidth)
	                  .attr("height", vis.asterlenHeight);
	                  //.attr("transform", "translate(10,80)");

	vis.gLen = vis.legendSvg.append("g")
	              .attr("transform", "translate(0,80)")

	/* draw the legend */
	vis.gLen.selectAll(".asterRect")
	             .data(countriesColor)
	             .enter()
	             .append("rect")
	             .attr("x", 5)
	             .attr("y", function(d, i){
	             	return (70 + i * 25);
	             })
	             .attr("width", 40)
	             .attr("height", 20)
	             .style("fill", function(d, i){
	             	return countriesColor[i];
	             });

	vis.gLen.selectAll(".asterText")
	             .data(countriesName)
	             .enter()
	             .append("text")
	             .attr("x", 50)
	             .attr("y", function(d, i){
	             	return (85 + i * 25);
	             })
	             .style("font-family", "Lato")
	             .style("font-size", "15px")
	             .style("text-anchor", "start")
	             .style("text-align", "center")
	             .text(function(d, i){
	             	return countriesName[i];
	             });
};