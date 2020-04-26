const fs = require('fs');      
const mongoose = require('mongoose');
const dotenv = require('dotenv');


// Load Models 

const TimeSeries = require('./models/time_series/timeSeriesSchema')

// Connect to DB "config.mongo.host"
mongoose.connect(process.env.MONGO_HOST, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});


// Read JSON files

const TimeSeriesMock = JSON.parse(fs.readFileSync(`${__dirname}/_seeder_data/time_series.json`, 'utf-8'));

// Import into DB 
const importData = async () => {
    try {
        let timeSeriesArray = [];
        TimeSeriesMock.forEach(timeStream => {
            timeSeriesArray.push({
                timemillis: timeStream[0],
                amount: timeStream[1]
            })
        })


       await TimeSeries.insertMany(timeSeriesArray);
        console.log(`Data Imported...`);
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

// Delete Data
const deleteData = async () => {
    try {
        await TimeSeries.deleteMany();
        console.log(`Data Destroyed..`);
        process.exit();
    } catch (error) {
        console.error(error)
    }
}

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}