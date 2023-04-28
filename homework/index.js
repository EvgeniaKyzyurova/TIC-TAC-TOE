function drawField(container) {
    const three = 3;
    for (let i = 0; i < three; i++) {
        for (let j = 0; j < three; j++) {
            const cell = document.createElement('div');
            cell.className = 'tile';
            cell.textContent = '';
            cell.id = `box${i}${j}`;
            container.appendChild(cell);
        }
    }
}
function game(player1, player2, state) {
    const cell_arr = document.querySelectorAll('div[id^=box]');
    for(let cell of cell_arr){
        cell.addEventListener('click', function(){
            play(cell, state, player2, player1);
        });
    }
    for(let i = 0; i<cell_arr.length; i++){
        cell_arr[i].addEventListener('playGame', function (e){
            play(e.detail.cell, state, player2, player1);
        });
    }
    function custom(c){
        const customEvent = new CustomEvent('playGame', {
            detail:{
            cell: c
            }
        });
        c.dispatchEvent(customEvent); 
    }
    let i = 0;
    document.body.onkeydown = (e) => {
        const key = e.key;
        if (key === `ArrowRight`) {
            if(cell_arr[i-1] && cell_arr[i-1].classList.contains('active')){
                cell_arr[i-1].classList.remove('active');
            }
            if(i<cell_arr.length){
                cell_arr[i].classList.add('active');
                i++; 
            }else{
                i=0;
                cell_arr[i].classList.add('active');
                i++; 
            }
        }
        if (key === 'ArrowLeft'){
            i--;
            if(cell_arr[i] && cell_arr[i].classList.contains('active')){
                cell_arr[i].classList.remove('active');
            }
            if(i>0){
                cell_arr[i-1].classList.add('active');
            }else{
                i = cell_arr.length;
                cell_arr[i-1].classList.add('active');
            }
        }
        if (key === 'Enter'){
            const cell = cell_arr[i-1];
            cell.classList.remove('active');
            custom(cell);
        }
    };
}
function play(cell, state, player2, player1){
    const displayPlayer= document.querySelector('.display-player');
    const displayWinner = document.querySelector('.announcer');
    const three = 3;
    const winning_combitations = [
        [0, 1, 1+1], [three, three+1, three+1+1], [three+three, three+three+1, three+three+1+1],
        [0, three, three+three], [1, three+1, three+three+1], [1+1, three+1+1, three+three+1+1],
        [0, three+1, three+three+1+1], [1+1, three+1, three+three]];
    console.log(cell.id, state.player);
    if(cell.textContent === ''){
        cell.textContent = `${state.player}`;
        cell.classList.add(`player${state.player}`);
        if(isWin(winning_combitations, cell.textContent)){
            end(displayWinner, state);
        }else if(isDraw()){
            displayWinner.classList.remove('hide');
            displayWinner.textContent = 'Draw';
        }
        if(state.player === 'X'){
            displayPlayer.classList.remove(`player${state.player}`);
            state.player = player2;
            displayPlayer.classList.add(`player${state.player}`);
            displayPlayer.textContent =`${state.player}`;
        }else if(state.player === 'O'){
            displayPlayer.classList.remove(`player${state.player}`);
            state.player = player1;
            displayPlayer.classList.add(`player${state.player}`);
            displayPlayer.textContent =`${state.player}`;
        }
    }
}
function isWin(combination, player){
    const cell_arr = document.querySelectorAll('div[id^=box]');
    return combination.some(comb => {
        return comb.every(index => {
            return cell_arr[index].textContent === player;
        })
    })
}
function end(displayWinner, state){
    displayWinner.classList.remove('hide');
    displayWinner.textContent = 'Player';
    const winer = document.createElement('span');
    winer.classList.add(`player${state.player}`)
    winer.textContent = ` ${state.player} Won`;
    displayWinner.appendChild(winer);
}
function isDraw(){
    const cell_arr = document.querySelectorAll('div[id^=box]');
    let text ='';
    for (let i=0; i<cell_arr.length; i++){
        text+= cell_arr[i].textContent;
    }
    if(text.length === cell_arr.length){
        return true;
    }

}
function avatarDrag(){
    const avatars = document.querySelectorAll('.avatar-icon');
    const containers = document.querySelectorAll('.avatar-container');
    avatars.forEach((avatar) => {
        avatar.setAttribute('draggable',true);
        avatar.addEventListener('dragstart', (event) => {
            setTimeout(() => event.target.classList.add('hide'),0);
            avatar.classList.add('drag');
        });
        avatar.addEventListener('dragend', (event) => {
            event.target.classList.remove('hide');
        });
    });
    containers.forEach((container) => {
        container.addEventListener('dragover',(event) => {
            event.preventDefault();
            
        });
        container.addEventListener('drop',(event) => {
            event.preventDefault();
            if(container.children.length){
                return;
            }
            const dragAvatar = document.querySelector('.drag');
            event.target.append(dragAvatar);
            dragAvatar.classList.remove('drag');
        });
    });
}

function start(){
    const grid = document.querySelector('.container');
    const playerX = document.querySelector('.playerX').textContent;
    const playerO = document.querySelector('.playerO').textContent;
    const state = {
        player: playerX
    }
    drawField(grid);
    game(playerX, playerO, state);
    avatarDrag();
    const reset = document.querySelector('#reset');
    reset.addEventListener('click', function(){
        document.location.reload(true);
    });
}
window.addEventListener('load', start);

