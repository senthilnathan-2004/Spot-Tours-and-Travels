import { useEffect, useRef, useState } from 'react';

/**
 * useScrollAnimation - A Framer Motion-style scroll animation hook
 * using Intersection Observer API.
 *
 * @param {Object} options
 * @param {number} options.threshold - 0 to 1, how much of element must be visible (default: 0.12)
 * @param {string} options.rootMargin - CSS margin offset (default: '0px 0px -60px 0px')
 * @param {boolean} options.once - Only animate once (default: true)
 * @returns {{ ref, isVisible }}
 */
const useScrollAnimation = ({ threshold = 0.12, rootMargin = '0px 0px -60px 0px', once = true } = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
};

export default useScrollAnimation;
