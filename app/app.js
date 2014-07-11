define(['views/layout', 'collections/groups'],
function (layout, groups) {
    var app = {}, Groups = {}, Layout = {}, JST = window.JST = window.JST || {};

    app = new Backbone.Marionette.Application();
    window.testApp = app;
    
    Backbone.Marionette.Renderer.render = function(template, data){
        if (!JST[template]) throw "Template '" + template + "' not found!";
        return JST[template](data);
    };

    // Save a copy of the old Backbone.sync function so you can call it later.
    var oldBackboneSync = Backbone.sync;

    // Override Backbone.Sync
    Backbone.sync = function( method, model, options ) {
        if ( method === 'delete' ) {
            if ( options.data ) {
                // properly formats data for back-end to parse
                options.data = JSON.stringify(options.data);
            }
            // transform all delete requests to application/json
            options.contentType = 'application/json';
        }
        return oldBackboneSync.apply(this, [method, model, options]);
    };


    Groups = new groups();
    

    Groups.fetch({success: function() {
        Layout = new layout({collection: Groups});
        Layout.render();
    }});
    
    
    
    return app;
});
