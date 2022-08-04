const mongoose = require("mongoose");

if (process.argv.length !== 5 && process.argv.length !== 3) {
  console.log(
    "Please provide the arguments: node mongo.js <password> <name> <number>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://kevicai:${password}@phonebook.odi54.mongodb.net/phoneBook?retryWrites=true`;

mongoose.connect(url);
console.log("connected");

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({})
    .then((result) => {
      console.log("phonebook:");
      result.forEach((person) => {
        console.log(person.name, person.number);
      });
      mongoose.connection.close();
    })
    .catch((err) => console.log(err));
} else {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name: name,
    number: number,
  });

  person
    .save()
    .then(() => {
      console.log("person saved!");
      return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
}
