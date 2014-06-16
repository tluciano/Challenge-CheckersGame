
var possibilityPiece = [];
var piece;
var colorPiece;
var eatLeft = "";
var eatRight = "";
var turn = "white";

start();

function start(){
    gameBoard();
}


// this function to created game board!
function gameBoard(){

    var limitLine = 8;
    var limitColumn = 8;

    var divGameBoard = document.getElementById('gameBoard');
    var newTable = document.createElement('table');
    var lineTable = document.createElement('tbody');

    var pieceBlack = 12;
    var pieceWhite = 12;


    for(line = 0; line < limitLine; line++){

        var tr = document.createElement('tr');

        for(column = 0; column < limitColumn; column++){

            var position = line+"_"+column;
            var role = (parseInt(line) + parseInt(column));

            var td = document.createElement('td');
            td.setAttribute('name', position);
            td.setAttribute('left', false);
            td.setAttribute('right', false);

            if(role % 2 === 0){

                td.setAttribute('class', 'dark');

                if(line < 3){

                    td.appendChild(createPiece('black', position));
                    td.setAttribute('busy', true);
                    td.setAttribute('eat', false);

                } else if (line > 4){

                    td.appendChild(createPiece('white', position));
                    td.setAttribute('busy', true);
                    td.setAttribute('eat', false);

                }else{

                    td.setAttribute('busy', false);
                    td.setAttribute('eat', false);

                }

                td.setAttribute('block', false);

            }else{
                td.setAttribute('block', true);
            }

            tr.appendChild(td);

        }

        lineTable.appendChild(tr);

    }

    newTable.appendChild(lineTable);

    divGameBoard.appendChild(newTable);

}

// this function to created piece
function createPiece(color, position){

    var itenPiece = document.createElement('div');
    itenPiece.setAttribute('class', color+' drag');
    itenPiece.setAttribute('color', color);
    itenPiece.setAttribute('name', 'piece');
    itenPiece.setAttribute('drag', false);
    itenPiece.setAttribute('position', position);
    itenPiece.onclick = function(){ move(this); };
    return itenPiece;
}

function validPiece(next){

    if(next.children[0] != undefined){

        var children = next.children[0];
        var color  = children.className.split(" ");

        return color[0];

    }

    return false;

}

function removePiece(name){

        var element = document.getElementsByName(name)[0];
        element.setAttribute('busy', false);
        element.setAttribute('eat', false);
        element = element.children[0];
        element.parentNode.removeChild(element);
}

function move(dragObj){

    color = dragObj.getAttribute("color");

    if(turn == color){

        colorlessPossibility(possibilityPiece);

        if(!eval(dragObj.getAttribute('drag'))){

            var element = document.getElementsByName('piece');

            for(i = 0; i < element.length; i++){
                element[i].setAttribute('drag',false);
                element[i].className  = element[i].className.replace(' active', '');
            }

            dragObj.setAttribute('drag',true);
            dragObj.className  = dragObj.className + ' active';
            colorPiece = dragObj.className.split(" ")[0];
            piece = dragObj;

            possibility(dragObj);

            if(possibilityPiece.length > 0){

                colorPossibility(possibilityPiece);

                setMove(possibilityPiece);

            }else{

                dragObj.setAttribute('drag',false);
                dragObj.className  = dragObj.className.replace(' active', '');
                colorPiece = "";
                piece = null;

            }

        }else{

            dragObj.setAttribute('drag',false);
            dragObj.className  = dragObj.className.replace(' active', '');
            piece = null;
            colorPiece = "";

        }
    }

}

function setMove(possibilities){

    for(var p in possibilities){

         if(possibilities[p] != undefined){

                var element = document.getElementsByName(possibilities[p])[0];

                element.onclick = function(){ setCell(this); }

        }

    }

}

function possibility(element){

    possibilityPiece = calcPossibility(element, false);

}

function calcPossibility(element, actionEat){

        var resultCalc = [];
        var type = element.className.split(' ');
        var position = element.getAttribute('position').split('_');

        for(i = 0; i < 5; i++){

                var x = position[0];
                var y = position[1];

                if(i < 2){
                    x = (type[0] == "black") ? parseInt(x, 10) + (i + 1) : parseInt(x, 10) - (i + 1);
                    y = (type[0] == "black") ? parseInt(y, 10) + (i + 1) : parseInt(y, 10) - (i + 1);

                }else if(i > 2){
                    x = (type[0] == "black") ? parseInt(x, 10) + (i -2) : parseInt(x, 10) - (i -2);
                    y = (type[0] == "black") ? parseInt(y, 10) - (i - 2) : parseInt(y, 10) + (i - 2);
                }

                if(i != 2){

                    if( ((x >= 0 && x <= 7) && (x >= 0 && x <= 7) ) && ((y >= 0 && y <= 7) && (y >= 0 && y <= 7) )  && (x != position[0] && y != position[1]) ){

                        var resultPosition = x+"_"+y;

                        if(validPossibility(resultPosition)){

                            resultCalc.push(resultPosition);

                        }

                    }

                }

        }

        if(resultCalc.length > 0){
            return validNear(position, resultCalc);
        }else{
            return resultCalc;
        }

}

function validPossibility(possibility){

    var element = document.getElementsByName(possibility)[0];
    var block = eval(element.getAttribute('block'));
    var busy = eval(element.getAttribute('busy'));

    if(!block){

        if(busy){

            var nextPositionColor = validPiece(element);

            if(nextPositionColor && colorPiece != nextPositionColor){

                return false;

            }else{

                return false;

            }

        }

        return true;

    }

    return false;

}

function colorPossibility(possibilities){

     for(var p in possibilities){

            if(possibilities[p] != undefined){

                var element = document.getElementsByName(possibilities[p])[0];
                element.className = element.className + " highlighter";

            }
    }

}

function colorlessPossibility(possibilities){
        for(var p in possibilities){

            if(possibilities[p] != undefined){

                var element = document.getElementsByName(possibilities[p])[0];
                element.className = element.className.replace(' highlighter', '');

            }

        }
}

function setCell(element){

    if(piece !== null){
        lastPosition = piece.getAttribute('position');
        lastPosition = document.getElementsByName(lastPosition)[0];
        lastPosition.setAttribute("busy", false);
        lastPosition.setAttribute("eat", false);

        piece.parentNode.removeChild(piece);
        element.appendChild(createPiece(colorPiece, element.getAttribute('name')));
        element.setAttribute('busy', true);
        element.setAttribute('eat', false);
        element.onclick = null;

        piece.setAttribute('drag',false);
        piece.className  = piece.className.replace(' active', '');

        if(element.getAttribute("move") == "far"){
            if(!validPrevious(element)){
                eat();
            }
        }

        turn = (turn == "black") ? "white" : "black";
        document.getElementById("turn").innerHTML = turn;

        piece = null;
        colorPiece = "";
        colorlessPossibility(possibilityPiece);
        eatLeft = "";
        eatRight = "";

    }

}

function validCell(position){
    var element = document.getElementsByName(position)[0];
    if(element !== undefined){
        var children = element.children[0];
        if(children === undefined){
            return position;
        }
    }
    return false;
}

function eat(possibilities){

        if(eatLeft != ""){

            removePiece(eatLeft);

        }else{

            removePiece(eatRight);

        }

}

function validNear(origin, possibilities){

    var x = origin[0];
    var near = [];
    var far = [];

    for(var p in possibilities){

        var item = possibilities[p].split("_");
        var position = ((x - item[0]) > 0) ? (x - item[0]) : (-(x - item[0]));

            if(position == 1){

                near.push(possibilities[p]);
                document.getElementsByName(possibilities[p])[0].setAttribute("move", "near");

            }else{

                far.push(possibilities[p]);
                document.getElementsByName(possibilities[p])[0].setAttribute("move", "far");
            }

    }

    if(near.length == 2){
        return near;
    }else if(near.length == 0){
        if(far.length == 1){
            var element1 = document.getElementsByName(far[0])[0];
            if(validPrevious(element1)){
                return [];
            }else{
                return far;
            }
        }
        var element1 = document.getElementsByName(far[0])[0];
        var element2 = document.getElementsByName(far[1])[0];
        if(validPrevious(element2) && validPrevious(element1)){
            return [];
        }else{
            return far;
        }
    }else if(near.length > far.length){
        return near;
    }else if(far.length > near.length){
        var element1 = document.getElementsByName(near[0])[0];
        var element2 = document.getElementsByName(far[0])[0];
        var element3 = document.getElementsByName(far[1])[0];
        if(validPrevious(element1) && validPrevious(element2) && validPrevious(element3)){
            return near;
        }else{
            return far;
        }
    }else{
        var element1 = document.getElementsByName(near[0])[0];
        var element2 = document.getElementsByName(far[0])[0];
        if(validPrevious(element2) && validPrevious(element1)){
            return near;
        }else{
            return far;
        }
    }

}

function validPrevious(element){

    var position = element.getAttribute('name').split("_");
    var x = (colorPiece == "black") ? parseInt(position[0]) - parseInt(1) : parseInt(position[0])  + parseInt(1);
    var y1 = parseInt(position[1]) - 1;
    var y2 = parseInt(position[1]) + 1;

     if((y1 >= 0 && y1 <= 7) && (y2 >= 0 && y2 <= 7)){

            var element1 = validPiece(document.getElementsByName(x+"_"+y1)[0]);
            var element2 = validPiece(document.getElementsByName(x+"_"+y2)[0]);

            if(!element1 && !element2){
                return true;
            }else if(element1 == colorPiece || element2 == colorPiece){
                return true;
            }else{
                if(element1 && element1 != colorPiece){
                    eatRight = x+"_"+y1;
                }else if(element2 && element2 != colorPiece){
                    eatLeft = x+"_"+y2;
                }
                return false;
            }
     }else{

        return true;

     }

}

