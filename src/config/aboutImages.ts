import { AboutImageConfig } from '../types/index.ts';

/**
 * ============================================================================
 * VANI FOOTWEAR — ABOUT PAGE IMAGE CONFIGURATION
 * ============================================================================
 * 
 * Store Owner: Bilal Ahmed Vani
 * Store Location: Kanewan, Jammu & Kashmir, India
 * 
 * INSTRUCTIONS FOR OWNER / ADMIN:
 * To use your real store and team photography, replace the URL strings below with
 * your hosted image links (e.g. from Cloudinary, Imgur, or direct CDN links).
 * 
 * Note: If any image URL is left as an empty string ("") or fails to load,
 * the About page automatically renders an elegant, brand-aligned fallback illustration
 * with zero broken image frames.
 */

export const aboutImages: AboutImageConfig = {
  // 1. Portrait of the store founder: Bilal Ahmed Vani
  // Replace with high-resolution photo of Bilal Ahmed Vani at the Kanewan store.
  ownerPortrait: "",

  // 2. Exterior view of Vani Footwear storefront in Kanewan, J&K
  storefront: "",

  // 3. Interior view showing organized shoe displays and customer seating
  interior: "",

  // 4. Close-up showcase of footwear collections on shelves
  footwearDisplay: "",

  // 5. Store team / welcoming staff photo
  teamPhoto: "",

  // 6. Additional gallery images from around the shop and community
  additionalGalleryImages: []
};

export default aboutImages;
