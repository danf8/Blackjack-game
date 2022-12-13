
//for betting button should set money element using js then assign variable to it.
// need to add ace function to check assign correct value
// need to add a readme.md file to this project
//function for hit that draws another card to your hand
//function for stand button thtat shows dealer card and value
//function for bet
//function to start game
// can set money equal to variable then update that and add to html element
//need to add dealer and player value tracker to appendCard function
const $dealerCard = $('#dCardOne');
const $dealCardTwo = $('#dCardTwo')
const $yourCardOne = $('#youCardOne');
const $yourCardTwo = $('#youCardTwo');
const $pEl = $('#you') 
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

let playerMoney = 100;
let betAmount = 0

let dealerWon;
let playerWon;
let tie;

//used to update global variable playerValue

function updatePlayerGlobalCount(count){
    count = playerValue
}
//update global dealer count 
function updateComputerGlobalCount(counter){
    counter = dealerValue
}
//used to reset game board
// $('#reset').on('click', function(){
//     location.reload()
// })

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
            console.log('bad request')
        }
    )
}
//call getDeckId to allow startGame to have access to deckId
getDeckId();
//event listener for starting the game
$('#start').on('click', startGame)
//starts game and draws first four cards
function startGame() {
    $.ajax({
        url: "https://deckofcardsapi.com/api/deck/"+deckId+"/draw/?count=4"
    }).then(
        (data) => {
            startingCards = data
            initialCard()
        },
        (error) => {
            console.log('bad request')
        }
    )
}
//sets initial card images and count for game
function initialCard() {
    $dealerCard.attr('src',`${startingCards.cards[0].image}`);
    $dealCardTwo.attr('src', `${startingCards.cards[1].image}`);
    $yourCardOne.attr('src', `${startingCards.cards[2].image}`);
    $yourCardTwo.attr('src', `${startingCards.cards[3].image}`);
    faceCardToNum()
    dealerValue = Number(startingCards.cards[0].value);
    $('#dealerCount').text('Dealer Count: '+dealerValue);
    playerValue = Number(startingCards.cards[2].value) + Number(startingCards.cards[3].value);
    $('#playerCount').text('Player Count: '+playerValue)
    updatePlayerGlobalCount(playerValue)
    updateComputerGlobalCount(dealerValue)
}

$('#hit').on('click', drawCard)
//when click on hit button will draw new card for player and dispaly on screen
function drawCard(){
    $.ajax({
        url: "https://deckofcardsapi.com/api/deck/"+deckId+"/draw/?count=1"
    }).then(
        (data) => {
            addCard = data
            appendCard()
        },
        (error) => {
            console.log('bad request')
        }
    )
}
//adds card to screen when player clicks hit
function appendCard(){
    const $imgEl = $(`<img class="added-card">`)
    $imgEl.insertAfter($yourCardTwo)
    $imgEl.attr('src', `${addCard.cards[0].image}`)
    checkAppendCard()
    updatePlayerCount()
}

//used to change player count when new card is clicked
function updatePlayerCount() {
    playerValue = playerValue + Number(addCard.cards[0].value )
    $('#playerCount').text('Player Count: '+playerValue)
    updatePlayerGlobalCount(playerValue)
    overTwentyOne() 
}


//used to check starting cards values  for facecards
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
                        startingCards.cards[i].value = 11
                        if((playerValue + startingCards.cards[i].value) > 21 || (dealerValue + startingCards.cards[i].value) > 21 ){
                            if((playerValue + startingCards.cards[i].value) > 21){
                                startingCards.cards[i].value = 1
                            }else if((dealerValue + astartingCards.cards[i].value) > 21){
                                startingCards.cards[i].value = 1
                            }
                        }else if ((playerValue + startingCards.cards[i].value) < 21 || (dealerValue + startingCards.cards[i].value) < 21){
                            if((playerValue + startingCards.cards[i].value) > 21){
                                startingCards.cards[i].value = 11
                            }else if((dealerValue + startingCards.cards[i].value) > 21){
                                startingCards.cards[i].value = 11
                            }
                        }
                    }
                }
                break;
            default:
                startingCards.cards[i].value = startingCards.cards[i].value;
        }
    }
}
//used to check the added cards value for facecards and assign ace card value
function checkAppendCard(){
    for(let i=0; i < addCard.cards.length; i++){
        switch(addCard.cards[i].value){
            case 'QUEEN':
                addCard.cards[i].value = 10
                break;
            case 'KING':
                addCard.cards[i].value = 10
                break;
            case 'JACK':
                addCard.cards[i].value = 10
                break;
            case 'ACE':
                checkAce()
                function checkAce(){
                    if(addCard.cards[i].value === "ACE"){
                        addCard.cards[i].value = 11
                        if((playerValue + addCard.cards[i].value) > 21 || (dealerValue + addCard.cards[i].value) > 21 ){
                            if((playerValue + addCard.cards[i].value) > 21){
                                addCard.cards[i].value = 1
                            }else if((dealerValue + addCard.cards[i].value) > 21){
                                addCard.cards[i].value = 1
                            }
                        }else if ((playerValue + addCard.cards[i].value) < 21 || (dealerValue + addCard.cards[i].value) < 21){
                            if((playerValue + addCard.cards[i].value) > 21){
                                addCard.cards[i].value = 11
                            }else if((dealerValue + addCard.cards[i].value) > 21){
                                addCard.cards[i].value = 11
                            }
                        }
                    }
                }
                break;
            default:
                addCard.cards[i].value = addCard.cards[i].value;
        }
    }
}



//click stand button, card#2 is displayed and dealercount is updated.
//if delaer count <17 dealer draws, if count >=17 no dealer draw, if dealer count =21 dealer win.
$('#stand').on('click', dealerPlay)

function dealerPlay(){
    $.ajax({
        url: "https://deckofcardsapi.com/api/deck/"+deckId+"/draw/?count=1"
    }).then(
        (data) => {
            addCard = data
            showDealerCard()
        },
        (error) => {
            console.log(data)
        }
    )
}

//shows dealer card and count
function showDealerCard(){
    $dealCardTwo.css('opacity', '1')
    dealerValue = Number(startingCards.cards[0].value) + Number(startingCards.cards[1].value);
    $('#dealerCount').text('Dealer Count: '+dealerValue);
    updateComputerGlobalCount(dealerValue)
    dealerLogic()
}

//appends new img to dealCardTwo element.
function addDealerCard(){
    const $dealerImgEl = $('<img class="added-card">')
    $dealerImgEl.insertAfter($dealCardTwo)
    $dealerImgEl.attr('src', `${addCard.cards[0].image}`)
    checkAppendCard()
    dealerValue = dealerValue + Number(addCard.cards[0].value)
    $('#dealerCount').text('Dealer Count: '+dealerValue);
    updateComputerGlobalCount(dealerValue)
}

//used to have dealer draw cards after stand button hit and compare who is the winner
function dealerLogic(){
    while(dealerValue <= 21){
        updateComputerGlobalCount(dealerValue)
    if(dealerValue === 21){
        compareCounts()
        break;
    }else if(dealerValue >= 22){
        overTwentyOne()
        break;
    }else if(dealerValue <21 && dealerValue >= 17){
            compareCounts()
        break;
    }else{
        addDealerCard()
    }
}if(dealerValue >=22){overTwentyOne()}
}

//used to check if player or computer go over twenty one
function overTwentyOne() {
    if(playerValue >= 22){
        // console.log('player lost')
        playerWon = false;
        dealerWon = true;
    }else if(dealerValue >= 22){
        // console.log('player has won, add x2 to money')
        dealerWon = false;
        playerWon = true;
    }endOfRound()
}

//calculates winner if neither are 21 
function compareCounts(){
    let compareDealer = 21 - dealerValue
    let comparePlayer = 21 - playerValue
    if(compareDealer === comparePlayer){
        // console.log("it's a tie")
        tie = true;
    }else if(compareDealer > comparePlayer){
        // console.log('dealer lost, player won')
        dealerWon = false;
        playerWon = true;
    }else if(compareDealer < comparePlayer){
        // console.log('player lost, computer won')
        dealerWon = true;
        playerWon = false;
    }endOfRound()
}


function endOfRound(){
    if(tie){
        playerMoney = playerMoney + betAmount
        betAmount = 0;
        updateMoneyAndBet()
    }else if(playerWon){
        console.log('congrats you won your bet x2')
        playerMoney = playerMoney + (betAmount * 2)
        betAmount = 0;
        updateMoneyAndBet()
    }else if(dealerWon){
        console.log('you lost, lose you bet')
        playerMoney = playerMoney - betAmount;
        betAmount = 0
        updateMoneyAndBet()
    }
}

$('#bet').on('click',placeBet)


function placeBet(){
    betAmount = 10
    playerMoney = playerMoney - betAmount
    updateMoneyAndBet()
}

function updateMoneyAndBet(){
    $('#amount-bet').text(`Betting: $${betAmount}`)
    $('#player-money').text(`Starting amount: $${playerMoney}`)
}
$('#next-round').on('click',function(){
    console.log('works')
    nextRound()
})
function nextRound() {
    $('.added-card').remove()
    $dealCardTwo.css('opacity', '0')
    if(playerMoney > 0){
        startGame()
    }else {alert('Oh no you ran out of money')}

}
//funciton that calls start after endofround is called.
//click removes previous cards from scrren. can assing img added an id then remove those id's, can readd the opacity to dealer card 2



//issue to fix, when player gets dealt 21 in first hand should automatically win.