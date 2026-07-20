ARG NODE_VERSION

# Fase 1: Build (Compilação do Vite)
FROM node:${NODE_VERSION}-slim AS builder

USER root

WORKDIR /app

# Copia arquivos de dependência
COPY package.json package-lock.json ./

# Instala dependências (incluindo devDependencies necessárias para o build)
RUN npm ci

# Copia o código fonte
COPY . .

# Compila o projeto (gera a pasta dist/)
RUN npm run build

# Fase 2: Produção (Imagem limpa com nginx para servir os arquivos estáticos)
FROM nginx:alpine AS production

# Remove a configuração padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia a configuração personalizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos estáticos gerados na fase de build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
