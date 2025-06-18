import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Gradient } from './hero.js';
import optimizeTicker from './tick-optimizer';
import { getCssVariableInPixels } from './utilities';

gsap.registerPlugin(ScrollTrigger);

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
  start: `top top+=${heroBarHeight}`,
  endTrigger: 'body',
  end: `bottom-=${heroBarHeight} top`,
  scrub: true,
  markers: false,
  pin: '.projects .view .images',
  pinSpacing: false
});

const frameHeight = getCssVariableInPixels("--image-frame-height");
const frameMargin = (getCssVariableInPixels("--below-hero-bar-spacing") - frameHeight)/2;
const frameOffset = frameHeight + frameMargin + heroBarHeight;
const infoOffset = frameHeight*(2/3);

gsap.set('.projects .view .content', { paddingTop: frameOffset, paddingBottom: frameOffset });
gsap.set('.projects .view .content .info', { paddingBottom: infoOffset, width: frameHeight });

document.querySelectorAll('.view .frame .image').forEach(img => (img as HTMLElement).style.opacity = "0");
(document.querySelector('.view .frame .image[data-project="0"][data-slide="0"]') as HTMLElement).style.opacity = "1";

document.querySelectorAll('.projects .view .content .info').forEach((projectEl, projectIdx) => {
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
          start: `top 60%`,
          end: `top 30%`,
          scrub: true,
          markers: false,
        }
      })
      .to(prevImg, { opacity: 0, ease: "none" }, 0)
      .to(nextImg, { opacity: 1, ease: "none" }, 0);
    } else if (nextImg && projectIdx === 0 && slideIdx === 0) {
      nextImg.style.opacity = "1";
    }
  });
});

ScrollTrigger.refresh();

const gradient = new Gradient();
gradient.initGradient("#gradient-canvas");