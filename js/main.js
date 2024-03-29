    /*加载等待*/
    document.onreadystatechange = function () {
    if (document.readyState == "complete") {    
        $(".loader-div").hide('animate__flash');
    }}
    /*加载等待结束*/
    
    /*Pjax功能*/
    $(document).pjax('a[target!=_blank]', '#pageContent', {fragment: '#pageContent',timeout: 50000,cache: false});
    $(document).on('pjax:start',function() { NProgress.start();});
    $(document).on('pjax:end',function() { NProgress.done();});
    $(document).on("pjax:complete",function(){hljs.initHighlighting();});
    /*Pjax功能结束*/
    
    /*逻辑判断*/
    function ishome() {
        if (location.pathname == "/")
            {
                $(".panel-cover").removeClass("panel-cover--collapsed");
                $(".panel-main__content").show();
            }
        else
            {
                $(".panel-cover").addClass("panel-cover--collapsed");
                $(".panel-main__content").hide();
            }
        };
    ishome();
    document.addEventListener('click',ishome);
    /*逻辑判断结束*/
    
    /*打赏*/
    $(function(){
        $(".pay_item").click(function(){
            $(this).addClass('checked').siblings('.pay_item').removeClass('checked');
            var dataid=$(this).attr('data-id');
            $(".shang_payimg img").attr("src","/images/payimg/"+dataid+"img.png");
            $("#shang_pay_txt").text(dataid=="alipay"?"支付宝":"微信");
        });
    });

    function dashangToggle(){
        $.getScript("/js/main.js");
        $(".hide_box").fadeToggle();
        $(".shang_box").fadeToggle();
    }
    /*打赏结束*/
    
    /*菜单变换*/
    document.addEventListener("scroll",function(){
    if($(document).scrollTop() == 0)
    $(".btn-menu").removeClass("menu-background");
    else
    $(".btn-menu").addClass("menu-background");
    });
    /*结束*/

