// テンプレート
const stage = document.getElementById("stage");
const squareTemplate = document.getElementById("square-template");
const stoneStateList = [];
let currentColor = 1;
const currentTurnText = document.getElementById("current-turn");
const passButton = document.getElementById("pass");

const changeTurn = () => {
    currentColor = 3 - currentColor;

    if (currentColor === 1){
        currentTurnText.textContent = "黒";
    } else {
        currentTurnText.textContent = "白";
    }
  }


const getReversibleStones = (idx) => {
    //縦・横・斜めの計算 苦手な部分
    const squareNums = [
        7 - (idx % 8),
        Math.min (7 - (idx % 8), (56 + (idx % 8) - idx) / 8),
        (56 + (idx % 8) - idx) / 8,

        Math.min(idx % 8, (56 + (idx % 8)- idx) / 8),
        idx % 8,

        Math.min(idx % 8, (idx - (idx % 8)) / 8),
        (idx - (idx % 8)) /8,

        Math.min(7 - (idx % 8), (idx - (idx % 8)) / 8), 
        ];
        //for文ループの規則を定めるためのパラメータ定義
        const parameters = [1, 9, 8, 7, -1, -9, -8, -7];

        // for文ループの規則を定めるためのパラメータ定義
        //ひっくり貸せることが確定した石の情報を入れる配列
        let results = [];

        //8方向への走査のためのfor文
        for (let i = 0; i < 8; i++) {
            //ひっくり返せる可能性のある石の情報を入れる配列
            const box = [];
            //現在調べている方向にいくつマスがあるか
            const squareNum = squareNums[i];
            const param = parameters[i];
            //ひとつ隣の石の状態
            const nextStoneState = stoneStateList[idx + param];

            //フロー図の[2][3]:隣に石があるか 及び 隣の石が相手の色か -> どちらでもない場合は次のループへ
            if (nextStoneState === 0 || nextStoneState === currentColor) continue;
            //隣の石の番号を仮ボックスに格納
            box.push(idx + param);

            //フロー図[4][5]のループを実装
            for (let j = 0; j < squareNum - 1; j++){
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
                
                //ひっくり返せる石の数
                 const reversibleStones = getReversibleStones(index);

                
                 
                 //他の石があるか、置いたときにひっくり返せる石がない場合は置けないメッセージを出す
                 
                 if (stoneStateList[index] !== 0 || !reversibleStones.length){
                    
                    //メッセージ改善
                                      
                    return;
                 }
                 
                 //自分の石
                 stoneStateList[index] = currentColor;
                 document
                 .querySelector(`[data-index='${index}']`)
                 .setAttribute("data-state",currentColor);

                 //自動パス 黒か白がどちらか返す事ができない場合 スキップする
                 //つまり黒か白が置けない場合にスキップする機能
                 if (stoneStateList[index] == 0 || !reversibleStones.length){
                //    if (!stoneStateList.filter(state => state === 1 && !stoneStateList.filter(state => state === 2).length) {
                    const showMessage = message => {
                        const area = document.querySelector('#message-area');
                        if (!message) {
                          area.classList.remove('visible');
                          return;
                        }
                        area.classList.add('visible');
                        area.textContent = message;
                      };
                    document.addEventListener('click', () => showMessage(''), {capture:true}); 
                    
                    }
                    
                    //完全勝利の場合 
                //if(白が０ または 黒が0)
                
                //stoneStateList の配列
                //stoneStateListに黒か白が何個あるか知りたい
                //filterが配列の中身を確認している
                //完全勝利のパターンはできたがお知らせがでない状態

                 //相手の石をひっくり返す
                 reversibleStones.forEach((key) => {
                    stoneStateList[key] = currentColor;
                    document.querySelector(`[data-index='${key}']`).setAttribute("data-state",currentColor);

                    if (!stoneStateList.filter(state => state === 1).length || !stoneStateList.filter(state => state === 2).length) {

                        alert("Perfect Game");
                    }
                  });              
                

                  //もし盤面がいっぱいだったら、ゲームが終了
                  if (stoneStateList.every((state) => state !== 0)) {
                    const blackStonesNum = stoneStateList.filter(state => state === 1).length;
                    
                    const whiteStonesNum = 64 - blackStonesNum;
                    
                     
                    let winnerText = "";
                    if (blackStonesNum > whiteStonesNum) {
                        winnerText = "黒の勝利！";
                    }
                    else if (blackStonesNum < whiteStonesNum){
                        winnerText = "白の勝利！";
                    }
                    
                     else {
                            winnerText ="引き分け";
                        }
                        
                        
                        alert(`Result report、白${whiteStonesNum}、黒${blackStonesNum}で、${winnerText}`)
                    }
                                           
                    //ゲーム続行で相手ターン
                    changeTurn();
            }

            //letが範囲を限定にされるので他のコードを邪魔されないようになった
            const createSquares = () => {
                for (let i = 0; i < 64; i++) {
                    const square = squareTemplate.cloneNode(true);//クローン
                    square.removeAttribute("id"); // idの属性
                    stage.appendChild(square);// マス目 html要素を盤に追加
                    
                    const stone = square.querySelector('.stone');
            
                    let defaultState;
                    //デフォルトの石の状態を分岐
                    if(i == 28 || i == 35) {
                        defaultState = 1;
                    }
                    else if(i ==  27 || i ==  36){
                        defaultState = 2;
                    }
                    else {
                        defaultState = 0;
                    }
            
                    stone.setAttribute("data-state", defaultState);
                    stone.setAttribute("data-index", i);//インデックス番号をHTML要素に保持
                    stoneStateList.push(defaultState);//初期値を配列に格納
            
                    square.addEventListener('click', () => {
                        onClickSquare(i);
        });
    }
}
window.onload = () => {
    createSquares();
    passButton.addEventListener("click", changeTurn)

    }

    let realTime = new Date();
    let text = hour + ':' + minute + ':' + second;

    //課題 完全勝利 スキップ機能 お知らせ
    // 打ち直し 予測 結果の記録