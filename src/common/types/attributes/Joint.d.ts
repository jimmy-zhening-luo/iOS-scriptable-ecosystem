declare const joined: unique symbol;

type Joined<A> = { [joined]: A };

declare type Joint<
  Outer extends stringful,
  Inner extends stringful,
  Ful extends boolean = false,
> = Ful extends true
  ? Outer & Joined<Arrayful<Inner>>
  : string & Joined<Inner[]>;
