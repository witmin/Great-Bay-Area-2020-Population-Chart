import {
    select,
    csv,
    scaleLinear,
    max,
    scaleBand,
    axisLeft,
    axisBottom,
    format
} from 'd3';

const titleText = '大湾区城市2020初常住人口';

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = data => {
    const xValue = d => d['population'];
    const yValue = d => d.city;
    const margin = {top: 68, right: 40, bottom: 77, left: 80};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = scaleLinear()
        .domain([0, max(data, xValue)])
        .range([0, innerWidth]);

    const yScale = scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.1);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const xAxisTickFormat = number =>
        format('.2s')(number)
            .replace('G', 'B')

    const xAxis = axisBottom(xScale)
        .tickFormat(xAxisTickFormat)
        .tickSize(-innerHeight)

    g.append('g').call(axisLeft(yScale))
        .selectAll('.domain, .tick line').remove();

    const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0, ${innerHeight})`);

    xAxisG.select('.domain').remove();

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 50)
        .attr('x', innerWidth / 2)
        .text('人口');

    g.selectAll('rect').data(data)
        .enter().append('rect')
        .attr('class', "bar")
        .attr('y', d => yScale(yValue(d)))
        .attr('width', d => xScale(xValue(d)))
        .attr('height', yScale.bandwidth())
        .append('title')
        .text(d => d['city'] + ": 约" + d['population'] + "人")
    ;

    g.append('text')
        .attr('class', 'title')
        .attr('y', -20)
        .text(titleText);
};

csv('bayarea_city_population_2020.csv').then(data => {
    data.forEach(d => {
        d.population = +d.population;
    });
    render(data);
});