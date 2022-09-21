function dispHint() {
    for (let i = 0; i <= 63; i++) {
        let elem = document.querySelector(`[data-index='${i}']`);
        elem.classList.remove('hint');
        if (getReversibleStones(i) > 0) {
            elem.classList.add('hint');
        }
    }
}
// テンプレート
const stage = document.getElementById("stage");
const squareTemplate = document.getElementById("square-template");
const stoneStateList = [];
let currentColor = 1;
const currentTurnText = document.getElementById("current-turn");
//クリックして石を戻したい
const backButton = document.getElementById("back");
//クリックして石が置けない場合に「ここは置けない」
const fixText = document.getElementById("fix")
const skipText = document.getElementById("skip")
//どこにおけるか予測する
let candidateList;


// const back = () => {

// }

const changeTurn = () => {
    currentColor = 3 - currentColor;

    //スキップ機能を追加した
    let isSkip = true;

    const emptyIndexList = stoneStateList.flatMap((state, i) => (state === 0 ? i : []));
    for (const index of emptyIndexList) {
        //置ける場所がある場合
        if (getReversibleStones(index) > 0) {
            isSkip = false;
            break;
        }
    }
    if (isSkip) {
        //ターンを戻す
        currentColor = 3 - currentColor;
        document.getElementById("skip").style.display = "block";

    }
    else {

        document.getElementById("skip").style.display = "none";
    }


    if (currentColor === 1) {
        currentTurnText.textContent = "黒";
    } else {
        currentTurnText.textContent = "白";
    }
}


const getReversibleStones = (idx) => {
    //縦・横・斜めの計算 苦手な部分
    const squareNums = [
        7 - (idx % 8),
        Math.min(7 - (idx % 8), (56 + (idx % 8) - idx) / 8),
        (56 + (idx % 8) - idx) / 8,

        Math.min(idx % 8, (56 + (idx % 8) - idx) / 8),
        idx % 8,

        Math.min(idx % 8, (idx - (idx % 8)) / 8),
        (idx - (idx % 8)) / 8,

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
        for (let j = 0; j < squareNum - 1; j++) {
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
    //メッセージ改善 石が置けないときにテキストで「ここに置けません」と表示する
    if (stoneStateList[index] !== 0 || !reversibleStones.length) {

        document.getElementById("fix").style.display = "block";
        return;
    }
    document.getElementById("fix").style.display = "none";

    //自分の石
    stoneStateList[index] = currentColor;
    document
        .querySelector(`[data-index='${index}']`)
        .setAttribute("data-state", currentColor);


    //つまり黒か白が置けない場合にスキップする機能
    //  if (stoneStateList[index] == 0 || !reversibleStones.length){

    //     const showMessage = message => {
    //         const area = document.querySelector('#message-area');
    //         if (!message) {
    //           area.classList.remove('visible');
    //           return;
    //         }
    //         area.classList.add('visible');
    //         area.textContent = message;
    //       };
    //     document.addEventListener('click', () => showMessage(''), {capture:true}); 

    //     }


    //相手の石をひっくり返す
    reversibleStones.forEach((key) => {
        stoneStateList[key] = currentColor;
        document.querySelector(`[data-index='${key}']`).setAttribute("data-state", currentColor);
        //完全勝利の場合
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
        else if (blackStonesNum < whiteStonesNum) {
            winnerText = "白の勝利！";
        }

        else {
            winnerText = "引き分け";
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
        if (i == 28 || i == 35) {
            defaultState = 1;
        }
        else if (i == 27 || i == 36) {
            defaultState = 2;
        }
        else {
            defaultState = 0;
        }

        stone.setAttribute("data-state", defaultState);
        stone.setAttribute("data-index", i);//インデックス番号をHTML要素に保持
        stoneStateList.push(defaultState);//初期値を配列に格納

        square.addEventListener('click', () => {

            // console.log();
            // candidateList = [];
            // for (let y = 0; y < stage; y++) {
            //     for (let x = 0; x < stage; x++) {
            //         const { canndinate, } = getReversibleStones(x, y, getCurrentTurn());
            //         gameBoard[x][y].element.classList.remove('hint');
            //         if (canndinate.reversibles.length !== 0) {
            //             candidateList.push(canndinate); // 候補手に追加する
            //             gameBoard[x][y].element.classList.add('hint'); // 候補手を光らせてみる、なんなら候補手にクリックとつけてもいい
            //         }
            //     }
            // }
            onClickSquare(i);
        });
    }
    dispHint();
}
window.onload = () => {
    createSquares();
    backButton.addEventListener("click", back)
}

// let realTime = new Date();
// let text = hour + ':' + minute + ':' + second;


    // 打ち直し 予測 結果の記録 パスを自動化 完全勝利するとスキップメッセージが反応する