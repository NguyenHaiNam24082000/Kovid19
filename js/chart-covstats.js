!(function (NioApp, $) {
    "use strict";

    NioApp.addComma = function (num) { return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') };

    // DataTable Init
    function covid_datatable () {
        var attr = {
                responsive: false,
                dom:'<"datatable-alt-wrap"t>',
                paging: false,
                autoWidth: false,
                order: [[1, 'desc']]
            };

        var dtable = $('.cov-datatable').DataTable(attr);

        function covid_order () {
            $('.cov-sortable').on('click', function(){
                var $this = $(this), idx = $this.index();
                
                $this.parent().find('.cov-sortable').not($this).removeClass('sort-down').removeClass('sort-up');
                if($this.hasClass('sort-down')){
                    dtable.order([idx, 'asc']).draw();
                    $this.addClass('sort-up').removeClass('sort-down');
                } else {
                    dtable.order([idx, 'desc']).draw();
                    $this.addClass('sort-down').removeClass('sort-up');
                }
                return false;
            });
        }
        covid_order ();

        var dpercent = $('[data-percent]');
        if (dpercent.length > 0) {
            dpercent.each(function() {
                var percent = $(this).data('percent');
                $(this).append(' <small>'+percent+'%</small>');
            });
        }
    }
    covid_datatable();


    function jqvmap_init () {
        var elm = '.vector-map';
        
        if($(elm).exists() && typeof($.fn.vectorMap) === 'function') {   
            $(elm).each(function(){
                var $self = $(this), _self_id = $self.attr('id'), map_data = eval(_self_id);
                $self.vectorMap({
                    map: map_data.map,
                    backgroundColor: 'transparent',
                    borderColor: '#dee6ed',
                    borderOpacity: 1,
                    borderWidth: 1,
                    color: '#e1eeff',
                    enableZoom: true,
                    hoverColor: '#0062e7',
                    hoverOpacity: null,
                    normalizeFunction: 'polynomial',
                    scaleColors: ['#eef3f9', '#0060e3'],
                    selectedColor: '#005ad5',
                    showTooltip: true,
                    values: map_data.data,
                    onLabelShow: function(event, label, code)
                    {
                        var mapData = JQVMap.maps, what = Object.keys(mapData)[0], name = mapData[what].paths[code]['name'];
                        label.html(name + ' - ' + map_data.data[code]);
                        //(NioApp.addComma(map_data.data[code]) || 0)
                    }
                });
            });
        }
    };

    NioApp.coms.docReady.push(jqvmap_init);

    NioApp.lineCovidCase = function (selector, set_data) {
        var $selector = (selector) ? $(selector) : $('.covid-case-line-chart');
        $selector.each(function(){
            var $self = $(this), _self_id = $self.attr('id'), _get_data = (typeof set_data === 'undefined') ? eval(_self_id) : set_data;
            var selectCanvas = document.getElementById(_self_id).getContext("2d");
    
            var chart_data = [];
            for (var i = 0; i < _get_data.datasets.length; i++) {
                chart_data.push({
                    label: _get_data.datasets[i].label,
                    tension:_get_data.lineTension,
                    backgroundColor: _get_data.datasets[i].background,
                    borderWidth:2,
                    borderColor: _get_data.datasets[i].color,
                    pointBorderColor: "transparent",
                    pointBackgroundColor: "transparent",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: _get_data.datasets[i].color,
                    pointBorderWidth: 2,
                    pointHoverRadius: 3,
                    pointHoverBorderWidth: 2,
                    pointRadius: 3,
                    pointHitRadius: 3,
                    data: _get_data.datasets[i].data,
                });
            } 
            var chart = new Chart(selectCanvas, {
                type: 'line',
                data: {
                    labels: _get_data.labels,
                    datasets: chart_data,
                },
                options: {
                    legend: {
                        display: (_get_data.legend) ? _get_data.legend : false,
                        labels: {
                            boxWidth:30,
                            padding:20,
                            fontColor: '#6783b8',
                        }
                    },
                    maintainAspectRatio: false,
                    tooltips: {
                        enabled: true,
                        mode: 'index',
                        position: 'nearest',
                        callbacks: {
                            title: function(tooltipItem, data) {
                                return  data['labels'][tooltipItem[0]['index']];
                            },
                            label: function(tooltipItem, data) {
                                return data.datasets[tooltipItem.datasetIndex]['label'] + ' - ' + NioApp.addComma(data.datasets[tooltipItem.datasetIndex]['data'][tooltipItem['index']]);
                            },
                            footer: function(tooltipItems, data) {
                                var total = 0;
                                tooltipItems.forEach(function(tooltipItem) {
                                    total += data.datasets[tooltipItem.datasetIndex]['data'][tooltipItem['index']];
                                });
                                return ''; // 'Total - ' + total;
                            },
                        },
                        backgroundColor: '#fff',
                        borderColor:'#eff6ff',
                        borderWidth:2,
                        titleFontSize: 11,
                        titleFontWeight: 'bold',
                        titleFontColor: '#9eaecf',
                        titleMarginBottom: 6,
                        bodyFontColor: '#6783b8',
                        bodyFontSize: 12,
                        bodySpacing:4,
                        yPadding: 10,
                        xPadding: 10,
                        footerFontSize: 11,
                        footerFontColor: '#6783b8',
                        footerMarginTop: 6,
                        displayColors: false
                    },
                    scales: {
                        yAxes: [{
                            display: true,
                            ticks: {
                                beginAtZero:false,
                                fontSize:12,
                                fontColor:'#9eaecf',
                                padding:10,
                                callback: function(value) {
                                    return Math.abs(value) > 999 ? Math.sign(value)*((Math.abs(value)/1000).toFixed(1)) + ' k' : Math.sign(value)*Math.abs(value)
                                },
                                min: 0,
                                stepSize: (_get_data.steps) ? ((_get_data.steps < 5) ? 5 : _get_data.steps) : 15000
                            },
                            gridLines: { 
                                color: "#e5ecf8",
                                tickMarkLength:0,
                                zeroLineColor: '#e5ecf8'
                            },
                            
                        }],
                        xAxes: [{
                            display: false,
                            ticks: {
                                fontSize:9,
                                fontColor:'#9eaecf',
                                source: 'auto',
                                padding:10
                            },
                            gridLines: {
                                color: "transparent",
                                tickMarkLength: 0,
                                zeroLineColor: 'transparent',
                            },
                        }]
                    }
                }
            });
        })
    }

    // init chart
    NioApp.coms.docReady.push(function(){ NioApp.lineCovidCase(); });


    NioApp.barCovidcase = function (selector, set_data) {
        var $selector = (selector) ? $(selector) : $('.covid-case-bar-chart');
        $selector.each(function(){
            var $self = $(this), _self_id = $self.attr('id'), _get_data = (typeof set_data === 'undefined') ? eval(_self_id) : set_data;
            var selectCanvas = document.getElementById(_self_id).getContext("2d");

            var chart_data = [];
            for (var i = 0; i < _get_data.datasets.length; i++) {
                chart_data.push({
                    label: _get_data.datasets[i].label,
                    tension:_get_data.lineTension,
                    backgroundColor: _get_data.datasets[i].background,
                    borderWidth:2,
                    borderColor: _get_data.datasets[i].color,
                    data: _get_data.datasets[i].data,
                    barPercentage : .7,
                    categoryPercentage : .7
                });
            } 
            var chart = new Chart(selectCanvas, {
                type: 'bar',
                data: {
                    labels: _get_data.labels,
                    datasets: chart_data,
                },
                options: {
                    legend: {
                        display: (_get_data.legend) ? _get_data.legend : false,
                        labels: {
                            boxWidth:12,
                            padding:20,
                            fontColor: '#6783b8',
                        }
                    },
                    maintainAspectRatio: false,
                    tooltips: {
                        enabled: true,
                        mode: 'index',
                        position: 'nearest',
                        callbacks: {
                            title: function(tooltipItem, data) {
                                return  data['labels'][tooltipItem[0]['index']];
                            },
                            label: function(tooltipItem, data) {
                                return data.datasets[tooltipItem.datasetIndex]['label'] + ' - ' + NioApp.addComma(data.datasets[tooltipItem.datasetIndex]['data'][tooltipItem['index']]);
                            },
                            footer: function(tooltipItems, data) {
                                var total = 0;
                                tooltipItems.forEach(function(tooltipItem) {
                                    total += data.datasets[tooltipItem.datasetIndex]['data'][tooltipItem['index']];
                                });
                                return ''; // 'Total - ' + total;
                            },
                        },
                        backgroundColor: '#fff',
                        borderColor:'#eff6ff',
                        borderWidth:2,
                        titleFontSize: 11,
                        titleFontWeight: 'normal',
                        titleFontColor: '#6783b8',
                        titleMarginBottom: 6,
                        bodyFontColor: '#9eaecf',
                        bodyFontSize: 11,
                        bodySpacing:4,
                        yPadding: 10,
                        xPadding: 10,
                        footerFontSize: 11,
                        footerFontColor: '#6783b8',
                        footerMarginTop: 6,
                        displayColors: false
                    },
                    scales: {
                        yAxes: [{
                            display: true,
                            stacked: (_get_data.stacked) ? _get_data.stacked : false,
                            ticks: {
                                beginAtZero:true,
                                fontSize:12,
                                fontColor:'#9eaecf',
                                padding:10,
                                callback: function(value) {
                                    return Math.abs(value) > 999 ? Math.sign(value)*((Math.abs(value)/1000).toFixed(1)) + ' k' : Math.sign(value)*Math.abs(value)
                                },
                                min: 0,
                                stepSize: (_get_data.steps) ? ((_get_data.steps < 5) ? 5 : _get_data.steps) : 1000
                            },
                            gridLines: { 
                                color: "#e5ecf8",
                                tickMarkLength:0,
                                zeroLineColor: '#e5ecf8'
                            },
                            
                        }],
                        xAxes: [{
                            display: false,
                            stacked: (_get_data.stacked) ? _get_data.stacked : false,
                            ticks: {
                                fontSize:9,
                                fontColor:'#9eaecf',
                                source: 'auto',
                                padding:10
                            },
                            gridLines: {
                                color: "transparent",
                                tickMarkLength: 0,
                                zeroLineColor: 'transparent',
                            },
                        }]
                    }
                }
            });
        })
    }
    // init chart
    NioApp.coms.docReady.push(function(){ NioApp.barCovidcase(); });  

    function countryModal () {
        var $trigger = $('.get-details');
        $trigger.on('click', function() {
            var $self = $(this);
            $.get(countryUri, {
                code: $self.data('code')
            }).done(function(res){
                if(res.modal) {
                    var $modal = $('#ajax-modal').html('');
                    $modal.html(res.modal);
                    $modal = $modal.find('.modal');
                    if($modal.length > 0){
                        $modal.modal('show');
                    }
                }
            });
        });
    }
    NioApp.coms.docReady.push(function(){ countryModal(); });
})(NioApp, jQuery);