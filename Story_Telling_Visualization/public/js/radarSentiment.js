var radar = d3.select("#eRadarChart")
              .append("svg")
              .attr("id", "gSVG")
              .attr("width", 600)
              .attr("height", 600);
function RadarSentiment() {
	updateRadarSentiment("TOM TIT TOT");
}

function updateRadarSentiment(name){
	d3.select("#gSVG").remove();
	var config = {
		w: 300,
		h: 300,
		maxValue: 40,
		levels: 4,
		ExtraWidthX: 300
	}
	var dataArr = [];
	var sadness = 0, anger = 0, disgust = 0, fear = 0,
		surprise = 0, anticipation = 0, trust = 0, joy = 0;

	d3.csv("data/sentiments_new/"+name+".csv", function(error, csv){
		if (error) throw error;
		csv.forEach(function(d){
			d.sentiment = d.sentiment;
    		d.n = +d.n;
    		if (d.sentiment === "sadness") {
      			sadness = sadness + d.n;
    		}else if(d.sentiment === "anger"){
      			anger = anger + d.n;
    		}else if(d.sentiment === "disgust"){
      			disgust = disgust + d.n;
    		}else if (d.sentiment === "fear") {
      			fear = fear + d.n;
    		}else if (d.sentiment === "surprise") {
      			surprise = surprise + d.n;
    		}else if (d.sentiment === "anticipation") {
      			anticipation = anticipation + d.n;
    		}else if (d.sentiment === "trust") {
      			trust = trust + d.n;
    		}else if (d.sentiment === "joy") {
      			joy = joy + d.n;
    		}
		});
		var text = ["sadness","anger","disgust","fear","surprise","anticipation","trust","joy"];
  		var textData = [sadness,anger,disgust,fear,surprise,anticipation,trust,joy];
  		var maxVal = Math.max(...textData);
  		var negative = sadness + anger + disgust + fear;
  		var positive = surprise + anticipation + trust + joy;
  		var maxSenti = "";
  		if (negative > positive) {
  			maxSenti = "negative";
  		}else{
  			maxSenti = "positive";
  		}
  		//console.log(Math.max(...textData));
  		for(var i = 0; i < 8; i++){
    		dataArr.push({"area": text[i], "value": textData[i]});
  		}
  		var dataArray = [];
  		dataArray.push(dataArr);
  		//console.log(dataArray);
  		RadarChart.draw("#eRadarChart", dataArray, config, maxVal, maxSenti);
	});
}