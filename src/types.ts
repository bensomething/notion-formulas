enum Filter {
    All = "all",
  }
  
  interface Example {
    id: string;
    title: string;
    example: string;
    categories: string[]
  }
  
  export { Filter };
  export type { Example };