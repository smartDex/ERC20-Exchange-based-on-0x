var website = 'http://localhost:8080/www/crypto-exchange/index.html';
//var website = 'http://53274912.swh.strato-hosting.eu/nexdex/index.html';
var url = window.location.href;
var hash = url.substring(url.indexOf("#") + 1);

$(document).ready(function() {

    if (hash.length < 10) {
        loadPage(hash);
    } else {
        loadPage('home');
    }

});

function loadPage(page) {
    if (page) {
        href = '#' + page;
        $('.content-element').css('display', 'none');
        $(href).css('display', 'block');
        $('.menu-container').addClass('hidden');
        menu_active = 0;

        if (href == '#exchange') {
            // drawChartNow();
        }
    }
}

$('a').click(function(e) {

    if (!$(this).attr('data-href')) {
        e.preventDefault();
    } else {
        loadPage($(this).attr('data-href'));
    }

});

$('.password-toggle').click(function() {

    if ($(this).parent().next().attr('type') == 'password') {
        $(this).parent().next().attr('type', 'text');
        $(this).children().html('&#xe106;');
    } else {
        $(this).parent().next().attr('type', 'password');
        $(this).children().html('&#xe105;');
    }

});

$('.private-key').children('a').click(function() {
    if ($(this).next().attr('data-visibility') == '0') {
        $(this).next().attr('data-visibility', '1');
        $(this).next().removeClass('hidden');
        $(this).html('Hide Private Key&nbsp;&nbsp;<span class="glyphicon">&#xe106;</span>');
    } else {
        $(this).next().attr('data-visibility', '0');
        $(this).next().addClass('hidden');
        $(this).html('Show Private Key&nbsp;&nbsp;<span class="glyphicon">&#xe105;</span>');
    }

});

var menu_active = 0;

$('.menu-icon').click(function() {

    if (menu_active == 0) {
        $('.menu-container').removeClass('hidden');
        menu_active = 1;
    } else {
        $('.menu-container').addClass('hidden');
        menu_active = 0;
    }

});

$('.toggle-heading').click(function() {

    if ($(this).next().attr('data-visibility') == '0') {
        $(this).next().attr('data-visibility', '1');
        $(this).next().removeClass('hidden');
        $(this).children('.arrow-close').removeClass('hidden');
        $(this).children('.arrow-open').addClass('hidden');
    } else {
        $(this).next().attr('data-visibility', '0');
        $(this).next().addClass('hidden');
        $(this).children('.arrow-close').addClass('hidden');
        $(this).children('.arrow-open').removeClass('hidden');
    }

});

// function drawChartNow() {

// 	google.charts.load('current', {'packages':['corechart']});
//       google.charts.setOnLoadCallback(drawChart);

//       function drawChart() {
//         var data = google.visualization.arrayToDataTable([
//           ['Month', 'Coin (in USD)'],
//           ['January 2018',  0.01],
//           ['February 2018',  0.09],
//           ['March 2018',  0.35],
//           ['April 2018',  0.89],
//           ['May 2018',  1.74],
//           ['June 2018',  2.42],
//           ['July 2018',  4.01]
//         ]);

//         var options = {
//           title: 'Coin Performance in USD ($) Year to Date',
//           legend: { position: 'top' }
//         };

//         var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

//         chart.draw(data, options);
//       }


// }