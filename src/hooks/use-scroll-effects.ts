import { useEffect } from 'react';

export function useScrollReveal() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]')
    );
    if (elements.length === 0) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (typeof IntersectionObserver === 'undefined' || reduced) {
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    // Track which elements have been revealed so we can re-apply the
    // `is-visible` class if a React re-render wipes it from the classList
    // (this happens when a component's `className` prop changes).
    const revealed = new WeakSet<HTMLElement>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const delay = target.getAttribute('data-reveal-delay');
            if (delay) {
              target.style.transitionDelay = `${delay}ms`;
            }
            target.classList.add('is-visible');
            revealed.add(target);
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const target = mutation.target as HTMLElement;
        if (revealed.has(target) && !target.classList.contains('is-visible')) {
          target.classList.add('is-visible');
        }
      }
    });

    elements.forEach((el) => {
      observer.observe(el);
      mutationObserver.observe(el, { attributes: true, attributeFilter: ['class'] });
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}

export function useHeroParallax() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (reduced || isMobile) return;

    const photo = document.querySelector<HTMLElement>('.hero-photo');
    if (!photo) return;

    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const hero = photo.closest('.hero');
      const height = hero?.getBoundingClientRect().height ?? 0;
      if (y < height + 300) {
        photo.style.transform = `translate3d(0, ${y * 0.16}px, 0) scale(1.08)`;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
}
