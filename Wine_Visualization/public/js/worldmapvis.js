/*
* worldMapVis - Object constructor function
* @param _parentElement 	-- the HTML element in which to draw the visualization
* @param _data						-- the actual data: countriesData
* @param _populationData		    -- the actual data: population
* @param _mapUSA          -- the data for drawing the usa map
*/

// var dataOfUSA;
// var regionDataOfUSA;
// var wineOfUSA;

worldMapVis = function(_parentElement, _data, _populationData) {
  this.parentElement = _parentElement;
  this.data = _data;
  this.population = _populationData;
  // this.mapUSA = _mapUSA;
  // this.usaRegion = _usaRegion;
  // this.usaWines = _usaWines
  // dataOfUSA = this.mapUSA;
  // regionDataOfUSA = this.usaRegion;
  // wineOfUSA = this.usaWines;
  this.initVis();
//console.log(this.data)
//console.log(this.population) 
}

/*global variables*/
var s = 1;
var rotated = 90;
var isClicked = false;
var mouse;
var xPos;


/* Initialize the visualization */

worldMapVis.prototype.initVis = function(){
  var vis = this;
  var format = d3.format(",");
  var populationById = {};

  var chartTitle = "<h2 class ='titleStyle'>Map of the Type of Wine Produced</h2>";
  $("#world_map").append(chartTitle);
  // $("#usa_map").hide();
  // $("#pr_charts").hide();
  /*the visualization title*/
  // vis.visTitle = d3.select("#worldTitle")
  //                  .append("svg")
  //                  .attr("id","textSvg")
  //                  .attr("width", 1200)
  //                  .attr("height", 60)
  //                  .append("g")
  //                  .attr("class", "gText")
  //                  .attr("transform", "translate(580,20)");

  // vis.visTitle.append("text")
  //             .attr("x", 100)
  //             .attr("y",30)
  //             .text("World Map Wine Visualization")
  //             .style("font-size", "30px")
  //             .style("text-anchor","start")
  //             .style("fill", "black")
  //             .style("font-weight", "bold");

 	/*set the tooltip*/
 	vis.tip = d3.tip()
 	            .attr("class", "d3-tooltip")
 	            .offset([-10, 0])
 	            .html(function(d){
 	            	return "<strong>Country: </strong><span style=\"color:white;\">" + d.properties.name + "<br></span>" + "<strong>Wine Types: </strong><span style=\"color:white;\">" + format(d.population) +"</span>";
 	            });

 	vis.margin = {top: 0, right: 0, bottom: 0, left: 0};
 	vis.width = 1000 - vis.margin.left - vis.margin.right;
  vis.height = 600 - vis.margin.top - vis.margin.bottom;
  vis.scalePart = 200; 

 	// vis.color = d3.scaleThreshold()
  //   			  .domain([10000,100000,500000,1000000,5000000,10000000,50000000,100000000,500000000,1500000000])
  //   			  .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]);

  //change a new color scale to fit the data
  //var colorDomain = [2,501,1001,2001,4001,8001,16001,32001,64001,128001];
  //var colorRange = ["#e0e0eb","#e699ff","#d966ff","#cc33ff","#bf00ff","#9900cc","#8600b3","#730099","#600080","#4d0066"]
  var colorDomain = [2,501,1001,2001,4001,8001,16001,32001];
  var colorRange = ["#e0e0eb","#e699ff","#d966ff","#cc33ff","#bf00ff","#9900cc","#8600b3","#730099"]
  vis.color = d3.scaleThreshold()
    			  .domain(colorDomain)
            .range(colorRange);
    			  //.range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]);
  /*implement zoom in/out*/
  // vis.zoom = d3.zoom()
  //              .scaleExtent([1, 10])
  //              .on("zoom", this.zoomed());
                // .on("end")

  //vis.path = d3.geoPath();
  vis.svg = d3.select("#world_map")
              .append("svg")
              .attr("id","mapSvg")
              .attr("width", vis.width)
              .attr("height", vis.height)
              .style("padding-left","30px")
              .style("padding-top","20px")
              // .style("display","block")
              // .style("margin", "auto")
              //.style("border", "1px solid black")
              .append("g")
              .attr("class", "map");
              // .on("wheel", function(){
              // 	xPos = d3.mouse(this)[0];
              // })
              // .on("mousedown", function(){
              // 	if (s !== 1) {
              // 		return;
              // 	}
              // 	xPos = d3.mouse(this)[0];
              // 	isClicked = true;
              // })
              // .call(vis.zoom);


  

  vis.projection = d3.geoMercator()
                      .scale(135)
                      .translate([(vis.width - vis.scalePart)/2.0, vis.height/1.5]);
                      //.rotate([rotated,0,0]); //center US

  vis.path = d3.geoPath()
                .projection(vis.projection);

  vis.svg.call(vis.tip);
  //console.log(vis.data);

  /*store the population data in the dictionary*/
  vis.population.forEach(function(d){
    populationById[d.id] = +d.population;
  });

  vis.data.features.forEach(function(d){
    d.population = populationById[d.id];
  });
  //console.log(vis.population);

  vis.g = vis.svg.append("g")
          .attr("class","countries")
          .selectAll("path")
          .data(vis.data.features)
          .enter()
          .append("path")
          .attr("d", vis.path)
          .style("fill", function(d){
            return vis.color(populationById[d.id]);
            // if (populationById[d.id] === 0) {
            //   return "#e0e0eb";
            // }else{
            //   return vis.color(populationById[d.id]);
            // }
          })
          .style("stroke", "white")
          .style("stroke-width", 1.5)
          .style("opacity", 0.8)
          .style("stroke", "white")
          .style("stroke-width", 0.3)
          .on("mouseover", function(d){
            vis.tip.show(d);
            d3.select(this)
                .style("opacity", 1)
                .style("stroke", "white")
                .style("stroke-width", 3);
          })
          .on("mouseout", function(d){
            vis.tip.hide(d);
            d3.select(this)
              .style("opacity", 0.8)
              .style("stroke", "white")
              .style("stroke-width", 0.3);
          });
          // .on("click", function(d){
          //   if("USA" == d.id) {
          //     d3.select(this)
          //     .style("opacity",1)
          //     .style("stroke","white")
          //     .style("stroke-width",3);
          //     drawUSAMap(d.id);
          //     vis.tip.hide(d);
          //   }
          // });

  vis.svg.append("path")
          .datum(topojson.mesh(vis.data.features, function(a, b){
            return a.id !== b.id;
          }))
          .attr("class", "countriesLines")
          .attr("d", vis.path);

  vis.scaleGroup = vis.svg.append("g")
                          .attr("id","world_map_scale");
  var colorBarRange =  vis.height / 2 / colorRange.length - 12;
  vis.scaleGroup.selectAll(".colorBar")
                .data(colorRange)
                .enter()
                .append("rect")
                .attr("class", "colorBar")
                .style("fill",function(d) {return d})
                .attr("x", vis.width - vis.scalePart + 40 + "px")
                .attr("y", function(d, i) {
                  return vis.height / 1.5 + i * (colorBarRange) + "px";
                })
                .attr("width","30px")
                .attr("height", function(d, i) {
                  return colorBarRange + "px";
                })
  vis.scaleGroup.selectAll(".colorText")
                .data(colorRange)
                .enter()
                .append("text")
                .attr("class", "colorText")
                .style("font-size","12px")
                .style("font-family","Titillium Web")
                .attr("x", vis.width - vis.scalePart + 75 + "px")
                .attr("y", function(d, i) {
                  return vis.height / 1.5 + (i + 0.8) * (colorBarRange) + "px";
                })
                .text(function(d,i){
                  if(i == 0) {
                    return "0"
                  } 
                  if(i == colorRange.length - 1){
                    return "more than " + (colorDomain[i - 1] - 1);
                  }
                  else {
                    return (colorDomain[i - 1] - 1)  + " to " + (colorDomain[i] - 1);
                  }
                  
                })
  
 }

 

 /*the function of zoomed*/
 worldMapVis.prototype.zoomed = function(){
 	var vis = this;
 	//console.log(d3.event.transform.x);
 	var t = [d3.event.transform.x,d3.event.transform.y];
 	s = d3.event.transform.k;
 	var h = 0;

 	t[0] = Math.min((vis.width/vis.height) * (s - 1), Math.max(vis.height * (1- s) - h * s, t[1]));
 	t[1] = Math.min(h * (s - 1) + h * s, Math.max(vis.height * (1 - s) - h * s, t[1]));

 	vis.g.attr("transform", "translate("+t+")scale("+s+")");

 	//adjust the stroke width based on zoom level
 	d3.selectAll(".countriesLines")
 	  .style("stroke-width", 1/s);

 	mouse = d3.mouse(this);
 	if (s===1 && isClicked) {
 		vis.projection.rotate([rotated + (mouse[0] - xPos) * 360 / (s * vis.width),0,0]);
 		vis.g.selectAll("path")
 		     .attr("d", vis.path);

 		return;
 	}
 };

 /* the function of drawing each country*/
function drawUSAMap(id){
  //  d3.select("#mapSvg").remove();
  //  d3.select("#textSvg").remove();
  //  d3.select(".d3-tooltip").remove();
  //  $("#world_map").hide();
  //  $("#world_charts").hide();
  //  $("#worldTitle").hide();
  //  $("#usa_map").show();
  //  $("#pr_charts").show();
  //  $("#usa_map").empty();
  //  $("#title").empty();
  //  $("#percentage_chart").empty();
  //  $("#ranking_chart").empty();
  //  var usaMap = new usaMapVis("usamapvis",id,dataOfUSA,regionDataOfUSA);
};

