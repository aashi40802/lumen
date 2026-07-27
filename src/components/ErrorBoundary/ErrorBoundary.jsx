import React from "react";
import Icon from "../Icon/Icon.jsx";

// Catches unexpected rendering errors so a crash in one subtree doesn't
// take down the whole app. Shows a friendly recovery UI.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Log for developers; users never see the raw error.
    console.error("[ErrorBoundary]", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container section">
          <div className="state-panel state-panel--error glass" role="alert">
            <span className="state-panel__icon is-danger" aria-hidden="true"><Icon name="alert" size={26} /></span>
            <h2 className="state-panel__title">This page hit an unexpected error</h2>
            <p className="state-panel__msg muted">Please reload the page. If it keeps happening, try again later.</p>
            <div className="state-panel__action">
              <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
                Reload page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
