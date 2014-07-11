/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    /**
     * @class group
     * @extends {Backbone.Model}
     *
     * @property {string} name
     */
    var group = Backbone.Model.extend({
        url: 'http://127.0.0.1:3000/group',
        defaults: {
            name: ''
        },

        initialize: function () {
            //console.log(this.get('name'));
        },
    });

    return group;
});