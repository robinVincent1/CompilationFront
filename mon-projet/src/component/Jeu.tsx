import { randomInt } from 'crypto';
import React, { useState,useEffect } from 'react';
import { webSocketService } from './WebSocketService';

type Dealer = {
  score : number ;
  isWinner : boolean;
  hand: string[]; //Cartes que le dealer posséde
}

type Player = {
  id : number;
  pseudo : string;
  wallet : number;
  bet : number ; //Mise du joueur
  isPlaying : number ; //Si le joueur est en train de jouer
  score : number ;
  isWinner : boolean;
  isStanding : boolean;
  hand: string[]; //Cartes que le joueur posséde
}

type CardDeck = {
  id : number;
  cards : string[]; //Cartes restantes dans le deck
  nbCards : number; //Nombre de cartes restantes
}

export const Jeu = () => {
  const [dealer, setDealer] = useState<Dealer>({score:0, isWinner:false, hand:[]});
  const [player, setPlayer] = useState<Player>({id:0, pseudo:"", wallet:0, bet:0, isPlaying:0, score:0, isWinner:false,isStanding:false, hand:[]});
  const [cardDeck, setCardDeck] = useState<CardDeck>({id:0, cards:[], nbCards:0});
  



  return (
    <div>
      <h1 className="font-bold text-4xl p-8">Blackjack Game</h1>
      <p className='font-bold text-[red] text-2xl p-8'>{"A changer (winner) " }</p>
      <div>
        <h2>Dealer's Hand {player.isStanding && dealer.score}</h2>
        <div className="flex justify-center">
          {dealer.hand.map((card, index) => (
            <div className="p-8" key={index}>
              {player.isStanding ? (
                <img
                  className="w-32 h-auto"
                  src={"/cards/" + card}
                  alt={`Card ${index}`}
                />
              ) : index === 0 ? (
                <img
                  className="w-32 h-auto"
                  src={"/cards/BACK.png"}
                  alt={`Card ${index}`}
                />
              ) : (
                <img
                  className="w-32 h-auto"
                  src={"/cards/" + card}
                  alt={`Card ${index}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Afficher les cartes du joueur */}
      <div >
        <h2 className=''> Player's Hand {player.score}</h2>
        <div className='flex justify-center'>
        {player.hand.map((card, index) => (
          <div className='p-8' key={index}>
            <img  className="w-32 h-auto" src={"/cards/" + card} alt={`Card ${index}`} />
          </div>
        ))}
        </div>
      </div>
      {/* Afficher les cartes du croupier */}
      {/* Boutons d'action */}
      <button
        className="p-4 font-bold"
        onClick={() => {
          deal();
        }}
      >
        Deal
      </button>
      <button className="p-4 font-bold" onClick={() => hit(player.hand)}>
        Hit
      </button>
      {!player.isStanding && (
        <button className="font-bold" onClick={stand}>
          Stand
        </button>
      )}
      {isStand && (
        <button
          className="p-4 font-bold"
          onClick={() => window.location.reload()}
        >
          Nouvelle Partie
        </button>
      )}
    </div>
  );
};
