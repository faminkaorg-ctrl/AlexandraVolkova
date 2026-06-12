export function initMarquee(lenis) {
  const marquee = document.getElementById("marquee");
  const track = document.getElementById("marquee-track");
  if (!marquee || !track) return;

  const clone = track.cloneNode(true);
  clone.removeAttribute("id");
  clone.setAttribute("aria-hidden", "true");
  marquee.appendChild(clone);

  let lastScroll = 0;
  let direction = 1;

  const setDirection = (scrollY) => {
    const delta = scrollY - lastScroll;
    if (Math.abs(delta) < 2) return;

    const newDir = delta > 0 ? 1 : -1;
    if (newDir !== direction) {
      direction = newDir;
      marquee.style.setProperty(
        "--marquee-direction",
        direction === 1 ? "normal" : "reverse"
      );
    }
    lastScroll = scrollY;
  };

  if (lenis) {
    lenis.on("scroll", ({ scroll }) => setDirection(scroll));
  } else {
    window.addEventListener(
      "scroll",
      () => setDirection(window.scrollY),
      { passive: true }
    );
  }
}