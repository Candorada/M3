function Noise(){
  let intensity = 0.2
  return <svg style={{display:"none"}}>
  <defs>
    <filter id = "noise" x="0" y="0" width="100%" height="100%">
    <feTurbulence type = "fractalNoise" baseFrequency = "0.5,0.5"  numOctaves="1" seed = "0" result = "noise"/>
      <feColorMatrix in="noise" type="matrix" values="
          0.33 0.33 0.33 0 0
          0.33 0.33 0.33 0 0
          0.33 0.33 0.33 0 0
          0    0    0    1 0"
          result="colorShift" />
      <feComponentTransfer in="colorShift" result="scaledNoise">
      <feFuncR type="table" tableValues={`${0.5-intensity/2} ${0.5+intensity/2}`} />
        <feFuncG type="table" tableValues={`${0.5-intensity/2} ${0.5+intensity/2}`} />
        <feFuncB type="table" tableValues={`${0.5-intensity/2} ${0.5+intensity/2}`} />
      </feComponentTransfer>

      
      <feBlend in="SourceGraphic" in2="adjusted" mode="overlay" />
    </filter>
  </defs>
</svg>
}

export default Noise