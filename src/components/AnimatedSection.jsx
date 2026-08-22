import React, { useEffect, useRef } from 'react';

/**
 * AnimatedSection – wraps any element and adds scroll-triggered CSS animation.
 *
 * Props:
 *   as         – HTML tag or component to render (default: 'div')
 *   anim       – animation type: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'flip-up'
 *   delay      – delay in ms string: '100' | '200' | ... | '800'
 *   dur        – duration preset: 'fast' | 'normal' | 'slow'
 *   threshold  – intersection threshold (default 0.12)
 *   className  – extra class names
 *   children   – child nodes
 */
const AnimatedSection = ({
  as: Tag = 'div',
  anim = 'fade-up',
  delay,
  dur,
  threshold = 0.12,
  className = '',
  children,
  style,
  ...rest
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('anim-visible');
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref}
      data-anim={anim}
      data-delay={delay}
      data-dur={dur}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default AnimatedSection;
