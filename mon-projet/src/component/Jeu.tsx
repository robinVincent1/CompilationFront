import React, { useState, useEffect } from "react";
import { webSocketService } from "./WebSocketService";

type Dealer = {
  score: number; // Score du dealer
  hand: string[]; //Cartes que le dealer posséde
};

type Player = {
  id: number; // Identifiant du joueur  (gnéré par le serveur)
  pseudo: string; // Pseudo du joueur
  wallet: number; // Argent du joueur
  bet: number; //Mise du joueur
  score: number; //Score du joueur
  altScore: number | null; //Score alternatif pour l'as
  gameStatus: string; //Statut de la partie
  isStanding: boolean; //Le joueur a t il stand ou non 
  hand: string[]; //Cartes que le joueur posséde
  clock: number; //Temps restant pour le joueur
}; 

export const Jeu = () => {
  const [dealer, setDealer] = useState<Dealer>({
    score: 0,
    hand: [],
  });
  const [player, setPlayer] = useState<Player>({
    id: 0,
    pseudo: "",
    wallet: 0,
    bet: 0,
    score: 0,
    altScore: null,
    gameStatus: "En cours",
    isStanding: false,
    hand: [],
    clock: 0,
  });
  const [betOk, setBetOk] = useState(true); // Vérification de la mise
  const [enCours, setEncours] = useState("pseudo"); // Statut de la partie
  const [pseudo, setPseudo] = useState(""); // Pseudo du joueur 
  const [betIsShow, setBetIsShow] = useState(false); // Affichage de la mise 
  const [amount, setAmount] = useState(0); // Mise du joueur

  useEffect(() => {
    const handleGameData = (data: any) => {
      setDealer(data.eventData.dealer); // Mise à jour des données du dealer
      setPlayer(data.eventData.player); // Mise à jour des données du joueur 
      if (data.eventData.player.gameStatus === "Busted") { // Si le joueur est busted
        setEncours("fini"); // Fin de la partie
      }
    };
    webSocketService.connect("ws://localhost:8080/game", handleGameData); // Connexion au serveur et réception des données
  }, []);

  function gameMessage() {
    if (player.gameStatus === "Menu") { // Si le joueur est dans le menu
      return "Faites vos jeux ! ";
    }
    if (player.gameStatus === "BetDone") { // Si le joueur a fait sa mise 
      return "Rien ne va plus";
    }
    if (player.gameStatus === "Blackjack") { // Si le joueur a un blackjack
      return "Blackjack";
    }
    if (player.gameStatus === "Busted") { // Si le joueur est busted
      return "Busted";
    }
    if (player.gameStatus === "Tie") { // Si le joueur est à égalité
      return "Tie";
    }
    if (player.gameStatus === "Winner") { // Si le joueur a gagné
      return "Win";
    }
    if (player.gameStatus === "Loser") { // Si le joueur a perdu
      return "Lose";
    }
  }
  function hit() { // Fonction pour demander une carte
    webSocketService.sendMessage(`${player.id}:hit`); // Envoi d'un message au serveur pour demander une carte 
  }

  function assurance() { // Fonction pour demander une assurance
    webSocketService.sendMessage(`${player.id}:assurance`); // Envoi d'un message au serveur pour demander une assurance
  }

  function double() { // Fonction pour doubler la mise 
    webSocketService.sendMessage(`${player.id}:double`); // Envoi d'un message au serveur pour doubler la mise 
    setEncours("fini"); // Fin de la partie
  }

  function stand() {
    webSocketService.sendMessage(`${player.id}:stand`); // Envoi d'un message au serveur pour stand
    setEncours("fini"); // Fin de la partie
  }

  function deal() {
    webSocketService.sendMessage(`${player.id}:deal`); // Envoi d'un message au serveur pour commencer une nouvelle partie
    setEncours("partie"); // Début de la partie 
  }

  function reload() {
    webSocketService.sendMessage(`${player.id}:reload`); // Envoi d'un message au serveur pour recharger la page
    setEncours("start"); // Début de la partie
  }

  function sendPseudo() { // Fonction pour envoyer le pseudo
    webSocketService.sendMessage(`${player.id}:pseudo:${pseudo}`) // Envoi d'un message au serveur pour envoyer le pseudo
    setEncours("start") // Début de la partie
  }

  function bet() { // Fonction pour miser
    if (amount > 0 && amount <= player.wallet) {// Vérification de la valeur de la mise
      webSocketService.sendMessage(`${player.id}:bet:${amount}`); // Envoi d'un message au serveur pour miser
      setBetOk(true); // La mise est ok
      setBetIsShow(false); // La mise n'est plus affichée
      setAmount(0); // La mise est remise à 0
      setEncours("betOk"); // La mise à était faite la partie peut continuer 
    } else {
      setBetOk(false); // La mise n'est pas ok
    }
  }

  const handleBet = (event: React.ChangeEvent<HTMLInputElement>) => { // Fonction pour gérer la mise
    const value = parseFloat(event.target.value); // Récupération de la valeur de la mise 
    if (!isNaN(value)) { // Si la valeur est un nombre
      setAmount(value); // Mise à jour de la valeur de la mise
    }
  };


  const handlePseudo = (event: React.ChangeEvent<HTMLInputElement>) => { // Fonction pour gérer le pseudo
      setPseudo(event.target.value) // Mise à jour du pseudo
  }

  return (
    <div>
      <div className="">
        <div className="absolute left-8 top-8">
          {/* Afficher le portefeuille du joueur */}
          <div className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-9 h-9"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
              />
            </svg>
            {player.wallet}
          </div>
          {/* Afficher la mise du joueur */}
          <div className="flex">
            <svg
              fill="white"
              className="w-9 h-9"
              viewBox="0 0 256 256"
              id="Flat"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M199.03711,198.30981a99.82288,99.82288,0,0,0,0-140.61962A3.982,3.982,0,0,0,198.71,57.29a3.90416,3.90416,0,0,0-.40088-.32776,99.8226,99.8226,0,0,0-140.61816,0A3.90416,3.90416,0,0,0,57.29,57.29a3.982,3.982,0,0,0-.32715.40015,99.82288,99.82288,0,0,0,0,140.61962A3.982,3.982,0,0,0,57.29,198.71a3.93475,3.93475,0,0,0,.40088.32764,99.82231,99.82231,0,0,0,140.61816,0A3.93475,3.93475,0,0,0,198.71,198.71,3.982,3.982,0,0,0,199.03711,198.30981ZM36.09229,132H68.14844a59.72942,59.72942,0,0,0,14.72217,35.47327L60.2124,190.13135A91.64821,91.64821,0,0,1,36.09229,132ZM60.2124,65.86865,82.87061,88.52673A59.72942,59.72942,0,0,0,68.14844,124H36.09229A91.64821,91.64821,0,0,1,60.2124,65.86865ZM219.90771,124H187.85156a59.72942,59.72942,0,0,0-14.72217-35.47327L195.7876,65.86865A91.64821,91.64821,0,0,1,219.90771,124ZM128,180a52,52,0,1,1,52-52A52.059,52.059,0,0,1,128,180Zm39.47314-97.12952A59.73257,59.73257,0,0,0,132,68.14819V36.09229A91.64757,91.64757,0,0,1,190.13135,60.2124ZM124,68.14819A59.73257,59.73257,0,0,0,88.52686,82.87048L65.86865,60.2124A91.64757,91.64757,0,0,1,124,36.09229ZM88.52686,173.12952A59.73257,59.73257,0,0,0,124,187.85181v32.0559A91.64757,91.64757,0,0,1,65.86865,195.7876ZM132,187.85181a59.73257,59.73257,0,0,0,35.47314-14.72229l22.65821,22.65808A91.64757,91.64757,0,0,1,132,219.90771Zm41.12939-20.37854A59.72942,59.72942,0,0,0,187.85156,132h32.05615a91.64821,91.64821,0,0,1-24.12011,58.13135Z" />
            </svg>
            {player.bet}
          </div>
        </div>
        <h1 className="font-bold text-4xl p-8">Blackjack Game</h1>
      </div>
      {/* Afficher le temps restant pour le joueur */}
      {enCours !== "start" && enCours !== "betOk" && enCours !== "fini" && enCours !== "pseudo" && (
      <p>{player.clock}</p>
      )}
      {/* Afficher le choix du pseudo du joueur */}
      {enCours === "pseudo" && (
      <div>
        <div className="p-2">
          <h2 className="p-2"> Choisi ton pseudo</h2>
          <input className="rounded text-[#282c34]" onChange={handlePseudo}/>
        </div>
        <button className="pl-4 pr-4 font-bold border hover:bg-[white] hover:text-[#282c34]"
        onClick={sendPseudo}
        >
        Envoyer
        </button>
      </div>
      )}
      {/* Afficher le message de la partie */}
      {enCours !== "pseudo" && 
      <p className="font-bold text-[red] text-2xl p-8">{gameMessage()}</p>
      }
      <div>
        {/* Afficher les cartes du croupier */}
        {enCours !== "start" && enCours !== "betOk" && enCours !== "pseudo" &&(
        <h2 className="font-bold">Dealer : {player.isStanding && dealer.score}</h2>
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
      <div>
        {/* Si le joueur n'a pas tiré d'as ou n'a pas de score alternatif */}
        {enCours !== "start" && enCours !== "betOk" && !player.altScore && enCours !== "pseudo" &&(
        <h2 className=" font-bold">
          {" "}
          {player.pseudo} : {player.score}
        </h2>
        )}
        {/* Si le joueur a tiré d'as et a un score alternatif */}
        {enCours !== "start" && enCours !== "betOk" && player.altScore && enCours !== "pseudo" &&(
        <h2 className="">
          {" "}
          {player.pseudo} {player.score}/{player.altScore}
        </h2>
        )}
        <div className="flex justify-center">
          {/* Afficher les cartes du joueur */}
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
      {/* Afficher le bouton pour commencer la partie (Distribution des premieres cartes) */}
      {enCours === "betOk" && (
        <button
          className="p-2 pl-4 pr-4 font-bold border hover:bg-[white] hover:text-[#282c34]"
          onClick={() => {
            deal();
          }}
        >
          Deal
        </button>
      )}
      {/* Afficher le bouton pour miser */}
      {enCours === "start" && (
        <div>
          {betIsShow ? (
            <div>
              <input
                type="number"
                className="text-black rounded text-md"
                placeholder={` Max ${player.wallet}`}
                onChange={handleBet}
              />
              <button
                className="p-2 font-bold bg-[red] rounded hover:shadow-2xl ml-4"
                onClick={() => {
                  bet();
                }}
              >
                Miser
              </button>
              {/* Vérification de la mise */}
              {!betOk && amount > 0 && (
                <p className="text-[red]">Vous n'avez pas assez d'argent</p>
              )}
            </div>
          ) : (
            <button
              className="p-2 pl-4 pr-4 font-bold border hover:bg-[white] hover:text-[#282c34]"
              onClick={() => {
                setBetIsShow(true);
              }}
            >
              Bet
            </button>
          )}
        </div>
      )}
      {/* Afficher les boutons pour demander une carte, doubler, assurer, stand */}
      {enCours === "partie" && (
        <div>
          {(player.score === 9 || player.score === 10 || player.score === 11) && (
            <button
              className="p-2 pl-4 pr-4 font-bold border hover:bg-[white] hover:text-[#282c34]"
              onClick={() => double()}
            >
              Doubler
            </button>
          )}
          { dealer.hand[1] === "A-D.png" ||
            dealer.hand[1] === "A-C.png" ||
            dealer.hand[1] === "A-H.png" ||
            (dealer.hand[1] === "A-S.png" && (
              <button className="p-4 font-bold" onClick={() => assurance()}>
                Assurance
              </button>
            ))}
          <button
            className="ml-2 p-2 pl-4 pr-4 font-bold border hover:bg-[white] hover:text-[#282c34]"
            onClick={() => hit()}
          >
            Hit
          </button>
          <button
            className="p-2 pl-4 pr-4 font-bold border hover:bg-[white] hover:text-[#282c34] ml-2"
            onClick={stand}
          >
            Stand
          </button>
        </div>
      )}
      {/* Afficher le bouton pour recommencer une partie */}
      {enCours === "fini" && (
        <button className="p-4 font-bold" onClick={reload}>
          Nouvelle Partie
        </button>
      )}
    </div>
  );
};
