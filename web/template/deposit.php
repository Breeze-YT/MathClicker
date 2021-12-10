<div class="text-center">
	<div>
		<div class="alert alert-info">
			<b><i class="fa fa-exclamation-circle"></i> After confirming the trade please click "Get coins" | Minimum deposit is 0.5 $ - 500 coins.</b>
		</div>

		<div id="inlineAlert" class="alert alert-success" style="font-weight:bold"><i class="fa fa-check"></i><b> Loading items...</b></div>
		
		<div class="panel panel-default text-left" id="offerPanel" style="display:none">
		  	<div class="panel-heading">
				<h3 class="panel-title"><b>Trade sent <i class="fa fa-download"></i></b></h3>
		  	</div>
				<div class="panel-body">
				<span id="offerContent" style="line-height:34px"></span>
				<div class="pull-right"><button class="btn btn-success" id="confirmButton" data-tid="0">Get coins</button></div>
			</div>
		</div>


		<div class="panel panel-default text-left col-xs-8">
			<div class="panel-heading">
				<h3 class="panel-title"><b>Inventory : <span id="left_number">0</span> items</b></h3>
			</div>
			<div class="panel-body">				
				
	            
	            
				<div style="margin-bottom:10px">						
					<div style="display:inline-block;float:right">
						<form class="form-inline">
							<select class="form-control" id="orderBy">
								<option value="0">Default</option>
								<option value="1">Price descending</option>
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
						
					</span>		
				</div>						
			</div>						
		</div>
		<div class="panel panel-default text-left col-xs-3" style="vertical-align:top">
			<div class="panel-heading">
				<h3 class="panel-title"><b>Deposit</b></h3>
			</div>
			<div class="panel-body">
				<button class="btn btn-success btn-lg" style="width:100%" onclick="showConfirm()" id="showConfirmButton">Deposit items<div style="font-size:12px"><span id="sum">0</span> coins</div></button>				
				<div id="right" class="slot-group noselect">
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
					</span>								
				</div>																										
			</div>						
		</div>
	</div>
</div>
