$(document).ready(function (){
    $('.topAct').html("");
    var year = $('#lastyear').val();
    $('#lastyear').css('font-weight','bold');
    var maxCount = 10;
    var data = {};

    getAPI(year);
    function getAPI(theYear) {
            $.ajax({
                data: {
                    year: theYear
                },
                type : 'POST',
                url : 'top-recent-activities',
                beforeSend: function() {
                    $('#topRecentActivitiesLoader').show();
                },
                success: function (dataAPI) {
                    data = dataAPI;
                    buildDropDown(dataAPI.activities.length);
                    proccesAPI(data, 0, maxCount);
                    $('#topRecentActivitiesLoader').hide();
            }
            });
        }
        $('#lastyear, #last5years, #last10years').on('click', function() {
            $('#lastyear, #last5years, #last10years').css('font-weight','normal');
            $(this).css('font-weight','bold');
            year = $(this).val();
            getAPI($(this).val());
            $(this).css('font-weight','bold');

        });
        function buildDropDown(actLength, data) {
            var list = actLength / maxCount;
            var plot = Math.floor(list);
            var pak = actLength % maxCount;
            min = 0;
            max = 0;
            for (var i = 0; i < plot; i++) {
                min = i * maxCount;
                max = min + maxCount;
                $('.topAct').append('<option value='+min+' id='+max+'>'+min+'-'+max+'</option>');
            }
            if (pak != 0) {
                $('.topAct').append('<option value='+max+' id='+((max+pak))+'>'+max+'-'+(max+pak)+'</option>');
            }
        }
        function proccesAPI(data, min, max) {
            var start = min;
            var end = max;
            emri = [];
            vals = [];
            for(var i=start; i<end;i++){
                emri.push(data.activities[i].details.activity[document.documentElement.lang]);
                vals.push(data.activities[i].total_businesses);
            }
            top_activities(emri, vals);
        }

        function formatLabelText(text) {
            return `<div style="font-size: 6px; text-overflow: none">${text}</div>`; 
        }

        function top_activities(emri, data){
            if (document.documentElement.lang == 'sq') {
                var chartExportingTitle = '';
                if(year == 1) {
                    chartExportingTitle = 'Top Aktivitetet ne vitin e fundit';
                }else if (year == 5) {
                    chartExportingTitle = 'Top Aktivitetet ne 5 vitet e fundit';
                }else {
                    chartExportingTitle = 'Top Aktivitetet ne 10 vitet e fundit';
                }
                Highcharts.setOptions({
                    chart: {
                        events: {
                            beforePrint: () => {
                                if(year == 1) {
                                    chart.setTitle({ text: 'Top Aktivitetet ne vitin e fundit'});
                                } else if (year == 5) {
                                    chart.setTitle({ text: 'Top Aktivitetet ne 5 vitet e fundit'});
                                } else {
                                    chart.setTitle({ text: 'Top Aktivitetet ne 10 vitet e fundit'});
                                }
                            },
                            afterPrint: () => {
                                chart.setTitle({ text: ''})
                            }
                        }
                    }
                });

                var chart = Highcharts.chart('container10', {
                    title: {
                        text: ''
                    },
                    yAxis: {
                        title: {
                            text: 'Numri total i bizneseve'
                        },
                        labels: {
                            format: '{value:,.0f}'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:11px">{series.x}</span><br>',
                        pointFormat: '<span style="color:{point.color}">Total{point.name}</span>: <b>{point.y}</b> biznese<br/>'
                    },

                    xAxis: {
                        categories: emri,
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
                            },
                            {
                                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                stops: [
                                    [0, '#71B1AF'],
                                    [1, '#8DDDDB']
                                ]
                            },
                            {
                                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                stops: [
                                    [0, '#C38537'],
                                    [1, '#EFAA54']
                                ]
                            },
                            {
                                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                stops: [
                                    [0, '#BBFCA5'],
                                    [1, '#D2FDC3']
                                ]
                            },
                            {
                                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                stops: [
                                    [0, '#4AAD52'],
                                    [1, '#7BC381']
                                ]
                            },
                            {
                                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                stops: [
                                    [0, '#5C80BC'],
                                    [1, '#88A2CE']
                                ]
                            },
                            {
                                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                stops: [
                                    [0, '#3D3B30'],
                                    [1, '#95948E']
                                ]
                            },
                            {
                                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                stops: [
                                    [0, '#9E2B25'],
                                    [1, '#B86460']
                                ]
                            },
                            {
                                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                stops: [
                                    [0, '#FFE066'],
                                    [1, '#FFEB9D']
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
                var chartExportingTitle = '';
                if(year == 1) {
                    chartExportingTitle = 'Top Activities in last year';
                }else if (year == 5) {
                    chartExportingTitle = 'Top Activities in last 5 years';
                }else {
                    chartExportingTitle = 'Top Activities in last 10 years';
                }
                Highcharts.setOptions({
                    chart: {
                        events: {
                            beforePrint: () => {
                                if(year == 1) {
                                    chart.setTitle({ text: 'Top Activities in last year'});
                                } else if (year == 5) {
                                    chart.setTitle({ text: 'Top Activities in last 5 years'});
                                } else {
                                    chart.setTitle({ text: 'Top Activities in last 10 years'});
                                }
                            },
                            afterPrint: () => {
                                chart.setTitle({ text: ''})
                            }
                        }
                    }
                });

                var chart = Highcharts.chart('container10', {

                    title: {
                        text: ''
                    },
                    legend: {
                        enabled: false
                    },
                    yAxis: {
                        title: {
                            text: 'Total number of businesses'
                        },
                        labels: {
                            format: '{value:,.0f}'
                        }
                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:11px">{series.x}</span><br>',
                        pointFormat: '<span style="color:{point.color}">Total{point.name}</span>: <b>{point.y}</b> businesses<br/>'
                    },

                    xAxis: {
                        categories: emri,
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
                            },
                            {
                                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                stops: [
                                    [0, '#71B1AF'],
                                    [1, '#8DDDDB']
                                ]
                            },
                            {
                                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                stops: [
                                    [0, '#C38537'],
                                    [1, '#EFAA54']
                                ]
                            },
                            {
                                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                stops: [
                                    [0, '#BBFCA5'],
                                    [1, '#D2FDC3']
                                ]
                            },
                            {
                                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                stops: [
                                    [0, '#4AAD52'],
                                    [1, '#7BC381']
                                ]
                            },
                            {
                                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                stops: [
                                    [0, '#5C80BC'],
                                    [1, '#88A2CE']
                                ]
                            },
                            {
                                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                stops: [
                                    [0, '#3D3B30'],
                                    [1, '#95948E']
                                ]
                            },
                            {
                                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                stops: [
                                    [0, '#9E2B25'],
                                    [1, '#B86460']
                                ]
                            },
                            {
                                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                                stops: [
                                    [0, '#FFE066'],
                                    [1, '#FFEB9D']
                                ]
                            }
                        ]
                    }],
                    exporting: {
                        enabled: true,
                        filename: 'Top_activities_in_recent_years',
                        allowHTML: true,
                    chartOptions:{
                        yAxis: [{
                            title: {
                                text: 'Total number of businesses'
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
})
