(function () {
    'use strict';
    console.log('reading js');

    // dom
    const loader = document.getElementById("loader");
    const bgVideo = document.getElementById("bg-video");
    const hoverVideo = document.getElementById("hover-video");
    const preWords = document.getElementById("pre-words");
    const moment = document.getElementById("word-moment");
    const words = preWords.querySelectorAll(".pre-word");

    //test
    const player = document.querySelector('#player');

    // loader
    function hideLoader() {
        loader.classList.add("hidden");
        startReveal();
    }

    bgVideo.addEventListener("canplaythrough", function () {
        setTimeout(hideLoader, 350);
    }, { once: true }); // got help from cs major friend, hides loader once its loaded

    // hides regardless after 5s
    setTimeout(function () {
        if (!loader.classList.contains("hidden")) hideLoader();
    }, 5000);


    // words show up
    function startReveal() {
        bgVideo.currentTime = 0;
        bgVideo.play();

        // 'live in the' words appear first
        setTimeout(function () {
            console.log(words); // making sure words work/visible

            words.forEach(function (word, index) {
                setTimeout(function () {
                    word.classList.add("visible");
                }, index * 400);
            });

        }, 1500);

        // moment appears last
        setTimeout(function () {
            moment.classList.add("visible");
        }, 3000);
    }

    // hover state
    moment.addEventListener("mouseenter", function () {
        if (!moment.classList.contains("visible")) return;

        // hides other words
        preWords.classList.add("hide");

        // swaps background vid
        hoverVideo.currentTime = 0;
        hoverVideo.play();
        hoverVideo.classList.add("active");

        //test
        player.currentTime = 0;
        player.play();
    });

    moment.addEventListener("mouseleave", function () {
        // removes hide class on other words
        preWords.classList.remove("hide");

        // swaps back to original vid
        hoverVideo.classList.remove("active");

        setTimeout(function () {
            if (!hoverVideo.classList.contains("active")) {
                hoverVideo.pause(); // pauses other vid
            }
        }, 500);

        //test
        player.pause();
    });

}());