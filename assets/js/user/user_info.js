$(function() {
    var form = layui.form
    var layer = layui.layer

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })

    initUserInfo()

    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                console.log(res)
                    // 调用 form.val() 快速为表单赋值  layui的方法
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置表单的数据
    $('#btnReset').on('click', function(e) {
        // 阻止表单的默认重置行为
        e.preventDefault()
        initUserInfo()
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
            // 阻止表单的默认提交行为
            e.preventDefault()
                // 发起 ajax 数据请求
            $.ajax({
                method: 'POST',
                url: '/my/userinfo',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('更新用户信息失败！')
                    }
                    layer.msg('更新用户信息成功！')
                        // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                        // window.parent.getUserInfo()
                        // 这里好像有跨域问题 就把其他函数复制过来了
                    getUserInfo()
                }
            })
        })
        // 获取用户的基本信息
    function getUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                console.log(res)
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败！')
                }
                // 调用 renderAvatar 渲染用户的头像
                renderAvatar(res.data)
            }
        })
    }
    // 渲染用户的头像
    function renderAvatar(user) {
        // 1.获取用户信息
        var name = user.nickname || user.username
            // 2.设置欢迎的文本
        $("#welcome").html("欢迎&nbsp;&nbsp;" + name)
            // 3.按需渲染图片头像
        if (user.user_pic !== null) {
            // 3.1渲染图片头像
            $(".layui-nav-img").attr("src", user.user_pic).show()
            $('.text-avatar').hide()
        } else {
            // 3.2渲染文字头像
            $(".layui-nav-img").hide()
            var first = name[0].toUpperCase()
            $(".text-avatar").html(first).show()
        }
    }
})