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
          const element = <Movie key={movie.title}
                                 index={movie.index}
                                 id={movie.id} title={movie.title}
                                 released={movie.released}
                                 directorIds={movie.directors}
                                 directors={this.props.directors}
                                 categories={movie.categories}
                                 image={movie.image}
                                 selected={movie.index === this.props.selectedIndex}
                                 favorite={this.props.favoriteIds.includes(movie.id)}
                                 group={released !== movie.released ? movie.released : ""}
                                 onSelectIndex={this.props.onSelectIndex}
                                 onAddFavorite={this.props.onAddFavorite} />;

          return [movie.released, list.concat(element)];
        }, [0, []])[1]}
      </ul>
    );
  }
}

export default MovieList;
