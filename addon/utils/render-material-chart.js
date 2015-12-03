import Ember from 'ember';

const { RSVP } = Ember;

export default function renderMaterialChart({ charts, visualization }, data, options, select) {
  return new RSVP.Promise((resolve, reject) => {
    const type = Ember.String.capitalize(this.get('type'));
    const chart = new charts[type](this.get('element'));
    const dataTable = Array.isArray(data) ? visualization.arrayToDataTable(data) : new google.visualization.DataTable(data);

    visualization.events.addListener(chart, 'error', reject);
    if (select) {
      visualization.events.addListener(chart, 'select', e => select(chart, dataTable));
    }

    chart.draw(dataTable, charts[type].convertOptions(options));

    resolve(chart);
  });
}
