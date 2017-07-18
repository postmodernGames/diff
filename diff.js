

function tokenize(X){
	var reg = [];
	reg.push(/[A-Za-z0-9]+/);
	reg.push(/[0-9]+[.]?[0-9]*/);
	reg.push(/[^A-Za-z0-9\s<>]/);
	reg.push(/<[^>/]*>/);
	reg.push(/<[^>]*\/>/);
	reg.push(/<\/[^>]*>/);
	reg.push(/\s+/);


	//This only works because no string satisfying a regex is a prefix to a string which satisfies a different regex;
	var lastgood = new Array();
	var r =0;
	var accum = new Array();
	var s = "";
	X += "!";
	for(var index=0; index<X.length; index++){
		s+=X.charAt(index);
		for(r=0;r<reg.length; r++){
			if(reg[r].exec(s)!=null && reg[r].exec(s)[0].toString()===s){
				lastgood[r] = s;
			} else if (lastgood[r]!=null){
				accum.push(lastgood[r]);
				lastgood= new Array();
				s=X.charAt(index);
				r=-1;
			}
		}
	}
	return accum;
}

function objectFactory(x,y){
	return {
		"type" : x,
		"value" : y
	}
}

//function printDiff(C[0..m,0..n], X[1..m], Y[1..n], i, j){		
function printDiff(C, S, X, Y, i, j){
	if (i >=0  && j >=0 && X[i] == Y[j]){
		S.unshift(objectFactory(0,X[i]));
		printDiff(C, S, X, Y, i-1, j-1);
	}
	else if(j >=0 && (i == -1 || C[i+1][j] >= C[i][j+1])){
		S.unshift(objectFactory(1,"<font color='green'>" + Y[j] + "</font>"));
		printDiff(C, S, X, Y, i, j-1);
	}
	else if(i >= 0 && (j == -1 || C[i+1][j] < C[i][j+1])){
		S.unshift(objectFactory(2,"<s><font color='red'>" + X[i] + "</font></s>"));
		printDiff(C, S, X, Y, i-1, j);
	};
}


function typeSort(A){
	for(var i=0;i<A.length;i++){
		if(A[i].type>0){
			var j=i;
			s = [];
			t = [];
			while(A[j].type>0 || A[j].value === " "){
				if(A[j].type==1 || A[j].value === " ") s.push(A[j]);
				if(A[j].type==2 || A[j].value === " ") t.push(A[j]);
				j++;
			}
			var k = i;
			A = A.slice(0,i).concat(s).concat(t).concat(A.slice(j,A.length));
			i=i+s.length+t.length;
		}
	}
	return A;
}

function diff(A,B){
	
	
	X = tokenize(A); 
	Y = tokenize(B);
	var m = X.length +1;
	var n = Y.length +1;
    var C = new Array(m, n);
	for(var i=0; i < m; i++) {
		C[i] = new Array(n);
		C[i][0] = 0;
	}
	for(var j=0; j < n; j++) {
		C[0][j] = 0;
	}
	for(var i = 0; i < m-1; i++){
		for(var j =0; j < n-1; j++){
			if(X[i] == Y[j])
				C[i+1][j+1] = C[i][j] + 1;
			else
				C[i+1][j+1] = Math.max(C[i+1][j], C[i][j+1]);
		}
	}
	var tau = 0.6;
	var LCSL =  C[m-1][n-1];
	if(LCSL<tau*X.length){
		return "<p> Old text: " + A + "</p><br /><p> New Text: " + B +"</p>";
	} else {
		var S = [];
		printDiff(C,S,X,Y,X.length-1,Y.length-1);
		return typeSort(S).map(function(a){return a.value;}).join("");
	}
		
}

