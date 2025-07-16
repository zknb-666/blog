// 确保jQuery加载完成后再执行所有功能
(function() {
    console.log('main.js 开始加载...');
    
    // 防止重复初始化的全局标志
    if (window.mainJSInitialized) {
        console.log('main.js 已经初始化过，跳过重复加载');
        return;
    }
    window.mainJSInitialized = true;
    
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
                    // 防止重复处理
                    if (window.pjaxCompleteProcessing) {
                        console.log('pjax:complete 正在处理中，跳过');
                        return;
                    }
                    window.pjaxCompleteProcessing = true;
                    
                    // 重新初始化代码高亮
                    if (typeof hljs !== 'undefined') {
                        hljs.highlightAll();
                    }
                    
                    console.log('Pjax页面切换完成，重新初始化功能');
                    
                    // 延迟执行确保DOM完全更新
                    setTimeout(function() {
                        // 重新初始化 Vercount 统计
                        try {
                            console.log('开始重新初始化 Vercount 统计');
                            
                            // 方法1: 检查并重新执行 vercount 脚本
                            const vercountElements = document.querySelectorAll('[id^="vercount_value_"]');
                            if (vercountElements.length > 0) {
                                // 重置显示为 Loading
                                vercountElements.forEach(function(el) {
                                    el.innerHTML = '<span class="loadervercount"></span>';
                                });
                                
                                // 重新创建并执行 vercount 脚本
                                const existingScript = document.querySelector('script[src*="events.vercount.one/js"]');
                                if (existingScript) {
                                    const newScript = document.createElement('script');
                                    newScript.defer = true;
                                    newScript.src = 'https://events.vercount.one/js';
                                    newScript.onload = function() {
                                        console.log('Vercount 脚本重新加载完成');
                                    };
                                    
                                    // 移除旧脚本并添加新脚本
                                    existingScript.remove();
                                    document.head.appendChild(newScript);
                                } else {
                                    // 如果找不到现有脚本，直接添加新脚本
                                    const newScript = document.createElement('script');
                                    newScript.defer = true;
                                    newScript.src = 'https://events.vercount.one/js';
                                    document.head.appendChild(newScript);
                                }
                            }
                            
                            console.log('Vercount 统计重新初始化完成');
                        } catch (e) {
                            console.log('Vercount 重新初始化失败:', e);
                        }
                        
                        // 重新初始化评论系统
                        try {
                            console.log('开始重新初始化评论系统');
                            
                            // 特殊处理Livere评论系统
                            const livereContainer = document.getElementById('lv-container');
                            if (livereContainer && typeof LivereTower === 'function') {
                                try {
                                    // 清空容器内容
                                    const existingLivere = livereContainer.querySelector('.livere-wrapper, .livere');
                                    if (existingLivere) {
                                        existingLivere.remove();
                                    }
                                    
                                    // 重新初始化Livere
                                    LivereTower.init();
                                    console.log('Livere评论系统重新初始化成功');
                                } catch (e) {
                                    console.log('Livere重新初始化失败:', e);
                                }
                            }
                            
                            // 重新执行评论区域的脚本
                            const commentSection = document.querySelector('.post-comments');
                            if (commentSection) {
                                // 查找并重新执行评论区域内的script标签
                                const commentScripts = commentSection.querySelectorAll('script');
                                commentScripts.forEach(function(script) {
                                    if (script.src) {
                                        // 对于外部脚本，不重新加载，因为已经在comments.html中处理了防重复
                                        return;
                                    } else if (script.innerHTML) {
                                        // 对于内联脚本，重新执行
                                        try {
                                            eval(script.innerHTML);
                                        } catch (e) {
                                            console.log('重新执行评论脚本时出错:', e);
                                        }
                                    }
                                });
                            }
                            
                            console.log('评论系统重新初始化完成');
                        } catch (e) {
                            console.error('评论系统重新初始化失败:', e);
                        }
                        
                        // 重置处理标志
                        window.pjaxCompleteProcessing = false;
                    }, 200);
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

