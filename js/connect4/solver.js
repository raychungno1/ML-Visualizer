import { Position } from "./position.js"

function solve(pos, weak = false, stat) {
    if(weak) 
        return negamax(pos, -1, 1, stat);
    else 
        return negamax(pos, Number(-Position.WIDTH*Position.HEIGHT)/2, Number(Position.WIDTH*Position.HEIGHT)/2, stat);
}

function negamax (pos, alpha, beta, stat) {
    stat.positions++;
    if (pos.isDraw()) return 0; 

    for (let i = 0; i < Position.WIDTH; i++) {
        if (pos.canPlay(i) && pos.isWinningMove(i)) return (Position.WIDTH * Position.HEIGHT + 1n - BigInt(pos.moves)) / 2n;
    }
    
    let max = (Position.WIDTH * Position.HEIGHT - 1n - BigInt(pos.moves)) / 2n;	// upper bound of our score as we cannot win immediately
    if(beta > max) {
        beta = max;                     // there is no need to keep beta above our max possible score.
        if(alpha >= beta) return beta;  // prune the exploration if the [alpha;beta] window is empty.
    }

    for (let i = 0; i < Position.WIDTH; i++) {
        if (pos.canPlay(Position.COL_ORDER[i])) {
            let pos2 = new Position(pos.position, pos.mask, pos.moves);

            pos2.playCol(Position.COL_ORDER[i]);               // It's opponent turn in P2 position after current player plays x column.
            let score = -negamax(pos2, -beta, -alpha, stat); // explore opponent's score within [-beta;-alpha] windows:
            // no need to have good precision for score better than beta (opponent's score worse than -beta)
            // no need to check for score worse than alpha (opponent's score worse better than -alpha)

            if(score >= beta) return score;  // prune the exploration if we find a possible move better than what we were looking for.
            if(score > alpha) alpha = score; // reduce the [alpha;beta] window for next exploration, as we only 
            // need to search for a position that is better than the best so far.
        }
    }
    return alpha;
}

// import fs from "fs"
let input;
// fs.readFile('./connect4/Test_L3_R1', 'utf8' , (err, data) => {
//     if (err) {
//         console.error(err);
//         return;
//     }
//     input = data.split("\n").map(line => line.split(" "));
//     let failCount = 0;
//     for (let i = 0; i < input.length; i++) {
//         let [cols, expected] = input[i];
//         let pos = new Position();
//         pos.playCols(cols);

//         let stat = {
//             depth: 1,
//             positions: 0,
//             wins: 0
//         };
//         let score = solve(pos, false, stat);
//         console.log(`Case: ${i}\tExpected: ${expected}\tActual: ${score}\t Explored: ${stat.positions}`);
//         if (score != expected) {
//             console.log(pos);
//             failCount++;
//         }
//     }
// });

let str = `5554224333234511764415115 4
52753311433677442422121 8
1233722555341451114725221333 -1
271713432331713132 -11
6672375354252731116762237724 -2
763452543756455357732314 -8
662222576343651642712157 8
3455565261655364217 -10
4661237137541742643224 8
21253774536432517717274325 2
715371563635542612576371 3
4435612735531457155143 -5
3457741246677474572223453551 5
754732466173162124726115261 7
64115442265757253615 10
34651743747475571565 -9
36127316172165452675422251 7
4235245615377275211512 -7
122435527534575161761 10
473175162213611457122724 -7
5533212164224336233241461 3
1231426213112346726266353 -7
45277231624411643516213 8
1667675535724753771415352132 1
41416453222527221644 10
1715764132212113656454 -9
651142666562345525716135112 2
7532455277545526 -10
2737772244262123677516643354 0
5746741223753516274755 8
736655673445166272447546 -7
5237261635627332664143376 8
5617131757733341415 -8
6561461362133747245312317267 0
3111642212167362762555645527 -2
46212622667241121631756 -8
47611556754127222 12
3262221111647466 -12
7722654117336331661371176 7
3237735666151513515634 -7
71521736623715176174362 -8
544111732146347 -9
47724652442416755146 8
54527613337336351111622 9
35531254275547623 -9
16773414341241421774376322 -5
175617344365477255 11
411717625255115123554 -9
13227167421566572721 -9
1456346777667336372 11
3464123621337153667644637227 2
31266511114762722166672 -3
137616613112365341 6
6237377156733264225773 8
55371476331451637535 10
615475226615213226217557 -8
5127773675347376151 10
7717464322265274226441151 3
55772343111646575236 5
72276133256716235275764 7
65452257612667655615271112 -4
2577525532532441626 -9
35653272262316437167672 -3
1243234332773245342572475767 5
7535125153114313 -11
253527614166761447574 -6
245715112455274665623715716 -2
56222765165254226556673774 7
77426557613323765616122535 2
4644613266742167756722771541 -4
452631744441223222647115 6
6462662734332655671542313 8
4373163754466323 -12
45542744735462742 -11
52225553533233247312617 -7
3246237456535345371512 9
212532617775164141 10
67421253275551744225213 8
33313546767235271352 7
411364471753646417433177755 3
1224277247774721613545115 -6
76543123446324223431432127 -2
5165132157277276134227475 8
7646171641443471716532164 -2
27625643743643521753111 8
522264452736756 12
57553212327714336423676622 -2
553332366276267756111555776 7
7725135517613477 12
7555726532567141222715416466 -6
734476631737161177341324354 7
62623724435526761122431133 -2
271411161457254361726 -7
7617657562173664715555 9
777322726313643756152546 -3
16445643742326746657 9
3612577271337526673343274 -4
7125417577721225375266556 7
65644113777615216373313743 7
546167317562564251256237162 -5`

input = str.split("\n").map(line => line.split(" "));
let failCount = 0;
for (let i = 0; i < input.length; i++) {
    let [cols, expected] = input[i];
    let pos = new Position();
    pos.playCols(cols);

    let stat = {
        depth: 1,
        positions: 0,
        wins: 0
    };
    let score = solve(pos, false, stat);
    console.log(`Case: ${i}\tExpected: ${expected}\tActual: ${score}\t Explored: ${stat.positions}`);
    if (score != expected) {
        console.log(pos);
        failCount++;
    }
}