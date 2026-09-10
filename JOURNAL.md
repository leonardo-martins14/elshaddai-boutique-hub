# 📓 Diário de Desenvolvimento & AppSec Lab (Journal)

**Projeto:** El Shaddai Fragrances — Boutique & AppSec Pentest Lab  
**Data:** 10 de Setembro de 2026  
**Objetivo:** Compreender a arquitetura existente e estabelecer as fundações para transformar a boutique num laboratório prático de Segurança Aplicacional (AppSec) e Pentesting Web.

---

## 🎯 Resumo dos 5 Passos de Hoje

- [x] **① Perceber o `server.ts`**: Análise do entrypoint do servidor Nitro / TanStack Start e do tratamento de SSR / erros.
- [x] **② Perceber o `example.functions.ts`**: Como funcionam as *Server Functions* (`createServerFn`), separação cliente/servidor e validação Zod.
- [x] **③ Começar SQLite + Drizzle ORM**: Instalação e configuração de uma base de dados local (`local.db`) com tabelas (`users`, `products`, `orders`, `order_items`, `coupons`) e script de seed.
- [x] **④ Fazer Commit do Estado Atual**: Sincronização e commit do baseline no repositório git.
- [x] **⑤ Criar este Diário (`JOURNAL.md`)**: Registo arquitetural, decisões tomadas e roteiro para amanhã.

---

## 🧠 ① Deep Dive: Como funciona o `src/server.ts`

```typescript
// src/server.ts (estrutura simplificada)
export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const handler = await getServerEntry();
    const response = await handler.fetch(request, env, ctx);
    return await normalizeCatastrophicSsrResponse(response);
  }
}
```

1. **Padrão Web-Standard Fetch:**
   O ficheiro exporta um objeto padrão `{ fetch(request, env, ctx) }`. Isto torna o backend compatível tanto com Node.js local como com runtimes edge (ex: Cloudflare Workers).
2. **Carregamento Dinâmico de SSR:**
   Faz lazy-loading do `@tanstack/react-start/server-entry`. É este handler que orquestra a renderização no servidor (SSR) do React 19 e despacha as chamadas RPC das rotas.
3. **Tratamento de Exceções de SSR (`normalizeCatastrophicSsrResponse`):**
   O motor interno do Nitro (`h3`) captura exceções não tratadas e converte-as num JSON com status 500 (`{"unhandled":true,"message":"HTTPError"}`). O `server.ts` interceta este caso, extrai o erro original via `consumeLastCapturedError()` e devolve uma página HTML formatada (`renderErrorPage()`).

---

## ⚡ ② Deep Dive: Como funciona o `src/lib/api/example.functions.ts`

```typescript
// src/lib/api/example.functions.ts
export const getGreeting = createServerFn({ method: "POST" })
  .inputValidator(z.object({ name: z.string().min(1) }))
  .handler(async ({ data }) => {
    return { greeting: `Hello, ${data.name}!` };
  });
```

1. **RPC Tipado (Remote Procedure Call):**
   Em vez de criar uma API REST clássica com `fetch('/api/...')` manual, o TanStack Start permite invocar `getGreeting({ data: { name: "Ada" } })` diretamente em componentes ou loaders.
2. **Separação de Bundles (Code Splitting):**
   No build, o Vite substitui o corpo da função no cliente por um cliente HTTP leve. O código do `.handler(...)` nunca viaja para o browser.
3. **Regra dos ficheiros `.server.ts`:**
   Qualquer ficheiro que termine em `.server.ts` (ex: `config.server.ts` ou `index.server.ts`) é estritamente de backend. Dependências de servidor (como conexão à base de dados, chaves de API) devem ser importadas apenas dentro do `.handler` ou de módulos `.server.ts`.

---

## 🗄️ ③ Implementação: SQLite + Drizzle ORM

### 1. Pacotes Instalados
* `drizzle-orm` (ORM TypeScript leve e com zero dependências externas pesadas)
* `@libsql/client` (Cliente LibSQL/SQLite com suporte nativo multiplataforma)
* `drizzle-kit` (Ferramenta de migrações e studio)
* `tsx` (Executor TypeScript para scripts de seed e manutenção)

### 2. Estrutura Criada
* **Configuração:** [`drizzle.config.ts`](drizzle.config.ts)
* **Conexão:** [`src/lib/db/index.server.ts`](src/lib/db/index.server.ts) apontando para `local.db`
* **Schema de Dados:** [`src/lib/db/schema.ts`](src/lib/db/schema.ts):
  * `users` (id, email, passwordHash, fullName, role: 'customer' | 'admin', createdAt)
  * `products` (id, slug, name, brand, price, originalPrice, category, description, stock, rating, reviewCount)
  * `orders` (id, userId, clientName, clientEmail, clientPhone, shippingAddress, paymentMethod, subtotal, shipping, grandTotal, status, notes, createdAt)
  * `orderItems` (id, orderId, productId, productName, size, price, quantity)
  * `coupons` (id, code, discountPercent, isActive, maxUses, usedCount)
* **Povoamento Inicial:** [`src/lib/db/seed.ts`](src/lib/db/seed.ts)
  * Utilizador Admin: `admin@elshaddai.ch`
  * Clientes de teste: `alice@example.com`, `bob@example.com`
  * Cupões: `BIENVENUE10`, `VIP20`, `HACKME100`
  * Perfumes do catálogo inseridos no SQLite.

### 3. Comandos Adicionados ao `package.json`
```bash
npm run db:push    # Aplica alterações do schema diretamente no SQLite
npm run db:seed    # Popula dados de demonstração
npm run db:studio  # Abre o painel visual Drizzle Studio no browser
```

---

## 🛡️ Roteiro para Amanhã (AppSec & Vulnerabilidades)

1. **Autenticação Real com Vulnerabilidade Didática:**
   * Criar `loginUser` e `registerUser` via `createServerFn`.
   * Introduzir um toggle de segurança (`SECURITY_MODE = "vulnerable" | "secure"`):
     * *Vulnerável:* SQL Injection no campo de login ou JWT com secret fraco (`secret123`) e sem rate limit.
2. **Business Logic Flaw no Checkout (Price Tampering):**
   * Criar `createOrder` no backend que, no modo vulnerável, aceita o preço enviado pelo carrinho (`grandTotal`) sem revalidar com o preço real do produto no SQLite.
3. **IDOR na Consulta de Encomendas:**
   * Criar endpoint de detalhe da encomenda acessível por ID sequencial sem validação de pertença ao utilizador autenticado.
4. **Painel de Desafios (CTF / Lab Guide):**
   * Documentar os vetores de ataque com instruções passo a passo para **Burp Suite** e **sqlmap**.
