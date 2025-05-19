import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

const TypingDots: React.FC = () => {
  const dotRefs = [useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    dotRefs.forEach((ref, i) => {
      anime({
        targets: ref.current,
        translateY: [
          { value: -6, duration: 300 },
          { value: 0, duration: 300 }
        ],
        delay: i * 150,
        loop: true,
        easing: 'easeInOutSine',
        direction: 'alternate',
        autoplay: true
      });
    });
  }, []);

  return (
    <div className="flex items-end gap-1 h-5">
      {dotRefs.map((ref, i) => (
        <span
          key={i}
          ref={ref}
          className="w-2 h-2 bg-gray-500 rounded-full inline-block"
        />
      ))}
    </div>
  );
};

export default TypingDots;