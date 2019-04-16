var dOfVP;
var width = 900,
    height = 60;
var sumI = 0, sumD = 0, sumR = 0, sumOfVotes = 0;
var voteRects = d3.select("#votes-percentage")
                       .append("svg")
                       .attr("width", width)
                       .attr("height", height);
var voteText_I = voteRects.append("svg")
                        .attr("id","voteTextI");
var vote_I = voteRects.append("svg")
                      .attr("id", "voteI");
var voteText_D = voteRects.append("svg")
                        .attr("id","voteTextD");
var vote_D = voteRects.append("svg")
                      .attr("id", "voteD");
var voteText_R = voteRects.append("svg")
                        .attr("id","voteTextR");
var vote_R = voteRects.append("svg")
                      .attr("id", "voteR");
var textMsg = d3.select("#votes-percentage")
                .append("div")
                .attr("class","d3-tip")
                .style("opacity",0)
                .style("position", "absolute");
var midPercentage = voteRects.append("svg").attr("id", "midPer");

var f = d3.format(".1f");
var d_n,i_n,r_n;

function updateVP(year){
	voteText_I.remove();
	vote_I.remove();
	voteText_D.remove();
	vote_D.remove();
	voteText_R.remove();
	vote_R.remove();
	midPercentage.remove();
	voteText_I = voteRects.append("svg").attr("id","voteTextI");
	vote_I = voteRects.append("svg").attr("id", "voteI");
	voteText_D = voteRects.append("svg").attr("id","voteTextD");
	vote_D = voteRects.append("svg").attr("id", "voteD");
	voteText_R = voteRects.append("svg").attr("id","voteTextR");
	vote_R = voteRects.append("svg").attr("id", "voteR");
	midPercentage = voteRects.append("svg").attr("id", "midPer");
	sumI = 0;
	sumD = 0;
	sumR = 0;
	sumOfVotes = 0;
	d3.csv("data/election-results-"+year+".csv", function(error, csv){
		if(error) throw error;
		csv.forEach(function(d, i){
			d.D_Votes = +d.D_Votes;
			d.R_Votes = +d.R_Votes;
			d.I_Votes = +d.I_Votes;
			d.D_Nominee = d.D_Nominee;
			d.R_Nominee = d.R_Nominee;
			d.I_Nominee = d.I_Nominee;
			sumI = sumI + d.I_Votes;
			sumD = sumD + d.D_Votes;
			sumR = sumR + d.R_Votes;
			sumOfVotes = sumOfVotes + d.D_Votes + d.R_Votes + d.I_Votes;
			d_n = d.D_Nominee;
			r_n = d.R_Nominee;
			i_n = d.I_Nominee;
		});
		dOfVP = csv;
		var widthOfX = 10, countWidth = 10;
		if(sumI === 0){
			voteText_D.append("text")
			          .attr("x", widthOfX)
			          .attr("y", 15)
			          .style("text-anchor","start")
			          .style("font-family","Lato")
			          .style("font-size","12px")
			          .style("fill","#3182bd")
			          .text(d_n);
			vote_D.append("text")
			      .attr("x", widthOfX)
			      .attr("y", 30)
			      .style("text-anchor","start")
			      .style("font-family","Arvo")
			      .style("font-size","12px")
			      .style("fill","#3182bd")
			      .text(f(sumD / sumOfVotes * 100)+"%");
			vote_D.append("rect")
			      .attr("x",widthOfX)
			      .attr("y", 35)
			      .attr("width", f(sumD / sumOfVotes * 800))
			      .attr("height", "20px")
			      .style("fill","#3182bd")
			      .style("stroke","#eee")
			      .style("stroke-width",1)
			      .on("mouseover", function(){
			      	textMsg.transition()
			      	       .duration(500)
			      	       .style("opacity", 0.9);
			      	textMsg.style("width","250px")
			      	       .style("height","40px");
			      	textMsg.html("<span style=\"color:#3182bd;\">"+d_n+": "+sumD+"("+f(sumD/sumOfVotes * 100)+"%)</span><br/>" +
			      		         "<span style=\"color:#de2d26;\">"+r_n+": "+sumR+"("+f(sumR/sumOfVotes * 100)+"%)</span>")
			      	       .style("left", (d3.event.pageX) + "px")
			      	       .style("top", (d3.event.pageY - 28) + "px");
			      })
			      .on("mouseout", function(){
			      	textMsg.transition()
			      	       .duration(500)
			      	       .style("opacity", 0);
			      });
			countWidth = countWidth + sumD / sumOfVotes * 800;
			voteText_R.append("text")
			          .attr("x", countWidth + sumR / sumOfVotes * 800)
			          .attr("y", 15)
			          .style("text-anchor","end")
			          .style("font-family","Lato")
			          .style("font-size","12px")
			          .style("fill","#de2d26")
			          .text(r_n);
			vote_R.append("text")
			      .attr("x", countWidth + sumR / sumOfVotes * 800)
			      .attr("y", 30)
			      .style("text-anchor","end")
			      .style("font-family","Arvo")
			      .style("font-size","12px")
			      .style("fill","#de2d26")
			      .text(f(100 - f(sumD / sumOfVotes * 100))+"%");
			vote_R.append("rect")
			      .attr("x", countWidth)
			      .attr("y", 35)
			      .attr("width", f(sumR / sumOfVotes * 800))
			      .attr("height", "20px")
			      .style("fill","#de2d26")
			      .style("stroke", "#eee")
			      .style("stroke-width", 1)
			      .on("mouseover", function(){
			      	textMsg.transition()
			      	       .duration(500)
			      	       .style("opacity", 0.9);
			      	textMsg.style("width","250px")
			      	       .style("height","40px");
			      	textMsg.html("<span style=\"color:#3182bd;\">"+d_n+": "+sumD+"("+f(sumD/sumOfVotes * 100)+"%)</span><br/>" +
			      		         "<span style=\"color:#de2d26;\">"+r_n+": "+sumR+"("+f(sumR/sumOfVotes * 100)+"%)</span>")
			      	       .style("left", (d3.event.pageX) + "px")
			      	       .style("top", (d3.event.pageY - 28) + "px");
			      })
			      .on("mouseout", function(){
			      	textMsg.transition()
			      	       .duration(500)
			      	       .style("opacity", 0);
			      });
			countWidth = countWidth + sumR / sumOfVotes * 800;
			midPercentage.append("text")
			             .attr("x", countWidth / 2 - 30)
			             .attr("y", 25)
			             .style("font-family", "Lato")
			             .style("font-size", "10px")
			             .style("fill", "black")
			             .text("Popular Vote (50%)");
			midPercentage.append("line")
			             .attr("x1", countWidth / 2)
			             .attr("y1", 32)
			             .attr("x2", countWidth / 2)
			             .attr("y2", 70)
			             .style("stroke", "black")
			       		 .style("stroke-width", 2);
		}else{
			var iSum = sumI;
			voteText_I.append("text")
			          .attr("x", widthOfX)
			          .attr("y", 15)
			          .style("text-anchor","start")
			          .style("font-family","Lato")
			          .style("font-size","12px")
			          .style("fill","#45AD6A")
			          .text(i_n);
			vote_I.append("text")
			      .attr("x", widthOfX)
			      .attr("y", 30)
			      .style("text-anchor","start")
			      .style("font-family", "Arvo")
			      .style("font-size","12px")
			      .style("fill","#45AD6A")
			      .text(f(sumI / sumOfVotes * 100)+"%");
			vote_I.append("rect")
			      .attr("x", widthOfX)
			      .attr("y", 35)
			      .attr("width", f(sumI / sumOfVotes * 800))
			      .attr("height", "20px")
			      .style("fill", "#45AD6A")
			      .style("stroke", "#eee")
			      .style("stroke-width", 1)
			      .on("mouseover", function(){
			      	textMsg.transition()
			      	       .duration(500)
			      	       .style("opacity", 0.9);
			      	textMsg.style("width","250px")
			      	       .style("height","60px");
			      	textMsg.html("<span style=\"color:#45AD6A;\">"+i_n+": "+iSum+"("+f(iSum/sumOfVotes * 100)+"%)</span><br/>" +
			      		         "<span style=\"color:#3182bd;\">"+d_n+": "+sumD+"("+f(sumD/sumOfVotes * 100)+"%)</span><br/>" +
			      		         "<span style=\"color:#de2d26;\">"+r_n+": "+sumR+"("+f(sumR/sumOfVotes * 100)+"%)</span>")
			      	       .style("left", (d3.event.pageX) + "px")
			      	       .style("top", (d3.event.pageY - 28) + "px");
			      })
			      .on("mouseout", function(){
			      	textMsg.transition()
			      	       .duration(500)
			      	       .style("opacity", 0);
			      });
			countWidth = countWidth + sumI / sumOfVotes * 800;
			voteText_D.append("text")
			          .attr("x", countWidth + sumD / sumOfVotes * 400)
			          .attr("y", 15)
			          .style("text-anchor","start")
			          .style("font-family","Lato")
			          .style("font-size","12px")
			          .style("fill","#3182bd")
			          .text(d_n);
			vote_D.append("text")
			      .attr("x", countWidth + 5)
			      .attr("y", 30)
			      .style("text-anchor","start")
			      .style("font-family","Arvo")
			      .style("font-size","12px")
			      .style("fill","#3182bd")
			      .text(f(sumD / sumOfVotes * 100)+"%");
			vote_D.append("rect")
			      .attr("x",countWidth)
			      .attr("y", 35)
			      .attr("width", f(sumD / sumOfVotes * 800))
			      .attr("height", "20px")
			      .style("fill","#3182bd")
			      .style("stroke","#eee")
			      .style("stroke-width", 1)
			      .on("mouseover", function(){
			      	textMsg.transition()
			      	       .duration(500)
			      	       .style("opacity", 0.9);
			      	textMsg.style("width","250px")
			      	       .style("height","60px");
			      	textMsg.html("<span style=\"color:#45AD6A;\">"+i_n+": "+iSum+"("+f(iSum / sumOfVotes * 100)+"%)</span><br/>" +
			      		         "<span style=\"color:#3182bd;\">"+d_n+": "+sumD+"("+f(sumD / sumOfVotes * 100)+"%)</span><br/>" +
			      		         "<span style=\"color:#de2d26;\">"+r_n+": "+sumR+"("+f(sumR / sumOfVotes * 100)+"%)</span>")
			      	       .style("left", (d3.event.pageX) + "px")
			      	       .style("top", (d3.event.pageY - 28) + "px");
			      })
			      .on("mouseout", function(){
			      	textMsg.transition()
			      	       .duration(500)
			      	       .style("opacity", 0);
			      });
			countWidth = countWidth + sumD / sumOfVotes * 800;
			voteText_R.append("text")
			          .attr("x", countWidth + sumR / sumOfVotes * 800)
			          .attr("y", 15)
			          .style("text-anchor","end")
			          .style("font-family","Lato")
			          .style("font-size","12px")
			          .style("fill","#de2d26")
			          .text(r_n);
			vote_R.append("text")
			      .attr("x", countWidth + sumR / sumOfVotes * 800)
			      .attr("y", 30)
			      .style("text-anchor","end")
			      .style("font-family","Arvo")
			      .style("font-size", "12px")
			      .style("fill","#de2d26")
			      .text(f(100 - f(sumI/sumOfVotes*100) - f(sumD/sumOfVotes*100))+"%");
			vote_R.append("rect")
			      .attr("x", countWidth)
			      .attr("y", 35)
			      .attr("width", f(sumR / sumOfVotes * 800))
			      .attr("height", "20px")
			      .style("fill", "#de2d26")
			      .style("stroke","#eee")
			      .style("stroke-width", 1)
			      .on("mouseover", function(){
			      	textMsg.transition()
			      	       .duration(500)
			      	       .style("opacity", 0.9);
			      	textMsg.style("width","250px")
			      	       .style("height","60px");
			      	textMsg.html("<span style=\"color:#45AD6A;\">"+i_n+": "+iSum+"("+f(iSum/sumOfVotes * 100)+"%)</span><br/>" +
			      		         "<span style=\"color:#3182bd;\">"+d_n+": "+sumD+"("+f(sumD/sumOfVotes * 100)+"%)</span><br/>" +
			      		         "<span style=\"color:#de2d26;\">"+r_n+": "+sumR+"("+f(sumR/sumOfVotes * 100)+"%)</span>")
			      	       .style("left", (d3.event.pageX) + "px")
			      	       .style("top", (d3.event.pageY - 28) + "px");
			      })
			      .on("mouseout", function(){
			      	textMsg.transition()
			      	       .duration(500)
			      	       .style("opacity", 0);
			      });
			countWidth = countWidth + sumR / sumOfVotes * 800;
			midPercentage.append("text")
			             .attr("x", countWidth / 2 - 30)
			             .attr("y", 25)
			             .style("font-family", "Lato")
			             .style("font-size", "10px")
			             .style("fill", "black")
			             .text("Popular Vote (50%)");
			midPercentage.append("line")
			             .attr("x1", countWidth / 2)
			             .attr("y1", 32)
			             .attr("x2", countWidth / 2)
			             .attr("y2", 70)
			             .style("stroke", "black")
			       		 .style("stroke-width", 2);
		}
	});
}

function VotePercentageChart(){
	//console.log("VOTE");
	updateVP("1940");
}