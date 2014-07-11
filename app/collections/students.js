/*global define*/

define([
    'underscore',
    'backbone',

    'models/student'
], function (_, Backbone, student) {
    'use strict';

    var Students = Backbone.Collection.extend({
        model: student,
        url: 'http://127.0.0.1:3000/students'
    });

    return Students;
})
;