# Usamos alpine por ligereza, pero instalamos lo necesario para Prisma
FROM node:22-alpine

# Instalamos dependencias necesarias para que Prisma funcione en Alpine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# 1. Copiamos archivos de dependencias
COPY package*.json ./

# 2. Copiamos la carpeta prisma (necesaria para el generate)
COPY prisma ./prisma/

# 3. Instalamos todo (incluyendo prisma)
RUN npm install

# 4. Copiamos el resto del código
COPY . .

# 5. Generamos el cliente de Prisma para que esté listo al arrancar
RUN npx prisma generate

EXPOSE 3000

# Usamos dev para que nodemon funcione dentro de Docker
CMD ["npm", "run", "dev"]