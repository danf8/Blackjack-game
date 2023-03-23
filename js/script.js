//Cache element references 
const $dealerCard = $('#D-card-one');
const $dealCardTwo = $('#D-card-two');
const $yourCardOne = $('#You-card-one');
const $yourCardTwo = $('#You-card-two');
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
const $divElement = $('div');
const $resetElement = $('#reset');
const $hitElement = $('#hit');
const $standElement = $('#stand');

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
let betAmount = 0;
//used to decide who winner is
let dealerWon;
let playerWon;
let tie;

//used to remove current background and get player to table/game calls getDeckId function

$($enterGame).on('click', function(){
     $($enterGame).fadeOut(900)
    $($divElement).fadeOut(900)
    getDeckId()
});

//game display buttons to start game and update player bet and money
$($bet).on('click', function(){
    $($showWin).css('opacity', '0')
    placeBet();
    $($resetElement).css('opacity', '1')
    $($startElement).css('opacity', '1')
    $($bet).text('Click to Place Bet')
});

//after player clicks start button shows additonal playing buttons and remove start button from screen
$($startElement).on('click', function(){
    startGame()
    alert("Game Instructions: Click 'Hit' button to draw an additional card. Click 'Stand' button to end your turn and dealer will draw. At end of round please click 'Bet' then 'Next round' button ");
    $($mainElement).css('opacity', '1')
    $($buttonElement).css('opacity', '1')
    $($startElement).remove()
    hideBetAndRound()
});

//used to reset game board
$($resetElement).on('click', function(){
    location.reload();
});

//when click on hit button will draw new card for player and dispaly on screen
$($hitElement).on('click', drawCard);

//click stand button, both dealer cards are displayed and dealercount is updated to reflect new count.
$($standElement).on('click', function(){
    showBetAndRound()
    dealerPlay()
});

//when next round clicked removes previous cards and checks if player has enough money to continue to next round
$($nextRoundElement).on('click',nextRound);

//used to update global variable playerValue
function updatePlayerGlobalCount(count){
    count = playerValue;
};

//update global dealer count 
function updateComputerGlobalCount(counter){
    counter = dealerValue;
};

//used to retreive deck id for use in start game function
function getDeckId() {
    $.ajax({
        url: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6"
    }).then(
        (data) => {
            //used to set deck id in drawCards URL
            deckId = data.deck_id;
        },
        (error) => {
            console.log('bad request');
        }
    )
};

//used to draw starting cards from api and starts the game
function startGame() {
    $.ajax({
        url: "https://deckofcardsapi.com/api/deck/"+deckId+"/draw/?count=4"
    }).then(
        (data) => {
            startingCards = data;
            dealerWon = 0;
            playerWon = 0;
            tie = 0;
            initialCard();
        },
        (error) => {
            console.log('bad request');
        }
    )
};

//sets and initial card images and count for game
function initialCard() {
    $dealerCard.attr('src',`${startingCards.cards[0].image}`);
    $dealCardTwo.attr('src', `${startingCards.cards[1].image}`);
    $yourCardOne.attr('src', `${startingCards.cards[2].image}`);
    $yourCardTwo.attr('src', `${startingCards.cards[3].image}`);
    faceCardToNum();
    dealerValue = Number(startingCards.cards[0].value);
    $($dealerCountElement).text('Dealer Count: '+dealerValue);
    playerValue = Number(startingCards.cards[2].value) + Number(startingCards.cards[3].value);
    $($playerCountElement).text('Player Count: '+playerValue);
    updatePlayerGlobalCount(playerValue);
    updateComputerGlobalCount(dealerValue);
    playerDealtTwentyOne();
};

//used to check if player was dealt 21 on initial hand
function playerDealtTwentyOne(){
    if(playerValue === 21){
        dealerValue = Number(startingCards.cards[0].value) + Number(startingCards.cards[1].value);
        $($dealerCountElement).text('Dealer Count: '+dealerValue);
        updateComputerGlobalCount(dealerValue);
        if(playerValue === 21 && dealerValue === 21){
            showBetAndRound();
            $dealCardTwo.css('opacity', '1');
            compareCounts()
        }else if(playerValue === 21 && dealerValue !== 21){
            showBetAndRound();
            $dealCardTwo.css('opacity', '1');
            compareCounts()
        }
    }
};

//when function called will draw new card for player and dispaly on screen, also resets variables that are used to determine who wins
function drawCard(){
    $.ajax({
        url: "https://deckofcardsapi.com/api/deck/"+deckId+"/draw/?count=1"
    }).then(
        (data) => {
            addCard = data;
            appendCard();
        },
        (error) => {
            console.log('bad request');
        }
    )
};

//adds card to screen when player clicks hit
function appendCard(){
    const $imgEl = $(`<img class="added-card" width="126" height="214">`);
    $imgEl.insertAfter($yourCardTwo);
    $imgEl.attr('src', `${addCard.cards[0].image}`);
    checkAppendCard();
    updatePlayerCount();
};

//used to change player count when new card is clicked
function updatePlayerCount() {
    playerValue = playerValue + Number(addCard.cards[0].value );
    $($playerCountElement).text('Player Count: '+playerValue);
    updatePlayerGlobalCount(playerValue);
    overTwentyOne();
    playerDealtTwentyOne();
};

//checks starting cards values and assigns values for facecards
function faceCardToNum(){
    for(let i=0; i < startingCards.cards.length; i++){
        switch(startingCards.cards[i].value){
            case 'QUEEN':
                startingCards.cards[i].value = 10;
                break;
            case 'KING':
                startingCards.cards[i].value = 10;
                break;
            case 'JACK':
                startingCards.cards[i].value = 10;
                break;
            case 'ACE':
                checkStartAce()
                function checkStartAce(){
                    if(startingCards.cards[i].value === "ACE"){
                        startingCards.cards[i].value = 11;
                        if((playerValue + startingCards.cards[i].value) > 21 || (dealerValue + startingCards.cards[i].value) > 21 ){
                            if((playerValue + startingCards.cards[i].value) > 21){
                                startingCards.cards[i].value = 1;
                            }else if((dealerValue + startingCards.cards[i].value) > 21){
                                startingCards.cards[i].value = 1;
                            }
                        }else if ((playerValue + startingCards.cards[i].value) < 21 || (dealerValue + startingCards.cards[i].value) < 21){
                            if((playerValue + startingCards.cards[i].value) > 21){
                                startingCards.cards[i].value = 11;
                            }else if((dealerValue + startingCards.cards[i].value) > 21){
                                startingCards.cards[i].value = 11;
                            }
                        }
                    }
                }
                break;
            default:
                startingCards.cards[i].value = startingCards.cards[i].value;
        }
    }
};

////checks cards that are drawn after inital start, assigns values for facecards
function checkAppendCard(){
    for(let i=0; i < addCard.cards.length; i++){
        switch(addCard.cards[i].value){
            case 'QUEEN':
                addCard.cards[i].value = 10;
                break;
            case 'KING':
                addCard.cards[i].value = 10;
                break;
            case 'JACK':
                addCard.cards[i].value = 10;
                break;
            case 'ACE':
                checkAce();
                function checkAce(){
                    if(addCard.cards[i].value === "ACE"){
                        addCard.cards[i].value = 11;
                        if((playerValue + addCard.cards[i].value) > 21 || (dealerValue + addCard.cards[i].value) > 21 ){
                            if((playerValue + addCard.cards[i].value) > 21){
                                addCard.cards[i].value = 1;
                            }else if((dealerValue + addCard.cards[i].value) > 21){
                                addCard.cards[i].value = 1;
                            }
                        }else if ((playerValue + addCard.cards[i].value) < 21 || (dealerValue + addCard.cards[i].value) < 21){
                            if((playerValue + addCard.cards[i].value) > 21){
                                addCard.cards[i].value = 11;
                            }else if((dealerValue + addCard.cards[i].value) > 21){
                                addCard.cards[i].value = 11;
                            }
                        }
                    }
                }
                break;
            default:
                addCard.cards[i].value = addCard.cards[i].value;
        }
    }
};

//allows dealer to draw new cards and calls function to display facedown card
function dealerPlay(){
    $.ajax({
        url: "https://deckofcardsapi.com/api/deck/"+deckId+"/draw/?count=1"
    }).then(
        (data) => {
            addCard = data;
            showDealerCard();
        },
        (error) => {
            console.log('Bad request');
        }
    )
};

//shows dealer card, dealer count and checks if dealer value is 21 which is used in playerDealtTwentyOne function above
function showDealerCard(){
    $dealCardTwo.css('opacity', '1');
    dealerValue = Number(startingCards.cards[0].value) + Number(startingCards.cards[1].value);
    $($dealerCountElement).text('Dealer Count: '+dealerValue);
    updateComputerGlobalCount(dealerValue);
    dealerLogic();
};

//appends new img and sets img src value 
function addDealerCard(){
    const $dealerImgEl = $('<img class="added-card" width="126" height="214">');
    $dealerImgEl.insertAfter($dealCardTwo);
    $dealerImgEl.attr('src', `${addCard.cards[0].image}`);
    checkAppendCard();
    dealerValue = dealerValue + Number(addCard.cards[0].value);
    $($dealerCountElement).text('Dealer Count: '+dealerValue);
    updateComputerGlobalCount(dealerValue);
};

//used to have dealer draw cards after stand button hit and compare who is the winner
function dealerLogic(){
    while(dealerValue <= 21){
        updateComputerGlobalCount(dealerValue);
    if(dealerValue === 21){
        compareCounts();
        break;
    }else if(dealerValue >= 22){
        overTwentyOne();
        break;
    }else if(dealerValue <21 && dealerValue >= 17){
            compareCounts();
        break;
    }else{
        addDealerCard();
    }
}if(dealerValue >=22){overTwentyOne()}
};

//used to check if player or computer go over twenty one
function overTwentyOne() {
    if(playerValue >= 22){
        showBetAndRound()
        playerWon = false;
        dealerWon = true;
    }else if(dealerValue >= 22){
        showBetAndRound()
        dealerWon = false;
        playerWon = true;
    }endOfRound();
};

//calculates who is closer to 21 and sets correct variable to true or false
function compareCounts(){
    let compareDealer = 21 - dealerValue;
    let comparePlayer = 21 - playerValue;
    if(compareDealer === comparePlayer){
        tie = true;
    }else if(compareDealer > comparePlayer){
        dealerWon = false;
        playerWon = true;
    }else if(compareDealer < comparePlayer){
        dealerWon = true;
        playerWon = false;
    }endOfRound();
};

//used to check at end of round if player has won/lost/tied and update players money
function endOfRound(){
    if(tie){
        playerMoney = playerMoney ;
        betAmount = 0;
        showWinLoseTie()
        updateMoneyAndBet();
    }else if(playerWon){
        playerMoney = playerMoney + (betAmount * 2);
        betAmount = 0;
        showWinLoseTie()
        updateMoneyAndBet()
    }else if(dealerWon){
        playerMoney = playerMoney;
        betAmount = 0;
        showWinLoseTie()
        updateMoneyAndBet();
    }
};

//updates player bet and player money, called when bet button is
function placeBet(){
    betAmount = 10;
    playerMoney = playerMoney - betAmount;
    updateMoneyAndBet();
};

function updateMoneyAndBet(){
    $($amountBetElement).text(`Betting: $${betAmount}`);
    $($playerMoneyElement).text(`Amount Remaining: $${playerMoney}`);
};

//when next round clicked removes previous cards and checks if player has enough money to continue to next round
function nextRound() {
    hideBetAndRound()
    //reference element added-card to remove from gameboard 
    $('.added-card').remove();
    $dealCardTwo.css('opacity', '0');
    if(playerMoney > 0){
        startGame();
    }else {alert('Oh no you ran out of money. Please click reset button to play again.')}
};

//hides bet and round buttons from player
function hideBetAndRound(){
    $($bet).css('opacity', '0')
    $($nextRoundElement).css('opacity', '0')
};

//shows bet button and once bet clicked shows next round button
function showBetAndRound(){
    $($bet).css('opacity', '1')
    $($bet).on('click', function(){
            $($bet).css('opacity', '0')
        $($nextRoundElement).css('opacity', '1')
    })
};

//changes html element to disply if win/lose/tie
function showWinLoseTie(){
    if(tie){
        $($showWin).css({'opacity' : '1', 'color' : 'grey'})
        $($showWin).text('It\'s a Tie')
    }else if(playerWon){
        $($showWin).css({'opacity' : '1', 'color' : 'rgb(10, 242, 10)'})
        $($showWin).text('You\'ve won!')
    }else if(dealerWon){
        $($showWin).css({'opacity' : '1', 'color' : 'rgb(240, 10,10)'})
        $($showWin).text('Oh no! You lost!')       
    }
};
