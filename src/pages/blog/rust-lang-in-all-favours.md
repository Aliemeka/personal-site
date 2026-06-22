---
layout: ../../layouts/BlogPost.astro
title: "Rust Lang: In all Flavours"
pubDate: 2026-04-18
description: "Rust is a systems programming language that embodies the best accept of computer programming and still teaches you fundamentals"
author: "Emeka Allison"
image:
  url: "https://res.cloudinary.com/emekadinary/image/upload/c_scale,h_1027,q_56/v1768470343/emeka's%20blog/Tech_is_not_an_industry_z0diiw.webp"
  alt: "Tech is not an Industry"
tags:
  ["systems-programming", "Rust", "language", "programming", "computer science"]
---

## I can now say I'm good at Rust...Well, kinda

I started off this year with a New Year's resolution to master [Rust programming language](https://rust-lang.org/). Let's just say it was quite a fullfilling journey, one which I'm happy and proud of myself for doing. [_Yeah! Audience cheers! Claps everywhere_].

It seemed daunting at first with it's reputation as a **hard language to master** with a **very steep learning curve**. But that wasn't the case in my experience. I mean: yeah, there were some parts that were quite daunting (parts which I will discuss a lot more in later parts of this articles), but a lot of it is just building upon the knowledge of common programming concepts like variables, constants, functions, operations etc and mastering the **borrow checker**. So it wasn't that had for me to learn and get great (at least better) at it.

## How did I get learning?

To be very honest, I've been trying to learn Rust on my own for quite a while; I think since 2022 or something. It was great but concepts weren't sticking and since I was working with other programming languages (Python, C# and Typescript) for work and side projects, I didn't really bother to get good at it. I did some projects and all but really grab (Nigerian pigin lingua, means "understand properly") it.

So I registered for [Web3Bridge](https://www.web3bridgeafrica.com/) Rust Masterclass. Taking part in the masterclass really helped me understand the language a lot better. I can confidently say I can build basic backend REST api with Rust using [Axum](https://docs.rs/axum/latest/axum/). I can also implement different communication protocols using [Tokio](https://tokio.rs/) and cryptographic/encoding algorithms with just plain Rust without using external libraries – and bit of blockchian protocol engineering

## First steps — Understand the borrowing checker

Rust is a strongly typed, performance driven, low-level systems programming language. If you've even written C, Go or Typescript, you will see some similarities between the languages. Just some minor syntax changes – for example, to write a function in Rust you use the `fn` syntax as opposed to the `function` in C and Typescript or `func` in Go. Here are more examples of syntaxic differences:

#### Declaring variables

_Declaring variables in Rust_

```rust
// Signed integars
let num: i32 = 50;
let num2: i16 = -70;


// Unsigned integars
let num1: u32 = 40;
let num3: u8 = 60;
```

_Declaring variables in C_

```c
#include <stdint.h>

// Signed integars
int32_t num = 50;
int16_t num2 = -70;

// Unsigned integers
unsigned int32_t = 40;
unsigned int8_t = 60;
```

#### Writing functions

_Writing a function in Rust_

```rust
fn sum_numbers(a: u16, b: u16) -> u16 {
  return a + b;
}

// This can be rewritten as

fn sum_numbers(a: u16, b: u16) -> u16 {
  // Putting the expression on the last
  // line of the function without adding
  // a semicolon returns the value
  a + b
}
```

_Writing a function in Go_

```go
func sum_numbers(a int, b int) int {
  return a + b
}
```

_Writing a function in Typescript_

```typescript
function sum_numbers(a: number, b: number): number {
  return a + b;
}
```

Common stuff so far, so far we are dealing with numbers so a code like:

```rust
fn square_number(num: i32) -> i32 {
  num.pow(2) // Numbers have power trait
}

fn main(){
  let num1 = 5; // Default type is i32

  let squared = square_number(num1);

  println("Square of {} is {}", num1, squared);
}
```

Gives the expected output: `Square of 5 is 25`.

What is we want to change the value of num1. Well there are two ways that can happen

_We could use shadowing_

```rust
// Original
let num1: u8 = 6;

// Shadowed value
let num1: u32 = 100_000;

println("num1 is {}", num1) // Displays num1 is 100000
```

_Or we could update it based on conditions in the app_

```rust
let num: u16 = 8;

if num < 10 {
  num += 2; // We try to modify here
}

println("Num: {}", num);
```

The code above **WON'T COMPILE!** ❌

"WHAT? But it looks correct."

It does, but in Rust variables are immutable by default. That means their values can not be modified. To make `num` mutable, we have to use the `mut` keyword.

Here it goes:

```rust
// We add the mut keyboard
let mut num: u16 = 8;

if num < 10 {
  num += 2; // Modification compiles
}

println("Num: {}", num);
```

This code will run! ✅

_Whatabout this code: Will it run or not?_

```rust
fn hello(name: String){
  println!("Hello, {}", name);
}

fn main {
  let my_name = String::from("Jack");

  hello(my_name);

  println!("My name is {}", my_name);
}
```

This one **WON'T COMPILE!** ❌

"Why now? `num` was about mutability, this one is just printing."

True, but to really _grab_ this, we need to peek under the hood at where your data actually lives. Memory in a running program comes in two flavours: the **stack** and the **heap**.

The **stack** is fast and orderly. Values are pushed on and popped off in order, like a stack of plates. It's used for data with a known, fixed size at compile time — your `i32`, `u8`, `bool`, etc. Cheap to use, and cleaned up automatically when a function returns.

The **heap** is for data whose size can grow or isn't known upfront — like a `String` that can keep getting longer. When you ask for heap memory, the program goes and finds a free spot and hands you back a pointer to it (and that pointer itself sits on the stack). More flexible, but slower and messier to manage.

```rust
fn main() {
  let x = 5;                      // i32 — lives entirely on the STACK
  let s = String::from("hello");  // the pointer/len/capacity sit on the stack,
                                  // but the actual "hello" text lives on the HEAP
}
```

### Borrow-checking: How Rust manages memory

Now here's the key bit. Simple stack values like numbers are cheap to duplicate, so Rust just **copies** them — that's why passing a number to a function (like our `square_number` earlier) leaves the original untouched. But a `String` owns heap memory, and silently copying heap data behind your back would be expensive and messy. So instead of copying, Rust **moves** it.

That's exactly what trips up our code. When we pass `my_name` into `hello`, we don't pass a copy, we hand over **ownership** of the `String`. Once `hello` is done, the value is dropped (freed). So by the time we reach the last `println!`, `my_name` no longer owns anything. Rust calls this a **move**.

```rust
fn hello(name: String) {
  println!("Hello, {}", name);
} // <- name is dropped here, the String is freed

fn main() {
  let my_name = String::from("Jack");

  hello(my_name); // ownership MOVED into hello

  // my_name is now invalid — its value was moved away
  println!("My name is {}", my_name); // ❌ error: value borrowed after move
}
```

So how do we fix it? We **borrow** instead of giving away ownership. We do that with `&` — a reference. A reference lets a function _look at_ the value without owning it.

```rust
// &String means "borrow a String, don't take it"
fn hello(name: &String) {
  println!("Hello, {}", name);
} // <- name goes out of scope, but it didn't own the String,
  //    so nothing gets dropped here

fn main() {
  let my_name = String::from("Jack");

  hello(&my_name); // we lend my_name, we don't give it away

  // my_name still owns its value, so this is fine ✅
  println!("My name is {}", my_name);
}
```

This is the **[borrow checker](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html)** at work. It enforces a few simple rules at compile time:

- Each value has **one owner**.
- You can have **many immutable borrows** (`&T`) at once — everyone can read.
- Or **exactly one mutable borrow** (`&mut T`) — only one writer, and no readers while it writes.

That last rule is the one that trips people up:

```rust
fn main() {
  let mut name = String::from("Jack");

  let r1 = &name;     // immutable borrow — fine
  let r2 = &name;     // another immutable borrow — also fine
  println!("{} and {}", r1, r2);

  let r3 = &mut name; // mutable borrow — fine now, r1 & r2 are done being used
  r3.push_str(" Sparrow");
  println!("{}", r3); // Jack Sparrow ✅
}
```

If you tried to take `r3` (a mutable borrow) _while_ `r1` or `r2` were still in use, it **won't compile**. Rust refuses to let one part of your code read a value while another part is busy changing it. That single rule kills a whole category of bugs — data races — before your program even runs. To understand better, checkout the explanation of [mutable references](https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html#mutable-references) from the Rust Book.

Most languages pick one of two ways to clean up heap memory:

- A **garbage collector** (Go, Java, Python) that runs in the background and frees memory for you — convenient, but with a runtime cost you don't control.
- **Manual management** (C, C++) where _you_ call `malloc`/`free` — fast, but forget a `free` and you leak memory; free twice and you crash.

- **Rust** takes a third path. There's **no garbage collector and no manual `free`**. Instead, memory is tied to ownership: when the owner of a value goes out of scope, Rust automatically frees it. We saw this earlier — `name` got dropped at the end of `hello`.

```rust
fn main() {
  let s = String::from("scoped"); // s owns heap memory here

  {
    let inner = String::from("temp"); // inner owns its own memory
    println!("{}", inner);
  } // <- inner goes out of scope, its memory is freed automatically

  println!("{}", s);
} // <- s goes out of scope here, its memory is freed too
```

### Why does Rust use the borrow-checker?

It lets the compiler catch memory mistakes like using a freed value or freeing it twice before your program ever runs. That way you get the speed of manual memory management without needing a garbage collector or the bugs that usually come with managing memory yourself.
