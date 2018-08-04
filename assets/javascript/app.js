// check if list of topics exist in local storage
var listOfTopics = JSON.parse(localStorage.getItem("topicList"));

if (!Array.isArray(listOfTopics)) {
    listOfTopics = ['hello'];
}


// check if the favorites exists in local Storage 
var listofFavImgsJSON = localStorage.getItem("favImgList");

// if it doesn't exist, create one  
if (listofFavImgsJSON === null) {
    var listOfFavImgs = {};
    // initialize the storage variable.  safari didn't store it correctly. 
    // it initializes it as a array, so this method will initialize it as an 
    // object
    storeValues(listOfTopics, listOfFavImgs);
    console.log("no favorite images");
} else {
    var listOfFavImgs = JSON.parse(listofFavImgsJSON);
    console.log("found some images");
}


// slack URL for API
// post to slack URL using javascript  https://gist.github.com/achavez/9767499
// slackURL1 is the vanwong-test private channel in ucirv20180612online.  
// slackURL2 is the random public channel in ucirv20180612online.  
// slackURL3 is the van random public channel in ucirv20180612online.  
var slackURL1 = "https://hooks.slack.com/services/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";   //   vanwong-test private channel
var slackURL2 = "https://hooks.slack.com/services/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";  // random public channel
var slackURL3 = "https://hooks.slack.com/services/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";  // van-random public channel

// giphy
var apikey = "9113ts3GR3ub5Fo63y5ppzFca9icpJoL";
var giphyLimit = 10;  // number of recrods at a time
var giphyRating = "pg-13";

$(document).ready(function () {


    renderTopicList(listOfTopics, ".imgButtonList");

    renderFavGiphyImgList(listOfFavImgs, ".imgFavResultList");

    // add to Topics , add button to top area
    $("body").on("click", ".addBtn", function (event) {
        event.preventDefault();
        console.log("Clicked addBtn");
        addTopicEventHandler();
    })


    // click on Topic button to get pictures--activate API request for giphy items
    $("body").on("click", ".selTopic", function (event) {
        event.preventDefault();
        var buttonVal = this.innerText
        var giphyOffset = parseInt($(this).attr("giphyoffset"));
        var giphyMax = parseInt($(this).attr("giphymax"));

        // add code to disable buttons while loading and reenable buttons later

        // capture console los
        console.log("Clicked on button!", giphyOffset, giphyMax);

        // if the button is not clicked yet, taht means they switched topics
        // so reset all other offset to zero and start this one at 
        if (giphyOffset === 0) {
            // clear out div
            $(".imgResultList").empty();

            // run query on the first set of 10
            queryGiphy(apikey, buttonVal, ".imgResultList", giphyLimit, 0, giphyRating, this);

            // reset all others giphyOffset's to zero
            $(".selTopic").attr("giphyOffset", 0);

            // increment counter to the next 10
            giphyOffset = giphyOffset + giphyLimit + 1;

            // set selected button to a new value for giphyOffset
            $(this).attr("giphyoffset", giphyOffset);
            // if clicking on same button, append more pictures.  
        } else if (giphyOffset <= giphyMax) {

            // run query on the next set of 10;
            queryGiphy(apikey, buttonVal, ".imgResultList", giphyLimit, giphyOffset, giphyRating, this);

            // increment counter to the next 10
            giphyOffset = giphyOffset + giphyLimit;

            // set selected button to a new value for giphyOffset
            $(this).attr("giphyoffset", giphyOffset);
            // if passed the maximum available pictures found, send a message out
        } else {
            alert("There are no more images!")
        }

    })

    // toggle image between still and animated
    $("body").on("click", ".giphyImg", function (event) {
        event.preventDefault();
        console.log(this);

        animURL = $(this).attr("srcanim");
        stillURL = $(this).attr("srcstill");

        // toggle conditionals between still and animated 
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

    // click on the "X" to remove topic button from button list
    $("body").on("click", ".delXTopic", function (event) {
        // both single and double click event will register but that's okay
        event.preventDefault();
        var buttonIdx = $(this).attr("arrayidx");
        console.log("-------------------> " + buttonIdx + " got double clicked");
        listOfTopics.splice(buttonIdx, 1);

        // store values on client localStorage and render image
        storeValues(listOfTopics, listOfFavImgs);
        renderTopicList(listOfTopics, ".imgButtonList");
    })

    // send to Slack
    $("body").on("click", ".sendToSlack", function (event) {
        var textMsg = prompt("What text message do you want to accompany image?");
        console.log(textMsg);
        var imgURL = $(this).attr("imageurl");
        var confirmed = confirm("Are you sure you want to send the image to the class slack 'random' public channel?");
        if (confirmed) {
            alert("Messages sent to slack! :" + textMsg + " " + imgURL);
            sendToSlack(slackURL3, textMsg, imgURL);
        }
    })


    // clear all favorites from Tab
    $("body").on("click", ".clearAllFavBtn", function (event) {
        event.preventDefault();
        console.log("Clicketed delete all");
        if (confirm("Are you sure you want to remove all your favorites?")) {

            // clear favorite array
            listOfFavImgs = {};

            //store values
            storeValues(listOfTopics, listOfFavImgs);

            //render favorites
            renderFavGiphyImgList(listOfFavImgs, ".imgFavResultList");

            console.log("Deleted All");

        } else {
            console.log("Did not delete any");
        }
    })


    // delete selected favorite
    $("body").on("click", ".removeFav", function (event) {
        event.preventDefault();
        var slug = $(this).attr("slug");
        if (confirm("Are you sure you want to delete this image?")) {
            console.log("Deleted singele image");

            // delete single favorite
            removeSingleFavImg(listOfFavImgs, slug, "div.favCard");

            //store values
            storeValues(listOfTopics, listOfFavImgs);

            //render favorites
            renderFavGiphyImgList(listOfFavImgs, ".imgFavResultList");

        } else {
            console.log("Did not delete any");
        }
    });



    // add image to favorites tab  (click on heart on card footer in search)
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
            newImgObj.rating = $(this).attr("rating");
            console.log("add fav", newImgObj);

            // add to index based on slug, since slug looks unique
            listOfFavImgs[newImgObj.slug] = newImgObj;

            //store values
            storeValues(listOfTopics, listOfFavImgs);

            //render favorites
            renderFavGiphyImgList(listOfFavImgs, ".imgFavResultList");

            // alert added to FAvorites
            alert("Added to Favorites Tab: " + slugtag);


        } else {
            console.log("found it in array already! ")
            alert("Already in Favorites Tab!");
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


function removeSingleFavImg(favList, slugID, cssID) {
    //cssID = "div.favCard"

    selector = cssID + "[slug='" + slugID + "']";
    // remove card element based on slug value 
    //$("div.favCard[slug='vintage-superman-comics-3HSzHiDUtNLhu']").remove()

    // remove from screen
    console.log(slugID);
    $(selector).remove();

    // remove item from Fav Array
    console.log("before: ", favList);
    delete favList[slugID];
    console.log("after: ", favList);

    //store values
    storeValues(listOfTopics, favList);

    //render favorites
    renderFavGiphyImgList(favList, ".imgFavResultList");

}


function addTopicEventHandler() {

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
        listOfTopics.push(newBtnText);

        // store values on client localStorage and render image
        storeValues(listOfTopics, listOfFavImgs);
        renderTopicList(listOfTopics, ".imgButtonList");
    } else {
        console.log("Nothing!")
    }
}


// render button list
function renderTopicList(topicList, btnDiv) {

    $(btnDiv).empty();

    for (let i = 0; i < topicList.length; i++) {

        // div for button group
        let btnGroup = $("<div>");
        btnGroup.addClass("btn-group imgButtonGrp");

        // button 1 of button group (add to display)
        let imgBtn = $("<button>");
        imgBtn.html(topicList[i]);
        imgBtn.attr("arrayidx", i);
        imgBtn.attr("giphyoffset", 0);
        imgBtn.attr("giphymax", 1000000);
        // add more classes
        imgBtn.addClass("selTopic btn btn-secondary btn-sm leftPadding");


        // button 2 of button group (delete)
        let delXBtn = $("<button>");
        delXBtn.addClass(" btn btn-secondary btn-sm delXTopic");
        delXBtn.attr("arrayidx", i);
        delXBtn.html("X");

        // combine btn1 and btn2 to buttongroup
        btnGroup.append(delXBtn, imgBtn);

        // add buttongroup to div
        $(btnDiv).append(btnGroup);
    }
}


// query giphy API for images
function queryGiphy(apikey, searchStr, imgDiv, limit, offset, rating, buttonClicked) {
    var baseURL = 'https://api.giphy.com/v1/gifs/search?';
    var queryParams = {
        "api_key": apikey,
        "q": searchStr,
        "rating": rating,
        "offset": offset,
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
        console.log(response);

        // put in an accurate count of maximum for the giphy 
        $(buttonClicked).attr("giphyMax", response['pagination']['total_count']);
        renderGiphyImgLst(response, imgDiv, searchStr);
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

        // create image element with three addtiional attributes
        //  srcAnim is the url of the animated gif
        //  srcStill is the url of the still gif
        //  srcState is the current gif being used--still or animated
        let imgStill = favList[index]["srcStill"];
        let imgAnimated = favList[index]["srcAnim"];
        let imgSlug = favList[index]["slug"];   // grab a unique identifier to place into delX
        let ratingText = favList[index]["rating"];  // for footer
        console.log(favList[index]);
        console.log("favorite rating: ", ratingText);


        ///// create card elements
        let imgCard = $("<div>");
        imgCard.addClass("card favCard");
        imgCard.attr("slug", imgSlug);


        // create card body
        let cardBody = $("<div>");
        cardBody.addClass("card-img-top");

        // create card-footer element            
        let cardFooter = $("<div>");
        cardFooter.addClass("card-footer");

        ///////  card footer compoentns
        // create Delete Button and store values in it
        let delBtn = $("<button>");
        delBtn.addClass("removeFav");
        delBtn.attr("srcAnim", imgAnimated);
        delBtn.attr("srcStill", imgStill);
        delBtn.attr("slug", imgSlug);
        delBtn.text("X");

        // create slack icon 
        let slackBtn = $("<img>");
        slackBtn.attr("src", "./assets/images/slack-tiny.jpg");
        slackBtn.attr("alt", "slack");
        slackBtn.addClass("sendToSlack img-fluid");
        slackBtn.attr("imageURL", imgAnimated);


        // add slackBtn and delBtn to card footer
        cardFooter.append(slackBtn, delBtn);

        //////// card body components
        // add attributes to img
        let imgItem = $("<img>");
        imgItem.addClass("giphyImg");
        imgItem.attr("src", imgAnimated);
        imgItem.attr("alt", imgSlug);
        imgItem.attr("srcAnim", imgAnimated);
        imgItem.attr("srcStill", imgStill);
        imgItem.attr("slug", imgSlug);
        imgItem.attr("srcState", "anim");
        imgItem.addClass("img-fluid");

        //add img element to card-body
        cardBody.append(imgItem);

        ///////  complete card
        // append p and img element to new div
        imgCard.append(cardBody, cardFooter);
        // console.log(imgCard);
        $(imgDiv).append(imgCard);
    }

}


// render image 
function renderGiphyImgLst(giphyFullObj, imgDiv, altName) {


    // giphyObj images
    giphyObj = giphyFullObj.data;

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
        favBtn.addClass("addFav");
        favBtn.attr("srcAnim", imgAnimated);
        favBtn.attr("srcStill", imgStill);
        favBtn.attr("slug", imgSlug);
        favBtn.attr("rating", rating);
        favBtn.html('<i class="fas fa-heart"></i>');


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
        // console.log(imgCard);
        $(imgDiv).prepend(imgCard);
    }
}

// store topics and favorites
function storeValues(topicList, favImgList) {
    localStorage.clear();

    var topicListJSON = JSON.stringify(topicList);
    localStorage.setItem("topicList", topicListJSON);
    console.log("topicList: ", topicListJSON);

    var favImgListJSON = JSON.stringify(favImgList);
    localStorage.setItem("favImgList", favImgListJSON);
    console.log("favImgList: ", favImgList);

}

// send to slack public room
function sendToSlack(url, textMsg, imgURL) {
    var text = imgURL+"\n"+textMsg;

    $.ajax({
        data: 'payload=' + JSON.stringify({
            "text": text
        }),
        dataType: 'json',
        processData: false,
        type: 'POST',
        url: url
    }).then(function(response) {
        // have no idea 
        console.log(response);
    });
}

