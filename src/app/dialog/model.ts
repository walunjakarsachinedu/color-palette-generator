export type User = { 
  name: string, 
  email: string, 
  img: string, 
  tag?: string 
};

export type ColorPalette = { 
  variation: string, 
  color: string, 
  resolvedValue?: string 
  isCopied?: boolean
}