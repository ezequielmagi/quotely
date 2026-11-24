export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  category: Category;
};