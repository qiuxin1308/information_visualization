var data,updateData;
var width = 900,
    height = 70;
var total_I = 0,
    totalSumEv = 0;

var electoralSvg = d3.select("#electoral-vote")
                     .append("svg")
                     .attr("width", width)
                     .attr("height", height);

var rects = electoralSvg.append("svg")
                        .attr("width", width)
                        .attr("height", height);
var rects_I = rects.append("svg")
                   .attr("id","rectI");
var rects_D = rects.append("svg")
                   .attr("id","rectD");
var rects_R = rects.append("svg")
                   .attr("id", "rectR");
var midLine = rects.append("svg").attr("id","midLine");
//var brushList = d3.select("#brushedStates").append("ul").attr("id", "listOfStates").style("list-style-type","disc");
var brushList = d3.select("#brushedStates").append("svg").attr("id","listOfStates").attr("width",300).attr("height",900);
var gBrush = rects.append("g").attr("class", "brush");
var domain = [-60,-50,-40,-30,-20,-10,0,10,20,30,40,50,60];
var range = ["#173c73", "#1b4f9a", "#4380b9", "#77acd4", "#a5c9e1", "#c9daee", "#f4bca3", "#f09775", "#ee7351", "#cf3e2b", "#9b2219", "#7c150c"];
var colorScale = d3.scaleQuantile().domain(domain).range(range);
var brush;
var brushDomain = [];
var selectedYear;
var dataOfLastYear = [];
var formatData = d3.format(".1f");
var msgTag = d3.select("#brushedStates").append("div").attr("class","d3-tip").style("opacity",0).style("position","absolute");

function ElectoralVoteChart(shiftChart){
	//show the default electoral vote chart
	updateEVCYear("1940");
}

function updateEVCYear(year){
	selectedYear = year;
	rects_I.remove();
	rects_D.remove();
	rects_R.remove();
	midLine.remove();
	gBrush.remove();
	totalSumEv = 0;
	total_I = 0;
	rects_I = rects.append("svg").attr("id","rectI");
	rects_D = rects.append("svg").attr("id","rectD");
	rects_R = rects.append("svg").attr("id","rectD");
	midLine = rects.append("svg").attr("id","midLine");
	gBrush = rects.append("g").attr("class", "brush");
	d3.select("#listOfStates").remove();
	d3.csv("data/election-results-"+year+".csv", function(error, csv){
		if(error) throw error;
		csv.forEach(function(d, i){
			d.Total_EV = +d.Total_EV;
			d.D_Votes = +d.D_Votes;
			d.R_Votes = +d.R_Votes;
			d.I_Votes = +d.I_Votes;
			d.D_Percentage = +d.D_Percentage;
			d.R_Percentage = +d.R_Percentage;
			d.I_Percentage = +d.I_Percentage;
			totalSumEv = totalSumEv + d.Total_EV;
			total_I = total_I + d.I_Votes;
			d.State = d.State;
			d.Abbreviation = d.Abbreviation;
		});
		updateData = csv;
		var cnt = 10,
		    x_w = 10,
		    totalD = 0,
		    totalR = 0,
		    totalI = 0;
		brushDomain = [];
		console.log(updateData);
		if(total_I === 0){
			var data_D = updateData.filter(function(d){
				if(d.D_Percentage > d.R_Percentage){
					totalD = totalD + d.Total_EV;
				}
				return d.D_Percentage > d.R_Percentage;
			});
			//console.log(data_D);
			data_D.sort(function(a,b){return (b.D_Percentage - b.R_Percentage) - (a.D_Percentage - a.R_Percentage);});
			rects_D.append("text")
			       .attr("x", x_w)
			       .attr("y", 20)
			       .style("text-anchor", "start")
			       .style("font-family", "Arvo")
			       .style("font-size", "12px")
			       .style("fill", "#3182bd")
			       .text(totalD);
			    //#0667ad
			rects_D.selectAll("rect")
			       .data(data_D)
			       .enter()
			       .append("rect")
			       .attr("x", function(d, i){
			       	if(i === 0){
			       		cnt = cnt + d.Total_EV / totalSumEv * 800;
			       		brushDomain.push({x_w: x_w,n_w: cnt,State: d.State,Abbreviation: d.Abbreviation,Total_EV: d.Total_EV,D_Percentage: d.D_Percentage,R_Percentage:d.R_Percentage,I_Percentage:d.I_Percentage,D_Nominee:d.D_Nominee,R_Nominee:d.R_Nominee,I_Nominee:d.I_Nominee});
			       		return x_w;
			       	}else{
			       		x_w = cnt;
			       		cnt = cnt + d.Total_EV / totalSumEv * 800;
			       		brushDomain.push({x_w: x_w,n_w: cnt,State: d.State,Abbreviation: d.Abbreviation,Total_EV: d.Total_EV,D_Percentage: d.D_Percentage,R_Percentage:d.R_Percentage,I_Percentage:d.I_Percentage,D_Nominee:d.D_Nominee,R_Nominee:d.R_Nominee,I_Nominee:d.I_Nominee});
			       		return x_w;
			       	}
			       })
			       .attr("y", 30)
			       .attr("width", function(d){return d.Total_EV / totalSumEv * 800;})
			       .attr("height", "20px")
			       .style("fill", function(d){return fillVotesColor(d.D_Percentage, d.R_Percentage);})
			       //.style("opacity", function(d){return d.D_Percentage / d3.max(data_D, function(d){return d.D_Percentage;});})
			       .style("stroke","#eee")
			       .style("stroke-width",1);
			rects_D.exit().remove();
			var data_R = updateData.filter(function(d){
				if(d.R_Percentage > d.D_Percentage){
					totalR = totalR + d.Total_EV;
				}
				return d.R_Percentage > d.D_Percentage;
			});
			data_R.sort(function(a, b){return (a.R_Percentage - a.D_Percentage) - (b.R_Percentage - b.D_Percentage);});
			rects_R.selectAll("rect")
			       .data(data_R)
			       .enter()
			       .append("rect")
			       .attr("x", function(d){
			       	 x_w = cnt;
			       	 //brushDomain.push({x_w: x_w,State: d.State,Abbreviation: d.Abbreviation,Total_EV: d.Total_EV,D_Percentage: d.D_Percentage,R_Percentage:d.R_Percentage,I_Percentage:d.I_Percentage,D_Nominee:d.D_Nominee,R_Nominee:d.R_Nominee,I_Nominee:d.I_Nominee});
			       	 cnt = cnt + d.Total_EV / totalSumEv * 800;
			       	 brushDomain.push({x_w: x_w,n_w: cnt,State: d.State,Abbreviation: d.Abbreviation,Total_EV: d.Total_EV,D_Percentage: d.D_Percentage,R_Percentage:d.R_Percentage,I_Percentage:d.I_Percentage,D_Nominee:d.D_Nominee,R_Nominee:d.R_Nominee,I_Nominee:d.I_Nominee});
			       	 return x_w;
			       })
			       .attr("y", 30)
			       .attr("width", function(d){return d.Total_EV / totalSumEv * 800;})
			       .attr("height", "20px")
			       .style("fill", function(d){return fillVotesColor(d.D_Percentage, d.R_Percentage);})
			       //.style("opacity", function(d){return d.R_Percentage / d3.max(data_R, function(d){return d.R_Percentage;});})
			       .style("stroke", "#eee")
			       .style("stroke-width", 1);
			//#ed5338
			rects_R.append("text")
			       .attr("x", cnt)
			       .attr("y", 20)
			       .style("text-anchor","end")
			       .style("font-family","Arvo")
			       .style("font-size","12px")
			       .style("fill","#de2d26")
			       .text(totalR);
			rects_R.exit().remove();
			midLine.append("text")
			       .attr("x", cnt / 2 - 50)
			       .attr("y", 15)
			       .style("font-family","Lato")
			       .style("font-size", "10px")
			       .style("fill", "black")
			       .text("Electoral Vote (270 needed to win)");
			midLine.append("line")
			       .attr("x1", cnt / 2)
			       .attr("y1", 26)
			       .attr("x2", cnt / 2)
			       .attr("y2", 54)
			       .style("stroke", "black")
			       .style("stroke-width", 2);
			brush = d3.brushX()
			          .extent([[10, 28], [cnt, 52]])
			          .on("start brush end", function(){
			          	var s = d3.event.selection;
			          	if(s != null){
			          		var s1 = s[0], s2 = s[1];
			          		brushList.remove();
							//brushList = d3.select("#brushedStates").append("ul").attr("id", "listOfStates").style("padding-left","5px");
							brushList = d3.select("#brushedStates").append("svg").attr("id","listOfStates").attr("width",300).attr("height",900);
							var filterData = brushDomain.filter(function(d){
								return (s1 <= d.n_w && s2 >= d.x_w) || (s1 >= d.x_w && s2 <= d.n_w);
							});
							//console.log(filterData);
							if(filterData.length > 0){
								var filterShift = filterShiftBrushData(dataOfLastYear, filterData);
								//console.log(filterShift);
								var cmpData = compareShift(filterShift, filterData);
								var cs = brushList.selectAll("circle")
								                  .data(cmpData)
								                  .enter()
								                  .append("circle")
								                  .attr("r",2)
								                  .attr("cx",5)
								                  .attr("cy",function(d,i){return (i * 20 + 18);})
								                  .style("fill","black");
								var bText = brushList.selectAll("text")
								                     .data(cmpData)
								                     .enter()
								                     .append("text")
								                     .attr("x",10)
								                     .attr("y", function(d,i){return (i * 20 + 22);})
								                     .style("font-size","12px")
								                     .style("font-family","Lato")
								                     .style("fill","black")
								                     .text(function(d){return d.State;});
								var shiftLine = brushList.selectAll("line")
								                         .data(cmpData)
								                         .enter();
								var dashLine = shiftLine.append("line")
								                         .attr("x1",100)
								                         .attr("x2",280)
								                         .attr("y1", function(d, i){return (i * 20 + 18);})
								                         .attr("y2", function(d, i){return (i * 20 + 18);})
								                         .style("stroke-dasharray",("4,4"))
								                         .style("stroke","gray")
								                         .style("stroke-width",1);
								var zeroText = brushList.append("text")
								                        .attr("x", 187)
								                        .attr("y", 8)
								                        .style("font-size","10px")
								                        .style("font-family","Lato")
								                        .style("fill","black")
								                        .text("0");
								var shiftParties = brushList.selectAll("rect").data(cmpData).enter();
								var dx = 0, dy = 0, maxValue = 0;
								var dMax = d3.max(cmpData, function(d){return Math.abs(d.D_Percentage);});
								var rMax = d3.max(cmpData, function(d){return Math.abs(d.R_Percentage);});
								if(dMax > rMax){
									maxValue = dMax;
								}else{
									maxValue = rMax;
								}
								var dShift = shiftParties.append("rect")
								                         .attr("x", function(d){
								                         	if(d.D_Percentage < 0){
								                         		dx = (190 - Math.abs(d.D_Percentage)/(maxValue + 5) * 90);
								                         		return dx;
								                         	}else{
								                         		dx = 190;
								                         		return dx;
								                         	}
								                         })
								                         .attr("y", function(d, i){return (i * 20 + 10);})
								                         .attr("width", function(d){
								                         	if (d.D_Percentage < 0) {
								                         		var dwx = (190 - Math.abs(d.D_Percentage)/(maxValue + 5) * 90);
								                         		return Math.abs(190 - dwx);
								                         	}else{
								                         		var dwx = (Math.abs(d.D_Percentage)/(maxValue + 5) * 90);
								                         		return Math.abs(dwx);
								                         	}
								                         })
								                         .attr("height",15)
								                         .style("fill","#3182bd")
								                         .style("opacity",0.7)
								                         .style("stroke","#1b4f9a").style("stroke-width",2)
								                         .on("mouseover",function(d){
								                         	msgTag.transition().duration(500).style("opacity",0.9);
								                         	msgTag.style("width","80px").style("height","60px");
								                         	msgTag.html("<span style=\"color:black;\">"+d.State+":</span><br/>" + 
								                         		        "<span style=\"color:#3182bd;\">D: "+formatData(d.D_Percentage)+"%</span><br/>" + 
								                         		        "<span style=\"color:#de2d26;\">R: "+formatData(d.R_Percentage)+"%</span><br/>")
								                         		  .style("left", (d3.event.pageX) + "px")
			      	       										  .style("top", (d3.event.pageY - 28) + "px");
								                         })
								                         .on("mouseout", function(){
								                         	msgTag.transition().duration(500).style("opacity", 0);
								                         });
								var rShift = shiftParties.append("rect")
								                         .attr("x", function(d){
								                         	if(d.R_Percentage < 0){
								                         		dy = (190 - Math.abs(d.R_Percentage)/(maxValue + 5) * 90);
								                         		return dy;
								                         	}else{
								                         		dy = 190;
								                         		return dy;
								                         	}
								                         })
								                         .attr("y", function(d, i){return (i * 20 + 10);})
								                         .attr("width", function(d){
								                         	if(d.R_Percentage < 0){
								                         		var dwy = (190 - Math.abs(d.R_Percentage)/(maxValue + 5) * 90);
								                         		return Math.abs(dwy - 190);
								                         	}else{
								                         		var dwy = (Math.abs(d.R_Percentage)/(maxValue + 5) * 90);
								                         		return Math.abs(dwy);
								                         	}
								                         })
								                         .attr("height", 15)
								                         .style("fill", "#de2d26")
								                         .style("opacity",0.7)
								                         .style("stroke","#9b2219").style("stroke-width",2)
								                         .on("mouseover",function(d){
								                         	msgTag.transition().duration(500).style("opacity",0.9);
								                         	msgTag.style("width","80px").style("height","60px");
								                         	msgTag.html("<span style=\"color:black;\">"+d.State+":</span><br/>" + 
								                         		        "<span style=\"color:#3182bd;\">D: "+formatData(d.D_Percentage)+"%</span><br/>" + 
								                         		        "<span style=\"color:#de2d26;\">R: "+formatData(d.R_Percentage)+"%</span><br/>")
								                         		  .style("left", (d3.event.pageX) + "px")
			      	       										  .style("top", (d3.event.pageY - 28) + "px");
								                         })
								                         .on("mouseout", function(){
								                         	msgTag.transition().duration(500).style("opacity", 0);
								                         });
								var middleLine = shiftLine.append("line")
								                         .attr("x1", 190)
								                         .attr("x2", 190)
								                         .attr("y1", function(d,i){return (i * 20 + 10);})
								                         .attr("y2", function(d,i){return (i * 20 + 25);})
								                         .style("stroke","black")
								                         .style("stroke-width",1);
								                         // function(d){
								                         // 	if (d.R_Percentage < 0) {
								                         // 		return (190 - dy);
								                         // 	}else{
								                         // 		return (dy - 190);
								                         // 	}
								                         // }
								// var addBrush = brushList.selectAll("li")
								//          			.data(cmpData)
								//          			.enter()
								//          			.append("li");
								//     addBrush.append("span")
								//             .style("color","black")
								//             .style("font-size","14px")
								//          	.text(function(d){return d.State + " ";});
								//     addBrush.append("span")
								//          	.style("color","#3182bd")
								//          	.style("font-size","12px")
								//          	.text(function(d){return formatData(d.D_Percentage)+"%";});
								//     addBrush.append("span")
								//             .style("color","#de2d26")
								//             .style("font-size","12px")
								//             .text(function(d){return "  "+formatData(d.R_Percentage)+"%";});
								//     addBrush.append("span")
								//             .style("color","#45AD6A")
								//             .style("font-size","12px")
								//             .text(function(d){return "  "+formatData(d.I_Percentage)+"%";});
								//var shiftSvg = addBrush.append("svg").attr("width",280).attr("height",20);
							}else{
								brushList.selectAll("li")
							         .data(filterData)
							         .enter()
							         .append("li")
							         .text(function(d){return d.State;});
							}
							// brushList.selectAll("li")
							//          .data(filterData)
							//          .enter()
							//          .append("li")
							//          .text(function(d){return d.State;});
							updateFilter(filterData, selectedYear);
			          	}
			          });
			gBrush.call(brush);
		}else {
			//brushDomain = [];
			var data_I = updateData.filter(function(d){
				if(d.I_Votes > d.D_Votes && d.I_Votes > d.R_Votes){
					totalI = totalI + d.Total_EV;
				}
				return (d.I_Votes > d.D_Votes && d.I_Votes > d.R_Votes);
			});
			data_I.sort(function(a, b){return b.I_Percentage - a.I_Percentage;});
			rects_I.append("text")
			       .attr("x", x_w)
			       .attr("y", 20)
			       .style("text-anchor", "start")
			       .style("font-family", "Arvo")
			       .style("font-size", "12px")
			       .style("fill","#45AD6A")
			       .text(totalI);
			rects_I.selectAll("rect")
			       .data(data_I)
			       .enter()
			       .append("rect")
			       .attr("x", function(d, i){
			       	 if(i === 0){
			       	 	//brushDomain.push({x_w: x_w,State: d.State,Abbreviation: d.Abbreviation,Total_EV: d.Total_EV,D_Percentage: d.D_Percentage,R_Percentage:d.R_Percentage,I_Percentage:d.I_Percentage,D_Nominee:d.D_Nominee,R_Nominee:d.R_Nominee,I_Nominee:d.I_Nominee});
			       	 	cnt = cnt + d.Total_EV / totalSumEv * 800;
			       	 	brushDomain.push({x_w: x_w,n_w: cnt,State: d.State,Abbreviation: d.Abbreviation,Total_EV: d.Total_EV,D_Percentage: d.D_Percentage,R_Percentage:d.R_Percentage,I_Percentage:d.I_Percentage,D_Nominee:d.D_Nominee,R_Nominee:d.R_Nominee,I_Nominee:d.I_Nominee});
			       	 	return x_w;
			       	 }else{
			       	 	x_w = cnt;
			       	 	//brushDomain.push({x_w: x_w,State: d.State,Abbreviation: d.Abbreviation,Total_EV: d.Total_EV,D_Percentage: d.D_Percentage,R_Percentage:d.R_Percentage,I_Percentage:d.I_Percentage,D_Nominee:d.D_Nominee,R_Nominee:d.R_Nominee,I_Nominee:d.I_Nominee});
			       	 	cnt = cnt + d.Total_EV / totalSumEv * 800;
			       	 	brushDomain.push({x_w: x_w,n_w: cnt,State: d.State,Abbreviation: d.Abbreviation,Total_EV: d.Total_EV,D_Percentage: d.D_Percentage,R_Percentage:d.R_Percentage,I_Percentage:d.I_Percentage,D_Nominee:d.D_Nominee,R_Nominee:d.R_Nominee,I_Nominee:d.I_Nominee});
			       	 	return x_w;
			       	 }
			       })
			       .attr("y", 30)
			       .attr("width", function(d){return d.Total_EV / totalSumEv * 800;})
			       .attr("height", "20px")
			       .style("fill", "#45AD6A")
			       .style("opacity", function(d){return d.I_Percentage / d3.max(data_I, function(d){return d.I_Percentage;});})
			       .style("stroke", "#eee")
			       .style("stroke-width",1);
			    //#14a045
			rects_I.exit().remove();
			if(totalI === 0){
				rects_I.remove();
			}
			var data_D = updateData.filter(function(d){
				if(d.D_Votes > d.I_Votes && d.D_Votes > d.R_Votes){
					totalD = totalD + d.Total_EV;
				}
				return (d.D_Votes > d.I_Votes && d.D_Votes > d.R_Votes);
			});
			data_D.sort(function(a, b){return (b.D_Percentage - b.R_Percentage) - (a.D_Percentage - a.R_Percentage);});
			rects_D.append("text")
			       .attr("x", cnt)
			       .attr("y", 20)
			       .style("text-anchor","start")
			       .style("font-family", "Arvo")
			       .style("font-size", "12px")
			       .style("fill", "#3182bd")
			       .text(totalD);
			rects_D.selectAll("rect")
			       .data(data_D)
			       .enter()
			       .append("rect")
			       .attr("x", function(d){
			       	 x_w = cnt;
			       	 //brushDomain.push({x_w: x_w,State: d.State,Abbreviation: d.Abbreviation,Total_EV: d.Total_EV,D_Percentage: d.D_Percentage,R_Percentage:d.R_Percentage,I_Percentage:d.I_Percentage,D_Nominee:d.D_Nominee,R_Nominee:d.R_Nominee,I_Nominee:d.I_Nominee});
			       	 cnt = cnt + d.Total_EV / totalSumEv * 800;
			       	 brushDomain.push({x_w: x_w,n_w: cnt,State: d.State,Abbreviation: d.Abbreviation,Total_EV: d.Total_EV,D_Percentage: d.D_Percentage,R_Percentage:d.R_Percentage,I_Percentage:d.I_Percentage,D_Nominee:d.D_Nominee,R_Nominee:d.R_Nominee,I_Nominee:d.I_Nominee});
			       	 return x_w;
			       })
			       .attr("y", 30)
			       .attr("width", function(d){return d.Total_EV / totalSumEv * 800;})
			       .attr("height", "20px")
			       .style("fill", function(d){return fillVotesColor(d.D_Percentage, d.R_Percentage);})
			       //.style("opacity", function(d){return d.D_Percentage / d3.max(data_D, function(d){return d.D_Percentage;});})
			       .style("stroke","#eee")
			       .style("stroke-width", 1);
			rects_D.exit().remove();
			var data_R = updateData.filter(function(d){
				if(d.R_Votes > d.D_Votes && d.R_Votes > d.I_Votes){
					totalR = totalR + d.Total_EV;
				}
				return (d.R_Votes > d.D_Votes && d.R_Votes > d.I_Votes);
			});
			data_R.sort(function(a, b){return (a.R_Percentage - a.D_Percentage) - (b.R_Percentage - b.D_Percentage);});
			//console.log(data_R);
			rects_R.selectAll("rect")
			       .data(data_R)
			       .enter()
			       .append("rect")
			       .attr("x", function(d){
			       	  x_w = cnt;
			       	  cnt = cnt + d.Total_EV / totalSumEv * 800;
			       	  brushDomain.push({x_w: x_w,n_w: cnt,State: d.State,Abbreviation: d.Abbreviation,Total_EV: d.Total_EV,D_Percentage: d.D_Percentage,R_Percentage:d.R_Percentage,I_Percentage:d.I_Percentage,D_Nominee:d.D_Nominee,R_Nominee:d.R_Nominee,I_Nominee:d.I_Nominee});
			       	  return x_w;
			       })
			       .attr("y", 30)
			       .attr("width", function(d){return d.Total_EV / totalSumEv * 800;})
			       .attr("height", "20px")
			       .style("fill", function(d){return fillVotesColor(d.D_Percentage, d.R_Percentage);})
			       .style("stroke", "#eee")
			       .style("stroke-width", 1);
			rects_R.append("text")
			       .attr("x", cnt)
			       .attr("y", 20)
			       .style("text-anchor", "end")
			       .style("font-family", "Arvo")
			       .style("font-size", "12px")
			       .style("fill", "#de2d26")
			       .text(totalR);
			rects_R.exit().remove();
			midLine.append("text")
			       .attr("x", cnt / 2 - 50)
			       .attr("y", 15)
			       .style("font-family","Lato")
			       .style("font-size", "10px")
			       .style("fill", "black")
			       .text("Electoral Vote (270 needed to win)");
			midLine.append("line")
			       .attr("x1", cnt / 2)
			       .attr("y1", 26)
			       .attr("x2", cnt / 2)
			       .attr("y2", 54)
			       .style("stroke", "black")
			       .style("stroke-width", 2);
			brush = d3.brushX()
			          .extent([[10, 28], [cnt, 52]])
			          .on("start brush end", function(){
			          	var s = d3.event.selection;
			          	if(s != null){
			          		var s1 = s[0], s2 = s[1];
			          		brushList.remove();
							// brushList = d3.select("#brushedStates").append("ul").attr("id", "listOfStates")
							//               .style("list-style-type","disc");
							brushList = d3.select("#brushedStates").append("svg").attr("id","listOfStates").attr("width",300).attr("height",900);
							var filterData = brushDomain.filter(function(d){
								return (s1 <= d.n_w && s2 >= d.x_w) || (s1 >= d.x_w && s2 <= d.n_w);;
							});
							if(filterData.length > 0){
								var filterShift = filterShiftBrushData(dataOfLastYear, filterData);
								var cmpData = compareShift(filterShift, filterData);
								var cs = brushList.selectAll("circle")
								                  .data(cmpData)
								                  .enter()
								                  .append("circle")
								                  .attr("r",2)
								                  .attr("cx",5)
								                  .attr("cy",function(d,i){return (i * 20 + 18);})
								                  .style("fill","black");
								var bText = brushList.selectAll("text")
								                     .data(cmpData)
								                     .enter()
								                     .append("text")
								                     .attr("x",10)
								                     .attr("y", function(d,i){return (i * 20 + 22);})
								                     .style("font-size","12px")
								                     .style("font-family","Lato")
								                     .style("fill","black")
								                     .text(function(d){return d.State;});
								var shiftLine = brushList.selectAll("line")
								                         .data(cmpData)
								                         .enter();
								var dashLine = shiftLine.append("line")
								                         .attr("x1",100)
								                         .attr("x2",280)
								                         .attr("y1", function(d, i){return (i * 20 + 18);})
								                         .attr("y2", function(d, i){return (i * 20 + 18);})
								                         .style("stroke-dasharray",("4,4"))
								                         .style("stroke","gray")
								                         .style("stroke-width",1);
								var zeroText = brushList.append("text")
								                        .attr("x", 187)
								                        .attr("y", 8)
								                        .style("font-size","10px")
								                        .style("font-family","Lato")
								                        .style("fill","black")
								                        .text("0");
								//console.log(cmpData);
								var shiftParties = brushList.selectAll("rect").data(cmpData).enter();
								var dx = 0, dy = 0, di = 0, maxValue = 0;
								var dMax = d3.max(cmpData, function(d){return Math.abs(d.D_Percentage);});
								var rMax = d3.max(cmpData, function(d){return Math.abs(d.R_Percentage);});
								var iMax = d3.max(cmpData, function(d){return Math.abs(d.I_Percentage);});
								if(dMax >= rMax && dMax >= iMax){
									maxValue = dMax;
								}else if (rMax >= iMax && rMax >= dMax) {
									maxValue = rMax;
								}else if (iMax >= dMax && iMax >= rMax) {
									maxValue = iMax;
								}
								var dShift = shiftParties.append("rect")
								                         .attr("x", function(d){
								                         	if(d.D_Percentage < 0){
								                         		dx = (190 - Math.abs(d.D_Percentage)/(maxValue + 5) * 90);
								                         		return dx;
								                         	}else{
								                         		dx = 190;
								                         		return dx;
								                         	}
								                         })
								                         .attr("y", function(d, i){return (i * 20 + 10);})
								                         .attr("width", function(d){
								                         	if(d.D_Percentage < 0){
								                         		var dwx = (190 - Math.abs(d.D_Percentage)/(maxValue + 5) * 90);
								                         		return Math.abs(190 - dwx);
								                         	}else{
								                         		var dwx = Math.abs(d.D_Percentage)/(maxValue + 5) * 90;
								                         		return Math.abs(dwx);
								                         	}
								                         })
								                         .attr("height",15)
								                         .style("fill","#3182bd")
								                         .style("opacity",0.7);
								var rShift = shiftParties.append("rect")
								                         .attr("x", function(d){
								                         	if(d.R_Percentage < 0){
								                         		dy = (190 - Math.abs(d.R_Percentage)/(maxValue + 5) * 90);
								                         		return dy;
								                         	}else{
								                         		dy = 190;
								                         		return dy;
								                         	}
								                         })
								                         .attr("y", function(d, i){return (i * 20 + 10);})
								                         .attr("width", function(d){
								                         	if(d.R_Percentage < 0){
								                         		var dwy = (190 - Math.abs(d.R_Percentage)/(maxValue + 5) * 90);
								                         		return Math.abs(190 - dwy);
								                         	}else{
								                         		var dwy = Math.abs(d.R_Percentage)/(maxValue + 5) * 90;
								                         		return Math.abs(dwy);
								                         	}
								                         })
								                         .attr("height", 15)
								                         .style("fill", "#de2d26")
								                         .style("opacity",0.7);
								var iShift = shiftParties.append("rect")
								                         .attr("x", function(d){
								                         	if(d.I_Percentage < 0){
								                         		di = (190 - Math.abs(d.I_Percentage)/(maxValue + 5) * 90);
								                         		return di;
								                         	}else{
								                         		di = 190;
								                         		return di;
								                         	}
								                         })
								                         .attr("y", function(d, i){return (i * 20 + 10);})
								                         .attr("width", function(d){
								                         	if(d.I_Percentage < 0){
								                         		var dwi = (190 - Math.abs(d.I_Percentage)/(maxValue + 5) * 90);
								                         		return Math.abs(190 - dwi);
								                         	}else{
								                         		var dwi = Math.abs(d.I_Percentage)/(maxValue + 5) * 90;
								                         		return Math.abs(dwi);
								                         	}
								                         })
								                         .attr("height", 15)
								                         .style("fill", "#45AD6A")
								                         .style("opacity",0.7);
								dShift.style("stroke","#1b4f9a").style("stroke-width",2)
								      .on("mouseover",function(d){
								            msgTag.transition().duration(500).style("opacity",0.9);
								            msgTag.style("width","80px").style("height","70px");
								            msgTag.html("<span style=\"color:black;\">"+d.State+":</span><br/>" + 
								                         "<span style=\"color:#3182bd;\">D: "+formatData(d.D_Percentage)+"%</span><br/>" + 
								                         "<span style=\"color:#de2d26;\">R: "+formatData(d.R_Percentage)+"%</span><br/>" + 
								                         "<span style=\"color:#45AD6A;\">I: "+formatData(d.I_Percentage)+"%</span>")
								                   .style("left", (d3.event.pageX) + "px")
			      	       						   .style("top", (d3.event.pageY - 28) + "px");
								            })
								       .on("mouseout", function(){
								           msgTag.transition().duration(500).style("opacity", 0);
								       });
								rShift.style("stroke","#9b2219").style("stroke-width",2)
								      .on("mouseover",function(d){
								            msgTag.transition().duration(500).style("opacity",0.9);
								            msgTag.style("width","80px").style("height","70px");
								            msgTag.html("<span style=\"color:black;\">"+d.State+":</span><br/>" + 
								                        "<span style=\"color:#3182bd;\">D: "+formatData(d.D_Percentage)+"%</span><br/>" + 
								                        "<span style=\"color:#de2d26;\">R: "+formatData(d.R_Percentage)+"%</span><br/>" + 
								                        "<span style=\"color:#45AD6A;\">I: "+formatData(d.I_Percentage)+"%</span>")
								                  .style("left", (d3.event.pageX) + "px")
			      	       						  .style("top", (d3.event.pageY - 28) + "px");
								                         })
								       .on("mouseout", function(){
								             msgTag.transition().duration(500).style("opacity", 0);
								        });
								iShift.style("stroke","#048732").style("stroke-width",2)
								      .on("mouseover",function(d){
								            msgTag.transition().duration(500).style("opacity",0.9);
								            msgTag.style("width","80px").style("height","70px");
								            msgTag.html("<span style=\"color:black;\">"+d.State+":</span><br/>" + 
								                        "<span style=\"color:#3182bd;\">D: "+formatData(d.D_Percentage)+"%</span><br/>" + 
								                        "<span style=\"color:#de2d26;\">R: "+formatData(d.R_Percentage)+"%</span><br/>" + 
								                        "<span style=\"color:#45AD6A;\">I: "+formatData(d.I_Percentage)+"%</span>")
								                  .style("left", (d3.event.pageX) + "px")
			      	       						  .style("top", (d3.event.pageY - 28) + "px");
								            })
								      .on("mouseout", function(){
								            msgTag.transition().duration(500).style("opacity", 0);
								       });
								var middleLine = shiftLine.append("line")
								                         .attr("x1", 190)
								                         .attr("x2", 190)
								                         .attr("y1", function(d,i){return (i * 20 + 10);})
								                         .attr("y2", function(d,i){return (i * 20 + 25);})
								                         .style("stroke","black")
								                         .style("stroke-width",1);
								// var addBrush = brushList.selectAll("li")
								//          			.data(cmpData)
								//          			.enter()
								//          			.append("li");
								//     addBrush.append("span")
								//             .style("color","black")
								//             .style("font-size","14px")
								//          	.text(function(d){return d.State + " ";});
								//     addBrush.append("span")
								//          	.style("color","#3182bd")
								//          	.style("font-size","12px")
								//          	.text(function(d){return formatData(d.D_Percentage)+"%";});
								//     addBrush.append("span")
								//             .style("color","#de2d26")
								//             .style("font-size","12px")
								//             .text(function(d){return "  "+formatData(d.R_Percentage)+"%";});
								//     addBrush.append("span")
								//             .style("color","#45AD6A")
								//             .style("font-size","12px")
								//             .text(function(d){return "  "+formatData(d.I_Percentage)+"%";});
							}else{
								brushList.selectAll("li")
							         .data(filterData)
							         .enter()
							         .append("li")
							         .text(function(d){return d.State;});
							}
							updateFilter(filterData, selectedYear);
			          	}
			          });
			gBrush.call(brush);
		}
	});
}

//fill color of each state
function fillVotesColor(pa, pb){
	var diff_color = pb - pa;
	return colorScale(diff_color);
}

function getLastYearData(dataFromLastYear){
	dataOfLastYear = dataFromLastYear;
}

function filterShiftBrushData(ly, cy){
	var filterBrushAndShift = [];
	//console.log(ly);
	var j = 0
	while(j < cy.length){
		for(var i = 0; i < ly.length; i++){
			if (ly[i].Abbreviation === cy[j].Abbreviation) {
				filterBrushAndShift.push(ly[i]);
				break;
			}
		}
		j = j + 1;
	}
	return filterBrushAndShift;
}

function compareShift(last, cur){
	var afterCompareData = [];
	for(var z = 0; z < cur.length; z++){
		var diff_D = cur[z].D_Percentage - last[z].D_Percentage;
		var diff_R = cur[z].R_Percentage - last[z].R_Percentage;
		var diff_I = cur[z].I_Percentage - last[z].I_Percentage;
		afterCompareData.push({State:cur[z].State,D_Percentage:diff_D,R_Percentage:diff_R,I_Percentage:diff_I});
	}
	return afterCompareData;
}
