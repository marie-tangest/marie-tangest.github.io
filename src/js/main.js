import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Gradient } from './hero';
import optimizeTicker from './tick-optimizer';

gsap.registerPlugin(ScrollTrigger);

optimizeTicker(gsap, 30);

gsap.timeline({
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom-=100 top",
    markers: false,
    pinSpacing: false,
    scrub: true
  }
})
.to(".hero .profile", {
  marginLeft: "10px",
  marginBottom: "10px",
  gap: "0.75rem",
  lineHeight: 1,
  ease: 'power1.inOut',
})
.to(".hero .image-frame", {
  height: 80,
  width: 80,
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
  marginBottom: "-100px",
  ease: 'power1.inOut',
}, "<")
.to("#gradient-canvas", {
  opacity: 0,
  ease: 'power1.inOut',
}, "<");

ScrollTrigger.create({
  trigger: ".hero",
  start: "bottom-=100 top",
  endTrigger: "body",
  end: "bottom-=100 top",
  scrub: true,
  markers: false,
  pin: true,
  pinSpacing: false
});

let directionSwitched = false;
const container = document.querySelector(".hero .info .contact");
gsap.timeline({
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom-=100 top",
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

Array.from(document.querySelectorAll('.swirl-path')).forEach(path => {
  const length = path.getTotalLength();
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;
});

gsap.timeline({
  scrollTrigger: {
    trigger: '.projects',
    start: 'top bottom',
    end: 'top top+=100',
    endTrigger: '.projects .header',
    scrub: true,
    markers: false,
    pinSpacing: false
  }
})
.from('.projects .header .title', {
  y: "100vh",
  duration: 1,
  ease: 'power1.inOut',
})
.to(document.querySelectorAll('.swirl-path'), { 
  strokeDashoffset: 0,
  duration: 0.5,
  ease: 'power1.inOut'
}, 0.5);

ScrollTrigger.create({
  trigger: '.projects .header',
  start: 'top top+=100',
  endTrigger: 'body',
  end: 'bottom-=100 top',
  scrub: true,
  markers: false,
  pin: true,
  pinSpacing: false
});

gsap.from('.projects .view .frame', {
  y: "500vh",
  width: "5%",
  borderRadius: 0,
  ease: 'power1.inOut',
  scrollTrigger: {
    trigger: '.projects',
    start: 'top bottom',
    end: 'top top+=100',
    endTrigger: '.projects .header',
    scrub: true,
    markers: false,
    pinSpacing: false
  }
});

ScrollTrigger.create({
  trigger: '.projects .header',
  start: 'top top+=100',
  endTrigger: 'body',
  end: 'bottom-=100 top',
  scrub: true,
  markers: false,
  pin: '.projects .view .images',
  pinSpacing: false
});

// Hide all images except the very first
document.querySelectorAll('.view .frame .image').forEach(img => img.style.opacity = 0);
document.querySelector('.view .frame .image[data-project="0"][data-slide="0"]').style.opacity = 1;

// Set all descriptions to faded, only the very first is full
document.querySelectorAll('.description').forEach(slide => slide.classList.remove('active-desc'));
document.querySelector('.description[data-slide="0"]').classList.add('active-desc');

const projectsTitle = document.querySelector('.projects .header');

// For each slide, scrubbed crossfade between images as before,
// PLUS: update active-desc class on bulletpoints as you scroll
document.querySelectorAll('.projects .view .content .info').forEach((projectEl, projectIdx) => {
  const titleEl = projectEl.querySelector('.title');
  ScrollTrigger.create({
    trigger: projectEl,
    start: `top top+=${projectsTitle.offsetHeight + 100}`,
    endTrigger: '.projects .view .content',
    end: 'bottom top',
    scrub: true,
    markers: false,
    pinSpacing: false,
    pin: titleEl
  });

Array.from(projectEl.querySelectorAll('.description')).forEach((slideEl, slideIdx) => {
    let nextImg = document.querySelector(`.image[data-project="${projectIdx}"][data-slide="${slideIdx}"]`);
    let prevImg = null;
    if (slideIdx === 0 && projectIdx > 0) {
      prevImg = document.querySelector(`.image[data-project="${projectIdx-1}"][data-slide="2"]`);
    } else if (slideIdx > 0) {
      prevImg = document.querySelector(`.image[data-project="${projectIdx}"][data-slide="${slideIdx-1}"]`);
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
      nextImg.style.opacity = 1;
    }
    
    ScrollTrigger.create({
      trigger: slideEl,
      start: "top 50%",
      end: "bottom 50%",
      markers: false,
      onEnter: () => updateActiveDesc(slideEl),
      onEnterBack: () => updateActiveDesc(slideEl)
    });

    ScrollTrigger.create({
      trigger: slideEl,
      start: `top top+=${projectsTitle.offsetHeight + 100}`,
      endTrigger: '.projects .view .content',
      end: 'bottom top',
      scrub: true,
      markers: false,
      pinSpacing: false,
      pin: true
    });
  });
});

function updateActiveDesc(activeSlide) {
  document.querySelectorAll('.description').forEach(slide => {
    slide.classList.toggle('active-desc', slide === activeSlide);
  });
}

const gradient = new Gradient();
gradient.initGradient("#gradient-canvas");