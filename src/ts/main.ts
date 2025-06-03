import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { Gradient } from './hero.js';
import optimizeTicker from './tick-optimizer';
import { getCssVariableInPixels } from './utilities';

gsap.registerPlugin(ScrollTrigger, Flip);

optimizeTicker(gsap, 30);

const heroBarHeight = getCssVariableInPixels("--hero-bar-height");
const postHeroSpacer = getCssVariableInPixels("--post-hero-spacer");
const heroBarSpacing = heroBarHeight + postHeroSpacer;
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
  marginLeft: profileMargin,
  marginBottom: profileMargin,
  gap: "0.75rem",
  lineHeight: 1,
  ease: 'power1.inOut',
})
.to(".hero .frame", {
  height: profileImageHeight,
  width: profileImageHeight,
  boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0)",
  borderWidth: 0,
  borderColor: "transparent",
  ease: 'power1.inOut',
}, "<")
.to(".hero .info .name", {
  fontSize: "1.5rem",
  marginTop: "0.5rem",
  ease: 'power1.inOut'
}, "<")
.to([".hero .info .contact .title", ".hero .info .contact .email", ".hero .info .contact .phone"], {
  fontSize: "1rem",
  ease: 'power1.inOut',
}, "<")
.to(".hero .scroll", {
  opacity: 0,
  marginBottom: -heroBarHeight,
  ease: 'power1.inOut',
}, "<")
.to("#gradient-canvas", {
  opacity: 0,
  ease: 'power1.inOut',
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

let directionSwitched = false;
const container = document.querySelector(".hero .info .contact") as HTMLElement;
gsap.timeline({
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: `bottom-=${heroBarHeight} top`,
    markers: false,
    pinSpacing: false,
    scrub: true,
    onUpdate: self => {
      const progress = self.progress;
      if (progress > 0.5 && !directionSwitched) {
        container.style.flexDirection = "row";
        container.style.alignItems = "center";
        container.style.gap = "1rem";
        directionSwitched = true;
      } else if (progress < 0.5 && directionSwitched) {
        container.style.flexDirection = "column";
        container.style.alignItems = "flex-start";
        container.style.gap = "0rem";
        directionSwitched = false;
      }
    },
  }
})
.to(container, {
  opacity: 0,
  duration: 0.2,
  ease: 'power1.inOut',
})
.to(container, {
  opacity: 1,
  duration: 0.2,
  ease: 'power1.inOut',
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
  start: heroBarSpacing > 0 ? `top top+=${heroBarSpacing}` : "top top",
  endTrigger: 'body',
  end: heroBarSpacing > 0 ? `bottom-=${heroBarSpacing} top` : "bottom top",
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
    start: heroBarSpacing > 0 ? `top top+=${heroBarSpacing}` : "top top",
    endTrigger: '.projects .view .content',
    end: heroBarSpacing > 0 ? `bottom-=${heroBarSpacing} top` : "bottom top",
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
      start: heroBarSpacing > 0 ? `top top+=${heroBarSpacing}` : "top top",
      endTrigger: '.projects .view .content',
      end: heroBarSpacing > 0 ? `bottom-=${heroBarSpacing} top` : "bottom top",
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