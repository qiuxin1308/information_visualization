var selectedButtonIndex = 0;
analysisButtonVis = function(_parentElement) {
    this.parentElement = _parentElement;
    selectedButtonIndex = 0;
	this.initVis();
}

analysisButtonVis.prototype.initVis = function(){
    var vis = this;
    vis.margin = {top: 0, right: 0, bottom: 0, left: 0};
    vis.width = 459 - vis.margin.left - vis.margin.right;
    vis.height = 50 - vis.margin.top - vis.margin.bottom;
    this.wines = wineInfo[selectCountryIndex].wines;

    vis.svg = d3.select("#analysis_button")
             .append("svg")
             .attr("id","analysisButtonSvg")
             .attr("width", vis.width)
             .attr("height", vis.height);
    
    vis.buttonList = ["Score", "Price", "Value"];
    vis.buttonScale = d3.scaleLinear()
                      .domain([0,vis.buttonList.length])
                      .range([20,vis.width - 20])
    vis.buttons = vis.svg.selectAll("rect").data(vis.buttonList);
    vis.updateSelection();
    // vis.buttons.enter()
    //     .append("rect")
    //     .attr("x", function(d,i){return  vis.buttonScale(i) + 25;})
    //     .attr("y", vis.height / 2 - 20)
    //     .attr("width", 0.7 * vis.width / vis.buttonList.length)
    //     .attr("height",40 + "px")
    //     .attr("rx",20)
    //     .attr("ry",20)
    //     .attr("fill",function(d, i){
    //         if (i == selectedButtonIndex){
    //             return "#4f4f48";
    //         } else {
    //             return "#BDC0BA";
    //         }
    //     })
    //     .on("click",function(d,i){
    //         selectedButtonIndex = i;
    //         vis.updateSelection();
    //         vis.UpdateCharts();
    //     });

    // vis.buttons.exit().remove();

    // vis.buttonText = vis.svg.append("g")
    // .selectAll(".buttonText")
    // .data(vis.buttonList);

    // vis.buttonText.enter()
    // .append("text")
    // .attr("class","buttonText")
    // .attr("fill","white")
    // .attr("x", function(d,i){return vis.buttonScale(i) + 80;})
    // .attr("y", 30)
    // .style("font-family","Acme")
    // .style("font-weight","bold")
    // .text(function(d){return d;})
    // .on("click",function(d,i){
    //     selectedButtonIndex = i;
    //     vis.updateSelection();
    //     vis.UpdateCharts();
    // });
    // vis.buttonText.exit().remove();

}

analysisButtonVis.prototype.updateSelection = function(){
    var vis = this;
    $("#analysisButtonSvg").empty();
    vis.buttons.enter()
        .append("rect")
        .attr("x", function(d,i){return  vis.buttonScale(i) + 25;})
        .attr("y", vis.height / 2 - 20)
        .attr("width", 0.7 * vis.width / vis.buttonList.length)
        .attr("height",40 + "px")
        .attr("rx",20)
        .attr("ry",20)
        .attr("fill",function(d, i){
            if (i == selectedButtonIndex){
                return "#4f4f48";
            } else {
                return "#BDC0BA";
            }
        })
        .on("click",function(d,i){
            selectedButtonIndex = i;
            vis.updateSelection();
            vis.UpdateCharts();
        });
    vis.buttonText = vis.svg.append("g")
    .selectAll(".buttonText")
    .data(vis.buttonList);

    vis.buttonText.enter()
    .append("text")
    .attr("class","buttonText")
    .attr("fill","white")
    .attr("x", function(d,i){return vis.buttonScale(i) + 80;})
    .attr("y", 30)
    .style("font-family","Acme")
    .style("font-weight","bold")
    .text(function(d){return d;})
    .on("click",function(d,i){
        selectedButtonIndex = i;
        vis.updateSelection();
        vis.UpdateCharts();
    });
    vis.buttonText.exit().remove();
}

analysisButtonVis.prototype.UpdateCharts = function(data, index){
    var vis = this;
    //update bubble chart
    $("#analysisTitle").empty();
    $("#bubble_chart").empty();
    var bubbleChart = new bubbleVis("bubblevis",selectedState);
    if(selectedState !== ""){
        
        $("#ranking_chart").empty();
        d3.select("#percentageSvg").remove();
        var stateRanking = new rankingVis("ranking",stateWines,selectedState,true);
        drawingPercentageChart(vis.wines, selectedState);
    }
}