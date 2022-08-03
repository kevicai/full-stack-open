import React from "react";

export default function PersonsList({ filteredPersons, deletePerson }) {
  return (
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
  );
}
