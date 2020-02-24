function selectDist() {
    $('.test').html('')
    $.ajax({
        data: {
            city_id: $('#municipality').val(),
            status: $('#kind').val(),
            owner_gender: $('#oGender').val()
        },
        type: 'POST',
        url: 'vizualizimet',
        success: function (response) {
            if (document.documentElement.lang == 'sq') {
                var data = '<table id="topTable" class="table table-entities table-bordered table-striped table-hover">' +
                    '<thead>' +
                    '<th>#</th>' +
                    '<th>Emri i Biznesit</th>' +
                    '<th>Komuna</th>' +
                    '<th>Statusi i Biznesit</th>' +
                    '<th style="min-width: 168px;">Kapitali</th>' +
                    '</thead>' +
                    '<tbody>';
                var i = 1;
                $.each(response.result, function (key, val) {
                    var number = numeral(val.capital);
                    number.format();
                    numeral.defaultFormat('0,0.00');
                    var num = number.format();
                    data += '<tr>' +
                        '<td>' + i + '</td>' +
                        '<td id="topname"><a href=' + val.arbkUrl + '>' + val.name + '</a>' +
                        '</td>' +
                        '<td class="ksbk">' + val.municipality.municipality.sq +
                        '</td>' +
                        '<td class="ksbk">' + val.status.sq +
                        '</td>' +
                        '<td class="ksbk">' + num + '\u20ac' +
                        '</td>' +
                        '</tr>';
                    i++
                });
                data += '</tbody>' + '</table>';
            }
            else {
                var data = '<table id="topTable" class="table table-entities table-bordered table-striped table-hover">' +
                    '<thead>' +
                    '<th>#</th>' +
                    '<th>Name of Business</th>' +
                    '<th>Municipality</th>' +
                    '<th>Business Status</th>' +
                    '<th style="min-width: 168px;">Capital</th>' +
                    '</thead>' +
                    '<tbody>';
                var i = 1;
                $.each(response.result, function (key, val) {
                    var number = numeral(val.capital);
                    number.format();
                    numeral.defaultFormat('0,0.00');
                    var num = number.format();
                    data += '<tr>' +
                        '<td>' + i + '</td>' +
                        '<td id="topname"><a href=' + val.arbkUrl + '>' + val.name + '</a>' +
                        '</td>' +
                        '<td class="ksbk">' + val.municipality.municipality.en +
                        '</td>' +
                        '<td class="ksbk">' + val.status.en +
                        '</td>' +
                        '<td class="ksbk">' + num + '\u20ac' +
                        '</td>' +
                        '</tr>';
                    i++
                });
                data += '</tbody>' + '</table>';
            }
            $('#topTable').html(data);
        },
        error: function (error) {
        }
    })
}

selectDist();
