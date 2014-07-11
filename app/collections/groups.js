/*global define*/

define([
    'underscore',
    'backbone',

    'models/group'
], function (_, Backbone, group) {
    'use strict';

    var Groups = Backbone.Collection.extend({
        model: group,
        url: 'http://127.0.0.1:3000/groups'
    });

    return Groups;
})
;