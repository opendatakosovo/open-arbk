var defaultActivity = "";
$(document).ready(function () {
    if (document.documentElement.lang == 'sq') {
        defaultActivity = "Kultivimi i drith\xebrave (p\xebrveç orizit), i bim\xebve bishtajore dhe i far\xebrave vajore";
        $('.selected-employment-value').html(defaultActivity);
    }

    else {
        defaultActivity = "Growing of cereals (except rice), leguminous crops and oil seeds";
        $('.selected-employment-value').html(defaultActivity);
    }
    $.ajax({
        data: {
            activity: defaultActivity,
        },
        url: "activities-employment-line",
        type: 'POST',
        beforeSend: function () {
            $('#activityEmploymentLoader').show();
        },
        success: function (data) {
            activityEmployment(data);
            $('#activityEmploymentLoader').hide();
        },
        error: function (error) {
        }
    });
});
function onActivityEmploymentSelection(name) {
    defaultActivity = name;
    $('.selected-employment-value').html(name);
    $.ajax({
        data: {
            activity: defaultActivity,
        },
        url: "activities-employment-line",
        type: 'POST',
        beforeSend: function () {
            $('#activityEmploymentLoader').show();
        },
        success: function (data) {
            activityEmployment(data);
            $('#activityEmploymentLoader').hide();
        },
        error: function (error) {
        }
    });
}

function activityEmployment(data) {
    if (document.documentElement.lang == 'sq') {
        Highcharts.setOptions({
            chart: {
                events: {
                    beforePrint: () => {
                        chart.setTitle({
                            text: 'Pun\xebsimi në baz\xeb t\xeb aktiviteteve'
                        },
                            {
                                text: defaultActivity
                            });
                    },
                    afterPrint: () => {
                        chart.setTitle({ text: '' }, { text: '' })
                    }
                }
            }
        });

        var chart = Highcharts.chart('container12', {
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
                    text: 'Numri i punetor\xebve'
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
                name: 'Numri i pun\xebtor\xebve',
                data: [data.d0,
                data.d1,
                data.d2,
                data.d3,
                data.d4,
                data.d5,
                data.d6,
                data.d7,
                data.d8,
                data.d9,
                data.d10,
                data.d11,
                data.d12,
                data.d13,
                data.d14,
                data.d15,
                data.d16,
                data.d17,
                data.d18,
                data.d19,
                ],
                color: '#0090FF'
            }],
            tooltip: {
                formatter: function () {
                    var s = "<span style=\"font-size:10px\">" + this.x + "</br></span>"
                    $.each(this.points, function () {
                        var i = this.point.index;

                        s += "<p>" + this.series.name + ": <b>" + this.y + "</b></p>";
                        if (i > 0) {
                            var num1 = this.series.data[i - 1].y
                            var num2 = this.series.data[i].y
                            var percentChange = ((num2 - num1) / num1) * 100;
                            if (num1 > 0) {
                                if (percentChange < 0) {
                                    s += "<p style=\"color:red;\">Zvogelim: <b> " + Math.abs(percentChange.toFixed(2)) + "%</b></p>"
                                } else {
                                    s += "<p style=\"color:green;\">Rritje: <b> " + Math.abs(percentChange.toFixed(2)) + "%</b></p>"
                                }
                            }
                        }
                    });
                    return s;
                },
                shared: true,
                useHTML: true
            },
            exporting: {
                enabled: true,
                filename: 'Punesimi_ne_baze_te_aktiviteteve',
                chartOptions: {
                    title: {
                        text: '<h2>Pun\xebsimi në baz\xeb t\xeb aktiviteteve</h2>'
                    },
                    subtitle: {
                        text: `${defaultActivity}`
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
                        chart.setTitle(
                            {
                                text: 'Employment based on activities'
                            },
                            {
                                text: defaultActivity
                            });
                    },
                    afterPrint: () => {
                        chart.setTitle({ text: '' }, { text: '' })
                    }
                }
            }
        });
        var chart = Highcharts.chart('container12', {
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
                    text: 'Number of employers'
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
                name: 'Number of employers',
                data: [data.d0,
                data.d1,
                data.d2,
                data.d3,
                data.d4,
                data.d5,
                data.d6,
                data.d7,
                data.d8,
                data.d9,
                data.d10,
                data.d11,
                data.d12,
                data.d13,
                data.d14,
                data.d15,
                data.d16,
                data.d17,
                data.d18,
                data.d19,
                ],
                color: '#0090FF'
            }],
            tooltip: {
                formatter: function () {
                    var s = "<span style=\"font-size:10px\">" + this.x + "</br></span>"
                    $.each(this.points, function () {
                        var i = this.point.index;

                        s += "<p>" + this.series.name + ": <b>" + this.y + "</b></p>";
                        if (i > 0) {
                            var num1 = this.series.data[i - 1].y
                            var num2 = this.series.data[i].y
                            var percentChange = ((num2 - num1) / num1) * 100;
                            if (num1 > 0) {
                                if (percentChange < 0) {
                                    s += "<p style=\"color:red;\">Decrease: <b> " + Math.abs(percentChange.toFixed(2)) + "%</b></p>"
                                } else {
                                    s += "<p style=\"color:green;\">Increase: <b> " + Math.abs(percentChange.toFixed(2)) + "%</b></p>"
                                }
                            }
                        }
                    });
                    return s;
                },
                shared: true,
                useHTML: true
            },
            exporting: {
                enabled: true,
                filename: 'Employment_based_on_activities',
                chartOptions: {
                    title: {
                        text: '<h2>Employment based on activities</h2>'
                    },
                    subtitle: {
                        text: `${defaultActivity}`
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
