import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';

import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { Subscription, forkJoin } from 'rxjs';

import { TimeseriesService } from './core/service/timeseries.service';
import { NgForm } from '@angular/forms';

export interface DateFilter {
  startDate: Date;
  endDate: Date;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  url: string;
  isApiCallInit: boolean;
  isEndDateGet: boolean;
  private subscription: Subscription;
  chart: Chart; // instantiate Chart
  filterByDate: DateFilter = {} as DateFilter; // From model file instantiate
  timeSeries: number[] = []; // Time Series data container
  public selectedMoments: Date[] = [];


  constructor(private timeSeriesService: TimeseriesService) {}

  ngOnInit() {

    // Create date Timeseries Date  data
    // let dataPoints = [];
    // let startTime = moment.utc('04-01-2020 0:0:00.00').valueOf();
    // let endTime = moment.utc('05-31-2020 24:00:00.00').valueOf();
    // console.log(startTime);
    // console.log(endTime);
    // let y = 0;
    // let devaidedBy = 600000;
    // let minasFromLarge = parseInt(`${endTime}`) - parseInt(`${startTime}`);
    // let fractionValue = Math.ceil(
    //   parseInt(`${minasFromLarge}`) / parseInt(`${devaidedBy}`)
    // );


    // for (let i = 0; i < 600000; i++) {
    //   startTime += fractionValue;
    //   y += Math.round(5 + Math.random() * (-5 - 5));
    //   dataPoints.push([startTime, y]);
    // }
    // console.log(dataPoints);


    this.isApiCallInit = false;
    this.isEndDateGet = false;
    this.selectedMoments = [
      new Date(2020, 3, 1, 0, 0),
      new Date(2020, 4, 29, 23, 59),
    ];
    this.url = '/assets/mock/month-old.json';
    // Initial call

    this.getAllTimeSeries();
  }

  // Get data From api
  private getAllTimeSeries() {
    this.isApiCallInit = true;
    this.subscription = this.timeSeriesService.get(this.url).subscribe(
      (res: any) => {
        this.timeSeries = res.body;
        this.generateTimeSeriesChart(this.timeSeries);
      },
      (err: any) => {
        this.isApiCallInit = false;
        console.error(err);
      },
      () => {
        this.isApiCallInit = false;
      }
    );
  }

  /**
   * Generate Time Series Chart
   * @param data
   */
  private generateTimeSeriesChart(data: number[]) {
    const rgbaColor = Highcharts.color(Highcharts.getOptions().colors[0])
      .setOpacity(0)
      .get('rgba');

    const chart = new Chart({

      chart: {
        zoomType: 'x',
      },
      title: {
        text: 'Angular time series data in chart',
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: 'ug/m3',
        },
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 0,
            },
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [1, `${rgbaColor}`],
            ],
          },
          marker: {
            radius: 5,
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1,
            },
          },
          threshold: null,
        },

      },
      series: [
        {
          type: 'area',
          name: 'ug/m3',
          data: data,
        },
      ],



    });

    this.chart = chart;
    chart.ref$.subscribe((res: any) => {});
    this.isApiCallInit = false;
  }

  public timeSeriesDateFilter(timeseries: NgForm) {
    this.isApiCallInit = true;
    const start = moment.utc(this.selectedMoments[0]).valueOf();
    const end = moment.utc(this.selectedMoments[1]).valueOf();
    if (end > start) {
      this.timeSeries = this.timeSeries.filter(
        (timeStream) => timeStream[0] >= start && timeStream[0] <= end
      );
      this.generateTimeSeriesChart(this.timeSeries);
    } else {
      this.isEndDateGet = true;
      this.isApiCallInit = false;
    }
  }

  resetTimeSeriesForm() {
    this.getAllTimeSeries();
  }

  closeTimeErrorAlart() {
    this.isEndDateGet = false;
    this.selectedMoments = [];
    this.selectedMoments = [
      new Date(2020, 3, 1, 0, 0),
      new Date(2020, 3, 29, 23, 59),
    ];
    this.getAllTimeSeries();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

  }

  ngOnDestroy(): void {
    // unsubscribe observable data.
    this.subscription.unsubscribe();
  }
}
