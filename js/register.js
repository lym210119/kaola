$(function() {
    var reg = /^\w{3,20}$/;
    $("input[name='username']").blur(function() {
        console.log($(this).val());
        shop.api.checkUsernameUnique($(this).val(), function(response) {
            console.log(response);
            if (response.code === 2001) {
                $(".username span").html("用户名已存在").show();
            }
        })
        if (!reg.test($(this).val())) {
            $(".username span").show();
        } else {
            $(".username span").hide();
        }

    });


    $(".reg-btn").click(function() {
        if ($(".checked")[0].checked) {
            var username = $("input[name='username']").val();
            var password = $("input[name='password']").val();
            console.log([username, password]);

            //            if(!reg.test(username)) $(".username-title").html("用户名不合法，请填写3-20位的英文数字下划线");
            if (password.length < 6 || password.length > 20) {
                $(".password span").show();
                return;
            }
            shop.api.register(username, password, function(response) {
                console.log(response);
                if (response.code === 0) {
                    alert(response.message);
                    location.assign("index.html");
                }
            })
        }
    })
})
