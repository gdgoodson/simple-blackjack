/*
heart: &#9829;
spades: &#9824;
diamonds: &#9830;
clubs: &#9827;

*/
document.addEventListener('DOMContentLoaded', () => {
  const hearts = '&#9829;'
  const spades = '&#9824;'
  const diamonds = '&#9830;'
  const clubs = '&#9827;'
  const suits = [hearts, spades, diamonds, clubs]
  const values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10]
  const names = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  const dealerCardOne = document.querySelector('#deal-card-one')
  const dealerCardTwo = document.querySelector('#deal-card-two')
  const dealerCardThree = document.querySelector('#deal-card-three')
  const dealerCardFour = document.querySelector('#deal-card-four')
  const dealerCardFive = document.querySelector('#deal-card-five')
  const dealerCardSix = document.querySelector('#deal-card-six')
  const playerCardOne = document.querySelector('#player-card-one')
  const playerCardTwo = document.querySelector('#player-card-two')
  const playerCardThree = document.querySelector('#player-card-three')
  const playerCardFour = document.querySelector('#player-card-four')
  const playerCardFive = document.querySelector('#player-card-five')
  const playerCardSix = document.querySelector('#player-card-six')
  const dealerCards = [dealerCardOne, dealerCardTwo, dealerCardThree, dealerCardFour, dealerCardFive, dealerCardSix]
  const playerCards = [playerCardOne, playerCardTwo, playerCardThree, playerCardFour, playerCardFive, playerCardSix]
  const playerWallet = document.querySelector('#wallet')
  const betButton = document.querySelector('#submit-bet')
  const hitButton = document.querySelector('#hit')
  const stayButton = document.querySelector('#stay')
  const dealerConsole = document.querySelector('.console')
  const playerBet = document.querySelector('#player-bet')
  let deck = []
  let playerHand = []
  let dealerHand = []
  let wallet = 200
  let bet = 0
  let betOn = true
  let hitOn = false
  let stayOn = false
  let dealerTurn = false

  function makeDeck () {
    for (var i = 0; i < suits.length; i++) {
      for (var j = 0; j < names.length; j++) {
        deck.push([names[j], suits[i], values[j]])
      }
    }
  }

  function shuffle (a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  // draws cards
  function drawCard (cardBox, card) {
    if (card[1] === '&#9829;' || card[1] === '&#9830;') {
      cardBox.innerHTML = '<div class="card heartsdiamonds"><div class="card-top">' + card[0] + '</div><div class="card-middle">' + card[1] + '</div><div class="card-bottom">' + card[0] + '</div></div>'
    } else {
      cardBox.innerHTML = '<div class="card clubsspades"><div class="card-top">' + card[0] + '</div><div class="card-middle">' + card[1] + '</div><div class="card-bottom">' + card[0] + '</div></div>'
    }
  }

  // The next two cards place the first card delt to dealer face down
  function drawBackCard (cardBox) {
    cardBox.innerHTML = '<div class="card back-card"></div>'
  }

  function drawDealerCard (dealerCards, dealerHand) {
    drawBackCard(dealerCards[1])
    drawCard(dealerCards[0], dealerHand[0])
  }

  function dealCard (deck, hand) {
    var cardDealt = deck.splice(0, 1)
    hand.push(cardDealt[0])
  }

  function drawPlayerCards (playerCards, playerHand) {
    for (var i = 0; i < playerHand.length; i++) {
      drawCard(playerCards[i], playerHand[i])
    }
  }

  function drawNextCard (playerCards, playerHand) {
    drawCard(playerCards[playerHand.length - 1], playerHand[playerHand.length - 1])
  }

  function sumHand (hand) {
    var sum = 0
    var acesNum = 0
    for (var i = 0; i < hand.length; i++) {
      if (hand[i][0] === 'A') {
        acesNum++
      }
      sum = sum + hand[i][2]
    }
    if (acesNum > 0 && sum > 21) {
      while (acesNum > 0 && sum > 21) {
        sum = sum - 10
        acesNum--
      }
    }
    return sum
  }

  function blackJack (hand, sum) {
    if (sum(hand) === 21) {
      return true
    }
  }

  function playerWinHand () {
    wallet = wallet + parseInt(bet)
    dealerConsole.innerHTML = 'You win! Place a new bet.'
    playerWallet.innerHTML = wallet
    betOn = true
    hitOn = false
    stayOn = false
    playerHand = []
    dealerHand = []
    bet = 0
  }

  function dealerwin () {
    wallet = wallet - parseInt(bet)
    dealerConsole.innerHTML = 'Dealer wins! Place a new bet.'
    playerWallet.innerHTML = wallet
    betOn = true
    hitOn = false
    stayOn = false
    playerHand = []
    dealerHand = []
    bet = 0
  }

  function playerNoMoney () {
    dealerConsole.innerHTML = 'Out of money. Click reset to play again.'
    playerWallet.innerHTML = wallet
    betOn = false
    hitOn = false
    stayOn = false
    playerHand = []
    dealerHand = []
    bet = 0
  }

  function dealerPlays () {
    if (sumHand(dealerHand) < 17) {
      dealCard(deck, dealerHand)
      //drawPlayerCards(dealerCards, dealerHand)
      drawNextCard(dealerCards, dealerHand)
    } else if (sumHand(dealerHand) > 21) {
      playerWinHand(bet, wallet)
      dealerTurn = false
    } else if (sumHand(dealerHand) >= 17) {
      if (sumHand(playerHand) > sumHand(dealerHand)) {
        playerWinHand(bet, wallet)
        dealerTurn = false
      } else if (sumHand(playerHand) < sumHand(dealerHand)) {
        dealerwin(bet, wallet)
        if (wallet <= 0) {
          playerNoMoney()
        }
        dealerTurn = false
      } else {
        // if both hands are equal
        dealerTurn = false
        dealerConsole.innerHTML = 'Push. Bet again.'
        betOn = true
        hitOn = false
        stayOn = false
        playerHand = []
        dealerHand = []
        bet = 0
      }
    }
  }

  makeDeck()
  shuffle(deck)

  // clicking the bet button starts the game
  betButton.addEventListener('click', () => {
    if (betOn === false) {
      dealerConsole.innerHTML = 'Cards have been delt. Your bet: $' + bet
    } else {
      if (deck.length < 10) {
        // reshuffles cards if deck is getting low
        deck = []
        makeDeck()
        shuffle(deck)
      }
      bet = playerBet.value
      console.log(bet)
      if (bet < 1) {
        dealerConsole.innerHTML = 'Do you take me for a fool? Bet again.'
      } else if (bet > wallet) {
        dealerConsole.innerHTML = 'You can not afford that. Bet again'
      } else {
        for (var i = 0; i < playerCards.length; i++) {
          // clearing table of cards
          dealerCards[i].innerHTML = ''
          playerCards[i].innerHTML = ''
        }
        betOn = false
        hitOn = true
        stayOn = true
        dealerConsole.innerHTML = 'Your bet is $' + bet
        // deals the cards then draws them on table
        dealCard(deck, playerHand)
        dealCard(deck, dealerHand)
        dealCard(deck, playerHand)
        dealCard(deck, dealerHand)
        drawPlayerCards(playerCards, playerHand)
        drawDealerCard(dealerCards, dealerHand)
        if (blackJack(playerHand, sumHand)) {
          playerWinHand(bet, wallet)
        } else if (blackJack(dealerHand, sumHand)) {
          drawPlayerCards(dealerCards, dealerHand)
          dealerwin(bet, wallet)
          if (wallet <= 0) {
            playerNoMoney()
          }
        }
      }
    }
  })

  hitButton.addEventListener('click', () => {
    if (hitOn === true) {
      dealCard(deck, playerHand)
      //drawPlayerCards(playerCards, playerHand)
      drawNextCard(playerCards, playerHand)
      if (sumHand(playerHand) > 21) {
        dealerConsole.innerHTML = 'You busted. Bet again.'
        wallet = wallet - parseInt(bet)
        playerWallet.innerHTML = wallet
        betOn = true
        hitOn = false
        stayOn = false
        playerHand = []
        dealerHand = []
        bet = 0
        if (wallet <= 0) {
          playerNoMoney()
        }
      }
    }
  })

  // Clicking stay starts dealer's turn
  stayButton.addEventListener('click', () => {
    if (stayOn) {
      // reveal dealer's hidden card
      drawNextCard(dealerCards, dealerHand)
      dealerTurn = true
      while (dealerTurn) {
        dealerPlays()
      }
    }
  })
})
