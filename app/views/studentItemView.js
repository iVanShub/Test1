/*global define*/

define([
    'jquery',
    'underscore',
    'marionette'
], function ($, _, Marionette) {
    'use strict';

    var groupItemView = Marionette.ItemView.extend({
        template: 'app/templates/student.ejs',
        tagName: 'div',
        className: 'btn-group',
        events: {
            'dblclick .fio': 'editStudent',
            'click .save': 'saveStudent'
        },

        editStudent: function () {
            var inp = $(this.$el.find('.fio')[0]);
            if (inp.attr('readonly') === 'readonly') {
                inp.removeAttr('readonly').select();
                $(this.$el.find('.save')[0]).show();
            }
            else {
                return;
            }

        },
        saveStudent: function () {
            $(this.$el.find('.save')[0]).hide();
            var inp = $(this.$el.find('.fio')[0]);
            window.testApp.vent.trigger('saveStudent',this.model.get('_id'), inp.val(), inp);
            inp.attr('readonly','readonly');
        }
    });

    return groupItemView;
});
