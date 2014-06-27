var express = require('express'),
  app = express(),
  async = require('async'),
  request = require('request'),
  xml2js = require('xml2js'),
  _ = require('lodash'),
  sugar = require('sugar'),
  Employee = require('../models/employee'),
  photo = require('../services/photo');

function setup() {
  return app
    .get('/', getEmployees)
    .get('/:id', getEmployeeById)
    .post('/', addEmployee)
}

module.exports = setup;

function getEmployees(req, res, next) {
  var query = Employee.find();
  if (req.query.practice) {
    query.where({
      practice: req.query.practice
    });
  } else if (req.query.alphabet) {
    query.where({
      lastName: new RegExp('^[' + req.query.alphabet + ']', 'i')
    });
  } else {
    query.limit(20);
  }
  query.exec(function(err, employees) {
    if (err) return next(err);
    res.send(employees);
  });
}

function getEmployeeById(req, res, next) {
  Employee.findById(req.params.id, function(err, employee) {
    if (err) return next(err);
    res.send(employee);
  });
}

function addEmployee(req, res, next) {
  var employee = new Employee({
    //BUGBUG -- validate data
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    title: req.body.title,
    practice: req.body.practice,
    bio: req.body.bio,
    startDate: req.body.startDate,
    officeLocation: req.body.officeLocation,
    currentProject: req.body.currentProject,
    contactInfo: req.body.contactInfo,
    links: req.body.links,
    interests: req.body.interests,

    // Using the dataURI scheme to store images in mongo
    //'data:' + response.headers['content-type'] + ';base64,' + body.toString('base64')
    photo: req.body.photo
  });

  photo.storeImage(employee, function(err) {
    if (err) {
      return next(err);
    };

    employee.save(function(err) {
      if (err) {
        if (err.code == 11000) {
          return res.send(409, {
            message: employee.firstName + ' ' + employee.lastName + ' already exists.'
          });
        }

        return next(err);
      }

      res.send(200);
    });
  });
}