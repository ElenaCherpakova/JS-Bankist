'use strict';
//Create smooth scrolling
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const message = document.createElement('div');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

message.classList.add('cookie-message');
// message.textContent = 'We use cookies for improved functionality and analytics.';
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// header.prepend(message);

header.append(message);
// header.before(message);
// header.after(message);

// Delete elements
document.querySelector('.btn--close-cookie').addEventListener('click', () => {
  message.remove();
});

// Styles

message.style.backgroundColor = '#37383d';
message.style.width = '120%';
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes
// const logo = document.querySelector('.nav__logo')
// console.log(logo.alt);

btnScrollTo.addEventListener('click', e => {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page navigation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    // console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabbed component

tabsContainer.addEventListener('click', function (e) {
  //matching strategy
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  //Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  //Add active class
  clicked.classList.add('operations__tab--active');
  clicked.classList.add('operations__content--active');

  //Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Menu fade animation

const handlerHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handlerHover.bind(0.5));
nav.addEventListener('mouseout', handlerHover.bind(1));

//Sticky navigation
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//Sticky navigation: Intersection Observer API
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//Reveal section
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

//Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));

//Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = slide => {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = slide => {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();
  //Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });
  dotContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
