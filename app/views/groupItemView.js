/*global define*/

define([
    'jquery',
    'underscore',
    'marionette'
], function ($, _, Marionette, students) {
    'use strict';

    var groupItemView = Marionette.ItemView.extend({
        template: 'app/templates/group.ejs',
        tagName: 'a',
        className: 'list-group-item',
        events: {
            'click': 'showStudents'
        },

        showStudents: function () {
            if (this.$el.hasClass('active')) {
                return;
            }
            else {
                this.$el.parent().children().removeClass('active');
                this.$el.addClass('active');
                window.testApp.vent.trigger('showStudents',this.model.get('_id'));
            }

        }
        
    });

    return groupItemView;
});
