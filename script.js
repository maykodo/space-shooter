const yourShip = document.querySelector(".player-shooter")
const playArea = document.querySelector("#main-play-area")
const alienImg = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png']
const startButton = document.querySelector('.start-button')
const instructionsText = document.querySelector('.game-instruction')
let alienInterval

//movimento do personagem
function flyShip(event) {
    if(event.key === 'ArrowUp') {
        event.preventDefault()
        moveUp()
    } else if(event.key === 'ArrowDown'){
        event.preventDefault()
        moveDown()
    } else if( event.key === ' '){
        event.preventDefault()
        fireLaser()
    }
}

//funcao movimento do personagem para cima
function moveUp() {
    let topPosition =  getComputedStyle(yourShip).getPropertyValue("top")
    if(topPosition === "0px") {
        return 
    } else {
        let position = parseInt(topPosition)
        position -= 50
        yourShip.style.top = `${position}px`
    }
}

//funcao movimento do personagem para baixo
function moveDown() {
    let topPosition =  getComputedStyle(yourShip).getPropertyValue("top")
    if(topPosition >= "540px") {
        return 
    } else {
        let position = parseInt(topPosition)
        position += 50
        yourShip.style.top = `${position}px`
    }
}

//funcao de tiro do personagem
function fireLaser() {
    let laser = createLaserElement()
    playArea.appendChild(laser)
    moveLaser(laser) 
}

// funcao de criar tiro do personagem
function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'))
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'))
    let newLaser = document.createElement('img')
    
    newLaser.src = 'img/shoot.png'
    newLaser.classList.add('laser')
    newLaser.style.left = `${xPosition}px`
    newLaser.style.top = `${yPosition -10}px`
    return newLaser
}

//funcao de movimentar tiro do personagem
function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left)
        let aliens = document.querySelectorAll('.alien')

        aliens.forEach((alien) => {
            if(checkLaserCollision(laser, alien)) {
                aliens.src ='img/explosion.png'
                alien.classList.remove('alien')
                alien.classList.add('dead-alien')
            }
        })

        if(xPosition === 340) {
            laser.remove()
        } else {
            laser.style.left = `${xPosition + 8}px`
        }
    }, 10)
}

//criar inimigos
function createAliens() {
    let newAliens = document.createElement('img')
    let alienSprite = alienImg[Math.floor(Math.random() * alienImg.length)]

    newAliens.src = alienSprite
    newAliens.classList.add("alien")
    newAliens.classList.add("alien-transition")
    newAliens.style.left = '370px'
    newAliens.style.top = `${Math.floor(Math.random() * 330) + 30}px`

    playArea.appendChild(newAliens)
    moveAlien(newAliens)
}

//funcao movimentar inimigos
function moveAlien(alien) {
    let moveAlienInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'))
        if( xPosition <= 50) {
            if( Array.from(alien.classList).includes('dead-alien')) {
                alien.remove()
            }else {
                gameOver()
            }
        }else {
            alien.style.left = `${xPosition - 4}px`
        }
    }, 30)
}

//funcao para colisao
function checkLaserCollision(laser, alien) {
    let laserTop = parseInt(laser.style.top)
    let laserLeft = parseInt(laser.style.left)
    
    let alienTop = parseInt(alien.style.top)
    let alienLeft = parseInt(alien.style.left)
    let alienBotton = alienTop - 30

    if(laserLeft != 340 && laserLeft + 40 >= alienLeft) {
        if(laserTop <= alienTop && laserTop >= alienBotton) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

startButton.addEventListener('click', (event) => {
    playGame()
})

//funcao iniciar o jogo
function playGame() {
    startButton.style.display = 'none'
    instructionsText.style.display = 'none'
    window.addEventListener('keydown', flyShip)
    alienInterval = setInterval(() => {
        createAliens()
    }, 2000)
}


//funcao fim de jogo
function gameOver() {
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    setTimeout(() => {
        alert('game over!');
        yourShip.style.top = "250px";
        startButton.style.display = "block";
        instructionsText.style.display = "block";
    });
}

