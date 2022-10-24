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
        constructor(src, alt, title, description, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.description = description;
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
                <div class="menu__item-descr">${this.description}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(cardElement);
        }
    };

    const getResourses = async (url) => {
        const res = await axios.get(url);

        // if (!res.ok) {
        //     throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        // };

        return await res;
    };

    getResourses('http://localhost:3000/menu')
        .then(response => createCard(response.data))

    function createCard(data) {
        data.forEach(({ img, altimg, title, descr, price }) => {
            const element = document.createElement('div');
            element.classList.add('menu__item');
            element.innerHTML = `<img src=${img} alt=${altimg}>
            <h3 class="menu__item-subtitle">${title}</h3>
            <div class="menu__item-descr">${descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${price * 27}</span> грн/день</div>
            </div>
            `;

            document.querySelector('.menu .container').append(element)
        })
    }

    /*     getResourses('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            })
        }); */

    /*     new MenuCard(
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
        ).render(); */

    //sendingDataToServer

    const forms = document.querySelectorAll('form');

    forms.forEach(form => bindPostData(form));

    const message = {
        loading: "img/spinner/spinner.svg",
        succes: "Thank you. We'll call you",
        failure: 'Something went wrong'
    }

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: data
        });

        return await res.json();
    }

    /*     function bindPostData(form) {
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

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.classList.add('spinner')
            statusMessage.src = message.loading;
            statusMessage.alt = 'Loading...'
            // form.append(statusMessage);
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries((formData.entries())));


            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data)
                    showThanksModal(message.succes);
                    statusMessage.remove();
                })
                .catch(() => {
                    showThanksModal(message.failure);
                })
                .finally(() => {
                    form.reset();
                })
        });
    };

    /*     function bindPostData(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
    
                const statusMessage = document.createElement('img');
                statusMessage.classList.add('spinner')
                statusMessage.src = message.loading;
                statusMessage.alt = 'Loading...'
                // form.append(statusMessage);
                form.insertAdjacentElement('afterend', statusMessage);
    
    
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
        }; */


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

    //slider 1

    const slides = document.querySelectorAll('.offer__slide'),
        prevBtn = document.querySelector('.offer__slider-prev'),
        nextBtn = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        counter = document.querySelector('#current');

    let slideIndex = 1;
    
    if (slides.length < 10) {
        total.innerHTML = `0${slides.length}`;
    } else {
        total.innerHTML = slides.length;
    };

    function showSlides() {
        slides.forEach(slide => slide.classList.add('hide'));
        slides[slideIndex - 1].classList.remove('hide');
        counter.innerHTML = `0${slideIndex}`
    }

    nextBtn.addEventListener('click', () => {
        slideIndex < slides.length ? slideIndex++ : slideIndex = 1;
        showSlides();
    });

    prevBtn.addEventListener('click', () => {
        slideIndex === 1 ? slideIndex = slides.length : slideIndex--;
        showSlides();
    })

    showSlides()

});