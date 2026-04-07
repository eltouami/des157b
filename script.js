(function() {
    'use strict';

    // no button anymore, rest took inspiration from how template was set up
    const flip = document.querySelector('.basket-wrap');
    const body = document.querySelector('body');
    const banner = document.querySelector('#banner');
    const sections = document.querySelectorAll('section');
    const stars = document.querySelectorAll('.star');
    const stickers = document.querySelectorAll('.sticker');
    const basketImg = document.querySelector('.basket');
    let mode = 'dark';

    flip.addEventListener('click', function() {
        if (mode === 'dark') {
            body.classList.add('switch');
            banner.classList.add('switch');
            flip.classList.add('switch');
            sections.forEach(s => s.classList.add('switch'));
            stars.forEach(s => s.classList.add('switch'));
            stickers.forEach(s => s.classList.add('switch'));
            basketImg.src = 'images/basket-black2.png';
            mode = 'light';
        } else {
            body.classList.remove('switch');
            banner.classList.remove('switch');
            flip.classList.remove('switch');
            sections.forEach(s => s.classList.remove('switch'));
            stars.forEach(s => s.classList.remove('switch'));
            stickers.forEach(s => s.classList.remove('switch'));
            basketImg.src = 'images/basket-white2.png';
            mode = 'dark';
        }
    });
})();