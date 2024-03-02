import { randomInt } from 'crypto';
import React, { useState } from 'react';

export const Jeu = () => {
  const [Cards, setCards] = useState<string[]>(["2-C.png", "2-D.png", "2-H.png", "2-S.png", "3-C.png", "3-D.png", "3-H.png", "3-S.png", "4-C.png", "4-D.png", "4-H.png", "4-S.png", "5-C.png", "5-D.png", "5-H.png", "5-S.png", "6-C.png", "6-D.png", "6-H.png", "6-S.png", "7-C.png", "7-D.png", "7-H.png", "7-S.png", "8-C.png", "8-D.png", "8-H.png", "8-S.png", "9-C.png", "9-D.png", "9-H.png", "9-S.png", "10-C.png", "10-D.png", "10-H.png", "10-S.png", "A-C.png", "A-D.png", "A-H.png", "A-S.png", "J-C.png", "J-D.png", "J-H.png", "J-S.png", "Q-C.png", "Q-D.png", "Q-H.png", "Q-S.png", "K-C.png", "K-D.png", "K-H.png", "K-S.png"]);
  const [dealerCards, setDealerCards] = useState<string[]>([]);
  const [playerCards, setPlayerCards] = useState<string[]>([]);

  const hit = (j: string[]) => {
    let randomIndex = Math.floor(Math.random() * Cards.length);
    let cardToAdd: string = Cards[randomIndex];
    let updatedCards = [...Cards];

    updatedCards.splice(randomIndex, 1);

    if (j === dealerCards) {
      setDealerCards([...dealerCards, cardToAdd]);
      console.log(cardToAdd)
      console.log(dealerCards)
    } else if (j === playerCards) {
      setPlayerCards([...playerCards, cardToAdd]);
    }

    setCards(updatedCards);
  };

  const deal = (j: string[]) => {
    let randomIndex = Math.floor(Math.random() * Cards.length);
    let cardToAdd: string = Cards[randomIndex];
    let updatedCards = [...Cards];

    updatedCards.splice(randomIndex, 1);

    if (j === dealerCards) {
      setDealerCards([...dealerCards, cardToAdd]);
      console.log(cardToAdd)
      console.log(dealerCards)
    } else if (j === playerCards) {
      setPlayerCards([...playerCards, cardToAdd]);
    }

    setCards(updatedCards);

    let randomIndex2 = Math.floor(Math.random() * Cards.length);
    let cardToAdd2: string = Cards[randomIndex];
    let updatedCards2 = [...Cards];

    updatedCards.splice(randomIndex2, 1);

    if (j === dealerCards) {
      setDealerCards([...dealerCards, cardToAdd2]);
      console.log(cardToAdd2)
      console.log(dealerCards)
    } else if (j === playerCards) {
      setPlayerCards([...playerCards, cardToAdd2]);
    }

    setCards(updatedCards2);
  };

  const stand = () => {
    // Logique pour terminer le tour du joueur et laisser le croupier jouer
  };

  return (
    <div>
      <h1>Blackjack Game</h1>
      {/* Afficher les cartes du joueur */}
      <div>
        <h2>Player's Hand</h2>
        {playerCards.map((card, index) => (
          <div key={index}>
            <img src={"/cards/" + card} alt={`Card ${index}`} />
          </div>
        ))}
      </div>
      {/* Afficher les cartes du croupier */}
      <div>
        <h2>Dealer's Hand</h2>
        {dealerCards.map((card, index) => (
          <div key={index}>
            <img src={"/cards/" + card} alt={`Card ${index}`} />
          </div>
        ))}
      </div>
      {/* Boutons d'action */}
      <button onClick={() => {
        deal(playerCards)
        deal(dealerCards)}}>Deal</button>
      <button onClick={() => hit(playerCards)}>Hit</button>
      <button onClick={stand}>Stand</button>
    </div>
  );
};