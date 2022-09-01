// テンプレート
const stage = document.getElementById("stage");
const squareTemplate = document.getElementById("square-template");
//追加
const stoneStateList = [];
const onClickSquare = (index) => {
    if(stoneStateList[index] !==0){
        alert("ここには置けないよ")
        return;
    }
}

const createSquares = () => {
    for (let i = 0; i < 64; i++) {
        const square = squareTemplate.cloneNode(true);//クローン
        square.removeAttribute("id"); // idの属性
        stage.appendChild(square);// マス目 html要素を盤に追加

        const stone = square.querySelector('.stone');

        let defaultState;
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
        //追加
        stone.setAttribute("data-index" , i);//インデックス番号をHTML要素に保持
        stoneStareList.push(defaultState);
        square.addEventListener('click', () => {
            onClickSquare(i);
        })
    }
};
window.onload = () => {
    createSquares();
};
