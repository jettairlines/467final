document.getElementById("search").addEventListener("submit", function(event){

	var searchFor = document.getElementById("query").value

	var request = new XMLHttpRequest(); 
	request.onreadystatechange = function (){
	if (request.readyState == 4 && request.status == 200){
		console.log(request.response);
		}
	}
	request.open('GET', '/search?query='+searchFor);
	request.send(null);

	event.preventDefault();
	return false; 
}); 