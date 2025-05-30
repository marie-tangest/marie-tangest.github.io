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
  lineHeight: 1
})
.to(".hero .image-frame", {
  height: 80,
  width: 80,
  boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0)",
  borderWidth: 0,
  borderColor: "transparent",
}, "<")
.to(".hero .info .name", {
  fontSize: "1.5rem",
  marginTop: "0.5rem"
}, "<")
.to([".hero .info .contact .title", ".hero .info .contact .email", ".hero .info .contact .phone"], {
  fontSize: "1rem",
}, "<")
.to(".hero .scroll", {
  opacity: 0,
  marginBottom: "-100px"
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
  duration: 0.2
})
.to(container, {
  opacity: 1,
  duration: 0.2
});

gsap.from('.projects .header .title', {
  y: "100vh",
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
  pin: true,
  pinSpacing: false
});

gsap.from('.projects .view .frame', {
  y: "500vh",
  width: "5%",
  borderRadius: 0,
  scrollTrigger: {
    trigger: '.projects',
    start: 'top bottom',
    end: 'top top+=100',
    endTrigger: '.projects .header',
    scrub: true,
    markers: true,
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

const gradient = new Gradient();
gradient.initGradient("#gradient-canvas");