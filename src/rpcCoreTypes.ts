type FilterStartingWith<Set, Needle extends string> = Set extends `${Needle}${infer _X}` ? Set : never
type FilterNotStartingWith<Set, Needle extends string> = Set extends `${Needle}${infer _X}` ? never : Set

export type WithoutEvents<T> = FilterNotStartingWith<Extract<keyof T, string>, "on">