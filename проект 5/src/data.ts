import { Perfume } from './types';

export const PERFUMES: Perfume[] = [
  {
    id: 'perf-1',
    name: 'Aura De Céleste',
    brand: 'Maison de L’Arôme',
    price: 2400,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
    category: 'floral',
    rating: 4.8,
    volume: '100ml',
    description: 'An exquisite, sophisticated fragrance celebrating the freshness of May rose and the sensuality of white jasmine. Creates a sillage of morning coolness and a delicate flower garden.',
    notes: {
      top: 'Green mandarin, Bergamot',
      heart: 'Damask rose, French Jasmine',
      base: 'White musk, Vanilla powder'
    }
  },
  {
    id: 'perf-2',
    name: 'Noir Mystique',
    brand: 'Nuit Parisienne',
    price: 3100,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
    category: 'oriental',
    rating: 4.9,
    volume: '50ml',
    description: 'A deep and mysterious oriental-woody fragrance, enveloping in the alluring mystery of agarwood (oud) and warm, spicy notes of eastern spices.',
    notes: {
      top: 'Black pepper, Cardamom, Saffron',
      heart: 'Oud, Leather, Dark chocolate',
      base: 'Sandalwood, Amber resin, Vetiver'
    }
  },
  {
    id: 'perf-3',
    name: 'Pamplemousse Frais',
    brand: 'Riviera Botanica',
    price: 1850,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600',
    category: 'citrus',
    rating: 4.6,
    volume: '100ml',
    description: 'An invigorating, sparkling citrus breeze inspired by the sunny coast of Provence. Juicy grapefruit and basil create an instant burst of energy.',
    notes: {
      top: 'Pink grapefruit, Sicilian lemon',
      heart: 'Basil leaves, Neroli, Iris',
      base: 'Green vetiver, Patchouli, Cedarwood'
    }
  },
  {
    id: 'perf-4',
    name: 'Pétale de Rose',
    brand: 'Maison de L’Arôme',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600',
    category: 'floral',
    rating: 4.7,
    volume: '75ml',
    description: 'Soft as a touch of petals, a monochrome dusty-rose fragrance. A symphony of classical elegance from French perfumery art.',
    notes: {
      top: 'Raspberry, Peony',
      heart: 'French rose, Lychee',
      base: 'Sandalwood, Musk'
    }
  },
  {
    id: 'perf-5',
    name: 'Bois De Santal',
    brand: 'Nordic Forest',
    price: 2750,
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600',
    category: 'woody',
    rating: 4.8,
    volume: '50ml',
    description: 'A calm, meditative forest fragrance featuring rich, creamy sandalwood notes, the warmth of Siberian cedar, and a noble, premium sillage.',
    notes: {
      top: 'Cardamom, Pink pepper',
      heart: 'Sandalwood, Cypress, Frankincense',
      base: 'Atlas cedar, Amber, Leather'
    }
  },
  {
    id: 'perf-6',
    name: 'Verveine Verte',
    brand: 'Riviera Botanica',
    price: 1950,
    image: 'https://images.unsplash.com/photo-1615396899839-c99c121888b0?auto=format&fit=crop&q=80&w=600',
    category: 'fresh',
    rating: 4.5,
    volume: '100ml',
    description: 'A clean, crisp aroma of wild verbena and Provençal herbs after a July thunderstorm. Calms the senses and delivers endless freshness.',
    notes: {
      top: 'Lemon verbena, Peppermint',
      heart: 'Lavender, Jasmine, Green tea',
      base: 'Musk, Oakmoss'
    }
  }
];
