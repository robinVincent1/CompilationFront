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
        <div className="absolute left-8 top-8"> 
          <div className="flex">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-9 h-9">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
        </svg>
        {player.wallet}
        </div>
        <div className="flex">
      
      <svg fill="white" className="w-9 h-9" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
      <path d="M199.03711,198.30981a99.82288,99.82288,0,0,0,0-140.61962A3.982,3.982,0,0,0,198.71,57.29a3.90416,3.90416,0,0,0-.40088-.32776,99.8226,99.8226,0,0,0-140.61816,0A3.90416,3.90416,0,0,0,57.29,57.29a3.982,3.982,0,0,0-.32715.40015,99.82288,99.82288,0,0,0,0,140.61962A3.982,3.982,0,0,0,57.29,198.71a3.93475,3.93475,0,0,0,.40088.32764,99.82231,99.82231,0,0,0,140.61816,0A3.93475,3.93475,0,0,0,198.71,198.71,3.982,3.982,0,0,0,199.03711,198.30981ZM36.09229,132H68.14844a59.72942,59.72942,0,0,0,14.72217,35.47327L60.2124,190.13135A91.64821,91.64821,0,0,1,36.09229,132ZM60.2124,65.86865,82.87061,88.52673A59.72942,59.72942,0,0,0,68.14844,124H36.09229A91.64821,91.64821,0,0,1,60.2124,65.86865ZM219.90771,124H187.85156a59.72942,59.72942,0,0,0-14.72217-35.47327L195.7876,65.86865A91.64821,91.64821,0,0,1,219.90771,124ZM128,180a52,52,0,1,1,52-52A52.059,52.059,0,0,1,128,180Zm39.47314-97.12952A59.73257,59.73257,0,0,0,132,68.14819V36.09229A91.64757,91.64757,0,0,1,190.13135,60.2124ZM124,68.14819A59.73257,59.73257,0,0,0,88.52686,82.87048L65.86865,60.2124A91.64757,91.64757,0,0,1,124,36.09229ZM88.52686,173.12952A59.73257,59.73257,0,0,0,124,187.85181v32.0559A91.64757,91.64757,0,0,1,65.86865,195.7876ZM132,187.85181a59.73257,59.73257,0,0,0,35.47314-14.72229l22.65821,22.65808A91.64757,91.64757,0,0,1,132,219.90771Zm41.12939-20.37854A59.72942,59.72942,0,0,0,187.85156,132h32.05615a91.64821,91.64821,0,0,1-24.12011,58.13135Z"/>
      </svg>
         {player.bet}
      
      </div>
        </div>
      <h1 className="font-bold text-4xl p-8">Blackjack Game</h1>
      {enCours != "start" && enCours != "betOk" && enCours != "fini" && (
      <p>{player.clock}</p>
      )}
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
