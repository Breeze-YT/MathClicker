<style type="text/css">
.panel-body{
	color:#fff;
}
</style>
<div class="col-xs-12" style="margin-bottom:20%">
	<!-- <div class="alert alert-warning">
		You have <a href="?open"><?=$open?> open tickets</a> and <a href="?closed"><?=$closed?> closed tickets</a>.
	</div> -->

	<?php if(isset($_GET['new'])) { ?>
	<div class="panel panel-info text-left">
		<div class="panel-heading">
			<input id="ticketTitle" type="text" class="form-control" placeholder="Title..." maxlength="100">
		</div>
		<div class="panel-body">
			<select class="form-control" id="ticketCat">
			    <option value="0">Category...</option>
			    <option value="1">Deposit / Withdraw</option>
			    <option value="2">Rates</option>
			    <option value="3">Adversitment</option>
			    <option value="4">Other</option>
			</select>
			<br>
			<textarea id="text0" class="form-control" rows="10" placeholder="Description..."></textarea><br>
			<button data-x="0" type="button" class="btn btn-danger btn-block support_button">Apply</button>
		</div>
	</div>

	<?php } elseif(isset($_GET['closed'])) { 
			foreach ($tickets as $key => $value) { 
	?>
		<div class="panel panel-info text-left">
			<div class="panel-heading"><h4><?=$value['title']?></h4></div>
				<div class="panel-body">
	<?php foreach ($value['messages'] as $key2 => $value2) { ?>
					<div class="alert alert-<?=($user['steamid']==$value2['user'])?'info':'warning'?> bubble"><?=$value2['message']?></div>
	<?php } ?>
				</div>
		</div>
	<?php } ?>
	<?php } elseif(isset($_GET['open'])) { ?>
		<div class="panel panel-info text-left">
			<div class="panel-heading"><h4><?=$ticket['title']?></h4></div>
			<div class="panel-body">
	<?php foreach($ticket['messages'] as $key => $value): ?>
					<div class="alert alert-<?=($user['steamid']==$value['user'])?'info':'warning'?> bubble"><?=$value['message']?></div>
	<?php endforeach; ?>
				<div class="alert alert-info">
					<textarea id="text<?=$ticket['id']?>" class="form-control" rows="3" placeholder="Reply..."></textarea>
					<label><input id="check<?=$ticket['id']?>" type="checkbox"> Close Ticket</label>
					<button data-x="<?=$ticket['id']?>" type="button" class="btn btn-success btn-block support_button">Reply</button>
				</div>
			</div>
		</div>
	<?php } else { ?>
		
	<div class="panel panel-info">
	  <div class="panel-heading"><h4>How do I send coins to people??</h4></div>
	  <div class="panel-body">
	    <p>To send coins use the chat command "/send [steam64id] [amount]".</p>

	    <p>For example, to send 100 coins to steam64id 76561198160884702 you'd type "/send 76561198160884702 100".".</p>

	    <p>Alternatively right click the person's avatar in chat and select "Send coins.</p>

	    <p>To find your steam64id you can use sites like <a target="_blank" href="https://steamid.io/lookup">steamid.io</a></p>

	  </div>
	</div>

	<div class="panel panel-info">
	  <div class="panel-heading"><h4>How do I get more coins? Can I have free coins??</h4></div>
	  <div class="panel-body">
	    <p>Coins are obtained by depositing CS:GO skins. If you've used up the free 100 coins you'll need to make a deposit to get more..</p>

	    <b>DO NOT contact support asking for coins.</b>
	  </div>
	</div>

	<div class="panel panel-info">
	  <div class="panel-heading"><h4>How do I generate a referral code?</h4></div>
	  <div class="panel-body">
	    <p>To generate your own referral code please visit the affiliates page located here. <a target="_blank" href="/affiliates">affiliates</a>.</p>
	  </div>
	</div>

	<div class="panel panel-info">
	  <div class="panel-heading"><h4>I accepted the trade offer but never got coins!?</h4></div>
	  <div class="panel-body">
	    After accepting the trade offer you must wait a few minutes and you'll receive the coins.
		If you don't get your coins directly then please wait a few minutes.
		Write a support ticket only if you still haven't got your coins after 2 hours.
	  </div>
	</div>

	<div class="panel panel-info">
	  <div class="panel-heading"><h4>Error when sending trade offer. Mobile Verification not enabled or Steam Lagging.</h4></div>
	  <div class="panel-body">
	    <b>Possible solutions:</b>
		<br>
		- Wait 7 days after you active your Steam Mobile Verification.
		<br>
		- Make your Steam Profile & Inventory public..
		<br>
		- Check if the trade url you set is correct.
		<br>
		- Check if steam isn't delayed. Steam Status
		<br>
		If you are sure that none of these reasons are the problem then please retry a few times in a different hour.
	  </div>
	</div>
	
	<div class="panel panel-info">
	  <div class="panel-heading"><h4>I keep getting "connection lost..."!</h4></div>
	  <div class="panel-body">
	    <b>Please do the following points and then try:</b>
		<br>
		- Please do the following points and then try.
		<br>
		- Clear your browser cookies and cache.
		<br>
		- Restart your router.
		<br>
		Then please start refreshing the site until you suddenly get connected.
	  </div>
	</div>
	<!-- <a class="btn btn-danger btn-lg btn-block" href="?new">You need more help? Send a ticket to support</a> -->
	 <?php } ?>
</div>
