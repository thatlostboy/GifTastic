listOfObjects = ['star wars', 'hello kitty', 'amazon alexa'];
Favorites = [];

var apikey = "9113ts3GR3ub5Fo63y5ppzFca9icpJoL";

$(document).ready(function () {

    renderButtonList(listOfObjects, ".imgButtonList");

    $("body").on("click", ".imgButton", function (event) {
        event.preventDefault();
        var buttonVal = this.innerText

        // this will queryGiphy and then send it to the renderGiphy
        queryGiphy (apikey, buttonVal, ".imgResultList", 10);
    })

    $("body").on("click", ".giphyImg", function (event) {
        event.preventDefault();
        console.log(this);
        animURL = $(this).attr("srcanim");
        stillURL =$(this).attr("srcstill");
        if ($(this).attr("srcstate") == "still") {
            console.log("We are still!");
            $(this).attr("srcstate","anim");
            $(this).attr("src", animURL);
        } else {
            console.log("We are animated!");
            $(this).attr("srcstate","still");
            $(this).attr("src", stillURL);
        }
    })



    $("body").on("click", ".addBtn", function (event) {
        event.preventDefault();
        console.log("Clicked addBtn");

        // grab value in text area
        var newBtnText = $("#addName").val().trim();

        // if text is not blank, add it to button list and render
        //  a new button list
        if (newBtnText) {
            // clear value
            $("#addName").val("");
            console.log(newBtnText);
            listOfObjects.push(newBtnText);
            renderButtonList(listOfObjects, ".imgButtonList");
        } else {
            console.log("Nothing!")
        }
   
    })

});

// render button list
function renderButtonList(btnList, btnDiv) {
    $(btnDiv).empty();
    for (let i=0; i<btnList.length; i++) {
        let imgBtn = $("<button>");
        imgBtn.html(btnList[i]);
        // add more classes
        imgBtn.addClass("imgButton");
        $(btnDiv).append(imgBtn);
    }
}

function queryGiphy(apikey, searchStr, imgDiv, limit) {
    var baseURL = 'https://api.giphy.com/v1/gifs/search?';
    var queryParams = { 
        "api_key": apikey,
        "q":searchStr,
        "limit":limit,
        "lang": "en",
    }
    
    //$.param does the urlenoding
    queryURL = baseURL + $.param(queryParams);

    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response.data);
        renderGiphyImg(response.data, imgDiv, searchStr);
    });
}


// render image 
function renderGiphyImg(giphyObj, imgDiv, altName) {
    // rewrite this
        $(imgDiv).empty();
        
        for (let i=0; i<giphyObj.length; i++) {
            // create div element
            let imgItemSpan = $("<card>");
            // create p element            
            let p = $("<p>");
            let rating = "Rating: "+giphyObj[i].rating;
            p.append(rating);

            // create image element with three addtiional attributes
            //  srcAnim is the url of the animated gif
            //  srcStill is the url of the still gif
            //  srcState is the current gif being used--still or animated
            let imgStill = giphyObj[i].images.fixed_height_still.url;
            let imgAnimated = giphyObj[i].images.fixed_height.url;
            let imgItem = $("<img>");
            imgItem.addClass("giphyImg");
            imgItem.attr("src", imgStill);
            imgItem.attr("alt", altName);
            imgItem.attr("srcAnim", imgAnimated);
            imgItem.attr("srcStill", imgStill);
            imgItem.attr("srcState", "still");
            console.log(imgItem);

            // append p and img element to new div
            
            $(imgItemSpan).append(p, imgItem);
            console.log($(imgItemSpan));
            $(imgDiv).append(imgItemSpan);
        }
    }
    
