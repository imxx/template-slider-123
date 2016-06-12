(function(){
    "use strict";

    new App.Slider(document.getElementById("slider"), {
        automoving: true,
        paging: true,
        step: 1,
        slidesOnTheScreen: 3
    });

})();