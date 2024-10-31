<div id="content" class="dev">
	<?php
		if (intval($_GET['d'])==0) {
			// all devs
			echo 'all devs';

			//
		}else{
			// dev by id


			$dev=intval($_GET['d']);
			if(!folder_exist('d/'.$dev)){ nope(); }

			$file = 'd/'.$dev.'/user.json';
			if (file_exists($file)) {
				$devSource = file_get_contents($file);
				$devData = json_decode($devSource, true);
				?>

				<table class="mono">
					<tr><td>
					<img src="./d/<?php echo $dev;?>/avatar.png" class="img100 avatar">
					</td>
					<td>

						<h2 class="name"><b><?php echo $devData['name'];?></b></h2>
						<div class="about"><i><?php echo $devData['about'];?></i></div>
						<div class="country">Country: <?php echo $devData['country'];?>
						<div class="birth">Developer since: <span class="date"><?php echo $devData['birth'];?></span></div>
						<div class="site">Website: <?php echo "<a href='".$devData['site']."' target='blank'>".$devData['site']."</a>";?></div>

					</td></tr></table>

					<h3><?php echo $devData['name'];?>'s apps</h3>
					<div class="apps">

					<table>
					    <thead>
					        <tr>
					            <th>Name</th>
					            <th>icon</th>
					            <th>category</th>
					            <th>likes</th>
					            <th>version</th>
					            <th>Date</th>
					        </tr>
					    </thead>
					   	<tbody>

						<?php

							for ($i=count($devData['apps'])-1; $i >= 0; $i--) {  
						?>
								<tr>		
								

									<?php 
										$file = 'a/'.$devData['apps'][$i].'/app.json';
										$appSource = file_get_contents($file);
										$appData = json_decode($appSource, true);
										// $devData['apps'][$i];
									?>
									<td><a href="./?a=<?php echo $devData['apps'][$i];?>"><?php echo $appData['name']; ?></a></td>
									<td class="icon"><img src="<?php echo 'a/'.$devData['apps'][$i].'/icon.png'; ?>"></td>
									<td><?php echo $appData['category']; ?></td>
									<td><?php echo $appData['likes']; ?></td>
									<td><?php echo $appData['version']; ?></td>
									<td class="date"><?php echo $appData['date']; ?></td>

								
								</tr>		
							<?php
							}
						?>

						</tbody>
							

					</div>
					


					


				<?php
			}else{
				nope();
			}





			//
		}
	?>
</div>