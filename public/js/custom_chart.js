
//get chart data
function getChartData(key_pair) {
    var url = 'https://api.cobinhood.com/v1/market/trades/' + key_pair;
    var arrBids = [];
    var arrAsks = [];
    var timestampArr = [];
    $.ajax({
        url: proxy + url,
        type: 'GET',
        success: function(res) {
            var r = res.result;
            for(var key in r) {
                var v = r.trades;
                if(v.length != 0) {
                    for(var i = 0; i < 21; i++) {
                        if(v[i].maker_side == 'bid') {
                            timestampArr.push(v[i].timestamp);
                            arrBids.push(parseFloat((v[i].price * v[i].size).toFixed(2)));
                            arrAsks.push(0);
                        } else if(v[i].maker_side == 'ask') {
                            timestampArr.push(v[i].timestamp);
                            arrAsks.push(parseFloat((v[i].price * v[i].size).toFixed(2)));
                            arrBids.push(0);
                        }
    
                    }
                }
            }
            timestampArr.sort();
            for(var j = 0; j < timestampArr.length; j++) {
                if(j%4 != 0) {
                    timestampArr[j] = ' ';
                }
            }
            //call draw chart function
            drawChart(arrBids, arrAsks, timestampArr);
        },
        error: function(e) {
            console.log(e);
        }
    });
}

//drawing chart with response data
function drawChart(bid, ask, times) {

    Highcharts.chart('chart-container', {
        chart: {
            type: 'areaspline'
        },
        title: {
            text: 'Recent Transaction'
        },
        xAxis: {
            allowDecimals: false,
            labels: {
                formatter: function () {
                    if(this.value != ' ') {
                        var ts = new Date(this.value);
                        // return ts.toLocaleDateString() + ' ' + ts.toLocaleTimeString();
                        return ts.toLocaleTimeString();
                    }
                }
            },
            categories: times
        },
        yAxis: {
            title: {
                text: 'Price(ETH)'
            },
            labels: {
                formatter: function () {
                    return this.value;
                }
            },
            gridLineWidth: 1
        },
        tooltip: {
            pointFormat: '{series.name} produced <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
        },
        plotOptions: {
            area: {
                // pointStart: times[0],
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [{
            name: 'Bid',
            data: bid
        }, {
            name: 'Ask',
            data: ask
        }]
    });
    $(".charts").LoadingOverlay("hide", true);
}