$(document).ready(function () {

    if (document.documentElement.lang == 'sq') {
        $('.selected-value').html("T\xeb gjitha");
        $('.selected-value-status').html("T\xeb gjitha");
        $('.selected-value-gender').html("T\xeb gjitha");
    }
    else {
        $('.selected-value').html("All");
        $('.selected-value-status').html("All");
        $('.selected-value-gender').html("All");
    }
    $('.selected-value-gender').attr("value", "any");
    $.ajax({
        url: "mapi",
        type: 'GET',
        success: function (data) {
            proccesAPI(data);
            $(".overllay").hide();
        },
        error: function (error) {
        }
    });
});

$.fn.dataTableExt.errMode = 'ignore';

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
function formatStatus(status) {
    if (status == "I shuar") {
        return "Shuar";
    } else {
        return status;
    }
}

function onGenderSelection(ownerGender) {
    $('.selected-value-gender').html(ownerGender);
    var gender = formatGender(ownerGender);
    var status = formatStatus($('.selected-value-status').html());
    $('.selected-value-gender').attr("value", gender);
    var activity = $('.selected-value').html();

    if (activity == "T\xeb gjitha" || activity == "All") {
        activity = "all";
    }

    $.ajax({
        data: {
            activity_name: activity,
            status: status,
            gender: gender
        },
        url: "mapi",
        type: 'POST',
        beforeSend: function () {
            $(".overllay").show();
        },
        success: function (data) {
            proccesAPI(data);
            $(".overllay, #businessbyMunicipality").hide();
        },
        error: function (error) {
        }
    });
}

function onStatusSelection(name) {
    if (name == "Shuar") {
        if (document.documentElement.lang == 'sq') {
            $('.selected-value-status').html("I shuar");
        }
        else {
            $('.selected-value-status').html("Dissolved");
        }
    } else if (name == "Aktiv") {
        if (document.documentElement.lang == 'sq') {
            $('.selected-value-status').html("Aktiv");
        }
        else {
            $('.selected-value-status').html("Active");
        }
    } else {
        if (document.documentElement.lang == 'sq') {
            $('.selected-value-status').html("T\xeb gjitha");
        }
        else {
            $('.selected-value-status').html("All");
        }
    }

    var actDrop = $('.selected-value').html();
    if (actDrop == "T\xeb gjitha" || actDrop == "All") {
        actDrop = "all";
    }
    var gender = formatGender($('.selected-value-gender').html());
    $.ajax({
        data: {
            activity_name: actDrop,
            status: name,
            gender: gender
        },
        url: "mapi",
        type: 'POST',
        beforeSend: function () {
            $(".overllay").show();
        },
        success: function (data) {
            proccesAPI(data);
            $(".overllay, #businessbyMunicipality").hide();
        },
        error: function (error) {
        }
    });
}

function onActivitySelection(name, code) {
    if (name == "all") {
        if (document.documentElement.lang == 'sq') {
            $('.selected-value').html("T\xeb gjitha");
        }
        else {
            $('.selected-value').html("All");
        }
    }
    else {
        $('.selected-value').html(name);
        $('.selected-value').attr('data-code', code);
    }

    if (document.documentElement.lang == 'sq') {
        $('.selected-value-status').html("T\xeb gjitha");
    }
    else {
        $('.selected-value-status').html("All");
    }

    var gender = formatGender($('.selected-value-gender').html());

    $.ajax({
        data: {
            activity_name: name,
            status: 'T\xeb gjitha',
            gender: gender
        },
        url: "mapi",
        type: 'POST',
        beforeSend: function () {
            $(".overllay").show();
        },
        success: function (data) {
            proccesAPI(data);
            $(".overllay, #businessbyMunicipality").hide();
        },
        error: function (error) {
        }
    });
}

var cities = [];
if (document.documentElement.lang == 'sq') {
    cities = [
        {//Prishtina
            "name": "Prishtin\xeb",
            "value": 0, "capital": 0,
            "hc-key": "kv-7310",
            "id": 0
        },
        {//Gjilani
            "name": "Gjilan",
            "value": 0, "capital": 0,
            "hc-key": "kv-842"
        },
        {//Prizereni
            "name": "Prizren",
            "value": 0, "capital": 0,
            "hc-key": "kv-843"
        },
        {
            "name": "Ferizaj",
            "value": 0, "capital": 0,
            "hc-key": "kv-7324"
        },
        {
            "name": "Lipjan",
            "value": 0, "capital": 0,
            "hc-key": "kv-7311"
        },
        {
            "name": "Podujev\xeb",
            "value": 0, "capital": 0,
            "hc-key": "kv-7309"
        },
        {
            "name": "Obiliq",
            "value": 0, "capital": 0,
            "hc-key": "kv-7308"
        },
        {
            "name": "Gllogoc",
            "value": 0, "capital": 0,
            "hc-key": "kv-7307"
        },
        {
            "name": "Malishev\xeb",
            "value": 0, "capital": 0,
            "hc-key": "kv-7317"
        },
        {
            "name": "Gjakov\xeb",
            "value": 0, "capital": 0,
            "hc-key": "kv-7321"
        },
        {
            "name": "Rahovec",
            "value": 0, "capital": 0,
            "hc-key": "kv-7322"
        },
        {
            "name": "Klin\xeb",
            "value": 0, "capital": 0,
            "hc-key": "kv-7319"
        },
        {
            "name": "Deçan",
            "value": 0, "capital": 0,
            "hc-key": "kv-7320"
        },
        {
            "name": "Istog",
            "value": 0, "capital": 0,
            "hc-key": "kv-7318"
        },
        {//Skenderaj
            "name": "Sk\xebnderaj",
            "value": 0, "capital": 0,
            "hc-key": "kv-7305"
        },
        {//Vushtrri
            "name": "Vushtrri",
            "value": 0, "capital": 0,
            "hc-key": "kv-7304"
        },
        {//Artan\xeb
            "name": "Novob\xebrd\xeb",
            "value": 0, "capital": 0,
            "hc-key": "kv-7313"
        },
        {//kamenice
            "name": "Kamenic\xeb",
            "value": 0, "capital": 0,
            "hc-key": "kv-7314"
        },
        {//Mitrovice
            "name": "Mitrovic\xeb",
            "value": 0, "capital": 0,
            "hc-key": "kv-7303"
        },
        {//Suharek
            "name": "Suharek\xeb",
            "value": 0, "capital": 0,
            "hc-key": "kv-7316"
        },
        { //shtime
            "name": "Shtime",
            "value": 0, "capital": 0,
            "hc-key": "kv-7323"
        },
        { //Vitia
            "name": "Viti",
            "value": 0,
            "hc-key": "kv-7312"
        },
        { // Shterpce
            "name": "Sht\xebrpc\xeb",
            "value": 0, "capital": 0,
            "hc-key": "kv-7325"
        },
        { // Kaqanik
            "name": "Kaçanik",
            "value": 0, "capital": 0,
            "hc-key": "kv-7326"
        },
        {
            "name": "Zveçan",
            "value": 0, "capital": 0,
            "hc-key": "kv-844"
        },
        {
            "name": "Leposaviq",
            "value": 0, "capital": 0,
            "hc-key": "kv-7302"
        },
        {
            "name": "Zubin Potok",
            "value": 0, "capital": 0,
            "hc-key": "kv-7306"
        },
        {
            "name": "Fush\xeb Kosov\xeb",
            "value": 0, "capital": 0,
            "hc-key": "kv-845"
        },
        {
            "name": "Dragash",
            "value": 0, "capital": 0,
            "hc-key": "kv-7315"
        },
        {
            "name": "Pej\xeb",
            "value": 0, "capital": 0,
            "hc-key": "kv-841"
        }
    ];
} else {
    cities = [
        {//Prishtina
            "name": "Pristina",
            "value": 0, "capital": 0,
            "hc-key": "kv-7310",
            "id": 0
        },
        {//Gjilani
            "name": "Gjilan",
            "value": 0, "capital": 0,
            "hc-key": "kv-842"
        },
        {//Prizereni
            "name": "Prizren",
            "value": 0, "capital": 0,
            "hc-key": "kv-843"
        },
        {
            "name": "Ferizaj",
            "value": 0, "capital": 0,
            "hc-key": "kv-7324"
        },
        {
            "name": "Lipjan",
            "value": 0, "capital": 0,
            "hc-key": "kv-7311"
        },
        {
            "name": "Podujevo",
            "value": 0, "capital": 0,
            "hc-key": "kv-7309"
        },
        {
            "name": "Obilic",
            "value": 0, "capital": 0,
            "hc-key": "kv-7308"
        },
        {
            "name": "Glogovac",
            "value": 0, "capital": 0,
            "hc-key": "kv-7307"
        },
        {
            "name": "Malisheve",
            "value": 0, "capital": 0,
            "hc-key": "kv-7317"
        },
        {
            "name": "Gjakova",
            "value": 0, "capital": 0,
            "hc-key": "kv-7321"
        },
        {
            "name": "Rahovec",
            "value": 0, "capital": 0,
            "hc-key": "kv-7322"
        },
        {
            "name": "Klina",
            "value": 0, "capital": 0,
            "hc-key": "kv-7319"
        },
        {
            "name": "Decan",
            "value": 0, "capital": 0,
            "hc-key": "kv-7320"
        },
        {
            "name": "Istog",
            "value": 0, "capital": 0,
            "hc-key": "kv-7318"
        },
        {//Skenderaj
            "name": "Skenderaj",
            "value": 0, "capital": 0,
            "hc-key": "kv-7305"
        },
        {//Vushtrri
            "name": "Vushtrri",
            "value": 0, "capital": 0,
            "hc-key": "kv-7304"
        },
        {//Artan\xeb
            "name": "Novo Brdo",
            "value": 0, "capital": 0,
            "hc-key": "kv-7313"
        },
        {//kamenice
            "name": "Kamenica",
            "value": 0, "capital": 0,
            "hc-key": "kv-7314"
        },
        {//Mitrovice
            "name": "Mitrovica",
            "value": 0, "capital": 0,
            "hc-key": "kv-7303"
        },
        {//Suharek
            "name": "Suhareka",
            "value": 0, "capital": 0,
            "hc-key": "kv-7316"
        },
        { //shtime
            "name": "Shtime",
            "value": 0, "capital": 0,
            "hc-key": "kv-7323"
        },
        { //Vitia
            "name": "Viti",
            "value": 0,
            "hc-key": "kv-7312"
        },
        { // Shterpce
            "name": "Shtrpce",
            "value": 0, "capital": 0,
            "hc-key": "kv-7325"
        },
        { // Kaqanik
            "name": "Kacanik",
            "value": 0, "capital": 0,
            "hc-key": "kv-7326"
        },
        {
            "name": "Zvecan",
            "value": 0, "capital": 0,
            "hc-key": "kv-844"
        },
        {
            "name": "Leposaviq",
            "value": 0, "capital": 0,
            "hc-key": "kv-7302"
        },
        {
            "name": "Zubin Potok",
            "value": 0, "capital": 0,
            "hc-key": "kv-7306"
        },
        {
            "name": "Fushe Kosove",
            "value": 0, "capital": 0,
            "hc-key": "kv-845"
        },
        {
            "name": "Dragash",
            "value": 0, "capital": 0,
            "hc-key": "kv-7315"
        },
        {
            "name": "Peja",
            "value": 0, "capital": 0,
            "hc-key": "kv-841"
        }
    ];
}

function proccesAPI(data) {
    var dupli = []
    $.each(data[0], function (key, val) {

        $.each(cities, function (key2, val2) {
            if (key == val2.name) {
                val2.value = val.total;
                val2.capital = val.capital;
            }
        });
        if (document.documentElement.lang == 'sq') {
            if (key == "Hani i Elezit") dupli.push({ "muni": key, "val": val.total, "capital": val.capital });
            else if (key == "Mamush\xeb") dupli.push({ "muni": key, "val": val.total, "capital": val.capital });
            else if (key == "Ranillug\xeb") dupli.push({ "muni": key, "val": val.total, "capital": val.capital });
            else if (key == "Partesh") dupli.push({ "muni": key, "val": val.total, "capital": val.capital });
            else if (key == "Kllokot") dupli.push({ "muni": key, "val": val.total, "capital": val.capital });
            else if (key == "Junik") dupli.push({ "muni": key, "val": val.total, "capital": val.capital });
            else if (key == "Graçanic\xeb") dupli.push({ "muni": key, "val": val.total, "capital": val.capital });
        } else {
            if (key == "Hani i Elezit") dupli.push({ "muni": key, "val": val.total, "capital": val.capital });
            else if (key == "Mamush") dupli.push({ "muni": key, "val": val.total, "capital": val.capital });
            else if (key == "Ranilug") dupli.push({ "muni": key, "val": val.total, "capital": val.capital });
            else if (key == "Partesh") dupli.push({ "muni": key, "val": val.total, "capital": val.capital });
            else if (key == "Klokot") dupli.push({ "muni": key, "val": val.total, "capital": val.capital });
            else if (key == "Junik") dupli.push({ "muni": key, "val": val.total, "capital": val.capital });
            else if (key == "Gracanice") dupli.push({ "muni": key, "val": val.total, "capital": val.capital });
        }
    });

    $.each(cities, function (key2, val2) {
        if (document.documentElement.lang == 'sq') {
            $.each(dupli, function (key, val) {
                if (val.muni == "Hani i Elezit" && val2.name == "Ferizaj") {
                    val2.value += val.val;
                    val2.capital += val.capital;
                }
                else if (val.muni == "Mamush\xeb" && val2.name == "Prizren") {
                    val2.value += val.val;
                    val2.capital += val.capital;
                }
                else if (val.muni == "Ranillug\xeb" && val2.name == "Gjilan") {
                    val2.value += val.val;
                    val2.capital += val.capital;
                }
                else if (val.muni == "Partesh" && val2.name == "Gjilan") {
                    val2.value += val.val;
                    val2.capital += val.capital;
                }
                else if (val.muni == "Kllokot" && val2.name == "Gjilan") {
                    val2.value += val.val;
                    val2.capital += val.capital;
                }
                else if (val.muni == "Junik" && val2.name == "Gjakov\xeb") {
                    val2.value += val.val;
                    val2.capital += val.capital;
                }
                else if (val.muni == "Graçanic\xeb" && val2.name == "Prishtin\xeb") {
                    val2.value += val.val;
                    val2.capital += val.capital;
                }
            });
        } else {
            $.each(dupli, function (key, val) {
                if (val.muni == "Hani i Elezit" && val2.name == "Ferizaj") {
                    val2.value += val.val;
                    val2.capital += val.capital;
                }
                else if (val.muni == "Mamush" && val2.name == "Prizren") {
                    val2.value += val.val;
                    val2.capital += val.capital;
                }
                else if (val.muni == "Ranilug" && val2.name == "Gjilan") {
                    val2.value += val.val;
                    val2.capital += val.capital;
                }
                else if (val.muni == "Partesh" && val2.name == "Gjilan") {
                    val2.value += val.val;
                    val2.capital += val.capital;
                }
                else if (val.muni == "Klokot" && val2.name == "Gjilan") {
                    val2.value += val.val;
                    val2.capital += val.capital;
                }
                else if (val.muni == "Junik" && val2.name == "Gjakova") {
                    val2.value += val.val;
                    val2.capital += val.capital;
                }
                else if (val.muni == "Gracanice" && val2.name == "Pristina") {
                    val2.value += val.val;
                    val2.capital += val.capital;
                }
            });
        }
    });

    var allCitiesAvgCapital = 0;
    //Average capital
    $.each(cities, function (key, val) {
        if (val.value != 0)
            val.capital = val.capital / val.value;
        allCitiesAvgCapital += val.capital;
    })
    mapActs(cities, data[1], allCitiesAvgCapital.toFixed(2))
}

function addLinksToOwnersAuthorized(data, lang) {
    var finalData = '';
    // Making array of many owners and checking settings for each its link
    if (data.indexOf(',') > -1) {
        var ownerArray = data.split(',');
        ownerArray.map((item, index) => {
            var trimmedItem = item.trim();
            if (index != ownerArray.length - 1) {
                finalData += '<a href="' + `/${lang}/kerko/owner/` + trimmedItem + '">' + trimmedItem + '</a>' + ', ';
            } else {
                finalData += '<a href="' + `/${lang}/kerko/owner/` + trimmedItem + '">' + trimmedItem + '</a>';
            }
        });
    } else {
        finalData = '<a href="' + `/${lang}/kerko/owner/` + data + '">' + data + '</a>';
    }
    return finalData;
}



function mapActs(data, total, allCitiesAvgCapital) {
    if (document.documentElement.lang == 'sq') {
        Highcharts.setOptions({
            lang: {
                printChart: 'Printoje vizualizimin',
                downloadPNG: 'Shkarko imazhin PNG',
                downloadJPEG: 'Shkarko imazhin JPEG',
                downloadPDF: 'Shkarko dokumentin PDF',
                downloadSVG: 'Shkarko imazhin SVG'
            },
            chart: {
                events: {
                    beforePrint: () => {
                        chart.setTitle({ text: 'Ndarja në bazë të aktiviteteve biznesore' });
                    },
                    afterPrint: () => {
                        chart.setTitle({ text: '' })
                    }
                }
            }
        });
        // Create the chart
        var chart = Highcharts.mapChart('mapContainer', {
            chart: {
                map: 'countries/kv/kv-all'
            },
            title: {
                text: ''
            },
            legend: {
                title: {
                    text: 'Numri i bizneseve',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                    }
                },
                align: 'right',
                verticalAlign: 'bottom',
                floating: true,
                layout: 'vertical',
                valueDecimals: 0,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)',
                symbolRadius: 0,
                symbolHeight: 14
            },
            mapNavigation: {
                enableMouseWheelZoom: false,
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },
            colorAxis: {
                // minColor: '#fff',
                // maxColor: '#274866',
                dataClasses: [{
                    to: 3
                }, {
                    from: 3,
                    to: 10
                }, {
                    from: 10,
                    to: 30
                }, {
                    from: 30,
                    to: 100
                }, {
                    from: 100,
                    to: 300
                }, {
                    from: 300,
                    to: 1000
                }, {
                    from: 1000
                }]
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    events: {
                        click: function (e) {
                            // Clearing data of datatable
                            $('#businessesTable').DataTable().clear();
                            // Showing datatable section if hidden
                            $('#businessbyMunicipality').show();

                            // Scrolling to table with animation
                            $('html, body').stop().animate({
                                scrollTop: ($('#businessbyMunicipality').offset().top - 150)
                            }, 600, 'easeInOutExpo');

                            // Properties and building the URL
                            let clickedMunicipality = e.point.options.name

                            // If activity is selected
                            if ($('.selected-value').html() != "Të gjitha") {
                                var selectedActivity = $('.selected-value').attr('data-code');
                            } else {
                                selectedActivity = '';
                            }

                            // If status is selected
                            if ($('.selected-value-status').html() != "Të gjitha") {
                                if ($('.selected-value-status').html() == "I shuar") {
                                    var selectedStatus = "Shuar";
                                } else {
                                    selectedStatus = $('.selected-value-status').html();
                                }
                            } else {
                                selectedStatus = '';
                            }

                            // If gender is selected
                            var selectedGender = $('.selected-value-gender').attr("value");

                            // Number of documents shown from total



                            // Showing the municipality in DOM
                            $('#searchedMuni').text(clickedMunicipality);
                            $('#businessesTable').DataTable({
                                destroy: true,
                                'pagingType': 'full_numbers_no_ellipses',
                                "sDom": '<"row view-filter"<"col-sm-12"<"pull-left"l><"pull-right"f><"clearfix">>>t<"row view-pager"<"col-sm-12"<"text-center"ip>>>',
                                "ordering": false,
                                "bLengthChange": false,
                                "bFilter": false,
                                "language": {
                                    "sEmptyTable": "Nuk ka asnjë të dhënë në tabele",
                                    "sInfo": "Të shfaqura <b class='shown-rows'>10</b> nga <b class='total'>_TOTAL_</b> dokumente",
                                    "sInfoEmpty": "Të shfaqura 0 nga 0 dokumente",
                                    "sInfoFiltered": "(të filtruara nga gjithësej _MAX_  reshtave)",
                                    "sInfoPostFix": "",
                                    "sInfoThousands": ",",
                                    "sLengthMenu": "Shiko _MENU_ reshta",
                                    "sLoadingRecords": "Duke punuar  <i class='fa fa-spinner fa-spin' style='font-size:24px'></i>",
                                    "sProcessing": "Duke procesuar...",
                                    "sSearch": "Kërkoni:",
                                    "sZeroRecords": "Asnjë e dhënë nuk u gjet",
                                    "oPaginate": {
                                        "sFirst": "E para",
                                        "sLast": "E Fundit",
                                        "sNext": "Përpara",
                                        "sPrevious": "Prapa"
                                    },
                                    "oAria": {
                                        "sSortAscending": ": aktivizo për të sortuar kolumnin me vlera në ngritje",
                                        "sSortDescending": ": aktivizo për të sortuar kolumnin me vlera në zbritje"
                                    }
                                },
                                'ajax': {
                                    url: `/sq/show-businesses?municipality=${clickedMunicipality}&activity=${selectedActivity}&status=${selectedStatus}&gender=${selectedGender}`,
                                    type: 'GET'
                                },
                                "columns": [
                                    {
                                        "data": "info",
                                        "render": function (data, type, row, meta) {
                                            if (type == 'display') {
                                                data = '<a target="_blank" href="' + data.link + '">' + data.name + '</a>';
                                            }
                                            return data;
                                        }
                                    },
                                    { "data": "status.sq" },
                                    { "data": "municipality.place" },
                                    {
                                        "data": "owners[, ].name",
                                        "render": function (data, type, row, meta) {
                                            if (type == 'display') {
                                                var finalData = addLinksToOwnersAuthorized(data, 'sq');
                                            }
                                            return finalData;
                                        }
                                    },
                                    {
                                        "data": "authorized[, ].name",
                                        "render": function (data, type, row, meta) {
                                            if (type == 'display') {
                                                var finalData = addLinksToOwnersAuthorized(data, 'sq');
                                            }
                                            return finalData;
                                        }
                                    }
                                ],
                                "drawCallback": function () {
                                    $('.dataTables_paginate > .pagination').addClass('pagination-sm');
                                    var dataTableButtonsRef = ['first', 'previous', 'next', 'last']
                                    dataTableButtonsRef.map(classRef => {
                                        $('.' + classRef).find('a').addClass('page-link');
                                    });
                                    $('#businessesTable').wrap('<div class="table-responsive"></div>');

                                    var table = $('#businessesTable').DataTable();
                                    let totalDocs = table.data().count();

                                    if (totalDocs < 10) {
                                        $('#businessesTable_info, .dataTables_paginate').show();
                                        $('.shown-rows').text(totalDocs);
                                    } else {
                                        $('#businessesTable_info, .dataTables_paginate').show();
                                    }

                                    if (!table.data().any()) {
                                        $('#businessesTable_info, .dataTables_paginate').hide();
                                    }

                                    $(".paginate_button a").unbind("click").on("click", () => {
                                        setTimeout(function () {
                                            var rowCount = $('#businessesTable tr').length - 1;
                                            if (rowCount < 10) {
                                                $('.shown-rows').text(rowCount);
                                            }
                                        }, 100);
                                    });

                                }
                            });
                        }
                    }
                }
            },
            series: [
                {
                    nullColor: '#f7f7f7'
                }, {
                    data: data,
                    name: 'Bizneset',
                    nullColor: '#f7f7f7',
                    states: {
                        hover: {
                            color: '#2bb9ae'
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        allowOverlap: true,
                        format: '{point.options.name}'
                    },
                    tooltip: {
                        pointFormat: '{point.options.name}: ' + '{point.options.value:,.0f}'
                    }
                }],
            tooltip: {
                formatter: function () {
                    return `${this.point.options.name}: 
                    ${Highcharts.numberFormat(this.point.options.value, 0)} 
                    (<b>${Highcharts.numberFormat(this.point.options.value / total['Total'] * 100, 2)} %</b>)
                    <br>Kapitali mesatar: (<b>${allCitiesAvgCapital == 0 ? '0.00' : (this.point.options.capital / allCitiesAvgCapital * 100).toFixed(2)} %</b>)`;
                }
            },
            exporting: {
                enabled: true,
                filename: 'Ndarja_ne_baze_te_aktiviteteve_biznesore',
                chartOptions: {
                    title: {
                        text: '<h2>Ndarja në bazë të aktiviteteve biznesore</h2>'
                    }
                },
                buttons: {
                    contextButton: {
                        enabled: false
                    },
                    exportButton: {
                        text: 'Shkarko',
                        menuItems: ['printChart', 'separator', 'downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG']
                    }
                }
            }
        });
    }
    else {
        Highcharts.setOptions({
            chart: {
                events: {
                    beforePrint: () => {
                        chart.setTitle({ text: 'Categorization based on business activities' });
                    },
                    afterPrint: () => {
                        chart.setTitle({ text: '' })
                    }
                }
            }
        });
        // Create the chart
        var chart = Highcharts.mapChart('mapContainer', {
            chart: {
                map: 'countries/kv/kv-all'
            },
            title: {
                text: ''
            },
            legend: {
                title: {
                    text: 'Number of businesses',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                    }
                },
                align: 'right',
                verticalAlign: 'bottom',
                floating: true,
                layout: 'vertical',
                valueDecimals: 0,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || 'rgba(255, 255, 255, 0.85)',
                symbolRadius: 0,
                symbolHeight: 14
            },
            mapNavigation: {
                enableMouseWheelZoom: false,
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },
            colorAxis: {
                // minColor: '#fff',
                // maxColor: '#274866',
                dataClasses: [{
                    to: 3
                }, {
                    from: 3,
                    to: 10
                }, {
                    from: 10,
                    to: 30
                }, {
                    from: 30,
                    to: 100
                }, {
                    from: 100,
                    to: 300
                }, {
                    from: 300,
                    to: 1000
                }, {
                    from: 1000
                }]
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    events: {
                        click: function (e) {
                            // Clearing data of datatable
                            $('#businessesTable').DataTable().clear();
                            // Showing datatable section if hidden
                            $('#businessbyMunicipality').show();

                            // Scrolling to table with animation
                            $('html, body').stop().animate({
                                scrollTop: ($('#businessbyMunicipality').offset().top - 150)
                            }, 600, 'easeInOutExpo');

                            // Properties and building the URL
                            let clickedMunicipality = e.point.options.name

                            // If activity is selected
                            if ($('.selected-value').html() != "All") {
                                var selectedActivity = $('.selected-value').attr('data-code');
                            } else {
                                selectedActivity = '';
                            }

                            // If status is selected
                            if ($('.selected-value-status').html() != "All") {
                                if ($('.selected-value-status').html() == "Dissolved") {
                                    var selectedStatus = "Dissolved";
                                } else {
                                    selectedStatus = "Active"
                                }
                            } else {
                                selectedStatus = '';
                            }

                            // Showing the municipality in DOM
                            $('#searchedMuni').text(clickedMunicipality);
                            $('#businessesTable').DataTable({
                                destroy: true,
                                'pagingType': 'full_numbers_no_ellipses',
                                "sDom": '<"row view-filter"<"col-sm-12"<"pull-left"l><"pull-right"f><"clearfix">>>t<"row view-pager"<"col-sm-12"<"text-center"ip>>>',
                                "ordering": false,
                                "bLengthChange": false,
                                "bFilter": false,
                                "language": {
                                    "sLoadingRecords": "Loading  <i class='fa fa-spinner fa-spin' style='font-size:24px'></i>",
                                    "sInfo": "Showing <b class='shown-rows'>10</b> of <b class='total'>_TOTAL_</b> documents"
                                },
                                'ajax': {
                                    url: `/en/show-businesses?municipality=${clickedMunicipality}&activity=${selectedActivity}&status=${selectedStatus}`,
                                    type: 'GET'
                                },
                                "columns": [
                                    {
                                        "data": "info",
                                        "render": function (data, type, row, meta) {
                                            if (type == 'display') {
                                                data = '<a target="_blank" href="' + data.link + '">' + data.name + '</a>';
                                            }
                                            return data;
                                        }
                                    },
                                    { "data": "status.en" },
                                    { "data": "municipality.place" },
                                    {
                                        "data": "owners[, ].name",
                                        "render": function (data, type, row, meta) {
                                            if (type == 'display') {
                                                var finalDate = addLinksToOwnersAuthorized(data, 'en');
                                            }
                                            return finalDate;
                                        }
                                    },
                                    {
                                        "data": "authorized[, ].name",
                                        "render": function (data, type, row, meta) {
                                            if (type == 'display') {
                                                var finalDate = addLinksToOwnersAuthorized(data, 'en');
                                            }
                                            return finalDate;
                                        }
                                    }
                                ],
                                "drawCallback": function () {
                                    $('.dataTables_paginate > .pagination').addClass('pagination-sm');
                                    var dataTableButtonsRef = ['first', 'previous', 'next', 'last']
                                    dataTableButtonsRef.map(classRef => {
                                        $('.' + classRef).find('a').addClass('page-link');
                                    });
                                    $('#businessesTable').wrap('<div class="table-responsive"></div>');

                                    var table = $('#businessesTable').DataTable();
                                    let totalDocs = table.data().count();
                                    if (totalDocs < 10) {
                                        $('#businessesTable_info, .dataTables_paginate').show();
                                        $('.shown-rows').text(totalDocs);
                                    } else {
                                        $('#businessesTable_info, .dataTables_paginate').show();
                                    }

                                    if (!table.data().any()) {
                                        $('#businessesTable_info, .dataTables_paginate').hide();
                                    }

                                    $(".paginate_button a").unbind("click").on("click", () => {
                                        setTimeout(function () {
                                            var rowCount = $('#businessesTable tr').length - 1;
                                            if (rowCount < 10) {
                                                $('.shown-rows').text(rowCount);
                                            }
                                        }, 100);
                                    });

                                }
                            });
                        }
                    }
                }
            },
            series: [{
                data: data,
                name: 'Businesses',
                states: {
                    hover: {
                        color: '#2bb9ae'
                    }
                },
                dataLabels: {
                    enabled: true,
                    allowOverlap: true,
                    format: '{point.options.name}'
                },
                tooltip: {
                    pointFormat: '{point.options.name}: ' + '{point.options.value:,.0f}' + ' (<b>23%</b>)'
                }
            }],
            tooltip: {
                formatter: function () {
                    return `${this.point.options.name}: 
                    ${Highcharts.numberFormat(this.point.options.value, 0)} 
                    (<b>${Highcharts.numberFormat(this.point.options.value / total['Total'] * 100, 2)} %</b>)
                    <br>Average capital: (<b>${allCitiesAvgCapital == 0 ? '0.00' : (this.point.options.capital / allCitiesAvgCapital * 100).toFixed(2)} %</b>)`;
                }
            },
            exporting: {
                enabled: true,
                filename: 'Categorization_based_on_business_activities',
                chartOptions: {
                    title: {
                        text: '<h2>Categorization based on business activities</h2>'
                    }
                },
                buttons: {
                    contextButton: {
                        enabled: false
                    },
                    exportButton: {
                        text: 'Download',
                        menuItems: ['printChart', 'separator', 'downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG']
                    }
                }
            }
        });
    }
}
