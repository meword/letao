$(function() {

    mui('.mui-scroll-wrapper').scroll({
        scrollY: true, //是否竖向滚动
        scrollX: false, //是否横向滚动
        startX: 0, //初始化时滚动至x
        startY: 0, //初始化时滚动至y
        indicators: true, //是否显示滚动条
        deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
        bounce: true //是否启用回弹
    });

    getLeftData();
    LeftClick();
    getRightData();
});


function getLeftData() {
    $.ajax({
        url:'http://localhost:3000/category/queryTopCategory',
        success: function(backData) {
           var data = template('categoryLeftTmp',backData);
           $('#category-left > ul').html(data);
           $('#category-left > ul li').first().addClass('active');
        },
    })
}

function LeftClick() {
    $('#category-left').on('click','ul>li',function() {
        $('#category-left ul>li').removeClass('active');
        $(this).addClass('active');
        getRightData($(this).data('id'));
    })
}

function getRightData(id) {
    id = id || 1;
    $.ajax({
        url:'/category/querySecondCategory',
        data: {id:id},
        success: function(backData) {
            var data = template('categoryRightTmp',backData);
            if(backData.rows != 0) {
                $('#category-right >div >.mui-row').html(data);
            } else {
                $('#category-right >div >.mui-row').html('<p>暂无此分类</p>');
            }
        }
    })
}