const mongoose = require('mongoose');

const TimeSeriesSchema = new mongoose.Schema({
    timemillis: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    }
});



module.exports = mongoose.model('TimeSeries', TimeSeriesSchema);