$(function() {
    // 点击登录按钮
    login.clickLoginBtn();
});


function login() {

}


login.clickLoginBtn = function() {
    $('#main .btn-login').on('click', function() {
        var userName = $('#main .username').val().trim();
        var passWord = $('#main .password').val().trim();

        if(!userName) {
            mui.toast('请输入账号',{ duration:'long', type:'div' }) 
            return;
        }

        if(!passWord) {
            mui.toast('请输入密码',{ duration:'long', type:'div' }) 
            return;
        }

        $.ajax({
            url: '/user/login',
            type: 'post',
            data:{
                username: userName,
                password: passWord
            },
            success: function(backData) {
                if(backData.error) {
                    console.log('密码错误');
                    mui.toast('账号或密码错误',{ duration: 1000, type:'div' }) 
                }else {
                    console.log('密码正确')
                    mui.toast('登录成功',{ duration: 1000, type:'div' });
                    window.history.back();location.reload();
                }
            }

        })
    })
}