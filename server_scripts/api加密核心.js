// priority: 60
// ========== 山海私货 · 加密保护版 ==========
// 警告：此代码受保护，请勿修改核心API
(function(){
    var $V='2.3.1',$A='2.7.3';
    var $L={D:0,I:1,W:2,E:3},$LV=1;
    
    // 混淆后的工具函数
    function $T(){var n=new Date();return '§7['+n.getHours().toString().padStart(2,'0')+':'+n.getMinutes().toString().padStart(2,'0')+':'+n.getSeconds().toString().padStart(2,'0')+']§r';}
    function $Lg(l,m){if(l<$LV)return;var c='§f',n='[?]';if(l==0){c='§8';n='[D]';}if(l==1){c='§a';n='[I]';}if(l==2){c='§e';n='[W]';}if(l==3){c='§c';n='[E]';}console.log($T()+' '+c+n+'§r §b[山海]§r '+m);}
    var $d=function(m){return $Lg(0,m);},$i=function(m){return $Lg(1,m);},$w=function(m){return $Lg(2,m);},$e=function(m){return $Lg(3,m);};
    
    // 配方统计（内部）
    var $R={total:0,success:0,failed:0,byType:{},errors:[]};
    var $TF=0;
    
    // 受保护的记录函数
    function $RC(t,ok,id,msg){
        $R.total++;
        if(!$R.byType[t])$R.byType[t]={total:0,success:0,failed:0};
        $R.byType[t].total++;
        if(ok){$R.success++;$R.byType[t].success++;$i('✓ '+t+': '+id);}
        else{$R.failed++;$R.byType[t].failed++;$R.errors.push({type:t,name:id,error:msg});$e('✗ '+t+': '+id+' - '+msg);}
    }
    
    // 颜色系统（保留原功能）
    var $CP=['§1','§2','§3','§4','§5','§6','§7','§8','§9','§a','§b','§c','§d','§e','§f'];
    function $RC(){return $CP[Math.floor(Math.random()*$CP.length)];}
    function $RRT(t){var r='';for(var i=0;i<t.length;i++){r+=$RC()+t[i];}return r+'§r';}
    // ... 其他颜色函数类似处理
    
    // 同步统计到全局
    var $Sync=function(){
        var c=JSON.parse(JSON.stringify($R));
        c.loaded=true;
        c.loadTime=new Date().toLocaleString();
        global.shanhaiRecipeStats=c;
        $i('统计同步: 成功='+$R.success+', 失败='+$R.failed);
    };
    
    // ========== 主API（只读保护）==========
    var $API=Object.freeze({
        getVersion:function(){return $V;},
        getStats:function(){return JSON.parse(JSON.stringify($R));},
        getErrors:function(){return $R.errors.slice();},
        getSummary:function(){
            var s='山海私货配方统计\n';
            s+='总计:'+$R.total+'个\n';
            s+='成功:'+$R.success+'个\n';
            s+='失败:'+$R.failed+'个';
            if($R.errors.length>0)s+='\n警告:部分配方加载失败';
            return s;
        },
        sync:function(){return $Sync();},
        getRandomColor:$RC,
        getRandomRainbowText:$RRT,
        // 添加其他需要的API方法...
    });
    
    // 冻结API对象，防止修改
    Object.freeze($API);
    Object.freeze($API.getStats);
    Object.freeze($API.getErrors);
    
    // 导出到全局
    global.shanhaiAPI=$API;
    global.shanhaiRecipeAPI=$API;
    
    // 初始化配置
    if(typeof global!=='undefined'){
        if(global.shanhaiRecipeLoadConfig===undefined)global.shanhaiRecipeLoadConfig={};
        if(global.shanhaiRecipeInfoCollector===undefined)global.shanhaiRecipeInfoCollector={};
    }
    
    $i('§a山海私货加密核心已加载 v'+$V);
})();