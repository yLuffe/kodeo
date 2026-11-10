'use client';

import { useEffect, useState } from 'react';
import { Trophy, Zap } from 'lucide-react';

export function LessonReward({ xp, review }: { xp: number; review: boolean }) {
  const [shown, setShown] = useState(xp);

  useEffect(() => {
    if (!xp) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) return;
    let frame = 0;
    const start = performance.now();
    function animate(time: number) {
      const progress = Math.min(1, Math.max(0, (time - start) / 850));
      setShown(Math.round(xp * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1 && !reduced.matches) frame = requestAnimationFrame(animate);
      else setShown(xp);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [xp]);

  return <div className="mission-reward">
    <div className="mission-sparks" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index}/>)}</div>
    <Trophy size={32} aria-hidden="true"/>
    <strong>
      <span className="sr-only">{xp} XP</span>
      <span aria-hidden="true">{xp ? '+' : ''}{shown} XP</span>
    </strong>
    <span>{review ? 'Revisão sem novas recompensas' : 'XP conquistado nesta missão'}</span>
    {!review && <span className="mission-bonus"><Zap size={16} aria-hidden="true"/> Bônus de conclusão incluído</span>}
  </div>;
}
