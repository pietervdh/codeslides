// import chartXkcd from 'chart.xkcd';
// import 'chart.xkcd/dist';
const ChartXkcd =
  window.ChartXkcd ||
  (function() {
    let allCharts = [];

    toArray = o => Array.prototype.slice.call(o);

    chartClass = classList => {
      const chartClasses = {
        'line-chart': chartXkcd.Line,
        'xy-chart': chartXkcd.XY,
        'bar-chart': chartXkcd.Bar
      };
      for (const key in chartClasses) {
        if (classList.includes(key)) {
          return chartClasses[key];
        }
      }
      console.error('No suitable chart class defined');
    };

    parseJsonDataFile = svgEl => {
      const jsonFile = svgEl.getAttribute('data-chart-json');
      const chartObject = chartClass(toArray(svgEl.classList));
      fetch(jsonFile).then(response =>
        response.json().then(jsonData => {
          const myChart = new chartObject(svgEl, {
            title: jsonData['title'],
            xLabel: jsonData['xLabel'],
            yLabel: jsonData['yLabel'],
            data: jsonData['data'],
            options: {
              xTickCount: 6,
              yTickCount: 3,
              legendPosition: chartXkcd.config.positionType.upLeft,
              ...jsonData['options']
            }
          });
          allCharts.push(myChart);
        })
      );
    };

    Reveal.addEventListener('ready', function() {
      // async load all data for charts
      const chartDiv = toArray(document.querySelectorAll('.xkcd-chart'));
      chartDiv.forEach(el =>
        toArray(el.childNodes)
          .filter(child => child.nodeName === 'svg')
          .filter(el => el.hasAttribute('data-chart-json'))
          .forEach(svg => parseJsonDataFile(svg))
      );
    });

    Reveal.addEventListener('slidechanged', function() {
      // allCharts.forEach(ch => ch.render());
    });
  })();
