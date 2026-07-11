# GigX

A decentralized freelance gig marketplace — Solidity smart contracts (Hardhat) plus a Next.js frontend. Built with [@rish170](https://github.com/rish170).

> **Lineage:** GigX is a variant of the
> [Task-Tokenizer](https://github.com/bharat3645/Task-Tokenizer) platform (the actively
> maintained take on the tokenized task/gig idea). A further variant lives at
> [AppXcess-GigX](https://github.com/bharat3645/AppXcess-GigX). Some internal naming
> (`TaskToken` in package.json) still reflects that origin.

## What's in the repo

- **`contracts/`** — Solidity contracts for jobs, identity, reputation, and escrow.
- **`scripts/`** — Hardhat deployment scripts (Sepolia testnet); deployed addresses are written to `deployed-addresses.json`.
- **`project/`** — the Next.js frontend (wallet connection via MetaMask).
- **`test/`** — contract tests, `hardhat.config.js` — network config.

## Prerequisites

Node.js ≥ 18, npm, MetaMask (or another injected wallet), and — for deployment — a Sepolia RPC endpoint and a throwaway funded key.

## Setup

```bash
git clone https://github.com/bharat3645/GigX.git
cd GigX
npm install
cd project && npm install && cd ..
```

Create a root `.env` for contract deployment:

```dotenv
ALCHEMY_SEPOLIA_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=throwaway_deployer_key_without_0x
```

And in `project/.env` (frontend):

```dotenv
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
NEXT_PUBLIC_PROVIDER_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
```

## Deploy contracts

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
# addresses land in deployed-addresses.json — copy into project/.env
```

## Run the frontend

```bash
cd project
npm run dev
# http://localhost:3000
```

### Docker (frontend)

```bash
cd project
docker build -t gigx-app .
docker run -p 3000:3000 --env-file .env gigx-app
```

## License

The project is intended to be MIT-licensed; **a LICENSE file has not been committed yet** — treat the licensing as unsettled until one lands.
