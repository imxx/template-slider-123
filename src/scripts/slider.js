(function(){

    "use strict";

    window.App = window.App || {};
    window.App.Slider = Slider;

    function Slider(el, opts){

        var that = this,
            automoving = (opts && opts.automoving) || false,
            automovingInterval = (opts && opts.automovingInterval) || 5000;
        this.paging = (opts && opts.paging) || false;
        this.cssTransitionTime = (opts && opts.cssTransitionTime) || 500;

        this.sliderWidth = el.clientWidth;
        this.slidesOnTheScreen = opts && opts.slidesOnTheScreen || 1;
        this.step = opts && opts.step || 3;

        this.sliderPadding = 50;
        this.slidePadding = 21;

        this.slidesHtml = Array.prototype.slice.call(el.children, 0);
        this.slidesHtmlOriginalLength = this.slidesHtml.length,
        this.addAuxillarySlides();
        this.slidesLength = this.slidesHtml.length,
        this.slideWidth = this.getSlideWidth();
        this.ulWidth = this.getSliderUlWidth();
        this.slideWithPaddingWidth = (this.slideWidth + this.slidePadding * 2);
        this.sliderStartingPosition = this.slideWithPaddingWidth  * this.slidesOnTheScreen;
        this.currentIndex = this.slidesOnTheScreen;

        /*
        *
        *   Creating html for slider
        *
        */

        el.innerHTML = this.prepareFullSliderHtml();

        /*
        *
        *   Attaching listeners
        *
        */

        this.ul = el.querySelector(".sliders-lane");

        el.querySelector(".left-slider-arrow")
            .addEventListener("click", this.goToPrev.bind(this));

        el.querySelector(".right-slider-arrow")
            .addEventListener("click", this.goToNext.bind(this));

        if(this.paging){
            this.pager = el.querySelector(".slider-pager");
            this.pager.addEventListener("click", this.pagerCallback.bind(this));
        }

        if(automoving)
            setInterval(function(){
                that.goToNext();
            }, automovingInterval);



    };

    Slider.prototype.addAuxillarySlides = function(){
        var auxillaryFirstSlides =  this.slidesHtml.slice(0, this.slidesOnTheScreen),
            auxillaryLastSlides =  this.slidesHtml.slice(-this.slidesOnTheScreen);
        
        this.copyNodesToTheBegining(auxillaryLastSlides),
        this.copyNodesToTheEnd(auxillaryFirstSlides);
    };

    Slider.prototype.copyNodesToTheBegining = function(els){
        var i = els.length -1;

        for(; i >= 0; i--){
            this.slidesHtml.unshift(els[i].cloneNode(true))
        }
    };

    Slider.prototype.copyNodesToTheEnd = function(els){
        var elsLength = els.length,
            i;

        for(i = 0; i < elsLength; i++)
            this.slidesHtml.push(els[i].cloneNode(true));
    };

    Slider.prototype.getSlideWidth = function(){
        return (
                (this.sliderWidth - this.sliderPadding * 2) - 
                (this.slidePadding * 2 * (this.slidesOnTheScreen - 1))
               ) / this.slidesOnTheScreen;
    };

    Slider.prototype.getSliderUlWidth = function(){
        return (this.slideWidth + this.slidePadding * 2) * this.slidesLength;
    };

    Slider.prototype.prepareSliderLiHtml = function(){
        var lis = Array(this.slidesLength);

        for(var i = 0; i < this.slidesLength; i++){
            lis[i] = [
                        "<li style='width:", this.slideWidth, "px;",
                                   "margin-left:", this.slidePadding * 2, "px;'",
                            "class='slide'", ">",
                            this.slidesHtml[i].innerHTML,
                        "</li>"
                    ].join("");
        }

        return lis.join("");
    };

    Slider.prototype.preparePagerLiHtml = function(){
        var numberOfThumbnails = Math.ceil(this.slidesHtmlOriginalLength / this.step);
        var lis = Array(numberOfThumbnails),
            i;

        for(i = 0; i < numberOfThumbnails; i++){
            if(i === 0)
                lis[i] = "<li class='active'>" + i + "</li>";
            else
                lis[i] = "<li>" + i + "</li>";
        }

        return lis.join("");
    };

    Slider.prototype.prepareFullSliderHtml = function(){
        var sliderInnerHtml = [
                    "<div class='left-slider-arrow'><</div>",
                    "<div class='right-slider-arrow'>></div>",
                    "<ul class='slider-pager'>", (this.paging) ? this.preparePagerLiHtml() : "", "</ul>",
                    "<div class='slide-frame'>",
                        "<ul class='sliders-lane' style='width:", this.ulWidth, "px;left:-", this.sliderStartingPosition,"px'>",
                            this.prepareSliderLiHtml(),
                        "</ul>",
                    "</div>"
                ];

        return sliderInnerHtml.join("");
    };

    Slider.prototype.pagerCallback = function(e){
        if(e.target.nodeName === "LI"){
            this.setActivePage(parseInt(e.target.innerHTML));
            this.goTo(parseInt(e.target.innerHTML) * this.step + this.slidesOnTheScreen);
        }
    };

    Slider.prototype.setActivePage = function(index){
        if(!this.paging) return;

        var childNodes = this.pager.childNodes,
            childNodesLength = childNodes.length,
            thumbnailsIndex = Math.ceil(index / this.step),
            i;

        for(i = 0; i < childNodesLength; i++){
            childNodes[i].classList.remove("active");
        }

        childNodes[thumbnailsIndex].classList.add("active");
    };

    Slider.prototype.goToPrev = function() {
        this.goTo(this.currentIndex - this.step);
    };

    Slider.prototype.goToNext = function() {
        this.goTo(this.currentIndex + this.step);
    };

    Slider.prototype.goTo = function(index) {
        this.ul.style.left = '-' + (this.slideWithPaddingWidth * index) + 'px';

        var beyondTheRightBorder = this.slidesLength - index - this.step;
        if(beyondTheRightBorder < this.slidesOnTheScreen && index > 0){

            this.currentIndex = this.slidesOnTheScreen;
            this.moveSlidesSilently();
            
        }else if(index <= 0){

            this.currentIndex = this.slidesLength - 2 * this.slidesOnTheScreen;
            this.moveSlidesSilently();

        }else{

            this.currentIndex = index;
        }

        if(index < this.slidesOnTheScreen)
            this.setActivePage(this.slidesLength - (this.slidesOnTheScreen - index) - 2*this.slidesOnTheScreen)
        else
            this.setActivePage(this.currentIndex - this.slidesOnTheScreen);
    };

    Slider.prototype.moveSlidesSilently = function(){
        var that = this;

        setTimeout(function(){

            that.ul.classList.add("notransition");
            that.ul.style.left = "-" + (that.slideWithPaddingWidth * that.currentIndex) + "px";
            //force reflow
            that.ul.offsetHeight;
            that.ul.classList.remove("notransition");

        }, this.cssTransitionTime);
    };

})();