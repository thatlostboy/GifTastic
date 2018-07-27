var listOfObjects = JSON.parse(localStorage.getItem("btnList"));

if (!Array.isArray(listOfObjects)) {
    listOfObjects = ['van'];
}

var listOfFavImgs = JSON.parse(localStorage.getItem("favImgList"));

if (!Array.isArray(listOfFavImgs)) {
    listOfFavImgs = []; ``
}



var apikey = "9113ts3GR3ub5Fo63y5ppzFca9icpJoL";

$(document).ready(function () {


    renderButtonList(listOfObjects, ".imgButtonList");

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
        // grab button Value
        var newBtnText = $("#addName").val().trim();

        // if text is not blank, add it to button list and render
        //  a new button list
        if (newBtnText) {
            // grab value in text area
            var newBtnText = $("#addName").val().trim();


            // clear value
            $("#addName").val("");
            console.log(newBtnText);
            listOfObjects.push(newBtnText);

            // store values on client localStorage and render image
            storeValues(listOfObjects, listOfFavImgs);
            renderButtonList(listOfObjects, ".imgButtonList");
        } else {
            console.log("Nothing!")
        }
    })

    // allow pressing the enter key to trigger click event, using solution #3 below
    // https://www.codeproject.com/Questions/833565/Press-the-enter-key-in-a-text-box-with-jQuery
    $("#addName").keyup(function (event) {
        event.preventDefault();

        if (event.keyCode == 13) {
            console.log("SAw the Enter Key!");
            $(".addBtn").click();
        };
    });


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
        console.log(newBtnText);
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
// render image 
function renderFavGiphyImg(favList, imgDiv, altName) {
    // clear out div
    $(imgDiv).empty();

    // draw favorites
    for (let i = 0; i < favList.length; i++) {
        console.log(favList[i]);
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
        let imgItem = $("<img>");

        // create card element
        let imgItemSpan = $("<card>");

        // create card body
        let cardBody = $("<div>");
        cardBody.addClass("card-img-top");

        // create card-footer element            
        let cardFooter = $("<div>");
        cardFooter.addClass("card-footer");
        let rating = "Rating: " + giphyObj[i].rating;
        cardFooter.append(rating);


        // add attributes
        imgItem.addClass("giphyImg");
        imgItem.attr("src", imgStill);
        imgItem.attr("alt", altName);
        imgItem.attr("srcAnim", imgAnimated);
        imgItem.attr("srcStill", imgStill);
        imgItem.attr("srcState", "still");
        imgItem.addClass("img-fluid");

        //add img element to card-body
        cardBody.append(imgItem);

        // append p and img element to new div
        imgItemSpan.append(cardBody, cardFooter);
        imgItemSpan.addClass("imgCard")
        console.log(imgItemSpan);
        $(imgDiv).append(imgItemSpan);
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