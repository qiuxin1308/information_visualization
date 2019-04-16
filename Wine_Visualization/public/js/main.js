//set glabal variable
var regionDataOfUSA;
var wineOfUSA;
var regionDataOfARG;
var wineOfARG;
var regionDataOfAUS;
var wineOfAUS;
var regionDataOfFRA;
var wineOfFRA;
var regionDataOfESP;
var wineOfESP;
var regionDataOfITA;
var wineOfITA;
var regionDataOfCAN;
var wineOfCAN;
var wineInfo = []

/* data for import and export trend */
var exTrendData;
var imTrendData;
var dataExports;
var dataImports;

//load data asynchronously
queue().defer(d3.json, "data/world_countries.json")
       .defer(d3.tsv, "data/world_wine.tsv")
    //    .defer(d3.json, "data/map-USA.json")
    //    .defer(d3.csv, "data/USA_region.csv")
    //    .defer(d3.json,"data/USA.json")
       .defer(d3.csv, "data/wine_export.csv")
	   .defer(d3.json, "data/trade_countries.json")
	   .defer(d3.csv, "data/exportTrend.csv")
	   .defer(d3.csv, "data/importTrend.csv")
	   .defer(d3.csv, "data/data_exports.csv")
	   .defer(d3.csv, "data/data_imports.csv")
       .await(createVis);

function createVis(error, countriesData, population, wineExport, tradeCountries, exportTrend, importTrend, data_exports, data_imports){
	if(error) throw error;

	exTrendData = exportTrend;
	imTrendData = importTrend;
	dataExports = data_exports;
	dataImports = data_imports;

	/* create visualization instances */
	var btnsVis = new buttonSelectionVis("buttonselection", countriesData, population, wineExport, tradeCountries);
	/* the world map instances */
	// var worldMap = new worldMapVis("worldmapvis", countriesData, population, mapUSA, usaRegion,usaWine);
	/* the pie chart instance */
	//var pieChart = new piePercentageVis("piepercentagevis", population);
	/* the bar chart instance to show the import and export */
	var barChart = new barInExVis("barinexvis", wineExport);
}

queue().defer(d3.json, "data/USA.json")
	   .defer(d3.csv, "data/USA_region.csv")
	   .defer(d3.json, "data/ARG.json")
	   .defer(d3.csv, "data/ARG_region.csv")
	   .defer(d3.json, "data/AUS.json")
	   .defer(d3.csv, "data/AUS_region.csv")
	   .defer(d3.json, "data/CAN.json")
	   .defer(d3.csv, "data/CAN_region.csv")
	   .defer(d3.json, "data/ESP.json")
	   .defer(d3.csv, "data/ESP_region.csv")
	   .defer(d3.json, "data/FRA.json")
	   .defer(d3.csv, "data/FRA_region.csv")
	   .defer(d3.json, "data/ITA.json")
	   .defer(d3.csv, "data/ITA_region.csv")
	   .await(createAnalysisVis);

function createAnalysisVis(error, usaWine, usaRegion, argWine, argRegion,  ausWine, ausRegion, canWine, canRegion, espWine, espRegion, fraWine, fraRegion, itaWine, itaRegion) {
	regionDataOfUSA = usaRegion;
	wineOfUSA = usaWine;
	regionDataOfARG = argRegion;
	wineOfARG = argWine;
	regionDataOfAUS = ausRegion;
	wineOfAUS = ausWine;
	regionDataOfFRA = fraRegion;
	wineOfFRA = fraWine;
	regionDataOfESP = espRegion;
	wineOfESP = espWine;
	regionDataOfITA = itaRegion;
	wineOfITA = itaWine;
	regionDataOfCAN = canRegion;
	wineOfCAN = canWine;

	wineInfo.push({
		name:country_name_list[0],
		id: country_id_list[0],
		region:usaRegion,
		wines:usaWine
	})
	wineInfo.push({
		name:country_name_list[1],
		id: country_id_list[1],
		region:argRegion,
		wines:argWine
	})
	wineInfo.push({
		name:country_name_list[2],
		id: country_id_list[2],
		region:ausRegion,
		wines:ausWine
	})
	wineInfo.push({
		name:country_name_list[3],
		id: country_id_list[3],
		region:canRegion,
		wines:canWine
	})
	wineInfo.push({
		name:country_name_list[4],
		id: country_id_list[4],
		region:fraRegion,
		wines:fraWine
	})
	wineInfo.push({
		name:country_name_list[5],
		id: country_id_list[5],
		region:itaRegion,
		wines:itaWine
	})
	wineInfo.push({
		name:country_name_list[6],
		id: country_id_list[6],
		region:espRegion,
		wines:espWine
	})
}