---
layout: ../../layouts/BlogPost.astro
title: "Rust Lang: In all Flavours"
pubDate: 2026-06-22
description: "Rust is a systems programming language that embodies the best accept of computer programming and still teaches you fundamentals"
author: "Emeka Allison"
image:
  url: "https://res.cloudinary.com/emekadinary/image/upload/q_53/v1782167853/emeka's%20blog/Rust_in_all_Flavours_hklp0w.webp"
  alt: "Tech is not an Industry"
tags:
  ["systems-programming", "Rust", "language", "programming", "computer science"]
---

## I can now say I'm good at Rust 🦀...Well, kinda

I started off this year with a New Year's resolution to master the [Rust programming language](https://rust-lang.org/). Let's just say it was quite a fullfilling journey, one which I'm happy and proud of myself for doing. [_Yeah! Audience cheers! Claps everywhere_].

It seemed daunting at first with it's reputation as a **hard language to master** with a **very steep learning curve**. But that wasn't the case in my experience. I mean: yeah, there were some parts that were quite daunting (parts which I will discuss a lot more in later parts of this articles), but a lot of it is just building upon the knowledge of common programming concepts like variables, constants, functions, operations etc and mastering the **borrow checker**. So it wasn't that had for me to learn and get great (at least better) at it.

## How did I get learning?

To be very honest, I've been trying to learn Rust on my own for quite a while; I think since 2022 or something. It was great but concepts weren't sticking and since I was working with other programming languages (Python, C# and Typescript) for work and side projects, I didn't really bother to get good at it. I did some projects and all but really grab (Nigerian pigin lingua, means "understand properly") it.

So I registered for [Web3Bridge](https://www.web3bridgeafrica.com/) Rust Masterclass. Taking part in the masterclass really helped me understand the language a lot better. I can confidently say I can build basic backend REST api with Rust using [Axum](https://docs.rs/axum/latest/axum/). I can also implement different communication protocols using [Tokio](https://tokio.rs/) and cryptographic/encoding algorithms with just plain Rust without using external libraries – and bit of blockchian protocol engineering. I was even able to publish a package to [crates.io](https://crates.io) – [rs-miniredis](https://crates.io/crates/rs-miniredis), a mini Redis clone built for caching data.

Enough about my journey though, let me actually show you some of the stuff that made Rust click for me. We'll start from the basics and build up to the parts that scared me at first.

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

What is we want to change the value of `num1`. Well there are two ways that can happen

_We could use shadowing_

```rust
// Original
let num1: u8 = 6;

// Shadowed value
let num1: u32 = 100_000;

println("num1 is {}", num1) // Displays: num1 is 100000
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

### Why does Rust use the borrow-checker?

Most languages pick one of two ways to clean up heap memory:

1. A **garbage collector** (Go, Java, Python) that runs in the background and frees memory for you — convenient, but with a runtime cost you don't control.
2. **Manual management** (C, C++) where _you_ call `malloc`/`free` — fast, but forget a `free` and you leak memory; free twice and you crash.
   <br><br>

**Rust** takes a third path. There's **no garbage collector and no manual `free`**. Instead, memory is tied to ownership: when the owner of a value goes out of scope, Rust automatically frees it. We saw this earlier — `name` got dropped at the end of `hello`.

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

The borrow-checker comes with an advantage — It lets the compiler catch memory mistakes like using a freed value or freeing it twice before your program ever runs. That way you get the speed of manual memory management without needing a garbage collector or the bugs that usually come with managing memory yourself.

## Structs and Traits

If you coming from programming languages like Python, Java or Javascript, you should be familiar with object oriented programming (OOP). This means you introduced to the concept of using **Classes** and **Objects** in grouping related data.

_Here is an example in Python_

```python
class Animal(): # Parent class (Animal)
  specie: str # attribute
  is_warmblooded: bool # attribute

  def __init__(self): # Constructor
    pass


class Dog(Animal): # Dog class inherits from Animal
  name: str # Dog has additional attribute (name)

  def __init__(self, name: str): # Constructor overwrites parent class constructor
    self.specie = "canine" # Inherited attribute (specie)
    self.is_warmblooded = True # Inherited attribute (is_warmblooded)

    self.name = name # Attribute (name) is set when Dog object is initialized
```

In Rust however, items with related data are grouped together using the `struct` datatype. Other languages that use structs include Go, C and C++. Structs in Rust however, do not support in inheritance. This is done by design to avoid the problems that comes with Class inheritance. Instead Rust uses a `trait` to pass behaviour to multiple structs.

_Here's what a struct looks like:_

```rust
struct Animal{
  name: String,
  specie: String,
  is_warmblooded: bool,
}
```

Structs in Rust also come in different flavours. The one you just saw above is a **field** struct. Other types of structs include **unit** struct and **tuple** struct.

```rust
struct MyStruct; // Unit structs

struct Coordinates(i32, i32) // Tuple structs
```

Using structs in programmes is also quite straight forward.

```rust
struct User{
  id: i32,
  name: &str, // &str signifies a string slice
  email: &str,
  age: u8,
  active: bool,
}

struct Coordinates(i32, i32)

struct UnitStruct;

fn main(){
  // Initiatizing feild struct (User) the struct will look
  let user1 = User{
    id: 1,
    name: "Emma Rogers",
    email: "emma@rustexample.com",
    age: 21,
    active: true,
  };

  let cord_1 = Coordinates(23, -10);

  let unit_struct = UnitStruct;
}
```

Let say there is a scenrio where I have two structs with similar field data, you use `..`, just like the spread operator in Javascript.

```rust
struct User{
  id: i32,
  name: &str,
  email: &str,
  age: u8,
  active: bool,
}

fn main(){
  let user1 = User{
    id: 1,
    name: "Emma Rogers",
    email: "emma@rustexample.com",
    age: 21,
    active: true,
  };

  let user2 = User{
    id: 2,
    name: user1.name,
    email: user1.email,
    age: user1.age,
    active: user1.active
  }
}
```

_`user2` can also be written as_

```rust
// --snip--

fn main(){
  // --snip--

  let user2 = User{
    id: 2,
    ..user1,
  }
}
```

#### Struct methods

Similar to how classes in other languages have methods which are functions which a class can call, structs also have methods. And instead of writing them inside the struct like you would in a class, you define them separately in an `impl` (implementation) block. The first argument is always `&self`, which is a reference to the instance the method is called on.

```rust
struct User{
  id: i32,
  name: &str,
  email: &str,
  age: u8,
  active: bool,
}

// Methods for User live in an impl block
impl User {
  // &self borrows the instance, so we can read its fields
  fn greet(&self) {
    println!("Hi, I'm {} and I'm {} years old", self.name, self.age);
  }

  // &mut self lets the method modify the instance
  fn deactivate(&mut self) {
    self.active = false;
  }
}

fn main(){
  let mut user1 = User{
    id: 1,
    name: "Emma Rogers",
    email: "emma@rustexample.com",
    age: 21,
    active: true,
  };

  user1.greet(); // Calls the method with the dot syntax
  user1.deactivate(); // user1 has to be mut for this to work
}
```

Now here's where the syntax can improve. Building that struct by hand every time is tiring, so we can add an **associated function** (a function in the `impl` block that doesn't take `self`) to act like a constructor. The convention is to call it `new`, and it returns `Self`.

```rust
impl User {
  // No &self here, this is an associated function
  fn new(name: &str, email: &str, age: u8) -> Self {
    Self {
      id: 1,
      name,        // field init shorthand: name: name
      email,       // same as email: email
      age,
      active: true, // sensible default
    }
  }
}

fn main(){
  // Way cleaner, we call it with the :: syntax
  let user1 = User::new("Emma Rogers", "emma@rustexample.com", 21);

  user1.greet();
}
```

Notice two things that clean up the code. `Self` is just shorthand for the struct's own type (`User` here), and when a variable has the same name as the field, you can write `name` instead of `name: name`. Small things, but they add up and make your structs a lot nicer to work with.

### Extending the capability of a struct with traits

If you've worked with interfaces in languages like Typescript, Go or Java, traits will feel familiar. A **trait** is a set of methods that a type promises to provide. It lets you define shared behaviour, then implement that behaviour for any struct you want. So instead of every method living in one `impl` block, you can group related behaviour into a trait and share it across different types.

Let's define a `Describe` trait and implement it for our `User`.

```rust
// The trait declares what behaviour a type should have
trait Describe {
  fn describe(&self) -> String;
}

// We implement the trait for User with the `impl Trait for Type` syntax
impl Describe for User {
  fn describe(&self) -> String {
    format!("{} ({})", self.name, self.email)
  }
}

fn main(){
  let user1 = User::new("Emma Rogers", "emma@rustexample.com", 21);

  println!("{}", user1.describe()); // Emma Rogers (emma@rustexample.com)
}
```

Now this is where the **two types of trait methods** come in.

The first are **required methods**. These only have a signature and no body, like the `describe` above. Any type that implements the trait _must_ provide its own version, otherwise the code won't compile.

The second are **default methods**. These come with a body already written, so a type gets them for free and can use them as-is or override them when it needs something different.

```rust
trait Describe {
  // Required method, every type must implement this
  fn describe(&self) -> String;

  // Default method, comes with a body already
  fn shout(&self) -> String {
    // It can even call other methods on the trait
    format!("{}!!!", self.describe())
  }
}

impl Describe for User {
  // We only have to implement the required method
  fn describe(&self) -> String {
    format!("{} ({})", self.name, self.email)
  }
  // shout() is inherited for free
}

fn main(){
  let user1 = User::new("Emma Rogers", "emma@rustexample.com", 21);

  println!("{}", user1.shout()); // Emma Rogers (emma@rustexample.com)!!!
}
```

#### Derivable traits

Some traits are so common that writing the `impl` block by hand every time would be a pain. So Rust lets you _derive_ them. Just add `#[derive(...)]` on top of your struct and the compiler writes the implementation for you based on your fields. You'll probably see a struct with `#[derive(Debug, Copy, Clone)]` in a Rust codebase. The standard library gives you a fixed set of these: `Debug`, `Clone`, `Copy`, `PartialEq`, `Eq`, `PartialOrd`, `Ord`, `Hash` and `Default`. It can do this because their behaviour just follows from the fields, so there's nothing for you to decide, the compiler already knows what to write.

Let's see the `Debug` trait in action. It lets you print a type for debugging using the `{:?}` formatter, which would otherwise fail to compile.

```rust
// Without #[derive(Debug)] this println! won't compile
#[derive(Debug)]
struct Point(i32, i32)

fn main() {
  let p = Point(3, 7);

  // {:?} is the debug formatter
  println!("{:?}", p); // Point (3, 7)
}
```

And here is the `Copy` trait. Remember earlier how passing a `String` _moves_ it? With `Copy`, the value gets copied instead, so the original is still usable after. It only works on types whose fields all live on the stack, which is why `Point` (two `i32`s) qualifies.

```rust
#[derive(Debug, Copy, Clone)] // Copy needs Clone alongside it
struct Wallet {
  address: &str;
  balance: u32,
}

fn main() {
  let w1 = Wallet { address: "0xdefef", balance: 100  };

  let w2 = w1; // w1 is COPIED into w2, not moved

  // Both are still valid because Wallet is Copy
  println!("{:?}", w1); // Wallet { address: "0xdefef", balance: 100  }
  println!("{:?}", w2); // Wallet { address: "0xdefef", balance: 100  }
}
```

## Superpowered Enums

## Error Handling from Heaven
