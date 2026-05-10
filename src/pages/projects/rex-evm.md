---
layout: ../../layouts/Project.astro
title: "rex-evm"
description: "A minimal Ethereum Virtual Machine written in Rust, with a small CLI for executing raw smart contract bytecode."
pubDate: "2026-05-08"
author: "Emeka Allison"
tags:
  ["Rust", "Ethereum", "EVM", "Systems Programming", "Bytecode", "Blockchain"]
---

# rex-evm - Light-weight EVM

A minimal Ethereum Virtual Machine written in Rust, with a small CLI for executing raw smart contract bytecode. It runs hex bytecode directly from your terminal, traces every opcode, reports gas usage, and stays small enough to drop onto any machine with a Rust toolchain.

## Why I Built This

Most production EVM implementations like **revm**, **geth** and **Nethermind** are tightly coupled to full client stacks and bring large dependency trees. They're great if you're running a node, but a lot of weight if all you want to do is execute a piece of bytecode and inspect what's happening.

I wanted something lightweight that I could drop onto any machine, run a hex string, and see exactly how the stack, memory, and gas evolve at every step. Rust was the natural choice because the EVM is fundamentally a state machine over tightly-typed primitives (256-bit integers, byte arrays, address-keyed maps), and Rust's enums and exhaustive pattern matching map almost one-to-one onto opcode dispatch.

## Features

- Full opcode coverage for arithmetic, comparison, bitwise, hashing, memory, storage, calldata, code introspection, and control flow
- Proper call-frame model with `CALL`, `CALLCODE`, `DELEGATECALL`, `STATICCALL`, `CREATE`, and `CREATE2`
- Per-opcode execution tracing with `--trace` for debugging bytecode behaviour
- Gas accounting with configurable gas limits
- Static-context enforcement (no `SSTORE`, `LOG`, or value-bearing `CALL` inside `STATICCALL`)
- World-state snapshotting so reverted sub-calls roll back cleanly
- Two-crate workspace separating the interpreter from shared primitives

## Architecture

The project is laid out as a Rust workspace with a clean separation of concerns:

```
rex-evm/
├── bin/
│   └── evm-cli/      # `evm` CLI, runs bytecode from a hex string or file
└── crates/
    ├── core/         # EVM interpreter: dispatch loop, stack, memory, call frames
    └── lib/          # Shared primitives: types, constants, errors, storage
```

The `core` crate owns the interpreter, and the `lib` crate holds the cross-cutting primitives like `Address`, `Transaction`, `BlockEnv`, and `Account`. The CLI is just a thin shell on top.

### Call frames

Every CALL or CREATE pushes a fresh call frame. Each frame carries its own stack, memory, program counter, gas budget, and pre-computed JUMPDEST set. Host state like `world_state` and `substate` lives on the outer `Evm` so it persists across frames.

```rust
pub struct CallFrame {
    /// msg.sender, the address that initiated this call.
    pub caller: Address,
    /// The address whose storage is being modified (ADDRESS opcode).
    /// Equals code_address for CALL/CREATE but equals the parent's callee
    /// for DELEGATECALL / CALLCODE.
    pub callee: Address,
    /// The address whose code is currently executing.
    pub code_address: Address,
    pub code: Vec<u8>,
    pub calldata: Vec<u8>,
    pub value: U256,
    pub is_static: bool,
    pub depth: u16,
    pub gas_remaining: u64,
    pub stack: Stack,
    pub memory: Memory,
    pub pc: usize,
    pub return_data: Vec<u8>,
    pub valid_jumpdests: HashSet<usize>,
}
```

Modelling DELEGATECALL and CALLCODE correctly was one of the more interesting parts. They look like CALL but borrow the caller's identity, so `callee` and `code_address` diverge. Splitting these into separate fields up front made the dispatch logic far cleaner.

### The dispatch loop

The interpreter is a single `match` over the opcode enum, running until the frame halts or the program counter falls off the end of the code:

```rust
pub fn execute_frame(&mut self, frame: &mut CallFrame) -> Result<ExecutionResult, EvmError> {
    use Opcodes::*;

    while frame.pc < frame.code.len() {
        let opcode_u8 = frame.code[frame.pc];
        let opcode = Opcodes::try_from(opcode_u8)
            .map_err(|_| EvmError::InvalidOpcode(opcode_u8))?;

        if self.trace {
            println!(
                "pc={:04} gas={:<10} depth={} stack={:<2} op={:?}",
                frame.pc, frame.gas_remaining, frame.depth,
                frame.stack.data.len(), opcode
            );
        }

        frame.gas_remaining = frame
            .gas_remaining
            .checked_sub(opcode.estimated_gas_cost())
            .ok_or(EvmError::OutOfGas)?;

        match opcode {
            STOP => return Ok(ExecutionResult { /* ... */ }),
            ADD | MUL | SUB | DIV | SDIV | MOD | SMOD => { /* ... */ },
            // ... every other opcode
        }

        frame.pc += 1;
    }

    // Ran off the end of code, treat as STOP.
    Ok(ExecutionResult { /* ... */ })
}
```

Trace is logged _before_ the opcode runs, so if the next instruction blows up you still see the exact state at the point of failure. That detail saved me a lot of time debugging gas underflow and invalid jump cases.

### Halt semantics

Halt reasons are modelled explicitly rather than baked into control flow, which keeps the dispatch loop honest about what kind of stop it just performed:

```rust
pub enum HaltReason {
    Stop,
    Return,
    Revert,
    SelfDestruct,
}
```

Reverts also restore the snapshotted world state and substate, so sub-calls that fail leave no trace on the parent.

## CLI Usage

The CLI is named `evm`. Build it from source:

```sh
cargo build --release
```

Run bytecode from a hex string:

```sh
cargo run -q -p evm -- run --code 0x6001600201
```

Run bytecode from a file (hex text or raw bytes):

```sh
cargo run -q -p evm -- run --file contract.bin
```

Enable per-opcode tracing:

```sh
cargo run -q -p evm -- run --code 0x6001600201 --trace
```

Override the gas limit (default: 1,000,000):

```sh
cargo run -q -p evm -- run --code 0x6001600201 --gas 100
```

### Output

```
Stack:    [0x3]
Return:   0x
Gas used: 9
Status:   STOP
```

- **Stack** is the final stack at halt, top-of-stack first
- **Return** is the hex-encoded return data (empty for `STOP`)
- **Gas used** is `gas_limit - gas_remaining`
- **Status** is the halt reason: `STOP`, `RETURN`, `REVERT`, `SELFDESTRUCT`, or the error message on exceptional halt

## Build from source

Prerequisites: a recent stable Rust toolchain (2024 edition — Rust 1.85+). Install via [rustup](https://rustup.rs/) if you don't have it.

Clone and build:

```sh
git clone <repo-url> rex-evm
cd rex-evm
cargo build --release
```

The compiled CLI will be at `target/release/evm`. You can either invoke it directly or install it onto your `PATH`:

```sh
# run the release binary directly
./target/release/evm run --code 0x6001600201

# or install to ~/.cargo/bin so `evm` is on PATH
cargo install --path bin/evm-cli
evm run --code 0x6001600201
```

## What I Learned

Building rex-evm forced me to internalise things I'd previously only read about: how the call stack actually works under `DELEGATECALL`, why `JUMPDEST` validation has to be pre-computed, how revert semantics interact with state snapshotting, and how gas is metered at the opcode level. None of this is mysterious once you've implemented it. It's just a discipline of being honest about state and lifetimes, which Rust enforces by default.

It also reinforced something I keep coming back to: separating per-frame state from host state up front makes everything downstream simpler. Once `CallFrame` and `Substate` were properly partitioned, adding new opcodes became almost mechanical.

## Technologies Used

- **[Rust](https://rust-lang.org/)** for the interpreter, type-driven opcode dispatch, and zero-runtime-cost abstractions
- **[primitive-types](https://crates.io/crates/primitive-types)** for `U256` and `U512` arithmetic
- **[Clap](https://docs.rs/clap/)** for the CLI

## Source Code

View the full source on GitHub at [github.com/Aliemeka/rex-evm](https://github.com/Aliemeka/rex-evm).
