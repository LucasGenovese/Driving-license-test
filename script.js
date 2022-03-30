const startButton = document.getElementById('start-btn') // constante con acceso al boton start
const nextButton = document.getElementById('next-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question') //constante con acceso al espacio donde se encuentra la pregunta en pantalla
const answerButtonsElement = document.getElementById('answer-buttons') // constante con acceso a los botones de respuestas
const finalScore = document.getElementById('score')
const answerPicture = document.getElementById('imageid')

var questionSetIndex = 0, sorted = false, currentSetQuestionIndex = 0
let shuffledQuestions, currentQuestionIndex, currentScore


function questionSets(questionSetIndex, callback) {
    fetch("setofquestions"+ questionSetIndex +".json") // si puedo hacer que sume el 0 voy a poder pasar por todos los sets de preguntas
      .then(response => response.json())
      .then(result => callback(result));
}

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
    currentSetQuestionIndex++
    currentQuestionIndex++
    if (currentQuestionIndex % 5 == 0){ // cada cuantas preguntas va a cambiar el set de preguntas (cada 5)
        currentSetQuestionIndex = 0 
        questionSetIndex++
        sorted = false
    }
    questionSets(questionSetIndex,callback)	
})

function callback(questions) {
    if (sorted == false){ // randomiza una sola vez el arreglo y asi no se repiten las preguntas
        shuffledQuestions = questions.sort(() => Math.random() - .5)
        sorted = true
    } 
    setNextQuestion()
}

function startGame() {
    answerPicture.classList.remove('hide') // inicialmente muestro el espacio para las fotos pero despus en showquestion se ubican las fotos o no 
    startButton.classList.add('hide') // escondo el boton una vez que lo clickeo
    finalScore.classList.add('hide') // escondo el score ni bien arranco el programa 
    questionSetIndex = 0
    currentQuestionIndex = 0
    currentScore = 0
    sorted = false
    questionContainerElement.classList.remove('hide') // muestro los botones y preguntas
    questionSets(questionSetIndex,callback);
}

function setNextQuestion() {
    resetState()
    showQuestion(shuffledQuestions[currentSetQuestionIndex]) // tengo que reiniciar el currentQuestionIndex porque esta buscando la pregunta 12 cuando solo hay 11
}

function showQuestion(question) { // le paso una pregunta del vector de preguntas
    questionElement.innerText = question.question

    //haciendo esto agrego la imagen
    if (question.picture == '//'){
        answerPicture.classList.add('hide')
    } else {
        answerPicture.classList.remove('hide')
    }

    answerPicture.src = question.picture
    
    question.answers.forEach(answer => { // por cada respuesta dentro de la pregunta crea un boton
        const button = document.createElement('button')
        button.innerText = answer.text
        button.classList.add('btn')
        if (answer.correct) { // si la respuesta es correcta le asigna al boton que es correcto
            button.dataset.correct = answer.correct
        }
        button.addEventListener('click', selectAnswer)
        answerButtonsElement.appendChild(button) // agrega los botones correspondientes a las respuestas
    })
}

function resetState() {
    clearStatusClass(document.body)
    nextButton.classList.add('hide')
    answerButtonsElement.classList.remove('hide') // vuelvo a mostrar los botones con las respuestas una vez reinicio el cuestionario
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild)
    }
}

function selectAnswer(e) {
    const selectedButton = e.target // dice cual es la respuesta seleccionada
    const correct = selectedButton.dataset.correct // dice si la respuesta es correcta
    setStatusClass(document.body, correct)
    calculateScore(correct)
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct)
    })

    if (30 > currentQuestionIndex + 1) { // le puedo cambiar el shuffledQuestions.length a la cantidad de preguntas que quiero tener
        nextButton.classList.remove('hide')
    } else {
        questionElement.innerText = "Fin del cuestionario" // le agrego el texto fin del cuestionario al finalizar en el espacio donde iban las preguntas
        answerPicture.classList.add('hide') // escondo el espacio para las fotos cuando termina el programa
        answerButtonsElement.classList.add('hide') // oculto los botones con las respuestas
        finalScore.classList.remove('hide') // muesto el score 
        var finalPorcentage = currentScore*100/30
        finalScore.innerText = finalPorcentage.toFixed(1) + "% de respuestas correctas" // muestro el score en pantalla
        startButton.innerText = 'Reiniciar'
        startButton.classList.remove('hide')
    }

}

function calculateScore(correct){ // calcula el score final en base a si se toco el boton correcto e inhabilita los botones una vez seleccionada la respuesta
    if (correct){
        currentScore++
        Array.from(answerButtonsElement.children).forEach(button =>{ // inhabilita los botones para que no se pueda cambiar de respuesta
            button.disabled = true
        })
    } else {
        Array.from(answerButtonsElement.children).forEach(button =>{
            button.disabled = true
        })
    }
}

function setStatusClass(element, correct) {
    clearStatusClass(element)
    if (correct) { // pone en verde la o las respuesta que era correcta
        element.classList.add('correct')
    } else { // pone en rojo la o las respuestas incorrectas
        element.classList.add('wrong')
  }
}

function clearStatusClass(element) {
    element.classList.remove('correct')
    element.classList.remove('wrong')
}
