const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema({
    pizzaName: {
        type: String
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
        type: String,
        default: 'Large'
    },
    toppings: [],
    comments: [{
        type: Schema.Types.ObjectId,
        //tells pizza model which document to search for the information
        ref: 'Comment'
    }]
},
{
    toJSON:{
        virtuals: true,
        getters: true
    },
    //a virtual mongoose returns, not necessary. Must be declared as such
    id: false
}
);

//get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.length;
});

//create the pizza model using the pizzaschema
const Pizza = model('Pizza', PizzaSchema);

//export the pizza model
module.exports = Pizza;
