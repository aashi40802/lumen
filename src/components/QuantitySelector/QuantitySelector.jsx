import React from "react";
import Icon from "../Icon/Icon.jsx";
import { MIN_QTY, MAX_QTY } from "../../utils/constants.js";
import { clampQuantity } from "../../utils/cartCalculations.js";

/* Accessible quantity stepper. Prevents zero, negatives, decimals, and
   values above MAX_QTY. Typed input is clamped on change. */
export default function QuantitySelector({ value, onChange, min = MIN_QTY, max = MAX_QTY, idLabel = "Quantity" }) {
  const dec = () => onChange(clampQuantity(value - 1));
  const inc = () => onChange(clampQuantity(value + 1));

  return (
    <div className="qty" role="group" aria-label={idLabel}>
      <button type="button" className="qty__btn" onClick={dec} disabled={value <= min} aria-label="Decrease quantity">
        <Icon name="minus" size={16} />
      </button>
      <input
        className="qty__input tabular"
        type="text"
        inputMode="numeric"
        aria-label={idLabel}
        value={value}
        onChange={(e) => {
          const digits = e.target.value.replace(/[^\d]/g, "");
          onChange(digits === "" ? min : clampQuantity(Number(digits)));
        }}
      />
      <button type="button" className="qty__btn" onClick={inc} disabled={value >= max} aria-label="Increase quantity">
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}
