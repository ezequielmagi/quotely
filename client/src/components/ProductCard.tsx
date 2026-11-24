import type { Product } from '../types';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="aspect-[3/2] w-full object-cover"
        />
      )}

      <div className="p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {product.category.name}
        </span>
        <h3 className="mt-1 font-semibold">{product.name}</h3>
        {product.description && (
          <p className="mt-2 text-sm text-gray-600">{product.description}</p>
        )}
      </div>
    </article>
  );
}