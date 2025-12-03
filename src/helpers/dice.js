const beefedUpDice = (dice) => {
    const count = dice.length
    const rows = [dice.slice(0,Math.ceil(count / 2)), dice.slice(Math.ceil(count / 2),count)]
    const paddingX = 100
    const paddingY = 50
    const offsetTop = 700 
    const beefy = []
    rows.forEach((row, rIndex) => {
      row.forEach((die, dIndex) => {
        beefy.push({ 
          id: `${rIndex}-${dIndex}`,
          val: die, 
          position: { 
            x: paddingX + (dIndex / (row.length + 1)) * 1000, 
            y: offsetTop + paddingY + (rIndex / (rows.length + 1)) * 300  
          },
          // awake is used to ignore dies that are inert - don't animate them in the onframe loop
          awake: false
        })
      })
    })
    return beefy
  }

  export { beefedUpDice }