var mapMatrix = [["AK", "", "", "", "", "", "", "", "", "", "", "ME"],
                 ["", "", "", "", "", "", "", "", "", "", "VT", "NH"],
                 ["", "WA", "ID", "MT", "ND", "MN", "IL", "WI", "MI", "NY", "RI", "MA"],
                 ["", "OR", "NV", "WY", "SD", "IA", "IN", "OH", "PA", "NJ", "CT", ""],
                 ["", "CA", "UT", "CO", "NE", "MO", "KY", "WV", "VA", "MD", "DC", ""],
                 ["", "", "AZ", "NM", "KS", "AR", "TN", "NC", "SC", "DE", "", ""],
                 ["", "", "", "", "OK", "LA", "MS", "AL", "GA", "", "", ""],
                 ["", "HI", "", "", "TX", "", "", "", "", "FL", "", ""]];
var mapWidth = 900,  //780 12 * 65
    mapHeight = 600,  //480 8 * 60
    legendWidth = 800,
    legendHeight = 60;

var dataOfVote;
d3.select("#titles").style("padding-top","10px");

var voteLegend = d3.select("#legend")
                   .append("svg")
                   .attr("width", legendWidth)
                   .attr("height", legendHeight);

var voteMap = d3.select("#titles")
                .append("svg")
                .attr("width", mapWidth)
                .attr("height", mapHeight);
var domain_green = [-90,-80,-70,-60,-50,-40,-30,-20,-10,0,10,20,30,40,50,60];
var rangeGreen = ["#45AD6A","#64bc83","#9cedb8","#173c73", "#1b4f9a", "#4380b9", "#77acd4", "#a5c9e1", "#c9daee", "#f4bca3", "#f09775", "#ee7351", "#cf3e2b", "#9b2219", "#7c150c"];
var domain = [-60,-50,-40,-30,-20,-10,0,10,20,30,40,50,60];
var range = ["#173c73", "#1b4f9a", "#4380b9", "#77acd4", "#a5c9e1", "#c9daee", "#f4bca3", "#f09775", "#ee7351", "#cf3e2b", "#9b2219", "#7c150c"];
var colorScale = d3.scaleQuantile().domain(domain).range(range);
var colScale = d3.scaleLinear().range([10, mapWidth - 150]).domain([0, 11]);
var rowScale = d3.scaleLinear().range([10, mapHeight - 150]).domain([0, 7]);
var totalI = 0;
var text_Msg = d3.select("#titles").append("div").attr("class","d3-tip").style("opacity", 0).style("position", "absolute").style("padding-top","0px");
var format = d3.format(".1f");
var maxI = 0, sumI = 0;
var highlightedRects = {};

function TileChart(){
	updateTitleChart("1940");
}

function updateTitleChart(year){
	voteLegend.remove();
	voteMap.remove();
	totalI = 0;
	sumI = 0;
	voteLegend = d3.select("#legend").append("svg").attr("width", legendWidth).attr("height", legendHeight).style("padding-top", "15px");
	voteMap = d3.select("#titles").append("svg").attr("width", mapWidth).attr("height", mapHeight);
	d3.csv("data/election-results-"+year+".csv", function(error, csv){
		if(error) throw error;
		csv.forEach(function(d){
			d.I_Percentage = +d.I_Percentage;
			totalI = totalI + d.I_Percentage;
			d.D_Percentage = +d.D_Percentage;
			d.R_Percentage = +d.R_Percentage;
			d.D_Votes = +d.D_Votes;
			d.R_Votes = +d.R_Votes;
			d.I_Votes = +d.I_Votes;
			d.State = d.State;
			highlightedRects[d.State] = false;
		});
		dataOfVote = csv;
		updateMap(dataOfVote);
	});
}

//get the y position of the state
function getYPos(stateName){
	for(var i = 0; i < mapMatrix.length; i++){
		if(mapMatrix[i].includes(stateName)){
			return rowScale(i);
		}
	}
}

//get the x position of the state
function getXPos(stateName){
	for(var j = 0; j < mapMatrix[0].length; j++){
		for(var i = 0; i < mapMatrix.length; i++){
			if(mapMatrix[i][j].includes(stateName)){
				return colScale(j);
			}
		}
	}
}

//fill color of the state
function getFillColor(pa, pb, pc){
	if(pc === 0){
		var diff = pb - pa;
		return colorScale(diff);
	}else{
		if(pc > pa && pc > pb){
			return "#45AD6A";
		}else{
			var diff = pb - pa;
			return colorScale(diff);
		}
	}
}

//fill color opacity
function getOpacity(pa, pb, pc){
	if(pc === 0){
		return 1;
	}else{
		if(pc > pa && pc > pb){
			return pc / maxI;
		}else{
			return 1;
		}
	}
}

//mouse over
function getCurColor(pa, pb, pc){
	if(pc === 0){
		var differ = pb - pa;
		if(differ > 0){
			return "#de2d26";
		}else{
			return "#3182bd";
		}
	}else{
		if(pc > pa && pc > pb){
			return "#45AD6A";
		}else{
			if(differ > 0){
				return "#de2d26";
			}else{
				return "#3182bd";
			}
		}
	}
}

function updateMap(csvData){
	if(totalI === 0){
			var xPos = 50, index = 0, idx = 0, colorPos = 0;
			voteLegend.selectAll("rect")
			          .data(range)
			          .enter()
			          .append("rect")
			          .attr("x", function(){
			          	if(index === 0){
			          		index = index + 1;
			          		return xPos;
			          	}else{
			          		xPos = 50 + index * 57;
			          		index = index + 1;
			          		return xPos;
			          	}
			          })
			          .attr("y", 10)
			          .attr("width", 55)
			          .attr("height", 8)
			          .style("fill", function(){
			          	colorPos = idx;
			          	idx = idx + 1;
			          	return range[colorPos];
			          });
			var xText = 58, idxText = 0, textPos = 0, posIdx = 0;
			voteLegend.selectAll("text")
			          .data(domain)
			          .enter()
			          .append("text")
			          .attr("x", function(){
			          	if(idxText === 0){
			          		idxText = idxText + 1;
			          		return xText;
			          	}else{
			          		xText = 58 + idxText * 57;
			          		idxText = idxText + 1;
			          		return xText;
			          	}
			          })
			          .attr("y", 28)
			          .style("font-family", "Lato")
			          .style("text-align", "center")
			          .style("text-anchor", "start")
			          .style("font-size", "8px")
			          .text(function(){
			          	if(textPos < 11){
			          		textPos = posIdx;
			          		posIdx = posIdx + 1;
			          		return format(domain[textPos]) + " - " + format(domain[posIdx]);
			          	}
			          });
			voteMap.selectAll("rect")
		   	   	   .data(csvData)
		           .enter()
		   	       .append("rect")
		           .attr("x", function(d){return getXPos(d.Abbreviation);})
		           .attr("y", function(d){return getYPos(d.Abbreviation);})
		           .attr("width", 65)
		           .attr("height", 60)
		           .style("fill", function(d){return getFillColor(d.D_Percentage, d.R_Percentage, d.I_Percentage)})
		           .style("stroke", function(d){
		           	if (highlightedRects[d.State]) {
		           		return "#404040";
		           	}else{
		           		return "none";
		           	}
		           })
		           .style("stroke-width", function(d){
		           	if (highlightedRects[d.State]) {
		           		return 4;
		           	}else{
		           		return 0;
		           	}
		           })
		           .on("mouseover", function(d){
		           	 var c = getCurColor(d.D_Percentage, d.R_Percentage, d.I_Percentage);
		           	 text_Msg.transition().duration(500).style("opacity", 0.9);
		           	 text_Msg.style("width","200px").style("height", "80px");
		           	 text_Msg.html("<span style=\"color:"+c+";font-size: 12px;font-family: Arial black;\">"+d.State+"</span><br/>" + 
		           	 	           "<span style=\"color:black;font-size: 10px;font-family: Arial;\">Electoral Votes: "+d.Total_EV+"</span>" + 
		           	 	           "<ul style=\"padding-left: 10px;\"><li style=\"color: #3182bd;font-size:9px;font-family:Arial;\">"+d.D_Nominee+":"+d.D_Votes+"("+d.D_Percentage+"%)</li>" + 
		           	 	           "<li style=\"color: #de2d26;font-size:9px;font-family:Arial;\">"+d.R_Nominee+":"+d.R_Votes+"("+d.R_Percentage+"%)</li></ul>")
		           	         .style("left", (d3.event.pageX) + "px")
		           	         .style("top", (d3.event.pageY - 28) + "px");
		           })
		           .on("mouseout", function(){
		           	 text_Msg.transition().duration(500).style("opacity", 0);
		           });
			voteMap.selectAll("text")
		           .data(csvData)
		           .enter()
		           .append("text")
		           .attr("x", function(d){return getXPos(d.Abbreviation) + 20;})
		           .attr("y", function(d){return getYPos(d.Abbreviation) + 30;})
		           .style("font-family", "Lato")
		           .style("font-size", "15px")
		           .style("fill", "#535953")
		           .append("tspan")
		           .attr("x", function(d){return getXPos(d.Abbreviation) + 20;})
		           .attr("y", function(d){return getYPos(d.Abbreviation) + 30;})
		           .text(function(d){return d.Abbreviation;})
		           .on("mouseover", function(d){
		           	 var c = getCurColor(d.D_Percentage, d.R_Percentage, d.I_Percentage);
		           	 text_Msg.transition().duration(500).style("opacity", 0.9);
		           	 text_Msg.style("width","200px").style("height", "80px");
		           	 text_Msg.html("<span style=\"color:"+c+";font-size: 12px;font-family: Arial black;\">"+d.State+"</span><br/>" + 
		           	 	           "<span style=\"color:black;font-size: 10px;font-family: Arial;\">Electoral Votes: "+d.Total_EV+"</span>" + 
		           	 	           "<ul style=\"padding-left: 10px;\"><li style=\"color: #3182bd;font-size:9px;font-family:Arial;\">"+d.D_Nominee+":"+d.D_Votes+"("+d.D_Percentage+"%)</li>" + 
		           	 	           "<li style=\"color: #de2d26;font-size:9px;font-family:Arial;\">"+d.R_Nominee+":"+d.R_Votes+"("+d.R_Percentage+"%)</li></ul>")
		           	         .style("left", (d3.event.pageX) + "px")
		           	         .style("top", (d3.event.pageY - 28) + "px");
		           })
		           .on("mouseout", function(){
		           	 text_Msg.transition().duration(500).style("opacity", 0);
		           })
		           .append("tspan")
		           .attr("x", function(d){
		       	     if(d.Total_EV < 10){
		       	  		return getXPos(d.Abbreviation) + 25;
		       	  	 }else{
		       	  		return getXPos(d.Abbreviation) + 20;
		       	     }
		           })
		           .attr("y", function(d){return getYPos(d.Abbreviation) + 50;})
		           .text(function(d){return d.Total_EV;})
		           .on("mouseover", function(d){
		           	 var c = getCurColor(d.D_Percentage, d.R_Percentage, d.I_Percentage);
		           	 text_Msg.transition().duration(500).style("opacity", 0.9);
		           	 text_Msg.style("width","200px").style("height", "80px");
		           	 text_Msg.html("<span style=\"color:"+c+";font-size: 12px;font-family: Arial black;\">"+d.State+"</span><br/>" + 
		           	 	           "<span style=\"color:black;font-size: 10px;font-family: Arial;\">Electoral Votes: "+d.Total_EV+"</span>" + 
		           	 	           "<ul style=\"padding-left: 10px;\"><li style=\"color: #3182bd;font-size:9px;font-family:Arial;\">"+d.D_Nominee+":"+d.D_Votes+"("+d.D_Percentage+"%)</li>" + 
		           	 	           "<li style=\"color: #de2d26;font-size:9px;font-family:Arial;\">"+d.R_Nominee+":"+d.R_Votes+"("+d.R_Percentage+"%)</li></ul>")
		           	         .style("left", (d3.event.pageX) + "px")
		           	         .style("top", (d3.event.pageY - 28) + "px");
		           })
		           .on("mouseout", function(){
		           	 text_Msg.transition().duration(500).style("opacity", 0);
		           });
		}else{
			sumI = 0;
			maxI = d3.max(csvData,function(d){return d.I_Percentage;});
			var isIWon = csvData.filter(function(d){
				if(d.I_Votes > d.R_Votes && d.I_Votes > d.D_Votes){
					sumI = sumI + 1;
				}
				return (d.I_Votes > d.D_Votes && d.I_Votes > d.D_Votes);
			});
			if(sumI > 0){
				var xPos = 40, index = 0, idx = 0, colorPos = 0;
				voteLegend.selectAll("rect")
			          .data(rangeGreen)
			          .enter()
			          .append("rect")
			          .attr("x", function(){
			          	if(index === 0){
			          		index = index + 1;
			          		return xPos;
			          	}else{
			          		xPos = 40 + index * 46;
			          		index = index + 1;
			          		return xPos;
			          	}
			          })
			          .attr("y", 10)
			          .attr("width", 45)
			          .attr("height", 8)
			          .style("fill", function(){
			          	colorPos = idx;
			          	idx = idx + 1;
			          	return rangeGreen[colorPos];
			          });
				var xText = 44, idxText = 0, textPos = 0, posIdx = 0;
				voteLegend.selectAll("text")
			          .data(domain_green)
			          .enter()
			          .append("text")
			          .attr("x", function(){
			          	if(idxText === 0){
			          		idxText = idxText + 1;
			          		return xText;
			          	}else{
			          		xText = 44 + idxText * 46;
			          		idxText = idxText + 1;
			          		return xText;
			          	}
			          })
			          .attr("y", 28)
			          .style("font-family", "Lato")
			          .style("text-align", "center")
			          .style("text-anchor", "start")
			          .style("font-size", "8px")
			          .text(function(){
			          	if(textPos < 14){
			          		textPos = posIdx;
			          		posIdx = posIdx + 1;
			          		return format(domain_green[textPos]) + "-" + format(domain_green[posIdx]);
			          	}
			          });
				voteMap.selectAll("rect")
				       .data(csvData)
				       .enter()
				       .append("rect")
				       .attr("x", function(d){return getXPos(d.Abbreviation);})
				       .attr("y", function(d){return getYPos(d.Abbreviation);})
				       .attr("width", 65)
				       .attr("height", 60)
				       .style("fill", function(d){return getFillColor(d.D_Percentage, d.R_Percentage, d.I_Percentage);})
				       .style("opacity", function(d){return getOpacity(d.D_Percentage, d.R_Percentage, d.I_Percentage);})
				       .style("stroke", function(d){
		           			if (highlightedRects[d.State]) {
		           				return "#404040";
		           			}else{
		           				return "none";
		           			}
		           		})
		           	   .style("stroke-width", function(d){
		           			if (highlightedRects[d.State]) {
		           				return 4;
		           			}else{
		           				return 0;
		           			}
		           	   })
				       .on("mouseover", function(d){
				       		var c = getCurColor(d.D_Percentage, d.R_Percentage, d.I_Percentage);
		           	 		text_Msg.transition().duration(500).style("opacity", 0.9);
		           	 		text_Msg.style("width","200px").style("height", "80px");
		           	 		text_Msg.html("<span style=\"color:"+c+";font-size: 12px;font-family: Arial black;\">"+d.State+"</span><br/>" + 
		           	 	           		  "<span style=\"color:black;font-size: 10px;font-family: Arial;\">Electoral Votes: "+d.Total_EV+"</span>" + 
		           	 	                  "<ul style=\"padding-left: 10px;\"><li style=\"color: #45AD6A;font-size:9px;font-family:Arial;\">"+d.I_Nominee+":"+d.I_Votes+"("+d.I_Percentage+"%)</li>" +
		           	 	                  "<li style=\"color: #3182bd;font-size:9px;font-family:Arial;\">"+d.D_Nominee+":"+d.D_Votes+"("+d.D_Percentage+"%)</li>" + 
		           	 	                  "<li style=\"color: #de2d26;font-size:9px;font-family:Arial;\">"+d.R_Nominee+":"+d.R_Votes+"("+d.R_Percentage+"%)</li></ul>")
		           	         		.style("left", (d3.event.pageX) + "px")
		           	         		.style("top", (d3.event.pageY - 28) + "px");
				       })
				       .on("mouseout", function(d){
				       	    text_Msg.transition().duration(500).style("opacity", 0);
				       });
				voteMap.selectAll("text")
				       .data(csvData)
				       .enter()
				       .append("text")
				       .attr("x", function(d){return getXPos(d.Abbreviation) + 20;})
				       .attr("y", function(d){return getYPos(d.Abbreviation) + 30;})
				       .style("font-family", "Lato")
		               .style("font-size", "15px")
		               .style("fill", "#535953")
		               .append("tspan")
		               .attr("x", function(d){return getXPos(d.Abbreviation) + 20;})
		               .attr("y", function(d){return getYPos(d.Abbreviation) + 30;})
		               .text(function(d){return d.Abbreviation;})
		               .on("mouseover", function(d){
				       		var c = getCurColor(d.D_Percentage, d.R_Percentage, d.I_Percentage);
		           	 		text_Msg.transition().duration(500).style("opacity", 0.9);
		           	 		text_Msg.style("width","200px").style("height", "80px");
		           	 		text_Msg.html("<span style=\"color:"+c+";font-size: 12px;font-family: Arial black;\">"+d.State+"</span><br/>" + 
		           	 	           		  "<span style=\"color:black;font-size: 10px;font-family: Arial;\">Electoral Votes: "+d.Total_EV+"</span>" + 
		           	 	                  "<ul style=\"padding-left: 10px;\"><li style=\"color: #45AD6A;font-size:9px;font-family:Arial;\">"+d.I_Nominee+":"+d.I_Votes+"("+d.I_Percentage+"%)</li>" +
		           	 	                  "<li style=\"color: #3182bd;font-size:9px;font-family:Arial;\">"+d.D_Nominee+":"+d.D_Votes+"("+d.D_Percentage+"%)</li>" + 
		           	 	                  "<li style=\"color: #de2d26;font-size:9px;font-family:Arial;\">"+d.R_Nominee+":"+d.R_Votes+"("+d.R_Percentage+"%)</li></ul>")
		           	         		.style("left", (d3.event.pageX) + "px")
		           	         		.style("top", (d3.event.pageY - 28) + "px");
				       })
				       .on("mouseout", function(d){
				       	    text_Msg.transition().duration(500).style("opacity", 0);
				       })
		               .append("tspan")
		               .attr("x", function(d){
		       	     		if(d.Total_EV < 10){
		       	  				return getXPos(d.Abbreviation) + 25;
		       	  	 		}else{
		       	  				return getXPos(d.Abbreviation) + 20;
		       	     		}
		           		})
		               .attr("y", function(d){return getYPos(d.Abbreviation) + 50;})
		               .text(function(d){return d.Total_EV;})
		               .on("mouseover", function(d){
				       		var c = getCurColor(d.D_Percentage, d.R_Percentage, d.I_Percentage);
		           	 		text_Msg.transition().duration(500).style("opacity", 0.9);
		           	 		text_Msg.style("width","200px").style("height", "80px");
		           	 		text_Msg.html("<span style=\"color:"+c+";font-size: 12px;font-family: Arial black;\">"+d.State+"</span><br/>" + 
		           	 	           		  "<span style=\"color:black;font-size: 10px;font-family: Arial;\">Electoral Votes: "+d.Total_EV+"</span>" + 
		           	 	                  "<ul style=\"padding-left: 10px;\"><li style=\"color: #45AD6A;font-size:9px;font-family:Arial;\">"+d.I_Nominee+":"+d.I_Votes+"("+d.I_Percentage+"%)</li>" +
		           	 	                  "<li style=\"color: #3182bd;font-size:9px;font-family:Arial;\">"+d.D_Nominee+":"+d.D_Votes+"("+d.D_Percentage+"%)</li>" + 
		           	 	                  "<li style=\"color: #de2d26;font-size:9px;font-family:Arial;\">"+d.R_Nominee+":"+d.R_Votes+"("+d.R_Percentage+"%)</li></ul>")
		           	         		.style("left", (d3.event.pageX) + "px")
		           	         		.style("top", (d3.event.pageY - 28) + "px");
				       })
				       .on("mouseout", function(d){
				       	    text_Msg.transition().duration(500).style("opacity", 0);
				       });
			}else{
				var xPos = 50, index = 0, idx = 0, colorPos = 0;
				voteLegend.selectAll("rect")
			          	  .data(range)
			              .enter()
			              .append("rect")
			              .attr("x", function(){
			          		if(index === 0){
			          			index = index + 1;
			          			return xPos;
			          		}else{
			          			xPos = 50 + index * 57;
			          			index = index + 1;
			          			return xPos;
			          		}
			          	  })
			              .attr("y", 10)
			              .attr("width", 55)
			              .attr("height", 8)
			              .style("fill", function(){
			          		colorPos = idx;
			          		idx = idx + 1;
			          		return range[colorPos];
			          	  });
			    var xText = 58, idxText = 0, textPos = 0, posIdx = 0;
				voteLegend.selectAll("text")
			          .data(domain)
			          .enter()
			          .append("text")
			          .attr("x", function(){
			          	if(idxText === 0){
			          		idxText = idxText + 1;
			          		return xText;
			          	}else{
			          		xText = 58 + idxText * 57;
			          		idxText = idxText + 1;
			          		return xText;
			          	}
			          })
			          .attr("y", 28)
			          .style("font-family", "Lato")
			          .style("text-align", "center")
			          .style("text-anchor", "start")
			          .style("font-size", "8px")
			          .text(function(){
			          	if(textPos < 11){
			          		textPos = posIdx;
			          		posIdx = posIdx + 1;
			          		return format(domain[textPos]) + " - " + format(domain[posIdx]);
			          	}
			          });
				voteMap.selectAll("rect")
		   	   	   	   .data(csvData)
		               .enter()
		   	           .append("rect")
		               .attr("x", function(d){return getXPos(d.Abbreviation);})
		               .attr("y", function(d){return getYPos(d.Abbreviation);})
		               .attr("width", 65)
		               .attr("height", 60)
		               .style("fill", function(d){return getFillColor(d.D_Percentage, d.R_Percentage,d.I_Percentage)})
		               .style("stroke", function(d){
		           			if (highlightedRects[d.State]) {
		           				return "#404040";
		           			}else{
		           				return "none";
		           			}
		           	   	})
		           	   .style("stroke-width", function(d){
		           			if (highlightedRects[d.State]) {
		           				return 4;
		           			}else{
		           				return 0;
		           			}
		           		})
		               .on("mouseover", function(d){
		           	 		var c = getCurColor(d.D_Percentage, d.R_Percentage, d.I_Percentage);
		           	 		text_Msg.transition().duration(500).style("opacity", 0.9);
		           	 		text_Msg.style("width","200px").style("height", "80px");
		           	 		text_Msg.html("<span style=\"color:"+c+";font-size: 12px;font-family: Arial black;\">"+d.State+"</span><br/>" + 
		           	 	           		  "<span style=\"color:black;font-size: 10px;font-family: Arial;\">Electoral Votes: "+d.Total_EV+"</span>" + 
		           	 	                  "<ul style=\"padding-left: 10px;\"><li style=\"color: #45AD6A;font-size:9px;font-family:Arial;\">"+d.I_Nominee+":"+d.I_Votes+"("+d.I_Percentage+"%)</li>" +
		           	 	                  "<li style=\"color: #3182bd;font-size:9px;font-family:Arial;\">"+d.D_Nominee+":"+d.D_Votes+"("+d.D_Percentage+"%)</li>" + 
		           	 	                  "<li style=\"color: #de2d26;font-size:9px;font-family:Arial;\">"+d.R_Nominee+":"+d.R_Votes+"("+d.R_Percentage+"%)</li></ul>")
		           	         	    .style("left", (d3.event.pageX) + "px")
		           	                .style("top", (d3.event.pageY - 28) + "px");
		           			})
		               .on("mouseout", function(){
		           	 		text_Msg.transition().duration(500).style("opacity", 0);
		           		});
				voteMap.selectAll("text")
		               .data(csvData)
		               .enter()
		               .append("text")
		               .attr("x", function(d){return getXPos(d.Abbreviation) + 20;})
		               .attr("y", function(d){return getYPos(d.Abbreviation) + 30;})
		               .style("font-family", "Lato")
		               .style("font-size", "15px")
		               .style("fill", "#535953")
		               .append("tspan")
		               .attr("x", function(d){return getXPos(d.Abbreviation) + 20;})
		               .attr("y", function(d){return getYPos(d.Abbreviation) + 30;})
		               .text(function(d){return d.Abbreviation;})
		               .on("mouseover", function(d){
		           	 		var c = getCurColor(d.D_Percentage, d.R_Percentage, d.I_Percentage);
		           	 		text_Msg.transition().duration(500).style("opacity", 0.9);
		           	 		text_Msg.style("width","200px").style("height", "80px");
		           	 		text_Msg.html("<span style=\"color:"+c+";font-size: 12px;font-family: Arial black;\">"+d.State+"</span><br/>" + 
		           	 	           		  "<span style=\"color:black;font-size: 10px;font-family: Arial;\">Electoral Votes: "+d.Total_EV+"</span>" + 
		           	 	                  "<ul style=\"padding-left: 10px;\"><li style=\"color: #45AD6A;font-size:9px;font-family:Arial;\">"+d.I_Nominee+":"+d.I_Votes+"("+d.I_Percentage+"%)</li>" +
		           	 	                  "<li style=\"color: #3182bd;font-size:9px;font-family:Arial;\">"+d.D_Nominee+":"+d.D_Votes+"("+d.D_Percentage+"%)</li>" + 
		           	 	                  "<li style=\"color: #de2d26;font-size:9px;font-family:Arial;\">"+d.R_Nominee+":"+d.R_Votes+"("+d.R_Percentage+"%)</li></ul>")
		           	                .style("left", (d3.event.pageX) + "px")
		           	                .style("top", (d3.event.pageY - 28) + "px");
		           		})
		           	   .on("mouseout", function(){
		           	 		text_Msg.transition().duration(500).style("opacity", 0);
		           		})
		               .append("tspan")
		               .attr("x", function(d){
		       	     		if(d.Total_EV < 10){
		       	  				return getXPos(d.Abbreviation) + 25;
		       	  	 		}else{
		       	  				return getXPos(d.Abbreviation) + 20;
		       	     		}
		           		})
		               .attr("y", function(d){return getYPos(d.Abbreviation) + 50;})
		               .text(function(d){return d.Total_EV;})
		               .on("mouseover", function(d){
		           	 		var c = getCurColor(d.D_Percentage, d.R_Percentage, d.I_Percentage);
		           	 		text_Msg.transition().duration(500).style("opacity", 0.9);
		           		 	text_Msg.style("width","200px").style("height", "80px");
		           	 		text_Msg.html("<span style=\"color:"+c+";font-size: 12px;font-family: Arial black;\">"+d.State+"</span><br/>" + 
		           	 	                  "<span style=\"color:black;font-size: 10px;font-family: Arial;\">Electoral Votes: "+d.Total_EV+"</span>" + 
		           	 	                  "<ul style=\"padding-left: 10px;\"><li style=\"color: #45AD6A;font-size:9px;font-family:Arial;\">"+d.I_Nominee+":"+d.I_Votes+"("+d.I_Percentage+"%)</li>" +
		           	 	                  "<li style=\"color: #3182bd;font-size:9px;font-family:Arial;\">"+d.D_Nominee+":"+d.D_Votes+"("+d.D_Percentage+"%)</li>" + 
		           	 	                  "<li style=\"color: #de2d26;font-size:9px;font-family:Arial;\">"+d.R_Nominee+":"+d.R_Votes+"("+d.R_Percentage+"%)</li></ul>")
		           	                .style("left", (d3.event.pageX) + "px")
		           	                .style("top", (d3.event.pageY - 28) + "px");
		           		})
		           	   .on("mouseout", function(){
		           	 		text_Msg.transition().duration(500).style("opacity", 0);
		                });
			}
		}
}

function updateFilter(brushDomain, selectedYear){
	dataOfVote.forEach(function(d){
		highlightedRects[d.State] = false;
	});
	brushDomain.forEach(function(d){
		highlightedRects[d.State] = true;
	});
	voteLegend.remove();
	voteMap.remove();
	totalI = 0;
	sumI = 0;
	voteLegend = d3.select("#legend").append("svg").attr("width", legendWidth).attr("height", legendHeight).style("padding-top", "15px");
	voteMap = d3.select("#titles").append("svg").attr("width", mapWidth).attr("height", mapHeight);
	d3.csv("data/election-results-"+selectedYear+".csv", function(error, csv){
		if(error) throw error;
		csv.forEach(function(d){
			d.I_Percentage = +d.I_Percentage;
			totalI = totalI + d.I_Percentage;
			d.D_Percentage = +d.D_Percentage;
			d.R_Percentage = +d.R_Percentage;
			d.D_Votes = +d.D_Votes;
			d.R_Votes = +d.R_Votes;
			d.I_Votes = +d.I_Votes;
		});
		updateMap(dataOfVote);
	});
	//updateMap(dataOfVote)
	// console.log(highlightedRects);
}
