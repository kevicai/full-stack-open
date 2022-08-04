import { useState, useEffect } from "react";
import "./App.css";
import AddContactForm from "./components/AddContactForm";
import Notification from "./components/Notification";
import PersonsList from "./components/PersonsList";
import personService from "./services/persons";
// npx json-server --port 3001 --watch db.json to start the server

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [filteredPersons, setFilteredPersons] = useState(persons);
  const [message, setMessage] = useState(null);

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

  const setTimeoutMessage = (message) => {
    setMessage(message);
    console.log(message);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

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
      personService
        .create(newPerson)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setFilteredPersons(persons.concat(returnedPerson));
          setTimeoutMessage(`Added ${newName}`);
        })
        .catch((error) => setTimeoutMessage(error.response.data.error));
    } else if (
      window.confirm(`${newName} is already added, update their phone number?`)
    ) {
      updatePerson(dupPersons[0].id, newPerson);
    }
    setNewName("");
    setNewNumber("");
  };

  const updatePerson = (id, newPerson) => {
    personService
      .update(id, newPerson)
      .then((returnedPerson) => {
        // update client side state values as well
        const updatedPersons = persons.map((person) => {
          return person.id !== returnedPerson.id ? person : returnedPerson;
        });
        setPersons(updatedPersons);
        setFilteredPersons(updatedPersons);
        setTimeoutMessage(`Updated ${newName}'s number`);
      })
      .catch((error) => setTimeoutMessage(error.response.data.error));
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
          setTimeoutMessage(`Deleted ${name}`);
        })
        .catch((error) =>
          setTimeoutMessage(
            `Deleted failed, ${name} is already deleted on the server`
          )
        );
    }
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} />
      <form onSubmit={filterPerson}>
        <div>filter name containing: </div>
        <input value={filter} onChange={handleFilterChange} />
        <button type="submit">filter</button>
      </form>

      <h3>Add a New Contact</h3>
      <AddContactForm
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
      />

      <h3>Numbers</h3>
      <PersonsList
        filteredPersons={filteredPersons}
        deletePerson={deletePerson}
      />
    </div>
  );
};

export default App;
