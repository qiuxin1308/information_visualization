var stateWines = [];
var barHeight = 25;
var barMargin = 35
var rankNumber = 3;
var rankChartMargin = {top: 0, right: 0, bottom: 0, left: 0};
var rankChartWidth = 600 - rankChartMargin.left - rankChartMargin.right;
var rankChartHeight = 100 + (barHeight + barMargin) * rankNumber;
var isExpensive = true;
var leftPadding = 50;

rankingVis = function(_parentElement, _stateWines, _theName,_isExpensive) {
	this.parentElement = _parentElement;
    this.theName = _theName;
    this.WinesofState = _stateWines;
    isExpensive = _isExpensive;
    stateWines = this.WinesofState;
    this.initVis();
    
}

rankingVis.prototype.initVis = function(){
    var vis = this;
    //add titile 
    $("#ranking_chart").empty();
    var chartTitle = "<h2 class ='contentTitleStyle'>Top 3 high-quality Wine in " + vis.theName + "</h2>";
    $("#ranking_title").empty();
    $("#ranking_title").append(chartTitle);

    
 	vis.width = rankChartWidth
    vis.height = rankChartHeight;
    vis.svg = d3.select("#ranking_chart")
              // .append("div")
              // .attr("id","svgDiv")
              .append("svg")
              .attr("id","rankingSvg")
              .attr("width", vis.width)
              .attr("height", vis.height)
              .append("g")
              .attr("class", "rankingSvgGroup");
            //   .attr("transform","translate(0,0)");
    
    // tip text
    // d3.select("#rankingSvg")
    //     .append("text")
    //     .attr("x",50)
    //     .attr("y",20)
    //     .text("Click the Button to choose different Top 10 Rank List");
    
    vis.buttons = ["Highest Score", "Most Expensive", "Cheapest","Best Value"]
    
    vis.buttonScale = d3.scaleLinear()
                      .domain([0,vis.buttons.length])
                      .range([0,vis.width - 100])
    
   vis.rankNoList = [1,2,3]
   vis.rankNoGroup = vis.svg.append("g").attr("id","rankNoGroup");
//    .attr("transform","translate(0,20)");
   vis.rankNoBar = vis.rankNoGroup.selectAll(".rankNoBar")
   .data(vis.rankNoList)
   .enter()
   .append("rect")
   .attr("class","rankNoBar")
   .attr("width", 40)
   .attr("height",40)
   .attr("y",function(d,i){
       return 40 + 60 * i + "px";
   })
   .attr("x",leftPadding /2 -20)
   .attr("fill",function(d,i){
        switch(i){
            case 0:
                return "#ffff80";
            case 1:
                return "#a3a3c2";
            case 2:
                return "#ff6633";
            default:
                return "#e5f2ff";
        }
   })

   vis.rankNoBar = vis.rankNoGroup.selectAll(".rankNoText")
   .data(vis.rankNoList)
   .enter()
   .append("text")
   .attr("class","rankNoText")
   .attr("y",function(d,i){
       return 65 + 60 * i + "px";
   })
   .attr("x",leftPadding /2)
   .attr("fill",function(d,i){
       if (i == 0){
           return "#ff4d4d";
       }else {
           return "white";
       }
   })
   .style("font-size","25px")
   .style("text-anchor","middle")
   .style("text-align","center")
   .text(function(d){
       return d;
   })

   vis.updateSelection();
   vis.getRanking("",selectedButtonIndex);
    
}

rankingVis.prototype.updateSelection = function(){
    var vis = this;
    $("#ranking_title").empty();
    var chartTitle  = ""
    switch(selectedButtonIndex) {
        case 0:
            // d3.select("#best_value_text").remove();
            chartTitle = "<h2 class ='contentTitleStyle'>Top 3 high-quality Wine in " + vis.theName + "</h2>";
            break;
        case 1:
            if(isExpensive){
                chartTitle = "<h2 class ='contentTitleStyle'>Top 3 Expensive Wine in " + vis.theName + "</h2>";
            }else {
                chartTitle = "<h2 class ='contentTitleStyle'>Top 3 Cheap Wine in " + vis.theName + "</h2>";
            }
            // d3.select("#best_value_text").remove();
            
            break;
        case 2:
            // d3.select("#best_value_text").remove();
            chartTitle = "<h2 class ='contentTitleStyle'>Top 3 best value Wine in " + vis.theName + "</h2>";
            break;
        // case 3:
        //     chartTitle = "<h2 class ='contentTitleStyle'>Top 10 best value Wine in " + vis.theName + "</h2> ";
        //     break;
    }
    
    $("#ranking_title").append(chartTitle);

    vis.rankingGroup = vis.svg.append("g")
    .attr("id", "rankingGroup");
    // vis.buttonsBar = vis.rankingGroup
    //     .selectAll("rect")
    //     .data(vis.buttons);

    // vis.buttonsBar.enter()
    //     .append("rect")
    //     .attr("class","button")
    //     .attr("fill",function(d, i){
    //         if (i == selectedButtonIndex){
    //             return "#4f4f48";
    //         } else {
    //             return "#BDC0BA";
    //         }
    //     })
    //     .attr("x", function(d,i){return  vis.buttonScale(i)})
    //     .attr("y", 0)
    //     // .style("stroke-width", 3)
    //     .attr("width", 0.7 * vis.width / vis.buttons.length)
    //     .attr("height", 30)
    //     .on("click",function(d,i){
    //         selectedButtonIndex = i;
    //         vis.updateSelection();
    //     });
    // vis.buttonsBar.attr("fill",function(d, i){
    //     if (i == selectedButtonIndex){
    //         return "#4f4f48";
    //     } else {
    //         return "#BDC0BA";
    //     }
    // });
    // vis.buttonsBar.exit().remove();

    // vis.buttonText = vis.svg.append("g")
    // .selectAll(".buttonText")
    // .data(vis.buttons);

    // vis.buttonText.enter()
    // .append("text")
    // .attr("class","buttonText")
    // .attr("fill","white")
    // .attr("x", function(d,i){return vis.buttonScale(i) + .7 * vis.width / vis.buttons.length / 2})
    // .attr("y", 20)
    // .text(function(d){return d;})
    // .on("click",function(d,i){
    //     selectedButtonIndex = i;
    //     vis.updateSelection();
    // });
    // vis.buttonText.exit().remove();
}

rankingVis.prototype.getRanking = function(data, index){
    var vis = this;
    d3.select("#bars").remove();
    count = d3.min([stateWines.length,3]);

    // console.log(count);
    if (count == 0) return;

    //initialize the vis
    
    var rightPadding = 100;
    var topPadding = 50;
    var x = d3.scaleLinear().range([0,rankChartWidth - rightPadding - leftPadding]);
    var y = d3.scaleOrdinal().domain(d3.range(1,11)).range([0,rankChartHeight - topPadding]);
    //get ranking data
    var rankingData = [];
    if(index == 0){
        stateWines.sort(function(a,b) {return d3.descending(a.points, b.points)});
        x.domain([0,100]);
        for(var j = 0; j < count;j++){
            rankingData.push({
                title: stateWines[j].title,
                rank: +stateWines[j].points,
                rankName: stateWines[j].points + "/100"
            });
        }
        // console.log(rankingData);

    }
    if(index == 1) {
        vis.createPriceButton();
        if(isExpensive){
            stateWines.sort(function(a,b) {return d3.descending(a.price, b.price)});
        }else {
            stateWines.sort(function(a,b) {return d3.ascending(a.price, b.price)});
        }
        
        // console.log(stateWines);
        x.domain([0, stateWines[0].price]);
        for(var j = 0; j < count;j++){
            rankingData.push({
                title: stateWines[j].title,
                rank: +stateWines[j].price,
                rankName: "$" + stateWines[j].price
            });
        }
        // console.log(rankingData);
    } 
    // if(index == 2) {
    //     stateWines.sort(function(a,b) {return d3.ascending(a.price, b.price)});
    //     // console.log(stateWines);
    //     x.domain([0,stateWines[stateWines.length - 1].price]);
    //     for(var j = 0; j < count;j++){
    //         rankingData.push({
    //             title: stateWines[j].title,
    //             rank: +stateWines[j].price,
    //             rankName: "$" + stateWines[j].price
    //         });
    //     }
    //     // console.log(rankingData);
    // } 
    if(index == 2) {
        stateWines.sort(function(a,b) {return d3.descending(a.points/ a.price, b.points/ b.price)});
        // console.log(stateWines);
        var start = 0;
        var end = (stateWines[0].points / stateWines[0].price).toFixed(2);
        x.domain([start,end]);
        for(var j = 0; j < count;j++){
            rankingData.push({
                title: stateWines[j].title,
                rank: +(stateWines[j].points / stateWines[j].price).toFixed(2),
                rankName:+(stateWines[j].points / stateWines[j].price).toFixed(2)
            });
        }
    }
    // console.log(rankingData);

    var bar = d3.select("#rankingGroup").append("g")
    .attr("id", "bars")
    // .attr("fill","url(#gradient)");
    
    bar.selectAll(".album")
        .data(rankingData)
        .enter()
        .append("rect")
        .attr("class","album")
        .attr("fill","#a8b1d7")
        .attr("width",function(d){
        return x(d.rank);
        })
        .attr("height", barHeight * 0.8)
        .attr("x", leftPadding)
        .attr("y", function(d,i){
            return  40 + i * (barHeight + barMargin);
        });
    barText = bar.append("g")
                .selectAll(".barTitle")
                .data(rankingData)
                .enter()
                .append("text")
                .attr("class","barTitle")
                .attr("fill","grey")
                .attr("x", leftPadding)
                .attr("y", function(d, i){
                    return 40 + i * (barHeight + barMargin) + barHeight + 15;
                })
                .text(function(d){return d.title;});
    barScore = bar.append("g")
                  .selectAll(".barScore")
                  .data(rankingData)
                  .enter()
                  .append("text")
                  .attr("class", "barScore")
                  .attr("fill", "grey")
                  .attr("x", function(d) {
                      return leftPadding + x(d.rank) + 2;
                  })
                  .attr("y", function(d, i){
                    return 40 + i * (barHeight + barMargin) + 15;
                  })
                  .text(function(d) {
                      return d.rankName;
                  })
}
rankingVis.prototype.createPriceButton = function(){
    var vis = this;
    var priceButton = d3.select("#rankingGroup")
        .append("rect")
        .attr("x", 50)
        .attr("y", 0)
        .attr("width", 150)
        .attr("height",30)
        .attr("rx",15)
        .attr("ry",15)
        .attr("fill","#BDC0BA")
        .on("click",function(d){
            isExpensive = !isExpensive;
            vis.updateSelection();
            vis.getRanking("",selectedButtonIndex);
        });

    var priceButton = d3.select("#rankingGroup")
        .append("text")
        .attr("x", 125)
        .attr("y", 20)
        .style("text-align","center")
        .style("text-anchor","middle")
        .style("font-family","Acme")
        .style("font-weight","bold")
        .attr("fill","#4f4f48")
        .attr("fill","white")
        .text(function(d){
            return "Switch Price Rank";
        })
        .on("click",function(d){
            isExpensive = !isExpensive;
            vis.updateSelection();
            vis.getRanking("",selectedButtonIndex);
        });
}