var avgActivity = "";
$(document).ready(function () {
    if (document.documentElement.lang == 'sq') {
        avgActivity = "Kultivimi i drith\xebrave (p\xebrveç orizit), i bim\xebve bishtajore dhe i far\xebrave vajore";
        $('.avg-capital-selected-value').html(avgActivity);
    }

    else {
        avgActivity = "Growing of cereals (except rice), leguminous crops and oil seeds";
        $('.avg-capital-selected-value').html(avgActivity);
    }
    $.ajax({
        data: {
            activity: avgActivity,
        },
        url: "activities-avg-capital-years",
        type: 'POST',
        beforeSend: function () {
            $('#activityAvgCapitalYearsLoader').show();
        },
        success: function (data) {
            datesAvg(data);
            $('#activityAvgCapitalYearsLoader').hide();
        },
        error: function (error) {
        }
    });
});
function avgCapitalOnActivitySelection(name) {
    avgActivity = name;
    $('.avg-capital-selected-value').html(name);
    $.ajax({
        data: {
            activity: avgActivity,
        },
        url: "activities-avg-capital-years",
        type: 'POST',
        beforeSend: function () {
            $('#activityAvgCapitalYearsLoader').show();
        },
        success: function (data) {
            datesAvg(data);
            $('#activityAvgCapitalYearsLoader').hide();
        },
        error: function (error) {
        }
    });
}

function datesAvg(data) {
    if (document.documentElement.lang == 'sq') {
        Highcharts.setOptions({
            chart: {
                events: {
                    beforePrint: () => {
                        chart.setTitle({ text: 'Kapitali Mesatar I Aktiviteteve Gjatë Viteve' });
                    },
                    afterPrint: () => {
                        chart.setTitle({ text: '' })
                    }
                }
            }
        });

        var chart = Highcharts.chart('container11', {
            chart: {
                type: 'line'
            },
            title: {
                text: ''
            },
            xAxis: {
                title: {
                    text: 'Data e fillimit'
                },
                categories: ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019']
            },
            yAxis: {
                title: {
                    text: 'Kapitali mesatar (Euro)'
                },
                labels: {
                    format: '{value:.0f}'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: true
                }
            },
            series: [{
                name: 'Kapitali mesatar',
                tooltip: {
                    valueSuffix: " euro"
                },
                data: [
                    data.y0.AvgCapital,
                    data.y1.AvgCapital,
                    data.y2.AvgCapital,
                    data.y3.AvgCapital,
                    data.y4.AvgCapital,
                    data.y5.AvgCapital,
                    data.y6.AvgCapital,
                    data.y7.AvgCapital,
                    data.y8.AvgCapital,
                    data.y9.AvgCapital,
                    data.y10.AvgCapital,
                    data.y11.AvgCapital,
                    data.y12.AvgCapital,
                    data.y13.AvgCapital,
                    data.y14.AvgCapital,
                    data.y15.AvgCapital,
                    data.y16.AvgCapital,
                    data.y17.AvgCapital,
                    data.y18.AvgCapital,
                    data.y19.AvgCapital,
                ],
                color: '#0090FF'
            }],
            exporting: {
                enabled: true,
                filename: 'Kapitali_mesatar_i_aktiviteteve_gjate_viteve',
                chartOptions: {
                    title: {
                        text: '<h2>Kapitali Mesatar I Aktiviteteve Gjatë Viteve</h2>'
                    }
                },
                buttons: {
                    contextButton: {
                        enabled: false
                    },
                    exportButton: {
                        text: 'Shkarko',
                        y: -15,
                        menuItems: ['printChart', 'separator', 'downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG']
                    }
                }
            },
            lang: {
                printChart: 'Printoje vizualizimin',
                downloadPNG: 'Shkarko imazhin PNG',
                downloadJPEG: 'Shkarko imazhin JPEG',
                downloadPDF: 'Shkarko dokumentin PDF',
                downloadSVG: 'Shkarko imazhin SVG'
            }
        });
    }
    else {
        Highcharts.setOptions({
            chart: {
                events: {
                    beforePrint: () => {
                        chart.setTitle({ text: 'Activities Average Capital Over The Years' });
                    },
                    afterPrint: () => {
                        chart.setTitle({ text: '' })
                    }
                }
            }
        });
        var chart = Highcharts.chart('container11', {
            chart: {
                type: 'line'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019']
            },
            yAxis: {
                title: {
                    text: 'Average capital (Euro)'
                },
                labels: {
                    format: '{value:.0f}'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: true
                }
            },
            series: [{
                name: 'Average capital',
                tooltip: {
                    valueSuffix: " euro"
                },
                data: [
                    data.y0.AvgCapital,
                    data.y1.AvgCapital,
                    data.y2.AvgCapital,
                    data.y3.AvgCapital,
                    data.y4.AvgCapital,
                    data.y5.AvgCapital,
                    data.y6.AvgCapital,
                    data.y7.AvgCapital,
                    data.y8.AvgCapital,
                    data.y9.AvgCapital,
                    data.y10.AvgCapital,
                    data.y11.AvgCapital,
                    data.y12.AvgCapital,
                    data.y13.AvgCapital,
                    data.y14.AvgCapital,
                    data.y15.AvgCapital,
                    data.y16.AvgCapital,
                    data.y17.AvgCapital,
                    data.y18.AvgCapital,
                    data.y19.AvgCapital,
                ],
                color: '#0090FF'
            }],
            exporting: {
                enabled: true,
                filename: 'Activities_average_capital_over_the_years',
                chartOptions: {
                    title: {
                        text: '<h2>Activities Average Capital Over The Years</h2>'
                    }
                },
                buttons: {
                    contextButton: {
                        enabled: false
                    },
                    exportButton: {
                        text: 'Download',
                        y: -15,
                        menuItems: ['printChart', 'separator', 'downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG']
                    }
                }
            }
        });
    }
}
