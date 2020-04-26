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
  startDate: string;
  endDate: string;
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
  dateFilterSearch: DateFilter = {} as DateFilter; // From model file instantiate
  timeSeries: number[] = []; // Time Series data container
  public selectedMoments: Date[] = [];

  constructor(private timeSeriesService: TimeseriesService) {}

  ngOnInit() {
    this.url = 'http://localhost:3000/timeseries';
    this.isApiCallInit = false;
    this.isEndDateGet = false;
    this.selectedMoments = [
      new Date(Date.UTC(2020, 3, 1, 0, 0, 0)),
      new Date(Date.UTC(2020, 4, 30, 23, 59)),
    ];
    // Initial call

    this.getAllTimeSeries();
  }

  // Get data From api
  private getAllTimeSeries() {
    this.isApiCallInit = true;
    this.subscription = this.timeSeriesService.get(this.url).subscribe(
      (res: any) => {
        this.timeSeries = res.body.timeSeries;
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
    this.dateFilterSearch = {} as DateFilter;
    this.isApiCallInit = true;
    this.dateFilterSearch.startDate = moment
      .utc(this.selectedMoments[0])
      .format();
    this.dateFilterSearch.endDate = moment
      .utc(this.selectedMoments[1])
      .format();

    if (this.dateFilterSearch.endDate > this.dateFilterSearch.startDate) {
      this.timeSeriesService.post(this.url, this.dateFilterSearch).subscribe(
        (res: any) => {
          this.timeSeries = res.body.timeSeries;
          this.generateTimeSeriesChart(this.timeSeries);
        },
        (err: any) => {
          console.error(err);
          this.isEndDateGet = true;
        },
        () => {
          this.isApiCallInit = false;
        }
      );
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
    this.getAllTimeSeries();
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    // unsubscribe observable data.
    this.subscription.unsubscribe();
  }
}
