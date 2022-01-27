// Variables
let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector('.bullets');
let bulletSpanContainer = document.querySelector('.bullets .spans');
let quizArea = document.querySelector('.quiz-area ');
let answersArea = document.querySelector('.answers-area ');
let submitButton = document.querySelector('.submit-button');
let resultsContainer = document.querySelector('.results');
let countDownElement = document.querySelector(".countdown");
// set Options
let currentIndex=0
let rightAnswers=0
let countDownInterval;
// Call JSON File
function getQuestions(){
    let myReq = new XMLHttpRequest();
    myReq.onreadystatechange = function(){
        if(this.readyState === 4 && this.status===200){
            let questionsObject = JSON.parse(this.responseText)
            let questionsCount=questionsObject.length;

            // Create Bullets and set questions count
            createBullets(questionsCount);

            // Add data to questions
            addQData(questionsObject[currentIndex] , questionsCount);

            // Start CountDown
            countDown(5,questionsCount)
            // Click on submit to check answers
            submitButton.onclick = ()=>{
                // Get Right Answer
                let theRightAnswer = questionsObject[currentIndex].right_answer;
                // increase Index
                currentIndex++
                // Check ANswers
                checkAnswer(theRightAnswer , questionsCount);
                // Remove previous questions 
                quizArea.innerHTML='';
                answersArea.innerHTML='';
                // add the other questions
                addQData(questionsObject[currentIndex] , questionsCount);

                // handle bullets class
                handleBullets();
                
                // continue CountDown
                clearInterval(countDownInterval);
                countDown(5,questionsCount)
                // Show results
                showResults(questionsCount);
            };
        }
    }
    myReq.open("GET" , "htmlQuestions.json" , true);
    myReq.send()
}
getQuestions();
// fetch number of questions

function createBullets(num){
    countSpan.innerHTML = num;
    // create spans
    for(let i=0; i<num; i++){
        // create bullet
        let bullet = document.createElement("span");
        // Add on to first bullet
        if(i===0){
            bullet.className="on"
        }
        // Append bullet to Main bullet container
        bulletSpanContainer.appendChild(bullet);
    }
}
// create Questions and answers
function addQData(obj , count) {
    if(currentIndex < count){

        // create h2 questions title
        let Qtitle = document.createElement("h2");
        // Question text
        let Qtext = document.createTextNode(obj.title);
        // Appent text to title
        Qtitle.appendChild(Qtext);
        // Append title to quiz area 
        quizArea.appendChild(Qtitle);
        // Create Answers
        for(let i=1 ; i<=4 ; i++ ){
            // Main ANswer div
            let mainDiv = document.createElement("div")
            // Add class 
            mainDiv.className="answer";
            // create Radio Input 
            let radioInput = document.createElement("input");
            // Add type name id data-attribute
            radioInput.name="question";
            radioInput.type="radio";
            radioInput.id=`answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];
            // Make first label to be checked
            if(i===1){
                radioInput.checked=true;
            }
            // crete the label
            let label = document.createElement("label");
            // Add attribute
            label.htmlFor=`answer_${i}`;
            // create label text 
            let labelText = document.createTextNode(obj[`answer_${i}`]);
            // Add text to label 
            label.appendChild(labelText);
            // append input + label to main div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(label)
            // append main div to answer area
            answersArea.appendChild(mainDiv)
        }
    }
}
// Create function to check right answer
function checkAnswer(ranswer , count){
    // select by name attr
    let answers = document.getElementsByName("question");
    let chosenAns;
    for (let i = 0; i < answers.length; i++) {
        if(answers[i].checked){
            chosenAns = answers[i].dataset.answer;
        }
    }
    if (ranswer == chosenAns ) {
        rightAnswers++
    }

}

function handleBullets(){
    let bulletsSpan = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpan);
    arrayOfSpans.forEach((span,index)=>{
        if(currentIndex == index){
            span.className='on'
        }
    })
}
function showResults(count){
    let results;
    // After all questions finished and quiz area is empty
    if(currentIndex === count){
        // remove elements from dom
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if(rightAnswers > (count/2) && rightAnswers < count){
            results = `<span class="good"> Good </span> ,
            ${rightAnswers} from ${count} Is Good
            `
        }
        else if (rightAnswers === count){
            results = `<span class="perfect"> Perfect </span> ,
            All Answers is Good
            `        
        }
        else{
            results = `<span class="bad"> Bad </span> ,
            ${rightAnswers} from ${count} you wanna to practice more
            `
        }
        resultsContainer.innerHTML = results;
        resultsContainer.style.padding="10px";
        resultsContainer.style.backgroundColor="white";
        resultsContainer.style.marginTop="10px"
    }
}

// make count down
function countDown(duration , count) {  
    if(currentIndex < count){
        let min , sec;
        countDownInterval=setInterval(() => {
            min = parseInt(duration/60);
            sec = parseInt(duration % 60 );

            min = min < 10 ? `0${min}`: min;
            sec = sec < 10 ? `0${sec}`: sec;

            countDownElement.innerHTML = `${min}:${sec}`

            if(--duration < 0){
                clearInterval(countDownInterval);
                submitButton.click();
            }

        }, 1000);
    }
}

// Tasks
// 