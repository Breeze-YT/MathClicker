<?php 
	require_once('../config/config.php');

	if(isset($_GET['id'])) {
		$id = $_GET['id'];
		if(!preg_match('/^[0-9]+$/', $id)) exit();
		$sql = $db->query('SELECT * FROM `hash` WHERE `id` = '.$db->quote($id));
		$row = $sql->fetch();
		$sql = $db->query('SELECT * FROM `rolls` WHERE `hash` = '.$db->quote($row['hash']));
		$row = $sql->fetchAll();
		$rolls = array();
		foreach ($row as $key => $value) {
			if($value['id'] < 10) {
				$q = 0;
				$z = substr($value['id'], -1, 1);
			} else {
				$q = substr($value['id'], 0, -1);
				$z = substr($value['id'], -1, 1);
			}
			if(count($rolls[$q]) == 0) {
				$rolls[$q]['time'] = date('h:i A', $value['time']);
				$rolls[$q]['start'] = substr($value['id'], 0, -1);
			}
			$rolls[$q]['rolls'][$z] = array('id'=>$value['id'],'roll'=>$value['roll']);
		}
	} else {
		$sql = $db->query('SELECT * FROM `hash` ORDER BY `id` DESC');
		$row = $sql->fetchAll();
		$rolls = array();
		foreach ($row as $key => $value) {
			$s = $db->query('SELECT MIN(`id`) AS min, MAX(`id`) AS max FROM `rolls` WHERE `hash` = '.$db->quote($value['hash']));
			$r = $s->fetch();

			if($r['min']) {
				$rolls[] = array('id'=>$value['id'],'date'=>date('Y-m-d', $value['time']),'seed'=>$value['hash'],'rolls'=>$r['min'].'-'.$r['max'],'time'=>$value['time']);
			}
		}
	}
?>

<div class="col-xs-12">
<?php if(isset($_GET['id'])) { ?>
	<table class="table whitecolor">
		<thead>
			<tr>
				<th>Time</th>
				<th>Round</th>
				<th>0</th>
				<th>1</th>
				<th>2</th>
				<th>3</th>
				<th>4</th>
				<th>5</th>
				<th>6</th>
				<th>7</th>
				<th>8</th>
				<th>9</th>
			</tr>
		</thead>
		<tbody>
			<?php foreach($rolls as $key => $value) { ?>
				<tr>
					<td><?php echo $value['time']; ?></td>
					<td><?php echo $value['start']; ?>_</td>
					<?php 
						for($i = 0; $i <= 9; $i++) {
							if($value['rolls'][$i]) {
								$r = $value['rolls'][$i];
								if($r['roll'] == 0) {
									$z = ' class="td-val ball-0" id="'.$r['id'].'"';
								} elseif(($r['roll'] > 0) && ($r['roll'] < 8)) {
									$z = ' class="td-val ball-1" id="'.$r['id'].'"';
								} elseif(($r['roll'] > 7) && ($r['roll'] < 15)) {
									$z = ' class="td-val ball-8" id="'.$r['id'].'"';
								}
								echo '<td'.$z.'>'.$r['roll'].'</td>';
							} else {
								echo '<td></td>';
							}
						} 
					?>
					<?php } ?>
		</tbody>
	</table>
	<?php } else { ?>
	<div class="whitecolor">
		<div>
			<h3 class="panel-title"><b>Provably Fair <i class="fa fa-lock"></i></b></h3>
		</div>

		<div class="panel-body">
			<p>All rolls on CSGOEPOCH.COM are generated using a provably fair system. This means the operators cannot manipulate the outcome of any roll. Players may replicate any past roll using the below code:</p>
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
			<p>
				You can execute PHP code straight from your web browser with tools like <a href="http://phptester.net/" target="_blank">PHP Tester</a>. 
				Simply copy-paste the code into the window and replace the server_seed, lotto, and round_id values for your own. Execute the code to verify the roll.
				For more information about provably fair.
			</p>
			<p>
				For more information about provably fair <a href="/faq">Visit our FAQ</a>.
			</p>

		</div>
	</div>

	<table class='table whitecolor'>
		<thead>
			<tr>
				<th>Date</th>
				<th>Server seed</th>
				<th>Rolls</th>
			</tr>
		</thead>
		<tbody>
		<?php 
		foreach($rolls as $key => $value): 
			$value['date'] = date("Y-m-d", $value['time']/1000);
		?>
			<tr>
				<td><?php echo $value['date'];?></td>
				<td>
					<b class='text-<?php if($key==0){echo 'danger';}else{echo 'success';}?>'>
						<?php if($key==0) {echo "<i class='fa fa-lock fa-fw'></i> SERVER SEED IN USE </b> ";}else{echo "<i class='fa fa-check-circle fa-fw'></i>".$value['seed'];} ?>
					</b>
				</td>
				<td>
					<a onclick="getHistorydetails(<?php echo $value['id'];?>) "href='#'><?php echo $value['rolls'];?></a>
				</td>
			</tr>
		<?php endforeach; ?>
		</tbody>
	</table>
	<?php } ?>
</div>	
