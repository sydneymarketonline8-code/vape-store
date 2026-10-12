import type { Faq } from '@/components/common/page-schema'

/**
 * Per-article FAQs, keyed by post slug.
 *
 * The blog_posts table has no faqs column, so these live in code. They render as
 * a FAQ section at the foot of the article and are emitted as FAQPage structured
 * data, which is what makes an article eligible for FAQ rich results in Google.
 *
 * Answers stay factual — real catalogue figures and real policy only.
 */
export const BLOG_FAQS: Record<string, Faq[]> = {
  'iget-vapes-australia-range-guide': [
    { q: 'How many puffs does an IGET Bar last?', a: 'The IGET Bar is rated at 3,500 puffs. That rating is a laboratory figure measured with a standardised draw, so real-world life depends on how long and hard you inhale — most people see between 60% and 90% of the rating. For a typical user at around 300 puffs a day, that is roughly 10–12 days.' },
    { q: 'Which IGET has the most puffs?', a: 'Of the models we stock, the IGET One at 12,000 puffs is the largest, followed by the IGET Bar Pro at 10,000. Both are rechargeable, which is necessary for any device to deliver that many puffs.' },
    { q: 'What is the difference between IGET Bar and IGET Bar Plus?', a: 'The IGET Bar (3,500 puffs) is a sealed, single-use disposable. The IGET Bar Plus (6,000 puffs) uses a replaceable pod that clips onto a rechargeable battery base, so you replace the pod rather than the whole device — which lowers your cost per puff over time.' },
    { q: 'How much do IGET vapes cost in Australia?', a: 'Our IGET range starts at $12.99 for the XXL 1,800 and runs to $22.99 for the One 12,000. Multi-packs lower the price per device, with pack pricing applied automatically at checkout.' },
    { q: 'How can I tell if an IGET is genuine?', a: 'Genuine stock has sharp, correctly spelled packaging, a verifiable security code where the manufacturer provides one, and flavour names matching the official line-up. Counterfeits often have blurred print or subtly wrong colours. Buying from a retailer that sources properly is the simplest protection.' },
  ],
  'disposable-vape-puff-counts-explained': [
    { q: 'What does a puff count actually measure?', a: 'It is a laboratory figure. The manufacturer runs the device on a machine taking a standardised puff — typically around two seconds — and counts how many it delivers before the e-liquid or battery is exhausted. It is a comparison tool between devices, not a guarantee of your experience.' },
    { q: 'How long does a 6000 puff vape last?', a: 'For a moderate user at roughly 300 puffs a day, about two to three weeks. Heavy users should expect closer to a week and a half; light users can get a month or more.' },
    { q: 'Is a higher puff count better value?', a: 'Per puff, almost always. A 3,500-puff device at $14.99 works out around $4.28 per 1,000 puffs, while a 12,000-puff device at $22.99 is closer to $1.92 — less than half. The trade-off is committing to one flavour for longer.' },
    { q: 'Why do high puff vapes need charging?', a: 'A battery small enough to fit in a disposable cannot deliver 10,000+ puffs on a single charge. High-capacity devices include a USB-C port so the liquid lasts the full rating while you recharge along the way. A five-figure puff claim with no charging port should be treated sceptically.' },
  ],
  'nicotine-pouches-australia-guide': [
    { q: 'What are nicotine pouches?', a: 'Small, tobacco-free pouches placed between the upper lip and gum. Nicotine absorbs through the gum over 20–40 minutes, with no smoke, vapour, device or odour.' },
    { q: 'What strength nicotine pouch should a beginner start with?', a: 'Start at 6mg or lower regardless of how much you smoke or vape. Oral nicotine absorbs differently to inhaled nicotine, so a strength that feels mild in a vape can feel very strong as a pouch.' },
    { q: 'Are nicotine pouches legal in Australia?', a: 'Regulation of nicotine pouches in Australia has been changing and depends on how the product is supplied. Nicotine products are regulated nationally by the TGA and you must be 18 or older. Check the TGA and your state or territory health authority for the current position. This is general information, not legal advice.' },
    { q: 'How many ZYN flavours do you stock?', a: 'We stock 29 ZYN varieties in strengths from 6mg to 16.5mg, covering mint, fruit, coffee and cinnamon profiles, alongside VELO, ZIMO, Juice Head, Mojo, Sesh, Ammo and Berserker.' },
  ],
  'zyn-flavours-strengths-guide-australia': [
    { q: 'What is the strongest ZYN available?', a: 'The strongest in our range is ZYN Cool Mint at 16.5mg per pouch. Most of the range sits between 6mg and 11mg.' },
    { q: 'What does ZYN Slim mean?', a: 'Slim refers to the pouch format — narrower and longer than a standard pouch. The nicotine content is whatever the tin states; only the shape differs. Many users find the slim format sits more comfortably under the lip.' },
    { q: 'Which ZYN flavour is best for beginners?', a: 'Smooth 6mg or Chill 6mg — both are mild in flavour and strength. If you prefer mint, Peppermint 6mg is the gentlest starting point.' },
    { q: 'How much does ZYN cost in Australia?', a: 'Every ZYN variety we stock is $14.99 a tin, so trying a different flavour is a low-cost experiment.' },
  ],
  'nicotine-pouches-beginners-guide-australia': [
    { q: 'How long do you keep a nicotine pouch in?', a: 'Between 20 and 40 minutes. Most of the nicotine releases in the first 15–30 minutes; after about 40 minutes there is little left, and leaving it longer can irritate the gum.' },
    { q: 'Why does a nicotine pouch tingle?', a: 'The tingling or mild burning in the first minute or two is normal — it is the nicotine and flavourings acting on the gum, and it usually settles within about five minutes. Genuine pain, or a tingle that stays unpleasant, usually means the strength is too high.' },
    { q: 'Can you swallow nicotine pouch saliva?', a: 'Swallowing some saliva is normal and generally not harmful, though it can cause mild nausea for some people, particularly at higher strengths. Do not swallow the pouch itself; seek medical advice if you do and feel unwell.' },
    { q: 'Where do you put a used nicotine pouch?', a: 'Most tins have a catch lid in the top for used pouches, or use a bin. Never flush them, and keep used pouches away from children and pets.' },
  ],
  'disposable-vapes-vs-pod-systems': [
    { q: 'Are pod systems cheaper than disposables?', a: 'Over time, yes. A pod kit costs more up front but then you are mainly buying e-liquid from $14.99 a bottle plus occasional coils. The crossover point usually arrives in the second or third month of daily use.' },
    { q: 'Which is better for a beginner?', a: 'Disposables, generally. There is nothing to charge, refill or maintain, and you can try a range of flavours cheaply while you work out what you like before committing to a kit.' },
    { q: 'What is a replaceable-pod device?', a: 'A middle option — a rechargeable battery base with a pod you swap when it runs out, such as the IGET Bar Plus or GUNNPOD Moss. You get most of the convenience of a disposable with less waste and a lower running cost.' },
    { q: 'Why does my pod kit taste burnt?', a: 'Almost always a dry or worn coil. Keep the liquid topped up, prime a new coil before use, and replace it when flavour fades — usually every one to two weeks.' },
  ],
  'e-liquid-nicotine-strengths-explained': [
    { q: 'What does mg/mL mean on e-liquid?', a: 'Milligrams of nicotine per millilitre of liquid. A 30mL bottle at 25mg/mL contains 750mg of nicotine in total. How much you actually absorb also depends on your device, coil and inhale style.' },
    { q: 'What is the difference between nicotine salt and freebase?', a: 'Nicotine salt has an acid added that lowers the pH, making higher strengths much smoother — which is why salts dominate in pods and disposables. Freebase gives a stronger throat hit that becomes harsh as strength rises, so it suits larger, more powerful devices at lower strengths.' },
    { q: 'What does the PG/VG ratio mean?', a: 'Propylene glycol (PG) carries flavour and gives a sharper throat hit; vegetable glycerine (VG) is thicker, sweeter and produces more vapour. A 50/50 blend suits pod systems; higher-VG blends suit powerful sub-ohm devices.' },
    { q: 'What happens if the nicotine strength is too high?', a: 'Dizziness, nausea, headache or a racing heart. Stop, and switch to a lower strength. These are signs to take seriously rather than push through.' },
  ],
  'high-puff-disposable-vapes-australia': [
    { q: 'What is the highest puff vape available?', a: 'Our range tops out at 30,000 puffs, with devices at 25,000 and 20,000 below that. Any device at this capacity is rechargeable by necessity.' },
    { q: 'How long does a 20000 puff vape last?', a: 'For a moderate user at roughly 300 puffs a day, around ten weeks. Heavy users should expect four to five weeks.' },
    { q: 'Do high puff vapes have a screen?', a: 'Many devices above 15,000 puffs include a small display showing remaining battery and an e-liquid level indicator. On a device you will own for two months that is genuinely useful — though liquid indicators are estimates rather than precise gauges.' },
    { q: 'Is a high puff vape worth it?', a: 'If you vape daily and already know which flavour you like, yes — it is by far the best value per puff. If you are new to vaping or like switching flavours often, a 5,000–6,000 puff device is a better starting point.' },
  ],
  'vape-multi-packs-and-bundles-guide': [
    { q: 'How much do you save buying vapes in bulk?', a: 'Up to 22% off the single-unit price across our 166 bundle products. For example, the ALFAKHER Crown Bar 15,000 works out at $23.00 per device in a 3-pack versus $21.20 in a 10-pack.' },
    { q: 'Do I need a code for pack pricing?', a: 'No. Pack pricing is already built into the listed price — nothing to enter at checkout.' },
    { q: 'Do vapes expire?', a: 'Sealed disposables keep well but are not indefinite. E-liquid slowly oxidises, which dulls flavour over time; manufacturers generally indicate one to two years. Store them cool, dark and dry, away from car glove-boxes and windowsills.' },
    { q: 'What is the minimum order?', a: 'A $250 minimum order applies, and orders over $300 ship free Australia-wide. The cart shows a live progress bar to the free-shipping threshold.' },
  ],
  'cheapest-way-to-buy-vapes-australia': [
    { q: 'What is the cheapest way to buy vapes in Australia?', a: 'Compare cost per 1,000 puffs rather than sticker price, then buy a high-capacity device in a multi-pack. A 1,200-puff device at $12.99 costs about $10.83 per 1,000 puffs; a 20,000-puff device at $22.99 is about $1.15 — nearly ten times better.' },
    { q: 'Are cheap vapes worth buying?', a: 'Be careful. Devices priced far below the market are frequently counterfeit, with poor flavour and inaccurate puff ratings. Both IGET and Lost Mary are heavily counterfeited in Australia.' },
    { q: 'How much does vaping cost per month?', a: 'It depends almost entirely on how you buy. For a moderate user at around 9,000 puffs a month, buying 1,200-puff devices singly costs roughly $97 a month, while an 8,000-puff device bought in a multi-pack is closer to $17.' },
  ],
  'buying-vapes-online-australia-delivery': [
    { q: 'How long does vape delivery take in Australia?', a: 'Orders are dispatched within one business day of payment being confirmed. After that, NSW/VIC/ACT typically take 2–5 business days, QLD 2–6, SA 3–6, WA and TAS 4–7, and NT 5–8.' },
    { q: 'How do I pay?', a: 'We accept PayID and cryptocurrency. After you place an order we send the payment details, usually via WhatsApp, and the order is confirmed once payment clears. We do not take card payments or store card details.' },
    { q: 'Is it legal to buy vapes online in Australia?', a: 'Vaping products are regulated nationally by the TGA, the framework changed substantially in 2024 and continues to evolve, and you must be 18 or older. Check the TGA and your state or territory health authority for the current position. This is general information, not legal advice.' },
    { q: 'What happens if my order does not arrive?', a: 'Check the carrier tracking link and your spam folder for the dispatch email first. If it has been more than six business days since dispatch, contact us with your order number and we will chase it.' },
  ],
  'fume-vape-australia-guide': [
    { q: 'How many puffs is a FUME Pro?', a: 'The FUME Pro line is rated at 30,000 puffs, the largest FUME we stock. The Eternity Turbo and Prime Zero lines are both rated at 20,000.' },
    { q: 'Is FUME available in Australia?', a: 'Yes — we stock 51 FUME products across the Pro, Eternity Turbo and Prime Zero lines, held in Australia and dispatched within one business day.' },
    { q: 'How much does a FUME vape cost?', a: 'Our FUME range starts at $14.99 per device, which makes it one of the better value-per-puff options at this capacity.' },
  ],
  'ibuff-shisha-vapes-australia-guide': [
    { q: 'What is a shisha vape?', a: 'A disposable built to echo the smoother, sweeter character of hookah smoke — generally a looser draw, ripe fruit blends rather than sharp menthols, and a softer throat hit.' },
    { q: 'How many flavours does iBuff Shisha come in?', a: 'Nine: Triple Mango, Peach Blueberry Candy, Kiwi Strawberry, Grape, Peach Orange, Strawberry Banana, Pineapple Mango Orange, Watermelon Burst and Strawberry Watermelon Ice.' },
    { q: 'How much is an iBuff Shisha 15000?', a: '$24.99 as a single device, dropping to $19.50 per device in a 50-pack — a 22% reduction.' },
  ],
  'hqd-vapes-australia-guide': [
    { q: 'What is the difference between HQD Cuvie Plus and Cuvie Slick?', a: 'The Cuvie Plus is the compact 1,200-puff model from $12.99. The Cuvie Slick is the high-capacity flagship at 12,000 and 20,000 puffs from $22.99, and is rechargeable.' },
    { q: 'How many puffs is an HQD Box?', a: '4,000 puffs, priced from $15.99 — a large capacity jump over the Cuvie Plus for only a few dollars more.' },
    { q: 'Which HQD is the best value?', a: 'Per puff, the Cuvie Slick 20,000 at around $1.15 per 1,000 puffs. For a cheaper entry point with good value, the Box 4,000 at $15.99.' },
  ],
  'gunnpod-vapes-australia-guide': [
    { q: 'What is GUNNPOD Moss?', a: 'The current flagship — an 8,000-puff system using a replaceable pod on a rechargeable battery base. When the pod runs out you replace the pod rather than the whole device, which lowers running cost and waste.' },
    { q: 'How many puffs is a GUNNPOD?', a: 'It depends on the model: the classic is 1,400–2,000 puffs, the Lume is 5,000, the Plus is 4,500 and the Moss is 8,000.' },
    { q: 'Does GUNNPOD have a tobacco flavour?', a: 'Yes — Classic Tobacco in the original 2,000-puff line is one of the few genuine tobacco options in our range, which matters if you are switching from cigarettes.' },
  ],
  'lost-mary-alibarbar-australia-guide': [
    { q: 'What is the Lost Mary MT35K Turbo?', a: 'Lost Mary’s current flagship in our range — 77 products from $14.99. Turbo models typically offer a switchable power mode, letting you choose between a cooler, longer-lasting output and a warmer, more intense one.' },
    { q: 'How many puffs is an Alibarbar Ingot?', a: '9,000 puffs, priced from $19.99 — around a month of use for a moderate user, and about $2.22 per 1,000 puffs.' },
    { q: 'How do I spot a fake Lost Mary?', a: 'Genuine devices have sharp, correctly spelled packaging, verifiable security codes where provided, and flavour names matching the official line-up. Counterfeits often show blurred print or subtly wrong colours.' },
  ],
  'tomoro-max-15k-australia-guide': [
    { q: 'How many puffs is the TOMORO MAX 15K?', a: 'Up to 15,000 puffs in 10W standard mode, or around 10,000 in 16W high-power mode. It runs a 2,730mAh rechargeable battery and Duo-Ignite dual-coil hardware.' },
    { q: 'How many TOMORO MAX flavours are there?', a: 'Twelve: Strawberry Ice, Blueberry Ice, Blackberry Ice, Watermelon Smash, Mango Boom, Kiwi Pineapple, Strawberry Lychee, Strawberry Coconut Watermelon, Passion Fruit Mango Lime, Blackberry Cherry Pomegranate, Grape Lemon and Skittles.' },
    { q: 'What do the two power modes do?', a: '10W is the standard mode and delivers the full 15,000-puff rating. 16W is a higher-output mode that produces a warmer, more intense draw but uses liquid faster, bringing the device closer to 10,000 puffs.' },
    { q: 'How much is the TOMORO MAX 15K?', a: '$49.99 per device, down from the $79.99 RRP. The 4-pack mix and match works out at $45.00 per device and the 10-pack at $42.50.' },
  ],
  'vape-flavours-guide-australia': [
    { q: 'What is the most popular vape flavour in Australia?', a: 'Iced fruit, by a wide margin. Of our 1,711 disposables, 527 are fruit-led and 430 are ice-led — together about 56% of the range. Strawberry, mango and watermelon are the most common single fruits.' },
    { q: 'What does "ice" mean in a vape flavour?', a: 'Ice is not a flavour on its own — it is a cooling agent layered over a base flavour, so "Strawberry Ice" is strawberry plus cold. The cooling makes sweet flavours feel cleaner over a long session and smooths the throat hit, which is why it dominates high-capacity devices.' },
    { q: 'What is the difference between mint and ice flavours?', a: 'Mint is a genuine herbal flavour — peppermint is sharp and slightly medicinal, spearmint softer and sweeter. Ice is a cooling sensation with no taste of its own. An iced flavour is cold; a mint flavour tastes of mint.' },
    { q: 'What is a hookah or shisha vape flavour?', a: 'Profiles from the Middle Eastern water-pipe tradition — double apple, Love 66 and mixed-fruit shisha blends. Double apple is the signature: sweet red apple with a liquorice-anise undertone. We stock 78 disposables in this family, mostly from iBuff and AL FAKHER.' },
    { q: 'Which vape flavour should a beginner start with?', a: 'A single iced fruit such as strawberry ice or mango ice, on a cheap 3,500–6,000 puff device. It is the lowest-risk combination: the profile most people settle on, at a price where disliking it costs you very little.' },
  ],
  'vape-battery-safety-and-charging-australia': [
    { q: 'Can you leave a vape charging overnight?', a: 'No. This is the single most important battery rule — never charge a vape unattended or overnight. A lithium-ion fire develops in well under a minute and needs someone awake and nearby. Charge it attended, on a hard non-flammable surface.' },
    { q: 'What charger should you use for a vape?', a: 'A low-output source such as a computer USB port or a low-wattage phone charger, using a USB-A to USB-C cable. Avoid fast chargers, car chargers and USB-C to USB-C from a laptop charger, which can negotiate a much higher voltage than a small vape battery expects.' },
    { q: 'Why is my vape swollen or hot?', a: 'A swollen or bulging casing means the lithium cell is venting gas internally — it is the clearest warning sign you will get. Stop using it, do not charge it again, move it to a hard non-flammable surface away from anything that can catch, and take it to a battery drop-off point promptly.' },
    { q: 'Can you take a vape on a plane in Australia?', a: 'Vapes and spare lithium batteries must travel in carry-on baggage only, never in checked luggage, and they may not be charged or used in flight. Check your specific airline conditions before you fly, as they set their own limits.' },
    { q: 'Why should you never leave a vape in a car?', a: 'A parked car in an Australian summer easily exceeds the safe storage temperature of a lithium cell. It is the most common way people damage a battery without realising, and heat damage is cumulative and permanent.' },
  ],
  'vape-not-hitting-troubleshooting-guide': [
    { q: 'Why is my vape not hitting but has charge?', a: 'Most often blocked airflow. Pocket lint and dust collect in the air inlet on the base. Blow firmly through the mouthpiece to force air back out through the inlet, or clear it with a dry toothpick. This alone fixes a large share of apparently dead disposables.' },
    { q: 'Why is my vape gurgling or leaking into my mouth?', a: 'Condensation has pooled around the airflow sensor — common after the device has been in a warm car or tight pocket. Wrap a tissue around the mouthpiece and flick the device sharply downwards mouthpiece-first a few times, then stand it upright for ten minutes.' },
    { q: 'Why does my vape taste burnt?', a: 'The coil is exhausted or the wick has run dry. A burnt, harsh or peppery taste is the coil itself rather than the flavour. On a disposable this is effectively the end of the device; on a refillable it means replacing a cheap coil and keeping the tank topped up.' },
    { q: 'Why is my vape blinking and not working?', a: 'Rapid blinking — commonly ten or fifteen times — is the short-circuit protection circuit, usually triggered by chain-vaping or moisture across the contacts. Rest the device for 15 to 30 minutes. If the blinking persists after resting and charging, it is finished.' },
    { q: 'Am I drawing on my vape wrong?', a: 'Possibly, and it is very common for ex-smokers. An auto-draw sensor needs a long, gentle, steady pull of three to four seconds — as if sipping a thick milkshake. A short sharp cigarette-style drag can fail to trigger it, or pull liquid past the coil and flood the sensor.' },
  ],
  'mesh-coils-explained-australia': [
    { q: 'What is a mesh coil?', a: 'A heating element made from a flat perforated metal sheet pressed against the wick, instead of the traditional spring-shaped round wire. The sheet contacts a broad continuous area of the wick rather than a thin line, so it heats far more evenly.' },
    { q: 'Are mesh coils better than standard coils?', a: 'For most purposes, yes. More even heating means fewer scorched patches on the wick, cleaner flavour, faster ramp-up, more vapour per watt, and a significantly longer working life. That last point is what made 10,000-plus puff disposables possible at all.' },
    { q: 'Why do high puff vapes need mesh coils?', a: 'A round-wire coil concentrates heat in a few hot spots and would taste burnt long before reaching 15,000 puffs. Mesh spreads the heat so the wick degrades much more slowly. Mesh plus USB-C charging is what makes the high-capacity tier viable.' },
    { q: 'How long does a mesh coil last?', a: 'On a disposable, the coil lasts as long as the device. On a refillable pod system, expect to replace a coil every one to two weeks of regular use — sooner if you vape sweet or dark dessert liquids, which leave more residue.' },
    { q: 'Do mesh coils still burn out?', a: 'Yes. Mesh is better, not immune. If the wick runs dry it scorches like any coil, so never vape a refillable with the tank low. A new coil also needs priming — let it soak for a few minutes before first use so the cotton is fully saturated.' },
  ],
  'nicotine-pouches-vs-vaping-australia': [
    { q: 'Are nicotine pouches better than vaping?', a: 'Neither is simply better — they suit different situations. Pouches win on discretion, being hands-free, needing no battery and travelling easily. Vaping wins on speed of onset, dose control, flavour variety and the familiar hand-to-mouth ritual.' },
    { q: 'Is a 6mg pouch the same as 6mg e-liquid?', a: 'No, and this catches people out. Oral and inhaled nicotine absorb completely differently, so the numbers are not comparable across formats. A strength that feels mild in a vape can feel very strong as a pouch — start at 6mg or lower with pouches regardless of your vaping habit.' },
    { q: 'How fast do nicotine pouches work compared to vaping?', a: 'A vape reaches the bloodstream through the lungs within seconds, so you feel it almost immediately and control the dose puff by puff. A pouch absorbs through the gum over 20 to 40 minutes — slower onset, flatter curve, and no moment-to-moment control once it is in.' },
    { q: 'Can you use nicotine pouches and vape at the same time?', a: 'Many people do — vaping at home and pouches at work, on flights or anywhere vaping is impractical. The one caution is that total nicotine intake is easier to lose track of across two formats. Dizziness, nausea, headache or a racing heart mean you have had too much.' },
    { q: 'Which is cheaper, pouches or vaping?', a: 'Pouches are more predictable: every ZYN variety we stock is $14.99 a tin, so three pouches a day is roughly $2.25. Vaping ranges much more widely — from about $4.28 per 1,000 puffs on a small device to under $2.00 on a large one, and lower again in multi-packs.' },
  ],
  'vape-disposal-and-recycling-australia': [
    { q: 'Can you put a vape in the bin in Australia?', a: 'No — never in general waste, recycling or green bins. The lithium cell ignites when crushed or punctured, which is exactly what happens in a collection truck or sorting facility. Battery-caused fires at Australian waste facilities are a documented and growing problem.' },
    { q: 'Where can I recycle a vape in Australia?', a: 'Use the B-cycle drop-off finder or ask your council. B-cycle states nationally that you cannot recycle a whole vape, only a removable battery — but some councils, such as Townsville, accept whole vapes in their battery bins. Check what your specific drop-off point takes, as the national position and local practice differ.' },
    { q: 'Should I take the battery out of a disposable vape?', a: 'No. The cell inside a sealed disposable has no protective casing, and puncturing or bending it can start a fire while you are holding it. Take the device whole to a drop-off point that accepts whole vapes.' },
    { q: 'Where do you dispose of e-liquid and pods?', a: 'Participating pharmacies accept pods, cartridges and leftover e-liquid through the Return Unwanted Medicines (RUM) Project. Batteries must never go into a RUM bin — they are a fire risk there too. Liquid and pods to the pharmacy, batteries and devices to a battery or e-waste collection point.' },
    { q: 'How do I create less vape waste?', a: 'Buy fewer, larger devices — one 20,000-puff device replaces roughly six 3,500-puff devices, so one battery to dispose of instead of six, usually at a lower cost per puff. A refillable pod system cuts it further: one battery for months or years, plus bottles of e-liquid.' },
  ],
  'best-value-vapes-under-20-australia': [
    { q: 'What is the cheapest vape in Australia?', a: 'Our range starts at $12.99, and 1,320 of our 1,711 disposables are under $20. But the cheapest device is rarely the cheapest way to vape — what matters is cost per 1,000 puffs, not the sticker price.' },
    { q: 'What is the best value puff count under $20?', a: 'Generally the 5,000 to 8,000 puff range. Below about 3,500 puffs you pay a premium for a small device; above 10,000 you are usually over $20. We stock 159 products at 6,000 puffs, 81 at 5,000 and 82 at 8,000, so there is real choice in that band.' },
    { q: 'Is a cheap vape worth it?', a: 'For trying an unfamiliar flavour, occasional use, keeping a spare or rotating between profiles — yes. For daily vaping, no: a $12.99 device rated 1,800 puffs costs about $7.22 per 1,000 puffs, while a $22.99 device rated 12,000 puffs costs about $1.92.' },
    { q: 'How do you spot a fake vape?', a: 'Unusually cheap stock of a well-known brand is the classic signal. Genuine product has sharp, correctly spelled packaging, consistent colours, a verifiable security code where the manufacturer provides one, and flavour names matching the official line-up. Counterfeits often have blurred print or subtly wrong shades.' },
    { q: 'What is the cheapest way to vape long term?', a: 'If you know your flavour and vape daily, multi-packs take roughly 10–15% off the per-device price, and mix and match packs avoid committing to one flavour. Longer term, a refillable pod system is cheapest — the crossover usually arrives in the second or third month.' },
  ],}

export function faqsFor(slug: string): Faq[] {
  return BLOG_FAQS[slug] ?? []
}
