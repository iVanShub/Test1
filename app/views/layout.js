/*global define*/
define([
    'marionette',
    'templates',
    'jquery',
    'views/groupsCollectionView',
    'models/group',
    'views/studentsCollectionView',
    'models/student',
    'collections/students',
    'moment'
], function (Marionette, JST, $, GroupsCollectionView, Group, StudentsCollectionView, Student, Students, moment) {
    'use strict';
    var AppLayout = Marionette.LayoutView.extend({
        el : '#main',
        template: "app/templates/main-layout.ejs",
        groupsView: null,
        collection: null,
        studentsCollection: null,
        studentsCollectionView: null,
        currentGroup: null,
        count: 10,
        stopScroll: false,
        offset: 0,
        regions: {
            groups: '#groups',
            students: '#students'
        },

        events: {
            'click .group-add': 'groupAdd',
            'click .student-add': 'studentAdd',
            'click .btn-danger': 'studentRemove'
            //'scroll .student-wrapper': 'scrollDone'
            // 'click .js-chat__offline-show': 'onShowOffline'
        },

        initialize: function(){
            moment.lang('ru');

            window.testApp.vent.on('showStudents',function(id){
                this.count = (this.currentGroup === id)?this.count:10;
                this.currentGroup = id;
                this.studentsCollection = new Students();
                var self = this;
                this.stopScroll = false;
                this.studentsCollection.fetch({data: {id: id, count: this.count}, success: function () {
                    self.hideError();
                    if (self.studentsCollection.length) {
                        if (self.studentsCollection.length < self.count) {
                            self.stopScroll = true;
                        }

                        if (self.offset!==0) {
                            self.$el.find('.student-wrapper')[0].scrollTop = self.offset;
                            self.offset = 0;
                        }

                        self.studentsCollectionView = new StudentsCollectionView({collection: self.studentsCollection});
                        self.students.show(self.studentsCollectionView);
                        $('.students .controls').show();
                        $('.student-wrapper').on('scroll', _.bind(self.onScroll, self));
                    }
                    else {
                        $('#students').html('<h5>Студентов нет</h5>');
                        $('.students .controls').show();
                    }
                    
                },
                    error: function (model, resp, arg){
                        self.showError(arg.xhr.responseText);
                    }
                });
            },this); 

            window.testApp.vent.on('saveStudent',function(id, fio, inp){
                    var edStudent = this.studentsCollection.findWhere({'id': id}),
                    self = this;
                    if (fio === '') {
                        this.showError('Пустое имя студента', inp);
                    }
                    else {
                        if (_.isUndefined(this.studentsCollection.findWhere({fullname: fio}))) {
                            this.hideError();
                            edStudent.set({fullname: fio});
                            edStudent.save();
                            self.studentsCollection.sync('update',edStudent, {success: function () {
                                self.hideError();
                                window.testApp.vent.trigger('showStudents',self.currentGroup);    
                            },
                                error: function (model, resp, arg){
                                self.showError(arg.xhr.responseText);
                        }});        
                        }
                        else {
                            this.showError('Такой студент уже есть', inp);
                        }
                    }
                    
                    
            },this);                
        },

        onRender: function () {


            this.groupsView = new GroupsCollectionView({collection: this.collection});
            this.groups.show(this.groupsView);
        },

        groupAdd: function () {
            var btn = $(this.$el.find('.group-add')[0]),
            inp = $(this.$el.find('.group-name')[0]),
            newGroup = {};

            if (btn.hasClass('btn-success')) {

                if (inp.val() === '') {
                    this.showError('Пустое имя группы', inp);
                }   
                else {

                    if (_.isUndefined(this.collection.findWhere({name: inp.val()}))) {
                        this.hideError(inp);
                        inp.hide();
                        btn.removeClass('btn-success');
                        newGroup = new Group();
                        newGroup.set({name: inp.val()});
                        this.collection.add(newGroup);
                        this.collection.sync('create',newGroup, {success: function(data){
                            newGroup.set('_id',data._id);
                            newGroup.save();
                        }});
                        inp.val('');
                    }
                    else {
                        this.showError('Такая группа уже есть', inp);
                    }
                }
            }
            else {
                inp.show();
                btn.addClass('btn-success');
            }
        },

        showError: function (text, el) {
            $(this.$el.find('.err')[0]).show();
            $(this.$el.find('.error')[0]).text(text);
            if (el) {
                el.addClass('rb');  
            }
        },
        
        hideError: function (el) {
            $(this.$el.find('.err')[0]).hide();
            if (el) {
                el.removeClass('rb');  
            }
        },

        studentAdd: function () {
            var btn = $(this.$el.find('.student-add')[0]),
            inp = $(this.$el.find('.student-name')[0]),
            newStudent = {}, 
            self = this;

            if (btn.hasClass('btn-success')) {

                if (inp.val() === '') {
                    this.showError('Пустое имя студента', inp);
                }

                else {
                    if (_.isUndefined(this.studentsCollection.findWhere({fullname: inp.val()}))) {
                        this.hideError(inp);
                        inp.hide();
                        btn.removeClass('btn-success');
                        newStudent = new Student();
                        newStudent.set({fullname: inp.val(), group: this.currentGroup, lw: new Date(), session: true});
                        self.studentsCollection.add(newStudent);
                        self.studentsCollection.sync('create',newStudent, {success: function () {
                            self.hideError();
                            window.testApp.vent.trigger('showStudents',self.currentGroup);    
                        },
                            error: function (model, resp, arg){
                                self.showError(arg.xhr.responseText);
                        }});
                        inp.val('');    
                    }
                    else {
                        this.showError('Такой студент уже есть', inp);
                    }    
                }
                
            }
            else {
                inp.show();
                btn.addClass('btn-success');
            }
        },

        studentRemove: function (e) {

            var fio = $(e.currentTarget).parent().find('input').val(),
            oldStudent = {},
            self = this;

            oldStudent = this.studentsCollection.findWhere({fullname: fio});
            this.studentsCollection.remove(oldStudent);
            this.studentsCollection.sync("delete", oldStudent, {
                data: {id: oldStudent.get('id')}
            });

            
        },
        
        onScroll: function () {

            var wrp = this.$el.find('.student-wrapper')[0];
            
            if ((!this.stopScroll)&&((wrp.scrollTop + $(wrp).height() - wrp.scrollHeight) === 0)) {
                this.count += 10;
                this.offset = wrp.scrollTop;
                window.testApp.vent.trigger('showStudents',this.currentGroup);
            }
        },
    });

    return AppLayout;
});