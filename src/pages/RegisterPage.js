import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../components/Icon/Icon.jsx";
import { useAuth } from "../contexts/AuthContext.js";
import { useToast } from "../contexts/ToastContext.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { validateName, validateEmail, validatePassword, validateConfirm } from "../utils/validation.js";

export default function RegisterPage() {
  useDocumentTitle("Create account");
  const { register, loading } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "", terms: false });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const set = (key, value) => setValues((v) => ({ ...v, [key]: value }));

  const validate = () => {
    const next = {
      name: validateName(values.name),
      email: validateEmail(values.email),
      password: validatePassword(values.password),
      confirm: validateConfirm(values.confirm, values.password),
      terms: values.terms ? "" : "Please acknowledge the terms.",
    };
    setErrors(next);
    return Object.values(next).every((v) => !v);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;
    const res = await register({ name: values.name, email: values.email, password: values.password });
    if (res.ok) {
      notify("Account created", { type: "success" });
      navigate("/account", { replace: true });
    } else {
      setFormError(res.error);
    }
  };

  const f = (key, label, props = {}) => (
    <div className="field">
      <label htmlFor={key}>{label}</label>
      <input id={key} name={key} className="input" value={values[key]}
        onChange={(e) => set(key, e.target.value)}
        aria-invalid={errors[key] ? "true" : undefined} aria-describedby={errors[key] ? `${key}-err` : undefined} {...props} />
      {errors[key] && <p className="field-error" id={`${key}-err`}><Icon name="alert" size={13} /> {errors[key]}</p>}
    </div>
  );

  return (
    <div className="container auth">
      <div className="auth__card glass">
        <h1 className="auth__title">Create your account</h1>
        <p className="auth__sub muted">A simulated account stored only in your browser.</p>

        {formError && <div className="auth__banner" role="alert"><Icon name="alert" size={16} /> {formError}</div>}

        <form className="auth__form" onSubmit={onSubmit} noValidate>
          {f("name", "Full name", { autoComplete: "name" })}
          {f("email", "Email", { type: "email", autoComplete: "email" })}
          {f("password", "Password", { type: "password", autoComplete: "new-password" })}
          {f("confirm", "Confirm password", { type: "password", autoComplete: "new-password" })}

          <div className="field">
            <label className="check">
              <input type="checkbox" checked={values.terms} onChange={(e) => set("terms", e.target.checked)}
                aria-invalid={errors.terms ? "true" : undefined} aria-describedby={errors.terms ? "terms-err" : undefined} />
              <span>I understand this is a demo project and no real account is created.</span>
            </label>
            {errors.terms && <p className="field-error" id="terms-err"><Icon name="alert" size={13} /> {errors.terms}</p>}
          </div>

          <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="auth__alt">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
