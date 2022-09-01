// テンプレート
const stage = document.getElementById("stage");
const squareTemplate = document.getElementById("square-template");
//追加
const stoneStateList = [];
const onClickSquare = (index) => {
    if(stoneStateList[index] !==0){
        alert("ここに置けません")
        return;
    }
}

const createSquares = () => {
    for (var i = 0; i < 64; i++) {
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
        //追加
        stone.setAttribute("data-index" , i);//インデックス番号をHTML要素に保持
        stoneStateList.push(defaultState);
        square.addEventListener('click', () => {
            onClickSquare(i);
            var currentColor = 1;
            const getReversibleStones = (idx) => {

                const squareNums = [
                    7 - (idx % 8),
                    Math.min(7 - (idx % 8),(56 + (idx % 8) - idx) / 8),
                    (56 + (idx % 8) - idx /8,
                    Math.min(idx % 8,(56 + (idx % 8)- idx) / 8),
                    idx % 8,
                    Math.min(idx % 8,(idx - (idx%8))/8),
                    (idx -(idx % 8))/8,
                    Math.min(7 - (idx % 8), (idx - idx%8))/8), 
                    ];
                    const parmeters = [1, 9, 8, 7, -1,-9, -8,-7];

                    var results = [];

                    for (var i = 0; i < 8; i++) {
                        const box = [];

                        const squareNum = squareNums[i];
                        const param = parmeters[i];

                        const nextStoneState = stoneStateList[idx + param];

                        if(nextStoneState === 0 || nextStoneState === currentColor) continue;

                        box.push(idx + param);

                        for (var j = 0; j < squareNum -1; j++){
                            const targetIdx = idx + param * 2 + param * j;
                            const targetColor = stoneSttateList[targetIdx];

                            if (targetColor === 0) continue;
                            if (targetColor === currentColor) {
                                results = results.concat(box);
                                break;
                            }
                            else {
                                box.push(targetIdx);
                            }
                        }
                    }
                    return results;
            };
        })
    }
};
window.onload = () => {
    createSquares();
};
