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
  gameStatus: string;
  isStanding: boolean;
  hand: string[]; //Cartes que le joueur posséde
  clock : number;
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
    gameStatus: "En cours",
    isStanding: false,
    hand: [],
    clock : 0,
  });
  const [majhit, setMajhit] = useState(0);
 

  useEffect(() => {
    const handleGameData = (data: any) => {
      console.log("player", data.eventData.player);
      setDealer(data.eventData.dealer);
      setPlayer(data.eventData.player);
      if (data.eventData.player.gameStatus == "Busted"){
        setEncours("fini");
      }
    };
    webSocketService.connect("ws://localhost:8080/game", handleGameData);
  }, []);



  function gameMessage() {
    if (player.gameStatus == "Menu"){
      return "Faites vos jeux ! ";
    }
    if (player.gameStatus == "BetDone"){
      return "Rien ne va plus";
    }
    if (player.gameStatus == "Blackjack"){
      return "Blackjack";
    }
    if (player.gameStatus == "Busted"){
      return "Busted";
    }
    if (player.gameStatus == "Tie"){
      return "Tie";
    }
    if (player.gameStatus == "Winner"){
      return "Win";
    }
    if (player.gameStatus == "Loser"){
      return "Lose";
    }

  }
  function hit() {
    webSocketService.sendMessage(`${player.id}:hit`);
    setMajhit(majhit + 1);
  }

  function stand() {
    webSocketService.sendMessage(`${player.id}:stand`);
    setEncours("fini");
  }

  function deal() {
    console.log("deal");
    webSocketService.sendMessage(`${player.id}:deal`);
    setEncours("partie");
  }

  function reload() {
    webSocketService.sendMessage(`${player.id}:reload`);
    setEncours("start");
  }

  function bet() {
    if (amount > 0 && amount <= player.wallet) {
      // Vérification de la valeur de la mise
      webSocketService.sendMessage(`${player.id}:bet:${amount}`);
      setBetOk(true);
      setBetIsShow(false);
      setAmount(0);
      setEncours("betOk");
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
  const [betMade, setBetMade] = useState(false);
  const [enCours, setEncours] = useState("start");

  return (
    <div>
      <h1 className="font-bold text-4xl p-8">Blackjack Game</h1>
      <p>{player.clock}</p>
      <p className="font-bold text-[red] text-2xl p-8">
        {gameMessage()}
      </p>
      <div>
        {enCours != "start" && enCours != "betOk" && (
        <h2>Dealer's Hand {player.isStanding && dealer.score}</h2>
        )}
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
        {enCours != "start" && enCours != "betOk" && (
        <h2 className=""> Player's Hand {player.score}</h2>
        )}
        <div className="flex">
          <p className="p-2">Porte-Feuille : {player.wallet}</p>
          <p className="p-2">Mise : {player.bet}</p>
        </div>
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
      {enCours == "betOk" && (
        <button
          className="p-4 font-bold"
          onClick={() => {
            deal();
          }}
        >
          Deal
        </button>
      )}
      {enCours == "start" && (
        <div>
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
        </div>
      )}
      {enCours == "partie" && (
        <div>
          <button className="p-4 font-bold" onClick={() => hit()}>
            Hit
          </button>
          <button className="font-bold" onClick={stand}>
            Stand
          </button>
        </div>
      )}
      {enCours == "fini" && (
        <button className="p-4 font-bold" onClick={reload}>
          Nouvelle Partie
        </button>
      )}
    </div>
  );
};
