export default function optimizeTicker(gsap: GSAP, fpsThreshold = 30) {
    function monitorFPS(callback: Function) {
        let last = performance.now();
        let frames = 0;
        function loop(now: DOMHighResTimeStamp) {
          frames++;
          const delta = now - last;
          if (delta >= 1000) {
            const fps = (frames * 1000) / delta;
            callback(Math.round(fps));
            frames = 0;
            last = now;
          }
          requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
      }
      
      // Custom WebGL ticker using a hidden canvas
      let cleanupWebGLTicker: Function | null = null;
      
      function customTickFn() {
        // 1. Create a tiny hidden canvas
        let canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        canvas.style.position = "absolute";
        canvas.style.opacity = "0";
        canvas.style.pointerEvents = "none";
        canvas.style.left = "-1000px";
        document.body.appendChild(canvas);
      
        // 2. Get WebGL context
        let gl = canvas.getContext("webgl") as WebGLRenderingContext;
      
        // 3. Use a render loop to call gsap.updateRoot()
        let running = true;
        function webglLoop(time: number) {
          gl.clear(gl.COLOR_BUFFER_BIT); // optional/minimal
          gsap.updateRoot(time / 1000); // Time in seconds!
          if (running) requestAnimationFrame(webglLoop);
        }
        requestAnimationFrame(webglLoop);
      
        // 4. Return a cleanup method
        return () => {
          running = false;
          canvas.remove();
        };
      }
      
      // Monitor FPS and switch tickers
      monitorFPS((fps: number) => {
        if (fps < fpsThreshold && !cleanupWebGLTicker) {
          gsap.ticker.remove(gsap.updateRoot);
          cleanupWebGLTicker = customTickFn();
          console.debug(`[FPS Switch] Low FPS detected (<${fpsThreshold}) — Switched to WebGL ticker`);
        } else if (fps >= fpsThreshold && cleanupWebGLTicker) {
          cleanupWebGLTicker(); // Stop WebGL ticker
          gsap.ticker.add(gsap.updateRoot);
          cleanupWebGLTicker = null;
          console.debug(`[FPS Switch] FPS recovered (>=${fpsThreshold}) — Restored GSAP ticker`);
        }
      });
}