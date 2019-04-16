var lastYearData = [];
function ShiftChart(){
	loadLastData("1940");
}

function loadLastData(year){
	var curYear = parseInt(year);
	var sub = curYear - 1940;
	lastYearData = [];
	if (sub === 0) {
		var lastYear = curYear;
		d3.csv("data/election-results-"+lastYear+".csv", function(error, csv){
			if(error) throw error;
			csv.forEach(function(d, i){
				d.State = d.State;
				d.D_Percentage = +d.D_Percentage;
				d.R_Percentage = +d.R_Percentage;
				d.I_Percentage = +d.I_Percentage;
				d.Abbreviation = d.Abbreviation;
				lastYearData.push({State:d.State,Abbreviation:d.Abbreviation,D_Percentage:d.D_Percentage,R_Percentage:d.R_Percentage,I_Percentage:d.I_Percentage});
			});
		});
		lastYearData.push({State:"Alaska",Abbreviation:"AK",D_Percentage:"",R_Percentage:"",I_Percentage:""});
		lastYearData.push({State:"Dist. of Col.",Abbreviation:"DC",D_Percentage:"",R_Percentage:"",I_Percentage:""});
		lastYearData.push({State:"Hawaii",Abbreviation:"HI",D_Percentage:"",R_Percentage:"",I_Percentage:""});
		getLastYearData(lastYearData);
	}else{
		var lastYear = curYear - 4;
		if(lastYear <= 1956){
			d3.csv("data/election-results-"+lastYear+".csv", function(error, csv){
				if(error) throw error;
				csv.forEach(function(d, i){
					d.State = d.State;
					d.D_Percentage = +d.D_Percentage;
					d.R_Percentage = +d.R_Percentage;
					d.I_Percentage = +d.I_Percentage;
					d.Abbreviation = d.Abbreviation;
					lastYearData.push({State:d.State,Abbreviation:d.Abbreviation,D_Percentage:d.D_Percentage,R_Percentage:d.R_Percentage,I_Percentage:d.I_Percentage});
				});
			});
			lastYearData.push({State:"Alaska",Abbreviation:"AK",D_Percentage:"",R_Percentage:"",I_Percentage:""});
			lastYearData.push({State:"Dist. of Col.",Abbreviation:"DC",D_Percentage:"",R_Percentage:"",I_Percentage:""});
			lastYearData.push({State:"Hawaii",Abbreviation:"HI",D_Percentage:"",R_Percentage:"",I_Percentage:""});
		}else if(lastYear > 1956 && lastYear <= 1960){
			d3.csv("data/election-results-"+lastYear+".csv", function(error, csv){
				if(error) throw error;
				csv.forEach(function(d, i){
					d.State = d.State;
					d.D_Percentage = +d.D_Percentage;
					d.R_Percentage = +d.R_Percentage;
					d.I_Percentage = +d.I_Percentage;
					d.Abbreviation = d.Abbreviation;
					lastYearData.push({State:d.State,Abbreviation:d.Abbreviation,D_Percentage:d.D_Percentage,R_Percentage:d.R_Percentage,I_Percentage:d.I_Percentage});
				});
			});
			lastYearData.push({State:"Dist. of Col.",Abbreviation:"DC",D_Percentage:"",R_Percentage:"",I_Percentage:""});
		}else{
			d3.csv("data/election-results-"+lastYear+".csv", function(error, csv){
				if(error) throw error;
				csv.forEach(function(d, i){
					d.State = d.State;
					d.D_Percentage = +d.D_Percentage;
					d.R_Percentage = +d.R_Percentage;
					d.I_Percentage = +d.I_Percentage;
					d.Abbreviation = d.Abbreviation;
					lastYearData.push({State:d.State,Abbreviation:d.Abbreviation,D_Percentage:d.D_Percentage,R_Percentage:d.R_Percentage,I_Percentage:d.I_Percentage});
				});
			});
		}
		getLastYearData(lastYearData);
	}
}