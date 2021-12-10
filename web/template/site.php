<!DOCTYPE html>
<html>
  <head>
    <title >CSGOEPOCH.COM - The world is ours</title>

	<meta charset="utf-8">
	<meta name="description" content="The most exclusive CS:GO betting platform with unique games &amp; a excellent community.">
	<meta name="fragment" content="!">
	<meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">

	<link rel="shortcut icon" href="favicon.ico">
	<link href="/template/css/animate.min.css" rel="stylesheet">
	<link href="/template/css/bootstrap.min.css" rel="stylesheet">
	<link href="/template/css/font-awesome.min.css" rel="stylesheet">
	<link href="/template/css/dataTables.bootstrap.min.css" rel="stylesheet">
  	<link href="/template/css/main.css?v=1.2" rel="stylesheet">
  	<link href="/template/css/jquery.cssemoticons.css?v=2" rel="stylesheet">
	<link href="/template/css/overwrite.css?v=1.2" rel="stylesheet">
	<link href="/template/css/duel.css?v=1.2" rel="stylesheet">
  </head>

  <body>

  	<div id="fb-root"></div>
	<script>(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "//connect.facebook.net/en_EN/sdk.js#xfbml=1&version=v2.8&appId=260098704343713";
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));</script>

    <div class="app" >
    <?php if($user) { ?>
      <div class="nav">
      	<nav class="navbar navbar-default">
      		<div class="container-fluid">
      			
      			<div class="navbar-header">
      				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        				<span class="sr-only">Toggle navigation</span>
        				<span class="icon-bar"></span>
        				<span class="icon-bar"></span>
        				<span class="icon-bar"></span>
      				</button>
      				<div class="logo">
      					<a href="http://csgoepoch.com/"><img src="/template/img/logo.png" alt=""></a>
      				</div>
              		<div class="balanceMobile">
    					<p><div id="mobilebalance" ><span>0</span></div><span>Coins <i style="cursor:pointer; margin-left: 5px;" class="fa fa-refresh noselect" id="getbal"></i></span></p>
    				</div>
      			</div>

      			<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      				<ul class="nav navbar-nav navbar-right">
		                <li title="Deposit"><a href="/deposit">Deposit</a></li>
		                <li title="Withdraw"><a href="/withdraw">Withdraw</a></li>
      					<li title="Tools" class="dropdown">
      			          <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Extras <span class="caret"></span></a>
      			          <ul class="dropdown-menu">
      			            <li title="History"><a href="history">History</a></li>
      			            
      			            <li title="Support"><a onclick="getPage('support')" href="/#support">Support</a></li>
      			            
      			            <li title="Terms"><a onclick="getPage('tos')" href="/#tos">Terms of Service</a></li>
      			          </ul>
      		          	</li>
		      	        <li title="Notifications" class="dropdown notifications">
		      	          <a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><i class="fa fa-bell"></i></a>
		      	          <ul class="dropdown-menu n-menu">
		      	          	<li class="special">Notifications</li>
		      	          	<div class="scrollable-content">
		      	          		<li class="none">You don't have any new notificaitons</li>
		      		            
		      	          	</div>
		      	          </ul>
		      	        </li>
      					<li title="Logout"><a href="api/logout"><i class="fa fa-power-off"></i></a></li>
      					<hr>
      					<li class="static" title="Online players"><a>Online: <span id="isonline">0</span></a></li>
      					<li class="social"><a target="_blank" href="https://www.facebook.com/csgoepoch/"><i class="fa fa-facebook"></i></a></li>
      					<li class="social"><a target="_blank" href="http://steamcommunity.com/groups/epochbets"><i class="fa fa-steam"></i></a></li>
      					
      					<a class="loginWrap" href="auth/steam"></a>
      					<div class="balance" >
      						<div class="wrap">
      							Coins: <div id="balance" ><span>0</span></div><span class="custom_affix"> <i style="cursor:pointer; margin-left: 5px;" class="fa fa-refresh noselect" id="getbal"></i></span>
      						</div>
      					</div>
      				</ul>
      			</div>

      		</div>
      	</nav>
      </div>
      <?php } ?>
       <?php if($user) { ?>
      <div class="main">
      	<div class="sidebar">
        	<ul class="menu">
        		<li class="games" id="gameMenu" title="Games">
	              <div class="arrow-left"></div><i class="fa fa-home" aria-hidden="true"></i>
	            </li>

        		<div class="gamesList">
              		<li class="game active" title="Roulette"><a href="/#roulette" onclick="getPage('roulette')" ><i class="fa fa-gamepad" aria-hidden="true"></i></a></li>
              		<li class="game" title="Duel Game"><a href="/#duel" onclick="getPage('duel')" ><i class="fa fa-hand-peace-o" aria-hidden="true"></i></a></li>
        		</div>
        		<hr>
        		<li data-name="chat" class="side leftmenupoint active"><i class="fa fa-wechat" aria-hidden="true"></i></li>
        		<li data-name="news" class="reg side leftmenupoint"><i class="fa fa-newspaper-o" aria-hidden="true"></i></li>
        		<li data-name="affiliate" id="affiliate" class="side leftmenupoint"><i class="fa fa-users" aria-hidden="true"></i></li>
        		<li data-name="settings" id="settings" class="leftmenupoint side"><i class="fa fa-cog" aria-hidden="true"></i></li>

        		<div class="bottom">
        			<li><i class="fa fa-question-circle" aria-hidden="true"></i></li>
        		</div>
        	</ul>


        	<div class="cont">
        		<div class="juerktoz chat" ng-show="sidebarView == 'chat'">
    				<ul id="contextMenu" class="dropdown-menu" role="menu" style="display:none">
						<li><a tabindex="-1" href="#" data-act="0">Username</a></li>
					    <li><a tabindex="-1" href="#" data-act="1">Mute player</a></li>
					    <li><a tabindex="-1" href="#" data-act="2">Kick player</a></li>
					    <li><a tabindex="-1" href="#" data-act="3">Send coins</a></li>
					    <li><a tabindex="-1" href="#" data-act="4">Ignore</a></li>
					</ul>			
	        	   	<div class="messages">
	        	   		<div class="divchat message" id="chatArea"></div>
	                  
		              	<div class="send">
		              		<textarea maxlength="250" id="chatMessage" type="text" class="dropup textarea" autocomplete="off"></textarea>
		              		<button id="sendMessage">Send</button>
		              	</div>
		                  
		              	<div class="extras">
		              		<a href="#" data-toggle="modal" class="rules" data-target="#chatRules">
		                    Rules
		                	</a>
		              	</div>
	              	</div>
            	</div>

        		<div class="juerktoz settings" style="display:none;">
	        	   	<div class="wrap">
	            		<div class="profile-img">
	            			<img class="img-responsive" alt="" src="<?php echo $user['avatar']; ?>">
	            		</div>
	            		<div class="name">
	            			<?php echo $user['name']; ?>
	            		</div>
	        		    <hr>

	            		<div class="f-group">
	            			<label>trade url: <a href="https://steamcommunity.com/id/me/tradeoffers/privacy" target="_blank">(find here)</a></label>
	            			<input placeholder="Trade URL" value="<?=$_COOKIE['tradeurl']?>" id="tradelnikinput" type="text">
	            		</div>

		            	<div class="modal-body">
							<form>	  			        	
											  
							  	<div class="checkbox">
							    	<label>
							      		<input type="checkbox" id="settings_confirm" checked>
							      		<strong>Confirm all bets over 10,000 coins</strong>
							    	</label>
							  	</div>
							  	<div class="checkbox">
							    	<label>
							      		<input type="checkbox" id="settings_sounds" checked>
							      		<strong>Enable sounds</strong>
							    	</label>
							  	</div>
							  	<div class="checkbox">
							    	<label>
							      		<input type="checkbox" id="settings_dongers">
							      		<strong>Display in $ amounts</strong>
							    	</label>
							  	</div>
							  	<div class="checkbox">
							    	<label>
							      		<input type="checkbox" id="settings_hideme">
							      		<strong>Hide my profile link in chat</strong>
							    	</label>
							  	</div>
							  	
							</form>
						</div>
			
	            		<div class="f-group">
	            			<button class="submit" onclick="saveTradelink();">Save Account</button>
	            		</div>
	            	</div>
	            </div>
        		
        		<div class="juerktoz news" style="display:none;">
        			<div class="fb-page" data-href="https://www.facebook.com/csgoepoch" data-tabs="timeline" data-width="265" data-height="100%" data-small-header="true" data-adapt-container-width="true" data-hide-cover="true" data-show-facepile="true"><blockquote cite="https://www.facebook.com/csgoepoch" class="fb-xfbml-parse-ignore"><a href="https://www.facebook.com/csgoepoch">CSGOEPOCH.com</a></blockquote></div>
        		</div>
        		<div class="juerktoz affiliate affiliateSidebar" style="display:none;">
					<div style="color:white;margin:20px; 0" class='text-center'>
						Your promocode is: <b><span id='thecode'></span> - <a href='#' id='changecode'>update</a></b>
					</div>     
					<table class="table">
						<tr><td>Affiliate level</td><td class="aff_level">-</td></tr>
						<tr><td>Visitors</td><td class="aff_visitors">-</td></tr>
						<tr><td>Depositors</td><td class="aff_depositors">-</td></tr>
						<tr><td>Total bet:</td><td class="aff_total_bet">-</td></tr>
						<tr><td>Lifetime Earnings</td><td class="aff_lifetime_earnings">-</td></tr>
						<tr><td>Available Now</td><td id='avail' class="aff_available">-</td></tr> 
					</table>

					<div class="text-right">
					    <button class="greenbtn btn-block" id="collect">Collect coins</button>
					</div>
					<br>
					<br>
         			<div class="redede"><br>
         				<h4 class="modal-title text-center"><b>Redeem Promo Code!</b></h4>
         				<br>
						<label for="exampleInputEmail1">Promo code</label>
						<input type='text' class='form-control' id='promocode' value='' placeholder="promocode"><br>
						<button type="button" class="greenbtn" onclick="redeem()">Reedem</button>
         			</div>
        		</div>
        	</div>
        </div>
         <?php } ?>
      	<div class="content">
      	
      		<div id="siteload">
	      		<div class="uiv angular-animate noButton bannerOpen">
		            <div class="wheel">
		              Loading...
		        	</div>
		        </div>

	      		<div class="loader-cont dontshow">
	      		    <div class="sk-folding-cube">
	      				<div class="sk-cube1 sk-cube"></div>
	      				<div class="sk-cube2 sk-cube"></div>
	      				<div class="sk-cube4 sk-cube"></div>
	      				<div class="sk-cube3 sk-cube"></div>
	      		    </div>
	      	  	</div>
	      	 </div>
      	</div>
      </div>

      <modals></modals>

      <div growl=""><div class="growl-container growl-fixed top-right" ng-class="wrapperClasses()"></div></div>
      <div growl="" reference="1" limit-messages="3" class="gameUpdate"><div class="growl-container growl-fixed top-right" ng-class="wrapperClasses()"></div></div>

    </div>
  </body>
  		<script>
		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

		  ga('create', 'UA-87004640-1', 'auto');
		  ga('send', 'pageview');

		</script>

		<script type="text/javascript" src="/template/js/jquery-1.11.1.min.js"></script>
		<script type="text/javascript" src="/template/js/jquery.cookie.js"></script>
		<script type="text/javascript" src="/template/js/noty/packaged/jquery.noty.packaged.js"></script>
		<script type="text/javascript" src="/template/js/socket.io-1.4.5.js"></script>
		<script type="text/javascript" src="/template/js/bootstrap.min.js"></script>
		<script type="text/javascript" src="/template/js/bootbox.min.js"></script>
		<script type="text/javascript" src="/template/js/jquery.dataTables.min.js"></script>
		<script type="text/javascript" src="/template/js/dataTables.bootstrap.js"></script>
		<script type="text/javascript" src="/template/js/tinysort.js"></script>
		<script type="text/javascript" src="/template/js/expanding.js"></script>
		<script src="https://www.google.com/recaptcha/api.js?onload=loadCaptcha&render=explicit" async defer></script>	
		<script type="text/javascript" src="/template/js/offers.js?v=<?=time()?>"></script>		
		<script type="text/javascript" src="/template/js/main.js?v=<?=time()?>"></script>
		<script type="text/javascript" src="/template/js/noty/packaged/jquery.noty.packaged.js"></script>		
		<script src="/template/js/jquery.cssemoticons.min.js"></script>
		<script src="/template/js/helper.js"></script>
</html>
