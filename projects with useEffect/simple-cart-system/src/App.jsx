// src/App.jsx
import React, { useState, useEffect } from "react";
import { products } from "./data/products";
import ProductCard from "./components/ProductCard";
import CartItem from "./components/CartItem";
import "./index.css";

function App() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart"));
    if (saved) setCartItems(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const exists = cartItems.find((item) => item.id === product.id);
    if (exists) {
      const updatedCart = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };
  
  const removeFromCart = (id) => {
    const target = cartItems.find((item) => item.id === id);
    if (target.quantity === 1) {
      setCartItems(cartItems.filter((item) => item.id !== id));
    } else {
      const updatedCart = cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
      setCartItems(updatedCart);
    }
  };
  

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  return (
    <div className="container">
      <h1>🛒 Simple Cart System</h1>

      <div className="main">
        {/* Products */}
        <div className="products">
          <h2>Products</h2>
          <div className="product-list">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} />
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="cart">
          <h2>Cart ({cartItems.length})</h2>
          {cartItems.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            <>
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} onRemove={removeFromCart} />
              ))}
              <hr />
              <p className="total">Total: Rs. {total}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
