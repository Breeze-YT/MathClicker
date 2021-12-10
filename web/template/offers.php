<div class="container">
	<br>
	<table class='table table-striped dataTable no-footer'>
		<thead>
			<th>Trade number</th>
			<th>Bot</th>
			<th>Code</th>
			<th>Coins</th>
			<th>Status</th>
			<th>Accept</th>
		</thead>
		<tbody>
		<?php foreach($offers as $key => $value): ?>
			<tr>
				<td><?=$value['id']?></td>
				<td>CSGOODLUCK BOT #<?=$value['bot_id']?></td>
				<td><?=$value['code']?></td>
				<td>
					<span class='text-<?=($value['summa']>0)?'success':'danger'?> muted'><?=($value['summa']>0)?'+'.$value['summa']:$value['summa']?></b></span>
				</td>
				<td>
					<span class='text-<?=($value['status']>=1)?'success':'danger'?>'><?=($value['status']>=1)?'Completed':'Error'?></span>
				</td>
				<td>
					<i class='fa fa-<?=($value['status']>=1)?'check':'close'?> text-<?=($value['status']>=1)?'success':'danger'?>'></i>
				</td>
			</tr>
		<?php endforeach; ?>
		</tbody>
	</table>		
</div>
