import { randomInt } from "crypto";
import React, { useState, useEffect } from "react";
import { webSocketService } from "./WebSocketService";

type Dealer = {
  score: number;
  isWinner: boolean;
  hand: string[]; //Cartes que le dealer posséde
};

type Player = {
  id: number;
  pseudo: string;
  wallet: number;
  bet: number; //Mise du joueur
  isPlaying: number; //Si le joueur est en train de jouer
  score: number;
  isWinner: boolean;
  isStanding: boolean;
  hand: string[]; //Cartes que le joueur posséde
};

export const Jeu = () => {
  const [dealer, setDealer] = useState<Dealer>({
    score: 0,
    isWinner: false,
    hand: [],
  });
  const [player, setPlayer] = useState<Player>({
    id: 0,
    pseudo: "",
    wallet: 0,
    bet: 0,
    isPlaying: 0,
    score: 0,
    isWinner: false,
    isStanding: false,
    hand: [],
  });

  useEffect(() => {
    const handleGameData = (data: any) => {
      console.log("player", data.eventData.player);
      setDealer(data.eventData.dealer);
      setPlayer(data.eventData.player);
    };
    webSocketService.connect("ws://localhost:8080/game", handleGameData);
  }, []);

  function hit() {
    webSocketService.sendMessage(`${player.id}:hit`);
  }

  function stand() {
    webSocketService.sendMessage(`${player.id}:stand`);
  }

  function deal() {
    console.log("deal");
    webSocketService.sendMessage(`${player.id}:deal`);
  }

  function reload() {
    webSocketService.sendMessage(`${player.id}:reload`);
  }

  function bet() {
    if (amount > 0 && amount <= player.wallet) {
      // Vérification de la valeur de la mise
      webSocketService.sendMessage(`${player.id}:bet:${amount}`);
      setBetOk(true);
      setBetIsShow(false);
    } else {
      setBetOk(false);
    }
  }

  const [betIsShow, setBetIsShow] = useState(false);
  const [amount, setAmount] = useState(0);
  const handleBet = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setAmount(value);
    }
  };

  const [betOk, setBetOk] = useState(true);

  return (
    <div>
      <h1 className="font-bold text-4xl p-8">Blackjack Game</h1>
      <p className="font-bold text-[red] text-2xl p-8">
        {"A changer (winner) "}
      </p>
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
      <div>
        <h2 className=""> Player's Hand {player.score}</h2>
        <p>Mise : {player.bet}</p>
        <div className="flex justify-center">
          {player.hand.map((card, index) => (
            <div className="p-8" key={index}>
              <img
                className="w-32 h-auto"
                src={"/cards/" + card}
                alt={`Card ${index}`}
              />
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
      {betIsShow ? (
        <div>
          <input
            type="number"
            className="text-black"
            placeholder={` Max ${player.wallet}`}
            onChange={handleBet}
          />
          <button
            className="p-4 font-bold"
            onClick={() => {
              bet();
            }}
          >
            Miser
          </button>
          {!betOk && amount > 0 && (
            <p className="text-[red]">Vous n'avez pas assez d'argent</p>
          )}
        </div>
      ) : (
        <button
          className="p-4 font-bold"
          onClick={() => {
            setBetIsShow(true);
          }}
        >
          Bet
        </button>
      )}
      <button className="p-4 font-bold" onClick={() => hit()}>
        Hit
      </button>
      {!player.isStanding && (
        <button className="font-bold" onClick={stand}>
          Stand
        </button>
      )}
      {player.isStanding && (
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
