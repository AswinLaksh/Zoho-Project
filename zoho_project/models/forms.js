const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const formSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    formSchema : {
        type : Object,
        required : true
    },
    files : [
        {
            type: Object,
            required : false
        }
    ]

},{
    timestamps : true
}
);

const Form = mongoose.model('form',formSchema);

module.exports = Form;