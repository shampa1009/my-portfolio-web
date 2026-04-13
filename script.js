const animatedStats = document.querySelectorAll("[data-count]");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const formatValue = (value, target) => {
  if (target % 1 !== 0) {
    return value.toFixed(1);
  }

  return Math.round(value).toString();
};

const statObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const element = entry.target;
      const target = Number(element.dataset.count);
      const duration = 1200;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = formatValue(target * eased, target);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          element.textContent = target.toString();
        }
      };

      requestAnimationFrame(tick);
      observer.unobserve(element);
    });
  },
  { threshold: 0.4 }
);

animatedStats.forEach((stat) => statObserver.observe(stat));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const matchingLink = navLinks.find(
        (link) => link.getAttribute("href") === `#${entry.target.id}`
      );

      navLinks.forEach((link) => link.classList.remove("is-active"));

      if (matchingLink) {
        matchingLink.classList.add("is-active");
      }
    });
  },
  {
    rootMargin: "-35% 0px -45% 0px",
    threshold: 0.1,
  }
);

sections.forEach((section) => sectionObserver.observe(section));
