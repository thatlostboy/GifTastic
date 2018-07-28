
var listOfObjects = JSON.parse(localStorage.getItem("btnList"));

if (!Array.isArray(listOfObjects)) {
    listOfObjects = ['hello'];
} 


// check if the favorites exists in local Storage 
var listofFavImgsJSON = localStorage.getItem("favImgList");


if (listofFavImgsJSON === null) {
    var listOfFavImgs = {};
    // initialize the storage variable.  safari didn't store it correctly. 
    storeValues(listOfObjects,listOfFavImgs);
    console.log("no favorite images");
} else {
    var listOfFavImgs = JSON.parse(listofFavImgsJSON);
    console.log("found some images"); 
}



var apikey = "9113ts3GR3ub5Fo63y5ppzFca9icpJoL";

$(document).ready(function () {


    renderButtonList(listOfObjects, ".imgButtonList");

    renderFavGiphyImgList(listOfFavImgs, ".imgFavResultList");

    // activate request for giphy items
    $("body").on("click", ".imgButton", function (event) {
        event.preventDefault();
        var buttonVal = this.innerText

        // this will queryGiphy and then send it to the renderGiphy
        queryGiphy(apikey, buttonVal, ".imgResultList", 10);
    })

    // toggle image between still and animated
    $("body").on("click", ".giphyImg", function (event) {
        event.preventDefault();
        console.log(this);

        animURL = $(this).attr("srcanim");
        stillURL = $(this).attr("srcstill");

        // toggle conditionals 
        if ($(this).attr("srcstate") == "still") {
            // if it's still, reasign the src to the animated URL and srcstate to animated
            console.log("We are still!");
            $(this).attr("srcstate", "anim");
            $(this).attr("src", animURL);
        } else {
            // else it is animated,so reassign the src to the still URL and srcstate to the still one. 
            console.log("We are animated!");
            $(this).attr("srcstate", "still");
            $(this).attr("src", stillURL);
        }
    })

    // delete button
    $("body").on("dblclick", ".imgButton", function (event) {
        // both single and double click event will register but that's okay
        event.preventDefault();
        var buttonIdx = $(this).attr("arrayidx");
        console.log("-------------------> " + buttonIdx + " got double clicked");
        listOfObjects.splice(buttonIdx, 1);

        // store values on client localStorage and render image
        storeValues(listOfObjects, listOfFavImgs);
        renderButtonList(listOfObjects, ".imgButtonList");
    })

    // add button 
    $("body").on("click", ".addBtn", function (event) {
        event.preventDefault();
        console.log("Clicked addBtn");
        addBtnEventHandler();
    })

    // add to favorites
    $("body").on("click", ".addFav", function (event) {
        event.preventDefault();
        console.log($(this).attr("srcanim"));

        let slugtag = $(this).attr("slug");

        // if slug (unique id) isn't already in favorite list, then add to favorite list
        if (!(slugtag in listOfFavImgs)) {

            // create object 
            let newImgObj = {};
            newImgObj.srcAnim = $(this).attr("srcAnim");
            newImgObj.srcStill = $(this).attr("srcStill");
            newImgObj.slug = $(this).attr("slug");

            // add to index basd on slug
            listOfFavImgs[newImgObj.slug] = newImgObj;

            //store values
            storeValues(listOfObjects, listOfFavImgs);

            //render favorites
            renderFavGiphyImgList(listOfFavImgs, ".imgFavResultList");


        } else { 
            console.log("found it in array already! ")
        };
    });

    // allow pressing the enter key to trigger click event, using solution #3 below, 
    // https://www.codeproject.com/Questions/833565/Press-the-enter-key-in-a-text-box-with-jQuery
    // ended up not using, a form element allows the enter key as input  
    /*
    $("#addName").keyup(function (event) {
        event.preventDefault();

        if (event.keyCode == 13) {
            console.log("SAw the Enter Key!");
            $(".addBtn").click();
        };
    });
    */

});



function addBtnEventHandler() {

    // grab button Value
    var newBtnText = $("#addName").val().trim();

    // if text is not blank, add it to button list and render
    //  a new button list
    if (newBtnText) {
        // grab value in text area
        var newBtnText = $("#addName").val().trim();


        // clear value
        $("#addName").val("");
        //console.log(newBtnText);
        listOfObjects.push(newBtnText);

        // store values on client localStorage and render image
        storeValues(listOfObjects, listOfFavImgs);
        renderButtonList(listOfObjects, ".imgButtonList");
    } else {
        console.log("Nothing!")
    }
}


// render button list
function renderButtonList(btnList, btnDiv) {
    $(btnDiv).empty();
    for (let i = 0; i < btnList.length; i++) {
        let imgBtn = $("<button>");
        imgBtn.html(btnList[i]);
        imgBtn.attr("arrayidx", i);
        // add more classes
        imgBtn.addClass("imgButton btn btn-info btn-sm");
        $(btnDiv).append(imgBtn);
    }
}


// query giphy API for images
function queryGiphy(apikey, searchStr, imgDiv, limit) {
    var baseURL = 'https://api.giphy.com/v1/gifs/search?';
    var queryParams = {
        "api_key": apikey,
        "q": searchStr,
        "limit": limit,
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
        renderGiphyImgLst(response.data, imgDiv, searchStr);
    });
}


// render favorites
function renderFavGiphyImgList(favList, imgDiv) {
    // clear out div
    $(imgDiv).empty();

    //console.log("Am i in the render favorite function?");
    //console.log(favList);

    // draw favorites
    for (var index in favList) {
        console.log(index, ":::::", favList[index]);
        let imgItem = $("<img>");
        imgItem.attr("src", favList[index]["srcAnim"]);
        $(imgDiv).append(imgItem);
    }

}


// render image 
function renderGiphyImgLst(giphyObj, imgDiv, altName) {
    // clear out div
    $(imgDiv).empty();

    // draw ten pictures. 
    for (let i = 0; i < giphyObj.length; i++) {

        // create image element with three addtiional attributes
        //  srcAnim is the url of the animated gif
        //  srcStill is the url of the still gif
        //  srcState is the current gif being used--still or animated
        let imgStill = giphyObj[i].images.fixed_height_still.url;
        let imgAnimated = giphyObj[i].images.fixed_height.url;
        let imgSlug = giphyObj[i].slug;   // grab a unique identifier to use for favorites later
        

        // create card element
        let imgCard = $("<div>");
        imgCard.addClass("card imgCard");


        // create card body
        let cardBody = $("<div>");
        cardBody.addClass("card-img-top");

        // create card-footer element            
        let cardFooter = $("<div>");
        cardFooter.addClass("card-footer");
        // create rating text
        let rating = "Rating: " + giphyObj[i].rating;
        // create favorite Buttonand store values in it
        let favBtn = $("<button>");
        favBtn.addClass("addFav btn btn-warning btn-sm");
        favBtn.attr("srcAnim", imgAnimated);
        favBtn.attr("srcStill", imgStill);
        favBtn.attr("slug", imgSlug);
        favBtn.text("FAV");


        // add content to footer
        cardFooter.append(rating, favBtn);


        // add attributes to img
        let imgItem = $("<img>");
        imgItem.addClass("giphyImg");
        imgItem.attr("src", imgStill);
        imgItem.attr("alt", altName);
        imgItem.attr("srcAnim", imgAnimated);
        imgItem.attr("srcStill", imgStill);
        imgItem.attr("slug", imgSlug);
        imgItem.attr("srcState", "still");
        imgItem.addClass("img-fluid");

        //add img element to card-body
        cardBody.append(imgItem);

        // append p and img element to new div
        imgCard.append(cardBody, cardFooter);
        console.log(imgCard);
        $(imgDiv).append(imgCard);
    }
}

// store topics and favorites
function storeValues(btnList, favImgList) {
    localStorage.clear();

    var btnListJSON = JSON.stringify(btnList);
    localStorage.setItem("btnList", btnListJSON);
    console.log("btnList: ", btnListJSON);

    var favImgListJSON = JSON.stringify(favImgList);
    localStorage.setItem("favImgList", favImgListJSON);
    console.log("favImgList: ", favImgList);

}