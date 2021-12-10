<?php 
	require_once('../config/config.php');
	$sql = $db->query('SELECT `id` FROM `bots`');
	$bots = array();
	while ($row = $sql->fetch()) {
		$bots[] = $row['id'];
	}
?>

<div class="text-center">					
	<div >
		<div class="alert alert-danger text-center">
		  <b><i class="fa fa-exclamation-triangle"></i>  Do not attempt to modify the trade offer sent by our bots - these trades will be declined with no refunds!</b>
		</div>

		<div class="alert alert-info text-center">
		  <b><i class="fa fa-exclamation-triangle"></i>  First You must deposit more than 5$.</b>
		</div>

		<div class="alert alert-info text-center norobots">
			<b>To prevent the use of bots from accessing the bank please complete the following CAPTCHA to continue:</b><br><br>
			 <div id="captcha_container" class="g-recaptcha" style="display:inline-block" ></div>
		</div>

		<div id="inlineAlert" class="alert" style="font-weight:bold"></div>

		<div class="panel panel-default text-left" id="offerPanel" style="display:none">
		  	<div class="panel-heading">
				<h3 class="panel-title"><b>Trade offer sent <i class="fa fa-download"></i></b></h3>
		  	</div>
				<div class="panel-body">
				<span id="offerContent" style="line-height:34px"></span>
				<div class="pull-right"><button class="btn btn-success" id="confirmButton" data-tid="0">Complete</button></div>
				<div><b style="color:red">Please click confirm after accepting the trade.</b></div>
			</div>
			<br>
		</div>

		<div class="panel panel-default text-left col-xs-8">
			<div class="panel-heading">
				<h3 class="panel-title"><b>Bank : <span id="left_number">0</span> items</b></h3>
			</div>
			<div class="panel-body">				
	            <div class="btn-group" id="botFilter" style="margin-bottom:10px">
	            	<label class="btn btn-default active" data-bot="0">All</label>
	            	<?php
	            		foreach ($bots as $key) {
	            	?>
	            	<label class="btn btn-default" data-bot="<?=$key?>">Bot <?=$key?></label>
	            	<?php
	            		}
	            	?>
	            </div>
	            
				<div style="margin-bottom:10px">		
					<div style="display:inline-block;float:right">
						<form class="form-inline">
							<select class="form-control" id="orderBy">
								<option value="0">Default</option>
								<option value="1" selected>Price descending</option>
								<option value="2">Acending price</option>
								<option value="3">Name A-Z</option>
							</select>
						</form>
					</div>

					<div style="overflow:hidden;padding-right:2px">
						<input type="text" class="form-control" id="filter" placeholder="Search..." style="width:100%">
					</div>
				</div>  

				<div id="left" class="slot-group noselect">
					<span class="reals"></span>
					<span class="bricks">
						<div class="placeholder"></div>
						<div class="placeholder"></div>
						<div class="placeholder"></div>
						<div class="placeholder"></div>
						<div class="placeholder"></div>
						<div class="placeholder"></div>
						<div class="placeholder"></div>
						<div class="placeholder"></div>
						<div class="placeholder"></div>
						<div class="placeholder"></div>
						<div class="placeholder"></div>
						<div class="placeholder"></div>
					</span>		
				</div>						
			</div>						
		</div>

		<div class="panel panel-default text-left col-xs-3" style="vertical-align:top">
			<div class="panel-heading">
				<h3 class="panel-title"><b>Withdraw</b></h3>
			</div>

			<div class="panel-body">
				<button class="btn btn-danger btn-lg" style="width:100%" onclick="showConfirm()" id="showConfirmButton">Display items<div style="font-size:12px"><span id="sum">0</span> Coins | Balance : <span id="availlll">0</span><br> Available : <span id="available">0</span></div></button>				
				<div id="right" class="slot-group noselect">
					<span class="reals"></span>
					<span class="bricks">
										
					</span>								
				</div>																										
			</div>						
		</div>
	</div>
</div>
