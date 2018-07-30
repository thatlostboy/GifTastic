# GifTastic
#
Tech Used:
- Giphy API, Slack API
- localStorage on client to remember buttons and favorites 
- HTML, CSS, javascript, jquery, bootstrap 4, ajax



Basic Features:
1)  Choose any topic by typing it in the form box, pressing enter or click "Add Topic"
2)  Button above should appear with Topic LIst.
3)  Click on Button and it will generate 10 still images based on using the Giphy API search interface
4)  The image will include the Rating on it.  The search is filtered up to PG-13.   
5)  Click on the still image and it will load the animated version of the image




Bonus Features

1) App is mobile responsive and uses cards columns feature to generate the pinterest look (too bad the card sequence goes vertical instead of horizontal)

2) The topic buttons have a "X" on the right so you can delete the button if it gets cluttered.

3) Storing Favorites from the Search Tab:
    - There is a favorite TAb (bootstrap 4 tabs) to store favorites
    - Each image, there is a favorites buttons (heart) on card footer right side. 
    - Each image, if you click on favoties button (heart), it will copy it to the favorites Tab
    - if you click favorite button on the same image, it will detect it and notify you that you already stored it.

4) Managing Favoties form the Favorites Tab:
    - there is a "clear all favorites" button to delete all favotires. 
    - you can remove individual images by click the red "X"
    - there is a slack icon, so you can send the URL of th image along with the message to the public slack channel "random" in the "ucirv20180612online" slack group.  


5) Favorites and Topics are stored in the client's "localStorage" so it will be remembered when users return


6) For each topic, click the same button will add 10 additional images.  This is to help you find an appropriate image for each topic to "favorite it".  If you click another topic button, the image results will clear to the first 10 again of the "new Topic". 
- Eg.  If you click "star wars" button, you get ten images from giphy for "star wars".  You click "star wars" button again, it will add 10 more star wars.  And if you click it 10 times, you will have 100 images of star wars so you can pick a few you like to favorite.     If you then decide to click on the button "star trek", the div will clear of the 100 images and it will display 10 images from giphy star trek.   And clicking it again 3 more times, will show 30 more pictures from star trek.    You pick the one you like to favorite.    