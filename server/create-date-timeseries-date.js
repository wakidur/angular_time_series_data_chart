//  Create date Timeseries Date  
    let dataPoints = [];
    let startTime = moment.utc('04-01-2020 0:0:00.00').valueOf();
    let endTime = moment.utc('05-31-2020 24:00:00.00').valueOf();
    console.log(startTime);
    console.log(endTime);
    let y = 0;
    let devaidedBy = 600000;
    let minasFromLarge = parseInt(`${endTime}`) - parseInt(`${startTime}`);
    let fractionValue = Math.ceil(
      parseInt(`${minasFromLarge}`) / parseInt(`${devaidedBy}`)
    );


    for (let i = 0; i < 600000; i++) {
      startTime += fractionValue;
      y += Math.round(5 + Math.random() * (-5 - 5));
      dataPoints.push([startTime, y]);
    }
    console.log(dataPoints);