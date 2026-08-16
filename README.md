# NR MUSIC

Bot musical para Discord basado en Lavalink/Shoukaku.

## Requisitos

- Node.js 20+
- Un servidor Lavalink accesible
- Token de Discord
- Client ID de Discord

## Variables de entorno

Copia `.env.example` a `.env` y configura:

- `DISCORD_TOKEN`
- `CLIENT_ID`
- `LAVALINK_HOST`
- `LAVALINK_PORT`
- `LAVALINK_PASSWORD`
- `LAVALINK_SECURE`

## Render

El proyecto incluye `render.yaml`.

En Render:
1. Sube el proyecto a GitHub.
2. Crea un servicio desde el repositorio.
3. Render ejecutará `npm install` y `npm start`.
4. Añade las variables de entorno del `.env.example`.

## Comandos

El ejemplo conserva la base de reproducción del proyecto original. Puedes ampliar los comandos desde `examples/`.

## Nota

NR MUSIC necesita un nodo Lavalink funcional para reproducir audio.
