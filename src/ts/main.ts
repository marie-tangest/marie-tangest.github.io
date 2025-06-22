import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Gradient } from './hero.js';
import optimizeTicker from './tick-optimizer';
import { getCssVariableInPixels } from './utilities';

gsap.registerPlugin(ScrollTrigger);

optimizeTicker(gsap, 30);

document.addEventListener("DOMContentLoaded", () => {
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

  const frameHeight = getCssVariableInPixels("--image-frame-height");
  const frameMargin = (getCssVariableInPixels("--below-hero-bar-spacing") - frameHeight)/2;
  const frameOffset = frameHeight + frameMargin + heroBarHeight;
  const frameTop = heroBarHeight + frameMargin;
  const lastProject = document.querySelector('.projects .view .content .info:last-child') as HTMLElement;

  ScrollTrigger.create({
    trigger: '.projects',
    start: `top top+=${heroBarHeight}`,
    endTrigger: lastProject,
    end: `bottom bottom-=${frameMargin}`,
    scrub: true,
    markers: false,
    pin: '.projects .view .images',
    pinSpacing: false
  });

  gsap.set('.projects .view .content', { paddingTop: frameOffset, paddingBottom: frameOffset });
  gsap.set('.projects .view .content .info', { paddingBottom: frameHeight, width: frameHeight });

  const lastPadding = Math.max(frameHeight - lastProject.getBoundingClientRect().height, 0);
  gsap.set(lastProject, { paddingBottom: lastPadding });

  const allImages = document.querySelectorAll('.view .frame .image') as NodeListOf<HTMLElement>;
  allImages.forEach(img => gsap.set(img, { opacity: 0 }));
  gsap.set('.view .frame .image[data-project="0"][data-slide="0"]', { opacity: 1 });

  document.querySelectorAll('.projects .view .content .info').forEach((infoEl, projectIdx) => {
    const images = Array.from(document.querySelectorAll(`.projects .view .frame .image[data-project="${projectIdx}"]`))
      .map(img => img as HTMLElement).sort((a, b) => parseInt(a.dataset.slide || '0') - parseInt(b.dataset.slide || '0'));

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: infoEl,
        start: `top bottom-=${frameMargin}`,
        end: `top top+=${frameTop}`,
        scrub: true
      }
    });

    const duration = 1/images.length;
    images.forEach((img, i) => {
      tl.to(img, {
        opacity: 1,
        duration: duration,
        ease: "none"
      }, `+=${i * duration}`);
    });
  });

  ScrollTrigger.refresh();

  const gradient = new Gradient();
  gradient.initGradient("#gradient-canvas");
});