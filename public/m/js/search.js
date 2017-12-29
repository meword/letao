$(function() {

    mui('.mui-scroll-wrapper').scroll({
        scrollY: true, //是否竖向滚动
        scrollX: false, //是否横向滚动
        startX: 0, //初始化时滚动至x
        startY: 0, //初始化时滚动至y
        indicators: false, //是否显示滚动条
        deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
        bounce: true //是否启用回弹
    });

    buttonClick();
    render();
    removeOne();
    removeAll();
});

// 当搜索按钮点击时
function buttonClick() {
    var searchHistory = window.localStorage.getItem('searchHistory');

    if(searchHistory) {
        searchHistory = JSON.parse(searchHistory);
    }else {
        searchHistory = [];
    }

    $('#main >div >form >button').on('click',function() {

        var inputValue = $('#main >div >form >input').val();

        if(inputValue == ''){
            return;
        }

        if(searchHistory.indexOf(inputValue) == -1){
            searchHistory.push(inputValue);
        }

        console.log(searchHistory);

        window.localStorage.setItem('searchHistory',JSON.stringify(searchHistory));

        $('#main >div >form >input').val('');

        $('#main >div >form >input').focus();

        render();
    })
}


// 渲染数据到页面
function render() {
    var searchHistory = window.localStorage.getItem('searchHistory');

    if(!searchHistory) {
        return;
    }

    searchHistory = JSON.parse(searchHistory);

    var renderObj = {
        rows: searchHistory
    };

    var data = template('searchHistoryTem',renderObj);

    $('#main >div >ul').html(data);
}


//点击单个删除
function removeOne() {
    $('#main >div').on('click','ul li i',function() {

        var searchHistory = window.localStorage.getItem('searchHistory');

        var content = $(this).data('content');
        
        searchHistory = JSON.parse(searchHistory)

        searchHistory.splice(searchHistory.indexOf(content+""),1)

        window.localStorage.setItem('searchHistory',JSON.stringify(searchHistory));

        render();
    })
}


//点击全部删除
function removeAll() {
    $('#main >div .btn-clear').on('click',function() {
        window.localStorage.setItem('searchHistory','');
        render();
    })
}







