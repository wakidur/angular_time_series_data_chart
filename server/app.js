const express = require('express'); 
const router = express.Router();
const moment = require('moment');
// Time series schema 
const TimeSeries = require('./models/time_series/timeSeriesSchema');

router.get('/timeseries', (req, res, next) => {
    let timeSeries = [];
    const allTimeSeries = await TimeSeries.find({});

    if (allTimeSeries && allTimeSeries.length > 0) {
        allTimeSeries.forEach(item => {
            timeSeries.push([moment.utc(item.timemillis).valueOf(), item.amount]);
        })
    }
    res.status(200).json({
        success: true,
        timeSeries: timeSeries
    });

});

router.post('/timeseries', (req, res, next) => {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    let timeSeries = [];
    const allTimeSeries = await TimeSeries.find({
        timemillis: {
            $gte: startDate,
            $lte: endDate
        }
    });
    if (allTimeSeries && allTimeSeries.length > 0) {
        allTimeSeries.forEach(item => {
            timeSeries.push([moment.utc(item.timemillis).valueOf(), item.amount]);
        })
    }
    res.status(201).json({
        success: true,
        timeSeries: timeSeries
    });

});