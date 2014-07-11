
/*global define*/

define([
    'jquery',
    'underscore',
    'marionette',

    'views/studentItemView'
], function ($, _, Marionette, studentItemView) {
    'use strict';

    var studentsCollectionView = Marionette.CollectionView.extend({
        childView: studentItemView
    });

    return studentsCollectionView;
});