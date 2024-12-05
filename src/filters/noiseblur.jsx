function NoiseBlur(){
  let intensity = 0.2
  return <svg style={{display:"none"}}>
  <defs>
    <filter id = "noiseBlur" x="0" y="0" width="100%" height="100%">
    <feTurbulence type = "fractalNoise" baseFrequency = "0.5,0.5"  numOctaves="1" seed = "0" result = "noise"/>
    <feDisplacementMap in="SourceGraphic" in2 = "noise" scale = "0.1"/>
    </filter>
  </defs>
</svg>
}

export default NoiseBlur