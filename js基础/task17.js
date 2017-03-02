/**
 * Created by Administrator on 2017/1/10.
 */
/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = '';
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}
var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};
// 用于渲染图表的数据
var chartData = {};
// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: "北京",
    nowGraTime: "day"
};

/**
 * 渲染图表
 */
function renderChart() {
    var oUl = document.createElement('ul');
    oUl.style.width = '1600px';
    oUl.style.height = '600px';
    var num = 0;
    for (var item in chartData) {
        var oLi = document.createElement('li');
        oLi.style.height =  chartData[item] + 'px';
        oLi.style.backgroundColor = '#' + Math.floor(Math.random() * 0xFFFFF0).toString(16);
        oLi.style.left = 400/num * + 'px';
        oLi.style.bottom = 0;
        oUl.appendChild(oLi);
        num++;
    }
    document.getElementById('aqi-chart-wrap').appendChild(oUl);
    $('#aqi-chart-wrap').find('li').css({'width':900/num + 'px','list-style-type': 'none',} )


}
/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(time) {
    // 确定是否选项发生了变化
    if(time===pageState.nowGraTime) return;
    else {
        // 设置对应数据
        pageState.nowGraTime = time;
        initAqiChartData();
        // 调用图表渲染函数
        renderChart();
    }
}
/**
 * select发生变化时的处理函数
 */
function citySelectChange(city) {
    // 确定是否选项发生了变化
    if(city===pageState.nowSelectCity) return;
    else{
        // 设置对应数据
        pageState.nowSelectCity = city;
        initAqiChartData();
        // 调用图表渲染函数
        renderChart();
    }
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm(){
    var  aInp = $('#form-gra-time').find('input');
    for(var i=0; i<aInp.length; i++){
        aInp.eq(i).click(function () {
            graTimeChange(this.value);
        })
    }
}
/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var str = '';
    var citySelect = $('#city-select');
    for(var attr in aqiSourceData){
        str += '<option value="'+ attr +'">'+ attr +'</option>';
    }
    citySelect.html(str);
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    var aOpt = citySelect.children();
    for(var i=0 ; i<aOpt.length ; i++){
        aOpt[i].onclick = function () {
            citySelectChange(this.value);
        }
    }
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
    var selectCityData = aqiSourceData[pageState.nowSelectCity];
    var selectTime = pageState.nowGraTime;
    if(selectTime==='day'){
        chartData = selectCityData;
    }
    else if(selectTime==='week'){
        var num = 0, data = 0;
        for(var attr in selectCityData){
            num++;
            data += selectCityData.attr;
            if(attr.getDay()== 0 ){
                chartData.attr = data/num;
                num = 0;
                data = 0;
            }
        }
    }
    else if(selectTime==='month'){
        num = 0;
        data = 0;
        for(var attr in selectCityData){
            num++;
            data += selectCityData.attr;
            if(attr.getMonth()== 0){
                chartData.attr = data/num;
                num = 0;
                data = 0;
            }
        }
    }
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm();
    initCitySelector();
    initAqiChartData();
    renderChart();
}

init();