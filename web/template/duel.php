<div class="coinflip">
	<div class="flex">
		<div class="previous col">
			<div id="prevgames" class="body">
			</div>
		</div>

		<div class="current col">
			<div class="header">
				<div class="create" id="create_duel_game">
					<div>Create Game</div>
				</div>
				<div class="creating" id="duel_game_bet_form" style="display:none;">
					<i id="cancel_duel_game" class="fa fa-plus" aria-hidden="true"></i>
					<h2>Create Game</h2>
					<div class="f-group">
						<div class="f-group">
							<div class="quick-select">
								<span class="betshort" data-action="clear">Clear</span>
								<span class="betshort" data-action="10">+10</span>
								<span class="betshort" data-action="100">+100</span>
								<span class="betshort" data-action="1000">+1,000</span>
								<span class="betshort" data-action="half">1/2</span>
								<span class="betshort" data-action="double">x2</span>
								<span class="betshort" data-action="max">Max</span>
							</div>
						</div>
					</div>
					<div class="f-group">
						<label>Wager</label>
						<input id="betwager" type="number">
					</div>
					<button class="submit" id="add_duel_game">Create Now</button>
				</div>
			</div>
			<div id="current_game_list" class="body">
				
			</div>
		</div>
	</div>
</div>
