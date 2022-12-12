//function for hit that draws another card to your hand
//function for stand button thtat shows dealer card and value
//function for bet
//function to start game
// can set money equal to variable then update that and add to html element
//need to add dealer and player value tracker to appendCard function
const $dealerCard = $('#dCardOne');
let $dealCardTwo = $('#dCardTwo')
let $yourCardOne = $('#youCardOne');
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
//used to assign card when play clicks hit
let addCard;


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
    dealerValue = Number(startingCards.cards[0].value) + Number(startingCards.cards[1].value);
    $('#dealerCount').text(dealerValue);
    playerValue = Number(startingCards.cards[2].value) + Number(startingCards.cards[3].value);
    $('#playerCount').text(playerValue)
}

$('#hit').on('click', drawCard)

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

function appendCard(){
    const $imgEl = $(`<img>`)
    $imgEl.insertAfter($yourCardTwo)
    $imgEl.attr('src', `${addCard.cards[0].image}`)
    //need to add dealer and player value tracker here
}
