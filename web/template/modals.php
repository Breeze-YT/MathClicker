
	<div class="modal fade" id="my64id">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title"><b>My Steam64Id</b></h4>
				</div>
				<div class="modal-body">
					<b><?php echo ($user)?$user['steamid']:''?></b>			</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>

	<div class="modal fade" id="settingsModal">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title"><b>Settings</b></h4>
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
				<div class="modal-footer">
					<button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
					<button type="button" class="btn btn-success" onclick="saveSettings()">Save changes</button>
				</div>
			</div>
		</div>
	</div>

	<div class="modal fade" id="promoModal">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title"><b>Redeem Promo Code!</b></h4>
				</div>
				<div class="modal-body">
					
					<div class="form-group">
						<label for="exampleInputEmail1">Promo code</label>
						<input type='text' class='form-control' id='promocode' value=''>				</div>				  	
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
					<button type="button" class="btn btn-success" onclick="redeem()">Reedem</button>
				</div>
			</div>
		</div>
	</div>

	<div class="modal fade" id="chatRules">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title"><b>Chat Rules</b></h4>
				</div>
				<div class="modal-body" style="font-size:24px">				  
					<ol>
						<li>No Spamming</li>
						<li>No Begging for Coins</li>
						<li>No Posting Promo Codes</li>
						<li>No CAPS LOCK</li>
						<li>No Promo Codes in Profile Name</li>
						</ol>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-success btn-block" data-dismiss="modal">Got it!</button>
				</div>
			</div>
		</div>
	</div>

	<div class="modal fade" id="confirmModal">
	    <div class="modal-dialog">
	        <div class="modal-content">
	            <div class="modal-header">
	                <div class="close" data-dismiss="modal">×</div>
	                <h4 class="modal-title"><b>Confirm</b></h4>
	            </div>
	            <div class="modal-body">                           
	                <label>Tradelink - <a href="https://steamcommunity.com/id/me/tradeoffers/privacy#trade_offer_access_url" target="_blank">Find my trade</a></label>
					<input type="text" class="form-control steam-input" id="tradeurl" value="<?=$_COOKIE['tradeurl']?>">
					<div class="checkbox">
				    	<label>
				      		<input type="checkbox" id="remember" checked=""> Remember tradelink
				    	</label>
					</div>
	            </div>
	            <div class="modal-footer">
	            <button class="btn btn-danger" data-dismiss="modal">Close</button>
	            <button class="btn btn-success" id="offerButton" onclick="offer()">Confirm</button>                
	            </div>
	        </div> 
	    </div>
	</div>	

<div class="modal fade" id="accept18year">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="close" data-dismiss="modal">×</div>
                <h4 class="modal-title"><b>Agreement on the use of the site</b></h4>
            </div>
            <div class="modal-body">                           
                <p>
                	Dear user, continuing to use our site, you agree to the user agreement and acknowledge that you are 18 years or more.
                </p>
                <p>
					If you do not agree with it and/or you are under 18, then immediately withdraw all the money from your account and do not continue the game, otherwise your account may be restricted/removed as a violation of the user agreement.
                </p>
            </div>
            <div class="modal-footer">
            <button class="btn btn-success" id="offerButton" onclick="redirectTologin()">I accept and confirm!</button>                
            </div>
        </div> 
    </div>
</div>	



<!-- dueal game -->
<div class="modal fade" id="duelgamemodal">
	<div class="modal-dialog" id="active_duel_games">
	
	</div>
</div>
