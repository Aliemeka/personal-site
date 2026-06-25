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

It seemed daunting at first with it's reputation as a **hard language to master** with a **very steep learning curve**. But that wasn't the case in my experience. I mean: yeah, there were some parts that were quite daunting (parts which I will discuss a lot more in later parts of this articles), but a lot of it is just building upon the knowledge of common programming concepts like variables, constants, functions, operations etc and mastering the **borrow checker**. So it wasn't that hard for me to learn and get great (at least better) at it.

## How did I get learning?

To be very honest, I've been trying to learn Rust on my own for quite a while; I think since 2022 or something. It was great but concepts weren't sticking and since I was working with other programming languages (Python, C# and Typescript) for work and side projects, I didn't really bother to get good at it. I did some projects and all but really grab (Nigerian pigin lingua, means "understand properly") it.

So I registered for [Web3Bridge](https://www.web3bridgeafrica.com/) Rust Masterclass. Taking part in the masterclass really helped me understand the language a lot better. I can confidently say I can build basic backend REST api with Rust using [Axum](https://docs.rs/axum/latest/axum/). I can also implement different communication protocols using [Tokio](https://tokio.rs/) and cryptographic/encoding algorithms with just plain Rust without using external libraries – and bit of blockchian protocol engineering. I was even able to publish a package to [crates.io](https://crates.io) – [rs-miniredis](https://crates.io/crates/rs-miniredis), a mini Redis clone built for caching data.

Enough about my journey though, let me actually show you some of the stuff that made Rust click for me. We'll start from the basics and build up to the parts that scared me at first.

## First steps — Understand the borrowing checker

Rust is a strongly typed, performance driven, low-level systems programming language. If you've even written C, Go or Typescript, you will see some similarities between the languages. Just some minor syntax changes – for example, to write a function in Rust you use the `fn` syntax as opposed to the `function` in C and Typescript or `func` in Go. Here are more examples of syntaxic differences:

#### Declaring variables

Declaring variables in Rust

```rust
// Signed integars
let num: i32 = 50;
let num2: i16 = -70;


// Unsigned integars (Only positive numbers)
let num1: u32 = 40;
let num3: u8 = 60;
```

Declaring variables in C

```c
#include <stdint.h>

// Signed integars
int32_t num = 50;
int16_t num2 = -70;

// Unsigned integers (Only positive numbers)
uint32_t = 40;
uint8_t = 60;
```

#### Writing functions

Writing a function in Rust

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

Writing a function in Go

```go
func sum_numbers(a int, b int) int {
  return a + b
}
```

Writing a function in Typescript

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

We could use _shadowing_

```rust
// Original
let num1: u8 = 6;

// Shadowed value
let num1: u32 = 100_000;

println("num1 is {}", num1) // Displays: num1 is 100000
```

Or we could update it based on conditions in the app

```rust
let num: u16 = 8;

if num < 10 {
  num += 2; // We try to modify here
}

println("Num: {}", num);
```

The code above **WON'T COMPILE!** ❌

"WHAT? But it looks correct."

It does, but in Rust variables are _immutable_ by default. That means their values can not be modified. To make `num` mutable, we have to use the `mut` keyword.

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

Whatabout this code: Will it run or not?

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

Here is an example in Python

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

Here's what a struct looks like:

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

`user2` can also be written as

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

**Enums** are one of my favourite parts of Rust. Unlike other enums in other languages, Rust enums have extra abilities that feel like superpowers. Enums are using used to represent changing data states in most programming languages. In Rust, enums can also contain values with different datatypes.

Here's a simple example

```rust
enum MachineState{
  Idle,
  Running,
  Failure(String),
  Completed(Vec<String>),
}
```

This would have been like any other enum in any programming language, but their are two peculiar fields in `MachineState` enum: `Failure(String)`and `Results(Vec<String>)`. This means that you are able to do even more with Rust enums. `Failure(String)` does not show a failed state, it also contains a string that shows the reason for the failure. Likewise, `Results(Vec<String>)`

### Pattern matching

Pattern matching is how Rust lets you look at a value, figure out what shape it is, and pull the data out of it all at once. Using the `match` keyword, you list out the possible cases a value could be and what to do for each one, kind of like a `switch` statement but way more powerful. The neat part is that Rust forces you to handle every possible case, so if there's a variant you forgot to deal with, your code simply won't compile.

Here is an example from [The Rust Book](https://doc.rust-lang.org/book/ch06-02-match.html#listing-6-3):

```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

This is where enums like `MachineState` really shine because variants like `Failure(String)` carry data, `match` lets you grab that inner value and bind it to a variable right there in the branch, so you can read the failure message or loop over the results without any extra unwrapping.

```rust
fn handle_state(state: MachineState) {
  match state {
    MachineState::Idle => println!("Nothing happening yet"),
    MachineState::Running => println!("Machine is working..."),
    // We pull the String right out of the variant and use it
    MachineState::Failure(msg) => println!("It broke: {}", msg),
    // Same here, we grab the Vec and loop over it
    MachineState::Completed(results) => {
      for r in results {
        println!("Result: {}", r);
      }
    }
  }
}
```

Rust's standard library also has powerful enum types. The two most popular ones are `Option<T>`, with `Some(T)` and `None`, and `Result<T, E>`, with `Ok(T)` and `Err(E)`.

Other enums include:

- `std::cmp::Ordering` with `Less`, `Equal`, `Greater` returned by `cmp()` and used all over sorting and comparison code.
- `std::ops::Bound` with `Included`, `Excluded`, `Unbounded` used to describe the ends of a range.
- `std::task::Poll` with `Ready` and `Pending` returned by async tasks to say whether a value is ready yet.
- `std::net::IpAddr` with `V4` and `V6` representing either kind of IP address.
- `std::num::FpCategory` with `Nan`, `Infinite`, `Zero`, `Subnormal`, `Normal` used to classify what kind of value a floating point number is.

### The `Option<T>` type

`Option<T>` is how Rust handles a value that might or might not be there. Instead of `null` like in other languages, you get an enum with two variants: `Some(T)` when there's a value, and `None` when there isn't. Because the absence is part of the type, the compiler forces you to handle the empty case, so you can't accidentally use a value that isn't there.

```rust
let some_number: Option<i32> = Some(5); // has a value
let nothing: Option<i32> = None;        // empty
```

This is handy for structs where a field is optional. Say a user might not have added a phone number yet:

```rust
struct User {
  name: String,
  phone: Option<String>, // optional field
}

fn main() {
  let user = User {
    name: String::from("Emma"),
    phone: None, // no phone number yet
  };
}
```

We can even rewrite `user` to look like this:

```rust
// --snip--

let user = User {
  name: String::from("Emma"),
}; // We removed the phone field because it is optional
```

To safely get at the value inside, `if let` is the quickest way. It runs the block only when the `Option` is `Some`, and hands you the inner value:

```rust
// Only runs if phone is Some, binds the inner String to `number`
if let Some(number) = user.phone {
  println!("Phone: {}", number);
} else {
  println!("No phone number on file");
}
```

I will cover `Result<T, E>` type under [error handling](#expecting-errors-as-a-value).

## Error Handling from Heaven

In a lot of languages, errors are handled by throwing and catching exceptions. Take Java, you wrap risky code in a `try` block and catch whatever blows up in a `catch` block.

```java
try {
  int result = divide(10, 0);
  System.out.println(result);
} catch (ArithmeticException e) {
  System.out.println("Error: " + e.getMessage());
}
```

The problem here is that nothing in the function's signature tells you it can fail. You only find out when it throws at runtime, and if you forget to catch it, your program crashes. Rust takes a different route. It doesn't have exceptions at all. Instead errors are just regular values you have to deal with, and the type system makes sure you actually do. There are two flavours of failure: the unrecoverable kind that should just stop everything, and the recoverable kind you can handle and move on from.

### Give your code a `panic`-attack!

For the unrecoverable kind, Rust has the `panic!` macro. When it runs, the program prints an error message and stops right there. You use it when something has gone so wrong that there's no point continuing.

```rust
fn main() {
  panic!("something went really wrong"); // stops the program immediately

  println!("this line never runs");
}
```

A lot of operations panic for you under the hood too, like indexing past the end of a vector:

```rust
let v = vec![1, 2, 3];
println!("{}", v[10]); // panics: index out of bounds
```

### Unwrapping and providing fallbacks

`Option` and `Result` come with helper methods to get at the value inside. The quickest is `unwrap()`, which hands you the value if it's there and panics if it isn't. Handy for quick scripts, but risky in real code.

```rust
let phone: Option<String> = None;

let p = phone.unwrap(); // ❌ panics because it's None
```

Instead of panicking, you can supply a fallback with `unwrap_or_else()`, or convert an empty `Option` into a proper error with `ok_or_else()`. Both take a closure that only runs when the value is missing.

```rust
let phone: Option<String> = None;

// unwrap_or_else: use a default instead of crashing
let p = phone.clone().unwrap_or_else(|| "no phone on file".to_string());

// ok_or_else: turn None into an Err so it becomes a Result
let result: Result<String, String> = phone.ok_or_else("phone is missing".to_string());
```

### Expecting Errors as a Value

For recoverable errors, Rust uses the `Result<T, E>` type we mentioned earlier. A function that can fail returns `Ok(value)` on success or `Err(error)` on failure, and the caller has to `match` on it to get the value out. The error is right there in the return type, so you can't pretend it doesn't exist.

```rust
fn divide(a: i32, b: i32) -> Result<i32, String> {
  if b == 0 {
    return Err("cannot divide by zero".to_string());
  }
  Ok(a / b)
}

fn main() {
  match divide(10, 0) {
    Ok(value) => println!("Result: {}", value),
    Err(e) => println!("Error: {}", e),
  }
}
```

If you've written Go, this might look familiar, since Go also treats errors as values. The difference is Go returns them as a separate value alongside the result.

```go
result, err := divide(10, 0)
if err != nil {
  fmt.Println("Error:", err)
  return
}
fmt.Println(result)
```

But here's the thing, Go doesn't force you to check `err`. You can ignore it with `_` and carry on with a result that might be garbage. Rust bundles the success and the error into one `Result` value, so the only way to get at the result is to handle the error case first. That, plus the `?` operator for cleanly passing errors up the call stack, is what makes error handling in Rust feel less like a chore and more like Heaven.

## Lifetimes are well... a lot!

To be totally honest with you, lifetimes are not my favourite part of Rust. But just like Thanos says, _"Hate it, dread it, [lifetimes] arrive all the same"_. So they are inevitable.

To better understand lifetimes let's look at this code that trys to determine the longest between two words.

```rust
fn longest(x: &str, y: &str) -> &str {
  if x.len() > y.len() { x } else { y }
}

fn main() {
  let word1 = String::from("Chicarito");
  let word2 = String::from("Ogbeni");

  let longest_word = longest(&word1, &word2); // 👀
  println!("The longest word is {longest_word}");
}
```

Guess what? THIS CODE DOES NOT COMPILE ❌

WHY? Well... the function returns a reference, but the compiler can't tell whether that reference points to `x` or to `y`. And that matters, because a reference is only valid for as long as the thing it points to is still alive. If the compiler doesn't know which input the returned reference is tied to, it can't guarantee the reference will still be valid when you use it. So it stops you before you create a dangling reference.

The fix is to add a **lifetime annotation**. This is just a label, written with an apostrophe like `'a`, that tells the compiler "these references all live for the same span". It doesn't change how long anything actually lives, it just describes the relationship so the borrow checker can verify it.

```rust
// 'a says: the return value lives as long as both x and y do
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
  if x.len() > y.len() { x } else { y }
}

fn main() {
  let word1 = String::from("Chicarito");
  let word2 = String::from("Ogbeni");

  let longest_word = longest(&word1, &word2);
  println!("The longest word is {longest_word}"); // The longest word is Chicarito
}
```

Now the compiler knows the returned reference won't outlive either input, and the code happily compiles. ✅

### Lifetimes in structs

Remember our `User` struct from earlier? If a struct holds a reference instead of an owned value, you have to give that reference a lifetime too. This tells the compiler the struct is not allowed to outlive the data it's borrowing.

```rust
// 'a means a User can't live longer than the name it points to
struct User<'a> {
  name: &'a str,
}

fn main() {
  let full_name = String::from("Emma Rogers");

  let user = User { name: &full_name }; // user borrows from full_name

  println!("User: {}", user.name);
} // full_name and user both drop here, so the borrow stays valid
```

Without the `'a`, the compiler would have no idea how long the borrowed `name` is supposed to be valid, and it would refuse to compile. Once you start thinking of lifetimes as just labels that describe "who has to outlive who", they stop being so scary. They were probably the hardest part of Rust for me, but honestly, once it clicks, you start to appreciate just how much the compiler is doing to keep your references safe.

## Smart Pointers

Pointers are common in programming, and this is especially true in systems programming. A pointer is simply a variable that holds the location in memory of another variable. You can think of it as a **reference** to another value.

Here is a quick example in C:

```c
#include <stdio.h>

int main() {
  int x = 10;
  int *y = &x; // y holds the address of x

  printf("The location of x is %p\n", (void *)y);
  printf("The value of x is %d\n", *y);

  return 0;
}
```

`y` stores the address of `x`, and `*y` _dereferences_ that address to get the value `10` back.

In Rust, we use pointers (references) very often, especially when borrowing:

```rust
fn main() {
    let x = 10;
    let y = &x; // y is a reference to x

    println!("The location of x is {:p}", y);
    println!("The value of x is {}", *y);
}
```

The `&` creates a reference and `*` dereferences it, just like in C — except here the borrow checker guarantees `y` can never outlive `x` or end up pointing at freed memory.

### What makes a pointer "smart"?

A plain reference (`&T`) just _borrows_ a value — it points at data that someone else owns. A **smart pointer**, on the other hand, is a data structure that behaves like a pointer but also _owns_ the data it points to and carries some extra capability on top: automatically freeing memory when it goes out of scope, counting how many references exist, or enforcing the borrowing rules at runtime.

In Rust, smart pointers are usually structs that implement two traits:

- `Deref`, which lets you use the `*` operator and treat the smart pointer like a regular reference.
- `Drop`, which runs cleanup code when the value goes out of scope — this is how the memory gets freed automatically.

### The stack and the heap

To understand why smart pointers matter, you need to know _where_ your data actually lives.

- The **stack** is fast and ordered. Values are pushed and popped in a last-in-first-out manner, and every value on the stack must have a known, fixed size at compile time. Function arguments and local variables usually live here.
- The **heap** is for data whose size isn't known at compile time, or that needs to outlive the function that created it. Allocating on the heap is slower — the allocator has to go find a free spot and hand you back a pointer to it.

When you put something on the heap, the actual data lives on the heap, but the _pointer_ to it lives on the stack. Smart pointers are the tool Rust gives you to manage that heap data safely, without the manual `malloc`/`free` dance you'd do in C.

### Box

`Box<T>` is the simplest smart pointer. It allocates a value on the heap and keeps a pointer to it on the stack. When the `Box` goes out of scope, the heap memory is freed automatically — no manual `free()` required.

```rust
fn main() {
    let b = Box::new(10); // 10 is stored on the heap
    println!("b = {}", b); // Deref lets us use b like a normal value
} // b goes out of scope here, and the heap memory is freed
```

Here `b` is a `Box<i32>`. The integer `10` lives on the heap, while `b` (the pointer) lives on the stack. Thanks to the `Deref` trait, you can use `b` almost exactly like the value it points to.

`Box` really earns its keep when a type's size can't be known at compile time — the classic example being a **recursive type**. Imagine a simple linked list where each item holds a value and the next item:

We could try to represent the list like this:

```rust
enum List {
    Cons(i32, List),
    Nil,
}
```

The `List` enum above represents a linked list, with `Cons` holding a value plus the connection to the next item, and `Nil` signifying where the list terminates. However, this code will be **flagged** by the Rust compiler, because it can't work out how much memory a `List` needs. To size a `List`, it has to size the `List` inside it, which contains another `List`, and so on forever — the type would be infinitely large.

The fix is to wrap the next item in a `Box`:

```rust
enum List {
    Cons(i32, Box<List>),
    Nil,
}

use List::{Cons, Nil};

fn main() {
    let list = Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Nil))))));
}
```

By wrapping the next element in a `Box`, each node only needs to store a pointer (which has a fixed, known size) instead of another whole `List`. That breaks the infinite recursion and gives `List` a definite size. The actual list data lives on the heap, and the `Box` cleans it all up when it goes out of scope. You can use `Box` to represent data structures like a Merkle tree or a binary search tree.

### Reference Counter `Rc<T>`

A `Box` has exactly one owner. But sometimes you need several parts of your program to share the same data, with no single one "owning" it. That's what `Rc<T>` (short for _reference counted_) is for. It keeps a count of how many references point to a value, and only frees the data when that count drops to zero.

```rust
use std::rc::Rc;

fn main() {
    let a = Rc::new(String::from("shared"));
    let b = Rc::clone(&a); // doesn't copy the data, just bumps the count

    println!("count = {}", Rc::strong_count(&a)); // count = 2
} // both a and b drop here, count hits 0, and the String is freed
```

Here `a` and `b` both point to the same `String` on the heap. `Rc::clone` doesn't duplicate the data — it just increments the reference count, which is cheap. The count goes up to 2, and once both go out of scope it falls to 0 and the memory is cleaned up. One thing to note: `Rc<T>` is for single-threaded use only, and it only gives you shared _immutable_ access.

### Mutating the Immutable with `RefCell<T>`

Normally Rust enforces the borrowing rules at **compile time**: you can have many immutable borrows or one mutable borrow, never both. `RefCell<T>` moves that check to **runtime** instead. This lets you mutate data even through an immutable reference — a pattern called _interior mutability_. The catch is that if you break the rules, you get a panic at runtime instead of a compile error.

```rust
use std::cell::RefCell;

fn main() {
    let value = RefCell::new(5);

    *value.borrow_mut() += 10; // mutate through an immutable binding

    println!("value = {}", value.borrow()); // value = 15
}
```

Notice `value` isn't declared `mut`, yet we still changed it. `borrow_mut()` hands you a mutable reference and `borrow()` an immutable one, and `RefCell` tracks those borrows as the program runs. Ask for a mutable borrow while another borrow is still active and it'll panic.

Where this really shines is combining it with `Rc<T>`. `Rc` gives you multiple owners but only immutable access; wrap the inner value in a `RefCell` and you get **shared, mutable** data — `Rc<RefCell<T>>`, a very common pairing in Rust:

```rust
use std::cell::RefCell;
use std::rc::Rc;

fn main() {
    let shared = Rc::new(RefCell::new(vec![1, 2, 3]));

    let clone = Rc::clone(&shared);
    clone.borrow_mut().push(4); // mutate via the second owner

    println!("{:?}", shared.borrow()); // [1, 2, 3, 4]
}
```

Both `shared` and `clone` point to the same vector, and either one can mutate it. The `Rc` handles shared ownership while the `RefCell` handles the mutation — exactly the combo you reach for when building things like trees or graphs where nodes need to share and update state. You can use the combination of both `RefCell` and `Rc` to represent data structures like a Patricia trie, LRU caches, or a graph with shared nodes.

## Async Rust

Let me be honest: **async Rust** is the part I'm least sold on. It's powerful and the ecosystem (Tokio especially) is excellent, but it still has rough edges:

- Function "colouring" — async and sync code don't mix cleanly.
- No built-in runtime; you almost always pull in Tokio or async-std.
- Cryptic compiler errors around futures and `Pin`.
- `Send`/`Sync` bounds that blow up across `.await` points.
- A runtime-fragmented ecosystem.

I won't go down that rabbit hole here. The good news is the foundation underneath it is great — so let's talk concurrency.

### Concurrency

Concurrency is just your program making progress on more than one task at a time. The neat part is that Rust's ownership rules carry straight over: the same borrow checker that stops memory bugs also stops **data races** at compile time. The Rust folks call this _fearless concurrency_.

### Threads

The most direct way to run things concurrently is with **threads**. A thread is an independent line of execution, and the OS can run several of them across CPU cores in parallel. You spawn one with `thread::spawn`:

```rust
use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        println!("Hello from a thread!");
    });

    handle.join().unwrap(); // wait for the thread to finish
}
```

### Managing threads

`thread::spawn` returns a `JoinHandle`. Calling `.join()` blocks until that thread finishes — without it, `main` could exit before the thread even runs. Threads don't share outside variables by default either; if a thread needs data from the outer scope, you `move` ownership into the closure (`thread::spawn(move || { ... })`).

### Sharing data with `Arc`

But what if several threads need the _same_ data? `Rc` won't work here — it isn't thread-safe. Its thread-safe cousin is **`Arc<T>`** (_atomically reference counted_): same idea as `Rc`, but the count is updated atomically so it's safe to share across threads. On its own, `Arc` only gives shared _immutable_ access, so to mutate shared data you pair it with a lock.

### `Mutex` vs `RwLock`

- **`Mutex<T>`** — one accessor at a time. Whoever holds the lock can read or write; everyone else waits.
- **`RwLock<T>`** — many readers _or_ one writer at a time.

Rule of thumb: reach for `Mutex` by default, and use `RwLock` only when reads heavily outnumber writes.

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..5 {
        let counter = Arc::clone(&counter);
        handles.push(thread::spawn(move || {
            *counter.lock().unwrap() += 1; // lock, then mutate
        }));
    }

    for h in handles {
        h.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap()); // Result: 5
}
```

`Arc` lets all five threads own the counter, and the `Mutex` makes sure only one increments it at a time. Swap in an `RwLock` and the API is nearly identical — just `.read()` / `.write()` instead of `.lock()`.

As for when to use which: a `Mutex` is a good fit for something like a shared job queue, where every worker is both pulling tasks off and pushing results back (writes all round). An `RwLock` shines for something like an in-memory config or routing table that's read constantly but only updated once in a while.

## Cargo is bae!

Just like we have **pip/uv** for Python and **npm** for Javascript, Cargo is the follow-come package manager for Rust. But it is more than just a package manager. It can be used to scaffold projects, run your projects, build, run tests, format code, manage dependencies and even publish crates to [crates.io](https://crates.io). The only thing it can't do is fly.

Cargo can't fly..._yet!_

```bash
>> cargo fly
Out: cargo no fly. car go road
```

- You can start a project with `cargo init` or `cargo new`.
- Format code with `cargo fmt` and lint it with `cargo clippy`.
- You can run tests with `cargo test`, no need for a separate testing library.
- You can use `cargo add` to add a package from [crates.io](https://crates.io) to your project, or just add the name to your **`Cargo.toml`** file and Cargo will install it the next time you run or build.
- `cargo check` type-checks your code without producing a binary — much faster than a full build, and great for a tight feedback loop while coding.
- `cargo doc --open` generates documentation from your code and comments, then opens it in the browser.
- Ship optimised builds with `cargo build --release`.

#

On top of all that, the Rust developer ecosystem is also not as chaotic as that of Javascript. One toolchain manager (`rustup`), one build tool, one official formatter and one linter — there's no decision fatigue over which of five tools to glue together before you can even write code.

## Are you willing to give Rust a try?

I know I haven't really covered all that Rust has to offer, but this article should be enough to get you started. If you're really serious about learning Rust in all its glory, I encourage you to take a look at [the Rust Book](https://doc.rust-lang.org/book/) — it's the best resource out there for getting started. You can also get your hands dirty with [Rustlings](https://rustlings.rust-lang.org/), which is packed with exercises that build up your skills in the core areas of the language.

So yeah — give Rust a shot. Yes, the borrow checker will fight you. Yes, you'll get into a few staring contests with the compiler and lose every single one at first. But here's the thing: that over-zealous compiler is the same one saving you from the 2am "why is this pointer null" debugging sessions you'd be having in other languages. Push through the first handful of `cannot borrow as mutable` tantrums, and one day it just _clicks_ — the errors start making sense, the code starts compiling, and before you know it you'll be part of the Rust degens defending the borrow checker in Twitter (X) arguments like the rest of us. Welcome to the cult. 🦀
