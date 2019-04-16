/*
 * Root file that handles instances of all the charts and loads the visualization
 */
(function(){
    var instance = null;

    /**
     * Creates instances for every chart (classes created to handle each chart;
     * the classes are defined in the respective javascript files.
     */
    function init() {
        //Creating instances for each visualization
        var lineEmoInfo = new LineEmotions();
        var radarSentiment = new RadarSentiment();
        var sentimentPercetage = new SentimentPercetage();
        var sentimentTrend = new SentimentTrend();
        
        d3.csv("data/fairyTalesNames.csv", function (error, fairyTales) {
            var nameChart = new NameChart(lineEmoInfo, radarSentiment, sentimentPercetage, sentimentTrend, fairyTales);
        });
    }

    /**
     *
     * @constructor
     */
    function Main(){
        if(instance  !== null){
            throw new Error("Cannot instantiate more than one Class");
        }
    }

    /**
     *
     * @returns {Main singleton class |*}
     */
    Main.getInstance = function(){
        var self = this
        if(self.instance == null){
            self.instance = new Main();

            //called only once when the class is initialized
            init();
        }
        return instance;
    }

    Main.getInstance();
})();