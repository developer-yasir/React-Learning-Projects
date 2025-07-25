// src/components/ProductCard.jsx
import React from "react";

const ProductCard = ({ product, onAdd }) => {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>Rs. {product.price}</p>
      <button onClick={() => onAdd(product)}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;
