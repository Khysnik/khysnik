<div id="content" class="app">
	<?php
		if (intval($_GET['a'])==0) {
			// all apps
			echo 'all apps';

			//
		}else{
			// app by id


			$app=intval($_GET['a']);
			if(!folder_exist('a/'.$app)){ nope(); }

			$file = 'a/'.$app.'/app.json';
			if (file_exists($file)) {
				$appSource = file_get_contents($file);
				$appData = json_decode($appSource, true);
			
				?>
					<table class="mono">
						<tr>
							<td>
								<img src="./a/<?php echo $app;?>/icon.png" class="img100">
								<button onclick="window.parent.alert('yo');">Install</button>
								<button>Rate</button>
							</td>
							<td>
								<h2><?php echo $appData['name']?></h2>
								<div class='padLeft'>
									<div class='desc'><b>Description</b><br>
									<?php echo $appData['about'];?></div>
									<div class='author'><b>Author(s)</b><br>
									<?php 
										for ($i=0; $i < count($appData['dev']); $i++) { 
											echo '<div>'; printDev($appData['dev'][$i]); echo '</div>';
										}
									?></div>
									<div class="infos">
										<div><b>Category</b> <?php echo $appData['category'];?></div>
										<div><b>Version</b> <?php echo $appData['version'];?></div>
										<div>
											<b>Uploaded on </b><span class='date'><?php echo $appData['date'];?></span>
										</div>
									</div>
								</div>
								<div>
									<div><b>Screenshot</b></div>
									<img src="./a/<?php echo $app;?>/screenshot.png" class="screenshot">
								</div>
							</td>
						</tr>
					</table>

				<?php


			}




			//
		}
	?>
</div>