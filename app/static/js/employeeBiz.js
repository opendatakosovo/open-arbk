$(document).ready(function(){

    if (document.documentElement.lang == 'sq') {
        $('.selected-value-employee-num').html('T&euml; gjitha');
    }else{
        $('.selected-value-employee-num').html('All');
    }
  $.ajax({
    data: {
        activity: "any",
        municipality: "any"
    },
    url: "employees",
    type: 'POST',
    beforeSend:function() {
        $('#employeesLoader').show();
    },
    success: function(data){
        employeesChart(data);
        $('#employeesLoader').hide();
    }
  });

  $('#municipality_employees_num').on('change', function() {
    var activity = $('.selected-value-employee-num').html();
    if(activity.includes('gjitha') || activity.includes('All')) {
        activity = "any"
    }
      $.ajax({
        data: {
            activity: activity,
            municipality: this.value
        },  
        url: "employees",
        type: 'POST',
        beforeSend:function() {
            $('#employeesLoader').show();
        },
        success: function(data){
            employeesChart(data);
            $('#employeesLoader').hide();
        }
    });
  })


});


function onActivitySelectionEmployeesNum(activity) {
    $('.selected-value-employee-num').html(activity);
    if(activity.includes('gjitha') || activity.includes('All')) {
        activity = "any"
    }
    $.ajax({
        data: {
            activity: activity,
            municipality: $('#municipality_employees_num').val()
        },  
        url: "employees",
        type: 'POST',
        beforeSend:function() {
            $('#employeesLoader').show();
        },
        success: function(data){
            employeesChart(data);
            $('#employeesLoader').hide();
        }
    });
}


function employeesChart(data) {
    // Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
    //     return {
    //         radialGradient: {
    //             cx: 0.5,
    //             cy: 0.3,
    //             r: 0.7
    //         },
    //         stops: [
    //             [0, color],
    //             [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
    //         ]
    //     };
    // });
    function divideNums(x,y) {
        if (x == 0 || y == 0) {
            return 0;
        } else {
            return Math.round(x / y * 100);
        }
    }
    
    if (document.documentElement.lang == 'sq') {
        
        // Create the chart
        Highcharts.setOptions({
            lang: {
                drillUpText: '< Kthehu prapa',
                noData: 'Nuk ka te dhena'
            },
            chart: {
                events: {
                    beforePrint: () => {
                        chart.setTitle({ text: 'Bizneset sipas numrit te punetoreve'});
                    },
                    afterPrint: () => {
                        chart.setTitle({ text: ''})
                    }
                }
            }
        });
        var chart = Highcharts.chart('empContainer', {
            chart: {
                type: 'pie',
            },
            title: {
                text: ''
            },
            plotOptions: {
                pie: {
                    cursor: 'pointer',
                    showInLegend: true,
                    colors:  Highcharts.map(Highcharts.getOptions().colors, function(color) {
                        return {
                          radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
                          stops: [
                            [0, color],
                            [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
                            ]
                      }})  
                },
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}: {point.y:.2f}%'
                    }
                }
            },
            tooltip: {
                formatter: function () {
                    var num = Highcharts.numberFormat(this.point.totalD, 0);
                    if (num==0) {
                        num = '';
                    }
                    return '<span style="font-size:11px">'+this.series.name+': '+
                    num+
                    '</span><br><span style="color:{point.color}">'+
                    this.point.name+
                    '</span>: <b>'+
                    Highcharts.numberFormat(this.point.y, 2, '.')+
                    '%</b> nga total<br/>';
                }
                // headerFormat: '',
                // pointFormat: '<span style="font-size:11px">{series.name}: {point.totalD}</span><br><span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> nga total<br/>'
            },
            legend: {
                labelFormatter: function () {
                    var val = '';
                    if (this.min != undefined)
                    val = ' ('+this.min+''+this.max+')';
                    return this.name+val;
                }
            },
            series: [{
                name: "Biznese",
                // colorByPoint: true,
                data: [{
                    name: 'Mikrond\xebrmarrje',
                    y: divideNums(data.micro.total, data.total),
                    drilldown: 'micro',
                    totalD:data.micro.total,
                    min:'1',
                    max:'-9'
                }, {
                    name: 'Nd\xebrmarrje e vog\xebl',
                    y: divideNums(data.mini.total, data.total),
                    drilldown: 'mini',
                    totalD:data.mini.total,
                    min:'10',
                    max:'-49'
                }, {
                    name: 'Nd\xebrmarrje e mesme',
                    y: divideNums(data.middle.total, data.total),
                    drilldown: 'middle',
                    totalD:data.middle.total,
                    min:'50',
                    max:'-249'
                }, {
                    name: 'Nd\xebrmarrje e madhe',
                    y: divideNums(data.big.total, data.total),
                    drilldown: 'big',
                    totalD:data.big.total,
                    min:'250+',
                    max:''
                }]
            }],
            drilldown: {
                series: [{
                    name: 'Mikrond\xebrmarrje',
                    id: 'micro',
                    data: [
                        ['Aktive', divideNums(data.micro.Aktiv, data.micro.total)],
                        ['Shuar', divideNums(data.micro.Shuar, data.micro.total)]
                    ]
                }, {
                    name: 'Nd\xebrmarrje e vog\xebl',
                    id: 'mini',
                    data: [
                        ['Aktive', divideNums(data.mini.Aktiv, data.mini.total)],
                        ['Shuar', divideNums(data.mini.Shuar, data.mini.total)]
                    ]
                }, {
                    name: 'Nd\xebrmarrje e mesme',
                    id: 'middle',
                    data: [
                        ['Aktive', divideNums(data.middle.Aktiv, data.middle.total)],
                        ['Shuar', divideNums(data.middle.Shuar, data.middle.total)]
                    ]
                }, {
                    name: 'Nd\xebrmarrje e madhe',
                    id: 'big',
                    data: [
                        ['Aktive', divideNums(data.big.Aktiv, data.big.total)],
                        ['Shuar', divideNums(data.big.Shuar, data.big.total)]
                    ]
                }]
            },
            exporting: {
                enabled: true,
                chartOptions: {
                    title: {
                        text: 'Bizneset sipas numrit te punetoreve'
                    }
                },
                filename: 'Bizneset_sipas_numrit_te_punetoreve',
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
        // Create the chart
        Highcharts.setOptions({
            lang: {
                drillUpText: '< Go back'
            },
            chart: {
                events: {
                    beforePrint: () => {
                        chart.setTitle({ text: 'Businesses by Number of Employees'});
                    },
                    afterPrint: () => {
                        chart.setTitle({ text: ''})
                    }
                }
            }
        });
        var chart = Highcharts.chart('empContainer', {
            chart: {
                type: 'pie'
            },
            title: {
                text: ''
            },
            plotOptions: {
                pie: {
                    cursor: 'pointer',
                    showInLegend: true,
                    colors:  Highcharts.map(Highcharts.getOptions().colors, function(color) {
                        return {
                          radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
                          stops: [
                            [0, color],
                            [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
                            ]
                      }})  
                },
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}: {point.y:.2f}%'
                    }
                }
            },
            tooltip: {
                formatter: function () {
                    var num = Highcharts.numberFormat(this.point.totalD, 0);
                    if (num==0) {
                        num = '';
                    }
                    return '<span style="font-size:11px">'+this.series.name+': '+
                    num+
                    '</span><br><span style="color:{point.color}">'+
                    this.point.name+
                    '</span>: <b>'+
                    Highcharts.numberFormat(this.point.y, 2, '.')+
                    '%</b> of total<br/>';
                }
                // headerFormat: '',
                // pointFormat: '<span style="font-size:11px">{series.name}: {point.totalD}</span><br><span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> nga total<br/>'
            },
            legend: {
                labelFormatter: function () {
                    var val = '';
                    if (this.min != undefined)
                    val = ' ('+this.min+''+this.max+')';
                    return this.name+val;
                }
            },
            series: [{
                name: "Businesses",
                // colorByPoint: true,
                data: [{
                    name: 'Microenterprise',
                    y: divideNums(data.micro.total, data.total),
                    drilldown: 'micro',
                    totalD:data.micro.total,
                    min:'1',
                    max:'-9'
                }, {
                    name: 'Small enterprise',
                    y: divideNums(data.mini.total, data.total),
                    drilldown: 'mini',
                    totalD:data.mini.total,
                    min:'10',
                    max:'-49'
                }, {
                    name: 'Medium Enterprise',
                    y: divideNums(data.middle.total, data.total),
                    drilldown: 'middle',
                    totalD:data.middle.total,
                    min:'50',
                    max:'-249'
                }, {
                    name: 'Large Enterprise',
                    y: divideNums(data.big.total, data.total),
                    drilldown: 'big',
                    totalD:data.big.total,
                    min:'250+',
                    max:''
                }]
            }],
            drilldown: {
                series: [{
                    name: 'Microenterprise',
                    id: 'micro',
                    data: [
                        ['Active', divideNums(data.micro.Active, data.micro.total)],
                        ['Dissolved', divideNums(data.micro.Dissolved, data.micro.total)]
                    ]
                }, {
                    name: 'Small enterprise',
                    id: 'mini',
                    data: [
                        ['Active', divideNums(data.mini.Active, data.mini.total)],
                        ['Dissolved', divideNums(data.mini.Dissolved, data.mini.total)]
                    ]
                }, {
                    name: 'Medium Enterprise',
                    id: 'middle',
                    data: [
                        ['Active', divideNums(data.middle.Active, data.middle.total)],
                        ['Dissolved', divideNums(data.middle.Dissolved, data.middle.total)]
                    ]
                }, {
                    name: 'Large Enterprise',
                    id: 'big',
                    data: [
                        ['Active', divideNums(data.big.Active, data.big.total)],
                        ['Dissolved', divideNums(data.big.Dissolved, data.big.total)]
                    ]
                }]
            },
            exporting: {
                enabled: true,
                chartOptions: {
                    title: {
                        text: 'Businesses by Number of Employees'
                    }
                },
                filename: 'Businesses_by_number_of_employees',
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
