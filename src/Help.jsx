// @flow

import React from "react";

class Help extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.isOpen) {
      document.addEventListener("mousedown", this.handleTouchStart, true);
      document.addEventListener("touchstart", this.handleTouchStart, true);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen && !this.props.isOpen) {
      document.addEventListener("mousedown", this.handleTouchStart, true);
      document.addEventListener("touchstart", this.handleTouchStart, true);
    } else {
      document.removeEventListener("mousedown", this.handleTouchStart, true);
      document.removeEventListener("touchstart", this.handleTouchStart, true);
    }
  }

  handleTouchStart = event => {
    this.props.onDismiss();
  }

  render() {
    return (
      <div id="help-modal" className={this.props.isOpen ? "open" : ""} style={{position: "fixed", top: 0, right: 0, bottom: 0, left: 0, display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100}}>
        <div className="overlay" style={{position: "absolute", top: 0, right: 0, bottom: 0, left: 0, background: "hsla(0, 0%, 0%, 0.75)"}} />

        <div className="dialog" style={{position: "relative", background: "hsl(0, 0%, 10%)", border: "1px solid hsl(0, 0%, 20%)", borderRadius: 10, maxWidth: 500, boxShadow: "0 0 10px hsl(0, 0%, 0%)"}}>
          <h1 style={{fontWeight: "bold", textAlign: "center"}} data-text="Help Topics">How to Use</h1>
          <ul>
            <li className="mobile">Tap the <img src="icons/verification-sign.svg" height="14"/>&nbsp;Seen,&nbsp;
              <img src="icons/numbered-items.svg" height="14"/>&nbsp;Watchlist, and&nbsp;
              <img src="icons/heart.svg" height="14"/>&nbsp;Favorite buttons to categorize and group movies.</li>
            <li className="mobile">Tap the <img src="icons/menu-button.svg" height="14"/> Menu button to sort movies by date or filter by genre. Swipe left to dismiss.</li>
            <li className="mobile">Tap the <span className="bold" data-text="Movies">Movies</span> header title to show and filter by directors. Tap Reset Filter to clear.</li>

            <li className="desktop">Click the <img src="icons/verification-sign.svg" height="14"/>&nbsp;Seen,&nbsp;
              <img src="icons/numbered-items.svg" height="14"/>&nbsp;Watchlist, and&nbsp;
              <img src="icons/heart.svg" height="14"/>&nbsp;Favorite buttons to categorize and group movies.</li>
            <li className="desktop">Click the <img src="icons/menu-button.svg" height="14"/> Menu button to sort movies by date or filter by genre. Click again to dismiss.</li>
            <li className="desktop">Click the <span className="bold" data-text="Movies">Movies</span> header title to show and filter by directors. Click Reset Filter to clear.</li>
          </ul>
          <div className="desktop">
            <h1 style={{display: "flex", justifyContent: "center"}}>
              <span className="bold" data-text="Keyboard Shortcuts">Keyboard Shortcuts</span>
            </h1>
            <ul>
              <li className="desktop">Use the arrow keys to navigate and 1, 2, 3 keys to toggle Seen, Watchlist, and Favorite.</li>
              <li className="desktop">Press Enter to search for movies. Press Escape to exit search or exit the menu.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Help;
