---
layout: ../../layouts/Project.astro
title: "Rust Mini-Redis"
description: "A lightweight, blazingly-fast in-memory key-value store inspired by Redis, built with Rust and Tokio."
image:
  url: ""
  alt: "Rust Mini-Redis"
pubDate: "2026-02-23"
author: "Emeka Allison"
tags: ["Rust", "Tokio", "TCP", "Systems Programming", "Low-level I/O"]
---

# Rust Mini-Redis

A lightweight, blazingly-fast in-memory key-value store inspired by Redis, built with Rust and Tokio. It provides an async TCP server that handles multiple data types and automatic key expiration — all with a single external dependency.

## Why I Built This

Redis is one of those tools you use daily without thinking much about how it works under the hood. I built this project to understand the internals — how keys expire, how a TCP server handles concurrent connections, and how you model different data types in memory. Rust was the natural choice: it forces you to think carefully about ownership and concurrency, which are exactly the things that matter in a storage engine.

## Features

- In-memory key-value storage with automatic TTL management
- Support for three value types: strings, lists (comma-separated), and hashes (key:value pairs)
- Nine core commands for full CRUD, introspection, and server health
- Asynchronous server architecture powered by Tokio
- Single dependency — just Tokio, nothing else

## Getting Started

You only need Rust installed. Clone the repo and run:

```sh
cargo run
```

The server starts on `127.0.0.1:6379`. Connect with NetCat:

```sh
# macOS
nc 127.0.0.1 6379

# Linux
nc -q 0 127.0.0.1 6379
```

Or pipe single commands directly:

```sh
echo "SET name Alice" | nc 127.0.0.1 6379
echo "GET name" | nc 127.0.0.1 6379
```

You can also use `redis-cli`:

```sh
redis-cli SET name ALICE 120
```

## Commands

| Command | Syntax | Description |
|---------|--------|-------------|
| `SET` | `SET <key> <value> [ttl]` | Store a value with optional TTL (default 60s) |
| `GET` | `GET <key>` | Retrieve a value; returns `Nil` if absent or expired |
| `UPDATE` | `UPDATE <key> <value> [ttl]` | Modify an existing key; supports type changes |
| `DEL` | `DEL <key>` | Remove a key |
| `EXISTS` | `EXISTS <key>` | Returns `YES` or `NO` |
| `RENAME` | `RENAME <old_key> <new_key>` | Rename a key |
| `TYPE` | `TYPE <key>` | Returns `String`, `VecStr`, or `Hash` |
| `CLEARALL` | `CLEARALL` | Wipe all stored data |
| `PING` | `PING` | Health check — responds with `PONG` |

## Data Types

**Strings** — plain values:
```
SET greeting "Hello, world"
```

**Lists** — comma-separated values:
```
SET colors red,green,blue
```

**Hashes** — `key:value` pairs, comma-separated:
```
SET user name:Alice,age:30,city:Lagos
```

The `UPDATE` command lets you change a key's type entirely, so you can transition a string into a hash without deleting and recreating it.

## Project Structure

```
src/
├── main.rs      # Entry point, bootstraps the Tokio runtime
├── runner.rs    # TCP server loop and command parsing
└── state.rs     # In-memory store with TTL expiration logic
```

## Technologies Used

- **[Rust](https://rust-lang.org/)** — Systems programming language for performance and memory safety
- **[Tokio](https://tokio.rs/)** — Async runtime for handling concurrent TCP connections

## Source Code

View the full source on GitHub at [github.com/Aliemeka/rs-miniredis](https://github.com/Aliemeka/rs-miniredis).
