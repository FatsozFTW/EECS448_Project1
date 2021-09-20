const model = 
{
    /**
     * variable in charge of the storing of the user input for the number of ships they want to play with
     * @member promptVar
     * @type {number}
     */
    promptVar: 0,

    /**
     * placement counter is in charge of the what ship is being place in the set up phase
     * @member placementCounter
     * @type {number}
     */
    placementCounter: 0,

    /**
     * variable in charge of which player is setting piece/attacking
     * @member player
     * @type {number}
     */
    player: 0,

    /**
     * Variable used to store the players misses bassed on whose turn it is
     * @member playerMisses
     * @type {number}
     */
    playerMisses: null,

    /**
     * Variable used to store the misses for player 1
     * @member missesP1
     * @type {array}
     */
    missesP1: [],

    /**
     * Variable use to store the misses for player 2
     * @member missesP2
     * @type {array}
     */
    missesP2: [],

    /**
     * Variable used to store the players ships based on whose turn it is
     * @member playerShips
     * @type {number}
     */
    playerShips: null,

    /**
     * Variable used to store the ships for player 1
     * @member shipsP1
     * @type {array}
     */
    shipsP1: [],

    /**
     * Variable used to store the ships for player 1
     * @member shipsP2
     * @type {array}
     */
    shipsP2: [],

    /**
     * Variable used to store the game state 
     * @member gameState
     * @type {number}
     */
    gameState: 0,

    /**
     * Pushed items is used to check the boundaries when placing a ship
     * @member pushedItems
     * @type {number}
     */
    pushedItems: 0,

    /**
     * Box clicked is used to display the orientation when a box is clicked and to store which box is clicked on the left board
     * @member boxClicked
     * @type {number}
     */
    boxClicked: -1,

    /**
     * box clicked is used to store which box is clicked on the left board
     * @member boxClickedRight
     * @type {number}
     */
    boxClickedRight: -1,

    /**
     * Variable store the type of running the fire function before attacking
     * @member shipType
     * @type {number}
     */
    shipType: 0,

    /**
     * This keeps track of the steps during the game phase
     * @member firstGamePhase
     * @type {number}
     */
    firstGamePhase: 0,

    /**
     * counts the misses in order to run display the misses
     * @member missCount
     * @type {number}
     */
    missCount: 0,

    /**
     * variable used to determine the winner of the game
     * @member winnerCount
     * @type {number}
     */
    winnerCount: 0,

    /**
     * Variable used to check if the user made an error
     * @member error
     * @type {boolean}
     */
    error: 0,

    /**
     * variable used to determine the winner
     * @member winner
     * @type {number}
     */
    winner: 0,

    /**
     * This function is a function in charge of setup
     * 
     * @function setupPhase
     * @pre once the pages has been loaded
     * @post creates the button to start placing ships and then runs the prompt to see how many ships the user wants to play with
     */
    setupPhase: function()
    {
        let button = document.createElement("button")
        button.innerText = "Click here to start placing pieces"
        button.setAttribute('data-button', 0)
        button.addEventListener('click', () =>
        {
            //runs the prompt
            model.runPrompt()
            if(model.player == 0)
            {
                document.querySelector(".Title").remove()
                view.body.querySelector("button").remove()
                model.turnFunc()
            }
        })
        view.body.appendChild(button)
            
        
    },

    /**
     * This functions is in charge of setup phase text function
     * 
     * @function turnFunc
     * @see setupPhaseText
     * @pre none
     * @post updates the placement counter and calls the setup phase text function
     */
    turnFunc: function()
    {
        model.gameState = 1
        model.placementCounter += 1
        view.setupPhaseText()

        
    },

    /**
     * This function runs the prompt to choose the amount of ships
     * 
     * @function runPrompt
     * @pre the setup phase starts
     * @post prompts the user to chose a number between 1 and 6 for the amount of ships they want to place then store that in promptVar
     */
    runPrompt: function()
    {
        let correct = 0
        do 
        {
            model.promptVar = prompt("How many ships do you want to play with! (Minimum: 1, Maximum: 6")
            if(model.promptVar >= 1 && model.promptVar <= 6)
            {
                correct = 1 
                for(let i=0; i<model.promptVar; i++)
                {   
                    model.shipsP1.push({location: [], hits: [], shipType: i+1})
                    model.shipsP2.push({location: [], hits: [], shipType: i+1})
                }
                model.playerShips = model.shipsP1
                model.playerMisses = model.missesP1
            }
        } while(correct == 0)
    },

    /**
     * This function changes turns
     * 
     * @function changeTurn
     * @pre none
     * @post changes the playerShips and playerMisses to the correct arrays based on what the player variable is
     */
    changeTurn: function ()
    {
        if(model.player == 1)
        {
            model.player = 0
            model.shipsP2 = model.playerShips
            model.playerShips = model.shipsP1
            model.missesP2 = model.playerMisses
            model.playerMisses = model.missesP1
        }
        else
        {
            model.player = 1
            model.shipsP1 = model.playerShips
            model.playerShips = model.shipsP2
            model.missesP1 = model.playerMisses
            model.playerMisses = model.missesP2
        }
    },

    /**
     * This function updates the locations of ships and returns a boolean
     * 
     * @function updateLocation
     * @pre once a spot and orientation is selected and the user hits the submit button
     * @post updates the location of the ship based on the spot and orientation the user selects. Return true if the placement was allow and false if not
     * @returns {boolean}
     */
    updateLocation: function()
    {
        if(model.placementCounter == 1)
        {
            model.playerShips[model.placementCounter-1].location.push(model.boxClicked)
            console.log(model.playerShips)
            return true
        }
        else
        {     
            if(view.userOrientSelected == 0)
            {
                var tempVar  = -10
            }
            else if(view.userOrientSelected == 1)
            {
                var tempVar = 1
            }
            else if(view.userOrientSelected == 2)
            {
                var tempVar = 10
            }
            else if(view.userOrientSelected == 3)
            {
                var tempVar = -1
            }

            for(let i=0; i<model.placementCounter; i++)
            {
                if(model.checkBounds() && model.checkOverlap())
                {
                    model.playerShips[model.placementCounter-1].location.push(model.boxClicked)
                    console.log(model.playerShips)
                    model.pushedItems += 1
                    model.boxClicked = model.boxClicked+tempVar
                }
                else
                {
                    alert("The ship you just tried to place is out of bounds or overlapping with and existing ship, please try again")
                    model.playerShips[model.placementCounter-1].location = []
                    model.pushedItems = 0
                    return false
                }  
            }
            return true

        }
    },

    /**
     * This function returns a boolean if the ships orientation is okay
     * 
     * @function checkBounds
     * @pre the update location function runs
     * @post checks if the ship is going to fit on the board based on what you click and the orientation you select. Returns true if the ship is in bounds and false if not
     * @returns {boolean}
     */
    checkBounds: function()
    {
        if(model.boxClicked < 0 || model.boxClicked > 89)
        {
            return false
        }
        else
        {   
            if(view.userOrientSelected == 0)
            {
                var tempVar = model.boxClicked < 10
            }
            else if(view.userOrientSelected == 1)
            {
                var tempVar = model.boxClicked % 10 == 9
            }
            else if(view.userOrientSelected == 2)
            {
                var tempVar = model.boxClicked > 80
            }
            else
            {
                var tempVar = model.boxClicked % 10 == 0
            }

            if(tempVar)
            {   
                if(model.pushedItems == model.placementCounter-1)
                {
                    return true
                }
                else
                {
                    return false
                }
            }
            else
            {
                return true
            }
        }
        
    },

    /**
     * This function checks for overlaps
     * 
     * @function checkOverlap
     * @pre the update location function runs
     * @post checks to make sure that the ship the user is placing doesn't overlap with the ships already placed. Returns false if it does overlap and returns true if not
     * @returns {boolean}
     */
    checkOverlap: function ()
    {
        for(let i=0; i<model.promptVar; i++)
        {
            for(let j =0; j<model.promptVar; j++)
            {
                if(model.playerShips[i].location[j] == model.boxClicked)
                {
                    return false
                }
            }
        }
        return true
    },

    /**
     * This function uses other functions to change turns and display
     * 
     * @function gamePhase
     * @see changeTurn
     * @see displayGamePhase
     * @pre the setup phase finished
     * @post changes the turn and calls the display game phase function
     */
    gamePhase: function()
    {
        model.changeTurn()
        view.displayGamePhase()
    },

    /**
     * This function "fires" at the spot chosen and uses other functions to see if the place has already been hit
     * 
     * @function fire
     * @see checkMissAlready
     * @see checkHitAlready
     * @pre the user selects a spot to attack and hits the next turn button
     * @post checks if the user has already hit the spot and then checks if there is a valid hit and if it is miss
     */
    fire: function ()
    {
        if(model.shipType!=-1 && model.checkHitAlready())
        {
            model.playerShips[model.shipType-1].hits.push(model.boxClickedRight)
            model.firstGamePhase = 2
            model.error = 0
        }
        else if(model.shipType != -1)
        {
            alert("You have already hit this location")
            model.firstGamePhase = 1
            model.gameState = 2
            model.error = 1
        }
        else if(model.checkMissAlready())
        {
            //miss
            model.playerMisses.push(model.boxClickedRight)
            model.missCount +=1
            model.firstGamePhase = 2
            model.error = 0
        }
        else
        {
            alert("You have already missed at this location")
            model.firstGamePhase = 1
            model.gameState = 2
            model.error = 1
        }
        model.shipType = -1
    },

    /**
     * This function checks if the spot has already been hit
     * 
     * @function checkHitAlready
     * @pre fire functions runs
     * @post checks if the spot the user chose has been hit already and if not it will return true and if it has it will return false
     * @returns {boolean}
     */
    checkHitAlready: function ()
    {
        for(let i = 0; i<model.promptVar; i++)
        {
            for(let j = 0; j< model.promptVar; j++)
            {
                if(model.playerShips[i].hits[j] == model.boxClickedRight)
                {
                    return false
                }
            }
        }
        return true
    },

    /**
     * This function checks if the user has missed already
     * 
     * @function checkMissAlready
     * @pre fire function runs
     * @post check to see if the user has missed already and if not the function will return true and if it has it will return false
     * @returns {boolean}
     */
    checkMissAlready: function ()
    {
        for(let i=0; i < model.missCount; i++)
        {
            if(model.playerMisses[i] == model.boxClickedRight)
            {
                return false
            }
        }
        return true
    },

    /**
     * This function checks if the ships overlap
     * 
     * @function extractShipType
     * @pre the update location function runs
     * @post checks to make sure that the ship the user is placing doesn't overlap with the ships already placed
     */
    extractShipType: function ()
    {
        for(let i = 0; i<model.promptVar; i++)
        {
            for(let j = 0; j< model.promptVar; j++)
            {
                if(model.playerShips[i].location[j]+100 == model.boxClickedRight)
                {
                    model.shipType =  i+1
                    return
                }
                else
                {
                    model.shipType = -1
                }
            }
        }
    },

    /**
     * This function checks for a winner
     * 
     * @function checkWinner
     * @pre none
     * @post checks to determine if they is a winner after each turn. Returns true if there is a winner and false if there isn't one
     * @returns {boolean}
     */
    checkWinner: function()
    {
        for(let i=0; i<model.promptVar; i++)
        {
            for(let j =0; j<model.promptVar; j++)
            {
                let temp = model.playerShips[i].hits[j]
                if(temp != null)
                {
                    view.sunkCount += 1
                    view.sunkArr.push(temp)
                    if(view.sunkCount == i+1)
                    {
                        model.winnerCount += 1
                    }  
                }
            }
            view.sunkCount = 0
            view.sunkArr = []
        }
        model.changeTurn()
        if(model.winnerCount == model.promptVar)
        {
            model.winner = model.player
            return true
        }
        model.winnerCount = 0
        for(let i=0; i<model.promptVar; i++)
        {
            for(let j =0; j<model.promptVar; j++)
            {
                let temp = model.playerShips[i].hits[j]
                if(temp != null)
                {
                    view.sunkCount += 1
                    view.sunkArr.push(temp)
                    if(view.sunkCount == i+1)
                    {
                        if(view.sunkCount == i+1)
                        {
                            model.winnerCount += 1
                        }  
                    }  
                }
            }
            view.sunkCount = 0
            view.sunkArr = []
        }
        model.changeTurn()
        if(model.winnerCount == model.promptVar)
        {
            model.winner = model.player
            return true
        }
        model.winnerCount = 0
        return false
    }

}