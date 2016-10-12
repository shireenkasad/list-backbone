
var Item = Backbone.Model.extend({
    defaults: {
        title: '',
        location: ''
    }
});

var List = Backbone.Collection.extend({
    model: Item,
    localStorage: new Backbone.LocalStorage('list-backbone')
});

var list = new List();  

var ItemView = Backbone.View.extend({
    tagName: 'div',  
    className: 'block', 
    template: _.template($('#item-template').html()), 

    events: {
        'click .remove': 'deleteItem'  
    },

    initialize: function(){
        this.listenTo(this.model, 'destroy', this.remove); 
    },

    render: function (){
        this.$el.html(this.template(this.model.toJSON())); 
        return this;
    },

    deleteItem: function(){
        this.model.destroy(); 
    }
});

var ListView = Backbone.View.extend({
    el: '.content',  
    events: {
        'click #add': 'createOnClick',  
        'click .clearAll': 'removeAll'
    },
    initialize: function(){
        this.$input = this.$('#title'); 
        this.$location = this.$('#location');
        this.$list = this.$('.list');
        this.$clear = this.$('.clearAll');
      
        this.listenTo(list, 'add', this.addItem); 
        this.listenTo(list, 'reset', this.addAll); 
        this.listenTo(list, 'remove', this.checkEmpty);

        list.fetch({reset: true}); 
    },

    addItem: function(thing){
        var item = new ItemView({model:thing}); 
        this.$list.append(item.render().el); 
        this.$clear.removeClass('hide');
    },

    addAll: function () {
      this.$list.html(''); 
      list.each(this.addItem, this);  
    },

    removeAll: function(){
        _.invoke(list.toArray(), 'destroy');
    },

    checkEmpty: function(){
        if(!list.length){
            this.$clear.addClass('hide');
        }
    },
    
    createOnClick: function(){
        list.create({
            title: this.$input.val().trim(),
            location: this.$location.val().trim()
        });
        this.$input.val(''); 
        this.$location.val('');
    }
});
    
    new ListView();


