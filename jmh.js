// global variable
var myChart;
var current_data;
var show_direction = 'horizontal';
// default option
var default_option = {
    title: {
        text: 'JMH Visual Chart',
        subtext: ''
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    toolbox: {
        feature: {
            saveAsImage: {
                title: 'PNG',
            },
        }
    }
};

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// upload json file
function onChooseFile(event) {
    let input = event.target;
    if (!input.files[0])
        return undefined;
    let file = input.files[0];
    input.value = ''; // clear value, due to trigger onChange
    let reader = new FileReader();
    reader.onload = function () {
        current_data = JSON.parse(reader.result);
        analysis();

    };
    reader.readAsText(file);
}

// switch horizon or vetical chart
function switch_hv() {
    show_direction = show_direction === 'horizontal' ? 'vertical' : 'horizontal';
    analysis();
}

function analysis() {
    if (!current_data) return;
    var option = convert(current_data, show_direction === 'horizontal');
    // 使用刚指定的配置项和数据显示图表。
    myChart.clear();
    myChart.setOption({ ...default_option, ...option });
}


// core code: convert jmh-json to echart's option
function convert(jmh_json, horizontal) {
    var legengd_data = [];
    var xAxis_data = [];
    var xAxis_name = '';
    var yAxis_name = '';
    var method_param_to_data = new Map();

    jmh_json.forEach(element => {
        // method
        var method = element.benchmark.substring(element.benchmark.lastIndexOf(".") + 1);
        if (-1 == legengd_data.indexOf(method)) legengd_data.push(method);

        // yAxis_name
        if (yAxis_name === '') yAxis_name = element.primaryMetric.scoreUnit;

        var xAxis_value = '';
        if (element.params) {
            if (xAxis_name === '') {
                for (key in element.params) {
                    xAxis_name = xAxis_name + key + ":";
                }
                xAxis_name = xAxis_name.substring(0, xAxis_name.length - 1);
            }
            for (key in element.params) {
                xAxis_value = xAxis_value + element.params[key] + ":";
            }
            xAxis_value = xAxis_value.substring(0, xAxis_value.length - 1);

            if (-1 == xAxis_data.indexOf(xAxis_value)) xAxis_data.push(xAxis_value);
        } else {
            xAxis_name = 'Param';
            xAxis_data = ['default'];
        }

        // map
        method_param_to_data.set(method + xAxis_value, yAxis_name.indexOf('ops/') == 0 ? Math.floor(element.primaryMetric.score) : element.primaryMetric.score);
    });

    var seriesData = [];
    var seriesLabel = {
        normal: {
            show: true,
            textBorderColor: '#333',
            textBorderWidth: 2,
            position: horizontal ? 'top' : 'right',
        }
    };

    legengd_data.forEach(ele => {
        var paramData = [];
        xAxis_data.forEach(item => {
            paramData.push(method_param_to_data.get(ele + item));
        })

        seriesData.push({
            name: ele,
            type: 'bar',
            label: seriesLabel,
            data: paramData,

        });
    })
    return horizontal ? {
        legend: {
            data: legengd_data
        },
        grid: {
        },
        xAxis: [
            {
                type: 'category',
                data: xAxis_data,
                name: xAxis_name
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: yAxis_name,
            }
        ],
        series: seriesData
    } : {
            legend: {
                data: legengd_data
            },
            grid: {
            },
            xAxis: {
                type: 'value',
                name: yAxis_name,
            },
            yAxis: {
                type: 'category',
                data: xAxis_data,
                name: xAxis_name
            },
            series: seriesData
        };
}