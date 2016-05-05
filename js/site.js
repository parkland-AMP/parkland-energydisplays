$(function () {

    var sample = `{"currencySymbol": "$", "logo": "", "renderId": "5", "cost": "$15.16", "carbon": "206kg", "kWAlarm": 0, "voltsAlarm": 0, "voltsAlarm2": 0, "pfAlarm": 0, "customMessageUpTime": 15, "customMessageDownTime": 300, "customMessageStatus": 1, "customMessageTitle": "What is this?", "customMessage": "It is a Real-time Energy Display! It shows us exactly how much energy we are using...as we use it.Energy use is normally invisible, that is why it is so easy to waste it. However, this display shows us how our behaviour impacts our energy use and by extension our carbon footprint.How can you help?By keeping it green! The main dial will turn orange when we are using too much energy so please do whatever you can to avoid wasting energy and keep our display green!Thank you!", "MeterCounter": 1, "NullCounter": 0, "ipAddress": "216.125.253.2", "Volts": 286.02474975586, "PF": 0.86324125528336, "KW": 216.53246875, "Current": 294.07421875, "GraphUnit": "kW", "GraphValue": 216.53246875, "PulseCounter": 6.625, "PulseLabel": "", "PowerRatio": "", "PowerUnit": "", "Input1High":0, "Input1Low":0, "Input2High":0, "Input2Low":0, "Output1Status":0, "Output2Status":0}`;
    
    var updateHandle = null;
    var pageCycleDelay = (2 * 60 * 1000); // 2 minutes
    var statUpdateInterval = (10 * 1000); // every 10 seconds
    var pageOrder = [
        "index.html",
        "biking.html",
        "burrito.html",
        "macbook.html",
        "phone.html",
        "washing.html"
    ];
    var currentPage = getCurrentPage();
    var CALS_PER_KWH = 859.84522785899; // Calories in a Kilowatt
    var BURRITO_CALS = 350; 
    var BIKING_CALS = 680;
    var MACBOOK_KW = 65 / 1000; // to KW
    var PHONE_KW = 5.5 / 1000;
    var WASHING_KW = 80; 

    // start doing work
    cycleThroughPages();
    startStatUpdates();
    
    //====================================================================================
    // helper functions
    
    function startStatUpdates(){
        
        updateHandle = setInterval(updateStats, statUpdateInterval);
        updateStats(); // do one when the page loads
        
        function updateStats(){
            getData()
            .then(doMathAndUpdateScreen);
        }
        
        function doMathAndUpdateScreen(data){
            var kw = data["KW"]; // current Kilowatt-hour usage
            var stat = 0;

            if(currentPage == "index.html"){
                // nothing
            }else if(currentPage == "biking.html"){
                
                var cals = kw * CALS_PER_KWH;
                stat = cals / BIKING_CALS;
                
            }else if(currentPage == "burrito.html"){
                
                var cals = kw * CALS_PER_KWH;
                stat = cals / BURRITO_CALS;
                
            }else if(currentPage == "macbook.html"){
                
                stat = kw / MACBOOK_KW;
                
            }else if(currentPage == "phone.html"){
                
                stat = kw / PHONE_KW;
                
            }else if(currentPage == "washing.html"){
                
                stat = kw / WASHING_KW;
                
            }
            
            stat = stat.toFixed(1);
            $("#stat-val").text(stat);
        }
        
        
        function getData(){
            
            //return $.Deferred(function(dfd){ dfd.resolve(JSON.parse(sample)); }).promise();
            
            return $.ajax({
                dataType: 'html',
                url: 'http://faa.parkland.edu/amp_dev/data.php?stamp=' + new Date().getTime()
            })
            .then(function(resp){
                return JSON.parse(resp);  
            });            
        }
        
        
        function getCaloriesPerHour(kw){
            var cals = kw * CALS_PER_KWH;
            return cals;
        }        
    }
    
    
    function cycleThroughPages(){
        
        var nextPage = getNextPage();
        
        setTimeout(moveToNextPage, pageCycleDelay);

        function moveToNextPage(){
            
            if(updateHandle){
                clearInterval(updateHandle);
            }
            
            document.location.assign(nextPage);
        }
    }
    
    function getNextPage(){
        var currentIdx = pageOrder.indexOf(currentPage);
        if(currentIdx < 0){
            currentIdx = 0; // just start over if something breaks
        }
        var nextIdx = currentIdx >= (pageOrder.length -1) 
                    ? 0 // start back over
                    : currentIdx + 1;
        
        var pg =  pageOrder[nextIdx];
        return pg || pageOrder[0];
    }
        
    function getCurrentPage(){
        var path = document.location.pathname;
        var lastSlash = path.lastIndexOf("/");
        var page = path.substring(lastSlash + 1) || "index.html";
        
        return page.toLowerCase();
    }
    
});