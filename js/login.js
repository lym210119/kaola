    $(function() {
       $("#login").click(function() {
           var username = $("input[name='username']").val();
           var password = $("input[name='password']").val();
           console.log([username, password]);
           //URL: 协议://IP:端口/path/文件?查询参数#a
           shop.api.login(username, password, function(response) {
               console.log(response);
               if (response.code === 0) {
                   //如果登录成功，把用户信息存储到本地
                   //localStorage.setItem("token", response.data.token);
                   var data = response.data;
                   for (var prop in data) {
                       if (data.hasOwnProperty(prop)) {
                           localStorage.setItem(prop, data[prop]);
                       }
                   }
                   //判断有callbackurl则跳回到指定的callbackurl页面, 否则跳到首页
                   var callbackurl = location.hash.substr(13);
                   if (callbackurl) {
                       location.assign(callbackurl);
                   } else {
                       location.assign("/"); // 可以返回
                       // location.replace("index.html");         // 不能返回
                   }
               } else if (response.code === 1001) {
                   $(".psd-error").show();

               } else if (response.code === 2002) {
                   $(".user-error").show();
               };
           });

       });
   });
