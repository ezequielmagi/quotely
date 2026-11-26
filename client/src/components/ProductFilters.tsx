import type { Category } from '../types';

type ProductFiltersProps = {
  categories: Category[];
  categoryId: number | undefined;
  search: string;
  onCategoryChange: (categoryId: number | undefined) => void;
  onSearchChange: (search: string) => void;
};

function chipClass(active: boolean) {
  return active
    ? 'rounded-full bg-gray-900 px-4 py-1.5 text-sm font-medium text-white'
    : 'rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100';
}

export function ProductFilters({
  categories,
  categoryId,
  search,
  onCategoryChange,
  onSearchChange,
}: ProductFiltersProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
      <input
        type="search"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar productos..."
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 sm:max-w-xs"
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onCategoryChange(undefined)}
          className={chipClass(categoryId === undefined)}
        >
          Todas
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategoryChange(category.id)}
            className={chipClass(categoryId === category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}