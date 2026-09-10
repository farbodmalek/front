export type CartItem = {
  variantId: string;
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  attributes: { name: string; value: string }[];
};
