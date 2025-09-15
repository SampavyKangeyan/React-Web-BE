const express = require('express');
const sequelize = require("../db");
const {Sequelize}  = require('sequelize');
const User = require('./user');

const db={};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = User;

module.exports = db;