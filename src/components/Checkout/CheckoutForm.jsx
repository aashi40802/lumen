import React, { useRef, useState } from "react";
import Icon from "../Icon/Icon.jsx";
import { SHIPPING } from "../../utils/constants.js";
import { formatCurrency } from "../../utils/currency.js";
import {
  validateName, validateEmail, validatePhone, required, validatePostal,
  validateCardName, validateCardNumber, validateExpiry, validateCvc,
  formatCardNumber, formatExpiry,
} from "../../utils/validation.js";

const EMPTY = {
  fullName: "", email: "", phone: "",
  address: "", apt: "", city: "", region: "", postal: "", country: "United States",
  cardName: "", cardNumber: "", expiry: "", cvc: "",
  terms: false,
};

/* Multi-section checkout form. Validates on submit (and re-validates a field
   after it has been touched), focuses the first invalid field, never clears
   entered data, and NEVER persists payment details. */
export default function CheckoutForm({ prefill, method, onMethodChange, submitting, onSubmit }) {
  const [values, setValues] = useState({ ...EMPTY, ...prefill });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const formRef = useRef(null);

  const validators = {
    fullName: (v) => validateName(v),
    email: (v) => validateEmail(v),
    phone: (v) => validatePhone(v),
    address: (v) => required(v, "Address"),
    city: (v) => required(v, "City"),
    region: (v) => required(v, "State or region"),
    postal: (v) => validatePostal(v),
    country: (v) => required(v, "Country"),
    cardName: (v) => validateCardName(v),
    cardNumber: (v) => validateCardNumber(v),
    expiry: (v) => validateExpiry(v),
    cvc: (v) => validateCvc(v),
    terms: (v) => (v ? "" : "Please acknowledge the demo terms."),
  };

  const validateAll = () => {
    const next = {};
    for (const key of Object.keys(validators)) {
      const msg = validators[key](values[key]);
      if (msg) next[key] = msg;
    }
    return next;
  };

  const setField = (key, value) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (touched[key]) {
      setErrors((e) => ({ ...e, [key]: validators[key] ? validators[key](value) : "" }));
    }
  };

  const onBlur = (key) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors((e) => ({ ...e, [key]: validators[key] ? validators[key](values[key]) : "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validateAll();
    setErrors(found);
    setTouched(Object.keys(validators).reduce((a, k) => ({ ...a, [k]: true }), {}));
    if (Object.keys(found).length > 0) {
      const firstKey = Object.keys(validators).find((k) => found[k]);
      const el = formRef.current?.querySelector(`[name="${firstKey}"]`);
      if (el) el.focus();
      return;
    }
    // Strip payment fields before handing data upward — they are never stored.
    const { cardName, cardNumber, expiry, cvc, ...safe } = values;
    onSubmit(safe);
  };

  const field = (key, label, props = {}) => (
    <div className="field">
      <label htmlFor={key}>{label}</label>
      <input
        id={key}
        name={key}
        className="input"
        value={values[key]}
        onChange={(e) => setField(key, e.target.value)}
        onBlur={() => onBlur(key)}
        aria-invalid={errors[key] ? "true" : undefined}
        aria-describedby={errors[key] ? `${key}-err` : undefined}
        {...props}
      />
      {errors[key] && (
        <p className="field-error" id={`${key}-err`}>
          <Icon name="alert" size={13} /> {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <form className="checkout-form" ref={formRef} onSubmit={handleSubmit} noValidate>
      <section className="checkout-section glass">
        <h2 className="checkout-section__title">Contact information</h2>
        <div className="grid-2">
          {field("fullName", "Full name", { autoComplete: "name" })}
          {field("email", "Email", { type: "email", autoComplete: "email" })}
        </div>
        {field("phone", "Phone", { type: "tel", autoComplete: "tel", inputMode: "tel" })}
      </section>

      <section className="checkout-section glass">
        <h2 className="checkout-section__title">Shipping address</h2>
        {field("address", "Address", { autoComplete: "address-line1" })}
        {field("apt", "Apartment or suite (optional)", { autoComplete: "address-line2" })}
        <div className="grid-2">
          {field("city", "City", { autoComplete: "address-level2" })}
          {field("region", "State / region", { autoComplete: "address-level1" })}
        </div>
        <div className="grid-2">
          {field("postal", "Postal code", { autoComplete: "postal-code", inputMode: "numeric" })}
          {field("country", "Country", { autoComplete: "country-name" })}
        </div>
      </section>

      <section className="checkout-section glass">
        <h2 className="checkout-section__title">Delivery method</h2>
        <div className="delivery" role="radiogroup" aria-label="Delivery method">
          {Object.values(SHIPPING).map((opt) => (
            <label key={opt.id} className={`delivery__opt ${method === opt.id ? "is-active" : ""}`}>
              <input
                type="radio"
                name="delivery"
                value={opt.id}
                checked={method === opt.id}
                onChange={() => onMethodChange(opt.id)}
              />
              <span className="delivery__body">
                <span className="delivery__label">{opt.label}</span>
                <span className="muted delivery__eta">{opt.eta}</span>
              </span>
              <span className="price">{formatCurrency(opt.price)}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="checkout-section glass">
        <div className="checkout-section__head">
          <h2 className="checkout-section__title">Payment</h2>
          <span className="sim-tag"><Icon name="lock" size={13} /> Simulated — no real payment</span>
        </div>
        <p className="muted checkout-note">
          This is a demonstration. Do not enter real card details. Use a test number such as
          4242 4242 4242 4242. Payment information is validated for format only and is never stored.
        </p>
        {field("cardName", "Cardholder name", { autoComplete: "off" })}
        <div className="field">
          <label htmlFor="cardNumber">Card number</label>
          <input
            id="cardNumber" name="cardNumber" className="input tabular" inputMode="numeric"
            placeholder="4242 4242 4242 4242" autoComplete="off"
            value={values.cardNumber}
            onChange={(e) => setField("cardNumber", formatCardNumber(e.target.value))}
            onBlur={() => onBlur("cardNumber")}
            aria-invalid={errors.cardNumber ? "true" : undefined}
            aria-describedby={errors.cardNumber ? "cardNumber-err" : undefined}
          />
          {errors.cardNumber && <p className="field-error" id="cardNumber-err"><Icon name="alert" size={13} /> {errors.cardNumber}</p>}
        </div>
        <div className="grid-2">
          <div className="field">
            <label htmlFor="expiry">Expiry (MM/YY)</label>
            <input
              id="expiry" name="expiry" className="input tabular" inputMode="numeric" placeholder="MM/YY" autoComplete="off"
              value={values.expiry}
              onChange={(e) => setField("expiry", formatExpiry(e.target.value))}
              onBlur={() => onBlur("expiry")}
              aria-invalid={errors.expiry ? "true" : undefined}
              aria-describedby={errors.expiry ? "expiry-err" : undefined}
            />
            {errors.expiry && <p className="field-error" id="expiry-err"><Icon name="alert" size={13} /> {errors.expiry}</p>}
          </div>
          {field("cvc", "Security code", { inputMode: "numeric", autoComplete: "off", maxLength: 4 })}
        </div>
      </section>

      <div className="field field--check">
        <label className="check">
          <input
            type="checkbox" name="terms" checked={values.terms}
            onChange={(e) => setField("terms", e.target.checked)}
            onBlur={() => onBlur("terms")}
            aria-invalid={errors.terms ? "true" : undefined}
            aria-describedby={errors.terms ? "terms-err" : undefined}
          />
          <span>I understand this is a demo order and no real purchase or payment is made.</span>
        </label>
        {errors.terms && <p className="field-error" id="terms-err"><Icon name="alert" size={13} /> {errors.terms}</p>}
      </div>

      <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={submitting}>
        {submitting ? "Placing order…" : "Place order"}
      </button>
    </form>
  );
}
