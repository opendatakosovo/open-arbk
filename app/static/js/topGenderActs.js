$('document').ready(function() {
    $.ajax({
        url: "top-10-gender-activities",
        type: 'GET',
        success: function(data){
          proccesAPIFemra(data.females.activities);
          proccesAPIMeshkuj(data.males.activities);
          $('#genderActivitiesLoader').hide()
        }
    })
})
function proccesAPIMeshkuj(data) {
    emri = [];
    vals = [];
    for(var i=0; i<data.length;i++){
        emri.push(data[i].details.activity[document.documentElement.lang]);
        vals.push(data[i].total_businesses);
    }
    topGenderActivitiesMeshkuj(vals, emri);
}
function proccesAPIFemra(data) {
    emri = [];
    vals = [];
    for(var i=0; i<data.length;i++){
        emri.push(data[i].details.activity[document.documentElement.lang]);
        vals.push(data[i].total_businesses);
    }
    topGenderActivitiesFemra(vals, emri);
}
function topGenderActivitiesFemra(data, categories) {
    if (document.documentElement.lang == 'sq') {
        Highcharts.setOptions({
            chart: {
                events: {
                    beforePrint: () => {
                        chart.setSize(chart.chartWidth + 350, chart.chartHeight, false);
                        chart.setTitle({ text: 'Top 10 Aktivitetet Biznesore të Ndara sipas Gjinisë së Pronarëve - Gra'});
                    },
                    afterPrint: () => {
                        chart.setTitle({ text: 'Gra'})
                        chart.setSize(chart.chartWidth - 350, chart.chartHeight, false);
    
                    }
                }
            }
        });  
        var chart = Highcharts.chart('container8', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'bar'
            },
            title: {
                text: 'Gra'
            },
            xAxis: {
                categories: categories,
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Numri i Bizneseve',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{point.color}"><b>{point.y:,.0f}</b> biznese</span><br/>'
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            series: [{
                colors: ['#041D2F','#21283E','#242B44','#3E3F60','#4B5166','#4F506E', '#61617C', '#72738B','#848499', '#9596A8'],
                colorByPoint: true,
                data: data
            }],
            exporting: {
                enabled: true,
                filename: 'Top_10_aktivitetet_biznesore_te_ndara_sipas_gjinise_se_pronareve_Gra',
                chartOptions: {
                    title: {
                        text: '<h2>Top 10 Aktivitetet Biznesore të Ndara sipas Gjinisë së Pronarëve - Gra</h2>'
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
                },
                width: 950

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
        Highcharts.setOptions({
            chart: {
                events: {
                    beforePrint: () => {
                        chart.setSize(chart.chartWidth + 350, chart.chartHeight, false);
                        chart.setTitle({ text: 'Top 10 Business Activities Separated by Owner Gender - Women'});
                    },
                    afterPrint: () => {
                        chart.setTitle({ text: 'Women'})
                        chart.setSize(chart.chartWidth - 350, chart.chartHeight, false);
    
                    }
                }
            }
        });

        var chart = Highcharts.chart('container8', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'bar'
            },
            title: {
                text: 'Women'
            },
            xAxis: {
                categories: categories,
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Number of businesses',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{point.color}"><b>{point.y:,.0f}</b> businesses</span><br/>'
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            series: [{
                colors: ['#041D2F','#21283E','#242B44','#3E3F60','#4B5166','#4F506E', '#61617C', '#72738B','#848499', '#9596A8'],
                colorByPoint: true,
                data: data
            }],
            exporting: {
                enabled: true,
                filename: 'Top_10_business_activities_separated_by_owner_gender_Women',
                chartOptions: {
                    title: {
                        text: '<h2>Top 10 Business Activities Separated by Owner Gender - Women</h2>'
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
                },
                width: 950
            }
        });
    }
}

function topGenderActivitiesMeshkuj(data, categories) {
    if (document.documentElement.lang == 'sq') {
    Highcharts.setOptions({
        chart: {
            events: {
                beforePrint: () => {
                    chart.setSize(chart.chartWidth + 350, chart.chartHeight, false);
                    chart.setTitle({ text: 'Top 10 Aktivitetet Biznesore të Ndara sipas Gjinisë së Pronarëve - Burra'});
                },
                afterPrint: () => {
                    chart.setTitle({ text: 'Burra'})
                    chart.setSize(chart.chartWidth - 350, chart.chartHeight, false);

                }
            }
        }
    });    
    var chart = Highcharts.chart('container7', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'bar'
        },
        title: {
            text: 'Burra'
        },
        xAxis: {
            categories: categories,
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Numri i Bizneseve',
                align: 'high'
            },
            labels: {
                overflow: 'justify',
                format: '{value:,.0f}'
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{point.color}"><b>{point.y:,.0f}</b> biznese</span><br/>'
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        series: [{
            colors: ['#5C0722','#6B0827','#700829','#7A092D','#890A32','#980B38','#A70C3D','#AF224E','#B73860','#BF4E71'],
            colorByPoint: true,
            data: data
        }],
        exporting: {
            enabled: true,
            filename: 'Top_10_aktivitetet_biznesore_te_ndara_sipas_gjinise_se_pronareve_Burra',
            chartOptions: {
                title: {
                    text: '<h2>Top 10 Aktivitetet Biznesore të Ndara sipas Gjinisë së Pronarëve - Burra</h2>'
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
            },
            width: 950
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
        Highcharts.setOptions({
            chart: {
                events: {
                    beforePrint: () => {
                        chart.setSize(chart.chartWidth + 350, chart.chartHeight, false);
                        chart.setTitle({ text: 'Top 10 Business Activities Separated by Owner Gender - Men'});
                    },
                    afterPrint: () => {
                        chart.setTitle({ text: 'Men'})
                        chart.setSize(chart.chartWidth - 350, chart.chartHeight, false);
    
                    }
                }
            }
        }); 
        var chart = Highcharts.chart('container7', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'bar'
            },
            title: {
                text: 'Men'
            },
            xAxis: {
                categories: categories,
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Number of businesses',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify',
                    format: '{value:.0f}'
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{point.color}"><b>{point.y:,.0f}</b> businesses</span><br/>'
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            series: [{
                colors: ['#5C0722','#6B0827','#700829','#7A092D','#890A32','#980B38','#A70C3D','#AF224E','#B73860','#BF4E71'],
                colorByPoint: true,
                data: data
            }],
            exporting: {
                enabled: true,
                filename: 'Top_10_business_activities_separated_by_owner_gender_Men',
                chartOptions: {
                    title: {
                        text: '<h2>Top 10 Business Activities Separated by Owner Gender - Men</h2>'
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
                },
                width: 950
            }
        });
    }
}
