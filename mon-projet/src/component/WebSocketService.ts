

// Classe gérant les opérations liées au WebSocket
class WebSocketService {
    // Instance de WebSocket, initialisée à null par défaut
    private ws: WebSocket | null = null;

    // Méthode pour établir une connexion WebSocket
    connect(url: string, onMessage: (data: any) => void) {
        // Création d'une nouvelle instance de WebSocket avec l'URL fournie
        this.ws = new WebSocket(url);

        // Gestionnaire d'événement lorsqu'une connexion WebSocket est ouverte
        this.ws.onopen = () => {
            console.log('WebSocket connected');
        };

        // Gestionnaire d'événement lorsqu'un message est reçu sur le WebSocket
        this.ws.onmessage = (event) => {
            // Conversion du message JSON en objet JavaScript
            const data = JSON.parse(event.data);
            // Appel de la fonction de rappel fournie avec les données du message
            onMessage(data);
        };

        // Gestionnaire d'événement en cas d'erreur sur le WebSocket
        this.ws.onerror = (event) => {
            console.error('WebSocket error', event);
        };

        // Gestionnaire d'événement lorsqu'une connexion WebSocket est fermée
        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
        };
    }

    // Méthode pour envoyer un message sur le WebSocket
    sendMessage(message: string) {
        // Vérification que l'instance de WebSocket est définie
        if (this.ws) {
            // Envoi du message sur le WebSocket
            this.ws.send(message);
        }
    }

    // Méthode pour déconnecter le WebSocket
    disconnect() {
        // Vérification que l'instance de WebSocket est définie
        if (this.ws) {
            // Fermeture de la connexion WebSocket
            this.ws.close();
        }
    }
}

// Instance exportée de la classe WebSocketService
export const webSocketService = new WebSocketService();
