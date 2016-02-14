<?php 

	ini_set('max_execution_time', 0);

	$cryptKey = array(
		'A1'  => 'njik', 'A2'  => 'yret', 'A3'  => 'hunp', 'A4'  => 'jufg', 'A5'  => 'tlit', 'A6'  => 'ygcc', 'A7'  => 'hfin', 'A8'  => 'ppzf',	
		'B1'  => 'ayib', 'B2'  => 'opdb', 'B3'  => 'gcgf', 'B4'  => 'olfz', 'B5'  => 'bhyf', 'B6'  => 'qwrh', 'B7'  => 'kjof', 'B8'  => 'uege', 
		'C1'  => 'bauj', 'C2'  => 'qwfs', 'C3'  => 'knzg', 'C4'  => 'jiaq',	'C5'  => 'bhfa', 'C6'  => 'hzgt', 'C7'  => 'okfs', 'C8'  => 'gjik', 
		'D1'  => 'uytq', 'D2'  => 'mbpr', 'D3'  => 'lajf', 'D4'  => 'nvck', 'D5'  => 'abfg', 'D6'  => 'bjga', 'D7'  => 'nigs', 'D8'  => 'bgua',
		'E1'  => 'jogj', 'E2'  => 'ojqr', 'E3'  => 'badg', 'E4'  => 'nkfe', 'E5'  => 'pikq', 'E6'  => 'nasd', 'E7'  => 'gnkh', 'E8'  => 'pqmj',
		'F1'  => 'bkhr', 'F2'  => 'iqrq', 'F3'  => 'lhmn', 'F4'  => 'ngii', 'F5'  => 'qbir', 'F6'  => 'jggq', 'F7'  => 'nbqb', 'F8'  => 'qvro',
		'G1'  => 'bnok', 'G2'  => 'hoht', 'G3'  => 'higt', 'G4'  => 'mhpo', 'G5'  => 'qjah', 'G6'  => 'gnjg', 'G7'  => 'ynhe', 'G8'  => 'bzgi'
	);	

	for ($i=1;$i<101;$i++) {

		foreach ($cryptKey as $key => $value){

			if (file_exists("images/puzzles/".$i."/".$key.".png")) {
				rename("images/puzzles/".$i."/".$key.".png", "images/puzzles/".$i."/".$value.".PNG");					
			}	
		}
		
	}
	/*$text = file_get_contents("exp/infa.txt");

	$array = explode("#",$text);
	


	for ($i = 1;$i<51;$i++) {

		if (file_exists("images/puzzles/".$i."/info.json")) {
			$array[$i] = trim($array[$i]);
			file_put_contents("images/puzzles/".$i."/info.json",'{"text": "'.$array[$i].'"}');
		}

	}*/
	
	/*for ($i=1;$i<2;$i++) {

		

			if ( file_exists("exp/info".$1.".json") ) {

			}

			if (file_exists("ex".$i."/".$key.".png")) {
				rename("images/puzzles/".$i."/".$key.".png", "images/puzzles/".$i."/".$value.".PNG");					
			}	
		
		
	}*/


	

?>