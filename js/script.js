window.addEventListener('DOMContentLoaded', () => {
    //TABS
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        })
        tabs.forEach(item => item.classList.remove('tabheader__item_active'));
    };

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    };

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {
        const target = e.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((tab, i) => {
                if (target === tab) {
                    hideTabContent();
                    showTabContent(i);
                }
            })
        }
    });

    //TIMER

    const deadline = '2022-11-18';

    function getTimeRemaining(endtime) {
        const differenceInMSec = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(differenceInMSec / (1000 * 60 * 60 * 24)),
            hours = Math.floor((differenceInMSec / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((differenceInMSec / (1000 * 60)) % 60),
            seconds = Math.floor((differenceInMSec / 1000) % 60);

        return {
            total: differenceInMSec,
            days,
            hours,
            minutes,
            seconds
        };
    };

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds');
        timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {

            const t = getTimeRemaining(endtime);

            days.innerHTML = t.days;
            t.hours < 10 ? hours.innerHTML = `0${t.hours}` : hours.innerHTML = t.hours;
            t.minutes < 10 ? minutes.innerHTML = `0${t.minutes}` : minutes.innerHTML = t.minutes;
            t.seconds < 10 ? seconds.innerHTML = `0${t.seconds}` : seconds.innerHTML = t.seconds;

            if (t.total <= 0) {
                clearInterval(timeInterval);
            };
        };
    };

    setClock('.timer', deadline);

    //Modal

    const modalWindow = document.querySelector('.modal'),
        modalOpenBtns = document.querySelectorAll('[data-openModal]');


    function openModal(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerID);
    };

    function closeModal(modal) {
        modal.style.display = ' none';
        document.body.style.overflow = '';
    };

    modalOpenBtns.forEach(btn => btn.addEventListener('click', () => openModal(modalWindow)));

    modalWindow.addEventListener('click', (e) => {
        if (e.target === modalWindow || e.target.getAttribute('data-closemodal') === '') {
            closeModal(modalWindow);
        };
    });
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modalWindow.style.display === 'block') {
            closeModal(modalWindow)
        };
    });

    const modalTimerID = setTimeout(() => openModal(modalWindow), 60000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal(modalWindow)
            window.removeEventListener('scroll', showModalByScroll);
        };
    };

    window.addEventListener('scroll', showModalByScroll);

    // menuCards

    class MenuCard {
        constructor(src, alt, title, decription, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.decription = decription;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer
        }

        render() {
            const cardElement = document.createElement('div');
            if (this.classes.includes('menu__item')) {
                this.classes.forEach(className => cardElement.classList.add(className))
            } else {
                cardElement.classList.add('menu__item');
                this.classes.forEach(className => cardElement.classList.add(className))
            }
            cardElement.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.decription}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(cardElement);
        }
    };

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container',
        'big'
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан ресторан ресторан!',
        21,
        '.menu .container',
        'menu__item',
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню “Постное”',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        14,
        '.menu .container',
    ).render();

    //sendingDataToServer

    const forms = document.querySelectorAll('form');

    forms.forEach(form => postData(form));

    const message = {
        loading: 'Loading...',
        succes: "Thank you. We'll call you",
        failure: 'Something went wrong'
    }

    //FormData

    /*     function postData(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
    
                const statusMessage = document.createElement('div');
                statusMessage.classList.add('status');
                statusMessage.textContent = message.loading;
                form.append(statusMessage);
                
                
                const request = new XMLHttpRequest();
                request.open('POST', '../server.php');
    
                // request.setRequestHeader('Content-type', 'multipart/form-data');
                const formData = new FormData(form);
                
                request.send(formData);
    
                request.addEventListener('load', () => {
                    if (request.status === 200) {
                        console.log(request.response)
                        statusMessage.textContent = message.succes;
                        form.reset();
                        setTimeout(() => {
                            statusMessage.textContent = '';
                        }, 2000)
                    } else {
                        statusMessage.textContent = message.failure;
                    };
                });
    
            });
        }; */

    //JSON

    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            statusMessage.textContent = message.loading;
            form.append(statusMessage);


            const request = new XMLHttpRequest();
            request.open('POST', '../../server.php');

            request.setRequestHeader('Content-type', 'application/json');
            const formData = new FormData(form);

            const obj = {};

            formData.forEach((value, key) => {
                obj[key] = value;
            });

            const json = JSON.stringify(obj);

            request.send(json);

            request.addEventListener('load', () => {
                if (request.status === 200) {
                    showThanksModal(message.succes);
                    form.reset();
                    statusMessage.remove();
                } else {
                    showThanksModal(message.failure);
                };
            });

        });
    };


    //

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal(modalWindow);

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class='modal__content'>
                <div class='modal__close' data-closemodal>×</div>
                <div class='modal__title'>${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal(modalWindow);
        }, 3000);
    };

});