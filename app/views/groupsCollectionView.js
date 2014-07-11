
/*global define*/

define([
    'jquery',
    'underscore',
    'marionette',

    'views/groupItemView'
], function ($, _, Marionette, groupItemView) {
    'use strict';

    var groupsCollectionView = Marionette.CollectionView.extend({
        childView: groupItemView
    });

    return groupsCollectionView;
});