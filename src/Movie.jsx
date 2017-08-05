import React from "react";
import ReactDOM from "react-dom";
import Immutable from "immutable";

import smoothScroll from "smoothscroll";


class ActionButton extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  handleMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();

    this.props.onInvoke(this.props.id);
  }

  render() {
    return (
      <li className={this.props.className} onMouseDown={this.handleMouseDown} />
    );
  }  
}


class Movie extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      imageURL: null
    };
  }

  loadImages() {
    if (this.li.offsetTop < window.innerHeight + window.scrollY && !this.state.imageURL) {
      const imageName = this.props.image ? this.props.image : this.props.title.replace(/ /g, "_");
      const baseURL = location.origin === "http://bestestmoviesever.com" ? "http://d1rus1jxo7361x.cloudfront.net" : "";

      this.setState({
        imageURL: baseURL + "/images/" + imageName + ".jpg"
      });
    }
  }

  handleScroll = (event) => {
    this.loadImages();
  }

  handleClick = (event) => {
    this.props.onSelectIndex(this.props.index);
  }

  handleAddFavorite = (movieId) => {
    console.log(movieId);

    this.props.onAddFavorite(movieId);
  }

  componentDidMount() {
    this.loadImages();

    document.addEventListener("scroll", this.handleScroll, false);
  }

  componentWillUnmount() {
    document.removeEventListener("scroll", this.handleScroll, false);
  }

  componentDidUpdate() {
    //console.log("componentDidUpdate()");
    this.loadImages();

    if (this.props.selected && ((this.li.offsetTop + this.li.offsetHeight + 10) > (window.innerHeight + document.body.scrollTop) ||
                                (this.li.offsetTop < document.body.scrollTop + 50))) {
      //smoothScroll(this.li.offsetTop - 105 - (window.innerHeight / 2) + (this.li.offsetTop / 2));
      //smoothScroll(this.li.offsetTop - ((window.innerHeight + 50) / 2) + (this.li.offsetHeight / 2));
      smoothScroll(this.li.offsetTop - ((window.innerHeight + 50 - this.li.offsetHeight) / 2) + 16);
    }
  }

  render() {
    //console.log("Movie#render()");

    const group = this.props.group ? (
      <h1>{this.props.group}</h1>
    ) : null;

    const stem = this.props.selected ? (
      <div style={{position: "absolute", background: "hsl(0, 0%, 10%)", width: 13, height: 13, left: "50%", marginLeft: -7, bottom: -25,
                   transform: "rotate(45deg)", borderLeft: "1px solid hsl(0, 0%, 20%)", borderTop: "1px solid hsl(0, 0%, 20%)"}}></div>
    ) : null;

    const details = this.props.selected ? (
      <div className="details" style={{height: 70, marginTop: 20, marginBottom: 10}}>
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", position: "absolute", left: 0, right: 0, padding: "0 0px",
                     background: "hsl(0, 0%, 10%", height: 70, borderTop: "1px solid hsl(0, 0%, 20%)"}}>
          <div style={{fontSize: 20, fontWeight: 700, display: "flex", justifyContent: "center", marginBottom: 8}}>{this.props.title}</div>
          <div style={{fontSize: 15, fontWeight: 400, display: "flex", justifyContent: "center"}}>
            {this.props.released}
            &nbsp; &#9724;&#xfe0e; &nbsp;
            {this.props.directorIds ? this.props.directorIds.map(id => this.props.directors.get(id)).join(", ") : "Unknown"}
          </div>
        </div>
      </div>
    ) : null;

    return (
      <li ref={li => this.li = li} className={this.props.selected ? "selected" : ""} data-index={this.props.index}>
        <h1>{this.props.group}</h1>
        <div className="image" data-title={this.props.title} data-released={this.props.released} onMouseDown={this.handleClick}>
          {stem}
          <img src={this.state.imageURL} title={this.props.title} />
          <ul className="actions" style={{display: "flex", alignItems: "flex-end", position: "absolute", bottom: 0, left: 0, right: 0, height: 50}}>
            <ActionButton className="watchlist" id={this.props.id} onInvoke={this.handleAddFavorite} />
            <ActionButton className="watched" id={this.props.id} onInvoke={this.handleAddFavorite} />
            <ActionButton className={"favorite" + (this.props.favorite ? " selected" : "")} id={this.props.id} onInvoke={this.handleAddFavorite} />
          </ul>
        </div>
        {details}
      </li>
    );
  }

}

export default Movie;
