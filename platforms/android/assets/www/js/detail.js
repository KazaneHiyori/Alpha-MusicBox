;(function(){
	
	//创建滑动对象，滑动到对应页面时，对应标题格高亮
    var contentSwiper = new Swiper(".content",{
	    slidePerView:1,
	    onSlideChangeStart:function(){
	    	$("header span.current").removeClass("current");
	    	$("header span").eq(contentSwiper.activeIndex+1).addClass("current");
	    	if(contentSwiper.activeIndex+1==2){
	    		$(".header").css("box-shadow","0 5px 50px #ccc;");
	    		$(".content .littleIcon").show();
	    	}else{
	    		$(".header").css("box-shadow","none");
	    		$(".content .littleIcon").hide();
	    	}
	    }
    });    
    //点击中间三个页顶标签，滑动到对应内容页,点击左侧标签则滑出侧滑菜单，点击右侧则出现网上歌曲分类列表
    $("header span").on("singleTap",function(e){
    	e.stopPropagation();
    	if($(this).index()>=1&&$(this).index()<=3){
    		contentSwiper.slideTo($(this).index()-1);		//swiper.slideTo(index):切换到指定slide, index为索引值
		}else if($(this).index()==0){
			$(".asideLeft").css({left:"0vw"});
			$(".asideRight").css({left:"60vw"});
		}else{
			$("header span .classify").toggle();
		}
    });
    
    //点击左右侧滑栏，隐藏所有侧滑栏，恢复平常页面
    $(".asideLeft,.asideRight").on("singleTap",function(e){
    	e.stopPropagation();
    		$(".asideLeft").css({left:"-60vw"});
			$(".asideRight").css({left:"140vw"});
    })
    
    $(document).on("touchstart",function(e){
    	e.stopPropagation();
    	$("header span ul").hide();
    });
    
    var startX, endX, deltaX="";
    //左右侧滑栏左滑时，都会恢复原位
    $(".asideLeft,.asideRight").on('touchstart',function(e){ 
        	startX = e.changedTouches[0].pageX;
        }).on('touchmove', function(e){  
            endX = e.changedTouches[0].pageX;
            deltaX = endX - startX;  
        }).on('touchend', function(e){  
            if (deltaX < -30) { // 向右划动  
               $(".asideLeft").css({left:"-60vw"});
				$(".asideRight").css({left:"140vw"});
            }  
        });  
    //"我的"页的上右滑动可召唤出侧滑菜单
     
   		var flag="";
        $(".content").on('touchstart',function(e){
        	if($(".header span.current").index()!==1){flag=1}
        	startX = e.changedTouches[0].pageX;
        }).on('touchmove', function(e){  
            endX = e.changedTouches[0].pageX;
            deltaX = endX - startX;  
        }).on('touchend', function(e){ 
        	if(flag){flag="";return}
            if (deltaX > 70 ) { // 向右划动  
               $(".asideLeft").css({left:"0vw"});
				$(".asideRight").css({left:"60vw"});
            }  
        });  
    
     
  //---------------------------------------------------------------------------   
     
     //api数据获取并加载部分
    	var player = new Audio();
    	var sortId = localStorage.getItem("sortId");
    	sortId = sortId?(sortId-0):26;
    	
    	var $list3 = $(".list3");
		var $datalist3 = $("#datalist3");
		
		var index = 0;
	    //音乐播放操控部分
	     var $title = $(".info");
	     var $currentTime = $(".time time").first();
	     var $durationTime = $(".time time").last();
	     var $img = $(".pic img");
	     var $progress = $(".progress progress");
	    
	     var $mode = $(".controlPlatform .mode").first();
	     var $prev = $(".controlPlatform .prev").first();
	     var $play = $(".controlPlatform .play").first();
	     var $next = $(".controlPlatform .next").first();
	     var $voice = $(".controlPlatform .voice").first();
	     
	     var songId = "";
		 var $lrc = $(".lrc");
     	 var time=[];
		
		
    	//初始化检测是否有缓存音乐谷歌单，有则先把音乐谷歌单信息加载到页面
    	
    	var playList3 = localStorage.getItem("playList3");
    	var playlist3= playList3? JSON.parse(localStorage.getItem("playList3")) : [];
		
		
    	if(playlist3.length){
    		$datalist3.html("");
		   	$list3.html("");
		   	lrcIndex=0;
			marginTop = 50; 
			var $frame3_1 = $(document.createDocumentFragment());
			var $frame3_2 = $(document.createDocumentFragment());
			
			$.each(playlist3,function(idx3,item3){
				var $option = $("<option/>").val(item3.songname+" - "+item3.singername).html(item3.songname+" - "+item3.singername);
	    			$frame3_1.append($option);
	    		var $li = $("<li/>").attr({"songId":item3.songid,url:item3.url}).html((idx3+1)+"、<span>"+item3.songname+" - "+item3.singername+"</span>");//,downUrl:item3.downUrl
		    		$li.append("<a class='iconfont icon-download down' href="+item3.downUrl+" download=''></a>");
		    		$frame3_2.append($li);
			});
			$datalist3.append($frame3_1);
		   	$list3.append($frame3_2);
		   	
		   	songId = playlist3[index].songId;
		   	lrcData();
		   	
		   	player.src = playlist3[index].url;
		    initTime();
			$img.attr("src",playlist3[index].smallPic);
			$title.html(playlist3[index].songname+" - "+playlist3[index].singername);
			$list3.find("li").eq(index).addClass("songActive").siblings("li").removeClass("songActive");
		}

    	





		
		function ajaxData(sortId){
	
	     	$.ajax({
	     		url:"http://route.showapi.com/213-4",
		    	dataType:"json",
		    	data:{
		    		showapi_appid:"27149",
		    		showapi_sign:"0bd2df821f4e4584983ba2ef5888e518",
		    		topid:sortId,
		    	},
		    	success:function(res){
		    		var target = res.showapi_res_body.pagebean.songlist;
		    		//遍历添加歌曲到搜索和点播列表前先清空一下
		    		playlist3=[];
		    		$datalist3.html("");
		    		$list3.html("");
		    		//为音乐谷歌曲列表创建临时框架
		    		var $frame3_1 = $(document.createDocumentFragment());
		    		var $frame3_2 = $(document.createDocumentFragment());
		    		$.each(target,function(idx3,item3){
		    			
		    			//搜索列表
						//<option value="月亮代表我的心 - 张国荣">月亮代表我的心 - 张国荣</option>
		    			var $option = $("<option/>").val(item3.songname+" - "+item3.singername).html(item3.songname+" - "+item3.singername).attr("order",idx3);
		    			$frame3_1.append($option);
		    			
		    			//歌曲列表
		    			var $li = $("<li/>").attr({"songId":item3.songid,url:item3.url}).html((idx3+1)+"、<span>"+item3.songname+" - "+item3.singername+"</span>");//,downUrl:item3.downUrl
		    			$li.append("<a class='iconfont icon-download down' href="+item3.downUrl+" download=''></a>");
		    			$frame3_2.append($li);
		    			var obj3_2 ={songId:item3.songid,bigPic:item3.albumpic_big,smallPic:item3.albumpic_small,downUrl:item3.downUrl,singername:item3.singername,songname:item3.songname,url:item3.url,seconds:item3.seconds};
						playlist3.push(obj3_2);
						
						
		    		})
		    		$datalist3.append($frame3_1);
		    		$list3.append($frame3_2);
			    		songId = playlist3[index].songId;
		    	
			    		player.src = playlist3[index].url;
				     	$img.attr("src",playlist3[index].smallPic);
			    		initTime();
				     	$title.html(playlist3[index].songname+" - "+playlist3[index].singername);
						$list3.find("li").eq(index).addClass("songActive").siblings("li").removeClass("songActive");
	     			
	     			
			    		localStorage.setItem("playList3",JSON.stringify(playlist3));
			    		localStorage.setItem("sortId",sortId);
		    		

					lrcData();
		    	}
	     	});
     	}
     
     ajaxData(sortId);
     
     
     function lrcData(){
     	$.ajax({
     		url:"http://route.showapi.com/213-2",
		    	dataType:"json",
		    	data:{
		    		showapi_appid:"27149",
		    		showapi_sign:"0bd2df821f4e4584983ba2ef5888e518",
		    		musicid:songId
		    	},
		    	success:function(res1){
		    		console.log(res1);
		    		if(!res1.showapi_res_body.lyric){return}
		    		var lrcTarget = (res1.showapi_res_body.lyric).split("&#10;");
		    		time=[];
		    		lrcIndex=0;
					marginTop = 50; 
		    		$lrc.html("");
	    			var songName = (lrcTarget[0]+"").substring(8,(lrcTarget[0]+"").length-1);
		    		var singer = (lrcTarget[1]+"").substring(8,(lrcTarget[1]+"").length-1);
		    		//把待时间轴的歌词，分出时间数组，歌词添加到页面
		    		var $frameLrc = $(document.createDocumentFragment());
		    		$.each(lrcTarget, function(idx,item) {
		    			var flag1 = item.indexOf("[0");
		    			if(!flag1){
		    				var songTime = parseInt(item.substring(1,3))*60+parseInt(item.substring(8,10)) ;
		    				time.push(songTime);
		    				var songValue = item.substring(18);
		    				var $li = $("<li/>").html(songValue);
		    				$frameLrc.append($li);
		    			}
		    		});
		    		$lrc.append($frameLrc);
		    	}
     	})
    }
  
//         点选分类列表选项，加载不同列表的歌曲
	
	$(".classify").on("singleTap","li",function(){
		$(this).addClass("sortActive").siblings("li").removeClass("sortActive");
		sortId = $(this).attr("data-Id");
		index=0;
		player.pause();
		$play.removeClass('icon-zanting');
		// 图片旋转效果停止
//		$img.removeClass('playing');
		$img.css("animationPlayState",'paused');
		init();
		ajaxData(sortId);
	});
	
//       填写好搜索内容后，点选放大镜，ajaxSeach获取搜索结果，然后添加到音乐谷歌单中


	//ajaxSearch函数获取搜索结果数据
	function ajaxSearch(){
		$.ajax({
				url:"http://route.showapi.com/213-1",
			 	dataType:"json",
		    	data:{
		    		showapi_appid:"27149",
		    		showapi_sign:"0bd2df821f4e4584983ba2ef5888e518",
		    		keyword:$(".sousuoText3").val(),
		    		page:"1"
		    	},
		    	success:function(res2){
		    		var target = res2.showapi_res_body.pagebean.contentlist;
		    		console.log(target[0]);
		    		//为音乐谷歌曲列表创建临时框架
		    		var $frame3_3 = $(document.createDocumentFragment());
		    		$.each(target,function(idx3,item3){
		    			
		    			//歌曲列表
		    			var $li = $("<li/>").attr({"songId":item3.songid,url:item3.downUrl}).html((idx3+1)+"、<span>"+item3.songname+" - "+item3.singername+"</span>");//,downUrl:item3.downUrl
		    			$li.append("<a class='iconfont icon-download down' href="+item3.downUrl+"></a>");
		    			$frame3_3.append($li);
		    			var obj3_3 ={songId:item3.songid,bigPic:item3.albumpic_big,smallPic:item3.albumpic_small,downUrl:item3.downUrl,singername:item3.singername,songname:item3.songname,url:item3.downUrl,seconds:252};
						playlist3.push(obj3_3);
						
		    		})
		    		$list3.append($frame3_3);
		    		
		    			index=0;
		  		    	songId = playlist3[index].songId;
			    		init();
			    		$play.removeClass('icon-zanting');

			    	
		    	}
		});
	}
	
	
	//按X按钮，清楚搜索框的文本内容
	$(".slide3 .search .clear3").on("singleTap",function(){
		$(".sousuoText3").val("");
		index = 0;
		songId = playlist3[index].songId;
		$play.removeClass('icon-zanting');
		playlist3 = JSON.parse(localStorage.getItem("playList3"));
		ajaxData(sortId);
		init();
	});
	
	$(".slide3 .search .sousuo3").on("singleTap",function(){
		//如果文本内容为假，则return
		if(!$(".sousuoText3").val()){
			return;
		}
		//先清空歌单本地储存数组，列表（写在这里主要考虑到懒加载时，再ajaxSearch时，之前请求过的数据得以保留）
		playlist3=[];
		$list3.html("");
		//若文本内容为真，则执行搜索并添加到歌单
		ajaxSearch();
		
		
//		搜索当前歌单中的歌曲
//		$.each(playlist3,function(idx,item){
//			if($(".sousuoText3").val()==(item.songname+" - "+item.singername)){
//				index = idx;
//				init();
//			if(!$play.hasClass("icon-zanting")){return}
//   		player.play();
//			}
//		});
	});
	
	
	
	
	
//------------------------------------------------------------------------------
    //音乐播放部分
     
  	//列表中，点击哪首就哪首获焦,根据接上的播放状态，判定是否播放
  	$list3.on("click","li",function(){
  		index = $(this).index();
  		init();console.log("li");
     	if(!$play.hasClass("icon-zanting")){return}
     	player.play();
     	
  	});
    //列表中，点击哪首的下载图标就下载哪首
     $list3.on("click",".down",function(e){
     	e.stopPropagation();
  		$(this).addClass("download");
  		console.log("a",$(this).attr("href"));
  	});
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     //点击切换播放模式
     var modeIndex = 0;
     $mode.on("singleTap",function(){
     	modeIndex++;
     	if(modeIndex>3){
     		modeIndex=0
     	}
     	// 判断播放模式
		// 0:随机播放,1:单曲循环,2:列表播放,3:列表循环
     	switch (modeIndex){
     		case 0:
     		$mode.attr({class:"iconfont icon-suijibofang mode"});//随机
     			break;
     		case 1:
     		$mode.attr({class:"iconfont icon-danquxunhuan mode"});//单曲循环
     			break;
     		case 2:
     		$mode.attr({class:"iconfont icon-shunxubofang mode"});
     			break;
     		case 3:
     		$mode.attr({class:"iconfont icon-xunhuanbofang mode"});
     			break;
     		default:
     			break;
     	}
     });
     
      //设置播放完成的那刻，根据不同的模式执行对应的音乐接续
     player.onended = function(){
     	switch (modeIndex){
     		case 0:
     		    index = Math.floor(Math.random()*playlist3.length);//随机
     		    play();
     			break;
     		case 1:
     			play();//单曲循环
     			break;
     		case 2:
     			if(index<playlist3.length-1){         //列表播放
					index++;
					play();
				}
     			break;
     		case 3:
     			index++;
				play();                    //列表循环
     			break;
     		default:
     			break;
     	}
     }
     
     // 播放进度改变时触发
	// 播放过程一直触发
	var lrcIndex = 0,marginTop = 50; 
     player.ontimeupdate = function(){
		updateTime();
		//歌词同步
		
		if (parseInt(player.currentTime+0.2) < time[lrcIndex+1]){
			$lrc.find("li").eq(lrcIndex).addClass("current").siblings("li").removeClass("current");
		}else{
			lrcIndex++;
			$lrc.find("li").eq(lrcIndex).addClass("current").siblings("li").removeClass("current");
			marginTop = marginTop-9;
			$lrc.css({"margin-top":marginTop+"vw"});
		}
		
		
	}
     function initTime(){
     	var totalMin = parseInt(playlist3[index].seconds/60);
     	var totalSec = parseInt(playlist3[index].seconds%60);
//   	var totalMin = parseInt(player.duration/60);
//   	var totalSec = parseInt(player.duration%60);

     	totalMin = timeFactory(totalMin);
     	totalSec = timeFactory(totalSec);
		
		//跟新时间显示
		$currentTime.html("00:00");
		$durationTime.html(totalMin+":"+totalSec);
		//进度条值初始化为0
//		$progress.val(0);
     }
     function updateTime(){
     	var currentMin = parseInt(player.currentTime/60);
     	var currentSec = parseInt(player.currentTime%60);
     	
     	currentMin =timeFactory(currentMin);
     	currentSec =timeFactory(currentSec);
		
		//进度条同步
		$progress.val(player.currentTime/player.duration*100);
		//跟新时间显示
		$currentTime.html(currentMin+":"+currentSec);
		
		
     }
     function timeFactory(num){
     	return (num<10?"0"+num:num);
     }

     
     function init (){
     	//规范index值
     	if(index>=playlist3.length){
     		index = 0;
     	};
     	if(index<0){
     		index = playlist3.length-1
     	}
     	//歌曲索引变更
     	player.src = playlist3[index].url;
     	//变更图片
     	$img.attr("src",playlist3[index].smallPic);
     	//图片旋转角度为0
		$img.removeClass('playing');
     	//变更标题
     	$title.html(playlist3[index].songname+" - "+playlist3[index].singername);
     	//列表中对应的li高亮
		$list3.find("li").eq(index).addClass("songActive").siblings("li").removeClass("songActive");
     	//列表中对应的li自动滚动到可视区域中
     	$list3.find("li").eq(index)[0].scrollIntoView();
		    
		//进度条初始化为0    
		$("progress").val(0);
		
		
     	
		//歌词id同步
		songId = playlist3[index].songId;
		lrcData();
	//初始化时间
 		initTime();
     }
     
    //封装含检测处理序号后的播放函数
     function play(){
     	init();
		player.play();
     }
   
     //点击前一首
     $prev.on("singleTap",function(){
     	index--;init();
     	if(!$play.hasClass("icon-zanting")){return}
     	player.play();
     });
     //点击播放按钮
     $play.on("singleTap",function(){
     	if(player.paused){
     		player.play();
     	}else{
     		player.pause();
     	}
     })
     //点击下一首
     $next.on("singleTap",function(){
     	index++;
     	init();
     	if(!$play.hasClass("icon-zanting")){return}
     	player.play();
     });
     //点击喇叭，切换静音、静音取消
      $voice.on("singleTap",function(){
     	player.muted = !player.muted ;
     	if(player.muted){
     		$(this).addClass("icon-muted");
     	}else{
     		$(this).removeClass("icon-muted");
     	}
     });
     
    // 播放时触发
	player.onplay = function(){
		$play.addClass('icon-zanting');

		// 图片旋转效果
		$img.addClass('playing');
		$img.css("animationPlayState",'running');

		// 给当前播放歌曲添加高亮效果
		var li = $list3.find('li');
		li.eq(index).addClass('songActive').siblings("li").removeClass('songActive');
		
    }
	// 暂停时触发
	player.onpause = function(){
		$play.removeClass('icon-zanting');

		// 图片旋转效果
//		$img.removeClass('playing');
		$img.css("animationPlayState",'paused');
		
		//保持停播时的图片角度
		
   }
	//进度条点击调控
    $progress[0].onclick=function(e){
     	player.currentTime = (e.offsetX/this.offsetWidth)*player.duration;
     	
     	for (var i = 0;i<time.length;i++) {
     		if(parseInt(player.currentTime)<=time[i]){
     			lrcIndex = i-1;
     			marginTop = -i*9+50;
     			$lrc.css({"margin-top":marginTop+"vw"});
				console.log(parseInt(player.currentTime),time[i]);
				break;
     		}
     	}
     	
    };
   
})($);