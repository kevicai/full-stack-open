import React from "react";

export default function AddContactForm(props) {
  return (
    <form onSubmit={props.addPerson}>
      <div>
        name: <input name="name" value={props.newName} onChange={props.handleNameChange} />
      </div>
      <div>
        number:{" "}
        <input name="number" value={props.newNumber} onChange={props.handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
}
