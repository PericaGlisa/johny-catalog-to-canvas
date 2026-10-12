import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { products, productImage, quoteLink } from '@/data/catalogue';

export function ColourStudio() {
  const product = products.find(p => p.id === 'AK/2-2TA ECO');
  const [index, setIndex] = useState(1);
  const [lastIndex, setLastIndex] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const colors = product?.colors ?? [];

  const change = useCallback((i: number) => {
    setIndex(prev => {
      if (i === prev) return prev;
      setLastIndex(prev);
      return i;
    });
  }, []);

  const next = useCallback((direction: number) => {
    setIndex(prev => {
      if (colors.length === 0) return prev;
      const target = (prev + direction + colors.length) % colors.length;
      setLastIndex(prev);
      return target;
    });
  }, [colors.length]);

  // Pause when section is scrolled out of view to save battery and resources
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first) {
          setIsVisible(first.isIntersecting);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Automatic slide rotation every 3.5s when active and visible
  useEffect(() => {
    if (isPaused || !isVisible || colors.length === 0) return;
    const interval = setInterval(() => {
      next(1);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused, isVisible, colors.length, next]);

  // Clean up any touch timeout
  useEffect(() => {
    return () => {
      if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    };
  }, []);

  if (!product) return null;
  const colour = product.colors[index];
  if (!colour) return null;

  const showPrev = lastIndex !== index;

  const handleTouchStart = () => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    touchTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 4000);
  };

  return (
    <section
      ref={sectionRef}
      className={`colour-studio studio-${colour.key}`}
      id="boje"
      aria-label="JOHNY izbor boja"
      data-reveal
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="studio-inner">
        <div className="studio-copy">
          <span className="eyebrow">SKLAD SA VAŠOM ESPRESSO STANICOM</span>
          <h2>
            Vaš šank.<br />
            Vaš karakter.<br />
            <span>Vaša boja.</span>
          </h2>
          <p>
            Radni šank ne mora da bude sterilan. Uskladite boju miksera sa paletom lokala, pločicama ili tonom vašeg espresso aparata.
          </p>

          <div className="studio-model">
            <span>MODEL</span>
            <strong>{product.id}</strong>
          </div>

          <div className="studio-swatches" role="group" aria-label="Boja miksera">
            {product.colors.map((c, i) => (
              <Button
                key={c.key}
                variant="ghost"
                size="icon"
                className={`studio-swatch swatch-${c.key} ${i === index ? 'is-selected' : ''}`}
                onClick={() => change(i)}
                aria-label={`Prikaži ${c.name}`}
                aria-pressed={i === index}
                title={c.name}
              >
                {i === index && <Check size={14} />}
              </Button>
            ))}
          </div>

          <p className="studio-selection" aria-live="polite">
            {colour.name} <span>0{index + 1} / 07</span>
          </p>

          <Button variant="ink" size="lg" asChild>
            <a href={quoteLink(product, colour.name)}>
              Zatraži ovu kombinaciju <ArrowUpRight />
            </a>
          </Button>
          <small className="studio-note">Dostupnost boje potvrđujemo uz ponudu.</small>
        </div>

        <div className="studio-stage">
          <span className="studio-background-word" aria-hidden="true">JOHNY</span>
          <div className="studio-product-stack">
            {showPrev && (
              <img
                key={`prev-${lastIndex}`}
                className="studio-product studio-product--prev"
                src={productImage(product, lastIndex)}
                alt=""
                aria-hidden="true"
                loading="eager"
                width={300}
                height={480}
              />
            )}
            <img
              key={`curr-${index}`}
              className="studio-product"
              src={productImage(product, index)}
              alt={`JOHNY ${product.id}, ${colour.name.toLowerCase()} boja`}
              loading="eager"
              width={300}
              height={480}
            />
          </div>

          <div className="studio-stage-bottom">
            <span>PROFESIONALNA MIKRO-AERACIJA</span>
            <div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Prethodna boja"
                title="Prethodna boja"
                onClick={() => next(-1)}
              >
                <ArrowLeft />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Sledeća boja"
                title="Sledeća boja"
                onClick={() => next(1)}
              >
                <ArrowRight />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="studio-footer">
        <span>KLASIČNI MIKSERI <strong>7 boja</strong></span>
        <span>AK/12 ECO BLENDER <strong>5 boja</strong></span>
        <span>AK/20 <strong>Crno-bela</strong></span>
      </div>
    </section>
  );
}
