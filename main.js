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
        stone.setAttribute("data-state", defaultState);
        //追加
        stone.setAttribute("data-index", i);//インデックス番号をHTML要素に保持
        stoneStateList.push(defaultState);
        square.addEventListener('click', () => {
            onClickSquare(i);

            const currentTurnText = document.getElementById("currentTurn");
            var currentColor = 1;
            const getReversibleStones = (idx) => {

                const squareNums = [
                    7 - (idx % 8),
                    Math.min(7 - (idx % 8), (56 + (idx % 8) - idx) / 8),
                    (56 + (idx % 8) - idx /8,
                    Math.min(idx % 8,(56 + (idx % 8)- idx) / 8),
                    idx % 8,
                    Math.min(idx % 8,(idx - (idx%8))/8),
                    (idx -(idx % 8))/8,
                    Math.min(7 - (idx % 8), (idx - idx%8))/8), 
                    ];
                    //for文ループの規則を定めるためのパラメータ定義
                    const parmeters = [1, 9, 8, 7, -1,-9, -8,-7];

                    // for文ループの規則を定めるためのパラメータ定義
                    //ひっくり貸せることが確定した石の情報を入れる配列
                    var results = [];

                    //8方向への走査のためのfor文
                    for (var i = 0; i < 8; i++) {
                        //ひっくり返せる可能性のある石の情報を入れる配列
                        const box = [];
                        //現在調べている方向にいくつマスがあるか
                        const squareNum = squareNums[i];
                        const param = parmeters[i];
                        //ひとつ隣の石の状態
                        const nextStoneState = stoneStateList[idx + param];

                        //フロー図の[2][3]:隣に石があるか 及び 隣の石が相手の色か -> どちらでもない場合は次のループへ
                        if(nextStoneState === 0 || nextStoneState === currentColor) continue;
                        //隣の石の番号を仮ボックスに格納
                        box.push(idx + param);

                        //フロー図[4][5]のループを実装
                        for (var j = 0; j < squareNum -1; j++){
                            const targetIdx = idx + param * 2 + param * j;
                            const targetColor = stoneStateList[targetIdx];
                            //フロー図の[4]:さらに隣に隣に石があるか -> なければ次のループへ
                            if (targetColor === 0) continue;
                            //フロー図の[5]:さらに隣にある石が相手の色か
                            if (targetColor === currentColor) {
                                //自分の色なら仮ボックスの石がひっくり返せることが確定
                                results = results.concat(box);
                                break;
                            }
                            else {
                                //相手の色なら仮ボックスにその石の番号を格納
                                box.push(targetIdx);
                            }
                        }
                    }
                    //ひっくり返せると確定した石の番号を戻り値にする
                    return results;
            };
            const onClickSquare = (index) => {
                 const reversibleStones = getReversibleStones(index);

                 if (stoneStateList[index] !== 0 || !reversibleStones.length){
                    alert("ここには置けないよ！");
                    return;
                 }

                 //自分の石
                 stoneStateList[index] = currentColor;
                 document
                 .querySelector(`[data-index='${index}']`)
                 .setAttribute("data-state",currentColor);

                 //相手の石をひっくり返す
                 reversibleStones.forEach((key) => {
                    stoneStateList[key] = currentColor;
                    document.querySelector(`[data-index='${key}']`).setAttribute("data-state",currentColor);
                  });

                  //もし盤面がいっぱいだったら、ゲームが終了
                  if (stoneStateList.every((state) => state !== 0)) {
                    const blackStonesNum = stoneStateList.filter(state => state === 1).length

                  }

            }
        })
    }
};
window.onload = () => {
    createSquares();
};
