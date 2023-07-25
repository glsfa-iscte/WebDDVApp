const mongoose = require('mongoose');

const researcherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Researcher', researcherSchema);