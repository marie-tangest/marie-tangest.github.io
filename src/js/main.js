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
    scrub: true,
    normalizeScroll: true
  }
})
.to(".hero .profile", {
  marginLeft: "10px",
  marginBottom: "10px",
  gap: "0.75rem",
  lineHeight: 1
})
.to(".hero .profile-image", {
  height: 80,
  width: 80,
  boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0)",
  borderWidth: 0,
  borderColor: "transparent",
}, "<")
.to(".hero .profile-info .profile-name", {
  fontSize: "1.5rem",
  marginTop: "0.5rem"
}, "<")
.to(".hero .profile-info .profile-contact .profile-title, .hero .profile-info .profile-contact span", {
  fontSize: "1rem",
}, "<")
.to(".hero .hero-scroll", {
  opacity: 0,
  marginBottom: "-100px"
}, "<");

gsap.timeline({
  scrollTrigger: {
    trigger: ".hero",
    start: "bottom-=100 top",
    endTrigger: "body",
    end: "bottom-=100 top",
    scrub: true,
    markers: false,
    pin: true,
    pinSpacing: false,
    normalizeScroll: true
  }
});

let directionSwitched = false;
const container = document.querySelector(".hero .profile .profile-info .profile-contact");
gsap.timeline({
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom-=100 top",
    markers: false,
    pinSpacing: false,
    scrub: true,
    normalizeScroll: true,
    onUpdate: self => {
      const progress = self.progress;

      // Switch flex direction only once per direction change
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
  duration: 0.2
})
.to(container, {
  opacity: 1,
  duration: 0.2
});

gsap.set(".projects-header", {
  y: "100vh"
});
gsap.set(".projects-container", {
  y: "100vh"
});

gsap.timeline({
  scrollTrigger: {
    trigger: ".projects",
    start: "top bottom",
    end: "top top-=100",
    markers: false,
    pinSpacing: false,
    scrub: true,
    normalizeScroll: true
  }
})
.to(".projects-header", {
  y: "2rem"
})
.to(".projects-container", {
  y: 0
}, "-=0.5");

gsap.timeline({
  scrollTrigger: {
    trigger: ".projects",
    start: "top top+=100",
    endTrigger: "body",
    end: "bottom-=100 top",
    scrub: true,
    markers: true,
    pin: true,
    pinSpacing: false,
    normalizeScroll: true
  }
});

const gradient = new Gradient();
gradient.initGradient("#gradient-canvas");