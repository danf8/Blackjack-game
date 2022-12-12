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

//used to reset game board
$('#reset').on('click', function(){
    location.reload()
})

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
    const $imgEl = $(`<img>`)
    $imgEl.insertAfter($yourCardTwo)
    $imgEl.attr('src', `${addCard.cards[0].image}`)
    checkAppendCard()
    updatePlayerCount()
}

//used to change player count when new card is clicked
function updatePlayerCount() {
    playerValue = playerValue + Number(addCard.cards[0].value )
    $('#playerCount').text('Player Count: '+playerValue)
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
                startingCards.cards[i].value = 11;
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
                addCard.cards[i].value = 11
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
    dealerLogic()
}

//appends new img to dealCardTwo element.
function addDealerCard(){
    const $dealerImgEl = $('<img>')
    $dealerImgEl.insertAfter($dealCardTwo)
    $dealerImgEl.attr('src', `${addCard.cards[0].image}`)
    dealerValue = dealerValue + Number(addCard.cards[0].value)
    $('#dealerCount').text('Dealer Count: '+dealerValue);
}

//used to have dealer draw cards after stand button hit and compare.
function dealerLogic(){
    while(dealerValue < 21){
        console.log(dealerValue)
    if(dealerValue === 21){
        console.log('compare counts')
        break;
    }else if(dealerValue > 21){
        console.log('dealer lose, player wins')
        break;
    }else if(dealerValue <21 && dealerValue >= 17){
        console.log('compare counts')
        break;
    }else{
        addDealerCard()
    }
}
}

//compare counts of dealer and player.

function tieEvent(){
    updatePlayerCount()
    console.log(playerValue)
    // if(playerValue === dealerValue){
    //     console.log('It\'s a tie!')
    // }else{
    //     console.log('Dealer has won!')
    // }
}

//this is for game win function
//compare counts function
//if dealer count and player count same result tie
//if dealer or player over 21 they lose
//compare dealer count to player count, if player closed to 21, player wins
//if dealer closer to 21 dealer wins
