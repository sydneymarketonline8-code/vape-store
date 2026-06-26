// Short, factual, distinct descriptors woven into brand hub/cluster copy so the
// ~80 brand pages don't read as identical templates (boilerplate-at-scale can be
// discounted by Google). General, accurate statements only — no fabricated
// founding dates, sales figures, superlatives or "#1" claims. Brands not listed
// fall back to the generic generated copy.

const DESCRIPTORS: Record<string, string> = {
  IGET: 'IGET is one of the most recognised disposable vape names in Australia, spanning the IGET Bar, Hot, Legend and Goat ranges across a wide spread of puff counts.',
  HQD: 'HQD is a long-running disposable brand with a broad line-up, from compact pocket devices to high-puff models.',
  GUNNPOD: 'GUNNPOD is a popular brand on the Australian market, known for reliable, flavour-forward disposable devices.',
  ALFAKHER: 'ALFAKHER’s Crown Bar series is among the best-known high-puff disposable lines in Australia, offered in 8,000 and 15,000-puff variants.',
  ADALYA: 'ADALYA brings hookah-inspired flavour profiles to disposables, including its Love 66 and Two Apples blends.',
  'LOST MARY': 'Lost Mary is a widely-stocked disposable brand known for its rounded, pebble-style devices and broad flavour range.',
  ALIBARBAR: 'ALIBARBAR, known for its Ingot series, offers bold-flavour, high-puff disposables.',
  ELUX: 'ELUX is a popular disposable brand offering a wide flavour range across its bar-style devices.',
  KUZ: 'KUZ is a flavour-focused disposable brand stocked widely across Australia.',
  JNR: 'JNR is known for high-capacity disposables, including its Falcon series.',
  'X-QLUSIVE': 'X-Qlusive offers a broad range of fruit and ice disposable flavours.',
  FASTA: 'FASTA is a disposable brand with a wide, fruit-forward flavour line-up.',
  FUME: 'FUME offers a large selection of fruit and ice disposable flavours.',
  FLONQ: 'FLONQ is known for sleek, design-led disposable devices.',
  VAPEHUB: 'VapeHub stocks a broad range of high-puff disposable flavours.',
  BANG: 'BANG offers very high-puff disposable devices for long-lasting use.',
  BIMO: 'BIMO is known for its Crystal-style high-puff disposables.',
  RELX: 'RELX is known for pod systems and disposable devices aimed at adult smokers switching to vaping.',
  'CLOUD NURDZ': 'Cloud Nurdz is well known for its candy-meets-fruit e-liquid blends.',
  'POD JUICE': 'Pod Juice is a popular nicotine-salt e-liquid brand with a large flavour range.',
  NAKED: 'NAKED (NKD 100) is a well-established e-liquid and nicotine-salt brand, known for clean fruit and menthol blends.',
  MONSTER: 'Monster is known for its dessert and fruit e-liquid blends.',
  VAPORLAX: 'VaporLax offers a range of nicotine-salt e-liquids.',
  'JUICE HEAD': 'Juice Head is known for its fruit-blend e-liquids and nicotine salts.',
  ZYN: 'ZYN is a leading tobacco-free nicotine pouch brand.',
  ZIMO: 'ZIMO offers tobacco-free nicotine pouches in a range of fruit and mint flavours.',
  VELO: 'VELO is a widely-recognised tobacco-free nicotine pouch brand.',
  KILLA: 'KILLA is known for its strong, flavour-forward nicotine pouches.',
  VAPORESSO: 'Vaporesso is an established device maker known for refillable pod kits such as the XROS range.',
  GEEKVAPE: 'GeekVape is known for durable, refillable devices including its Aegis range.',
  VOOPOO: 'VOOPOO makes refillable pod systems and kits, including the Vrizz and Drag lines.',
  SMOK: 'SMOK is a long-established device brand offering pod kits and mods.',
  UWELL: 'UWELL is known for its Caliburn refillable pod systems.',
}

export function brandDescriptor(brand: string): string | null {
  return DESCRIPTORS[brand.toUpperCase()] ?? null
}
