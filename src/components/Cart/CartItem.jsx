import React from "react";
import { Link } from "react-router-dom";
import Icon from "../Icon/Icon.jsx";
import ProductImage from "../ProductImage/ProductImage.jsx";
import QuantitySelector from "../QuantitySelector/QuantitySelector.jsx";
import { useCart } from "../../contexts/CartContext.js";
import { formatCurrency } from "../../utils/currency.js";

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();
  const lineTotal = item.price * item.quantity;

  return (
    <li className="cart-item">
      <Link to={`/products/${item.id}`} className="cart-item__media">
        <ProductImage src={item.image} alt={item.title} />
      </Link>

      <div className="cart-item__info">
        <Link to={`/products/${item.id}`} className="cart-item__title">{item.title}</Link>
        <p className="eyebrow cart-item__cat">{item.category}</p>
        <p className="price cart-item__unit">{formatCurrency(item.price)}</p>
      </div>

      <div className="cart-item__controls">
        <QuantitySelector
          value={item.quantity}
          onChange={(q) => updateQuantity(item.id, q)}
          idLabel={`Quantity for ${item.title}`}
        />
        <button
          type="button"
          className="btn btn--danger btn--sm cart-item__remove"
          onClick={() => removeItem(item.id)}
          aria-label={`Remove ${item.title} from cart`}
        >
          <Icon name="trash" size={16} /> Remove
        </button>
      </div>

      <p className="price cart-item__total tabular">{formatCurrency(lineTotal)}</p>
    </li>
  );
}
