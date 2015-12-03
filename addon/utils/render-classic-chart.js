import Ember from 'ember';

const { RSVP } = Ember;

export default function renderClassicChart({ charts, visualization }, data, options, select) {
  return new RSVP.Promise((resolve, reject) => {
    const type = this.get('type');
    const capitalizedType = Ember.String.capitalize(this.get('type'));
    const chart = new visualization[`${capitalizedType}Chart`](this.get('element'));
    const dataTable = Array.isArray(data) ? visualization.arrayToDataTable(data) : new google.visualization.DataTable(data);

    visualization.events.addListener(chart, 'error', reject);
    if (select) {
      visualization.events.addListener(chart, 'select', e => select(chart, dataTable));
    }

    /* For charts that aren't immediately ready, listen for the
    ready event */

    if (type === 'geo') {
      visualization.events.addListener(chart, 'ready', function() {
        resolve(chart);
      });
    }

    chart.draw(dataTable, options);

    if (type !== 'geo') {
      resolve(chart);
    }
  });
}
