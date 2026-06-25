export interface FaqItem {
  q: string
  a: string
}

export interface FaqSection {
  title: string
  items: FaqItem[]
}

// Editable FAQ content (not in the DB). Answers reflect Aussie Vape's real
// policies: manual PayID/crypto payment via WhatsApp, $250 min order, free
// shipping over $300, 18+ only.
export const FAQ_SECTIONS: FaqSection[] = [
  {
    title: 'Placing an Order',
    items: [
      { q: 'Do I need to be 18 or older to order?', a: 'Yes. All sales are strictly for adults aged 18 and over. Orders are age-verified and we may request ID before dispatch.' },
      { q: 'Is there a minimum order?', a: 'Yes — the minimum order is $250. Your cart subtotal must reach this before you can check out.' },
      { q: 'How do I place an order?', a: 'Add products to your cart, go to checkout, enter your shipping details, choose a payment method (PayID or cryptocurrency), and place the order. We then confirm payment with you on WhatsApp.' },
      { q: 'Can I change or cancel my order?', a: 'If your order hasn’t been dispatched yet, message us on WhatsApp as soon as possible and we’ll do our best to amend or cancel it.' },
      { q: 'Do I need an account to order?', a: 'No — you can check out as a guest. Creating an account lets you track orders and reorder faster.' },
      { q: 'Do you sell wholesale or bulk?', a: 'Yes. Visit our Wholesale page or get in touch via WhatsApp for bulk and trade pricing.' },
    ],
  },
  {
    title: 'Payments & Coupons',
    items: [
      { q: 'What payment methods do you accept?', a: 'We accept PayID (instant bank transfer) and cryptocurrency (BTC, ETH, USDT and more). After you place your order we send the payment details over WhatsApp.' },
      { q: 'Why is there no card payment?', a: 'Card processors restrict vaping products, so we settle payment manually via PayID or crypto. It’s quick — we guide you through it on WhatsApp.' },
      { q: 'How do I use a discount code?', a: 'Enter your coupon code at checkout. Codes have their own minimum spend and expiry; you’ll see the discount applied to your total.' },
      { q: 'When is my order confirmed?', a: 'Your order is reserved as “pending” the moment you place it, and confirmed once we receive your PayID/crypto payment.' },
    ],
  },
  {
    title: 'Shipping & Delivery',
    items: [
      { q: 'How much is shipping?', a: 'Flat-rate shipping applies to orders under $300. Orders over $300 ship free, Australia-wide.' },
      { q: 'How long does delivery take?', a: 'Orders are dispatched within 1 business day. Delivery typically takes 2–6 business days depending on your location.' },
      { q: 'Do you ship Australia-wide?', a: 'Yes, we ship to all Australian states and territories. Remote areas may take a little longer.' },
      { q: 'Do you ship internationally?', a: 'No — we currently ship within Australia only.' },
      { q: 'How do I track my order?', a: 'Once dispatched, we add a tracking number to your order. You can view it under My Account → Orders, or we’ll share it on WhatsApp.' },
    ],
  },
  {
    title: 'Returns & Warranty',
    items: [
      { q: 'Can I return a product?', a: 'Unopened products in original packaging can be returned within 30 days. For hygiene and safety, opened disposables, e-liquids and pouches can’t be returned unless faulty.' },
      { q: 'My device arrived faulty — what now?', a: 'Message us on WhatsApp within 7 days with your order number and a photo/description. We’ll arrange a replacement or refund for genuine faults.' },
      { q: 'How long do refunds take?', a: 'Once we receive and inspect a returned item, refunds are processed within 1–3 business days via your original payment method.' },
      { q: 'Are there restocking fees?', a: 'No restocking fee for unopened returns within 30 days. Return shipping is the customer’s responsibility unless the item is faulty.' },
    ],
  },
  {
    title: 'Product & Usage',
    items: [
      { q: 'How many puffs will a disposable last?', a: 'It varies by model — puff counts (e.g. 8,000 / 15,000) are listed on each product page. Real-world usage depends on how you vape.' },
      { q: 'What nicotine strengths do you stock?', a: 'We carry a range from nicotine-free up to higher strengths. Available strengths are shown on each product page where applicable.' },
      { q: 'How should I store my products?', a: 'Keep e-liquids and devices out of direct sunlight, away from heat, and out of reach of children and pets.' },
    ],
  },
]
