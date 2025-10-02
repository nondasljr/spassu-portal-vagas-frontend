# Frontend (React + Vite) — Dev Simples (sem Nginx)

Este frontend pode falar com um backend **separado** (fora do Docker), como dois servidores independentes.

## Endereços esperados
- Frontend (dev): `http://localhost:5173`
- Backend (separado): por padrão `http://localhost:8000`

---

## Rodar SEM Docker

```bash
# na pasta spassu-frontend/
npm install

# opcional: arquivo .env (se o backend não estiver em http://localhost:8000)
# VITE_API_BASE=http://127.0.0.1:8000

npm run dev
# abra: http://localhost:5173
```

---

## Rodar COM Docker (dev)

Isto sobe **apenas** o frontend com Vite/HMR. O backend fica fora do Docker.

```bash
# na pasta spassu-frontend/
docker compose up -d --build
# abra: http://localhost:5173
```


### Alterar a URL da API (opções)

1) **Editar o compose** e trocar a variável:
```yaml
environment:
  - VITE_API_BASE=http://SEU_BACKEND:8000
```

2) **Passar no build** (menos comum para dev):
```bash
VITE_API_BASE=http://192.168.0.10:8000 docker compose up -d --build
```

3) **.env do Vite** (modo sem Docker): crie `.env` com
```
VITE_API_BASE=http://SEU_BACKEND:8000
```

---

## Dicas

- O `node_modules` fica no **container** (volume anônimo) para evitar erro de arquitetura do esbuild ao usar bind mounts.
- Se precisar rodar testes (`npm run test`), execute dentro do container:
  ```bash
  docker compose exec web npm run test
  ```
- Se o backend estiver em outro domínio/porta, lembre de liberar no CORS.
