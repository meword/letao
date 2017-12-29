$(function() {

    getLeftCategoryData();
    scroll();
    leftCategoryClick();
    getRightCategoryData();
});


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
};



function getLeftCategoryData() {
    $.ajax({
        url:'/category/queryTopCategory',
        success: function(backData) {
            var data = template('leftCategoryTem',backData);
            $('#category-left>ul').html(data);
            $('#category-left>ul li').first().addClass('active');
        }
    })
};


function leftCategoryClick() {
    $('#category-left>ul').on('click','li',function() {
        $('#category-left >ul li').removeClass('active');

        $(this).addClass('active');

        var id = $(this).data('id');

        getRightCategoryData(id);
    })
}


function getRightCategoryData(id) {

    id = id || 1;

    $.ajax({
        url: '/category/querySecondCategory',
        data: {id:id},
        success: function(backData) {

            var data = template('rightCategoryTem',backData);

            if(backData.total) {
                $('#category-right >.mui-row').html(data);
            }else {
                $('#category-right >.mui-row').html('<p>暂无数据</p>');
            }
        }
    })
}   