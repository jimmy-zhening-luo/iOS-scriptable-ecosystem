declare type List<
  K extends string,
  Optional extends
  | K
  | boolean = false
  ,
> = IProperty<
  string[]
  ,
  K
  ,
  Optional
>;