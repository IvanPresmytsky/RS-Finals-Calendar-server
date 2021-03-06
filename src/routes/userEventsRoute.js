"use strict";
const _ = require('lodash');
const User = require('../models/User.js');
const verifyToken = require('../utils/verifyToken.js');

function getEvents (req, res) {
  User.findById(req.params._id, (err, user) => {
    if (err) {
      return res.status(404).json(err);
    }
    return res.status(200).json(user.events);
  });
}

function getEvent (req, res) {
  User.findById(req.params._id, (err, user) => {
    if (err) {
      return res.status(404).json(err);
    }

    let targetEvent = _.find(user.events, (event) => {
      return event.id === req.params.id;
    });

    return res.status(200).json(targetEvent);
  });
}

function addEvent (req, res) {

  let addedEvent = {
    title: req.body.event.title,
    text: req.body.event.text,
    date: req.body.event.date,
    startTime: req.body.event.startTime,
    endTime: req.body.event.endTime
  }

  User.findById(req.params._id, (err, user) => {
    if (err) {
      return res.status(404).json(err);
    }
    user.events.push(addedEvent);
    user.save((err, data) => {
      if (err) {
        console.error(err);
        return res.json(err);
      }
      return res.status(201).json({message: 'event added successfully', event: data.events[data.events.length -1]});
    });
  });
}

function deleteEvent (req, res) {
  verifyToken(req, res);

  User.findById(req.params._id, (err, user) => {
    if (err) {
      return res.status(404).json(err);
    }
    user.events = _.filter(user.events, (event) => {
      return event.id !== req.params.id;
    });
    user.save((err) => {
      if (err) {
        return res.json(err);
      }
      return res.status(200).json({message: 'event removed successfully'});
    });
  });
}

function changeEvent (req, res) {
  verifyToken(req, res);

  User.findById(req.params._id, (err, user) => {
    if (err) {
      return res.status(404).json(err);
    }
    let changedEvent = _.find(user.events, (event) => { 
      return event.id === req.params.id;
    });

    changedEvent.title = req.body.event.title;
    changedEvent.text = req.body.event.text;
    changedEvent.date = req.body.event.date;
    changedEvent.startTime = req.body.event.startTime;
    changedEvent.eventEndTime = req.body.event.endTime;

    user.save((err) => {
      if (err) {
        return res.json(err);
      }
      return res.status(201).json({message: 'event saved successfully'});
    });
  });
}

function userEventsRoute (router) {
  const userRoute = router.route('/users/:_id');
  const userEventsRoute = router.route('/users/:_id/events');
  const userEventRoute = router.route('/users/:_id/events/:id');

  userEventsRoute.get(getEvents);

  userEventRoute.get(getEvent);

  userEventRoute.delete(deleteEvent);

  userEventsRoute.post(addEvent);

  userEventRoute.put(changeEvent);
}

module.exports = userEventsRoute;
