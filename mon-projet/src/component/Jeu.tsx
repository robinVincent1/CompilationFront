import { randomInt } from 'crypto';
import React, { useState } from 'react';

export const Jeu = () => {
  const [Cards, setCards] = useState<string[]>(["2-C.png", "2-D.png", "2-H.png", "2-S.png", "3-C.png", "3-D.png", "3-H.png", "3-S.png", "4-C.png", "4-D.png", "4-H.png", "4-S.png", "5-C.png", "5-D.png", "5-H.png", "5-S.png", "6-C.png", "6-D.png", "6-H.png", "6-S.png", "7-C.png", "7-D.png", "7-H.png", "7-S.png", "8-C.png", "8-D.png", "8-H.png", "8-S.png", "9-C.png", "9-D.png", "9-H.png", "9-S.png", "10-C.png", "10-D.png", "10-H.png", "10-S.png", "A-C.png", "A-D.png", "A-H.png", "A-S.png", "J-C.png", "J-D.png", "J-H.png", "J-S.png", "Q-C.png", "Q-D.png", "Q-H.png", "Q-S.png", "K-C.png", "K-D.png", "K-H.png", "K-S.png"]);
  const [dealerCards, setDealerCards] = useState<string[]>([]);
  const [playerCards, setPlayerCards] = useState<string[]>([]);
  const [dealerScore, setDealerScore] = useState<number>(0);
  const [playerScore, setPlayerScore] = useState<number>(0);

  const hit = (j: string[]) => {
    let randomIndex = Math.floor(Math.random() * Cards.length);
    let cardToAdd: string = Cards[randomIndex];
    let updatedCards = [...Cards];

    updatedCards.splice(randomIndex, 1);

    if (j === dealerCards) {
      setDealerCards([...dealerCards, cardToAdd]);
      updateDealerScore([cardToAdd]);
    } else if (j === playerCards) {
      setPlayerCards([...playerCards, cardToAdd]);
      updatePlayerScore([cardToAdd]);
    }

    setCards(updatedCards);
  };

  const updatePlayerScore = (cards: string[]) => {
    let tempPlayerScore : number = playerScore;
   for (let i = 0; i < cards.length; i++) {
    let cardValue = cards[i].slice(0, cards[i].indexOf("-"));
    if (cardValue === "A") {
      tempPlayerScore += 11;
    } else if (cardValue === "J" || cardValue === "Q" || cardValue === "K") {
      tempPlayerScore += 10;
    } else {
      tempPlayerScore += parseInt(cardValue);
    }
  };
  setPlayerScore(tempPlayerScore);
  };

  const updateDealerScore = (cards: string[]) => {
    let tempdealerScore : number  = dealerScore;
    for (let i = 0; i < cards.length; i++) {
    let cardValue = cards[i].slice(0, cards[i].indexOf("-"));
    if (cardValue === "A") {
      tempdealerScore += 11;
    } else if (cardValue === "J" || cardValue === "Q" || cardValue === "K") {
      tempdealerScore += 10;
    } else {
      tempdealerScore += parseInt(cardValue);
    }
  };
  setDealerScore(tempdealerScore);
  };

  const deal = () => {
    dealerCards : [] = [];
    playerCards : [] = [];
    let updatedCards = [...Cards];
    for(let i = 0; i < 2; i++) {
    let randomIndex = Math.floor(Math.random() * Cards.length);
    let cardToAdd: string = Cards[randomIndex];
    updatedCards.splice(randomIndex, 1);
    dealerCards.push(cardToAdd);
    }
    updateDealerScore(dealerCards);
    setDealerCards(dealerCards);

    for(let i = 0; i < 2; i++) {
    let randomIndex = Math.floor(Math.random() * Cards.length);
    let cardToAdd: string = Cards[randomIndex];
  
    updatedCards.splice(randomIndex, 1);
    playerCards.push(cardToAdd);
    }
    updatePlayerScore(playerCards);
    setPlayerCards(playerCards);
    setCards(updatedCards);

  };

  const stand = () => {
    // Logique pour terminer le tour du joueur et laisser le croupier jouer
  };

  return (
    <div>
      <h1>Blackjack Game</h1>
      {/* Afficher les cartes du joueur */}
      <div>
        <h2 className='font-bold'>Player's Hand {playerScore}</h2>
        {playerCards.map((card, index) => (
          <div key={index}>
            <img src={"/cards/" + card} alt={`Card ${index}`} />
          </div>
        ))}
      </div>
      {/* Afficher les cartes du croupier */}
      <div>
        <h2>Dealer's Hand {dealerScore}</h2>
        {dealerCards.map((card, index) => (
          <div key={index}>
            <img src={"/cards/" + card} alt={`Card ${index}`} />
          </div>
        ))}
      </div>
      {/* Boutons d'action */}
      <button onClick={() => {
        deal();}}>Deal</button>
      <button onClick={() => hit(playerCards)}>Hit</button>
      <button onClick={stand}>Stand</button>
    </div>
  );
};