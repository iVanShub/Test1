/*global define*/

define([
    'underscore',
    'backbone',
    'moment'
], function (_, Backbone, moment) {
    'use strict';

    /**
     * @class student
     * @extends {Backbone.Model}
     *
     * @property {string} name
     * @property {boolean} closed
     * @property {datetime} lw
     */
    var Student = Backbone.Model.extend({
        url: 'http://127.0.0.1:3000/student',
        defaults: {
            id: '',
            fullname: '',
            session: true,
            lw: ''
        },
        parse : function (response) {
            response.id = response._id; //.$oid;
            return response;
        },
        toJSON : function () {
            var json = Backbone.Model.prototype.toJSON.apply(this);
            json.ndate = moment(json.lw).fromNow() +', '+ moment(json.lw).format('L');
            return json;
        },
        nDate: function () {
            moment(1316116057189).fromNow();
        }
    });

    return Student;
});