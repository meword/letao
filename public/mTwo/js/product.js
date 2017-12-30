$(function () {

    product();

    product.refresh();

    product.getProductData({
        proName:product.search,
        price: 1,
        num: 1,
        page: 1,
        pageSize: 2
    },function(backData) {
        var data = template('productListTem',backData);
        $('#main .product-list >div').html(data);
        mui('.mui-content').pullRefresh().endPulldownToRefresh();
    });

    product.searchClick();

    product.titleClick();
});


function product() {
    product.page = 0;
    product.search = product.getQueryString('search');
    product.price = 1;
    product.num = 1;
}



// 获取get方式提交来的数据
product.getQueryString = function(key){
    var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result?decodeURIComponent(result[2]):null;

}



// 上拉刷新，下拉加载
product.refresh = function () {
    mui.init({
        pullRefresh: {
            container: '.mui-content', //传入父容器的id
            down: {
                callback: function () {
                    setTimeout(function() {
                        var searchValue = $('#main .form >input').val();
                        product.getProductData({
                            proName: searchValue,
                            price: 1,
                            num: 1,
                            page: 1,
                            pageSize: 2
                        },function(backData) {
                            product.page = 1;
                            var data = template('productListTem',backData);
                            $('#main .product-list >div').html(data);
                            mui('.mui-content').pullRefresh().endPulldownToRefresh();
                            mui('.mui-content').pullRefresh().refresh(true);
                        });
                    }, 1000);
                } //下拉刷新的回调函数
            },
            up: {
                callback: function() {
                    setTimeout(function() {
                        var searchValue = $('#main .form >input').val();
                        product.page++;
                        product.getProductData({
                            proName: searchValue,
                            price: 1,
                            num: 1,
                            page: product.page,
                            pageSize: 2
                        },function(backData) {
                            var data = template('productListTem',backData);
                            $('#main .product-list >div').append(data);
                            if(!backData.data.length){
                                mui('.mui-content').pullRefresh().endPullupToRefresh(true);
                                return;
                            }
                            mui('.mui-content').pullRefresh().endPullupToRefresh();
                        });
                    }, 1000);
                }
            }
        }
    });
}


// 获取商品数据
product.getProductData = function(obj,callBack) {
    $.ajax({
        url:'/product/queryProduct',
        data:obj,
        success: function(backData) {
            // console.log(backData);
            callBack && callBack(backData);
        }
    })
}


// 点击搜索
product.searchClick = function() {
    $('#main .form >button').on('click', function() {
        var searchValue = $('#main .form >input').val();
        product.getProductData({
            proName: searchValue,
            price: 1,
            num: 1,
            page: 1,
            pageSize: 2
        },function(backData) {
            var data = template('productListTem',backData);
            $('#main .product-list >div').html(data);
        });
    })
}


//标题点击
product.titleClick = function() {
    $('#main .product >.product-title .mui-row >div ').on('tap', function (){

        $('#main .product >.product-title .mui-row >div ').removeClass('active');

        $(this).addClass('active');

        var icon = $(this).data('icon');

        var name = $(this).data('name');


        if(icon == 1) {
            icon = 2;
            $(this).find('i').removeClass().addClass('fa-angle-up');
        }else {
            icon = 1;
            $(this).find('i').removeClass().addClass('fa-angle-down');
        }
        $(this).data('icon',icon);

        if(name == 'price') {
            product.price = icon;
        }else if(name == 'num'){
            product.num = icon;
        }

        var searchValue = $('#main .form >input').val();

        product.getProductData({
            proName: searchValue,
            price: product.price,
            num: product.num,
            page: 1,
            pageSize: 2
        },function(backData) {
            product.page = 1;
            var data = template('productListTem',backData);
            $('#main .product-list >div').html(data);
        });
    })
}