var mongoose = require('mongoose');

var employeeSchema,
    Employee;

employeeSchema = new mongoose.Schema({
  //_id: Number,
  lastName: String,
  firstName: String,
  title: String,
  practice: String,
  bio: String,
  startDate: Date,
  officeLocation: String,
  currentProject: String,
  photo: String,
  photoRound: String,
  photoSmall: String,
  photoSmallRound: String,
  contactInfo: [{
    name: String,
    value: String
  }],
  links: [{
    name: String,
    url: String
  }],
  interests: [ String ]
});

Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
