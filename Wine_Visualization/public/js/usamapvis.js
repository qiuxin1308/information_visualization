/*
* usaMapVis - Object constructor function
* @param _parentElement 	-- the HTML element in which to draw the visualization
* @param _theId 	-- the id of a specific country
* @param _mapUSA          -- the data for drawing the usa map
*/

/*global variable*/
var dataOfStates;
var dataOfRegion;
var maxFreq = 0;
var curOpacity = 0;
var stateName = "", stateAbbr = "", tempStateName = "",stateWineNum = 0;
//color scale for 1-99
var minDomain = [1,50,99];
var rangeMin = ["#f9e6ff","#f2ccff","#ecb3ff"];
var minColorScale = d3.scaleQuantile().domain(minDomain).range(rangeMin);
//color scale for 100-800
var mediDomain = [100,500,800];
var rangeMedi = ["#e699ff","#df80ff","#d966ff"];
var mediColorScale = d3.scaleQuantile().domain(mediDomain).range(rangeMedi);
//color scale for 2000-9000
var maxDomain = [2000,5500,9000];
var rangeMax = ["#d24dff","#cc33ff","#c61aff"];
var maxColorScale = d3.scaleQuantile().domain(maxDomain).range(rangeMax);

usaMapVis = function(_parentElement, _theId, _mapUSA, _regionDataOfUSA) {
	this.parentElement = _parentElement;
	this.theId = _theId;
	this.mapUSA = _mapUSA;
  this.regionDataOfUSA = _regionDataOfUSA;
  dataOfStates = this.mapUSA.objects.states.geometries;
  dataOfRegion = this.regionDataOfUSA;
	this.initVis();
}

/*initialize the usa country map*/
usaMapVis.prototype.initVis = function(){
  var vis = this;

	vis.margin = {top: 0, right: 0, bottom: 0, left: 0};
 	vis.width = 1200 - vis.margin.left - vis.margin.right;
 	vis.height = 800 - vis.margin.top - vis.margin.bottom;

  countMaxFreq(); // to get the max freq
  $("#title").empty();
  /*the title of the usa map*/
  vis.visTitle = d3.select("#title")
                   .append("svg")
                   .attr("id","textSvg")
                   .attr("width", 1200)
                   .attr("height", 60)
                   .append("g")
                   .attr("class", "gText")
                   .attr("transform", "translate(580,20)");

  vis.visTitle.append("text")
              .attr("x", 100)
              .attr("y",30)
              .text("USA Map Wine Visualization")
              .style("font-size", "30px")
              .style("text-anchor","start")
              .style("fill", "black")
              .style("font-weight", "bold");

  /*tooltip of the state name*/
  vis.tooltip = d3.select("#usa_map")
                  .append("div")
                  .attr("id","usatip")
                  .attr("class","tooltip")
                  .style("opacity",0)
                  .style("position","absolute");

  //draw the usa map
 	vis.svg = d3.select("#usa_map")
              // .append("div")
              // .attr("id","svgDiv")
              .append("svg")
              .attr("id","usaMapSvg")
              .attr("width", vis.width)
              .attr("height", vis.height)
              .style("display","block")
              .style("margin", "auto")
              //.style("border", "1px solid black")
              .append("g")
              .attr("class", "map")
              .attr("transform","translate(100,20)");

  vis.projection = d3.geoAlbersUsa()
                     .scale(1000)
                     .translate([200, 100]);
              // .scale([1000])
              // .translate([vis.width/2.0, vis.height/1.5]);
              
  vis.path = d3.geoPath();
               //.projection(vis.projection);

  vis.svg.append("g")
           .selectAll("path")
           .data(topojson.feature(vis.mapUSA, vis.mapUSA.objects.states).features)
           .enter()
           .append("path")
           .style("fill",function(d){
             getStateName(d.id);
             //getOpacity(stateName);
             return getColor(stateName);
             // if(curOpacity === 0){
             //  return "#e0e0eb";
             // }else {
             //   return "#9900cc";
             // }
           })
           // .style("opacity", function(d){
           //   getStateName(d.id);
           //   getOpacity(stateName);
           //   if (curOpacity === 0) {
           //    return 0.8;
           //   }else{
           //    return curOpacity;
           //   }
           // })
           .attr("d",vis.path)
           .on("mouseover", function(d){
           	 d3.select(this)
           	   .style("fill","#373C38");
            //call function to get state name
             getStateName(d.id);
             getstateWineNum();
             vis.tooltip.transition()
                        .duration(500)
                        .style("opacity",0.9)
                        .style("width","180px")
                        .style("height","50px");
             vis.tooltip
            //  .html("<strong>Country: </strong><span style=\"color:white;\">"+stateName+"</span>")
            .html( "<strong>Country: </strong><span style=\"color:white;\">" + stateName + "<br></span>" + "<strong>Wine Total: </strong><span style=\"color:white;\">" + stateWineNum +"</span>")
                        .style("left", (d3.event.pageX)+"px")
                        .style("right", (d3.event.pageY-28)+"px");
           })
           .on("mouseout", function(d){
           	d3.select(this)
           	  .style("fill",function(d){
                getStateName(d.id);
                //getOpacity(stateName);
                return getColor(stateName);
                // if(curOpacity === 0){
                //   return "#e0e0eb";
                // }else {
                //   return "#9900cc";
                // }
              });
              // .style("opacity", function(d){
              //   getStateName(d.id);
              //   getOpacity(stateName);
              //   if(curOpacity === 0){
              //     return 0.8;
              //   }else{
              //     return curOpacity;
              //   }
              // });
            vis.tooltip.transition()
                       .duration(500)
                       .style("opacity",0);
           })
           .on("click",function(d){
              getStateName(d.id);
              //console.log(stateName);
              //visForUSA(d.id);
              drawingRankingGraph(d.id);
              drawingPercentageChart(d.id);
           })
           ;

    vis.svg.append("path")
           .style("fill","none")
           .style("stroke","white")
           .style("storke-width",2)
           .style("stroke-linejoin","round")
           .style("stroke-linecap","round")
           .style("pointer-events","none")
           .attr("d", vis.path(topojson.mesh(vis.mapUSA, vis.mapUSA.objects.states, function(a, b){
           	  return a !== b;
           })));

    d3.select("#usaMapSvg").append("rect")
    .attr("fill","#e0e0eb")
    .attr("width","120px")
    .attr("height","40px")
    .attr("x",0)
    .attr("y",0)
    .on("click", backToWorldMap);

    d3.select("#usaMapSvg").append("text")
    .attr("id","#backButtonText")
    .attr("fill","black")
    .attr("x",10)
    .attr("y",20)
    .text("back to world")
    .on("click", backToWorldMap);
};

/* back to world map */
function backToWorldMap(){
  $("#world_map").show();
  $("#world_charts").show();
  $("#worldTitle").show();
  $("#usa_map").hide();
  $("#pr_charts").hide();
  $("#title").empty();
}

/* the function to get each state name and abbreviation*/
function getStateName(id){
  for(var i = 0; i < dataOfStates.length; i++){
    if(dataOfStates[i].id === id){
      stateName = dataOfStates[i].name;
      stateAbbr = dataOfStates[i].abbreviation;
    }
  } 
}

function getstateWineNum(){
  stateWineNum = 0;
  for(var i = 0; i < dataOfRegion.length;i++){
    if(dataOfRegion[i].State == stateName) {
      stateWineNum =  dataOfRegion[i].freq;
      break;
    }
  }
}


/*visualization for the usa wine*/
// function visForUSA(id) {
//    d3.select("#usaMapSvg").remove();
//    d3.select("#textSvg").remove();
//    d3.select("#usatip").remove();
// }

/*to count the total sum of the freq*/
function countMaxFreq() {
  for(var i = 0; i < dataOfRegion.length; i++){
    if (i === 0) {
      maxFreq = parseFloat(dataOfRegion[i].freq)
    }else{
      var temp = parseFloat(dataOfRegion[i].freq)
      if (temp > maxFreq) {
        maxFreq = temp;
      }
    }
  }
}

/*highlight the different based on freq*/
function getOpacity(name) {
  var i = 0;
  var idx = 0;
  var flag = false;
  while(i < dataOfRegion.length){
    if (name === dataOfRegion[i].State) {
      idx = i;
      flag = true;
      break;
    }
    i += 1;
    flag = false;
  }
  if (flag) {
    curOpacity = parseFloat(dataOfRegion[idx].freq)/maxFreq;
    //console.log(curOpacity);
  }else{
    curOpacity = 0;
  }
}

/*to color different range*/
function getColor(name){
  var i = 0;
  var index = 0;
  var exist = false;
  while(i < dataOfRegion.length){
    if (name === dataOfRegion[i].State) {
      index = i;
      exist = true;
      break;
    }
    i += 1;
    exist = false;
  }
  if(exist){
    var curFreq = parseFloat(dataOfRegion[index].freq);
    if (curFreq > 0 && curFreq < 100) {
      return minColorScale(curFreq);
    }else if (curFreq >= 100 && curFreq < 800) {
      return mediColorScale(curFreq);
    }else if (curFreq >2000 && curFreq < 9000) {
      return maxColorScale(curFreq);
    }else if(curFreq > 30000){
      return "#730099";
    }
  }else{
    return "#e0e0eb";
  }
}

/*visualization for ranking chart*/
function drawingRankingGraph(id){
  d3.select("#rankingSvg").remove();
  var stateRanking = new rankingVis("ranking",stateName);
}

/*visualization for percentage chart*/
function drawingPercentageChart(id) {
  d3.select("#percentageSvg").remove();
  var statePercentage = [];
  wineOfUSA.forEach(function(d){
    if (d.province === stateName) {
      statePercentage.push({
        state: d.province,
        price: d.price,
        points: d.points
      });
    }
  });
  var percentage = new percentageVis("percentagevis", stateName, statePercentage);
}