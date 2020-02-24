$(document).ready(function (){
    $('.selected-employment-value').html("Kultivimi i drith\xebrave (p\xebrveç orizit), i bim\xebve bishtajore dhe i far\xebrave vajore");
    getAPI();
});
function onActivityEmploymentSelection(activity) {
    $('.selected-employment-value').html(activity);
    $.ajax({
        data: {
            activity: activity
        },
        type : 'POST',
        url : 'activities-employment',
        beforeSend: function() {
            $('#activityEmploymentLoader').show();
        },
        success: function (dataAPI) {
            processAPI(dataAPI)
            $('#activityEmploymentLoader').hide();
    }
    });
}
function getAPI() {
    $.ajax({
        data: {
            activity: $('.selected-employment-value').html()
        },
        type : 'POST',
        url : 'activities-employment',
        beforeSend: function() {
            $('#activityEmploymentLoader').show();
        },
        success: function (dataAPI) {
            processAPI(dataAPI)
            $('#activityEmploymentLoader').hide();
    }
    });
}
function processAPI(data) {
    activitiesChart(data);
}

function formatLabelText(text) {
    return `<div style="font-size: 6px; text-overflow: none">${text}</div>`; 
}

function activitiesChart(data){
    if (document.documentElement.lang == 'sq') {
        var chartExportingTitle = 'Punesimi baze aktiviteteve';
        Highcharts.setOptions({
            chart: {
                events: {
                    beforePrint: () => {
                        chart.setTitle({ text: 'Punesimi baze aktiviteteve'});
                    },
                    afterPrint: () => {
                        chart.setTitle({ text: ''})
                    }
                }
            }
        });

        var chart = Highcharts.chart('container12', {
            title: {
                text: ''
            },
            yAxis: {
                title: {
                    text: 'Numri i punetoreve'
                },
                labels: {
                    format: '{value:,.0f}'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.x}</span><br>',
                pointFormat: '<span style="color:{point.color}">Total{point.name}</span>: <b>{point.y}</b> punetore<br/>'
            },

            xAxis: {
                categories: ['3 vitet e fundit','5 vitet e fundit'],
                labels: {
                    useHTML: true,
                    formatter: function () {
                        return `<div style="text-align: center; text-overflow: none">${this.value}</div>`;
                    },
                    autoRotationLimit: 0,
                }
                
            },

            series: [{
                type: 'column',
                colorByPoint: true,
                data: data,
                showInLegend: false,
                colors: [
                    {
                        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                        stops: [
                            [0, '#4A0D67'],
                            [1, '#7B4F90']
                        ]
                    },
                    {
                        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                        stops: [
                            [0, '#473198'],
                            [1, '#7969B4']
                        ]
                    }
                ]
            }],
            exporting: {
                enabled: true,
                filename: 'Top_aktivitetet_ne_vitet_e_fundit',
                allowHTML: true,
                chartOptions:{
                    yAxis: [{
                        title: {
                            text: 'Numri i bizneseve'
                        },
                        labels: {
                            formatter: function () {
                                return formatLabelText(this.value);
                            }
                        }
                    }
                    ],
                    xAxis: [{
                        categories: emri,
                        labels: {
                            autoRotationLimit: 40,
                            formatter: function () {
                                return formatLabelText(this.value);
                            }
                        },
                    }],
                    title: {
                        text: `<h2>${chartExportingTitle}</h2>`,
                    }
                },
                buttons: {
                    contextButton: {
                        enabled: false    
                    },
                    exportButton: {
                        text: 'Shkarko',
                        menuItems: ['printChart','separator','downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG']
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
    else{
        var chartExportingTitle = 'Employment based on activity';
        Highcharts.setOptions({
            chart: {
                events: {
                    beforePrint: () => {
                        chart.setTitle({ text: 'Employment based on activity'});
                    },
                    afterPrint: () => {
                        chart.setTitle({ text: ''})
                    }
                }
            }
        });

        var chart = Highcharts.chart('container12', {

            title: {
                text: ''
            },
            legend: {
                enabled: false
            },
            yAxis: {
                title: {
                    text: 'Total number of employers'
                },
                labels: {
                    format: '{value:,.0f}'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.x}</span><br>',
                pointFormat: '<span style="color:{point.color}">Total{point.name}</span>: <b>{point.y}</b> employers<br/>'
            },

            xAxis: {
                categories: ['Last 3 years','Last 5 years'],
                labels: {
                    useHTML: true,
                    formatter: function () {
                        return `<div style="text-align: center; text-overflow: none">${this.value}</div>`;
                    },
                    autoRotationLimit: 0,
                }
            },

            series: [{
                type: 'column',
                colorByPoint: true,
                data: data,
                showInLegend: false,
                colors: [
                    {
                        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                        stops: [
                            [0, '#4A0D67'],
                            [1, '#7B4F90']
                        ]
                    },
                    {
                        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                        stops: [
                            [0, '#473198'],
                            [1, '#7969B4']
                        ]
                    }
                ]
            }],
            exporting: {
                enabled: true,
                filename: 'Employment_based_on_activity',
                allowHTML: true,
            chartOptions:{
                yAxis: [{
                    title: {
                        text: 'Total number of employers'
                    },
                    labels: {
                        formatter: function () {
                            return formatLabelText(this.value);
                        }
                    }
                }
                ],
                xAxis: [{
                    categories: emri,
                    labels: {
                        autoRotationLimit: 40,
                        formatter: function () {
                            return formatLabelText(this.value);
                        }    
                    },
                }],
                title: {
                    text: `<h2>${chartExportingTitle}</h2>`,
                }
            },
            buttons: {
                contextButton: {
                    enabled: false    
                },
                exportButton: {
                    text: 'Download',
                    menuItems: ['printChart','separator','downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG']
                }
            }
            }
        });
    }
}
