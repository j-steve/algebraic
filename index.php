<?php
	var $index_html = readfile('src/index.html');
	$index_html = str_replace($index_html, 'href="', 'href="src/');
	$index_html = str_replace($index_html, 'src="', 'src="src/');
	echo $index_html;
?>