//function for hit that draws another card to your hand
//function for stand button thtat shows dealer card and value
//function for bet
//function to start game
//
const $dealerCard = $('#dCardOne');
let $dealCardTwo = $('#dCardTwo')
let $yourCardOne = $('#youCardOne');
let $yourCardTwo = $('#youCardTwo');
const $pEl = $('#you') 
//used to track player card value
let playerValue;
//used to track dealers card value.
let dealerValue;
//sets deck id
let deckId;

let startingCards;

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

function initialCard() {
    $dealerCard.attr('src',`${startingCards.cards[0].image}`)
    $dealCardTwo.attr('src', `${startingCards.cards[1].image}`)
    $yourCardOne.attr('src', `${startingCards.cards[2].image}`)
    $yourCardTwo.attr('src', `${startingCards.cards[3].image}`)
}

$('#hit').on('click', drawCard)

function drawCard(){
    appendCard()
    console.log(appendCard)
    $.ajax({
        url: "https://deckofcardsapi.com/api/deck/"+deckId+"/draw/?count=1"
    }).then(
        (data) => {
            console.log(data)
        },
        (error) => {
            console.log('bad request')
        }
    )
}
function appendCard(){
    const $imgEl = $(`<img>`)
    $('#you').append($imgEl)
}
