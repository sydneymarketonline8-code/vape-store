/**
 * Real product image overrides.
 *
 * The catalogue images shipped in products JSON are self-hosted SVG placeholders
 * (the original scraped product photos are dead / return 403). When you have a
 * real photo for a product, add it here keyed by the product **slug** and it
 * replaces the placeholder everywhere on the storefront — cards, the hero deals
 * banner, search, the cart, and the product page gallery.
 *
 * Value can be:
 *   - a single URL  -> used as the main image
 *   - an array of URLs -> used as the product-page gallery (first = main image)
 *
 * URLs can be absolute (https://…) or a path under /public (e.g. /products/iget.jpg).
 * Remote hosts must be allowed in next.config images.remotePatterns.
 *
 * Example:
 *   export const IMAGE_OVERRIDES: Record<string, string | string[]> = {
 *     'iget-bar-3500-blueberry-ice': '/products/iget-bar-3500-blueberry-ice.jpg',
 *     'gunnpod-2000-grape': [
 *       'https://cdn.example.com/gunnpod-2000-grape-front.jpg',
 *       'https://cdn.example.com/gunnpod-2000-grape-back.jpg',
 *     ],
 *   }
 */
export const IMAGE_OVERRIDES: Record<string, string | string[]> = {
  // Add entries as you collect real product photos. Keyed by product slug.
}
