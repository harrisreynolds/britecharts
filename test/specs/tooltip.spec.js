define(['jquery', 'd3', 'tooltip'], function($, d3, tooltip) {
    'use strict';

    describe('Tooltip Component', () => {
        let topicColorMap = {
                0: '#9963D5',
                60: '#E5C400',
                81: '#FF4D7C',
                103: '#4DC2F5',
                149: '#4DDB86'
            },
            tooltipChart, dataset, containerFixture, f;

        beforeEach(() => {
            dataset = [];
            tooltipChart = tooltip();

            // DOM Fixture Setup
            f = jasmine.getFixtures();
            f.fixturesPath = 'base/test/fixtures/';
            f.load('testContainer.html');

            containerFixture = d3.select('.test-container').append('svg');
            containerFixture.datum(dataset).call(tooltipChart);
        });

        afterEach(() => {
            containerFixture.remove();
            f = jasmine.getFixtures();
            f.cleanUp();
            f.clearCache();
        });

        it('should render a tooltip with minimal requirements', () =>  {
            expect(containerFixture.select('.britechart-tooltip').empty()).toBeFalsy();
        });

        it('should not be visible by default', () =>  {
            expect(containerFixture.select('.britechart-tooltip').style('display')).toBe('none');
        });

        it('should be visible when required', () =>  {
            expect(containerFixture.select('.britechart-tooltip').style('display')).toBe('none');
            tooltipChart.show();
            expect(containerFixture.select('.britechart-tooltip').style('display')).not.toBe('none');
            expect(containerFixture.select('.britechart-tooltip').style('display')).toBe('block');
        });

        xit('should resize the tooltip depending of number of topics', () =>  {
            tooltipChart.update({
                date: '2015-08-05T07:00:00.000Z',
                topics: [
                    {
                        name: 103,
                        value: 0,
                        topicName: 'San Francisco'
                    }
                ]
            }, topicColorMap, 10);

            expect(
                containerFixture.select('.tooltip-text-container')
                    .attr('height')
            ).toEqual('81.5');

            tooltipChart.update({
                date: '2015-08-05T07:00:00.000Z',
                topics: [
                    {
                        name: 103,
                        value: 0,
                        topicName: 'San Francisco'
                    },
                    {
                        name: 60,
                        value: 10,
                        topicName: 'Chicago'
                    }
                ]
            }, topicColorMap, 10);

            expect(
                containerFixture.select('.tooltip-text-container')
                    .attr('height')
            ).toEqual('105');
        });

        describe('Render', function() {

            describe('title', function() {

                describe('when date has day granularity', function() {

                    it('should update the title of the tooltip with a date with year', () =>  {
                        tooltipChart.forceDateRange(tooltipChart.axisTimeCombinations.DAY_MONTH);
                        tooltipChart.update({
                            date: '2015-08-05T07:00:00.000Z',
                            topics: []
                        }, topicColorMap, 0);

                        expect(
                            containerFixture.select('.britechart-tooltip')
                                .selectAll('.tooltip-title')
                                .text()
                        ).toBe('Tooltip title - Aug 05, 2015');
                    });
                });

                xdescribe('when date has hour granularity', function() {

                    it('should update the title of the tooltip with a date with hours', () =>  {
                        tooltipChart.forceDateRange(tooltipChart.axisTimeCombinations.HOUR_DAY);
                        tooltipChart.update({
                            date: '2015-08-05T07:00:00.000Z',
                            topics: []
                        }, topicColorMap, 0);

                        expect(
                            containerFixture.select('.britechart-tooltip')
                                .selectAll('.tooltip-title')
                                .text()
                        ).toBe('Tooltip title - Aug 05, 12 AM');
                    });
                });
            });

            it('should add a line of text for each topic', () =>  {
                tooltipChart.update({
                    date: '2015-08-05T07:00:00.000Z',
                    topics: [
                        {
                            name: 103,
                            value: '5',
                            topicName: 'San Francisco'
                        },
                        {
                            name: 60,
                            value: '10',
                            topicName: 'Chicago'
                        }
                    ]
                }, topicColorMap, 0);

                expect(
                    containerFixture.select('.britechart-tooltip')
                        .selectAll('.tooltip-left-text')
                        .size()
                ).toEqual(2);
            });

            it('should add a circle for each topic', () =>  {
                tooltipChart.update({
                    date: '2015-08-05T07:00:00.000Z',
                    topics: [
                        {
                            name: 103,
                            value: 0,
                            topicName: 'San Francisco'
                        },
                        {
                            name: 60,
                            value: 10,
                            topicName: 'Chicago'
                        }
                    ]
                }, topicColorMap, 0);

                expect(
                    containerFixture.select('.britechart-tooltip')
                        .selectAll('.tooltip-circle')
                        .size()
                ).toEqual(2);
            });
        });

        describe('Number Formatting', function() {

            describe('decimal values', function() {

                it('should format big numbers', () =>  {
                    var expected = '10k',
                        actual;

                    tooltipChart.update({
                        date: '2015-08-05T07:00:00.000Z',
                        topics: [
                            {
                                name: 103,
                                value: 10000.004,
                                topicName: 'San Francisco'
                            }
                        ]
                    }, topicColorMap, 0);

                    actual = containerFixture.select('.britechart-tooltip .tooltip-right-text')
                                .text()

                    expect(actual).toEqual(expected);
                });

                it('should format medium numbers', () =>  {
                    var expected = '100',
                        actual;

                    tooltipChart.update({
                        date: '2015-08-05T07:00:00.000Z',
                        topics: [
                            {
                                name: 103,
                                value: 100.005,
                                topicName: 'San Francisco'
                            }
                        ]
                    }, topicColorMap, 0);
                    actual = containerFixture.select('.britechart-tooltip .tooltip-right-text')
                                .text()

                    expect(actual).toEqual(expected);
                });

                it('should format small numbers', () =>  {
                    var expected = '9.123',
                        actual;

                    tooltipChart.update({
                        date: '2015-08-05T07:00:00.000Z',
                        topics: [
                            {
                                name: 103,
                                value: 9.1234,
                                topicName: 'San Francisco'
                            }
                        ]
                    }, topicColorMap, 0);

                    actual = containerFixture.select('.britechart-tooltip .tooltip-right-text')
                                .text()

                    expect(actual).toEqual(expected);
                });
            });

            describe('integer values', function() {

                it('should format big numbers', () =>  {
                    var expected = '10k',
                        actual;

                    tooltipChart.update({
                        date: '2015-08-05T07:00:00.000Z',
                        topics: [
                            {
                                name: 103,
                                value: 10000,
                                topicName: 'San Francisco'
                            }
                        ]
                    }, topicColorMap, 0);

                    actual = containerFixture.select('.britechart-tooltip .tooltip-right-text')
                                .text()

                    expect(actual).toEqual(expected);
                });

                it('should not format medium numbers', () =>  {
                    var expected = '103',
                        actual;

                    tooltipChart.update({
                        date: '2015-08-05T07:00:00.000Z',
                        topics: [
                            {
                                name: 103,
                                value: 103,
                                topicName: 'San Francisco'
                            }
                        ]
                    }, topicColorMap, 0);

                    actual = containerFixture.select('.britechart-tooltip .tooltip-right-text')
                                .text()

                    expect(actual).toEqual(expected);
                });

                it('should not format small numbers', () =>  {
                    var expected = '9',
                        actual;

                    tooltipChart.update({
                        date: '2015-08-05T07:00:00.000Z',
                        topics: [
                            {
                                name: 103,
                                value: 9,
                                topicName: 'San Francisco'
                            }
                        ]
                    }, topicColorMap, 0);

                    actual = containerFixture.select('.britechart-tooltip .tooltip-right-text')
                                .text()

                    expect(actual).toEqual(expected);
                });
            });
        });

        describe('API', function() {

            it('should provide title getter and setter', () => {
                let current = tooltipChart.title(),
                    expected = 'test',
                    actual;

                tooltipChart.title(expected);
                actual = tooltipChart.title();

                expect(current).not.toBe(expected);
                expect(actual).toBe(expected);
            });

            it('should provide valueLabel getter and setter', () => {
                let defaultValueLabel = tooltipChart.valueLabel(),
                    testValueLabel = 'quantity',
                    newValueLabel;

                tooltipChart.valueLabel(testValueLabel);
                newValueLabel = tooltipChart.valueLabel();

                expect(defaultValueLabel).not.toBe(testValueLabel);
                expect(newValueLabel).toBe(testValueLabel);
            });

            it('should provide topicLabel getter and setter', () => {
                let defaultTopicLabel = tooltipChart.topicLabel(),
                    testTopicLabel = 'valueSet',
                    newTopicLabel;

                tooltipChart.topicLabel(testTopicLabel);
                newTopicLabel = tooltipChart.topicLabel();

                expect(defaultTopicLabel).not.toBe(testTopicLabel);
                expect(newTopicLabel).toBe(testTopicLabel);
            });

            it('should provide dateLabel getter and setter', () => {
                let defaultDateLabel = tooltipChart.dateLabel(),
                    testDateLabel = 'dateUTC',
                    newDateLabel;

                tooltipChart.dateLabel(testDateLabel);
                newDateLabel = tooltipChart.dateLabel();

                expect(defaultDateLabel).not.toBe(testDateLabel);
                expect(newDateLabel).toBe(testDateLabel);
            });

            it('should provide a forceDateRange getter and setter', () => {
                let defaultSchema = tooltipChart.forceDateRange(),
                    testFormat = tooltipChart.axisTimeCombinations.HOUR_DAY,
                    newSchema;

                tooltipChart.forceDateRange(testFormat);
                newSchema = tooltipChart.forceDateRange();

                expect(defaultSchema).not.toBe(testFormat);
                expect(newSchema).toBe(testFormat);
            });

            it('should provide an axisTimeCombinations accessor', () => {
                let axisTimeCombinations = tooltipChart.axisTimeCombinations;

                expect(axisTimeCombinations).toEqual({
                    MINUTE_HOUR: 'minute-hour',
                    HOUR_DAY: 'hour-daymonth',
                    DAY_MONTH: 'day-month',
                    MONTH_YEAR: 'month-year'
                });
            });

            it('should provide locale getter and setter', () => {
                let current = tooltipChart.locale(),
                    expected = 'fr-FR',
                    actual;

                tooltipChart.locale(expected);
                actual = tooltipChart.locale();

                expect(current).not.toBe(expected);
                expect(actual).toBe(expected);
            });

            it('should provide a forceOrder getter and setter', () => {
                let defaultOrder = tooltipChart.forceOrder(),
                    testOrder = [1,2,3,4,5],
                    newOrder;

                tooltipChart.forceOrder(testOrder);
                newOrder = tooltipChart.forceOrder();

                expect(defaultOrder).not.toBe(testOrder);
                expect(newOrder).toBe(testOrder);
            });
        });
    });
});
