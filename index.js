startGame(16, 16, 40)


const startButton = document.querySelector('.start_button')
startButton.disabled = false

startButton.addEventListener('click', () => location.reload())


function startGame(sWidth, sHeight, sBomb_сount) {

    const field = document.querySelector('.field')
    const cellsCount = sWidth * sHeight
    field.innerHTML = `<button></button>`.repeat(cellsCount)
    const cells = [...field.children]
    const flagsIndex = []
    const smile = document.querySelector('.smile')
    const timer = document.querySelector('.timer')
    const mines = document.querySelector('.mines')

    let closedCount = cellsCount
    let flagCount = 0
    const bombs = [...Array(cellsCount).keys()]
        .sort(() => Math.random() - 0.5)
        .slice(0, sBomb_сount)

    mines.innerHTML = sBomb_сount

    smile.addEventListener('click', () => location.reload())
    timer.value = 0
    const getTimer = setInterval(() => {
        timer.innerHTML = timer.value++
    }, 1000)
    field.addEventListener('mousedown', (event) => {
        if (event.button === 0) {
            smile.innerHTML = `<img src="./img/smile_frightened1.png" alt="">`
        }

    })
    field.addEventListener('mouseup', (event) => {
        if (event.button === 0) {
            smile.innerHTML = `<img src="./img/smile.png" alt="">`
            if (event.target.tagName !== 'BUTTON') {
                return
            }
            const index = cells.indexOf(event.target)
            const column = index % sWidth
            const row = Math.floor(index / sWidth)
            open(row, column)
        }



    })

    field.oncontextmenu = (e) => {
        e.preventDefault()
        if (e.target.tagName !== 'BUTTON') {
            return
        }
        const indexF = cells.indexOf(e.target)
        const columnF = indexF % sWidth
        const rowF = Math.floor(indexF / sWidth)
        sendFlag(rowF, columnF)
    }

    function sendFlag(row, column) {
        if (!isValid(row, column)) return
        const indexF = row * sWidth + column
        const cellF = cells[indexF]

        if (!cellF.classList.contains('tile--checked') && cellF.disabled !== true) {
            if (!cellF.classList.contains('tile--flagged') && !cellF.classList.contains('tile--question')) {
                cellF.innerHTML = '🚩';
                cellF.classList.add('tile--flagged');
            } else if (cellF.classList.contains('tile--flagged') && !cellF.classList.contains('tile--question')) {
                cellF.innerHTML = '?';
                cellF.classList.remove('tile--flagged');
                cellF.classList.add('tile--question')
            } else if (cellF.classList.contains('tile--question')) {
                cellF.innerHTML = ' '
                cellF.classList.remove('tile--question')
            }
        }
    }


    function open(row, column) {

        if (!isValid(row, column)) return

        const index = row * sWidth + column
        const cell = cells[index]

        if (cell.disabled === true) return

        cell.disabled = true

        if (isBomb(row, column)) {
            for (let i = 0; i <= cells.length; i++) {
                for (let j = 0; j <= bombs.length; j++) {
                    if (i === bombs[j]) {
                        cells[i].innerHTML = '<img src="./img/Minesweeper.png" alt=" ">'
                        cells[i].disabled = true
                    }
                }
            }
            smile.innerHTML = '<img src="./img/smile_lose1.png" alt="">'
            setTimeout(() => {
                alert('You lose try again...')
            }, 1500)
            clearInterval(getTimer)
            timer.value = 0
            for (let i = 0; i <= cells.length; i++) {
                cells[i].disabled = true
            }
            return
        }

        closedCount--

        if (closedCount <= sBomb_сount) {
            clearInterval(getTimer)
            timer.value = 0
            smile.innerHTML = '<img src="./img/smile_win.png" alt="">'
            setTimeout(() => {
                alert('You win!')
            }, 1500)
            return
        }

        const count = getCount(row, column)

        if (count !== 0) {
            if (count === 1) {
                cell.style.color = '#0000ff'
                cell.innerHTML = count
            }
            if (count === 2) {
                cell.style.color = '#008000'
                cell.innerHTML = count
            }
            if (count === 3) {
                cell.style.color = '#ff0000'
                cell.innerHTML = count
            }
            if (count === 4) {
                cell.style.color = '#000080'
                cell.innerHTML = count
            }
            if (count === 5) {
                cell.style.color = '#800000'
                cell.innerHTML = count
            }
            if (count === 6) {
                cell.style.color = '#008080'
                cell.innerHTML = count
            }
            if (count === 7) {
                cell.style.color = '#000000'
                cell.innerHTML = count
            }
            if (count === 8) {
                cell.style.color = '#808080'
                cell.innerHTML = count
            }

            return
        }

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                open(row + y, column + x)
            }
        }

    }

    function isValid(row, column) {
        return row >= 0
            && row < sHeight
            && column >= 0
            && column < sWidth
    }

    function getCount(row, column) {
        let count = 0

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (isBomb(row + y, column + x)) {
                    count++
                }
            }
        }
        return count
    }

    function isBomb(row, column) {
        if (!isValid(row, column)) return false

        const index = row * sWidth + column

        return bombs.includes(index)
    }
}