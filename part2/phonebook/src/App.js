import { useState, useEffect } from "react";
import axios from "axios";
import AddContactForm from "./components/AddContactForm";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [filteredPersons, setFilteredPersons] = useState(persons);

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
    };

    // check if newName is already added
    const numDupNames = persons.filter(
      (person) => person.name === newName
    ).length;
    if (numDupNames === 0) {
      setPersons(persons.concat(newPerson));
      setFilteredPersons(persons.concat(newPerson));
      setNewName("");
      setNewNumber("");
    } else {
      window.alert(`${newName} is already added to phonebook`);
    }
  };

  const filterPerson = (event) => {
    event.preventDefault();
    setFilteredPersons(
      persons.filter((person) => person.name.includes(filter))
    );
  };

  const handleNameChange = (event) => {
    // event is the input element
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    // event is the input element
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    // event is the input element
    setFilter(event.target.value);
  };

  useEffect(() => {
    console.log("effect");
    axios.get("http://localhost:3001/persons").then((response) => {
      console.log("promise fulfilled");
      setPersons(response.data);
      setFilteredPersons(response.data);
    });
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={filterPerson}>
        <div>filter name containing: </div>
        <input value={filter} onChange={handleFilterChange} />
        <button type="submit">filter</button>
      </form>

      <h2>Add a New Contact</h2>
      <AddContactForm
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
      />

      <h2>Numbers</h2>
      <ul>
        {[
          filteredPersons.map((person) => (
            <li key={person.name}>
              {person.name}: {person.number}
            </li>
          )),
        ]}
      </ul>
    </div>
  );
};

export default App;
