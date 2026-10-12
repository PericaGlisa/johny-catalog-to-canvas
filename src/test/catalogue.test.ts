import { describe, expect, it } from 'vitest';
import { products, quoteLink } from '@/data/catalogue';

describe('Catalogue specifications', () => {
  it('contains five models and 27 model-colour combinations', () => {
    expect(products).toHaveLength(5);
    expect(products.reduce((total, product) => total + product.colors.length, 0)).toBe(27);
  });
  it('uses 400 W for each mixer and 1200 W for the blender', () => {
    expect(products.filter(p => p.type === 'Mikseri').map(p => p.power)).toEqual([400,400,400,400]);
    expect(products.find(p => p.id === 'AK/12 ECO')?.power).toBe(1200);
  });
  it('addresses a selected model and colour enquiry to the catalogue email', () => {
    const link = quoteLink(products[0], 'Crvena');
    expect(link.startsWith('mailto:office@eop.rs?')).toBe(true);
    expect(new URLSearchParams(link.split('?')[1]).get('subject')).toBe('Upit za JOHNY AK/2-2T ECO – Crvena');
  });
});