import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { Gradient } from './hero.js';
import optimizeTicker from './tick-optimizer';
import { getCssVariableInPixels } from './utilities';

gsap.registerPlugin(ScrollTrigger, Flip);

optimizeTicker(gsap, 30);

const heroBarHeight = getCssVariableInPixels("--hero-bar-height");
const profileMargin = getCssVariableInPixels("--profile-margin");
const profileImageHeight = heroBarHeight - (profileMargin * 2);
const frameMarginLeft = (document.querySelector('.projects .view .frame') as HTMLElement).offsetLeft;

gsap.timeline({
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: `bottom-=${heroBarHeight} top`,
    markers: false,
    pinSpacing: false,
    scrub: true
  }
})
.to(".hero .profile", {
  marginBottom: profileMargin,
  gap: "0.75rem",
  ease: 'power4.inOut',
})
.to(".hero .profile .frame", {
  height: profileImageHeight,
  width: profileImageHeight,
  ease: 'power4.inOut',
}, "<")
.to(".hero .profile", {
  gap: "1rem",
  ease: 'power4.inOut'
}, "<")
.to(".hero .profile .info .name", {
  fontSize: "1.5rem",
  ease: 'power4.inOut'
}, "<")
.to([".hero .profile .info .title", ".hero .profile .contact .email", ".hero .profile .contact .phone"], {
  fontSize: "1rem",
  ease: 'power4.inOut',
}, "<")
.to(".hero .scroll", {
  opacity: 0,
  marginBottom: -heroBarHeight,
  ease: 'power4.out',
}, "<")
.to("#gradient-canvas", {
  opacity: 0,
  ease: 'power4.inOut',
}, "<");

ScrollTrigger.create({
  trigger: ".hero",
  start: `bottom-=${heroBarHeight} top`,
  endTrigger: "body",
  end: `bottom-=${heroBarHeight} top`,
  scrub: true,
  markers: false,
  pin: true,
  pinSpacing: false
});

gsap.from('.projects .view .frame', {
  width: "25%",
  borderRadius: 0,
  marginRight: `${frameMarginLeft}px`,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'bottom bottom',
    end: `bottom top+=${heroBarHeight}`,
    scrub: true,
    markers: false,
    pinSpacing: false
  }
});

ScrollTrigger.create({
  trigger: '.projects',
  start: heroBarHeight > 0 ? `top top+=${heroBarHeight}` : "top top",
  endTrigger: 'body',
  end: heroBarHeight > 0 ? `bottom-=${heroBarHeight} top` : "bottom top",
  scrub: true,
  markers: false,
  pin: '.projects .view .images',
  pinSpacing: false
});

// Hide all images except the very first
document.querySelectorAll('.view .frame .image').forEach(img => (img as HTMLElement).style.opacity = "0");
(document.querySelector('.view .frame .image[data-project="0"][data-slide="0"]') as HTMLElement).style.opacity = "1";

// Set all descriptions to faded, only the very first is full
document.querySelectorAll('.description').forEach(slide => slide.classList.remove('active-desc'));
(document.querySelector('.description[data-slide="0"]') as HTMLElement).classList.add('active-desc');

// For each slide, scrubbed crossfade between images as before,
// PLUS: update active-desc class on bulletpoints as you scroll
document.querySelectorAll('.projects .view .content .info').forEach((projectEl, projectIdx) => {
  const titleEl = projectEl.querySelector('.title') as HTMLElement;
  ScrollTrigger.create({
    trigger: projectEl,
    start: heroBarHeight > 0 ? `top top+=${heroBarHeight}` : "top top",
    endTrigger: '.projects .view .content',
    end: heroBarHeight > 0 ? `bottom-=${heroBarHeight} top` : "bottom top",
    scrub: true,
    markers: false,
    pinSpacing: false,
    pin: titleEl
  });

Array.from(projectEl.querySelectorAll('.description')).forEach((slideEl, slideIdx) => {
    let nextImg = document.querySelector(`.image[data-project="${projectIdx}"][data-slide="${slideIdx}"]`) as HTMLElement;
    let prevImg = null;
    if (slideIdx === 0 && projectIdx > 0) {
      prevImg = document.querySelector(`.image[data-project="${projectIdx-1}"][data-slide="2"]`) as HTMLElement;
    } else if (slideIdx > 0) {
      prevImg = document.querySelector(`.image[data-project="${projectIdx}"][data-slide="${slideIdx-1}"]`) as HTMLElement;
    }
    if (prevImg && nextImg) {
      gsap.timeline({
        scrollTrigger: {
          trigger: slideEl,
          start: "top 60%",
          end: "top 30%",
          scrub: true,
          markers: false,
        }
      })
      .to(prevImg, { opacity: 0, ease: "none" }, 0)
      .to(nextImg, { opacity: 1, ease: "none" }, 0);
    } else if (nextImg && projectIdx === 0 && slideIdx === 0) {
      nextImg.style.opacity = "1";
    }
    
    ScrollTrigger.create({
      trigger: slideEl,
      start: "top 50%",
      end: "bottom 50%",
      markers: false,
      onEnter: () => updateActiveDesc(slideEl as HTMLElement),
      onEnterBack: () => updateActiveDesc(slideEl as HTMLElement)
    });

    ScrollTrigger.create({
      trigger: slideEl,
      start: heroBarHeight > 0 ? `top top+=${heroBarHeight}` : "top top",
      endTrigger: '.projects .view .content',
      end: heroBarHeight > 0 ? `bottom-=${heroBarHeight} top` : "bottom top",
      scrub: true,
      markers: false,
      pinSpacing: false,
      pin: true
    });
  });
});

function updateActiveDesc(activeSlide: HTMLElement) {
  document.querySelectorAll('.description').forEach(slide => {
    slide.classList.toggle('active-desc', slide === activeSlide);
  });
}

const gradient = new Gradient();
gradient.initGradient("#gradient-canvas");