"use strict";

function isWhitespace(cur){
	if (cur === '\u0020' || cur === '\u0009' || cur === '\u000A' ||  cur === '\u000C' || cur === '\u000D') {
		return true;
	}
	else return false;
}

function tokenize(X){
	
	var state=1;
	var tokenQueue = [];
	var index=0;
	var accum="";
	var c;
	
	for(var i=0;i<=X.length;i++){
		c= X.charAt(i);
		if(!c) state =3;
		if(state==1){
			if(c=='<'){
				accum+=c;
				state = 2;
				continue;
			}
			else if(isWhitespace(c)){
				state = 4;
				continue;
				
			}
			else{
				accum+=c;
				state = 5;
				continue;
			}
		}
		else if(state ==2){
			accum+=c;
			if(c=='>'){
				state=3;	
			}
			continue;
		}
		else if(state ==3){
			
			if(accum) tokenQueue.push(accum);
			accum="";
			state=1;
			if(i==X.length) return tokenQueue;
			i--;
			continue;
		}
		else if(state ==4){
			if(!isWhitespace(c)){
				i--;
				//accum = " ";
				state=3;
			}
			continue;
		}
		else if(state ==5){
			if(c=='<'){
				i--;
				state=3;
			}
			else if(isWhitespace(c)){
				i--;
				state=3;
			}
			else 
				accum+=c;
			continue;
			
		}
		
	}
	return tokenQueue;
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
			var s = [];
			var t = [];
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
	
	
	var X = tokenize(A); 
	var Y = tokenize(B);
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
	var tau = 0.3;
	var LCSL =  C[m-1][n-1];
	if(LCSL<tau*X.length){
		return "<p> Current text: " + A + "</p><br /><p> Proposed Text: " + B +"</p>";
	} else {
		var S = [];
		printDiff(C,S,X,Y,X.length-1,Y.length-1);
		return typeSort(S).map(function(a){return a.value;}).join(" ");
	}
		
}

