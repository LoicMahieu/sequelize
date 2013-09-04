/*
  Title: Working with associations and custom primary key

  This example demonstrates the use of associations.
  First of all, Person is getting associated via many-to-many with other Person objects (e.g. Person.hasMany('brothers')).
  Afterwards a Person becomes associated with a 'father' and a mother using a one-to-one association created by hasOneAndBelongsTo.
  The last association has the type many-to-one and is defined by the function hasManyAndBelongsTo.
  The rest of the example is about setting and getting the associated data.
*/

var Sequelize = require(__dirname + "/../../index")
  , config    = require(__dirname + "/../../spec/config/config")
  , sequelize = new Sequelize(config.database, config.username, config.password, {logging: true})
  , Person    = sequelize.define('Person', { 
    name: Sequelize.STRING,
    user_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  })
  , Pet       = sequelize.define('Pet',    { name: Sequelize.STRING })
 
Person.hasMany(Pet)
 
var chainer = new Sequelize.Utils.QueryChainer
  , person  = Person.build({ name: 'Luke' })
  , pet     = Pet.build({ name: 'Bob' })
 
sequelize.sync({force:true}).on('success', function() {
  chainer
    .add(person.save())
    .add(pet.save())
 
  chainer.run().on('success', function() {
    person.addPet(pet).on('success', function() { person.getPets().on('success', function(pets) {
      console.log("my pets: " + pets.map(function(p) { return p.name }))
    })})
  }).on('failure', function(err) {
    console.log(err)
  })
})