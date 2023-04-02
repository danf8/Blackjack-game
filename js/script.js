//Cache element references 
const $dealerCardTwo = $('#D-card-two');
const $playerCardTwo = $('#You-card-two');
const $enterGame = $('#enter-the-game');
const $bet = $('#bet');
const $showWin = $('.show-win');
const $nextRoundElement = $('#next-round');
const $playerMoneyElement = $('#player-money');
const $amountBetElement = $('#amount-bet');
const $dealerCountElement = $('#Dealer-count');
const $playerCountElement = $('#Player-count');
const $startElement = $('#start');
const $mainElement = $('main');
const $buttonElement = $('button');
const $resetElement = $('#reset');
const $hitElement = $('#hit');
const $standElement = $('#stand');
const $dialogAlert = $('#dialog')

//used to track player card value
let playerValue;
//used to track dealers card value.
let dealerValue;
//used to set deck id
let deckId;
//used to assign cards at start of game
let startingCards;
//used to assign card when player clicks hit
let addCard;
//used to keep track of player money and bets
let playerMoney = 100;
let betAmount = 10;

//Event listeners
$enterGame.on('click', enterGameBoard);
$bet.on('click', clickOnBet);
$startElement.on('click', clickOnStart);
$resetElement.on('click', resetGame);
$hitElement.on('click', drawCard);
$standElement.on('click', clickOnStand);
$nextRoundElement.on('click',nextRound);

//click stand button, both dealer cards are displayed and dealercount is updated to reflect new count.
function clickOnStand() {
    showBetAndRound();
    getDeckId(1, 'dealer');
};

// when function called will draw new card for player and dispaly on screen, also resets variables that are used to determine who wins
function drawCard() {
    getDeckId(1 , 'player');
};

//game display buttons to start game and update player bet and money
function clickOnBet() {
    playerMoney = playerMoney - betAmount;
    $amountBetElement.text(`Betting: $${betAmount}`);
    $playerMoneyElement.text(`Amount Remaining: $${playerMoney}`);
    $showWin.css('opacity', '0');
    $resetElement.css('opacity', '1');
    $startElement.css('opacity', '1');
    $bet.text('Click to Place Bet');
};

//after player clicks start button shows additonal playing buttons and remove start button from screen
function clickOnStart() {
    $mainElement.css('opacity', '1');
    $buttonElement.css('opacity', '1');
    $startElement.remove();
    hideBetAndRound();
    getDeckId(4, 'begin');
};

//used to remove current background and get player to table/game calls getDeckId function
function enterGameBoard() {
    $bet.css('opacity', '1');
    $enterGame.fadeOut(300);
    getDeckId(6);
};

//used to reset game 
function resetGame() {
    location.reload();
};

//used to update global variable for player and dealer value
function updatePlayerGlobalCount(count, param1){
    param1 === 'player' ? playerValue = count : dealerValue = count;
};


// checks if deckId is already set, then draws inital cards.
async function getDeckId(num, param2) {
    try {
        if(!deckId && num === 6){
            const response = await $.ajax({
                url: 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6'
            });
            deckId = response.deck_id;
        };
        const drawResponse = await $.ajax({
            url: 'https://deckofcardsapi.com/api/deck/'+deckId+'/draw/?count=' + num
        });
        drawResponse.cards.filter((c) => {
            c.value === 'ACE' ? c.value = 11 : '';
            c.value === 'QUEEN' || c.value === 'KING' ||  c.value === 'JACK' ? c.value = 10 : c.value;
        });
        num === 4 ? startingCards = drawResponse : addCard = drawResponse 
        param2 === 'player' ? appendCard('player', $playerCardTwo, playerValue, $playerCountElement) : '';
        param2 === 'dealer' ? dealerLogic() : '';
        param2 === 'begin' ? initialCard() : '';
        } catch (error) {
            console.log('bad request', error);
    }
};


//sets and initial card images and count for game
function initialCard() { 
    $('#D-card-one').attr('src',`${startingCards.cards[0].image}`);
    $dealerCardTwo.attr('src', `${startingCards.cards[1].image}`);
    $('#You-card-one').attr('src', `${startingCards.cards[2].image}`);
    $playerCardTwo.attr('src', `${startingCards.cards[3].image}`);
    dealerValue = Number(startingCards.cards[0].value) + Number(startingCards.cards[1].value)
    playerValue = Number(startingCards.cards[2].value) + Number(startingCards.cards[3].value);
    checkAceValue(startingCards,playerValue, dealerValue); 
    $dealerCountElement.text('Dealer Count: '+ startingCards.cards[0].value);
    $playerCountElement.text('Player Count: '+ playerValue);
    overTwentyOne();
};

// adds card to screen when player clicks hit and add card for dealer
function appendCard(playOrDealer, cardTwo, eachVal, countElement){
    const $imgEl = $(`<img class='added-card'>`);
    let text;
    playOrDealer === 'player' ? text = 'Player Count: ' : text = 'Dealer Count: ';
    $imgEl.insertAfter(cardTwo);
    $imgEl.attr('src', `${addCard.cards[0].image}`);
    checkAceValue(addCard, playerValue, dealerValue);
    eachVal += Number(addCard.cards[0].value );
    $(countElement).text(text + eachVal);
    updatePlayerGlobalCount(eachVal, playOrDealer);
    overTwentyOne();
};

// checks cards values for ace and assigns values 
 function checkAceValue(cardsToCheck, playVal, dealVal){
    cardsToCheck.cards.filter((c) => {
        c.value === 11 && ((dealVal + c.value) > 21) ? c.value = 1 : '';
        c.value === 11 && ((playVal + c.value) > 21) ? c.value = 1 : '';
    });
};

//used to have dealer draw cards after stand button hit and compare who is the winner
function dealerLogic(){
    $dealerCardTwo.css('opacity', '1');
    $dealerCountElement.text('Dealer Count: '+dealerValue);
    while(dealerValue < 17){
        appendCard('computer', $dealerCardTwo, dealerValue, $dealerCountElement);
}compareCounts();
};

//used to check if player or computer go over twenty one or if player was dealt 21 on initial hand
function overTwentyOne() {
    if(playerValue === 21) {
        dealerValue = Number(startingCards.cards[0].value) + Number(startingCards.cards[1].value);
        $dealerCountElement.text('Dealer Count: '+dealerValue);
        updatePlayerGlobalCount(dealerValue, 'computer');
        showBetAndRound();
        $dealerCardTwo.css('opacity', '1');
        compareCounts();
    }else if(playerValue >= 22){
        showBetAndRound()
        compareCounts();
    }else if(dealerValue >= 22){
        showBetAndRound();
        compareCounts();
    }
};

//calculates who is closer to 21 and used to check at end of round if player has won/lost/tied and update players money
function compareCounts(){
    let compareDealer = 21 - dealerValue;
    let comparePlayer = 21 - playerValue;
    if(playerValue >= 22){
        playerMoney = playerMoney;
        $showWin.css({'opacity' : '1', 'color' : 'rgb(240, 10,10)'});
        $showWin.text('Oh no! You lost!');  
    } else if(dealerValue >= 22){
        playerMoney = playerMoney + (betAmount * 2);
        $showWin.css({'opacity' : '1', 'color' : 'rgb(10, 242, 10)'});
        $showWin.text('You\'ve won!');
    }else if(compareDealer === comparePlayer){
        playerMoney = playerMoney ;
        $showWin.css({'opacity' : '1', 'color' : 'grey'});
        $showWin.text('It\'s a Tie');
    }else if(compareDealer > comparePlayer){
        playerMoney = playerMoney + (betAmount * 2);
        $showWin.css({'opacity' : '1', 'color' : 'rgb(10, 242, 10)'});
        $showWin.text('You\'ve won!');
    }else if(compareDealer < comparePlayer){
        playerMoney = playerMoney;
        $showWin.css({'opacity' : '1', 'color' : 'rgb(240, 10,10)'});
        $showWin.text('Oh no! You lost!');  
    };
    $playerMoneyElement.text(`Amount Remaining: $${playerMoney}`);
};

//when next round clicked removes previous cards and checks if player has enough money to continue to next round
function nextRound() {
    hideBetAndRound();
    //reference element added-card to remove from gameboard 
    $('.added-card').remove();
    $dealerCardTwo.css('opacity', '0');
    playerMoney > 0 ? getDeckId(4, 'begin') : $dialogAlert.modal();
};

//hides bet and round buttons from player
function hideBetAndRound(){
    $bet.css('opacity', '0');
    $nextRoundElement.css('opacity', '0');
};

//shows bet button and once bet clicked shows next round button
function showBetAndRound(){
    $bet.css('opacity', '1');
    $bet.on('click', function(){
        $bet.css('opacity', '0');
        $nextRoundElement.css('opacity', '1');
    });
};

