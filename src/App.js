import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import "./App.css";
import SearchIcon from "./search.svg";

const API_URL = "https://www.omdbapi.com?apiKey=e23cbbe0";

// const movie1 = {
//   Title: "Spiderman and Grandma",
//   Year: "2009",
//   imdbID: "tt1433184",
//   Type: "movie",
//   Poster:
//     "https://m.media-amazon.com/images/M/MV5BMjE3Mzg0MjAxMl5BMl5BanBnXkFtZTcwNjIyODg5Mg@@._V1_SX300.jpg",
// };

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const searchMovies = async (title) => {
    // If the input field is empty, set error message and return
    if (!title) {
      setErrorMessage("No movies found");
      return;
    }

    const response = await fetch(`${API_URL}&s=${title}`);
    const data = await response.json();

    if (data.Response === "True") {
      setMovies(data.Search);
      setErrorMessage("");
    } else {
      // If no exact match found, try to find the closest match
      const closestMatch = findClosestMatch(data.Error, title);
      if (closestMatch) {
        const responseClosest = await fetch(`${API_URL}&s=${closestMatch}`);
        const dataClosest = await responseClosest.json();
        if (dataClosest.Response === "True") {
          setMovies(dataClosest.Search);
          setErrorMessage("");
        } else {
          setMovies([]);
          setErrorMessage("No movies found");
        }
      } else {
        setMovies([]);
        setErrorMessage("No movies found");
      }
    }
  };

  const findClosestMatch = (error, searchTerm) => {
    if (error.includes("Movie not found!")) {
      // Logic to find closest match goes here
      // For simplicity, let's just return searchTerm without the last word
      const words = searchTerm.split(" ");
      words.pop();
      return words.join(" ");
    }
    return null;
  };

  useEffect(() => {
    searchMovies("Batman");
  }, []);

  return (
    <div className="app">
      <div className="header">
        <img src="/Cinematrix.svg" alt="Cinematrix" className="logo" />
        <h1>CINEMATRIX</h1>
      </div>

      <div className="search">
        <input
          placeholder="Search for movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <img
          src={SearchIcon}
          alt="search"
          onClick={() => searchMovies(searchTerm)}
        />
      </div>

      {errorMessage ? (
        <div className="empty">
          <h2>{errorMessage}</h2>
        </div>
      ) : (
        <div className="container">
          {movies?.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
