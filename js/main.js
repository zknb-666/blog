// 确保jQuery加载完成后再执行所有功能
(function() {
    console.log('main.js 开始加载...');
    
    // 等待jQuery加载
    function waitForJQuery() {
        if (typeof $ !== 'undefined') {
            console.log('jQuery 已加载，开始初始化功能...');
            initializeScripts();
        } else {
            console.log('等待 jQuery 加载...');
            setTimeout(waitForJQuery, 50);
        }
    }
    
    function initializeScripts() {
        try {
            /*加载等待*/
            document.onreadystatechange = function () {
                if (document.readyState == "complete") {    
                    $(".loader-div").hide('animate__flash');
                    console.log('页面加载完成，隐藏加载动画');
                }
            }
            /*加载等待结束*/
            
            /*Pjax功能*/
            if (typeof $.fn.pjax !== 'undefined') {
                $(document).pjax('a[target!=_blank]', '#pageContent', {fragment: '#pageContent',timeout: 50000,cache: false});
                $(document).on('pjax:start',function() { 
                    if (typeof NProgress !== 'undefined') {
                        NProgress.start();
                    }
                });
                $(document).on('pjax:end',function() { 
                    if (typeof NProgress !== 'undefined') {
                        NProgress.done();
                    }
                });
                $(document).on("pjax:complete",function(){
                    if (typeof hljs !== 'undefined') {
                        hljs.highlightAll();
                    }
                });
                console.log('Pjax 功能已初始化');
            } else {
                console.warn('Pjax 未加载');
            }
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
            console.log('首页逻辑已初始化');
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

            // 定义全局函数
            window.dashangToggle = function(){
                $(".hide_box").fadeToggle();
                $(".shang_box").fadeToggle();
            }
            console.log('打赏功能已初始化');
            /*打赏结束*/
            
            /*菜单变换*/
            document.addEventListener("scroll",function(){
                if($(document).scrollTop() == 0)
                    $(".btn-menu").removeClass("menu-background");
                else
                    $(".btn-menu").addClass("menu-background");
            });
            console.log('菜单变换功能已初始化');
            /*结束*/
            
            console.log('所有功能初始化完成');
        } catch (error) {
            console.error('初始化脚本时出错:', error);
        }
    }
    
    // 开始等待jQuery加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForJQuery);
    } else {
        waitForJQuery();
    }
})();

