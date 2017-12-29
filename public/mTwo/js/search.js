$(function() {

    scroll();
    getSearchHistory();
    onBtnClick();
    removeOne();
    removeAll();
});


//滑动
function scroll() {
    mui('.mui-scroll-wrapper').scroll({
        scrollY: true, //是否竖向滚动
        scrollX: false, //是否横向滚动
        startX: 0, //初始化时滚动至x
        startY: 0, //初始化时滚动至y
        indicators: false, //是否显示滚动条
        deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
        bounce: true //是否启用回弹
    });
}


// 点击搜索按钮
function onBtnClick () {
    $('#main form .btn-search').on('click',function() {

        var inputValue = $('#main >div >form >input').val();

        inputValue = inputValue.trim();

        if(!inputValue) {
            $('#main >div >form >input').val('').focus();
            return;
        }

        var searchHistory = window.localStorage.getItem('searchHistory');

        if(searchHistory) {
            searchHistory = JSON.parse(searchHistory);
        }else {
            searchHistory = [];
        }

        if(searchHistory.indexOf(inputValue) != -1){
            $('#main >div >form >input').val('').focus();
            return;
        }

        searchHistory.push(inputValue);

        window.localStorage.setItem('searchHistory',JSON.stringify(searchHistory));

        $('#main >div >form >input').val('').focus();

        getSearchHistory();

    })
}


// 获取搜索历史
function getSearchHistory() {

    var searchHistory = window.localStorage.getItem('searchHistory');

    if(searchHistory) {

        searchHistory = JSON.parse(searchHistory);

        searchHistory.reverse();

    }


    var dataObj = {
        rows: searchHistory
    };

    var data = template('searchHistoryTmp',dataObj);

    $('#main >div >.history >ul').html(data);
}


//点击删除单个
function removeOne() {

    $('#main >div >.history >ul').on('click', 'li  >i', function() {
        
        var searchHistory = window.localStorage.getItem('searchHistory');
        
        var content = $(this).data('content');

        searchHistory = JSON.parse(searchHistory);

        var index = searchHistory.indexOf(content+'');

        searchHistory.splice(index,1);

        window.localStorage.setItem('searchHistory',JSON.stringify(searchHistory));

        getSearchHistory();

    })
}


// 点击删除全部
function removeAll() {
    $('#main .tool >.btn-clear').on('click', function() {

        window.localStorage.setItem('searchHistory','');

        getSearchHistory();

    })
}