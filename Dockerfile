# Utiliser une image de base Node.js
FROM node:latest
# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install

# Copier tous les fichiers de l'application dans le conteneur
COPY . .

RUN npm install -S npx

# Exposer le port sur lequel l'application s'exécute
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "run", "start:debug"]
