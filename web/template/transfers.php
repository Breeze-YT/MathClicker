<div class="container">
	<br>
	<table class='table table-striped dataTable no-footer'>
		<thead>
			<th>Transfer ID</th>
			<th>From</th>
			<th>To</th>
			<th>Amount</th>
			<th>Note</th>
			<th>Time</th>
		</thead>
		<tbody>
		<?php foreach($transfers as $key => $value): ?>
			<tr>
				<td><?=$value['id']?></td>
				<td><?=($value['from1'] == $user['steamid'])?'YOU':'<a href="http://steamcommunity.com/profiles/'.$value['from1'].'/" target="_blank">'.$value['to1'].'</a>'?></td>
				<td><?=($value['to1'] == $user['steamid'])?'YOU':'<a href="http://steamcommunity.com/profiles/'.$value['to1'].'/"" target="_blank">'.$value['to1'].'</a>'?></td>
				<td><?=$value['amount']?></td>
				<td></td>
				<td><?=date('Y-m-d H:i:s', $value['time'])?></td>
			</tr>
		<?php endforeach; ?>
		</tbody>
	</table>		
</div>
