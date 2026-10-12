import { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { products, productImage, quoteLink } from '@/data/catalogue';

export function ColourStudio() {
 const product = products.find(p => p.id === 'AK/2-2TA ECO');
 const [index, setIndex] = useState(1);
 const [lastIndex, setLastIndex] = useState(1);
 if (!product) return null;
 const colour = product.colors[index];
 if (!colour) return null;
 const change = (i: number) => { if (i === index) return; setLastIndex(index); setIndex(i); };
 const next = (direction: number) => change((index + direction + product.colors.length) % product.colors.length);
 const showPrev = lastIndex !== index;
 return <section className={`colour-studio studio-${colour.key}`} id="boje" aria-label="JOHNY izbor boja" data-reveal><div className="studio-inner"><div className="studio-copy"><span className="eyebrow">SKLAD SA VAŠOM ESPRESSO STANICOM</span><h2>Vaš šank.<br/>Vaš karakter.<br/><span>Vaša boja.</span></h2><p>Radni šank ne mora da bude sterilan. Uskladite boju miksera sa paletom lokala, pločicama ili tonom vašeg espresso aparata.</p><div className="studio-model"><span>MODEL</span><strong>{product.id}</strong></div><div className="studio-swatches" role="group" aria-label="Boja miksera">{product.colors.map((c,i)=><Button key={c.key} variant="ghost" size="icon" className={`studio-swatch swatch-${c.key} ${i===index?'is-selected':''}`} onClick={()=>change(i)} aria-label={`Prikaži ${c.name}`} aria-pressed={i===index} title={c.name}>{i===index && <Check size={14}/>}</Button>)}</div><p className="studio-selection" aria-live="polite">{colour.name} <span>0{index+1} / 07</span></p><Button variant="ink" size="lg" asChild><a href={quoteLink(product,colour.name)}>Zatraži ovu kombinaciju <ArrowUpRight/></a></Button><small className="studio-note">Dostupnost boje potvrđujemo uz ponudu.</small></div><div className="studio-stage"><span className="studio-background-word" aria-hidden="true">JOHNY</span><div className="studio-product-stack">{showPrev && <img key={`prev-${lastIndex}`} className="studio-product studio-product--prev" src={productImage(product,lastIndex)} alt="" aria-hidden="true" loading="eager" width={300} height={480}/>}<img key={`curr-${index}`} className="studio-product" src={productImage(product,index)} alt={`JOHNY ${product.id}, ${colour.name.toLowerCase()} boja`} loading="eager" width={300} height={480}/></div><div className="studio-stage-bottom"><span>PROFESIONALNA MIKRO-AERACIJA</span><div><Button variant="ghost" size="icon" aria-label="Prethodna boja" title="Prethodna boja" onClick={()=>next(-1)}><ArrowLeft/></Button><Button variant="ghost" size="icon" aria-label="Sledeća boja" title="Sledeća boja" onClick={()=>next(1)}><ArrowRight/></Button></div></div></div></div><div className="studio-footer"><span>KLASIČNI MIKSERI <strong>7 boja</strong></span><span>AK/12 ECO BLENDER <strong>5 boja</strong></span><span>AK/20 <strong>Crno-bela</strong></span></div></section>;
}
