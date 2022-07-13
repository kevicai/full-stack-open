import axios from "axios";
import { useState, useEffect } from "react";

function App() {
  const [allCountries, setAllCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [matches, setMatches] = useState([]);
  const [over10, setOver10] = useState(false);

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      console.log("promise fulfilled");
      setAllCountries(response.data);
    });
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Immediately updates allCountries using filter's value before the next render
  // Or else the filter value will not be reflected and will be delayed by one character
  useEffect(() => {
    const filterNames = allCountries.filter((country) =>
      country.name.common.toLowerCase().includes(filter)
    );
    if (filterNames.length <= 10) {
      setOver10(false);
      setMatches(filterNames);
    } else {
      setOver10(true);
    }
  }, [filter, allCountries, over10]);

  return (
    <div className="App">
      <form>
        <div>Find countries</div>
        <input type="text" value={filter} onChange={handleFilterChange}></input>
      </form>

      {over10 ? (
        <h3>Too many matches (over 10), specify another filter</h3>
      ) : (
        <ul>
          {matches.map((match) => (
            <li key={match.name.common}>{match.name.common}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
