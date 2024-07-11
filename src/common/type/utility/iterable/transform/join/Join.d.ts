declare type Join<A, Separator extends string = string> = Joinable<A> extends false
  ? never
  : IsArrayful<A> extends false
    ? string
    : Extract<
      Flat<A>,
      stringful
    > extends never
      ? Extract<
        Flat<A>,
        | number
        | boolean
      > extends never
        ? literalful<Flat<A>> extends never
          ? IsLongTupleful<A> extends false
            ? string
            : literalful<Separator> extends never
              ? Separator extends stringful
                ? stringful
                :
                  | string
                  | stringful
              : stringful
          : stringful
        : stringful
      : Exclude<
        Flat<A>,
        stringful
      > extends never
        ? Flat<A>
        : stringful;
