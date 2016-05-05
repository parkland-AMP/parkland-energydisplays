$(function () {

    var sensorUrl = "http://216.125.253.212/Eniscope/?meterId[]=all&";
    var updateHandle = null;
    var pageCycleDelay = (2 * 60 * 1000); // 2 minutes
    var pageOrder = [
        "index.html",
        "biking.html",
        "burrito.html",
        "macbook.html",
        "phone.html",
        "washing.html"
    ];

    // start doing work
    cycleThroughPages();
    //updateStats();
    
    
    function updateStats(){
        
        updateHandle = setInterval(getData, 30 * 1000);
        
        
        function getData(){
            var url = sensorUrl + new Date().getTime();
            $.get(url, function(data){
            
                console.log(data);
                
            });
        }        
    }
    
    
    function cycleThroughPages(){
        var currentPage = getCurrentPage();
        var nextPage = getNextPage();
        
        setTimeout(moveToNextPage, pageCycleDelay);

        function moveToNextPage(){
            
            if(updateHandle){
                clearInterval(updateHandle);
            }
            
            document.location.assign(nextPage);
        }

        function getNextPage(){
            var currentIdx = pageOrder.indexOf(currentPage) || 0;
            var nextIdx = currentIdx > (pageOrder.length -1) 
                        ? 0
                        : currentIdx + 1;
            
            return pageOrder[nextIdx];
        }
        
        function getCurrentPage(){
            var path = document.location.pathname;
            var lastSlash = path.lastIndexOf("/");
            var page = path.substring(lastSlash + 1) || "index.html";
            
            return page.toLowerCase();
        }
    }
    
});