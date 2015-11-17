<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Algebraic</title>
	<link rel="stylesheet" href="src/style.css">
</head>
<body>
	<form oninput="compute(equation, formattedInput, result); return false;">
		<input type="text" name="equation" autocomplete="off" autofocus/>
		<output name="formattedInput"></output>
		<output name="result"></output>
	</form>

	<script src="src/scripts/polyfill.js"></script>
	<script src="src/scripts/models/Operators.js"></script>
	<script src="src/scripts/models/OperatorNode.js"></script>
	<script src="src/scripts/models/ValueOperatorNodes.js"></script>  
	<script src="src/scripts/compute.js"></script>

</body>
</html>