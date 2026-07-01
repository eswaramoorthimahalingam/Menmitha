import { Link } from "@tanstack/react-router";
import { type CSSProperties } from "react";

import { type Product } from "@/data/catalog";

const CARD_THEMES = [
  { accent: "oklch(0.76 0.17 75)", soft: "oklch(0.92 0.08 68)" },
  { accent: "oklch(0.69 0.17 18)", soft: "oklch(0.91 0.07 22)" },
  { accent: "oklch(0.66 0.14 190)", soft: "oklch(0.91 0.05 190)" },
  { accent: "oklch(0.62 0.16 142)", soft: "oklch(0.91 0.06 142)" },
];

type ProductShowcaseCardProps = {
  product: Product;
  index?: number;
  onAdd?: (id: string) => void;
};

export function ProductShowcaseCard({ product, index = 0, onAdd }: ProductShowcaseCardProps) {
  const theme = CARD_THEMES[index % CARD_THEMES.length];
  const description = product.tagline || product.unit;

  return (
    <article
      className="product-showcase-card"
      style={
        {
          "--card-accent": theme.accent,
          "--card-soft": theme.soft,
        } as CSSProperties
      }
    >
      <Link
        to="/product/$productId"
        params={{ productId: product.id }}
        className="product-showcase-image"
        aria-label={product.name}
      >
        <img src={product.img} alt={product.name} loading="lazy" />
      </Link>

      <div className="product-showcase-content mt-7">
        {product.tag && <span className="product-showcase-tag">{product.tag}</span>}
        <Link to="/product/$productId" params={{ productId: product.id }}>
          <h3>{product.name}</h3>
        </Link>
        <p>{description}</p>
        <div className="product-showcase-price">
          <span>₹{product.price}</span>
        </div>
        {product.mrp && product.mrp > product.price && (
          <p className="product-showcase-mrp">MRP ₹{product.mrp}</p>
        )}
        {onAdd ? (
          <button onClick={() => onAdd(product.id)} className="product-showcase-button">
            Add to cart
          </button>
        ) : (
          <Link
            to="/product/$productId"
            params={{ productId: product.id }}
            className="product-showcase-button"
          >
            Add to cart
          </Link>
        )}
      </div>
    </article>
  );
}
