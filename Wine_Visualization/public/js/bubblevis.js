var selectedState = "";

bubbleVis = function(_parentElement, _selectedState) {
    this.parentElement = _parentElement;
    this.countryName = country_name_list[selectCountryIndex];
    this.region = wineInfo[selectCountryIndex].region.map(function(d){
        return {
            State: d.State,
            freq: +d.freq,
            meanScore: +d.mean_score,
            meanPrice: +d.mean_price,
            meanValue: +d.mean_value
        }
    });
    this.selectedState = _selectedState;
    // console.log(this.region);
    this.dataset = {
        "children":this.region
    }
    // console.log(this.dataset);
    this.wines = wineInfo[selectCountryIndex].wines;
	this.initVis();
}


bubbleVis.prototype.initVis = function() {
    var vis = this
    vis.format = d3.format(",.2f");

    var chartTitle = "";
    switch(selectedButtonIndex) {
        case 0:
            vis.titleState = vis.region.sort(function(a,b) {return b.meanScore - a.meanScore})[0].State;
            chartTitle = "<h2 class ='contentTitleStyle'><span style=\'color:red;font-family:Montserrat;\'>" + vis.titleState + "</span> has <span style=\'text-decoration:underline;\'>the highest average-score</span> of wine in " + vis.countryName + "</h2>";
            break;
        case 1:
            vis.titleState = vis.region.sort(function(a,b) {return b.meanPrice - a.meanPrice})[0].State;
            chartTitle = "<h2 class ='contentTitleStyle'><span style=\'color:red;font-family:Montserrat;\'>" + vis.titleState + "</span> has <span style=\'text-decoration:underline;\'>the highest average-price</span> of wine in " + vis.countryName + "</h2>";
            break;
        case 2:
            vis.titleState = vis.region.sort(function(a,b) {return b.meanValue - a.meanValue})[0].State;
            chartTitle = "<h2 class ='contentTitleStyle'><span style=\'color:red;font-family:Montserrat;\'>" + vis.titleState + "</span> has <span style=\'text-decoration:underline;\'>the best average-value</span> of wine in " + vis.countryName + "</h2>";
            break;
    } 

    
    
    $("#analysisTitle").append(chartTitle);
    vis.margin = {top: 0, right: 0, bottom: 0, left: 0};
 	vis.width = 500 - vis.margin.left - vis.margin.right;
    vis.height = 450 - vis.margin.top - vis.margin.bottom;
    vis.diameter = 430;
    vis.bubbleScale = d3.scaleLinear().domain([80,100]).range([0,600]);
    vis.color = d3.scaleOrdinal(d3.schemeCategory20);
    vis.bubble = d3.pack(vis.region)
                .size([vis.diameter,vis.diameter])
                .padding(1.5);
    
    vis.svg = d3.select("#bubble_chart")
                .append("svg")
                .attr("id","bubbleSvg")
                .attr("width", vis.width)
                .attr("height", vis.height)
                .style("display","block")
                .style("margin", "auto")
                .append("g")
                .attr("id","bubbleGroup");
    
    // vis.defs = vis.svg.append("defs");
    // vis.filter = vis.defs.append("filter")
    //     .attr("id", "drop-shadow")
    //     .attr("height", "130%");
    // vis.filter.append("feGaussianBlur")
    //     .attr("in", "SourceAlpha")
    //     .attr("stdDeviation", 1)
    //     .attr("result", "blur");
    // vis.filter.append("feOffset")
    //     .attr("in", "blur")
    //     .attr("dx", 1)
    //     .attr("dy", 1)
    //     .attr("result", "offsetBlur");
    // vis.feMerge = vis.filter.append("feMerge");
    // vis.feMerge.append("feMergeNode")
    //     .attr("in", "offsetBlur")
    // vis.feMerge.append("feMergeNode")
    //     .attr("in", "SourceGraphic");
            
    vis.nodes = d3.hierarchy(vis.dataset)
                .sum(function(d) { 
                    switch(selectedButtonIndex) {
                        case 0:
                            return vis.bubbleScale(d.meanScore);
                        case 1:
                            return d.meanPrice;
                        case 2:
                            return d.meanValue;
                    }});
    
    vis.bubble(vis.nodes);
    vis.node = vis.svg.selectAll(".node")
                .data(vis.nodes.children)
                .enter()
                .append("g")
                .attr("class","node")
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

    vis.node.append("circle")
        .attr("r", function(d){
            return d.r
        })
        .style("fill", function(d,i){
            return vis.color(i);
        })
        .style("stroke", function(d){
            if(d.data.State == vis.selectedState) {
                return "black";
            } else {
                return "none";
            }
        })
        .style("stroke-width", "3px")
        // .style("filter", "url(#drop-shadow)")
        .on("click", function(d){
            vis.selectedState = d.data.State;
            vis.updateSelection(); 
            drawingPercentageChart(vis.wines, vis.selectedState);
            drawingRankingGraph(vis.wines, vis.selectedState);
        });

    vis.node.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.State.substring(0,d.r/3);
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", function(d){
            return d.r/4;
        })
        .attr("fill", "white")
        .on("click", function(d){
            vis.selectedState = d.data.State; 
            vis.updateSelection(); 
            drawingPercentageChart(vis.wines, vis.selectedState);
            drawingRankingGraph(vis.wines, vis.selectedState);
        });

    vis.node.append("text")
        .attr("dy", "1.3em")
        .style("text-anchor", "middle")
        .text(function(d) {
            switch(selectedButtonIndex) {
                case 0:
                    return vis.format(d.data.meanScore);
                case 1:
                    return vis.format(d.data.meanPrice);
                case 2:
                    return vis.format(d.data.meanValue);
            }          
        })
        .attr("font-family",  "Gill Sans", "Gill Sans MT")
        .attr("font-size", function(d){
            return d.r/4;
        })
        .attr("fill", "white")
        .on("click", function(d){
            vis.selectedState = d.data.State;
            vis.updateSelection(); 
            drawingPercentageChart(vis.wines, vis.selectedState);
            drawingRankingGraph(vis.wines, vis.selectedState);
        });
    vis.node.exit().remove();


    // d3.select(self.frameElement)
    //     .style("height", vis.diameter + "px");

    // vis.svg.append("text")
    //     .attr("id","warning")
    //     .attr("x", 250)
    //     .attr("y",420)
    //     .style("text-anchor", "middle")
    //     .style("text-align", "center")
    //     .text("Click the bubble to get the detail information of the State")
}

bubbleVis.prototype.updateSelection = function(){
    $("#bubbleGroup").empty();
    var vis = this;
    selectedState = vis.selectedState;
    vis.node = vis.svg.selectAll(".node")
    .data(vis.nodes.children)
    .enter()
    .append("g")
    .attr("class","node")
    .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
    });
    // add drop shadow
    // vis.defs = vis.svg.append("defs");
    // vis.filter = vis.defs.append("filter")
    //     .attr("id", "drop-shadow")
    //     .attr("height", "130%");
    // vis.filter.append("feGaussianBlur")
    //     .attr("in", "SourceAlpha")
    //     .attr("stdDeviation", 1)
    //     .attr("result", "blur");
    // vis.filter.append("feOffset")
    //     .attr("in", "blur")
    //     .attr("dx", 1)
    //     .attr("dy", 1)
    //     .attr("result", "offsetBlur");
    // vis.feMerge = vis.filter.append("feMerge");
    // vis.feMerge.append("feMergeNode")
    //     .attr("in", "offsetBlur")
    // vis.feMerge.append("feMergeNode")
    //     .attr("in", "SourceGraphic");

    //draw bubble
    vis.node.append("circle")
        .attr("r", function(d){
            return d.r
        })
        .style("fill", function(d,i){
            return vis.color(i);
        })
        .style("stroke", function(d){
            if(d.data.State == vis.selectedState) {
                return "black";
            } else {
                return "none";
            }
        })
        .style("stroke-width", "3px")
        // .style("filter", "url(#drop-shadow)")
        .on("click", function(d){
            vis.selectedState = d.data.State;
            vis.updateSelection(); 
            drawingPercentageChart(vis.wines, vis.selectedState);
            drawingRankingGraph(vis.wines, vis.selectedState);
        });

    vis.node.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.State.substring(0,d.r/3);
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", function(d){
            return d.r/4;
        })
        .attr("fill", "white")
        .on("click", function(d){
            vis.selectedState = d.data.State; 
            vis.updateSelection(); 
            drawingPercentageChart(vis.wines, vis.selectedState);
            drawingRankingGraph(vis.wines, vis.selectedState);
        });

    vis.node.append("text")
        .attr("dy", "1.3em")
        .style("text-anchor", "middle")
        .text(function(d) {
            switch(selectedButtonIndex) {
                case 0:
                    return vis.format(d.data.meanScore);
                case 1:
                    return vis.format(d.data.meanPrice);
                case 2:
                    return vis.format(d.data.meanValue);
            }
            
        })
        .attr("font-family",  "Gill Sans", "Gill Sans MT")
        .attr("font-size", function(d){
            return d.r/4;
        })
        .attr("fill", "white")
        .on("click", function(d){
            vis.selectedState = d.data.State;
            vis.updateSelection(); 
            drawingPercentageChart(vis.wines, vis.selectedState);
            drawingRankingGraph(vis.wines, vis.selectedState);
        });
    vis.node.exit().remove();
    
}



function drawingPercentageChart(wines, stateName) {
    d3.select("#percentageSvg").remove();
    $("#the_leftarrow").hide();
    var statePercentage = [];
    wines.forEach(function(d){
        if (d.province === stateName) {
            statePercentage.push({
                state: d.province,
                price: +d.price,
                points: +d.points,
                count: 1
            });
        }
    });
    // console.log(statePercentage);
    var percentage = new percentageVis("percentagevis", stateName, statePercentage);
}

function drawingRankingGraph(wines, stateName){
    stateWines = [];
    $("#the_leftarrow").hide();
    wines.forEach(function(d){
        if(d.province == stateName) {
            stateWines.push({
                title: d.title,
                price: d.price,
                points: d.points
            });
        };
    });
    var stateRanking = new rankingVis("ranking",stateWines,stateName,isExpensive);
  }