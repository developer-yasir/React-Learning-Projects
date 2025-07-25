// src/components/CartItem.jsx
import React from "react";

const CartItem = ({ item, onRemove }) => {
    return (
      <div className="cart-item">
        <span>
          {item.name} (x{item.quantity})
        </span>
        <div>
          Rs. {item.price * item.quantity}
          <button onClick={() => onRemove(item.id)}>Remove</button>
        </div>
      </div>
    );
  };
  

export default CartItem;
