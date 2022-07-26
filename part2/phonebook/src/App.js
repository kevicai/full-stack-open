import { useState, useEffect } from "react";
import "./App.css";
import AddContactForm from "./components/AddContactForm";
import personService from "./services/persons";
// npx json-server --port 3001 --watch db.json to start the server

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [filteredPersons, setFilteredPersons] = useState(persons);

  const filterPerson = (event) => {
    event.preventDefault();
    setFilteredPersons(
      persons.filter((person) => person.name.includes(filter))
    );
  };

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleFilterChange = (event) => setFilter(event.target.value);

  // get initial data from the server
  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
      setFilteredPersons(initialPersons);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
      number: newNumber,
    };

    // check if newName is already added
    const dupPersons = persons.filter((person) => person.name === newName);
    if (dupPersons.length === 0) {
      // add the contact to server
      personService.create(newPerson).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setFilteredPersons(persons.concat(returnedPerson));
      });
    } else if (
      window.confirm(`${newName} is already added, update their phone number?`)
    ) {
      console.log("update id:" + dupPersons[0].id);

      personService
        .update(dupPersons[0].id, newPerson)
        .then((returnedPerson) => {
          // update client side state values as well
          const updatedPersons = persons.map((person) =>
            person.id !== returnedPerson.id ? person : returnedPerson
          );
          setPersons(updatedPersons);
          setFilteredPersons(updatedPersons);
        });
    }
    setNewName("");
    setNewNumber("");
  };

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then((response) => {
          // update client side state data as well
          const updatedPersons = persons.filter((person) => person.id !== id);
          setPersons(updatedPersons);
          setFilteredPersons(updatedPersons);
        })
        .catch((error) => console.log("error"));
    }
  };

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
        {filteredPersons.length !== 0
          ? [
              filteredPersons.map((person) => (
                <li key={person.id} className="flex-row">
                  {person.name}: {person.number}{" "}
                  <button
                    onClick={() => deletePerson(person.id, person.name)}
                    className="delete-btn"
                  >
                    delete
                  </button>
                </li>
              )),
            ]
          : null}
      </ul>
    </div>
  );
};

export default App;
