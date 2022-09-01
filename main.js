// テンプレート
const stage = document.getElementById("stage");
const squareTemplate = document.getElementById("square-template");


const createSquares = () => {
    for(var i = 0; i < 64; i++){
        const square = squareTemplate.cloneNode(true);//クローン
        square.removeAttribute("id"); // idの属性
        stage.appendChild(square);// マス目 html要素を盤に追加

        const stone = square.querySelector('.stone');

        var defaultState;
        //デフォルトの石の状態を分岐
        if(i == 27 || i == 36) {
            defaultState = 1;
        }
        else if(i == 28 || i == 35){
            defaultState = 2;
        }
        else {
            defaultState = 0;
        }
        stone.setAttribute("data-state",defaultState);
    }
};
// window.onload = () => {
//     createSquares();
// };
