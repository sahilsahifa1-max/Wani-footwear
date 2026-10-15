import type { Product, ProductFilter } from '../types/index.ts';

export function filterProducts(products: Product[], filter: ProductFilter): Product[] {
  return products.filter((product) => {
    // Search query matching against name, category, tagline, description, footwearType
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase().trim();
      const matchName = product.name.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchTagline = product.tagline.toLowerCase().includes(q);
      const matchType = product.footwearType.toLowerCase().includes(q);
      const matchDescription = product.description.toLowerCase().includes(q);
      if (!matchName && !matchCategory && !matchTagline && !matchType && !matchDescription) {
        return false;
      }
    }

    // Audience filter
    if (filter.audience !== 'all') {
      if (product.audience !== filter.audience && product.audience !== 'universal') {
        return false;
      }
    }

    // Category filter
    if (filter.category !== 'all') {
      if (product.category !== filter.category) {
        return false;
      }
    }

    // Size filter
    if (filter.size !== 'all') {
      if (!product.sizes.includes(filter.size)) {
        return false;
      }
    }

    // Color filter
    if (filter.color !== 'all') {
      const hasColor = product.colors.some(
        (c) => c.name.toLowerCase() === filter.color.toLowerCase()
      );
      if (!hasColor) {
        return false;
      }
    }

    // Price range
    if (product.price < filter.priceMin || product.price > filter.priceMax) {
      return false;
    }

    // In stock filter
    if (filter.inStockOnly && !product.inStock) {
      return false;
    }

    return true;
  });
}

export function sortProducts(
  products: Product[],
  sortBy: ProductFilter['sortBy']
): Product[] {
  const cloned = [...products];

  switch (sortBy) {
    case 'price-asc':
      return cloned.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return cloned.sort((a, b) => b.price - a.price);
    case 'newest':
      return cloned.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    case 'featured':
    default:
      return cloned.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }
}
