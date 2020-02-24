$(document).ready(function(){
  $.ajax({
    url: "businesses-type",
    type: 'GET',
    success: function(data){
      proccesAPI(data);
      $('#bizTypesLoader').hide();
    }
  });
  $('#getBizTypes').on('click', function() {
    $.ajax({
        data : {
            biz_city_id : $('#biz_city_id').val(),
            biz_status : $('#biz_status').val(),
            biz_gender: $('#biz_gender').val()
        },
        url: "businesses-type",
        type: 'POST',
        beforeSend: function() {
          $('#bizTypesLoader').show();
        },
        success: function(data){
            proccesAPI(data);
            $('#bizTypesLoader').hide();
        },
        error: function(error) {
        }

    });
  });

    function proccesAPI(data) {
      resultData = [];
      for(var i=0; i<data.doc.result.length;i++){
          resultData.push({"name":data.doc.result[i]['_id'],"y":data.doc.result[i]['total'] / data.total * 100, "tot":data.doc.result[i]['total']});
      }
      business_type(resultData, data.total);
    }

    function business_type(data, total) {
        if (document.documentElement.lang == 'sq') {

            Highcharts.setOptions({
                chart: {
                    events: {
                        beforePrint: () => {
                            chart.setTitle({ text: 'Llojet e Bizneseve'});
                        },
                        afterPrint: () => {
                            chart.setTitle({ text: ''})
                        }
                    }
                }
            });
            var chart = Highcharts.chart('container', {
                chart: {
                    type: 'pie'
                },
                legend: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name.sq}</b>: {point.percentage:.2f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                tooltip: {
                    formatter: function () {
                        return ''+this.point.name[document.documentElement.lang]+': <b>' + Highcharts.numberFormat(this.point.y, 2, '.')+ '%<b><br>'+
                        ''+'<b>('+Highcharts.numberFormat(this.point.tot, 0)+')</b><br/>';

                    }
                },
                series: [{
                    name: 'Biznese',
                    colorByPoint: true,
                    data: data,
                    colors: [{
                        radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
                        stops: [
                            [0, '#9578AD'],
                            [1, '#684A7F']
                        ]
                    },{
                        radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
                        stops: [
                            [0, '#85BBB9'],
                            [1, '#218380']
                        ]
                    },{
                        radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
                        stops: [
                            [0, '#EFBEA0'],
                            [1, '#DD7230']
                        ]
                    },{
                        radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
                        stops: [
                            [0, '#6D1B5D'],
                            [1, '#A26D97']
                        ]
                    },{
                        radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
                        stops: [
                            [0, '#69A2B0'],
                            [1, '#BAD4DB']
                        ]
                    },{
                        radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
                        stops: [
                            [0, '#C7D7C1'],
                            [1, '#659157']
                            ]
                        }
                    ]
                }],
                exporting: {
                    enabled: true,
                    chartOptions: {
                        title: {
                            text: '<h2>Llojet e bizneseve</h2>'
                        }
                    },
                    filename: 'Perqindja_e_bizneseve_ne_baze_te_llojit',
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
            Highcharts.setOptions({
                chart: {
                    events: {
                        beforePrint: () => {
                            chart.setTitle({ text: 'Business Type'});
                        },
                        afterPrint: () => {
                            chart.setTitle({ text: ''})
                        }
                    }
                }
            });
            var chart = Highcharts.chart('container', {
                chart: {
                    type: 'pie'
                },
                title: {
                    text: ''
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name.en}</b>: {point.percentage:.2f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                tooltip: {
                    formatter: function () {
                        return ''+this.point.name[document.documentElement.lang]+': <b>' +Highcharts.numberFormat(this.point.y, 2, '.')+ '%<b><br>'+
                        ''+'<b>('+ Highcharts.numberFormat(this.point.tot, 0)+')</b><br/>';

                    }
                },
                series: [{
                    name: 'Biznese',
                    colorByPoint: true,
                    data: data,
                    colors: [{
                        radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
                        stops: [
                            [0, '#9578AD'],
                            [1, '#684A7F']
                        ]
                    },{
                        radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
                        stops: [
                            [0, '#85BBB9'],
                            [1, '#218380']
                        ]
                    },{
                        radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
                        stops: [
                            [0, '#EFBEA0'],
                            [1, '#DD7230']
                        ]
                    },{
                        radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
                        stops: [
                            [0, '#6D1B5D'],
                            [1, '#A26D97']
                        ]
                    },{
                        radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
                        stops: [
                            [0, '#69A2B0'],
                            [1, '#BAD4DB']
                        ]
                    },{
                        radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
                        stops: [
                            [0, '#C7D7C1'],
                            [1, '#659157']
                        ]
                    }
                ]
                }],
                exporting: {
                    enabled: true,
                    chartOptions: {
                        title: {
                            text: '<h2>Business Type</h2>'
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
                    filename: 'Percente_of_businesses_by_type'
                }
            });
        }
    }
    $.ajax({
        url: "active-inactive",
        type: 'GET',
        success: function(data){
            active_inactive_chart(data);
            $('#ActInactLoader').hide();
        }
    })
    function active_inactive_chart(data){
      $('#totalBiznese').html(Highcharts.numberFormat(data.total, 0));
      if (document.documentElement.lang == 'sq') {
            Highcharts.setOptions({
                chart: {
                    events: {
                        beforePrint: () => {
                            chart.setTitle({ text: 'Bizneset e Shuara dhe Aktive'});
                        },
                        afterPrint: () => {
                            chart.setTitle({ text: ''})
                        }
                    }
                }
            });

          var chart = Highcharts.chart('container3', {
              chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false,
                  type: 'pie'
              },
              title: {
                  text: ''
              },
              tooltip: {
                  headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                  pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%'
              },
              plotOptions: {
                  pie: {
                      allowPointSelect: true,
                      cursor: 'pointer',
                      dataLabels: {
                          enabled: false
                      },
                      showInLegend: true
                  }
              },
              series: [{
                  name: 'Numri i kompanive',
                  colorByPoint: true,
                  colors:[{
                      radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
                      stops: [
                          [0, '#99D5D2'],
                          [1, '#20A39E']
                          ]
                      },{
                          radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
                          stops: [
                              [0, '#9B8B98'],
                              [1, '#23001E']
                          ]
                      }
                  ],
                  data: [{
                      name: 'Aktive ('+Highcharts.numberFormat(data.docs.result[0]['total'], 0)+')',
                      y: (data.docs.result[0]['total'] / data.total) * 100
                    }, {
                      name: 'Shuar('+Highcharts.numberFormat(data.docs.result[1]['total'], 0)+')',
                      y: (data.docs.result[1]['total'] / data.total) * 100
                  }]
              }],
              exporting: {
                enabled: true,
                chartOptions: {
                    title: {
                        text: '<h2>Bizneset e Shuara dhe Aktive</h2>'
                    }
                },
                filename: 'Bizneset_e_shuara_dhe_aktive',
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
      }else {
        Highcharts.setOptions({
            chart: {
                events: {
                    beforePrint: () => {
                        chart.setTitle({ text: 'Dissolved and Active Businesses'});
                    },
                    afterPrint: () => {
                        chart.setTitle({ text: ''})
                    }
                }
            }
        });
          var chart = Highcharts.chart('container3', {
              chart: {
                  plotBackgroundColor: null,
                  plotBorderWidth: null,
                  plotShadow: false,
                  type: 'pie'
              },
              title: {
                  text: ''
              },
              tooltip: {
                  headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                  pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%'
              },
              plotOptions: {
                  pie: {
                      allowPointSelect: true,
                      cursor: 'pointer',
                      dataLabels: {
                          enabled: false
                      },
                      showInLegend: true
                  }
              },
              series: [{
                  name: 'Number of businesses',
                  colorByPoint: true,
                  colors:[{
                      radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
                      stops: [
                          [0, '#99D5D2'],
                          [1, '#20A39E']
                          ]
                      },{
                          radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
                          stops: [
                              [0, '#9B8B98'],
                              [1, '#23001E']
                          ]
                      }
                  ],
                  data: [{
                      name: 'Active ('+Highcharts.numberFormat(data.docs.result[0]['total'], 0)+')',
                      y: (data.docs.result[0]['total'] / data.total) * 100
                    }, {
                      name: 'Dissolved('+Highcharts.numberFormat(data.docs.result[1]['total'], 0)+')',
                      y: (data.docs.result[1]['total'] / data.total) * 100
                  }]
              }],
              exporting: {
                enabled: true,
                chartOptions: {
                    title: {
                        text: '<h2>Dissolved and Active Businesses</h2>'
                    }
                },
                filename: 'Dissolved_and_active_businesses',
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
})
