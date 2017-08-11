import React from "react";
import ReactDOM from "react-dom";
import Immutable from "immutable";

import Movie from "./Movie";


class MovieList extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.movies.isEmpty()) {
      return (
        <div style={{marginTop: 50, flex: 1, display: "flex", justifyContent: "center", alignItems: "center", fontSize: 30}}>No Matches</div>
      );
    }

    return (
      <ul className="movies">
        {this.props.movies.reduce(([released, list], movie) => {
          const element = <Movie key={movie.get("id")}
                                 index={movie.get("index")}
                                 id={movie.get("id")}
                                 title={movie.get("title")}
                                 released={movie.get("released")}
                                 directorIds={movie.get("directors")}
                                 directors={this.props.directors}
                                 categories={movie.get("categories")}
                                 image={movie.get("image")}
                                 selected={movie.get("index") === this.props.selectedIndex}
                                 watchlist={this.props.watchlistIds.includes(movie.get("id"))}
                                 favorite={this.props.favoriteIds.includes(movie.get("id"))}
                                 group={released !== movie.get("released") ? movie.get("released") : ""}
                                 onSelectIndex={this.props.onSelectIndex}
                                 onToggleFavorite={this.props.onToggleFavorite}
                                 onToggleWatchlist={this.props.onToggleWatchlist} />;

          return [movie.released, list.concat(element)];
        }, [0, []])[1]}
      </ul>
    );
  }
}

export default MovieList;
