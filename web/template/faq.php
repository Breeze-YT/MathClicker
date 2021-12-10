<div class="col-xs-12 whitecolor">
     <div class="col-md-3" style="position:static;top:50px">
		<div class="list-group">
			<li class="list-group-item active">To start</li>
			<a href="#q1" class="list-group-item">What CSGOEPOCH.COM?</a>

			<li class="list-group-item active">deposits</li> 
			<a href="#q2" class="list-group-item">How much coins ?</a>
			<a href="#q3" class="list-group-item">How prices are set ?</a>
			<a href="#q4" class="list-group-item">My articles do not appear in the deposits ?</a>
			<a href="#q5" class="list-group-item">I put things , but did not get a coin ?</a>
			<a href="#q6" class="list-group-item">Will be I able to withdraw the coin , if I rejected the operation?</a>
			<a href="#q7" class="list-group-item">Why bot canceled my exchange ?</a>

			<li class="list-group-item active">Print</li> 
			<a href="#q13" class="list-group-item">What is Anti -trade system ?</a>

			<li class="list-group-item active">Honesty</li>
			<a href="#q8" class="list-group-item">What is the control of integrity ?</a>
			<a href="#q9" class="list-group-item">How it works?</a>
			<a href="#q10" class="list-group-item">How can I check the result of the event?</a>
			<li class="list-group-item active">Referral system</li>
			<a href="#q11" class="list-group-item">How works the referral system?</a>
			<a href="#q12" class="list-group-item">What is the referral level?</a>
		</div>
     </div>

    <div class="col-md-9">
        <h4 id="q1" style="margin-top:0px" class="text-warning">What CSGOEPOCH.COM?</h4>
            <p>CSGOEPOCH.COM is a brand new way to gamble CS:GO skins. We are NOT a jackpot site – instead players deposit skins for credits and bet those credits on a roulette inspired game, with teams:</p><p>Bet 1-7 (red, TEAM-1) or 8-14 (black, TEAM-2) for DOUBLE your credits. Bet 0 (green, Chicken Win) for FOURTEEN times your credits.</p><p>It doesn't matter how big your inventory is, or how much you bet, your odds are always the same.</p><p>Bets occur in real time, across the entire site, meaning you bet, win, and lose along with other players.</p><p>All rolls are generated using a provably fair system – ensuring a fair roll each and every time. This "matches" only random generated.</p>
        <h4 id="q2" class="text-warning">How much are credits worth?</h4>
            <p>Credits have no real-life value. Instead they are exchanged for CS:GO items from our public shop. Every 1000 credits will buy you roughly $1 worth of items. See below for more information.</p>
        <h4 id="q3" class="text-warning">How are prices determined?</h4>
            <p>Baseline prices are determined using publicly available data from SteamAnalyst. Some items are not accepted due to price, volatility, or popularity. Furthermore the following discounts are applied:</p><table class="table"><tbody><tr><th>Price</th><th>You will get</th></tr><tr><td>0.00 - 0.30</td><td>Not accepted</td></tr><tr><td>0.30 - 5.00</td><td>20% less</td></tr><tr><td>5.00 - 10.00</td><td>10% less</td></tr><tr><td>10.00+</td><td>Full price</td></tr><tr><td>Stickers</td><td>10% less + (% of value)</td></tr></tbody></table><p></p>
        <h4 id="q4" class="text-warning">My items are not showing up for deposit?</h4>
            <p>First, make sure your inventory is set to public.</p><p>By default CSGOEPOCH.COM loads items from cache. Occasionally this may become out of date. To load directly from Steam (and update the cache) click the “force reload” button.</p>
        <h4 id="q5" class="text-warning">I've deposited but haven't received my credits!?</h4>
            <p>After accepting the trade offer you must “confirm” the deposit by clicking the confirm button under the “incoming trade offer” panel. This allows our system to verify that the offer has been accepted – only then will the credits be forwarded to your account.</p>
        <h4 id="q6" class="text-warning">Will I be refunded if I decline a withdraw?</h4>
            <p>Yes. If you decline the trade offer for any reason (or it expires) you will be refunded the full amount after “confirming” with our system.</p>
        <h4 id="q7" class="text-warning">Why did the bot cancel my trade offer?</h4>
            <p>Our bots automatically cancel trade offers older than 10 minutes to make room for new trade offers. If you're unable to respond within 10 minutes simply “confirm” the old trade offer and try again.</p>
        <h4 id="q8" class="text-warning">What is Provably Fair?</h4>
            <p>Provably fair is a way of generating random numbers using cryptography such that the results can be verified by a third party. This means the operators cannot manipulate the outcome of any roll. In short, we use the results of a state run lottery to seed our RNG (random number generator) – for a detailed explanation see below.</p>
        <h4 id="q9" class="text-warning">How does it work?</h4>
            <p>Each roll is computed using the SHA-256 hash of 3 distinct inputs.</p><p>First, is the server seed. This is a precomputed value generated by CSGOEPOCH.COM some time in the past. Seeds are generated in a chain such that today's seed is the hash of tomorrow's seed. Since there is no way to reverse SHA-256 we can prove each seed was generated in advance by working backwards from a precomputed chain.</p>
        <h4 id="q10" class="text-warning">How can I check the result of the event?</h4>
            <p>You can execute PHP code straight from your web browser with tools like <a href="http://www.phptester.net/" target="_blank">PHP Tester</a>. Simply copy-paste the following code into the window and replace the server_seed, lotto, and round_id values for your own. Execute the code to verify the roll.</p>
            <pre>
            	$server_seed = "7f7fde85498ea7e4a76ce8e78ae98e5ad35333de63e3cfe62cc65bb3fa77d906";
                $round_id = "555";
                $hash = hash("sha256",$server_seed."-".$round_id);
                $roll = hexdec(substr($hash,0,8)) % 15;
                if($roll == 0) {
                    echo "Round $round_id = $roll (Green won)";
                } elseif(($roll > 0) && ($roll < 8)) {
                    echo "Round $round_id = $roll (Red won)";
                } elseif(($roll > 7) && ($roll < 15)) {
                    echo "Round $round_id = $roll (Grey won)";
                    }
			</pre>
            <p>Notice how any change to the lottery results radically changes the rolls.</p><p>Note that you'll be unable to verify rolls until the server seed is disclosed at 00:00 (MSK).</p>
        <h4 id="q11" class="text-warning">How does the affiliate system work?</h4>
            <p>The affiliate system lets anyone earn credits by referring new players to the site. Visit the affiliate dashboard to generate your unique referral code. Share with friends, in forum signatures, or on social media.</p><p>When new players use your referral code they'll earn 100 FREE credits. And you'll earn credits every time your referrals place a bet – regardless if they win or lose.</p>
        <h4 id="q12" class="text-warning">What is affiliate level?</h4>
            <p>Your affiliate level determines how much (%) you'll earn from each referral. Your affiliate level is determined by the amount of unique depositors you've referred:</p><p></p><table class="table"><tbody><tr><th>Unique Depositors</th><th>Affiliate Level</th></tr><tr><td>0</td><td>Silver IV (1 coin per 300 bet)</td></tr><tr><td>50</td><td>Legendary Eagle (1 coin per 200 bet)</td></tr><tr><td>200+</td><td>Global Elite (1 coin per 100 bet)</td></tr></tbody></table><p>You can track your visitor statistics from the dashboard. A green check mark indicates that the player has made at least one deposit (the amount of the deposit does not matter). While you'll earn a % from all visitors only those who've made at least one deposit count towards the affiliate level.</p><p>Note that for privacy reasons complete steam id's are obscured.</p><p>When leveling up your new % is applied to all previous earnings. For example, if you've earned 100k as Bronze affiliate, your earnings will instantly jump to 200k when reaching Silver, and then 300k when reaching Gold – even if none of your referrals or new depositors placed any bets during that time.</p>               
        <h4 id="q13" class="text-warning">What is the Anti-Trade System?</h4>
            <p>The Anti-Trade system is to prevent users that just deposit to withdraw other items without even playing on the site.</p><p>We call them traders, they want to make profit from such situation. To prevent this we have added a system where you need to place bets worth half of the amount you want to withdraw.</p><p>Each withdraw will lower your available coins to withdraw and of course balance.</p>
    </div>
</div>
