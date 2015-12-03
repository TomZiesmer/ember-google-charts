import Ember from 'ember';

const { assert, computed, observer, on, run } = Ember;

export default Ember.Component.extend({

  /* Actions */

  chartDidRender: null,
  packagesDidLoad: null,

  /* Options */

  defaultOptions: {},
  options: null,
  type: null,
  googlePackages: null,

  /* Properties */

  chart: null,
  classNameBindings: ['className'],
  classNames: ['google-chart'],
  data: null,

  className: computed('type', function() {
    return `${this.get('type')}-chart`;
  }),

  /* Methods */

  loadPackages() {
    return new Ember.RSVP.Promise((resolve) => {
      window.google.load('visualization', '1.0', {
        callback: resolve,
        packages: this.get('googlePackages'),
      });
    });
  },

  setupDependencies: on('didInsertElement', function() {
    const type = this.get('type');

    Ember.warn('You did not specify a chart type', type);

    if (window.google) {
      this.loadPackages().then(() => {
        this.sendAction('packagesDidLoad');
        this._renderChart();
      });
    } else {
      run.later(this, this.loadApi, 200);
    }
  }),

  updateChart: observer('data', function() {
    this._renderChart();
  }),

  renderChart() {
    assert('You have created a chart type without a renderChart() method');
  },

  _teardownChart: on('willDestroyElement', function() {
    const chart = this.get('chart');

    if (chart) {
      window.google.visualization.events.removeAllListeners(chart);
      chart.clearChart();
    }
  }),

  _renderChart() {
    const data = this.get('data');
    const defaultOptions = this.get('defaultOptions');
    const options = Ember.merge(defaultOptions, this.get('options'));

    assert('You have not passed any data to the chart', data);

    this.renderChart(window.google, data, options, this.get('select') ? (ev, chart) => this.sendAction('select', ev, chart) : undefined)
    .then((chart) => {
      this.set('chart', chart);
      this.sendAction('chartDidRender', chart);
    });

    // $(window).on('resize', run.bind(this, this.renderChart));
  },

});
