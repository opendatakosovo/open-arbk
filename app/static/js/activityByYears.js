var defaultActivity = "";
var defaultGender = "";
$(document).ready(function () {
    if (document.documentElement.lang == 'sq') {
        defaultActivity = "Kultivimi i drith\xebrave (p\xebrveç orizit), i bim\xebve bishtajore dhe i far\xebrave vajore";
        defaultGender = formatGender('T&euml; gjitha');
        $('.selected-value').html(defaultActivity);
        $('.selected-value-gender').html('T&euml; gjitha');
    }

    else {
        defaultActivity = "Growing of cereals (except rice), leguminous crops and oil seeds";
        defaultGender = formatGender('All');
        $('.selected-value').html(defaultActivity);
        $('.selected-value-gender').html('All');
    }
    $.ajax({
        data: {
            activity: defaultActivity,
            owner_gender: defaultGender
        },
        url: "activities-years",
        type: 'POST',
        beforeSend: function () {
            $('#activityYearsLoader').show();
        },
        success: function (data) {
            dates(data);
            $('#activityYearsLoader').hide();
        },
        error: function (error) {
        }
    });
});
function onActivitySelection(name) {
    defaultActivity = name;
    $('.selected-value').html(name);
    $.ajax({
        data: {
            activity: defaultActivity,
            owner_gender: defaultGender
        },
        url: "activities-years",
        type: 'POST',
        beforeSend: function () {
            $('#activityYearsLoader').show();
        },
        success: function (data) {
            dates(data);
            $('#activityYearsLoader').hide();
        },
        error: function (error) {
        }
    });
}

function onGenderSelection(gender) {
    $('.selected-value-gender').html(gender);
    defaultGender = formatGender(gender);
    $.ajax({
        data: {
            activity: defaultActivity,
            owner_gender: defaultGender
        },
        url: "activities-years",
        type: 'POST',
        beforeSend: function () {
            $('#activityYearsLoader').show();
        },
        success: function (data) {
            dates(data);
            $('#activityYearsLoader').hide();
        },
        error: function (error) {
        }
    });
}
function formatGender(gender) {
    if (gender.includes('gjitha') || gender == 'All') {
        return 'any';
    } else if (gender == 'Mashkull' || gender == 'Male') {
        return 'male';
    } else if (gender == 'Panjohur' || gender == 'Unknown') {
        return 'unknown';
    } else {
        return 'female';
    }
}
function dates(data) {
    if (document.documentElement.lang == 'sq') {
        Highcharts.setOptions({
            chart: {
                events: {
                    beforePrint: () => {
                        chart.setTitle({ text: 'Aktivitetet Gjatë Viteve' });
                    },
                    afterPrint: () => {
                        chart.setTitle({ text: '' })
                    }
                }
            }
        });

        var chart = Highcharts.chart('container9', {
            chart: {
                type: 'line'
            },
            title: {
                text: ''
            },
            xAxis: {
                title: {
                    text: 'Data e aplikimit'
                },
                categories: ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019']
            },
            yAxis: {
                title: {
                    text: 'Numri i bizneseve'
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
                name: 'T\xeb krijuara',
                data: [data.d0.Shuar + data.d0.Aktiv, data.d1.Shuar + data.d1.Aktiv, data.d2.Shuar + data.d2.Aktiv, data.d3.Shuar + data.d3.Aktiv, data.d4.Shuar + data.d4.Aktiv, data.d5.Shuar + data.d5.Aktiv, data.d6.Shuar + data.d6.Aktiv, data.d7.Shuar + data.d7.Aktiv, data.d8.Shuar + data.d8.Aktiv, data.d9.Shuar + data.d9.Aktiv, data.d10.Shuar + data.d10.Aktiv, data.d11.Shuar + data.d11.Aktiv, data.d12.Shuar + data.d12.Aktiv, data.d13.Shuar + data.d13.Aktiv, data.d14.Shuar + data.d14.Aktiv, data.d15.Shuar + data.d15.Aktiv, data.d16.Shuar + data.d16.Aktiv, data.d17.Shuar + data.d17.Aktiv,
                data.d18.Shuar + data.d18.Aktiv, data.d19.Shuar + data.d19.Aktiv],
                color: '#0090FF'
            }, {
                name: 'Aktive',
                data: [data.d0.Aktiv, data.d1.Aktiv, data.d2.Aktiv, data.d3.Aktiv, data.d4.Aktiv, data.d5.Aktiv, data.d6.Aktiv, data.d7.Aktiv, data.d8.Aktiv, data.d9.Aktiv, data.d10.Aktiv, data.d11.Aktiv, data.d12.Aktiv, data.d13.Aktiv, data.d14.Aktiv, data.d15.Aktiv, data.d16.Aktiv],
                color: '#50FF00'
            }, {
                name: 'T\xeb Shuara',
                data: [data.d0.Shuar, data.d1.Shuar, data.d2.Shuar, data.d3.Shuar, data.d4.Shuar, data.d5.Shuar, data.d6.Shuar, data.d7.Shuar, data.d8.Shuar, data.d9.Shuar, data.d10.Shuar, data.d11.Shuar, data.d12.Shuar, data.d13.Shuar, data.d14.Shuar, data.d15.Shuar, data.d16.Shuar, data.d17.Shuar, data.d18.Shuar, data.d19.Shuar],
                color: '#FF0000'
            }],
            exporting: {
                enabled: true,
                filename: 'Aktivitetet_gjate_viteve',
                chartOptions: {
                    title: {
                        text: '<h2>Aktivitetet Gjatë Viteve</h2>'
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
                        chart.setTitle({ text: 'Activities over the Years' });
                    },
                    afterPrint: () => {
                        chart.setTitle({ text: '' })
                    }
                }
            }
        });
        var chart = Highcharts.chart('container9', {
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
                    text: 'Number of businesses'
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
                name: 'Created',
                data: [data.d0.Dissolved + data.d0.Active, data.d1.Dissolved + data.d1.Active, data.d2.Dissolved + data.d2.Active, data.d3.Dissolved + data.d3.Active, data.d4.Dissolved + data.d4.Active, data.d5.Dissolved + data.d5.Active, data.d6.Dissolved + data.d6.Active, data.d7.Dissolved + data.d7.Active, data.d8.Dissolved + data.d8.Active, data.d9.Dissolved + data.d9.Active, data.d10.Dissolved + data.d10.Active, data.d11.Dissolved + data.d11.Active, data.d12.Dissolved + data.d12.Active, data.d13.Dissolved + data.d13.Active, data.d14.Dissolved + data.d14.Active, data.d15.Dissolved + data.d15.Active, data.d16.Dissolved + data.d16.Active,
                data.d17.Dissolved + data.d17.Active,
                data.d18.Dissolved + data.d18.Active,
                data.d19.Dissolved + data.d19.Active,],
                color: '#0090FF'
            }, {
                name: 'Active',
                data: [data.d0.Active, data.d1.Active, data.d2.Active, data.d3.Active, data.d4.Active, data.d5.Active, data.d6.Active, data.d7.Active, data.d8.Active, data.d9.Active, data.d10.Active, data.d11.Active, data.d12.Active, data.d13.Active, data.d14.Active, data.d15.Active, data.d16.Active, data.d17.Active, data.d18.Active, data.d19.Active],
                color: '#50FF00'
            }, {
                name: 'Dissolved',
                data: [data.d0.Dissolved, data.d1.Dissolved, data.d2.Dissolved, data.d3.Dissolved, data.d4.Dissolved, data.d5.Dissolved, data.d6.Dissolved, data.d7.Dissolved, data.d8.Dissolved, data.d9.Dissolved, data.d10.Dissolved, data.d11.Dissolved, data.d12.Dissolved, data.d13.Dissolved, data.d14.Dissolved, data.d15.Dissolved, data.d16.Dissolved, data.d17.Dissolved, data.d18.Dissolved, data.d19.Dissolved],
                color: '#FF0000'
            }],
            exporting: {
                enabled: true,
                filename: 'Activities_over_the_years',
                chartOptions: {
                    title: {
                        text: '<h2>Activities over the Years</h2>'
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
