import React, { useState } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Icon from "../components/Icon/Icon.jsx";
import { useAuth } from "../contexts/AuthContext.js";
import { useToast } from "../contexts/ToastContext.js";
import useDocumentTitle from "../hooks/useDocumentTitle.js";
import { validateEmail, required } from "../utils/validation.js";

export default function LoginPage() {
  useDocumentTitle("Sign in");
  const { login, loading } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const destination = params.get("next") || location.state?.from || "/account";

  const validate = () => {
    const next = {
      email: validateEmail(values.email),
      password: required(values.password, "Password"),
    };
    setErrors(next);
    return !next.email && !next.password;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;
    const res = await login(values);
    if (res.ok) {
      notify("Signed in", { type: "success" });
      navigate(destination, { replace: true });
    } else {
      setFormError(res.error);
    }
  };

  return (
    <div className="container auth">
      <div className="auth__card glass">
        <h1 className="auth__title">Welcome back</h1>
        <p className="auth__sub muted">Sign in to your demo account to check out.</p>

        {formError && (
          <div className="auth__banner" role="alert">
            <Icon name="alert" size={16} /> {formError}
          </div>
        )}

        <form className="auth__form" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className="input" autoComplete="email"
              value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })}
              aria-invalid={errors.email ? "true" : undefined} aria-describedby={errors.email ? "email-err" : undefined} />
            {errors.email && <p className="field-error" id="email-err"><Icon name="alert" size={13} /> {errors.email}</p>}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" className="input" autoComplete="current-password"
              value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })}
              aria-invalid={errors.password ? "true" : undefined} aria-describedby={errors.password ? "password-err" : undefined} />
            {errors.password && <p className="field-error" id="password-err"><Icon name="alert" size={13} /> {errors.password}</p>}
          </div>

          <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="auth__demo">
          Demo authentication (frontend only). Create an account on the register page, then sign in
          with those details. Accounts live only in this browser's Local Storage.
        </p>

        <p className="auth__alt">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
