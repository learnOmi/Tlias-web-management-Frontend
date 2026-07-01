import { type Directive, type App } from "vue";

const imageLazyDirective: Directive<HTMLImageElement, string> = {
  mounted(el, binding) {
    el.setAttribute("data-src", binding.value);
    el.classList.add("lazy-image");

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              const src = img.getAttribute("data-src");
              if (src) {
                img.src = src;
                img.classList.add("lazy-image-loaded");
                observer.unobserve(img);
              }
            }
          });
        },
        {
          rootMargin: "50px",
          threshold: 0.01,
        }
      );
      observer.observe(el);
      (el as any).__observer = observer;
    } else {
      el.src = binding.value;
    }
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      el.setAttribute("data-src", binding.value);
      const observer = (el as any).__observer;
      if (observer) {
        observer.observe(el);
      }
    }
  },
  unmounted(el) {
    const observer = (el as any).__observer;
    if (observer) {
      observer.unobserve(el);
    }
  },
};

export function setupLazyImageDirective(app: App): void {
  app.directive("lazy", imageLazyDirective);
}

export default imageLazyDirective;
