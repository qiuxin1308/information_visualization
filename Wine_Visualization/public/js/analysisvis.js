var selectCountryIndex;

analysisVis = function(_parentElement) {
    this.parentElement = _parentElement;
    selectCountryIndex = 0;
    

	this.initVis();
}

analysisVis.prototype.initVis = function(){
    var vis = this;
    $("#top_selection").empty();
    var chartTitle = "<h2 class ='titleStyle'>Wine Analysis in Seven Countries</h2>";
    $("#top_selection").append(chartTitle);
    vis.margin = {top: 0, right: 0, bottom: 0, left: 0};
 	vis.width = 1200 - vis.margin.left - vis.margin.right;
    vis.height = 50 - vis.margin.top - vis.margin.bottom;

    vis.svg = d3.select("#top_selection")
              .append("svg")
              .attr("id","topSelectSvg")
              .attr("width", vis.width)
              .attr("height", vis.height);


    vis.buttonMargin = vis.width * 0.9 / country_name_list.length
    vis.buttonWidth = 0.8 * vis.buttonMargin;
    vis.updateSelection();

}               


analysisVis.prototype.updateSelection = function(){
    var vis = this;
    // console.log(selectCountryIndex)
    vis.buttons = vis.svg.selectAll("rect")
            .data(country_name_list);
    vis.buttons.enter()
            .append("rect")
            .attr("x", function(d, i){
                return i * vis.buttonMargin + 0.05 * vis.width - 30;
            })
            .attr("y", vis.height / 2 - 20)
            .attr("width", vis.buttonWidth)
            .attr("height",40 + "px")
            .attr("rx",20)
            .attr("ry",20)
            .style("fill", function(d, i){
                if (i === selectCountryIndex) {
                    return "#4F4F48";
                }else {
                    return "#BDC0BA";
                }
            })
            // .style("stroke",function(d,i){
            //     if (i == selectCountryIndex){
            //         return "#000";
            //     } else {
            //         return "#BDC0BA";
            //     }
            // })
            // .style("stroke-width", 3)
            .on("click",function(d,i){
                selectCountryIndex = i;
	          	vis.updateSelection();
            });
    vis.buttons.style("fill",function(d,i){
                    if (i == selectCountryIndex){
                        return "#4F4F48";
                    } else {
                        return "#BDC0BA";
                    }
                });
    vis.buttons.exit().remove();

    // vis.btnText = vis.svg.append("g").attr("id","topSelectionTextGroup")
    vis.btnText = vis.svg.selectAll(".btnText")
                .data(country_name_list)

    vis.btnText.enter()
                .append("text")
                .attr("class","btnText")
                .attr("x",function(d, i) {
                    return i * vis.buttonMargin + 0.05 * vis.width + 0.5 * vis.buttonWidth - 30;
                })
                .attr("y", vis.height / 2 + 6)
                .style("text-align","center")
                .style("text-anchor", "middle")
                .style("font-family", "Acme")
                .style("font-size","18px")
                .style("fill", "white")
                .text(function(d){
                    return d;
                })
                .on("click",function(d,i){
                    selectCountryIndex = i;
                    vis.updateSelection();
                });
    vis.btnText.exit().remove();
    $("#bubble_chart").empty();
    $("#analysis_button").empty();
    $("#analysisTitle").empty();
    $("#ranking_chart").empty();
    $("#ranking_title").empty();
    $("#percentage_chart").empty();
    $("#the_leftarrow").show();
    var bubbleChart = new bubbleVis("bubblevis");
    // $("#percentage_chart").empty();
    // $("#ranking_chart").empty();
    selectedState = "";
    var analysisButton = new analysisButtonVis("analysis",selectedState);

}
    