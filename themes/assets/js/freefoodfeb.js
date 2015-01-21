
      //document.domain = "slimmingworld.dev";

/* ######################################################

Doc ready functions

#######################################################*/

$(document).ready(function() {

       setupMasonary();
       $('.theme__holder').removeClass('loading');
       $('.theme__card__header').arctext({radius: 280});
    // click event listener for the individual cards
       themeListener();
}); // close $ready

/* ######################################################

Instantiate masonary

#######################################################*/

setupMasonary=function(){
   // arrange items using masonary
    var $container = $('.theme__holder');
    $container.imagesLoaded( function() {
        $container.masonry({
          itemSelector: '.theme__card'
            });
        });
   };



/* ######################################################

Event listeners for clicks on the thumb cards

#######################################################*/

themeListener = function(){
    // listener on navigation item
    $('#js-themes-nav').click(function(event){
        event.preventDefault();
        // remove the menu thats showing
        removeThemePage();
        // fade in the thumbnails
    });

    // click event listeners on the theme cards
    $('.theme__card__link').click(function(event){
        event.preventDefault();
        $(this).addClass('visited');
        fadeCard($(this).parent(), '0.5', '0'); // force this one as we want it to dissapear immediately
        var pageToLoad=($(this)).attr('href');
        fadeAllThumbs('out', pageToLoad); // can be in or out#

        //load the main theme page, consisting of a menu with links to recipes
    });
};


/* ######################################################

The animations for cards fading in and out

#######################################################*/

// function to animate opacity and scale
fadeCard = function(elem, cardScale, cardOpacity){
    elem.transition({ // requires transit.js
    scale:cardScale,
    opacity:cardOpacity,
//    rotateY: '360deg'
    },
    275,
    'easeOutSine'
    )
}

/* ######################################################

Fade in or out the theme card thumbs

#######################################################*/

fadeAllThumbs=function(inOrOut, pageToLoad){
    // some basic vars dependent on wether we are going in or out
    if  (inOrOut=='out'){
        var cardScale="0.5";
        var cardOpacity="0";
        var navOpacity="1";
        var navPosition="-16px"; // matches the original value set in css. not very maintainable
        var delayNav="1050"; // we want the nav to delay when its sliding in, but not if its sliding out
    } else {
        var cardScale="1";
        var cardOpacity="1";
        var navOpacity="0";
        var navPosition="-172px";
        var delayNav="0"; // start immediately if its been clicked to fade the thumbs back in
    }


    //loop through the thumbs and fade them in or out
        $.each(cardArray, function(i, val) {
            setTimeout(function() {
                fadeCard($(val), cardScale, cardOpacity);


            // if we're on the last card, start to bring in the menu
            if ((i+1)==cardArray.length && inOrOut=='out'){

               loadThemePage(pageToLoad);
            }

            }, (i+1) * 125); // add a slight delay to get the aniamtions starts staggered

        });


    // fade + slide the nav in or out
    setTimeout(function() {
    $('#js-themes-nav').transition({
            opacity:navOpacity,
            left:navPosition,
        }, 350); // animation timing
    }, delayNav); // delay start timing, should be 0 when this is fading out so it responds immediately to click
};

/* ######################################################

loadThemePage: main theme page with menu and link to recipes

#######################################################*/

loadThemePage=function(whichPage){

   // Create a holder with loading text. Create this here so we can have a nice loading function.
   // $('#results').append('<section class="fff-panel loading" id="json-'+whichPage+'">loading&hellip;</section>');

   var pageToLoad=whichPage + ' .menu'; // just traget the menu element

   $('.theme__holder').append('<div class="menu__holder"></div>'); // this will get deleted when we dont need it

   $('.menu__holder').load(pageToLoad, function(){
            $('.menu__card__header').arctext({radius: 720});
            $('.menu').transition({
                opacity:1,
                left:'240px',
                visibility:'visible',
                rotate:'-3deg',
            }, 320);

            // set up the events listeners
            recipeClickEvents();
    });
};



removeThemePage=function(){
    $('.menu').transition({
        opacity:0,
        visibility:'hidden',
         rotate:'3deg',
    }, 225, function(){
         $('.menu__holder').remove(); // delete the holder, it gets recreated
        fadeAllThumbs('in');
    });
}

/* ######################################################

Listener events for recipes
Needs to be called when the menu load completes

#######################################################*/
recipeClickEvents=function(){
        $('.recipe-loader').click(function(event){
            event.preventDefault();
            var pageToLoad=$(this).attr('href');

            animateMenu(pageToLoad);
        });
    };

animateMenu=function(pageToLoad){

    $('.menu').transition({
           scale:0.65,
        //position:'absolute',
            left:0,
            rotate:'1deg'
        }, 255, function(){

        loadRecipe(pageToLoad);

    });
}

loadRecipe=function(pageToLoad){


            if ($('.recipe__holder')) { // check if one exisits...
                  $('.recipe__holder').transition({ //... and remove it if it does
                        opacity:0 //fade out
                  }, 1355, function(){
                      $(this).remove(); // delete
                  })
            } // end if


            $('.menu__holder').after('<div class="recipe__holder"></div>');

            $('.recipe__holder').append('<img src="../assets/images/ajaxloader.gif" class="loader">');

            loadFragment=pageToLoad + ' #main'; // The quotes must have space character at the start.

            $('.recipe__holder').load(loadFragment, function(){
                  parseRecipe();
            });
        }



parseRecipe=function(){
    $('.recipe__holder').transition({
        opacity:1,
        left:'+40px'
    }, 700)
}
/* ######################################################

Define the array for the theme cards - doesnt seem to work on $ready

#######################################################*/

    // store all the card onjects in an array, we loop through them later to create the sequential animations etc
    var cards = $('.theme__card');
    var cardArray = $.makeArray(cards);
