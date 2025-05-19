import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

const LoadingDots: React.FC = () => {
  const dotsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const animation = anime({
      targets: dotsRef.current,
      translateY: -8,
      duration: 600,
      loop: true,
      delay: anime.stagger(120),
      direction: 'alternate',
      easing: 'easeInOutSine'
    });

    return () => animation.pause();
  }, []);

  return (
    <div className="flex gap-2">
      {[0, 1, 2].map((_, i) => (
        <div
          key={i}
          ref={el => dotsRef.current[i] = el}
          className="w-2 h-2 rounded-full bg-gray-400"
        />
      ))}
    </div>
  );
};

export default LoadingDots;