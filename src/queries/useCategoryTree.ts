'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { CATEGORY_STRUCTURE, CATEGORY_SLUGS } from '@/lib/constants/categories';
import { slugify } from '@/lib/utils/slugify';

interface SubcategoryWithCount {
  name: string;
  slug: string;
  count: number;
}

interface CategoryWithCount {
  name: string;
  slug: string;
  count: number;
  subcategories: SubcategoryWithCount[];
}

export function useCategoryTree() {
  return useQuery({
    queryKey: ['categoryTree'],
    queryFn: async (): Promise<CategoryWithCount[]> => {
      const supabase = createClient();

      // Fetch all active listings
      const { data: listings, error } = await supabase
        .from('listings')
        .select('category, subcategory')
        .in('status', ['active', 'approved']);

      if (error) throw error;

      // Aggregate counts in memory
      const categoryMap = new Map<string, { count: number; subcategories: Map<string, number> }>();

      listings?.forEach(({ category, subcategory }) => {
        if (!categoryMap.has(category)) {
          categoryMap.set(category, { count: 0, subcategories: new Map() });
        }
        const cat = categoryMap.get(category)!;
        cat.count++;
        
        if (subcategory) {
          cat.subcategories.set(subcategory, (cat.subcategories.get(subcategory) || 0) + 1);
        }
      });

      // Format for UI
      return Object.keys(CATEGORY_STRUCTURE).map((categoryName) => {
        const categorySlug = CATEGORY_SLUGS[categoryName];
        const categoryData = categoryMap.get(categorySlug);

        return {
          name: categoryName,
          slug: categorySlug,
          count: categoryData?.count || 0,
          subcategories: CATEGORY_STRUCTURE[categoryName].map((subName) => {
            const subSlug = slugify(subName);
            return {
              name: subName,
              slug: subSlug,
              count: categoryData?.subcategories.get(subSlug) || 0,
            };
          }),
        };
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}